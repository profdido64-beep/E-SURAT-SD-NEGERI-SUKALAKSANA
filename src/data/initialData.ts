import {
  LetterIn,
  LetterOut,
  Disposition,
  LetterTemplate,
  LetterCategory,
  Department,
  User,
  ActivityLog,
  SchoolProfile,
  ArchiveRecord
} from '../types';

export const initialSchoolProfile: SchoolProfile = {
  name: 'SD NEGERI SUKALAKSANA',
  agencyName: 'DINAS PENDIDIKAN PEMUDA DAN OLAHRAGA KABUPATEN CIANJUR',
  subdistrictOffice: 'KECAMATAN SUKANAGARA',
  npsn: '20214589',
  address: 'Kp. Sukalaksana Desa Sukalaksana Kec. Sukanagara Kab. Cianjur',
  subdistrict: 'Kecamatan Sukanagara',
  city: 'Kabupaten Cianjur',
  province: 'Jawa Barat',
  postalCode: '43264',
  phone: '(0263) 340129',
  email: 'sdnsukalaksana@gmail.com',
  website: 'https://sdnsukalaksana.sch.id',
  principalName: 'ELI HERAWATI, M.Pd.',
  principalNip: '196908042008012008',
  tuHeadName: 'ANDHIKA GUMILAR LASMANA, S.Pd., Gr',
  tuHeadNip: '19920514 201902 1 002',
  logoUrl: '',
};

export const initialUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Administrator',
    email: 'admin@sdnsukalaksana.sch.id',
    nip: '19850918 201001 1 012',
    role: 'Administrator',
    departmentId: 'DEP-001',
    departmentName: 'Bendahara & Pengelolaan Keuangan',
    status: 'Aktif',
  },
  {
    id: 'USR-002',
    name: 'ELI HERAWATI, M.Pd',
    email: 'kepsek@sdnsukalaksana.sch.id',
    nip: '19750812 200003 2 003',
    role: 'Kepala Sekolah',
    departmentId: 'DEP-002',
    departmentName: 'Pimpinan / Kepala Sekolah',
    status: 'Aktif',
  },
  {
    id: 'USR-003',
    name: 'ANDHIKA GUMILAR LASMANA, S.Pd., Gr',
    email: 'andhika.bendahara@sdnsukalaksana.sch.id',
    nip: '19920514 201902 1 002',
    role: 'Bendahara',
    departmentId: 'DEP-001',
    departmentName: 'Bendahara & Pengelolaan Keuangan',
    status: 'Aktif',
  },
  {
    id: 'USR-004',
    name: 'Siti Rohayati, S.Pd.SD',
    email: 'siti.guru@sdnsukalaksana.sch.id',
    nip: '19880315 201402 2 004',
    role: 'Guru',
    departmentId: 'DEP-003',
    departmentName: 'Dewan Guru & Tenaga Kependidikan',
    status: 'Aktif',
  },
];

export const initialDepartments: Department[] = [
  {
    id: 'DEP-001',
    code: 'BEND',
    name: 'Bendahara & Pengelolaan Keuangan',
    leaderName: 'ANDHIKA GUMILAR LASMANA, S.Pd., Gr',
    description: 'Pengelolaan administrasi keuangan sekolah, belanja operasional BOS/BOSP, dan kearsipan transaksi.',
    letterCount: 3,
  },
  {
    id: 'DEP-002',
    code: 'KS',
    name: 'Kepala Sekolah / Pimpinan',
    leaderName: 'ELI HERAWATI, M.Pd',
    description: 'Pimpinan satuan pendidikan penanggung jawab persuratan dan disposisi kedinasan.',
    letterCount: 3,
  },
  {
    id: 'DEP-003',
    code: 'GURU',
    name: 'Dewan Guru & Tenaga Kependidikan',
    leaderName: 'ELI HERAWATI, M.Pd',
    description: 'Pelaksana proses belajar mengajar, kurikulum merdeka, dan administrasi kelas.',
    letterCount: 1,
  },
  {
    id: 'DEP-004',
    code: 'KOM',
    name: 'Komite & Paguyuban Sekolah',
    leaderName: 'H. Dedi Mulyadi',
    description: 'Kemitraan orang tua murid dan masyarakat dalam pendampingan program sekolah.',
    letterCount: 1,
  },
];

