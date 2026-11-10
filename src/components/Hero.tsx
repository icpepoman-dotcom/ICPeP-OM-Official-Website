import React from 'react';
import { useContent } from '../context/ContentContext';
import { HeroCircuitSchematic } from './CircuitMotif';
import { ArrowRight, Calendar, UserCheck, ShieldCheck, Cpu } from 'lucide-react';

export const Hero: React.FC = () => {
  const { content } = useContent();
  const { hero, brand } = content;
  const [activeVisual, setActiveVisual] = React.useState<'schematic' | 'photo'>(
    hero.heroVisualMode === 'photo' && hero.heroImageUrl ? 'photo' : 'schematic'
  );

  React.useEffect(() => {
    if (hero.heroVisualMode === 'photo' && hero.heroImageUrl) {
      setActiveVisual('photo');
    } else if (hero.heroVisualMode === 'schematic') {
      setActiveVisual('schematic');
    }
  }, [hero.heroVisualMode, hero.heroImageUrl]);

  const hasPhoto = Boolean(hero.heroImageUrl);

  return (
    <section id="hero" className="relative border-b border-[#CDCDC0] drafting-grid overflow-hidden">
      {/* Drafting Boundary Corner Ticks */}
      <div className="absolute top-2 left-2 text-[#12203A] font-mono text-[9px] opacity-40 select-none">
        ┌ SHEET-01 / ELEV-01
      </div>
      <div className="absolute top-2 right-2 text-[#12203A] font-mono text-[9px] opacity-40 select-none">
        SCALE 1:1 ┐
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Left-aligned technical manifesto */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Technical Specification Ribbon */}
            <div className="inline-flex items-center gap-2 border border-[#CDCDC0] bg-[#F6F6F2] px-3 py-1 font-mono text-xs text-[#3B475C]">
              <span className="w-2 h-2 bg-[#C99A2E] inline-block" />
              <span className="font-semibold text-[#12203A]">DOC NO:</span>
              <span>{hero.draftingSpec.docId}</span>
              <span className="text-[#CDCDC0]">/</span>
              <span className="text-[#9C3B2E] font-medium">{hero.draftingSpec.revision}</span>
            </div>

            {/* Kicker - exact required text */}
            <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-[#9C3B2E] font-semibold flex items-center gap-2">
              <span className="inline-block w-4 h-[1.5px] bg-[#9C3B2E]" />
              {hero.kicker}
            </p>

            {/* Heading - exact required text */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#12203A] leading-[1.12] tracking-tight font-medium">
              {hero.heading}
            </h1>

            {/* Tagline & Subheading */}
            <div className="border-l-2 border-[#C99A2E] pl-4 space-y-2">
              <p className="font-mono text-xs sm:text-sm text-[#C99A2E] font-semibold tracking-wide">
                &ldquo;{brand.tagline}&rdquo;
              </p>
              <p className="text-base sm:text-lg text-[#3B475C] font-sans leading-relaxed">
                {hero.subheading}
              </p>
            </div>

            {/* Two Action Buttons - exact required texts */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={hero.ctaPrimary.href}
                className="inline-flex items-center gap-2 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] px-6 py-3.5 text-xs sm:text-sm font-mono tracking-wider uppercase border border-[#12203A] hover:border-[#C99A2E] shadow-sm transition-all group"
              >
                <UserCheck className="w-4 h-4 text-[#C99A2E]" />
                <span className="font-semibold">{hero.ctaPrimary.text}</span>
                <ArrowRight className="w-4 h-4 text-[#C99A2E] group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={hero.ctaSecondary.href}
                className="inline-flex items-center gap-2 bg-[#EEEEE7] hover:bg-[#E3E3D8] text-[#12203A] px-6 py-3.5 text-xs sm:text-sm font-mono tracking-wider uppercase border border-[#12203A] hover:border-[#C99A2E] transition-all"
              >
                <Calendar className="w-4 h-4 text-[#12203A]" />
                <span className="font-semibold">{hero.ctaSecondary.text}</span>
              </a>
            </div>

            {/* Professional Governance Indicators */}
            <div className="pt-4 border-t border-[#CDCDC0] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-[#6A778D]">
              <span className="flex items-center gap-1.5 text-[#12203A]">
                <ShieldCheck className="w-4 h-4 text-[#C99A2E]" />
                <span>PRC CPD Accredited Council</span>
              </span>
              <span className="text-[#CDCDC0]">|</span>
              <span className="flex items-center gap-1.5 text-[#12203A]">
                <Cpu className="w-4 h-4 text-[#12203A]" />
                <span>Affiliated ICpEP National</span>
              </span>
              <span className="text-[#CDCDC0]">|</span>
              <span className="text-[#3B475C]">Muscat, Sultanate of Oman</span>
            </div>
          </div>

          {/* Right Column: Line-drawn Circuit Schematic or Custom Chapter Photo */}
          <div className="lg:col-span-5 relative">
            <div className="border border-[#CDCDC0] bg-[#F6F6F2] p-4 sm:p-6 shadow-sm relative">
              
              {/* Technical Schematic / Photo Header with Visual Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-[#CDCDC0] mb-4 font-mono text-[10px] text-[#3B475C]">
                <div className="flex items-center gap-2">
                  <span className="uppercase tracking-widest text-[#12203A] font-bold">
                    {activeVisual === 'schematic' ? 'FIG. 1.0 — SYSTEM BUS TOPOLOGY' : 'PLATE 1.0 — CHAPTER PHOTO ARCHIVE'}
                  </span>
                </div>
                
                {hasPhoto ? (
                  <div className="flex items-center bg-[#EEEEE7] border border-[#CDCDC0] p-0.5">
                    <button
                      type="button"
                      onClick={() => setActiveVisual('schematic')}
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase transition-all ${
                        activeVisual === 'schematic'
                          ? 'bg-[#12203A] text-[#EEEEE7]'
                          : 'text-[#3B475C] hover:text-[#12203A]'
                      }`}
                    >
                      Schematic
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveVisual('photo')}
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase transition-all ${
                        activeVisual === 'photo'
                          ? 'bg-[#12203A] text-[#EEEEE7]'
                          : 'text-[#3B475C] hover:text-[#12203A]'
                      }`}
                    >
                      Photo
                    </button>
                  </div>
                ) : (
                  <span className="text-[#C99A2E] font-semibold">ICPEP-ARCH-V2</span>
                )}
              </div>

              {/* Dynamic View: Schematic or Photo */}
              {activeVisual === 'photo' && hero.heroImageUrl ? (
                <div className="space-y-3">
                  <div className="relative border border-[#12203A] bg-[#12203A] overflow-hidden aspect-video group">
                    <img
                      src={hero.heroImageUrl}
                      alt={hero.heroImageCaption || 'ICpEP-Oman Chapter Gathering'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* CAD Corner Ticks */}
                    <div className="absolute top-1 left-1 text-[8px] font-mono text-white/70 bg-black/50 px-1">
                      ┌ PHOTO-01
                    </div>
                    <div className="absolute bottom-1 right-1 text-[8px] font-mono text-[#C99A2E] bg-black/60 px-1.5 py-0.5 font-bold">
                      OMAN CHAPTER
                    </div>
                  </div>
                  {hero.heroImageCaption && (
                    <p className="font-mono text-[11px] text-[#3B475C] border-l-2 border-[#C99A2E] pl-2.5 py-0.5 italic">
                      {hero.heroImageCaption}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {/* Circuit SVG Component */}
                  <HeroCircuitSchematic />

                  {/* Technical Blueprint Legend */}
                  <div className="mt-4 pt-3 border-t border-[#CDCDC0] grid grid-cols-2 gap-2 text-[10px] font-mono text-[#6A778D]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#C99A2E] inline-block" />
                      <span>Gold: Clock & Control Pins</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#9C3B2E] inline-block" />
                      <span>Clay: System Alert Rail</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#12203A] inline-block" />
                      <span>Navy: High-Speed Data Bus</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 border border-[#12203A] inline-block" />
                      <span>Grid: 12mm Standard Pitch</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Technical Stats Strip */}
        <div className="mt-12 pt-8 border-t border-[#CDCDC0] grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          {hero.keyStats.map((stat, i) => (
            <div key={i} className="border-l-2 border-[#12203A] pl-3.5 space-y-1">
              <div className="font-mono text-xs uppercase tracking-wider text-[#6A778D]">
                {stat.label}
              </div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#12203A]">
                {stat.value}
              </div>
              <div className="text-xs text-[#3B475C] font-mono">
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
