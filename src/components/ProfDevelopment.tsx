import React from 'react';
import { DevTrack } from '../data/content';
import { useContent } from '../context/ContentContext';
import { DraftingSectionHeader, TechnicalDivider } from './CircuitMotif';
import {
  Wrench,
  Award,
  Presentation,
  Cpu,
  Video,
  BookOpenCheck,
  CheckCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react';

const trackIcons: Record<string, React.ReactNode> = {
  Wrench: <Wrench className="w-5 h-5 text-[#C99A2E]" />,
  Award: <Award className="w-5 h-5 text-[#C99A2E]" />,
  Presentation: <Presentation className="w-5 h-5 text-[#C99A2E]" />,
  Cpu: <Cpu className="w-5 h-5 text-[#C99A2E]" />,
  Video: <Video className="w-5 h-5 text-[#C99A2E]" />,
  BookOpenCheck: <BookOpenCheck className="w-5 h-5 text-[#C99A2E]" />,
};

export const ProfDevelopment: React.FC = () => {
  const { content } = useContent();
  const { development } = content;

  return (
    <section id="development" className="py-12 border-b border-[#CDCDC0] bg-[#EEEEE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <DraftingSectionHeader
          number="04"
          title={development.title}
          subtitle={development.subtitle}
          tag="COMPETENCY ARCHITECTURE"
        />

        {/* Intro */}
        <div className="mb-10 text-left border-l-3 border-[#12203A] pl-4 sm:pl-6 max-w-4xl">
          <p className="text-base sm:text-lg text-[#3B475C] font-sans leading-relaxed">
            {development.intro}
          </p>
        </div>

        {/* 6 Tracks Grid */}
        <div className="text-left mb-12">
          <div className="mb-6 flex items-baseline justify-between border-b border-[#CDCDC0] pb-3">
            <div>
              <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider block">
                Educational Matrix
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                6 Technical Advancement Tracks
              </h3>
            </div>
            <span className="font-mono text-xs text-[#6A778D] hidden sm:inline">
              STANDARDS REVISION 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {development.tracks.map((track) => (
              <div
                key={track.id}
                className="border border-[#CDCDC0] bg-[#F6F6F2] p-6 flex flex-col justify-between hover:border-[#12203A] transition-all group relative"
              >
                <div>
                  {/* Top Bar with Icon and ID */}
                  <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-[#12203A] border border-[#C99A2E]">
                        {trackIcons[track.iconName]}
                      </div>
                      <span className="font-mono text-xs font-bold text-[#12203A]">
                        {track.id}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] uppercase text-[#6A778D]">
                      TRACK VERIFIED
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#12203A] group-hover:text-[#C99A2E] transition-colors leading-snug">
                    {track.title}
                  </h4>
                  <p className="font-mono text-xs text-[#9C3B2E] font-semibold mt-1 mb-3">
                    {track.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#3B475C] font-sans leading-relaxed mb-4">
                    {track.description}
                  </p>

                  {/* Focal Competencies */}
                  <div className="space-y-2 border-t border-[#CDCDC0]/70 pt-3">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#12203A] block">
                      Core Modules & Skills:
                    </span>
                    <ul className="space-y-1">
                      {track.focalAreas.map((area, i) => (
                        <li key={i} className="text-xs text-[#3B475C] flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-[#C99A2E] shrink-0" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* PRC Alignment Stamp */}
                <div className="mt-6 pt-3 border-t border-[#CDCDC0] font-mono text-[10px] text-[#6A778D] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#12203A] shrink-0" />
                  <span className="truncate">{track.prcAlignment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CPD Accreditation Compliance Box */}
        <div className="border border-[#12203A] bg-[#EEEEE7] p-6 text-left relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#9C3B2E]" />
                <span className="font-mono text-xs font-bold text-[#12203A] uppercase tracking-wider">
                  PRC CPDAS Synchronization Framework
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3B475C] font-sans leading-relaxed">
                {development.cpdSummary.complianceNotice}
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] px-4 py-2.5 text-xs font-mono uppercase tracking-wider border border-[#C99A2E]"
              >
                <span>Inquire About CPD Modules</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
