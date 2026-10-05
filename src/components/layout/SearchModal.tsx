import React, { useState, useEffect } from 'react';
import { NavSection, TrainingCourse, SharePointDoc, PointOfSale, GapItem, KnowledgeItem, KnowledgeSource } from '../../types';
import { Search, X, GraduationCap, FileText, MapPin, Target, BookOpen, ArrowRight, Link2, ExternalLink } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: NavSection) => void;
  courses: TrainingCourse[];
  docs: SharePointDoc[];
  pointsOfSale: PointOfSale[];
  gaps: GapItem[];
  knowledge: KnowledgeItem[];
  sources?: KnowledgeSource[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  courses,
  docs,
  pointsOfSale,
  gaps,
  knowledge,
  sources = [],
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredCourses = q ? courses.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) : [];
  const filteredDocs = q ? docs.filter((d) => d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)) : [];
  const filteredPDVs = q ? pointsOfSale.filter((p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.city.toLowerCase().includes(q)) : [];
  const filteredGaps = q ? gaps.filter((g) => g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)) : [];
  const filteredKnowledge = q ? knowledge.filter((k) => k.title.toLowerCase().includes(q) || k.description.toLowerCase().includes(q)) : [];
  const filteredSources = q ? sources.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.url.toLowerCase().includes(q)) : [];

  const hasResults =
    filteredCourses.length > 0 ||
    filteredDocs.length > 0 ||
    filteredPDVs.length > 0 ||
    filteredGaps.length > 0 ||
    filteredKnowledge.length > 0 ||
    filteredSources.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0F172A] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Input Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-[#1F5E99] dark:text-[#38BDF8] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué quieres encontrar en AIDEX 0.7? (Cursos, documentos, PDVs, brechas...)"
            autoFocus
            className="flex-1 bg-transparent px-3 text-sm sm:text-base outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestions when empty */}
        {!q && (
          <div className="p-4 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Búsquedas sugeridas para el Ejecutivo Comercial
            </p>
            <div className="flex flex-wrap gap-2">
              {['Curso CVS Venta Consultiva', 'Tarifario Q4 Planes Negocios', 'PDV Centro Histórico', 'Objeciones de precio', 'Checklist de auditoría'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-[#1F5E99] dark:hover:text-[#38BDF8] text-slate-600 dark:text-slate-300 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        {q && (
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {!hasResults && (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">No encontramos resultados exactos para "{query}"</p>
                <button
                  onClick={() => {
                    onNavigate('copilot');
                    onClose();
                  }}
                  className="mt-2 text-xs font-semibold text-[#1F5E99] dark:text-[#38BDF8] hover:underline"
                >
                  Consultar al Asistente IA AIDEX sobre esto →
                </button>
              </div>
            )}

            {/* Courses */}
            {filteredCourses.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> Formación ({filteredCourses.length})
                </p>
                <div className="space-y-1">
                  {filteredCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onNavigate('training');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1F5E99] dark:group-hover:text-[#38BDF8]">
                          {c.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate max-w-md">{c.description}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Docs */}
            {filteredDocs.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Documentos SharePoint ({filteredDocs.length})
                </p>
                <div className="space-y-1">
                  {filteredDocs.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        onNavigate('admin');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1F5E99] dark:group-hover:text-[#38BDF8]">
                          {d.title}
                        </p>
                        <p className="text-[11px] text-slate-500">{d.category} · {d.fileType} · {d.fileSize}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PDVs */}
            {filteredPDVs.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Puntos de Venta y Campo ({filteredPDVs.length})
                </p>
                <div className="space-y-1">
                  {filteredPDVs.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onNavigate('field');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1F5E99] dark:group-hover:text-[#38BDF8]">
                          {p.name}
                        </p>
                        <p className="text-[11px] text-slate-500">{p.address} ({p.city})</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sources & Hyperlinks */}
            {filteredSources.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" /> Fuentes Oficiales e Hipervínculos ({filteredSources.length})
                </p>
                <div className="space-y-1">
                  {filteredSources.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition group"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#1F5E99] dark:text-[#38BDF8]">
                            {s.category}
                          </span>
                          <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1F5E99] dark:group-hover:text-[#38BDF8]">
                            {s.name}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono truncate max-w-md">{s.url}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1F5E99] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Knowledge */}
            {filteredKnowledge.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Centro de Conocimiento ({filteredKnowledge.length})
                </p>
                <div className="space-y-1">
                  {filteredKnowledge.map((k) => (
                    <button
                      key={k.id}
                      onClick={() => {
                        onNavigate('knowledge');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1F5E99] dark:group-hover:text-[#38BDF8]">
                          {k.title}
                        </p>
                        <p className="text-[11px] text-slate-500">{k.category} · {k.readTime}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
