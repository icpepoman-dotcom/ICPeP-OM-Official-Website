import React, { useState } from 'react';
import {
  useContent,
  MemberRegistrationRecord,
  RegistrationStatus,
  EventRsvpRecord,
} from '../context/ContentContext';
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Mail,
  Phone,
  Building,
  GraduationCap,
  ShieldCheck,
  FileSpreadsheet,
  Check,
  Copy,
  Printer,
  Calendar,
  UserCheck,
} from 'lucide-react';

export const RegistrationsManager: React.FC = () => {
  const {
    registrations,
    updateRegistrationStatus,
    deleteRegistration,
    clearAllRegistrations,
    exportRegistrationsCsv,
    addRegistration,
    eventRsvps,
    deleteEventRsvp,
  } = useContent();

  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'rsvps'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedApplicant, setSelectedApplicant] = useState<MemberRegistrationRecord | null>(null);
  const [applicantNotes, setApplicantNotes] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [isAddingWalkIn, setIsAddingWalkIn] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Walk-in form state
  const [walkInForm, setWalkInForm] = useState({
    name: '',
    email: '',
    mobile: '',
    category: 'professional' as 'professional' | 'student' | 'affiliate',
    prcLicense: '',
    civilId: '',
    company: '',
    profession: '',
    qualification: '',
    specialization: '',
    notes: '',
  });

  // Calculate statistics
  const totalCount = registrations.length;
  const pendingCount = registrations.filter((r) => r.status === 'Pending Review').length;
  const verifiedCount = registrations.filter((r) => r.status === 'Verified').length;
  const approvedCount = registrations.filter((r) => r.status === 'Approved').length;
  const clarificationCount = registrations.filter((r) => r.status === 'Requires Clarification').length;

  // Filtered applications
  const filteredRegistrations = registrations.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.referenceId.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.company.toLowerCase().includes(q) ||
      r.profession.toLowerCase().includes(q) ||
      (r.prcLicense && r.prcLicense.toLowerCase().includes(q));

    const matchesStatus = selectedStatus === 'All' || r.status === selectedStatus;
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Filtered RSVPs
  const filteredRsvps = eventRsvps.filter((rsvp) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      rsvp.name.toLowerCase().includes(q) ||
      rsvp.email.toLowerCase().includes(q) ||
      rsvp.eventTitle.toLowerCase().includes(q) ||
      rsvp.ticketRef.toLowerCase().includes(q)
    );
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(text);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const openApplicantDossier = (applicant: MemberRegistrationRecord) => {
    setSelectedApplicant(applicant);
    setApplicantNotes(applicant.notes || '');
  };

  const saveApplicantNotes = () => {
    if (selectedApplicant) {
      updateRegistrationStatus(selectedApplicant.id, selectedApplicant.status, applicantNotes);
      setSelectedApplicant((prev) => (prev ? { ...prev, notes: applicantNotes } : null));
    }
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInForm.name || !walkInForm.email || !walkInForm.mobile) {
      alert('Please provide at least Name, Email, and Mobile number.');
      return;
    }

    const generatedRef = `ICPEP-OMN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const created = addRegistration({
      referenceId: generatedRef,
      name: walkInForm.name,
      email: walkInForm.email,
      mobile: walkInForm.mobile,
      category: walkInForm.category,
      prcLicense: walkInForm.prcLicense,
      civilId: walkInForm.civilId,
      company: walkInForm.company || 'Not Specified',
      profession: walkInForm.profession || 'Computer Engineer',
      qualification: walkInForm.qualification || 'B.S. Computer Engineering',
      specialization: walkInForm.specialization || 'General Practice',
      notes: walkInForm.notes || 'Recorded via Secretariat Walk-in Portal',
    });

    setIsAddingWalkIn(false);
    setWalkInForm({
      name: '',
      email: '',
      mobile: '',
      category: 'professional',
      prcLicense: '',
      civilId: '',
      company: '',
      profession: '',
      qualification: '',
      specialization: '',
      notes: '',
    });
    openApplicantDossier(created);
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase bg-[#12203A] text-[#C99A2E] border border-[#C99A2E] font-bold">
            <CheckCircle2 className="w-3 h-3 text-[#C99A2E]" />
            Approved
          </span>
        );
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase bg-[#EBF3ED] text-[#2E7D32] border border-[#2E7D32] font-bold">
            <Check className="w-3 h-3 text-[#2E7D32]" />
            Verified
          </span>
        );
      case 'Pending Review':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase bg-[#FFF8E1] text-[#B78103] border border-[#B78103] font-bold">
            <Clock className="w-3 h-3 text-[#B78103]" />
            Pending Review
          </span>
        );
      case 'Requires Clarification':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase bg-[#FCEBEB] text-[#9C3B2E] border border-[#9C3B2E] font-bold">
            <AlertTriangle className="w-3 h-3 text-[#9C3B2E]" />
            Clarification
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner and Summary */}
      <div className="border-b border-[#CDCDC0] pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider block">
            Executive Secretariat Desk
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#12203A]">
            Registrations & Applications Registry
          </h3>
          <p className="text-xs text-[#6A778D] font-mono mt-0.5">
            Real-time database of membership registrations, CPD event attendees, and applicant dossiers.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportRegistrationsCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] font-mono text-xs uppercase font-bold border border-[#C99A2E] transition-all"
            title="Download CSV file for Microsoft Excel or Google Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#C99A2E]" />
            <span>Export to CSV / Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingWalkIn(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C99A2E] text-[#12203A] hover:bg-[#D9AA3E] font-mono text-xs uppercase font-bold transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#12203A]" />
            <span>Record Walk-in / Manual</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-[#CDCDC0] p-3 text-left">
          <span className="font-mono text-[10px] uppercase text-[#6A778D] block">Total Applications</span>
          <span className="font-serif font-bold text-2xl text-[#12203A]">{totalCount}</span>
        </div>
        <div className="bg-[#FFF8E1] border border-[#B78103]/40 p-3 text-left">
          <span className="font-mono text-[10px] uppercase text-[#B78103] font-bold block">Pending Review</span>
          <span className="font-serif font-bold text-2xl text-[#B78103]">{pendingCount}</span>
        </div>
        <div className="bg-[#EBF3ED] border border-[#2E7D32]/40 p-3 text-left">
          <span className="font-mono text-[10px] uppercase text-[#2E7D32] font-bold block">Verified</span>
          <span className="font-serif font-bold text-2xl text-[#2E7D32]">{verifiedCount}</span>
        </div>
        <div className="bg-[#12203A] border border-[#C99A2E] p-3 text-left text-[#EEEEE7]">
          <span className="font-mono text-[10px] uppercase text-[#C99A2E] font-bold block">Approved Fellows</span>
          <span className="font-serif font-bold text-2xl text-[#C99A2E]">{approvedCount}</span>
        </div>
        <div className="bg-white border border-[#CDCDC0] p-3 text-left">
          <span className="font-mono text-[10px] uppercase text-[#6A778D] block">Event RSVPs</span>
          <span className="font-serif font-bold text-2xl text-[#12203A]">{eventRsvps.length}</span>
        </div>
      </div>

      {/* Section Sub-Tabs */}
      <div className="flex border-b border-[#CDCDC0] gap-4">
        <button
          type="button"
          onClick={() => setActiveSubTab('applications')}
          className={`pb-2 font-mono text-xs uppercase tracking-wider font-bold border-b-2 transition-colors ${
            activeSubTab === 'applications'
              ? 'border-[#12203A] text-[#12203A]'
              : 'border-transparent text-[#6A778D] hover:text-[#12203A]'
          }`}
        >
          Membership Applications ({registrations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('rsvps')}
          className={`pb-2 font-mono text-xs uppercase tracking-wider font-bold border-b-2 transition-colors ${
            activeSubTab === 'rsvps'
              ? 'border-[#12203A] text-[#12203A]'
              : 'border-transparent text-[#6A778D] hover:text-[#12203A]'
          }`}
        >
          CPD Event RSVPs ({eventRsvps.length})
        </button>
      </div>

      {/* SUB-TAB 1: MEMBERSHIP APPLICATIONS */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-[#EEEEE7] border border-[#CDCDC0] p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#6A778D] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name, Ref ID, Email, PRC No., Company..."
                className="w-full bg-white border border-[#CDCDC0] pl-8 pr-3 py-1.5 text-xs text-[#12203A] font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-mono text-[#6A778D]">
                <Filter className="w-3 h-3" />
                <span>Status:</span>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white border border-[#CDCDC0] py-1 px-2 text-xs font-mono text-[#12203A]"
              >
                <option value="All">All Statuses ({registrations.length})</option>
                <option value="Pending Review">Pending Review ({pendingCount})</option>
                <option value="Verified">Verified ({verifiedCount})</option>
                <option value="Approved">Approved ({approvedCount})</option>
                <option value="Requires Clarification">Clarification ({clarificationCount})</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-[#CDCDC0] py-1 px-2 text-xs font-mono text-[#12203A]"
              >
                <option value="All">All Categories</option>
                <option value="professional">Professional Members</option>
                <option value="student">Student Members</option>
                <option value="affiliate">Affiliate Members</option>
              </select>

              {(searchQuery || selectedStatus !== 'All' || selectedCategory !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedStatus('All');
                    setSelectedCategory('All');
                  }}
                  className="text-xs font-mono text-[#9C3B2E] underline ml-1"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Applications Ledger Table */}
          <div className="border border-[#CDCDC0] bg-white overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#12203A] text-[#EEEEE7] font-mono text-[11px] uppercase tracking-wider border-b border-[#C99A2E]">
                  <th className="py-2.5 px-3 border-r border-[#1C2F54]">Ref / Submission</th>
                  <th className="py-2.5 px-3 border-r border-[#1C2F54]">Applicant Name & Role</th>
                  <th className="py-2.5 px-3 border-r border-[#1C2F54]">Category</th>
                  <th className="py-2.5 px-3 border-r border-[#1C2F54]">PRC / Civil ID</th>
                  <th className="py-2.5 px-3 border-r border-[#1C2F54]">Company / Org</th>
                  <th className="py-2.5 px-3 border-r border-[#1C2F54]">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CDCDC0] text-xs font-sans">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((app) => (
                    <tr key={app.id} className="hover:bg-[#F6F6F2] transition-colors">
                      {/* Ref & Date */}
                      <td className="py-2.5 px-3 border-r border-[#CDCDC0]/60 whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono font-bold text-[#12203A]">
                          <span>{app.referenceId}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(app.referenceId)}
                            className="text-[#6A778D] hover:text-[#12203A]"
                            title="Copy Reference ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-mono text-[10px] text-[#6A778D] block">
                          {app.timestamp}
                        </span>
                      </td>

                      {/* Name & Contact */}
                      <td className="py-2.5 px-3 border-r border-[#CDCDC0]/60">
                        <div className="font-serif font-bold text-[#12203A] text-sm">
                          {app.name}
                        </div>
                        <div className="font-mono text-[10px] text-[#3B475C] flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <Mail className="w-2.5 h-2.5 text-[#C99A2E]" />
                            {app.email}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Phone className="w-2.5 h-2.5 text-[#C99A2E]" />
                            {app.mobile}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-3 border-r border-[#CDCDC0]/60 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase bg-[#EEEEE7] border border-[#CDCDC0] font-bold text-[#12203A]">
                          {app.category}
                        </span>
                      </td>

                      {/* PRC / Civil ID */}
                      <td className="py-2.5 px-3 border-r border-[#CDCDC0]/60 whitespace-nowrap font-mono text-[11px]">
                        <div className="text-[#12203A] font-bold">{app.prcLicense || '—'}</div>
                        <div className="text-[10px] text-[#6A778D]">{app.civilId || '—'}</div>
                      </td>

                      {/* Company & Role */}
                      <td className="py-2.5 px-3 border-r border-[#CDCDC0]/60">
                        <div className="text-[#12203A] font-semibold">{app.company}</div>
                        <div className="text-[11px] text-[#3B475C]">{app.profession}</div>
                      </td>

                      {/* Status & Quick Changer */}
                      <td className="py-2.5 px-3 border-r border-[#CDCDC0]/60 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(app.status)}
                          <select
                            value={app.status}
                            onChange={(e) =>
                              updateRegistrationStatus(app.id, e.target.value as RegistrationStatus)
                            }
                            className="text-[10px] font-mono bg-white border border-[#CDCDC0] py-0.5 px-1 mt-0.5 text-[#12203A]"
                          >
                            <option value="Pending Review">Mark Pending</option>
                            <option value="Verified">Mark Verified</option>
                            <option value="Approved">Mark Approved</option>
                            <option value="Requires Clarification">Mark Clarification</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openApplicantDossier(app)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] text-[11px] font-mono uppercase border border-[#C99A2E]"
                            title="Open full dossier record"
                          >
                            <Eye className="w-3 h-3 text-[#C99A2E]" />
                            <span>Dossier</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete registration ${app.referenceId} (${app.name})?`)) {
                                deleteRegistration(app.id);
                              }
                            }}
                            className="p-1 text-[#9C3B2E] hover:bg-[#FCEBEB] border border-transparent hover:border-[#CDCDC0]"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-xs font-mono text-[#6A778D]">
                      No membership applications match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Meta */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#6A778D] gap-2 pt-1">
            <span>
              SHOWING {filteredRegistrations.length} OF {registrations.length} RECORDED APPLICATIONS
            </span>
            <div className="flex items-center gap-4">
              <span>PRC ACCREDITED CHAPTER REPOSITORY</span>
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-[#9C3B2E] font-bold">Clear all records?</span>
                  <button
                    type="button"
                    onClick={() => {
                      clearAllRegistrations();
                      setConfirmClear(false);
                    }}
                    className="text-[#9C3B2E] underline font-bold"
                  >
                    Confirm Yes
                  </button>
                  <button type="button" onClick={() => setConfirmClear(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="text-[#9C3B2E] hover:underline"
                >
                  Clear Registry
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CPD EVENT RSVPS */}
      {activeSubTab === 'rsvps' && (
        <div className="space-y-4">
          <div className="bg-[#EEEEE7] border border-[#CDCDC0] p-3 flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-[#6A778D] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search RSVPs by Name, Email, Event, Ticket..."
                className="w-full bg-white border border-[#CDCDC0] pl-8 pr-3 py-1.5 text-xs text-[#12203A]"
              />
            </div>
            <span className="font-mono text-xs text-[#6A778D]">
              {eventRsvps.length} Confirmed Reservations
            </span>
          </div>

          <div className="border border-[#CDCDC0] bg-white overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#12203A] text-[#EEEEE7] font-mono text-[11px] uppercase tracking-wider border-b border-[#C99A2E]">
                  <th className="py-2.5 px-3 border-r border-[#1C2F54]">Ticket / Log Time</th>
                  <th className="py-2.5 px-3 border-r border-[#1C2F54]">Event Title</th>
                  <th className="py-2.5 px-3 border-r border-[#1C2F54]">Attendee Name</th>
                  <th className="py-2.5 px-3 border-r border-[#1C2F54]">Email & Contact</th>
                  <th className="py-2.5 px-3 border-r border-[#1C2F54]">PRC Reg. No.</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CDCDC0] text-xs font-sans">
                {filteredRsvps.length > 0 ? (
                  filteredRsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="hover:bg-[#F6F6F2]">
                      <td className="py-2.5 px-3 border-r border-[#CDCDC0]/60 whitespace-nowrap font-mono">
                        <span className="font-bold text-[#12203A]">{rsvp.ticketRef}</span>
                        <span className="block text-[10px] text-[#6A778D]">{rsvp.timestamp}</span>
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#CDCDC0]/60 font-serif font-bold text-[#12203A]">
                        {rsvp.eventTitle}
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#CDCDC0]/60 font-semibold text-[#12203A]">
                        {rsvp.name}
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#CDCDC0]/60 font-mono text-[11px] text-[#3B475C]">
                        <div>{rsvp.email}</div>
                        {rsvp.mobile && <div className="text-[10px] text-[#6A778D]">{rsvp.mobile}</div>}
                      </td>
                      <td className="py-2.5 px-3 border-r border-[#CDCDC0]/60 font-mono text-[11px] text-[#12203A]">
                        {rsvp.prcLicense || 'Non-PRC Attendee'}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove reservation ${rsvp.ticketRef} for ${rsvp.name}?`)) {
                              deleteEventRsvp(rsvp.id);
                            }
                          }}
                          className="text-[#9C3B2E] p-1"
                          title="Delete RSVP"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs font-mono text-[#6A778D]">
                      No event reservations recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* APPLICANT DOSSIER MODAL */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-[#12203A]/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-[#F6F6F2] border-2 border-[#12203A] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#12203A] text-[#EEEEE7] px-4 py-3 border-b-2 border-[#C99A2E] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C99A2E]" />
                <span className="font-serif font-bold text-lg">
                  Applicant Dossier: {selectedApplicant.referenceId}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="p-1 hover:bg-[#1C2F54] text-[#EEEEE7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Top Banner Status Bar */}
              <div className="bg-white border border-[#CDCDC0] p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-[10px] text-[#6A778D] uppercase block">
                    CURRENT VERIFICATION STATUS
                  </span>
                  <div className="mt-1">{getStatusBadge(selectedApplicant.status)}</div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-xs text-[#6A778D] mr-1">Change:</span>
                  <button
                    type="button"
                    onClick={() => {
                      updateRegistrationStatus(selectedApplicant.id, 'Verified');
                      setSelectedApplicant((p) => (p ? { ...p, status: 'Verified' } : null));
                    }}
                    className="px-2 py-1 bg-[#EBF3ED] text-[#2E7D32] border border-[#2E7D32] font-mono text-[10px] uppercase font-bold"
                  >
                    Set Verified
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateRegistrationStatus(selectedApplicant.id, 'Approved');
                      setSelectedApplicant((p) => (p ? { ...p, status: 'Approved' } : null));
                    }}
                    className="px-2 py-1 bg-[#12203A] text-[#C99A2E] border border-[#C99A2E] font-mono text-[10px] uppercase font-bold"
                  >
                    Set Approved
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateRegistrationStatus(selectedApplicant.id, 'Requires Clarification');
                      setSelectedApplicant((p) => (p ? { ...p, status: 'Requires Clarification' } : null));
                    }}
                    className="px-2 py-1 bg-[#FCEBEB] text-[#9C3B2E] border border-[#9C3B2E] font-mono text-[10px] uppercase font-bold"
                  >
                    Clarification
                  </button>
                </div>
              </div>

              {/* Personal & Credential Grid */}
              <div className="bg-white border border-[#CDCDC0] p-4 space-y-4">
                <h4 className="font-mono text-xs font-bold uppercase text-[#12203A] border-b border-[#CDCDC0] pb-1">
                  1. Member Profile & Credentials
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-[#6A778D] uppercase block">Full Legal Name</span>
                    <span className="font-serif font-bold text-base text-[#12203A]">{selectedApplicant.name}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#6A778D] uppercase block">Membership Tier</span>
                    <span className="font-mono font-bold text-[#12203A] uppercase">
                      {selectedApplicant.category} Member
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#6A778D] uppercase block">PRC License Number</span>
                    <span className="font-mono font-bold text-[#9C3B2E]">
                      {selectedApplicant.prcLicense || 'Not Applicable / Student'}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#6A778D] uppercase block">Civil ID (Oman Residency)</span>
                    <span className="font-mono text-[#12203A]">{selectedApplicant.civilId || 'Not Provided'}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#6A778D] uppercase block">Registered Email</span>
                    <a
                      href={`mailto:${selectedApplicant.email}`}
                      className="font-mono text-[#12203A] hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-[#C99A2E]" />
                      {selectedApplicant.email}
                    </a>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#6A778D] uppercase block">Contact / WhatsApp</span>
                    <a
                      href={`tel:${selectedApplicant.mobile}`}
                      className="font-mono text-[#12203A] hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-[#C99A2E]" />
                      {selectedApplicant.mobile}
                    </a>
                  </div>
                </div>
              </div>

              {/* Professional & Academic Record */}
              <div className="bg-white border border-[#CDCDC0] p-4 space-y-4">
                <h4 className="font-mono text-xs font-bold uppercase text-[#12203A] border-b border-[#CDCDC0] pb-1">
                  2. Practice & Academic Background
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-[#6A778D] uppercase block">Current Employer / Org</span>
                    <span className="font-bold text-[#12203A]">{selectedApplicant.company}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#6A778D] uppercase block">Current Role / Designation</span>
                    <span className="text-[#12203A]">{selectedApplicant.profession}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-mono text-[10px] text-[#6A778D] uppercase block">Educational Degree & Alma Mater</span>
                    <span className="text-[#12203A]">{selectedApplicant.qualification}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-mono text-[10px] text-[#6A778D] uppercase block">Engineering Specialization</span>
                    <span className="text-[#3B475C]">{selectedApplicant.specialization}</span>
                  </div>
                </div>
              </div>

              {/* Secretariat Notes Field */}
              <div className="bg-white border border-[#CDCDC0] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-1">
                  <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                    3. Chapter Committee Notes & Audit Trail
                  </h4>
                  <span className="font-mono text-[10px] text-[#6A778D]">Internal Only</span>
                </div>
                <textarea
                  rows={3}
                  value={applicantNotes}
                  onChange={(e) => setApplicantNotes(e.target.value)}
                  placeholder="Record verification notes, bank transfer reference, PRC verification date, or membership committee recommendations..."
                  className="w-full bg-[#EEEEE7] border border-[#CDCDC0] p-2 text-xs text-[#12203A] font-sans"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={saveApplicantNotes}
                    className="px-3 py-1.5 bg-[#12203A] text-[#EEEEE7] text-xs font-mono uppercase font-bold hover:bg-[#1C2F54] border border-[#C99A2E]"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#EEEEE7] px-4 py-3 border-t border-[#CDCDC0] flex items-center justify-between shrink-0">
              <span className="font-mono text-[11px] text-[#6A778D]">
                LOGGED: {selectedApplicant.timestamp}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-white border border-[#CDCDC0] hover:bg-[#E3E3D8] text-xs font-mono uppercase flex items-center gap-1 text-[#12203A]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Dossier</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedApplicant(null)}
                  className="px-4 py-1.5 bg-[#12203A] text-[#EEEEE7] text-xs font-mono uppercase font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WALK-IN / MANUAL REGISTRATION MODAL */}
      {isAddingWalkIn && (
        <div className="fixed inset-0 z-50 bg-[#12203A]/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-[#F6F6F2] border-2 border-[#12203A] w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-[#12203A] text-[#EEEEE7] px-4 py-3 border-b-2 border-[#C99A2E] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#C99A2E]" />
                <span className="font-serif font-bold text-lg">
                  Record Walk-in / Offline Application
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingWalkIn(false)}
                className="p-1 hover:bg-[#1C2F54] text-[#EEEEE7]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase font-bold text-[#12203A] mb-1">
                    Applicant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engr. Juan Dela Cruz"
                    value={walkInForm.name}
                    onChange={(e) => setWalkInForm({ ...walkInForm, name: e.target.value })}
                    className="w-full p-2 bg-white border border-[#CDCDC0]"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase font-bold text-[#12203A] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="juan.delacruz@email.com"
                    value={walkInForm.email}
                    onChange={(e) => setWalkInForm({ ...walkInForm, email: e.target.value })}
                    className="w-full p-2 bg-white border border-[#CDCDC0]"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase font-bold text-[#12203A] mb-1">
                    Mobile / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+968 9123 4567"
                    value={walkInForm.mobile}
                    onChange={(e) => setWalkInForm({ ...walkInForm, mobile: e.target.value })}
                    className="w-full p-2 bg-white border border-[#CDCDC0]"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase font-bold text-[#12203A] mb-1">
                    Membership Tier
                  </label>
                  <select
                    value={walkInForm.category}
                    onChange={(e) =>
                      setWalkInForm({
                        ...walkInForm,
                        category: e.target.value as 'professional' | 'student' | 'affiliate',
                      })
                    }
                    className="w-full p-2 bg-white border border-[#CDCDC0]"
                  >
                    <option value="professional">Professional Member</option>
                    <option value="student">Student Member</option>
                    <option value="affiliate">Affiliate Member</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono uppercase font-bold text-[#12203A] mb-1">
                    PRC License Number
                  </label>
                  <input
                    type="text"
                    placeholder="PRC Reg. No. 00000"
                    value={walkInForm.prcLicense}
                    onChange={(e) => setWalkInForm({ ...walkInForm, prcLicense: e.target.value })}
                    className="w-full p-2 bg-white border border-[#CDCDC0]"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase font-bold text-[#12203A] mb-1">
                    Civil ID (Oman)
                  </label>
                  <input
                    type="text"
                    placeholder="CIV-OM-XXXXXX"
                    value={walkInForm.civilId}
                    onChange={(e) => setWalkInForm({ ...walkInForm, civilId: e.target.value })}
                    className="w-full p-2 bg-white border border-[#CDCDC0]"
                  />
                </div>
                <div>
                  <label className="block font-mono uppercase font-bold text-[#12203A] mb-1">
                    Company / Employer
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Omantel / PDO / NUST"
                    value={walkInForm.company}
                    onChange={(e) => setWalkInForm({ ...walkInForm, company: e.target.value })}
                    className="w-full p-2 bg-white border border-[#CDCDC0]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase font-bold text-[#12203A] mb-1">
                    Degree & University
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.S. Computer Engineering (DLSU, 2018)"
                    value={walkInForm.qualification}
                    onChange={(e) => setWalkInForm({ ...walkInForm, qualification: e.target.value })}
                    className="w-full p-2 bg-white border border-[#CDCDC0]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-mono uppercase font-bold text-[#12203A] mb-1">
                    Secretariat Intake Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Paid in cash at chapter assembly / Submitted printed PRC card."
                    value={walkInForm.notes}
                    onChange={(e) => setWalkInForm({ ...walkInForm, notes: e.target.value })}
                    className="w-full p-2 bg-white border border-[#CDCDC0]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#CDCDC0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingWalkIn(false)}
                  className="px-4 py-2 border border-[#CDCDC0] font-mono text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12203A] text-[#EEEEE7] font-mono text-xs uppercase font-bold border border-[#C99A2E]"
                >
                  Save to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
