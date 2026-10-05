import React, { useState } from 'react';
import { NavSection, UserProfile } from '../../types';
import { Search, Bell, Moon, Sun, Sparkles, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface HeaderProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  user: UserProfile;
  onSearchOpen: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onNavigate,
  user,
  onSearchOpen,
  theme,
  onToggleTheme,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Brecha de Material POP Vencida',
      desc: 'El PDV Mall Plaza requiere reposición de afiches Q4.',
      time: 'Hace 20 min',
      read: false,
      section: 'gaps' as NavSection,
    },
    {
      id: 'notif-2',
      title: 'Nuevo recurso en Centro de Conocimiento',
      desc: 'Se publicó el video: "Manejo de objeciones en el primer contacto".',
      time: 'Hace 1 hora',
      read: false,
      section: 'knowledge' as NavSection,
    },
    {
      id: 'notif-3',
      title: 'Avance del Curso CVS al 70%',
      desc: 'Completa la lección de cierre consultivo para obtener tu insignia.',
      time: 'Hoy, 09:00 AM',
      read: true,
      section: 'training' as NavSection,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const sectionTitles: Record<NavSection, string> = {
    dashboard: 'Dashboard Principal',
    admin: 'Gestión Administrativa',
    journey: 'Inicio de Jornada',
    training: 'Formación y Desarrollo',
    field: 'Ejecución en Campo',
    gaps: 'Cierre de Brechas',
    knowledge: 'Centro de Conocimiento',
    copilot: 'Asistente IA AIDEX',
    profile: 'Perfil del Ejecutivo',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0b1118]/90 backdrop-blur-md px-4 sm:px-6 transition-colors">
      {/* Left: Breadcrumbs / Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="hidden sm:inline font-bold text-[#0F3D66] dark:text-[#38BDF8]">AIDEX 0.7</span>
          <ChevronRight className="hidden sm:inline w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-bold text-sm sm:text-base">
            {sectionTitles[currentSection]}
          </span>
        </div>
      </div>

      {/* Center: Quick Search Trigger */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          onClick={onSearchOpen}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 transition shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#1F5E99] dark:text-[#38BDF8]" />
            <span>Buscar cursos, documentos, PDVs, objeciones...</span>
          </div>
          <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-semibold bg-white dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          onClick={onSearchOpen}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Buscar en AIDEX"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0F172A] p-4 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Notificaciones</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      {unreadCount} nuevas
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-[#1F5E99] dark:text-[#38BDF8] hover:underline"
                    >
                      Marcar leídas
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onNavigate(n.section);
                      setShowNotifications(false);
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition ${
                      n.read
                        ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-75'
                        : 'bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => {
                    onNavigate('copilot');
                    setShowNotifications(false);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1F5E99] dark:text-[#38BDF8] hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Consultar resumen diario con Asistente IA</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Button */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition group"
          title="Ver perfil de Juan Pérez"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0F3D66] to-[#4A90E2] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-[#4A90E2]/20 group-hover:ring-[#4A90E2]/50 transition">
            {user.initials}
          </div>
          <div className="hidden xl:block text-left leading-tight">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{user.region}</p>
          </div>
        </button>
      </div>
    </header>
  );
};
