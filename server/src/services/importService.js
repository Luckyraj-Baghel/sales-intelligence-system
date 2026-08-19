const fs = require('fs');
const csv = require('csv-parser');
const db = require('../config/db');

class ImportService {
  static async processSalesCSV(filePath) {
    const validRows = [];
    const rejectedRows = [];
    let rowNumber = 1;

    // Fetch valid IDs from database
    const [custRes, regRes, spRes, prodRes] = await Promise.all([
      db.query('SELECT id FROM customers'),
      db.query('SELECT id FROM regions'),
      db.query('SELECT id FROM salespersons'),
      db.query('SELECT id, unit_price FROM products')
    ]);

    const validCustomerIds = new Set(custRes.rows.map((r) => Number(r.id)));
    const validRegionIds = new Set(regRes.rows.map((r) => Number(r.id)));
    const validSalespersonIds = new Set(spRes.rows.map((r) => Number(r.id)));
    const validProductMap = new Map(prodRes.rows.map((r) => [Number(r.id), parseFloat(r.unit_price)]));

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          rowNumber++;
          const customerId = parseInt(row.customer_id, 10);
          const regionId = parseInt(row.region_id, 10);
          const salespersonId = row.salesperson_id ? parseInt(row.salesperson_id, 10) : null;
          const orderDate = row.order_date ? row.order_date.trim() : null;
          const productId = parseInt(row.product_id, 10);
          const quantity = parseInt(row.quantity, 10);
          const unitPrice = parseFloat(row.unit_price);

          const errors = [];

          if (!customerId || isNaN(customerId) || !validCustomerIds.has(customerId)) {
            errors.push(`Invalid customer_id: ${row.customer_id}`);
          }
          if (!regionId || isNaN(regionId) || !validRegionIds.has(regionId)) {
            errors.push(`Invalid region_id: ${row.region_id}`);
          }
          if (salespersonId && !validSalespersonIds.has(salespersonId)) {
            errors.push(`Invalid salesperson_id: ${row.salesperson_id}`);
          }
          if (!productId || isNaN(productId) || !validProductMap.has(productId)) {
            errors.push(`Invalid product_id: ${row.product_id}`);
          }
          if (!orderDate || isNaN(Date.parse(orderDate))) {
            errors.push('Invalid order_date (YYYY-MM-DD)');
          }
          if (isNaN(quantity) || quantity <= 0) {
            errors.push('Quantity must be > 0');
          }
          if (isNaN(unitPrice) || unitPrice < 0) {
            errors.push('Unit price must be >= 0');
          }

          if (errors.length > 0) {
            rejectedRows.push({ row: rowNumber, reasons: errors });
          } else {
            validRows.push({
              customerId,
              regionId,
              salespersonId,
              orderDate,
              productId,
              quantity,
              unitPrice,
              subtotal: quantity * unitPrice,
            });
          }
        })
        .on('end', async () => {
          try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          } catch (_) {}

          if (validRows.length === 0) {
            return resolve({
              importedCount: 0,
              rejectedCount: rejectedRows.length,
              rejectedRows,
              message: 'No valid records found in file.',
            });
          }

          try {
            await db.query('BEGIN');

            const batchSize = 150;
            for (let i = 0; i < validRows.length; i += batchSize) {
              const batch = validRows.slice(i, i + batchSize);

              // 1. Multi-Row INSERT into Orders
              const orderPlaceholders = [];
              const orderParams = [];
              batch.forEach((r, idx) => {
                const offset = idx * 5;
                orderPlaceholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, 'completed')`);
                orderParams.push(r.customerId, r.regionId, r.salespersonId, r.orderDate, r.subtotal);
              });

              const orderRes = await db.query(
                `INSERT INTO orders (customer_id, region_id, salesperson_id, order_date, total_amount, status)
                 VALUES ${orderPlaceholders.join(', ')} RETURNING id;`,
                orderParams
              );

              const orderIds = orderRes.rows.map((o) => o.id);

              // 2. Multi-Row INSERT into Order Items
              const itemPlaceholders = [];
              const itemParams = [];
              batch.forEach((r, idx) => {
                const offset = idx * 5;
                const oId = orderIds[idx];
                itemPlaceholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`);
                itemParams.push(oId, r.productId, r.quantity, r.unitPrice, r.subtotal);
              });

              await db.query(
                `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
                 VALUES ${itemPlaceholders.join(', ')};`,
                itemParams
              );
            }

            await db.query('COMMIT');
            console.log(`[CSV INGESTION] Committed ${validRows.length} records successfully.`);

            resolve({
              importedCount: validRows.length,
              rejectedCount: rejectedRows.length,
              rejectedRows: rejectedRows.slice(0, 30),
              message: `Transaction committed successfully. Ingested ${validRows.length} rows.`,
            });
          } catch (dbErr) {
            await db.query('ROLLBACK');
            console.error('[CSV INGESTION DB ERROR]', dbErr);
            reject(new Error(dbErr.message || 'Database transaction failed'));
          }
        })
        .on('error', (err) => {
          console.error('[CSV STREAM ERROR]', err);
          reject(err);
        });
    });
  }
}

module.exports = ImportService;