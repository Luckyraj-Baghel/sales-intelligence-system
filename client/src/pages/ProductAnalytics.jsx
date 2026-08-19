import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import { Package, TrendingUp, Award, Layers, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductAnalytics() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await analyticsAPI.getProductAnalytics();
        setProducts(res.data.data || []);
      } catch (err) {
        console.error('Failed to load product analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['ALL', ...new Set(products.map((p) => p.category_name))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.product_name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const chartData = products.slice(0, 6).map((p) => ({
    name: p.product_name.length > 15 ? p.product_name.substring(0, 14) + '...' : p.product_name,
    revenue: p.gross_revenue,
  }));

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-slate-600 font-semibold animate-pulse text-sm">Computing Product Metrics...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Product Performance & Ranking</h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Deep dive into item-level profitability, unit volume, and intra-category rankings computed via PostgreSQL <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700 font-mono text-xs">DENSE_RANK()</code>.
        </p>
      </div>

      {/* Top Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">Top Revenue Drivers</h2>
        <p className="text-xs text-slate-600 mb-4">Highest grossing inventory items across all catalog segments</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Gross Revenue']} />
              <Bar dataKey="revenue" fill="#0284c7" radius={[6, 6, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search product by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-slate-50/80 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Category Rank</th>
                <th className="px-6 py-4 text-right">Unit Price</th>
                <th className="px-6 py-4 text-right">Units Sold</th>
                <th className="px-6 py-4 text-right">Gross Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-600" />
                    {p.product_name}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600">{p.category_name}</td>
                  <td className="px-6 py-3.5 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded font-bold ${
                      p.category_rank === 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      #{p.category_rank}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-medium text-slate-600">
                    ₹{Number(p.unit_price).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-slate-800">{p.total_units_sold}</td>
                  <td className="px-6 py-3.5 text-right font-bold text-slate-900">
                    ₹{Number(p.gross_revenue).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}