/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ContentProvider, useContent } from './context/ContentContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Membership } from './components/Membership';
import { Events } from './components/Events';
import { ProfDevelopment } from './components/ProfDevelopment';
import { Partners } from './components/Partners';
import { Resources } from './components/Resources';
import { Contact } from './components/Contact';
import { AdminDeskPortalSection } from './components/AdminDeskPortalSection';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { AdminRegistrationRequestModal } from './components/AdminRegistrationRequestModal';
import { Sliders, ShieldCheck, UserPlus } from 'lucide-react';

function FloatingAdminTrigger() {
  const { setIsAdminOpen, adminUsers } = useContent();
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const pendingCount = adminUsers.filter((u) => u.status === 'Pending Approval').length;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-30 flex flex-col sm:flex-row items-end sm:items-center gap-2">
        <button
          type="button"
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#EEEEE7] hover:bg-[#E3E3D8] text-[#12203A] border border-[#12203A] shadow-lg text-[11px] font-mono tracking-wider uppercase transition-transform hover:scale-105"
          title="Apply for Administrator User Registration"
        >
          <UserPlus className="w-3.5 h-3.5 text-[#9C3B2E]" />
          <span className="font-bold">Register Admin</span>
        </button>

        <button
          type="button"
          onClick={() => setIsAdminOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] border border-[#C99A2E] shadow-xl text-xs font-mono tracking-wider uppercase transition-transform hover:scale-105 group"
          title="Open Live Website Admin Desk Console (Ctrl+Shift+A)"
          aria-label="Secretariat Admin Console"
        >
          <Sliders className="w-3.5 h-3.5 text-[#C99A2E] group-hover:rotate-45 transition-transform" />
          <span className="font-semibold">Admin Desk</span>
          {pendingCount > 0 ? (
            <span className="text-[9px] bg-[#9C3B2E] text-white px-1.5 py-0.2 font-bold animate-pulse">
              {pendingCount} REQ
            </span>
          ) : (
            <span className="text-[9px] bg-[#C99A2E] text-[#12203A] px-1 py-0.2 font-bold hidden sm:inline">
              LIVE EDIT
            </span>
          )}
        </button>
      </div>

      <AdminRegistrationRequestModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#EEEEE7] text-[#12203A] antialiased selection:bg-[#C99A2E]/25 selection:text-[#12203A]">
      {/* Sticky Header with Anchor Navigation & Mobile Drawer */}
      <Header />

      {/* Main Single-Page Content in Exact Required Sequence */}
      <main className="flex-grow">
        {/* 1. Hero */}
        <Hero />

        {/* 2. About */}
        <About />

        {/* 3. Membership */}
        <Membership />

        {/* 4. Events */}
        <Events />

        {/* 5. Professional Development */}
        <ProfDevelopment />

        {/* 6. Partners */}
        <Partners />

        {/* 7. Resources */}
        <Resources />

        {/* 8. Contact */}
        <Contact />

        {/* 9. Secretariat Admin Desk & Website Access Control */}
        <AdminDeskPortalSection />
      </main>

      {/* Technical Colophon Footer */}
      <Footer />

      {/* Persistent Quick Access Admin Trigger */}
      <FloatingAdminTrigger />

      {/* Full Admin Management Panel */}
      <AdminPanel />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <MainLayout />
    </ContentProvider>
  );
}
