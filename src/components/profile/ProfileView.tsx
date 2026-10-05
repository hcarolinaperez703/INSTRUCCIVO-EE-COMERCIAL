import React, { useState } from 'react';
import { UserProfile, KPIStats } from '../../types';
import {
  Award,
  CheckCircle2,
  GraduationCap,
  Target,
  FileCheck,
  Download,
  Printer,
  Calendar,
  Sparkles,
  MapPin,
  Mail,
  Shield,
  Star,
  LogOut,
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  kpis: KPIStats;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, kpis, onLogout }) => {
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const badges = [
    { name: 'Guardián del Compliance', icon: '🛡️', category: 'Transversales', date: 'Completado' },
    { name: 'Master Consultor CVS', icon: '⭐', category: 'Venta Consultiva', date: 'En curso (70%)' },
    { name: 'Ranger de Auditoría PDV', icon: '📍', category: 'Campo', date: '45 Visitas' },
    { name: 'Solucionador de Brechas', icon: '🎯', category: 'Mejora Continua', date: '12 Cerradas' },
    { name: 'Racha Imparable', icon: '🔥', category: 'Hábitos', date: '14 Días seguidos' },
  ];

  const competencies = [
    { name: 'Abordaje Comercial y Diagnóstico (SPIN)', level: 88 },
    { name: 'Manejo Estratégico de Objeciones', level: 74 },
    { name: 'Cierre Consultivo y Negociación', level: 82 },
    { name: 'Auditoría y Ejecución en Punto de Venta', level: 95 },
    { name: 'Políticas de Crédito y Compliance', level: 100 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Profile Card (Screen 11 Reference Mockup: Avatar 'JP', Juan Pérez, Región Caribe) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar Dot (JP) */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0F3D66] to-[#4A90E2] text-white flex items-center justify-center font-extrabold text-2xl shadow-xl ring-4 ring-[#4A90E2]/20">
            {user.initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{user.name}</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]">
                {user.employeeCode}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {user.role} · <strong className="text-[#1F5E99] dark:text-[#38BDF8]">{user.region}</strong>
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Ingreso: {user.joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Button */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowCertificateModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0F3D66] to-[#1F5E99] hover:from-[#1F5E99] hover:to-[#4A90E2] text-white text-xs font-bold shadow-md transition active:scale-95"
          >
            <Award className="w-4 h-4 text-[#38BDF8]" />
            <span>Ver Certificado de Inducción</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* 4 Cards (Screen 11 Reference Mockup: 68%, 7, 12, Reconocimientos) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#0F3D66] text-white shadow-sm">
          <div className="text-2xl sm:text-3xl font-black">{kpis.trainingProgress}%</div>
          <p className="text-xs text-blue-200 font-semibold mt-1">Avance formación</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F3D66] text-white shadow-sm">
          <div className="text-2xl sm:text-3xl font-black">{kpis.completedCourses}</div>
          <p className="text-xs text-blue-200 font-semibold mt-1">Cursos completados</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0F3D66] text-white shadow-sm">
          <div className="text-2xl sm:text-3xl font-black text-emerald-300">{kpis.closedGaps}</div>
          <p className="text-xs text-blue-200 font-semibold mt-1">Brechas cerradas</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <span>🏅 Reconocimientos</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
            Mejor visita del mes · Curso CVS
          </p>
        </div>
      </div>

      {/* Competencies Breakdown */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-[#1F5E99] dark:text-[#38BDF8]" />
          <span>Matriz de Competencias Comerciales (Evaluación 360°)</span>
        </h3>

        <div className="space-y-3">
          {competencies.map((comp) => (
            <div key={comp.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">{comp.name}</span>
                <span className="text-[#1F5E99] dark:text-[#38BDF8] font-bold">{comp.level}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    comp.level >= 90
                      ? 'bg-emerald-500'
                      : comp.level >= 80
                      ? 'bg-[#1F5E99]'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${comp.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Showcase (Trailhead Style) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Insignias de Certificación Obtenidas</span>
          </h3>
          <span className="text-xs font-bold text-[#1F5E99] dark:text-[#38BDF8]">
            {user.xpPoints} Puntos XP
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {badges.map((b, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-1.5 hover:shadow-md transition"
            >
              <div className="text-3xl mx-auto">{b.icon}</div>
              <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                {b.name}
              </h5>
              <p className="text-[10px] text-slate-500">{b.category}</p>
              <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]">
                {b.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0F172A] p-6 sm:p-8 shadow-2xl border-4 border-[#0F3D66] text-center space-y-5">
            {/* Certificate Header */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0F3D66] to-[#4A90E2] text-white flex items-center justify-center font-black text-xl shadow-md">
                A
              </div>
              <div className="text-left">
                <h4 className="font-black text-xl tracking-wider text-[#0F3D66] dark:text-white">
                  AIDEX 0.7 · TONOZ
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Certificado Oficial de Capacitación Comercial
                </p>
              </div>
            </div>

            <div className="py-4 border-y-2 border-dashed border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                Se otorga el presente reconocimiento a:
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F3D66] dark:text-[#38BDF8]">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Por haber completado satisfactoriamente los módulos de Inducción, Metodología de Venta Consultiva CVS y Protocolos de Auditoría de Campo en la {user.region}.
              </p>
            </div>

            <div className="flex items-center justify-around text-xs text-slate-500 pt-2">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Mariana Duarte</p>
                <p className="text-[10px] text-slate-400">Directora de Formación Comercial</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Octubre 2026</p>
                <p className="text-[10px] text-slate-400">Código: AIDEX-EC-4092-CERT</p>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
              <button
                onClick={() => {
                  alert('Certificado descargado en formato PDF de alta resolución.');
                  setShowCertificateModal(false);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PDF</span>
              </button>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
