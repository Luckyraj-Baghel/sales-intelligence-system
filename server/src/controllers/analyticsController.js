const AnalyticsService = require('../services/analyticsService');

// Overview Dashboard Endpoint
exports.getDashboardSummary = async (req, res) => {
  try {
    const { startDate, endDate, regionId, categoryId } = req.query;
    const filters = { startDate, endDate, regionId, categoryId };

    const [
      kpis,
      trends,
      regionalSales,
      allProducts,
      allCustomers,
      filterOptions
    ] = await Promise.all([
      AnalyticsService.getOverviewKPIs(filters),
      AnalyticsService.getRevenueTrends(filters),
      AnalyticsService.getSalesTeamAnalytics(),
      AnalyticsService.getProductAnalytics(),
      AnalyticsService.getCustomerAnalytics(),
      AnalyticsService.getFilterOptions()
    ]);

    // Top 5 Products by Revenue
    const topProducts = (allProducts || []).slice(0, 5);
    // Top 5 High-Value Customers
    const topCustomers = (allCustomers || []).slice(0, 5);

    // Calculate Category Distribution
    const categoryTotals = {};
    let grandTotal = 0;
    (allProducts || []).forEach((p) => {
      const rev = Number(p.gross_revenue) || 0;
      grandTotal += rev;
      categoryTotals[p.category_name] = (categoryTotals[p.category_name] || 0) + rev;
    });

    const categoryShare = Object.keys(categoryTotals).map((catName) => ({
      category_name: catName,
      total_revenue: categoryTotals[catName],
      revenue_share_pct: grandTotal > 0 ? Number(((categoryTotals[catName] / grandTotal) * 100).toFixed(1)) : 0
    }));

    // Regional Summary for Bar Chart
    const regionTotals = {};
    (regionalSales || []).forEach((item) => {
      const rev = Number(item.total_revenue_generated) || 0;
      regionTotals[item.region_name] = (regionTotals[item.region_name] || 0) + rev;
    });
    const regionalChartData = Object.keys(regionTotals).map((regName) => ({
      region_name: regName,
      total_revenue: regionTotals[regName]
    }));

    res.status(200).json({
      status: 'success',
      data: {
        kpis,
        trends,
        regionalSales: regionalChartData,
        topProducts,
        topCustomers,
        categoryShare,
        filters: filterOptions
      }
    });
  } catch (error) {
    console.error('Dashboard Controller Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch dashboard summary' });
  }
};

// Dedicated Product Analytics Endpoint
exports.getProductDeepDive = async (req, res) => {
  try {
    const data = await AnalyticsService.getProductAnalytics();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Dedicated Customer Analytics Endpoint
exports.getCustomerDeepDive = async (req, res) => {
  try {
    const data = await AnalyticsService.getCustomerAnalytics();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Dedicated Sales Team Endpoint
exports.getSalesTeamDeepDive = async (req, res) => {
  try {
    const data = await AnalyticsService.getSalesTeamAnalytics();
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};