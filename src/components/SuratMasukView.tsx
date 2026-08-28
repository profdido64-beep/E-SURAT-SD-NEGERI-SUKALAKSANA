import React, { useState } from 'react';
import {
  Inbox,
  Plus,
  Search,
  Filter,
  Eye,
  Send,
  Printer,
  Archive,
  Trash2,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { LetterIn, LetterCategory } from '../types';

interface SuratMasukViewProps {
  letters: LetterIn[];
  categories: LetterCategory[];
  onOpenInputModal: () => void;
  onOpenPreview: (letter: LetterIn) => void;
  onOpenDisposisiModal: (letter: LetterIn) => void;
  onArchiveLetter: (letterId: string) => void;
  onDeleteLetter: (letterId: string) => void;
}

export const SuratMasukView: React.FC<SuratMasukViewProps> = ({
  letters,
  categories,
  onOpenInputModal,
  onOpenPreview,
  onOpenDisposisiModal,
  onArchiveLetter,
  onDeleteLetter,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSifat, setSelectedSifat] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredLetters = letters.filter((l) => {
    const matchSearch =
      l.agendaNumber.toLowerCase().includes(search.toLowerCase()) ||
      l.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      l.origin.toLowerCase().includes(search.toLowerCase()) ||
      l.subject.toLowerCase().includes(search.toLowerCase());

    const matchCat = selectedCategory === 'ALL' || l.categoryId === selectedCategory;
    const matchSifat = selectedSifat === 'ALL' || l.sifat === selectedSifat;
    const matchStatus = selectedStatus === 'ALL' || l.status === selectedStatus;

    return matchSearch && matchCat && matchSifat && matchStatus;
  });

  const getSifatBadge = (sifat: string) => {
    switch (sifat) {
      case 'Segera':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Penting':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rahasia':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Didisposisikan':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Diproses':
        return 'bg-sky-100 text-sky-800 border border-sky-200';
      case 'Selesai':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Diarsipkan':
        return 'bg-slate-100 text-slate-700 border border-slate-200';
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Buku Agenda Surat Masuk</h2>
              <p className="text-xs text-slate-500">
                Pencatatan registrasi dokumen persuratan masuk dan penerbitan nomor agenda
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenInputModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrasi Surat Masuk</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari agenda, nomor, asal..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sifat Filter */}
          <select
            value={selectedSifat}
            onChange={(e) => setSelectedSifat(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none"
          >
            <option value="ALL">Semua Sifat</option>
            <option value="Biasa">Biasa</option>
            <option value="Penting">Penting</option>
            <option value="Segera">Segera</option>
            <option value="Rahasia">Rahasia</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="Diterima">Diterima</option>
            <option value="Didisposisikan">Didisposisikan</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Diarsipkan">Diarsipkan</option>
          </select>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Agenda & Tanggal</th>
                <th className="px-4 py-3.5">Nomor & Asal Pengirim</th>
                <th className="px-4 py-3.5">Perihal & Kategori</th>
                <th className="px-3 py-3.5">Sifat</th>
                <th className="px-3 py-3.5">Batas Deadline</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLetters.length > 0 ? (
                filteredLetters.map((letter) => (
                  <tr key={letter.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-blue-700 text-sm">
                        {letter.agendaNumber}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        Terima: {letter.receivedDate}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 max-w-[200px]">
                      <div className="font-semibold text-slate-900">{letter.origin}</div>
                      <div className="font-mono text-[11px] text-slate-500 truncate" title={letter.referenceNumber}>
                        No: {letter.referenceNumber}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 max-w-[260px]">
                      <div className="font-medium text-slate-800 line-clamp-2" title={letter.subject}>
                        {letter.subject}
                      </div>
                      <span className="inline-block mt-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-semibold">
                        {letter.categoryName}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${getSifatBadge(
                          letter.sifat
                        )}`}
                      >
                        {letter.sifat}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap">
                      {letter.deadlineDate ? (
                        <div className="text-rose-600 font-bold text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {letter.deadlineDate}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getStatusBadge(
                          letter.status
                        )}`}
                      >
                        {letter.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenPreview(letter)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Lihat Detail & Cetak"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenDisposisiModal(letter)}
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                          title="Buat Disposisi"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onArchiveLetter(letter.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                          title="Arsipkan Surat"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus surat masuk ${letter.agendaNumber}?`)) {
                              onDeleteLetter(letter.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Surat"
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
                    Tidak ada surat masuk yang sesuai filter pencarian.
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
