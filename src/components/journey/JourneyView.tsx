import React, { useState } from 'react';
import { DayChecklistItem, UserProfile, NavSection } from '../../types';
import {
  CheckSquare,
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Flame,
  ShieldCheck,
  RotateCcw,
  FolderKanban,
  Check,
} from 'lucide-react';

interface JourneyViewProps {
  user: UserProfile;
  checklist: DayChecklistItem[];
  onToggleItem: (id: string) => void;
  onNavigate: (section: NavSection) => void;
  journeyStarted: boolean;
  onStartJourney: () => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  user,
  checklist,
  onToggleItem,
  onNavigate,
  journeyStarted,
  onStartJourney,
}) => {
  const [showCelebration, setShowCelebration] = useState(false);

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const isAllCompleted = completedCount === totalCount;

  const handleStartClick = () => {
    onStartJourney();
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Card: Executive Salutation & Subtitle */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-xs font-semibold text-[#1F5E99] dark:text-[#38BDF8] mb-2 border border-blue-200/50 dark:border-blue-800/40">
              <CheckSquare className="w-3.5 h-3.5 text-[#1F5E99] dark:text-[#38BDF8]" />
              <span>Inicio de la Jornada Comercial</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Buenos días, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
              Checklist de confirmación de los pendientes y tareas que se tienen que realizar antes de iniciar la jornada comercial.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-gradient-to-br from-[#0F3D66] to-[#1F5E99] text-white shadow-md text-center min-w-[150px]">
            <p className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider">Confirmaciones</p>
            <p className="text-3xl font-black mt-0.5">{progressPercent}%</p>
            <p className="text-xs text-blue-100 font-medium">
              {completedCount} de {totalCount} verificadas
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#1F5E99] to-[#4A90E2] h-full rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Status Tag */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
            <span>💡 Recomendación:</span>
            <span className="text-[#0F3D66] dark:text-[#38BDF8]">
              Marca cada pendiente para asegurar que cuentas con todas las herramientas operativas.
            </span>
          </div>

          {journeyStarted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Jornada confirmada e iniciada hoy</span>
            </div>
          )}
        </div>
      </div>

      {/* Celebration Notification */}
      {showCelebration && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl flex items-center justify-between animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              🎉
            </div>
            <div>
              <p className="font-bold text-sm sm:text-base">¡Jornada Comercial Oficialmente Iniciada!</p>
              <p className="text-xs text-emerald-100">
                Has confirmado todos los pendientes obligatorios. Todos los sistemas y herramientas están listos.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className="px-4 py-2 rounded-xl bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition shadow-sm shrink-0"
          >
            Ver Inf. Administrativa →
          </button>
        </div>
      )}

      {/* Checklist Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <span>Checklist de Confirmación Pre-Jornada</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8] font-bold">
              {completedCount}/{totalCount} Listos
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Haz clic sobre cada elemento para marcar o desmarcar la confirmación.
          </p>
        </div>
      </div>

      {/* Interactive Checklist Cards */}
      <div className="space-y-2.5">
        {checklist.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`flex items-start sm:items-center justify-between p-4 rounded-2xl border transition-all duration-150 cursor-pointer select-none ${
              item.completed
                ? 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                : 'bg-white dark:bg-[#0F172A] border-slate-300 dark:border-slate-700 hover:border-[#4A90E2] shadow-sm'
            }`}
          >
            <div className="flex items-start sm:items-center gap-3.5">
              {/* Checkbox button */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  item.completed
                    ? 'bg-[#1F5E99] text-white shadow-sm'
                    : 'border-2 border-slate-300 dark:border-slate-600 hover:border-[#1F5E99]'
                }`}
              >
                {item.completed && <Check className="w-4 h-4 text-white stroke-[3]" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold">{idx + 1}.</span>
                  <h4
                    className={`font-bold text-sm sm:text-base ${
                      item.completed
                        ? 'text-slate-800 dark:text-slate-200 line-through decoration-slate-400/50'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="shrink-0 pl-3">
              {item.completed ? (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{item.completedAt || 'Confirmado'}</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60">
                  Por confirmar
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            {journeyStarted ? 'Jornada activa y confirmada' : 'Confirmación formal de inicio'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAllCompleted
              ? 'Has confirmado todos los pendientes obligatorios previos al inicio.'
              : `Completa los ${totalCount - completedCount} puntos pendientes para habilitar el inicio formal.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleStartClick}
            disabled={!isAllCompleted && !journeyStarted}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 ${
              isAllCompleted || journeyStarted
                ? 'bg-[#1F5E99] hover:bg-[#0F3D66] text-white shadow-blue-900/20'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{journeyStarted ? 'Reiniciar Verificación' : '▶ Iniciar Jornada'}</span>
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition shrink-0"
          >
            <FolderKanban className="w-4 h-4 text-[#1F5E99]" />
            <span>Ir a Información Administrativa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
