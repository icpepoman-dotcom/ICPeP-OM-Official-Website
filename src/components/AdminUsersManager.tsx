import React, { useState } from 'react';
import { useContent, AdminUser, AdminUserRole, AccessActionType, WebsiteSecurityMode } from '../context/ContentContext';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Users,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Trash2,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Clock,
  Laptop,
  Smartphone,
  Info,
  ChevronRight,
  UserCheck,
  BadgeCheck,
  Activity,
  Globe,
  Power,
  ShieldX,
  Check,
} from 'lucide-react';

export const AdminUsersManager: React.FC = () => {
  const {
    adminUsers,
    accessLogs,
    currentUser,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    approveAdminRequest,
    rejectAdminRequest,
    clearAccessLogs,
    exportAccessLogsCsv,
    securityMode,
    setSecurityMode,
    activeSessions,
    terminateSession,
    checkClearanceStatus,
  } = useContent();

  const [subTab, setSubTab] = useState<'roster' | 'requests' | 'monitoring' | 'audit-log' | 'policies'>('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [logFilter, setLogFilter] = useState<string>('all');

  // Website Access Clearance Simulator state
  const [testQuery, setTestQuery] = useState('');
  const [testResult, setTestResult] = useState<ReturnType<typeof checkClearanceStatus> | null>(null);
  const [hasTested, setHasTested] = useState(false);

  // Security mode local selection
  const [selectedMode, setSelectedMode] = useState<WebsiteSecurityMode>(securityMode);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [resetPwUser, setResetPwUser] = useState<AdminUser | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // New admin form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('icpep2026');
  const [newUserRole, setNewUserRole] = useState<AdminUserRole>('Secretariat Officer');
  const [newUserPrc, setNewUserPrc] = useState('');
  const [newUserPosition, setNewUserPosition] = useState('');
  const [newUserNotes, setNewUserNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Derived counts
  const pendingRequests = adminUsers.filter((u) => u.status === 'Pending Approval');
  const activeAdmins = adminUsers.filter((u) => u.status === 'Active');
  const suspendedAdmins = adminUsers.filter((u) => u.status === 'Suspended');

  // Filtered Roster
  const filteredUsers = adminUsers.filter((user) => {
    if (user.status === 'Pending Approval' && subTab !== 'requests') return false;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.prcLicense && user.prcLicense.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.chapterPosition && user.chapterPosition.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered Logs
  const filteredLogs = accessLogs.filter((log) => {
    const matchesSearch =
      log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    if (logFilter === 'all') return matchesSearch;
    if (logFilter === 'logins') return matchesSearch && (log.action === 'LOGIN_SUCCESS' || log.action === 'LOGIN_FAILED' || log.action === 'LOGOUT');
    if (logFilter === 'security') return matchesSearch && (log.severity === 'security' || log.severity === 'warning');
    if (logFilter === 'changes') return matchesSearch && (log.action === 'USER_CREATED' || log.action === 'USER_APPROVED' || log.action === 'USER_SUSPENDED' || log.action === 'CONTENT_UPDATED');
    return matchesSearch;
  });

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newUserName.trim() || !newUserEmail.trim()) {
      setFormError('Please fill in Full Name and Official Email.');
      return;
    }

    if (!newUserEmail.includes('@') || !newUserEmail.includes('.')) {
      setFormError('Please provide a valid email address.');
      return;
    }

    const existing = adminUsers.find((u) => u.email.toLowerCase() === newUserEmail.trim().toLowerCase());
    if (existing) {
      setFormError('An admin account with this email already exists.');
      return;
    }

    addAdminUser({
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      password: newUserPassword.trim() || 'icpep2026',
      role: newUserRole,
      prcLicense: newUserPrc.trim() || undefined,
      chapterPosition: newUserPosition.trim() || undefined,
      status: 'Active',
      twoFactorEnabled: false,
      notes: newUserNotes.trim() || undefined,
    });

    // Reset & close
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('icpep2026');
    setNewUserPrc('');
    setNewUserPosition('');
    setNewUserNotes('');
    setIsAddModalOpen(false);
  };

  const handleSavePasswordReset = () => {
    if (!resetPwUser) return;
    if (!newPasswordInput.trim()) {
      alert('Password cannot be empty.');
      return;
    }
    updateAdminUser(resetPwUser.id, { password: newPasswordInput.trim() });
    setResetPwUser(null);
    setNewPasswordInput('');
    alert(`Password for ${resetPwUser.name} has been updated.`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="border-b border-[#CDCDC0] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider">
              Security Clearance & Access Control
            </span>
            <span className="px-2 py-0.5 bg-[#12203A] text-[#C99A2E] text-[10px] font-mono font-bold uppercase">
              RBAC v2.4
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#12203A] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#12203A]" />
            <span>Admin Users & Access Security Monitor</span>
          </h3>
          <p className="text-xs text-[#6A778D] font-mono mt-0.5">
            Provision chapter admin credentials, evaluate registration requests, and inspect real-time website access logs.
          </p>
        </div>

        {/* Current Session Indicator */}
        <div className="flex items-center gap-3 bg-[#EEEEE7] border border-[#CDCDC0] p-2.5">
          <div className="w-8 h-8 rounded-full bg-[#12203A] text-[#C99A2E] flex items-center justify-center font-mono font-bold text-xs">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-[#12203A]">
                {currentUser?.name || 'Super Admin (Master)'}
              </span>
              <span className="px-1.5 py-0.2 bg-[#C99A2E] text-[#12203A] text-[9px] font-mono font-bold uppercase">
                {currentUser?.role || 'Super Admin'}
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#6A778D]">
              {currentUser?.email || 'icpep.oman@gmail.com'}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-[#CDCDC0] p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#6A778D] uppercase">Active Administrators</div>
            <div className="font-serif text-2xl font-bold text-[#12203A]">{activeAdmins.length}</div>
            <div className="font-mono text-[10px] text-[#2E7D32] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Full Authority
            </div>
          </div>
          <div className="p-2 bg-[#EEEEE7] text-[#12203A]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#CDCDC0] p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#6A778D] uppercase">Access Requests</div>
            <div className="font-serif text-2xl font-bold text-[#9C3B2E]">{pendingRequests.length}</div>
            <div className="font-mono text-[10px] text-[#9C3B2E]">
              {pendingRequests.length > 0 ? 'Requires Verification' : 'Queue Clear'}
            </div>
          </div>
          <div className={`p-2 ${pendingRequests.length > 0 ? 'bg-[#9C3B2E]/10 text-[#9C3B2E]' : 'bg-[#EEEEE7] text-[#6A778D]'}`}>
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#CDCDC0] p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#6A778D] uppercase">Suspended / Inactive</div>
            <div className="font-serif text-2xl font-bold text-[#6A778D]">{suspendedAdmins.length}</div>
            <div className="font-mono text-[10px] text-[#6A778D]">Blocked Credentials</div>
          </div>
          <div className="p-2 bg-[#EEEEE7] text-[#6A778D]">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#CDCDC0] p-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] text-[#6A778D] uppercase">Monitored Events</div>
            <div className="font-serif text-2xl font-bold text-[#12203A]">{accessLogs.length}</div>
            <div className="font-mono text-[10px] text-[#12203A] flex items-center gap-1">
              <Clock className="w-3 h-3" /> Live Audit Trail
            </div>
          </div>
          <div className="p-2 bg-[#EEEEE7] text-[#12203A]">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CDCDC0] pb-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setSubTab('roster')}
            className={`px-3 py-1.5 font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'roster'
                ? 'bg-[#12203A] text-[#EEEEE7] border border-[#12203A]'
                : 'bg-white text-[#12203A] border border-[#CDCDC0] hover:bg-[#EEEEE7]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#C99A2E]" />
            <span>Admin Roster ({activeAdmins.length + suspendedAdmins.length})</span>
          </button>

          <button
            onClick={() => setSubTab('requests')}
            className={`px-3 py-1.5 font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'requests'
                ? 'bg-[#12203A] text-[#EEEEE7] border border-[#12203A]'
                : 'bg-white text-[#12203A] border border-[#CDCDC0] hover:bg-[#EEEEE7]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-[#9C3B2E]" />
            <span>Registration Requests</span>
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#9C3B2E] text-white text-[9px] font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('monitoring')}
            className={`px-3 py-1.5 font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'monitoring'
                ? 'bg-[#12203A] text-[#EEEEE7] border border-[#12203A]'
                : 'bg-white text-[#12203A] border border-[#CDCDC0] hover:bg-[#EEEEE7]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Website Access & Live Sessions ({activeSessions.length})</span>
          </button>

          <button
            onClick={() => setSubTab('audit-log')}
            className={`px-3 py-1.5 font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'audit-log'
                ? 'bg-[#12203A] text-[#EEEEE7] border border-[#12203A]'
                : 'bg-white text-[#12203A] border border-[#CDCDC0] hover:bg-[#EEEEE7]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#C99A2E]" />
            <span>Access Monitoring Logs ({accessLogs.length})</span>
          </button>

          <button
            onClick={() => setSubTab('policies')}
            className={`px-3 py-1.5 font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              subTab === 'policies'
                ? 'bg-[#12203A] text-[#EEEEE7] border border-[#12203A]'
                : 'bg-white text-[#12203A] border border-[#CDCDC0] hover:bg-[#EEEEE7]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-[#6A778D]" />
            <span>Security Policies & RBAC</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9C3B2E] hover:bg-[#B54536] text-white font-mono text-xs font-bold transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Admin User</span>
          </button>

          {subTab === 'audit-log' && (
            <div className="flex items-center gap-2">
              <button
                onClick={exportAccessLogsCsv}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#EEEEE7] text-[#12203A] border border-[#CDCDC0] font-mono text-xs transition-colors"
              >
                <Download className="w-3 h-3 text-[#C99A2E]" />
                <span>Export Audit CSV</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Clear all security access logs? This action will be recorded.')) {
                    clearAccessLogs();
                  }
                }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#EEEEE7] hover:bg-[#E0E0D4] text-[#9C3B2E] border border-[#CDCDC0] font-mono text-xs transition-colors"
                title="Purge log cache"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Logs</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: ADMIN ROSTER */}
      {/* ========================================================================= */}
      {subTab === 'roster' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 bg-[#EEEEE7] p-2.5 border border-[#CDCDC0]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-[#6A778D]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search administrator by name, email, PRC license, or position..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#CDCDC0] font-mono text-xs text-[#12203A] placeholder-[#6A778D] focus:outline-hidden focus:border-[#12203A]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#6A778D]" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-white border border-[#CDCDC0] font-mono text-xs text-[#12203A] px-2 py-1.5 focus:outline-hidden"
              >
                <option value="all">All Privilege Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Secretariat Officer">Secretariat Officer</option>
                <option value="Auditor / Observer">Auditor / Observer</option>
              </select>
            </div>
          </div>

          {/* Roster Cards List */}
          <div className="space-y-3">
            {filteredUsers.map((user) => {
              const isSuper = user.role === 'Super Admin';
              const isSuspended = user.status === 'Suspended';

              return (
                <div
                  key={user.id}
                  className={`bg-white border transition-colors p-4 ${
                    isSuspended
                      ? 'border-[#9C3B2E]/40 opacity-75 bg-[#FBF7F7]'
                      : isSuper
                      ? 'border-[#12203A] shadow-xs'
                      : 'border-[#CDCDC0]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 shrink-0 flex items-center justify-center font-mono font-bold text-sm ${
                          isSuper
                            ? 'bg-[#12203A] text-[#C99A2E]'
                            : isSuspended
                            ? 'bg-[#9C3B2E] text-white'
                            : 'bg-[#EEEEE7] text-[#12203A]'
                        }`}
                      >
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-mono text-sm font-bold text-[#12203A]">
                            {user.name}
                          </h4>
                          {/* Role Tag */}
                          <span
                            className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                              user.role === 'Super Admin'
                                ? 'bg-[#12203A] text-[#C99A2E]'
                                : user.role === 'Secretariat Officer'
                                ? 'bg-[#3B475C] text-[#EEEEE7]'
                                : 'bg-[#E3E3D8] text-[#12203A]'
                            }`}
                          >
                            {user.role}
                          </span>
                          {/* Status Tag */}
                          <span
                            className={`px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase ${
                              user.status === 'Active'
                                ? 'bg-[#2E7D32]/10 text-[#2E7D32]'
                                : 'bg-[#9C3B2E]/10 text-[#9C3B2E]'
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#3B475C] font-mono">
                          <span className="flex items-center gap-1 text-[#12203A] font-semibold">
                            {user.email}
                          </span>
                          {user.chapterPosition && (
                            <span className="text-[#6A778D]">
                              Role: <strong className="text-[#12203A]">{user.chapterPosition}</strong>
                            </span>
                          )}
                          {user.prcLicense && (
                            <span className="text-[#6A778D]">
                              PRC: <strong className="text-[#12203A]">{user.prcLicense}</strong>
                            </span>
                          )}
                        </div>

                        {user.notes && (
                          <div className="text-[11px] font-mono text-[#6A778D] italic pt-1">
                            &ldquo;{user.notes}&rdquo;
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-[10px] font-mono text-[#6A778D] pt-1">
                          <span>Ref ID: <strong className="text-[#12203A]">{user.id}</strong></span>
                          <span>Provisioned: {user.createdDate}</span>
                          <span>
                            Last Activity: <strong className="text-[#12203A]">{user.lastLogin || 'Never logged in'}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap sm:flex-col items-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#CDCDC0]">
                      <div className="flex items-center gap-1">
                        {/* Edit Role Modal */}
                        <button
                          onClick={() => setEditingUser(user)}
                          className="px-2 py-1 bg-white hover:bg-[#EEEEE7] border border-[#CDCDC0] font-mono text-[11px] text-[#12203A]"
                          title="Change Role & Position"
                        >
                          Change Role
                        </button>

                        {/* Reset Password Modal */}
                        <button
                          onClick={() => {
                            setResetPwUser(user);
                            setNewPasswordInput('');
                          }}
                          className="px-2 py-1 bg-white hover:bg-[#EEEEE7] border border-[#CDCDC0] font-mono text-[11px] text-[#12203A] flex items-center gap-1"
                          title="Reset user passcode"
                        >
                          <Key className="w-3 h-3 text-[#C99A2E]" />
                          <span>Reset Key</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Suspend / Activate toggle */}
                        <button
                          onClick={() => {
                            const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
                            updateAdminUser(user.id, { status: newStatus });
                          }}
                          className={`px-2 py-1 font-mono text-[11px] border transition-colors ${
                            user.status === 'Active'
                              ? 'bg-white hover:bg-[#9C3B2E]/10 border-[#9C3B2E]/40 text-[#9C3B2E]'
                              : 'bg-[#2E7D32]/10 hover:bg-[#2E7D32]/20 border-[#2E7D32] text-[#2E7D32] font-bold'
                          }`}
                        >
                          {user.status === 'Active' ? 'Suspend Access' : 'Reactivate'}
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Permanently remove administrator ${user.name}?`)) {
                              deleteAdminUser(user.id);
                            }
                          }}
                          className="p-1 hover:bg-[#9C3B2E]/10 text-[#9C3B2E] border border-transparent hover:border-[#9C3B2E]/20"
                          title="Delete Admin Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center bg-white border border-[#CDCDC0]">
                <Users className="w-8 h-8 text-[#6A778D] mx-auto mb-2" />
                <p className="font-mono text-xs text-[#6A778D]">No administrators match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: REGISTRATION REQUESTS */}
      {/* ========================================================================= */}
      {subTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-[#EEEEE7] border border-[#CDCDC0] p-3 text-xs text-[#3B475C] font-mono flex items-start gap-2">
            <Info className="w-4 h-4 text-[#12203A] shrink-0 mt-0.5" />
            <div>
              <strong>Self-Service Admin Registration Requests:</strong> Engineers and committee members can submit
              admin access requests through the public website portal. Super Admins must review their credentials and
              grant appropriate access level before they can log in.
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-12 text-center bg-white border border-[#CDCDC0] space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#2E7D32] mx-auto" />
              <h4 className="font-serif text-lg font-bold text-[#12203A]">All Clear — No Pending Requests</h4>
              <p className="font-mono text-xs text-[#6A778D] max-w-md mx-auto">
                No new access requests are currently awaiting executive review. When an officer or member registers for
                admin clearance via the website, their dossier will appear here for verification.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="bg-white border-2 border-[#9C3B2E]/40 p-4 space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#9C3B2E] text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                          Awaiting Approval
                        </span>
                        <span className="font-mono text-xs text-[#6A778D]">Ref: {req.id}</span>
                        <span className="font-mono text-xs text-[#6A778D]">Date: {req.createdDate}</span>
                      </div>

                      <h4 className="font-serif text-lg font-bold text-[#12203A]">
                        {req.name}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-[#3B475C] pt-1">
                        <div>
                          Email: <strong className="text-[#12203A]">{req.email}</strong>
                        </div>
                        {req.prcLicense && (
                          <div>
                            PRC License: <strong className="text-[#12203A]">{req.prcLicense}</strong>
                          </div>
                        )}
                        {req.chapterPosition && (
                          <div>
                            Proposed Committee: <strong className="text-[#12203A]">{req.chapterPosition}</strong>
                          </div>
                        )}
                        <div>
                          Requested Privilege: <strong className="text-[#9C3B2E]">{req.role}</strong>
                        </div>
                      </div>

                      {req.notes && (
                        <div className="p-2.5 bg-[#EEEEE7] border border-[#CDCDC0] text-xs font-mono text-[#12203A] mt-2">
                          <strong className="text-[#9C3B2E]">Justification / Duties:</strong> {req.notes}
                        </div>
                      )}
                    </div>

                    {/* Decision Actions */}
                    <div className="flex flex-col sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                      <span className="font-mono text-[10px] text-[#6A778D] uppercase">Action Clearance</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => approveAdminRequest(req.id, 'Secretariat Officer')}
                          className="px-2.5 py-1.5 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] font-mono text-xs font-bold transition-colors"
                        >
                          ✓ Approve as Secretariat
                        </button>
                        <button
                          onClick={() => approveAdminRequest(req.id, 'Super Admin')}
                          className="px-2.5 py-1.5 bg-[#C99A2E] hover:bg-[#D9AA3E] text-[#12203A] font-mono text-xs font-bold transition-colors"
                        >
                          ✓ Approve as Super Admin
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Decline access registration for ${req.name}?`)) {
                              rejectAdminRequest(req.id);
                            }
                          }}
                          className="px-2 py-1.5 bg-white hover:bg-[#9C3B2E]/10 text-[#9C3B2E] border border-[#9C3B2E]/30 font-mono text-xs transition-colors"
                        >
                          ✕ Decline
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: WEBSITE ACCESS & LIVE SESSIONS MONITOR */}
      {/* ========================================================================= */}
      {subTab === 'monitoring' && (
        <div className="space-y-6">
          {/* Top Security Banner */}
          <div className="bg-[#12203A] text-white p-4 sm:p-5 border-2 border-[#C99A2E] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#2E7D32] rounded-full animate-ping" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#C99A2E] font-bold">
                  Live Access Surveillance Engine
                </span>
                <span className="px-2 py-0.2 bg-[#1C2F54] text-white font-mono text-[9px] uppercase border border-[#2D4573]">
                  ACTIVE MODE: {securityMode.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Website Access Control & Active Operator Surveillance
              </h4>
              <p className="text-xs font-mono text-[#C4C4B5] max-w-2xl">
                Inspect connected admin consoles, manage website access policies, test user authorization clearance, and terminate unauthorized sessions in real time.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Emergency Action: Terminate all other operator sessions immediately?')) {
                    activeSessions.forEach((s) => {
                      if (s.email.toLowerCase() !== currentUser?.email.toLowerCase()) {
                        terminateSession(s.id);
                      }
                    });
                  }
                }}
                className="px-3 py-2 bg-[#9C3B2E] hover:bg-[#B54536] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Kill Other Sessions</span>
              </button>
            </div>
          </div>

          {/* 1. Website Access Policy Selection */}
          <div className="bg-white border-2 border-[#12203A] p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#CDCDC0] gap-2">
              <div>
                <span className="font-mono text-[10px] text-[#9C3B2E] font-bold uppercase tracking-wider block">
                  Access Enforcement Policy
                </span>
                <h4 className="font-serif text-lg font-bold text-[#12203A]">
                  Website Access Security Level
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#6A778D]">Current Policy:</span>
                <span className="px-2.5 py-1 bg-[#12203A] text-[#C99A2E] font-mono text-xs font-bold uppercase">
                  {securityMode.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Option 1: Public */}
              <div
                onClick={() => setSelectedMode('public')}
                className={`p-4 border-2 cursor-pointer transition-all ${
                  selectedMode === 'public'
                    ? 'border-[#12203A] bg-[#EEEEE7] shadow-sm'
                    : 'border-[#CDCDC0] bg-white hover:border-[#12203A]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#12203A] uppercase">
                    1. Standard Public Access
                  </span>
                  {selectedMode === 'public' && <Check className="w-4 h-4 text-[#2E7D32]" />}
                </div>
                <p className="text-xs text-[#3B475C] font-sans">
                  The website is openly readable by public engineers and visitors. Secretariat Admin Desk is strictly protected by credentials and RBAC.
                </p>
                <div className="mt-3 text-[10px] font-mono text-[#2E7D32] font-bold uppercase">
                  Default Recommended
                </div>
              </div>

              {/* Option 2: Restricted */}
              <div
                onClick={() => setSelectedMode('restricted')}
                className={`p-4 border-2 cursor-pointer transition-all ${
                  selectedMode === 'restricted'
                    ? 'border-[#C99A2E] bg-[#FFF8E1] shadow-sm'
                    : 'border-[#CDCDC0] bg-white hover:border-[#C99A2E]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#12203A] uppercase">
                    2. Members & Officers Only
                  </span>
                  {selectedMode === 'restricted' && <Check className="w-4 h-4 text-[#C99A2E]" />}
                </div>
                <p className="text-xs text-[#3B475C] font-sans">
                  Event RSVP lists, symposium proceedings, and directory records display access gates requiring verified member credentials or admin clearance.
                </p>
                <div className="mt-3 text-[10px] font-mono text-[#C99A2E] font-bold uppercase">
                  Verification Barrier
                </div>
              </div>

              {/* Option 3: High Security */}
              <div
                onClick={() => setSelectedMode('high_security')}
                className={`p-4 border-2 cursor-pointer transition-all ${
                  selectedMode === 'high_security'
                    ? 'border-[#9C3B2E] bg-[#FFEBEE] shadow-sm'
                    : 'border-[#CDCDC0] bg-white hover:border-[#9C3B2E]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#9C3B2E] uppercase">
                    3. High Security & Audit
                  </span>
                  {selectedMode === 'high_security' && <Check className="w-4 h-4 text-[#9C3B2E]" />}
                </div>
                <p className="text-xs text-[#3B475C] font-sans">
                  Heightened audit logging on all interactions, strict rate-limiting on registration requests, and automatic idle session revocation.
                </p>
                <div className="mt-3 text-[10px] font-mono text-[#9C3B2E] font-bold uppercase">
                  Maximum Hardening
                </div>
              </div>
            </div>

            {selectedMode !== securityMode && (
              <div className="pt-3 flex items-center justify-between border-t border-[#CDCDC0]">
                <span className="text-xs font-mono text-[#9C3B2E] font-bold">
                  Policy modification staged. Apply changes to take effect immediately.
                </span>
                <button
                  type="button"
                  onClick={() => setSecurityMode(selectedMode)}
                  className="px-4 py-2 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] font-mono text-xs uppercase font-bold tracking-wider transition-colors"
                >
                  Save Access Policy
                </button>
              </div>
            )}
          </div>

          {/* 2. Active Connected Sessions Table */}
          <div className="bg-white border-2 border-[#12203A] p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#CDCDC0] gap-2">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-[#12203A]" />
                <h4 className="font-serif text-lg font-bold text-[#12203A]">
                  Active Connected Admin Sessions ({activeSessions.length})
                </h4>
              </div>
              <span className="font-mono text-[10px] text-[#6A778D]">
                Surveillance Heartbeat: Active
              </span>
            </div>

            <div className="overflow-x-auto border border-[#CDCDC0]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#EEEEE7] text-[#12203A] uppercase text-[10px] border-b border-[#CDCDC0]">
                  <tr>
                    <th className="py-2.5 px-3">Session Ref</th>
                    <th className="py-2.5 px-3">Operator Name & Role</th>
                    <th className="py-2.5 px-3">IP Address & Location</th>
                    <th className="py-2.5 px-3">Device / Client</th>
                    <th className="py-2.5 px-3">Started</th>
                    <th className="py-2.5 px-3">Activity</th>
                    <th className="py-2.5 px-3 text-right">Access Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CDCDC0] bg-white">
                  {activeSessions.map((session) => {
                    const isSelf = currentUser?.email.toLowerCase() === session.email.toLowerCase();
                    return (
                      <tr key={session.id} className="hover:bg-[#F6F6F2]">
                        <td className="py-2.5 px-3 font-bold text-[#12203A]">
                          {session.id}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-[#12203A] flex items-center gap-1.5">
                            <span>{session.userName}</span>
                            {isSelf && (
                              <span className="px-1.5 py-0.2 bg-[#2E7D32] text-white text-[9px] font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#6A778D]">
                            {session.email} • <span className="text-[#C99A2E] font-bold">{session.role}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-[#3B475C]">
                          {session.ip}
                        </td>
                        <td className="py-2.5 px-3 text-[#6A778D] max-w-[180px] truncate">
                          {session.device}
                        </td>
                        <td className="py-2.5 px-3 text-[#6A778D]">
                          {session.startedAt}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 text-[#2E7D32] font-bold text-[11px]">
                            <span className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full animate-pulse" />
                            {session.lastSeen}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Revoke access for session ${session.id} (${session.userName})?`)) {
                                terminateSession(session.id);
                              }
                            }}
                            className="px-2.5 py-1 bg-[#EEEEE7] hover:bg-[#9C3B2E] text-[#9C3B2E] hover:text-white border border-[#9C3B2E]/40 text-[10px] font-bold uppercase transition-colors"
                          >
                            Terminate Access
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Website Access Clearance Testing Simulator */}
          <div className="bg-white border-2 border-[#12203A] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#CDCDC0] pb-3">
              <Search className="w-5 h-5 text-[#C99A2E]" />
              <div>
                <h4 className="font-serif text-lg font-bold text-[#12203A]">
                  Test User Access Clearance & Permissions
                </h4>
                <p className="text-xs font-mono text-[#6A778D]">
                  Simulate access verification for any registered admin user or member.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Enter email, PRC License, or name to evaluate access permissions..."
                className="flex-grow px-3 py-2 bg-[#F6F6F2] border border-[#12203A] font-mono text-xs text-[#12203A] focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => {
                  if (!testQuery.trim()) return;
                  const res = checkClearanceStatus(testQuery.trim());
                  setTestResult(res);
                  setHasTested(true);
                }}
                className="px-4 py-2 bg-[#12203A] text-white hover:bg-[#1C2F54] font-mono text-xs font-bold uppercase shrink-0"
              >
                Evaluate Clearance
              </button>
            </div>

            {hasTested && (
              <div className="pt-2 animate-fadeIn">
                {testResult?.found ? (
                  <div className="p-4 bg-[#F6F6F2] border-2 border-[#2E7D32] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                        <span className="font-bold text-[#12203A] font-serif text-base">
                          Clearance Confirmed: {testResult.name}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-[#2E7D32] text-white font-mono text-[10px] uppercase font-bold">
                        {testResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs text-[#3B475C]">
                      <div>Email: <strong className="text-[#12203A]">{testResult.email}</strong></div>
                      <div>Role: <strong className="text-[#12203A]">{testResult.roleOrCategory}</strong></div>
                      <div>PRC License: <strong className="text-[#12203A]">{testResult.prcLicense || 'N/A'}</strong></div>
                    </div>

                    {testResult.permissions && (
                      <div className="pt-2 border-t border-[#CDCDC0]">
                        <span className="text-[10px] font-mono uppercase text-[#6A778D] font-bold block mb-1">
                          Live Active Privileges:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {testResult.permissions.map((p, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white border border-[#CDCDC0] text-[10px] font-mono text-[#12203A]">
                              ✓ {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-[#FFEBEE] border border-[#9C3B2E] text-xs font-mono text-[#9C3B2E] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#9C3B2E]" />
                      <span>Access Denied: No authorized credentials registered for &ldquo;{testQuery}&rdquo;.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-2 py-1 bg-[#9C3B2E] text-white font-bold uppercase text-[10px]"
                    >
                      + Register Now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: AUDIT & MONITORING LOGS */}
      {/* ========================================================================= */}
      {subTab === 'audit-log' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-2 bg-[#EEEEE7] p-2.5 border border-[#CDCDC0]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-[#6A778D]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audit trail by operator, email, IP, action, or keyword..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#CDCDC0] font-mono text-xs text-[#12203A] placeholder-[#6A778D] focus:outline-hidden"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#6A778D]" />
              <select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className="bg-white border border-[#CDCDC0] font-mono text-xs text-[#12203A] px-2 py-1.5 focus:outline-hidden"
              >
                <option value="all">All Events</option>
                <option value="logins">Authentication Events (Login/Logout)</option>
                <option value="security">Security & Alerts</option>
                <option value="changes">Administrative & Data Changes</option>
              </select>
            </div>
          </div>

          {/* Logs Feed */}
          <div className="border border-[#CDCDC0] bg-white divide-y divide-[#CDCDC0] font-mono text-xs max-h-[500px] overflow-y-auto">
            {filteredLogs.map((log) => {
              const isSecurity = log.severity === 'security';
              const isWarning = log.severity === 'warning';

              return (
                <div
                  key={log.id}
                  className={`p-3 transition-colors hover:bg-[#EEEEE7]/40 flex flex-col md:flex-row md:items-center justify-between gap-2 ${
                    isSecurity ? 'bg-[#9C3B2E]/5' : isWarning ? 'bg-[#C99A2E]/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Severity Indicator */}
                    <div className="mt-0.5 shrink-0">
                      {isSecurity ? (
                        <AlertTriangle className="w-4 h-4 text-[#9C3B2E]" />
                      ) : isWarning ? (
                        <ShieldAlert className="w-4 h-4 text-[#C99A2E]" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                            isSecurity
                              ? 'bg-[#9C3B2E] text-white'
                              : isWarning
                              ? 'bg-[#C99A2E] text-[#12203A]'
                              : 'bg-[#12203A] text-[#EEEEE7]'
                          }`}
                        >
                          {log.action}
                        </span>

                        <span className="font-bold text-[#12203A]">
                          {log.userName}
                        </span>

                        <span className="text-[#6A778D]">
                          ({log.email})
                        </span>
                      </div>

                      <p className="text-[#3B475C] font-mono text-[11px] leading-relaxed">
                        {log.details}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-[#6A778D] pt-0.5">
                        <span>Device: {log.device}</span>
                        <span>Log ID: {log.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#6A778D] shrink-0 self-start md:self-center font-bold">
                    {log.timestamp}
                  </div>
                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <div className="p-8 text-center text-[#6A778D]">
                No access audit records found matching query.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: POLICIES & HARDENING */}
      {/* ========================================================================= */}
      {subTab === 'policies' && (
        <div className="space-y-4">
          <div className="border border-[#CDCDC0] bg-white p-4 space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase text-[#12203A] border-b border-[#CDCDC0] pb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C99A2E]" />
              <span>Role-Based Access Control (RBAC) Hierarchy</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 bg-[#EEEEE7] border border-[#CDCDC0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#12203A]">Super Admin</span>
                  <span className="px-1.5 py-0.2 bg-[#12203A] text-[#C99A2E] text-[9px] font-bold">ROOT</span>
                </div>
                <p className="text-[11px] text-[#3B475C]">
                  Full executive clearance. Can provision/remove admin users, change site code, export databases, modify
                  officer rosters, and inspect security audit logs.
                </p>
                <div className="text-[10px] text-[#2E7D32] font-bold">✓ Full Read / Write / Delete</div>
              </div>

              <div className="p-3 bg-[#EEEEE7] border border-[#CDCDC0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#12203A]">Secretariat Officer</span>
                  <span className="px-1.5 py-0.2 bg-[#3B475C] text-[#EEEEE7] text-[9px] font-bold">OPERATIONS</span>
                </div>
                <p className="text-[11px] text-[#3B475C]">
                  Administrative operations clearance. Can review member registrations, manage event RSVPs, upload CPD
                  flyers, and update event calendars.
                </p>
                <div className="text-[10px] text-[#2E7D32] font-bold">✓ Content Edit & Registrations</div>
              </div>

              <div className="p-3 bg-[#EEEEE7] border border-[#CDCDC0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#12203A]">Auditor / Observer</span>
                  <span className="px-1.5 py-0.2 bg-[#E3E3D8] text-[#12203A] text-[9px] font-bold">AUDIT</span>
                </div>
                <p className="text-[11px] text-[#3B475C]">
                  Compliance verification clearance. Read-only access to member rosters, event attendance dockets, and
                  financial audit reports. Cannot overwrite site copy.
                </p>
                <div className="text-[10px] text-[#6A778D] font-bold">👁 Read-Only Verified View</div>
              </div>
            </div>
          </div>

          <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-4 space-y-2 font-mono text-xs">
            <h4 className="font-bold text-[#12203A] uppercase">Security Hardening Specifications:</h4>
            <ul className="list-disc list-inside space-y-1 text-[#3B475C] text-[11px]">
              <li>All administrative logins and access denials are recorded in the client tamper-evident audit journal.</li>
              <li>Protection rule: The root Chapter Super Admin account cannot be deleted or locked out.</li>
              <li>All database exports are encrypted with schema verification stamps for regulatory PRC compliance.</li>
              <li>Emergency fallback passcode (`icpep2026`) is reserved for chapter trustee disaster recovery.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PROVISION NEW ADMIN */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 bg-[#12203A]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F6F6F2] border-2 border-[#12203A] max-w-lg w-full p-6 shadow-2xl relative space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-2">
              <h3 className="font-serif text-xl font-bold text-[#12203A] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#9C3B2E]" />
                <span>Provision New Administrator</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 hover:bg-[#EEEEE7] text-[#12203A]"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2 bg-[#9C3B2E]/10 border border-[#9C3B2E] text-xs font-mono text-[#9C3B2E]">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#12203A] font-bold uppercase mb-1">
                  Full Name & Honorific *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Gabriel M. Reyes"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2 bg-white border border-[#CDCDC0] text-sm text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#12203A] font-bold uppercase mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="officer@icpep.ph or gmail"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#12203A] font-bold uppercase mb-1">
                    Initial Password / Passcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] font-bold focus:border-[#12203A] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#12203A] font-bold uppercase mb-1">
                    Privilege Role *
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as AdminUserRole)}
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] font-bold focus:border-[#12203A] focus:outline-hidden"
                  >
                    <option value="Secretariat Officer">Secretariat Officer</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Auditor / Observer">Auditor / Observer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#12203A] font-bold uppercase mb-1">
                    PRC License Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PRC Reg. No. 018241"
                    value={newUserPrc}
                    onChange={(e) => setNewUserPrc(e.target.value)}
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#12203A] font-bold uppercase mb-1">
                  Chapter Designation / Committee
                </label>
                <input
                  type="text"
                  placeholder="e.g. Committee on CPD Accreditation & Professional Development"
                  value={newUserPosition}
                  onChange={(e) => setNewUserPosition(e.target.value)}
                  className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#12203A] font-bold uppercase mb-1">
                  Administrative Notes / Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions or assigned oversight..."
                  value={newUserNotes}
                  onChange={(e) => setNewUserNotes(e.target.value)}
                  className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] resize-none focus:border-[#12203A] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#CDCDC0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#EEEEE7] hover:bg-[#E0E0D4] text-[#12203A] font-bold border border-[#CDCDC0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] font-bold border border-[#12203A]"
                >
                  ✓ Create Administrator Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT ROLE & POSITION */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-60 bg-[#12203A]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F6F6F2] border-2 border-[#12203A] max-w-md w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-2">
              <h3 className="font-serif text-lg font-bold text-[#12203A]">
                Edit Role & Designation: {editingUser.name}
              </h3>
              <button onClick={() => setEditingUser(null)} className="p-1 hover:bg-[#EEEEE7]">
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#12203A] font-bold uppercase mb-1">
                  Privilege Role Level
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value as AdminUserRole })
                  }
                  className="w-full p-2 bg-white border border-[#CDCDC0] font-bold text-[#12203A]"
                >
                  <option value="Super Admin">Super Admin (Full Root Clearance)</option>
                  <option value="Secretariat Officer">Secretariat Officer (Operations)</option>
                  <option value="Auditor / Observer">Auditor / Observer (Read-Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#12203A] font-bold uppercase mb-1">
                  Chapter Designation / Position
                </label>
                <input
                  type="text"
                  value={editingUser.chapterPosition || ''}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, chapterPosition: e.target.value })
                  }
                  className="w-full p-2 bg-white border border-[#CDCDC0] text-[#12203A]"
                />
              </div>

              <div>
                <label className="block text-[#12203A] font-bold uppercase mb-1">
                  PRC License Reference
                </label>
                <input
                  type="text"
                  value={editingUser.prcLicense || ''}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, prcLicense: e.target.value })
                  }
                  className="w-full p-2 bg-white border border-[#CDCDC0] text-[#12203A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#CDCDC0]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 bg-[#EEEEE7] border border-[#CDCDC0]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateAdminUser(editingUser.id, {
                      role: editingUser.role,
                      chapterPosition: editingUser.chapterPosition,
                      prcLicense: editingUser.prcLicense,
                    });
                    setEditingUser(null);
                  }}
                  className="px-4 py-1.5 bg-[#12203A] text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RESET PASSWORD */}
      {/* ========================================================================= */}
      {resetPwUser && (
        <div className="fixed inset-0 z-60 bg-[#12203A]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F6F6F2] border-2 border-[#12203A] max-w-sm w-full p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-2">
              <h3 className="font-serif text-lg font-bold text-[#12203A] flex items-center gap-1.5">
                <Key className="w-4 h-4 text-[#C99A2E]" />
                <span>Reset User Key</span>
              </h3>
              <button onClick={() => setResetPwUser(null)} className="p-1 hover:bg-[#EEEEE7]">
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <p className="text-[#3B475C]">
                Configure a new passcode or password for <strong>{resetPwUser.name}</strong> ({resetPwUser.email}).
              </p>

              <div>
                <label className="block text-[#12203A] font-bold uppercase mb-1">
                  New Password / Key
                </label>
                <input
                  type="text"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="e.g. OmanCpE#2026"
                  className="w-full p-2 bg-white border border-[#CDCDC0] font-bold text-[#12203A] focus:border-[#12203A]"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#CDCDC0]">
                <button
                  type="button"
                  onClick={() => setResetPwUser(null)}
                  className="px-3 py-1.5 bg-[#EEEEE7] border border-[#CDCDC0]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePasswordReset}
                  className="px-4 py-1.5 bg-[#9C3B2E] text-white font-bold"
                >
                  Update Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
