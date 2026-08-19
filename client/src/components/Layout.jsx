import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  LogOut,
  TrendingUp,
  ShieldCheck,
  Package,
  Users,
  Briefcase,
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Executive Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Product Analytics', path: '/dashboard/products', icon: Package },
    { name: 'Customer Cohorts', path: '/dashboard/customers', icon: Users },
    { name: 'Sales Team', path: '/dashboard/sales-team', icon: Briefcase },
    { name: 'Executive Reports', path: '/dashboard/reports', icon: FileSpreadsheet },
    { name: 'CSV Ingestion', path: '/dashboard/import', icon: UploadCloud },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans">
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
            <div className="h-9 w-9 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base">SalesIntel</h1>
              <p className="text-[11px] text-slate-600 font-semibold uppercase">Enterprise BI</p>
            </div>
          </div>

          <div className="px-4 py-6">
            <p className="px-3 text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">Analytics Views</p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[11px] text-slate-600 truncate">{user?.email || 'admin@salesintel.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Sales Intelligence</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-900 capitalize">{location.pathname.replace('/', '') || 'Overview'}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            Role: <span className="uppercase font-bold">{user?.role || 'admin'}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}