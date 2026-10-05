import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Monitor, Apple, Check, X, Laptop } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, install, isIOS, isAndroid } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'windows' | 'mac'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'windows'
  );

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
        <Check className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">PWA Instalada</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Instalar aplicación AIDEX 0.7"
        className={`group relative flex items-center gap-2 font-medium text-xs rounded-lg transition-all duration-200 active:scale-95 shadow-sm ${
          compact
            ? 'p-2 bg-[#0F3D66] hover:bg-[#1F5E99] text-white'
            : 'px-3 py-1.5 bg-gradient-to-r from-[#0F3D66] to-[#1F5E99] hover:from-[#1F5E99] hover:to-[#4A90E2] text-white border border-[#4A90E2]/30 shadow-blue-900/10'
        }`}
        title="Instalar AIDEX 0.7 en tu dispositivo"
      >
        <Download className="w-3.5 h-3.5 text-[#38BDF8] group-hover:translate-y-0.5 transition-transform" />
        <span className={compact ? 'hidden md:inline' : 'inline font-semibold'}>Instalar App</span>
        <span className="hidden lg:inline text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white/90 uppercase tracking-wider font-bold">PWA</span>
      </button>

      {/* Cross-Platform Install Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0F172A] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F3D66] to-[#4A90E2] flex items-center justify-center text-white shadow-md">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-snug">Instalar AIDEX 0.7</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Accede sin conexión y con máxima velocidad en cualquier sistema
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Trigger button if supported */}
            {isInstallable && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#0F3D66] dark:text-blue-300">
                    Tu navegador admite instalación directa
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Presiona el botón para agregar al escritorio o pantalla de inicio.
                  </p>
                </div>
                <button
                  onClick={async () => {
                    await install();
                    setShowModal(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#1F5E99] hover:bg-[#4A90E2] text-white text-xs font-bold transition shadow-sm"
                >
                  Instalar Ahora
                </button>
              </div>
            )}

            {/* Platform Tabs */}
            <div className="grid grid-cols-4 gap-1.5 mt-4 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F3D66] dark:text-[#38BDF8] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F3D66] dark:text-[#38BDF8] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>iPhone</span>
              </button>
              <button
                onClick={() => setActiveTab('windows')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                  activeTab === 'windows'
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F3D66] dark:text-[#38BDF8] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Windows</span>
              </button>
              <button
                onClick={() => setActiveTab('mac')}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition ${
                  activeTab === 'mac'
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F3D66] dark:text-[#38BDF8] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>macOS</span>
              </button>
            </div>

            {/* Tab Instructions Content */}
            <div className="mt-4 min-h-[140px] text-xs space-y-2 text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeTab === 'android' && (
                <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    <span>Abre AIDEX en <strong>Google Chrome</strong> o <strong>Edge Mobile</strong>.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    <span>Toca el menú de opciones (tres puntos verticales en la esquina superior derecha).</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    <span>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.</span>
                  </div>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    <span>Abre AIDEX en <strong>Safari</strong> en tu iPhone o iPad.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    <span>Toca el botón <strong>Compartir</strong> (ícono de cuadro con flecha hacia arriba) en la barra inferior.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    <span>Desliza hacia abajo y presiona <strong>"Agregar al inicio" (Add to Home Screen)</strong>.</span>
                  </div>
                </div>
              )}

              {activeTab === 'windows' && (
                <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    <span>En <strong>Microsoft Edge</strong> o <strong>Google Chrome</strong>, busca el ícono de instalación en la barra de direcciones (a la derecha).</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    <span>Haz clic en <strong>"Instalar AIDEX 0.7"</strong>.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    <span>Se creará un acceso directo en tu barra de tareas de Windows y Menú Inicio.</span>
                  </div>
                </div>
              )}

              {activeTab === 'mac' && (
                <div className="space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                    <span>En <strong>Safari (macOS Sonoma+)</strong>: Menú Archivo → <strong>"Agregar al Dock..."</strong>.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                    <span>En <strong>Chrome</strong>: Haz clic en el ícono de instalación en la barra de direcciones o Menú → Transmitir, guardar y compartir → Instalar AIDEX.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1F5E99] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                    <span>Se abrirá como una aplicación nativa e independiente en tu Dock.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
