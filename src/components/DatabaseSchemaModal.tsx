import React, { useState } from 'react';
import {
  Database,
  X,
  Copy,
  Check,
  Code2,
  Table as TableIcon,
  Layers,
  FileCode,
  Sparkles,
  Server,
  Share2,
  ArrowRight
} from 'lucide-react';
import {
  databaseTables,
  sqlDdlScript,
  laravelMigrationCode,
  architectureExplanation
} from '../data/databaseSchemaDocs';

interface DatabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSchemaModal: React.FC<DatabaseSchemaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'sql' | 'laravel' | 'architecture'>('tables');
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState(databaseTables[0].tableName);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentTableObj = databaseTables.find((t) => t.tableName === selectedTable) || databaseTables[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Skema Database & Arsitektur Aplikasi E-Surat Sekolah
              </h2>
              <p className="text-xs text-slate-400">
                Dokumentasi Blueprint ERD, Relasi Tabel, SQL DDL, Laravel Migration & Layered MVC
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 py-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('tables')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'tables'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Daftar 8 Tabel & Relasi</span>
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'sql'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>SQL DDL Script (MySQL/PostgreSQL)</span>
            </button>

            <button
              onClick={() => setActiveTab('laravel')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'laravel'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Laravel Migration</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'architecture'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Arsitektur & Tech Stack</span>
            </button>
          </div>

          <div className="py-2">
            {activeTab === 'sql' && (
              <button
                onClick={() => handleCopy(sqlDdlScript, 'sql')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition"
              >
                {copied === 'sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'sql' ? 'Tersalin!' : 'Salin SQL'}</span>
              </button>
            )}

            {activeTab === 'laravel' && (
              <button
                onClick={() => handleCopy(laravelMigrationCode, 'laravel')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition"
              >
                {copied === 'laravel' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'laravel' ? 'Tersalin!' : 'Salin Migration'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: TABLES EXPLORER */}
          {activeTab === 'tables' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Table List Sidebar */}
              <div className="md:col-span-4 space-y-1.5 border-r border-slate-200 pr-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Pilih Tabel Basis Data:
                </p>
                {databaseTables.map((t) => (
                  <button
                    key={t.tableName}
                    onClick={() => setSelectedTable(t.tableName)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition border flex items-center justify-between ${
                      selectedTable === t.tableName
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-mono text-sm font-bold text-slate-800">{t.tableName}</div>
                      <div className="text-[11px] text-slate-500 font-normal line-clamp-1">{t.comment}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-600 font-medium">
                      {t.fields.length} kolom
                    </span>
                  </button>
                ))}
              </div>

              {/* Table Detail */}
              <div className="md:col-span-8 space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-extrabold text-blue-700">
                      `{currentTableObj.tableName}`
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-semibold rounded">
                      InnoDB / Postgres Table
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{currentTableObj.comment}</p>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-3.5 py-2.5">Field / Kolom</th>
                        <th className="px-3.5 py-2.5">Tipe Data</th>
                        <th className="px-3.5 py-2.5">Key / Relasi</th>
                        <th className="px-3.5 py-2.5">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {currentTableObj.fields.map((f, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3.5 py-2.5 font-mono font-bold text-slate-800">
                            {f.name}
                            {!f.nullable && <span className="text-rose-500 ml-1" title="NOT NULL">*</span>}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-600 text-[11px]">
                            {f.type}
                          </td>
                          <td className="px-3.5 py-2.5">
                            {f.isPrimary && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                                PK (Primary)
                              </span>
                            )}
                            {f.isForeign && (
                              <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded" title={`Ref: ${f.references}`}>
                                FK → {f.references}
                              </span>
                            )}
                            {!f.isPrimary && !f.isForeign && (
                              <span className="text-[11px] text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-600 text-[11px]">
                            {f.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SQL DDL */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 text-xs flex items-center justify-between">
                <span>Skrip SQL DDL dapat langsung di-execute pada phpMyAdmin, MySQL Workbench, DBeaver, atau PostgreSQL.</span>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                {sqlDdlScript}
              </pre>
            </div>
          )}

          {/* TAB 3: LARAVEL MIGRATION */}
          {activeTab === 'laravel' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs">
                <span>Contoh kode Blueprint Migration siap salin untuk direktori <code>database/migrations/</code> pada proyek Laravel 11.x.</span>
              </div>
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
                {laravelMigrationCode}
              </pre>
            </div>
          )}

          {/* TAB 4: ARCHITECTURE & TECH STACK */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl">
                <h3 className="text-base font-bold">{architectureExplanation.title}</h3>
                <p className="text-xs text-blue-200 mt-1">
                  Pola Rancangan: <strong>{architectureExplanation.pattern}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {architectureExplanation.layers.map((layer, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <h4 className="font-bold text-slate-800 text-xs">{layer.name}</h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{layer.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
                  Rekomendasi Pilihan Tech Stack:
                </h4>
                <div className="space-y-3">
                  {architectureExplanation.techStackRecommendation.map((stack, idx) => (
                    <div key={idx} className="border-b border-slate-200 pb-2.5 last:border-none">
                      <p className="font-semibold text-slate-800 text-xs">{stack.role}:</p>
                      <ul className="mt-1 space-y-1 text-xs text-slate-600 list-disc list-inside">
                        {stack.options.map((opt, oIdx) => (
                          <li key={oIdx}>{opt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Sistem Informasi Manajemen Persuratan Sekolah Versi 2.5
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
