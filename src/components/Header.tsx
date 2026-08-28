import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  Clock,
  Database,
  Calendar,
  AlertTriangle,
  ChevronDown,
  Shield,
  Layers
} from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
  onSwitchUser: (user: User) => void;
  allUsers: User[];
  onOpenSchemaModal: () => void;
  deadlineCount: number;
  activeTabTitle: string;
  onNavigateToTab: (tab: string) => void;
  onSearchGlobal?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onSwitchUser,
  allUsers,
  onOpenSchemaModal,
  deadlineCount,
  activeTabTitle,
  onNavigateToTab,
  onSearchGlobal,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const dateStr = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setCurrentTime(timeStr + ' WIB');
      setCurrentDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onSearchGlobal) {
      onSearchGlobal(e.target.value);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Page Title & Breadcrumb */}
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              {activeTabTitle}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Sistem Informasi Manajemen Persuratan & Tata Usaha Sekolah
            </p>
          </div>
        </div>

        {/* Center: Global Search & Live Date */}
        <div className="flex-1 max-w-md hidden md:flex items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Cari nomor surat, agenda, perihal, atau instansi..."
              className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right: Date Time, ERD Blueprint Button, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Real-time Clock Widget */}
          <div className="hidden lg:flex flex-col text-right pr-2 border-r border-slate-200">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 justify-end">
              <Calendar className="w-3 h-3 text-blue-600" /> {currentDate}
            </span>
            <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3 text-slate-400" /> {currentTime}
            </span>
          </div>

          {/* Database Schema & Architecture Button */}
          <button
            onClick={onOpenSchemaModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium transition shadow-xs"
            title="Lihat Skema Database & Arsitektur Aplikasi"
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden xl:inline">Skema Database & MVC</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              title="Notifikasi & Peringatan Deadline"
            >
              <Bell className="w-5 h-5" />
              {deadlineCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                  {deadlineCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-blue-600" /> Notifikasi Persuratan
                  </h4>
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {deadlineCount} Mendesak
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  <div
                    onClick={() => {
                      onNavigateToTab('disposisi');
                      setShowNotifMenu(false);
                    }}
                    className="p-3 hover:bg-red-50/60 cursor-pointer transition flex items-start gap-3"
                  >
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Mendekati Deadline (3 Hari)</span>
                        <span className="text-[10px] text-slate-400">SM-2026/001</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-0.5 font-medium">
                        Disposisi Rakor ANBK 2026 Disdik DKI
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Batas tindak lanjut: 24 Agustus 2026 (Segera)
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      onNavigateToTab('surat-masuk');
                      setShowNotifMenu(false);
                    }}
                    className="p-3 hover:bg-blue-50/60 cursor-pointer transition flex items-start gap-3"
                  >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-700">Surat Masuk Baru</span>
                        <span className="text-[10px] text-slate-400">Hari ini</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-0.5">
                        Permohonan Fasilitasi Ruang Rapat Komite Sekolah
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      onNavigateToTab('disposisi');
                      setShowNotifMenu(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Lihat Semua Disposisi & Deadline →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.role === 'Administrator' ? 'Administrator (Admin)' : currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* User Profile Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-xs text-slate-500">Masuk sebagai:</p>
                  <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-semibold rounded">
                    {currentUser.role}
                  </span>
                </div>

                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Ganti Peran Pengguna (Simulasi RBAC):
                  </p>
                  <div className="space-y-1">
                    {allUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSwitchUser(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                          currentUser.id === u.id
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2 shrink-0">
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log-out (Keluar Sistem)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Direct Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition shadow-xs"
            title="Keluar dari sesi aplikasi"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Log-out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
