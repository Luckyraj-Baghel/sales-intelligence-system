const db = require('../config/db');

class AnalyticsService {
  // 1. KPI Cards Overview with Dynamic Filters
  static async getOverviewKPIs(filters = {}) {
    const { startDate, endDate, regionId, categoryId } = filters;
    let query = `
      SELECT 
        COALESCE(SUM(oi.subtotal), 0)::FLOAT AS total_revenue,
        COUNT(DISTINCT o.id)::INT AS total_orders,
        COUNT(DISTINCT o.customer_id)::INT AS unique_customers,
        ROUND(COALESCE(AVG(o.total_amount), 0), 2)::FLOAT AS avg_order_value
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.status = 'completed'
    `;
    const params = [];

    if (startDate) {
      params.push(startDate);
      query += ` AND o.order_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND o.order_date <= $${params.length}`;
    }
    if (regionId) {
      params.push(regionId);
      query += ` AND o.region_id = $${params.length}`;
    }
    if (categoryId) {
      params.push(categoryId);
      query += ` AND p.category_id = $${params.length}`;
    }

    const { rows } = await db.query(query, params);
    return rows[0];
  }

  // 2. Revenue Trends with SQL LAG() Window Function
  static async getRevenueTrends(filters = {}) {
    const { regionId, categoryId } = filters;
    let filterClause = "WHERE o.status = 'completed'";
    const params = [];

    if (regionId) {
      params.push(regionId);
      filterClause += ` AND o.region_id = $${params.length}`;
    }
    if (categoryId) {
      params.push(categoryId);
      filterClause += ` AND p.category_id = $${params.length}`;
    }

    const query = `
      WITH MonthlySales AS (
        SELECT 
          DATE_TRUNC('month', o.order_date) AS sales_month,
          SUM(oi.subtotal)::FLOAT AS revenue,
          COUNT(DISTINCT o.id)::INT AS orders_count
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        ${filterClause}
        GROUP BY DATE_TRUNC('month', o.order_date)
      )
      SELECT 
        TO_CHAR(sales_month, 'Mon YYYY') AS month,
        revenue,
        orders_count,
        COALESCE(LAG(revenue, 1) OVER (ORDER BY sales_month), 0)::FLOAT AS prev_month_revenue,
        ROUND(
          ((revenue - LAG(revenue, 1) OVER (ORDER BY sales_month)) 
          / NULLIF(LAG(revenue, 1) OVER (ORDER BY sales_month), 0) * 100)::numeric, 
          2
        )::FLOAT AS mom_growth
      FROM MonthlySales
      ORDER BY sales_month;
    `;
    const { rows } = await db.query(query, params);
    return rows;
  }

  // 3. Product Deep Dive Analytics (Category Ranking + Units)
  static async getProductAnalytics() {
    const query = `
      WITH RankedProducts AS (
        SELECT 
          p.id,
          p.name AS product_name,
          c.name AS category_name,
          p.unit_price,
          COALESCE(SUM(oi.quantity), 0)::INT AS total_units_sold,
          COALESCE(SUM(oi.subtotal), 0)::FLOAT AS gross_revenue,
          DENSE_RANK() OVER (PARTITION BY c.id ORDER BY COALESCE(SUM(oi.subtotal), 0) DESC) as category_rank
        FROM products p
        JOIN categories c ON p.category_id = c.id
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id AND o.status = 'completed'
        GROUP BY p.id, p.name, c.id, c.name, p.unit_price
      )
      SELECT * FROM RankedProducts ORDER BY gross_revenue DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // 4. Customer Analytics (LTV, Order Frequency & Retention)
  static async getCustomerAnalytics() {
    const query = `
      SELECT 
        c.id,
        c.name,
        c.email,
        COUNT(DISTINCT o.id)::INT AS order_count,
        COALESCE(SUM(o.total_amount), 0)::FLOAT AS total_spend,
        ROUND(COALESCE(AVG(o.total_amount), 0), 2)::FLOAT AS avg_order_spend,
        MAX(o.order_date) AS last_order_date,
        CASE 
          WHEN COUNT(DISTINCT o.id) >= 3 THEN 'VIP Customer'
          WHEN COUNT(DISTINCT o.id) = 2 THEN 'Repeat Buyer'
          ELSE 'One-Time Buyer'
        END AS segment
      FROM customers c
      LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'completed'
      GROUP BY c.id, c.name, c.email
      ORDER BY total_spend DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // 5. Regional & Sales Rep Performance
  static async getSalesTeamAnalytics() {
    const query = `
      SELECT 
        sp.id,
        sp.name AS salesperson_name,
        sp.email,
        r.name AS region_name,
        COUNT(DISTINCT o.id)::INT AS deals_closed,
        COALESCE(SUM(o.total_amount), 0)::FLOAT AS total_revenue_generated
      FROM salespersons sp
      JOIN regions r ON sp.region_id = r.id
      LEFT JOIN orders o ON sp.id = o.salesperson_id AND o.status = 'completed'
      GROUP BY sp.id, sp.name, sp.email, r.name
      ORDER BY total_revenue_generated DESC;
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // 6. Master Filters Meta Data (Dropdowns ke liye)
  static async getFilterOptions() {
    const regions = await db.query('SELECT id, name, code FROM regions ORDER BY name');
    const categories = await db.query('SELECT id, name FROM categories ORDER BY name');
    return {
      regions: regions.rows,
      categories: categories.rows
    };
  }
}

module.exports = AnalyticsService;