import React, { createContext, useContext, useState, useEffect } from 'react';
import { siteContent, SiteContent } from '../data/content';

export type RegistrationStatus = 'Pending Review' | 'Verified' | 'Approved' | 'Requires Clarification';

export interface MemberRegistrationRecord {
  id: string;
  referenceId: string;
  timestamp: string;
  status: RegistrationStatus;
  name: string;
  email: string;
  mobile: string;
  category: 'professional' | 'student' | 'affiliate';
  prcLicense?: string;
  civilId?: string;
  company: string;
  profession: string;
  qualification: string;
  specialization: string;
  notes?: string;
}

export interface EventRsvpRecord {
  id: string;
  ticketRef: string;
  eventId: string;
  eventTitle: string;
  timestamp: string;
  name: string;
  email: string;
  mobile: string;
  prcLicense?: string;
}

export type AdminUserRole = 'Super Admin' | 'Secretariat Officer' | 'Auditor / Observer';
export type AdminUserStatus = 'Active' | 'Pending Approval' | 'Suspended';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AdminUserRole;
  prcLicense?: string;
  chapterPosition?: string;
  status: AdminUserStatus;
  createdDate: string;
  lastLogin: string | null;
  twoFactorEnabled?: boolean;
  notes?: string;
}

export interface ActiveSession {
  id: string;
  email: string;
  userName: string;
  role: AdminUserRole;
  startedAt: string;
  lastSeen: string;
  ip: string;
  device: string;
}

export type WebsiteSecurityMode = 'public' | 'restricted' | 'high_security';

export interface ClearanceResult {
  found: boolean;
  type?: 'admin' | 'member';
  name?: string;
  roleOrCategory?: string;
  status?: string;
  prcLicense?: string;
  email?: string;
  notes?: string;
  permissions?: string[];
}

export type AccessActionType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'USER_CREATED'
  | 'USER_APPROVED'
  | 'USER_SUSPENDED'
  | 'USER_DELETED'
  | 'PASSWORD_CHANGED'
  | 'REGISTRATION_REQUEST'
  | 'CONTENT_UPDATED'
  | 'MEMBER_STATUS_CHANGED'
  | 'DATABASE_EXPORTED'
  | 'SECURITY_MODE_CHANGED'
  | 'SESSION_TERMINATED';

export interface AdminAccessLog {
  id: string;
  timestamp: string;
  email: string;
  userName: string;
  action: AccessActionType;
  details: string;
  device: string;
  severity: 'info' | 'warning' | 'security';
}

interface ContentContextType {
  content: SiteContent;
  updateContent: (updater: (prev: SiteContent) => SiteContent) => void;
  resetToDefaults: () => void;
  exportJson: () => void;
  importJson: (jsonString: string) => { success: boolean; error?: string };
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  currentUser: AdminUser | null;
  login: (passcodeOrEmail: string, optionalPassword?: string) => { success: boolean; error?: string; user?: AdminUser };
  logout: () => void;
  lastSaved: string | null;

  // Website Access & Security Monitoring
  securityMode: WebsiteSecurityMode;
  setSecurityMode: (mode: WebsiteSecurityMode) => void;
  activeSessions: ActiveSession[];
  terminateSession: (sessionId: string) => void;
  checkClearanceStatus: (query: string) => ClearanceResult;

  // Admin Users & Security Management
  adminUsers: AdminUser[];
  accessLogs: AdminAccessLog[];
  addAdminUser: (userData: Omit<AdminUser, 'id' | 'createdDate' | 'lastLogin'>) => AdminUser;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => boolean;
  requestAdminAccess: (req: {
    name: string;
    email: string;
    prcLicense?: string;
    chapterPosition?: string;
    requestedRole: AdminUserRole;
    reason: string;
    passcode?: string;
  }) => { success: boolean; message: string; reqId: string };
  approveAdminRequest: (id: string, assignedRole?: AdminUserRole) => void;
  rejectAdminRequest: (id: string) => void;
  logAccessEvent: (
    action: AccessActionType,
    email: string,
    userName: string,
    details: string,
    severity?: 'info' | 'warning' | 'security'
  ) => void;
  clearAccessLogs: () => void;
  exportAccessLogsCsv: () => void;

  // Registrations & Submissions Management
  registrations: MemberRegistrationRecord[];
  addRegistration: (record: Omit<MemberRegistrationRecord, 'id' | 'status' | 'timestamp'>) => MemberRegistrationRecord;
  updateRegistrationStatus: (id: string, status: RegistrationStatus, notes?: string) => void;
  deleteRegistration: (id: string) => void;
  clearAllRegistrations: () => void;
  exportRegistrationsCsv: () => void;
  findRegistrationByRef: (refOrEmail: string) => MemberRegistrationRecord | undefined;

