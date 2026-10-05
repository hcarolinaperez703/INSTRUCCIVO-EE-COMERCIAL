import React from 'react';
import { NavSection } from '../../types';
import { LayoutDashboard, FolderKanban, CheckSquare, GraduationCap, BookOpen, Sparkles, Menu } from 'lucide-react';

interface MobileNavProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenMoreMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentSection,
  onNavigate,
  onOpenMoreMenu,
}) => {
  const items = [
    { id: 'dashboard' as NavSection, label: 'Inicio', icon: LayoutDashboard },
    { id: 'admin' as NavSection, label: 'Admin', icon: FolderKanban },
    { id: 'journey' as NavSection, label: 'Jornada', icon: CheckSquare },
    { id: 'training' as NavSection, label: 'Formación', icon: GraduationCap },
    { id: 'knowledge' as NavSection, label: 'Fuentes', icon: BookOpen },
    { id: 'copilot' as NavSection, label: 'Copilot', icon: Sparkles, highlight: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b1118]/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-1 py-1.5 flex items-center justify-around safe-area-bottom shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentSection === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
              isActive
                ? 'text-[#1F5E99] dark:text-[#38BDF8]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60'
                  : item.highlight
                  ? 'bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 text-[#1F5E99]'
                  : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* Profile quick button */}
      <button
        onClick={onOpenMoreMenu}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900"
      >
        <div className="p-1">
          <Menu className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-semibold mt-0.5">Más</span>
      </button>
    </nav>
  );
};
