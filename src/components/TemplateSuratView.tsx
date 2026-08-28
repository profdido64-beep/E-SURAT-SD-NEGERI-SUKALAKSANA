import React, { useState, useRef } from 'react';
import {
  FileCode2,
  Plus,
  Copy,
  Check,
  Sparkles,
  FileText,
  Printer,
  ChevronRight,
  Eye,
  Sliders,
  Send,
  LayoutTemplate,
  Download,
  Loader2
} from 'lucide-react';
import { LetterTemplate, SifatSurat } from '../types';
import { SuratPindahDoc, parseSuratPindahContent } from './SuratPindahDoc';
import { KopSurat } from './KopSurat';
import { printElement, exportElementToPdf } from '../utils/printPdfHelper';

interface TemplateSuratViewProps {
  templates: LetterTemplate[];
  onOpenBuatLetterWithTemplate: (template: LetterTemplate, renderedBody: string) => void;
  onAddNewTemplate: (tpl: Omit<LetterTemplate, 'id'>) => void;
}

export const TemplateSuratView: React.FC<TemplateSuratViewProps> = ({
  templates,
  onOpenBuatLetterWithTemplate,
  onAddNewTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate>(templates[0] || null);
  const [copied, setCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<'paper' | 'raw'>('paper');
  const [isPrinting, setIsPrinting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Variable values test bench
  const [varValues, setVarValues] = useState<Record<string, string>>({
    '{nomor_surat}': '400.3.12.1/023/SD-Skl//VII/2026',
    '{nama_siswa}': 'SITI SALWA',
    '{tempat_tgl_lahir}': 'CIANJUR, 16 Maret 2018',
    '{nis}': '252601027',
    '{nisn}': '3184373447',
    '{nis_nisn}': '252601027 / 3184373447',
    '{jenis_kelamin}': 'PEREMPUAN',
    '{kelas}': 'I (Satu)',
    '{nama_orang_tua}': 'ATIH ROHAYAT',
    '{nama_wali}': 'ATIH ROHAYAT',
    '{alamat_orang_tua}': 'Kp.Cibeungang',
    '{alamat_wali}': 'Kp.Cibeungang',
    '{pekerjaan_orang_tua}': 'Buruh',
    '{pekerjaan_wali}': 'Buruh',
    '{sekolah_tujuan}': 'SD NEGERI SUKARAME Kecamatan Sukanagara Kabupaten Cianjur',
    '{alasan_pindah}': 'Ikut Orangtua',
    '{tanggal_surat}': '30 Juli 2026',
    '{nama_kepala_sekolah}': 'ELI HERAWATI, M.Pd.',
    '{nip_kepala_sekolah}': '196908042008012008',
    '{kelas_tujuan}': 'I (Satu)',
    '{sekolah_asal}': 'SD NEGERI SUKALAKSANA',
    '{nomor_surat_pindah_asal}': '400.3.12.1/023/SD-Skl//VII/2026',
    '{keperluan}': 'Pengajuan Beasiswa Program Indonesia Pintar (PIP) dan Pencairan Rekening SimPel',
    '{tujuan_penerima}': 'Bapak/Ibu Orang Tua / Wali Murid Kelas I s.d VI',
    '{hari_tanggal}': 'Senin, 28 Agustus 2026',
    '{waktu_acara}': '08.30 - 11.30',
    '{tempat_acara}': 'Ruang Serbaguna SD Negeri Sukalaksana',
    '{agenda_rapat}': 'Sosialisasi Program Kerja Sekolah & Penyaluran Bantuan Siswa TA 2026/2027',
    '{nama_guru}': 'ANDHIKA GUMILAR LASMANA, S.Pd., Gr',
    '{nip_nuptk}': '19920514 201902 1 002 / 4536770671130092',
    '{pangkat_golongan}': 'Penata Muda / III/a',
    '{jabatan_guru}': 'Guru Kelas / Bendahara Sekolah',
    '{mata_pelajaran_tugas}': 'Guru Kelas V (Kurikulum Merdeka)',
    '{jumlah_jam_mengajar}': '24',
  });

  const getRenderedContent = () => {
    if (!selectedTemplate) return '';
    let result = selectedTemplate.bodyTemplate;
    Object.entries(varValues).forEach(([placeholder, val]) => {
      result = result.replaceAll(placeholder, val);
    });
    return result;
  };

  const handleDirectPrint = async () => {
    setIsPrinting(true);
    try {
      await printElement(previewRef.current, selectedTemplate ? selectedTemplate.title : 'Template_Surat');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setIsExportingPdf(true);
    try {
      await exportElementToPdf(previewRef.current, {
        filename: `${selectedTemplate ? selectedTemplate.title.replace(/\s+/g, '_') : 'Template_Surat'}.pdf`,
        format: 'f4',
        orientation: 'portrait',
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getRenderedContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuratPindah =
    selectedTemplate &&
    (selectedTemplate.title.toUpperCase().includes('PINDAH') ||
      selectedTemplate.title.toUpperCase().includes('MUTASI KELUAR') ||
      selectedTemplate.code.toUpperCase().includes('PINDAH') ||
      selectedTemplate.code.toUpperCase().includes('MUTASI-KELUAR'));

  const parsedPindahData = isSuratPindah
    ? {
        letterNumber: varValues['{nomor_surat}'] || '400.3.12.1/023/SD-Skl//VII/2026',
        studentName: varValues['{nama_siswa}'] || 'SITI SALWA',
        birthPlaceDate: varValues['{tempat_tgl_lahir}'] || 'CIANJUR, 16 Maret 2018',
        nis: varValues['{nis}'] || '252601027',
        nisn: varValues['{nisn}'] || '3184373447',
        gender: varValues['{jenis_kelamin}'] || 'PEREMPUAN',
        studentClass: varValues['{kelas}'] || 'I (Satu)',
        parentName: varValues['{nama_orang_tua}'] || varValues['{nama_wali}'] || 'ATIH ROHAYAT',
        parentAddress: varValues['{alamat_orang_tua}'] || varValues['{alamat_wali}'] || 'Kp.Cibeungang',
        parentJob: varValues['{pekerjaan_orang_tua}'] || varValues['{pekerjaan_wali}'] || 'Buruh',
        destinationSchool:
          varValues['{sekolah_tujuan}'] ||
          'SD NEGERI SUKARAME Kecamatan Sukanagara Kabupaten Cianjur',
        reason: varValues['{alasan_pindah}'] || 'Ikut Orangtua',
        letterCity: 'Sukanagara',
        letterDate: varValues['{tanggal_surat}'] || '30 Juli 2026',
        principalName: varValues['{nama_kepala_sekolah}'] || 'ELI HERAWATI, M.Pd.',
        principalNip: varValues['{nip_kepala_sekolah}'] || '196908042008012008',
      }
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Master Template Surat Kedinasan</h2>
              <p className="text-xs text-slate-500">
                Pustaka template naskah dinas resmi dengan format presisi F4 & substitusi variabel live
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Template Baru</span>
        </button>
      </div>

      {/* Grid: Templates List & Live Generator Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Templates List */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Daftar Template Aktif ({templates.length})
          </p>

          {templates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`p-4 rounded-xl border transition cursor-pointer ${
                selectedTemplate?.id === tpl.id
                  ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                  {tpl.code}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {tpl.usageCount}x Digunakan
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-xs mt-2">{tpl.title}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{tpl.description}</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-600 font-semibold">
                <span>Pilih & Uji Coba</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Right 8 Cols: Live Interactive Sandbox & Generator */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          {selectedTemplate && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{selectedTemplate.title}</h3>
                  <p className="text-xs text-slate-500">
                    Kategori: <strong>{selectedTemplate.category}</strong> • Ukuran Kertas:{' '}
                    <strong className="text-indigo-600">F4 (215 × 330 mm)</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs font-semibold">
                    <button
                      onClick={() => setPreviewMode('paper')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        previewMode === 'paper'
                          ? 'bg-white text-indigo-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Format F4 Cetak
                    </button>
                    <button
                      onClick={() => setPreviewMode('raw')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        previewMode === 'raw'
                          ? 'bg-white text-indigo-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Teks Mentah
                    </button>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                  </button>

                  <button
                    onClick={handleDownloadPdf}
                    disabled={isExportingPdf}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                    title="Unduh Pratinjau Dokumen sebagai File PDF"
                  >
                    {isExportingPdf ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Simpan PDF</span>
                  </button>

                  <button
                    onClick={handleDirectPrint}
                    disabled={isPrinting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                    title="Cetak Dokumen"
                  >
                    {isPrinting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Printer className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    <span>Cetak</span>
                  </button>

                  <button
                    onClick={() => onOpenBuatLetterWithTemplate(selectedTemplate, getRenderedContent())}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Buat Surat Keluar</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Variables Input Form */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>Isi Parameter Variabel Dinamis (Live Real-Time Substitution):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedTemplate.variables.map((varName) => (
                    <div key={varName}>
                      <label className="block text-[11px] font-mono text-slate-600 font-semibold mb-0.5">
                        {varName}
                      </label>
                      <input
                        type="text"
                        value={varValues[varName] || ''}
                        onChange={(e) =>
                          setVarValues({ ...varValues, [varName]: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Preview Paper */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Pratinjau Hasil Dokumen Resmi (Presisi Format):
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Auto-Replaced
                  </span>
                </div>

                {previewMode === 'paper' ? (
                  <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 max-h-[500px] overflow-y-auto flex justify-center">
                    <div
                      ref={previewRef}
                      className="w-full max-w-[650px] bg-white p-6 rounded shadow-md border border-slate-200"
                    >
                      {isSuratPindah ? (
                        <SuratPindahDoc data={parsedPindahData} />
                      ) : (
                        <div className="space-y-4">
                          <KopSurat showBorder={true} size="sm" />
                          <div className="font-serif text-xs whitespace-pre-line leading-relaxed text-black pt-2">
                            {getRenderedContent()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto border border-slate-800">
                    {getRenderedContent()}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
