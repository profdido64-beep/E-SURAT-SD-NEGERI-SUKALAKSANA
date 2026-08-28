import React, { useState } from 'react';
import { Tags, Building2, Plus, Edit, Trash2, CheckCircle2, Shield } from 'lucide-react';
import { LetterCategory, Department } from '../types';

interface MasterDataViewProps {
  type: 'kategori' | 'bidang';
  categories: LetterCategory[];
  departments: Department[];
  onAddCategory: (cat: Omit<LetterCategory, 'id'>) => void;
  onAddDepartment: (dept: Omit<Department, 'id'>) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  type,
  categories,
  departments,
  onAddCategory,
  onAddDepartment,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for Category
  const [catCode, setCatCode] = useState('');
  const [catName, setCatName] = useState('');
  const [catPrefix, setCatPrefix] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Form states for Department
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptLeader, setDeptLeader] = useState('');
  const [deptDesc, setDeptDesc] = useState('');

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catCode || !catName) return;
    onAddCategory({
      code: catCode,
      name: catName,
      prefix: catPrefix || 'GEN',
      description: catDesc,
    });
    setShowAddModal(false);
    setCatCode('');
    setCatName('');
    setCatPrefix('');
    setCatDesc('');
  };

  const handleSaveDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptCode || !deptName) return;
    onAddDepartment({
      code: deptCode,
      name: deptName,
      leaderName: deptLeader,
      description: deptDesc,
    });
    setShowAddModal(false);
    setDeptCode('');
    setDeptName('');
    setDeptLeader('');
    setDeptDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-600 text-white rounded-xl">
            {type === 'kategori' ? <Tags className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {type === 'kategori' ? 'Master Kategori & Indeks Klasifikasi Surat' : 'Master Bidang & Struktur Organisasi Unit'}
            </h2>
            <p className="text-xs text-slate-500">
              {type === 'kategori'
                ? 'Standar tata naskah dinas Permendikbudristek untuk indeks kode persuratan'
                : 'Unit pelaksana teknis tujuan disposisi dan pengusul surat kedinasan'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah {type === 'kategori' ? 'Kategori Surat' : 'Bidang / Unit'}</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          {type === 'kategori' ? (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Kode Indeks</th>
                  <th className="px-4 py-3.5">Prefiks</th>
                  <th className="px-4 py-3.5">Nama Klasifikasi Kategori</th>
                  <th className="px-4 py-3.5">Deskripsi Peruntukan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-blue-700">{cat.code}</td>
                    <td className="px-4 py-3.5 font-mono font-semibold text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px]">{cat.prefix}</span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">{cat.name}</td>
                    <td className="px-4 py-3.5 text-slate-600">{cat.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Kode Unit</th>
                  <th className="px-4 py-3.5">Nama Bidang / Unit Kerja</th>
                  <th className="px-4 py-3.5">Penanggung Jawab / Pejabat</th>
                  <th className="px-4 py-3.5">Deskripsi Tupoksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-indigo-700">{dept.code}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">{dept.name}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-700">{dept.leaderName}</td>
                    <td className="px-4 py-3.5 text-slate-600">{dept.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">
              Tambah {type === 'kategori' ? 'Kategori Klasifikasi Baru' : 'Bidang / Unit Kerja Baru'}
            </h3>

            {type === 'kategori' ? (
              <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Indeks (e.g. 421.4): *</label>
                  <input
                    type="text"
                    value={catCode}
                    onChange={(e) => setCatCode(e.target.value)}
                    required
                    placeholder="421.4"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prefiks (e.g. SAR):</label>
                  <input
                    type="text"
                    value={catPrefix}
                    onChange={(e) => setCatPrefix(e.target.value)}
                    placeholder="SAR"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Kategori: *</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    required
                    placeholder="Sarana & Inventaris Sekolah"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deskripsi:</label>
                  <textarea
                    rows={2}
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Surat berita acara serah terima aset..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSaveDepartment} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Singkatan (e.g. LAB): *</label>
                  <input
                    type="text"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    required
                    placeholder="LAB"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Bidang / Bagian: *</label>
                  <input
                    type="text"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    required
                    placeholder="Laboratorium Komputer & Multimedia"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Pejabat / Kepala:</label>
                  <input
                    type="text"
                    value={deptLeader}
                    onChange={(e) => setDeptLeader(e.target.value)}
                    placeholder="Budi Santoso, S.Kom."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deskripsi:</label>
                  <textarea
                    rows={2}
                    value={deptDesc}
                    onChange={(e) => setDeptDesc(e.target.value)}
                    placeholder="Pengelolaan sarana laboratorium IT..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
