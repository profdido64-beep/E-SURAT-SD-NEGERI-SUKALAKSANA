import React, { useState, useRef } from 'react';
import {
  FileBarChart,
  FileText,
  Printer,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Inbox,
  FileUp,
  Share2,
  Loader2
} from 'lucide-react';
import { LetterIn, LetterOut, SchoolProfile } from '../types';
import { KopSurat } from './KopSurat';
import { printElement, exportElementToPdf } from '../utils/printPdfHelper';

interface LaporanViewProps {
  type: 'masuk' | 'keluar';
  lettersIn: LetterIn[];
  lettersOut: LetterOut[];
  schoolProfile: SchoolProfile;
}

export const LaporanView: React.FC<LaporanViewProps> = ({
  type,
  lettersIn,
  lettersOut,
  schoolProfile,
}) => {
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-31');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  const filteredLettersIn = lettersIn.filter((l) => {
    return l.receivedDate >= startDate && l.receivedDate <= endDate;
  });

  const filteredLettersOut = lettersOut.filter((l) => {
    return l.letterDate >= startDate && l.letterDate <= endDate;
  });

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      await printElement(
        reportRef.current,
        `Laporan_Rekapitulasi_Surat_${type.toUpperCase()}_${startDate}_sd_${endDate}`
      );
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsExportingPdf(true);
    try {
      await exportElementToPdf(reportRef.current, {
        filename: `Laporan_Rekapitulasi_Surat_${type.toUpperCase()}_${startDate}_sd_${endDate}.pdf`,
        format: 'f4',
        orientation: 'portrait',
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'masuk') {
      csvContent += 'No Agenda,No Surat Asal,Asal Pengirim,Perihal,Tanggal Terima,Tanggal Surat,Sifat,Status\n';
      filteredLettersIn.forEach((l) => {
        csvContent += `"${l.agendaNumber}","${l.referenceNumber}","${l.origin}","${l.subject}","${l.receivedDate}","${l.letterDate}","${l.sifat}","${l.status}"\n`;
      });
    } else {
      csvContent += 'No Surat,Tujuan,Perihal,Tanggal Surat,Bagian Pengusul,Sifat,Approval,Status\n';
      filteredLettersOut.forEach((l) => {
        csvContent += `"${l.letterNumber}","${l.destination}","${l.subject}","${l.letterDate}","${l.senderDepartment}","${l.sifat}","${l.approvalStatus}","${l.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Surat_${type}_${startDate}_sd_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl text-white ${
              type === 'masuk' ? 'bg-blue-600' : 'bg-emerald-600'
            }`}
          >
            {type === 'masuk' ? <FileBarChart className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {type === 'masuk' ? 'Laporan Rekapitulasi Surat Masuk' : 'Laporan Rekapitulasi Surat Keluar'}
            </h2>
            <p className="text-xs text-slate-500">
              Laporan berkala agenda persuratan untuk arsip laporan kepala sekolah dan dinas
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            {isExportingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Simpan PDF</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black disabled:opacity-50 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
          >
            {isPrinting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Printer className="w-4 h-4" />
            )}
            <span>Cetak Rekapitulasi</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            Filter Periode:
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
            />
            <span className="text-xs text-slate-400">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none"
            />
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-600">
          Ditemukan <strong>{type === 'masuk' ? filteredLettersIn.length : filteredLettersOut.length}</strong> catatan
        </span>
      </div>

      {/* Printable Sheet */}
      <div
        ref={reportRef}
        className="f4-paper-sheet bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-slate-800 space-y-6"
      >
        {/* Kop */}
        <KopSurat profile={schoolProfile} showBorder={true} size="md" />

        <div className="text-center pt-2">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
            BUKU AGENDA REKAPITULASI SURAT {type.toUpperCase()}
          </h3>
          <p className="text-xs text-slate-500">
            Periode: {startDate} sampai dengan {endDate}
          </p>
        </div>

        {/* Table for Report */}
        {type === 'masuk' ? (
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead className="bg-slate-100 font-bold text-slate-700">
              <tr>
                <th className="border border-slate-300 p-2">No. Agenda</th>
                <th className="border border-slate-300 p-2">Nomor Asal</th>
                <th className="border border-slate-300 p-2">Asal Pengirim</th>
                <th className="border border-slate-300 p-2">Perihal</th>
                <th className="border border-slate-300 p-2">Tgl Terima</th>
                <th className="border border-slate-300 p-2">Sifat</th>
                <th className="border border-slate-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLettersIn.map((l) => (
                <tr key={l.id}>
                  <td className="border border-slate-300 p-2 font-mono font-bold text-blue-700">{l.agendaNumber}</td>
                  <td className="border border-slate-300 p-2 font-mono">{l.referenceNumber}</td>
                  <td className="border border-slate-300 p-2 font-semibold">{l.origin}</td>
                  <td className="border border-slate-300 p-2">{l.subject}</td>
                  <td className="border border-slate-300 p-2 whitespace-nowrap">{l.receivedDate}</td>
                  <td className="border border-slate-300 p-2">{l.sifat}</td>
                  <td className="border border-slate-300 p-2 font-semibold">{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <thead className="bg-slate-100 font-bold text-slate-700">
              <tr>
                <th className="border border-slate-300 p-2">No. Surat Keluar</th>
                <th className="border border-slate-300 p-2">Tujuan Surat</th>
                <th className="border border-slate-300 p-2">Perihal</th>
                <th className="border border-slate-300 p-2">Tanggal</th>
                <th className="border border-slate-300 p-2">Bagian</th>
                <th className="border border-slate-300 p-2">Approval</th>
                <th className="border border-slate-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLettersOut.map((l) => (
                <tr key={l.id}>
                  <td className="border border-slate-300 p-2 font-mono font-bold text-emerald-700">{l.letterNumber}</td>
                  <td className="border border-slate-300 p-2 font-semibold">{l.destination}</td>
                  <td className="border border-slate-300 p-2">{l.subject}</td>
                  <td className="border border-slate-300 p-2 whitespace-nowrap">{l.letterDate}</td>
                  <td className="border border-slate-300 p-2">{l.senderDepartment}</td>
                  <td className="border border-slate-300 p-2 font-bold text-emerald-700">{l.approvalStatus}</td>
                  <td className="border border-slate-300 p-2">{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TTD Laporan */}
        <div className="pt-8 flex justify-end">
          <div className="text-center w-64 space-y-1 text-xs">
            <p className="text-slate-600">{schoolProfile.city}, {endDate}</p>
            <p className="text-slate-700 font-semibold">Kepala Urusan Tata Usaha,</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 underline">{schoolProfile.tuHeadName}</p>
            <p className="text-[11px] font-mono text-slate-500">NIP. {schoolProfile.tuHeadNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
