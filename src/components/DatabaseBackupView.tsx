import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Server,
  FileCode,
  Layers,
  CheckCircle2,
  Table as TableIcon,
  ShieldCheck
} from 'lucide-react';
import { databaseTables, sqlDdlScript } from '../data/databaseSchemaDocs';

interface DatabaseBackupViewProps {
  onOpenSchemaModal: () => void;
  allAppState: any;
}

export const DatabaseBackupView: React.FC<DatabaseBackupViewProps> = ({
  onOpenSchemaModal,
  allAppState,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadJsonBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allAppState, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `esurat_sekolah_backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleDownloadSql = () => {
    const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(sqlDdlScript);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `esurat_sekolah_schema_ddl.sql`);
    dlAnchorElem.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-600 text-white rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Backup Basis Data & Relasi Skema (ERD)</h2>
            <p className="text-xs text-slate-500">
              Pencadangan snapshot data, struktur tabel relasional, dan ekspor skema SQL
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSchemaModal}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/20"
        >
          <Layers className="w-4 h-4" />
          <span>Buka Skema ERD & MVC Detail</span>
        </button>
      </div>

      {/* Backup Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: JSON State Backup */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <Database className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                Semua Data
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800 mt-3">Backup Snapshot JSON</h3>
            <p className="text-xs text-slate-500 mt-1">
              Unduh seluruh data Surat Masuk, Surat Keluar, Disposisi, Template, dan User dalam 1 berkas.
            </p>
          </div>

          <button
            onClick={handleDownloadJsonBackup}
            className="w-full mt-4 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Tersimpan!' : 'Download Backup JSON'}</span>
          </button>
        </div>

        {/* Card 2: SQL DDL Script */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <FileCode className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                MySQL / Postgres
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800 mt-3">Ekspor Skema SQL DDL</h3>
            <p className="text-xs text-slate-500 mt-1">
              Unduh skrip `schema.sql` untuk membuat tabel database relasional pada server produksi.
            </p>
          </div>

          <button
            onClick={handleDownloadSql}
            className="w-full mt-4 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download DDL .SQL</span>
          </button>
        </div>

        {/* Card 3: Restore Simulation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                <Upload className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded">
                Auto Sync
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-800 mt-3">Reset / Pulihkan Data Awal</h3>
            <p className="text-xs text-slate-500 mt-1">
              Kembalikan seluruh data sampel persuratan sekolah ke kondisi default standar.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Kembalikan data ke kondisi default sampel sekolah?')) {
                localStorage.removeItem('esurat_state_v1');
                window.location.reload();
              }
            }}
            className="w-full mt-4 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data Sampel Default</span>
          </button>
        </div>
      </div>

      {/* Visual ERD Schema Relationship Map */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-blue-600" />
            Ringkasan 8 Tabel Basis Data Utama
          </h3>
          <span className="text-xs font-semibold text-slate-500">Relational Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {databaseTables.map((tbl) => (
            <div key={tbl.tableName} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-blue-700">`{tbl.tableName}`</span>
                <span className="text-[10px] text-slate-400">{tbl.fields.length} col</span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2">{tbl.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
