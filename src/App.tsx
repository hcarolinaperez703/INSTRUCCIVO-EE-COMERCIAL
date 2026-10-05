/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  NavSection,
  UserProfile,
  KPIStats,
  MonthlyGoalItem,
  SharePointDoc,
  MeetingMinute,
  MeetingRecording,
  DayChecklistItem,
  TrainingCourse,
  PointOfSale,
  VisitRecord,
  GapItem,
  KnowledgeItem,
  KnowledgeSource,
  GapStatus,
  WeeklyPlanSharePoint,
  AssignedMarathon,
  AssignedPreturno,
  TrainingMesh,
  TrainingMeshModule,
} from './types';
import {
  initialUser,
  initialKPIs,
  initialMonthlyGoals,
  initialSharePointDocs,
  initialMeetingMinutes,
  initialRecordings,
  initialChecklist,
  initialCourses,
  initialPointsOfSale,
  initialVisits,
  initialGaps,
  initialKnowledge,
  initialSources,
  initialWeeklyPlans,
  initialMarathons,
  initialPreturnos,
  initialTrainingMeshes,
} from './data/initialData';

import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { SearchModal } from './components/layout/SearchModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { LoginView } from './components/auth/LoginView';
import { DashboardView } from './components/dashboard/DashboardView';
import { AdminView } from './components/admin/AdminView';
import { JourneyView } from './components/journey/JourneyView';
import { TrainingView } from './components/training/TrainingView';
import { FieldView } from './components/field/FieldView';
import { GapsView } from './components/gaps/GapsView';
import { KnowledgeView } from './components/knowledge/KnowledgeView';
import { CopilotView } from './components/copilot/CopilotView';
import { ProfileView } from './components/profile/ProfileView';

