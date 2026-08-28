import React from 'react';
import { SchoolProfile } from '../types';
import { KopSurat } from './KopSurat';

export interface SuratPindahData {
  letterNumber?: string;
  // Data Siswa
  studentName?: string;
  birthPlaceDate?: string;
  nis?: string;
  nisn?: string;
  gender?: string;
  studentClass?: string;
  // Data Orang Tua / Wali
  parentName?: string;
  parentAddress?: string;
  parentJob?: string;
  // Keterangan Pindah
  destinationSchool?: string;
  reason?: string;
  // Surat Info
  letterCity?: string;
  letterDate?: string;
  principalName?: string;
  principalNip?: string;
}

export function parseSuratPindahContent(
  content: string,
  letterNumber?: string,
  destination?: string,
  letterDate?: string,
  profile?: SchoolProfile
): SuratPindahData {
  const lines = content.split('\n');
  const getVal = (regex: RegExp) => {
    for (const line of lines) {
      const match = line.match(regex);
      if (match && match[1]) return match[1].trim();
    }
    return '';
  };

  const studentName = getVal(/(?:Nama\s+Lengkap|Nama)\s*:\s*([^\n\r]+)/i);
  const birthPlaceDate = getVal(
    /(?:Tempat[,\/]\s*Tanggal\s*Lahir|Tempat\s*Tanggal\s*Lahir)\s*:\s*([^\n\r]+)/i
  );
  const nis = getVal(/(?:Nomor\s+Induk\s+Siswa|Nomor\s+Induk|NIS)\s*:\s*([^\n\r]+)/i);
  const nisn = getVal(/NISN\s*:\s*([^\n\r]+)/i);
  const gender = getVal(/(?:Jenis\s+Kelamin)\s*:\s*([^\n\r]+)/i);
  const studentClass = getVal(/(?:Tingkat\s*\/\s*Kelas|Kelas)\s*:\s*([^\n\r]+)/i);

  // Extract parent data
  let parentName = '';
  let parentAddress = '';
  let parentJob = '';

  const parentMatch = content.match(
    /Menerangkan dengan sesungguhnya bahwa:[\s\S]*?(?:Nama\s*:\s*([^\n\r]+))[\s\S]*?(?:Alamat\s*:\s*([^\n\r]+))[\s\S]*?(?:Pekerjaan\s*:\s*([^\n\r]+))/i
  );
  if (parentMatch) {
    parentName = parentMatch[1]?.trim() || '';
    parentAddress = parentMatch[2]?.trim() || '';
    parentJob = parentMatch[3]?.trim() || '';
  } else {
    parentName = getVal(
      /(?:Nama\s+Orang\s+Tua\s*\/\s*Wali|Nama\s+Wali|Nama\s+Orang\s+Tua)\s*:\s*([^\n\r]+)/i
    );
    parentAddress = getVal(
      /(?:Alamat\s+Orang\s+Tua\s*\/\s*Wali|Alamat\s+Rumah|Alamat)\s*:\s*([^\n\r]+)/i
    );
    parentJob = getVal(
      /(?:Pekerjaan\s+Orang\s+Tua|Pekerjaan\s+Wali|Pekerjaan)\s*:\s*([^\n\r]+)/i
    );
  }

  // Extract destination school & reason
  let destinationSchool = '';
  let reason = '';
  const moveMatch = content.match(/pindah ke\s+([^\n\r]+?)\s+dengan alasan\s+([^\n\r.]+)/i);
  if (moveMatch) {
    destinationSchool = moveMatch[1].trim();
    reason = moveMatch[2].trim();
  }

  let formattedDate = '30 Juli 2026';
  if (letterDate) {
    try {
      const d = new Date(letterDate);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } else {
        formattedDate = letterDate;
      }
    } catch {
      formattedDate = letterDate;
    }
  }

  return {
    letterNumber: letterNumber || '400.3.12.1/023/SD-Skl//VII/2026',
    studentName: studentName || 'SITI SALWA',
    birthPlaceDate: birthPlaceDate || 'CIANJUR, 16 Maret 2018',
    nis: nis || '252601027',
    nisn: nisn || '3184373447',
    gender: gender || 'PEREMPUAN',
    studentClass: studentClass || 'I (Satu)',
    parentName: parentName || 'ATIH ROHAYAT',
    parentAddress: parentAddress || 'Kp.Cibeungang',
    parentJob: parentJob || 'Buruh',
    destinationSchool:
      destinationSchool || destination || 'SD NEGERI SUKARAME Kecamatan Sukanagara Kabupaten Cianjur',
    reason: reason || 'Ikut Orangtua',
    letterCity: 'Sukanagara',
    letterDate: formattedDate,
    principalName: profile?.principalName || 'ELI HERAWATI, M.Pd.',
    principalNip: profile?.principalNip || '196908042008012008',
  };
}

interface SuratPindahDocProps {
  data?: SuratPindahData;
  schoolProfile?: SchoolProfile;
  className?: string;
  isPrintOnly?: boolean;
}

