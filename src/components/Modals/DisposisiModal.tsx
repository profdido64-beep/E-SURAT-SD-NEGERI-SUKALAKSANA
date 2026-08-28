import React, { useState } from 'react';
import { X, Send, GitPullRequest, Clock, AlertTriangle, CheckSquare, User, Building } from 'lucide-react';
import { LetterIn, Disposition, Department, User as UserType, SifatSurat } from '../../types';

interface DisposisiModalProps {
  isOpen: boolean;
  onClose: () => void;
  lettersIn: LetterIn[];
  departments: Department[];
  users: UserType[];
  currentUser: UserType;
  targetLetter?: LetterIn | null;
  onSave: (disp: Omit<Disposition, 'id' | 'createdAt'>) => void;
}

export const DisposisiModal: React.FC<DisposisiModalProps> = ({
  isOpen,
  onClose,
  lettersIn,
  departments,
  users,
  currentUser,
  targetLetter,
  onSave,
}) => {
  const [selectedLetterId, setSelectedLetterId] = useState(targetLetter?.id || lettersIn[0]?.id || '');
  const [toDepartmentId, setToDepartmentId] = useState(departments[2]?.id || departments[0]?.id || '');
  const [toUserId, setToUserId] = useState('');
  const [instruction, setInstruction] = useState('');
  const [notes, setNotes] = useState('');
  const [deadlineDate, setDeadlineDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // default 3 days
  );
  const [sifat, setSifat] = useState<SifatSurat>(targetLetter?.sifat || 'Segera');
  const [isPriority, setIsPriority] = useState(true);

  // Quick instruction presets
  const quickInstructions = [
    'Tindak lanjuti segera dan laporkan hasilnya',
    'Hadiri rapat / koordinasi mewakili sekolah',
    'Siapkan bahan materi & data pendukung',
    'Koordinasikan dengan pihak terkait / guru mapel',
    'Arsipkan dan masukkan buku kendali',
    'Pelajari dan buat draft tanggapan resmi',
  ];

  if (!isOpen) return null;

  const currentSelectedLetter = lettersIn.find((l) => l.id === selectedLetterId) || targetLetter || lettersIn[0];

  const handleQuickInstructionToggle = (text: string) => {
    if (instruction.includes(text)) {
      setInstruction(instruction.replace(text, '').replace(/,\s*,/g, ',').trim());
    } else {
      setInstruction(instruction ? `${instruction}; ${text}` : text);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedLetter) {
      alert('Tidak ada surat masuk yang dipilih.');
      return;
    }
    if (!instruction.trim()) {
      alert('Mohon isi instruksi disposisi.');
      return;
    }

    const dept = departments.find((d) => d.id === toDepartmentId);
    const assignedUser = users.find((u) => u.id === toUserId);

    onSave({
      letterInId: currentSelectedLetter.id,
      letterInAgenda: currentSelectedLetter.agendaNumber,
      letterInSubject: currentSelectedLetter.subject,
      letterInOrigin: currentSelectedLetter.origin,
      letterInDeadline: deadlineDate,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromRole: currentUser.role,
      toDepartmentId,
      toDepartmentName: dept?.name || 'Unit Kerja',
      toUserId: assignedUser?.id,
      toUserName: assignedUser?.name,
      instruction,
      notes,
      deadlineDate,
      sifat,
      status: 'Belum Ditindaklanjuti',
      isPriority,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Terbitkan Lembar Disposisi Digital</h3>
              <p className="text-xs text-amber-100">Instruksi Pimpinan & Penugasan Unit Kerja</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-amber-100 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Target Surat Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pilih Surat Masuk yang Didisposisikan: *
            </label>
            <select
              value={selectedLetterId}
              onChange={(e) => setSelectedLetterId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-amber-500"
            >
              {lettersIn.map((l) => (
                <option key={l.id} value={l.id}>
                  [{l.agendaNumber}] {l.origin} - {l.subject.slice(0, 50)}...
                </option>
              ))}
            </select>
          </div>

          {/* Letter preview pill */}
          {currentSelectedLetter && (
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-slate-700">
              <div className="flex items-center justify-between text-amber-900 font-bold mb-1">
                <span>Agenda: {currentSelectedLetter.agendaNumber}</span>
                <span>Asal: {currentSelectedLetter.origin}</span>
              </div>
              <p className="font-medium text-slate-800 line-clamp-2">
                Perihal: {currentSelectedLetter.subject}
              </p>
            </div>
          )}

          {/* Diteruskan Kepada Bidang / Staf */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Diteruskan Kepada Unit / Bidang: *
              </label>
              <select
                value={toDepartmentId}
                onChange={(e) => setToDepartmentId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.leaderName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pejabat / Staf Pelaksana:
              </label>
              <select
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="">-- Ditujukan ke Seluruh Staf Unit --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Instruction Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilihan Cepat Instruksi Standar Kedinasan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickInstructions.map((q, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleQuickInstructionToggle(q)}
                  className={`text-left p-2 rounded-lg text-xs border transition flex items-start gap-2 ${
                    instruction.includes(q)
                      ? 'bg-amber-100/70 border-amber-400 text-amber-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instruction */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Isi Arahan / Instruksi Disposisi: *
            </label>
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Tuliskan petunjuk tindak lanjut pimpinan secara spesifik..."
              required
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Batas Waktu & Prioritas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Batas Waktu (Deadline): *
              </label>
              <input
                type="date"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sifat Disposisi:
              </label>
              <select
                value={sifat}
                onChange={(e) => setSifat(e.target.value as SifatSurat)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="Segera">Segera</option>
                <option value="Penting">Penting</option>
                <option value="Biasa">Biasa</option>
                <option value="Rahasia">Rahasia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prioritas Utama:
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-xs font-semibold text-slate-700">Tampilkan di Dashboard</span>
              </label>
            </div>
          </div>

          {/* Footer */}
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
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-amber-600/20 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Terbitkan Disposisi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
