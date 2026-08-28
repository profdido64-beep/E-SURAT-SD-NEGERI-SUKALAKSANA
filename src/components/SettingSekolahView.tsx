import React, { useState } from 'react';
import { Settings, School, Save, CheckCircle2, Shield, FileText, Eye } from 'lucide-react';
import { SchoolProfile } from '../types';
import { KopSurat } from './KopSurat';

interface SettingSekolahViewProps {
  schoolProfile: SchoolProfile;
  onSaveProfile: (profile: SchoolProfile) => void;
}

export const SettingSekolahView: React.FC<SettingSekolahViewProps> = ({
  schoolProfile,
  onSaveProfile,
}) => {
  const [profile, setProfile] = useState<SchoolProfile>(schoolProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-800 text-white rounded-xl">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Pengaturan Profil Sekolah & Kop Surat</h2>
            <p className="text-xs text-slate-500">
              Konfigurasi identitas satuan pendidikan, kop naskah dinas, dan pejabat penandatangan
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>

      {/* Live Kop Surat Preview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between pb-2 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Pratinjau Standar Kop Surat Resmi (Naskah Dinas):</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              📐 Format Kertas: F4 / Folio (215 × 330 mm)
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Kop Resmi Aktif
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto">
          <div className="min-w-[500px] bg-white p-4 rounded-lg shadow-xs border border-slate-200">
            <KopSurat profile={profile} showBorder={true} size="md" />
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            1. Susunan Teks Kepala Surat (Kop Surat Dinas)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Baris 1: Instansi Pembina / Dinas Pendidikan: *
              </label>
              <input
                type="text"
                value={profile.agencyName || 'DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA KABUPATEN CIANJUR'}
                onChange={(e) => setProfile({ ...profile, agencyName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Baris 2: Nama Satuan Pendidikan: *
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Baris 3: Kantor Kecamatan / Wilayah: *
              </label>
              <input
                type="text"
                value={profile.subdistrictOffice || 'KECAMATAN SUKANAGARA'}
                onChange={(e) => setProfile({ ...profile, subdistrictOffice: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Baris 4: Alamat Lengkap & Kode Pos: *
              </label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                required
                placeholder="Kp. Sukalaksana Rt 04/05 Desa Sukalaksana Kec. Sukanagara Kab. Cianjur"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none italic"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Kode Pos:</label>
              <input
                type="text"
                value={profile.postalCode}
                onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Pokok Sekolah Nasional (NPSN):</label>
              <input
                type="text"
                value={profile.npsn}
                onChange={(e) => setProfile({ ...profile, npsn: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Telepon Kantor:</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Resmi Sekolah:</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            2. Data Pejabat Penandatangan Resmi (Kop & Pengesahan)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Kepala Sekolah: *</label>
              <input
                type="text"
                value={profile.principalName}
                onChange={(e) => setProfile({ ...profile, principalName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Kepala Sekolah:</label>
              <input
                type="text"
                value={profile.principalNip}
                onChange={(e) => setProfile({ ...profile, principalNip: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bendahara / Pengelola Keuangan:</label>
              <input
                type="text"
                value={profile.tuHeadName}
                onChange={(e) => setProfile({ ...profile, tuHeadName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">NIP Bendahara Sekolah:</label>
              <input
                type="text"
                value={profile.tuHeadNip}
                onChange={(e) => setProfile({ ...profile, tuHeadNip: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Logo Kop Surat Kedinasan */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            3. Lambang / Logo Resmi Kop Surat (Kiri & Kanan)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Logo Kiri */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Logo Kiri: Lambang Kabupaten Cianjur (Sugih Mukti)
                </span>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Resmi Pemda
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Format standar perisai kuning atas, segitiga gunung hijau, latar biru tua dengan padi emas dan pita &quot;SUGIH MUKTI&quot;.
              </p>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <span className="block text-center px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition">
                    Unggah File Logo Kiri (PNG/JPG)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setProfile({ ...profile, logoCianjurUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {profile.logoCianjurUrl && (
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, logoCianjurUrl: undefined })}
                    className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Logo Kanan */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Logo Kanan: Lambang SD Negeri Sukalaksana (Sukanagara)
                </span>
                <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Resmi Sekolah
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Format lingkaran merah &apos;★ SD NEGERI SUKALAKSANA ★&apos;, padi putih melingkar, buku &amp; obor menyala, pita &apos;SUKANAGARA&apos;.
              </p>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <span className="block text-center px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition">
                    Unggah File Logo Kanan (PNG/JPG)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setProfile({
                            ...profile,
                            logoSchoolUrl: reader.result as string,
                            logoUrl: reader.result as string,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {(profile.logoSchoolUrl || profile.logoUrl) && (
                  <button
                    type="button"
                    onClick={() =>
                      setProfile({ ...profile, logoSchoolUrl: undefined, logoUrl: '' })
                    }
                    className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan Sekolah</span>
          </button>
        </div>
      </form>
    </div>
  );
};
