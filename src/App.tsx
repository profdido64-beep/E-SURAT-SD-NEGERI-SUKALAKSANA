/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  initialSchoolProfile,
  initialUsers,
  initialDepartments,
  initialCategories,
  initialLettersIn,
  initialLettersOut,
  initialDispositions,
  initialTemplates,
  initialArchives,
  initialActivityLogs,
} from './data/initialData';
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
  ArchiveRecord,
} from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SuratMasukView } from './components/SuratMasukView';
import { SuratKeluarView } from './components/SuratKeluarView';
import { DisposisiView } from './components/DisposisiView';
import { TemplateSuratView } from './components/TemplateSuratView';
import { ArsipDigitalView } from './components/ArsipDigitalView';
import { LaporanView } from './components/LaporanView';
import { MasterDataView } from './components/MasterDataView';
import { UserManagementView } from './components/UserManagementView';
import { SettingSekolahView } from './components/SettingSekolahView';
import { LogAktivitasView } from './components/LogAktivitasView';
import { DatabaseBackupView } from './components/DatabaseBackupView';
import { DatabaseSchemaModal } from './components/DatabaseSchemaModal';
import { InputMasukModal } from './components/Modals/InputMasukModal';
import { BuatKeluarModal } from './components/Modals/BuatKeluarModal';
import { DisposisiModal } from './components/Modals/DisposisiModal';
import { LetterPreviewModal } from './components/Modals/LetterPreviewModal';
import { LembarDisposisiPrintModal } from './components/Modals/LembarDisposisiPrintModal';

