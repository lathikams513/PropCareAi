import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  Block,
  Apartment,
  WorkerProfile,
  MaintenanceTicket,
  AIAlert,
  ActivityEvent,
  NotificationItem,
  TicketStatus,
  IssueCategory,
  Priority
} from '../types';
import {
  INITIAL_BLOCKS,
  INITIAL_WORKERS,
  INITIAL_APARTMENTS,
  INITIAL_AI_ALERTS,
  INITIAL_TICKETS,
  INITIAL_ACTIVITY,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';
import {
  Language,
  getTranslation,
  translateStatus as trStatus,
  translateCategory as trCategory,
  translatePriority as trPriority
} from '../utils/translations';

interface AppContextType {
  userRole: UserRole;
  currentApartmentId: string;
  currentWorkerId: string;
  activeTab: string;
  language: Language;
  t: ReturnType<typeof getTranslation>;
  blocks: Block[];
  apartments: Apartment[];
  workers: WorkerProfile[];
  tickets: MaintenanceTicket[];
  aiAlerts: AIAlert[];
  activity: ActivityEvent[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  isCommandPaletteOpen: boolean;
  isNotificationOpen: boolean;
  selectedApartmentForDrawer: Apartment | null;
  
  // Auth states & methods
  isAdminAuthenticated: boolean;
  isWorkerAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  workerLogin: (workerIdOrName: string, password: string) => boolean;
  workerLogout: () => void;

  // State Setters & Actions
  setUserRole: (role: UserRole) => void;
  setCurrentApartmentId: (id: string) => void;
  setCurrentWorkerId: (id: string) => void;
  setActiveTab: (tab: string) => void;
  setLanguage: (lang: Language) => void;
  translateStatus: (status: string, lang?: Language) => string;
  translateCategory: (category: string, lang?: Language) => string;
  translatePriority: (priority: string, lang?: Language) => string;
  setIsCommandPaletteOpen: (open: boolean) => void;
  setIsNotificationOpen: (open: boolean) => void;
  setSelectedApartmentForDrawer: (apt: Apartment | null) => void;
  
  // Business Logic Workflows
  confirmAiAlert: (alertId: string, isProblem: boolean, note?: string) => void;
  createManualTicket: (data: {
    apartmentId: string;
    category: IssueCategory;
    problem: string;
    description: string;
    priority: Priority;
    photoUrl?: string;
  }) => string;
  adminConfirmTicket: (ticketId: string) => void;
  assignWorkerToTicket: (ticketId: string, workerId: string) => void;
  rejectWorkerJob: (ticketId: string, reason?: string) => void;
  updateWorkerJobStatus: (
    ticketId: string,
    status: TicketStatus,
    completionPayload?: {
      notes?: string;
      problemFound?: string;
      workPerformed?: string;
      materialsUsed?: string[];
      solutionProvided?: string;
      completionRemarks?: string;
      parts?: string[];
      cost?: number;
      beforeImage?: string;
      afterImage?: string;
    }
  ) => void;
  updateWorkerShiftStatus: (workerId: string, status: 'available' | 'on_the_way' | 'working' | 'completed' | 'on_break') => void;
  verifyTicketCompletion: (ticketId: string, rating: number, feedback: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('public');
  const [currentApartmentId, setCurrentApartmentId] = useState<string>('A-302');
  const [currentWorkerId, setCurrentWorkerId] = useState<string>('WRK-102');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('propcare_lang');
      if (saved === 'ta' || saved === 'en') return saved;
    } catch (e) {
      // ignore
    }
    return 'en';
  });

  // Admin & Worker Authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('propcare_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [isWorkerAuthenticated, setIsWorkerAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('propcare_worker_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  const adminLogin = (password: string): boolean => {
    const validPasswords = ['admin123', 'admin', 'propcare2026', 'admin@propcare'];
    if (validPasswords.includes(password.trim())) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('propcare_admin_auth', 'true');
      } catch (e) {}
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('propcare_admin_auth');
    } catch (e) {}
  };

  const workerLogin = (workerIdOrName: string, password: string): boolean => {
    const validPasswords = ['worker123', 'worker', 'pass123', 'ravi123', 'suresh123', 'priya123', 'rajesh123'];
    if (validPasswords.includes(password.trim())) {
      // Find matching worker by id or name if provided
      const matchedWorker = workers.find(
        (w) => w.id.toLowerCase() === workerIdOrName.toLowerCase() || w.name.toLowerCase().includes(workerIdOrName.toLowerCase())
      );
      if (matchedWorker) {
        setCurrentWorkerId(matchedWorker.id);
      } else if (workerIdOrName.trim()) {
        setCurrentWorkerId(workerIdOrName.trim());
      }
      setIsWorkerAuthenticated(true);
      try {
        sessionStorage.setItem('propcare_worker_auth', 'true');
      } catch (e) {}
      return true;
    }
    return false;
  };

  const workerLogout = () => {
    setIsWorkerAuthenticated(false);
    try {
      sessionStorage.removeItem('propcare_worker_auth');
    } catch (e) {}
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('propcare_lang', lang);
    } catch (e) {
      // ignore
    }
  };

  const t = getTranslation(language);
  const translateStatus = (status: string, lang?: Language) => trStatus(status, lang || language);
  const translateCategory = (category: string, lang?: Language) => trCategory(category, lang || language);
  const translatePriority = (priority: string, lang?: Language) => trPriority(priority, lang || language);
  
  const [blocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [apartments, setApartments] = useState<Apartment[]>(INITIAL_APARTMENTS);
  const [workers, setWorkers] = useState<WorkerProfile[]>(INITIAL_WORKERS);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [aiAlerts, setAiAlerts] = useState<AIAlert[]>(INITIAL_AI_ALERTS);
  const [activity, setActivity] = useState<ActivityEvent[]>(INITIAL_ACTIVITY);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedApartmentForDrawer, setSelectedApartmentForDrawer] = useState<Apartment | null>(null);

  // Live IoT Simulation Loop: Subtle sensor jitter every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setApartments((prevApts) =>
        prevApts.map((apt) => {
          // slight jitter
          const tempDelta = +(Math.random() * 0.2 - 0.1).toFixed(1);
          const waterDelta = +(Math.random() * 0.1 - 0.05).toFixed(1);
          const powerDelta = +(Math.random() * 0.04 - 0.02).toFixed(2);
          
          const newSensors = apt.sensors.map((s) => {
            let newVal = s.currentValue;
            if (s.type === 'temperature') newVal = +(s.currentValue + tempDelta).toFixed(1);
            if (s.type === 'water' && !apt.hasActiveAlert) newVal = Math.max(0, +(s.currentValue + waterDelta).toFixed(1));
            if (s.type === 'power') newVal = Math.max(0.2, +(s.currentValue + powerDelta).toFixed(2));
            return {
              ...s,
              currentValue: newVal,
              lastUpdated: 'Just now'
            };
          });

          return {
            ...apt,
            sensorSummary: {
              ...apt.sensorSummary,
              temperature: +(apt.sensorSummary.temperature + tempDelta).toFixed(1),
              waterFlow: apt.hasActiveAlert ? apt.sensorSummary.waterFlow : Math.max(0, +(apt.sensorSummary.waterFlow + waterDelta).toFixed(1)),
              powerUsage: Math.max(0.2, +(apt.sensorSummary.powerUsage + powerDelta).toFixed(2))
            },
            sensors: newSensors
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  // Workflow: Resident Confirms / Rejects AI Alert
  const confirmAiAlert = (alertId: string, isProblem: boolean, note?: string) => {
    const alert = aiAlerts.find((a) => a.id === alertId);
    if (!alert) return;

    if (isProblem) {
      // Step: Resident Confirmed -> Create or link ticket
      setAiAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'resident_confirmed' } : a))
      );

      // Check if ticket already exists or create new one
      const existingTicket = tickets.find((t) => t.apartmentId === alert.apartmentId && t.status !== 'resident_verified');
      if (existingTicket) {
        setTickets((prev) =>
          prev.map((t) =>
            t.ticketId === existingTicket.ticketId
              ? {
                  ...t,
                  status: 'resident_confirmed',
                  timeline: [
                    ...t.timeline,
                    { status: 'resident_confirmed', timestamp: 'Just now', note: note || 'Resident confirmed problem' }
                  ]
                }
              : t
          )
        );
      } else {
        const newTicketId = `PC-2026-00${Math.floor(130 + Math.random() * 800)}`;
        const apt = apartments.find((a) => a.id === alert.apartmentId);
        const newTicket: MaintenanceTicket = {
          ticketId: newTicketId,
          apartmentId: alert.apartmentId,
          residentName: apt?.resident.name || 'Resident',
          category: alert.category,
          problem: alert.issueTitle,
          description: `${alert.explanation}. ${note || 'Resident confirmed anomaly.'}`,
          priority: 'high',
          sensorId: alert.sensorId,
          sensorReading: `${alert.readingValue} ${alert.unit} (Normal: ${alert.normalRange})`,
          aiConfidence: alert.confidence,
          createdAt: 'Just now',
          updatedAt: 'Just now',
          status: 'resident_confirmed',
          timeline: [
            { status: 'ai_detected', timestamp: alert.detectedAt, note: `AI flagged ${alert.issueTitle} (${alert.confidence}%)` },
            { status: 'resident_confirmed', timestamp: 'Just now', note: note || 'Resident confirmed anomaly via mobile HUD' }
          ]
        };
        setTickets((prev) => [newTicket, ...prev]);
      }

      // Add to Activity Stream
      const newAct: ActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestamp: 'Just now',
        timeAgo: 'Just now',
        type: 'resident_confirm',
        title: 'Resident Confirmed Issue',
        description: `${alert.apartmentId}: ${alert.issueTitle} confirmed by resident. Work order awaiting Admin verification.`,
        apartmentId: alert.apartmentId
      };
      setActivity((prev) => [newAct, ...prev]);

      // Push Notification to Admin
      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        title: `Resident Confirmed Alert (${alert.apartmentId})`,
        message: `${alert.issueTitle} was confirmed by resident. Please verify and assign a technician.`,
        timestamp: 'Just now',
        type: 'alert',
        isRead: false,
        targetRole: 'admin',
        linkTarget: { role: 'admin', tab: 'maintenance', apartmentId: alert.apartmentId }
      };
      setNotifications((prev) => [newNotif, ...prev]);
    } else {
      // Step: False Detection!
      setAiAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'false_detection' } : a))
      );

      // Restore apartment status
      setApartments((prev) =>
        prev.map((a) => (a.id === alert.apartmentId ? { ...a, status: 'healthy', hasActiveAlert: false } : a))
      );

      // Add to Activity
      const newAct: ActivityEvent = {
        id: `ACT-${Date.now()}`,
        timestamp: 'Just now',
        timeAgo: 'Just now',
        type: 'false_alert',
        title: 'False Detection Recorded',
        description: `Resident in ${alert.apartmentId} verified normal usage for ${alert.issueTitle}. Retraining model weights.`,
        apartmentId: alert.apartmentId
      };
      setActivity((prev) => [newAct, ...prev]);
    }
  };

  // Workflow: Resident Reports Problem Manually
  const createManualTicket = (data: {
    apartmentId: string;
    category: IssueCategory;
    problem: string;
    description: string;
    priority: Priority;
    photoUrl?: string;
  }): string => {
    const newTicketId = `PC-2026-00${Math.floor(130 + Math.random() * 800)}`;
    const apt = apartments.find((a) => a.id === data.apartmentId);
    
    const newTicket: MaintenanceTicket = {
      ticketId: newTicketId,
      apartmentId: data.apartmentId,
      residentName: apt?.resident.name || 'Resident',
      category: data.category,
      problem: data.problem,
      description: data.description,
      priority: data.priority,
      createdAt: 'Just now',
      updatedAt: 'Just now',
      status: 'resident_confirmed',
      beforeImage: data.photoUrl,
      timeline: [
        { status: 'resident_confirmed', timestamp: 'Just now', note: `Manual report submitted by resident (${data.priority.toUpperCase()} priority)` }
      ]
    };

    setTickets((prev) => [newTicket, ...prev]);

    // Update apartment status to warning
    setApartments((prev) =>
      prev.map((a) => (a.id === data.apartmentId ? { ...a, status: 'warning', activeTicketId: newTicketId } : a))
    );

    // Activity Stream
    const newAct: ActivityEvent = {
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      timeAgo: 'Just now',
      type: 'resident_confirm',
      title: 'Manual Problem Reported',
      description: `${data.apartmentId}: ${data.problem} reported by resident.`,
      apartmentId: data.apartmentId,
      ticketId: newTicketId
    };
    setActivity((prev) => [newAct, ...prev]);

    // Notification to Admin
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `New Problem Reported: ${data.apartmentId}`,
      message: `${data.problem} (${data.category}) marked ${data.priority.toUpperCase()} priority.`,
      timestamp: 'Just now',
      type: 'ticket',
      isRead: false,
      targetRole: 'admin',
      linkTarget: { role: 'admin', tab: 'maintenance', ticketId: newTicketId }
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newTicketId;
  };

  // Workflow: Admin Confirms Ticket
  const adminConfirmTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.ticketId === ticketId
          ? {
              ...t,
              status: 'admin_confirmed',
              updatedAt: 'Just now',
              timeline: [
                ...t.timeline,
                { status: 'admin_confirmed', timestamp: 'Just now', note: 'Property Manager verified priority and work authorization' }
              ]
            }
          : t
      )
    );

    const act: ActivityEvent = {
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      timeAgo: 'Just now',
      type: 'admin_action',
      title: 'Work Order Verified',
      description: `Property Manager authorized Ticket ${ticketId}`,
      ticketId
    };
    setActivity((prev) => [act, ...prev]);
  };

  // Workflow: Admin / AI Assigns Worker
  const assignWorkerToTicket = (ticketId: string, workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.ticketId === ticketId
          ? {
              ...t,
              status: 'worker_assigned',
              workerId: worker.id,
              workerName: worker.name,
              workerSkill: worker.role,
              workerAvatar: worker.avatar,
              updatedAt: 'Just now',
              timeline: [
                ...t.timeline,
                {
                  status: 'worker_assigned',
                  timestamp: 'Just now',
                  note: `Assigned to ${worker.name} (${worker.role}) via Intelligent AI Matcher`
                }
              ]
            }
          : t
      )
    );

    // Update worker's active tasks
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, activeTasks: w.activeTasks + 1 } : w))
    );

    // Activity Stream
    const act: ActivityEvent = {
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      timeAgo: 'Just now',
      type: 'admin_action',
      title: 'Technician Assigned',
      description: `${worker.name} assigned to ${ticketId}`,
      ticketId
    };
    setActivity((prev) => [act, ...prev]);

    // Push notification to worker & resident
    const notifWorker: NotificationItem = {
      id: `NOTIF-${Date.now()}-W`,
      title: 'New Task Assignment',
      message: `You have been assigned to Ticket ${ticketId}. Please review and accept.`,
      timestamp: 'Just now',
      type: 'worker',
      isRead: false,
      targetRole: 'worker',
      linkTarget: { role: 'worker', ticketId }
    };
    const notifResident: NotificationItem = {
      id: `NOTIF-${Date.now()}-R`,
      title: 'Technician Dispatched',
      message: `${worker.name} (${worker.role}) has been assigned to your service request.`,
      timestamp: 'Just now',
      type: 'ticket',
      isRead: false,
      targetRole: 'resident',
      linkTarget: { role: 'resident', tab: 'maintenance', ticketId }
    };
    setNotifications((prev) => [notifWorker, notifResident, ...prev]);
  };

  // Workflow: Worker Rejects / Declines Job
  const rejectWorkerJob = (ticketId: string, reason?: string) => {
    const targetTicket = tickets.find((t) => t.ticketId === ticketId);
    const workerName = targetTicket?.workerName || 'Technician';
    const prevWorkerId = targetTicket?.workerId;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.ticketId !== ticketId) return t;
        return {
          ...t,
          status: 'admin_confirmed',
          workerId: undefined,
          workerName: undefined,
          workerSkill: undefined,
          workerAvatar: undefined,
          updatedAt: 'Just now',
          timeline: [
            ...t.timeline,
            {
              status: 'admin_confirmed',
              timestamp: 'Just now',
              note: `${workerName} declined task${reason ? `: "${reason}"` : ''}. Returned to dispatch queue.`
            }
          ]
        };
      })
    );

    if (prevWorkerId) {
      setWorkers((prev) =>
        prev.map((w) => (w.id === prevWorkerId ? { ...w, activeTasks: Math.max(0, w.activeTasks - 1) } : w))
      );
    }

    const act: ActivityEvent = {
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      timeAgo: 'Just now',
      type: 'worker_action',
      title: 'Task Declined by Technician',
      description: `${workerName} declined Ticket ${ticketId}. Needs re-dispatch.`,
      ticketId
    };
    setActivity((prev) => [act, ...prev]);

    const notifAdmin: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Task Declined (${ticketId})`,
      message: `${workerName} declined the service assignment. Please reassign.`,
      timestamp: 'Just now',
      type: 'alert',
      isRead: false,
      targetRole: 'admin',
      linkTarget: { role: 'admin', tab: 'maintenance', ticketId }
    };
    setNotifications((prev) => [notifAdmin, ...prev]);
  };

  // Workflow: Worker Progresses Task (Accept -> Travel -> Arrive -> In Progress -> Complete)
  const updateWorkerJobStatus = (
    ticketId: string,
    status: TicketStatus,
    completionPayload?: {
      notes?: string;
      problemFound?: string;
      workPerformed?: string;
      materialsUsed?: string[];
      solutionProvided?: string;
      completionRemarks?: string;
      parts?: string[];
      cost?: number;
      beforeImage?: string;
      afterImage?: string;
    }
  ) => {
    let noteText = '';
    if (status === 'worker_accepted') noteText = 'Technician accepted the service call';
    if (status === 'worker_en_route') noteText = 'Technician is en route with required tooling';
    if (status === 'work_in_progress') noteText = 'Technician arrived and work is currently in progress';
    if (status === 'work_completed') noteText = 'Technician marked repair complete. Awaiting resident verification.';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.ticketId !== ticketId) return t;

        const updated: MaintenanceTicket = {
          ...t,
          status,
          updatedAt: 'Just now',
          completedAt: status === 'work_completed' ? 'Just now' : t.completedAt,
          workerNotes: completionPayload?.notes || t.workerNotes,
          problemFound: completionPayload?.problemFound || t.problemFound,
          workPerformed: completionPayload?.workPerformed || t.workPerformed,
          materialsUsed: completionPayload?.materialsUsed || t.materialsUsed,
          solutionProvided: completionPayload?.solutionProvided || t.solutionProvided,
          completionRemarks: completionPayload?.completionRemarks || t.completionRemarks,
          partsReplaced: completionPayload?.parts || completionPayload?.materialsUsed || t.partsReplaced,
          repairCost: completionPayload?.cost ?? t.repairCost,
          beforeImage: completionPayload?.beforeImage || t.beforeImage,
          afterImage: completionPayload?.afterImage || t.afterImage,
          timeline: [
            ...t.timeline,
            {
              status,
              timestamp: 'Just now',
              note: completionPayload?.notes
                ? `${noteText}: ${completionPayload.notes}`
                : completionPayload?.solutionProvided
                ? `${noteText} (${completionPayload.solutionProvided})`
                : noteText
            }
          ]
        };
        return updated;
      })
    );

    // Update apartment status to maintenance
    const targetTicket = tickets.find((t) => t.ticketId === ticketId);
    if (targetTicket) {
      if (status === 'work_in_progress') {
        setApartments((prev) =>
          prev.map((a) => (a.id === targetTicket.apartmentId ? { ...a, status: 'maintenance' } : a))
        );
      }
    }

    // Activity Stream
    const act: ActivityEvent = {
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      timeAgo: 'Just now',
      type: 'worker_action',
      title: `Worker Status: ${status.replace('_', ' ').toUpperCase()}`,
      description: `${ticketId} updated by technician.`,
      ticketId
    };
    setActivity((prev) => [act, ...prev]);

    // Push notification to resident
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Service Update (${ticketId})`,
      message: noteText,
      timestamp: 'Just now',
      type: 'worker',
      isRead: false,
      targetRole: 'resident',
      linkTarget: { role: 'resident', tab: 'maintenance', ticketId }
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Workflow: Resident Verifies Completion & Submits Feedback
  const verifyTicketCompletion = (ticketId: string, rating: number, feedback: string) => {
    const targetTicket = tickets.find((t) => t.ticketId === ticketId);

    setTickets((prev) =>
      prev.map((t) =>
        t.ticketId === ticketId
          ? {
              ...t,
              status: 'resident_verified',
              verifiedAt: 'Just now',
              residentRating: rating,
              residentFeedback: feedback,
              timeline: [
                ...t.timeline,
                {
                  status: 'resident_verified',
                  timestamp: 'Just now',
                  note: `Resident confirmed completion with ${rating}★ rating: "${feedback}"`
                }
              ]
            }
          : t
      )
    );

    // Restore apartment to healthy & clear active alert
    if (targetTicket) {
      setApartments((prev) =>
        prev.map((a) =>
          a.id === targetTicket.apartmentId
            ? {
                ...a,
                status: 'healthy',
                hasActiveAlert: false,
                activeTicketId: undefined,
                sensorSummary: {
                  ...a.sensorSummary,
                  waterFlow: 4.5,
                  powerUsage: 1.2
                },
                sensors: a.sensors.map((s) => ({
                  ...s,
                  status: 'normal',
                  currentValue: s.type === 'water' ? 4.5 : s.type === 'power' ? 1.2 : s.currentValue
                }))
              }
            : a
        )
      );

      // Decrement worker active tasks and increment completed
      if (targetTicket.workerId) {
        setWorkers((prev) =>
          prev.map((w) =>
            w.id === targetTicket.workerId
              ? {
                  ...w,
                  activeTasks: Math.max(0, w.activeTasks - 1),
                  completedTasks: w.completedTasks + 1
                }
              : w
          )
        );
      }
    }

    // Activity Stream
    const act: ActivityEvent = {
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      timeAgo: 'Just now',
      type: 'verification',
      title: 'Ticket Closed & Resident Verified',
      description: `Ticket ${ticketId} officially completed and verified with ${rating} stars!`,
      ticketId
    };
    setActivity((prev) => [act, ...prev]);

    // Push notification to admin
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `Repair Verified (${ticketId})`,
      message: `Resident approved completion with ${rating}★ rating. Ticket closed.`,
      timestamp: 'Just now',
      type: 'ticket',
      isRead: false,
      targetRole: 'admin',
      linkTarget: { role: 'admin', tab: 'maintenance', ticketId }
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateWorkerShiftStatus = (workerId: string, status: 'available' | 'on_the_way' | 'working' | 'completed' | 'on_break') => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, shiftStatus: status, isAvailable: status === 'available' } : w))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        currentApartmentId,
        currentWorkerId,
        activeTab,
        language,
        t,
        translateStatus,
        translateCategory,
        translatePriority,
        blocks,
        apartments,
        workers,
        tickets,
        aiAlerts,
        activity,
        notifications,
        unreadNotificationCount,
        isCommandPaletteOpen,
        isNotificationOpen,
        selectedApartmentForDrawer,
        isAdminAuthenticated,
        isWorkerAuthenticated,
        adminLogin,
        adminLogout,
        workerLogin,
        workerLogout,
        setUserRole,
        setCurrentApartmentId,
        setCurrentWorkerId,
        setActiveTab,
        setLanguage,
        setIsCommandPaletteOpen,
        setIsNotificationOpen,
        setSelectedApartmentForDrawer,
        confirmAiAlert,
        createManualTicket,
        adminConfirmTicket,
        assignWorkerToTicket,
        rejectWorkerJob,
        updateWorkerJobStatus,
        updateWorkerShiftStatus,
        verifyTicketCompletion,
        markNotificationRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
