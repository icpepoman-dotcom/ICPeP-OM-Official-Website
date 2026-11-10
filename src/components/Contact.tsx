import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { DraftingSectionHeader, TechnicalDivider } from './CircuitMotif';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Linkedin,
  Facebook,
  Github,
  MessageSquare,
} from 'lucide-react';

interface ContactFormData {
  name: string;
  org: string;
  email: string;
  subject: string;
  message: string;
}

const initialContactState: ContactFormData = {
  name: '',
  org: '',
  email: '',
  subject: '',
  message: '',
};

export const Contact: React.FC = () => {
  const { content } = useContent();
  const { contact } = content;
  const [formData, setFormData] = useState<ContactFormData>(initialContactState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    ticketId: string;
    timestamp: string;
  } | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email format.';
    }
    if (!formData.subject.trim()) errs.subject = 'Please enter a message subject.';
    if (!formData.message.trim()) errs.message = 'Please enter your message or query.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const ticket = `TKT-OMN-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedReceipt({
        ticketId: ticket,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setIsSubmitting(false);
    }, 600);
  };

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-[#C99A2E]" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-[#C99A2E]" />;
      case 'github':
        return <Github className="w-4 h-4 text-[#C99A2E]" />;
      default:
        return <MessageSquare className="w-4 h-4 text-[#C99A2E]" />;
    }
  };

  return (
    <section id="contact" className="py-12 border-b border-[#CDCDC0] bg-[#EEEEE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <DraftingSectionHeader
          number="07"
          title={contact.title}
          subtitle={contact.subtitle}
          tag="COMMUNICATIONS DESK"
        />

        {/* Intro */}
        <div className="mb-10 text-left border-l-3 border-[#12203A] pl-4 sm:pl-6 max-w-4xl">
          <p className="text-base sm:text-lg text-[#3B475C] font-sans leading-relaxed">
            {contact.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="border-2 border-[#12203A] bg-[#F6F6F2] p-6 sm:p-8 relative shadow-xs">
              <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-3 mb-6 font-mono text-xs">
                <span className="text-[#9C3B2E] font-bold uppercase">
                  DISPATCH TRANSMISSION FORM
                </span>
                <span className="text-[#6A778D]">SEC-TKT-LOG</span>
              </div>

              {submittedReceipt ? (
                <div className="py-8 px-4 text-center space-y-4 bg-[#EEEEE7] border border-[#CDCDC0]">
                  <CheckCircle2 className="w-10 h-10 text-[#C99A2E] mx-auto" />
                  <h4 className="font-serif text-2xl font-bold text-[#12203A]">
                    Transmission Dispatched
                  </h4>
                  <p className="text-xs sm:text-sm text-[#3B475C] max-w-md mx-auto font-sans leading-relaxed">
                    Your communication has been logged under docket reference{' '}
                    <strong className="font-mono text-[#12203A] bg-[#F6F6F2] px-2 py-0.5 border border-[#12203A]">
                      {submittedReceipt.ticketId}
                    </strong>
                    . The secretariat will respond within 24–48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedReceipt(null);
                      setFormData(initialContactState);
                    }}
                    className="mt-4 px-6 py-2.5 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] text-xs font-mono uppercase tracking-wider border border-[#C99A2E]"
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name and Org */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase">
                        Your Full Name <span className="text-[#9C3B2E]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Engr. Juan Dela Cruz"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden p-2.5 text-sm text-[#12203A]"
                      />
                      {errors.name && (
                        <p className="font-mono text-xs text-[#9C3B2E] flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase">
                        Organization / Affiliation
                      </label>
                      <input
                        type="text"
                        placeholder="Company, University, or Agency"
                        value={formData.org}
                        onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                        className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden p-2.5 text-sm text-[#12203A]"
                      />
                    </div>
                  </div>

                  {/* Email & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase">
                        Email Address <span className="text-[#9C3B2E]">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="juan@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden p-2.5 text-sm text-[#12203A]"
                      />
                      {errors.email && (
                        <p className="font-mono text-xs text-[#9C3B2E] flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase">
                        Subject / Topic <span className="text-[#9C3B2E]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CPD Inquiry / Membership Validation"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden p-2.5 text-sm text-[#12203A]"
                      />
                      {errors.subject && (
                        <p className="font-mono text-xs text-[#9C3B2E] flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="block font-mono text-xs font-semibold text-[#12203A] uppercase">
                      Message / Technical Specification <span className="text-[#9C3B2E]">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Please write your detailed message or question for the secretariat..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#EEEEE7] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden p-3 text-sm text-[#12203A] resize-none"
                    />
                    {errors.message && (
                      <p className="font-mono text-xs text-[#9C3B2E] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#CDCDC0]">
                    <span className="font-mono text-[10px] text-[#6A778D]">
                      {contact.formNotice}
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] px-6 py-3 text-xs font-mono uppercase tracking-wider border border-[#C99A2E] transition-all"
                    >
                      <Send className="w-3.5 h-3.5 text-[#C99A2E]" />
                      <span>{isSubmitting ? 'Transmitting...' : 'Send Message'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Org Contact Details & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Details Card */}
            <div className="border border-[#CDCDC0] bg-[#F6F6F2] p-6 space-y-4">
              <div className="border-b border-[#CDCDC0] pb-2">
                <span className="font-mono text-xs text-[#C99A2E] font-bold uppercase tracking-wider block">
                  Official Channels
                </span>
                <h4 className="font-serif font-bold text-xl text-[#12203A]">
                  Secretariat Directory
                </h4>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#3B475C] font-sans">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#12203A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#6A778D] block">
                      Primary Secretariat Email:
                    </span>
                    <a
                      href={`mailto:${contact.details.email}`}
                      className="font-mono text-xs font-semibold text-[#12203A] hover:text-[#C99A2E] transition-colors"
                    >
                      {contact.details.email}
                    </a>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#12203A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#6A778D] block">
                      Hotline & Member Desk:
                    </span>
                    <span className="font-mono text-xs text-[#12203A]">
                      {contact.details.hotline}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#12203A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#6A778D] block">
                      Physical Secretariat & Meeting Hub:
                    </span>
                    <span className="text-xs text-[#12203A] block">
                      {contact.details.address.building}
                    </span>
                    <span className="text-xs text-[#3B475C] block">
                      {contact.details.address.district}, {contact.details.address.country}
                    </span>
                    <span className="font-mono text-[10px] text-[#6A778D]">
                      {contact.details.address.poBox}
                    </span>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#12203A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-[#6A778D] block">
                      Operating Hours (Gulf Standard Time):
                    </span>
                    <span className="text-xs text-[#3B475C]">
                      {contact.details.officeHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Diplomatic Liaison Notice */}
              <div className="mt-4 pt-3 border-t border-[#CDCDC0] font-mono text-[10px] text-[#6A778D] leading-relaxed">
                <span className="font-bold text-[#12203A] block">Diplomatic Coordination:</span>
                {contact.details.diplomaticAffiliation}
              </div>
            </div>

            {/* Social Links Card */}
            <div className="border border-[#CDCDC0] bg-[#F6F6F2] p-6 space-y-4">
              <div className="border-b border-[#CDCDC0] pb-2">
                <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider block">
                  Digital Feeds & Community
                </span>
                <h4 className="font-serif font-bold text-xl text-[#12203A]">
                  Official Social Channels
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contact.socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-[#CDCDC0] bg-[#EEEEE7] hover:bg-[#E3E3D8] hover:border-[#12203A] flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#12203A]">
                        {getSocialIcon(item.name)}
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm text-[#12203A]">
                          {item.name}
                        </div>
                        <div className="font-mono text-[10px] text-[#6A778D]">
                          {item.handle}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#6A778D] group-hover:text-[#C99A2E] transition-colors" />
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
