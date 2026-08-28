import React, { useState } from 'react';
import {
  FileUp,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Printer,
  Send,
  Archive,
  Trash2,
  Calendar,
  Building,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { LetterOut, LetterCategory, User } from '../types';

interface SuratKeluarViewProps {
  letters: LetterOut[];
  categories: LetterCategory[];
  currentUser: User;
  onOpenBuatModal: () => void;
  onOpenPreview: (letter: LetterOut) => void;
  onUpdateApproval: (letterId: string, status: 'Disetujui' | 'Ditolak', notes?: string) => void;
  onArchiveLetter: (letterId: string) => void;
  onDeleteLetter: (letterId: string) => void;
}

export const SuratKeluarView: React.FC<SuratKeluarViewProps> = ({
  letters,
  categories,
  currentUser,
  onOpenBuatModal,
  onOpenPreview,
  onUpdateApproval,
  onArchiveLetter,
  onDeleteLetter,
}) => {
  const [search, setSearch] = useState('');
  const [selectedApproval, setSelectedApproval] = useState('ALL');

  const filteredLetters = letters.filter((l) => {
    const matchSearch =
      l.letterNumber.toLowerCase().includes(search.toLowerCase()) ||
      l.destination.toLowerCase().includes(search.toLowerCase()) ||
      l.subject.toLowerCase().includes(search.toLowerCase());

    const matchApproval = selectedApproval === 'ALL' || l.approvalStatus === selectedApproval;

    return matchSearch && matchApproval;
  });

  const isPrincipal = currentUser.role === 'Kepala Sekolah' || currentUser.role === 'Administrator';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Manajemen Surat Keluar Kedinasan</h2>
              <p className="text-xs text-slate-500">
                Penerbitan surat keluar resmi sekolah, verifikasi approval kepala sekolah, & arsip
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenBuatModal}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Surat Keluar Baru</span>
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
            placeholder="Cari nomor surat, tujuan instansi, perihal..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Status Approval:</span>
          <select
            value={selectedApproval}
            onChange={(e) => setSelectedApproval(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none"
          >
            <option value="ALL">Semua Approval</option>
            <option value="Draft">Draft</option>
            <option value="Diajukan">Diajukan</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Nomor & Tanggal</th>
                <th className="px-4 py-3.5">Tujuan Surat</th>
                <th className="px-4 py-3.5">Perihal</th>
                <th className="px-3 py-3.5">Bagian Pengusul</th>
                <th className="px-3 py-3.5">Status Approval</th>
                <th className="px-3 py-3.5">Status Kirim</th>
                <th className="px-4 py-3.5 text-right">Aksi & Approval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLetters.length > 0 ? (
                filteredLetters.map((letter) => (
                  <tr key={letter.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-emerald-700 text-sm">
                        {letter.letterNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {letter.letterDate}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 max-w-[180px]">
                      <div className="font-semibold text-slate-900">{letter.destination}</div>
                    </td>

                    <td className="px-4 py-3.5 max-w-[240px]">
                      <div className="font-medium text-slate-800 line-clamp-2" title={letter.subject}>
                        {letter.subject}
                      </div>
                      <span className="inline-block mt-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                        {letter.categoryName}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap text-slate-600">
                      <div>{letter.senderDepartment}</div>
                      <div className="text-[10px] text-slate-400">Oleh: {letter.authorName}</div>
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap">
                      {letter.approvalStatus === 'Disetujui' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Disetujui
                        </span>
                      )}
                      {letter.approvalStatus === 'Diajukan' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Diajukan
                        </span>
                      )}
                      {letter.approvalStatus === 'Draft' && (
                        <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                          Draft Konsep
                        </span>
                      )}
                      {letter.approvalStatus === 'Ditolak' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 border border-rose-300">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Ditolak
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {letter.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenPreview(letter)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                          title="Lihat Format Surat Dinas & Cetak"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Approval Action for Principal / Admin */}
                        {isPrincipal && letter.approvalStatus === 'Diajukan' && (
                          <>
                            <button
                              onClick={() => onUpdateApproval(letter.id, 'Disetujui')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold transition flex items-center gap-1"
                              title="Setujui dan Tandatangani Elektronik"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => onUpdateApproval(letter.id, 'Ditolak', 'Perlu perbaikan redaksi surat')}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-[10px] font-bold transition flex items-center gap-1"
                              title="Tolak / Minta Revisi"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Tolak</span>
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => onArchiveLetter(letter.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          title="Arsipkan"
                        >
                          <Archive className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Hapus surat keluar ${letter.letterNumber}?`)) {
                              onDeleteLetter(letter.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-xs">
                    Tidak ada surat keluar yang sesuai kriteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
