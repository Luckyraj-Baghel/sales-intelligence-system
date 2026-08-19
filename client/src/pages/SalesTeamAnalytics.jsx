import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import { Briefcase, Trophy, Target, Globe } from 'lucide-react';

export default function SalesTeamAnalytics() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await analyticsAPI.getSalesTeamAnalytics();
        setTeam(res.data.data || []);
      } catch (err) {
        console.error('Failed to load team analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-slate-600 font-semibold animate-pulse text-sm">Evaluating Representative Records...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sales Representative Leaderboard</h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Account executive metrics, closed deal counts, and regional volume contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {team.map((rep, idx) => (
          <div key={rep.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  {rep.region_name} Region
                </span>
                {idx === 0 && <Trophy className="w-5 h-5 text-amber-500" />}
              </div>
              <h3 className="text-base font-bold text-slate-900">{rep.salesperson_name}</h3>
              <p className="text-xs text-slate-600 truncate">{rep.email}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-end">
              <div>
                <p className="text-[11px] font-bold text-slate-600 uppercase">Deals Closed</p>
                <p className="text-lg font-extrabold text-slate-900">{rep.deals_closed}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold text-slate-600 uppercase">Total Revenue</p>
                <p className="text-lg font-extrabold text-emerald-600">
                  ₹{Number(rep.total_revenue_generated).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}