import React, { useState } from 'react';
import {
  MeetingRecording,
  WeeklyPlanSharePoint,
  MonthlyGoalItem,
  TrainingCourse,
  AssignedMarathon,
  AssignedPreturno,
  TrainingMesh,
  TrainingMeshModule,
  NavSection,
} from '../../types';
import {
  Video,
  FolderKanban,
  Calendar,
  GraduationCap,
  Flame,
  Clock,
  Layers,
  Play,
  Pause,
  ExternalLink,
  Download,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface AdminViewProps {
  recordings: MeetingRecording[];
  weeklyPlans: WeeklyPlanSharePoint[];
  monthlyGoals: MonthlyGoalItem[];
  courses: TrainingCourse[];
  marathons: AssignedMarathon[];
  preturnos: AssignedPreturno[];
  meshes: TrainingMesh[];
  onAddMeshModule?: (meshId: string, module: TrainingMeshModule) => void;
  onNavigate: (section: NavSection) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  recordings,
  weeklyPlans,
  monthlyGoals,
  courses,
  marathons,
  preturnos,
  meshes,
  onAddMeshModule,
  onNavigate,
}) => {
  // Specific Administrative Sections
  type AdminTab =
    | 'all'
    | 'recordings'
    | 'weekly_sharepoint'
    | 'assigned_courses'
    | 'marathons'
    | 'preturnos'
    | 'mesh_builder';

  const [activeTab, setActiveTab] = useState<AdminTab>('all');
  const [selectedRecording, setSelectedRecording] = useState<MeetingRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMesh, setSelectedMesh] = useState<TrainingMesh>(meshes[0] || null);

  // New Module for Mesh Builder Modal State
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [newModTopic, setNewModTopic] = useState('');
  const [newModWeek, setNewModWeek] = useState(1);
  const [newModDay, setNewModDay] = useState(1);
  const [newModHours, setNewModHours] = useState(4);
  const [newModModality, setNewModModality] = useState<'Presencial' | 'Virtual' | 'Campo'>('Presencial');
  const [newModEval, setNewModEval] = useState<'Quiz' | 'Roleplay' | 'Auditoría'>('Quiz');

  const adminMenu = [
    { id: 'all' as AdminTab, label: 'Vista General (6 Secciones)', icon: Layers, count: null },
    { id: 'recordings' as AdminTab, label: 'Las Grabaciones', icon: Video, count: recordings.length },
    { id: 'weekly_sharepoint' as AdminTab, label: 'SharePoint Planeación Semanal', icon: FolderKanban, count: weeklyPlans.length },
    { id: 'assigned_courses' as AdminTab, label: 'Cursos Asignados', icon: GraduationCap, count: courses.length },
    { id: 'marathons' as AdminTab, label: 'Maratones Asignadas', icon: Flame, count: marathons.length },
    { id: 'preturnos' as AdminTab, label: 'Preturnos Asignados', icon: Clock, count: preturnos.length },
    { id: 'mesh_builder' as AdminTab, label: 'Construcción de Mallas', icon: Layers, count: meshes.length },
  ];

  const handleSaveMeshModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModTopic.trim() || !selectedMesh) return;

    const newModule: TrainingMeshModule = {
      id: `mod-custom-${Date.now()}`,
      weekNumber: Number(newModWeek),
      dayNumber: Number(newModDay),
      topic: newModTopic.trim(),
      hours: Number(newModHours),
      modality: newModModality,
      evaluationType: newModEval,
    };

    if (onAddMeshModule) {
      onAddMeshModule(selectedMesh.id, newModule);
    } else {
      selectedMesh.modules.push(newModule);
      selectedMesh.totalHours += newModule.hours;
    }

    setShowAddModuleModal(false);
    setNewModTopic('');
    alert(`Módulo "${newModule.topic}" agregado a la malla formativa.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]">
              Administración Central
            </span>
            <span className="text-xs text-slate-400">6 Módulos Oficiales</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Información Administrativa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control de grabaciones, SharePoint semanal, cursos asignados, maratones, preturnos y construcción de mallas formativas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab !== 'all' && (
            <button
              onClick={() => setActiveTab('all')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
            >
              ← Ver todas las secciones
            </button>
          )}
        </div>
      </div>

      {/* Top 7 Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {adminMenu.map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-[#1F5E99] text-white shadow-md shadow-blue-900/20'
                  : 'bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.count !== null && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          1. LAS GRABACIONES
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'recordings') && (
        <section className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-[#1F5E99] dark:text-[#38BDF8]">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Las Grabaciones
                </h3>
                <p className="text-xs text-slate-500">
                  Sesiones grabadas de comités, talleres comerciales y capacitaciones TTT
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#1F5E99] dark:text-[#38BDF8]">
              {recordings.length} Sesiones Disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-[#4A90E2]/60 transition"
              >
                <div>
                  <div
                    onClick={() => setSelectedRecording(rec)}
                    className="relative aspect-video rounded-xl bg-gradient-to-tr from-[#0F3D66] to-[#1F5E99] flex items-center justify-center text-white mb-2 overflow-hidden shadow-inner cursor-pointer group"
                  >
                    <Play className="w-9 h-9 fill-white/90 group-hover:scale-110 transition-transform" />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-bold text-white">
                      {rec.duration}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]">
                    {rec.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5 leading-snug">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rec.summary}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{rec.date}</span>
                  <button
                    onClick={() => setSelectedRecording(rec)}
                    className="flex items-center gap-1 font-bold text-[#1F5E99] dark:text-[#38BDF8] hover:underline"
                  >
                    <span>Reproducir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          2. LOS SHAREPOINT DE LA PLANEACIÓN SEMANAL
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'weekly_sharepoint') && (
        <section className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Los SharePoint de la Planeación Semanal
                </h3>
                <p className="text-xs text-slate-500">
                  Repositorios oficiales de SharePoint organizados por semanas con matrices de ruta y briefs
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#1F5E99] dark:text-[#38BDF8]">
              {weeklyPlans.length} Semanas Registradas
            </span>
          </div>

          <div className="space-y-3">
            {weeklyPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        plan.status === 'Activa'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : plan.status === 'Completada'
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]'
                      }`}
                    >
                      {plan.status}
                    </span>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">{plan.weekName}</h4>
                    <span className="text-xs text-slate-400">({plan.period})</span>
                  </div>

                  {/* Direct SharePoint Link */}
                  <a
                    href={plan.sharePointUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
                  >
                    <span>Abrir en SharePoint</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{plan.summary}</p>

                {/* Key Priorities */}
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Focos y Prioridades de la Semana:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                    {plan.keyPriorities.map((prio, i) => (
                      <li key={i}>{prio}</li>
                    ))}
                  </ul>
                </div>

                {/* Documents list */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-400">Archivos adjuntos:</span>
                  {plan.documents.map((doc, idx) => (
                    <a
                      key={idx}
                      href={doc.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-[#1F5E99] hover:border-[#1F5E99] transition"
                    >
                      <FileText className="w-3 h-3 text-[#1F5E99]" />
                      <span>{doc.title}</span>
                      <span className="text-[10px] text-slate-400">({doc.size})</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          3. LOS CURSOS QUE ESTÉN ASIGNADOS AL EJECUTIVO
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'assigned_courses') && (
        <section className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-[#1F5E99] dark:text-[#38BDF8]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Cursos Asignados al Ejecutivo
                </h3>
                <p className="text-xs text-slate-500">
                  Malla formativa personalizada para Juan Pérez (Ejecutivo Senior Caribe)
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('training')}
              className="text-xs font-bold text-[#1F5E99] dark:text-[#38BDF8] hover:underline"
            >
              Ir a Universidad →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        course.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {course.status === 'completed' ? 'Completado' : `En curso (${course.progress}%)`}
                    </span>
                    <span className="text-xs text-slate-400">{course.duration}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{course.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Insignia: {course.badgeName}</span>
                  <button
                    onClick={() => onNavigate('training')}
                    className="px-3 py-1 rounded-lg bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold transition"
                  >
                    {course.status === 'completed' ? 'Repasar' : 'Continuar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          5. MARATONES QUE ESTÉN ASIGNADAS AL EJECUTIVO
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'marathons') && (
        <section className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Maratones Asignadas al Ejecutivo
                </h3>
                <p className="text-xs text-slate-500">
                  Campañas intensivas de colocación comercial con metas y bonificaciones especiales
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
              {marathons.length} Maratones Programadas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marathons.map((mar) => (
              <div
                key={mar.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-orange-50/30 dark:from-slate-800/40 dark:to-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        mar.status === 'En curso'
                          ? 'bg-orange-500 text-white animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {mar.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{mar.date}</span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{mar.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{mar.description}</p>

                  <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-orange-100 dark:border-orange-900/30 space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Meta de Colocación:</span>
                      <strong className="text-orange-600 dark:text-orange-400">{mar.targetSales}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Ventas Acumuladas:</span>
                      <strong>{mar.achievedSales} ({mar.progress}%)</strong>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-1">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: `${mar.progress}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-orange-200/60 dark:border-orange-900/40 space-y-1">
                  <p className="text-[11px] font-bold text-orange-700 dark:text-orange-300">
                    🎁 Incentivo: {mar.incentive}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          6. PRETURNOS QUE ESTÉN ASIGNADOS AL EJECUTIVO
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'preturnos') && (
        <section className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Preturnos Asignados al Ejecutivo
                </h3>
                <p className="text-xs text-slate-500">
                  Sesiones diarias de 15 minutos para alinear foco de ventas, inventario y motivación
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
              {preturnos.length} Preturnos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preturnos.map((pre) => (
              <div
                key={pre.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pre.status === 'Completado'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {pre.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{pre.time}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{pre.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">Facilitador: {pre.leader}</p>

                  <div className="mt-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-800 text-xs space-y-1 border border-slate-200/60 dark:border-slate-700">
                    <p className="font-bold text-[#1F5E99] dark:text-[#38BDF8]">Foco Central:</p>
                    <p className="text-slate-600 dark:text-slate-300 leading-snug">{pre.focusTopic}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{pre.date}</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {pre.checklistConfirmed ? '✓ Checklist Verificado' : '⏳ Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          7. CONSTRUCCIÓN DE MALLAS
         ========================================================================= */}
      {(activeTab === 'all' || activeTab === 'mesh_builder') && (
        <section className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Construcción de Mallas (Cronogramas de Formación)
                </h3>
                <p className="text-xs text-slate-500">
                  Herramienta para diseñar, estructurar y editar cronogramas formativos por semanas y roles
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddModuleModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Añadir Módulo a la Malla</span>
            </button>
          </div>

          {/* Mesh Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {meshes.map((mesh) => (
              <button
                key={mesh.id}
                onClick={() => setSelectedMesh(mesh)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedMesh?.id === mesh.id
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {mesh.name}
              </button>
            ))}
          </div>

          {/* Active Mesh Detail View */}
          {selectedMesh && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-purple-900 dark:text-purple-200">
                    {selectedMesh.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-xl">
                    {selectedMesh.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-xs font-bold text-purple-700 dark:text-purple-300">
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800">
                    {selectedMesh.totalWeeks} Semanas
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-800">
                    {selectedMesh.totalHours} Horas Totales
                  </span>
                </div>
              </div>

              {/* Modules Timeline / Schedule */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Módulos Programados en el Cronograma ({selectedMesh.modules.length}):
                </p>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                  {selectedMesh.modules.map((mod, idx) => (
                    <div
                      key={mod.id || idx}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-xs"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold shrink-0">
                          Sem {mod.weekNumber} · Día {mod.dayNumber}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{mod.topic}</p>
                          <p className="text-[11px] text-slate-400">
                            Evaluación: <strong>{mod.evaluationType}</strong> · Modalidad: <strong>{mod.modality}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-semibold text-slate-500">
                        <span>{mod.hours} horas</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Video Recording Player Modal */}
      {selectedRecording && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#0F172A] p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]">
                  {selectedRecording.category}
                </span>
                <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                  {selectedRecording.title}
                </h4>
              </div>
              <button
                onClick={() => {
                  setSelectedRecording(null);
                  setIsPlaying(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 aspect-video rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
              <div className="text-center p-4">
                <div
                  className="w-14 h-14 rounded-full bg-[#1F5E99] flex items-center justify-center mx-auto mb-2 cursor-pointer shadow-lg active:scale-95 transition"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                </div>
                <p className="text-xs text-blue-200 font-semibold">
                  {isPlaying ? 'Reproduciendo sesión...' : 'Presiona para ver la grabación'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Facilitador: {selectedRecording.speaker}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-800 dark:text-slate-200">Puntos Clave:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                {selectedRecording.keyTopics.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Añadir Módulo a la Malla de Formación */}
      {showAddModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#0F172A] p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Construcción de Mallas · Añadir Módulo
              </h4>
              <button onClick={() => setShowAddModuleModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeshModule} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Malla Destino
                </label>
                <p className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 font-bold text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {selectedMesh?.name}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tema o Módulo Pedagógico
                </label>
                <input
                  type="text"
                  value={newModTopic}
                  onChange={(e) => setNewModTopic(e.target.value)}
                  placeholder="Ej: Técnicas de Cierre en Asesoría CBS"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Semana</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newModWeek}
                    onChange={(e) => setNewModWeek(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Día</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newModDay}
                    onChange={(e) => setNewModDay(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Horas</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newModHours}
                    onChange={(e) => setNewModHours(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Modalidad</label>
                  <select
                    value={newModModality}
                    onChange={(e) => setNewModModality(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Campo">Campo / Práctica</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Evaluación</label>
                  <select
                    value={newModEval}
                    onChange={(e) => setNewModEval(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Quiz">Quiz</option>
                    <option value="Roleplay">Roleplay</option>
                    <option value="Auditoría">Auditoría</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModuleModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-sm"
                >
                  Guardar en Cronograma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
