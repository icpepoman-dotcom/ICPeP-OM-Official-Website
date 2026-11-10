import React, { useState, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { ChapterLogo, EngineerCadAvatar } from './CircuitMotif';
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Trash2,
  Plus,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  Camera,
  Layers,
  HelpCircle,
  AlertCircle,
  FileCheck,
  FolderOpen,
} from 'lucide-react';
import { GalleryPhoto } from '../data/content';

// Preset sample photos for fast testing and professional defaults
const PRESET_HEADSHOTS = [
  {
    name: 'Executive Tech Portrait (Navy Suit)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Cybersecurity Architect (Female)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Cloud Engineer (Male Specialist)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Director / Executive (Female Leader)',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  },
];

const PRESET_HERO_PHOTOS = [
  {
    title: 'Muscat Engineering Convention Hall',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    caption: 'ICpEP-Oman General Assembly and Technical Summit at the Muscat Convention Center.',
  },
  {
    title: 'High-Performance Microcomputing & Network Lab',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    caption: 'Computer engineers conducting SCADA telemetry and embedded systems benchmarking.',
  },
  {
    title: 'Philippine Engineering Guild in Oman',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    caption: 'Filipino computer engineers and mentors collaborating on mission-critical GCC projects.',
  },
];

/**
 * Client-side Canvas Image Optimizer
 * Scales down large images (e.g. 10MB mobile uploads) to max 1200px width/height
 * and compresses to lightweight WebP/JPEG data URL for storage efficiency.
 */
