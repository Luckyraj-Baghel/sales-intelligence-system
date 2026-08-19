import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import { FileText, Download, Printer, Filter, CheckCircle2 } from 'lucide-react';

export default function Reports() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await analyticsAPI.getDashboardData();
        setDashboardData(res.data.data);
      } catch (err) {
        console.error('Failed to load report data', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!dashboardData?.topProducts) return;
    const headers = 'Product Name,Category,Units Sold,Gross Revenue\n';
    const rows = dashboardData.topProducts
      .map((p) => `"${p.product_name}","${p.category_name}",${p.units_sold},${p.gross_revenue}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-slate-600 font-semibold animate-pulse text-sm">Generating Fiscal Audit Report...</div>
      </div>
    );
  }

  const { kpis, topProducts, regionalSales, categoryShare } = dashboardData || {};

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive Business Report</h1>
          <p className="text-xs text-slate-600 mt-1">Consolidated fiscal performance summary for executive sign-off.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-[11px] font-bold text-slate-600 uppercase">Gross Revenue</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">₹{Number(kpis?.total_revenue || 0).toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-600 uppercase">Total Orders</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{kpis?.total_orders || 0}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-600 uppercase">Unique Clients</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{kpis?.unique_customers || 0}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-slate-600 uppercase">Avg Order Value</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">₹{Number(kpis?.avg_order_value || 0).toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Top Products Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Inventory Revenue Contribution</h2>
        </div>
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-right">Units Sold</th>
              <th className="px-6 py-3 text-right">Gross Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topProducts?.map((p, idx) => (
              <tr key={idx}>
                <td className="px-6 py-3.5 font-bold text-slate-900">{p.product_name}</td>
                <td className="px-6 py-3.5 text-slate-600">{p.category_name}</td>
                <td className="px-6 py-3.5 text-right text-slate-700">{p.units_sold}</td>
                <td className="px-6 py-3.5 text-right font-bold text-slate-900">
                  ₹{Number(p.gross_revenue).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}