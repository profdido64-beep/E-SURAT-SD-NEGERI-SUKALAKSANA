import React, { useRef, useState } from 'react';
import { X, Printer, Download, GitPullRequest, QrCode, Loader2 } from 'lucide-react';
import { Disposition, SchoolProfile } from '../../types';
import { KopSurat } from '../KopSurat';
import { printElement, exportElementToPdf } from '../../utils/printPdfHelper';

interface LembarDisposisiPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  disposition: Disposition | null;
  schoolProfile: SchoolProfile;
}

export const LembarDisposisiPrintModal: React.FC<LembarDisposisiPrintModalProps> = ({
  isOpen,
  onClose,
  disposition,
  schoolProfile,
}) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen || !disposition) return null;

  const docTitle = `Lembar_Disposisi_${disposition.letterInAgenda.replace(/[\/\\]/g, '_')}`;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[94vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-5 py-3.5 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Lembar Disposisi Kedinasan</h3>
              <p className="text-[11px] sm:text-xs text-amber-100">Format Standar Format Disposisi Pimpinan Sekolah</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-amber-950 bg-amber-200/90 px-2.5 py-1 rounded-md border border-amber-300">
              <span>Ukuran:</span>
              <strong className="text-amber-950">F4 (215 × 330 mm)</strong>
            </span>

            {/* Print Button */}
            <button
              onClick={handleDirectPrint}
              disabled={isPrinting || isExportingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition border border-amber-500 cursor-pointer"
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-black disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Menyiapkan...</span>
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
              className="p-1.5 text-amber-100 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Sheet Preview (F4 Ratio) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-200/70 flex justify-center">
          <div
            ref={paperRef}
            className="f4-paper-sheet f4-paper-preview mx-auto bg-white p-6 sm:p-10 rounded-lg shadow-xl border border-slate-300 text-slate-800 space-y-4"
          >
            {/* Kop */}
            <KopSurat profile={schoolProfile} showBorder={true} size="md" />

            {/* Title */}
            <div className="text-center py-1 bg-amber-50/70 border border-amber-200 rounded-lg">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-amber-950">
                LEMBAR DISPOSISI KEPALA SEKOLAH
              </h3>
            </div>

            {/* Table Grid Lembar Disposisi */}
            <table className="w-full border-collapse border border-slate-400 text-xs">
              <tbody>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold bg-slate-50 w-1/3">
                    Nomor Agenda / Indeks:
                  </td>
                  <td className="border border-slate-400 p-2 font-mono font-bold text-blue-800">
                    {disposition.letterInAgenda}
                  </td>
                  <td className="border border-slate-400 p-2 font-semibold bg-slate-50 w-1/4">
                    Tingkat Keamanan:
                  </td>
                  <td className="border border-slate-400 p-2 font-bold text-red-700">
                    {disposition.sifat.toUpperCase()}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold bg-slate-50">
                    Asal Surat Pengirim:
                  </td>
                  <td colSpan={3} className="border border-slate-400 p-2 font-semibold">
                    {disposition.letterInOrigin}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold bg-slate-50">
                    Perihal / Hal Surat:
                  </td>
                  <td colSpan={3} className="border border-slate-400 p-2 font-medium">
                    {disposition.letterInSubject}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold bg-slate-50">
                    Diteruskan Kepada (Bawahan):
                  </td>
                  <td colSpan={3} className="border border-slate-400 p-2 font-bold text-slate-900 bg-amber-50/40">
                    {disposition.toDepartmentName} {disposition.toUserName ? `(${disposition.toUserName})` : ''}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-2 font-semibold bg-slate-50">
                    Batas Waktu Pelaksanaan:
                  </td>
                  <td colSpan={3} className="border border-slate-400 p-2 font-bold text-rose-700">
                    {disposition.deadlineDate} (Mendekati Deadline)
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-400 p-3 font-semibold bg-slate-50 align-top">
                    Instruksi / Disposisi Pimpinan:
                  </td>
                  <td colSpan={3} className="border border-slate-400 p-3 align-top min-h-[90px]">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200 font-semibold text-slate-900">
                      "{disposition.instruction}"
                    </div>
                    {disposition.notes && (
                      <p className="text-[11px] text-slate-500 mt-2">
                        Catatan tambahan: {disposition.notes}
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Checklist Standar Kedinasan */}
            <div className="p-3 border border-slate-300 rounded-lg text-[11px] bg-slate-50">
              <p className="font-bold text-slate-700 mb-1.5">Klasifikasi Petunjuk Tindak Lanjut:</p>
              <div className="grid grid-cols-2 gap-1.5 text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border border-slate-400 inline-block text-center text-[9px] font-bold leading-3">✓</span>
                  Tindak lanjuti segera
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border border-slate-400 inline-block text-center text-[9px] font-bold leading-3">✓</span>
                  Laporkan hasil pelaksanaan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border border-slate-400 inline-block text-center text-[9px] font-bold leading-3">✓</span>
                  Koordinasikan dengan pihak terkait
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 border border-slate-400 inline-block text-center text-[9px] font-bold leading-3">✓</span>
                  Arsipkan dalam berkas kendali
                </span>
              </div>
            </div>

            {/* Tanda Tangan Pimpinan */}
            <div className="pt-4 flex items-end justify-between">
              <div className="p-2 border border-slate-200 rounded-lg text-center flex flex-col items-center">
                <QrCode className="w-10 h-10 text-slate-700 mb-0.5" />
                <span className="text-[8px] font-mono text-slate-400">DISP-ID: {disposition.id}</span>
              </div>

              <div className="text-center w-56 space-y-1 text-xs">
                <p className="text-slate-600">Kepala Sekolah,</p>
                <div className="h-12 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-300 rounded">
                    Paraf Digital Sah
                  </span>
                </div>
                <p className="font-bold text-slate-900 underline">{disposition.fromUserName}</p>
                <p className="text-[10px] font-mono text-slate-500">NIP. {schoolProfile.principalNip}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Sistem Informasi Manajemen Persuratan Sekolah
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
