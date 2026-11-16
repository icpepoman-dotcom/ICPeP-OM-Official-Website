import React, { useState, useRef } from 'react';
import { useContent, AdminUserRole } from '../context/ContentContext';
import { RegistrationsManager } from './RegistrationsManager';
import { MediaManager } from './MediaManager';
import { AdminUsersManager } from './AdminUsersManager';
import { GitHubPublisherManager } from './GitHubPublisherManager';
import {
  X,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Lock,
  Eye,
  Sliders,
  AlertTriangle,
  FolderTree,
  Building,
  Calendar,
  BookOpen,
  Award,
  Users,
  HelpCircle,
  Mail,
  FileCode,
  UserCheck,
  Image as ImageIcon,
  ShieldCheck,
  UserPlus,
  LogOut,
  CheckCircle2,
  Key,
  FolderGit2,
  Github,
  UploadCloud,
} from 'lucide-react';
import { Officer, UpcomingEvent, PastEvent, DevTrack, PartnerItem, Announcement, FAQItem } from '../data/content';

export const AdminPanel: React.FC = () => {
  const {
    content,
    updateContent,
    resetToDefaults,
    exportJson,
    importJson,
    isAdminOpen,
    setIsAdminOpen,
    isAuthenticated,
    isVaultConfigured,
    currentUser,
    adminUsers,
    initializeAdminVault,
    login,
    logout,
    lastSaved,
    registrations,
    requestAdminAccess,
  } = useContent();

  const [activeTab, setActiveTab] = useState<string>('admin-users');
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication barrier state
  const [loginMode, setLoginMode] = useState<'signin' | 'register'>('signin');
  const [loginEmail, setLoginEmail] = useState('icpep.oman@gmail.com');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);

  // Self-service admin registration request form state
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqPrc, setReqPrc] = useState('');
  const [reqPosition, setReqPosition] = useState('');
  const [reqRole, setReqRole] = useState<AdminUserRole>('Secretariat Officer');
  const [reqPasscode, setReqPasscode] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [reqError, setReqError] = useState<string | null>(null);
  const [reqSuccessDossier, setReqSuccessDossier] = useState<string | null>(null);

  if (!isAdminOpen) return null;

  // Authentication barrier
  if (!isAuthenticated) {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setLoginErrorMessage(null);

      if (!isVaultConfigured) {
        if (loginPasscode.trim().length < 6) {
          setLoginErrorMessage('Security passphrase must be at least 6 characters.');
          return;
        }
        if (loginPasscode !== confirmPasscode) {
          setLoginErrorMessage('Passphrase confirmation does not match.');
          return;
        }
        const res = initializeAdminVault(loginEmail, loginPasscode);
        if (!res.success) {
          setLoginErrorMessage(res.error || 'Unable to initialize administrator vault.');
        }
        return;
      }

      const res = login(loginEmail, loginPasscode);
      if (!res.success) {
        setLoginErrorMessage(res.error || 'Authentication rejected. Verify your credentials.');
      }
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setReqError(null);

      if (!reqName.trim() || !reqEmail.trim() || !reqReason.trim()) {
        setReqError('Please complete Name, Official Email, and Justification.');
        return;
      }

      if (reqPasscode.trim().length < 6) {
        setReqError('Please choose a security passcode of at least 6 characters.');
        return;
      }

      const res = requestAdminAccess({
        name: reqName.trim(),
        email: reqEmail.trim().toLowerCase(),
        prcLicense: reqPrc.trim() || undefined,
        chapterPosition: reqPosition.trim() || undefined,
        requestedRole: reqRole,
        reason: reqReason.trim(),
        passcode: reqPasscode.trim(),
      });

      if (!res.success) {
        setReqError(res.message);
      } else {
        setReqSuccessDossier(res.reqId);
      }
    };

    return (
      <div className="fixed inset-0 z-50 bg-[#12203A]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 text-left">
        <div className="bg-[#F6F6F2] border-2 border-[#12203A] max-w-lg w-full p-5 sm:p-7 shadow-2xl relative max-h-[95vh] overflow-y-auto">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-4 right-4 p-1 hover:bg-[#EEEEE7] border border-[#CDCDC0] text-[#12203A]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Console Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-[#12203A] text-[#C99A2E]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider block">
                Executive Portal • ICpEP Oman Chapter
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#12203A]">
                Secretariat Access Console
              </h3>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-[#EEEEE7] p-1 border border-[#CDCDC0] mb-4">
            <button
              type="button"
              onClick={() => {
                setLoginMode('signin');
                setLoginErrorMessage(null);
              }}
              className={`py-2 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
                loginMode === 'signin'
                  ? 'bg-[#12203A] text-[#EEEEE7] shadow-xs'
                  : 'text-[#12203A] hover:bg-white/60'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#C99A2E]" />
              <span>Admin Sign-In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode('register');
                setReqError(null);
                setReqSuccessDossier(null);
              }}
              className={`py-2 text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
                loginMode === 'register'
                  ? 'bg-[#12203A] text-[#EEEEE7] shadow-xs'
                  : 'text-[#12203A] hover:bg-white/60'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-[#9C3B2E]" />
              <span>Register for Admin Access</span>
            </button>
          </div>

          {/* MODE 1: SIGN IN OR FIRST-TIME VAULT SETUP */}
          {loginMode === 'signin' && (
            <div className="space-y-4">
              {!isVaultConfigured ? (
                <div className="p-3 bg-[#12203A]/5 border border-[#C99A2E] text-xs font-mono text-[#12203A] space-y-1">
                  <div className="font-bold text-[#9C3B2E] uppercase flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    <span>First-Time Secretariat Vault Setup</span>
                  </div>
                  <p className="text-[11px] text-[#3B475C] leading-relaxed">
                    No plaintext passcodes are stored in the repository. Select or enter your chapter administrator email and create a personal SHA-256 protected passphrase for this browser vault.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#3B475C] font-mono leading-relaxed">
                  Enter your authorized administrator email and passphrase to manage site content, review registrations, and inspect access logs.
                </p>
              )}

              {/* Quick Profile Selectors (Email Only - No Hardcoded Passwords) */}
              <div className="bg-[#EEEEE7] p-2.5 border border-[#CDCDC0] space-y-1.5">
                <span className="font-mono text-[10px] text-[#6A778D] uppercase font-bold block">
                  Quick Officer Email Selection:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('icpep.oman@gmail.com');
                      setLoginPasscode('');
                      setConfirmPasscode('');
                      setLoginErrorMessage(null);
                    }}
                    className={`p-1.5 border text-left font-mono text-[10px] transition-colors ${
                      loginEmail === 'icpep.oman@gmail.com'
                        ? 'bg-[#12203A] text-white border-[#12203A]'
                        : 'bg-white text-[#12203A] border-[#CDCDC0] hover:bg-[#F2F2EC]'
                    }`}
                  >
                    <div className="font-bold truncate">Engr. Del Rosario</div>
                    <div className="text-[#C99A2E] text-[9px]">Super Admin</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('secretariat.oman@icpep.ph');
                      setLoginPasscode('');
                      setConfirmPasscode('');
                      setLoginErrorMessage(null);
                    }}
                    className={`p-1.5 border text-left font-mono text-[10px] transition-colors ${
                      loginEmail === 'secretariat.oman@icpep.ph'
                        ? 'bg-[#12203A] text-white border-[#12203A]'
                        : 'bg-white text-[#12203A] border-[#CDCDC0] hover:bg-[#F2F2EC]'
                    }`}
                  >
                    <div className="font-bold truncate">Engr. M. Santos</div>
                    <div className="text-[#6A778D] text-[9px]">Secretariat</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('auditor.oman@icpep.ph');
                      setLoginPasscode('');
                      setConfirmPasscode('');
                      setLoginErrorMessage(null);
                    }}
                    className={`p-1.5 border text-left font-mono text-[10px] transition-colors ${
                      loginEmail === 'auditor.oman@icpep.ph'
                        ? 'bg-[#12203A] text-white border-[#12203A]'
                        : 'bg-white text-[#12203A] border-[#CDCDC0] hover:bg-[#F2F2EC]'
                    }`}
                  >
                    <div className="font-bold truncate">Engr. J. Cruz</div>
                    <div className="text-[#6A778D] text-[9px]">Auditor</div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block font-bold text-[#12203A] uppercase mb-1">
                    Official Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="icpep.oman@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden text-sm text-[#12203A]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-[#12203A] uppercase">
                      {!isVaultConfigured ? 'Create Security Passphrase *' : 'Security Passphrase *'}
                    </label>
                    <span className="text-[10px] text-[#6A778D]">SHA-256 Protected</span>
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder={!isVaultConfigured ? 'Set a passphrase (min. 6 characters)' : 'Enter your passphrase'}
                    value={loginPasscode}
                    onChange={(e) => setLoginPasscode(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden text-sm text-[#12203A]"
                  />
                </div>

                {!isVaultConfigured && (
                  <div>
                    <label className="block font-bold text-[#12203A] uppercase mb-1">
                      Confirm Security Passphrase *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Re-enter passphrase to initialize vault"
                      value={confirmPasscode}
                      onChange={(e) => setConfirmPasscode(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden text-sm text-[#12203A]"
                    />
                  </div>
                )}

                {loginErrorMessage && (
                  <div className="p-2.5 bg-[#9C3B2E]/10 border border-[#9C3B2E] text-xs font-mono text-[#9C3B2E] flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginErrorMessage}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] font-mono text-xs uppercase tracking-wider border border-[#C99A2E] font-bold transition-all shadow-xs"
                  >
                    {!isVaultConfigured
                      ? 'Initialize Vault & Enter Desk →'
                      : 'Authenticate & Enter Desk →'}
                  </button>
                </div>
              </form>

              <div className="pt-2 text-center border-t border-[#CDCDC0]">
                <button
                  type="button"
                  onClick={() => setLoginMode('register')}
                  className="font-mono text-xs text-[#9C3B2E] hover:underline"
                >
                  Need administrative clearance? Submit an Admin Registration Request →
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: SELF-SERVICE REGISTRATION REQUEST */}
          {loginMode === 'register' && (
            <div className="space-y-4">
              {reqSuccessDossier ? (
                <div className="p-6 bg-white border border-[#2E7D32] space-y-4 text-center">
                  <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg font-bold text-[#12203A]">
                      Admin Request Submitted!
                    </h4>
                    <p className="font-mono text-xs text-[#2E7D32] font-bold">
                      Tracking Reference: {reqSuccessDossier}
                    </p>
                  </div>
                  <p className="font-mono text-xs text-[#3B475C] leading-relaxed">
                    Your clearance request has been queued in the Secretariat Access Register. A Chapter Super Admin
                    will verify your PRC credentials and activate your role.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMode('signin');
                        setReqSuccessDossier(null);
                      }}
                      className="px-5 py-2 bg-[#12203A] text-[#EEEEE7] font-mono text-xs font-bold uppercase"
                    >
                      Return to Sign-In
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs text-[#3B475C] font-mono leading-relaxed">
                    Officers, committee members, and authorized engineering staff may apply for administrative access to
                    manage website records and verify CPD attendee credentials.
                  </p>

                  {reqError && (
                    <div className="p-2.5 bg-[#9C3B2E]/10 border border-[#9C3B2E] text-xs font-mono text-[#9C3B2E]">
                      {reqError}
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="block font-bold text-[#12203A] uppercase mb-1">
                        Full Name & Honorific *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Engr. Mark Anthony Flores"
                        value={reqName}
                        onChange={(e) => setReqName(e.target.value)}
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-bold text-[#12203A] uppercase mb-1">
                          Official Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="officer@email.com"
                          value={reqEmail}
                          onChange={(e) => setReqEmail(e.target.value)}
                          className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#12203A] uppercase mb-1">
                          PRC License No.
                        </label>
                        <input
                          type="text"
                          placeholder="PRC Reg. No. 001928"
                          value={reqPrc}
                          onChange={(e) => setReqPrc(e.target.value)}
                          className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-bold text-[#12203A] uppercase mb-1">
                          Chapter Committee / Post *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. CPD Events Committee"
                          value={reqPosition}
                          onChange={(e) => setReqPosition(e.target.value)}
                          className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#12203A] uppercase mb-1">
                          Requested Role
                        </label>
                        <select
                          value={reqRole}
                          onChange={(e) => setReqRole(e.target.value as AdminUserRole)}
                          className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                        >
                          <option value="Secretariat Officer">Secretariat Officer (Operations)</option>
                          <option value="Auditor / Observer">Auditor / Observer (Read-Only)</option>
                          <option value="Super Admin">Super Admin (Board Clearance)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-[#12203A] uppercase mb-1">
                        Preferred Security Passcode *
                      </label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Choose a secure password (min. 6 characters)"
                        value={reqPasscode}
                        onChange={(e) => setReqPasscode(e.target.value)}
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#12203A] uppercase mb-1">
                        Reason for Admin Clearance *
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Describe your role in upcoming seminars, chapter activities, or records verification..."
                        value={reqReason}
                        onChange={(e) => setReqReason(e.target.value)}
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] resize-none focus:border-[#12203A] focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#CDCDC0]">
                      <button
                        type="button"
                        onClick={() => setLoginMode('signin')}
                        className="px-3 py-2 bg-[#EEEEE7] hover:bg-[#E0E0D4] text-[#12203A] font-bold border border-[#CDCDC0]"
                      >
                        ← Back to Sign-In
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#9C3B2E] hover:bg-[#B54536] text-white font-bold"
                      >
                        Submit Clearance Request →
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const contentStr = evt.target?.result as string;
      const res = importJson(contentStr);
      if (res.success) {
        setImportNotice('Content imported and saved successfully!');
        setTimeout(() => setImportNotice(null), 3000);
      } else {
        setImportNotice(`Import failed: ${res.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const pendingCount = registrations.filter((r) => r.status === 'Pending Review').length;
  const pendingAdminCount = adminUsers.filter((u) => u.status === 'Pending Approval').length;

  const navTabs = [
    {
      id: 'github-publisher',
      label: '★ GitHub Publish & Sync',
      icon: <FolderGit2 className="w-3.5 h-3.5 text-[#C99A2E]" />,
      badge: 'LIVE',
    },
    {
      id: 'admin-users',
      label: '★ Admin Users & Access Monitor',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#C99A2E]" />,
      badge: pendingAdminCount > 0 ? `${pendingAdminCount} req` : undefined,
    },
    {
      id: 'registrations',
      label: `00 Registrations (${registrations.length})`,
      icon: <UserCheck className="w-3.5 h-3.5" />,
      badge: pendingCount > 0 ? `${pendingCount} new` : undefined,
    },
    {
      id: 'media-images',
      label: '★ Pictures & Media',
      icon: <ImageIcon className="w-3.5 h-3.5" />,
      badge: 'NEW',
    },
    { id: 'brand-hero', label: '01 Brand & Hero', icon: <Building className="w-3.5 h-3.5" /> },
    { id: 'about-officers', label: '02 About & Officers', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'membership', label: '03 Membership & Tiers', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'events', label: '04 Events Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'tracks', label: '05 Dev Tracks', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'partners', label: '06 Partners', icon: <FolderTree className="w-3.5 h-3.5" /> },
    { id: 'resources', label: '07 Resources & FAQs', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'contact-footer', label: '08 Contact & Colophon', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'backup', label: '09 Backup & JSON', icon: <FileCode className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#12203A]/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 text-left">
      <div className="bg-[#EEEEE7] border-2 border-[#12203A] w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="bg-[#12203A] text-[#EEEEE7] px-4 py-3 border-b-2 border-[#C99A2E] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#C99A2E] inline-block" />
            <div>
              <span className="font-serif font-bold text-lg sm:text-xl text-[#EEEEE7]">
                ICpEP-Oman Live Content Control Deck
              </span>
              <span className="font-mono text-[11px] text-[#C4C4B5] block sm:inline sm:ml-3">
                [LIVE EDITING ENABLED • CHANGES APPLY IMMEDIATELY]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Operator Session Tag */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#1C2F54] border border-[#2D4573]">
                <div className="w-5 h-5 rounded-full bg-[#C99A2E] text-[#12203A] font-mono font-bold text-[10px] flex items-center justify-center">
                  {currentUser.name.slice(0, 1)}
                </div>
                <div className="text-[11px] font-mono leading-tight">
                  <span className="text-white font-bold">{currentUser.name}</span>{' '}
                  <span className="text-[#C99A2E] text-[10px]">({currentUser.role})</span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="ml-1 text-[10px] text-[#A8B4C8] hover:text-white underline font-mono flex items-center gap-0.5"
                  title="Sign out of current admin session"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Exit</span>
                </button>
              </div>
            )}

            {lastSaved && (
              <span className="hidden lg:inline font-mono text-[10px] text-[#C99A2E] bg-[#1C2F54] px-2 py-1 border border-[#C99A2E]/40">
                SAVED: {lastSaved}
              </span>
            )}

            <button
              onClick={() => setActiveTab('github-publisher')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C2F54] hover:bg-[#253D6D] text-[#C99A2E] border border-[#C99A2E] font-mono text-xs uppercase font-bold transition-all shadow-xs"
              title="Save, Upload and Publish Modifications to GitHub"
            >
              <Github className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Publish to GitHub</span>
              <span className="sm:hidden">GitHub</span>
            </button>

            <button
              onClick={() => setActiveTab('admin-users')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#9C3B2E] hover:bg-[#B54536] text-white font-mono text-xs uppercase font-bold transition-all shadow-xs"
              title="Add Admin User Registration"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Register Admin User</span>
              <span className="sm:hidden">+ Admin</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C99A2E] hover:bg-[#D9AA3E] text-[#12203A] font-mono text-xs uppercase font-bold transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Site</span>
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1 hover:bg-[#1C2F54] text-[#EEEEE7]"
              title="Close Admin Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {importNotice && (
          <div className="bg-[#C99A2E] text-[#12203A] px-4 py-1.5 font-mono text-xs font-bold flex items-center justify-between">
            <span>{importNotice}</span>
            <button onClick={() => setImportNotice(null)}>✕</button>
          </div>
        )}

        {/* Main Body with Sidebar Tabs & Scrollable Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-60 bg-[#E3E3D8] border-b md:border-b-0 md:border-r border-[#CDCDC0] shrink-0 overflow-y-auto">
            <div className="p-3 border-b border-[#CDCDC0] font-mono text-[10px] uppercase tracking-wider text-[#6A778D]">
              Navigation Modules
            </div>
            <nav className="p-2 space-y-1">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-left transition-colors border ${
                    activeTab === tab.id
                      ? 'bg-[#12203A] text-[#EEEEE7] border-[#12203A] font-bold'
                      : 'bg-transparent text-[#12203A] border-transparent hover:bg-[#D8D8CC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={activeTab === tab.id ? 'text-[#C99A2E]' : 'text-[#6A778D]'}>
                      {tab.icon}
                    </span>
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-[#9C3B2E] text-white text-[9px] font-mono uppercase font-bold shrink-0">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="p-3 mt-4 border-t border-[#CDCDC0] space-y-2 font-mono text-[10px] text-[#6A778D]">
              <div>AUTHENTICATED: ACTIVE</div>
              <button
                onClick={logout}
                className="w-full py-1 bg-[#EEEEE7] hover:bg-[#D8D8CC] text-[#9C3B2E] border border-[#CDCDC0] uppercase font-bold"
              >
                Sign Out Admin
              </button>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F6F6F2]">
            
            {/* TAB GITHUB PUBLISHER & SYNC */}
            {activeTab === 'github-publisher' && <GitHubPublisherManager />}

            {/* TAB ADMIN USERS & SECURITY MONITOR */}
            {activeTab === 'admin-users' && <AdminUsersManager />}

            {/* TAB 0: Registrations Inbox */}
            {activeTab === 'registrations' && <RegistrationsManager />}

            {/* TAB MEDIA: Pictures, Images, Logos & Gallery */}
            {activeTab === 'media-images' && <MediaManager />}

            {/* TAB 1: Brand & Hero */}
            {activeTab === 'brand-hero' && (
              <div className="space-y-6">
                <div className="border-b border-[#CDCDC0] pb-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase">Section 01</span>
                    <h3 className="font-serif text-2xl font-bold text-[#12203A]">Brand Identity & Hero Banner</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('media-images')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] font-mono text-xs border border-[#12203A] transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#C99A2E]" />
                    <span>Edit Logo & Pictures →</span>
                  </button>
                </div>

                {/* Brand Identity Fields */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <h4 className="font-mono text-xs font-bold uppercase text-[#12203A] border-b border-[#CDCDC0] pb-1">
                    Brand Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Acronym</label>
                      <input
                        type="text"
                        value={content.brand.acronym}
                        onChange={(e) =>
                          updateContent((p) => ({ ...p, brand: { ...p.brand, acronym: e.target.value } }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A] font-serif"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Tagline</label>
                      <input
                        type="text"
                        value={content.brand.tagline}
                        onChange={(e) =>
                          updateContent((p) => ({ ...p, brand: { ...p.brand, tagline: e.target.value } }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A] font-serif"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Full Organization Name</label>
                      <input
                        type="text"
                        value={content.brand.fullName}
                        onChange={(e) =>
                          updateContent((p) => ({ ...p, brand: { ...p.brand, fullName: e.target.value } }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Jurisdiction / Outreach</label>
                      <input
                        type="text"
                        value={content.brand.jurisdiction}
                        onChange={(e) =>
                          updateContent((p) => ({ ...p, brand: { ...p.brand, jurisdiction: e.target.value } }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Parent Org Reference</label>
                      <input
                        type="text"
                        value={content.brand.parentOrg}
                        onChange={(e) =>
                          updateContent((p) => ({ ...p, brand: { ...p.brand, parentOrg: e.target.value } }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                      />
                    </div>
                  </div>
                </div>

                {/* Hero Section Fields */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <h4 className="font-mono text-xs font-bold uppercase text-[#12203A] border-b border-[#CDCDC0] pb-1">
                    Hero Section Copy
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Kicker Subtitle</label>
                      <input
                        type="text"
                        value={content.hero.kicker}
                        onChange={(e) =>
                          updateContent((p) => ({ ...p, hero: { ...p.hero, kicker: e.target.value } }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Main Heading</label>
                      <input
                        type="text"
                        value={content.hero.heading}
                        onChange={(e) =>
                          updateContent((p) => ({ ...p, hero: { ...p.hero, heading: e.target.value } }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-base font-serif font-bold text-[#12203A]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Narrative Description</label>
                      <textarea
                        rows={3}
                        value={content.hero.subheading}
                        onChange={(e) =>
                          updateContent((p) => ({ ...p, hero: { ...p.hero, subheading: e.target.value } }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A] resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Primary CTA Button</label>
                        <input
                          type="text"
                          value={content.hero.ctaPrimary.text}
                          onChange={(e) =>
                            updateContent((p) => ({
                              ...p,
                              hero: { ...p.hero, ctaPrimary: { ...p.hero.ctaPrimary, text: e.target.value } },
                            }))
                          }
                          className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#12203A]"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Secondary CTA Button</label>
                        <input
                          type="text"
                          value={content.hero.ctaSecondary.text}
                          onChange={(e) =>
                            updateContent((p) => ({
                              ...p,
                              hero: { ...p.hero, ctaSecondary: { ...p.hero.ctaSecondary, text: e.target.value } },
                            }))
                          }
                          className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#12203A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Drafting Specifications */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <h4 className="font-mono text-xs font-bold uppercase text-[#12203A] border-b border-[#CDCDC0] pb-1">
                    CAD & Geographic Blueprint Specs
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Doc ID</label>
                      <input
                        type="text"
                        value={content.hero.draftingSpec.docId}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              draftingSpec: { ...p.hero.draftingSpec, docId: e.target.value },
                            },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#12203A]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">GPS Coordinates</label>
                      <input
                        type="text"
                        value={content.hero.draftingSpec.coordinates}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              draftingSpec: { ...p.hero.draftingSpec, coordinates: e.target.value },
                            },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#12203A]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: About & Officers */}
            {activeTab === 'about-officers' && (
              <div className="space-y-6">
                <div className="border-b border-[#CDCDC0] pb-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase">Section 02</span>
                    <h3 className="font-serif text-2xl font-bold text-[#12203A]">About Section & Officers Directory</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('media-images')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] font-mono text-xs border border-[#12203A] transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#C99A2E]" />
                    <span>Edit Officer Photos & Gallery →</span>
                  </button>
                </div>

                {/* Purpose, Vision, Mission */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <h4 className="font-mono text-xs font-bold uppercase text-[#12203A] border-b border-[#CDCDC0] pb-1">
                    Organizational Pillars
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Who We Are (Title & Lead)</label>
                      <input
                        type="text"
                        value={content.about.whoWeAre.title}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            about: { ...p.about, whoWeAre: { ...p.about.whoWeAre, title: e.target.value } },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A] font-bold mb-2"
                      />
                      <textarea
                        rows={3}
                        value={content.about.whoWeAre.paragraphs.join('\n\n')}
                        onChange={(e) => {
                          const paras = e.target.value.split('\n\n').filter(Boolean);
                          updateContent((p) => ({
                            ...p,
                            about: { ...p.about, whoWeAre: { ...p.about.whoWeAre, paragraphs: paras } },
                          }));
                        }}
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                        placeholder="Paragraphs separated by double line break"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Our Purpose Statement</label>
                      <textarea
                        rows={2}
                        value={content.about.ourPurpose.statement}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            about: { ...p.about, ourPurpose: { ...p.about.ourPurpose, statement: e.target.value } },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Vision Statement</label>
                        <textarea
                          rows={3}
                          value={content.about.vision.statement}
                          onChange={(e) =>
                            updateContent((p) => ({
                              ...p,
                              about: { ...p.about, vision: { ...p.about.vision, statement: e.target.value } },
                            }))
                          }
                          className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Mission Statement</label>
                        <textarea
                          rows={3}
                          value={content.about.mission.statement}
                          onChange={(e) =>
                            updateContent((p) => ({
                              ...p,
                              about: { ...p.about, mission: { ...p.about.mission, statement: e.target.value } },
                            }))
                          }
                          className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Constitutional Objectives List */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-1">
                    <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                      Constitutional Objectives ({content.about.objectives.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newNum = String(content.about.objectives.length + 1).padStart(2, '0');
                        updateContent((p) => ({
                          ...p,
                          about: {
                            ...p.about,
                            objectives: [
                              ...p.about.objectives,
                              { number: newNum, title: 'New Objective', description: 'Objective description here.' },
                            ],
                          },
                        }));
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono uppercase bg-[#12203A] text-[#EEEEE7] px-2 py-0.5"
                    >
                      <Plus className="w-3 h-3 text-[#C99A2E]" />
                      <span>Add Objective</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {content.about.objectives.map((obj, idx) => (
                      <div key={idx} className="p-3 bg-white border border-[#CDCDC0] flex items-start gap-3">
                        <span className="font-mono text-xs font-bold text-[#C99A2E] bg-[#12203A] px-1.5 py-0.5">
                          {obj.number}
                        </span>
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={obj.title}
                            onChange={(e) => {
                              const newObjs = [...content.about.objectives];
                              newObjs[idx].title = e.target.value;
                              updateContent((p) => ({ ...p, about: { ...p.about, objectives: newObjs } }));
                            }}
                            className="w-full p-1 border border-[#CDCDC0] text-xs font-bold text-[#12203A]"
                          />
                          <textarea
                            rows={2}
                            value={obj.description}
                            onChange={(e) => {
                              const newObjs = [...content.about.objectives];
                              newObjs[idx].description = e.target.value;
                              updateContent((p) => ({ ...p, about: { ...p.about, objectives: newObjs } }));
                            }}
                            className="w-full p-1 border border-[#CDCDC0] text-xs text-[#3B475C] resize-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newObjs = content.about.objectives.filter((_, i) => i !== idx);
                            updateContent((p) => ({ ...p, about: { ...p.about, objectives: newObjs } }));
                          }}
                          className="text-[#9C3B2E] hover:text-[#7F2D22] p-1"
                          title="Remove Objective"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* President's Message */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <h4 className="font-mono text-xs font-bold uppercase text-[#12203A] border-b border-[#CDCDC0] pb-1">
                    President&apos;s Address & Signatory
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Message Title</label>
                      <input
                        type="text"
                        value={content.about.presidentsMessage.title}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            about: {
                              ...p.about,
                              presidentsMessage: { ...p.about.presidentsMessage, title: e.target.value },
                            },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A] font-serif"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Salutation</label>
                      <input
                        type="text"
                        value={content.about.presidentsMessage.salutation}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            about: {
                              ...p.about,
                              presidentsMessage: { ...p.about.presidentsMessage, salutation: e.target.value },
                            },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">President Full Name</label>
                      <input
                        type="text"
                        value={content.about.presidentsMessage.author}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            about: {
                              ...p.about,
                              presidentsMessage: { ...p.about.presidentsMessage, author: e.target.value },
                            },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A] font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">President License / Ref</label>
                      <input
                        type="text"
                        value={content.about.presidentsMessage.licenseRef}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            about: {
                              ...p.about,
                              presidentsMessage: { ...p.about.presidentsMessage, licenseRef: e.target.value },
                            },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#3B475C]"
                      />
                    </div>
                  </div>
                </div>

                {/* Officer Grid Management */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-1">
                    <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                      Executive Officers ({content.about.officers.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newOff: Officer = {
                          name: 'Engr. New Officer',
                          role: 'Director',
                          credential: 'PRC Reg. No. 00000',
                          specialization: 'Computer Engineering',
                          bio: 'Dedicated engineer supporting chapter operations.',
                        };
                        updateContent((p) => ({
                          ...p,
                          about: {
                            ...p.about,
                            officers: [...p.about.officers, newOff],
                          },
                        }));
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono uppercase bg-[#12203A] text-[#EEEEE7] px-2 py-0.5"
                    >
                      <Plus className="w-3 h-3 text-[#C99A2E]" />
                      <span>Add Officer</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {content.about.officers.map((officer, idx) => (
                      <div key={idx} className="p-4 bg-white border border-[#CDCDC0] space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const newOff = content.about.officers.filter((_, i) => i !== idx);
                            updateContent((p) => ({ ...p, about: { ...p.about, officers: newOff } }));
                          }}
                          className="absolute top-3 right-3 text-[#9C3B2E] hover:text-[#7F2D22]"
                          title="Delete Officer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Full Name & Honorific</label>
                            <input
                              type="text"
                              value={officer.name}
                              onChange={(e) => {
                                const newOff = [...content.about.officers];
                                newOff[idx].name = e.target.value;
                                updateContent((p) => ({ ...p, about: { ...p.about, officers: newOff } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs font-bold text-[#12203A]"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Officer Position / Role</label>
                            <input
                              type="text"
                              value={officer.role}
                              onChange={(e) => {
                                const newOff = [...content.about.officers];
                                newOff[idx].role = e.target.value;
                                updateContent((p) => ({ ...p, about: { ...p.about, officers: newOff } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs text-[#C99A2E] font-bold"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">License / Credential</label>
                            <input
                              type="text"
                              value={officer.credential}
                              onChange={(e) => {
                                const newOff = [...content.about.officers];
                                newOff[idx].credential = e.target.value;
                                updateContent((p) => ({ ...p, about: { ...p.about, officers: newOff } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs font-mono text-[#3B475C]"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Specialization</label>
                            <input
                              type="text"
                              value={officer.specialization}
                              onChange={(e) => {
                                const newOff = [...content.about.officers];
                                newOff[idx].specialization = e.target.value;
                                updateContent((p) => ({ ...p, about: { ...p.about, officers: newOff } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs text-[#3B475C]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Professional Biography</label>
                          <textarea
                            rows={2}
                            value={officer.bio}
                            onChange={(e) => {
                              const newOff = [...content.about.officers];
                              newOff[idx].bio = e.target.value;
                              updateContent((p) => ({ ...p, about: { ...p.about, officers: newOff } }));
                            }}
                            className="w-full p-1.5 border border-[#CDCDC0] text-xs text-[#3B475C] resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Membership */}
            {activeTab === 'membership' && (
              <div className="space-y-6">
                <div className="border-b border-[#CDCDC0] pb-2">
                  <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase">Section 03</span>
                  <h3 className="font-serif text-2xl font-bold text-[#12203A]">Membership Tiers, Benefits & Fees</h3>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Membership Intro Narrative</label>
                  <textarea
                    rows={3}
                    value={content.membership.intro}
                    onChange={(e) =>
                      updateContent((p) => ({ ...p, membership: { ...p.membership, intro: e.target.value } }))
                    }
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                  />
                </div>

                {/* 3 Categories Editing */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <h4 className="font-mono text-xs font-bold uppercase text-[#12203A] border-b border-[#CDCDC0] pb-1">
                    Membership Categories & Pricing
                  </h4>
                  <div className="space-y-4">
                    {content.membership.categories.map((cat, idx) => (
                      <div key={cat.id} className="p-4 bg-white border border-[#CDCDC0] space-y-3">
                        <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-2">
                          <span className="font-mono text-xs font-bold text-[#12203A] uppercase">
                            Tier {idx + 1}: {cat.badge}
                          </span>
                          <span className="font-mono text-xs text-[#C99A2E] font-bold">{cat.annualFee}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Category Name</label>
                            <input
                              type="text"
                              value={cat.name}
                              onChange={(e) => {
                                const newCats = [...content.membership.categories];
                                newCats[idx].name = e.target.value;
                                updateContent((p) => ({ ...p, membership: { ...p.membership, categories: newCats } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs font-bold text-[#12203A]"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Annual Dues</label>
                            <input
                              type="text"
                              value={cat.annualFee}
                              onChange={(e) => {
                                const newCats = [...content.membership.categories];
                                newCats[idx].annualFee = e.target.value;
                                updateContent((p) => ({ ...p, membership: { ...p.membership, categories: newCats } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs font-bold text-[#9C3B2E]"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Eligibility / Requirements</label>
                            <input
                              type="text"
                              value={cat.requirements}
                              onChange={(e) => {
                                const newCats = [...content.membership.categories];
                                newCats[idx].requirements = e.target.value;
                                updateContent((p) => ({ ...p, membership: { ...p.membership, categories: newCats } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs text-[#3B475C]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 7 Member Benefits */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-1">
                    <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                      Member Benefits ({content.membership.benefits.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newNum = String(content.membership.benefits.length + 1).padStart(2, '0');
                        updateContent((p) => ({
                          ...p,
                          membership: {
                            ...p.membership,
                            benefits: [
                              ...p.membership.benefits,
                              {
                                number: newNum,
                                title: 'New Member Benefit',
                                description: 'Detailed member benefit description.',
                              },
                            ],
                          },
                        }));
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono uppercase bg-[#12203A] text-[#EEEEE7] px-2 py-0.5"
                    >
                      <Plus className="w-3 h-3 text-[#C99A2E]" />
                      <span>Add Benefit</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {content.membership.benefits.map((ben, idx) => (
                      <div key={idx} className="p-3 bg-white border border-[#CDCDC0] space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const newBens = content.membership.benefits.filter((_, i) => i !== idx);
                            updateContent((p) => ({ ...p, membership: { ...p.membership, benefits: newBens } }));
                          }}
                          className="absolute top-2 right-2 text-[#9C3B2E] hover:text-[#7F2D22]"
                          title="Delete Benefit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-2 pr-6">
                          <span className="font-mono text-xs font-bold text-[#C99A2E] bg-[#12203A] px-1.5 py-0.5">
                            {ben.number}
                          </span>
                          <input
                            type="text"
                            value={ben.title}
                            onChange={(e) => {
                              const newBens = [...content.membership.benefits];
                              newBens[idx].title = e.target.value;
                              updateContent((p) => ({ ...p, membership: { ...p.membership, benefits: newBens } }));
                            }}
                            className="w-full p-1 border border-[#CDCDC0] text-xs font-bold text-[#12203A]"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={ben.description}
                          onChange={(e) => {
                            const newBens = [...content.membership.benefits];
                            newBens[idx].description = e.target.value;
                            updateContent((p) => ({ ...p, membership: { ...p.membership, benefits: newBens } }));
                          }}
                          className="w-full p-1 border border-[#CDCDC0] text-xs text-[#3B475C] resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Events Calendar */}
            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="border-b border-[#CDCDC0] pb-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase">Section 04</span>
                    <h3 className="font-serif text-2xl font-bold text-[#12203A]">Events Calendar & Archive</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('media-images')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] font-mono text-xs border border-[#12203A] transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#C99A2E]" />
                    <span>Upload Event Flyers & Posters →</span>
                  </button>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Calendar Intro Text</label>
                  <textarea
                    rows={2}
                    value={content.events.intro}
                    onChange={(e) =>
                      updateContent((p) => ({ ...p, events: { ...p.events, intro: e.target.value } }))
                    }
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                  />
                </div>

                {/* Upcoming Events */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-1">
                    <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                      Upcoming Scheduled Events ({content.events.upcoming.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newEvt: UpcomingEvent = {
                          id: `EVT-${Date.now().toString().slice(-4)}`,
                          title: 'New Technical Assembly',
                          date: 'November 15, 2026',
                          time: '06:00 PM – 09:00 PM GST',
                          place: 'Muscat, Oman',
                          blurb: 'Technical session details and agenda.',
                          category: 'Workshop',
                          seatsStatus: 'Open',
                        };
                        updateContent((p) => ({
                          ...p,
                          events: {
                            ...p.events,
                            upcoming: [...p.events.upcoming, newEvt],
                          },
                        }));
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono uppercase bg-[#12203A] text-[#EEEEE7] px-2 py-0.5"
                    >
                      <Plus className="w-3 h-3 text-[#C99A2E]" />
                      <span>Add Event</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {content.events.upcoming.map((evt, idx) => (
                      <div key={evt.id} className="p-4 bg-white border border-[#CDCDC0] space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const newEvts = content.events.upcoming.filter((_, i) => i !== idx);
                            updateContent((p) => ({ ...p, events: { ...p.events, upcoming: newEvts } }));
                          }}
                          className="absolute top-3 right-3 text-[#9C3B2E] hover:text-[#7F2D22]"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                          <div className="sm:col-span-2">
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Event Title</label>
                            <input
                              type="text"
                              value={evt.title}
                              onChange={(e) => {
                                const newEvts = [...content.events.upcoming];
                                newEvts[idx].title = e.target.value;
                                updateContent((p) => ({ ...p, events: { ...p.events, upcoming: newEvts } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs font-bold text-[#12203A]"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Date</label>
                            <input
                              type="text"
                              value={evt.date}
                              onChange={(e) => {
                                const newEvts = [...content.events.upcoming];
                                newEvts[idx].date = e.target.value;
                                updateContent((p) => ({ ...p, events: { ...p.events, upcoming: newEvts } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs text-[#12203A]"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Time</label>
                            <input
                              type="text"
                              value={evt.time}
                              onChange={(e) => {
                                const newEvts = [...content.events.upcoming];
                                newEvts[idx].time = e.target.value;
                                updateContent((p) => ({ ...p, events: { ...p.events, upcoming: newEvts } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs text-[#12203A]"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Venue / Mode</label>
                            <input
                              type="text"
                              value={evt.place}
                              onChange={(e) => {
                                const newEvts = [...content.events.upcoming];
                                newEvts[idx].place = e.target.value;
                                updateContent((p) => ({ ...p, events: { ...p.events, upcoming: newEvts } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs text-[#12203A]"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Seat Status</label>
                            <select
                              value={evt.seatsStatus}
                              onChange={(e) => {
                                const newEvts = [...content.events.upcoming];
                                newEvts[idx].seatsStatus = e.target.value as any;
                                updateContent((p) => ({ ...p, events: { ...p.events, upcoming: newEvts } }));
                              }}
                              className="w-full p-1.5 border border-[#CDCDC0] text-xs bg-white"
                            >
                              <option value="Open">Open</option>
                              <option value="Filling Fast">Filling Fast</option>
                              <option value="Waitlist">Waitlist</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Brief Summary / Blurb</label>
                          <textarea
                            rows={2}
                            value={evt.blurb}
                            onChange={(e) => {
                              const newEvts = [...content.events.upcoming];
                              newEvts[idx].blurb = e.target.value;
                              updateContent((p) => ({ ...p, events: { ...p.events, upcoming: newEvts } }));
                            }}
                            className="w-full p-1.5 border border-[#CDCDC0] text-xs text-[#3B475C] resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Past Events Archive */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-1">
                    <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                      Past Events Archive ({content.events.past.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newPast: PastEvent = {
                          id: `PE-${Date.now().toString().slice(-4)}`,
                          title: 'Concluded Tech Session',
                          date: 'May 2026',
                          category: 'Technical Assembly',
                          venue: 'Muscat Hybrid Hub',
                          cpdUnits: '3.0 CPD Units',
                        };
                        updateContent((p) => ({
                          ...p,
                          events: {
                            ...p.events,
                            past: [...p.events.past, newPast],
                          },
                        }));
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono uppercase bg-[#12203A] text-[#EEEEE7] px-2 py-0.5"
                    >
                      <Plus className="w-3 h-3 text-[#C99A2E]" />
                      <span>Add Archive Entry</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {content.events.past.map((pe, idx) => (
                      <div key={pe.id} className="p-3 bg-white border border-[#CDCDC0] flex items-center gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            value={pe.title}
                            onChange={(e) => {
                              const newPast = [...content.events.past];
                              newPast[idx].title = e.target.value;
                              updateContent((p) => ({ ...p, events: { ...p.events, past: newPast } }));
                            }}
                            className="p-1 border border-[#CDCDC0] text-xs font-bold text-[#12203A]"
                            placeholder="Title"
                          />
                          <input
                            type="text"
                            value={pe.date}
                            onChange={(e) => {
                              const newPast = [...content.events.past];
                              newPast[idx].date = e.target.value;
                              updateContent((p) => ({ ...p, events: { ...p.events, past: newPast } }));
                            }}
                            className="p-1 border border-[#CDCDC0] text-xs text-[#3B475C]"
                            placeholder="Date"
                          />
                          <input
                            type="text"
                            value={pe.category}
                            onChange={(e) => {
                              const newPast = [...content.events.past];
                              newPast[idx].category = e.target.value;
                              updateContent((p) => ({ ...p, events: { ...p.events, past: newPast } }));
                            }}
                            className="p-1 border border-[#CDCDC0] text-xs text-[#C99A2E]"
                            placeholder="Category"
                          />
                          <input
                            type="text"
                            value={pe.cpdUnits || ''}
                            onChange={(e) => {
                              const newPast = [...content.events.past];
                              newPast[idx].cpdUnits = e.target.value;
                              updateContent((p) => ({ ...p, events: { ...p.events, past: newPast } }));
                            }}
                            className="p-1 border border-[#CDCDC0] text-xs font-mono text-[#9C3B2E]"
                            placeholder="CPD Units"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newPast = content.events.past.filter((_, i) => i !== idx);
                            updateContent((p) => ({ ...p, events: { ...p.events, past: newPast } }));
                          }}
                          className="text-[#9C3B2E] p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Professional Development */}
            {activeTab === 'tracks' && (
              <div className="space-y-6">
                <div className="border-b border-[#CDCDC0] pb-2">
                  <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase">Section 05</span>
                  <h3 className="font-serif text-2xl font-bold text-[#12203A]">Professional Development Tracks</h3>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Development Intro</label>
                  <textarea
                    rows={2}
                    value={content.development.intro}
                    onChange={(e) =>
                      updateContent((p) => ({ ...p, development: { ...p.development, intro: e.target.value } }))
                    }
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                  />
                </div>

                <div className="space-y-4">
                  {content.development.tracks.map((track, idx) => (
                    <div key={track.id} className="p-4 bg-white border border-[#CDCDC0] space-y-3">
                      <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-2">
                        <span className="font-mono text-xs font-bold text-[#12203A]">{track.id}</span>
                        <span className="font-mono text-xs text-[#C99A2E]">{track.prcAlignment}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Track Title</label>
                          <input
                            type="text"
                            value={track.title}
                            onChange={(e) => {
                              const newTracks = [...content.development.tracks];
                              newTracks[idx].title = e.target.value;
                              updateContent((p) => ({ ...p, development: { ...p.development, tracks: newTracks } }));
                            }}
                            className="w-full p-1.5 border border-[#CDCDC0] text-xs font-bold text-[#12203A]"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Subtitle / Tag</label>
                          <input
                            type="text"
                            value={track.subtitle}
                            onChange={(e) => {
                              const newTracks = [...content.development.tracks];
                              newTracks[idx].subtitle = e.target.value;
                              updateContent((p) => ({ ...p, development: { ...p.development, tracks: newTracks } }));
                            }}
                            className="w-full p-1.5 border border-[#CDCDC0] text-xs text-[#9C3B2E] font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase text-[#6A778D]">Description</label>
                        <textarea
                          rows={2}
                          value={track.description}
                          onChange={(e) => {
                            const newTracks = [...content.development.tracks];
                            newTracks[idx].description = e.target.value;
                            updateContent((p) => ({ ...p, development: { ...p.development, tracks: newTracks } }));
                          }}
                          className="w-full p-1.5 border border-[#CDCDC0] text-xs text-[#3B475C] resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: Partners */}
            {activeTab === 'partners' && (
              <div className="space-y-6">
                <div className="border-b border-[#CDCDC0] pb-2">
                  <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase">Section 06</span>
                  <h3 className="font-serif text-2xl font-bold text-[#12203A]">Institutional & Industry Partners</h3>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Partners Section Intro</label>
                  <textarea
                    rows={2}
                    value={content.partners.intro}
                    onChange={(e) =>
                      updateContent((p) => ({ ...p, partners: { ...p.partners, intro: e.target.value } }))
                    }
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                  />
                </div>

                <div className="space-y-6">
                  {content.partners.categories.map((cat, cIdx) => (
                    <div key={cat.id} className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-1">
                        <h4 className="font-serif font-bold text-base text-[#12203A]">
                          {cat.title} ({cat.partners.length})
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            const newCats = [...content.partners.categories];
                            newCats[cIdx].partners.push({
                              name: 'New Partner Organization',
                              description: 'Scope of cooperation and joint initiatives.',
                              classification: 'Strategic Partner',
                              status: 'MoU Active',
                            });
                            updateContent((p) => ({ ...p, partners: { ...p.partners, categories: newCats } }));
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-mono uppercase bg-[#12203A] text-[#EEEEE7] px-2 py-0.5"
                        >
                          <Plus className="w-3 h-3 text-[#C99A2E]" />
                          <span>Add Partner</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {cat.partners.map((p, pIdx) => (
                          <div key={pIdx} className="p-3 bg-white border border-[#CDCDC0] space-y-2 relative">
                            <button
                              type="button"
                              onClick={() => {
                                const newCats = [...content.partners.categories];
                                newCats[cIdx].partners = newCats[cIdx].partners.filter((_, i) => i !== pIdx);
                                updateContent((p) => ({ ...p, partners: { ...p.partners, categories: newCats } }));
                              }}
                              className="absolute top-2 right-2 text-[#9C3B2E]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-6">
                              <input
                                type="text"
                                value={p.name}
                                onChange={(e) => {
                                  const newCats = [...content.partners.categories];
                                  newCats[cIdx].partners[pIdx].name = e.target.value;
                                  updateContent((prev) => ({ ...prev, partners: { ...prev.partners, categories: newCats } }));
                                }}
                                className="w-full p-1 border border-[#CDCDC0] text-xs font-bold text-[#12203A]"
                                placeholder="Partner Name"
                              />
                              <input
                                type="text"
                                value={p.classification}
                                onChange={(e) => {
                                  const newCats = [...content.partners.categories];
                                  newCats[cIdx].partners[pIdx].classification = e.target.value;
                                  updateContent((prev) => ({ ...prev, partners: { ...prev.partners, categories: newCats } }));
                                }}
                                className="w-full p-1 border border-[#CDCDC0] text-xs text-[#3B475C]"
                                placeholder="Classification"
                              />
                              <input
                                type="text"
                                value={p.status}
                                onChange={(e) => {
                                  const newCats = [...content.partners.categories];
                                  newCats[cIdx].partners[pIdx].status = e.target.value as any;
                                  updateContent((prev) => ({ ...prev, partners: { ...prev.partners, categories: newCats } }));
                                }}
                                className="w-full p-1 border border-[#CDCDC0] text-xs font-mono text-[#C99A2E]"
                                placeholder="Status"
                              />
                            </div>
                            <textarea
                              rows={2}
                              value={p.description}
                              onChange={(e) => {
                                const newCats = [...content.partners.categories];
                                newCats[cIdx].partners[pIdx].description = e.target.value;
                                updateContent((prev) => ({ ...prev, partners: { ...prev.partners, categories: newCats } }));
                              }}
                              className="w-full p-1 border border-[#CDCDC0] text-xs text-[#3B475C] resize-none"
                              placeholder="Description"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: Resources & FAQs */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="border-b border-[#CDCDC0] pb-2">
                  <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase">Section 07</span>
                  <h3 className="font-serif text-2xl font-bold text-[#12203A]">Circular Announcements & FAQs</h3>
                </div>

                {/* Announcements */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-1">
                    <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                      Official Announcements ({content.resources.announcements.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newAnn: Announcement = {
                          id: `ANN-${Date.now().toString().slice(-4)}`,
                          title: 'New Official Circular',
                          date: 'September 2026',
                          category: 'Circular',
                          summary: 'Summary of the official secretariat announcement.',
                          referenceDoc: 'SEC-RES-2026-X',
                        };
                        updateContent((p) => ({
                          ...p,
                          resources: {
                            ...p.resources,
                            announcements: [...p.resources.announcements, newAnn],
                          },
                        }));
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono uppercase bg-[#12203A] text-[#EEEEE7] px-2 py-0.5"
                    >
                      <Plus className="w-3 h-3 text-[#C99A2E]" />
                      <span>Add Circular</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {content.resources.announcements.map((ann, idx) => (
                      <div key={ann.id} className="p-3 bg-white border border-[#CDCDC0] space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const newAnns = content.resources.announcements.filter((_, i) => i !== idx);
                            updateContent((p) => ({ ...p, resources: { ...p.resources, announcements: newAnns } }));
                          }}
                          className="absolute top-2 right-2 text-[#9C3B2E]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-6">
                          <input
                            type="text"
                            value={ann.title}
                            onChange={(e) => {
                              const newAnns = [...content.resources.announcements];
                              newAnns[idx].title = e.target.value;
                              updateContent((p) => ({ ...p, resources: { ...p.resources, announcements: newAnns } }));
                            }}
                            className="w-full p-1 border border-[#CDCDC0] text-xs font-bold text-[#12203A] sm:col-span-2"
                            placeholder="Title"
                          />
                          <input
                            type="text"
                            value={ann.date}
                            onChange={(e) => {
                              const newAnns = [...content.resources.announcements];
                              newAnns[idx].date = e.target.value;
                              updateContent((p) => ({ ...p, resources: { ...p.resources, announcements: newAnns } }));
                            }}
                            className="w-full p-1 border border-[#CDCDC0] text-xs text-[#3B475C]"
                            placeholder="Date"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={ann.summary}
                          onChange={(e) => {
                            const newAnns = [...content.resources.announcements];
                            newAnns[idx].summary = e.target.value;
                            updateContent((p) => ({ ...p, resources: { ...p.resources, announcements: newAnns } }));
                          }}
                          className="w-full p-1 border border-[#CDCDC0] text-xs text-[#3B475C] resize-none"
                          placeholder="Summary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQs */}
                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-1">
                    <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                      Frequently Asked Questions ({content.resources.faqs.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newFaq: FAQItem = {
                          id: `faq-${Date.now().toString().slice(-4)}`,
                          question: 'New Question Here?',
                          category: 'Membership',
                          answer: 'Answer details go here.',
                        };
                        updateContent((p) => ({
                          ...p,
                          resources: {
                            ...p.resources,
                            faqs: [...p.resources.faqs, newFaq],
                          },
                        }));
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono uppercase bg-[#12203A] text-[#EEEEE7] px-2 py-0.5"
                    >
                      <Plus className="w-3 h-3 text-[#C99A2E]" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {content.resources.faqs.map((faq, idx) => (
                      <div key={faq.id} className="p-3 bg-white border border-[#CDCDC0] space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const newFaqs = content.resources.faqs.filter((_, i) => i !== idx);
                            updateContent((p) => ({ ...p, resources: { ...p.resources, faqs: newFaqs } }));
                          }}
                          className="absolute top-2 right-2 text-[#9C3B2E]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pr-6">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const newFaqs = [...content.resources.faqs];
                              newFaqs[idx].question = e.target.value;
                              updateContent((p) => ({ ...p, resources: { ...p.resources, faqs: newFaqs } }));
                            }}
                            className="w-full p-1 border border-[#CDCDC0] text-xs font-bold text-[#12203A] sm:col-span-2"
                            placeholder="Question"
                          />
                          <input
                            type="text"
                            value={faq.category}
                            onChange={(e) => {
                              const newFaqs = [...content.resources.faqs];
                              newFaqs[idx].category = e.target.value;
                              updateContent((p) => ({ ...p, resources: { ...p.resources, faqs: newFaqs } }));
                            }}
                            className="w-full p-1 border border-[#CDCDC0] text-xs text-[#C99A2E]"
                            placeholder="Category"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const newFaqs = [...content.resources.faqs];
                            newFaqs[idx].answer = e.target.value;
                            updateContent((p) => ({ ...p, resources: { ...p.resources, faqs: newFaqs } }));
                          }}
                          className="w-full p-1 border border-[#CDCDC0] text-xs text-[#3B475C] resize-none"
                          placeholder="Answer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: Contact & Colophon */}
            {activeTab === 'contact-footer' && (
              <div className="space-y-6">
                <div className="border-b border-[#CDCDC0] pb-2">
                  <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase">Section 08</span>
                  <h3 className="font-serif text-2xl font-bold text-[#12203A]">Secretariat Contact & Legal Colophon</h3>
                </div>

                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <h4 className="font-mono text-xs font-bold uppercase text-[#12203A] border-b border-[#CDCDC0] pb-1">
                    Secretariat Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Email</label>
                      <input
                        type="email"
                        value={content.contact.details.email}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            contact: {
                              ...p.contact,
                              details: { ...p.contact.details, email: e.target.value },
                            },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Hotline / WhatsApp</label>
                      <input
                        type="text"
                        value={content.contact.details.hotline}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            contact: {
                              ...p.contact,
                              details: { ...p.contact.details, hotline: e.target.value },
                            },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Building / Address</label>
                      <input
                        type="text"
                        value={content.contact.details.address.building}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            contact: {
                              ...p.contact,
                              details: {
                                ...p.contact.details,
                                address: { ...p.contact.details.address, building: e.target.value },
                              },
                            },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">District / City</label>
                      <input
                        type="text"
                        value={content.contact.details.address.district}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            contact: {
                              ...p.contact,
                              details: {
                                ...p.contact.details,
                                address: { ...p.contact.details.address, district: e.target.value },
                              },
                            },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Operating Hours</label>
                      <input
                        type="text"
                        value={content.contact.details.officeHours}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            contact: {
                              ...p.contact,
                              details: { ...p.contact.details, officeHours: e.target.value },
                            },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-4">
                  <h4 className="font-mono text-xs font-bold uppercase text-[#12203A] border-b border-[#CDCDC0] pb-1">
                    Footer & Colophon Specs
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Legal Notice</label>
                      <textarea
                        rows={2}
                        value={content.footer.legalNotice}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            footer: { ...p.footer, legalNotice: e.target.value },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1">Technical Colophon Text</label>
                      <input
                        type="text"
                        value={content.footer.blueprintFooterText}
                        onChange={(e) =>
                          updateContent((p) => ({
                            ...p,
                            footer: { ...p.footer, blueprintFooterText: e.target.value },
                          }))
                        }
                        className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#12203A]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: Backup & Data Management */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div className="border-b border-[#CDCDC0] pb-2">
                  <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase">Section 09</span>
                  <h3 className="font-serif text-2xl font-bold text-[#12203A]">Backup, Restore & JSON Management</h3>
                </div>

                <p className="text-sm text-[#3B475C] font-sans leading-relaxed">
                  Export the entire website configuration into a single standalone JSON file for offline backups, or import a previously exported backup file to restore your settings.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Export */}
                  <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[#12203A]">
                      <Download className="w-5 h-5 text-[#C99A2E]" />
                      <h4 className="font-serif font-bold text-lg">Export Content JSON</h4>
                    </div>
                    <p className="text-xs text-[#3B475C]">
                      Downloads a complete snapshot of all titles, texts, officers, events, and categories.
                    </p>
                    <button
                      type="button"
                      onClick={exportJson}
                      className="w-full py-2.5 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] font-mono text-xs uppercase font-bold border border-[#C99A2E] flex items-center justify-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Backup JSON</span>
                    </button>
                  </div>

                  {/* Import */}
                  <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[#12203A]">
                      <Upload className="w-5 h-5 text-[#C99A2E]" />
                      <h4 className="font-serif font-bold text-lg">Import Content JSON</h4>
                    </div>
                    <p className="text-xs text-[#3B475C]">
                      Upload a previously saved JSON snapshot to instantly replace current website content.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 bg-[#EEEEE7] hover:bg-[#E3E3D8] text-[#12203A] font-mono text-xs uppercase font-bold border border-[#CDCDC0] flex items-center justify-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select JSON File</span>
                    </button>
                  </div>
                </div>

                {/* Reset to Factory Defaults */}
                <div className="border-2 border-[#9C3B2E] bg-[#F8ECE9] p-5 space-y-3">
                  <div className="flex items-center gap-2 text-[#9C3B2E]">
                    <AlertTriangle className="w-5 h-5" />
                    <h4 className="font-serif font-bold text-lg">Restore Official Factory Defaults</h4>
                  </div>
                  <p className="text-xs text-[#7F2D22]">
                    Clears all custom edits from your browser storage and resets the site back to the original chapter data specified in the source code.
                  </p>
                  
                  {confirmReset ? (
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          resetToDefaults();
                          setConfirmReset(false);
                          setImportNotice('All content has been reset to factory defaults.');
                          setTimeout(() => setImportNotice(null), 3000);
                        }}
                        className="px-4 py-2 bg-[#9C3B2E] hover:bg-[#7F2D22] text-white font-mono text-xs uppercase font-bold"
                      >
                        Confirm Reset Everything
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmReset(false)}
                        className="px-4 py-2 bg-white border border-[#CDCDC0] text-[#12203A] font-mono text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="py-2.5 px-4 bg-white hover:bg-[#F6F6F2] text-[#9C3B2E] font-mono text-xs uppercase font-bold border border-[#9C3B2E] flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Original Defaults</span>
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
