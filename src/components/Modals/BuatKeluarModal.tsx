import React, { useState } from 'react';
import { X, FileUp, Sparkles, FileText, Send, CheckCircle2 } from 'lucide-react';
import { LetterOut, LetterCategory, LetterTemplate, SifatSurat, User, Department } from '../../types';

interface BuatKeluarModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: LetterCategory[];
  departments: Department[];
  templates: LetterTemplate[];
  currentUser: User;
  onSave: (letter: Omit<LetterOut, 'id' | 'createdAt'>) => void;
  nextLetterNumber: string;
}

export const BuatKeluarModal: React.FC<BuatKeluarModalProps> = ({
  isOpen,
  onClose,
  categories,
  departments,
  templates,
  currentUser,
  onSave,
  nextLetterNumber,
}) => {
  const [destination, setDestination] = useState('');
  const [subject, setSubject] = useState('');
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0]);
  const [senderDepartment, setSenderDepartment] = useState('Bendahara & Pengelolaan Keuangan');
  const [sifat, setSifat] = useState<SifatSurat>('Biasa');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [content, setContent] = useState('');
  const [signeeName, setSigneeName] = useState('ELI HERAWATI, M.Pd');
  const [signeePosition, setSigneePosition] = useState('Kepala Sekolah');
  const [notes, setNotes] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [attachmentCount, setAttachmentCount] = useState(0);

  if (!isOpen) return null;

  const handleTemplateApply = (tplId: string) => {
    setSelectedTemplateId(tplId);
    if (!tplId) return;
    const tpl = templates.find((t) => t.id === tplId);
    if (tpl) {
      setContent(tpl.bodyTemplate);
      setSubject(tpl.title);
      setSifat(tpl.defaultSifat);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !subject.trim() || !content.trim()) {
      alert('Mohon lengkapi data tujuan, perihal, dan isi surat.');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);

    onSave({
      letterNumber: nextLetterNumber,
      destination,
      subject,
      letterDate,
      senderDepartment,
      authorId: currentUser.id,
      authorName: currentUser.name,
      sifat,
      categoryId,
      categoryName: selectedCategory?.name || 'Umum',
      approvalStatus: currentUser.role === 'Kepala Sekolah' ? 'Disetujui' : 'Diajukan',
      status: currentUser.role === 'Kepala Sekolah' ? 'Siap Kirim' : 'Menunggu Approval',
      content,
      signeeName,
      signeePosition,
      notes: notes || 'Diajukan untuk persetujuan tanda tangan elektronik pimpinan.',
      attachmentCount,
      fileName: `surat_${nextLetterNumber.replace(/[\/\\]/g, '_')}.pdf`,
      archived: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Buat Surat Keluar Kedinasan</h3>
              <p className="text-xs text-emerald-100">Drafting Persuratan Resmi & Workflow Approval</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Template Selector Bar */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900">Gunakan Format Master Template:</span>
            </div>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateApply(e.target.value)}
              className="px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-800 outline-none"
            >
              <option value="">-- Pilih Template Siap Pakai --</option>
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.title}
                </option>
              ))}
            </select>
          </div>

          {/* Row 1: Nomor Surat & Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Surat Resmi (Auto-Format):
              </label>
              <input
                type="text"
                value={nextLetterNumber}
                readOnly
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Surat:
              </label>
              <input
                type="date"
                value={letterDate}
                onChange={(e) => setLetterDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Row 2: Tujuan & Bagian Pengirim */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tujuan Surat (Instansi / Nama): *
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Contoh: Kepala Dinas Pendidikan DKI / Orang Tua Siswa"
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bagian Pengusul:
              </label>
              <select
                value={senderDepartment}
                onChange={(e) => setSenderDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    [{d.code}] {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Perihal & Sifat */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Perihal Surat: *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Contoh: Surat Pengantar Laporan Bulanan"
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sifat Surat:
              </label>
              <select
                value={sifat}
                onChange={(e) => setSifat(e.target.value as SifatSurat)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Biasa">Biasa</option>
                <option value="Penting">Penting</option>
                <option value="Segera">Segera</option>
                <option value="Rahasia">Rahasia</option>
              </select>
            </div>
          </div>

          {/* Row 4: Isi Teks Surat */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Isi Lembar Surat Dinas: *
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan badan paragraf surat secara lengkap di sini..."
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-sans focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
            />
          </div>

          {/* Row 5: Penandatangan & Lampiran */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pejabat Penandatangan:
              </label>
              <input
                type="text"
                value={signeeName}
                onChange={(e) => setSigneeName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jabatan:
              </label>
              <input
                type="text"
                value={signeePosition}
                onChange={(e) => setSigneePosition(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jumlah Berkas Lampiran:
              </label>
              <input
                type="number"
                min="0"
                value={attachmentCount}
                onChange={(e) => setAttachmentCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              * Status awal akan otomatis diajukan ke Kepala Sekolah untuk verifikasi.
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan & Ajukan Surat</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
