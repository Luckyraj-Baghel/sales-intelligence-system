import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Database, 
  ShieldCheck, 
  BarChart3, 
  UploadCloud, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Cpu,
  Zap,
  Lock,
  PieChart,
  Users,
  PackageCheck
} from 'lucide-react';

export default function Landing() {
  const systemCapabilities = [
    {
      icon: Database,
      title: 'Neon Serverless PostgreSQL (3NF)',
      desc: 'Normalized schema with primary foreign key constraints, composite index optimizations, and atomic ACID transaction lifecycles.'
    },
    {
      icon: Cpu,
      title: 'PostgreSQL Windowing & CTEs',
      desc: 'Complex aggregations powered by SQL LAG() for MoM trends and DENSE_RANK() for partition-level product ranking without Node.js RAM bloat.'
    },
    {
      icon: UploadCloud,
      title: 'Streamed Batch CSV Ingestion',
      desc: 'Node.js event stream parsing via Multer and csv-parser that isolates and logs invalid rows while safely committing multi-thousand bulk records.'
    },
    {
      icon: BarChart3,
      title: 'Multi-Dimensional Data Visualization',
      desc: 'Dynamic Recharts suite featuring interactive MoM growth area curves, territorial breakdown donuts, and real-time multi-filter queries.'
    },
    {
      icon: Users,
      title: 'Cohort & LTV Intelligence',
      desc: 'Automated customer classification engine separating enterprise accounts into VIP, Repeat, and Single-Purchase tiers based on order frequency.'
    },
    {
      icon: Lock,
      title: 'Enterprise Role-Based JWT Auth',
      desc: 'Secure stateless authentication with bcrypt password hashing, token validation middleware, and guarded frontend workspace routing.'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Raw Stream Ingestion',
      desc: 'Upload multi-thousand row transactional CSV logs. Stream processing ensures memory usage remains flat.'
    },
    {
      step: '02',
      title: 'Relational Integrity Audit',
      desc: 'Foreign keys, quantities, unit prices, and date ISO strings are validated before transaction staging.'
    },
    {
      step: '03',
      title: 'Atomic Database Commit',
      desc: 'Validated records are executed via PostgreSQL multi-row batch queries with complete rollback support.'
    },
    {
      step: '04',
      title: 'Dynamic SQL Intelligence',
      desc: 'CTEs and window functions compute real-time fiscal performance metrics, territory share, and leaderboards.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col justify-between">
      {/* Navigation Bar */}
      <header className="h-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">SalesIntel</span>
              <span className="ml-2 text-[10px] uppercase font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md border border-sky-200">
                Enterprise BI Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              Create Account
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200/80 rounded-full text-xs font-bold text-sky-700 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Full-Stack SQL Analytics & Stream Ingestion Pipeline</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Turn Raw Transaction Streams into Real-Time Sales Intelligence
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mt-6 leading-relaxed">
          Production-grade analytics platform built with PostgreSQL CTEs, Window Functions, streaming CSV ingestion, and interactive executive dashboards.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            to="/login"
            className="px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            Launch Executive Workspace
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl shadow-xs transition-all"
          >
            Register Analyst Access
          </Link>
        </div>

        {/* Live Metrics Showcase Banner */}
        <div className="mt-14 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-3 border-r border-slate-100">
            <p className="text-[11px] font-bold text-slate-600 uppercase">Architecture</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">3NF PostgreSQL</p>
          </div>
          <div className="p-3 border-r border-slate-100">
            <p className="text-[11px] font-bold text-slate-600 uppercase">Ingestion Engine</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">Stream Batch</p>
          </div>
          <div className="p-3 border-r border-slate-100">
            <p className="text-[11px] font-bold text-slate-600 uppercase">Windowing</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">LAG() & DENSE_RANK()</p>
          </div>
          <div className="p-3">
            <p className="text-[11px] font-bold text-slate-600 uppercase">Security</p>
            <p className="text-sm font-extrabold text-slate-900 mt-0.5">Stateless JWT</p>
          </div>
        </div>
      </section>

      {/* Ingestion & Processing Workflow */}
      <section className="max-w-7xl mx-auto px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">End-to-End Data Pipeline</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">From unvalidated CSV stream to sub-second analytical reporting</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {workflowSteps.map((ws, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <span className="text-2xl font-black text-sky-600/30">{ws.step}</span>
              <h3 className="text-sm font-bold text-slate-900 mt-2 mb-1.5">{ws.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{ws.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Architectural Capabilities */}
      <section className="max-w-7xl mx-auto px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Enterprise Feature Matrix</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Engineered for data accuracy, high throughput, and zero downtime</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemCapabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="h-10 w-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-4 border border-sky-100">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{cap.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{cap.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-8 py-12 w-full">
        <div className="bg-gradient-to-r from-sky-600 to-sky-700 rounded-3xl p-10 text-white text-center shadow-lg shadow-sky-600/10">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Explore Sales Analytics?</h2>
          <p className="text-sky-100 text-xs sm:text-sm max-w-xl mx-auto mt-2">
            Access multi-dimensional executive dashboards, product performance rankings, and customer cohorts.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Sign In to Portal
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-sky-800/60 hover:bg-sky-800 text-white font-bold text-xs rounded-xl border border-sky-500/50 transition-colors"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-medium">
          <p>© 2026 SalesIntel Analytics Platform. Enterprise Grade.</p>
          <div className="flex gap-6">
            <span>Neon Cloud PostgreSQL</span>
            <span>REST API</span>
            <span>React + Recharts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}