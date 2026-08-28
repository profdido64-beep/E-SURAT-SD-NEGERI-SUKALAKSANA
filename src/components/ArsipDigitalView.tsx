import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Box,
  Layers,
  FileText,
  Calendar,
  Download,
  Filter,
  CheckCircle2,
  Lock,
  Plus
} from 'lucide-react';
import { LetterIn, LetterOut, ArchiveRecord } from '../types';

interface ArsipDigitalViewProps {
  lettersIn: LetterIn[];
  lettersOut: LetterOut[];
  archives: ArchiveRecord[];
}

export const ArsipDigitalView: React.FC<ArsipDigitalViewProps> = ({
  lettersIn,
  lettersOut,
  archives,
}) => {
  const [search, setSearch] = useState('');
  const [selectedBox, setSelectedBox] = useState('ALL');

  // Combine archived items
  const allArchived = [
    ...lettersIn.filter((l) => l.archived).map((l) => ({
      id: l.id,
      type: 'Masuk' as const,
      number: l.agendaNumber,
      originOrDest: l.origin,
      subject: l.subject,
      date: l.receivedDate,
      category: l.categoryName,
      box: l.archiveBox || 'BOX-2026-01',
      rack: 'RAK-A1',
      retention: '5 Tahun',
    })),
    ...lettersOut.filter((l) => l.archived).map((l) => ({
      id: l.id,
      type: 'Keluar' as const,
      number: l.letterNumber,
      originOrDest: l.destination,
      subject: l.subject,
      date: l.letterDate,
      category: l.categoryName,
      box: 'BOX-2026-02',
      rack: 'RAK-B2',
      retention: '10 Tahun',
    })),
  ];

  const filtered = allArchived.filter((item) => {
    const matchSearch =
      item.number.toLowerCase().includes(search.toLowerCase()) ||
      item.originOrDest.toLowerCase().includes(search.toLowerCase()) ||
      item.subject.toLowerCase().includes(search.toLowerCase());

    const matchBox = selectedBox === 'ALL' || item.box === selectedBox;

    return matchSearch && matchBox;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-700 text-white rounded-xl">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Manajemen Arsip Digital & Lemari Berkas</h2>
              <p className="text-xs text-slate-500">
                Penyimpanan berkas inaktif, retensi dokumen, dan pelacakan fisik lemari/boks arsip
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Keamanan Arsip Terenkripsi</span>
        </div>
      </div>

      {/* Stats of Storage */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Total Berkas Diarsipkan</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">{allArchived.length} Dokumen</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Tersimpan Permanen</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Boks Arsip Aktif</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">4 Boks</div>
          <span className="text-[11px] text-blue-600 font-semibold">Ruang Arsip Lt. 1</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500">Jadwal Retensi Terdekat</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">Tahun 2031</div>
          <span className="text-[11px] text-purple-600 font-semibold">Klasifikasi 5 Tahun</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari arsip nomor surat, perihal, atau instansi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Boks Fisik:</span>
          <select
            value={selectedBox}
            onChange={(e) => setSelectedBox(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none"
          >
            <option value="ALL">Semua Boks</option>
            <option value="BOX-2026-01">BOX-2026-01 (Surat Masuk)</option>
            <option value="BOX-2026-02">BOX-2026-02 (Surat Keluar)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Jenis & Nomor</th>
                <th className="px-4 py-3.5">Instansi Terkait</th>
                <th className="px-4 py-3.5">Perihal</th>
                <th className="px-3 py-3.5">Lokasi Rak / Boks</th>
                <th className="px-3 py-3.5">Masa Retensi</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.type === 'Masuk'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          Surat {item.type}
                        </span>
                        <span className="font-mono font-bold text-slate-800">{item.number}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Tanggal: {item.date}</div>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-slate-800 max-w-[180px] truncate">
                      {item.originOrDest}
                    </td>

                    <td className="px-4 py-3.5 max-w-[240px]">
                      <div className="font-medium text-slate-800 line-clamp-2">{item.subject}</div>
                      <span className="text-[10px] text-slate-500">{item.category}</span>
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono font-semibold text-slate-700">{item.box}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Rak: {item.rack}</span>
                    </td>

                    <td className="px-3 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded">
                        {item.retention}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => alert(`Mengunduh berkas pindaian arsip: ${item.number}`)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Download Berkas PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400 text-xs">
                    <FolderArchive className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">Belum ada surat yang dipindahkan ke arsip inaktif.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Gunakan tombol "Arsipkan" pada tabel Surat Masuk atau Surat Keluar untuk mengarsipkan dokumen.
                    </p>
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
