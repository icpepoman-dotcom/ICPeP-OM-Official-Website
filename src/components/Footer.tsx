import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { ChapterLogo } from './CircuitMotif';
import { AdminRegistrationRequestModal } from './AdminRegistrationRequestModal';
import { ArrowUp, ShieldCheck, UserPlus } from 'lucide-react';

export const Footer: React.FC = () => {
  const { content, setIsAdminOpen } = useContent();
  const { footer, brand, navigation } = content;
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t-2 border-[#12203A] bg-[#12203A] text-[#EEEEE7] text-left">
      {/* Top Drafting Colophon Bar */}
      <div className="border-b border-[#1C2F54] px-4 py-2 text-[10px] font-mono text-[#C4C4B5] flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#C99A2E] inline-block" />
          <span>{footer.blueprintFooterText}</span>
        </div>
        <div className="flex items-center gap-4 text-[#C99A2E]">
          <span>PRC ACCREDITED APO CHAPTER</span>
          <span className="text-[#C4C4B5]">|</span>
          <span>SULTANATE OF OMAN</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Chapter Seal and Manifesto */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <ChapterLogo
                size={52}
                customLogoUrl={brand.useCustomLogo ? brand.logoUrl : undefined}
                className="logo-gear-svg shrink-0 transition-transform hover:scale-105"
              />
              <div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#EEEEE7]">
                  {brand.acronym}
                </h3>
                <p className="font-mono text-xs text-[#C99A2E]">
                  {brand.fullName}
                </p>
              </div>
            </div>

            <p className="font-serif italic text-sm text-[#C4C4B5] border-l-2 border-[#C99A2E] pl-3 py-1">
              &ldquo;{brand.tagline}&rdquo;
            </p>

            <p className="text-xs text-[#C4C4B5] font-sans leading-relaxed max-w-lg">
              The premier professional association of Filipino Computer Engineers, systems architects, and computing practitioners in the Sultanate of Oman. Committed to advancing technological mastery, professional ethics, and community welfare.
            </p>
          </div>

          {/* Col 2: Navigation Anchors */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <div className="text-[11px] font-bold text-[#C99A2E] uppercase tracking-wider pb-1 border-b border-[#1C2F54]">
              Table of Contents
            </div>
            <ul className="space-y-1.5">
              {navigation.map((item) => (
                <li key={item.code}>
                  <a
                    href={item.href}
                    className="text-[#C4C4B5] hover:text-[#C99A2E] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[#C99A2E]">{item.code}.</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Regulatory & Back to top */}
          <div className="md:col-span-3 space-y-4">
            <div className="text-[11px] font-mono font-bold text-[#C99A2E] uppercase tracking-wider pb-1 border-b border-[#1C2F54]">
              Regulatory Registry
            </div>

            <div className="font-mono text-[11px] text-[#C4C4B5] space-y-1">
              <div>CHAPTER: {brand.chapterCode}</div>
              <div>PARENT: {brand.parentOrg}</div>
              <div>EMBASSY LIAISON: Muscat, Oman</div>
              <div>CONTACT: icpep.oman@gmail.com</div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToTop}
                className="w-full py-2 px-3 border border-[#C99A2E] bg-[#1C2F54] hover:bg-[#253D6D] text-[#EEEEE7] font-mono text-xs uppercase flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5 text-[#C99A2E]" />
                <span>Return to Top [00]</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright rule */}
        <div className="mt-12 pt-6 border-t border-[#1C2F54] flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#C4C4B5] gap-4">
          <p>© {footer.copyrightYear} {footer.legalNotice}</p>
          <div className="flex flex-wrap items-center gap-3 text-[#C99A2E]">
            <span className="w-2 h-2 bg-[#9C3B2E] inline-block" />
            <span>AUTHENTICATED REVISION 2026</span>
            <span className="text-[#1C2F54]">|</span>
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="text-[#EEEEE7] hover:text-[#C99A2E] transition-colors flex items-center gap-1 font-bold underline underline-offset-2"
              title="Open Secretariat Admin Desk"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C99A2E]" />
              <span>Admin Desk</span>
            </button>
            <span className="text-[#1C2F54]">|</span>
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="text-[#C4C4B5] hover:text-white transition-colors flex items-center gap-1 text-[10px]"
              title="Request Admin User Registration"
            >
              <UserPlus className="w-3 h-3 text-[#9C3B2E]" />
              <span>Admin Registration</span>
            </button>
          </div>
        </div>

      </div>

      {/* Self-Service Admin Registration Modal */}
      <AdminRegistrationRequestModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </footer>
  );
};
