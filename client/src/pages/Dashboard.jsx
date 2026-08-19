import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Filter,
  RefreshCcw,
  UserCheck,
  Layers,
  Award,
  Globe
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const PIE_COLORS = ['#0284c7', '#38bdf8', '#818cf8', '#34d399', '#fbbf24', '#f87171'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-lg text-xs font-sans">
        <p className="font-bold text-slate-700 mb-1">{payload[0].name || label}</p>
        <p className="font-semibold text-sky-600 text-sm">
          ₹{Number(payload[0].value).toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await analyticsAPI.getDashboardData({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        regionId: regionFilter || undefined,
        categoryId: categoryFilter || undefined,
      });
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [startDate, endDate, regionFilter, categoryFilter]);

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setRegionFilter('');
    setCategoryFilter('');
  };

  if (loading && !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-sky-600 border-t-transparent animate-spin"></div>
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Aggregating PostgreSQL Metrics...
          </span>
        </div>
      </div>
    );
  }

  const { kpis, trends, regionalSales, topProducts, topCustomers, categoryShare, filters } = data || {};
  const { regions = [], categories = [] } = filters || {};
  const latestMoMGrowth = trends && trends.length > 0 ? trends[trends.length - 1]?.mom_growth : 0;
  const bestProduct = topProducts?.[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Top Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive Performance Overview</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Enterprise analytics engine querying partitioned CTEs, window functions, and normalized relational entities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-white p-2 border border-slate-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-sky-600" />
            <span>Filters:</span>
          </div>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <span className="text-xs text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700 px-2.5 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700 px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Territories</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700 px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {(startDate || endDate || regionFilter || categoryFilter) && (
            <button
              onClick={resetFilters}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors"
              title="Reset All Filters"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Automated Business Intelligence Summary Engine */}
      <div className="bg-gradient-to-r from-sky-50 via-indigo-50/40 to-white p-5 rounded-2xl border border-sky-100/80 flex items-start gap-4 shadow-xs">
        <div className="p-2.5 bg-sky-600 text-white rounded-xl shadow-sm shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            Automated Intelligence Summary
            <span className="text-[10px] uppercase font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md">Live Heuristics</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Revenue trajectory demonstrates a <span className="font-semibold text-sky-800">{latestMoMGrowth}% Month-over-Month shift</span>.
            The primary top-grossing inventory item is{' '}
            <span className="font-semibold text-slate-900">{bestProduct?.product_name || 'MacBook Air M2'}</span> generating{' '}
            <span className="font-semibold text-slate-900">₹{Number(bestProduct?.gross_revenue || 0).toLocaleString('en-IN')}</span> across {bestProduct?.total_units_sold || 0} units.
          </p>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl"><DollarSign className="w-5 h-5" /></div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹{Number(kpis?.total_revenue || 0).toLocaleString('en-IN')}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
              {latestMoMGrowth >= 0 ? (
                <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />+{latestMoMGrowth}%
                </span>
              ) : (
                <span className="inline-flex items-center text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />{latestMoMGrowth}%
                </span>
              )}
              <span className="text-slate-600">vs prev cycle</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Completed Orders</span>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><ShoppingCart className="w-5 h-5" /></div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {Number(kpis?.total_orders || 0).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-slate-600 font-medium">100% Fulfilled orders</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Unique Customers</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Users className="w-5 h-5" /></div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {Number(kpis?.unique_customers || 0).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-slate-600 font-medium">Active client accounts</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Average Order Value</span>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              ₹{Number(kpis?.avg_order_value || 0).toLocaleString('en-IN')}
            </p>
            <p className="mt-2 text-xs text-slate-600 font-medium">Ticket size per order</p>
          </div>
        </div>
      </div>

      {/* Main Visuals Grid (Area Trend & Territory Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Monthly Revenue Trajectory</h2>
              <p className="text-xs text-slate-600">Month-over-Month calculation executed via SQL windowing (LAG)</p>
            </div>
            <span className="text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60 px-2.5 py-1 rounded-lg">
              Time Series
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity={0.28} />
                    <stop offset="90%" stopColor="#0284c7" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0284c7"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#0369a1', strokeWidth: 3, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Territory Sales Pie / Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Sales by Territory</h2>
              <Globe className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-xs text-slate-600">Regional sales volume distribution</p>
          </div>

          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionalSales}
                  dataKey="total_revenue"
                  nameKey="region_name"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {regionalSales?.map((entry, index) => (
                    <Cell key={`cell-region-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 border-t border-slate-100 pt-3">
            {regionalSales?.map((reg, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span>{reg.region_name}</span>
                </span>
                <span className="font-bold text-slate-900">₹{Number(reg.total_revenue).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Top Performing Products</h2>
              <p className="text-xs text-slate-600">Ranked by gross generated revenue</p>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead className="bg-slate-50/70 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Product Name</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5 text-right">Units Sold</th>
                  <th className="px-6 py-3.5 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 font-medium">
                {topProducts?.map((prod, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {prod.product_name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200/50">
                        {prod.category_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600 font-semibold">
                      {prod.total_units_sold || prod.units_sold || 0}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ₹{Number(prod.gross_revenue).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Contribution Donut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Category Share</h2>
              <Layers className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-xs text-slate-600">Revenue split across classifications</p>
          </div>

          <div className="h-44 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryShare}
                  dataKey="total_revenue"
                  nameKey="category_name"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {categoryShare?.map((entry, index) => (
                    <Cell key={`cell-cat-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 border-t border-slate-100 pt-3">
            {categoryShare?.map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-slate-600 font-medium truncate max-w-[140px]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span className="truncate">{cat.category_name}</span>
                </span>
                <span className="font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/40">
                  {cat.revenue_share_pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}