export default function App() {
  // Persistent State Init
  const [lettersIn, setLettersIn] = useState<LetterIn[]>(() => {
    const saved = localStorage.getItem('esurat_letters_in');
    return saved ? JSON.parse(saved) : initialLettersIn;
  });

  const [lettersOut, setLettersOut] = useState<LetterOut[]>(() => {
    const saved = localStorage.getItem('esurat_letters_out');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.some((l: any) => l.signeeName?.includes('Syaifullah')) ||
          !parsed.some((l: any) => l.id === 'SOUT-002')
        ) {
          return initialLettersOut;
        }
        return parsed;
      } catch {
        return initialLettersOut;
      }
    }
    return initialLettersOut;
  });

  const [dispositions, setDispositions] = useState<Disposition[]>(() => {
    const saved = localStorage.getItem('esurat_dispositions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some((d: any) => d.fromUserName?.includes('Syaifullah') || d.toUserName?.includes('Nurul'))) {
          return initialDispositions;
        }
        return parsed;
      } catch {
        return initialDispositions;
      }
    }
    return initialDispositions;
  });

  const [templates, setTemplates] = useState<LetterTemplate[]>(() => {
    const saved = localStorage.getItem('esurat_templates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.length < 5 ||
          !parsed.some((t: any) => t.code === 'TPL-PINDAH-SEKOLAH')
        ) {
          return initialTemplates;
        }
        return parsed;
      } catch {
        return initialTemplates;
      }
    }
    return initialTemplates;
  });

  const [archives, setArchives] = useState<ArchiveRecord[]>(() => {
    const saved = localStorage.getItem('esurat_archives');
    return saved ? JSON.parse(saved) : initialArchives;
  });

  const [categories, setCategories] = useState<LetterCategory[]>(() => {
    const saved = localStorage.getItem('esurat_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.some((c: any) => c.name?.includes('Mutasi Keluar'))) {
          return initialCategories;
        }
        return parsed;
      } catch {
        return initialCategories;
      }
    }
    return initialCategories;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('esurat_departments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some((d: any) => d.code === 'KUR' || d.code === 'SIS' || d.leaderName?.includes('Syaifullah'))) {
          return initialDepartments;
        }
        return parsed;
      } catch {
        return initialDepartments;
      }
    }
    return initialDepartments;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('esurat_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some((u: any) => u.name?.includes('Syaifullah') || u.role === 'Waka Kurikulum' || u.role === 'Waka Kesiswaan' || u.role === 'Tata Usaha')) {
          return initialUsers;
        }
        return parsed;
      } catch {
        return initialUsers;
      }
    }
    return initialUsers;
  });

  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem('esurat_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed.name === 'SMA Negeri 1 Teladan Nusantara' ||
          !parsed.name ||
          parsed.principalName?.includes('Syaifullah') ||
          !parsed.agencyName ||
          !parsed.subdistrictOffice ||
          parsed.principalNip !== '196908042008012008'
        ) {
          return initialSchoolProfile;
        }
        return parsed;
      } catch {
        return initialSchoolProfile;
      }
    }
    return initialSchoolProfile;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('esurat_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some((l: any) => l.userName?.includes('Syaifullah') || l.userName?.includes('Sri Wahyuni'))) {
          return initialActivityLogs;
        }
        return parsed;
      } catch {
        return initialActivityLogs;
      }
    }
    return initialActivityLogs;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User>(users[0] || initialUsers[0]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Modals state
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isInputMasukOpen, setIsInputMasukOpen] = useState(false);
  const [isBuatKeluarOpen, setIsBuatKeluarOpen] = useState(false);
  const [isDisposisiModalOpen, setIsDisposisiModalOpen] = useState(false);
  const [targetDisposisiLetter, setTargetDisposisiLetter] = useState<LetterIn | null>(null);

  const [previewLetterIn, setPreviewLetterIn] = useState<LetterIn | null>(null);
  const [previewLetterOut, setPreviewLetterOut] = useState<LetterOut | null>(null);
  const [previewDisposisiPrint, setPreviewDisposisiPrint] = useState<Disposition | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('esurat_letters_in', JSON.stringify(lettersIn));
  }, [lettersIn]);
  useEffect(() => {
    localStorage.setItem('esurat_letters_out', JSON.stringify(lettersOut));
  }, [lettersOut]);
  useEffect(() => {
    localStorage.setItem('esurat_dispositions', JSON.stringify(dispositions));
  }, [dispositions]);
  useEffect(() => {
    localStorage.setItem('esurat_templates', JSON.stringify(templates));
  }, [templates]);
  useEffect(() => {
    localStorage.setItem('esurat_archives', JSON.stringify(archives));
  }, [archives]);
  useEffect(() => {
    localStorage.setItem('esurat_categories', JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem('esurat_departments', JSON.stringify(departments));
  }, [departments]);
  useEffect(() => {
    localStorage.setItem('esurat_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('esurat_profile', JSON.stringify(schoolProfile));
  }, [schoolProfile]);
  useEffect(() => {
    localStorage.setItem('esurat_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Log activity helper
  const addLog = (action: string, module: string, details: string) => {
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      userName: currentUser.name,
      role: currentUser.role,
      action,
      module,
      details,
      ipAddress: '192.168.1.104',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Next Agenda Number Generator
  const getNextAgendaNumber = () => {
    const count = lettersIn.length + 1;
    return `SM-2026/${String(count).padStart(3, '0')}`;
  };

  // Next Letter Number Generator
  const getNextLetterNumber = () => {
    const count = lettersOut.length + 1;
    return `400.3.12.1/${String(count).padStart(3, '0')}/SD-Skl/VIII/2026`;
  };

  // Actions
  const handleSaveLetterIn = (newLetter: Omit<LetterIn, 'id' | 'createdAt'>) => {
    const letter: LetterIn = {
      ...newLetter,
      id: `SIN-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLettersIn((prev) => [letter, ...prev]);
    addLog('CREATE_SURAT_MASUK', 'Surat Masuk', `Mencatat agenda masuk ${letter.agendaNumber} dari ${letter.origin}.`);
  };

  const handleSaveLetterOut = (newLetter: Omit<LetterOut, 'id' | 'createdAt'>) => {
    const letter: LetterOut = {
      ...newLetter,
      id: `SOUT-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLettersOut((prev) => [letter, ...prev]);
    addLog('CREATE_SURAT_KELUAR', 'Surat Keluar', `Membuat surat keluar nomor ${letter.letterNumber} tujuan ${letter.destination}.`);
  };

  const handleSaveDisposition = (newDisp: Omit<Disposition, 'id' | 'createdAt'>) => {
    const disp: Disposition = {
      ...newDisp,
      id: `DISP-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDispositions((prev) => [disp, ...prev]);

    // Update status in letterIn
    setLettersIn((prev) =>
      prev.map((l) => (l.id === disp.letterInId ? { ...l, status: 'Didisposisikan' } : l))
    );

    addLog('CREATE_DISPOSISI', 'Disposisi', `Menerbitkan disposisi untuk agenda ${disp.letterInAgenda} ke ${disp.toDepartmentName}.`);
  };

  const handleUpdateApproval = (letterId: string, status: 'Disetujui' | 'Ditolak', notes?: string) => {
    setLettersOut((prev) =>
      prev.map((l) =>
        l.id === letterId
          ? {
              ...l,
              approvalStatus: status,
              status: status === 'Disetujui' ? 'Siap Kirim' : 'Draft',
              notes: notes || l.notes,
            }
          : l
      )
    );
    const target = lettersOut.find((l) => l.id === letterId);
    addLog(
      status === 'Disetujui' ? 'APPROVE_SURAT' : 'REJECT_SURAT',
      'Surat Keluar',
      `${status === 'Disetujui' ? 'Menyetujui' : 'Menolak'} pengajuan surat keluar ${target?.letterNumber || letterId}.`
    );
  };

  const handleUpdateDispositionStatus = (
    dispId: string,
    newStatus: 'Belum Ditindaklanjuti' | 'Sedang Diproses' | 'Selesai',
    actionTaken?: string
  ) => {
    setDispositions((prev) =>
      prev.map((d) =>
        d.id === dispId
          ? {
              ...d,
              status: newStatus,
              actionTaken: actionTaken || d.actionTaken,
              completedAt: newStatus === 'Selesai' ? new Date().toISOString() : undefined,
            }
          : d
      )
    );
    const target = dispositions.find((d) => d.id === dispId);
    addLog(
      'UPDATE_DISPOSISI_STATUS',
      'Disposisi',
      `Memperbarui status disposisi agenda ${target?.letterInAgenda} menjadi ${newStatus}.`
    );
  };

  const handleArchiveLetterIn = (letterId: string) => {
    setLettersIn((prev) =>
      prev.map((l) => (l.id === letterId ? { ...l, archived: true, status: 'Diarsipkan' } : l))
    );
    const target = lettersIn.find((l) => l.id === letterId);
    if (target) {
      const rec: ArchiveRecord = {
        id: `ARC-${Date.now()}`,
        letterType: 'Masuk',
        letterId: target.id,
        referenceNumber: target.agendaNumber,
        subject: target.subject,
        date: target.receivedDate,
        category: target.categoryName,
        boxNumber: 'BOX-2026-01',
        rackNumber: 'RAK-A1',
        retentionYear: 2031,
      };
      setArchives((prev) => [rec, ...prev]);
      addLog('ARCHIVE_SURAT', 'Arsip Digital', `Memindahkan surat masuk ${target.agendaNumber} ke boks arsip.`);
    }
  };

  const handleArchiveLetterOut = (letterId: string) => {
    setLettersOut((prev) =>
      prev.map((l) => (l.id === letterId ? { ...l, archived: true, status: 'Diarsipkan' } : l))
    );
    const target = lettersOut.find((l) => l.id === letterId);
    if (target) {
      const rec: ArchiveRecord = {
        id: `ARC-${Date.now()}`,
        letterType: 'Keluar',
        letterId: target.id,
        referenceNumber: target.letterNumber,
        subject: target.subject,
        date: target.letterDate,
        category: target.categoryName,
        boxNumber: 'BOX-2026-02',
        rackNumber: 'RAK-B2',
        retentionYear: 2036,
      };
      setArchives((prev) => [rec, ...prev]);
      addLog('ARCHIVE_SURAT', 'Arsip Digital', `Memindahkan surat keluar ${target.letterNumber} ke boks arsip.`);
    }
  };

  const handleDeleteLetterIn = (letterId: string) => {
    setLettersIn((prev) => prev.filter((l) => l.id !== letterId));
    addLog('DELETE_SURAT_MASUK', 'Surat Masuk', `Menghapus surat masuk ID: ${letterId}`);
  };

  const handleDeleteLetterOut = (letterId: string) => {
    setLettersOut((prev) => prev.filter((l) => l.id !== letterId));
    addLog('DELETE_SURAT_KELUAR', 'Surat Keluar', `Menghapus surat keluar ID: ${letterId}`);
  };

  const handleAddCategory = (cat: Omit<LetterCategory, 'id'>) => {
    const newCat: LetterCategory = { ...cat, id: `CAT-${Date.now()}` };
    setCategories((prev) => [...prev, newCat]);
    addLog('CREATE_CATEGORY', 'Master Data', `Menambahkan kategori persuratan baru [${cat.code}] ${cat.name}.`);
  };

  const handleAddDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept: Department = { ...dept, id: `DEP-${Date.now()}` };
    setDepartments((prev) => [...prev, newDept]);
    addLog('CREATE_DEPARTMENT', 'Master Data', `Menambahkan unit/bidang baru ${dept.name}.`);
  };

  const handleAddUser = (user: Omit<User, 'id'>) => {
    const newUser: User = { ...user, id: `USR-${Date.now()}` };
    setUsers((prev) => [...prev, newUser]);
    addLog('CREATE_USER', 'Manajemen User', `Menambahkan akun pengguna baru: ${user.name} (${user.role}).`);
  };

  // Get active tab title
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'surat-masuk':
        return 'Surat Masuk';
      case 'disposisi':
        return 'Disposisi';
      case 'surat-keluar':
        return 'Surat Keluar';
      case 'template-surat':
        return 'Template Surat';
      case 'arsip-digital':
        return 'Arsip Digital';
      case 'laporan-masuk':
        return 'Laporan Masuk';
      case 'laporan-keluar':
        return 'Laporan Keluar';
      case 'kategori-surat':
        return 'Kategori Surat';
      case 'bidang-bagian':
        return 'Bidang / Bagian';
      case 'data-user':
        return 'Data User';
      case 'setting':
        return 'Setting';
      case 'log-aktivitas':
        return 'Log Aktivitas';
      case 'backup-database':
        return 'Backup Database & ERD';
      default:
        return 'Dashboard';
    }
  };

  // Deadline count
  const deadlineCount = dispositions.filter((d) => d.status !== 'Selesai').length;

  return (
    <div className="flex h-screen bg-slate-100/70 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Dark Navy Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        counts={{
          suratMasuk: lettersIn.length,
          disposisi: dispositions.filter((d) => d.status !== 'Selesai').length,
          suratKeluar: lettersOut.length,
          template: templates.length,
          arsip: archives.length,
        }}
        schoolName={schoolProfile.name}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <Header
          currentUser={currentUser}
          onLogout={() => {
            if (confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
              alert('Sesi berhasil diakhiri.');
            }
          }}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            addLog('SWITCH_USER', 'Autentikasi', `Beralih peran ke: ${user.name} (${user.role}).`);
          }}
          allUsers={users}
          onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
          deadlineCount={deadlineCount}
          activeTabTitle={getTabTitle()}
          onNavigateToTab={(tab) => setActiveTab(tab)}
        />

        {/* Dynamic View Scroll Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                lettersIn={lettersIn}
                lettersOut={lettersOut}
                dispositions={dispositions}
                templates={templates}
                archives={archives}
                onOpenInputMasukModal={() => setIsInputMasukOpen(true)}
                onOpenBuatKeluarModal={() => setIsBuatKeluarOpen(true)}
                onOpenDisposisiModal={(letterIn) => {
                  setTargetDisposisiLetter(letterIn || null);
                  setIsDisposisiModalOpen(true);
                }}
                onOpenLetterInPreview={(letter) => setPreviewLetterIn(letter)}
                onOpenLetterOutPreview={(letter) => setPreviewLetterOut(letter)}
                onOpenDisposisiPrint={(disp) => setPreviewDisposisiPrint(disp)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'surat-masuk' && (
              <SuratMasukView
                letters={lettersIn}
                categories={categories}
                onOpenInputModal={() => setIsInputMasukOpen(true)}
                onOpenPreview={(letter) => setPreviewLetterIn(letter)}
                onOpenDisposisiModal={(letter) => {
                  setTargetDisposisiLetter(letter);
                  setIsDisposisiModalOpen(true);
                }}
                onArchiveLetter={handleArchiveLetterIn}
                onDeleteLetter={handleDeleteLetterIn}
              />
            )}

            {activeTab === 'surat-keluar' && (
              <SuratKeluarView
                letters={lettersOut}
                categories={categories}
                currentUser={currentUser}
                onOpenBuatModal={() => setIsBuatKeluarOpen(true)}
                onOpenPreview={(letter) => setPreviewLetterOut(letter)}
                onUpdateApproval={handleUpdateApproval}
                onArchiveLetter={handleArchiveLetterOut}
                onDeleteLetter={handleDeleteLetterOut}
              />
            )}

            {activeTab === 'disposisi' && (
              <DisposisiView
                dispositions={dispositions}
                lettersIn={lettersIn}
                onOpenCreateModal={() => {
                  setTargetDisposisiLetter(null);
                  setIsDisposisiModalOpen(true);
                }}
                onOpenPrintModal={(disp) => setPreviewDisposisiPrint(disp)}
                onUpdateStatus={handleUpdateDispositionStatus}
              />
            )}

            {activeTab === 'template-surat' && (
              <TemplateSuratView
                templates={templates}
                onOpenBuatLetterWithTemplate={(tpl, renderedBody) => {
                  setIsBuatKeluarOpen(true);
                }}
                onAddNewTemplate={(newTpl) => {
                  const tpl: LetterTemplate = { ...newTpl, id: `TPL-${Date.now()}` };
                  setTemplates((prev) => [...prev, tpl]);
                  addLog('CREATE_TEMPLATE', 'Template Surat', `Menambahkan master template ${tpl.title}.`);
                }}
              />
            )}

            {activeTab === 'arsip-digital' && (
              <ArsipDigitalView
                lettersIn={lettersIn}
                lettersOut={lettersOut}
                archives={archives}
              />
            )}

            {activeTab === 'laporan-masuk' && (
              <LaporanView
                type="masuk"
                lettersIn={lettersIn}
                lettersOut={lettersOut}
                schoolProfile={schoolProfile}
              />
            )}

            {activeTab === 'laporan-keluar' && (
              <LaporanView
                type="keluar"
                lettersIn={lettersIn}
                lettersOut={lettersOut}
                schoolProfile={schoolProfile}
              />
            )}

            {activeTab === 'kategori-surat' && (
              <MasterDataView
                type="kategori"
                categories={categories}
                departments={departments}
                onAddCategory={handleAddCategory}
                onAddDepartment={handleAddDepartment}
              />
            )}

            {activeTab === 'bidang-bagian' && (
              <MasterDataView
                type="bidang"
                categories={categories}
                departments={departments}
                onAddCategory={handleAddCategory}
                onAddDepartment={handleAddDepartment}
              />
            )}

            {activeTab === 'data-user' && (
              <UserManagementView
                users={users}
                departments={departments}
                onAddUser={handleAddUser}
              />
            )}

            {activeTab === 'setting' && (
              <SettingSekolahView
                schoolProfile={schoolProfile}
                onSaveProfile={(prof) => {
                  setSchoolProfile(prof);
                  addLog('UPDATE_PROFILE', 'Pengaturan', 'Memperbarui profil sekolah dan kop dinas.');
                }}
              />
            )}

            {activeTab === 'log-aktivitas' && (
              <LogAktivitasView logs={activityLogs} />
            )}

            {activeTab === 'backup-database' && (
              <DatabaseBackupView
                onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
                allAppState={{
                  schoolProfile,
                  users,
                  departments,
                  categories,
                  lettersIn,
                  lettersOut,
                  dispositions,
                  templates,
                  archives,
                  activityLogs,
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      <DatabaseSchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />

      <InputMasukModal
        isOpen={isInputMasukOpen}
        onClose={() => setIsInputMasukOpen(false)}
        categories={categories}
        onSave={handleSaveLetterIn}
        nextAgendaNumber={getNextAgendaNumber()}
      />

      <BuatKeluarModal
        isOpen={isBuatKeluarOpen}
        onClose={() => setIsBuatKeluarOpen(false)}
        categories={categories}
        departments={departments}
        templates={templates}
        currentUser={currentUser}
        onSave={handleSaveLetterOut}
        nextLetterNumber={getNextLetterNumber()}
      />

      <DisposisiModal
        isOpen={isDisposisiModalOpen}
        onClose={() => {
          setIsDisposisiModalOpen(false);
          setTargetDisposisiLetter(null);
        }}
        lettersIn={lettersIn}
        departments={departments}
        users={users}
        currentUser={currentUser}
        targetLetter={targetDisposisiLetter}
        onSave={handleSaveDisposition}
      />

      <LetterPreviewModal
        isOpen={!!previewLetterIn || !!previewLetterOut}
        onClose={() => {
          setPreviewLetterIn(null);
          setPreviewLetterOut(null);
        }}
        letterIn={previewLetterIn}
        letterOut={previewLetterOut}
        schoolProfile={schoolProfile}
      />

      <LembarDisposisiPrintModal
        isOpen={!!previewDisposisiPrint}
        onClose={() => setPreviewDisposisiPrint(null)}
        disposition={previewDisposisiPrint}
        schoolProfile={schoolProfile}
      />
    </div>
  );
}
