import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  GitPullRequest,
  FileUp,
  FileCode2,
  FolderArchive,
  FileBarChart,
  FileText,
  Tags,
  Building2,
  Users,
  Settings,
  ShieldCheck,
  Database,
  School,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { LogoKabupatenCianjur } from './KopSurat';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  counts: {
    suratMasuk: number;
    disposisi: number;
    suratKeluar: number;
    template: number;
    arsip: number;
  };
  schoolName: string;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  counts,
  schoolName,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const menuGroups = [
    {
      groupTitle: 'UTAMA',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: null,
          badgeColor: '',
        },
      ],
    },
    {
      groupTitle: 'TRANSAKSI',
      items: [
        {
          id: 'surat-masuk',
          label: 'Surat Masuk',
          icon: Inbox,
          badge: counts.suratMasuk > 0 ? counts.suratMasuk : null,
          badgeColor: 'bg-blue-600 text-white',
        },
        {
          id: 'disposisi',
          label: 'Disposisi',
          icon: GitPullRequest,
          badge: counts.disposisi > 0 ? counts.disposisi : null,
          badgeColor: 'bg-amber-500 text-slate-900 font-bold',
        },
        {
          id: 'surat-keluar',
          label: 'Surat Keluar',
          icon: FileUp,
          badge: counts.suratKeluar > 0 ? counts.suratKeluar : null,
          badgeColor: 'bg-emerald-600 text-white',
        },
        {
          id: 'template-surat',
          label: 'Template Surat',
          icon: FileCode2,
          badge: counts.template > 0 ? counts.template : null,
          badgeColor: 'bg-indigo-600 text-white',
        },
        {
          id: 'arsip-digital',
          label: 'Arsip Digital',
          icon: FolderArchive,
          badge: counts.arsip > 0 ? counts.arsip : null,
          badgeColor: 'bg-slate-600 text-white',
        },
      ],
    },
    {
      groupTitle: 'LAPORAN',
      items: [
        {
          id: 'laporan-masuk',
          label: 'Laporan Masuk',
          icon: FileBarChart,
          badge: null,
          badgeColor: '',
        },
        {
          id: 'laporan-keluar',
          label: 'Laporan Keluar',
          icon: FileText,
          badge: null,
          badgeColor: '',
        },
      ],
    },
    {
      groupTitle: 'MASTER & SETTING',
      items: [
        {
          id: 'kategori-surat',
          label: 'Kategori Surat',
          icon: Tags,
          badge: null,
          badgeColor: '',
        },
        {
          id: 'bidang-bagian',
          label: 'Bidang / Bagian',
          icon: Building2,
          badge: null,
          badgeColor: '',
        },
        {
          id: 'data-user',
          label: 'Data User',
          icon: Users,
          badge: null,
          badgeColor: '',
        },
        {
          id: 'setting',
          label: 'Setting',
          icon: Settings,
          badge: null,
          badgeColor: '',
        },
        {
          id: 'log-aktivitas',
          label: 'Log Aktivitas',
          icon: ShieldCheck,
          badge: null,
          badgeColor: '',
        },
        {
          id: 'backup-database',
          label: 'Backup Database',
          icon: Database,
          badge: 'ERD',
          badgeColor: 'bg-teal-500 text-slate-900 font-bold',
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-64 bg-[#0d1b2a] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* School / App Branding Header */}
        <div className="p-4 border-b border-slate-800/80 bg-[#09111c] flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700/80 p-1 shadow-md shrink-0 flex items-center justify-center">
            <LogoKabupatenCianjur size={34} />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-sm tracking-wider">E-SURAT</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded font-mono font-bold">
                CIANJUR
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-300 truncate" title={schoolName}>
              {schoolName}
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.groupTitle}
              </div>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge !== null && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info box */}
        <div className="p-3 border-t border-slate-800/80 bg-[#09111c]/60">
          <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-200">Sistem Tata Usaha</p>
              <p className="text-[10px] text-slate-400">Standar Klasifikasi 2026</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sistem Online" />
          </div>
        </div>
      </aside>
    </>
  );
};