import { X, FolderKanban, BookOpen, GraduationCap, UserCheck, Sparkles } from 'lucide-react';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('aidex_authenticated') === 'true';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aidex_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  // Current Active Section
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [showMobileMoreDrawer, setShowMobileMoreDrawer] = useState<boolean>(false);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('aidex_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Business Dataset States (with LocalStorage persistence)
  const [kpis, setKpis] = useState<KPIStats>(() => {
    const saved = localStorage.getItem('aidex_kpis');
    return saved ? JSON.parse(saved) : initialKPIs;
  });

  const [checklist, setChecklist] = useState<DayChecklistItem[]>(() => {
    const saved = localStorage.getItem('aidex_checklist');
    return saved ? JSON.parse(saved) : initialChecklist;
  });

  const [journeyStarted, setJourneyStarted] = useState<boolean>(() => {
    return localStorage.getItem('aidex_journey_started') === 'true';
  });

  const [courses, setCourses] = useState<TrainingCourse[]>(() => {
    const saved = localStorage.getItem('aidex_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [pointsOfSale] = useState<PointOfSale[]>(initialPointsOfSale);

  const [visits, setVisits] = useState<VisitRecord[]>(() => {
    const saved = localStorage.getItem('aidex_visits');
    return saved ? JSON.parse(saved) : initialVisits;
  });

  const [gaps, setGaps] = useState<GapItem[]>(() => {
    const saved = localStorage.getItem('aidex_gaps');
    return saved ? JSON.parse(saved) : initialGaps;
  });

  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(() => {
    const saved = localStorage.getItem('aidex_knowledge');
    return saved ? JSON.parse(saved) : initialKnowledge;
  });

  const [sources, setSources] = useState<KnowledgeSource[]>(() => {
    const saved = localStorage.getItem('aidex_sources');
    return saved ? JSON.parse(saved) : initialSources;
  });

  const [docs, setDocs] = useState<SharePointDoc[]>(() => {
    const saved = localStorage.getItem('aidex_docs');
    return saved ? JSON.parse(saved) : initialSharePointDocs;
  });

  const [minutes] = useState<MeetingMinute[]>(initialMeetingMinutes);
  const [recordings] = useState<MeetingRecording[]>(initialRecordings);
  const [monthlyGoals] = useState<MonthlyGoalItem[]>(initialMonthlyGoals);

  const [weeklyPlans, setWeeklyPlans] = useState<WeeklyPlanSharePoint[]>(() => {
    const saved = localStorage.getItem('aidex_weekly_plans');
    return saved ? JSON.parse(saved) : initialWeeklyPlans;
  });

  const [marathons, setMarathons] = useState<AssignedMarathon[]>(() => {
    const saved = localStorage.getItem('aidex_marathons');
    return saved ? JSON.parse(saved) : initialMarathons;
  });

  const [preturnos, setPreturnos] = useState<AssignedPreturno[]>(() => {
    const saved = localStorage.getItem('aidex_preturnos');
    return saved ? JSON.parse(saved) : initialPreturnos;
  });

  const [meshes, setMeshes] = useState<TrainingMesh[]>(() => {
    const saved = localStorage.getItem('aidex_meshes');
    return saved ? JSON.parse(saved) : initialTrainingMeshes;
  });

  // Apply Theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('aidex_theme', theme);
  }, [theme]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('aidex_kpis', JSON.stringify(kpis));
  }, [kpis]);

  useEffect(() => {
    localStorage.setItem('aidex_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('aidex_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('aidex_visits', JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem('aidex_gaps', JSON.stringify(gaps));
  }, [gaps]);

  useEffect(() => {
    localStorage.setItem('aidex_docs', JSON.stringify(docs));
  }, [docs]);

  useEffect(() => {
    localStorage.setItem('aidex_sources', JSON.stringify(sources));
  }, [sources]);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogin = (loggedUser: UserProfile) => {
    setUser(loggedUser);
    setIsAuthenticated(true);
    localStorage.setItem('aidex_authenticated', 'true');
    localStorage.setItem('aidex_user', JSON.stringify(loggedUser));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('aidex_authenticated');
  };

  const handleNavigate = (section: NavSection) => {
    setCurrentSection(section);
    setShowMobileMoreDrawer(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle checklist item in Inicio de Jornada
  const handleToggleChecklistItem = (id: string) => {
    setChecklist((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const completed = !item.completed;
          return {
            ...item,
            completed,
            completedAt: completed
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };
        }
        return item;
      });

      const pendingCount = updated.filter((item) => !item.completed).length;
      setKpis((k) => ({ ...k, pendingTasks: pendingCount }));

      return updated;
    });
  };

  const handleStartJourney = () => {
    setJourneyStarted(true);
    localStorage.setItem('aidex_journey_started', 'true');
    setUser((prev) => ({ ...prev, xpPoints: prev.xpPoints + 350 }));
  };

  // Training progress update
  const handleUpdateCourseProgress = (
    courseId: string,
    progress: number,
    status: TrainingCourse['status']
  ) => {
    setCourses((prev) => {
      const updated = prev.map((c) => {
        if (c.id === courseId) {
          return { ...c, progress, status };
        }
        return c;
      });

      // Recalculate average progress
      const totalSum = updated.reduce((acc, c) => acc + c.progress, 0);
      const avg = Math.round(totalSum / updated.length);
      const completedC = updated.filter((c) => c.status === 'completed').length;

      setKpis((k) => ({
        ...k,
        trainingProgress: avg,
        completedCourses: completedC,
      }));

      return updated;
    });
  };

  // Add new visit
  const handleSaveVisit = (newVisit: VisitRecord) => {
    setVisits((prev) => [newVisit, ...prev]);
    setKpis((k) => ({ ...k, completedVisits: k.completedVisits + 1 }));
    setUser((prev) => ({ ...prev, xpPoints: prev.xpPoints + 150 }));
  };

  // Generate Gap from Visit or manually
  const handleAddGap = (newGap: GapItem) => {
    setGaps((prev) => [newGap, ...prev]);
    setKpis((k) => ({ ...k, openGaps: k.openGaps + 1 }));
  };

  // Update Gap status (e.g. Cerrada)
  const handleUpdateGapStatus = (gapId: string, newStatus: GapStatus) => {
    setGaps((prev) => {
      const updated = prev.map((g) => {
        if (g.id === gapId) {
          return { ...g, status: newStatus };
        }
        return g;
      });

      const openG = updated.filter((g) => g.status !== 'Cerrada').length;
      const closedG = updated.filter((g) => g.status === 'Cerrada').length;

      setKpis((k) => ({ ...k, openGaps: openG, closedGaps: closedG }));
      if (newStatus === 'Cerrada') {
        setUser((u) => ({ ...u, xpPoints: u.xpPoints + 200 }));
      }

      return updated;
    });
  };

  // Toggle favorite resource
  const handleToggleFavoriteResource = (resourceId: string) => {
    setKnowledge((prev) =>
      prev.map((k) => (k.id === resourceId ? { ...k, favorite: !k.favorite } : k))
    );
  };

  // Add new link to SharePoint docs
  const handleAddDocLink = (newDoc: SharePointDoc) => {
    setDocs((prev) => [newDoc, ...prev]);
  };

  // Add new hyperlinked source
  const handleAddSource = (newSource: KnowledgeSource) => {
    setSources((prev) => [newSource, ...prev]);
  };

  // Add module to training mesh
  const handleAddMeshModule = (meshId: string, newModule: TrainingMeshModule) => {
    setMeshes((prev) =>
      prev.map((m) => {
        if (m.id === meshId) {
          return {
            ...m,
            totalHours: m.totalHours + newModule.hours,
            modules: [...m.modules, newModule],
          };
        }
        return m;
      })
    );
  };

  // If user is not authenticated, show Login screen (Matching Screen 1)
  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-[#EEF2F6] dark:bg-[#070d14] text-slate-800 dark:text-slate-100 transition-colors">
      {/* PWA Offline Banner */}
      <OfflineIndicator />

      {/* Persistent Desktop Sidebar (Identidad TONOZ dark blue) */}
      <Sidebar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        kpis={kpis}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header */}
        <Header
          currentSection={currentSection}
          onNavigate={handleNavigate}
          user={user}
          onSearchOpen={() => setIsSearchOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Dynamic Screen View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentSection === 'dashboard' && (
            <DashboardView
              user={user}
              kpis={kpis}
              monthlyGoals={monthlyGoals}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'admin' && (
            <AdminView
              recordings={recordings}
              weeklyPlans={weeklyPlans}
              monthlyGoals={monthlyGoals}
              courses={courses}
              marathons={marathons}
              preturnos={preturnos}
              meshes={meshes}
              onAddMeshModule={handleAddMeshModule}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'journey' && (
            <JourneyView
              user={user}
              checklist={checklist}
              onToggleItem={handleToggleChecklistItem}
              onNavigate={handleNavigate}
              journeyStarted={journeyStarted}
              onStartJourney={handleStartJourney}
            />
          )}

          {currentSection === 'training' && (
            <TrainingView
              courses={courses}
              gaps={gaps}
              onAddGap={handleAddGap}
              onUpdateGapStatus={handleUpdateGapStatus}
              onUpdateCourseProgress={handleUpdateCourseProgress}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'field' && (
            <FieldView
              pointsOfSale={pointsOfSale}
              visits={visits}
              onSaveVisit={handleSaveVisit}
              onGenerateGapFromVisit={handleAddGap}
            />
          )}

          {currentSection === 'gaps' && (
            <GapsView
              gaps={gaps}
              onAddGap={handleAddGap}
              onUpdateGapStatus={handleUpdateGapStatus}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'knowledge' && (
            <KnowledgeView
              items={knowledge}
              sources={sources}
              onToggleFavorite={handleToggleFavoriteResource}
              onAddSource={handleAddSource}
              onNavigate={handleNavigate}
            />
          )}

          {currentSection === 'copilot' && (
            <CopilotView user={user} onNavigate={handleNavigate} />
          )}

          {currentSection === 'profile' && (
            <ProfileView user={user} kpis={kpis} onLogout={handleLogout} />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (PWA Experience) */}
      <MobileNav
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onOpenMoreMenu={() => setShowMobileMoreDrawer(true)}
      />

      {/* Mobile "More" Drawer Modal */}
      {showMobileMoreDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:hidden bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full bg-white dark:bg-[#0F172A] rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Menú Completo AIDEX 0.7</span>
              <button
                onClick={() => setShowMobileMoreDrawer(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleNavigate('admin')}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <FolderKanban className="w-4 h-4 text-[#1F5E99] dark:text-[#38BDF8]" />
                <span>Administrativo</span>
              </button>

              <button
                onClick={() => handleNavigate('training')}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <GraduationCap className="w-4 h-4 text-[#1F5E99] dark:text-[#38BDF8]" />
                <span>Formación</span>
              </button>

              <button
                onClick={() => handleNavigate('knowledge')}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <BookOpen className="w-4 h-4 text-[#1F5E99] dark:text-[#38BDF8]" />
                <span>Conocimiento</span>
              </button>

              <button
                onClick={() => handleNavigate('profile')}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
              >
                <UserCheck className="w-4 h-4 text-[#1F5E99] dark:text-[#38BDF8]" />
                <span>Mi Perfil</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        courses={courses}
        docs={docs}
        pointsOfSale={pointsOfSale}
        gaps={gaps}
        knowledge={knowledge}
        sources={sources}
      />
    </div>
  );
}