export const initialCategories: LetterCategory[] = [
  {
    id: 'CAT-001',
    code: '421.2/MTK',
    name: 'Surat Mutasi Keluar',
    description: 'Pelepasan siswa pindah sekolah ke satuan pendidikan lain atas permohonan orang tua/wali.',
    prefix: 'MTK',
  },
  {
    id: 'CAT-002',
    code: '421.2/MTM',
    name: 'Surat Mutasi Masuk',
    description: 'Surat keterangan kesiapan dan persetujuan menerima siswa pindahan dari sekolah asal.',
    prefix: 'MTM',
  },
  {
    id: 'CAT-003',
    code: '421.3/AKT',
    name: 'Surat Keterangan Siswa Aktif',
    description: 'Surat keterangan peserta didik masih aktif terdaftar belajar untuk beasiswa PIP, tunjangan, dan administrasi.',
    prefix: 'AKT',
  },
  {
    id: 'CAT-004',
    code: '005/UND',
    name: 'Surat Undangan Pertemuan Rapat Kedinasan / Wali Murid',
    description: 'Undangan rapat dinas guru, koordinasi kurikulum, dan musyawarah paguyuban orang tua murid.',
    prefix: 'UND',
  },
  {
    id: 'CAT-005',
    code: '800/GUR',
    name: 'Surat Keterangan Aktif Mengajar',
    description: 'Keterangan keaktifan tugas mengajar guru (beban jam mengajar/JTM) untuk TPG, PPG, atau keperluan dinas.',
    prefix: 'GUR',
  },
];

export const initialLettersIn: LetterIn[] = [
  {
    id: 'SIN-001',
    agendaNumber: 'SM-2026/001',
    referenceNumber: '045/Disdik-DKI/AN/VIII/2026',
    origin: 'Dinas Pendidikan Provinsi DKI Jakarta',
    subject: 'Undangan Rapat Koordinasi Persiapan Asesmen Nasional Berbasis Komputer (ANBK) 2026',
    receivedDate: '2026-08-20',
    letterDate: '2026-08-18',
    deadlineDate: '2026-08-24',
    sifat: 'Segera',
    categoryId: 'CAT-001',
    categoryName: 'Undangan & Kedinasan Pendidikan',
    status: 'Didisposisikan',
    summary: 'Diharapkan hadir Kepala Sekolah dan Waka Kurikulum dalam rakor teknis simulasi ANBK tingkat provinsi pada 25 Agustus 2026.',
    fileName: 'surat_undangan_anbk_disdik_2026.pdf',
    fileSize: '1.4 MB',
    archived: false,
    createdAt: '2026-08-20T08:30:00Z',
  },
  {
    id: 'SIN-002',
    agendaNumber: 'SM-2026/002',
    referenceNumber: '012/KOMITE-SDN-SKL/VIII/2026',
    origin: 'Pengurus Komite SD Negeri Sukalaksana',
    subject: 'Permohonan Fasilitasi Ruang Rapat dan Pembahasan Rencana Program Kerja Komite TA 2026/2027',
    receivedDate: '2026-08-21',
    letterDate: '2026-08-19',
    deadlineDate: '2026-08-28',
    sifat: 'Biasa',
    categoryId: 'CAT-005',
    categoryName: 'Undangan Komite & Wali Murid',
    status: 'Diterima',
    summary: 'Pengajuan audiensi pengurus komite sekolah dengan pihak manajemen sekolah untuk memaparkan rencana revitalisasi sarana pojok baca digital.',
    fileName: 'proposal_permohonan_komite.pdf',
    fileSize: '840 KB',
    archived: false,
    createdAt: '2026-08-21T09:15:00Z',
  },
];

