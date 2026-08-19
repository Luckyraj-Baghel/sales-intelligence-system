import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import { Users, Crown, RefreshCcw, UserCheck, Mail, Calendar } from 'lucide-react';

export default function CustomerAnalytics() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await analyticsAPI.getCustomerAnalytics();
        setCustomers(res.data.data || []);
      } catch (err) {
        console.error('Failed to load customer analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-slate-600 font-semibold animate-pulse text-sm">Aggregating Customer Profiles...</div>
      </div>
    );
  }

  const vipCount = customers.filter((c) => c.segment === 'VIP Customer').length;
  const repeatCount = customers.filter((c) => c.segment === 'Repeat Buyer').length;
  const totalLTV = customers.reduce((acc, c) => acc + Number(c.total_spend || 0), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Customer Cohorts & Lifetime Value</h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Buyer segmentation based on purchase frequency, historical ticket value, and retention milestones.
        </p>
      </div>

      {/* Top Segmentation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Customer LTV</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">₹{totalLTV.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">VIP Tier ($\ge$3 Orders)</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{vipCount} Accounts</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Crown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Repeat Buyers</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{repeatCount} Accounts</p>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
            <RefreshCcw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Customer Roster & Spend Aggregations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-slate-50/80 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Cohort Tier</th>
                <th className="px-6 py-4 text-right">Orders Placed</th>
                <th className="px-6 py-4 text-right">Avg Order Ticket</th>
                <th className="px-6 py-4 text-right">Total Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sky-600" />
                    {c.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{c.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                      c.segment === 'VIP Customer'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : c.segment === 'Repeat Buyer'
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {c.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-800">{c.order_count}</td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    ₹{Number(c.avg_order_spend).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-right font-extrabold text-slate-900">
                    ₹{Number(c.total_spend).toLocaleString('en-IN')}
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