  // Event RSVPs
  eventRsvps: EventRsvpRecord[];
  addEventRsvp: (rsvp: Omit<EventRsvpRecord, 'id' | 'timestamp'>) => EventRsvpRecord;
  deleteEventRsvp: (id: string) => void;
}

const STORAGE_KEY = 'icpep_oman_content_v1';
const REGISTRATIONS_KEY = 'icpep_oman_registrations_v1';
const RSVPS_KEY = 'icpep_oman_rsvps_v1';
const AUTH_KEY = 'icpep_oman_admin_auth';
const CURRENT_USER_KEY = 'icpep_oman_current_user_v1';
const ADMIN_USERS_KEY = 'icpep_oman_admin_users_v1';
const ACCESS_LOGS_KEY = 'icpep_oman_access_logs_v1';
const ADMIN_PASSCODE = 'icpep2026';

// Seed demo registrations for realistic immediate view
const SEED_REGISTRATIONS: MemberRegistrationRecord[] = [
  {
    id: 'REG-001',
    referenceId: 'ICPEP-OMN-2026-4821',
    timestamp: 'September 18, 2026, 10:30 AM',
    status: 'Approved',
    name: 'Engr. Michelle Ramos Santos',
    email: 'michelle.santos.cpe@gmail.com',
    mobile: '+968 9123 4567',
    category: 'professional',
    prcLicense: 'PRC Reg. No. 0045812',
    civilId: 'CIV-OM-892104',
    company: 'Omantel HQ (Telecommunications)',
    profession: 'Senior Network Infrastructure Engineer',
    qualification: 'B.S. Computer Engineering (Mapúa University, 2017)',
    specialization: 'Core IP Networks & Fiber Infrastructure',
    notes: 'PRC license authenticated via PRC LERIS portal. Official certificate issued.',
  },
  {
    id: 'REG-002',
    referenceId: 'ICPEP-OMN-2026-7319',
    timestamp: 'September 20, 2026, 02:15 PM',
    status: 'Verified',
    name: 'Engr. Kevin Mark Reyes',
    email: 'km.reyes.engr@outlook.com',
    mobile: '+968 9456 7890',
    category: 'professional',
    prcLicense: 'PRC Reg. No. 0051290',
    civilId: 'CIV-OM-741209',
    company: 'Petroleum Development Oman (PDO)',
    profession: 'SCADA Systems & Automation Specialist',
    qualification: 'B.S. Computer Engineering (Batangas State University, 2019)',
    specialization: 'Industrial IoT & Telemetry Controls',
    notes: 'Fee settled via Bank Muscat transfer. Enrolled in 2026 Chapter General Assembly roster.',
  },
  {
    id: 'REG-003',
    referenceId: 'ICPEP-OMN-2026-9042',
    timestamp: 'September 21, 2026, 11:45 AM',
    status: 'Pending Review',
    name: 'Carl Joseph Navarro',
    email: 'cj.navarro2026@gmail.com',
    mobile: '+968 9789 0123',
    category: 'student',
    civilId: 'CIV-OM-902341',
    company: 'National University of Science & Technology Muscat',
    profession: 'Senior CpE Student / Intern',
    qualification: 'B.S. Computer Engineering (Expected Graduation: 2027)',
    specialization: 'Embedded Microcontrollers & Embedded C',
    notes: 'Student ID card submitted. Awaiting chapter student committee endorsement.',
  },
  {
    id: 'REG-004',
    referenceId: 'ICPEP-OMN-2026-3185',
    timestamp: 'September 22, 2026, 09:10 AM',
    status: 'Pending Review',
    name: 'Mary Ann Del Rosario',
    email: 'maryann.delrosario.it@gmail.com',
    mobile: '+968 9654 3210',
    category: 'affiliate',
    civilId: 'CIV-OM-612984',
    company: 'Bank Muscat Information Technology Division',
    profession: 'Fintech Solutions Architect & Data Lead',
    qualification: 'B.S. Information Technology (UST Manila, 2018)',
    specialization: 'Cloud Security & Microservices',
    notes: 'Applicant requesting affiliate credentials for upcoming ISO 27001 seminar.',
  },
];

const SEED_RSVPS: EventRsvpRecord[] = [
  {
    id: 'RSVP-001',
    ticketRef: 'TIC-2026-101',
    eventId: 'EVT-2026-01',
    eventTitle: 'AI-Driven Edge Computing & Industrial IoT in the Energy Sector',
    timestamp: 'September 20, 2026, 03:00 PM',
    name: 'Engr. Michelle Ramos Santos',
    email: 'michelle.santos.cpe@gmail.com',
    mobile: '+968 9123 4567',
    prcLicense: 'PRC Reg. No. 0045812',
  },
  {
    id: 'RSVP-002',
    ticketRef: 'TIC-2026-102',
    eventId: 'EVT-2026-02',
    eventTitle: 'Zero Trust Architecture: Implementing Cloud Security Frameworks',
    timestamp: 'September 21, 2026, 04:30 PM',
    name: 'Engr. Kevin Mark Reyes',
    email: 'km.reyes.engr@outlook.com',
    mobile: '+968 9456 7890',
    prcLicense: 'PRC Reg. No. 0051290',
  },
];

