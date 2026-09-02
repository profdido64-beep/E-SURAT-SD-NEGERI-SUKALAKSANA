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
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white w-full flex flex-col h-full">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-white text-black flex items-center justify-between border-b border-gray-200 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 text-gray-700 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {letterIn
                  ? `Detail Surat Masuk: ${letterIn.agendaNumber}`
                  : isSuratPindah
                  ? `Pratinjau Surat Keterangan Pindah Sekolah`
                  : `Pratinjau Surat Keluar`}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500">
                SD Negeri Sukalaksana
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
              <span>Kertas:</span>
              <strong className="text-gray-900">F4 (215 × 330 mm)</strong>
            </span>

            {/* Print Button */}
            <button
              onClick={handleDirectPrint}
              disabled={isPrinting || isExportingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-black rounded-lg text-xs font-semibold transition cursor-pointer"
              title="Cetak dokumen"
            >
              {isPrinting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Printer className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Cetak</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf || isPrinting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition cursor-pointer"
              title="Unduh berkas PDF"
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
              className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-200 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Paper Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white flex justify-center">
          {/* Paper Container (F4 Ratio: 215mm x 330mm) */}
          <div
            ref={paperRef}
            className="f4-paper-sheet f4-paper-preview mx-auto bg-white text-black"
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
                  <div className="font-serif text-black leading-[1.5]" style={{ fontSize: '12pt', fontFamily: '"Times New Roman", Times, serif' }}>
                    {/* Meta details */}
                    <div className="flex justify-between items-start mt-4">
                      <div className="space-y-0.5">
                        <div className="flex"><span className="w-24">Nomor</span><span>:</span><span className="ml-2">{letterOut.letterNumber}</span></div>
                        <div className="flex"><span className="w-24">Sifat</span><span>:</span><span className="ml-2">{letterOut.sifat}</span></div>
                        <div className="flex"><span className="w-24">Lampiran</span><span>:</span><span className="ml-2">{letterOut.attachmentCount ? `${letterOut.attachmentCount} Berkas` : '-'}</span></div>
                        <div className="flex"><span className="w-24">Hal</span><span>:</span><span className="ml-2">{letterOut.subject}</span></div>
                      </div>
                      <div className="text-left">
                        <p>{schoolProfile.city}, {letterOut.letterDate}</p>
                      </div>
                    </div>

                    <div className="mt-6 mb-6">
                      <p>Yth.</p>
                      <p className="font-bold">{letterOut.destination}</p>
                      <p>di -</p>
                      <p className="pl-6">Tempat</p>
                    </div>

                    {/* Surat Body */}
                    <div className="text-justify whitespace-pre-wrap min-h-[160px] mb-12">
                      {letterOut.content}
                    </div>

                    {/* Signee Footer */}
                    <div className="flex justify-end">
                      <div className="w-64 text-left">
                        <p>{letterOut.signeePosition},</p>
                        <div className="h-24"></div>
                        <p className="font-bold underline uppercase">{letterOut.signeeName}</p>
                        <p>NIP. {schoolProfile.principalNip}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between no-print">
          <span className="text-xs text-gray-500">
            Dokumen Persuratan Resmi {schoolProfile.name}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
