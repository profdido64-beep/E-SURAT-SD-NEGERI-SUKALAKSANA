import React, { useState, useEffect } from 'react';
import {
  Inbox,
  FileUp,
  AlertCircle,
  Clock,
  Plus,
  Send,
  Search,
  FileCode2,
  FileBarChart,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Calendar,
  Building,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Printer,
  Archive
} from 'lucide-react';
import {
  LetterIn,
  LetterOut,
  Disposition,
  LetterTemplate,
  ArchiveRecord
} from '../types';
import { monthlyChartData } from '../data/initialData';

interface DashboardViewProps {
  lettersIn: LetterIn[];
  lettersOut: LetterOut[];
  dispositions: Disposition[];
  templates: LetterTemplate[];
  archives: ArchiveRecord[];
  onOpenInputMasukModal: () => void;
  onOpenBuatKeluarModal: () => void;
  onOpenDisposisiModal: (letterIn?: LetterIn) => void;
  onOpenLetterInPreview: (letter: LetterIn) => void;
  onOpenLetterOutPreview: (letter: LetterOut) => void;
  onOpenDisposisiPrint: (disp: Disposition) => void;
  onNavigateTab: (tabId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lettersIn,
  lettersOut,
  dispositions,
  templates,
  archives,
  onOpenInputMasukModal,
  onOpenBuatKeluarModal,
  onOpenDisposisiModal,
  onOpenLetterInPreview,
  onOpenLetterOutPreview,
  onOpenDisposisiPrint,
  onNavigateTab,
}) => {
  // Counts
  const totalMasuk = lettersIn.length;
  const totalKeluar = lettersOut.length;
  const pendingDisposisi = dispositions.filter(
    (d) => d.status === 'Belum Ditindaklanjuti' || d.status === 'Sedang Diproses'
  ).length;

  // Deadline calculation: within 3 days
  const now = new Date();
  const deadlineCount = dispositions.filter((d) => {
    if (d.status === 'Selesai') return false;
    const dead = new Date(d.deadlineDate);
    const diffDays = (dead.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays >= -1 && diffDays <= 4;
  }).length;

  const totalArchived = archives.length + lettersIn.filter((l) => l.archived).length + lettersOut.filter((l) => l.archived).length;
  const activeTemplatesCount = templates.filter((t) => t.isActive).length;
  const approvedLettersOutCount = lettersOut.filter((l) => l.approvalStatus === 'Disetujui').length;

  // Approval status breakdown
  const draftCount = lettersOut.filter((l) => l.approvalStatus === 'Draft').length;
  const diajukanCount = lettersOut.filter((l) => l.approvalStatus === 'Diajukan').length;
  const disetujuiCount = lettersOut.filter((l) => l.approvalStatus === 'Disetujui').length;
  const ditolakCount = lettersOut.filter((l) => l.approvalStatus === 'Ditolak').length;

  // Priority Dispositions
  const priorityDispositions = dispositions.filter((d) => d.isPriority || d.sifat === 'Segera');

  // Live clock for floating notification
  const [liveTimeString, setLiveTimeString] = useState('');
  const [liveDateString, setLiveDateString] = useState('');
  const [dismissNotification, setDismissNotification] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setLiveTimeString(
        d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
      setLiveDateString(
        d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const getStatusMasukBadge = (status: string) => {
    switch (status) {
      case 'Didisposisikan':
        return 'bg-amber-100 text-amber-800';
      case 'Diproses':
        return 'bg-sky-100 text-sky-800';
      case 'Selesai':
        return 'bg-emerald-100 text-emerald-800';
      case 'Diarsipkan':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ========================================================================= */}
      {/* 4 TOP SUMMARY CARDS (Blue, Green, Orange, Red) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Blue - Surat Masuk */}
        <div
          onClick={() => onNavigateTab('surat-masuk')}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/15 rounded-xl backdrop-blur-xs">
              <Inbox className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-white/20 rounded-full backdrop-blur-xs">
              +{totalMasuk} Total
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight">
              {totalMasuk} <span className="text-lg font-normal text-blue-100">Surat Masuk</span>
            </div>
            <p className="text-xs text-blue-100/90 mt-1 font-medium">
              Total agenda surat yang diterima
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-blue-100 font-medium group-hover:text-white">
            <span>Buka Buku Agenda</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Green - Surat Keluar */}
        <div
          onClick={() => onNavigateTab('surat-keluar')}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/15 rounded-xl backdrop-blur-xs">
              <FileUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-white/20 rounded-full backdrop-blur-xs">
              {approvedLettersOutCount} Disetujui
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight">
              {totalKeluar} <span className="text-lg font-normal text-emerald-100">Surat Keluar</span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-1 font-medium">
              Draft, final, dan surat terkirim
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-emerald-100 font-medium group-hover:text-white">
            <span>Kelola Surat Keluar</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Orange - Perlu Tindak Lanjut */}
        <div
          onClick={() => onNavigateTab('disposisi')}
          className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/15 rounded-xl backdrop-blur-xs">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-white/25 rounded-full backdrop-blur-xs">
              Perlu Respon
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight">
              {pendingDisposisi}{' '}
              <span className="text-lg font-normal text-amber-100">Perlu Tindak Lanjut</span>
            </div>
            <p className="text-xs text-amber-100/90 mt-1 font-medium">
              Disposisi belum selesai diproses
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-amber-100 font-medium group-hover:text-white">
            <span>Tindak Lanjuti Disposisi</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Red - Mendekati Deadline */}
        <div
          onClick={() => onNavigateTab('disposisi')}
          className="relative overflow-hidden bg-gradient-to-br from-rose-600 to-rose-700 rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/15 rounded-xl backdrop-blur-xs animate-pulse">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-white/20 rounded-full backdrop-blur-xs">
              H-3 Hari
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight">
              {deadlineCount}{' '}
              <span className="text-lg font-normal text-rose-100">Mendekati Deadline</span>
            </div>
            <p className="text-xs text-rose-100/90 mt-1 font-medium">
              Jatuh tempo 3 hari ke depan
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-rose-100 font-medium group-hover:text-white">
            <span>Lihat Batas Waktu</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 ADDITIONAL INFO BOXES + 6 QUICK SHORTCUT BUTTONS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 3 Info Boxes (Left 7 Cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Box 1: 0 Surat sudah diarsipkan */}
          <div
            onClick={() => onNavigateTab('arsip-digital')}
            className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Arsip Digital</span>
              <Archive className="w-4 h-4 text-slate-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-slate-800">{totalArchived}</div>
              <p className="text-xs font-medium text-slate-600 mt-0.5">Surat sudah diarsipkan</p>
            </div>
            <span className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-0.5">
              Cek Lemari Arsip →
            </span>
          </div>

          {/* Box 2: 2 Template surat aktif */}
          <div
            onClick={() => onNavigateTab('template-surat')}
            className="bg-white p-4 rounded-xl border border-indigo-100 hover:border-indigo-200 bg-indigo-50/20 shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-indigo-700">Master Format</span>
              <FileCode2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-indigo-900">{activeTemplatesCount}</div>
              <p className="text-xs font-medium text-indigo-800 mt-0.5">Template surat aktif</p>
            </div>
            <span className="text-[11px] text-indigo-600 font-semibold hover:underline flex items-center gap-0.5">
              Pakai Template →
            </span>
          </div>

          {/* Box 3: 1 Surat keluar disetujui */}
          <div
            onClick={() => onNavigateTab('surat-keluar')}
            className="bg-white p-4 rounded-xl border border-emerald-100 hover:border-emerald-200 bg-emerald-50/20 shadow-xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700">Approval Valid</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-emerald-900">{approvedLettersOutCount}</div>
              <p className="text-xs font-medium text-emerald-800 mt-0.5">Surat keluar disetujui</p>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-0.5">
              Siap Kirim / Cetak →
            </span>
          </div>
        </div>

        {/* 6 Quick Action Buttons (Right 5 Cols) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Aksi Cepat & Shortcut
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Operasional Harian</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* 1. + Input Masuk (Biru) */}
            <button
              onClick={onOpenInputMasukModal}
              className="flex flex-col items-center justify-center p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs shadow-xs transition active:scale-95 group"
            >
              <Plus className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span>+ Input Masuk</span>
            </button>

            {/* 2. Buat Keluar (Hijau) */}
            <button
              onClick={onOpenBuatKeluarModal}
              className="flex flex-col items-center justify-center p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-xs shadow-xs transition active:scale-95 group"
            >
              <FileUp className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span>Buat Keluar</span>
            </button>

            {/* 3. Disposisi (Oranye) */}
            <button
              onClick={() => onOpenDisposisiModal()}
              className="flex flex-col items-center justify-center p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-xs shadow-xs transition active:scale-95 group"
            >
              <Send className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span>Disposisi</span>
            </button>

            {/* 4. Cari Arsip (Abu-abu) */}
            <button
              onClick={() => onNavigateTab('arsip-digital')}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium text-xs shadow-xs transition active:scale-95 group"
            >
              <Search className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span>Cari Arsip</span>
            </button>

            {/* 5. Template (Biru / Indigo) */}
            <button
              onClick={() => onNavigateTab('template-surat')}
              className="flex flex-col items-center justify-center p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs shadow-xs transition active:scale-95 group"
            >
              <FileCode2 className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span>Template</span>
            </button>

            {/* 6. Laporan (Hitam) */}
            <button
              onClick={() => onNavigateTab('laporan-masuk')}
              className="flex flex-col items-center justify-center p-2.5 bg-slate-900 hover:bg-black text-white rounded-lg font-medium text-xs shadow-xs transition active:scale-95 group"
            >
              <FileBarChart className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
              <span>Laporan</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BAR CHART: GRAFIK SURAT MASUK 6 BULAN + STATUS APPROVAL PANEL */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (8 Cols): Bar Chart Panel */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Grafik Surat Masuk 6 Bulan
              </h3>
              <p className="text-xs text-slate-500">
                Statistik intensitas volume surat dinas masuk semester berjalan (Maret - Agustus 2026)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-3 h-3 bg-blue-600 rounded-xs inline-block"></span> Kedinasan
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-3 h-3 bg-sky-400 rounded-xs inline-block"></span> Undangan
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 px-2">
              {monthlyChartData.map((item, index) => {
                const maxCount = 35;
                const heightPercent = Math.min(100, Math.round((item.count / maxCount) * 100));
                const isCurrentMonth = item.month === 'Agu';

                return (
                  <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 bg-slate-900 text-white text-[11px] py-1 px-2 rounded font-medium opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap shadow-md">
                      {item.month}: {item.count} Surat ({item.dinas} Dinas, {item.undangan} Undangan)
                    </div>

                    {/* Value Badge */}
                    <span
                      className={`text-[11px] font-bold mb-1.5 transition ${
                        isCurrentMonth ? 'text-blue-600' : 'text-slate-600'
                      }`}
                    >
                      {item.count}
                    </span>

                    {/* Bar container */}
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all duration-500 group-hover:brightness-110 flex flex-col justify-end ${
                          isCurrentMonth
                            ? 'bg-gradient-to-t from-blue-700 to-blue-500 ring-2 ring-blue-400/40'
                            : 'bg-gradient-to-t from-slate-700 to-blue-600'
                        }`}
                      >
                        {/* Secondary segment indicator */}
                        <div
                          style={{ height: `${(item.undangan / item.count) * 100}%` }}
                          className="w-full bg-sky-400/80"
                        />
                      </div>
                    </div>

                    {/* Month Label */}
                    <span
                      className={`mt-2 text-xs font-semibold ${
                        isCurrentMonth
                          ? 'text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right (4 Cols): Status Approval Surat Keluar */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Status Approval
              </h3>
              <span className="text-[11px] text-slate-500">Surat Keluar</span>
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-4">
              Monitoring persetujuan tanda tangan elektronik pimpinan:
            </p>

            <div className="space-y-2.5">
              {/* Draft */}
              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-xs font-medium text-slate-700">Draft Konsep</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md">
                  {draftCount}
                </span>
              </div>

              {/* Diajukan */}
              <div className="p-2.5 rounded-xl border border-amber-100 bg-amber-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-medium text-amber-900">Diajukan ke Kepsek</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md">
                  {diajukanCount}
                </span>
              </div>

              {/* Disetujui */}
              <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-emerald-900">Disetujui & TTD</span>
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 bg-emerald-600 text-white rounded-md">
                  {disetujuiCount}
                </span>
              </div>

              {/* Ditolak */}
              <div className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-medium text-rose-900">Ditolak / Revisi</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 bg-rose-200 text-rose-900 rounded-md">
                  {ditolakCount}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('surat-keluar')}
            className="w-full mt-4 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition text-center flex items-center justify-center gap-1"
          >
            <span>Buka Lembar Verifikasi Surat</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2 RECENT TABLES: SURAT MASUK TERBARU & SURAT KELUAR TERBARU */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Table 1: Surat Masuk Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                <Inbox className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Surat Masuk Terbaru</h3>
            </div>
            <button
              onClick={() => onNavigateTab('surat-masuk')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Lihat Semua ({lettersIn.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Agenda</th>
                  <th className="px-4 py-3">Asal Surat</th>
                  <th className="px-4 py-3">Perihal</th>
                  <th className="px-3 py-3">Sifat</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lettersIn.map((letter) => (
                  <tr key={letter.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {letter.agendaNumber}
                      <div className="text-[10px] font-normal text-slate-400">
                        {letter.receivedDate}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 max-w-[140px] truncate" title={letter.origin}>
                      {letter.origin}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px]" title={letter.subject}>
                      <div className="line-clamp-2 font-medium">{letter.subject}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getSifatBadge(
                          letter.sifat
                        )}`}
                      >
                        {letter.sifat}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusMasukBadge(
                          letter.status
                        )}`}
                      >
                        {letter.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenLetterInPreview(letter)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Lihat Detail Surat"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenDisposisiModal(letter)}
                          className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition"
                          title="Buat Disposisi"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Surat Keluar Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <FileUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Surat Keluar Terbaru</h3>
            </div>
            <button
              onClick={() => onNavigateTab('surat-keluar')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
            >
              Lihat Semua ({lettersOut.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Nomor Surat</th>
                  <th className="px-4 py-3">Tujuan</th>
                  <th className="px-4 py-3">Perihal</th>
                  <th className="px-3 py-3">Approval</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lettersOut.map((letter) => (
                  <tr key={letter.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-700 whitespace-nowrap">
                      {letter.letterNumber}
                      <div className="text-[10px] font-normal text-slate-400">
                        {letter.letterDate}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 max-w-[140px] truncate" title={letter.destination}>
                      {letter.destination}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px]" title={letter.subject}>
                      <div className="line-clamp-2 font-medium">{letter.subject}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200">
                        {letter.approvalStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                        {letter.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenLetterOutPreview(letter)}
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                          title="Lihat Format Surat Dinas"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DISPOSISI PRIORITAS PANEL (Bottom) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Disposisi Prioritas</h3>
              <p className="text-xs text-slate-500">
                Arahan penting pimpinan yang memerlukan tindak lanjut segera
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('disposisi')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Lihat Semua Disposisi ({dispositions.length}) →
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {priorityDispositions.length > 0 ? (
            priorityDispositions.map((disp) => (
              <div
                key={disp.id}
                className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold uppercase rounded-md tracking-wider">
                      Prioritas Segera
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {disp.letterInAgenda}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-600">{disp.letterInOrigin}</span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800">
                    Perihal: {disp.letterInSubject}
                  </p>

                  <div className="p-2.5 bg-white rounded-lg border border-rose-100 text-xs text-slate-700 font-medium">
                    <span className="font-bold text-rose-800">Instruksi Kepala Sekolah: </span>
                    "{disp.instruction}"
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span>
                      <strong className="text-slate-700">Diteruskan Kepada:</strong>{' '}
                      {disp.toDepartmentName} ({disp.toUserName || 'Staf Terkait'})
                    </span>
                    <span className="text-rose-600 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Batas Waktu: {disp.deadlineDate} (Mendekati Deadline)
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                  <button
                    onClick={() => onOpenDisposisiPrint(disp)}
                    className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Cetak Lembar</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('disposisi')}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Proses Sekarang</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              Tidak ada disposisi prioritas yang tertunda saat ini.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING TIME & DEADLINE NOTIFICATION (Bottom Right Widget) */}
      {/* ========================================================================= */}
      {!dismissNotification && (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-rose-200 p-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl shadow-md shadow-rose-600/30 shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Mendekati Deadline
                </span>
                <span className="text-[10px] font-mono text-slate-400">{liveTimeString}</span>
              </div>

              <h4 className="text-xs font-bold text-slate-800 mt-1">
                1 Surat Perlu Ditindaklanjuti
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                Agenda <strong>SM-2026/001</strong> (Rakor ANBK) jatuh tempo dalam 3 hari ke depan ({liveDateString}).
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('disposisi')}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg transition shadow-xs"
                >
                  Tindak Lanjuti
                </button>
                <button
                  onClick={() => setDismissNotification(true)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold rounded-lg transition"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