export const initialLettersOut: LetterOut[] = [
  {
    id: 'SOUT-002',
    letterNumber: '400.3.12.1/023/SD-Skl//VII/2026',
    destination: 'Kepala SD NEGERI SUKARAME Kecamatan Sukanagara',
    subject: 'SURAT KETERANGAN PINDAH SEKOLAH',
    letterDate: '2026-07-30',
    senderDepartment: 'Tata Usaha & Kearsipan',
    authorId: 'USR-003',
    authorName: 'ANDHIKA GUMILAR LASMANA, S.Pd., Gr',
    sifat: 'Penting',
    categoryId: 'CAT-002',
    categoryName: 'Surat Mutasi Keluar',
    approvalStatus: 'Disetujui',
    status: 'Siap Kirim',
    content: `Yang bertandatangan di bawah ini, Kepala Sekolah Dasar Negeri Sukalaksana Desa Sukalaksana Kecamatan Sukanagara Kabupaten Cianjur, menerangkan bahwa:

Nama : SITI SALWA
Tempat/Tanggal Lahir : CIANJUR, 16 Maret 2018
Nomor Induk Siswa : 252601027
NISN : 3184373447
Jenis Kelamin : PEREMPUAN
Kelas : I (Satu)

Menerangkan dengan sesungguhnya bahwa:
Nama : ATIH ROHAYAT
Alamat : Kp.Cibeungang
Pekerjaan : Buruh

Telah mengajukan pindah ke SD NEGERI SUKARAME Kecamatan Sukanagara Kabupaten Cianjur dengan alasan Ikut Orangtua. Bersama ini kami sertakan Buku Laporan Pendidikan (Raport) yang bersangkutan

Demikian dan terimakasih atas perhatiannya.`,
    signeeName: 'ELI HERAWATI, M.Pd.',
    signeePosition: 'Kepala Sekolah',
    notes: 'Surat Keterangan Pindah Sekolah resmi untuk ananda SITI SALWA ke SD NEGERI SUKARAME.',
    attachmentCount: 1,
    fileName: 'surat_keterangan_pindah_sekolah_siti_salwa.pdf',
    archived: false,
    createdAt: '2026-07-30T09:00:00Z',
  },
  {
    id: 'SOUT-001',
    letterNumber: '400.3.12.1/031/SD-Skl/VIII/2026',
    destination: 'Kepala Dinas Pendidikan Pemuda dan Olahraga Kabupaten Cianjur',
    subject: 'Penyampaian Laporan Bulanan Administrasi Kepegawaian dan KBM Bulan Juli 2026',
    letterDate: '2026-08-20',
    senderDepartment: 'Bendahara & Pengelolaan Keuangan',
    authorId: 'USR-003',
    authorName: 'ANDHIKA GUMILAR LASMANA, S.Pd., Gr',
    sifat: 'Penting',
    categoryId: 'CAT-002',
    categoryName: 'Surat Mutasi Masuk',
    approvalStatus: 'Disetujui',
    status: 'Siap Kirim',
    content: `Bersama surat ini kami sampaikan berkas Laporan Bulanan Satuan Pendidikan SD NEGERI SUKALAKSANA untuk periode bulan Juli Tahun Ajaran 2026/2027. Laporan mencakup data presensi guru/tenaga kependidikan, mutasi masuk/keluar siswa, serta realisasi serapan kurikulum. Demikian surat pengantar ini kami sampaikan, atas perhatian dan kerja sama yang baik kami ucapkan terima kasih.`,
    signeeName: 'ELI HERAWATI, M.Pd.',
    signeePosition: 'Kepala Sekolah',
    notes: 'Surat telah diverifikasi oleh Bendahara dan disetujui penuh oleh Kepala Sekolah.',
    attachmentCount: 3,
    fileName: 'laporan_bulanan_juli_2026_signed.pdf',
    archived: false,
    createdAt: '2026-08-20T11:00:00Z',
  },
];

export const initialDispositions: Disposition[] = [
  {
    id: 'DISP-001',
    letterInId: 'SIN-001',
    letterInAgenda: 'SM-2026/001',
    letterInSubject: 'Undangan Rapat Koordinasi Persiapan Asesmen Nasional Berbasis Komputer (ANBK) 2026',
    letterInOrigin: 'Dinas Pendidikan Provinsi DKI Jakarta',
    letterInDeadline: '2026-08-24',
    fromUserId: 'USR-002',
    fromUserName: 'ELI HERAWATI, M.Pd.',
    fromRole: 'Kepala Sekolah',
    toDepartmentId: 'DEP-001',
    toDepartmentName: 'Bendahara & Pengelolaan Keuangan',
    toUserId: 'USR-003',
    toUserName: 'ANDHIKA GUMILAR LASMANA, S.Pd., Gr',
    instruction: 'Tindak lanjuti segera, siapkan data kesiapan teknis dan koordinasikan dukungan anggaran rapat dinas.',
    notes: 'Perhatikan jadwal simulasi gelombang 1 dan koordinasikan dengan proktor utama.',
    deadlineDate: '2026-08-24',
    sifat: 'Segera',
    status: 'Belum Ditindaklanjuti',
    isPriority: true,
    createdAt: '2026-08-20T14:10:00Z',
  },
];

