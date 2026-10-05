import React, { useState, useEffect } from 'react';
import { KnowledgeItem, KnowledgeSource, NavSection } from '../../types';
import {
  BookOpen,
  Search,
  Sparkles,
  Star,
  Bookmark,
  X,
  ExternalLink,
  Plus,
  Link2,
  FolderKanban,
  CheckCircle2,
  Copy,
  Globe,
  Share2,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Settings,
  Edit3,
} from 'lucide-react';

interface KnowledgeViewProps {
  items: KnowledgeItem[];
  sources: KnowledgeSource[];
  onToggleFavorite: (id: string) => void;
  onAddSource: (source: KnowledgeSource) => void;
  onNavigate: (section: NavSection) => void;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({
  sources,
  onAddSource,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSourceCategory, setSelectedSourceCategory] = useState<string>('Todas');

  // Specific state for the two requested links: Conectados and Success Factor
  const [conectadosUrl, setConectadosUrl] = useState<string>(() => {
    return localStorage.getItem('aidex_conectados_url') || 'https://conectados.tonoz.com';
  });
  const [successFactorUrl, setSuccessFactorUrl] = useState<string>(() => {
    return (
      localStorage.getItem('aidex_success_factor_url') ||
      'https://performancemanager.successfactors.com/login?company=tonoz'
    );
  });

  // Modal states for Conectados and Success Factor
  const [showConectadosModal, setShowConectadosModal] = useState(false);
  const [inputConectadosUrl, setInputConectadosUrl] = useState(conectadosUrl);

  const [showSuccessFactorModal, setShowSuccessFactorModal] = useState(false);
  const [inputSuccessFactorUrl, setInputSuccessFactorUrl] = useState(successFactorUrl);

  // Modal State for adding generic new source link
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceCategory, setNewSourceCategory] = useState<KnowledgeSource['category']>('SharePoint');
  const [newSourceDesc, setNewSourceDesc] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Notification message
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveConectados = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputConectadosUrl.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setConectadosUrl(url);
    localStorage.setItem('aidex_conectados_url', url);

    // Also add/update as a source in the catalog
    onAddSource({
      id: 'src-conectados',
      name: 'Conectados · Portal Corporativo',
      url: url,
      category: 'Intranet',
      description: 'Plataforma oficial de comunicación interna, noticias, trámites y autoservicio para colaboradores.',
      updatedAt: 'Hoy',
      isOfficial: true,
    });

