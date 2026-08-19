const { Client } = require('pg');
require('dotenv').config();

async function seedCompleteMasterData() {
  console.log('--- EXECUTING LOCK-FREE MASTER SEEDING ---');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL...');

    await client.query('BEGIN');

    // 1. Delete rows without ACCESS EXCLUSIVE table locks (Deadlock Proof)
    await client.query(`
      DELETE FROM order_items;
      DELETE FROM orders;
      DELETE FROM products;
      DELETE FROM categories;
      DELETE FROM salespersons;
      DELETE FROM customers;
    `);

    // 2. Insert 4 Categories with Explicit IDs
    await client.query(`
      INSERT INTO categories (id, name, description) VALUES
      (1, 'Electronics & Computing', 'Workstation laptops, monitors, and compute hardware'),
      (2, 'Peripherals & Input', 'Keyboards, wireless mice, and adapter hubs'),
      (3, 'Office Furniture', 'Ergonomic chairs and height-adjustable desks'),
      (4, 'Office Essentials', 'Stationery, notebooks, and desk organizers')
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;
    `);

    // 3. Insert 10 Products with Explicit IDs
    await client.query(`
      INSERT INTO products (id, name, category_id, unit_price) VALUES
      (1, 'MacBook Air M2', 1, 99999.00),
      (2, 'Dell UltraSharp 27" 4K Monitor', 1, 28500.00),
      (3, 'Mechanical Tenkeyless Keyboard', 2, 4500.00),
      (4, 'Wireless Ergonomic Mouse', 2, 2200.00),
      (5, 'Ergonomic Mesh Task Chair', 3, 14500.00),
      (6, 'Height Adjustable Dual-Motor Desk', 3, 24000.00),
      (7, 'Executive Leather Notebook Set', 4, 850.00),
      (8, 'Metal Desk Wire Organizer', 4, 450.00),
      (9, 'Sony ANC Wireless Headphones', 1, 19999.00),
      (10, 'USB-C 10-in-1 Dual Display Hub', 2, 3200.00)
      ON CONFLICT (id) DO UPDATE SET unit_price = EXCLUDED.unit_price;
    `);

    // 4. Ensure Regions Exist
    await client.query(`
      INSERT INTO regions (id, name, code) VALUES
      (1, 'North India', 'NR'),
      (2, 'South India', 'SR'),
      (3, 'East India', 'ER'),
      (4, 'West India', 'WR')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 5. Insert 16 Sales Representatives with Explicit IDs (1 to 16)
    const salesReps = [
      [1, 'Rohan Sharma', 'rohan.sharma@salesintel.com', 1],
      [2, 'Aarav Verma', 'aarav.verma@salesintel.com', 1],
      [3, 'Kavita Nair', 'kavita.nair@salesintel.com', 1],
      [4, 'Siddharth Rao', 'siddharth.rao@salesintel.com', 1],
      [5, 'Ananya Iyer', 'ananya.iyer@salesintel.com', 2],
      [6, 'Deepak Menon', 'deepak.menon@salesintel.com', 2],
      [7, 'Meera Swaminathan', 'meera.s@salesintel.com', 2],
      [8, 'Karthik Sundaram', 'karthik.s@salesintel.com', 2],
      [9, 'Vikram Ghosh', 'vikram.ghosh@salesintel.com', 3],
      [10, 'Debashish Roy', 'debashish.roy@salesintel.com', 3],
      [11, 'Pooja Banerjee', 'pooja.b@salesintel.com', 3],
      [12, 'Arindam Sen', 'arindam.sen@salesintel.com', 3],
      [13, 'Neha Patel', 'neha.patel@salesintel.com', 4],
      [14, 'Manish Mehta', 'manish.mehta@salesintel.com', 4],
      [15, 'Tanvi Deshmukh', 'tanvi.d@salesintel.com', 4],
      [16, 'Harsh Joshi', 'harsh.joshi@salesintel.com', 4]
    ];

    for (const rep of salesReps) {
      await client.query(
        'INSERT INTO salespersons (id, name, email, region_id) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
        rep
      );
    }

    // 6. Insert 60 Enterprise Customers with Explicit IDs (1 to 60)
    const customerNames = [
      'Reliance Digital Retail', 'Tata Consultancy Systems', 'Infosys Tech Hub', 'HDFC Enterprise Corp',
      'Wipro Digital Labs', 'Mahindra Tech Park', 'Zomato HQ Logistics', 'Swiggy Fleet Network',
      'Razorpay Payments', 'Zerodha FinTech', 'Paytm Core Systems', 'Flipkart Warehousing',
      'Delhivery Hub North', 'Nykaa Cosmetics Hub', 'Ola Mobility Labs', 'MakeMyTrip Corp',
      'PhonePe Infrastructure', 'Pine Labs Retail', 'Cred Financials', 'Groww Asset Management',
      'Urban Company Ops', 'Lenskart Tech Labs', 'Meesho Reseller Hub', 'Zepto Quick Logistics',
      'Blinkit Supply Chain', 'CitiusTech Health', 'Persistent Systems', 'L&T Infotech Division',
      'Tech Mahindra Central', 'Mindtree Enterprise', 'Adani Logistics Hub', 'Apollo Tech Health',
      'Fortis Care Systems', 'Titan Watch Divisions', 'FabIndia Lifestyle', 'Godrej Consumer Goods',
      'Asian Paints Supply', 'Pidilite Industries', 'Havells Electricals', 'Voltas Cool Systems',
      'Blue Star Logistics', 'Maruti Suzuki Tech', 'Bajaj Auto Enterprise', 'Hero MotoCorp Hub',
      'TVS Motor Network', 'Cipla Health Science', 'Sun Pharma Tech', 'Dr Reddys Labs',
      'Lupin Pharmaceuticals', 'Aurobindo Pharma', 'Biocon Biologics', 'Glenmark Research',
      'Torrent Pharma Hub', 'Alkem Laboratories', 'Divis Laboratories', 'Abbott India Ops',
      'Novartis Tech Centre', 'Sanofi Healthcare', 'Pfizer India Ops', 'GlaxoSmithKline Hub'
    ];

    for (let i = 0; i < customerNames.length; i++) {
      const id = i + 1;
      const name = customerNames[i];
      const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
      const email = `procurement@${domain}`;
      const phone = `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`;
      await client.query(
        'INSERT INTO customers (id, name, email, phone) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
        [id, name, email, phone]
      );
    }

    // 7. Sync auto-increment sequences
    await client.query(`
      SELECT setval(pg_get_serial_sequence('categories', 'id'), 4, true);
      SELECT setval(pg_get_serial_sequence('products', 'id'), 10, true);
      SELECT setval(pg_get_serial_sequence('salespersons', 'id'), 16, true);
      SELECT setval(pg_get_serial_sequence('customers', 'id'), 60, true);
    `);

    await client.query('COMMIT');
    console.log('🎉 ALL MASTER ENTITIES SEEDED INSTANTLY (IDs 1-60)!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding Error:', err.message);
  } finally {
    await client.end();
    process.exit(0);
  }
}

seedCompleteMasterData();