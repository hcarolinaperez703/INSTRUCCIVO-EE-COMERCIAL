import React, { useState } from 'react';
import { TrainingCourse, GapItem, GapStatus, NavSection } from '../../types';
import {
  GraduationCap,
  Calendar,
  Layers,
  Clock,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Store,
  Users,
  Award,
  ChevronRight,
  ExternalLink,
  Laptop,
  Target,
  AlertTriangle,
  Plus,
  X,
  Check,
  RotateCcw,
  Search,
} from 'lucide-react';

interface TrainingViewProps {
  courses?: TrainingCourse[];
  gaps?: GapItem[];
  onAddGap?: (gap: GapItem) => void;
  onUpdateGapStatus?: (id: string, newStatus: GapStatus) => void;
  onUpdateCourseProgress?: (courseId: string, progress: number, status: TrainingCourse['status']) => void;
  onNavigate?: (section: NavSection) => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({
  gaps = [],
  onAddGap,
  onUpdateGapStatus,
  onNavigate,
}) => {
  // Navigation tabs for the specific explanations requested
  const [selectedTopic, setSelectedTopic] = useState<'malla' | 'cvs' | 'cronograma_cvs' | 'brechas'>('malla');

  // Gaps local filter & modal state
  const [gapFilter, setGapFilter] = useState<'Todas' | 'En curso' | 'Cerrada'>('Todas');
  const [showAddGapModal, setShowAddGapModal] = useState(false);
  const [newGapTitle, setNewGapTitle] = useState('');
  const [newGapCategory, setNewGapCategory] = useState<GapItem['category']>('Producto');
  const [newGapAction, setNewGapAction] = useState('');
  const [newGapDeadline, setNewGapDeadline] = useState('24 Octubre 2026');

  // Fallback initial knowledge gaps if none provided
  const initialKnowledgeGaps: GapItem[] = [
    {
      id: 'bg-1',
      title: 'Manejo de objeción técnica en portabilidad 5G empresarial',
      category: 'Objeciones',
      responsible: 'Juan Pérez (Ejecutivo Senior)',
      actionRequired: 'Repasar módulo 4 de la Malla CVS y realizar simulación de role-play de 10 min.',
      deadline: '20 Octubre 2026',
      status: 'En curso',
      recommendedCourse: 'Malla CVS',
      notes: 'Identificado tras la evaluación de la Semana 2.',
    },
    {
      id: 'bg-2',
      title: 'Procedimiento de arqueo y notas de crédito en sistema POS de tienda',
      category: 'Herramientas',
      responsible: 'Juan Pérez (Ejecutivo Senior)',
      actionRequired: 'Sesión de refuerzo en simulador transaccional CVS con mentor de caja.',
      deadline: '22 Octubre 2026',
      status: 'En curso',
      recommendedCourse: 'Sistemas CVS',
      notes: 'Requiere validación biométrica y cierre de caja.',
    },
    {
      id: 'bg-3',
      title: 'Diferenciación de SLA en planes de Fibra Óptica Dedicada vs Simétrica',
      category: 'Producto',
      responsible: 'Juan Pérez (Ejecutivo Senior)',
      actionRequired: 'Lectura de ficha técnica en SharePoint y quiz de validación superado con 100%.',
      deadline: '15 Octubre 2026',
      status: 'Cerrada',
      recommendedCourse: 'Portafolio Fijo y Fibra',
      notes: 'Brecha de conocimiento cerrada satisfactoriamente.',
    },
    {
      id: 'bg-4',
      title: 'Protocolo de bienvenida y atención a clientes corporativos en sala CVS',
      category: 'Servicio',
      responsible: 'Juan Pérez (Ejecutivo Senior)',
      actionRequired: 'Auditoría práctica con el supervisor de tienda aprobada.',
      deadline: '12 Octubre 2026',
      status: 'Cerrada',
      recommendedCourse: 'Protocolos de Atención',
      notes: 'Certificación de servicio al cliente confirmada.',
    },
  ];

  const activeGapsList = gaps.length > 0 ? gaps : initialKnowledgeGaps;

  const filteredGaps = activeGapsList.filter((g) => {
    if (gapFilter === 'Todas') return true;
    return g.status === gapFilter;
  });

  const totalGaps = activeGapsList.length;
  const closedGaps = activeGapsList.filter((g) => g.status === 'Cerrada').length;
  const openGaps = activeGapsList.filter((g) => g.status === 'En curso' || g.status === 'Vencida').length;
  const gapClosurePercent = totalGaps > 0 ? Math.round((closedGaps / totalGaps) * 100) : 0;

  const handleToggleGapStatus = (gapId: string, currentStatus: GapStatus) => {
    const nextStatus: GapStatus = currentStatus === 'Cerrada' ? 'En curso' : 'Cerrada';
    if (onUpdateGapStatus) {
      onUpdateGapStatus(gapId, nextStatus);
    } else {
      const target = activeGapsList.find((g) => g.id === gapId);
      if (target) {
        target.status = nextStatus;
      }
    }
  };

  const handleCreateKnowledgeGap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGapTitle.trim()) return;

