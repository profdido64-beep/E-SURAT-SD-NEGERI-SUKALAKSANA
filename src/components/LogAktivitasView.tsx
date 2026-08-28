import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Clock, User, Shield, Terminal } from 'lucide-react';
import { ActivityLog } from '../types';

interface LogAktivitasViewProps {
  logs: ActivityLog[];
}

export const LogAktivitasView: React.FC<LogAktivitasViewProps> = ({ logs }) => {
  const [search, setSearch] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.module.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-900 text-white rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Log Aktivitas & Audit Trail Sistem</h2>
            <p className="text-xs text-slate-500">
              Pencatatan rekam jejak digital setiap aksi create, update, approval, dan disposisi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span>Audit Trail Logging: Active</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari log pengguna, aksi, atau modul..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Waktu & Tanggal</th>
                <th className="px-4 py-3.5">Pengguna & Peran</th>
                <th className="px-3 py-3.5">Modul</th>
                <th className="px-3 py-3.5">Aksi</th>
                <th className="px-4 py-3.5">Rincian Aktivitas</th>
                <th className="px-3 py-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{log.userName}</div>
                    <span className="text-[10px] text-slate-500">{log.role}</span>
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap font-mono font-bold text-blue-700 text-[11px]">
                    {log.action}
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 max-w-[280px]">
                    {log.details}
                  </td>
                  <td className="px-3 py-3.5 whitespace-nowrap font-mono text-[11px] text-slate-400">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
