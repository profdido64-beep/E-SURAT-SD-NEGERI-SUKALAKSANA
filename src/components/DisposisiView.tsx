import React, { useState } from 'react';
import {
  GitPullRequest,
  Plus,
  Search,
  Clock,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Send,
  User,
  Building,
  CheckSquare,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { Disposition, LetterIn } from '../types';

interface DisposisiViewProps {
  dispositions: Disposition[];
  lettersIn: LetterIn[];
  onOpenCreateModal: () => void;
  onOpenPrintModal: (disp: Disposition) => void;
  onUpdateStatus: (dispId: string, newStatus: 'Belum Ditindaklanjuti' | 'Sedang Diproses' | 'Selesai', actionTaken?: string) => void;
}

export const DisposisiView: React.FC<DisposisiViewProps> = ({
  dispositions,
  lettersIn,
  onOpenCreateModal,
  onOpenPrintModal,
  onUpdateStatus,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeModalAction, setActiveModalAction] = useState<Disposition | null>(null);
  const [actionReport, setActionReport] = useState('');

  const filtered = dispositions.filter((d) => {
    const matchSearch =
      d.letterInAgenda.toLowerCase().includes(search.toLowerCase()) ||
      d.letterInSubject.toLowerCase().includes(search.toLowerCase()) ||
      d.toDepartmentName.toLowerCase().includes(search.toLowerCase()) ||
      d.instruction.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === 'ALL' || d.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Sedang Diproses':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const handleCompleteAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalAction) return;
    onUpdateStatus(activeModalAction.id, 'Selesai', actionReport || 'Instruksi telah diselesaikan dan dilaporkan ke pimpinan.');
    setActiveModalAction(null);
    setActionReport('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-600 text-white rounded-xl">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Lembar Disposisi Elektronik</h2>
              <p className="text-xs text-slate-500">
                Pendelegasian instruksi tindak lanjut dari Kepala Sekolah kepada unit kerja
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-amber-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Terbitkan Disposisi Baru</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari agenda, instruksi, unit penerima..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Status Tindak Lanjut:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="Belum Ditindaklanjuti">Belum Ditindaklanjuti</option>
            <option value="Sedang Diproses">Sedang Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Dispositions Cards / List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((disp) => (
            <div
              key={disp.id}
              className={`p-5 rounded-2xl border bg-white shadow-xs transition ${
                disp.isPriority ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-mono font-bold rounded-md">
                    {disp.letterInAgenda}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    Asal: {disp.letterInOrigin}
                  </span>
                  {disp.isPriority && (
                    <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold uppercase rounded-md">
                      Prioritas Segera
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(
                      disp.status
                    )}`}
                  >
                    {disp.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-rose-600 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Batas: {disp.deadlineDate} (Mendekati Deadline)
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="py-3.5 space-y-2">
                <p className="text-xs font-semibold text-slate-800">
                  Perihal: {disp.letterInSubject}
                </p>

                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs">
                  <div className="text-amber-950 font-bold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Instruksi {disp.fromUserName} ({disp.fromRole}):</span>
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    "{disp.instruction}"
                  </p>
                </div>

                {disp.actionTaken && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <span className="font-bold text-emerald-900">Laporan Penyelesaian: </span>
                    <span className="text-emerald-800">{disp.actionTaken}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Tujuan: <strong className="text-slate-700">{disp.toDepartmentName}</strong>
                  </span>
                  {disp.toUserName && (
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Pelaksana: {disp.toUserName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenPrintModal(disp)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Lembar</span>
                  </button>

                  {disp.status !== 'Selesai' && (
                    <>
                      {disp.status === 'Belum Ditindaklanjuti' && (
                        <button
                          onClick={() => onUpdateStatus(disp.id, 'Sedang Diproses')}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg transition"
                        >
                          Mulai Proses
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setActiveModalAction(disp);
                          setActionReport('');
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selesaikan Disposisi</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
            Tidak ada lembar disposisi yang ditemukan.
          </div>
        )}
      </div>

      {/* Selesaikan Disposisi Modal */}
      {activeModalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">
              Laporan Penyelesaian Disposisi
            </h3>
            <p className="text-xs text-slate-600">
              Disposisi untuk agenda <strong>{activeModalAction.letterInAgenda}</strong> ({activeModalAction.toDepartmentName})
            </p>

            <form onSubmit={handleCompleteAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uraian Tindakan / Hasil Pelaksanaan: *
                </label>
                <textarea
                  rows={3}
                  value={actionReport}
                  onChange={(e) => setActionReport(e.target.value)}
                  placeholder="Contoh: Sudah dihadiri dan materi ANBK telah disosialisasikan ke tim proktor laboratorium."
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalAction(null)}
                  className="px-3 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition"
                >
                  Tandai Selesai & Laporkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