    const newGap: GapItem = {
      id: `bg-custom-${Date.now()}`,
      title: newGapTitle.trim(),
      category: newGapCategory,
      responsible: 'Juan Pérez',
      actionRequired: newGapAction.trim() || 'Refuerzo de conocimiento posterior a módulo formativo.',
      deadline: newGapDeadline,
      status: 'En curso',
      recommendedCourse: 'Malla CVS',
      notes: 'Registrada tras sesión de capacitación.',
    };

    if (onAddGap) {
      onAddGap(newGap);
    } else {
      activeGapsList.unshift(newGap);
    }

    setShowAddGapModal(false);
    setNewGapTitle('');
    setNewGapAction('');
    alert(`Brecha de conocimiento "${newGap.title}" registrada exitosamente.`);
  };

  // Interactive CVS Malla Schedule Details (Weeks 1 to 4)
  const cvsWeeklySchedule = [
    {
      week: 1,
      title: 'Semana 1: Fundamentos Corporativos y Protocolo de Servicio',
      duration: '40 Horas',
      modality: 'Presencial / Aula',
      objective: 'Comprensión de la cultura de servicio, empatía con el cliente de tienda y estándares de imagen.',
      modules: [
        { day: 'Día 1', topic: 'Bienvenida institucional, valores y rol del Asesor CVS', hours: '8h' },
        { day: 'Día 2', topic: 'Protocolo de atención al cliente en Centros de Ventas y Servicios (CVS)', hours: '8h' },
        { day: 'Día 3', topic: 'Comunicación asertiva, escucha activa y manejo de tiempos en cola', hours: '8h' },
        { day: 'Día 4', topic: 'Políticas de seguridad, confidencialidad de datos y compliance', hours: '8h' },
        { day: 'Día 5', topic: 'Evaluación Semana 1 y Taller de Roleplay de bienvenida', hours: '8h' },
      ],
    },
    {
      week: 2,
      title: 'Semana 2: Portafolio de Productos, Planes y Soluciones',
      duration: '40 Horas',
      modality: 'Virtual & Laboratorio',
      objective: 'Dominio exhaustivo de tarifas, planes pospago, prepago, fibra óptica y terminales.',
      modules: [
        { day: 'Día 6', topic: 'Planes móviles pospago, tarifas y beneficios de portabilidad', hours: '8h' },
        { day: 'Día 7', topic: 'Servicios de conectividad fija (Fibra óptica, televisión y empaquetados)', hours: '8h' },
        { day: 'Día 8', topic: 'Catálogo de terminales, garantías, seguros y accesorios', hours: '8h' },
        { day: 'Día 9', topic: 'Promociones del mes, combos convergentes y financiamiento', hours: '8h' },
        { day: 'Día 10', topic: 'Quiz técnico de producto y simulación de asesoría comercial', hours: '8h' },
      ],
    },
    {
      week: 3,
      title: 'Semana 3: Sistemas Transaccionales del CVS & Operaciones',
      duration: '40 Horas',
      modality: 'Simulador / Sistemas CVS',
      objective: 'Manejo ágil de software de caja, CRM, activaciones, facturación e inventario.',
      modules: [
        { day: 'Día 11', topic: 'Inicio de sesión, apertura de caja y arqueo inicial', hours: '8h' },
        { day: 'Día 12', topic: 'Módulo de altas nuevas, portabilidades y validación biométrica', hours: '8h' },
        { day: 'Día 13', topic: 'Renovaciones de contrato, reposición de SIM y cambios de plan', hours: '8h' },
        { day: 'Día 14', topic: 'Gestión de reclamos, notas de crédito y devoluciones autorizadas', hours: '8h' },
        { day: 'Día 15', topic: 'Prueba práctica en ambiente de pruebas transaccional', hours: '8h' },
      ],
    },
    {
      week: 4,
      title: 'Semana 4: Práctica Tutelada en Tienda & Certificación CVS',
      duration: '40 Horas',
      modality: 'En Tienda / Con Mentor Senior',
      objective: 'Atención real a clientes bajo supervisión y evaluación para graduación final.',
      modules: [
        { day: 'Día 16', topic: 'Observación en ventanilla y acompañamiento a asesor senior', hours: '8h' },
        { day: 'Día 17', topic: 'Primeras transacciones asistidas por el tutor en CVS', hours: '8h' },
        { day: 'Día 18', topic: 'Manejo de objeciones y clientes difíciles en tiempo real', hours: '8h' },
        { day: 'Día 19', topic: 'Técnicas de venta cruzada (Cross-selling de terminales y seguros)', hours: '8h' },
        { day: 'Día 20', topic: 'Auditoría final de competencias, certificación y entrega de credenciales', hours: '8h' },
      ],
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]">
              Módulo de Formación
            </span>
            <span className="text-xs text-slate-400">Mallas, Curso CVS y Cierre de Brechas</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Formación y Capacitación Comercial
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Malla formativa, Curso CVS para Centro de Ventas y Servicios, y Cierre de Brechas de conocimiento posterior a la formación.
          </p>
        </div>

        {onNavigate && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
            >
              <Layers className="w-3.5 h-3.5 text-[#1F5E99]" />
              <span>Ver Construcción de Mallas</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Tabs (Including Cierre de Brechas - Retirado "4 Semanas" de la opción 3) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setSelectedTopic('malla')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            selectedTopic === 'malla'
              ? 'bg-[#1F5E99] text-white shadow-md shadow-blue-900/20'
              : 'bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>1. ¿Qué es una Malla?</span>
        </button>

        {/* Tab 2: CVS */}
        <button
          onClick={() => setSelectedTopic('cvs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            selectedTopic === 'cvs'
              ? 'bg-[#1F5E99] text-white shadow-md shadow-blue-900/20'
              : 'bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>2. ¿Qué es un Curso CVS?</span>
        </button>

        {/* Tab 3: Retirada la frase "4 Semanas" como solicitó el usuario */}
        <button
          onClick={() => setSelectedTopic('cronograma_cvs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            selectedTopic === 'cronograma_cvs'
              ? 'bg-[#1F5E99] text-white shadow-md shadow-blue-900/20'
              : 'bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>3. Ver Cronograma Modelo CVS</span>
        </button>

        {/* Option 4: Cierre de Brechas */}
        <button
          onClick={() => setSelectedTopic('brechas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            selectedTopic === 'brechas'
              ? 'bg-[#1F5E99] text-white shadow-md shadow-blue-900/20'
              : 'bg-white dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <Target className="w-4 h-4 text-amber-400" />
          <span>4. Cierre de Brechas</span>
          {openGaps > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedTopic === 'brechas'
                  ? 'bg-white/20 text-white'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {openGaps}
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
          TAB 1: ¿QUÉ ES UNA MALLA?
         ========================================================================= */}
      {selectedTopic === 'malla' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Hero Definition Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F3D66] via-[#1F5E99] to-[#0a233a] text-white shadow-xl relative overflow-hidden">
            <div className="max-w-3xl relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Definición Principal</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                ¿Qué es una Malla?
              </h3>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                  «La malla es un <span className="text-[#38BDF8] underline decoration-2 underline-offset-4">cronograma de formación</span>.»
                </p>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-2">
                  Es la hoja de ruta estructurada temporalmente que define el recorrido de aprendizaje de un colaborador, organizando día a día los contenidos, horas de dedicación, modalidades pedagógicas y evaluaciones requeridas para certificar sus competencias comerciales.
                </p>
              </div>
            </div>
          </div>

          {/* Core Elements of a Malla */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-[#1F5E99] dark:text-[#38BDF8]">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                1. Planificación Temporal
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estructura por semanas, días y bloques horarios. Permite al ejecutivo y a su supervisor saber con exactitud qué tema debe cursarse en cada momento de la jornada.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Laptop className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                2. Diversidad de Modalidades
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Combina módulos <strong>Virtuales</strong> (e-learning), sesiones <strong>Presenciales</strong> en aula y prácticas de <strong>Campo / Tienda</strong> tuteladas.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                3. Hitos de Evaluación
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cada ciclo de la malla incluye quizzes de validación, simulaciones de venta (roleplay) y auditorías prácticas antes de liberar al asesor a la atención real.
              </p>
            </div>
          </div>

          {/* Explanatory Summary Card */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                ¿Deseas diseñar o revisar una malla existente?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                En el módulo de <strong>Información Administrativa</strong> tienes la herramienta de <strong>Construcción de Mallas</strong> para agregar módulos por semanas y horas.
              </p>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('admin')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold transition shadow-sm shrink-0"
              >
                <span>Ir a Construcción de Mallas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: ¿QUÉ ES UN CURSO CVS? (CENTRO DE VENTAS Y SERVICIOS)
         ========================================================================= */}
      {selectedTopic === 'cvs' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Hero Definition Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1F5E99] via-[#0F3D66] to-[#0c1a29] text-white shadow-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10">
              <Store className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Especialización Comercial CVS</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              ¿Qué es un Curso CVS?
            </h3>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
              <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                «Un curso CVS es una <span className="text-[#38BDF8] underline decoration-2 underline-offset-4">malla de formación para un asesor CVS</span>, que es <span className="text-emerald-300">Centro de Ventas y Servicios</span>.»
              </p>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-2">
                Prepara integralmente al asesor para operar en el punto de contacto presencial más importante de la compañía: atendiendo consultas, cerrando ventas de planes y terminales, ejecutando trámites transaccionales en ventanilla y garantizando la satisfacción del cliente.
              </p>
            </div>
          </div>

          {/* Breakdown: ¿Qué es un CVS y qué hace el Asesor? */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#1F5E99] dark:text-[#38BDF8]">
                <Store className="w-5 h-5" />
                <h4 className="font-extrabold text-sm uppercase tracking-wide">
                  ¿Qué es un CVS? (Centro de Ventas y Servicios)
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                El <strong>CVS (Centro de Ventas y Servicios)</strong> es la tienda o centro de experiencia comercial física oficial donde los clientes acuden para:
              </p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Contratar nuevas líneas pospago y portabilidades.</li>
                <li>Comprar smartphones, tablets, routers y accesorios.</li>
                <li>Contratar servicios fijos (Fibra óptica simétrica, TV e Internet).</li>
                <li>Realizar pagos, reposición de chips y cambios de titularidad.</li>
                <li>Presentar consultas de servicio al cliente y soporte técnico.</li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Users className="w-5 h-5" />
                <h4 className="font-extrabold text-sm uppercase tracking-wide">
                  ¿Por qué necesita su propia Malla de Formación?
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                A diferencia de la venta de calle o telemarketing, el <strong>Asesor CVS</strong> gestiona una venta presencial compleja que combina habilidades comerciales con rigor transaccional:
              </p>
              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Manejo de sistemas de facturación, caja y validación biométrica.</li>
                <li>Protocolos de cortesía y atención cara a cara bajo estándares de marca.</li>
                <li>Capacidad de venta cruzada (Cross-selling) en cada interacción de soporte.</li>
                <li>Manejo de clientes en espera y resolución inmediata de objeciones.</li>
              </ul>
            </div>
          </div>

          {/* Quick CTA to see schedule */}
          <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-[#1F5E99] dark:text-[#38BDF8]" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Consulta el cronograma modelo estructurado para el Asesor CVS.
              </span>
            </div>
            <button
              onClick={() => setSelectedTopic('cronograma_cvs')}
              className="px-3 py-1.5 rounded-xl bg-[#1F5E99] text-white text-xs font-bold hover:bg-[#0F3D66] transition"
            >
              Ver Cronograma →
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CRONOGRAMA MODELO CVS (SIN LA FRASE "4 SEMANAS")
         ========================================================================= */}
      {selectedTopic === 'cronograma_cvs' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#1F5E99] dark:text-[#38BDF8]">
                Estructura Cronológica Oficial
              </span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Malla de Formación: Asesor CVS (Centro de Ventas y Servicios)
              </h3>
              <p className="text-xs text-slate-500">
                160 Horas lectivas estructuradas · Combinación de Aula, Simulador y Tienda
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                100% Homologado
              </span>
            </div>
          </div>

          {/* Weeks Cards */}
          <div className="space-y-4">
            {cvsWeeklySchedule.map((week) => (
              <div
                key={week.week}
                className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-[#1F5E99]/50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#1F5E99] text-white flex items-center justify-center font-black text-xs">
                      S{week.week}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {week.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{week.objective}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs shrink-0">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      {week.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8] font-semibold">
                      {week.modality}
                    </span>
                  </div>
                </div>

                {/* Day-by-Day Modules */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                  {week.modules.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[11px] text-[#1F5E99] dark:text-[#38BDF8]">
                          {m.day}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{m.hours}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-snug">
                        {m.topic}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CIERRE DE BRECHAS (SIGNIFICADO Y GESTIÓN EN FORMACIÓN)
         ========================================================================= */}
      {selectedTopic === 'brechas' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Hero Definition Card with the EXACT required meaning */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F3D66] via-[#1F5E99] to-[#0b2238] text-white shadow-xl relative overflow-hidden">
            <div className="max-w-3xl relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>Concepto Formativo Oficial</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Cierre de Brechas
              </h3>

              {/* Exact user requested definition highlighted */}
              <div className="p-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner">
                <p className="text-lg sm:text-xl font-black text-white leading-relaxed">
                  «<span className="text-[#38BDF8] underline decoration-2 underline-offset-4">Cierre de brechas</span> es un <span className="text-amber-300 font-extrabold">cierre de conocimiento posterior a una formación por parte del ejecutivo</span>.»
                </p>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-2.5 leading-relaxed">
                  Una vez que el ejecutivo o asesor culmina un ciclo de la malla formativa o un curso CVS, se evalúan los puntos débiles o temas no asimilados por completo. El cierre de brecha es la acción deliberada de reforzar, repasar y validar ese conocimiento específico hasta alcanzar el 100% de suficiencia operativa.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs">
                  <span className="text-blue-200 block text-[11px] font-semibold">1. Identificación</span>
                  <span className="font-bold text-white">Detección post-capacitación</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs">
                  <span className="text-blue-200 block text-[11px] font-semibold">2. Refuerzo</span>
                  <span className="font-bold text-white">Acción directa del ejecutivo</span>
                </div>
                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-xs">
                  <span className="text-blue-200 block text-[11px] font-semibold">3. Cierre Validado</span>
                  <span className="font-bold text-white">Certificación y dominio 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Brechas Management Dashboard */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#1F5E99] dark:text-[#38BDF8]" />
                  <span>Brechas de Conocimiento Registradas</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8] font-bold">
                    {activeGapsList.length} Totales
                  </span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seguimiento al cierre de conocimiento posterior a módulos formativos.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddGapModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold transition shadow-md shadow-blue-900/20 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Registrar Brecha Post-Formación</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
                <div>
                  <span className="text-amber-800 dark:text-amber-300 font-bold block">En Proceso de Refuerzo</span>
                  <span className="text-2xl font-black text-amber-900 dark:text-amber-200">{openGaps}</span>
                </div>
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 dark:text-emerald-300 font-bold block">Conocimiento Cerrado</span>
                  <span className="text-2xl font-black text-emerald-900 dark:text-emerald-200">{closedGaps}</span>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-between">
                <div>
                  <span className="text-[#1F5E99] dark:text-[#38BDF8] font-bold block">Efectividad de Cierre</span>
                  <span className="text-2xl font-black text-[#0F3D66] dark:text-white">{gapClosurePercent}%</span>
                </div>
                <Award className="w-6 h-6 text-[#1F5E99]" />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 pb-1">
              {(['Todas', 'En curso', 'Cerrada'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setGapFilter(filter)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition ${
                    gapFilter === filter
                      ? 'bg-[#1F5E99] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Gaps List */}
            <div className="space-y-3">
              {filteredGaps.map((gap) => {
                const isClosed = gap.status === 'Cerrada';
                return (
                  <div
                    key={gap.id}
                    className={`p-4 rounded-2xl border transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isClosed
                        ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-90'
                        : 'bg-white dark:bg-[#0F172A] border-amber-200/80 dark:border-amber-900/50 shadow-sm'
                    }`}
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isClosed
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {isClosed ? '✓ Conocimiento Cerrado' : '⏳ En Proceso de Cierre'}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                          Categoría: {gap.category}
                        </span>
                        <span className="text-xs text-slate-400">Plazo: {gap.deadline}</span>
                      </div>

                      <h5 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {gap.title}
                      </h5>

                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <strong className="text-slate-700 dark:text-slate-200">Acción de refuerzo:</strong>{' '}
                        {gap.actionRequired}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleGapStatus(gap.id, gap.status)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 ${
                          isClosed
                            ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20'
                        }`}
                      >
                        {isClosed ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reabrir Brecha</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Marcar Cierre de Brecha</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Registrar Brecha de Conocimiento Post-Formación */}
      {showAddGapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#1F5E99] dark:text-[#38BDF8]" />
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Registrar Brecha de Conocimiento Post-Formación
                </h4>
              </div>
              <button
                onClick={() => setShowAddGapModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateKnowledgeGap} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Título de la Brecha / Tema a Reforzar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cálculo de comisiones en planes convergentes"
                  value={newGapTitle}
                  onChange={(e) => setNewGapTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-[#1F5E99]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={newGapCategory}
                    onChange={(e) => setNewGapCategory(e.target.value as GapItem['category'])}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="Producto">Producto</option>
                    <option value="Objeciones">Objeciones</option>
                    <option value="Herramientas">Herramientas</option>
                    <option value="Servicio">Servicio</option>
                    <option value="Venta">Venta</option>
                    <option value="Cierre">Cierre</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Plazo de Cierre
                  </label>
                  <input
                    type="text"
                    value={newGapDeadline}
                    onChange={(e) => setNewGapDeadline(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Acción de Refuerzo del Ejecutivo
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe la acción pedagógica (ej: simulación con tutor, repaso en SharePoint, lectura de manual)..."
                  value={newGapAction}
                  onChange={(e) => setNewGapAction(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-[#1F5E99]"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px] text-blue-900 dark:text-blue-200">
                💡 <strong>Recordatorio pedagógico:</strong> Cierre de brechas es un cierre de conocimiento posterior a una formación por parte del ejecutivo.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGapModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] font-bold text-white transition shadow-sm"
                >
                  Guardar Brecha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