export const initialTemplates: LetterTemplate[] = [
  {
    id: 'TPL-001',
    code: 'TPL-PINDAH-SEKOLAH',
    title: 'Surat Keterangan Pindah Sekolah',
    category: 'Surat Mutasi Keluar',
    description: 'Format baku Surat Keterangan Pindah Sekolah (pelepasan mutasi siswa) dilengkapi lembar balasan sekolah penerima berstandar kedinasan.',
    defaultSifat: 'Penting',
    variables: [
      '{nomor_surat}',
      '{nama_siswa}',
      '{tempat_tgl_lahir}',
      '{nis}',
      '{nisn}',
      '{jenis_kelamin}',
      '{kelas}',
      '{nama_orang_tua}',
      '{alamat_orang_tua}',
      '{pekerjaan_orang_tua}',
      '{sekolah_tujuan}',
      '{alasan_pindah}',
      '{tanggal_surat}',
    ],
    usageCount: 28,
    isActive: true,
    bodyTemplate: `Yang bertandatangan di bawah ini, Kepala Sekolah Dasar Negeri Sukalaksana Desa Sukalaksana Kecamatan Sukanagara Kabupaten Cianjur, menerangkan bahwa:

Nama                : {nama_siswa}
Tempat/Tanggal Lahir: {tempat_tgl_lahir}
Nomor Induk Siswa   : {nis}
NISN                : {nisn}
Jenis Kelamin       : {jenis_kelamin}
Kelas               : {kelas}

Menerangkan dengan sesungguhnya bahwa:
Nama      : {nama_orang_tua}
Alamat    : {alamat_orang_tua}
Pekerjaan : {pekerjaan_orang_tua}

Telah mengajukan pindah ke {sekolah_tujuan} dengan alasan {alasan_pindah}. Bersama ini kami sertakan Buku Laporan Pendidikan (Raport) yang bersangkutan

Demikian dan terimakasih atas perhatiannya.`,
  },
  {
    id: 'TPL-002',
    code: 'TPL-MUTASI-MASUK',
    title: 'Surat Mutasi Masuk',
    category: 'Surat Mutasi Masuk',
    description: 'Format surat persetujuan dan kesiapan menerima peserta didik pindahan dari sekolah asal.',
    defaultSifat: 'Penting',
    variables: [
      '{nomor_surat}',
      '{nama_siswa}',
      '{nis_nisn}',
      '{jenis_kelamin}',
      '{kelas_tujuan}',
      '{sekolah_asal}',
      '{nama_wali}',
      '{alamat_wali}',
      '{nomor_surat_pindah_asal}',
      '{tanggal_surat}',
    ],
    usageCount: 9,
    isActive: true,
    bodyTemplate: `SURAT KETERANGAN SIAP MENERIMA SISWA (MUTASI MASUK)
Nomor: {nomor_surat}

Yang bertanda tangan di bawah ini, Kepala SD Negeri Sukalaksana, menerangkan bahwa berdasarkan daya tampung rombongan belajar dan hasil verifikasi berkas administrasi mutasi:

Nama Peserta Didik   : {nama_siswa}
NISN / NIS           : {nis_nisn}
Jenis Kelamin        : {jenis_kelamin}
Asal Sekolah         : {sekolah_asal}
Nomor Surat Pindah   : {nomor_surat_pindah_asal}
Nama Orang Tua/Wali  : {nama_wali}
Alamat Tinggal       : {alamat_wali}

Dinyatakan: DAPAT DITERIMA / DISETUJUI sebagai peserta didik pindahan di SD Negeri Sukalaksana pada:

Diterima di Kelas    : {kelas_tujuan}
Tahun Ajaran         : 2026/2027

Demikian surat keterangan mutasi masuk ini kami buat dengan sebenarnya untuk dapat dipergunakan sebagai syarat penyelesaian administrasi mutasi Dapodik pada instansi/sekolah asal.`,
  },
  {
    id: 'TPL-003',
    code: 'TPL-KET-SISWA',
    title: 'Surat Keterangan Siswa Aktif',
    category: 'Surat Keterangan Siswa Aktif',
    description: 'Format baku menerangkan bahwa peserta didik yang bersangkutan terdaftar aktif bersekolah pada tahun ajaran berjalan.',
    defaultSifat: 'Biasa',
    variables: [
      '{nomor_surat}',
      '{nama_siswa}',
      '{nis_nisn}',
      '{kelas}',
      '{tempat_tgl_lahir}',
      '{nama_wali}',
      '{alamat_wali}',
      '{keperluan}',
      '{tanggal_surat}',
    ],
    usageCount: 48,
    isActive: true,
    bodyTemplate: `SURAT KETERANGAN AKTIF BELAJAR
Nomor: {nomor_surat}

Yang bertanda tangan di bawah ini Kepala SD Negeri Sukalaksana menerangkan dengan sebenarnya bahwa:

Nama Lengkap          : {nama_siswa}
Nomor Induk / NISN    : {nis_nisn}
Tempat, Tanggal Lahir : {tempat_tgl_lahir}
Tingkat / Kelas       : {kelas}
Nama Orang Tua/Wali   : {nama_wali}
Alamat Rumah          : {alamat_wali}

Adalah benar nama tersebut di atas merupakan peserta didik yang masih AKTIF terdaftar belajar pada SD Negeri Sukalaksana pada Tahun Ajaran 2026/2027.

Surat Keterangan ini dibuat dan diberikan kepada yang bersangkutan untuk keperluan:
"{keperluan}"

Demikian surat keterangan ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.`,
  },
  {
    id: 'TPL-004',
    code: 'TPL-UNDANGAN-RAPAT',
    title: 'Surat Undangan Pertemuan Rapat Kedinasan/ Wali Murid',
    category: 'Surat Undangan Pertemuan Rapat Kedinasan / Wali Murid',
    description: 'Format undangan formal untuk pertemuan kedinasan dewan guru, rapat koordinasi dinas, atau musyawarah orang tua / wali murid.',
    defaultSifat: 'Penting',
    variables: [
      '{nomor_surat}',
      '{tujuan_penerima}',
      '{hari_tanggal}',
      '{waktu_acara}',
      '{tempat_acara}',
      '{agenda_rapat}',
      '{tanggal_surat}',
    ],
    usageCount: 31,
    isActive: true,
    bodyTemplate: `SURAT UNDANGAN
Nomor: {nomor_surat}

Kepada Yth.
Bapak/Ibu Orang Tua/Wali Murid / {tujuan_penerima}
di Tempat

Dengan hormat,
Sehubungan dengan pelaksanaan program kerja sekolah dan agenda peningkatan mutu pendidikan di SD Negeri Sukalaksana, kami mengundang Bapak/Ibu untuk hadir pada pertemuan yang akan diselenggarakan pada:

Hari / Tanggal : {hari_tanggal}
Waktu          : {waktu_acara} WIB s.d Selesai
Tempat         : {tempat_acara}
Acara / Agenda : {agenda_rapat}

Mengingat pentingnya agenda musyawarah tersebut, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya.

Demikian surat undangan ini kami sampaikan. Atas perhatian, kerja sama, dan kehadiran Bapak/Ibu, kami ucapkan terima kasih.`,
  },
  {
    id: 'TPL-005',
    code: 'TPL-AKTIF-MENGAJAR',
    title: 'Surat Keterangan Aktif Mengajar',
    category: 'Surat Keterangan Aktif Mengajar',
    description: 'Surat keterangan Kepala Sekolah yang menerangkan pendidik/guru aktif melaksanakan kegiatan belajar mengajar dengan beban jam kerja.',
    defaultSifat: 'Biasa',
    variables: [
      '{nomor_surat}',
      '{nama_guru}',
      '{nip_nuptk}',
      '{pangkat_golongan}',
      '{jabatan_guru}',
      '{mata_pelajaran_tugas}',
      '{jumlah_jam_mengajar}',
      '{keperluan}',
      '{tanggal_surat}',
    ],
    usageCount: 22,
    isActive: true,
    bodyTemplate: `SURAT KETERANGAN AKTIF MENGAJAR
Nomor: {nomor_surat}

Yang bertanda tangan di bawah ini:
Nama                  : ELI HERAWATI, M.Pd
NIP                   : 19750812 200003 2 003
Jabatan               : Kepala Sekolah
Unit Kerja            : SD Negeri Sukalaksana

Dengan ini menerangkan dengan sesungguhnya bahwa:
Nama Guru             : {nama_guru}
NIP / NUPTK           : {nip_nuptk}
Pangkat / Golongan    : {pangkat_golongan}
Jabatan               : {jabatan_guru}
Tugas Mengajar        : {mata_pelajaran_tugas}
Beban Kerja           : {jumlah_jam_mengajar} Jam Pelajaran (JTM) / Minggu

Bahwa yang bersangkutan benar-benar Guru / Tenaga Pendidik yang AKTIF melaksanakan tugas proses belajar mengajar (PBM) di SD Negeri Sukalaksana pada Tahun Ajaran 2026/2027 secara berkesinambungan dan memiliki dedikasi yang baik.

Surat keterangan ini diberikan kepada yang bersangkutan untuk keperluan:
"{keperluan}"

Demikian Surat Keterangan Aktif Mengajar ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.`,
  },
];

