import React, { useState } from 'react';
import {
  PointOfSale,
  VisitRecord,
  FieldChannelType,
  AuditChecklist,
  GapItem,
} from '../../types';
import {
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  Navigation,
  Phone,
  Plus,
  X,
  FileCheck,
  Calendar,
  AlertTriangle,
  Send,
  Save,
  Image as ImageIcon,
} from 'lucide-react';

interface FieldViewProps {
  pointsOfSale: PointOfSale[];
  visits: VisitRecord[];
  onSaveVisit: (visit: VisitRecord) => void;
  onGenerateGapFromVisit: (gap: GapItem) => void;
}

export const FieldView: React.FC<FieldViewProps> = ({
  pointsOfSale,
  visits,
  onSaveVisit,
  onGenerateGapFromVisit,
}) => {
  const [activeChannel, setActiveChannel] = useState<FieldChannelType>('pdv');
  const [selectedPos, setSelectedPos] = useState<PointOfSale | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Visit Form State (Matching Screen 7)
  const [formPosName, setFormPosName] = useState('PDV Centro Histórico');
  const [formCity, setFormCity] = useState('Barranquilla');
  const [formDate, setFormDate] = useState('05 de Octubre 2026');
  const [formResponsible, setFormResponsible] = useState('Juan Pérez');
  const [auditChecks, setAuditChecks] = useState<AuditChecklist>({
    offerVisible: true,
    popUpdated: true,
    advisorKnowledge: false,
    kpisReviewed: true,
    findingsIdentified: false,
  });
  const [visitPhotos, setVisitPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=300&q=80',
  ]);
  const [observations, setObservations] = useState('');

  const samplePhotoPresets = [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80',
  ];

  const handleOpenCreateModal = (posName?: string, city?: string) => {
    if (posName) setFormPosName(posName);
    if (city) setFormCity(city);
    setShowCreateModal(true);
  };

  const handleToggleAuditCheck = (key: keyof AuditChecklist) => {
    setAuditChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddSamplePhoto = () => {
    if (visitPhotos.length >= 4) {
      alert('Máximo 4 fotos de evidencia por visita.');
      return;
    }
    const nextPhoto = samplePhotoPresets[visitPhotos.length % samplePhotoPresets.length];
    setVisitPhotos([...visitPhotos, nextPhoto]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result && visitPhotos.length < 4) {
          setVisitPhotos([...visitPhotos, uploadEvent.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitVisit = (isDraft: boolean) => {
    const newVisit: VisitRecord = {
      id: `vis-${Date.now()}`,
      posId: `pos-custom-${Date.now()}`,
      posName: formPosName,
      channel: activeChannel,
      city: formCity,
      date: formDate,
      responsible: formResponsible,
      audit: auditChecks,
      photos: visitPhotos,
      observations: observations || 'Visita comercial completada de acuerdo al protocolo TONOZ.',
      score: auditChecks.offerVisible && auditChecks.popUpdated && auditChecks.advisorKnowledge ? 95 : 78,
      status: isDraft ? 'borrador' : 'enviada',
    };

    // If findings are identified or POP is not updated or advisor lacks knowledge, automatically generate gap!
    if (!auditChecks.popUpdated || !auditChecks.advisorKnowledge || auditChecks.findingsIdentified) {
      const autoGap: GapItem = {
        id: `gap-${Date.now()}`,
        title: `Hallazgo detectado en ${formPosName}: ${!auditChecks.popUpdated ? 'Material POP desactualizado' : 'Refuerzo de conocimiento del asesor'}`,
        category: !auditChecks.popUpdated ? 'Herramientas' : 'Producto',
        responsible: formResponsible,
        actionRequired: 'Revisión y plan correctivo inmediato en siguiente visita',
        deadline: '20 de Octubre 2026',
        status: 'En curso',
        relatedPosName: formPosName,
        recommendedCourse: 'Curso CVS: Venta Consultiva',
        recommendedResource: 'Manual de Oferta Vigente y Promociones Q4',
        notes: `Generado automáticamente desde la visita del ${formDate}. Observación: ${observations || 'Hallazgo durante auditoría de campo.'}`,
      };
      onGenerateGapFromVisit(autoGap);
      newVisit.generatedGapId = autoGap.id;
    }

    onSaveVisit(newVisit);
    setShowCreateModal(false);
    alert(
      isDraft
        ? 'Borrador de visita guardado exitosamente.'
        : '¡Visita comercial enviada exitosamente! Se ha sincronizado el informe.' +
            (!auditChecks.popUpdated || !auditChecks.advisorKnowledge || auditChecks.findingsIdentified
              ? ' Nota: Se generó automáticamente una acción correctiva en Cierre de Brechas.'
              : '')
    );
  };

  const channelModules = [
    {
      id: 'pdv' as FieldChannelType,
      title: 'Visitas PDV',
      desc: 'Puntos de venta propios y distribuidores',
      actions: 'Crear visita · Checklist · Evidencia · Observaciones · Historial',
      count: '3 Puntos asignados',
    },
    {
      id: 'street_agents' as FieldChannelType,
      title: 'Agentes de Calle',
      desc: 'Escuadrones WINCEL y GERA en ruta',
      actions: 'Crear visita · Checklist · Evidencia · Observaciones · Historial',
      count: '2 Escuadrones',
    },
    {
      id: 'islands' as FieldChannelType,
      title: 'Islas Comerciales',
      desc: 'Módulos en centros comerciales y malls',
      actions: 'Crear visita · Checklist · Evidencia · Observaciones · Historial',
      count: '1 Isla comercial',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#1F5E99] dark:text-[#38BDF8]" />
            <span>Ejecución en Campo · Cobertura Región Caribe</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supervisión integral de Puntos de Venta (PDV), Agentes de Calle (WINCEL/GERA) e Islas Comerciales
          </p>
        </div>

        <button
          onClick={() => handleOpenCreateModal()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold transition shadow-md shadow-blue-900/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Visita PDV</span>
        </button>
      </div>

      {/* 3 Independent Channel Cards (Screen 6 Reference Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channelModules.map((mod) => {
          const isSelected = activeChannel === mod.id;
          return (
            <div
              key={mod.id}
              className={`p-5 rounded-2xl bg-white dark:bg-[#0F172A] border transition-all duration-200 shadow-sm flex flex-col justify-between ${
                isSelected
                  ? 'border-[#4A90E2] ring-2 ring-[#4A90E2]/30 shadow-lg'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{mod.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8] font-bold">
                    {mod.count}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{mod.desc}</p>
                <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  {mod.actions}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveChannel(mod.id)}
                  className={`text-xs font-bold transition ${
                    isSelected ? 'text-[#1F5E99] dark:text-[#38BDF8]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {isSelected ? '● Canal Activo' : 'Seleccionar'}
                </button>
                <button
                  onClick={() => handleOpenCreateModal(mod.title, 'Barranquilla')}
                  className="px-3 py-1.5 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold transition shadow-sm"
                >
                  Crear visita
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map & Weekly Schedule Grid (Screen 6 Reference Mockup: 1.4fr 1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive Stylized Map (Col 7 / 12) */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#1F5E99] dark:text-[#38BDF8]" />
                <span>Mapa de PDV y Rutas Comerciales</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ubicación interactiva de clientes y puntos de atención en Barranquilla y Soledad
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              GPS Activo
            </span>
          </div>

          {/* Interactive Stylized Vector Map Surface */}
          <div className="relative w-full aspect-[16/10] min-h-[260px] rounded-2xl bg-gradient-to-br from-[#EEF2F6] via-[#E2E8F0] to-[#CBD5E1] dark:from-[#0B1522] dark:via-[#0F2033] dark:to-[#09111c] border border-slate-300/80 dark:border-slate-800 overflow-hidden shadow-inner">
            {/* Grid Lines Pattern */}
            <div
              className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            ></div>

            {/* Geographical river curve simulation for Barranquilla / Magdalena */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 dark:opacity-15">
              <path
                d="M 50,0 Q 150,120 280,180 T 550,300"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="12"
              />
            </svg>

            {/* Interactive Pins */}
            {pointsOfSale.map((pos) => {
              const isSelected = selectedPos?.id === pos.id;
              const isVisited = pos.status === 'visited';
              const isInRoute = pos.status === 'in_route';

              return (
                <div
                  key={pos.id}
                  onClick={() => setSelectedPos(pos)}
                  style={{ left: `${pos.coordinates.x}%`, top: `${pos.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Ripple ring for in-route */}
                    {isInRoute && (
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-amber-400 opacity-75"></span>
                    )}

                    {/* Pin dot */}
                    <div
                      className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-125 ${
                        isVisited
                          ? 'bg-emerald-500 text-white'
                          : isInRoute
                          ? 'bg-amber-500 text-white'
                          : 'bg-[#1F5E99] text-white'
                      } ${isSelected ? 'ring-4 ring-[#4A90E2]/50 scale-125' : ''}`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>

                    {/* Quick Badge */}
                    <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md px-2 py-0.5 rounded-md shadow-md text-[10px] font-bold whitespace-nowrap text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {pos.name}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Selected Pos Tooltip Overlay */}
            {selectedPos && (
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs p-3 rounded-2xl bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl z-30 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {selectedPos.name}
                    </h5>
                    <p className="text-[11px] text-slate-500">{selectedPos.address}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPos(null);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Contacto: {selectedPos.contactPerson}</span>
                  <a
                    href={`tel:${selectedPos.contactPhone}`}
                    className="flex items-center gap-1 font-bold text-[#1F5E99] dark:text-[#38BDF8]"
                  >
                    <Phone className="w-3 h-3" /> Llamar
                  </a>
                </div>
                <button
                  onClick={() => handleOpenCreateModal(selectedPos.name, selectedPos.city)}
                  className="mt-2.5 w-full py-1.5 rounded-lg bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold transition"
                >
                  Auditar este PDV
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Auditado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> En ruta de hoy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F5E99]"></span> Programado
            </span>
          </div>
        </div>

        {/* Weekly Schedule (Cronograma de Visitas - Col 5 / 12) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1F5E99] dark:text-[#38BDF8]" />
                <span>Cronograma Semanal</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Semana 41</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Plan de auditorías coordinado con líderes comerciales de zona.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    Lun
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      PDV Centro Histórico
                    </h5>
                    <p className="text-[11px] text-slate-500">Visita realizada · Auditoría enviada</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    Mar
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Agentes WINCEL (Cra 51B)
                    </h5>
                    <p className="text-[11px] text-slate-500">Supervisión en calle de 10:00 AM</p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenCreateModal('Agentes WINCEL', 'Barranquilla Norte')}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-bold hover:bg-amber-700 transition"
                >
                  Iniciar
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-600 text-white flex items-center justify-center font-bold text-xs">
                    Mié
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Isla Mall Plaza del Sol
                    </h5>
                    <p className="text-[11px] text-slate-500">Revisión de inventario y afiches Q4</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Programada</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-600 text-white flex items-center justify-center font-bold text-xs">
                    Jue
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Agentes GERA (Sur)
                    </h5>
                    <p className="text-[11px] text-slate-500">Acompañamiento a 8 asesores</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Programada</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => handleOpenCreateModal()}
              className="text-xs font-bold text-[#1F5E99] dark:text-[#38BDF8] hover:underline"
            >
              + Agregar punto de visita al cronograma
            </button>
          </div>
        </div>
      </div>

      {/* Visita PDV Form Modal (Screen 7 Exact Reference Mockup) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white dark:bg-[#0F172A] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]">
                  Auditoría Rápida de Campo
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-1">
                  Registrar Visita a Punto de Venta
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upper Form Inputs (Screen 7: Nombre PDV, Ciudad, Fecha, Responsable) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Nombre del PDV</label>
                <input
                  type="text"
                  value={formPosName}
                  onChange={(e) => setFormPosName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Fecha</label>
                <input
                  type="text"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Responsable</label>
                <input
                  type="text"
                  value={formResponsible}
                  onChange={(e) => setFormResponsible(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            {/* Checklist of 5 Items (Screen 7 Matching Mockup) */}
            <div className="space-y-2 my-4">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Auditoría en 5 Checks Clave:
              </p>

              <div
                onClick={() => handleToggleAuditCheck('offerVisible')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  auditChecks.offerVisible
                    ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  1. Oferta visible al público
                </span>
                <span className={`text-xs font-bold ${auditChecks.offerVisible ? 'text-[#1F5E99] dark:text-[#38BDF8]' : 'text-slate-400'}`}>
                  {auditChecks.offerVisible ? '✓ Cumple' : '✕ No cumple'}
                </span>
              </div>

              <div
                onClick={() => handleToggleAuditCheck('popUpdated')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  auditChecks.popUpdated
                    ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/30'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    2. Material POP actualizado (Campaña Q4)
                  </span>
                  {!auditChecks.popUpdated && (
                    <p className="text-[10px] text-rose-500 font-semibold">
                      Generará automáticamente una brecha de reposición.
                    </p>
                  )}
                </div>
                <span className={`text-xs font-bold ${auditChecks.popUpdated ? 'text-[#1F5E99] dark:text-[#38BDF8]' : 'text-rose-600'}`}>
                  {auditChecks.popUpdated ? '✓ Cumple' : '⚠️ Desactualizado'}
                </span>
              </div>

              <div
                onClick={() => handleToggleAuditCheck('advisorKnowledge')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  auditChecks.advisorKnowledge
                    ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/30'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    3. Conocimiento del asesor evaluado
                  </span>
                  {!auditChecks.advisorKnowledge && (
                    <p className="text-[10px] text-amber-500 font-semibold">
                      Se recomendará curso de formación de refuerzo.
                    </p>
                  )}
                </div>
                <span className={`text-xs font-bold ${auditChecks.advisorKnowledge ? 'text-[#1F5E99] dark:text-[#38BDF8]' : 'text-amber-600'}`}>
                  {auditChecks.advisorKnowledge ? '✓ Evaluado y aprobado' : '⚠️ Requiere refuerzo'}
                </span>
              </div>

              <div
                onClick={() => handleToggleAuditCheck('kpisReviewed')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  auditChecks.kpisReviewed
                    ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  4. Indicadores de venta y cuota revisados
                </span>
                <span className={`text-xs font-bold ${auditChecks.kpisReviewed ? 'text-[#1F5E99] dark:text-[#38BDF8]' : 'text-slate-400'}`}>
                  {auditChecks.kpisReviewed ? '✓ Revisados con el líder' : 'Pendiente'}
                </span>
              </div>

              <div
                onClick={() => handleToggleAuditCheck('findingsIdentified')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  auditChecks.findingsIdentified
                    ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    5. Hallazgos adicionales u oportunidades de mejora
                  </span>
                </div>
                <span className={`text-xs font-bold ${auditChecks.findingsIdentified ? 'text-rose-600' : 'text-slate-400'}`}>
                  {auditChecks.findingsIdentified ? '⚠️ Sí, hay hallazgos' : 'Sin novedad'}
                </span>
              </div>
            </div>

            {/* Photo Evidence Grid (Screen 7 Mockup: 4 photo slots [📷 +]) */}
            <div className="my-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Evidencia Fotográfica ({visitPhotos.length}/4)
                </span>
                <div className="flex gap-2">
                  <label className="cursor-pointer text-[11px] font-bold text-[#1F5E99] dark:text-[#38BDF8] hover:underline flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Subir foto</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSamplePhoto}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    + Foto de muestra
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {[0, 1, 2, 3].map((idx) => {
                  const photo = visitPhotos[idx];
                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-800/40"
                    >
                      {photo ? (
                        <>
                          <img src={photo} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setVisitPhotos(visitPhotos.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center text-[10px]"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <div
                          onClick={handleAddSamplePhoto}
                          className="flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-[#1F5E99]"
                        >
                          <Camera className="w-5 h-5 mb-0.5" />
                          <span className="text-[10px] font-bold">📷 +</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Observations Input */}
            <div className="my-4">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Observaciones y Compromisos Acordados
              </label>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Escribe los acuerdos establecidos con el asesor o detalles de la visita..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none"
              ></textarea>
            </div>

            {/* Bottom Actions (Guardar borrador / Enviar visita) */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleSubmitVisit(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#1F5E99] text-[#1F5E99] dark:text-[#38BDF8] text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-800 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar borrador</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmitVisit(false)}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold transition shadow-md shadow-blue-900/20 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar visita</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
