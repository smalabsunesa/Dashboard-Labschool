import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Play,
  Instagram,
  Video,
} from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import Skeleton from '../common/Skeleton';
import ImageWithSkeleton from '../common/ImageWithSkeleton';
import StoryViewerModal from '../common/StoryViewerModal';
import useNews from '../../hooks/useNews';
import { resolveMediaInfo, isNewsActiveOnPublic } from '../../lib/media';

const primaryOrange = '#FF7A00';

// ─── Shared: Spotlight Background Image / Video Poster ──────────────────────
function SpotlightImageItem({ item, isActive }) {
  const [isTall, setIsTall] = useState(false);
  const containerRef = useRef(null);
  const media = resolveMediaInfo(item);

  const handleLoad = (e) => {
    const img = e.target;
    if (img && containerRef.current) {
      const imgRatio = img.naturalHeight / img.naturalWidth;
      const containerRatio = containerRef.current.clientHeight / containerRef.current.clientWidth;
      if (imgRatio > containerRatio) setIsTall(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
        isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
      }`}
    >
      <ImageWithSkeleton
        src={media.thumbnailUrl || media.url}
        alt={item.imageAlt || item.title}
        className="w-full h-full"
        imageClassName={`object-cover w-full h-full ${
          isTall ? 'animate-vertical-pan scale-110' : 'scale-105'
        } transition-all duration-1000`}
        fallbackClassName="bg-slate-800"
        onLoad={handleLoad}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent hidden md:block" />
    </div>
  );
}

// ─── Spotlight Hero + Thumbnail Strip ─────────────────────────────────
function SpotlightHeroStrip({ items, onOpenStory }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const t = setInterval(() => setActiveIdx((p) => (p + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length, isPaused, activeIdx]);

  if (!items || items.length === 0) return null;
  const item = items[activeIdx];
  const media = resolveMediaInfo(item);

  return (
    <div className="mb-10 grid lg:grid-cols-[1fr_280px] gap-6 items-stretch">
      {/* LEFT: Hero card */}
      <div
        className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 cursor-pointer"
        style={{ minHeight: 480 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => onOpenStory(activeIdx)}
      >
        {items.map((i, idx) => (
          <SpotlightImageItem key={i.id} item={i} isActive={idx === activeIdx} />
        ))}

        {/* Content overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {media.type === 'instagram' && (
              <span className="inline-flex items-center gap-1.5 text-xs text-white bg-gradient-to-r from-pink-500 to-purple-600 backdrop-blur-md px-3 py-1 rounded-full font-bold shadow-md">
                <Instagram size={12} />
                Instagram Repost
              </span>
            )}

            {media.type === 'video' && (
              <span className="inline-flex items-center gap-1.5 text-xs text-white bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full font-bold shadow-md">
                <Video size={12} />
                Video Update
              </span>
            )}
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
            {item.title}
          </h3>

          {item.caption && (
            <p className="mt-3 text-sm md:text-base text-slate-200 line-clamp-2 leading-relaxed">
              {item.caption}
            </p>
          )}

          {item.hashtags && (
            <p className="mt-2 text-xs text-orange-300 font-medium">{item.hashtags}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenStory(activeIdx);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              style={{ background: primaryOrange }}
            >
              <Play size={16} className="fill-white" /> Putar Story Short
            </button>
            <a
              href="#admissions"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
            >
              Info PPDB <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="absolute bottom-5 right-6 z-30 flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIdx ? 'w-8 bg-orange-500' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Vertical thumbnail strip */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pilih Berita</p>
        {items.map((i, idx) => {
          const itemMedia = resolveMediaInfo(i);
          return (
            <button
              key={i.id}
              onClick={() => {
                setActiveIdx(idx);
                onOpenStory(idx);
              }}
              className={`group flex gap-3 rounded-2xl overflow-hidden border transition-all duration-300 text-left ${
                idx === activeIdx
                  ? 'border-orange-500 shadow-md shadow-orange-500/15 bg-slate-900'
                  : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Thumbnail 9:16 */}
              <div className="w-16 shrink-0 relative overflow-hidden" style={{ aspectRatio: '9/16' }}>
                <ImageWithSkeleton
                  src={itemMedia.thumbnailUrl || itemMedia.url}
                  alt={i.title}
                  className="w-full h-full"
                  imageClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  {itemMedia.type === 'instagram' ? (
                    <Instagram size={14} className="text-white drop-shadow" />
                  ) : itemMedia.type === 'video' ? (
                    <Play size={14} className="fill-white text-white drop-shadow" />
                  ) : idx === activeIdx ? (
                    <Play size={14} className="fill-white text-white drop-shadow" />
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col justify-center py-3 pr-3 min-w-0">
                <p
                  className={`text-xs font-bold line-clamp-3 leading-snug ${
                    idx === activeIdx ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {i.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── News Card (used in grid feed) ────────────────────────────────────────────
function NewsCard({ item, onClick }) {
  const media = resolveMediaInfo(item);

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 snap-start flex flex-col lg:snap-none hover:-translate-y-1 relative"
    >
      <div className="relative aspect-[4/5] bg-slate-900 overflow-hidden">
        <ImageWithSkeleton
          src={media.thumbnailUrl || media.url}
          alt={item.imageAlt || item.title}
          className="absolute inset-0 h-full w-full"
          imageClassName="object-cover group-hover:scale-105 transition-transform duration-500"
          fallbackClassName="bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Media Format Icon */}
        <div className="absolute top-3 right-3 z-10">
          <div className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white group-hover:scale-110 transition-all shadow-md">
            {media.type === 'instagram' ? (
              <Instagram size={14} className="text-pink-400" />
            ) : (
              <Play size={14} className="fill-white text-white" />
            )}
          </div>
        </div>

        {/* Bottom Title overlay */}
        <span className="absolute bottom-3 left-3 right-3 text-xs font-bold text-white bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl line-clamp-2 shadow-sm border border-white/10">
          {item.title}
        </span>
      </div>

      <div className="px-4 py-3 text-sm text-slate-700 flex-1 flex flex-col justify-between">
        <div>
          <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
            smalabschoolunesa.official
            {media.type === 'instagram' && <Instagram size={11} className="text-pink-500 inline" />}
          </span>

          {item.caption && (
            <p className="line-clamp-2 text-xs text-slate-600 mt-1.5 leading-relaxed">{item.caption}</p>
          )}
        </div>

        {item.hashtags && (
          <div className="mt-2 text-[0.65rem] text-blue-600 font-medium truncate">{item.hashtags}</div>
        )}
      </div>
    </article>
  );
}

function NewsCardSkeleton() {
  return (
    <article className="rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm snap-start flex flex-col lg:snap-none">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      </div>
      <div className="px-4 py-3 space-y-2">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="px-4 pb-4 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </article>
  );
}

// ─── Main NewsSection ─────────────────────────────────────────────────────────
export default function NewsSection() {
  const { data: rawNewsItems, loading, error } = useNews();
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  // Filter out expired news posts automatically for the public view
  const activeNewsItems = rawNewsItems.filter((item) => isNewsActiveOnPublic(item));

  const handleOpenStory = (index) => {
    setStoryIndex(index);
    setStoryOpen(true);
  };

  // Top spotlight items from active news
  const spotlightItems = activeNewsItems.filter((i) => i.isSpotlight).length > 0
    ? activeNewsItems.filter((i) => i.isSpotlight).slice(0, 5)
    : activeNewsItems.slice(0, 5);

  return (
    <SectionWrapper id="news" title="News & Events">
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="w-full h-80 rounded-3xl" />
          <div className="grid grid-flow-col auto-cols-[minmax(240px,_80vw)] sm:auto-cols-[minmax(260px,_60vw)] gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pl-6 pr-4 sm:pl-8 sm:pr-6 lg:grid-flow-row lg:grid-cols-4 xl:grid-cols-5 lg:auto-cols-auto lg:overflow-visible lg:snap-none lg:pb-0 lg:px-0">
            {Array.from({ length: 4 }).map((_, index) => (
              <NewsCardSkeleton key={`news-skeleton-${index}`} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="px-6 py-5 text-sm text-red-500">{error}</div>
      ) : activeNewsItems.length === 0 ? (
        <div className="px-6 py-5 text-sm text-slate-500">
          Belum ada berita yang tersedia saat ini. Silakan kunjungi kembali nanti.
        </div>
      ) : (
        <div>
          {/* ── Hero Strip Spotlight ── */}
          <SpotlightHeroStrip items={spotlightItems} onOpenStory={handleOpenStory} />

          {/* ── Social Feed News Cards ── */}
          <div className="-mx-4 sm:-mx-6 lg:mx-0">
            <div className="grid grid-flow-col auto-cols-[minmax(240px,_80vw)] sm:auto-cols-[minmax(260px,_60vw)] gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pl-6 pr-4 sm:pl-8 sm:pr-6 lg:grid-flow-row lg:grid-cols-4 xl:grid-cols-5 lg:auto-cols-auto lg:overflow-visible lg:snap-none lg:pb-0 lg:px-0">
              {activeNewsItems.map((item, idx) => (
                <NewsCard
                  key={item.id}
                  item={item}
                  onClick={() => handleOpenStory(idx)}
                />
              ))}
            </div>
          </div>

          {/* ── Story Modal ── */}
          <StoryViewerModal
            isOpen={storyOpen}
            stories={activeNewsItems}
            initialIndex={storyIndex}
            onClose={() => setStoryOpen(false)}
          />
        </div>
      )}
    </SectionWrapper>
  );
}
