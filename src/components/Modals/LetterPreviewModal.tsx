import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Download,
  Eye,
  FileText,
  Calendar,
  Building,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Loader2
} from 'lucide-react';
import { LetterIn, LetterOut, SchoolProfile } from '../../types';
import { KopSurat } from '../KopSurat';
import { SuratPindahDoc, parseSuratPindahContent } from '../SuratPindahDoc';
import { printElement, exportElementToPdf } from '../../utils/printPdfHelper';

interface LetterPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterIn?: LetterIn | null;
  letterOut?: LetterOut | null;
  schoolProfile: SchoolProfile;
  onPrint?: () => void;
}

export const LetterPreviewModal: React.FC<LetterPreviewModalProps> = ({
  isOpen,
  onClose,
  letterIn,
  letterOut,
  schoolProfile,
}) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const docTitle = letterIn
    ? `Surat_Masuk_${letterIn.agendaNumber.replace(/[\/\\]/g, '_')}`
    : letterOut
    ? `Surat_Keluar_${letterOut.letterNumber.replace(/[\/\\]/g, '_')}`
    : 'Dokumen_Surat_SDN_Sukalaksana';

  const handleDirectPrint = async () => {
    setIsPrinting(true);
    try {
      await printElement(paperRef.current, docTitle);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!paperRef.current) return;
    setIsExportingPdf(true);
    try {
      const success = await exportElementToPdf(paperRef.current, {
        filename: `${docTitle}.pdf`,
        format: 'f4',
        orientation: 'portrait',
      });
      if (success) {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  const isSuratPindah =
    letterOut &&
    (letterOut.subject.toUpperCase().includes('PINDAH') ||
      letterOut.subject.toUpperCase().includes('MUTASI KELUAR') ||
      letterOut.categoryName?.toUpperCase().includes('MUTASI KELUAR') ||
      letterOut.content.toUpperCase().includes('PINDAH SEKOLAH') ||
      letterOut.content.toUpperCase().includes('PINDAH KE'));

  const parsedPindahData =
    letterOut && isSuratPindah
      ? parseSuratPindahContent(
          letterOut.content,
          letterOut.letterNumber,
          letterOut.destination,
          letterOut.letterDate,
          schoolProfile
        )
      : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[96vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 text-blue-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {letterIn
                  ? `Detail Surat Masuk: ${letterIn.agendaNumber}`
                  : isSuratPindah
                  ? `Pratinjau Surat Keterangan Pindah Sekolah (F4 Standar)`
                  : `Pratinjau Surat Keluar Kedinasan`}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Dokumen Tata Usaha & Kearsipan Kedinasan SD Negeri Sukalaksana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
              <span>Kertas:</span>
              <strong className="text-amber-400">F4 (215 × 330 mm)</strong>
            </span>

            {/* Print Button */}
            <button
              onClick={handleDirectPrint}
              disabled={isPrinting || isExportingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition border border-slate-700 cursor-pointer"
              title="Cetak dokumen melalui dialog print"
            >
              {isPrinting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Printer className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span className="hidden sm:inline">Cetak</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf || isPrinting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
              title="Unduh berkas format .pdf langsung ke perangkat"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyiapkan PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{exportSuccess ? 'Tersimpan!' : 'Simpan PDF'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Paper Sheet */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-200/70 flex justify-center">
          {/* Paper Container (F4 Ratio: 215mm x 330mm) */}
          <div
            ref={paperRef}
            className="f4-paper-sheet f4-paper-preview mx-auto bg-white p-6 sm:p-10 rounded-lg shadow-xl border border-slate-300 text-slate-900"
          >
            {/* JIKA SURAT PINDAH */}
            {letterOut && isSuratPindah ? (
              <SuratPindahDoc data={parsedPindahData} schoolProfile={schoolProfile} />
            ) : (
              <div className="space-y-6">
                {/* KOP SURAT RESMI */}
                <KopSurat profile={schoolProfile} showBorder={true} size="md" />

                {/* IF SURAT MASUK */}
                {letterIn && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                      <span className="font-bold text-blue-900">Buku Agenda Persuratan Masuk</span>
                      <span className="font-mono font-bold text-blue-700">{letterIn.agendaNumber}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border border-slate-200 rounded-lg p-4 bg-slate-50/50">
                      <div>
                        <p className="text-slate-500 font-medium">Nomor Surat Asal:</p>
                        <p className="font-mono font-bold text-slate-800 text-sm">
                          {letterIn.referenceNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Asal Pengirim / Instansi:</p>
                        <p className="font-bold text-slate-800 text-sm">{letterIn.origin}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Tanggal Diterima:</p>
                        <p className="font-bold text-slate-800">{letterIn.receivedDate}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Tanggal Surat:</p>
                        <p className="font-bold text-slate-800">{letterIn.letterDate}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Kategori:</p>
                        <p className="font-bold text-blue-700">{letterIn.categoryName}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Sifat / Urgensi:</p>
                        <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded">
                          {letterIn.sifat}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 text-xs uppercase mb-1">Perihal Dokumen:</h4>
                      <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800">
                        {letterIn.subject}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 text-xs uppercase mb-1">Ringkasan Isi:</h4>
                      <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                        {letterIn.summary || 'Tidak ada ringkasan tambahan.'}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-100 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-700">
                          {letterIn.fileName || 'scan_surat.pdf'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {letterIn.fileSize || '1.2 MB'} • Terverifikasi Tata Usaha
                      </span>
                    </div>
                  </div>
                )}

                {/* IF SURAT KELUAR UMUM */}
                {letterOut && (
                  <div className="space-y-4 text-xs">
                    {/* Meta details */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p>
                          <strong>Nomor</strong> :{' '}
                          <span className="font-mono font-bold text-slate-800">
                            {letterOut.letterNumber}
                          </span>
                        </p>
                        <p>
                          <strong>Sifat</strong> : {letterOut.sifat}
                        </p>
                        <p>
                          <strong>Lampiran</strong> : {letterOut.attachmentCount || 0} Berkas
                        </p>
                        <p>
                          <strong>Hal</strong> :{' '}
                          <strong className="text-slate-900">{letterOut.subject}</strong>
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p>
                          {schoolProfile.city}, {letterOut.letterDate}
                        </p>
                        <div className="pt-2 text-left">
                          <p>Kepada Yth:</p>
                          <p className="font-bold text-slate-800">{letterOut.destination}</p>
                          <p>di Tempat</p>
                        </div>
                      </div>
                    </div>

                    {/* Surat Body */}
                    <div className="pt-4 border-t border-slate-200">
                      <div className="whitespace-pre-line text-xs sm:text-sm text-slate-800 leading-relaxed min-h-[140px]">
                        {letterOut.content}
                      </div>
                    </div>

                    {/* Signee Footer & QR Code Verification */}
                    <div className="pt-8 flex items-end justify-between">
                      <div className="p-2 border border-slate-200 rounded-lg text-center flex flex-col items-center bg-slate-50">
                        <QrCode className="w-12 h-12 text-slate-800 mb-1" />
                        <span className="text-[9px] text-slate-500">Verifikasi TTE Digital Resmi</span>
                        <span className="text-[8px] font-mono text-slate-400">
                          UUID: {letterOut.id}
                        </span>
                      </div>

                      <div className="text-center w-64 space-y-1">
                        <p className="text-xs text-slate-700">{letterOut.signeePosition},</p>
                        <div className="h-16 flex items-center justify-center">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] border border-emerald-300">
                            ✓ Telah Ditandatangani Secara Elektronik
                          </span>
                        </div>
                        <p className="font-bold text-sm text-slate-900 underline">
                          {letterOut.signeeName}
                        </p>
                        <p className="text-[11px] font-mono text-slate-600">
                          NIP. {schoolProfile.principalNip}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Dokumen Persuratan Resmi {schoolProfile.name} • Format Presisi F4
          </span>
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
