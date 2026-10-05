export type NavSection =
  | 'dashboard'
  | 'admin'
  | 'journey'
  | 'training'
  | 'field'
  | 'gaps'
  | 'knowledge'
  | 'copilot'
  | 'profile';

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  region: string;
  employeeCode: string;
  email: string;
  initials: string;
  avatarUrl?: string;
  level: string;
  xpPoints: number;
  streakDays: number;
  joinedDate: string;
}

export interface KPIStats {
  trainingProgress: number; // 68%
  pendingTasks: number; // 5
  completedCourses: number; // 7
  totalCourses: number; // 10
  consultedResources: number; // 42
  openGaps: number; // 3
  closedGaps: number; // 12
  completedVisits: number; // 45
  monthlySalesGoal: number; // $150,000
  currentSales: number; // $118,500
}

export interface MonthlyGoalItem {
  id: string;
  title: string;
  target: string;
  current: string;
  progress: number;
  deadline: string;
  category: 'Ventas' | 'Cobertura' | 'Activaciones' | 'Calidad';
}

export interface WeeklyPlanSharePoint {
  id: string;
  weekName: string;
  period: string;
  sharePointUrl: string;
  status: 'Activa' | 'Completada' | 'Próxima';
  summary: string;
  documents: Array<{ title: string; type: string; size: string; directUrl: string }>;
  keyPriorities: string[];
}

export interface AssignedMarathon {
  id: string;
  title: string;
  date: string;
  targetSales: string;
  achievedSales: string;
  progress: number;
  incentive: string;
  status: 'En curso' | 'Próxima' | 'Finalizada';
  assignedExec: string;
  description: string;
  rules: string[];
}

export interface AssignedPreturno {
  id: string;
  title: string;
  date: string;
  time: string;
  leader: string;
  focusTopic: string;
  status: 'Pendiente' | 'Completado';
  checklistConfirmed: boolean;
  takeaways: string[];
}

export interface TrainingMeshModule {
  id: string;
  weekNumber: number;
  dayNumber: number;
  topic: string;
  hours: number;
  modality: 'Virtual' | 'Presencial' | 'Campo';
  evaluationType: 'Quiz' | 'Roleplay' | 'Auditoría';
}

export interface TrainingMesh {
  id: string;
  name: string;
  roleTarget: string;
  description: string;
  totalWeeks: number;
  totalHours: number;
  modules: TrainingMeshModule[];
  createdAt: string;
}

export interface SharePointDoc {
  id: string;
  title: string;
  category: 'Tarifarios' | 'Portafolio' | 'Políticas' | 'Argumentarios';
  fileType: 'PDF' | 'XLSX' | 'DOCX' | 'PPTX';
  fileSize: string;
  updatedAt: string;
  description: string;
  content: string;
}

export interface MeetingMinute {
  id: string;
  title: string;
  sessionCode: string;
  date: string;
  facilitator: string;
  agreements: Array<{
    id: string;
    text: string;
    responsible: string;
    deadline: string;
    completed: boolean;
  }>;
  summary: string;
}

export interface MeetingRecording {
  id: string;
  title: string;
  date: string;
  duration: string;
  speaker: string;
  category: string;
  summary: string;
  keyTopics: string[];
}

export interface DayChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  completedAt?: string;
}

export interface TrainingLesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  content: string;
  summaryKeyPoints: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  progress: number;
  status: 'completed' | 'in_progress' | 'pending' | 'locked';
  duration: string;
  materialsCount: number;
  badgeName: string;
  badgeIcon: string;
  lessons: TrainingLesson[];
  quiz?: {
    title: string;
    questions: QuizQuestion[];
  };
}

export type FieldChannelType = 'pdv' | 'street_agents' | 'islands';

export interface PointOfSale {
  id: string;
  name: string;
  channel: FieldChannelType;
  city: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  coordinates: { x: number; y: number }; // Percentage for interactive map
  status: 'visited' | 'pending' | 'in_route';
  lastVisitDate: string;
  salesTargetAchieved: number; // percentage
  supervisor: string;
}

export interface AuditChecklist {
  offerVisible: boolean;
  popUpdated: boolean;
  advisorKnowledge: boolean;
  kpisReviewed: boolean;
  findingsIdentified: boolean;
}

export interface VisitRecord {
  id: string;
  posId: string;
  posName: string;
  channel: FieldChannelType;
  city: string;
  date: string;
  responsible: string;
  audit: AuditChecklist;
  photos: string[];
  observations: string;
  score: number;
  status: 'borrador' | 'enviada';
  generatedGapId?: string;
}

export type GapCategory =
  | 'Venta'
  | 'Abordaje'
  | 'Objeciones'
  | 'Cierre'
  | 'Producto'
  | 'Servicio'
  | 'Herramientas'
  | 'Indicadores';

export type GapStatus = 'En curso' | 'Vencida' | 'Cerrada';

export interface GapItem {
  id: string;
  title: string;
  category: GapCategory;
  responsible: string;
  actionRequired: string;
  deadline: string;
  status: GapStatus;
  relatedPosName?: string;
  recommendedCourse?: string;
  recommendedResource?: string;
  notes?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  category: 'Videos' | 'Manuales' | 'Presentaciones' | 'Campañas' | 'FAQs' | 'Casos de éxito' | 'Procedimientos';
  readTime: string;
  isFeatured?: boolean;
  isRecommended?: boolean;
  tags: string[];
  content: string;
  actionType: 'leer' | 'video' | 'descargar';
  rating?: number;
  favorite?: boolean;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  url: string;
  category: 'SharePoint' | 'Teams' | 'OneDrive' | 'Intranet' | 'Regulador' | 'Externo';
  description: string;
  updatedAt: string;
  isOfficial?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionTarget?: {
    section: NavSection;
    label: string;
    subId?: string;
  };
}
