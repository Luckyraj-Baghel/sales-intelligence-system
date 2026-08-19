const fs = require('fs');

const totalCustomers = 60;
const totalSalespersons = 16;
const totalRegions = 4;

const catalog = [
  { id: 1, price: 99999.00 },
  { id: 2, price: 28500.00 },
  { id: 3, price: 4500.00 },
  { id: 4, price: 2200.00 },
  { id: 5, price: 14500.00 },
  { id: 6, price: 24000.00 },
  { id: 7, price: 850.00 },
  { id: 8, price: 450.00 },
  { id: 9, price: 19999.00 },
  { id: 10, price: 3200.00 }
];

let csv = 'customer_id,region_id,salesperson_id,order_date,product_id,quantity,unit_price\n';

for (let i = 0; i < 1500; i++) {
  // Inject exactly 15 intentional malformed rows (1%) for Ingestion Audit test
  const injectInvalid = i % 100 === 0;

  let customerId = Math.floor(Math.random() * totalCustomers) + 1;
  let regionId = Math.floor(Math.random() * totalRegions) + 1;
  let salespersonId = Math.floor(Math.random() * totalSalespersons) + 1;
  let prod = catalog[Math.floor(Math.random() * catalog.length)];
  let quantity = Math.floor(Math.random() * 4) + 1;
  let unitPrice = prod.price;

  let month = String(Math.floor(Math.random() * 8) + 1).padStart(2, '0');
  let day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  let orderDate = `2026-${month}-${day}`;

  if (injectInvalid) {
    quantity = -1; // Intentionally invalid to test audit isolation
  }

  csv += `${customerId},${regionId},${salespersonId},${orderDate},${prod.id},${quantity},${unitPrice}\n`;
}

fs.writeFileSync('large_sales_stress_dataset.csv', csv);
console.log('✅ Generated 1,500 stress records in large_sales_stress_dataset.csv');