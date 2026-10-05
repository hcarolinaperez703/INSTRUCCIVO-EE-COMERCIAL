import React, { useState } from 'react';
import { GapItem, GapCategory, GapStatus, NavSection } from '../../types';
import {
  Target,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  X,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface GapsViewProps {
  gaps: GapItem[];
  onAddGap: (gap: GapItem) => void;
  onUpdateGapStatus: (id: string, newStatus: GapStatus) => void;
  onNavigate: (section: NavSection) => void;
}

export const GapsView: React.FC<GapsViewProps> = ({
  gaps,
  onAddGap,
  onUpdateGapStatus,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GapCategory | 'Todas'>('Todas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGapForDetail, setSelectedGapForDetail] = useState<GapItem | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GapCategory>('Objeciones');
  const [newResponsible, setNewResponsible] = useState('Juan Pérez');
  const [newAction, setNewAction] = useState('');
  const [newDeadline, setNewDeadline] = useState('25 de Octubre');
  const [newNotes, setNewNotes] = useState('');

  const categories: Array<GapCategory | 'Todas'> = [
    'Todas',
    'Venta',
    'Abordaje',
    'Objeciones',
    'Cierre',
    'Producto',
    'Servicio',
    'Herramientas',
    'Indicadores',
  ];

  const filteredGaps =
    selectedCategory === 'Todas'
      ? gaps
      : gaps.filter((g) => g.category === selectedCategory);

  const totalGaps = gaps.length;
  const closedGapsCount = gaps.filter((g) => g.status === 'Cerrada').length;
  const overdueGapsCount = gaps.filter((g) => g.status === 'Vencida').length;
  const inProgressGapsCount = gaps.filter((g) => g.status === 'En curso').length;
  const complianceRate = totalGaps > 0 ? Math.round((closedGapsCount / totalGaps) * 100) : 66;

  const handleCreateGap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAction) return;

    const gap: GapItem = {
      id: `gap-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      responsible: newResponsible,
      actionRequired: newAction,
      deadline: newDeadline,
      status: 'En curso',
      notes: newNotes,
      recommendedCourse:
        newCategory === 'Objeciones'
          ? 'Curso CVS: Venta Consultiva'
          : newCategory === 'Herramientas'
          ? 'Asignaciones Transversales'
          : 'Preturno / Maratón Comercial',
    };

    onAddGap(gap);
    setShowAddModal(false);
    setNewTitle('');
    setNewAction('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-[#1F5E99] dark:text-[#38BDF8]" />
            <span>Tablero de Cierre de Brechas</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Detección, planes de acción correctiva y seguimiento de competencias comerciales
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold transition shadow-md shadow-blue-900/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Brecha</span>
        </button>
      </div>

      {/* Filter Badges (Screen 8 Reference Mockup) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                isSelected
                  ? 'bg-[#1F5E99] text-white shadow-sm'
                  : 'bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Table (Screen 8 Matching Layout) */}
      <div className="rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#0F3D66] text-white font-bold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Brecha detectada</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Acción requerida</th>
                <th className="py-3 px-4">Compromiso</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredGaps.map((gap) => {
                const isClosed = gap.status === 'Cerrada';
                const isOverdue = gap.status === 'Vencida';

                return (
                  <tr
                    key={gap.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white max-w-xs">
                      <div>
                        <span>{gap.title}</span>
                        {gap.relatedPosName && (
                          <p className="text-[11px] text-slate-400 font-normal">
                            Origen: {gap.relatedPosName}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {gap.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {gap.responsible}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs">
                      {gap.actionRequired}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-500 whitespace-nowrap">
                      {gap.deadline}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          const nextStatus: GapStatus = isClosed
                            ? 'En curso'
                            : isOverdue
                            ? 'Cerrada'
                            : 'Cerrada';
                          onUpdateGapStatus(gap.id, nextStatus);
                        }}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition shadow-sm ${
                          isClosed
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:opacity-80'
                            : isOverdue
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:opacity-80'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:opacity-80'
                        }`}
                        title="Haz clic para actualizar estado"
                      >
                        {gap.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedGapForDetail(gap)}
                        className="text-xs font-bold text-[#1F5E99] dark:text-[#38BDF8] hover:underline"
                      >
                        Ver plan →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Metric Cards matching Screen 8: Brechas por categoría, Tendencia mensual, Cumplimiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Brechas por categoría (Progress bars) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Brechas por Categoría
          </h4>
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span>Objeciones y Venta</span>
                <span className="text-[#1F5E99] dark:text-[#38BDF8]">80%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#4A90E2] h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span>Herramientas y Material POP</span>
                <span className="text-[#1F5E99] dark:text-[#38BDF8]">55%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-[#1F5E99] h-full rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span>Cierre y Seguimiento</span>
                <span className="text-[#1F5E99] dark:text-[#38BDF8]">35%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Tendencia mensual */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Tendencia Mensual de Cierre
            </h4>
            <p className="text-xs text-slate-500">Reducción del 42% en brechas abiertas desde Q3.</p>
          </div>

          <div className="h-16 flex items-end gap-2 pt-2">
            {[35, 48, 62, 54, 78, 88].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-[#1F5E99] to-[#4A90E2] rounded-t-md transition-all"
                  style={{ height: `${val}%` }}
                ></div>
                <span className="text-[9px] text-slate-400 font-bold">
                  {['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Cumplimiento Radial (Matching Screen 8 Mockup) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
          {/* Conic Gradient Circle */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 shadow-inner"
            style={{
              background: `conic-gradient(#1F5E99 0% ${complianceRate}%, #D9E1E8 ${complianceRate}% 100%)`,
            }}
          >
            <div className="w-14 h-14 rounded-full bg-white dark:bg-[#0F172A] flex items-center justify-center font-black text-sm text-[#1F5E99] dark:text-[#38BDF8]">
              {complianceRate}%
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Índice de Cumplimiento</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {closedGapsCount} de {totalGaps} brechas cerradas
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              +15% arriba del estándar regional
            </p>
          </div>
        </div>
      </div>

      {/* Gap Detail / Action Plan Modal */}
      {selectedGapForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0F172A] p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]">
                  {selectedGapForDetail.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                  {selectedGapForDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGapForDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <p className="font-bold text-slate-700 dark:text-slate-300">Plan de Acción Comprometido:</p>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{selectedGapForDetail.actionRequired}</p>
                <p className="text-[11px] text-slate-500 mt-2">
                  Responsable: <strong>{selectedGapForDetail.responsible}</strong> · Fecha compromiso: <strong>{selectedGapForDetail.deadline}</strong>
                </p>
              </div>

              {selectedGapForDetail.notes && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300">
                  <p className="font-bold">Observaciones:</p>
                  <p className="text-[11px] mt-0.5">{selectedGapForDetail.notes}</p>
                </div>
              )}

              {/* Recommended Course / Resource to close gap */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2">
                <p className="font-bold text-[#1F5E99] dark:text-[#38BDF8] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Capacitación Recomendada para Cerrar esta Brecha</span>
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Completar el módulo <strong>{selectedGapForDetail.recommendedCourse || 'Curso CVS'}</strong> y consultar el material de objeciones.
                </p>
                <button
                  onClick={() => {
                    setSelectedGapForDetail(null);
                    onNavigate('training');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1F5E99] text-white text-xs font-bold hover:bg-[#0F3D66] transition"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Abrir curso en Universidad</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  onUpdateGapStatus(selectedGapForDetail.id, 'Cerrada');
                  setSelectedGapForDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
              >
                ✓ Marcar como Brecha Cerrada
              </button>
              <button
                onClick={() => setSelectedGapForDetail(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Gap Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-[#0F172A] p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Registrar Nueva Brecha Comercial
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGap} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brecha detectada
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Dificultad para sustentar valor frente a la competencia"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as GapCategory)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  >
                    {categories.filter((c) => c !== 'Todas').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Responsable
                  </label>
                  <input
                    type="text"
                    value={newResponsible}
                    onChange={(e) => setNewResponsible(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Acción requerida (Plan de mejora)
                </label>
                <textarea
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="Ej: Role play semanal y estudio de caso de éxito PDV Norte"
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha compromiso
                  </label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#1F5E99] text-white font-bold hover:bg-[#0F3D66]"
                >
                  Registrar Brecha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
