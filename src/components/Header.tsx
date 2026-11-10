import React, { useState, useEffect } from 'react';
import { ChapterLogo } from './CircuitMotif';
import { useContent } from '../context/ContentContext';
import { AdminRegistrationRequestModal } from './AdminRegistrationRequestModal';
import {
  Menu,
  X,
  ArrowUpRight,
  Sliders,
  ShieldCheck,
  UserPlus,
  Lock,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { content, setIsAdminOpen, isAuthenticated, currentUser, adminUsers } = useContent();

  const pendingAdminCount = adminUsers.filter((u) => u.status === 'Pending Approval').length;

  // Monitor scroll for shadow and active section highlight
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple intersection tracking for nav active state
      const sections = ['about', 'membership', 'events', 'development', 'partners', 'resources', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-[#EEEEE7]/95 backdrop-blur-md border-[#CDCDC0] shadow-xs'
          : 'bg-[#EEEEE7] border-[#CDCDC0]'
      }`}
    >
      {/* Top micro-spec rule / drafting header ribbon */}
      <div className="bg-[#12203A] text-[#EEEEE7] text-[10px] font-mono tracking-widest px-4 py-1 flex items-center justify-between border-b border-[#C99A2E]/30">
        <div className="flex items-center space-x-3 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-[#C99A2E]" />
            <span className="font-semibold">{content.brand.acronym}</span>
          </span>
          <span className="text-[#C4C4B5] hidden sm:inline">|</span>
          <span className="text-[#C4C4B5] hidden md:inline">{content.brand.jurisdiction}</span>
          <span className="text-[#C4C4B5] hidden lg:inline">|</span>
          <span className="text-[#C99A2E] hidden lg:inline">{content.hero.draftingSpec.coordinates}</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px]">
          <button
            type="button"
            onClick={() => setIsAdminOpen(true)}
            className="hover:text-[#C99A2E] transition-colors flex items-center gap-1 font-bold underline underline-offset-2 decoration-[#C99A2E]"
            title="Open Secretariat Admin Desk"
          >
            <ShieldCheck className="w-3 h-3 text-[#C99A2E]" />
            <span>Admin Desk</span>
            {pendingAdminCount > 0 && (
              <span className="px-1 py-0.1 bg-[#9C3B2E] text-white text-[8px] font-bold">
                {pendingAdminCount}
              </span>
            )}
          </button>
          <span className="text-[#C4C4B5] hidden sm:inline">|</span>
          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="hover:text-[#C99A2E] transition-colors flex items-center gap-1 text-[#C4C4B5] hover:underline"
            title="Request Administrative Clearance"
          >
            <UserPlus className="w-2.5 h-2.5 text-[#9C3B2E]" />
            <span className="hidden sm:inline">Admin Registration</span>
          </button>
          <span className="text-[#C4C4B5] hidden md:inline">|</span>
          <span className="text-[#C4C4B5] hidden md:inline">{content.hero.draftingSpec.charterRef}</span>
          <span className="bg-[#9C3B2E] text-white px-1.5 py-0.2 font-bold tracking-normal text-[9px] uppercase">
            PRC / APO Aligned
          </span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand Identity */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-hidden focus:ring-1 focus:ring-[#C99A2E]"
            aria-label="ICpEP-Oman Home"
          >
            <ChapterLogo
              size={46}
              customLogoUrl={content.brand.useCustomLogo ? content.brand.logoUrl : undefined}
              className="logo-gear-svg shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col text-left">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif font-bold text-xl sm:text-2xl text-[#12203A] tracking-tight">
                  {content.brand.acronym}
                </span>
                <span className="text-[11px] font-mono uppercase text-[#C99A2E] font-semibold tracking-wider">
                  Oman Chapter
                </span>
              </div>
              <span className="text-[10px] text-[#3B475C] font-mono tracking-tight hidden sm:block max-w-[280px] truncate">
                {content.brand.fullName}
              </span>
            </div>
          </a>

          {/* Desktop Anchor Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-sm font-sans" aria-label="Main Navigation">
            {content.navigation.map((item) => {
              const targetId = item.href.replace('#', '');
              const isActive = activeSection === targetId;

              return (
                <a
                  key={item.code}
                  href={item.href}
                  className={`px-2.5 py-1.5 transition-colors text-xs xl:text-sm font-medium flex items-baseline gap-1 border-b-2 ${
                    isActive
                      ? 'border-[#C99A2E] text-[#12203A] font-semibold'
                      : 'border-transparent text-[#3B475C] hover:text-[#12203A] hover:border-[#CDCDC0]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#6A778D] font-normal">
                    {item.code}.
                  </span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Admin User Registration CTA */}
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-[#F6F6F2] text-[#12203A] text-xs font-mono border border-[#CDCDC0] hover:border-[#9C3B2E] transition-all shadow-xs"
              title="Apply for Administrator User Clearance"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#9C3B2E]" />
              <span className="font-bold">Register Admin</span>
            </button>

            {/* Quick Admin Desk Toggle */}
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E3E3D8] hover:bg-[#D8D8CC] text-[#12203A] text-xs font-mono border border-[#CDCDC0] hover:border-[#12203A] transition-all shadow-xs"
              title="Open Secretariat Admin Desk (Ctrl+Shift+A)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#12203A]" />
              <span className="font-bold">Admin Desk</span>
              {pendingAdminCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#9C3B2E]" title={`${pendingAdminCount} pending admin approval requests`} />
              )}
            </button>

            <a
              href="#membership-register"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] px-3.5 py-2 text-xs font-mono tracking-wider uppercase border border-[#12203A] hover:border-[#C99A2E] transition-all shadow-xs group"
            >
              <span>Join Chapter</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C99A2E] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#12203A] hover:bg-[#E3E3D8] border border-[#CDCDC0] focus:outline-hidden focus:ring-1 focus:ring-[#C99A2E]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#CDCDC0] bg-[#EEEEE7] px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#6A778D] uppercase tracking-widest mb-2 px-2">
            <span>Table of Contents</span>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="text-[#9C3B2E] font-bold flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-[#C99A2E]" />
              <span>Admin Desk</span>
            </button>
          </div>
          {content.navigation.map((item) => (
            <a
              key={item.code}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-medium text-[#12203A] hover:bg-[#E3E3D8] border border-transparent hover:border-[#CDCDC0]"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#C99A2E]">{item.code}</span>
                <span className="font-serif text-base">{item.label}</span>
              </div>
              <span className="text-xs font-mono text-[#6A778D]">→</span>
            </a>
          ))}
          <div className="pt-3 border-t border-[#CDCDC0] mt-3 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAdminOpen(true);
              }}
              className="flex items-center justify-center gap-2 w-full bg-[#12203A] text-[#EEEEE7] px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#C99A2E] font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C99A2E]" />
              <span>Open Admin Desk</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsRegisterModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 w-full bg-[#E3E3D8] text-[#12203A] px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#CDCDC0] font-bold"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#9C3B2E]" />
              <span>Apply for Admin Clearance</span>
            </button>
            <a
              href="#membership-register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-[#9C3B2E] text-white px-4 py-2.5 text-xs font-mono uppercase tracking-wider border border-[#9C3B2E]"
            >
              <span>Register for Membership</span>
              <ArrowUpRight className="w-4 h-4 text-[#C99A2E]" />
            </a>
          </div>
        </div>
      )}

      {/* Admin Registration Clearance Modal */}
      <AdminRegistrationRequestModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </header>
  );
};
