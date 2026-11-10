/**
 * ==============================================================================
 * ICpEP-Oman — Website Copy & Content Configuration
 * ==============================================================================
 * This file contains ALL text content, section data, lists, officers, events,
 * and contact information for the ICpEP-Oman single-page website.
 * 
 * Non-developers can safely edit the text, dates, officer bios, and configuration
 * below without touching any component layout or styling code.
 * ==============================================================================
 */

export interface Officer {
  name: string;
  role: string;
  credential: string;
  bio: string;
  specialization: string;
  emailContact?: string;
  photoUrl?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  place: string;
  blurb: string;
  category: 'Workshop' | 'CPD Seminar' | 'Tech Talk' | 'General Assembly' | 'Training';
  speaker?: string;
  seatsStatus: 'Open' | 'Filling Fast' | 'Waitlist';
  imageUrl?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  category: 'Assembly' | 'Technical Seminar' | 'Workshop' | 'Community' | 'Oath Taking';
  date: string;
  imageUrl: string;
}

export interface PastEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  venue: string;
  cpdUnits?: string;
}

export interface DevTrack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  focalAreas: string[];
  prcAlignment: string;
  iconName: 'Cpu' | 'Award' | 'Presentation' | 'Wrench' | 'Video' | 'BookOpenCheck';
}

export interface PartnerItem {
  name: string;
  description: string;
  classification: string;
  status: 'Accredited' | 'MoU Active' | 'Collaborator' | 'Affiliated';
}

export interface Announcement {
  id: string;
  date: string;
  title: string;
  category: 'Circular' | 'PRC Notice' | 'Assembly' | 'Elections';
  summary: string;
  referenceDoc: string;
}

export interface FAQItem {
  id: string;
  question: string;
  category: string;
  answer: string;
}

