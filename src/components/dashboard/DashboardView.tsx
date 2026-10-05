import React from 'react';
import { NavSection, KPIStats, UserProfile, MonthlyGoalItem } from '../../types';
import {
  Calendar,
  FolderKanban,
  GraduationCap,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Video,
  Award,
  Layers,
  Flame,
  Link2,
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  kpis: KPIStats;
  monthlyGoals: MonthlyGoalItem[];
  onNavigate: (section: NavSection) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  kpis,
  monthlyGoals,
  onNavigate,
}) => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Buenos días' : currentHour < 18 ? 'Buenas tardes' : 'Buenas noches';

  // 4 Core Simplified Modules
  const coreModules = [
    {
      id: 'admin' as NavSection,
      icon: FolderKanban,
      title: 'Información Administrativa',
      subtitle: '6 Secciones Oficiales',
      desc: 'Grabaciones, SharePoint semanal, cursos asignados, maratones, preturnos y construcción de mallas.',
      tag: 'Hub Central',
      tagColor: 'bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]',
      actionText: 'Abrir Administración',
      highlights: ['Grabaciones & SharePoint', 'Cursos, Maratones & Preturnos', 'Construcción de Mallas'],
    },
    {
      id: 'journey' as NavSection,
      icon: Calendar,
      title: 'Inicio de Jornada',
      subtitle: 'Checklist Pre-Jornada',
      desc: 'Confirmación de pendientes y verificaciones obligatorias antes de salir a la operación comercial.',
      tag: kpis.pendingTasks > 0 ? `${kpis.pendingTasks} Por confirmar` : 'Al día',
      tagColor: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
      actionText: 'Confirmar Pendientes',
      highlights: ['Revisión de agenda', 'Validación de metas', 'Consultar preturnos'],
    },
    {
      id: 'training' as NavSection,
      icon: GraduationCap,
      title: 'Formación',
      subtitle: 'Mallas, CVS & Brechas',
      desc: 'Mallas (cronograma de formación), Curso CVS y Cierre de Brechas (cierre de conocimiento posterior a una formación).',
      tag: 'Malla, CVS & Brechas',
      tagColor: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
      actionText: 'Explorar Formación',
      highlights: ['¿Qué es una Malla?', 'Curso Asesor CVS', 'Cierre de Brechas (post-formación)'],
    },
    {
      id: 'knowledge' as NavSection,
      icon: BookOpen,
      title: 'Conocimiento',
      subtitle: 'Fuentes & Enlaces',
      desc: 'Fuentes oficiales con acceso a hipervincular enlaces: botones directos Conectados y Success Factor.',
      tag: 'Fuentes & Portales',
      tagColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
      actionText: 'Ver Fuentes & Enlaces',
      highlights: ['Botón Conectados', 'Botón Success Factor', 'Hipervincular Fuentes'],
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F3D66] via-[#1F5E99] to-[#2563EB] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-100 mb-2 border border-white/10">
              <Award className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>AIDEX 0.7 · {user.role}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {greeting}, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl leading-relaxed">
              Plataforma simplificada de información administrativa, inicio de jornada, formación (mallas y cursos CBS) y fuentes de conocimiento.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('journey')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0F3D66] hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-lg transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-[#1F5E99]" />
              <span>Inicio de Jornada</span>
            </button>
            <button
              onClick={() => onNavigate('copilot')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-slate-900 text-xs sm:text-sm font-black shadow-lg transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Asistente IA</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle decorative light */}
        <div className="absolute -top-12 -right-12 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      </div>

      {/* 4 Core Simplified Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Módulos Principales</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8] font-bold">
                Estructura Simplificada
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Accede directamente a la información administrativa, tu checklist de inicio, formación y fuentes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreModules.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#1F5E99]/50 dark:hover:border-[#38BDF8]/50 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF2F6] dark:bg-slate-800 text-[#1F5E99] dark:text-[#38BDF8] flex items-center justify-center group-hover:bg-[#1F5E99] group-hover:text-white transition-colors shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${card.tagColor}`}
                    >
                      {card.tag}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {card.subtitle}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-[#1F5E99] dark:group-hover:text-[#38BDF8] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {card.desc}
                  </p>

                  <div className="mt-3 space-y-1">
                    {card.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-[#1F5E99] dark:text-[#38BDF8] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#1F5E99] dark:text-[#38BDF8] group-hover:translate-x-0.5 transition-transform">
                  <span>{card.actionText}</span>
                  <ArrowRight className="w-4 h-4 text-[#4A90E2]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Administrative Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Quick Administrative Shortcuts */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-[#1F5E99] dark:text-[#38BDF8]" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Resumen de Información Administrativa
              </h3>
            </div>
            <button
              onClick={() => onNavigate('admin')}
              className="text-xs text-[#1F5E99] dark:text-[#38BDF8] hover:underline font-bold"
            >
              Ver todas las secciones →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div
              onClick={() => onNavigate('admin')}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Las Grabaciones</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#1F5E99]">
                  3 Disponibles
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Sesiones TTT, masterclasses de red 5G y comités directivos.</p>
            </div>

            <div
              onClick={() => onNavigate('admin')}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-sky-600" />
                  <span>SharePoint Semanal</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700">
                  Semana Activa
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Documentos oficiales, tarifarios y prioridades de la semana.</p>
            </div>

            <div
              onClick={() => onNavigate('admin')}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Maratones & Preturnos</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700">
                  Asignados
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Maratón de Fibra Simétrica y preturnos diarios con tu líder.</p>
            </div>

            <div
              onClick={() => onNavigate('admin')}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Construcción de Mallas</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700">
                  Diseñador
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Cronogramas de formación estructurados por semana y modalidad.</p>
            </div>
          </div>
        </div>

        {/* Right: Quick Start Shift Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0F3D66] to-[#1F5E99] text-white shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
                Inicio de Jornada
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                Checklist Previo
              </span>
            </div>
            <h4 className="text-lg font-bold">Verificación de Pendientes</h4>
            <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">
              Confirma las verificaciones antes de salir a la operación: revisa tu agenda, valida tus metas y consulta tus alertas y preturnos.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Estado de confirmación:</span>
                <span className="font-bold text-white">Pendientes listos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Ejecutivo:</span>
                <span className="font-bold text-white">{user.name}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('journey')}
            className="w-full py-2.5 rounded-xl bg-white hover:bg-blue-50 text-[#0F3D66] font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-[#1F5E99]" />
            <span>Abrir Checklist de Jornada</span>
          </button>
        </div>
      </div>
    </div>
  );
};
