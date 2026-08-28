export type SifatSurat = 'Biasa' | 'Penting' | 'Segera' | 'Rahasia';
export type StatusSuratMasuk = 'Diterima' | 'Didisposisikan' | 'Diproses' | 'Selesai' | 'Diarsipkan';
export type StatusApproval = 'Draft' | 'Diajukan' | 'Disetujui' | 'Ditolak';
export type StatusSuratKeluar = 'Draft' | 'Menunggu Approval' | 'Siap Kirim' | 'Terkirim' | 'Diarsipkan';
export type StatusDisposisi = 'Belum Ditindaklanjuti' | 'Sedang Diproses' | 'Selesai';
export type UserRole = 'Administrator' | 'Kepala Sekolah' | 'Bendahara' | 'Guru';

export interface User {
  id: string;
  name: string;
  email: string;
  nip?: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
  avatar?: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface Department {
  id: string;
  code: string;
  name: string;
  leaderName: string;
  description: string;
  letterCount?: number;
}

export interface LetterCategory {
  id: string;
  code: string; // e.g. "421.1", "005", "800"
  name: string; // e.g. "Undangan Kedinasan", "Kurikulum & Pembelajaran"
  description: string;
  prefix: string;
}

export interface LetterIn {
  id: string;
  agendaNumber: string; // e.g. "SM-2026/001"
  referenceNumber: string; // Nomor surat dari pengirim
  origin: string; // Asal instansi/pengirim
  subject: string; // Perihal
  receivedDate: string; // YYYY-MM-DD
  letterDate: string; // YYYY-MM-DD
  deadlineDate?: string; // Batas tindak lanjut
  sifat: SifatSurat;
  categoryId: string;
  categoryName: string;
  status: StatusSuratMasuk;
  summary: string;
  filePath?: string;
  fileName?: string;
  fileSize?: string;
  archived: boolean;
  archiveBox?: string;
  createdAt: string;
}

export interface LetterOut {
  id: string;
  letterNumber: string; // e.g. "421.2/084/SMAN1/TU/2026"
  destination: string; // Tujuan instansi/penerima
  subject: string; // Perihal
  letterDate: string; // YYYY-MM-DD
  senderDepartment: string; // Bagian pengirim
  authorId: string;
  authorName: string;
  sifat: SifatSurat;
  categoryId: string;
  categoryName: string;
  approvalStatus: StatusApproval;
  status: StatusSuratKeluar;
  content: string;
  signeeName: string;
  signeePosition: string;
  notes?: string;
  attachmentCount?: number;
  filePath?: string;
  fileName?: string;
  archived: boolean;
  createdAt: string;
}

export interface Disposition {
  id: string;
  letterInId: string;
  letterInAgenda: string;
  letterInSubject: string;
  letterInOrigin: string;
  letterInDeadline?: string;
  fromUserId: string;
  fromUserName: string;
  fromRole: string;
  toDepartmentId: string;
  toDepartmentName: string;
  toUserId?: string;
  toUserName?: string;
  instruction: string; // e.g. "Tindak lanjuti segera dan laporkan hasilnya"
  notes?: string;
  deadlineDate: string;
  sifat: SifatSurat;
  status: StatusDisposisi;
  isPriority: boolean;
  actionTaken?: string;
  completedAt?: string;
  createdAt: string;
}

export interface LetterTemplate {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  bodyTemplate: string;
  defaultSifat: SifatSurat;
  variables: string[]; // ['{nama_siswa}', '{nisn}', '{kelas}']
  isActive: boolean;
  usageCount: number;
}

export interface ArchiveRecord {
  id: string;
  letterType: 'Masuk' | 'Keluar';
  letterId: string;
  referenceNumber: string;
  subject: string;
  date: string;
  category: string;
  boxNumber: string;
  rackNumber: string;
  retentionYear: number;
  notes?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

export interface SchoolProfile {
  name: string;
  npsn: string;
  agencyName?: string;
  subdistrictOffice?: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  principalName: string;
  principalNip: string;
  tuHeadName: string;
  tuHeadNip: string;
  logoUrl: string;
  logoCianjurUrl?: string;
  logoSchoolUrl?: string;
}
