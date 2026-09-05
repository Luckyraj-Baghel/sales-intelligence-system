import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Bug #5 fix: pull login() from AuthContext so React user state is set after registration
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Create the account (role is always 'analyst' — Bug #2 fix)
      await authAPI.register({ name, email, password, role: 'analyst' });

      // Step 2: Sign in via AuthContext so setUser() is called and React state is correct
      // Bug #5 fix: never use window.location.href or bypass AuthContext
      const res = await login(email.trim(), password);
      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.message || 'Account created, but sign-in failed. Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xs border border-slate-200/80 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-sky-600 p-3 rounded-2xl text-white shadow-sm mb-3">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-600 mt-1">Get direct access to Sales Intelligence BI Platform</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium"
              placeholder="Aditya Sharma"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Corporate Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium"
              placeholder="aditya@enterprise.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium"
              placeholder="••••••••"
            />
          </div>

          {/* Bug #2 fix: Admin role removed — self-registration is analyst-only */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Platform Role
            </label>
            <div className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500 cursor-not-allowed">
              Business Analyst (default)
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Admin access is granted by an existing administrator.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register & Enter Portal'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 font-bold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}