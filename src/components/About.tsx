import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { DraftingSectionHeader, EngineerCadAvatar, TechnicalDivider } from './CircuitMotif';
import { Compass, Target, Shield, BookOpen, Cpu, Award, Users, Camera, Image, X, ZoomIn, Sliders } from 'lucide-react';

export const About: React.FC = () => {
  const { content, setIsAdminOpen } = useContent();
  const { about, gallery = [] } = content;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<any | null>(null);

  const categories = ['All', 'Assembly', 'Workshop', 'Technical Seminar', 'Community', 'Oath Taking'];
  const filteredPhotos = selectedCategory === 'All'
    ? gallery
    : gallery.filter((p) => p.category === selectedCategory);

  return (
    <section id="about" className="py-12 border-b border-[#CDCDC0] bg-[#EEEEE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <DraftingSectionHeader
          number="01"
          title={about.title}
          subtitle={about.subtitle}
          tag="CHARTER & GOVERNANCE"
        />

        {/* Part 1: Who We Are & Our Purpose */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Who We Are */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="flex items-center gap-2 font-mono text-xs text-[#9C3B2E] font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-[#9C3B2E]" />
              <span>Section 1.1 — {about.whoWeAre.title}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A] font-medium">
              A recognized guild of Filipino technology practitioners in Oman.
            </h3>
            <div className="space-y-3 text-[#3B475C] font-sans text-sm sm:text-base leading-relaxed">
              {about.whoWeAre.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* Our Purpose Box */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-[#12203A] bg-[#F6F6F2] p-6 shadow-xs relative">
            {/* Drafting Corner brackets */}
            <div className="absolute top-1 left-1 text-[8px] font-mono text-[#6A778D]">┌ PURP-01</div>
            <div className="absolute top-1 right-1 text-[8px] font-mono text-[#6A778D]">┐</div>
            <div className="absolute bottom-1 left-1 text-[8px] font-mono text-[#6A778D]">└</div>
            <div className="absolute bottom-1 right-1 text-[8px] font-mono text-[#6A778D]">┘</div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#CDCDC0] pb-2">
                <Compass className="w-5 h-5 text-[#C99A2E]" />
                <span className="font-mono text-xs uppercase tracking-widest font-bold text-[#12203A]">
                  {about.ourPurpose.title}
                </span>
              </div>
              <blockquote className="font-serif text-lg sm:text-xl text-[#12203A] italic leading-snug">
                &ldquo;{about.ourPurpose.statement}&rdquo;
              </blockquote>
            </div>

            <div className="pt-6 mt-6 border-t border-[#CDCDC0] flex items-center justify-between font-mono text-[10px] text-[#6A778D]">
              <span>MANDATE: EXCELLENCE & ETHICS</span>
              <span className="text-[#C99A2E]">PRC CODE: 2024-CPE</span>
            </div>
          </div>
        </div>

        {/* Part 2: Vision & Mission (2 Blueprint Panels) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14 text-left">
          {/* Vision */}
          <div className="border border-[#CDCDC0] bg-[#F6F6F2] p-6 relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[#C99A2E] font-bold">SPEC 1.2 —</span>
              <h4 className="font-serif text-2xl text-[#12203A] font-semibold">{about.vision.title}</h4>
            </div>
            <p className="text-sm sm:text-base text-[#3B475C] font-sans leading-relaxed">
              {about.vision.statement}
            </p>
            <div className="mt-4 pt-3 border-t border-[#CDCDC0] flex items-center gap-2 font-mono text-[10px] text-[#6A778D]">
              <Target className="w-3.5 h-3.5 text-[#C99A2E]" />
              <span>TARGET HORIZON: 2030 REGIONAL LEADERSHIP</span>
            </div>
          </div>

          {/* Mission */}
          <div className="border border-[#CDCDC0] bg-[#F6F6F2] p-6 relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs text-[#C99A2E] font-bold">SPEC 1.3 —</span>
              <h4 className="font-serif text-2xl text-[#12203A] font-semibold">{about.mission.title}</h4>
            </div>
            <p className="text-sm sm:text-base text-[#3B475C] font-sans leading-relaxed">
              {about.mission.statement}
            </p>
            <div className="mt-4 pt-3 border-t border-[#CDCDC0] flex items-center gap-2 font-mono text-[10px] text-[#6A778D]">
              <Shield className="w-3.5 h-3.5 text-[#9C3B2E]" />
              <span>ACTION PILLARS: CPD • INTEGRITY • LEADERSHIP</span>
            </div>
          </div>
        </div>

        {/* Technical Rule */}
        <TechnicalDivider label="SPECIFICATION CLAUSE 1.4: OBJECTIVES & VALUES" />

        {/* Part 3: 10-Item List of Objectives */}
        <div className="mb-14 text-left">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#CDCDC0] pb-3">
            <div>
              <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-widest block">
                Charter Framework
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                10 Constitutional Objectives
              </h3>
            </div>
            <span className="font-mono text-xs text-[#6A778D]">
              BY-LAWS ARTICLE II: PURPOSES & OBJECTIVES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {about.objectives.map((obj) => (
              <div
                key={obj.number}
                className="border border-[#CDCDC0] bg-[#F6F6F2] p-4.5 hover:border-[#12203A] transition-colors flex gap-4 items-start"
              >
                <div className="font-mono text-sm font-bold text-[#EEEEE7] bg-[#12203A] w-9 h-9 shrink-0 flex items-center justify-center border border-[#C99A2E]">
                  {obj.number}
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base sm:text-lg text-[#12203A]">
                    {obj.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#3B475C] font-sans leading-relaxed">
                    {obj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 4: 6 Core Values */}
        <div className="mb-16 text-left">
          <div className="mb-6 border-b border-[#CDCDC0] pb-3 flex items-baseline justify-between">
            <div>
              <span className="font-mono text-xs text-[#C99A2E] font-bold uppercase tracking-widest block">
                Ethical Pillars
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                6 Core Values
              </h3>
            </div>
            <span className="font-mono text-xs text-[#6A778D] hidden sm:inline">
              CODE OF PROFESSIONAL ETHICS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {about.coreValues.map((val) => (
              <div
                key={val.code}
                className="border border-[#CDCDC0] bg-[#F6F6F2] p-5 space-y-2 relative overflow-hidden group hover:border-[#C99A2E] transition-all"
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-[#C99A2E] font-bold">{val.code}</span>
                  <span className="text-[#6A778D]">ETH-STD</span>
                </div>
                <h4 className="text-xl font-serif font-bold text-[#12203A] group-hover:text-[#C99A2E] transition-colors">
                  {val.name}
                </h4>
                <p className="text-xs sm:text-sm text-[#3B475C] font-sans leading-relaxed">
                  {val.description}
                </p>
                <div className="pt-2 border-t border-[#CDCDC0]/60 flex items-center gap-1.5 text-[10px] font-mono text-[#6A778D]">
                  <span className="w-1 h-1 bg-[#12203A] rounded-full" />
                  <span>Mandatory Code Compliance</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Part 5: President's Message */}
        <div className="mb-16 text-left border-2 border-[#12203A] bg-[#F6F6F2] p-6 sm:p-8 relative">
          <div className="absolute top-2 right-3 font-mono text-[10px] text-[#C99A2E] uppercase tracking-widest font-bold">
            OFFICIAL ADDRESS // 2025–2027
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* President Photo / Technical CAD Avatar */}
            <div className="lg:col-span-3 flex flex-col items-center sm:items-start text-center sm:text-left space-y-3">
              <EngineerCadAvatar
                name={about.presidentsMessage.author}
                role="President"
                size="lg"
                photoUrl={about.presidentsMessage.photoUrl}
              />
              <div className="space-y-1 font-mono text-xs">
                <div className="font-bold text-[#12203A] text-sm font-serif">
                  {about.presidentsMessage.author}
                </div>
                <div className="text-[#C99A2E] font-semibold">
                  {about.presidentsMessage.role}
                </div>
                <div className="text-[10px] text-[#6A778D]">
                  {about.presidentsMessage.term}
                </div>
                <div className="text-[9px] text-[#3B475C] border-t border-[#CDCDC0] pt-1">
                  {about.presidentsMessage.licenseRef}
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="lg:col-span-9 space-y-4">
              <div className="border-b border-[#CDCDC0] pb-2">
                <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider">
                  {about.presidentsMessage.title}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-[#12203A] font-medium mt-1">
                  {about.presidentsMessage.salutation}
                </h3>
              </div>

              {/* Quote block */}
              <p className="font-serif italic text-base sm:text-lg text-[#12203A] bg-[#EEEEE7] p-3.5 border-l-3 border-[#C99A2E]">
                &ldquo;{about.presidentsMessage.quote}&rdquo;
              </p>

              <div className="space-y-3 text-sm sm:text-base text-[#3B475C] font-sans leading-relaxed">
                {about.presidentsMessage.body.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Signature stamp line */}
              <div className="pt-4 border-t border-[#CDCDC0] flex flex-wrap items-center justify-between font-mono text-xs text-[#6A778D]">
                <span>SEAL: EXECUTIVE OFFICE / ICPEP-OMAN</span>
                <span className="text-[#12203A] font-semibold">MUSCAT HEADQUARTERS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Part 6: Officer Grid (President, VP, Secretary, Treasurer) */}
        <div className="text-left">
          <div className="mb-6 border-b border-[#CDCDC0] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-widest block">
                Executive Leadership
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                Chapter Executive Board (2025–2027)
              </h3>
            </div>
            <span className="font-mono text-xs text-[#6A778D]">
              GOVERNING DIRECTORS & SECRETARIAT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {about.officers.map((officer) => (
              <div
                key={officer.role}
                className="border border-[#CDCDC0] bg-[#F6F6F2] p-5 flex flex-col justify-between hover:border-[#12203A] transition-colors relative"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <EngineerCadAvatar
                      name={officer.name}
                      role={officer.role}
                      size="md"
                      photoUrl={officer.photoUrl}
                    />
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#12203A] text-[#EEEEE7] border border-[#C99A2E]">
                      {officer.role}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-lg text-[#12203A] leading-snug">
                    {officer.name}
                  </h4>
                  <p className="font-mono text-xs text-[#C99A2E] font-semibold mt-0.5">
                    {officer.credential}
                  </p>

                  <div className="my-3 border-t border-[#CDCDC0]/70 pt-2 font-mono text-[10px] text-[#6A778D]">
                    <span className="text-[#12203A] font-semibold block">Domain:</span>
                    <span>{officer.specialization}</span>
                  </div>

                  <p className="text-xs text-[#3B475C] font-sans leading-relaxed mt-2">
                    {officer.bio}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#CDCDC0] flex items-center justify-between font-mono text-[9px] text-[#6A778D]">
                  <span>VOTED EXEC</span>
                  <span className="text-[#9C3B2E]">VERIFIED CpE</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Rule */}
        <TechnicalDivider label="SPECIFICATION CLAUSE 1.7: CHAPTER PHOTOGRAPHIC ARCHIVE & HIGHLIGHTS" />

        {/* Part 7: Chapter Photographic Archive & Moments in Oman */}
        <div className="text-left mt-10">
          <div className="mb-6 border-b border-[#CDCDC0] pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
            <div>
              <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>Visual Record & Community</span>
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                Chapter Photographic Archive (Muscat & Regional)
              </h3>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#6A778D] hidden md:inline">
                {filteredPhotos.length} DOCUMENTED {filteredPhotos.length === 1 ? 'RECORD' : 'RECORDS'}
              </span>
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F6F6F2] hover:bg-[#12203A] hover:text-[#EEEEE7] border border-[#12203A] text-[#12203A] font-mono text-[11px] font-semibold transition-all"
                title="Manage or Upload Chapter Photos in Admin Desk"
              >
                <Sliders className="w-3 h-3 text-[#C99A2E]" />
                <span>Manage Photos</span>
              </button>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 font-mono text-xs uppercase transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-[#12203A] text-[#EEEEE7] border-[#12203A] font-bold shadow-xs'
                    : 'bg-[#F6F6F2] text-[#3B475C] border-[#CDCDC0] hover:border-[#12203A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          {filteredPhotos.length === 0 ? (
            <div className="border border-dashed border-[#CDCDC0] bg-[#F6F6F2] p-8 text-center space-y-2">
              <Image className="w-8 h-8 text-[#6A778D] mx-auto" />
              <p className="font-mono text-xs text-[#6A778D]">No photos found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhoto(photo)}
                  className="group cursor-pointer border border-[#CDCDC0] bg-[#F6F6F2] hover:border-[#12203A] transition-all flex flex-col justify-between shadow-xs overflow-hidden"
                >
                  <div className="relative aspect-video bg-[#12203A] overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[#12203A]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-[#12203A]/80 text-[#EEEEE7] p-2 rounded-full border border-[#C99A2E]">
                        <ZoomIn className="w-4 h-4 text-[#C99A2E]" />
                      </span>
                    </div>
                    <div className="absolute top-2 left-2 bg-[#12203A]/90 text-[#EEEEE7] font-mono text-[9px] px-2 py-0.5 border border-[#C99A2E] font-bold">
                      {photo.category}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5">
                      {photo.date}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-mono text-[10px] text-[#C99A2E] font-bold uppercase tracking-wider mb-1">
                        DOC REF: {photo.id}
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#12203A] group-hover:text-[#9C3B2E] transition-colors leading-snug">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-[#3B475C] font-sans mt-2 line-clamp-2 leading-relaxed">
                        {photo.caption}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#CDCDC0] flex items-center justify-between font-mono text-[9px] text-[#6A778D]">
                      <span>MUSCAT ARCHIVE</span>
                      <span className="text-[#12203A] font-semibold group-hover:underline">Click to view ↗</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High-Resolution Photo Lightbox Modal */}
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 bg-[#12203A]/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setActivePhoto(null)}
          >
            <div
              className="bg-[#EEEEE7] border-2 border-[#12203A] max-w-4xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Header Bar */}
              <div className="bg-[#12203A] text-[#EEEEE7] px-4 py-2.5 border-b-2 border-[#C99A2E] flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-[#C99A2E] font-bold">
                  <Camera className="w-4 h-4 text-[#C99A2E]" />
                  <span>CHAPTER VISUAL RECORD // {activePhoto.id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePhoto(null)}
                  className="p-1 text-[#EEEEE7] hover:text-[#C99A2E] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Image */}
              <div className="relative bg-black max-h-[65vh] flex items-center justify-center overflow-hidden">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="max-h-[65vh] w-full object-contain"
                />
              </div>

              {/* Lightbox Caption & Details */}
              <div className="p-4 sm:p-6 bg-[#F6F6F2] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#CDCDC0] pb-2">
                  <span className="font-mono text-xs font-bold uppercase bg-[#12203A] text-[#EEEEE7] px-2 py-0.5 border border-[#C99A2E]">
                    {activePhoto.category}
                  </span>
                  <span className="font-mono text-xs text-[#6A778D]">
                    RECORD DATE: {activePhoto.date}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#12203A]">
                  {activePhoto.title}
                </h3>
                <p className="text-sm text-[#3B475C] font-sans leading-relaxed">
                  {activePhoto.caption}
                </p>
                <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-[#6A778D] border-t border-[#CDCDC0]">
                  <span>INSTITUTE OF COMPUTER ENGINEERS OF THE PHILIPPINES — OMAN</span>
                  <span className="text-[#C99A2E] font-semibold">PRC APO CHAPTER ARCHIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
