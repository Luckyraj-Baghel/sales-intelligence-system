import React, { useState } from 'react';
import { importAPI } from '../services/api';
import { UploadCloud, CheckCircle2, AlertTriangle, FileText, Loader2, ArrowRight, Table } from 'lucide-react';

export default function ImportSales() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await importAPI.uploadCSV(formData);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload CSV file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sales Data Ingestion Pipeline</h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload bulk transaction `.csv` records. Invalid rows (negative values, bad dates) are isolated while valid rows commit via PostgreSQL transactions.
        </p>
      </div>

      {/* Upload Box Card */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-slate-200 hover:border-sky-400 bg-slate-50/50 hover:bg-sky-50/30 rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer">
            <div className="h-14 w-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <UploadCloud className="w-7 h-7" />
            </div>

            <p className="text-base font-bold text-slate-800 text-center">
              {file ? file.name : 'Select or drop raw sales CSV file'}
            </p>
            <p className="text-xs text-slate-600 mt-1 text-center max-w-md">
              Expected headers: <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700 font-mono">customer_id, region_id, salesperson_id, order_date, product_id, quantity, unit_price</code>
            </p>

            <label className="mt-5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer shadow-xs transition-colors">
              Browse Local File
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Parsing Stream & Validating Foreign Keys...
              </>
            ) : (
              <>
                Process & Commit Ingestion Batch
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Ingestion Report Card */}
      {result && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ingestion Audit Summary</h2>
              <p className="text-xs text-slate-600">{result.message}</p>
            </div>
            <span className="text-xs font-bold uppercase bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
              Transaction Complete
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl flex items-center gap-4">
              <div className="h-10 w-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Imported Successfully</p>
                <p className="text-2xl font-extrabold text-emerald-900 mt-0.5">{result.importedCount} Records</p>
              </div>
            </div>

            <div className="p-5 bg-amber-50/70 border border-amber-200/70 rounded-xl flex items-center gap-4">
              <div className="h-10 w-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Rejected (Invalid Data)</p>
                <p className="text-2xl font-extrabold text-amber-900 mt-0.5">{result.rejectedCount} Rows</p>
              </div>
            </div>
          </div>

          {result.rejectedRows?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Rejection Logs</p>
              <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                {result.rejectedRows.map((rej, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/60 flex items-start gap-2">
                    <span className="font-bold text-rose-600 shrink-0">Line #{rej.row}:</span>
                    <span className="text-slate-600 font-medium">{rej.reasons.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}