export const initialArchives: ArchiveRecord[] = [];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-08-21 14:35:10',
    userName: 'Administrator (Admin)',
    role: 'Administrator',
    action: 'LOGIN',
    module: 'Autentikasi',
    details: 'Berhasil login ke sistem E-Surat Sekolah.',
    ipAddress: '192.168.1.104',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-08-21 09:15:22',
    userName: 'ANDHIKA GUMILAR LASMANA, S.Pd., Gr',
    role: 'Bendahara',
    action: 'CREATE_SURAT_MASUK',
    module: 'Surat Masuk',
    details: 'Mencatat surat masuk agenda SM-2026/002 dari Komite Sekolah.',
    ipAddress: '192.168.1.112',
  },
  {
    id: 'LOG-003',
    timestamp: '2026-08-20 14:10:45',
    userName: 'ELI HERAWATI, M.Pd',
    role: 'Kepala Sekolah',
    action: 'CREATE_DISPOSISI',
    module: 'Disposisi',
    details: 'Menerbitkan lembar disposisi DISP-001 kepada Bendahara Sekolah (Prioritas Segera).',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'LOG-004',
    timestamp: '2026-08-20 11:30:00',
    userName: 'ELI HERAWATI, M.Pd',
    role: 'Kepala Sekolah',
    action: 'APPROVE_SURAT_KELUAR',
    module: 'Surat Keluar',
    details: 'Menyetujui surat keluar 421.2/084/SDN-SKL/TU/2026 untuk Korwil Bidang Pendidikan.',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'LOG-005',
    timestamp: '2026-08-20 08:30:14',
    userName: 'Administrator (Admin)',
    role: 'Administrator',
    action: 'CREATE_SURAT_MASUK',
    module: 'Surat Masuk',
    details: 'Registrasi agenda masuk SM-2026/001 perihal Rakor ANBK 2026 Disdik DKI.',
    ipAddress: '192.168.1.104',
  },
];

export const monthlyChartData = [
  { month: 'Mar', count: 18, dinas: 12, undangan: 4, internal: 2 },
  { month: 'Apr', count: 24, dinas: 15, undangan: 6, internal: 3 },
  { month: 'Mei', count: 31, dinas: 20, undangan: 8, internal: 3 },
  { month: 'Jun', count: 15, dinas: 10, undangan: 3, internal: 2 },
  { month: 'Jul', count: 28, dinas: 18, undangan: 7, internal: 3 },
  { month: 'Agu', count: 2, dinas: 1, undangan: 1, internal: 0 },
];