    setShowConectadosModal(false);
    showToast('Enlace de Conectados hipervinculado y actualizado con éxito.');
  };

  const handleSaveSuccessFactor = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputSuccessFactorUrl.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setSuccessFactorUrl(url);
    localStorage.setItem('aidex_success_factor_url', url);

    // Also add/update as a source in the catalog
    onAddSource({
      id: 'src-success-factor',
      name: 'Success Factor · SAP Formación & Talento',
      url: url,
      category: 'Intranet',
      description: 'Sistema corporativo de gestión del talento humano, cursos obligatorios, evaluaciones y desempeño.',
      updatedAt: 'Hoy',
      isOfficial: true,
    });

    setShowSuccessFactorModal(false);
    showToast('Enlace de Success Factor anexado y actualizado con éxito.');
  };

  const sourceCategories = [
    'Todas',
    'SharePoint',
    'Teams',
    'OneDrive',
    'Intranet',
    'Regulador',
    'Externo',
  ];

  // Filter sources
  const filteredSources = sources.filter((source) => {
    const matchesCat =
      selectedSourceCategory === 'Todas' || source.category === selectedSourceCategory;
    const matchesSearch =
      !searchQuery ||
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.url.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSearch;
  });

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveGenericSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim() || !newSourceUrl.trim()) return;

    let formattedUrl = newSourceUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newSource: KnowledgeSource = {
      id: `src-${Date.now()}`,
      name: newSourceName.trim(),
      url: formattedUrl,
      category: newSourceCategory,
      description: newSourceDesc.trim() || 'Enlace directo registrado para consulta del equipo comercial.',
      updatedAt: 'Hoy',
      isOfficial: true,
    };

    onAddSource(newSource);
    setShowAddSourceModal(false);
    setNewSourceName('');
    setNewSourceUrl('');
    setNewSourceDesc('');
    showToast(`Fuente "${newSource.name}" hipervinculada con éxito.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-[#0F3D66] text-white shadow-2xl border border-blue-400 flex items-center gap-3 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* Top Banner: Campo de Conocimiento & Fuentes */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0F3D66] to-[#1F5E99] text-white shadow-lg space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
              Campo de Conocimiento
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Fuentes con Acceso a Hipervincular Enlaces
            </h2>
            <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
              Repositorio centralizado de fuentes oficiales, portales corporativos de colaboradores y herramientas de autoservicio.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowAddSourceModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0F3D66] hover:bg-blue-50 text-xs font-bold transition shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#1F5E99]" />
              <span>+ Hipervincular Otra Fuente</span>
            </button>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en fuentes hipervinculadas (Conectados, Success Factor, SharePoint, Teams...)"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm shadow-xl outline-none border-2 border-transparent focus:border-[#4A90E2] transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          BOTONES REQUERIDOS: CONECTADOS Y SUCCESS FACTOR
         ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Link2 className="w-4 h-4 text-[#1F5E99] dark:text-[#38BDF8]" />
            <span>Portales Clave para Hipervincular</span>
          </h3>
          <span className="text-xs text-slate-400">Acceso rápido oficial</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. BOTÓN CONECTADOS */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border-2 border-blue-200 dark:border-blue-900/60 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-[#1F5E99] dark:text-[#38BDF8]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-slate-900 dark:text-white">
                      Conectados
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]">
                      Portal del Colaborador
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setInputConectadosUrl(conectadosUrl);
                    setShowConectadosModal(true);
                  }}
                  title="Configurar / hipervincular link de Conectados"
                  className="p-2 rounded-xl text-slate-400 hover:text-[#1F5E99] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Plataforma de comunicación interna y autoservicio para el colaborador. Haz clic para abrir o hipervincular el enlace directo.
              </p>

              <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60">
                <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{conectadosUrl}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setInputConectadosUrl(conectadosUrl);
                  setShowConectadosModal(true);
                }}
                className="text-xs font-bold text-[#1F5E99] dark:text-[#38BDF8] hover:underline"
              >
                Hipervincular link de Conectados
              </button>

              <a
                href={conectadosUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-black shadow-md shadow-blue-900/20 transition active:scale-95"
              >
                <span>Conectados</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 2. BOTÓN SUCCESS FACTOR */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border-2 border-emerald-200 dark:border-emerald-900/60 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-slate-900 dark:text-white">
                      Success Factor
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      SAP SuccessFactors
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setInputSuccessFactorUrl(successFactorUrl);
                    setShowSuccessFactorModal(true);
                  }}
                  title="Anexar / editar link de Success Factor"
                  className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Portal corporativo de aprendizaje, cursos oficiales y gestión del desempeño. Haz clic para abrir o anexar el link de Success Factor.
              </p>

              <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60">
                <Globe className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{successFactorUrl}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setInputSuccessFactorUrl(successFactorUrl);
                  setShowSuccessFactorModal(true);
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Anexar link de Success Factor
              </button>

              <a
                href={successFactorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-900/20 transition active:scale-95"
              >
                <span>Success Factor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CATÁLOGO DE FUENTES HIPERVINCULADAS
         ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#1F5E99] dark:text-[#38BDF8]" />
              <span>Todas las Fuentes Hipervinculadas</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8] font-bold">
                {filteredSources.length} Fuentes
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Enlaces directos para consulta del equipo comercial.
            </p>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {sourceCategories.map((cat) => {
              const isSelected = selectedSourceCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedSourceCategory(cat)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold shrink-0 transition-all ${
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
        </div>

        {/* Sources Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#1F5E99]/60 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8] border border-blue-200/40 dark:border-blue-800/40">
                    {source.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{source.updatedAt}</span>
                </div>

                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#1F5E99] dark:group-hover:text-[#38BDF8] transition">
                  {source.name}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {source.description}
                </p>

                <div className="mt-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] text-slate-600 dark:text-slate-300 truncate flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{source.url}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleCopyLink(source.url, source.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
                >
                  {copiedId === source.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar URL</span>
                    </>
                  )}
                </button>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] text-white text-xs font-bold transition shadow-sm group-hover:translate-x-0.5"
                >
                  <span>Abrir Fuente</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MODAL: ANEXAR / HIPERVINCULAR LINK DE CONECTADOS
         ========================================================================= */}
      {showConectadosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-[#1F5E99]">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Hipervincular link de Conectados
                </h4>
              </div>
              <button
                onClick={() => setShowConectadosModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConectados} className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Ingresa o actualiza la URL directa para que el botón <strong>Conectados</strong> abra tu portal corporativo:
              </p>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL de Conectados *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://conectados.tonoz.com"
                  value={inputConectadosUrl}
                  onChange={(e) => setInputConectadosUrl(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-[#1F5E99] font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConectadosModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] font-bold text-white transition shadow-sm"
                >
                  Guardar Hipervínculo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ANEXAR / HIPERVINCULAR LINK DE SUCCESS FACTOR
         ========================================================================= */}
      {showSuccessFactorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Anexar link de Success Factor
                </h4>
              </div>
              <button
                onClick={() => setShowSuccessFactorModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSuccessFactor} className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Ingresa o actualiza la URL directa para que el botón <strong>Success Factor</strong> abra la plataforma de aprendizaje y talento:
              </p>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  URL de Success Factor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://performancemanager.successfactors.com/..."
                  value={inputSuccessFactorUrl}
                  onChange={(e) => setInputSuccessFactorUrl(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSuccessFactorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white transition shadow-sm"
                >
                  Anexar Enlace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ANEXAR CUALQUIER FUENTE ADICIONAL
         ========================================================================= */}
      {showAddSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[#1F5E99] dark:text-[#38BDF8]" />
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Hipervincular Nueva Fuente Oficial
                </h4>
              </div>
              <button
                onClick={() => setShowAddSourceModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGenericSource} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Fuente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Portal de Comisiones Q4"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-[#1F5E99]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Enlace / Hipervínculo URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-[#1F5E99] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Categoría
                </label>
                <select
                  value={newSourceCategory}
                  onChange={(e) =>
                    setNewSourceCategory(e.target.value as KnowledgeSource['category'])
                  }
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                >
                  <option value="SharePoint">SharePoint</option>
                  <option value="Teams">Teams</option>
                  <option value="OneDrive">OneDrive</option>
                  <option value="Intranet">Intranet</option>
                  <option value="Regulador">Regulador</option>
                  <option value="Externo">Externo</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  placeholder="Breve detalle del contenido o uso de la fuente..."
                  value={newSourceDesc}
                  onChange={(e) => setNewSourceDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSourceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1F5E99] hover:bg-[#0F3D66] font-bold text-white transition shadow-sm"
                >
                  Guardar Fuente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
