export interface TableField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  nullable: boolean;
  default?: string;
  description: string;
}

export interface TableSchema {
  tableName: string;
  comment: string;
  fields: TableField[];
}

export const databaseTables: TableSchema[] = [
  {
    tableName: 'users',
    comment: 'Menyimpan akun pengguna, guru, staf Tata Usaha, dan pimpinan sekolah (RBAC).',
    fields: [
      { name: 'id', type: 'VARCHAR(36)', isPrimary: true, nullable: false, description: 'Primary Key (UUID/Custom ID)' },
      { name: 'name', type: 'VARCHAR(150)', nullable: false, description: 'Nama lengkap beserta gelar' },
      { name: 'email', type: 'VARCHAR(100)', nullable: false, description: 'Email kedinasan unik (Unique Index)' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'Bcrypt/Argon2 password hash' },
      { name: 'nip', type: 'VARCHAR(30)', nullable: true, description: 'Nomor Induk Pegawai (NIP/NUPTK)' },
      { name: 'role', type: "ENUM('Administrator', 'Kepala Sekolah', 'Bendahara', 'Guru')", nullable: false, default: "'Bendahara'", description: 'Hak akses dalam sistem persuratan' },
      { name: 'department_id', type: 'VARCHAR(36)', isForeign: true, references: 'departments(id)', nullable: true, description: 'Foreign key unit kerja/bidang' },
      { name: 'avatar_url', type: 'TEXT', nullable: true, description: 'Foto profil pengguna' },
      { name: 'status', type: "ENUM('Aktif', 'Nonaktif')", nullable: false, default: "'Aktif'", description: 'Status keaktifan user' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Waktu pendaftaran' },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', description: 'Waktu pembaruan' },
    ],
  },
  {
    tableName: 'departments',
    comment: 'Menyimpan unit kerja / bidang di lingkungan sekolah (TU, Kepala Sekolah, Waka dsb).',
    fields: [
      { name: 'id', type: 'VARCHAR(36)', isPrimary: true, nullable: false, description: 'Primary Key' },
      { name: 'code', type: 'VARCHAR(20)', nullable: false, description: 'Kode singkatan unit (e.g. TU, KS, KUR)' },
      { name: 'name', type: 'VARCHAR(150)', nullable: false, description: 'Nama lengkap unit kerja/bidang' },
      { name: 'leader_name', type: 'VARCHAR(150)', nullable: true, description: 'Nama penanggung jawab bidang' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Tugas pokok dan fungsi' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Waktu pembuatan' },
    ],
  },
  {
    tableName: 'letter_categories',
    comment: 'Menyimpan klasifikasi kode persuratan dinas (005, 421.1, 421.2, 800 dll).',
    fields: [
      { name: 'id', type: 'VARCHAR(36)', isPrimary: true, nullable: false, description: 'Primary Key' },
      { name: 'code', type: 'VARCHAR(30)', nullable: false, description: 'Kode klasifikasi arsip (Indeks Surat)' },
      { name: 'name', type: 'VARCHAR(150)', nullable: false, description: 'Nama kategori klasifikasi surat' },
      { name: 'prefix', type: 'VARCHAR(10)', nullable: true, description: 'Prefiks agenda (UND, LAP, SIS, SPT)' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Penjelasan kategori dokumen' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Waktu pembuatan' },
    ],
  },
  {
    tableName: 'letters_in',
    comment: 'Menyimpan buku agenda persuratan masuk beserta meta data dan file pindaian.',
    fields: [
      { name: 'id', type: 'VARCHAR(36)', isPrimary: true, nullable: false, description: 'Primary Key' },
      { name: 'agenda_number', type: 'VARCHAR(50)', nullable: false, description: 'Nomor agenda urut (e.g. SM-2026/001)' },
      { name: 'reference_number', type: 'VARCHAR(100)', nullable: false, description: 'Nomor surat resmi dari pengirim' },
      { name: 'origin', type: 'VARCHAR(200)', nullable: false, description: 'Instansi / Asal pengirim surat' },
      { name: 'subject', type: 'TEXT', nullable: false, description: 'Perihal / pokok isi surat' },
      { name: 'received_date', type: 'DATE', nullable: false, description: 'Tanggal surat diterima di sekolah' },
      { name: 'letter_date', type: 'DATE', nullable: false, description: 'Tanggal yang tertera pada lembar surat' },
      { name: 'deadline_date', type: 'DATE', nullable: true, description: 'Batas akhir waktu tindak lanjut surat' },
      { name: 'sifat', type: "ENUM('Biasa', 'Penting', 'Segera', 'Rahasia')", nullable: false, default: "'Biasa'", description: 'Tingkat urgensi persuratan' },
      { name: 'category_id', type: 'VARCHAR(36)', isForeign: true, references: 'letter_categories(id)', nullable: false, description: 'Relasi ke kategori surat' },
      { name: 'status', type: "ENUM('Diterima', 'Didisposisikan', 'Diproses', 'Selesai', 'Diarsipkan')", nullable: false, default: "'Diterima'", description: 'Siklus hidup surat masuk' },
      { name: 'summary', type: 'TEXT', nullable: true, description: 'Ringkasan isi surat' },
      { name: 'file_path', type: 'VARCHAR(255)', nullable: true, description: 'Lokasi penyimpanan file PDF pindaian' },
      { name: 'file_name', type: 'VARCHAR(255)', nullable: true, description: 'Nama asli berkas pindaian' },
      { name: 'archived', type: 'BOOLEAN', nullable: false, default: 'FALSE', description: 'Flag apakah sudah diarsipkan' },
      { name: 'archive_box', type: 'VARCHAR(50)', nullable: true, description: 'Kode boks/lemari rak arsip' },
      { name: 'created_by', type: 'VARCHAR(36)', isForeign: true, references: 'users(id)', nullable: true, description: 'User pencatat surat' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Waktu registrasi' },
    ],
  },
  {
    tableName: 'dispositions',
    comment: 'Instruksi pimpinan (Kepala Sekolah) kepada bawahan/unit kerja atas surat masuk.',
    fields: [
      { name: 'id', type: 'VARCHAR(36)', isPrimary: true, nullable: false, description: 'Primary Key (e.g. DISP-001)' },
      { name: 'letter_in_id', type: 'VARCHAR(36)', isForeign: true, references: 'letters_in(id)', nullable: false, description: 'Relasi ke surat masuk yang didisposisikan' },
      { name: 'from_user_id', type: 'VARCHAR(36)', isForeign: true, references: 'users(id)', nullable: false, description: 'Pejabat pemberi disposisi (biasanya Kepala Sekolah)' },
      { name: 'to_department_id', type: 'VARCHAR(36)', isForeign: true, references: 'departments(id)', nullable: false, description: 'Unit/bidang tujuan disposisi' },
      { name: 'to_user_id', type: 'VARCHAR(36)', isForeign: true, references: 'users(id)', nullable: true, description: 'Pejabat pelaksana teknis (optional)' },
      { name: 'instruction', type: 'TEXT', nullable: false, description: 'Instruksi / Catatan arahan pimpinan' },
      { name: 'notes', type: 'TEXT', nullable: true, description: 'Catatan tambahan / tindak lanjut' },
      { name: 'deadline_date', type: 'DATE', nullable: false, description: 'Batas tanggal pelaksanaan instruksi' },
      { name: 'sifat', type: "ENUM('Biasa', 'Penting', 'Segera', 'Rahasia')", nullable: false, default: "'Biasa'", description: 'Sifat disposisi' },
      { name: 'status', type: "ENUM('Belum Ditindaklanjuti', 'Sedang Diproses', 'Selesai')", nullable: false, default: "'Belum Ditindaklanjuti'", description: 'Status progres tindak lanjut' },
      { name: 'is_priority', type: 'BOOLEAN', nullable: false, default: 'FALSE', description: 'Penanda disposisi prioritas tinggi' },
      { name: 'action_taken', type: 'TEXT', nullable: true, description: 'Laporan tindakan yang telah diambil' },
      { name: 'completed_at', type: 'TIMESTAMP', nullable: true, description: 'Waktu penyelesaian instruksi' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Waktu disposisi diterbitkan' },
    ],
  },
  {
    tableName: 'letters_out',
    comment: 'Menyimpan arsip surat dinas yang diterbitkan sekolah kepada pihak eksternal/internal.',
    fields: [
      { name: 'id', type: 'VARCHAR(36)', isPrimary: true, nullable: false, description: 'Primary Key' },
      { name: 'letter_number', type: 'VARCHAR(100)', nullable: false, description: 'Nomor surat dinas resmi (e.g. 421.2/084/SMAN1/TU/2026)' },
      { name: 'destination', type: 'VARCHAR(255)', nullable: false, description: 'Nama tujuan / instansi penerima' },
      { name: 'subject', type: 'TEXT', nullable: false, description: 'Perihal surat' },
      { name: 'letter_date', type: 'DATE', nullable: false, description: 'Tanggal surat dikeluarkan' },
      { name: 'sender_department', type: 'VARCHAR(100)', nullable: false, description: 'Bagian pembuat draft' },
      { name: 'author_id', type: 'VARCHAR(36)', isForeign: true, references: 'users(id)', nullable: false, description: 'Pembuat/konseptor surat' },
      { name: 'sifat', type: "ENUM('Biasa', 'Penting', 'Segera', 'Rahasia')", nullable: false, default: "'Biasa'", description: 'Sifat surat' },
      { name: 'category_id', type: 'VARCHAR(36)', isForeign: true, references: 'letter_categories(id)', nullable: false, description: 'Kategori klasifikasi' },
      { name: 'approval_status', type: "ENUM('Draft', 'Diajukan', 'Disetujui', 'Ditolak')", nullable: false, default: "'Draft'", description: 'Status persetujuan Kepala Sekolah' },
      { name: 'status', type: "ENUM('Draft', 'Menunggu Approval', 'Siap Kirim', 'Terkirim', 'Diarsipkan')", nullable: false, default: "'Draft'", description: 'Status pengiriman fisik/digital' },
      { name: 'content', type: 'LONGTEXT', nullable: false, description: 'Isi lengkap teks surat dinas' },
      { name: 'signee_name', type: 'VARCHAR(150)', nullable: false, description: 'Nama pejabat penandatangan' },
      { name: 'signee_position', type: 'VARCHAR(100)', nullable: false, description: 'Jabatan penandatangan (Kepala Sekolah)' },
      { name: 'notes', type: 'TEXT', nullable: true, description: 'Catatan approval / revisi' },
      { name: 'attachment_count', type: 'INT', nullable: false, default: '0', description: 'Jumlah lampiran berkas' },
      { name: 'file_path', type: 'VARCHAR(255)', nullable: true, description: 'Path berkas PDF surat bertandatangan' },
      { name: 'archived', type: 'BOOLEAN', nullable: false, default: 'FALSE', description: 'Flag arsip digital' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Waktu pembuatan draft' },
    ],
  },
  {
    tableName: 'letter_templates',
    comment: 'Menyimpan master template surat dinas dengan variabel pengganti dinamis.',
    fields: [
      { name: 'id', type: 'VARCHAR(36)', isPrimary: true, nullable: false, description: 'Primary Key' },
      { name: 'code', type: 'VARCHAR(50)', nullable: false, description: 'Kode unik template (e.g. TPL-KET-SISWA)' },
      { name: 'title', type: 'VARCHAR(150)', nullable: false, description: 'Judul / nama template' },
      { name: 'category', type: 'VARCHAR(100)', nullable: false, description: 'Kategori jenis surat' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Deskripsi peruntukan surat' },
      { name: 'body_template', type: 'LONGTEXT', nullable: false, description: 'Teks template dengan placeholder {var}' },
      { name: 'default_sifat', type: "ENUM('Biasa', 'Penting', 'Segera', 'Rahasia')", nullable: false, default: "'Biasa'", description: 'Sifat bawaan surat' },
      { name: 'variables_json', type: 'JSON', nullable: false, description: 'Daftar variabel yang dapat diisi' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, default: 'TRUE', description: 'Status keaktifan template' },
      { name: 'usage_count', type: 'INT', nullable: false, default: '0', description: 'Frekuensi pemakaian' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Waktu pembuatan' },
    ],
  },
  {
    tableName: 'activity_logs',
    comment: 'Audit trail mencatat setiap aktivitas penting user demi akuntabilitas keamanan data.',
    fields: [
      { name: 'id', type: 'VARCHAR(36)', isPrimary: true, nullable: false, description: 'Primary Key' },
      { name: 'user_name', type: 'VARCHAR(150)', nullable: false, description: 'Nama pelaku' },
      { name: 'role', type: 'VARCHAR(50)', nullable: false, description: 'Peran saat aksi dilakukan' },
      { name: 'action', type: 'VARCHAR(50)', nullable: false, description: 'Aksi (CREATE, UPDATE, APPROVE, ARCHIVE dll)' },
      { name: 'module', type: 'VARCHAR(50)', nullable: false, description: 'Modul aplikasi' },
      { name: 'details', type: 'TEXT', nullable: false, description: 'Rincian aksi yang dijalankan' },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: false, description: 'Alamat IP klien' },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, default: 'CURRENT_TIMESTAMP', description: 'Waktu log dicatat' },
    ],
  },
];

export const sqlDdlScript = `-- =================================================================
-- SKEMA DATABASE PERSURATAN DIGITAL SEKOLAH (E-SURAT)
-- Dialect: MySQL 8.0+ / PostgreSQL Compatible
-- Dibuat untuk: Manajemen Tata Usaha & Persuratan Sekolah
-- =================================================================

CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    leader_name VARCHAR(150),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS letter_categories (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    prefix VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nip VARCHAR(30),
    role ENUM('Administrator', 'Kepala Sekolah', 'Tata Usaha', 'Waka Kurikulum', 'Waka Kesiswaan', 'Waka Sarpras', 'Waka Humas', 'Guru') NOT NULL DEFAULT 'Tata Usaha',
    department_id VARCHAR(36),
    avatar_url TEXT,
    status ENUM('Aktif', 'Nonaktif') NOT NULL DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS letters_in (
    id VARCHAR(36) PRIMARY KEY,
    agenda_number VARCHAR(50) NOT NULL UNIQUE,
    reference_number VARCHAR(100) NOT NULL,
    origin VARCHAR(200) NOT NULL,
    subject TEXT NOT NULL,
    received_date DATE NOT NULL,
    letter_date DATE NOT NULL,
    deadline_date DATE,
    sifat ENUM('Biasa', 'Penting', 'Segera', 'Rahasia') NOT NULL DEFAULT 'Biasa',
    category_id VARCHAR(36) NOT NULL,
    status ENUM('Diterima', 'Didisposisikan', 'Diproses', 'Selesai', 'Diarsipkan') NOT NULL DEFAULT 'Diterima',
    summary TEXT,
    file_path VARCHAR(255),
    file_name VARCHAR(255),
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    archive_box VARCHAR(50),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES letter_categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS dispositions (
    id VARCHAR(36) PRIMARY KEY,
    letter_in_id VARCHAR(36) NOT NULL,
    from_user_id VARCHAR(36) NOT NULL,
    to_department_id VARCHAR(36) NOT NULL,
    to_user_id VARCHAR(36),
    instruction TEXT NOT NULL,
    notes TEXT,
    deadline_date DATE NOT NULL,
    sifat ENUM('Biasa', 'Penting', 'Segera', 'Rahasia') NOT NULL DEFAULT 'Biasa',
    status ENUM('Belum Ditindaklanjuti', 'Sedang Diproses', 'Selesai') NOT NULL DEFAULT 'Belum Ditindaklanjuti',
    is_priority BOOLEAN NOT NULL DEFAULT FALSE,
    action_taken TEXT,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (letter_in_id) REFERENCES letters_in(id) ON DELETE CASCADE,
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_department_id) REFERENCES departments(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS letters_out (
    id VARCHAR(36) PRIMARY KEY,
    letter_number VARCHAR(100) NOT NULL UNIQUE,
    destination VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    letter_date DATE NOT NULL,
    sender_department VARCHAR(100) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    sifat ENUM('Biasa', 'Penting', 'Segera', 'Rahasia') NOT NULL DEFAULT 'Biasa',
    category_id VARCHAR(36) NOT NULL,
    approval_status ENUM('Draft', 'Diajukan', 'Disetujui', 'Ditolak') NOT NULL DEFAULT 'Draft',
    status ENUM('Draft', 'Menunggu Approval', 'Siap Kirim', 'Terkirim', 'Diarsipkan') NOT NULL DEFAULT 'Draft',
    content LONGTEXT NOT NULL,
    signee_name VARCHAR(150) NOT NULL,
    signee_position VARCHAR(100) NOT NULL,
    notes TEXT,
    attachment_count INT NOT NULL DEFAULT 0,
    file_path VARCHAR(255),
    archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES letter_categories(id)
);

CREATE TABLE IF NOT EXISTS letter_templates (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    body_template LONGTEXT NOT NULL,
    default_sifat ENUM('Biasa', 'Penting', 'Segera', 'Rahasia') NOT NULL DEFAULT 'Biasa',
    variables_json JSON NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    usage_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(36) PRIMARY KEY,
    user_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXING OPTIMIZATIONS
CREATE INDEX idx_letters_in_dates ON letters_in (received_date, deadline_date);
CREATE INDEX idx_letters_in_status ON letters_in (status, sifat);
CREATE INDEX idx_dispositions_deadline ON dispositions (deadline_date, status);
CREATE INDEX idx_letters_out_approval ON letters_out (approval_status, status);
`;

export const laravelMigrationCode = `<?php
// Contoh Migration Laravel 11.x untuk Sistem E-Surat Sekolah

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code', 20)->unique();
            $table->string('name', 150);
            $table->string('leader_name', 150)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('letter_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code', 30)->unique();
            $table->string('name', 150);
            $table->string('prefix', 10)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('letters_in', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('agenda_number', 50)->unique();
            $table->string('reference_number', 100);
            $table->string('origin', 200);
            $table->text('subject');
            $table->date('received_date');
            $table->date('letter_date');
            $table->date('deadline_date')->nullable();
            $table->enum('sifat', ['Biasa', 'Penting', 'Segera', 'Rahasia'])->default('Biasa');
            $table->foreignUuid('category_id')->constrained('letter_categories');
            $table->enum('status', ['Diterima', 'Didisposisikan', 'Diproses', 'Selesai', 'Diarsipkan'])->default('Diterima');
            $table->text('summary')->nullable();
            $table->string('file_path')->nullable();
            $table->boolean('archived')->default(false);
            $table->string('archive_box', 50)->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('dispositions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('letter_in_id')->constrained('letters_in')->cascadeOnDelete();
            $table->foreignUuid('from_user_id')->constrained('users');
            $table->foreignUuid('to_department_id')->constrained('departments');
            $table->foreignUuid('to_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('instruction');
            $table->text('notes')->nullable();
            $table->date('deadline_date');
            $table->enum('sifat', ['Biasa', 'Penting', 'Segera', 'Rahasia'])->default('Biasa');
            $table->enum('status', ['Belum Ditindaklanjuti', 'Sedang Diproses', 'Selesai'])->default('Belum Ditindaklanjuti');
            $table->boolean('is_priority')->default(false);
            $table->text('action_taken')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dispositions');
        Schema::dropIfExists('letters_in');
        Schema::dropIfExists('letter_categories');
        Schema::dropIfExists('departments');
    }
};
`;

export const architectureExplanation = {
  title: 'Arsitektur Sistem Manajemen Surat Menyurat Sekolah (E-Surat)',
  pattern: 'Model-View-Controller (MVC) & Layered Clean Architecture',
  techStackRecommendation: [
    {
      role: 'Backend API / Framework',
      options: [
        'PHP 8.3+ dengan Laravel 11 (Rekomendasi Utama Sekolah di Indonesia karena integrasi cepat dengan ekosistem instansi, PDF generator dompdf/snappy, dan mail queue).',
        'Node.js (TypeScript) dengan Express.js / NestJS (Cocok untuk real-time websocket notifikasi disposisi dan performa tinggi).',
        'Python 3.12 dengan Django 5 / FastAPI (Sangat kuat untuk OCR ekstraksi otomatis dokumen pindaian surat).',
      ],
    },
    {
      role: 'Frontend Client',
      options: [
        'React 19 + TypeScript + Tailwind CSS (SPA interaktif, komponen modern, cetak lembar disposisi siap pakai).',
        'Blade + Alpine.js / Livewire (Jika menggunakan stack monolith Laravel terpadu).',
      ],
    },
    {
      role: 'Database & Storage',
      options: [
        'PostgreSQL 16 / MySQL 8 (Relational database dengan foreign keys, indexing per tanggal & status, serta full-text search).',
        'Object Storage (MinIO / AWS S3 / Local Secure Storage) untuk menyimpan scan berkas PDF surat masuk dan surat keluar ber-QR code.',
      ],
    },
  ],
  layers: [
    {
      name: '1. Presentation Layer (View & UI)',
      desc: 'Menampilkan antarmuka dashboard, buku agenda surat masuk, formulir pembuatan surat keluar dengan auto-numbering, lembar disposisi interaktif, approval bar, serta viewer cetak standar kedinasan.',
    },
    {
      name: '2. Application / Controller Layer',
      desc: 'Menerima request HTTP, memvalidasi format berkas surat (MIME type PDF/JPG < 5MB), memvalidasi nomor agenda berurutan (tanpa gap), dan mengontrol alur proses otorisasi pengguna berdasarkan role (RBAC).',
    },
    {
      name: '3. Domain / Service Business Logic Layer',
      desc: 'Mengelola aturan bisnis persuratan: penomoran otomatis klasifikasi Permendikbud, workflow approval berjenjang (Draft -> Kasubag TU -> Kepala Sekolah -> Approved), trigger notifikasi batas deadline jatuh tempo 3 hari, dan locking arsip.',
    },
    {
      name: '4. Data Access Layer (ORM / Repository)',
      desc: 'Menangani query transaksi ACID, pembuatan log audit secara otomatis saat ada status perubahan surat, serta backup berkas dan basis data terenkripsi.',
    },
  ],
};