export const SuratPindahDoc: React.FC<SuratPindahDocProps> = ({
  data,
  schoolProfile,
  className = '',
}) => {
  const profile = schoolProfile || {
    name: 'SD NEGERI SUKALAKSANA',
    agencyName: 'DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA KABUPATEN CIANJUR',
    subdistrictOffice: 'KECAMATAN SUKANAGARA',
    address: 'Kp. Sukalaksana Desa Sukalaksana Kec. Sukanagara Kab. Cianjur',
    postalCode: '43264',
    city: 'Kabupaten Cianjur',
    principalName: 'ELI HERAWATI, M.Pd.',
    principalNip: '196908042008012008',
  };

  const letterNumber = data?.letterNumber || '400.3.12.1/023/SD-Skl//VII/2026';
  const studentName = data?.studentName || 'SITI SALWA';
  const birthPlaceDate = data?.birthPlaceDate || 'CIANJUR, 16 Maret 2018';
  const nis = data?.nis || '252601027';
  const nisn = data?.nisn || '3184373447';
  const gender = data?.gender || 'PEREMPUAN';
  const studentClass = data?.studentClass || 'I (Satu)';

  const parentName = data?.parentName || 'ATIH ROHAYAT';
  const parentAddress = data?.parentAddress || 'Kp.Cibeungang';
  const parentJob = data?.parentJob || 'Buruh';

  const destinationSchool =
    data?.destinationSchool ||
    'SD NEGERI SUKARAME Kecamatan Sukanagara Kabupaten Cianjur';
  const reason = data?.reason || 'Ikut Orangtua';

  const letterCity = data?.letterCity || 'Sukanagara';
  const letterDate = data?.letterDate || '30 Juli 2026';
  const principalName = data?.principalName || profile.principalName || 'ELI HERAWATI, M.Pd.';
  const principalNip = data?.principalNip || profile.principalNip || '196908042008012008';

  return (
    <div
      className={`bg-white text-black leading-normal select-text ${className}`}
      style={{
        fontFamily: '"Times New Roman", Times, "Bookman Old Style", Georgia, serif',
        color: '#000000',
      }}
    >
      {/* 1. KOP SURAT RESMI (Presisi Sesuai Spesifikasi) */}
      <KopSurat profile={profile as any} showBorder={true} size="md" />

      {/* 2. JUDUL DAN NOMOR SURAT */}
      <div className="text-center mt-4 mb-3">
        <h2
          className="font-bold uppercase tracking-wide inline-block border-b-[1.5px] border-black pb-0.5 text-black"
          style={{ fontSize: '12pt' }}
        >
          SURAT KETERANGAN PINDAH SEKOLAH
        </h2>
        <p className="font-semibold text-black mt-0.5" style={{ fontSize: '11pt' }}>
          {letterNumber}
        </p>
      </div>

      {/* 3. PARAGRAF PEMBUKA */}
      <p className="text-justify text-black text-[10.5pt] leading-relaxed mb-2">
        Yang bertandatangan di bawah ini, Kepala Sekolah Dasar Negeri Sukalaksana Desa Sukalaksana
        Kecamatan Sukanagara Kabupaten Cianjur, menerangkan bahwa:
      </p>

      {/* 4. DATA SISWA */}
      <div className="text-[10.5pt] space-y-1 mb-2">
        <div className="flex">
          <span className="w-44 shrink-0">Nama</span>
          <span className="w-4 shrink-0">:</span>
          <span className="font-bold uppercase text-black">{studentName}</span>
        </div>
        <div className="flex">
          <span className="w-44 shrink-0">Tempat/Tanggal Lahir</span>
          <span className="w-4 shrink-0">:</span>
          <span className="text-black">{birthPlaceDate}</span>
        </div>
        <div className="flex">
          <span className="w-44 shrink-0">Nomor Induk Siswa</span>
          <span className="w-4 shrink-0">:</span>
          <span className="text-black">{nis}</span>
        </div>
        <div className="flex">
          <span className="w-44 shrink-0">NISN</span>
          <span className="w-4 shrink-0">:</span>
          <span className="text-black">{nisn}</span>
        </div>
        <div className="flex">
          <span className="w-44 shrink-0">Jenis Kelamin</span>
          <span className="w-4 shrink-0">:</span>
          <span className="uppercase text-black">{gender}</span>
        </div>
        <div className="flex">
          <span className="w-44 shrink-0">Kelas</span>
          <span className="w-4 shrink-0">:</span>
          <span className="text-black">{studentClass}</span>
        </div>
      </div>

      {/* 5. DATA ORANG TUA / WALI */}
      <p className="text-black text-[10.5pt] mb-1">Menerangkan dengan sesungguhnya bahwa:</p>
      <div className="text-[10.5pt] space-y-1 mb-2.5">
        <div className="flex">
          <span className="w-44 shrink-0">Nama</span>
          <span className="w-4 shrink-0">:</span>
          <span className="font-bold uppercase text-black">{parentName}</span>
        </div>
        <div className="flex">
          <span className="w-44 shrink-0">Alamat</span>
          <span className="w-4 shrink-0">:</span>
          <span className="text-black">{parentAddress}</span>
        </div>
        <div className="flex">
          <span className="w-44 shrink-0">Pekerjaan</span>
          <span className="w-4 shrink-0">:</span>
          <span className="text-black">{parentJob}</span>
        </div>
      </div>

      {/* 6. KETERANGAN ALASAN PINDAH */}
      <p className="text-justify text-black text-[10.5pt] leading-relaxed mb-2.5">
        Telah mengajukan pindah ke <strong className="font-semibold">{destinationSchool}</strong>{' '}
        dengan alasan <strong className="font-semibold">{reason}</strong>. Bersama ini kami sertakan
        Buku Laporan Pendidikan (Raport) yang bersangkutan
      </p>

      {/* 7. PENUTUP */}
      <p className="text-black text-[10.5pt] mb-4">Demikian dan terimakasih atas perhatiannya.</p>

      {/* 8. TITIMANGSA & TANDA TANGAN KEPALA SEKOLAH (RATA KANAN) */}
      <div className="flex justify-end mb-4">
        <div className="w-64 text-left text-[10.5pt]">
          <p>
            {letterCity}, {letterDate}
          </p>
          <p>Kepala Sekolah</p>

          <div className="h-16 flex items-center">
            {/* Ruang TTD */}
          </div>

          <p className="font-bold underline text-black">{principalName}</p>
          <p className="text-black">NIP. {principalNip}</p>
        </div>
      </div>

      {/* 9. LEMBAR BALASAN SEKOLAH PENERIMA (GARIS GUNTING) */}
      <div className="pt-2 border-t border-transparent">
        <p className="text-[9pt] text-black italic mb-1 leading-tight">
          Setelah anak tersebut diterima di sekolah ini, isian di bawah ini harap diisi, dan lembar
          ke-2 dikirim kembali kepada kami.
        </p>

        {/* Garis putus-putus gunting */}
        <div className="relative flex items-center my-1.5">
          <span className="text-[12px] -mr-1">✂</span>
          <div className="flex-1 border-t-[1.5px] border-dashed border-black"></div>
        </div>

        {/* Nomor Statistik Sekolah di kanan */}
        <div className="flex justify-end text-[9.5pt] mb-1">
          <p>
            Nomor Statistik Sekolah: <span className="tracking-widest">..................................</span>
          </p>
        </div>

        {/* Formulir Balasan 2 Kolom (Data Kiri, Tanda Tangan Kanan) */}
        <div className="grid grid-cols-12 gap-2 text-[9.5pt]">
          {/* Kolom Kiri: Isian Sekolah */}
          <div className="col-span-7 space-y-1">
            <div className="flex">
              <span className="w-32 shrink-0">Nama Sekolah</span>
              <span className="w-3 shrink-0">:</span>
              <span className="flex-1 overflow-hidden tracking-wider text-black">
                .................................................................
              </span>
            </div>
            <div className="flex">
              <span className="w-32 shrink-0">Desa/Kelurahan</span>
              <span className="w-3 shrink-0">:</span>
              <span className="flex-1 overflow-hidden tracking-wider text-black">
                .................................................................
              </span>
            </div>
            <div className="flex">
              <span className="w-32 shrink-0">Kecamatan</span>
              <span className="w-3 shrink-0">:</span>
              <span className="flex-1 overflow-hidden tracking-wider text-black">
                .................................................................
              </span>
            </div>
            <div className="flex">
              <span className="w-32 shrink-0">Kabupaten/Kota</span>
              <span className="w-3 shrink-0">:</span>
              <span className="flex-1 overflow-hidden tracking-wider text-black">
                .................................................................
              </span>
            </div>
            <div className="flex">
              <span className="w-32 shrink-0">Provinsi</span>
              <span className="w-3 shrink-0">:</span>
              <span className="flex-1 overflow-hidden tracking-wider text-black">
                .................................................................
              </span>
            </div>
            <div className="flex">
              <span className="w-32 shrink-0">Diterima tanggal</span>
              <span className="w-3 shrink-0">:</span>
              <span className="flex-1 overflow-hidden tracking-wider text-black">
                .................................................................
              </span>
            </div>
            <div className="flex">
              <span className="w-32 shrink-0">Di Kelas</span>
              <span className="w-3 shrink-0">:</span>
              <span className="text-black">
                .........(....................)
              </span>
            </div>
          </div>

          {/* Kolom Kanan: TTD Kepala Sekolah Penerima */}
          <div className="col-span-5 text-left text-[9.5pt] pl-4 flex flex-col justify-between">
            <div>
              <p className="tracking-widest">........................................</p>
              <p>Kepala Sekolah,</p>
            </div>

            <div className="pt-8">
              <p>(____________________)</p>
              <p>
                NIP. <span className="tracking-widest">...............................</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
