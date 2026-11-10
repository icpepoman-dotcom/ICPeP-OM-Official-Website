import React from 'react';

/**
 * Official ICpEP-Oman Chapter Logo Emblem
 * Pixel-accurate vector recreation of the official uploaded chapter seal:
 * - Metallic beveled outer rim with drop shadows
 * - Dark graphite ring with 3D blue/white bordered text:
 *   "★ INSTITUTE OF COMPUTER ENGINEERS OF THE PHILIPPINES ★"
 * - Two-tier arched bottom text:
 *   "CONVERGING PROFESSIONALS" / "FOR EXCELLENCE"
 * - High-luminance cyan-to-royal-blue radial PCB field
 * - Dual-tone PCB circuitry: Amber/gold copper traces (top-left) & electric cyan tracks (right/bottom)
 * - Tilted DIP microchip package (-22deg) with glossy diagonal reflection and chrome DIP pins
 * - Striped "ICPEP" lettering with "OMAN" in Oman flag colors (White, Red, Green) and Arabic "سلطنة عُمان"
 * - "FORMERLY PhICES" and official Accreditation No. 2020-001
 */
export const ChapterLogo: React.FC<{ className?: string; size?: number; customLogoUrl?: string }> = ({
  className = '',
  size = 46,
  customLogoUrl,
}) => {
  const [imgFailed, setImgFailed] = React.useState(false);

  if (customLogoUrl && !imgFailed) {
    return (
      <img
        src={customLogoUrl}
        alt="ICpEP-Oman Chapter Official Emblem"
        width={size}
        height={size}
        onError={() => setImgFailed(true)}
        className={`object-contain rounded-full border border-[#C99A2E]/50 shadow-xs bg-white shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Institute of Computer Engineers of the Philippines — Oman Chapter Official Emblem"
    >
      <defs>
        {/* Outer Metallic Bevel Gradients */}
        <linearGradient id="sealMetalBevel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="20%" stopColor="#CFD6DE" />
          <stop offset="45%" stopColor="#8795A5" />
          <stop offset="70%" stopColor="#E2E7ED" />
          <stop offset="90%" stopColor="#6C7A8A" />
          <stop offset="100%" stopColor="#3B4654" />
        </linearGradient>

        <linearGradient id="darkRingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#252A32" />
          <stop offset="50%" stopColor="#15191E" />
          <stop offset="100%" stopColor="#0B0D11" />
        </linearGradient>

        <linearGradient id="innerSilverRim" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#9EACB9" />
          <stop offset="70%" stopColor="#E1E6EC" />
          <stop offset="100%" stopColor="#5E6B7A" />
        </linearGradient>

        {/* Shiny Chrome DIP Pin Gradient */}
        <linearGradient id="chromePinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E8ECF1" />
          <stop offset="60%" stopColor="#929DAA" />
          <stop offset="90%" stopColor="#5B6673" />
          <stop offset="100%" stopColor="#3E4752" />
        </linearGradient>

        {/* Luminous PCB Blue Radial Gradient */}
        <radialGradient id="pcbRadialField" cx="50%" cy="36%" r="58%">
          <stop offset="0%" stopColor="#75E7FF" />
          <stop offset="25%" stopColor="#2EB7EE" />
          <stop offset="55%" stopColor="#0E6BB5" />
          <stop offset="85%" stopColor="#06407C" />
          <stop offset="100%" stopColor="#02244E" />
        </radialGradient>

        {/* Chip Body Gradient */}
        <linearGradient id="chipBodyTexture" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E2228" />
          <stop offset="45%" stopColor="#121519" />
          <stop offset="100%" stopColor="#090B0E" />
        </linearGradient>

        {/* Diagonal Gloss Sheen on Chip */}
        <linearGradient id="chipGlossSheen" x1="0%" y1="0%" x2="100%" y2="30%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.08" />
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Text Drop Shadow Filter */}
        <filter id="textGlowShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.85" />
        </filter>

        {/* Chip Drop Shadow */}
        <filter id="chipElevationShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#001833" floodOpacity="0.8" />
        </filter>

        {/* Top Text Arc Path: Radius 164 */}
        <path
          id="sealTopArc"
          d="M 42,200 A 158,158 0 1,1 358,200"
          fill="none"
        />

        {/* Bottom Arc Upper Line: CONVERGING PROFESSIONALS */}
        <path
          id="sealBottomArcUpper"
          d="M 352,200 A 152,152 0 0,1 48,200"
          fill="none"
        />

        {/* Bottom Arc Lower Line: FOR EXCELLENCE */}
        <path
          id="sealBottomArcLower"
          d="M 368,200 A 168,168 0 0,1 32,200"
          fill="none"
        />
      </defs>

      {/* 1. Outer Metallic Beveled Ring */}
      <circle cx="200" cy="200" r="197" fill="url(#sealMetalBevel)" />
      
      {/* 2. Dark Ring Band (Outer Background for Arch Text) */}
      <circle cx="200" cy="200" r="191" fill="url(#darkRingGrad)" stroke="#3E4754" strokeWidth="1" />

      {/* 3. Inner Metallic Separator Rim */}
      <circle cx="200" cy="200" r="141" fill="none" stroke="url(#innerSilverRim)" strokeWidth="4.5" />
      <circle cx="200" cy="200" r="138" fill="none" stroke="#001933" strokeWidth="1" />

      {/* 4. Top Arched Text: 3D Blue fill with White Outline (Matching original emblem) */}
      <g filter="url(#textGlowShadow)">
        <text
          fill="#2B6CB0"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinejoin="round"
          paintOrder="stroke fill"
          fontFamily="'Arial Black', Impact, system-ui, sans-serif"
          fontSize="14.5"
          fontWeight="900"
          letterSpacing="1px"
        >
          <textPath href="#sealTopArc" startOffset="50%" textAnchor="middle">
            INSTITUTE OF COMPUTER ENGINEERS OF THE PHILIPPINES
          </textPath>
        </text>

        {/* Left 5-Pointed Star on Dark Ring */}
        <path
          d="M 46,218 L 48.5,225.5 L 56,225.5 L 50,230 L 52.5,237 L 46,232.5 L 39.5,237 L 42,230 L 36,225.5 L 43.5,225.5 Z"
          fill="#2B6CB0"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Right 5-Pointed Star on Dark Ring */}
        <path
          d="M 354,218 L 356.5,225.5 L 364,225.5 L 358,230 L 360.5,237 L 354,232.5 L 347.5,237 L 350,230 L 344,225.5 L 351.5,225.5 Z"
          fill="#2B6CB0"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* 5. Bottom Arched Text: Two Concentric Lines in Clean White */}
        {/* Upper Line: CONVERGING PROFESSIONALS */}
        <text
          fill="#FFFFFF"
          fontFamily="'Arial Black', Impact, system-ui, sans-serif"
          fontSize="13"
          fontWeight="900"
          letterSpacing="1.2px"
        >
          <textPath href="#sealBottomArcUpper" startOffset="50%" textAnchor="middle">
            CONVERGING PROFESSIONALS
          </textPath>
        </text>

        {/* Lower Line: FOR EXCELLENCE */}
        <text
          fill="#FFFFFF"
          fontFamily="'Arial Black', Impact, system-ui, sans-serif"
          fontSize="13"
          fontWeight="900"
          letterSpacing="1.8px"
        >
          <textPath href="#sealBottomArcLower" startOffset="50%" textAnchor="middle">
            FOR EXCELLENCE
          </textPath>
        </text>
      </g>

      {/* 6. Inner PCB Field: Radiant Cyan-to-Deep-Blue */}
      <circle cx="200" cy="200" r="137" fill="url(#pcbRadialField)" />

      {/* 7. Printed Circuit Board Traces & Vias */}
      {/* Upper-Left: Amber/Gold Copper Traces (authentic to uploaded logo) */}
      <g stroke="#E89E28" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
        <path d="M 98,162 L 125,135 L 155,135 L 170,120 L 205,120 L 220,105" />
        <path d="M 88,188 L 115,160 L 138,160 L 150,148 L 180,148" />
        <path d="M 120,118 L 140,98 L 180,98 L 195,84 L 225,84" />
        <path d="M 148,82 L 175,82 L 190,68" />
      </g>

      {/* Gold Solder Eyelets / Vias */}
      <g fill="#FFAA2C" stroke="#4A2600" strokeWidth="1">
        <circle cx="220" cy="105" r="4" />
        <circle cx="180" cy="148" r="3.5" />
        <circle cx="225" cy="84" r="4.5" />
        <circle cx="190" cy="68" r="3.5" />
        <circle cx="88" cy="188" r="4" />
        <circle cx="98" cy="162" r="3.5" />
        {/* Inner Donut Holes */}
        <circle cx="220" cy="105" r="1.5" fill="#1C5E98" />
        <circle cx="225" cy="84" r="1.8" fill="#1C5E98" />
      </g>

      {/* Upper-Right & Lower Area: Electric Cyan & Blue Traces */}
      <g stroke="#3FE8FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        <path d="M 235,84 L 260,84 L 275,98 L 305,98" />
        <path d="M 220,105 L 245,105 L 265,125 L 295,125" />
        <path d="M 270,125 L 285,140 L 312,140" />

        {/* Lower Cyan Traces */}
        <path d="M 96,225 L 122,252 L 160,252 L 178,270 L 220,270" />
        <path d="M 125,245 L 148,268 L 188,268 L 205,285 L 250,285" />
        <path d="M 158,252 L 175,272 L 215,272 L 232,295 L 275,295" />
        <path d="M 205,255 L 225,280 L 262,280 L 278,300 L 305,300" />
        <path d="M 245,245 L 268,268 L 298,268" />
      </g>

      {/* Cyan Vias & Donut Pads */}
      <g fill="#43DBFF" stroke="#003554" strokeWidth="1">
        <circle cx="305" cy="98" r="4" />
        <circle cx="295" cy="125" r="3.5" />
        <circle cx="312" cy="140" r="3.5" />
        <circle cx="220" cy="270" r="4" fill="#FFAA2C" />
        <circle cx="250" cy="285" r="4.5" />
        <circle cx="275" cy="295" r="4" fill="#FFAA2C" />
        <circle cx="305" cy="300" r="4" />
        <circle cx="298" cy="268" r="3.5" />
        {/* Donut Holes */}
        <circle cx="305" cy="98" r="1.5" fill="#0E6BB5" />
        <circle cx="250" cy="285" r="1.8" fill="#0E6BB5" />
        <circle cx="305" cy="300" r="1.6" fill="#042A54" />
      </g>

      {/* 8. Central Tilted Microchip (IC DIP Package, -22.5deg tilt) */}
      <g transform="translate(200, 200) rotate(-22.5) translate(-200, -200)">
        
        {/* Top Metallic Chrome DIP Pins (8 Pins) */}
        {[-92, -66, -40, -14, 12, 38, 64, 90].map((xOffset, idx) => (
          <g key={`pin-top-${idx}`}>
            {/* Pin Drop Shadow */}
            <rect
              x={200 + xOffset - 7}
              y={136}
              width={14}
              height={18}
              rx={1.5}
              fill="#00182E"
              opacity="0.45"
            />
            {/* Curved Chrome Metallic Pin */}
            <rect
              x={200 + xOffset - 6.5}
              y={134}
              width={13}
              height={20}
              rx={2}
              fill="url(#chromePinGrad)"
              stroke="#5D6A78"
              strokeWidth="0.75"
            />
            {/* Specular White Highlight Stripe */}
            <line
              x1={200 + xOffset - 3}
              y1={135}
              x2={200 + xOffset - 3}
              y2={152}
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>
        ))}

        {/* Bottom Metallic Chrome DIP Pins (8 Pins) */}
        {[-92, -66, -40, -14, 12, 38, 64, 90].map((xOffset, idx) => (
          <g key={`pin-bot-${idx}`}>
            <rect
              x={200 + xOffset - 7}
              y={246}
              width={14}
              height={18}
              rx={1.5}
              fill="#00182E"
              opacity="0.45"
            />
            <rect
              x={200 + xOffset - 6.5}
              y={246}
              width={13}
              height={20}
              rx={2}
              fill="url(#chromePinGrad)"
              stroke="#5D6A78"
              strokeWidth="0.75"
            />
            <line
              x1={200 + xOffset - 3}
              y1={248}
              x2={200 + xOffset - 3}
              y2={264}
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>
        ))}

        {/* Main Solid Black IC Epoxy Package */}
        <rect
          x={84}
          y={148}
          width={232}
          height={104}
          rx={4}
          fill="url(#chipBodyTexture)"
          stroke="#38414D"
          strokeWidth="1.5"
          filter="url(#chipElevationShadow)"
        />

        {/* Diagonal Gloss Sheen Overlay */}
        <path
          d="M 84,148 L 316,148 L 260,252 L 84,252 Z"
          fill="url(#chipGlossSheen)"
        />

        {/* Pin 1 Notch (Left Edge Indentation) */}
        <path
          d="M 84,192 A 8,8 0 0,0 84,208 Z"
          fill="#0B0D11"
          stroke="#2A303A"
          strokeWidth="1"
        />

        {/* Inscriptions & Marks on Chip */}
        <g transform="translate(94, 156)">
          
          {/* Main "ICPEP" in Bold Slotted Wafer Letters */}
          <text
            x="6"
            y="48"
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            fontFamily="'Arial Black', Impact, sans-serif"
            fontSize="40"
            fontWeight="900"
            letterSpacing="-0.5px"
          >
            ICPEP
          </text>

          {/* Horizontal Wafer Louvers / PCB Bus Lines across ICPEP */}
          {[22, 27, 32, 37, 42].map((yLine, i) => (
            <line
              key={`icpep-slot-${i}`}
              x1="6"
              y1={yLine}
              x2="128"
              y2={yLine}
              stroke="#121519"
              strokeWidth="1.6"
            />
          ))}

          {/* "OMAN" with Oman National Colors & Arabic Script */}
          <g transform="translate(130, 16)">
            {/* O (White Outline with slatted bars) */}
            <text
              x="0"
              y="32"
              fill="#FFFFFF"
              fontFamily="'Arial Black', Impact, sans-serif"
              fontSize="28"
              fontWeight="900"
            >
              O
            </text>
            
            {/* M (Red #DA121A) */}
            <text
              x="22"
              y="32"
              fill="#DA121A"
              fontFamily="'Arial Black', Impact, sans-serif"
              fontSize="28"
              fontWeight="900"
            >
              M
            </text>

            {/* A (Red #DA121A) */}
            <text
              x="46"
              y="32"
              fill="#DA121A"
              fontFamily="'Arial Black', Impact, sans-serif"
              fontSize="28"
              fontWeight="900"
            >
              A
            </text>

            {/* N (Green #00843D) */}
            <text
              x="66"
              y="32"
              fill="#00843D"
              fontFamily="'Arial Black', Impact, sans-serif"
              fontSize="28"
              fontWeight="900"
            >
              N
            </text>

            {/* Arabic Script: سلطنة عُمان (Sultanate of Oman) */}
            <text
              x="42"
              y="45"
              fill="#FFFFFF"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="11"
              fontWeight="bold"
              textAnchor="middle"
            >
              سلطنة عُمان
            </text>
          </g>

          {/* FORMERLY PhICES */}
          <text
            x="132"
            y="56"
            fill="#CBD5E1"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="7"
            fontWeight="bold"
            letterSpacing="0.4px"
          >
            FORMERLY PhICES
          </text>

          {/* ACCREDITATION NO. 2020-001 */}
          <text
            x="6"
            y="72"
            fill="#FFFFFF"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="7.5"
            fontWeight="bold"
            letterSpacing="0.2px"
          >
            ACCREDITATION NO. 2020-001
          </text>

          {/* INSTITUTE OF COMPUTER ENGINEERS OF THE PHILIPPINES */}
          <text
            x="6"
            y="83"
            fill="#FFFFFF"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="7"
            fontWeight="bold"
            letterSpacing="0.2px"
          >
            INSTITUTE OF COMPUTER ENGINEERS OF THE PHILIPPINES
          </text>
        </g>
      </g>
    </svg>
  );
};

/**
 * Large Technical Schematic Motif for Hero Section
 */
export const HeroCircuitSchematic: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 540 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-[#12203A]"
      >
        {/* Drafting Grid Boundary & Calibration Marks */}
        <rect
          x="10"
          y="10"
          width="520"
          height="360"
          stroke="#12203A"
          strokeWidth="0.75"
          strokeOpacity="0.3"
          strokeDasharray="4 4"
        />

        {/* Corner Crosshairs */}
        <g stroke="#12203A" strokeWidth="1" strokeOpacity="0.6">
          <line x1="5" y1="10" x2="15" y2="10" />
          <line x1="10" y1="5" x2="10" y2="15" />
          <line x1="525" y1="10" x2="535" y2="10" />
          <line x1="530" y1="5" x2="530" y2="15" />
          <line x1="5" y1="370" x2="15" y2="370" />
          <line x1="10" y1="365" x2="10" y2="375" />
          <line x1="525" y1="370" x2="535" y2="370" />
          <line x1="530" y1="365" x2="530" y2="375" />
        </g>

        {/* Central Microprocessor / FPGA Unit */}
        <rect
          x="190"
          y="110"
          width="160"
          height="160"
          fill="#EEEEE7"
          stroke="#12203A"
          strokeWidth="2"
        />
        <rect
          x="200"
          y="120"
          width="140"
          height="140"
          fill="none"
          stroke="#C99A2E"
          strokeWidth="1"
        />

        {/* Processor Labels */}
        <text x="270" y="148" textAnchor="middle" fill="#12203A" fontSize="13" fontWeight="bold" fontFamily="monospace">
          ICpEP CORE-OMN
        </text>
        <text x="270" y="165" textAnchor="middle" fill="#4A5568" fontSize="9" fontFamily="monospace">
          32-BIT ARCH // RISC-V
        </text>
        <text x="270" y="180" textAnchor="middle" fill="#C99A2E" fontSize="9" fontFamily="monospace">
          PRC ACCREDITED SPEC
        </text>
        
        {/* Core silicon die representation */}
        <rect x="235" y="195" width="70" height="45" fill="#12203A" rx="1" />
        <text x="270" y="215" textAnchor="middle" fill="#EEEEE7" fontSize="8" fontFamily="monospace">
          CpE OMAN
        </text>
        <text x="270" y="228" textAnchor="middle" fill="#C99A2E" fontSize="7" fontFamily="monospace">
          MUSCAT HUB
        </text>

        {/* Microprocessor Pins Left */}
        {[130, 150, 170, 190, 210, 230, 250].map((y, idx) => (
          <g key={`pin-l-${idx}`}>
            <line x1="172" y1={y} x2="190" y2={y} stroke="#12203A" strokeWidth="1.5" />
            <text x="168" y={y + 3} textAnchor="end" fill="#6A778D" fontSize="7" fontFamily="monospace">
              {`D${idx}`}
            </text>
          </g>
        ))}

        {/* Microprocessor Pins Right */}
        {[130, 150, 170, 190, 210, 230, 250].map((y, idx) => (
          <g key={`pin-r-${idx}`}>
            <line x1="350" y1={y} x2="368" y2={y} stroke="#12203A" strokeWidth="1.5" />
            <text x="372" y={y + 3} textAnchor="start" fill="#6A778D" fontSize="7" fontFamily="monospace">
              {`A${idx}`}
            </text>
          </g>
        ))}

        {/* Circuit Traces Left: Bus Architecture */}
        <path
          d="M 172 130 L 100 130 L 70 100 L 40 100"
          stroke="#12203A"
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="40" cy="100" r="3" fill="#C99A2E" />
        <text x="40" y="90" textAnchor="middle" fill="#12203A" fontSize="8" fontFamily="monospace">
          NET_RX
        </text>

        <path
          d="M 172 170 L 120 170 L 90 200 L 50 200"
          stroke="#12203A"
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="50" cy="200" r="3" fill="#12203A" />
        <text x="50" y="215" textAnchor="middle" fill="#12203A" fontSize="8" fontFamily="monospace">
          CPD_BUS
        </text>

        <path
          d="M 172 230 L 110 230 L 80 270 L 40 270"
          stroke="#12203A"
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="40" cy="270" r="3" fill="#9C3B2E" />
        <text x="40" y="285" textAnchor="middle" fill="#9C3B2E" fontSize="8" fontFamily="monospace">
          ALRT_PWR
        </text>

        {/* Circuit Traces Right: Memory & Peripherals */}
        <path
          d="M 368 130 L 420 130 L 450 90 L 490 90"
          stroke="#12203A"
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="490" cy="90" r="3" fill="#C99A2E" />
        <text x="490" y="80" textAnchor="middle" fill="#12203A" fontSize="8" fontFamily="monospace">
          OMN_SCLK
        </text>

        <path
          d="M 368 190 L 430 190 L 460 220 L 495 220"
          stroke="#12203A"
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="495" cy="220" r="3" fill="#12203A" />
        <text x="495" y="235" textAnchor="middle" fill="#12203A" fontSize="8" fontFamily="monospace">
          ETH_MII
        </text>

        <path
          d="M 368 250 L 415 250 L 445 290 L 485 290"
          stroke="#12203A"
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="485" cy="290" r="3" fill="#C99A2E" />
        <text x="485" y="305" textAnchor="middle" fill="#12203A" fontSize="8" fontFamily="monospace">
          PRC_VLD
        </text>

        {/* Top Clock Crystal Circuit */}
        <line x1="270" y1="110" x2="270" y2="60" stroke="#12203A" strokeWidth="1.2" />
        <rect x="250" y="42" width="40" height="18" fill="#EEEEE7" stroke="#12203A" strokeWidth="1.2" />
        <text x="270" y="55" textAnchor="middle" fill="#12203A" fontSize="8" fontFamily="monospace">
          50 MHz
        </text>
        <circle cx="270" cy="35" r="2.5" fill="#9C3B2E" />

        {/* Bottom Ground & Voltage Rail */}
        <line x1="270" y1="270" x2="270" y2="310" stroke="#12203A" strokeWidth="1.2" />
        <line x1="255" y1="310" x2="285" y2="310" stroke="#12203A" strokeWidth="2" />
        <line x1="260" y1="315" x2="280" y2="315" stroke="#12203A" strokeWidth="1.5" />
        <line x1="265" y1="320" x2="275" y2="320" stroke="#12203A" strokeWidth="1" />
        <text x="270" y="335" textAnchor="middle" fill="#6A778D" fontSize="8" fontFamily="monospace">
          GND_REF
        </text>

        {/* Decorative Technical Callout Stamp */}
        <g transform="translate(30, 310)">
          <rect x="0" y="0" width="130" height="38" fill="none" stroke="#12203A" strokeWidth="0.75" />
          <text x="8" y="14" fill="#12203A" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
            DWG NO: ICPEP-OM-048
          </text>
          <text x="8" y="24" fill="#6A778D" fontSize="6.5" fontFamily="monospace">
            STATUS: ACTIVE / VERIFIED
          </text>
          <text x="8" y="33" fill="#C99A2E" fontSize="6.5" fontFamily="monospace">
            LOC: MUSCAT / GCC SECTOR
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * Standard Left-Aligned Drafting Section Header
 * with section index number ("01 —", "02 —"), thin rule, and drafting metadata.
 */
export const DraftingSectionHeader: React.FC<{
  number: string;
  title: string;
  subtitle?: string;
  tag?: string;
  id?: string;
}> = ({ number, title, subtitle, tag, id }) => {
  return (
    <div id={id} className="pt-8 pb-6 mb-8 border-b border-[#CDCDC0]">
      {/* Top micro-meta row */}
      <div className="flex items-center justify-between text-xs font-mono text-[#3B475C] tracking-wider mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#C99A2E]" />
          <span className="font-semibold text-[#12203A]">{number} —</span>
          <span className="uppercase tracking-widest text-[#3B475C]">
            SECTION SPECIFICATION
          </span>
        </div>
        {tag && (
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest bg-[#E3E3D8] border border-[#CDCDC0] text-[#12203A]">
            {tag}
          </span>
        )}
      </div>

      {/* Main Section Heading */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#12203A] tracking-tight leading-tight">
        {title}
      </h2>

      {/* Subtitle / Narrative Anchor */}
      {subtitle && (
        <p className="mt-2 text-base sm:text-lg text-[#3B475C] max-w-3xl font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
};

/**
 * Technical Cad-Style Engineer Avatar Placeholder or Real Officer Photo
 * Used for President & Officers with graceful fallback to CAD schematic.
 */
export const EngineerCadAvatar: React.FC<{
  name: string;
  role: string;
  photoUrl?: string;
  size?: 'md' | 'lg';
}> = ({ name, role, photoUrl, size = 'md' }) => {
  const isLarge = size === 'lg';
  const [photoFailed, setPhotoFailed] = React.useState(false);

  const initials = name
    .replace(/^Engr\.\s+/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('');

  if (photoUrl && !photoFailed) {
    return (
      <div
        className={`relative group bg-[#12203A] border-2 border-[#12203A] overflow-hidden shadow-sm shrink-0 ${
          isLarge ? 'w-28 h-28 sm:w-36 sm:h-36' : 'w-20 h-20'
        }`}
      >
        <img
          src={photoUrl}
          alt={`${name} - ${role}`}
          onError={() => setPhotoFailed(true)}
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
        {/* Subtle CAD Corner alignment bracket on photo */}
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-[#C99A2E]" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-[#C99A2E]" />
        <span
          className={`absolute bottom-1 right-1 font-mono font-bold text-[#EEEEE7] bg-[#12203A]/90 px-1 py-0.5 border border-[#C99A2E] ${
            isLarge ? 'text-[10px]' : 'text-[8px]'
          }`}
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center bg-[#E3E3D8] border border-[#CDCDC0] overflow-hidden shrink-0 ${
        isLarge ? 'w-28 h-28 sm:w-36 sm:h-36' : 'w-20 h-20'
      }`}
    >
      {/* Drafting Crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-full h-[1px] bg-[#12203A]" />
        <div className="h-full w-[1px] bg-[#12203A] absolute" />
      </div>

      {/* CAD Schematic silhouette */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#12203A] p-2"
      >
        {/* Drafting measurement circle */}
        <circle cx="50" cy="45" r="28" stroke="#12203A" strokeWidth="0.75" strokeDasharray="3 3" />
        
        {/* Abstract Head and Shoulders Schematic */}
        <circle cx="50" cy="38" r="16" stroke="#12203A" strokeWidth="1.5" fill="#EEEEE7" />
        {/* Eyewear / Circuit Nodes */}
        <line x1="42" y1="36" x2="48" y2="36" stroke="#C99A2E" strokeWidth="1.5" />
        <line x1="52" y1="36" x2="58" y2="36" stroke="#C99A2E" strokeWidth="1.5" />
        <line x1="48" y1="36" x2="52" y2="36" stroke="#12203A" strokeWidth="1" />

        {/* Shoulders & Lapel / Tie */}
        <path
          d="M 24 82 C 24 64, 36 60, 50 60 C 64 60, 76 64, 76 82"
          stroke="#12203A"
          strokeWidth="1.5"
          fill="#EEEEE7"
        />
        <path d="M 45 60 L 50 78 L 55 60" stroke="#C99A2E" strokeWidth="1" fill="none" />

        {/* Corner alignment marks */}
        <line x1="4" y1="4" x2="12" y2="4" stroke="#12203A" strokeWidth="1" />
        <line x1="4" y1="4" x2="4" y2="12" stroke="#12203A" strokeWidth="1" />
        <line x1="96" y1="4" x2="88" y2="4" stroke="#12203A" strokeWidth="1" />
        <line x1="96" y1="4" x2="96" y2="12" stroke="#12203A" strokeWidth="1" />
        <line x1="4" y1="96" x2="12" y2="96" stroke="#12203A" strokeWidth="1" />
        <line x1="4" y1="96" x2="4" y2="88" stroke="#12203A" strokeWidth="1" />
        <line x1="96" y1="96" x2="88" y2="96" stroke="#12203A" strokeWidth="1" />
        <line x1="96" y1="96" x2="96" y2="88" stroke="#12203A" strokeWidth="1" />
      </svg>

      {/* Monogram Badge */}
      <span
        className={`absolute bottom-1 right-1 font-mono font-bold text-[#12203A] bg-[#EEEEE7] px-1 py-0.5 border border-[#CDCDC0] ${
          isLarge ? 'text-[10px]' : 'text-[8px]'
        }`}
      >
        {initials}
      </span>
    </div>
  );
};

/**
 * Thin Technical Rule with Centered Diamond Marker
 */
export const TechnicalDivider: React.FC<{ label?: string }> = ({ label }) => {
  return (
    <div className="relative my-8 flex items-center">
      <div className="flex-grow border-t border-[#CDCDC0]" />
      <div className="mx-3 flex items-center gap-1.5 font-mono text-[10px] text-[#6A778D] uppercase tracking-widest">
        <span className="w-1.5 h-1.5 bg-[#C99A2E] rotate-45 inline-block" />
        {label && <span>{label}</span>}
        <span className="w-1.5 h-1.5 bg-[#C99A2E] rotate-45 inline-block" />
      </div>
      <div className="flex-grow border-t border-[#CDCDC0]" />
    </div>
  );
};
