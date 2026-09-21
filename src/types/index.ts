export type UserRole = 'public' | 'resident' | 'admin' | 'worker';

export type ApartmentStatus = 'healthy' | 'warning' | 'maintenance' | 'offline';

export type TicketStatus = 
  | 'ai_detected'
  | 'awaiting_resident'
  | 'resident_confirmed'
  | 'admin_confirmed'
  | 'worker_assigned'
  | 'worker_accepted'
  | 'worker_en_route'
  | 'work_in_progress'
  | 'work_completed'
  | 'resident_verified'
  | 'false_detection';

export type IssueCategory = 
  | 'Water & Plumbing'
  | 'Electrical & Power'
  | 'HVAC & Climate'
  | 'Appliance'
  | 'Civil & Structure'
  | 'Cleaning & Hygiene'
  | 'Security & Access'
  | 'Other';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface SensorDataPoint {
  time: string;
  value: number;
  unit: string;
}

export interface SensorItem {
  id: string;
  apartmentId: string;
  name: string;
  type: 'water' | 'electrical_voltage' | 'electrical_current' | 'power' | 'temperature' | 'humidity' | 'air_quality' | 'gas';
  location: string;
  currentValue: number;
  unit: string;
  normalMin: number;
  normalMax: number;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  lastUpdated: string;
  batteryLevel?: number;
  history: SensorDataPoint[];
}

export interface AIAlert {
  id: string;
  apartmentId: string;
  sensorId: string;
  sensorName: string;
  issueTitle: string;
  category: IssueCategory;
  detectedAt: string;
  confidence: number;
  readingValue: number;
  normalRange: string;
  unit: string;
  explanation: string;
  modelUsed: 'Random Forest' | 'Isolation Forest' | 'KNN Anomaly' | 'SVM';
  status: 'pending' | 'resident_confirmed' | 'false_detection' | 'ticket_created';
}

export interface MaintenanceTicket {
  ticketId: string; // e.g. PC-2026-00125
  apartmentId: string;
  residentName: string;
  category: IssueCategory;
  problem: string;
  description: string;
  priority: Priority;
  sensorId?: string;
  sensorReading?: string;
  aiConfidence?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  verifiedAt?: string;
  status: TicketStatus;
  workerId?: string;
  workerName?: string;
  workerSkill?: string;
  workerAvatar?: string;
  workerNotes?: string;
  problemFound?: string;
  workPerformed?: string;
  materialsUsed?: string[];
  solutionProvided?: string;
  completionRemarks?: string;
  partsReplaced?: string[];
  repairCost?: number;
  beforeImage?: string;
  afterImage?: string;
  residentRating?: number;
  residentFeedback?: string;
  timeline: {
    status: TicketStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface WorkerProfile {
  id: string;
  name: string;
  role: 'Plumber' | 'Electrician' | 'HVAC Technician' | 'Civil Specialist' | 'General Maintenance';
  specialties: IssueCategory[];
  phone: string;
  email: string;
  rating: number;
  completedTasks: number;
  activeTasks: number;
  isAvailable: boolean;
  shiftStatus?: 'available' | 'on_the_way' | 'working' | 'completed' | 'on_break';
  currentLocation: string;
  avgResponseMins: number;
  avatar: string;
}

export interface ResidentProfile {
  id: string;
  apartmentId: string;
  name: string;
  email: string;
  phone: string;
  pin: string;
  moveInDate: string;
  emergencyContact: string;
}

export interface Apartment {
  id: string; // e.g. "A-302"
  blockId: string; // "A" | "B" | "C"
  floor: number; // 0 to 8
  doorNumber: string; // "302"
  resident: ResidentProfile;
  status: ApartmentStatus;
  sensorSummary: {
    temperature: number;
    humidity: number;
    waterFlow: number;
    powerUsage: number;
    airQuality: number;
  };
  hasActiveAlert: boolean;
  activeAlertId?: string;
  activeTicketId?: string;
  sensors: SensorItem[];
}

export interface Block {
  id: string;
  name: string;
  tagline: string;
  totalFloors: number;
  totalApartments: number;
  healthyCount: number;
  warningCount: number;
  maintenanceCount: number;
  image: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  timeAgo: string;
  type: 'ai_alert' | 'resident_confirm' | 'admin_action' | 'worker_action' | 'verification' | 'false_alert';
  title: string;
  description: string;
  apartmentId?: string;
  ticketId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'ticket' | 'worker' | 'system';
  isRead: boolean;
  targetRole: 'all' | 'resident' | 'admin' | 'worker';
  linkTarget?: {
    role: UserRole;
    tab?: string;
    apartmentId?: string;
    ticketId?: string;
  };
}
