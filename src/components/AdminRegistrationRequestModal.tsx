import React, { useState } from 'react';
import { useContent, AdminUserRole } from '../context/ContentContext';
import { ShieldCheck, UserPlus, X, CheckCircle2, Lock, Building, FileCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminRegistrationRequestModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { requestAdminAccess } = useContent();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [prcLicense, setPrcLicense] = useState('');
  const [chapterPosition, setChapterPosition] = useState('');
  const [requestedRole, setRequestedRole] = useState<AdminUserRole>('Secretariat Officer');
  const [reason, setReason] = useState('');
  const [passcode, setPasscode] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ reqId: string; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !reason.trim()) {
      setError('Please provide your Full Name, Email, and Justification.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (passcode.trim().length < 6) {
      setError('Please choose a security passcode of at least 6 characters.');
      return;
    }

    const res = requestAdminAccess({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      prcLicense: prcLicense.trim() || 'Pending PRC Verification',
      chapterPosition: chapterPosition.trim() || 'Committee Member',
      requestedRole,
      reason: reason.trim(),
      passcode: passcode.trim(),
    });

    if (!res.success) {
      setError(res.message);
    } else {
      setSuccessInfo({ reqId: res.reqId, message: res.message });
      if (onSuccess) onSuccess();
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPrcLicense('');
    setChapterPosition('');
    setReason('');
    setPasscode('');
    setError(null);
    setSuccessInfo(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-[#12203A]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-left">
      <div className="bg-[#F6F6F2] border-2 border-[#12203A] max-w-lg w-full p-5 sm:p-7 shadow-2xl relative space-y-4 max-h-[94vh] overflow-y-auto">
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-1 hover:bg-[#EEEEE7] border border-[#CDCDC0] text-[#12203A]"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#12203A] text-[#C99A2E]">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono text-[10px] text-[#9C3B2E] font-bold uppercase tracking-wider block">
              Official Chapter Clearance
            </span>
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#12203A]">
              Request Secretariat Admin Access
            </h3>
          </div>
        </div>

        {successInfo ? (
          <div className="p-6 bg-white border border-[#2E7D32] space-y-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto" />
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-[#12203A]">
                Registration Request Submitted!
              </h4>
              <p className="font-mono text-xs text-[#2E7D32] font-bold">
                Tracking Dossier: {successInfo.reqId}
              </p>
            </div>
            <p className="font-mono text-xs text-[#3B475C] leading-relaxed">
              Your administrative access requisition has been officially routed to the Chapter President and Executive
              Board. Upon credential verification, your clearance will be activated.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2 bg-[#12203A] text-[#EEEEE7] font-mono text-xs font-bold uppercase"
              >
                Return to Portal
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs text-[#3B475C] font-mono leading-relaxed">
              Are you an elected Chapter Officer, Committee Chair, or appointed Secretariat Member? Submit this
              clearance request to access website management, CPD event rosters, and member records.
            </p>

            {error && (
              <div className="p-2.5 bg-[#9C3B2E]/10 border border-[#9C3B2E] text-xs font-mono text-[#9C3B2E]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#12203A] font-bold uppercase mb-1">
                  Full Name (with Honorific) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Maria Santos, PECE, ASEAN Eng."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    placeholder="official.email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#12203A] font-bold uppercase mb-1">
                    PRC License Number
                  </label>
                  <input
                    type="text"
                    placeholder="PRC Reg. No. 0012345"
                    value={prcLicense}
                    onChange={(e) => setPrcLicense(e.target.value)}
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#12203A] font-bold uppercase mb-1">
                    Chapter Designation / Committee *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Committee on CPD Accreditation"
                    value={chapterPosition}
                    onChange={(e) => setChapterPosition(e.target.value)}
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[#12203A] font-bold uppercase mb-1">
                    Desired Privilege Role
                  </label>
                  <select
                    value={requestedRole}
                    onChange={(e) => setRequestedRole(e.target.value as AdminUserRole)}
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                  >
                    <option value="Secretariat Officer">Secretariat Officer (Operations)</option>
                    <option value="Auditor / Observer">Auditor / Observer (Read-Only)</option>
                    <option value="Super Admin">Super Admin (Executive Board)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#12203A] font-bold uppercase mb-1">
                  Proposed Security Passcode / Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Choose a secure password (min. 6 characters)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] focus:border-[#12203A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[#12203A] font-bold uppercase mb-1">
                  Justification & Specific Responsibilities *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Briefly state your role in the chapter, reasons for requiring website administration clearance, and assigned tasks..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 bg-white border border-[#CDCDC0] text-xs text-[#12203A] resize-none focus:border-[#12203A] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#CDCDC0]">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-[#EEEEE7] hover:bg-[#E0E0D4] text-[#12203A] font-bold border border-[#CDCDC0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] font-bold border border-[#12203A]"
                >
                  Submit Registration Request →
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