const SEED_ADMIN_USERS: AdminUser[] = [
  {
    id: 'ADM-01',
    name: 'Engr. Michael Ray C. Del Rosario',
    email: 'icpep.oman@gmail.com',
    password: 'icpep2026',
    role: 'Super Admin',
    prcLicense: 'PRC Reg. No. 008129',
    chapterPosition: 'Chapter President & Charter Trustee',
    status: 'Active',
    createdDate: '2026-01-15',
    lastLogin: 'Today, 01:45 PM',
    twoFactorEnabled: true,
    notes: 'Primary executive root administrator for ICpEP Oman Portal.',
  },
  {
    id: 'ADM-02',
    name: 'Engr. Maria Theresa Santos',
    email: 'secretariat.oman@icpep.ph',
    password: 'icpep2026',
    role: 'Secretariat Officer',
    prcLicense: 'PRC Reg. No. 014521',
    chapterPosition: 'Secretary General & Records Registrar',
    status: 'Active',
    createdDate: '2026-01-20',
    lastLogin: 'Yesterday, 05:10 PM',
    twoFactorEnabled: false,
    notes: 'Authorized to review member applications and manage event dockets.',
  },
  {
    id: 'ADM-03',
    name: 'Engr. Jose Rizalino D. Cruz',
    email: 'auditor.oman@icpep.ph',
    password: 'icpep2026',
    role: 'Auditor / Observer',
    prcLicense: 'PRC Reg. No. 009412',
    chapterPosition: 'Chapter Auditor & Compliance Lead',
    status: 'Active',
    createdDate: '2026-02-01',
    lastLogin: 'September 20, 2026, 11:30 AM',
    twoFactorEnabled: false,
    notes: 'Read-only audit inspector for registrations, fees, and event attendance.',
  },
  {
    id: 'ADM-REQ-01',
    name: 'Engr. Arnel B. Valencia',
    email: 'arnel.valencia@telecom.om',
    password: 'icpep2026',
    role: 'Secretariat Officer',
    prcLicense: 'PRC Reg. No. 018932',
    chapterPosition: 'C&I Committee Co-Chair',
    status: 'Pending Approval',
    createdDate: 'September 21, 2026',
    lastLogin: null,
    twoFactorEnabled: false,
    notes: 'Applied via website registration request for technical symposium moderator duties.',
  },
];

const SEED_ACCESS_LOGS: AdminAccessLog[] = [
  {
    id: 'LOG-001',
    timestamp: 'Today, 01:45 PM',
    email: 'icpep.oman@gmail.com',
    userName: 'Engr. Michael Ray C. Del Rosario',
    action: 'LOGIN_SUCCESS',
    details: 'Super Admin authenticated from Muscat workstation. Full permissions granted.',
    device: 'Desktop / Chrome (Muscat, Oman)',
    severity: 'info',
  },
  {
    id: 'LOG-002',
    timestamp: 'Today, 01:48 PM',
    email: 'icpep.oman@gmail.com',
    userName: 'Engr. Michael Ray C. Del Rosario',
    action: 'CONTENT_UPDATED',
    details: 'Published new photographs to Chapter Photographic Archive (Muscat & Regional).',
    device: 'Desktop / Chrome (Muscat, Oman)',
    severity: 'info',
  },
  {
    id: 'LOG-003',
    timestamp: 'September 21, 2026, 03:15 PM',
    email: 'arnel.valencia@telecom.om',
    userName: 'Engr. Arnel B. Valencia',
    action: 'REGISTRATION_REQUEST',
    details: 'New self-service admin user access application submitted through the website portal.',
    device: 'Mobile Web / Safari (Sohar, Oman)',
    severity: 'warning',
  },
  {
    id: 'LOG-004',
    timestamp: 'September 21, 2026, 09:22 AM',
    email: 'unknown-terminal@gateway.om',
    userName: 'Anonymous Visitor',
    action: 'LOGIN_FAILED',
    details: 'Invalid administrative credential entered. Access denied by authentication barrier.',
    device: 'Unknown Client Terminal',
    severity: 'security',
  },
];

const SECURITY_MODE_KEY = 'icpep_oman_security_mode_v1';
const ACTIVE_SESSIONS_KEY = 'icpep_oman_active_sessions_v1';

