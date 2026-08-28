import React, { useState } from 'react';
import { Users, Plus, Shield, Mail, CheckCircle2, UserCheck, Key } from 'lucide-react';
import { User, UserRole, Department } from '../types';

interface UserManagementViewProps {
  users: User[];
  departments: Department[];
  onAddUser: (user: Omit<User, 'id'>) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  departments,
  onAddUser,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nip, setNip] = useState('');
  const [role, setRole] = useState<UserRole>('Bendahara');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const dept = departments.find((d) => d.id === departmentId);
    onAddUser({
      name,
      email,
      nip,
      role,
      departmentId,
      departmentName: dept?.name || 'Bendahara & Pengelolaan Keuangan',
      status: 'Aktif',
    });
    setShowAddModal(false);
    setName('');
    setEmail('');
    setNip('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 text-white rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Manajemen Data Pengguna & Hak Akses (RBAC)</h2>
            <p className="text-xs text-slate-500">
              Pengaturan akun Kepala Sekolah, Bendahara Sekolah, Tenaga Pendidik, dan Administrator
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Akun Pengguna</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Nama Pegawai & Gelar</th>
                <th className="px-4 py-3.5">Email Kedinasan</th>
                <th className="px-4 py-3.5">NIP / NUPTK</th>
                <th className="px-3 py-3.5">Peran / Hak Akses</th>
                <th className="px-3 py-3.5">Unit / Bidang Kerja</th>
                <th className="px-3 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {u.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-slate-600 font-mono">{u.email}</td>
                  <td className="px-4 py-3.5 text-slate-600 font-mono">{u.nip || '-'}</td>

                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        u.role === 'Administrator'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : u.role === 'Kepala Sekolah'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : u.role === 'Bendahara'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="px-3 py-3.5 text-slate-700 font-medium">
                    {u.departmentName || 'Bendahara & Pengelolaan Keuangan'}
                  </td>

                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-800">Tambah Akun Pegawai / Pengguna</h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar: *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="ANDHIKA GUMILAR LASMANA, S.Pd., Gr"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Sekolah: *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="andhika.bendahara@sdnsukalaksana.sch.id"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">NIP (Optional):</label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="19920514 201902 1 002"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Peran Akses (Role):</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                >
                  <option value="Bendahara">Bendahara</option>
                  <option value="Kepala Sekolah">Kepala Sekolah</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Guru">Guru</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit Kerja:</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
