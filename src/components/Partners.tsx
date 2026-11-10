import React from 'react';
import { PartnerItem } from '../data/content';
import { useContent } from '../context/ContentContext';
import { DraftingSectionHeader, TechnicalDivider } from './CircuitMotif';
import { Building2, GraduationCap, Cpu, ShieldCheck, ArrowRight, Handshake } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  academic: <GraduationCap className="w-4 h-4 text-[#C99A2E]" />,
  industry: <Building2 className="w-4 h-4 text-[#C99A2E]" />,
  technology: <Cpu className="w-4 h-4 text-[#C99A2E]" />,
  professional: <ShieldCheck className="w-4 h-4 text-[#C99A2E]" />,
};

export const Partners: React.FC = () => {
  const { content } = useContent();
  const { partners } = content;

  return (
    <section id="partners" className="py-12 border-b border-[#CDCDC0] bg-[#EEEEE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <DraftingSectionHeader
          number="05"
          title={partners.title}
          subtitle={partners.subtitle}
          tag="INSTITUTIONAL RELATIONS"
        />

        {/* Intro */}
        <div className="mb-10 text-left border-l-3 border-[#12203A] pl-4 sm:pl-6 max-w-4xl">
          <p className="text-base sm:text-lg text-[#3B475C] font-sans leading-relaxed">
            {partners.intro}
          </p>
        </div>

        {/* 4 Categories Grid */}
        <div className="space-y-12 text-left mb-14">
          {partners.categories.map((catGroup) => (
            <div key={catGroup.id} className="space-y-4">
              
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#CDCDC0] pb-2 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#12203A] border border-[#C99A2E]">
                    {categoryIcons[catGroup.id]}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#12203A]">
                      {catGroup.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs text-[#6A778D]">
                  <span className="text-[#C99A2E] font-bold">{catGroup.code}</span>
                  <span className="text-[#CDCDC0]">|</span>
                  <span className="hidden sm:inline">{catGroup.description}</span>
                </div>
              </div>

              {/* Partner Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {catGroup.partners.map((p, idx) => (
                  <div
                    key={idx}
                    className="border border-[#CDCDC0] bg-[#F6F6F2] p-5 flex flex-col justify-between hover:border-[#12203A] transition-all relative group"
                  >
                    {/* Drafting Corner Marks */}
                    <div className="absolute top-1 right-1 text-[8px] font-mono text-[#CDCDC0]">
                      +{idx + 1}
                    </div>

                    <div>
                      {/* Meta classification & status */}
                      <div className="flex items-center justify-between mb-3 font-mono text-[10px]">
                        <span className="px-2 py-0.5 bg-[#EEEEE7] border border-[#CDCDC0] text-[#12203A] uppercase font-semibold">
                          {p.classification}
                        </span>
                        <span className="text-[#9C3B2E] font-bold uppercase">
                          ● {p.status}
                        </span>
                      </div>

                      {/* Schematic Node Representation */}
                      <div className="flex items-center gap-2 my-2 py-1 border-y border-[#CDCDC0]/50 font-mono text-[9px] text-[#6A778D]">
                        <span className="w-1.5 h-1.5 bg-[#C99A2E] rounded-full inline-block" />
                        <span>LINK_NODE // CH-OMN-NET</span>
                      </div>

                      {/* Partner Name */}
                      <h4 className="font-serif font-bold text-lg text-[#12203A] group-hover:text-[#C99A2E] transition-colors mt-1">
                        {p.name}
                      </h4>

                      {/* Description / Scope */}
                      <p className="text-xs text-[#3B475C] font-sans leading-relaxed mt-2">
                        {p.description}
                      </p>
                    </div>

                    {/* Footer Spec */}
                    <div className="mt-4 pt-2 border-t border-[#CDCDC0]/70 flex items-center justify-between font-mono text-[9px] text-[#6A778D]">
                      <span>BILATERAL ACCORD</span>
                      <span className="text-[#12203A]">2026 VALIDATED</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Partnership Proposal CTA */}
        <div className="border-2 border-[#12203A] bg-[#F6F6F2] p-6 sm:p-8 text-left relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-[#C99A2E]" />
                <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#12203A]">
                  {partners.partnershipCta.headline}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-[#3B475C] font-sans leading-relaxed">
                {partners.partnershipCta.body}
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <a
                href={partners.partnershipCta.actionHref}
                className="inline-flex items-center gap-2 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] px-6 py-3 text-xs font-mono uppercase tracking-wider border border-[#C99A2E] transition-all"
              >
                <span>{partners.partnershipCta.actionText}</span>
                <ArrowRight className="w-4 h-4 text-[#C99A2E]" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
