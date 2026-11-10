import React, { useState } from 'react';
import { Announcement, FAQItem } from '../data/content';
import { useContent } from '../context/ContentContext';
import { DraftingSectionHeader, TechnicalDivider } from './CircuitMotif';
import { Bell, ChevronDown, FileText, Download, ExternalLink, HelpCircle, AlertCircle } from 'lucide-react';

export const Resources: React.FC = () => {
  const { content } = useContent();
  const { resources } = content;
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-01');
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('All');
  const [announcementModal, setAnnouncementModal] = useState<Announcement | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const faqCategories = ['All', 'Membership', 'CPD & PRC', 'Credentials', 'Dues & Fees', 'Process', 'Community'];
  const filteredFaqs = activeFaqCategory === 'All'
    ? resources.faqs
    : resources.faqs.filter((faq) => faq.category === activeFaqCategory);

  return (
    <section id="resources" className="py-12 border-b border-[#CDCDC0] bg-[#EEEEE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <DraftingSectionHeader
          number="06"
          title={resources.title}
          subtitle={resources.subtitle}
          tag="CIRCULARS & KNOWLEDGE BASE"
        />

        {/* Part 1: Announcements List */}
        <div className="text-left mb-14">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#CDCDC0] pb-3 gap-2">
            <div>
              <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider block">
                Secretariat Gazettes
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                Official Chapter Announcements & Advisories
              </h3>
            </div>
            <span className="font-mono text-xs text-[#6A778D]">
              DISPATCH BULLETIN 2026
            </span>
          </div>

          <div className="space-y-4">
            {resources.announcements.map((ann) => (
              <div
                key={ann.id}
                className="border border-[#CDCDC0] bg-[#F6F6F2] p-5 hover:border-[#12203A] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-[#12203A] text-[#C99A2E] px-2 py-0.5 border border-[#C99A2E]">
                        {ann.id}
                      </span>
                      <span className="font-mono text-[10px] uppercase bg-[#EEEEE7] px-2 py-0.5 border border-[#CDCDC0] text-[#12203A]">
                        {ann.category}
                      </span>
                      <span className="font-mono text-xs text-[#6A778D]">
                        Issued: {ann.date}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-lg sm:text-xl text-[#12203A]">
                      {ann.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#3B475C] font-sans leading-relaxed">
                      {ann.summary}
                    </p>

                    <div className="font-mono text-[10px] text-[#6A778D] pt-1">
                      {ann.referenceDoc}
                    </div>
                  </div>

                  <div className="shrink-0 pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => setAnnouncementModal(ann)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EEEEE7] hover:bg-[#E3E3D8] text-[#12203A] border border-[#CDCDC0] font-mono text-xs uppercase transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C99A2E]" />
                      <span>Read Circular</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Full Circular */}
        {announcementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12203A]/70 backdrop-blur-xs p-4 text-left">
            <div className="bg-[#F6F6F2] border-2 border-[#12203A] max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-3">
                <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase">
                  {announcementModal.referenceDoc}
                </span>
                <button
                  type="button"
                  onClick={() => setAnnouncementModal(null)}
                  className="font-mono text-sm px-2 py-0.5 border border-[#CDCDC0] hover:bg-[#E3E3D8]"
                >
                  ✕
                </button>
              </div>

              <div>
                <span className="font-mono text-xs text-[#6A778D] block">Date of Release: {announcementModal.date}</span>
                <h3 className="font-serif text-2xl font-bold text-[#12203A] mt-1">
                  {announcementModal.title}
                </h3>
              </div>

              <div className="border-t border-b border-[#CDCDC0] py-4 space-y-3 text-sm text-[#3B475C] font-sans leading-relaxed">
                <p>
                  <strong>Executive Summary:</strong> {announcementModal.summary}
                </p>
                <p>
                  This official bulletin is promulgated under the authority of the ICpEP-Oman Secretariat and the Executive Board. All registered members are advised to observe the compliance criteria and keep their credentials up to date.
                </p>
                <div className="bg-[#EEEEE7] p-3 border-l-2 border-[#C99A2E] font-mono text-xs">
                  For formal filings or queries concerning this notice, coordinate with: <strong>icpep.oman@gmail.com</strong>.
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="font-mono text-[10px] text-[#6A778D]">ARCHIVAL RECORD: VERIFIED</span>
                <button
                  type="button"
                  onClick={() => setAnnouncementModal(null)}
                  className="px-5 py-2 bg-[#12203A] text-[#EEEEE7] text-xs font-mono uppercase border border-[#C99A2E]"
                >
                  Close Document
                </button>
              </div>
            </div>
          </div>
        )}

        <TechnicalDivider label="SPECIFICATION CLAUSE 6.2: INQUIRY REGISTER & FAQS" />

        {/* Part 2: FAQ Accordion */}
        <div className="text-left">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#CDCDC0] pb-3 gap-2">
            <div>
              <span className="font-mono text-xs text-[#C99A2E] font-bold uppercase tracking-wider block">
                Guidance Database
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                Frequently Asked Questions
              </h3>
            </div>

            {/* Category Filter for FAQs */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFaqCategory(cat)}
                  className={`px-2 py-0.5 text-xs transition-colors border ${
                    activeFaqCategory === cat
                      ? 'bg-[#12203A] text-[#EEEEE7] border-[#12203A] font-semibold'
                      : 'bg-[#F6F6F2] text-[#3B475C] border-[#CDCDC0] hover:border-[#12203A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="border border-[#CDCDC0] bg-[#F6F6F2] transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-hidden hover:bg-[#EEEEE7]/60 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <span className="font-mono text-xs font-bold text-[#C99A2E] bg-[#12203A] px-2 py-0.5 shrink-0">
                        {faq.category}
                      </span>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-[#12203A]">
                        {faq.question}
                      </h4>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#12203A] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#C99A2E]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 border-t border-[#CDCDC0]/70 pt-3">
                      <p className="text-xs sm:text-sm text-[#3B475C] font-sans leading-relaxed">
                        {faq.answer}
                      </p>
                      <div className="mt-3 pt-2 border-t border-[#CDCDC0]/40 flex items-center justify-between font-mono text-[10px] text-[#6A778D]">
                        <span>REF: {faq.id.toUpperCase()}</span>
                        <span>ICpEP BY-LAWS ARTICLE IV</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
