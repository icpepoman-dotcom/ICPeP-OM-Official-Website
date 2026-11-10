import React, { useState } from 'react';
import { UpcomingEvent } from '../data/content';
import { useContent } from '../context/ContentContext';
import { DraftingSectionHeader, TechnicalDivider } from './CircuitMotif';
import { Calendar, Clock, MapPin, Tag, UserCheck, ArrowUpRight, Search, Check } from 'lucide-react';

export const Events: React.FC = () => {
  const { content, addEventRsvp } = useContent();
  const { events } = content;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [pastSearchQuery, setPastSearchQuery] = useState<string>('');
  const [rsvpEvent, setRsvpEvent] = useState<UpcomingEvent | null>(null);
  const [rsvpConfirmed, setRsvpConfirmed] = useState(false);
  const [rsvpTicket, setRsvpTicket] = useState<string>('');
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    email: '',
    mobile: '',
    prcLicense: '',
  });

  // Filter upcoming events
  const categories = ['All', 'CPD Seminar', 'Workshop', 'General Assembly', 'Training'];
  const filteredUpcoming = selectedCategory === 'All'
    ? events.upcoming
    : events.upcoming.filter((evt) => evt.category === selectedCategory);

  // Filter past events
  const filteredPast = events.past.filter((pe) => {
    const q = pastSearchQuery.toLowerCase();
    return (
      pe.title.toLowerCase().includes(q) ||
      pe.category.toLowerCase().includes(q) ||
      pe.venue.toLowerCase().includes(q)
    );
  });

  const handleDownloadICS = (evt: UpcomingEvent) => {
    // Generate simple .ics calendar file
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ICpEP-Oman//Event Calendar//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${evt.title}`,
      `DESCRIPTION:${evt.blurb} Speaker: ${evt.speaker || 'ICpEP Executive Team'}`,
      `LOCATION:${evt.place}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${evt.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="events" className="py-12 border-b border-[#CDCDC0] bg-[#EEEEE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <DraftingSectionHeader
          number="03"
          title={events.title}
          subtitle={events.subtitle}
          tag="SCHEDULE & LOGISTICS"
        />

        {/* Intro */}
        <div className="mb-10 text-left border-l-3 border-[#12203A] pl-4 sm:pl-6 max-w-4xl">
          <p className="text-base sm:text-lg text-[#3B475C] font-sans leading-relaxed">
            {events.intro}
          </p>
        </div>

        {/* Part 1: Upcoming Events List */}
        <div className="mb-14 text-left">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#CDCDC0] pb-3">
            <div>
              <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase tracking-wider block">
                Official Calendar
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                Upcoming Chapter Events
              </h3>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <span className="text-[#6A778D] mr-1 text-[11px] hidden sm:inline">Filter Track:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-xs transition-colors border ${
                    selectedCategory === cat
                      ? 'bg-[#12203A] text-[#EEEEE7] border-[#12203A] font-semibold'
                      : 'bg-[#F6F6F2] text-[#3B475C] border-[#CDCDC0] hover:border-[#12203A]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Cards Grid / List */}
          <div className="space-y-5">
            {filteredUpcoming.map((evt) => (
              <div
                key={evt.id}
                className="border border-[#CDCDC0] bg-[#F6F6F2] p-6 hover:border-[#12203A] transition-all relative group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Date & Meta */}
                  <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[#CDCDC0] pb-4 lg:pb-0 lg:pr-4 space-y-2">
                    {evt.imageUrl && (
                      <div className="relative aspect-video w-full overflow-hidden border border-[#12203A] bg-[#12203A] mb-2 shadow-xs group/img">
                        <img
                          src={evt.imageUrl}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-1 right-1 text-[8px] font-mono bg-[#12203A]/90 text-[#C99A2E] px-1 font-bold border border-[#C99A2E]/40">
                          POSTER
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-[#12203A] text-[#C99A2E] px-2 py-0.5 border border-[#C99A2E]">
                        {evt.id}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#EEEEE7] border border-[#CDCDC0] text-[#12203A]">
                        {evt.category}
                      </span>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-[#12203A] font-bold">
                        <Calendar className="w-3.5 h-3.5 text-[#9C3B2E]" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#3B475C] mt-1">
                        <Clock className="w-3.5 h-3.5 text-[#C99A2E]" />
                        <span>{evt.time}</span>
                      </div>
                    </div>

                    <div className="pt-2 font-mono text-[10px]">
                      <span className="text-[#6A778D] block">Status:</span>
                      <span
                        className={`font-bold uppercase ${
                          evt.seatsStatus === 'Filling Fast'
                            ? 'text-[#9C3B2E]'
                            : 'text-[#12203A]'
                        }`}
                      >
                        ● {evt.seatsStatus}
                      </span>
                    </div>
                  </div>

                  {/* Center Column: Title, Place, Blurb */}
                  <div className="lg:col-span-6 space-y-3">
                    <h4 className="font-serif font-bold text-xl sm:text-2xl text-[#12203A] group-hover:text-[#C99A2E] transition-colors leading-snug">
                      {evt.title}
                    </h4>

                    <div className="flex items-start gap-1.5 text-xs font-mono text-[#3B475C]">
                      <MapPin className="w-3.5 h-3.5 text-[#12203A] shrink-0 mt-0.5" />
                      <span>{evt.place}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#3B475C] font-sans leading-relaxed">
                      {evt.blurb}
                    </p>

                    {evt.speaker && (
                      <div className="pt-1 font-mono text-xs text-[#12203A] flex items-center gap-1.5">
                        <span className="text-[#6A778D]">Resource Speaker:</span>
                        <span className="font-semibold">{evt.speaker}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-3 pt-2 lg:pt-0">
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRsvpEvent(evt);
                          setRsvpConfirmed(false);
                        }}
                        className="w-full py-2.5 px-4 bg-[#12203A] text-[#EEEEE7] hover:bg-[#1C2F54] text-xs font-mono uppercase tracking-wider border border-[#12203A] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#C99A2E]" />
                        <span>Reserve a Seat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadICS(evt)}
                        className="w-full py-2 px-3 bg-[#EEEEE7] text-[#12203A] hover:bg-[#E3E3D8] text-xs font-mono uppercase border border-[#CDCDC0] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Calendar className="w-3 h-3 text-[#3B475C]" />
                        <span>Add to Calendar (.ics)</span>
                      </button>
                    </div>

                    <span className="text-[10px] font-mono text-[#6A778D] text-center lg:text-right block">
                      PRC CPD Verification Eligible
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RSVP Modal */}
        {rsvpEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#12203A]/70 backdrop-blur-xs p-4">
            <div className="bg-[#F6F6F2] border-2 border-[#12203A] max-w-lg w-full p-6 space-y-4 text-left shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-3">
                <span className="font-mono text-xs text-[#9C3B2E] font-bold uppercase">
                  RSVP REGISTRATION // {rsvpEvent.id}
                </span>
                <button
                  type="button"
                  onClick={() => setRsvpEvent(null)}
                  className="font-mono text-sm px-2 py-0.5 border border-[#CDCDC0] hover:bg-[#E3E3D8]"
                >
                  ✕
                </button>
              </div>

              {rsvpConfirmed ? (
                <div className="space-y-4 py-4 text-center">
                  <div className="w-12 h-12 bg-[#12203A] text-[#C99A2E] rounded-none flex items-center justify-center mx-auto border border-[#C99A2E]">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-2xl text-[#12203A] font-bold">
                    Seat Reservation Recorded
                  </h4>
                  <p className="text-xs sm:text-sm text-[#3B475C] font-sans">
                    Your attendance reservation for <strong>{rsvpEvent.title}</strong> has been logged in the Secretariat Register with Ticket Ref <code className="font-mono bg-[#EEEEE7] px-1 font-bold text-[#12203A]">{rsvpTicket}</code>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setRsvpEvent(null);
                      setRsvpConfirmed(false);
                      setRsvpForm({ name: '', email: '', mobile: '', prcLicense: '' });
                    }}
                    className="px-6 py-2 bg-[#12203A] text-[#EEEEE7] text-xs font-mono uppercase"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!rsvpForm.name || !rsvpForm.email) return;
                    const ticket = `TIC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
                    addEventRsvp({
                      ticketRef: ticket,
                      eventId: rsvpEvent.id,
                      eventTitle: rsvpEvent.title,
                      name: rsvpForm.name,
                      email: rsvpForm.email,
                      mobile: rsvpForm.mobile,
                      prcLicense: rsvpForm.prcLicense,
                    });
                    setRsvpTicket(ticket);
                    setRsvpConfirmed(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <h4 className="font-serif text-xl font-bold text-[#12203A]">
                      {rsvpEvent.title}
                    </h4>
                    <p className="text-xs font-mono text-[#3B475C] mt-1">
                      {rsvpEvent.date} • {rsvpEvent.time}
                    </p>
                    <p className="text-xs font-mono text-[#6A778D]">
                      {rsvpEvent.place}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-[#CDCDC0] pt-3">
                    <label className="block font-mono text-xs text-[#12203A] uppercase font-bold">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Maria Santos"
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                      className="w-full bg-[#EEEEE7] border border-[#CDCDC0] p-2 text-sm text-[#12203A]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-mono text-xs text-[#12203A] uppercase font-bold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="maria.santos@company.om"
                      value={rsvpForm.email}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                      className="w-full bg-[#EEEEE7] border border-[#CDCDC0] p-2 text-sm text-[#12203A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-mono text-[11px] text-[#12203A] uppercase font-bold mb-1">
                        Mobile / WhatsApp
                      </label>
                      <input
                        type="text"
                        placeholder="+968 9123 4567"
                        value={rsvpForm.mobile}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, mobile: e.target.value })}
                        className="w-full bg-[#EEEEE7] border border-[#CDCDC0] p-2 text-xs text-[#12203A]"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[11px] text-[#12203A] uppercase font-bold mb-1">
                        PRC License (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="PRC #00000"
                        value={rsvpForm.prcLicense}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, prcLicense: e.target.value })}
                        className="w-full bg-[#EEEEE7] border border-[#CDCDC0] p-2 text-xs text-[#12203A]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpEvent(null)}
                      className="px-4 py-2 border border-[#CDCDC0] text-xs font-mono uppercase hover:bg-[#E3E3D8]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#12203A] text-[#EEEEE7] text-xs font-mono uppercase hover:bg-[#1C2F54] border border-[#C99A2E] font-bold"
                    >
                      Confirm Reservation
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        <TechnicalDivider label="SPECIFICATION CLAUSE 3.2: HISTORICAL CONVOCATION LOG" />

        {/* Part 2: Past-Events Table */}
        <div className="text-left">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#CDCDC0] pb-3">
            <div>
              <span className="font-mono text-xs text-[#C99A2E] font-bold uppercase tracking-wider block">
                Archive Register
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#12203A]">
                Past Events & Seminars
              </h3>
            </div>

            {/* Table Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search past events or tags..."
                value={pastSearchQuery}
                onChange={(e) => setPastSearchQuery(e.target.value)}
                className="w-full bg-[#F6F6F2] border border-[#CDCDC0] focus:border-[#12203A] focus:outline-hidden pl-8 pr-3 py-1.5 text-xs text-[#12203A] font-sans"
              />
              <Search className="w-3.5 h-3.5 text-[#6A778D] absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-[#CDCDC0] bg-[#F6F6F2]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#12203A] text-[#EEEEE7] font-mono text-xs uppercase tracking-wider border-b border-[#C99A2E]">
                  <th className="py-3 px-4 border-r border-[#1C2F54]">Ref / ID</th>
                  <th className="py-3 px-4 border-r border-[#1C2F54]">Event Title</th>
                  <th className="py-3 px-4 border-r border-[#1C2F54]">Date Concluded</th>
                  <th className="py-3 px-4 border-r border-[#1C2F54]">Category Tag</th>
                  <th className="py-3 px-4 border-r border-[#1C2F54]">Venue / Platform</th>
                  <th className="py-3 px-4">CPD Credit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CDCDC0] text-xs font-sans">
                {filteredPast.length > 0 ? (
                  filteredPast.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#EEEEE7] transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#12203A] border-r border-[#CDCDC0]/60">
                        {item.id}
                      </td>
                      <td className="py-3 px-4 font-serif font-semibold text-sm text-[#12203A] border-r border-[#CDCDC0]/60">
                        {item.title}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#3B475C] border-r border-[#CDCDC0]/60 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="py-3 px-4 border-r border-[#CDCDC0]/60 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase bg-[#EEEEE7] border border-[#CDCDC0] text-[#12203A]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#3B475C] border-r border-[#CDCDC0]/60">
                        {item.venue}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#9C3B2E] font-semibold whitespace-nowrap">
                        {item.cpdUnits || 'Special Session'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs font-mono text-[#6A778D]">
                      No past events match your search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between font-mono text-[10px] text-[#6A778D] gap-2">
            <span>SHOWING {filteredPast.length} ARCHIVAL LOGGED RECORDS</span>
            <span>FOR CERTIFICATE OF ATTENDANCE RE-ISSUANCE: ICPEP.OMAN@GMAIL.COM</span>
          </div>
        </div>

      </div>
    </section>
  );
};
