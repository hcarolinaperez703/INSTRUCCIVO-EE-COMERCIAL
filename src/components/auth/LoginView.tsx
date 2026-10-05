import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Compass, Sparkles, ShieldCheck, ArrowRight, UserCheck, KeyRound, Check } from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('juan.perez');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const defaultUser: UserProfile = {
    id: 'usr-001',
    name: 'Juan Pérez',
    role: 'Ejecutivo Comercial Senior',
    region: 'Región Caribe',
    employeeCode: 'EC-4092',
    email: 'juan.perez@tonoz-corp.com',
    initials: 'JP',
    level: 'Nivel 4 · Senior Challenger',
    xpPoints: 2450,
    streakDays: 14,
    joinedDate: '15 de Enero 2026',
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(defaultUser);
    }, 400);
  };

  const handleMicrosoftSSO = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(defaultUser);
    }, 450);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EEF2F6] dark:bg-[#070d14] p-3 sm:p-6 transition-colors">
      <div className="w-full max-w-4xl min-h-[580px] rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2">
        {/* Left: Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F3D66] to-[#4A90E2] flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-black text-xl text-[#0F3D66] dark:text-white tracking-tight">
                  <span>AIDEX</span>
                  <span className="text-[#4A90E2] text-sm px-2 py-0.5 bg-blue-50 dark:bg-blue-950/80 rounded-md">0.7</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Identidad TONOZ</p>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Bienvenido a tu inducción comercial
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tu centro inteligente de onboarding, capacitación y gestión de campo.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Usuario o Correo Corporativo
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="juan.perez@tonoz-corp.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 transition"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Contraseña
                  </label>
                  <a href="#reset" onClick={(e) => { e.preventDefault(); alert('En un entorno productivo esto enviará un enlace de recuperación a tu correo corporativo.'); }} className="text-[11px] text-[#1F5E99] dark:text-[#38BDF8] hover:underline font-semibold">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:border-[#4A90E2] focus:ring-2 focus:ring-[#4A90E2]/20 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-900/20 active:scale-[0.98] transition disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin mr-2">◷</span>
                ) : (
                  <span>Ingresar a la plataforma</span>
                )}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <span className="relative bg-white dark:bg-[#0F172A] px-2 text-[10px] text-slate-400 font-semibold uppercase">
                  o accede con tu cuenta corporativa
                </span>
              </div>

              {/* Microsoft Entra ID SSO */}
              <button
                type="button"
                onClick={handleMicrosoftSSO}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-black text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold transition border border-slate-800"
              >
                <span className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  <span className="bg-[#F25022] rounded-[1px]"></span>
                  <span className="bg-[#7FBA00] rounded-[1px]"></span>
                  <span className="bg-[#00A4EF] rounded-[1px]"></span>
                  <span className="bg-[#FFB900] rounded-[1px]"></span>
                </span>
                <span>Iniciar con Microsoft 365</span>
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Conexión PWA cifrada
            </span>
            <span>Versión 0.7 Build 2026</span>
          </div>
        </div>

        {/* Right: Graphic Hero Panel (Corporate Blue Gradient) */}
        <div className="relative hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-[#0F3D66] via-[#1F5E99] to-[#0A2640] text-white overflow-hidden">
          {/* Subtle geometric circles */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#4A90E2]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#38BDF8]/15 blur-3xl pointer-events-none"></div>

          {/* Badge */}
          <div className="relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 w-fit text-xs font-medium text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Plataforma Inteligente para Ejecutivos</span>
          </div>

          {/* Center Illustration Simulation */}
          <div className="relative z-10 my-auto py-8">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-4xl mb-6 shadow-xl">
              📈🧭
            </div>
            <h2 className="text-2xl font-black leading-tight text-white mb-3">
              Impulsa tu productividad comercial desde el primer día
            </h2>
            <p className="text-xs text-blue-100/80 leading-relaxed max-w-sm mb-6">
              Rutas en campo con georreferenciación, universidad comercial interactiva estilo Trailhead, auditoría de PDV en 5 checks y asistente con IA.
            </p>

            {/* Quick KPI preview badges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <p className="text-[10px] text-blue-200">Inducción</p>
                <p className="text-base font-bold text-white">68% completado</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                <p className="text-[10px] text-blue-200">Visitas de Hoy</p>
                <p className="text-base font-bold text-[#38BDF8]">3 Puntos en ruta</p>
              </div>
            </div>
          </div>

          {/* Footer quote */}
          <div className="relative z-10 text-[11px] text-blue-200/70 border-t border-white/10 pt-4 flex items-center justify-between">
            <span>“Cada visita es una oportunidad de vender mejor.”</span>
            <span className="font-semibold text-white">TONOZ 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