function compressAndReadImageFile(
  file: File,
  maxDimension = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const MediaManager: React.FC = () => {
  const { content, updateContent } = useContent();
  const [activeSubTab, setActiveSubTab] = useState<
    'all' | 'logo' | 'hero' | 'officers' | 'events' | 'gallery'
  >('all');

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // New gallery photo state
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState<Partial<GalleryPhoto>>({
    title: '',
    caption: '',
    category: 'Assembly',
    date: '2026',
    imageUrl: '',
  });

  const notify = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  // Helper for generic file upload
  const handleGenericFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressAndReadImageFile(file);
      onSuccess(dataUrl);
      notify(`Image "${file.name}" processed and applied!`);
    } catch (err) {
      console.error(err);
      notify('Failed to process image file. Try a different format.');
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-[#CDCDC0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#9C3B2E] font-bold uppercase">
            <Camera className="w-3.5 h-3.5" />
            <span>Media & Image Asset Control Deck</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#12203A]">
            Website Pictures, Logos & Graphic Assets
          </h3>
          <p className="text-xs sm:text-sm text-[#3B475C] font-sans mt-1">
            Upload custom photographs from your device or paste web URLs. Real-time client-side optimizer scales images automatically.
          </p>
        </div>

        {statusMsg && (
          <div className="bg-[#12203A] text-[#C99A2E] px-3 py-1.5 font-mono text-xs border border-[#C99A2E] flex items-center gap-1.5 shadow-sm">
            <Check className="w-3.5 h-3.5 text-[#C99A2E]" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#CDCDC0] pb-2 font-mono text-xs">
        {[
          { id: 'all', label: 'All Media Assets' },
          { id: 'logo', label: '01 Logo & Official Seal' },
          { id: 'hero', label: '02 Hero Visual & Banner' },
          { id: 'officers', label: '03 Officers & President' },
          { id: 'events', label: '04 Event Flyers' },
          { id: 'gallery', label: `05 Photo Gallery (${content.gallery?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3 py-1.5 border transition-all ${
              activeSubTab === tab.id
                ? 'bg-[#12203A] text-[#EEEEE7] border-[#12203A] font-bold shadow-xs'
                : 'bg-[#EEEEE7] text-[#3B475C] border-[#CDCDC0] hover:border-[#12203A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: LOGO & OFFICIAL SEAL */}
      {(activeSubTab === 'all' || activeSubTab === 'logo') && (
        <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#C99A2E] inline-block" />
              <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                01. Chapter Seal & Logo Branding
              </h4>
            </div>
            <span className="font-mono text-[10px] text-[#6A778D]">USED IN HEADER & FOOTER</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Logo Preview */}
            <div className="md:col-span-4 bg-[#F6F6F2] p-4 border border-[#CDCDC0] flex flex-col items-center justify-center text-center space-y-3">
              <span className="font-mono text-[10px] text-[#6A778D] uppercase tracking-wider">
                Live Emblem Preview
              </span>
              <div className="p-3 bg-[#EEEEE7] border border-[#CDCDC0] rounded-full shadow-xs">
                <ChapterLogo
                  size={96}
                  customLogoUrl={content.brand.useCustomLogo ? content.brand.logoUrl : undefined}
                />
              </div>
              <div className="font-mono text-xs">
                <span className="font-bold text-[#12203A] block">{content.brand.acronym}</span>
                <span className="text-[10px] text-[#6A778D]">
                  {content.brand.useCustomLogo && content.brand.logoUrl
                    ? 'Using Custom Uploaded Logo'
                    : 'Using Official Vector Seal (SVG)'}
                </span>
              </div>
            </div>

            {/* Logo Controls */}
            <div className="md:col-span-8 space-y-4">
              {/* Toggle Custom vs Vector */}
              <div className="flex items-center gap-3 bg-white p-3 border border-[#CDCDC0]">
                <input
                  type="checkbox"
                  id="useCustomLogoToggle"
                  checked={content.brand.useCustomLogo || false}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      brand: { ...p.brand, useCustomLogo: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 text-[#12203A] rounded border-[#CDCDC0] focus:ring-[#C99A2E]"
                />
                <label htmlFor="useCustomLogoToggle" className="text-xs font-mono text-[#12203A] cursor-pointer">
                  <span className="font-bold">Enable Custom Logo / Seal Image</span>
                  <span className="text-[#6A778D] block text-[11px]">
                    When checked, your custom uploaded or linked logo will replace the default vector seal across the entire site.
                  </span>
                </label>
              </div>

              {/* Upload & URL Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                    Upload Image File (PNG, JPG, SVG)
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full p-2.5 bg-white border border-[#12203A] hover:bg-[#F6F6F2] cursor-pointer text-xs font-mono text-[#12203A] transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#C99A2E]" />
                    <span>Choose File from Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleGenericFileUpload(e, (dataUrl) => {
                          updateContent((p) => ({
                            ...p,
                            brand: { ...p.brand, logoUrl: dataUrl, useCustomLogo: true },
                          }));
                        })
                      }
                    />
                  </label>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                    Or Direct Image URL
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={content.brand.logoUrl || ''}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          brand: { ...p.brand, logoUrl: e.target.value, useCustomLogo: true },
                        }))
                      }
                      className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#12203A]"
                    />
                  </div>
                </div>
              </div>

              {content.brand.logoUrl && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      updateContent((p) => ({
                        ...p,
                        brand: { ...p.brand, logoUrl: '', useCustomLogo: false },
                      }));
                      notify('Custom logo removed. Default SVG emblem restored.');
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#9C3B2E]/10 hover:bg-[#9C3B2E] text-[#9C3B2E] hover:text-white border border-[#9C3B2E] text-[11px] font-mono transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Default Vector Seal</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: HERO VISUAL & BANNER */}
      {(activeSubTab === 'all' || activeSubTab === 'hero') && (
        <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#C99A2E] inline-block" />
              <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                02. Hero Section Graphic / Photograph
              </h4>
            </div>
            <span className="font-mono text-[10px] text-[#6A778D]">RIGHT COLUMN OF HERO SECTION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Live Preview Card */}
            <div className="md:col-span-5 bg-[#F6F6F2] p-4 border border-[#CDCDC0] space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#6A778D]">
                <span>HERO PREVIEW</span>
                <span className="text-[#C99A2E] uppercase font-bold">
                  Mode: {content.hero.heroVisualMode || 'schematic'}
                </span>
              </div>

              <div className="relative aspect-video bg-[#12203A] border border-[#12203A] overflow-hidden flex items-center justify-center">
                {content.hero.heroImageUrl ? (
                  <img
                    src={content.hero.heroImageUrl}
                    alt={content.hero.heroImageCaption || 'Hero preview'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 space-y-1 font-mono text-xs text-[#EEEEE7]">
                    <Layers className="w-8 h-8 text-[#C99A2E] mx-auto" />
                    <p className="font-bold">CAD Schematic Mode Active</p>
                    <p className="text-[10px] text-[#C4C4B5]">
                      (Upload or select a photo below to show custom photography)
                    </p>
                  </div>
                )}
              </div>

              {content.hero.heroImageCaption && (
                <p className="font-mono text-[11px] text-[#3B475C] border-l-2 border-[#C99A2E] pl-2 py-0.5 italic">
                  {content.hero.heroImageCaption}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="md:col-span-7 space-y-4">
              {/* Visual Mode Selector */}
              <div>
                <label className="block font-mono text-xs text-[#3B475C] uppercase mb-1.5 font-bold">
                  Hero Visual Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'schematic', title: 'CAD Schematic', sub: 'Technical SVG only' },
                    { id: 'photo', title: 'Chapter Photo', sub: 'Photo takes priority' },
                    { id: 'both', title: 'Interactive Both', sub: 'Visitors can toggle' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        updateContent((p) => ({
                          ...p,
                          hero: { ...p.hero, heroVisualMode: m.id as any },
                        }))
                      }
                      className={`p-2.5 text-left border font-mono transition-all ${
                        (content.hero.heroVisualMode || 'schematic') === m.id
                          ? 'bg-[#12203A] text-[#EEEEE7] border-[#12203A] shadow-xs'
                          : 'bg-white text-[#12203A] border-[#CDCDC0] hover:border-[#12203A]'
                      }`}
                    >
                      <div className="font-bold text-xs">{m.title}</div>
                      <div className="text-[10px] text-[#C99A2E]">{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                    Upload Hero Photo (JPG, PNG)
                  </label>
                  <label className="flex items-center justify-center gap-2 w-full p-2 bg-white border border-[#12203A] hover:bg-[#F6F6F2] cursor-pointer text-xs font-mono text-[#12203A] transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#C99A2E]" />
                    <span>Upload Banner Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleGenericFileUpload(e, (dataUrl) => {
                          updateContent((p) => ({
                            ...p,
                            hero: {
                              ...p.hero,
                              heroImageUrl: dataUrl,
                              heroVisualMode: 'photo',
                            },
                          }));
                        })
                      }
                    />
                  </label>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                    Or Direct Hero Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={content.hero.heroImageUrl || ''}
                    onChange={(e) =>
                      updateContent((p) => ({
                        ...p,
                        hero: {
                          ...p.hero,
                          heroImageUrl: e.target.value,
                          heroVisualMode: e.target.value ? 'photo' : 'schematic',
                        },
                      }))
                    }
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#12203A]"
                  />
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                  Hero Image Caption & Document Plate
                </label>
                <input
                  type="text"
                  value={content.hero.heroImageCaption || ''}
                  onChange={(e) =>
                    updateContent((p) => ({
                      ...p,
                      hero: { ...p.hero, heroImageCaption: e.target.value },
                    }))
                  }
                  placeholder="e.g. Filipino Computer Engineers and Computing Specialists in Muscat, Sultanate of Oman"
                  className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-sans text-[#12203A]"
                />
              </div>

              {/* Sample Presets for Fast 1-Click Testing */}
              <div className="pt-2">
                <span className="block font-mono text-[10px] text-[#6A778D] uppercase mb-1.5">
                  Quick Presets (High-Res Curated Tech Photos)
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_HERO_PHOTOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        updateContent((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            heroImageUrl: preset.url,
                            heroImageCaption: preset.caption,
                            heroVisualMode: 'photo',
                          },
                        }));
                        notify(`Loaded preset: ${preset.title}`);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-[#12203A] hover:text-[#EEEEE7] border border-[#CDCDC0] text-[11px] font-mono text-[#12203A] transition-all"
                    >
                      <Sparkles className="w-3 h-3 text-[#C99A2E]" />
                      <span>{preset.title}</span>
                    </button>
                  ))}
                  {content.hero.heroImageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        updateContent((p) => ({
                          ...p,
                          hero: {
                            ...p.hero,
                            heroImageUrl: '',
                            heroVisualMode: 'schematic',
                          },
                        }));
                        notify('Reset to CAD schematic');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#9C3B2E]/10 hover:bg-[#9C3B2E] text-[#9C3B2E] hover:text-white border border-[#9C3B2E] text-[11px] font-mono transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear Hero Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: OFFICERS & PRESIDENT PORTRAITS */}
      {(activeSubTab === 'all' || activeSubTab === 'officers') && (
        <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#C99A2E] inline-block" />
              <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                03. Executive Leadership & President Portraits
              </h4>
            </div>
            <span className="font-mono text-[10px] text-[#6A778D]">PORTRAITS & SCHEMATICS</span>
          </div>

          {/* President's Message Official Portrait */}
          <div className="border border-[#12203A] bg-[#F6F6F2] p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-2">
              <span className="font-mono text-xs font-bold uppercase text-[#9C3B2E]">
                Official Address Portrait // {content.about.presidentsMessage.author}
              </span>
              <span className="font-mono text-[10px] bg-[#12203A] text-[#C99A2E] px-2 py-0.5 font-bold">
                PRESIDENT
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-3 flex flex-col items-center text-center space-y-2">
                <EngineerCadAvatar
                  name={content.about.presidentsMessage.author}
                  role="President"
                  size="lg"
                  photoUrl={content.about.presidentsMessage.photoUrl}
                />
                <span className="font-mono text-[10px] text-[#6A778D]">
                  {content.about.presidentsMessage.photoUrl ? 'Custom Portrait' : 'CAD Avatar Silhouette'}
                </span>
              </div>

              <div className="sm:col-span-9 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                      Upload President Photo
                    </label>
                    <label className="flex items-center justify-center gap-2 w-full p-2 bg-white border border-[#12203A] hover:bg-[#F6F6F2] cursor-pointer text-xs font-mono text-[#12203A] transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#C99A2E]" />
                      <span>Upload Portrait File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleGenericFileUpload(e, (dataUrl) => {
                            updateContent((p) => ({
                              ...p,
                              about: {
                                ...p.about,
                                presidentsMessage: {
                                  ...p.about.presidentsMessage,
                                  photoUrl: dataUrl,
                                },
                              },
                            }));
                          })
                        }
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                      Or Direct Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={content.about.presidentsMessage.photoUrl || ''}
                      onChange={(e) =>
                        updateContent((p) => ({
                          ...p,
                          about: {
                            ...p.about,
                            presidentsMessage: {
                              ...p.about.presidentsMessage,
                              photoUrl: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#12203A]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-mono text-[#6A778D]">Quick Pick:</span>
                  <button
                    type="button"
                    onClick={() => {
                      updateContent((p) => ({
                        ...p,
                        about: {
                          ...p.about,
                          presidentsMessage: {
                            ...p.about.presidentsMessage,
                            photoUrl: PRESET_HEADSHOTS[0].url,
                          },
                        },
                      }));
                      notify('President portrait updated to sample!');
                    }}
                    className="px-2 py-0.5 bg-white hover:bg-[#12203A] hover:text-[#EEEEE7] border border-[#CDCDC0] text-[10px] font-mono transition-colors"
                  >
                    Sample Executive Headshot
                  </button>

                  {content.about.presidentsMessage.photoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        updateContent((p) => ({
                          ...p,
                          about: {
                            ...p.about,
                            presidentsMessage: {
                              ...p.about.presidentsMessage,
                              photoUrl: '',
                            },
                          },
                        }));
                        notify('Reset to CAD schematic avatar');
                      }}
                      className="px-2 py-0.5 bg-[#9C3B2E]/10 hover:bg-[#9C3B2E] text-[#9C3B2E] hover:text-white border border-[#9C3B2E] text-[10px] font-mono transition-colors"
                    >
                      Clear / Reset to CAD Avatar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Executive Board Officers Grid */}
          <div className="space-y-3">
            <h5 className="font-mono text-xs font-bold uppercase text-[#12203A]">
              Chapter Executive Board Members (4 Officers)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.about.officers.map((officer, index) => (
                <div
                  key={officer.role}
                  className="border border-[#CDCDC0] bg-[#F6F6F2] p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <EngineerCadAvatar
                      name={officer.name}
                      role={officer.role}
                      size="md"
                      photoUrl={officer.photoUrl}
                    />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[10px] font-bold bg-[#12203A] text-[#EEEEE7] px-1.5 py-0.2 border border-[#C99A2E]">
                          {officer.role}
                        </span>
                        <span className="font-mono text-[9px] text-[#6A778D]">
                          OFFICER #{index + 1}
                        </span>
                      </div>
                      <h6 className="font-serif font-bold text-sm text-[#12203A] truncate">
                        {officer.name}
                      </h6>
                      <p className="font-mono text-[11px] text-[#C99A2E]">
                        {officer.credential}
                      </p>
                    </div>
                  </div>

                  {/* Photo Inputs */}
                  <div className="space-y-2 border-t border-[#CDCDC0] pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="flex items-center justify-center gap-1.5 p-1.5 bg-white border border-[#12203A] hover:bg-[#EEEEE7] cursor-pointer text-[11px] font-mono text-[#12203A] transition-colors">
                        <Upload className="w-3 h-3 text-[#C99A2E]" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleGenericFileUpload(e, (dataUrl) => {
                              updateContent((p) => {
                                const newOfficers = [...p.about.officers];
                                newOfficers[index] = {
                                  ...newOfficers[index],
                                  photoUrl: dataUrl,
                                };
                                return {
                                  ...p,
                                  about: { ...p.about, officers: newOfficers },
                                };
                              });
                            })
                          }
                        />
                      </label>

                      <input
                        type="url"
                        placeholder="Or paste photo URL"
                        value={officer.photoUrl || ''}
                        onChange={(e) =>
                          updateContent((p) => {
                            const newOfficers = [...p.about.officers];
                            newOfficers[index] = {
                              ...newOfficers[index],
                              photoUrl: e.target.value,
                            };
                            return {
                              ...p,
                              about: { ...p.about, officers: newOfficers },
                            };
                          })
                        }
                        className="p-1.5 bg-white border border-[#CDCDC0] text-[11px] font-mono text-[#12203A]"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => {
                          const presetUrl = PRESET_HEADSHOTS[index % PRESET_HEADSHOTS.length].url;
                          updateContent((p) => {
                            const newOfficers = [...p.about.officers];
                            newOfficers[index] = {
                              ...newOfficers[index],
                              photoUrl: presetUrl,
                            };
                            return {
                              ...p,
                              about: { ...p.about, officers: newOfficers },
                            };
                          });
                          notify(`Sample portrait applied to ${officer.name}`);
                        }}
                        className="text-[#12203A] hover:text-[#C99A2E] underline"
                      >
                        Use sample portrait
                      </button>

                      {officer.photoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            updateContent((p) => {
                              const newOfficers = [...p.about.officers];
                              newOfficers[index] = {
                                ...newOfficers[index],
                                photoUrl: '',
                              };
                              return {
                                ...p,
                                about: { ...p.about, officers: newOfficers },
                              };
                            });
                            notify(`Cleared photo for ${officer.name}`);
                          }}
                          className="text-[#9C3B2E] hover:underline"
                        >
                          Clear photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: EVENT POSTERS & FLYERS */}
      {(activeSubTab === 'all' || activeSubTab === 'events') && (
        <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#C99A2E] inline-block" />
              <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                04. Upcoming Event Flyers & Promotional Posters
              </h4>
            </div>
            <span className="font-mono text-[10px] text-[#6A778D]">EVENT CALENDAR DOCKET CARDS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.events.upcoming.map((evt, index) => (
              <div
                key={evt.id}
                className="border border-[#CDCDC0] bg-[#F6F6F2] p-4 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold bg-[#12203A] text-[#C99A2E] px-2 py-0.5 border border-[#C99A2E]">
                      {evt.id}
                    </span>
                    <span className="font-mono text-[10px] text-[#6A778D]">{evt.date}</span>
                  </div>
                  <h5 className="font-serif font-bold text-base text-[#12203A] leading-snug">
                    {evt.title}
                  </h5>
                </div>

                {/* Poster Preview */}
                <div className="relative aspect-video bg-[#12203A] border border-[#12203A] overflow-hidden">
                  {evt.imageUrl ? (
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 text-[#EEEEE7] font-mono text-xs">
                      <ImageIcon className="w-6 h-6 text-[#C99A2E] mb-1" />
                      <span>No flyer image set</span>
                    </div>
                  )}
                  <div className="absolute top-1 right-1 font-mono text-[9px] bg-black/60 text-white px-1.5 py-0.5">
                    {evt.category}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-2 border-t border-[#CDCDC0] pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="flex items-center justify-center gap-1.5 p-1.5 bg-white border border-[#12203A] hover:bg-[#EEEEE7] cursor-pointer text-[11px] font-mono text-[#12203A] transition-colors">
                      <Upload className="w-3 h-3 text-[#C99A2E]" />
                      <span>Upload Poster</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleGenericFileUpload(e, (dataUrl) => {
                            updateContent((p) => {
                              const newUpcoming = [...p.events.upcoming];
                              newUpcoming[index] = {
                                ...newUpcoming[index],
                                imageUrl: dataUrl,
                              };
                              return {
                                ...p,
                                events: { ...p.events, upcoming: newUpcoming },
                              };
                            });
                          })
                        }
                      />
                    </label>

                    <input
                      type="url"
                      placeholder="Or paste poster URL"
                      value={evt.imageUrl || ''}
                      onChange={(e) =>
                        updateContent((p) => {
                          const newUpcoming = [...p.events.upcoming];
                          newUpcoming[index] = {
                            ...newUpcoming[index],
                            imageUrl: e.target.value,
                          };
                          return {
                            ...p,
                            events: { ...p.events, upcoming: newUpcoming },
                          };
                        })
                      }
                      className="p-1.5 bg-white border border-[#CDCDC0] text-[11px] font-mono text-[#12203A]"
                    />
                  </div>

                  {evt.imageUrl && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          updateContent((p) => {
                            const newUpcoming = [...p.events.upcoming];
                            newUpcoming[index] = {
                              ...newUpcoming[index],
                              imageUrl: '',
                            };
                            return {
                              ...p,
                              events: { ...p.events, upcoming: newUpcoming },
                            };
                          });
                          notify(`Cleared poster for ${evt.id}`);
                        }}
                        className="text-[10px] font-mono text-[#9C3B2E] hover:underline"
                      >
                        Remove poster image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: CHAPTER PHOTO GALLERY ARCHIVE */}
      {(activeSubTab === 'all' || activeSubTab === 'gallery') && (
        <div className="border border-[#CDCDC0] bg-[#EEEEE7] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#CDCDC0] pb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#C99A2E] inline-block" />
                <h4 className="font-mono text-xs font-bold uppercase text-[#12203A]">
                  05. Chapter Photographic Archive & Moments in Oman
                </h4>
              </div>
              <p className="font-mono text-[11px] text-[#6A778D] mt-0.5">
                Displays real events, oath-taking, laboratories, and delegations in the public About section.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddPhotoModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#12203A] hover:bg-[#1C2F54] text-[#EEEEE7] font-mono text-xs uppercase font-bold border border-[#12203A] transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 text-[#C99A2E]" />
              <span>Add New Photo</span>
            </button>
          </div>

          {/* Add Photo Form Modal */}
          {showAddPhotoModal && (
            <div className="border-2 border-[#12203A] bg-[#F6F6F2] p-4 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-[#CDCDC0] pb-2 font-mono text-xs font-bold text-[#12203A]">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#C99A2E]" />
                  <span>Add New Photographic Record</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(false)}
                  className="text-[#9C3B2E] hover:underline"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                    Photo Title *
                  </label>
                  <input
                    type="text"
                    value={newPhoto.title || ''}
                    onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                    placeholder="e.g. 2026 Induction Ceremony at Muscat Diplomatic Quarter"
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-serif text-[#12203A]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                    Category Tag
                  </label>
                  <select
                    value={newPhoto.category || 'Assembly'}
                    onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value as any })}
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#12203A]"
                  >
                    <option value="Assembly">Assembly</option>
                    <option value="Technical Seminar">Technical Seminar</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Community">Community</option>
                    <option value="Oath Taking">Oath Taking</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                    Date / Month & Year
                  </label>
                  <input
                    type="text"
                    value={newPhoto.date || ''}
                    onChange={(e) => setNewPhoto({ ...newPhoto, date: e.target.value })}
                    placeholder="e.g. October 2026"
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#12203A]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                    Upload Picture or Direct URL *
                  </label>
                  <div className="flex gap-2">
                    <label className="flex items-center justify-center px-3 py-2 bg-white border border-[#12203A] hover:bg-[#EEEEE7] cursor-pointer text-xs font-mono text-[#12203A] shrink-0">
                      <Upload className="w-3.5 h-3.5 text-[#C99A2E]" />
                      <span className="ml-1">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleGenericFileUpload(e, (dataUrl) => {
                            setNewPhoto({ ...newPhoto, imageUrl: dataUrl });
                          })
                        }
                      />
                    </label>
                    <input
                      type="url"
                      value={newPhoto.imageUrl || ''}
                      onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-mono text-[#12203A]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-mono text-[11px] text-[#3B475C] uppercase mb-1">
                    Descriptive Caption / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={newPhoto.caption || ''}
                    onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                    placeholder="Provide context regarding the engineers, venue, dignitaries, or technology topics shown..."
                    className="w-full p-2 bg-white border border-[#CDCDC0] text-xs font-sans text-[#12203A]"
                  />
                </div>
              </div>

              {/* Preview & Save Action */}
              {newPhoto.imageUrl && (
                <div className="flex items-center gap-3 bg-white p-2 border border-[#CDCDC0]">
                  <img
                    src={newPhoto.imageUrl}
                    alt="Preview"
                    className="w-16 h-12 object-cover border border-[#12203A]"
                  />
                  <span className="text-xs font-mono text-[#12203A]">Image ready to publish</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-[#CDCDC0]">
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(false)}
                  className="px-3 py-1.5 border border-[#CDCDC0] font-mono text-xs text-[#3B475C] hover:bg-[#EEEEE7]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newPhoto.title || !newPhoto.imageUrl) {
                      notify('Please provide both a Title and an Image.');
                      return;
                    }

                    const record: GalleryPhoto = {
                      id: `GAL-${Date.now().toString().slice(-4)}`,
                      title: newPhoto.title || 'Chapter Gathering',
                      caption: newPhoto.caption || '',
                      category: (newPhoto.category as any) || 'Assembly',
                      date: newPhoto.date || '2026',
                      imageUrl: newPhoto.imageUrl || '',
                    };

                    updateContent((p) => ({
                      ...p,
                      gallery: [record, ...(p.gallery || [])],
                    }));

                    setNewPhoto({
                      title: '',
                      caption: '',
                      category: 'Assembly',
                      date: '2026',
                      imageUrl: '',
                    });
                    setShowAddPhotoModal(false);
                    notify(`Photo "${record.title}" added to gallery!`);
                  }}
                  className="px-4 py-1.5 bg-[#12203A] text-[#EEEEE7] font-mono text-xs uppercase font-bold border border-[#12203A] hover:bg-[#1C2F54]"
                >
                  Save Photo to Archive
                </button>
              </div>
            </div>
          )}

          {/* Existing Gallery Photos List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(content.gallery || []).map((photo, index) => (
              <div
                key={photo.id}
                className="border border-[#CDCDC0] bg-[#F6F6F2] overflow-hidden flex flex-col justify-between space-y-2 group"
              >
                <div className="relative aspect-video bg-[#12203A] overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 font-mono text-[9px] bg-[#12203A]/90 text-[#EEEEE7] px-2 py-0.5 border border-[#C99A2E] font-bold">
                    {photo.category}
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 font-mono text-[9px] bg-black/70 text-white px-1.5 py-0.5">
                    {photo.date}
                  </div>
                </div>

                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-[#C99A2E] font-bold block">
                      REF: {photo.id}
                    </span>
                    <input
                      type="text"
                      value={photo.title}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        updateContent((p) => {
                          const newGal = [...p.gallery];
                          newGal[index] = { ...newGal[index], title: newTitle };
                          return { ...p, gallery: newGal };
                        });
                      }}
                      className="w-full font-serif font-bold text-sm text-[#12203A] bg-transparent border-b border-transparent hover:border-[#CDCDC0] focus:border-[#12203A] focus:bg-white p-1"
                    />

                    <textarea
                      rows={2}
                      value={photo.caption}
                      onChange={(e) => {
                        const newCaption = e.target.value;
                        updateContent((p) => {
                          const newGal = [...p.gallery];
                          newGal[index] = { ...newGal[index], caption: newCaption };
                          return { ...p, gallery: newGal };
                        });
                      }}
                      className="w-full text-xs text-[#3B475C] font-sans bg-transparent border border-transparent hover:border-[#CDCDC0] focus:border-[#12203A] focus:bg-white p-1 mt-1 leading-relaxed"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#CDCDC0] flex items-center justify-between">
                    <label className="text-[10px] font-mono text-[#12203A] hover:text-[#C99A2E] cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Replace</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleGenericFileUpload(e, (dataUrl) => {
                            updateContent((p) => {
                              const newGal = [...p.gallery];
                              newGal[index] = { ...newGal[index], imageUrl: dataUrl };
                              return { ...p, gallery: newGal };
                            });
                          })
                        }
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete photographic record "${photo.title}"?`)) {
                          updateContent((p) => ({
                            ...p,
                            gallery: p.gallery.filter((_, i) => i !== index),
                          }));
                          notify('Photo record deleted from archive');
                        }
                      }}
                      className="text-[10px] font-mono text-[#9C3B2E] hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
