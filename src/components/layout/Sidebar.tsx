import React from 'react';
import { NavSection, KPIStats } from '../../types';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  GraduationCap,
  MapPin,
  Target,
  BookOpen,
  Sparkles,
  UserCheck,
  Compass,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  kpis: KPIStats;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  kpis,
  collapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavSection,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'admin' as NavSection,
      label: 'Inf. Administrativa',
      icon: FolderKanban,
      badge: 'Hub',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'journey' as NavSection,
      label: 'Inicio jornada',
      icon: CheckSquare,
      badge: kpis.pendingTasks > 0 ? `${kpis.pendingTasks}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'training' as NavSection,
      label: 'Formación',
      icon: GraduationCap,
      badge: `${kpis.trainingProgress}%`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    },
    {
      id: 'knowledge' as NavSection,
      label: 'Conocimiento',
      icon: BookOpen,
      badge: 'Fuentes',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'copilot' as NavSection,
      label: 'Asistente IA',
      icon: Sparkles,
      badge: 'Copilot',
      badgeColor: 'bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-900 font-bold',
      isHighlight: true,
    },
    {
      id: 'profile' as NavSection,
      label: 'Perfil',
      icon: UserCheck,
      badge: null,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between transition-all duration-300 bg-gradient-to-b from-[#0b1724] via-[#0F3D66] to-[#0a233a] text-white border-r border-[#1F5E99]/40 z-40 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F5E99] to-[#4A90E2] p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
              <Compass className="w-6 h-6 text-white animate-pulse-subtle" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="flex items-center gap-1.5 font-extrabold tracking-wider text-base text-white">
                  <span>AIDEX</span>
                  <span className="text-[#38BDF8] text-xs px-1.5 py-0.5 bg-white/10 rounded-md">0.7</span>
                </div>
                <p className="text-[10px] text-blue-200/80 font-medium tracking-wide">Inducción Comercial</p>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
            className="p-1.5 rounded-lg text-blue-200/70 hover:text-white hover:bg-white/10 transition"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-[#4A90E2] text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-200/80 hover:text-white hover:bg-white/10'
                } ${item.isHighlight && !isActive ? 'hover:bg-gradient-to-r hover:from-white/10 hover:to-blue-500/20' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : item.isHighlight ? 'text-[#38BDF8]' : 'text-blue-300'
                  }`}
                />

                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border border-transparent font-medium ${
                          item.badgeColor || 'bg-white/10 text-blue-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {/* Collapsed dot for active */}
                {collapsed && isActive && (
                  <span className="absolute right-1.5 w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User status / Log out */}
      <div className="p-3 border-t border-white/10">
        {!collapsed ? (
          <div className="p-2.5 rounded-xl bg-black/20 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-blue-200/80">
              <span>Identidad TONOZ</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
              </span>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onLogout}
            className="w-full p-2.5 rounded-xl text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 transition flex justify-center"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