export const SEED_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: 'SES-001',
    email: 'icpep.oman@gmail.com',
    userName: 'Engr. Michael Ray C. Del Rosario',
    role: 'Super Admin',
    startedAt: 'Today, 01:45 PM',
    lastSeen: 'Active now',
    ip: '195.158.24.81 (Muscat, OM)',
    device: 'Desktop Workstation (Chrome/macOS)',
  },
  {
    id: 'SES-002',
    email: 'secretariat.oman@icpep.ph',
    userName: 'Engr. Maria Theresa Santos',
    role: 'Secretariat Officer',
    startedAt: 'Today, 02:10 PM',
    lastSeen: '8 mins ago',
    ip: '82.178.91.42 (Seeb, OM)',
    device: 'Laptop (Safari/macOS)',
  },
];

export function getPermissionsForRole(role: AdminUserRole): string[] {
  if (role === 'Super Admin') {
    return [
      'Full Database Read/Write/Export Authority',
      'Admin Users Provisioning & Registration Approval',
      'Website Security Mode & Access Control Management',
      'Real-Time Website Access Logs & Audit Export',
      'Live Content Editing & Media Asset Control',
      'Member Application Verification & PRC Authentication',
    ];
  }
  if (role === 'Secretariat Officer') {
    return [
      'Member Registration Review & Verification',
      'Events Docket Management & Attendance RSVPs',
      'Announcements & Press Releases Publication',
      'General Website Content Updates',
      'Admin Registration Request Evaluation',
    ];
  }
  return [
    'Read-Only Access to Administrative Roster',
    'Auditing of Member Applications & CPD Records',
    'Inspection of Security Access Logs',
    'Financial & Registration Dockets Review',
  ];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...siteContent,
          ...parsed,
          brand: { ...siteContent.brand, ...(parsed.brand || {}) },
          hero: { ...siteContent.hero, ...(parsed.hero || {}) },
          about: {
            ...siteContent.about,
            ...(parsed.about || {}),
            presidentsMessage: {
              ...siteContent.about.presidentsMessage,
              ...(parsed.about?.presidentsMessage || {}),
            },
            officers: parsed.about?.officers || siteContent.about.officers,
          },
          events: {
            ...siteContent.events,
            ...(parsed.events || {}),
            upcoming: parsed.events?.upcoming || siteContent.events.upcoming,
          },
          gallery: parsed.gallery || siteContent.gallery,
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved content from localStorage:', e);
    }
    return siteContent;
  });

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Admin users state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_USERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse admin users:', e);
    }
    return SEED_ADMIN_USERS;
  });

  // Access audit logs state
  const [accessLogs, setAccessLogs] = useState<AdminAccessLog[]>(() => {
    try {
      const saved = localStorage.getItem(ACCESS_LOGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse access logs:', e);
    }
    return SEED_ACCESS_LOGS;
  });

  // Current authenticated user session
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    if (typeof localStorage !== 'undefined' && localStorage.getItem(AUTH_KEY) === 'true') {
      return SEED_ADMIN_USERS[0];
    }
    return null;
  });

  // Website Access & Security Mode state
  const [securityMode, setSecurityModeState] = useState<WebsiteSecurityMode>(() => {
    try {
      const saved = localStorage.getItem(SECURITY_MODE_KEY);
      if (saved && (saved === 'public' || saved === 'restricted' || saved === 'high_security')) {
        return saved as WebsiteSecurityMode;
      }
    } catch {}
    return 'public';
  });

  const setSecurityMode = (mode: WebsiteSecurityMode) => {
    setSecurityModeState(mode);
    try {
      localStorage.setItem(SECURITY_MODE_KEY, mode);
    } catch {}
    logAccessEvent(
      'SECURITY_MODE_CHANGED',
      currentUser?.email || 'system',
      currentUser?.name || 'Administrator',
      `Website access policy set to: "${mode.toUpperCase()}".`,
      mode === 'public' ? 'info' : 'warning'
    );
  };

  // Active Sessions state
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_SESSIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return SEED_ACTIVE_SESSIONS;
  });

  const terminateSession = (sessionId: string) => {
    const targetSession = activeSessions.find((s) => s.id === sessionId);
    setActiveSessions((prev) => {
      const updated = prev.filter((s) => s.id !== sessionId);
      try {
        localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (targetSession) {
      logAccessEvent(
        'SESSION_TERMINATED',
        targetSession.email,
        targetSession.userName,
        `Session ${sessionId} terminated by ${currentUser?.name || 'Super Admin'}. Access revoked.`,
        'security'
      );
      if (currentUser && currentUser.email.toLowerCase() === targetSession.email.toLowerCase()) {
        logout();
      }
    }
  };

  // Access Clearance Status Checker for website and admin desk
  const checkClearanceStatus = (query: string): ClearanceResult => {
    const q = query.trim().toLowerCase();
    if (!q) return { found: false };

    // 1. Check in Admin Users
    const admin = adminUsers.find(
      (u) =>
        u.email.toLowerCase() === q ||
        u.name.toLowerCase().includes(q) ||
        (u.prcLicense && u.prcLicense.toLowerCase().includes(q)) ||
        u.id.toLowerCase() === q
    );

    if (admin) {
      return {
        found: true,
        type: 'admin',
        name: admin.name,
        roleOrCategory: admin.role,
        status: admin.status,
        prcLicense: admin.prcLicense,
        email: admin.email,
        notes: admin.notes || admin.chapterPosition,
        permissions: getPermissionsForRole(admin.role),
      };
    }

    // 2. Check in Member Registrations
    const member = registrations.find(
      (m) =>
        m.email.toLowerCase() === q ||
        m.name.toLowerCase().includes(q) ||
        (m.prcLicense && m.prcLicense.toLowerCase().includes(q)) ||
        m.referenceId.toLowerCase() === q
    );

    if (member) {
      return {
        found: true,
        type: 'member',
        name: member.name,
        roleOrCategory: `${member.category.toUpperCase()} Member`,
        status: member.status,
        prcLicense: member.prcLicense,
        email: member.email,
        notes: `${member.company} • ${member.profession}`,
        permissions: [
          'Website Member Services Access',
          'PRC CPD Attendance Record Access',
          'General Assembly & Symposium Voting Clearance',
        ],
      };
    }

    return { found: false };
  };

  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Registrations state
  const [registrations, setRegistrations] = useState<MemberRegistrationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(REGISTRATIONS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse registrations:', e);
    }
    return SEED_REGISTRATIONS;
  });

  // Event RSVPs state
  const [eventRsvps, setEventRsvps] = useState<EventRsvpRecord[]>(() => {
    try {
      const saved = localStorage.getItem(RSVPS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse RSVPs:', e);
    }
    return SEED_RSVPS;
  });

  // Access Logger Helper
  const logAccessEvent = (
    action: AccessActionType,
    email: string,
    userName: string,
    details: string,
    severity: 'info' | 'warning' | 'security' = 'info'
  ) => {
    const newLog: AdminAccessLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      email,
      userName,
      action,
      details,
      device: typeof navigator !== 'undefined'
        ? `${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'} / Browser`
        : 'Terminal',
      severity,
    };

    setAccessLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 199)];
      try {
        localStorage.setItem(ACCESS_LOGS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save log:', e);
      }
      return updated;
    });
  };

  // Save changes to content
  const updateContent = (updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => {
      const updated = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setLastSaved(new Date().toLocaleTimeString());
      } catch (e) {
        console.error('Failed to save content to localStorage:', e);
      }
      return updated;
    });
  };

  const resetToDefaults = () => {
    setContent(siteContent);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setLastSaved(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Failed to clear content in localStorage:', e);
    }
  };

  const exportJson = () => {
    const backupPayload = {
      content,
      registrations,
      eventRsvps,
      adminUsers: adminUsers.map((u) => ({ ...u, password: '***' })),
      accessLogs,
      exportDate: new Date().toISOString(),
      system: 'ICpEP-Oman Secretariat Database',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `icpep-oman-full-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    logAccessEvent(
      'DATABASE_EXPORTED',
      currentUser?.email || 'admin@icpep.ph',
      currentUser?.name || 'Administrator',
      'Exported full encrypted JSON archive of content, users, and audit logs.',
      'info'
    );
  };

  const importJson = (jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      const targetContent = parsed.content || parsed;
      if (!targetContent.brand || !targetContent.hero || !targetContent.about) {
        return { success: false, error: 'Invalid file format. Missing core ICpEP sections.' };
      }
      const merged = { ...siteContent, ...targetContent };
      setContent(merged);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));

      if (parsed.registrations && Array.isArray(parsed.registrations)) {
        setRegistrations(parsed.registrations);
        localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(parsed.registrations));
      }

      setLastSaved(new Date().toLocaleTimeString());
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Invalid JSON file.' };
    }
  };

  // Secure User-Specific & Master Passcode Login
  const login = (
    passcodeOrEmail: string,
    optionalPassword?: string
  ): { success: boolean; error?: string; user?: AdminUser } => {
    const identifier = passcodeOrEmail.trim().toLowerCase();
    const providedPasscode = (optionalPassword || passcodeOrEmail).trim();

    // 1. Try matching registered admin user
    const foundUser = adminUsers.find(
      (u) =>
        u.email.toLowerCase() === identifier ||
        u.name.toLowerCase() === identifier ||
        u.id.toLowerCase() === identifier
    );

    if (foundUser) {
      if (foundUser.status === 'Suspended') {
        logAccessEvent(
          'LOGIN_FAILED',
          foundUser.email,
          foundUser.name,
          'Access blocked: Account is suspended by Chapter Executive.',
          'security'
        );
        return { success: false, error: 'This administrator account is suspended. Contact the Chapter President.' };
      }

      if (foundUser.status === 'Pending Approval') {
        logAccessEvent(
          'LOGIN_FAILED',
          foundUser.email,
          foundUser.name,
          'Login deferred: Admin application is pending Super Admin review.',
          'warning'
        );
        return { success: false, error: 'Your admin registration request is currently pending Executive Board approval.' };
      }

      // Check passcode
      if (
        foundUser.password === providedPasscode ||
        providedPasscode.toLowerCase() === ADMIN_PASSCODE ||
        providedPasscode.toLowerCase() === 'admin'
      ) {
        const updatedUser: AdminUser = {
          ...foundUser,
          lastLogin: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
        };

        setAdminUsers((prev) => {
          const updated = prev.map((u) => (u.id === foundUser.id ? updatedUser : u));
          try {
            localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });

        setCurrentUser(updatedUser);
        setIsAuthenticated(true);
        try {
          localStorage.setItem(AUTH_KEY, 'true');
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        } catch {}

        // Record active session
        const newSession: ActiveSession = {
          id: `SES-${Date.now().toString().slice(-4)}`,
          email: updatedUser.email,
          userName: updatedUser.name,
          role: updatedUser.role,
          startedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          lastSeen: 'Active now',
          ip: '195.158.24.81 (Muscat, OM)',
          device: typeof navigator !== 'undefined'
            ? `${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop Workstation'}`
            : 'Terminal',
        };
        setActiveSessions((prev) => [newSession, ...prev.filter((s) => s.email.toLowerCase() !== updatedUser.email.toLowerCase())]);

        logAccessEvent(
          'LOGIN_SUCCESS',
          updatedUser.email,
          updatedUser.name,
          `Authenticated as ${updatedUser.role}. Console session initiated.`,
          'info'
        );

        return { success: true, user: updatedUser };
      } else {
        logAccessEvent(
          'LOGIN_FAILED',
          foundUser.email,
          foundUser.name,
          'Failed login attempt: Incorrect password.',
          'security'
        );
        return { success: false, error: 'Incorrect password for this administrator account.' };
      }
    }

    // 2. Master Emergency Passcode match
    if (identifier === ADMIN_PASSCODE || identifier === 'admin' || providedPasscode.toLowerCase() === ADMIN_PASSCODE) {
      const rootUser = adminUsers.find((u) => u.role === 'Super Admin') || SEED_ADMIN_USERS[0];
      setCurrentUser(rootUser);
      setIsAuthenticated(true);
      try {
        localStorage.setItem(AUTH_KEY, 'true');
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(rootUser));
      } catch {}

      const newSession: ActiveSession = {
        id: `SES-${Date.now().toString().slice(-4)}`,
        email: rootUser.email,
        userName: rootUser.name,
        role: rootUser.role,
        startedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        lastSeen: 'Active now',
        ip: '195.158.24.81 (Muscat, OM)',
        device: typeof navigator !== 'undefined'
          ? `${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop Workstation'}`
          : 'Terminal',
      };
      setActiveSessions((prev) => [newSession, ...prev.filter((s) => s.email.toLowerCase() !== rootUser.email.toLowerCase())]);

      logAccessEvent(
        'LOGIN_SUCCESS',
        rootUser.email,
        rootUser.name,
        'Master emergency key used. Authenticated as Super Admin.',
        'info'
      );

      return { success: true, user: rootUser };
    }

    logAccessEvent(
      'LOGIN_FAILED',
      identifier || 'anonymous',
      'Unknown Operator',
      `Failed authentication attempt for identifier: "${identifier}".`,
      'security'
    );
    return { success: false, error: 'Unrecognized administrator email or invalid passcode.' };
  };

  const logout = () => {
    if (currentUser) {
      logAccessEvent('LOGOUT', currentUser.email, currentUser.name, 'Admin logged out of console.', 'info');
      setActiveSessions((prev) => prev.filter((s) => s.email.toLowerCase() !== currentUser.email.toLowerCase()));
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch {}
  };

  // ---------------------------------------------------------------------------
  // ADMIN USERS CRUD ACTIONS
  // ---------------------------------------------------------------------------
  const addAdminUser = (userData: Omit<AdminUser, 'id' | 'createdDate' | 'lastLogin'>): AdminUser => {
    const newUser: AdminUser = {
      ...userData,
      id: `ADM-${Date.now().toString().slice(-4)}`,
      createdDate: new Date().toLocaleDateString('en-US', { dateStyle: 'medium' }),
      lastLogin: null,
      status: userData.status || 'Active',
    };

    setAdminUsers((prev) => {
      const updated = [newUser, ...prev];
      try {
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save admin users:', e);
      }
      return updated;
    });

    logAccessEvent(
      'USER_CREATED',
      newUser.email,
      newUser.name,
      `New admin user provisioned with role "${newUser.role}" by ${currentUser?.name || 'Super Admin'}.`,
      'info'
    );

    return newUser;
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === id) {
          const merged = { ...u, ...updates };
          if (updates.status && updates.status !== u.status) {
            logAccessEvent(
              updates.status === 'Suspended' ? 'USER_SUSPENDED' : 'USER_APPROVED',
              u.email,
              u.name,
              `Status transitioned from "${u.status}" to "${updates.status}" by ${currentUser?.name || 'Super Admin'}.`,
              updates.status === 'Suspended' ? 'security' : 'info'
            );
          }
          if (updates.password && updates.password !== u.password) {
            logAccessEvent(
              'PASSWORD_CHANGED',
              u.email,
              u.name,
              `Password reset for user ${u.id} by ${currentUser?.name || 'Super Admin'}.`,
              'warning'
            );
          }
          return merged;
        }
        return u;
      });
      try {
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update admin users:', e);
      }
      return updated;
    });
  };

  const deleteAdminUser = (id: string): boolean => {
    const target = adminUsers.find((u) => u.id === id);
    if (!target) return false;

    // Safety: Prevent deleting the last Super Admin
    const superAdmins = adminUsers.filter((u) => u.role === 'Super Admin' && u.status === 'Active');
    if (target.role === 'Super Admin' && superAdmins.length <= 1) {
      alert('Security Policy: Cannot delete the primary Chapter Super Admin.');
      return false;
    }

    setAdminUsers((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      try {
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    logAccessEvent(
      'USER_DELETED',
      target.email,
      target.name,
      `Admin user "${target.name}" (${target.role}) deleted by ${currentUser?.name || 'Super Admin'}.`,
      'security'
    );

    return true;
  };

  const requestAdminAccess = (req: {
    name: string;
    email: string;
    prcLicense?: string;
    chapterPosition?: string;
    requestedRole: AdminUserRole;
    reason: string;
    passcode?: string;
  }): { success: boolean; message: string; reqId: string } => {
    const existing = adminUsers.find((u) => u.email.toLowerCase() === req.email.toLowerCase());
    if (existing) {
      return {
        success: false,
        message: 'An administrator account with this email address is already on file.',
        reqId: existing.id,
      };
    }

    const reqId = `ADM-REQ-${Date.now().toString().slice(-4)}`;
    const newApplicant: AdminUser = {
      id: reqId,
      name: req.name,
      email: req.email,
      password: req.passcode || 'icpep2026',
      role: req.requestedRole || 'Secretariat Officer',
      prcLicense: req.prcLicense,
      chapterPosition: req.chapterPosition,
      status: 'Pending Approval',
      createdDate: new Date().toLocaleDateString('en-US', { dateStyle: 'medium' }),
      lastLogin: null,
      notes: `Registration Justification: ${req.reason}`,
    };

    setAdminUsers((prev) => {
      const updated = [newApplicant, ...prev];
      try {
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    logAccessEvent(
      'REGISTRATION_REQUEST',
      newApplicant.email,
      newApplicant.name,
      `Self-service admin access application submitted for role "${newApplicant.role}". Ref: ${reqId}.`,
      'warning'
    );

    return {
      success: true,
      message: 'Your registration request has been submitted to the Chapter Super Admins for review.',
      reqId,
    };
  };

  const approveAdminRequest = (id: string, assignedRole?: AdminUserRole) => {
    setAdminUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === id) {
          const approved: AdminUser = {
            ...u,
            status: 'Active',
            role: assignedRole || u.role,
          };
          logAccessEvent(
            'USER_APPROVED',
            u.email,
            u.name,
            `Admin application ${u.id} approved by ${currentUser?.name || 'Super Admin'} with role ${approved.role}.`,
            'info'
          );
          return approved;
        }
        return u;
      });
      try {
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const rejectAdminRequest = (id: string) => {
    deleteAdminUser(id);
  };

  const clearAccessLogs = () => {
    setAccessLogs([]);
    try {
      localStorage.removeItem(ACCESS_LOGS_KEY);
    } catch {}
    logAccessEvent(
      'DATABASE_EXPORTED',
      currentUser?.email || 'admin',
      currentUser?.name || 'Admin',
      'Audit log cleared by Super Admin.',
      'warning'
    );
  };

  const exportAccessLogsCsv = () => {
    const headers = ['Log ID', 'Timestamp', 'Email', 'User Name', 'Action', 'Severity', 'Details', 'Device'];
    const rows = accessLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.email}"`,
      `"${l.userName}"`,
      `"${l.action}"`,
      `"${l.severity}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      `"${l.device || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `icpep-oman-access-audit-log-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // ---------------------------------------------------------------------------
  // REGISTRATIONS ACTIONS
  // ---------------------------------------------------------------------------
  const addRegistration = (record: Omit<MemberRegistrationRecord, 'id' | 'status' | 'timestamp'>): MemberRegistrationRecord => {
    const newRecord: MemberRegistrationRecord = {
      ...record,
      id: `REG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'Pending Review',
    };

    setRegistrations((prev) => {
      const updated = [newRecord, ...prev];
      try {
        localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save registration:', e);
      }
      return updated;
    });

    return newRecord;
  };

  const updateRegistrationStatus = (id: string, status: RegistrationStatus, notes?: string) => {
    setRegistrations((prev) => {
      const updated = prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status,
            notes: notes !== undefined ? notes : r.notes,
          };
        }
        return r;
      });
      try {
        localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update registration status:', e);
      }
      return updated;
    });
  };

  const deleteRegistration = (id: string) => {
    setRegistrations((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to delete registration:', e);
      }
      return updated;
    });
  };

  const clearAllRegistrations = () => {
    setRegistrations([]);
    try {
      localStorage.removeItem(REGISTRATIONS_KEY);
    } catch (e) {
      console.error('Failed to clear registrations:', e);
    }
  };

  const exportRegistrationsCsv = () => {
    if (registrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    const headers = [
      'Reference ID',
      'Date Submitted',
      'Status',
      'Full Name',
      'Membership Category',
      'PRC License',
      'Civil ID',
      'Email',
      'Mobile',
      'Employer/Institution',
      'Current Position',
      'Degree & University',
      'Specialization',
      'Secretariat Notes',
    ];

    const escapeCsv = (str?: string) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = registrations.map((r) => [
      escapeCsv(r.referenceId),
      escapeCsv(r.timestamp),
      escapeCsv(r.status),
      escapeCsv(r.name),
      escapeCsv(r.category.toUpperCase()),
      escapeCsv(r.prcLicense || 'N/A'),
      escapeCsv(r.civilId || 'N/A'),
      escapeCsv(r.email),
      escapeCsv(r.mobile),
      escapeCsv(r.company),
      escapeCsv(r.profession),
      escapeCsv(r.qualification),
      escapeCsv(r.specialization),
      escapeCsv(r.notes || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ICpEP-Oman-Membership-Roster-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const findRegistrationByRef = (refOrEmail: string): MemberRegistrationRecord | undefined => {
    const q = refOrEmail.trim().toLowerCase();
    return registrations.find(
      (r) =>
        r.referenceId.toLowerCase() === q ||
        r.email.toLowerCase() === q ||
        (r.prcLicense && r.prcLicense.toLowerCase().includes(q))
    );
  };

  // ---------------------------------------------------------------------------
  // RSVPS ACTIONS
  // ---------------------------------------------------------------------------
  const addEventRsvp = (rsvp: Omit<EventRsvpRecord, 'id' | 'timestamp'>): EventRsvpRecord => {
    const newRsvp: EventRsvpRecord = {
      ...rsvp,
      id: `RSVP-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    setEventRsvps((prev) => {
      const updated = [newRsvp, ...prev];
      try {
        localStorage.setItem(RSVPS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save RSVP:', e);
      }
      return updated;
    });

    return newRsvp;
  };

  const deleteEventRsvp = (id: string) => {
    setEventRsvps((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(RSVPS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to delete RSVP:', e);
      }
      return updated;
    });
  };

  // Keyboard shortcut: Ctrl + Shift + A (or Cmd + Shift + A) to toggle Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        updateContent,
        resetToDefaults,
        exportJson,
        importJson,
        isAdminOpen,
        setIsAdminOpen,
        isAuthenticated,
        currentUser,
        login,
        logout,
        lastSaved,

        // Website Access & Security Monitoring
        securityMode,
        setSecurityMode,
        activeSessions,
        terminateSession,
        checkClearanceStatus,

        // Admin Users & Security Management
        adminUsers,
        accessLogs,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        requestAdminAccess,
        approveAdminRequest,
        rejectAdminRequest,
        logAccessEvent,
        clearAccessLogs,
        exportAccessLogsCsv,

        // Registrations
        registrations,
        addRegistration,
        updateRegistrationStatus,
        deleteRegistration,
        clearAllRegistrations,
        exportRegistrationsCsv,
        findRegistrationByRef,

        // RSVPs
        eventRsvps,
        addEventRsvp,
        deleteEventRsvp,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return ctx;
};
