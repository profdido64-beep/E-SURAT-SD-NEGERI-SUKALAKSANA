import React, { useState } from 'react';
import { X, Plus, Upload, Calendar, Tag, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { LetterIn, LetterCategory, SifatSurat } from '../../types';

interface InputMasukModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: LetterCategory[];
  onSave: (letter: Omit<LetterIn, 'id' | 'createdAt'>) => void;
  nextAgendaNumber: string;
}

export const InputMasukModal: React.FC<InputMasukModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSave,
  nextAgendaNumber,
}) => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [origin, setOrigin] = useState('');
  const [subject, setSubject] = useState('');
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0]);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [sifat, setSifat] = useState<SifatSurat>('Biasa');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [summary, setSummary] = useState('');
  const [fileName, setFileName] = useState('scan_surat_masuk.pdf');
  const [fileSize, setFileSize] = useState('1.2 MB');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin.trim() || !subject.trim() || !referenceNumber.trim()) {
      alert('Mohon lengkapi data nomor surat, asal pengirim, dan perihal.');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);

    onSave({
      agendaNumber: nextAgendaNumber,
      referenceNumber,
      origin,
      subject,
      receivedDate,
      letterDate,
      deadlineDate: deadlineDate || undefined,
      sifat,
      categoryId,
      categoryName: selectedCategory?.name || 'Umum',
      status: 'Diterima',
      summary,
      fileName,
      fileSize,
      archived: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Registrasi Surat Masuk Baru</h3>
              <p className="text-xs text-blue-100">Buku Agenda Persuratan Digital Tata Usaha</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Row 1: Nomor Agenda & Nomor Surat Pengirim */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Agenda Sistem (Auto):
              </label>
              <input
                type="text"
                value={nextAgendaNumber}
                readOnly
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-mono font-bold text-blue-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Surat dari Pengirim: *
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Contoh: 045/Disdik/VIII/2026"
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Row 2: Asal Pengirim & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Asal Instansi / Pengirim: *
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Contoh: Dinas Pendidikan Provinsi DKI"
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori Klasifikasi:
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.code}] {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Perihal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Perihal / Pokok Surat: *
            </label>
            <textarea
              rows={2}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Contoh: Undangan Rapat Koordinasi Persiapan ANBK 2026"
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Row 4: Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tanggal Diterima:
              </label>
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Batas Tindak Lanjut:</span>
                <span className="text-[10px] text-amber-600 font-normal">Optional</span>
              </label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Row 5: Sifat Surat & Upload Pindaian */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sifat / Tingkat Urgensi:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Biasa', 'Penting', 'Segera', 'Rahasia'] as SifatSurat[]).map((s) => (
                  <label
                    key={s}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition ${
                      sifat === s
                        ? 'border-blue-500 bg-blue-50/80 font-bold text-blue-800'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sifat"
                      checked={sifat === s}
                      onChange={() => setSifat(s)}
                      className="hidden"
                    />
                    <span
                      className={`w-2 h-2 rounded-full ${
                        s === 'Segera'
                          ? 'bg-red-500'
                          : s === 'Penting'
                          ? 'bg-amber-500'
                          : s === 'Rahasia'
                          ? 'bg-purple-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Berkas Pindaian (Scan Dokumen PDF):
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50 hover:bg-slate-100/70 transition cursor-pointer">
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <p className="text-xs font-semibold text-slate-700">{fileName}</p>
                <p className="text-[11px] text-slate-400">{fileSize} • Tersimulasi Siap Simpan</p>
              </div>
            </div>
          </div>

          {/* Ringkasan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ringkasan / Catatan Isi:
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Catatan tambahan isi surat..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-600/20"
            >
              Simpan ke Buku Agenda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