export const siteContent = {
  // ----------------------------------------------------------------------------
  // BRAND & GENERAL CHAPTER SPECIFICATION
  // ----------------------------------------------------------------------------
  brand: {
    acronym: 'ICpEP-Oman',
    fullName: 'Institute of Computer Engineers of the Philippines — Oman Chapter',
    tagline: 'Connecting professionals. Advancing technology. Building the future.',
    parentOrg: 'ICpEP National Headquarters (Manila, Philippines)',
    chapterCode: 'ICPEP-CH-OMN-2024',
    jurisdiction: 'Sultanate of Oman (Muscat & GCC Regional Outreach)',
    primaryColor: '#12203A', // Deep Navy
    accentGold: '#C99A2E',  // Warm Brass Gold
    accentClay: '#9C3B2E',  // Muted Clay Red
    paperBg: '#EEEEE7',     // Warm Off-White Paper
    logoUrl: '',            // Custom uploaded or pasted chapter logo
    useCustomLogo: false,   // Whether to display custom logo instead of vector emblem
  },

  // ----------------------------------------------------------------------------
  // NAVIGATION ANCHORS
  // ----------------------------------------------------------------------------
  navigation: [
    { label: 'About', href: '#about', code: '01' },
    { label: 'Membership', href: '#membership', code: '02' },
    { label: 'Events', href: '#events', code: '03' },
    { label: 'Dev Tracks', href: '#development', code: '04' },
    { label: 'Partners', href: '#partners', code: '05' },
    { label: 'Resources', href: '#resources', code: '06' },
    { label: 'Contact', href: '#contact', code: '07' },
  ],

  // ----------------------------------------------------------------------------
  // SECTION 1: HERO
  // ----------------------------------------------------------------------------
  hero: {
    kicker: 'Filipino computer engineers & computing professionals in Oman',
    heading: 'A professional home for computer engineers building careers in Oman.',
    subheading:
      'We unite overseas Filipino computer engineers, systems architects, and technology specialists across the Sultanate of Oman. Delivering accredited Continuing Professional Development (CPD), industry mentorship, and an enduring community of engineering excellence.',
    ctaPrimary: {
      text: 'Become a member',
      href: '#membership-register',
    },
    ctaSecondary: {
      text: 'See upcoming events',
      href: '#events',
    },
    draftingSpec: {
      docId: 'SPEC-ICPEP-OM-001',
      charterRef: 'ICPEP-GLOBAL-AFFIL-OMN',
      coordinates: '23.5880° N, 58.3829° E (Muscat)',
      revision: 'REV 2026.4',
    },
    keyStats: [
      { label: 'Chartered Chapter', value: 'Sultanate of Oman', note: 'Recognized under ICpEP Global' },
      { label: 'Technical Domains', value: '12+ Disciplines', note: 'Cloud, Embedded, AI, Cyber, Telecom' },
      { label: 'PRC Aligned CPD', value: 'Accredited Units', note: 'Professional regulatory compliance' },
      { label: 'Filipino Community', value: 'PPO-Oman Aligned', note: 'Philippine Professional Organization' },
    ],
    heroImageUrl: '', // Custom hero photo / banner (optional)
    heroImageCaption: 'Filipino Computer Engineers and Computing Specialists in Muscat, Sultanate of Oman',
    heroVisualMode: 'schematic' as 'schematic' | 'photo' | 'both',
  },

  // ----------------------------------------------------------------------------
  // SECTION 2: ABOUT
  // ----------------------------------------------------------------------------
  about: {
    sectionNumber: '01',
    title: 'About the Chapter',
    subtitle: 'Institutional charter, mandate, and leadership governance in the Sultanate.',
    whoWeAre: {
      title: 'Who We Are',
      paragraphs: [
        'The Institute of Computer Engineers of the Philippines — Oman Chapter (ICpEP-Oman) is the recognized professional organization for Filipino Computer Engineers, computing scientists, and technology practitioners practicing their craft within the Sultanate of Oman.',
        'Established by expatriate Filipino engineers dedicated to nation-building through technology, our chapter serves as an indispensable bridge connecting professionals in telecommunications, oil & gas, financial infrastructure, enterprise software, cybersecurity, and public utility sectors throughout Muscat, Sohar, Salalah, and Duqm.',
        'We stand as an affiliated overseas chapter under the umbrella of ICpEP National (Philippines), adhering to professional standards mandated by the Professional Regulation Commission (PRC) and collaborating actively with the Philippine Professional Organization in Oman (PPO-Oman) under the auspices of the Embassy of the Philippines in Muscat.',
      ],
    },
    ourPurpose: {
      title: 'Our Purpose',
      statement:
        'To elevate the practice of computer engineering, protect professional integrity, safeguard member welfare abroad, and empower every Filipino computing professional in Oman to achieve peer recognition and leadership in the global digital economy.',
    },
    vision: {
      title: 'Vision',
      statement:
        'To be the premier, internationally recognized professional organization of Filipino computer engineers in the Gulf region—distinguished for technical mastery, ethical leadership, and proactive contribution to digital transformation in both Oman and the Philippines.',
    },
    mission: {
      title: 'Mission',
      statement:
        'To empower Filipino computer engineers in Oman through rigorous Continuing Professional Development, ethical practice enforcement, high-impact technical collaboration, career mentorship, and civic contributions that uplift the Filipino engineering diaspora.',
    },
    // 10-item objectives list as required
    objectives: [
      {
        number: '01',
        title: 'Professional Unification',
        description: 'Unify all Filipino computer engineering graduates, licensed practitioners, and computing specialists residing and working across the Sultanate of Oman into a cohesive, supportive guild.',
      },
      {
        number: '02',
        title: 'Technical Competence & CPD',
        description: 'Design and deliver accredited Continuing Professional Development (CPD) programs compliant with PRC guidelines to ensure continuous license maintenance and technical currency.',
      },
      {
        number: '03',
        title: 'Ethical Practice & Standards',
        description: 'Uphold the ICpEP Code of Ethics and foster highest standards of integrity, safety, data privacy, and accountability across all engineering deliverables and contracts.',
      },
      {
        number: '04',
        title: 'Knowledge Transfer & Innovation',
        description: 'Facilitate advanced technical knowledge exchange in emerging computing disciplines including Edge AI, Cloud Infrastructure, Industrial IoT, and Critical Infrastructure Defense.',
      },
      {
        number: '05',
        title: 'Credentials & Local Equivalence',
        description: 'Assist expatriate engineers in credential verification, foreign qualification equivalence, and local regulatory requirements with Omani engineering councils and authorities.',
      },
      {
        number: '06',
        title: 'Institutional Linkages',
        description: 'Forge bilateral academic, research, and technical linkages with universities, technology vendors, and professional associations in both the Sultanate of Oman and the Philippines.',
      },
      {
        number: '07',
        title: 'Mentorship & Career Transition',
        description: 'Provide structured mentorship and onboarding assistance for early-career computer engineers and newly arrived Filipino professionals adjusting to the GCC work ecosystem.',
      },
      {
        number: '08',
        title: 'Community & Diplomatic Service',
        description: 'Extend technological consultancy and volunteer services to the Philippine Embassy in Muscat, Philippine School Sultanate of Oman, and community organizations.',
      },
      {
        number: '09',
        title: 'Recognition of Engineering Excellence',
        description: 'Confer honors and awards recognizing outstanding technical achievements, patents, research papers, and institutional leadership demonstrated by members in Oman.',
      },
      {
        number: '10',
        title: 'Global Chapter Reciprocity',
        description: 'Collaborate with ICpEP National, Middle East regional chapters (UAE, KSA, Qatar, Bahrain, Kuwait), and international computing societies to foster worldwide mobility.',
      },
    ],
    // 6 core values as required
    coreValues: [
      {
        name: 'Professionalism',
        code: 'VAL-01',
        description: 'Conducting every technical endeavor with uncompromised integrity, accountability, and adherence to engineering codes.',
      },
      {
        name: 'Excellence',
        code: 'VAL-02',
        description: 'Pursuing the highest benchmarks in systems design, code quality, infrastructure reliability, and continuous improvement.',
      },
      {
        name: 'Innovation',
        code: 'VAL-03',
        description: 'Pioneering modern computing solutions to resolve complex industrial, societal, and technological challenges.',
      },
      {
        name: 'Collaboration',
        code: 'VAL-04',
        description: 'Cultivating inclusive solidarity among peers, allied engineering fields, and multidisciplinary international teams.',
      },
      {
        name: 'Lifelong Learning',
        code: 'VAL-05',
        description: 'Embracing constant skill enhancement, emerging paradigms, and disciplined intellectual curiosity throughout one’s career.',
      },
      {
        name: 'Service',
        code: 'VAL-06',
        description: 'Devoting engineering talent and resources to the upliftment of our diaspora community and both host and mother nations.',
      },
    ],
    // President's message
    presidentsMessage: {
      title: "President's Message",
      salutation: 'Mabuhay and Welcome to ICpEP-Oman!',
      quote:
        'In an era where technology redefines every sector of the global economy, the Filipino Computer Engineer stands resilient, capable, and profoundly respected.',
      body: [
        'On behalf of the Executive Board and the founding officers of ICpEP-Oman, I welcome you to our professional home. As Filipino computer engineers in the Sultanate of Oman, we are privileged to contribute directly to the nation’s vision of digital transformation—from safeguarding mission-critical telecommunications networks to engineering modern enterprise platforms and industrial automation.',
        'Our chapter was founded on a simple yet unyielding conviction: that no Filipino engineer working overseas should feel isolated in their professional journey. We exist to anchor your growth, facilitate your continuing education credentials under the PRC, celebrate your innovations, and provide a trusted brotherhood and sisterhood of colleagues.',
        'Whether you have practiced in the Sultanate for decades or have recently arrived in Muscat, ICpEP-Oman is your sanctuary for technical discourse, camaraderie, and career elevation. I invite you to join our ranks, participate in our CPD modules, and help us demonstrate the supreme caliber of Philippine computer engineering.',
      ],
      author: 'Engr. Michael Ray C. Del Rosario, PECE, CpE',
      role: 'Chapter President, ICpEP-Oman',
      term: 'Executive Board 2025–2027',
      licenseRef: 'PRC Reg. CpE / PECE No. 004819 | Senior Member ICpEP',
      photoUrl: '', // President portrait photo (URL or uploaded file)
    },
    // Officer grid: President, VP, Secretary, Treasurer
    officers: [
      {
        name: 'Engr. Michael Ray C. Del Rosario',
        role: 'President',
        credential: 'PECE, CpE, PMP',
        bio: 'Over 16 years leading mission-critical telecom systems and cloud architecture across the GCC and Southeast Asia. Passionate about professional empowerment and bilateral engineering relations.',
        specialization: 'Cloud Infrastructure & Enterprise Systems Architecture',
        photoUrl: '',
      },
      {
        name: 'Engr. Katherine Grace Mendoza',
        role: 'Vice President',
        credential: 'CpE, CISSP, CEH',
        bio: 'Senior Information Security Architect for banking and energy infrastructure in Muscat. Heads chapter technical programs, curriculum alignment, and CPD accreditation frameworks.',
        specialization: 'Cyber Defense & Industrial Control Systems Security',
        photoUrl: '',
      },
      {
        name: 'Engr. John Paul V. Alcantara',
        role: 'Secretary',
        credential: 'CpE, AWS Solutions Architect',
        bio: 'Full-stack systems engineer and DevOps specialist managing regional cloud migrations. Oversees official chapter records, secretariat communications, and membership credentials.',
        specialization: 'DevSecOps & Distributed Cloud Computing',
        photoUrl: '',
      },
      {
        name: 'Engr. Ma. Teresa Santos-Lim',
        role: 'Treasurer',
        credential: 'CpE, ITIL v4, TOGAF',
        bio: 'IT Operations Director with 14 years experience overseeing fiscal governance, enterprise ERP rollouts, and audit controls for multi-national corporations in Oman.',
        specialization: 'IT Governance, ERP & Technology Financial Management',
        photoUrl: '',
      },
    ] as Officer[],
  },

  // ----------------------------------------------------------------------------
  // SECTION 3: MEMBERSHIP
  // ----------------------------------------------------------------------------
  membership: {
    sectionNumber: '02',
    title: 'Membership & Registration',
    subtitle: 'Join a recognized community of Filipino computing specialists in the Sultanate.',
    intro:
      'Membership in ICpEP-Oman is an investment in your career, technical credibility, and professional standing. We welcome Filipino graduates of Computer Engineering and allied computing fields residing in the Sultanate of Oman.',
    // 7 member benefits
    benefits: [
      {
        number: '01',
        title: 'PRC-Accredited CPD Units',
        description: 'Earn certified Continuing Professional Development (CPD) points directly applicable to your PRC Computer Engineer license and ID renewal without leaving Oman.',
      },
      {
        number: '02',
        title: 'Technical Masterclasses & Labs',
        description: 'Complimentary or heavily subsidized access to advanced hands-on technical workshops in Cloud, AI/ML, Cyber Security, Embedded Systems, and DevOps.',
      },
      {
        number: '03',
        title: 'Cross-GCC Professional Network',
        description: 'Direct connections with senior Filipino engineers, technical managers, CIOs, and consultants across Oman, UAE, KSA, Qatar, and Bahrain.',
      },
      {
        number: '04',
        title: 'Career Mentorship & Job Endorsements',
        description: 'Access peer job referrals, industry recommendations, technical interview coaching, and career advancement guidance tailored to the GCC market.',
      },
      {
        number: '05',
        title: 'Certification Study Groups & Vouchers',
        description: 'Collaborative peer study circles and negotiated institutional voucher discounts for vendor exams (AWS, Azure, Cisco, CompTIA, ISC2).',
      },
      {
        number: '06',
        title: 'Official Chapter ID & Certificate',
        description: 'Receive an official physical/digital Chapter Membership Card, Certificate of Standing, and verification for local employer credentialing.',
      },
      {
        number: '07',
        title: 'Global ICpEP Chapter Reciprocity',
        description: 'Automatic standing reciprocity across all international ICpEP chapters, National conventions in the Philippines, and PPO-Oman joint events.',
      },
    ],
    // 3 categories: Professional, Student, Affiliate
    categories: [
      {
        id: 'professional',
        name: 'Professional Member',
        badge: 'Category A',
        targetAudience: 'BSCpE Graduates & Licensed Engineers',
        requirements: 'BS in Computer Engineering (BSCpE) or related engineering discipline; PRC CpE license or equivalent; currently working or residing in Oman.',
        privileges: [
          'Full voting rights in Chapter General Elections',
          'Eligible for Executive Board & Committee nominations',
          'PRC-accredited CPD certificates & official transcript',
          'Official Certificate of Good Standing for license renewals',
          'Access to closed-door technical masterclasses',
        ],
        annualFee: 'OMR 15.00 / year (or OMR 25 for 2 years)',
        isRecommended: true,
      },
      {
        id: 'student',
        name: 'Student Member',
        badge: 'Category B',
        targetAudience: 'Undergraduate Computing Students in Oman',
        requirements: 'Currently enrolled undergraduate student in Computer Engineering, Computer Science, or Information Technology in an accredited institution.',
        privileges: [
          'Complimentary or 75% discounted entry to all workshops',
          'Senior engineer 1-on-1 career mentorship pairing',
          'Capstone project technical critique & advisory',
          'Internship placement referrals across Oman tech firms',
          'Certificate of Student Chapter Affiliation',
        ],
        annualFee: 'OMR 5.00 / year',
        isRecommended: false,
      },
      {
        id: 'affiliate',
        name: 'Affiliate Member',
        badge: 'Category C',
        targetAudience: 'Allied IT, Software, & Data Practitioners',
        requirements: 'Graduates of Computer Science, Information Systems, Electronics Engineering, Data Science, or tech professionals practicing in computing roles.',
        privileges: [
          'Participation in all technical seminars & webinars',
          'Networking with multidisciplinary technology leads',
          'Access to certification study groups & repositories',
          'Eligibility for technical committee chairmanships',
          'Official Affiliate Membership Certificate',
        ],
        annualFee: 'OMR 12.00 / year',
        isRecommended: false,
      },
    ],
    // 5-step process strip
    processSteps: [
      {
        step: '01',
        title: 'Register',
        desc: 'Fill out the standardized online registration sheet with personal, contact, and professional details.',
      },
      {
        step: '02',
        title: 'Submit Requirements',
        desc: 'Provide electronic copies of your Degree Diploma / TOR, PRC License (if applicable), and Civil ID copy.',
      },
      {
        step: '03',
        title: 'Application Review',
        desc: 'The Chapter Membership Committee validates engineering qualifications against ICpEP national guidelines.',
      },
      {
        step: '04',
        title: 'Verification',
        desc: 'Confirmation of chapter standing, fee settlement verification, and record enrollment into the national roster.',
      },
      {
        step: '05',
        title: 'Confirmation & Record',
        desc: 'Receive official Membership ID number, digital certificate, chapter welcome pack, and forum access.',
      },
    ],
    formNotes:
      'All applications are processed in accordance with the Data Privacy Act and ICpEP National By-Laws. Documents are held in strict technical confidentiality.',
  },

  // ----------------------------------------------------------------------------
  // SECTION 4: EVENTS
  // ----------------------------------------------------------------------------
  events: {
    sectionNumber: '03',
    title: 'Events & Assemblies',
    subtitle: 'Continuing education, technical symposia, and engineering community gatherings.',
    intro:
      'ICpEP-Oman hosts a disciplined calendar of technical training, PRC-accredited seminars, technology showcases, and professional networking mixers designed to keep our engineers ahead of industry demands.',
    upcoming: [
      {
        id: 'EVT-2026-01',
        title: 'AI-Driven Edge Computing & Industrial IoT in the Energy Sector',
        date: 'October 17, 2026',
        time: '09:00 AM – 04:00 PM GST',
        place: 'Muscat Tech Innovation Hub (Hall B), Al Khuwair & Hybrid Online',
        blurb:
          'Deep dive into edge microcontrollers, tensor processing on resource-constrained embedded systems, and SCADA telemetry protocols tailored for Oman’s industrial infrastructure.',
        category: 'CPD Seminar',
        speaker: 'Engr. Ronald M. Bautista, Ph.D. — Principal IoT Architect',
        seatsStatus: 'Open',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'EVT-2026-02',
        title: 'Zero Trust Architecture: Implementing Cloud Security Frameworks',
        date: 'November 14, 2026',
        time: '01:30 PM – 05:30 PM GST',
        place: 'InterContinental Muscat Auditorium / MS Teams Stream',
        blurb:
          'Hands-on masterclass focusing on identity-based perimeter isolation, micro-segmentation, and regulatory compliance under regional cybersecurity mandates.',
        category: 'Workshop',
        speaker: 'Engr. Katherine Grace Mendoza, CpE, CISSP',
        seatsStatus: 'Filling Fast',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'EVT-2026-03',
        title: 'ICpEP-Oman 2026 Annual Technical Conference & General Assembly',
        date: 'December 12, 2026',
        time: '08:30 AM – 05:30 PM GST',
        place: 'Grand Millennium Hotel Muscat — Ballroom A',
        blurb:
          'Our flagship annual gathering: technical paper presentations, executive board elections, officer oath-taking, PRC updates, and chapter gala dinner.',
        category: 'General Assembly',
        speaker: 'Executive Board & Invited Keynote Dignitaries',
        seatsStatus: 'Open',
        imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'EVT-2026-04',
        title: 'Modern DevSecOps: Automated CI/CD Pipelines with Kubernetes',
        date: 'January 23, 2027',
        time: '02:00 PM – 06:00 PM GST',
        place: 'Virtual Interactive Lab (Instructor-Led)',
        blurb:
          'Container orchestration, GitOps workflows with ArgoCD, vulnerability scanning, and infrastructure-as-code automation using Terraform.',
        category: 'Training',
        speaker: 'Engr. John Paul V. Alcantara, AWS Solutions Architect',
        seatsStatus: 'Open',
        imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=800&q=80',
      },
    ] as UpcomingEvent[],
    // Past-events table
    past: [
      {
        id: 'PE-01',
        title: 'Building Resilient Microservices with Go and gRPC',
        date: 'August 22, 2026',
        category: 'Tech Talk',
        venue: 'Virtual Classroom (GCC Broad)',
        cpdUnits: '3.0 CPD Units',
      },
      {
        id: 'PE-02',
        title: 'Oman Cybersecurity Compliance: ISO 27001 & Oman Data Protection Law',
        date: 'July 11, 2026',
        category: 'CPD Seminar',
        venue: 'Crowne Plaza Muscat (Qurum)',
        cpdUnits: '6.0 CPD Units',
      },
      {
        id: 'PE-03',
        title: 'Embedded Systems with RISC-V and FreeRTOS',
        date: 'May 30, 2026',
        category: 'Workshop',
        venue: 'Higher College of Technology Labs, Al Khuwair',
        cpdUnits: '5.0 CPD Units',
      },
      {
        id: 'PE-04',
        title: 'Cloud Cost Optimization & FinOps for Enterprise Architectures',
        date: 'April 18, 2026',
        category: 'Webinar',
        venue: 'Zoom Interactive Hub',
        cpdUnits: '2.5 CPD Units',
      },
      {
        id: 'PE-05',
        title: 'ICpEP Middle East Chapters Quad-Con: Artificial Intelligence in GCC',
        date: 'February 27, 2026',
        category: 'Conference',
        venue: 'Hybrid (Oman, UAE, KSA, Qatar Joint Broadcast)',
        cpdUnits: '8.0 CPD Units',
      },
      {
        id: 'PE-06',
        title: 'Computer Engineering Licensure Preparation & Career Pathing',
        date: 'January 10, 2026',
        category: 'Mentorship',
        venue: 'Philippine Embassy Multi-Purpose Hall, Muscat',
        cpdUnits: '2.0 CPD Units',
      },
    ] as PastEvent[],
  },

  // ----------------------------------------------------------------------------
  // SECTION 5: PROFESSIONAL DEVELOPMENT
  // ----------------------------------------------------------------------------
  development: {
    sectionNumber: '04',
    title: 'Professional Development',
    subtitle: 'A structured engineering continuum built for technical excellence and lifelong mastery.',
    intro:
      'Our professional development framework is engineered to address both international industry competencies and Philippine regulatory mandates. We offer 6 distinct advancement tracks led by certified practitioners.',
    // 6 tracks: Training, Certification, Technology talks, Workshops, Webinars, CPD activities
    tracks: [
      {
        id: 'TRK-01',
        title: 'Training Programs',
        subtitle: 'Intensive Multi-Week Bootcamps',
        description:
          'Structured modular courses covering enterprise full-stack architecture, systems administration, Linux kernel internals, and high-performance network engineering.',
        focalAreas: ['Enterprise Linux Administration', 'Distributed Databases & Caching', 'Cloud Native Systems', 'Network Routing & SD-WAN'],
        prcAlignment: 'Accredited under Formal Technical Coursework (Domain II)',
        iconName: 'Wrench',
      },
      {
        id: 'TRK-02',
        title: 'Certification Pathways',
        subtitle: 'Credential Accelerator & Mentorship',
        description:
          'Guided study cohorts, examination preparation, and lab simulations for globally recognized industry credentials from AWS, Cisco, CompTIA, ISC2, and Red Hat.',
        focalAreas: ['AWS / Azure Solutions Architect', 'Cisco CCNA / CCNP Enterprise', 'CompTIA Security+ & PenTest+', 'PMP & Agile Engineering Lead'],
        prcAlignment: 'Specialized Credentials & Global Professional Equivalency',
        iconName: 'Award',
      },
      {
        id: 'TRK-03',
        title: 'Technology Talks',
        subtitle: 'Thought Leadership & Deep Dives',
        description:
          'Quarterly technical forums featuring distinguished engineering directors, researchers, and innovators analyzing disruptive technology shifts in computing.',
        focalAreas: ['Edge AI & Hardware Accelerators', 'Autonomous Systems & Robotics', 'Zero Trust Enterprise Paradigms', 'Quantum Computing Horizons'],
        prcAlignment: 'PRC Technical Symposium Credit Framework',
        iconName: 'Presentation',
      },
      {
        id: 'TRK-04',
        title: 'Workshops & Sandbox Labs',
        subtitle: 'Hands-on Hardware & Software Labs',
        description:
          'Practical laboratory sessions where engineers build and debug live systems—including FPGA synthesis, micro-controller firmware, and secure CI/CD pipelines.',
        focalAreas: ['FPGA & Verilog HDL Prototyping', 'ESP32 / ARM Cortex Embedded C', 'Container Security & Orchestration', 'Reverse Engineering & Fuzzing'],
        prcAlignment: 'Hands-on Practical Laboratory Credit (Domain III)',
        iconName: 'Cpu',
      },
      {
        id: 'TRK-05',
        title: 'Webinars & Virtual Exchanges',
        subtitle: 'Borderless Cross-Chapter Dialogue',
        description:
          'Interactive live streams uniting computer engineers across the Sultanate of Oman, neighboring GCC chapters, and universities in the Philippines.',
        focalAreas: ['Global Career Mobility in Tech', 'Remote Engineering Management', 'Cross-Border Cloud Governance', 'Open Source Contribution'],
        prcAlignment: 'Self-Directed & Online Distance Learning Units',
        iconName: 'Video',
      },
      {
        id: 'TRK-06',
        title: 'CPD Activities (PRC Aligned)',
        subtitle: 'License Renewal Compliance System',
        description:
          'Formally structured Continuing Professional Development modules designed directly under PRC Resolution guidelines to secure required credit points.',
        focalAreas: ['Engineering Ethics & Professional Laws', 'Critical Infrastructure Resilience', 'Data Privacy Law (Oman & PH)', 'Quality & Safety Standards'],
        prcAlignment: 'Direct PRC CPD Council for Computer Engineering Endorsement',
        iconName: 'BookOpenCheck',
      },
    ] as DevTrack[],
    cpdSummary: {
      complianceNotice:
        'All official certificates issued by ICpEP-Oman contain verifiable QR verification codes, accredited program references, and speaker credentials for immediate PRC verification.',
    },
  },

  // ----------------------------------------------------------------------------
  // SECTION 6: PARTNERS
  // ----------------------------------------------------------------------------
  partners: {
    sectionNumber: '05',
    title: 'Partners & Affiliations',
    subtitle: 'Collaborative linkages across academia, industry, technology vendors, and professional bodies.',
    intro:
      'We collaborate closely with leading institutions in the Sultanate of Oman and the Philippines to enrich technical curricula, foster career opportunities, and support bilateral exchange.',
    // 4 categories: Academic, Industry, Technology, Professional
    categories: [
      {
        id: 'academic',
        title: 'Academic Partners',
        code: 'CAT-ACAD',
        description: 'Colleges, universities, and technical research institutions facilitating curriculum exchange and student transition.',
        partners: [
          { name: 'Oman Higher Tech Institutions', description: 'Academic curriculum advisory & collaborative student technical forums in Muscat.', classification: 'University Linkage', status: 'MoU Active' },
          { name: 'Philippine Engineering Universities', description: 'Exchange of senior capstone research papers & faculty guest lectures.', classification: 'Higher Education', status: 'Collaborator' },
          { name: 'Philippine School Sultanate of Oman', description: 'STEM outreach, coding clubs, and youth engineering career counseling.', classification: 'Secondary STEM', status: 'Affiliated' },
        ] as PartnerItem[],
      },
      {
        id: 'industry',
        title: 'Industry Partners',
        code: 'CAT-IND',
        description: 'Enterprise organizations, telecom leaders, and engineering contractors in Oman employing Filipino technical talent.',
        partners: [
          { name: 'Oman Telecom & Infrastructure Operators', description: 'Talent recruitment pipelines & critical telecommunications systems training.', classification: 'Telecommunications', status: 'MoU Active' },
          { name: 'Regional Energy & Utilities Consortia', description: 'Industrial SCADA, OT security, and distributed telemetry knowledge transfer.', classification: 'Energy & Utilities', status: 'Collaborator' },
          { name: 'Banking & Financial IT Organizations', description: 'Cyber resilience, core banking modernization, and payment security seminars.', classification: 'Fintech & Banking', status: 'Collaborator' },
        ] as PartnerItem[],
      },
      {
        id: 'technology',
        title: 'Technology Partners',
        code: 'CAT-TECH',
        description: 'Global computing vendors, cloud providers, and developer platforms offering toolkits and certification tracks.',
        partners: [
          { name: 'Cloud Computing Alliances', description: 'Cloud credits, exam preparation cohorts, and architecture review masterclasses.', classification: 'Cloud & Infrastructure', status: 'Accredited' },
          { name: 'Hardware & Microelectronics Labs', description: 'Evaluation boards, embedded development kits, and prototyping support.', classification: 'Embedded & Semiconductors', status: 'Collaborator' },
          { name: 'Cybersecurity Testing Frameworks', description: 'Threat intelligence feeds, virtual CTF ranges, and defensive security tooling.', classification: 'Cyber Defense', status: 'Collaborator' },
        ] as PartnerItem[],
      },
      {
        id: 'professional',
        title: 'Professional Partners',
        code: 'CAT-PROF',
        description: 'Statutory bodies, umbrella engineering guilds, and diplomatic institutions in Oman and the Philippines.',
        partners: [
          { name: 'Philippine Professional Organization (PPO-Oman)', description: 'Apex umbrella body uniting all 14 PRC-recognized professions in Oman.', classification: 'Umbrella Council', status: 'Accredited' },
          { name: 'ICpEP National Headquarters', description: 'National mother organization governing professional standards and PRC liaison.', classification: 'National Charter', status: 'Affiliated' },
          { name: 'Allied Engineering Societies (IECEP, PICE, IIEE)', description: 'Joint inter-engineering symposia, sports festivals, and community aid drives.', classification: 'Allied APOs', status: 'Collaborator' },
        ] as PartnerItem[],
      },
    ],
    partnershipCta: {
      headline: 'Interested in partnering with ICpEP-Oman?',
      body: 'We welcome institutional partnerships for technical knowledge transfer, research collaboration, recruitment initiatives, and community development.',
      actionText: 'Propose a Partnership',
      actionHref: '#contact',
    },
  },

  // ----------------------------------------------------------------------------
  // SECTION 7: RESOURCES
  // ----------------------------------------------------------------------------
  resources: {
    sectionNumber: '06',
    title: 'Resources & Announcements',
    subtitle: 'Official circulars, regulatory advisories, guidelines, and member FAQs.',
    // Announcements list
    announcements: [
      {
        id: 'ANN-2026-03',
        date: 'September 15, 2026',
        title: 'PRC CPD Compliance Guidelines for GCC-Based Overseas Filipino Professionals',
        category: 'PRC Notice',
        summary: 'Updated matrix regarding self-directed learning credits, employer-sponsored technical courses, and the CPDAS online portal uploading workflow for overseas computer engineers.',
        referenceDoc: 'REF: PRC-CPD-RES-2026-OMN',
      },
      {
        id: 'ANN-2026-02',
        date: 'August 28, 2026',
        title: 'Call for Technical Papers: 2026 ICpEP-Oman Annual Convention',
        category: 'Assembly',
        summary: 'Submission guidelines for original research papers, case studies, and field engineering implementations in the Sultanate of Oman. Selected papers to be published in chapter compendium.',
        referenceDoc: 'DOC: CFP-OMN-CONF-2026',
      },
      {
        id: 'ANN-2026-01',
        date: 'July 19, 2026',
        title: 'Advisory: Omani Engineering Council Equivalence and Verification Process',
        category: 'Circular',
        summary: 'Step-by-step guidance on securing Ministry of Higher Education, Research and Innovation (MOHERI) degree equivalency and local registration for Filipino engineers.',
        referenceDoc: 'CIR: ICPEP-OM-EQV-08',
      },
      {
        id: 'ANN-2025-04',
        date: 'June 05, 2026',
        title: 'ICpEP-Oman Welfare and Professional Legal Assistance Protocol',
        category: 'Circular',
        summary: 'Establishment of the Chapter Legal & Welfare desk in partnership with the Philippine Embassy in Muscat to support contract review and workplace welfare for members.',
        referenceDoc: 'PROT: WELF-OMN-2026',
      },
    ] as Announcement[],
    // FAQ accordion
    faqs: [
      {
        id: 'faq-01',
        category: 'Membership',
        question: 'Who is eligible to join ICpEP-Oman?',
        answer:
          'Any Filipino citizen residing or working in the Sultanate of Oman who holds a Bachelor of Science in Computer Engineering (BSCpE) or a recognized equivalent degree. We also offer Affiliate Membership for allied computing practitioners (Computer Science, Information Technology, Electronics Engineering) and Student Membership for undergraduates enrolled in engineering programs.',
      },
      {
        id: 'faq-02',
        category: 'CPD & PRC',
        question: 'How do I earn PRC CPD units through ICpEP-Oman while living in Oman?',
        answer:
          'ICpEP-Oman conducts PRC-accredited seminars and workshops directly in Muscat and virtually. Every attendee receives an official Certificate of Attendance featuring the PRC Accreditation Number and allotted Credit Units, which can be uploaded directly to the PRC CPDAS system for your license renewal.',
      },
      {
        id: 'faq-03',
        category: 'Credentials',
        question: 'What if I am a Computer Science or IT graduate without a CpE degree?',
        answer:
          'You are strongly encouraged to join as an Affiliate Member! Affiliate members enjoy full access to our technical training, workshops, mentorship circles, and networking gatherings. You may also chair specialized technical subcommittees in software, cloud architecture, and data engineering.',
      },
      {
        id: 'faq-04',
        category: 'Dues & Fees',
        question: 'What are the membership dues and how are they utilized?',
        answer:
          'Annual professional membership dues are OMR 15.00 (or OMR 25.00 for two years). Dues directly fund chapter operations, event hall rentals, training infrastructure, accreditation filing fees with PRC and ICpEP National, and subsidizing student member initiatives. Transparent financial statements are presented at every Annual General Assembly.',
      },
      {
        id: 'faq-05',
        category: 'Process',
        question: 'How long does the membership verification process take?',
        answer:
          'Once you complete the online registration form and submit your digital copies (Diploma/TOR or PRC License, Civil ID), our Membership Committee typically reviews and processes your application within 3 to 5 business days. You will receive an email confirmation with your official Chapter Registration ID.',
      },
      {
        id: 'faq-06',
        category: 'Community',
        question: 'How is ICpEP-Oman connected with the Philippine Embassy in Muscat?',
        answer:
          'ICpEP-Oman is an active institutional member of the Philippine Professional Organization in Oman (PPO-Oman), which operates under the guidance and patronage of the Philippine Embassy in Muscat. We coordinate with the Embassy for professional missions, community technical aid, and official diplomatic events.',
      },
    ] as FAQItem[],
  },

  // ----------------------------------------------------------------------------
  // SECTION 8: CONTACT
  // ----------------------------------------------------------------------------
  contact: {
    sectionNumber: '07',
    title: 'Contact & Secretariat',
    subtitle: 'Reach our executive board, membership committee, or event organizers.',
    intro:
      'Have inquiries regarding membership verification, upcoming CPD seminars, sponsorship proposals, or technical partnerships? Get in touch with our secretariat in Muscat.',
    details: {
      email: 'icpep.oman@gmail.com',
      alternateEmail: 'secretariat@icpep-oman.org',
      hotline: '+968 9452 7810 / +968 9123 4567',
      address: {
        building: 'Philippine Professional Organization Hub / ICpEP Secretariat',
        district: 'Al Khuwair South, Muscat',
        country: 'Sultanate of Oman',
        poBox: 'P.O. Box 842, Postal Code 133',
      },
      officeHours: 'Sunday to Thursday: 05:00 PM – 09:00 PM GST | Friday to Saturday: 10:00 AM – 06:00 PM GST',
      diplomaticAffiliation: 'Coordinated through the Philippine Embassy in Muscat (P.O. Box 420, Madinat Qaboos)',
    },
    socialLinks: [
      { name: 'LinkedIn', handle: 'company/icpep-oman', url: 'https://linkedin.com' },
      { name: 'Facebook', handle: '@icpepoman', url: 'https://facebook.com' },
      { name: 'GitHub', handle: 'icpep-oman', url: 'https://github.com' },
      { name: 'Telegram', handle: 't.me/icpep_oman_community', url: 'https://telegram.org' },
    ],
    formNotice:
      'Official communications sent through this form are logged in the secretariat ticketing register. Typical response time is within 24 to 48 hours.',
  },

  // ----------------------------------------------------------------------------
  // SECTION 9: CHAPTER PHOTO GALLERY & MOMENTS IN OMAN
  // ----------------------------------------------------------------------------
  gallery: [
    {
      id: 'GAL-01',
      title: '2026 Executive Board Oath Taking & Charter Induction',
      caption: 'Induction of Chapter Officers and Board of Directors with Philippine Embassy representatives in Muscat.',
      category: 'Oath Taking',
      date: 'January 2026',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'GAL-02',
      title: 'Industrial IoT & SCADA Technical Laboratory',
      caption: 'Hands-on edge computing, microcontrollers, and sensor telemetry sandbox conducted at Muscat Innovation Center.',
      category: 'Workshop',
      date: 'May 2026',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'GAL-03',
      title: 'PRC CPD Technical Symposium on Cloud Security',
      caption: 'Filipino computer engineers attending accredited Continuing Professional Development symposium in Qurum.',
      category: 'Technical Seminar',
      date: 'July 2026',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'GAL-04',
      title: 'Philippine Professional Organization (PPO) Oman Fellowship',
      caption: 'Joint delegation meeting with the Philippine Ambassador and allied engineering societies at Muscat Diplomatic Quarter.',
      category: 'Community',
      date: 'March 2026',
      imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'GAL-05',
      title: 'ICpEP GCC Regional Chapters Virtual Technical Quad-Con',
      caption: 'Joint technical broadcast connecting Oman, UAE, KSA, and Qatar computer engineering practitioners.',
      category: 'Assembly',
      date: 'August 2026',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'GAL-06',
      title: 'Student Chapter & Young Engineers Mentorship Circle',
      caption: 'Senior practicing engineers conducting resume critique, portfolio review, and career guidance for undergraduates in Oman.',
      category: 'Workshop',
      date: 'September 2026',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    },
  ] as GalleryPhoto[],

  // ----------------------------------------------------------------------------
  // FOOTER & LEGAL COLOPHON
  // ----------------------------------------------------------------------------
  footer: {
    copyrightYear: 2026,
    legalNotice:
      'Institute of Computer Engineers of the Philippines — Oman Chapter. All rights reserved. Affiliated with ICpEP National (PRC APO for Computer Engineering). Operating in accordance with the laws of the Sultanate of Oman and the Republic of the Philippines.',
    blueprintFooterText: 'DRAWING: ICPEP-OMN-SITE-SHEET-01 | SCALE: 1:1 | CAD REF: CH-OMN-2024 | ARCH: CpE GUILD',
  },
};

export type SiteContent = typeof siteContent;
