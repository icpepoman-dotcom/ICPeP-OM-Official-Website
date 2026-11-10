import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { AdminRegistrationRequestModal } from './AdminRegistrationRequestModal';
import {
  ShieldCheck,
  UserPlus,
  Sliders,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Users,
  Activity,
  ArrowRight,
  FileCheck,
  Eye,
  KeyRound,
  Laptop,
} from 'lucide-react';

export const AdminDeskPortalSection: React.FC = () => {
  const {
    setIsAdminOpen,
    isAuthenticated,
    currentUser,
    adminUsers,
    accessLogs,
    activeSessions,
    securityMode,
    checkClearanceStatus,
  } = useContent();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<ReturnType<typeof checkClearanceStatus> | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const pendingRequests = adminUsers.filter((u) => u.status === 'Pending Approval');
  const activeAdmins = adminUsers.filter((u) => u.status === 'Active');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const res = checkClearanceStatus(searchQuery.trim());
    setSearchResult(res);
    setHasSearched(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResult(null);
    setHasSearched(false);
  };

  return (
    <section id="admin-desk-portal" className="border-b-2 border-[#12203A] bg-[#EEEEE7] text-left relative overflow-hidden">
      {/* Drafting boundary and top tech spec rule */}
      <div className="bg-[#12203A] text-[#EEEEE7] px-4 py-2 border-b border-[#C99A2E]/40 font-mono text-[11px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#C99A2E] inline-block animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[#C99A2E]">
            GOVERNANCE SPEC: 09 / ACCESS CONTROL & SECRETARIAT DESK
          </span>
          <span className="text-[#C4C4B5] hidden sm:inline">|</span>
          <span className="text-[#C4C4B5] hidden sm:inline">PORTAL CLEARANCE & MONITORING DESK</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#EEEEE7]">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
            <span className="font-bold">SECURITY MONITOR: ACTIVE</span>
          </span>
          <span className="text-[#C4C4B5]">|</span>
          <span className="text-[#C99A2E] uppercase">MODE: {securityMode.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#CDCDC0]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#9C3B2E]" />
              <span>Official Chapter Administration & Access Desk</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#12203A] tracking-tight">
              Admin Desk & Website Access Control
            </h2>
            <p className="text-sm sm:text-base text-[#3B475C] font-sans max-w-2xl leading-relaxed">
              Securely monitor who can access the ICpEP-Oman portal, provision administrative clearance, register new chapter officers, and verify credentials against our accredited APO registry.
            </p>
          </div>

          {/* Quick Dual Action Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-2 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] px-5 py-3 text-xs sm:text-sm font-mono tracking-wider uppercase border border-[#12203A] hover:border-[#C99A2E] transition-all shadow-md group"
            >
              <Sliders className="w-4 h-4 text-[#C99A2E] group-hover:rotate-45 transition-transform" />
              <span className="font-bold">Launch Admin Desk</span>
              {pendingRequests.length > 0 && (
                <span className="px-1.5 py-0.2 bg-[#9C3B2E] text-white text-[10px] font-bold">
                  {pendingRequests.length} PENDING
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F6F6F2] text-[#12203A] px-5 py-3 text-xs sm:text-sm font-mono tracking-wider uppercase border-2 border-[#12203A] hover:border-[#C99A2E] transition-all shadow-sm group"
            >
              <UserPlus className="w-4 h-4 text-[#9C3B2E]" />
              <span className="font-bold">Register Admin User</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#12203A] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Real-time Status Metric Ribbons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
          <div className="bg-white border-2 border-[#12203A] p-4 shadow-sm">
            <div className="font-mono text-[10px] text-[#6A778D] uppercase tracking-wider flex items-center justify-between">
              <span>Admin Desk Operators</span>
              <Users className="w-3.5 h-3.5 text-[#12203A]" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#12203A] mt-1">
              {activeAdmins.length}
            </div>
            <div className="text-[11px] font-mono text-[#2E7D32] flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Full Clearance Roster</span>
            </div>
          </div>

          <div className="bg-white border-2 border-[#12203A] p-4 shadow-sm">
            <div className="font-mono text-[10px] text-[#6A778D] uppercase tracking-wider flex items-center justify-between">
              <span>Registration Queue</span>
              <UserPlus className="w-3.5 h-3.5 text-[#9C3B2E]" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#9C3B2E] mt-1">
              {pendingRequests.length}
            </div>
            <div className="text-[11px] font-mono text-[#9C3B2E] mt-1">
              {pendingRequests.length > 0 ? 'Action Required in Desk' : 'All Clear • No Pending'}
            </div>
          </div>

          <div className="bg-white border-2 border-[#12203A] p-4 shadow-sm">
            <div className="font-mono text-[10px] text-[#6A778D] uppercase tracking-wider flex items-center justify-between">
              <span>Active Sessions</span>
              <Activity className="w-3.5 h-3.5 text-[#C99A2E]" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#12203A] mt-1">
              {activeSessions.length}
            </div>
            <div className="text-[11px] font-mono text-[#12203A] mt-1">
              Live Connected Operators
            </div>
          </div>

          <div className="bg-white border-2 border-[#12203A] p-4 shadow-sm">
            <div className="font-mono text-[10px] text-[#6A778D] uppercase tracking-wider flex items-center justify-between">
              <span>Audited Access Events</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#12203A]" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#12203A] mt-1">
              {accessLogs.length}
            </div>
            <div className="text-[11px] font-mono text-[#6A778D] mt-1">
              256-Bit Cryptographic Trail
            </div>
          </div>
        </div>

        {/* 2-Column Core Control Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Access Clearance Status Verification Tool */}
          <div className="lg:col-span-7 bg-white border-2 border-[#12203A] p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-[#C99A2E]" />
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#12203A]">
                  Check Website & Admin Access Clearance
                </h3>
              </div>
              <span className="font-mono text-[10px] text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 font-bold uppercase">
                Live Verification
              </span>
            </div>

            <p className="text-xs text-[#3B475C] font-mono">
              Enter your official email address, full name, or PRC License number to verify your authorization level, registered role, and portal access rights.
            </p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., icpep.oman@gmail.com, PRC No. 008129, or Engr. Del Rosario"
                  className="w-full px-3.5 py-2.5 bg-[#F6F6F2] border border-[#12203A] text-xs font-mono text-[#12203A] focus:outline-hidden focus:ring-1 focus:ring-[#C99A2E]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] font-mono text-xs uppercase font-bold tracking-wider transition-colors shrink-0"
              >
                Verify Access
              </button>
              {hasSearched && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-3 py-2.5 bg-[#EEEEE7] text-[#3B475C] hover:bg-[#CDCDC0] font-mono text-xs transition-colors shrink-0"
                >
                  Reset
                </button>
              )}
            </form>

            {/* Clearance Results Display */}
            {hasSearched && (
              <div className="mt-4 pt-4 border-t border-[#CDCDC0] animate-fadeIn">
                {searchResult?.found ? (
                  <div className={`p-4 border-2 ${
                    searchResult.status === 'Active' || searchResult.status === 'Approved'
                      ? 'bg-[#E8F5E9]/50 border-[#2E7D32]'
                      : searchResult.status === 'Pending Approval' || searchResult.status === 'Pending Review'
                      ? 'bg-[#FFF8E1] border-[#C99A2E]'
                      : 'bg-[#FFEBEE] border-[#9C3B2E]'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#12203A] text-white">
                          {searchResult.type === 'admin' ? 'ADMINISTRATIVE OPERATOR' : 'GENERAL CHAPTER MEMBER'}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-[#12203A] mt-2">
                          {searchResult.name}
                        </h4>
                        <div className="text-xs font-mono text-[#3B475C] mt-0.5">
                          {searchResult.email}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block px-2.5 py-1 text-xs font-mono font-bold uppercase ${
                          searchResult.status === 'Active' || searchResult.status === 'Approved'
                            ? 'bg-[#2E7D32] text-white'
                            : searchResult.status === 'Pending Approval' || searchResult.status === 'Pending Review'
                            ? 'bg-[#C99A2E] text-[#12203A]'
                            : 'bg-[#9C3B2E] text-white'
                        }`}>
                          {searchResult.status}
                        </span>
                        <div className="text-[10px] font-mono text-[#6A778D] mt-1">
                          Role: {searchResult.roleOrCategory}
                        </div>
                      </div>
                    </div>

                    {searchResult.prcLicense && (
                      <div className="mt-3 pt-2 border-t border-[#CDCDC0]/60 text-xs font-mono text-[#12203A] flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                        <span>Credential: {searchResult.prcLicense}</span>
                      </div>
                    )}

                    {searchResult.notes && (
                      <div className="mt-1 text-xs font-sans text-[#3B475C] italic">
                        &ldquo;{searchResult.notes}&rdquo;
                      </div>
                    )}

                    {searchResult.permissions && searchResult.permissions.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-[#CDCDC0]/60 space-y-1">
                        <div className="text-[10px] font-mono uppercase text-[#6A778D] font-bold">
                          Authorized Access Scope:
                        </div>
                        <ul className="text-xs font-mono text-[#12203A] space-y-0.5">
                          {searchResult.permissions.map((p, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-[#2E7D32] inline-block" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {searchResult.type === 'admin' && (
                      <div className="mt-4 pt-3 border-t border-[#CDCDC0]/60 flex items-center justify-between">
                        <span className="text-xs font-mono text-[#12203A]">
                          Ready to access administrative controls?
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAdminOpen(true)}
                          className="px-3 py-1 bg-[#12203A] text-[#C99A2E] text-xs font-mono uppercase font-bold hover:bg-[#1C2F54] transition-colors"
                        >
                          Launch Desk →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-[#FFEBEE] border border-[#9C3B2E] text-[#9C3B2E] text-xs font-mono space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 text-[#9C3B2E]" />
                      <span>No Authorized Record Located</span>
                    </div>
                    <p>
                      No administrative or member credentials match &ldquo;{searchQuery}&rdquo;.
                      If you are an ICpEP-Oman chapter officer, submit an official clearance application below to receive admin privileges.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9C3B2E] text-white font-mono text-xs uppercase font-bold hover:bg-[#7D2E24] transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Submit Admin Registration Request</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick Demo Pre-sets */}
            {!hasSearched && (
              <div className="pt-2 text-xs font-mono text-[#6A778D] space-y-1.5">
                <span className="text-[10px] uppercase font-bold block text-[#12203A]">
                  Quick Verification Queries:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('icpep.oman@gmail.com');
                      setSearchResult(checkClearanceStatus('icpep.oman@gmail.com'));
                      setHasSearched(true);
                    }}
                    className="px-2 py-1 bg-[#EEEEE7] hover:bg-[#E3E3D8] border border-[#CDCDC0] text-[#12203A] text-[11px]"
                  >
                    Super Admin: icpep.oman@gmail.com
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('secretariat.oman@icpep.ph');
                      setSearchResult(checkClearanceStatus('secretariat.oman@icpep.ph'));
                      setHasSearched(true);
                    }}
                    className="px-2 py-1 bg-[#EEEEE7] hover:bg-[#E3E3D8] border border-[#CDCDC0] text-[#12203A] text-[11px]"
                  >
                    Secretariat: secretariat.oman@icpep.ph
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('arnel.valencia@telecom.om');
                      setSearchResult(checkClearanceStatus('arnel.valencia@telecom.om'));
                      setHasSearched(true);
                    }}
                    className="px-2 py-1 bg-[#EEEEE7] hover:bg-[#E3E3D8] border border-[#CDCDC0] text-[#9C3B2E] text-[11px]"
                  >
                    Pending Request: arnel.valencia@telecom.om
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Portal Monitoring Controls & Registration Clearance CTA */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Admin Desk Status Card */}
            <div className="bg-[#12203A] text-[#EEEEE7] p-6 border-2 border-[#C99A2E] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#1C2F54] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C99A2E]" />
                  <span className="font-serif font-bold text-lg text-white">
                    Secretariat Desk Portal
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-[#C99A2E] text-[#12203A] font-bold px-2 py-0.5 uppercase">
                  LIVE CONTROL
                </span>
              </div>

              <div className="text-xs font-mono space-y-2 text-[#C4C4B5]">
                <div className="flex items-center justify-between">
                  <span>Current Operator Status:</span>
                  <span className="font-bold text-white">
                    {isAuthenticated ? (currentUser?.name || 'Super Admin') : 'Unauthenticated (Guest)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Authorized Role:</span>
                  <span className="text-[#C99A2E] font-bold">
                    {isAuthenticated ? currentUser?.role : 'Guest / Viewer'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Portal Encryption:</span>
                  <span className="text-[#2E7D32] font-bold">PRC-RBAC Active</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C2F54] space-y-2">
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(true)}
                  className="w-full py-2.5 px-4 bg-[#C99A2E] hover:bg-[#B38722] text-[#12203A] font-mono text-xs uppercase font-bold tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4" />
                  <span>{isAuthenticated ? 'Open Secretariat Console' : 'Sign In to Admin Desk'}</span>
                </button>

                <p className="text-[10px] font-mono text-[#C4C4B5] text-center">
                  Press <kbd className="bg-[#1C2F54] px-1.5 py-0.5 border border-[#2D4573] text-white">Ctrl</kbd> + <kbd className="bg-[#1C2F54] px-1.5 py-0.5 border border-[#2D4573] text-white">Shift</kbd> + <kbd className="bg-[#1C2F54] px-1.5 py-0.5 border border-[#2D4573] text-white">A</kbd> anywhere to trigger desk.
                </p>
              </div>
            </div>

            {/* Officer Registration Clearance Card */}
            <div className="bg-white border-2 border-[#12203A] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#9C3B2E] text-white">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] text-[#9C3B2E] uppercase font-bold tracking-wider block">
                    Officer Enrollment
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#12203A]">
                    Register as an Administrator
                  </h4>
                </div>
              </div>

              <p className="text-xs text-[#3B475C] font-sans leading-relaxed">
                Appointed chapter officers, symposium committee chairs, and secretariat deputies must submit their PRC credentials for clearance to receive console administrative access.
              </p>

              <div className="p-3 bg-[#F6F6F2] border border-[#CDCDC0] space-y-1.5 text-xs font-mono text-[#12203A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>PRC License verification required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Super Admin review & approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Full access logging & audit protection</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full py-2.5 px-4 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] font-mono text-xs uppercase font-bold tracking-wider border border-[#12203A] hover:border-[#C99A2E] transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-[#C99A2E]" />
                <span>Submit Admin User Registration Request</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Admin Registration Request Modal */}
      <AdminRegistrationRequestModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </section>
  );
};
