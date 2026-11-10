import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { DraftingSectionHeader, TechnicalDivider } from './CircuitMotif';
import {
  Check,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  Copy,
  Download,
  Search,
  Sliders,
  Clock,
  UserCheck,
} from 'lucide-react';

interface RegistrationFormData {
  name: string;
  preferredName: string;
  email: string;
  mobile: string;
  profession: string;
  company: string;
  category: 'professional' | 'student' | 'affiliate';
  qualification: string;
  notes: string;
  certified: boolean;
}

const initialFormData: RegistrationFormData = {
  name: '',
  preferredName: '',
  email: '',
  mobile: '',
  profession: '',
  company: '',
  category: 'professional',
  qualification: '',
  notes: '',
  certified: false,
};

export const Membership: React.FC = () => {
  const { content, addRegistration, findRegistrationByRef, setIsAdminOpen } = useContent();
  const { membership } = content;
  const [formMode, setFormMode] = useState<'register' | 'track'>('register');
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedData, setSubmittedData] = useState<{
    referenceId: string;
    timestamp: string;
    data: RegistrationFormData;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Application tracker state
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedRecord, setTrackedRecord] = useState<any>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  const handleTrackLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    const found = findRegistrationByRef(trackQuery);
    setTrackedRecord(found || null);
    setTrackSearched(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.mobile.trim()) errs.mobile = 'Mobile contact number is required.';
    if (!formData.profession.trim()) errs.profession = 'Current profession/role is required.';
    if (!formData.company.trim()) errs.company = 'Company or institution is required.';
    if (!formData.qualification.trim()) errs.qualification = 'Educational qualification is required.';
    if (!formData.certified) errs.certified = 'You must certify the accuracy of your information.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedRef = `ICPEP-OMN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Store in global registry
      const newRecord = addRegistration({
        referenceId: generatedRef,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        category: formData.category,
        company: formData.company,
        profession: formData.profession,
        qualification: formData.qualification,
        specialization: formData.notes || 'General Computer Engineering',
        notes: 'Submitted via public website registration form',
      });

      setSubmittedData({
        referenceId: newRecord.referenceId,
        timestamp: newRecord.timestamp,
        data: { ...formData },
      });
      setIsSubmitting(false);
    }, 600);
  };

  const handleCopyReference = () => {
    if (submittedData) {
      navigator.clipboard.writeText(submittedData.referenceId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <section id="membership" className="py-12 border-b border-[#CDCDC0] bg-[#EEEEE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <DraftingSectionHeader
          number="02"
          title={membership.title}
          subtitle={membership.subtitle}
          tag="ENROLLMENT & QUALIFICATION"
        />

        {/* Intro Manifesto */}
        <div className="mb-10 text-left border-l-3 border-[#12203A] pl-4 sm:pl-6 max-w-4xl">
          <p className="text-base sm:text-lg text-[#3B475C] font-sans leading-relaxed">
            {membership.intro}
          </p>
        </div>

        {/* Part 1: 7 Member Benefits */}
        <div className="mb-14 text-left">
          <div className="mb-6 border-b border-[#CDCDC0] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div>
              <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider block">
                Privileges & Value
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                7 Member Benefits
              </h3>
            </div>
            <span className="font-mono text-xs text-[#6A778D]">
              CLAUSE 2.1 — CHAPTER ENTITLEMENTS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {membership.benefits.map((benefit, index) => (
              <div
                key={benefit.number}
                className={`border border-[#CDCDC0] bg-[#F6F6F2] p-5 space-y-2 hover:border-[#12203A] transition-colors relative ${
                  index === 0 ? 'lg:col-span-2 bg-[#F6F6F2] border-[#C99A2E]' : ''
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#EEEEE7] bg-[#12203A] px-2 py-0.5 border border-[#C99A2E]">
                    BENEFIT {benefit.number}
                  </span>
                  <span className="text-[#6A778D] text-[10px]">VERIFIED ENTITLEMENT</span>
                </div>
                <h4 className="font-serif font-bold text-lg text-[#12203A] pt-1">
                  {benefit.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#3B475C] font-sans leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Part 2: 3 Membership Categories (Professional, Student, Affiliate) */}
        <div className="mb-14 text-left">
          <div className="mb-6 border-b border-[#CDCDC0] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div>
              <span className="font-mono text-xs text-[#C99A2E] font-bold uppercase tracking-wider block">
                Classification Schedule
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                3 Membership Categories
              </h3>
            </div>
            <span className="font-mono text-xs text-[#6A778D]">
              BY-LAWS SCHEDULE A: ELIGIBILITY & DUES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {membership.categories.map((cat) => (
              <div
                key={cat.id}
                className={`border bg-[#F6F6F2] p-6 flex flex-col justify-between relative transition-all ${
                  cat.isRecommended
                    ? 'border-2 border-[#12203A] shadow-sm'
                    : 'border-[#CDCDC0] hover:border-[#12203A]'
                }`}
              >
                {cat.isRecommended && (
                  <div className="absolute -top-3 right-4 bg-[#C99A2E] text-[#12203A] font-mono font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[#12203A]">
                    Primary Chapter Track
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold text-[#9C3B2E] tracking-wider uppercase">
                      {cat.badge}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#12203A]">
                      {cat.annualFee}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-2xl text-[#12203A] mb-1">
                    {cat.name}
                  </h4>
                  <p className="font-mono text-xs text-[#6A778D] mb-4">
                    {cat.targetAudience}
                  </p>

                  <div className="border-t border-b border-[#CDCDC0] py-3 my-3 space-y-1">
                    <div className="font-mono text-[10px] uppercase font-bold text-[#12203A]">
                      Requirements:
                    </div>
                    <p className="text-xs text-[#3B475C] font-sans leading-relaxed">
                      {cat.requirements}
                    </p>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="font-mono text-[10px] uppercase font-bold text-[#12203A]">
                      Member Privileges:
                    </div>
                    <ul className="space-y-1.5 text-xs text-[#3B475C]">
                      {cat.privileges.map((priv, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#C99A2E] shrink-0 mt-0.5" />
                          <span>{priv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#CDCDC0]">
                  <a
                    href="#membership-register"
                    onClick={() => setFormData((prev) => ({ ...prev, category: cat.id as any }))}
                    className={`w-full py-2.5 px-4 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 border transition-all ${
                      cat.isRecommended
                        ? 'bg-[#12203A] text-[#EEEEE7] border-[#12203A] hover:bg-[#1C2F54]'
                        : 'bg-[#EEEEE7] text-[#12203A] border-[#12203A] hover:bg-[#E3E3D8]'
                    }`}
                  >
                    <span>Apply under {cat.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 3: 5-Step Process Strip */}
        <div className="mb-14 text-left">
          <div className="mb-6 border-b border-[#CDCDC0] pb-3 flex items-baseline justify-between">
            <div>
              <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider block">
                Standard Operating Procedure
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                5-Step Admission Process
              </h3>
            </div>
            <span className="font-mono text-xs text-[#6A778D] hidden sm:inline">
              ENROLLMENT PIPELINE SPECIFICATION
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {membership.processSteps.map((stepItem, idx) => (
              <div
                key={stepItem.step}
                className="border border-[#CDCDC0] bg-[#F6F6F2] p-4 flex flex-col justify-between relative hover:border-[#12203A] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm font-bold bg-[#12203A] text-[#C99A2E] px-2 py-0.5 border border-[#C99A2E]">
                      {stepItem.step}
                    </span>
                    {idx < 4 && (
                      <span className="hidden lg:block font-mono text-xs text-[#CDCDC0]">
                        ──→
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#12203A] mb-1.5">
                    {stepItem.title}
                  </h4>
                  <p className="text-xs text-[#3B475C] font-sans leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#CDCDC0]/50 font-mono text-[9px] text-[#6A778D]">
                  STAGE {idx + 1} OF 5
                </div>
              </div>
            ))}
          </div>
        </div>

        <TechnicalDivider label="SPECIFICATION CLAUSE 2.4: OFFICIAL ENROLLMENT SHEET" />

        {/* Part 4: Registration Form */}
        <div id="membership-register" className="text-left max-w-4xl mx-auto">
          <div className="border-2 border-[#12203A] bg-[#F6F6F2] p-6 sm:p-10 shadow-xs relative">
            {/* Header Docket Stamp */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#CDCDC0] pb-4 mb-6 gap-2">
              <div>
                <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-widest block">
                  Form Ref: ICPEP-OM-REG-2026
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                  Chapter Membership Registration
                </h3>
              </div>
              <div className="font-mono text-xs text-right text-[#6A778D]">
                <div>STATUS: OPEN ROSTER</div>
                <div className="text-[#C99A2E]">CONFIDENTIAL RECORD</div>
              </div>
            </div>

            {/* Mode Selector: Register Form vs Status Tracker */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#CDCDC0] mb-8 gap-3">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormMode('register')}
                  className={`pb-2.5 font-mono text-xs uppercase tracking-wider font-bold border-b-2 transition-colors ${
                    formMode === 'register'
                      ? 'border-[#12203A] text-[#12203A]'
                      : 'border-transparent text-[#6A778D] hover:text-[#12203A]'
                  }`}
                >
                  01 Submit Membership Application
                </button>
                <button
                  type="button"
                  onClick={() => setFormMode('track')}
                  className={`pb-2.5 font-mono text-xs uppercase tracking-wider font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                    formMode === 'track'
                      ? 'border-[#12203A] text-[#12203A]'
                      : 'border-transparent text-[#6A778D] hover:text-[#12203A]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-[#C99A2E]" />
                  <span>02 Track Application Status</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="pb-2.5 font-mono text-[11px] text-[#9C3B2E] hover:underline flex items-center gap-1"
                title="Open Live Secretariat Admin Registry"
              >
                <Sliders className="w-3 h-3" />
                <span>Secretariat Admin Registry</span>
              </button>
            </div>

            {/* TRACK APPLICATION STATUS VIEW */}
            {formMode === 'track' && (
              <div className="space-y-6 text-left">
                <div className="bg-[#EEEEE7] border border-[#CDCDC0] p-6 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-xl text-[#12203A]">
                      Application & Membership Status Lookup
                    </h4>
                    <p className="text-xs text-[#3B475C] font-sans">
                      Check your admission docket standing, PRC verification progress, or chapter endorsement by entering your Reference ID (e.g. <code className="font-mono bg-white px-1">ICPEP-OMN-2026-4821</code>) or registered email address.
                    </p>
                  </div>

                  <form onSubmit={handleTrackLookup} className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#6A778D] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={trackQuery}
                        onChange={(e) => setTrackQuery(e.target.value)}
                        placeholder="Enter Docket Ref (e.g. ICPEP-OMN-2026-4821) or Email..."
                        className="w-full bg-white border border-[#CDCDC0] focus:border-[#12203A] pl-9 pr-3 py-2 text-xs font-mono text-[#12203A]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#12203A] text-[#EEEEE7] font-mono text-xs uppercase font-bold hover:bg-[#1C2F54] border border-[#C99A2E] shrink-0"
                    >
                      Search Docket
                    </button>
                  </form>
                </div>

                {/* Search Result */}
                {trackSearched && (
                  <div>
                    {trackedRecord ? (
                      <div className="border-2 border-[#12203A] bg-[#EEEEE7] p-6 space-y-4 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#CDCDC0] pb-3">
                          <div>
                            <span className="font-mono text-[10px] text-[#6A778D] uppercase block">
                              DOCKET STATUS CONFIRMED
                            </span>
                            <span className="font-serif text-xl font-bold text-[#12203A]">
                              {trackedRecord.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase bg-[#12203A] text-[#C99A2E] border border-[#C99A2E]">
                              {trackedRecord.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                          <div>
                            <span className="text-[#6A778D] block">Docket Reference ID:</span>
                            <span className="text-[#12203A] font-bold text-sm">
                              {trackedRecord.referenceId}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#6A778D] block">Submission Date:</span>
                            <span className="text-[#12203A]">{trackedRecord.timestamp}</span>
                          </div>
                          <div>
                            <span className="text-[#6A778D] block">Membership Category:</span>
                            <span className="text-[#12203A] font-bold uppercase">
                              {trackedRecord.category} Member
                            </span>
                          </div>
                          <div>
                            <span className="text-[#6A778D] block">PRC License:</span>
                            <span className="text-[#9C3B2E] font-bold">
                              {trackedRecord.prcLicense || 'Not applicable / pending'}
                            </span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-[#6A778D] block">Employer / Institution:</span>
                            <span className="text-[#12203A]">
                              {trackedRecord.company} — {trackedRecord.profession}
                            </span>
                          </div>
                          {trackedRecord.notes && (
                            <div className="sm:col-span-2 bg-white p-3 border border-[#CDCDC0]">
                              <span className="text-[#6A778D] block text-[10px] uppercase font-bold mb-1">
                                Secretariat Review Remarks:
                              </span>
                              <p className="text-xs text-[#12203A] font-sans">
                                {trackedRecord.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#CDCDC0]">
                          <span className="text-[11px] font-mono text-[#6A778D]">
                            Need changes? Email secretariat: icpep.oman@gmail.com
                          </span>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-3 py-1 bg-white border border-[#CDCDC0] text-xs font-mono uppercase"
                          >
                            Print Docket Slip
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-[#CDCDC0] bg-white p-8 text-center space-y-3">
                        <AlertCircle className="w-8 h-8 text-[#9C3B2E] mx-auto" />
                        <h5 className="font-serif font-bold text-lg text-[#12203A]">
                          Docket Record Not Found
                        </h5>
                        <p className="text-xs text-[#3B475C] font-sans max-w-md mx-auto">
                          We could not find an application matching <code className="font-mono bg-[#EEEEE7] px-1">{trackQuery}</code>. Please double-check your Reference ID or email, or submit a new application below.
                        </p>
                        <button
                          type="button"
                          onClick={() => setFormMode('register')}
                          className="px-4 py-2 bg-[#12203A] text-[#EEEEE7] text-xs font-mono uppercase font-bold"
                        >
                          Submit New Application
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submission Confirmation Card */}
            {formMode === 'register' && submittedData ? (
              <div className="border border-[#12203A] bg-[#EEEEE7] p-6 sm:p-8 space-y-6 text-left">
                <div className="flex items-center gap-3 border-b border-[#CDCDC0] pb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#C99A2E] shrink-0" />
                  <div>
                    <h4 className="font-serif text-2xl text-[#12203A] font-bold">
                      Registration Docket Generated
                    </h4>
                    <p className="font-mono text-xs text-[#3B475C]">
                      Your application has been recorded in the chapter admission register.
                    </p>
                  </div>
                </div>

                {/* Docket Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F6F6F2] p-4 border border-[#CDCDC0] font-mono text-xs">
                  <div>
                    <span className="text-[#6A778D] block">Application Docket No:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-sm text-[#12203A] bg-[#EEEEE7] px-2 py-0.5 border border-[#12203A]">
                        {submittedData.referenceId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyReference}
                        className="p-1 hover:bg-[#E3E3D8] text-[#3B475C] border border-[#CDCDC0]"
                        title="Copy Docket No."
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {copiedRef && <span className="text-[10px] text-[#C99A2E]">Copied!</span>}
                    </div>
                  </div>

                  <div>
                    <span className="text-[#6A778D] block">Recorded Timestamp:</span>
                    <span className="text-[#12203A] font-semibold block mt-1">
                      {submittedData.timestamp} GST
                    </span>
                  </div>

                  <div>
                    <span className="text-[#6A778D] block">Applicant Name:</span>
                    <span className="text-[#12203A] font-semibold block mt-1">
                      {submittedData.data.name} ({submittedData.data.preferredName || 'No alias'})
                    </span>
                  </div>

                  <div>
                    <span className="text-[#6A778D] block">Category Track:</span>
                    <span className="text-[#C99A2E] font-bold uppercase block mt-1">
                      {submittedData.data.category} Member
                    </span>
                  </div>

                  <div className="sm:col-span-2 border-t border-[#CDCDC0] pt-2">
                    <span className="text-[#6A778D] block">Credentials Declared:</span>
                    <span className="text-[#12203A] block mt-0.5">
                      {submittedData.data.profession} at {submittedData.data.company} — {submittedData.data.qualification}
                    </span>
                  </div>
                </div>

                {/* Next Steps Guide */}
                <div className="border-l-3 border-[#C99A2E] pl-4 space-y-2 text-xs text-[#3B475C]">
                  <div className="font-mono font-bold uppercase text-[#12203A]">
                    Step 2 Required: Submit Verification Documents
                  </div>
                  <p>
                    Please email electronic copies of your <strong>(1) Degree Diploma / Transcript</strong>, <strong>(2) PRC License Card</strong> (if applicable), and <strong>(3) Oman Civil ID copy</strong> to <strong className="text-[#12203A]">icpep.oman@gmail.com</strong> with your docket number <code className="font-mono bg-[#E3E3D8] px-1">{submittedData.referenceId}</code> in the subject line.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#12203A] bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] text-xs font-mono uppercase"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C99A2E]" />
                    <span>Print / Save Docket Slip</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedData(null);
                      setFormData(initialFormData);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#CDCDC0] bg-[#EEEEE7] hover:bg-[#E3E3D8] text-[#12203A] text-xs font-mono uppercase"
                  >
                    <span>Submit Another Application</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Row 1: Name & Preferred Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div id="field-name" className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase tracking-wider">
                      Full Legal Name <span className="text-[#9C3B2E]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Engr. Juan Dela Cruz"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden px-3.5 py-2.5 text-sm text-[#12203A] font-sans"
                    />
                    {errors.name && (
                      <p className="font-mono text-xs text-[#9C3B2E] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div id="field-preferredName" className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase tracking-wider">
                      Preferred / Badge Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Juan / JD"
                      value={formData.preferredName}
                      onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                      className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden px-3.5 py-2.5 text-sm text-[#12203A] font-sans"
                    />
                    <span className="font-mono text-[10px] text-[#6A778D]">Printed on chapter ID card</span>
                  </div>
                </div>

                {/* Row 2: Email & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div id="field-email" className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase tracking-wider">
                      Email Address <span className="text-[#9C3B2E]">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="juan.delacruz@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden px-3.5 py-2.5 text-sm text-[#12203A] font-sans"
                    />
                    {errors.email && (
                      <p className="font-mono text-xs text-[#9C3B2E] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div id="field-mobile" className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase tracking-wider">
                      Mobile / WhatsApp Number <span className="text-[#9C3B2E]">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+968 9123 4567"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden px-3.5 py-2.5 text-sm text-[#12203A] font-sans"
                    />
                    {errors.mobile && (
                      <p className="font-mono text-xs text-[#9C3B2E] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.mobile}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Profession & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div id="field-profession" className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase tracking-wider">
                      Profession / Job Title <span className="text-[#9C3B2E]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Systems Engineer / IT Specialist"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden px-3.5 py-2.5 text-sm text-[#12203A] font-sans"
                    />
                    {errors.profession && (
                      <p className="font-mono text-xs text-[#9C3B2E] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.profession}
                      </p>
                    )}
                  </div>

                  <div id="field-company" className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase tracking-wider">
                      Company / Organization / University <span className="text-[#9C3B2E]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Omantel / PDO / Student"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden px-3.5 py-2.5 text-sm text-[#12203A] font-sans"
                    />
                    {errors.company && (
                      <p className="font-mono text-xs text-[#9C3B2E] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 4: Category Dropdown & Qualification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div id="field-category" className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase tracking-wider">
                      Membership Category <span className="text-[#9C3B2E]">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as 'professional' | 'student' | 'affiliate',
                        })
                      }
                      className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden px-3.5 py-2.5 text-sm text-[#12203A] font-sans"
                    >
                      <option value="professional">Professional Member (BSCpE / PRC Licensed)</option>
                      <option value="student">Student Member (Undergraduate Computing)</option>
                      <option value="affiliate">Affiliate Member (Allied IT / Data / Software)</option>
                    </select>
                    <span className="font-mono text-[10px] text-[#6A778D]">
                      Fee schedule applies according to By-Laws
                    </span>
                  </div>

                  <div id="field-qualification" className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase tracking-wider">
                      Highest Qualification / License No. <span className="text-[#9C3B2E]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., BS Computer Engineering / PRC CpE No. 12345"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden px-3.5 py-2.5 text-sm text-[#12203A] font-sans"
                    />
                    {errors.qualification && (
                      <p className="font-mono text-xs text-[#9C3B2E] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.qualification}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 5: Notes / Specializations */}
                <div id="field-notes" className="space-y-1">
                  <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase tracking-wider">
                    Technical Notes / Specializations / Committee Interest
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your technical focus (Cloud, Cyber, Embedded, AI, Networks) or interest in joining chapter committees..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden p-3.5 text-sm text-[#12203A] font-sans resize-none"
                  />
                </div>

                {/* Certification Checkbox */}
                <div id="field-certified" className="border-t border-[#CDCDC0] pt-4 space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.certified}
                      onChange={(e) => setFormData({ ...formData, certified: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded-none accent-[#12203A] border-[#CDCDC0]"
                    />
                    <span className="text-xs sm:text-sm text-[#3B475C] font-sans">
                      <strong className="text-[#12203A]">Certification & Compliance Declaration:</strong> I hereby certify that the information provided is accurate and verifiable. I agree to abide by the ICpEP Code of Professional Ethics, PRC regulatory standards, and the Chapter By-Laws of the Sultanate of Oman.
                    </span>
                  </label>
                  {errors.certified && (
                    <p className="font-mono text-xs text-[#9C3B2E] flex items-center gap-1 pl-7">
                      <AlertCircle className="w-3 h-3" /> {errors.certified}
                    </p>
                  )}
                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-[#CDCDC0] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="font-mono text-[11px] text-[#6A778D] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C99A2E]" />
                    <span>Data Privacy Act & Secretarial Protocol Protected</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] px-8 py-3.5 text-xs font-mono uppercase tracking-wider border border-[#12203A] hover:border-[#C99A2E] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Processing Docket...</span>
                    ) : (
                      <>
                        <FileCheck2 className="w-4 h-4 text-[#C99A2E]" />
                        <span>Submit Registration Sheet</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 pt-4 border-t border-[#CDCDC0] font-mono text-[10px] text-[#6A778D]">
              {membership.formNotes}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
