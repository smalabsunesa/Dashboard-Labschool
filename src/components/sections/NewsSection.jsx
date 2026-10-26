import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Calendar, ArrowRight, Play } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import Skeleton from '../common/Skeleton';
import ImageWithSkeleton from '../common/ImageWithSkeleton';
import StoryViewerModal from '../common/StoryViewerModal';
import useNews from '../../hooks/useNews';

const primaryOrange = '#FF7A00';

// ─── Shared: vertical pan animation detection image item ──────────────────────
function SpotlightImageItem({ item, isActive }) {
  const [isTall, setIsTall] = useState(false);
  const containerRef = useRef(null);

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
        src={item.imageUrl}
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

// ─── OPSI 1: Vertical 9:16 TikTok-style Card ─────────────────────────────────
function SpotlightVertical({ items, onOpenStory }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const t = setInterval(() => setCurrentIndex((p) => (p + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length, isPaused, currentIndex]);

  if (!items || items.length === 0) return null;
  const item = items[currentIndex];

  return (
    <div className="mb-10 flex flex-col lg:flex-row items-center justify-center gap-8">
      {/* 9:16 Phone-frame Card */}
      <div
        className="relative w-full max-w-[340px] mx-auto rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 cursor-pointer"
        style={{ aspectRatio: '9/16' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => onOpenStory(currentIndex)}
      >
        {/* Background images */}
        {items.map((i, idx) => (
          <SpotlightImageItem key={i.id} item={i} isActive={idx === currentIndex} />
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

        {/* Top bar: progress + tag */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-2">
          <div className="flex gap-1">
            {items.map((_, idx) => (
              <div key={idx} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    idx < currentIndex ? 'bg-white w-full' : idx === currentIndex ? 'bg-white w-1/2' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>
          <span
            className="self-start text-[0.6rem] font-bold uppercase tracking-widest text-white px-2.5 py-1 rounded-full backdrop-blur-md"
            style={{ background: primaryOrange }}
          >
            <Sparkles size={10} className="inline mr-1 animate-pulse" />
            {item.tag || 'SPOTLIGHT'}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 pb-6">
          {item.publishedAt && (
            <p className="text-[0.65rem] text-slate-300 mb-1 flex items-center gap-1">
              <Calendar size={10} /> {item.publishedAt}
            </p>
          )}
          <h3 className="text-lg font-extrabold text-white leading-snug drop-shadow-md mb-1">
            {item.title}
          </h3>
          {item.caption && (
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">{item.caption}</p>
          )}
          {item.hashtags && (
            <p className="text-[0.65rem] text-orange-300 font-medium mb-3">{item.hashtags}</p>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onOpenStory(currentIndex); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all hover:opacity-90"
            style={{ background: primaryOrange }}
          >
            <Play size={14} className="fill-white" /> Putar Story Short
          </button>
        </div>

        {/* Nav arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((p) => (p - 1 + items.length) % items.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm"
            ><ChevronLeft size={16} /></button>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentIndex((p) => (p + 1) % items.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm"
            ><ChevronRight size={16} /></button>
          </>
        )}
      </div>

      {/* Right side: item list */}
      <div className="flex flex-col gap-3 max-w-sm w-full">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Berita Lainnya</p>
        {items.map((i, idx) => (
          <button
            key={i.id}
            onClick={() => { setCurrentIndex(idx); onOpenStory(idx); }}
            className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-300 border ${
              idx === currentIndex
                ? 'bg-slate-900 border-orange-500 shadow-md shadow-orange-500/10'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="w-12 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200">
              <ImageWithSkeleton
                src={i.imageUrl}
                alt={i.title}
                className="w-full h-full"
                imageClassName="object-cover w-full h-full"
              />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold line-clamp-2 leading-snug ${idx === currentIndex ? 'text-white' : 'text-slate-900'}`}>
                {i.title}
              </p>
              {i.publishedAt && (
                <p className={`text-[0.6rem] mt-1 ${idx === currentIndex ? 'text-slate-400' : 'text-slate-400'}`}>
                  {i.publishedAt}
                </p>
              )}
            </div>
            <Play size={14} className={`ml-auto shrink-0 ${idx === currentIndex ? 'text-orange-500' : 'text-slate-400'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── OPSI 2: Reel-style 3-card horizontal shelf ───────────────────────────────
function SpotlightReelShelf({ items, onOpenStory }) {
  const [activeIdx, setActiveIdx] = useState(1); // center card is hero

  const getCardStyle = (idx) => {
    const diff = idx - activeIdx;
    if (diff === 0) return 'scale-105 z-20 opacity-100';
    if (Math.abs(diff) === 1) return 'scale-90 z-10 opacity-70';
    return 'scale-75 z-0 opacity-40';
  };

  const shownItems = items.slice(0, 5);

  return (
    <div className="mb-10">
      {/* Reel shelf */}
      <div className="relative flex items-center justify-center gap-3 py-6 overflow-hidden">
        {shownItems.map((item, idx) => (
          <div
            key={item.id}
            className={`relative flex-shrink-0 transition-all duration-500 cursor-pointer rounded-2xl overflow-hidden bg-slate-900 shadow-xl ${getCardStyle(idx)}`}
            style={{ width: idx === activeIdx ? 220 : 140, aspectRatio: '9/16' }}
            onClick={() => {
              if (idx === activeIdx) onOpenStory(idx);
              else setActiveIdx(idx);
            }}
          >
            <ImageWithSkeleton
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full"
              imageClassName="object-cover w-full h-full"
              fallbackClassName="bg-slate-800"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            {/* Center card content */}
            {idx === activeIdx && (
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <span
                  className="text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block"
                  style={{ background: primaryOrange }}
                >
                  {item.tag || 'SPOTLIGHT'}
                </span>
                <h3 className="text-sm font-extrabold leading-snug mb-2 line-clamp-3">{item.title}</h3>
                <button
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[0.65rem] font-bold text-white transition-all"
                  style={{ background: primaryOrange }}
                >
                  <Play size={12} className="fill-white" /> Putar Short
                </button>
              </div>
            )}

            {/* Side card play icon */}
            {idx !== activeIdx && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-2.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                  <Play size={18} className="fill-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dot navigation */}
      <div className="flex justify-center gap-2 mt-2">
        {shownItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === activeIdx ? 'w-8 bg-orange-500' : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── OPSI 4: Hero Spotlight + Thumbnail Strip ─────────────────────────────────
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

  return (
    <div className="mb-10 grid lg:grid-cols-[1fr_280px] gap-6 items-stretch">
      {/* LEFT: Hero card 9:16 */}
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
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase text-white shadow-lg backdrop-blur-md"
              style={{ background: primaryOrange }}
            >
              <Sparkles size={13} className="animate-pulse" />
              {item.tag || 'SPOTLIGHT'}
            </span>
            {item.publishedAt && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <Calendar size={12} /> {item.publishedAt}
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
              onClick={(e) => { e.stopPropagation(); onOpenStory(activeIdx); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              style={{ background: primaryOrange }}
            >
              <Play size={16} className="fill-white" /> Putar Story Short
            </button>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="absolute bottom-5 right-6 z-30 flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setActiveIdx(idx); }}
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
        {items.map((i, idx) => (
          <button
            key={i.id}
            onClick={() => { setActiveIdx(idx); onOpenStory(idx); }}
            className={`group flex gap-3 rounded-2xl overflow-hidden border transition-all duration-300 text-left ${
              idx === activeIdx
                ? 'border-orange-500 shadow-md shadow-orange-500/15 bg-slate-900'
                : 'border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            {/* Thumbnail 9:16 */}
            <div className="w-16 shrink-0 relative overflow-hidden" style={{ aspectRatio: '9/16' }}>
              <ImageWithSkeleton
                src={i.imageUrl}
                alt={i.title}
                className="w-full h-full"
                imageClassName="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              {idx === activeIdx && (
                <div className="absolute inset-0 bg-orange-500/30 flex items-center justify-center">
                  <Play size={14} className="fill-white text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center py-3 pr-3 min-w-0">
              {i.tag && (
                <span className="text-[0.6rem] font-bold uppercase text-orange-500 mb-1">{i.tag}</span>
              )}
              <p className={`text-xs font-bold line-clamp-3 leading-snug ${idx === activeIdx ? 'text-white' : 'text-slate-900'}`}>
                {i.title}
              </p>
              {i.publishedAt && (
                <p className={`text-[0.6rem] mt-1.5 ${idx === activeIdx ? 'text-slate-400' : 'text-slate-400'}`}>
                  <Calendar size={9} className="inline mr-1" />{i.publishedAt}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Original Horizontal Spotlight (existing / default) ──────────────────────
function SpotlightSlider({ items, onOpenStory }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const t = setInterval(nextSlide, 5000);
    return () => clearInterval(t);
  }, [items.length, isPaused, currentIndex]);

  if (!items || items.length === 0) return null;
  const currentItem = items[currentIndex];

  return (
    <div
      className="relative mb-10 rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[380px] md:min-h-[440px] w-full overflow-hidden flex items-end">
        {items.map((item, index) => (
          <SpotlightImageItem key={item.id} item={item} isActive={index === currentIndex} />
        ))}

        <div className="relative z-20 p-6 md:p-10 max-w-3xl text-white">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase text-white shadow-lg backdrop-blur-md" style={{ background: primaryOrange }}>
              <Sparkles size={13} className="animate-pulse" />
              {currentItem.tag || 'SPOTLIGHT'}
            </span>
            {currentItem.publishedAt && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <Calendar size={12} /> {currentItem.publishedAt}
              </span>
            )}
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
            {currentItem.title}
          </h3>
          {currentItem.caption && (
            <p className="mt-3 text-sm md:text-base text-slate-200 line-clamp-2 md:line-clamp-3 leading-relaxed">
              {currentItem.caption}
            </p>
          )}
          {currentItem.hashtags && (
            <div className="mt-3 text-xs text-orange-300 font-medium">{currentItem.hashtags}</div>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenStory(currentIndex)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              style={{ background: primaryOrange }}
            >
              <Play size={16} className="fill-white" /> Putar Story Short
            </button>
            <a href="#admissions" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all">
              Info PPDB <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {items.length > 1 && (
          <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
            <button onClick={prevSlide} aria-label="Previous Slide" className="p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-105">
              <ChevronLeft size={18} />
            </button>
            <button onClick={nextSlide} aria-label="Next Slide" className="p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-105">
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {items.length > 1 && (
          <div className="absolute bottom-4 right-6 z-30 flex items-center gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-orange-500' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── News Card (used in grid feed) ────────────────────────────────────────────
function NewsCard({ item, onClick }) {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 snap-start flex flex-col lg:snap-none hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
        <ImageWithSkeleton
          src={item.imageUrl}
          alt={item.imageAlt || item.title}
          className="absolute inset-0 h-full w-full"
          imageClassName="object-cover group-hover:scale-105 transition-transform duration-500"
          fallbackClassName="bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
        <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white group-hover:bg-orange-500 group-hover:scale-110 transition-all">
          <Play size={14} className="fill-white" />
        </div>
        <span className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-white bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-xl line-clamp-2">
          {item.title}
        </span>
      </div>
      <div className="px-4 py-3 text-sm text-slate-700">
        <span className="font-semibold text-slate-900 mr-1">smalabschoolunesa.official</span>
        {item.caption && (
          <>
            <br />
            <span className="line-clamp-2 text-xs text-slate-600 mt-1 block leading-relaxed">{item.caption}</span>
          </>
        )}
      </div>
      {item.hashtags && <div className="px-4 mt-1 text-xs text-slate-500 truncate">{item.hashtags}</div>}
      {item.publishedAt && (
        <div className="px-4 mt-2 mb-4 text-[0.65rem] uppercase tracking-[0.2em] text-slate-400 font-semibold">
          {item.publishedAt}
        </div>
      )}
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
  const { data: newsItems, loading, error } = useNews();
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  const handleOpenStory = (index) => {
    setStoryIndex(index);
    setStoryOpen(true);
  };

  const spotlightItems = newsItems.slice(0, 5);

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
      ) : newsItems.length === 0 ? (
        <div className="px-6 py-5 text-sm text-slate-500">
          No updates are available at the moment. Please check back soon.
        </div>
      ) : (
        <div>
          {/* ── Hero Strip Spotlight ── */}
          <SpotlightHeroStrip items={spotlightItems} onOpenStory={handleOpenStory} />

          {/* ── Social Feed News Cards ── */}
          <div className="-mx-4 sm:-mx-6 lg:mx-0">
            <div className="grid grid-flow-col auto-cols-[minmax(240px,_80vw)] sm:auto-cols-[minmax(260px,_60vw)] gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pl-6 pr-4 sm:pl-8 sm:pr-6 lg:grid-flow-row lg:grid-cols-4 xl:grid-cols-5 lg:auto-cols-auto lg:overflow-visible lg:snap-none lg:pb-0 lg:px-0">
              {newsItems.map((item, idx) => (
                <NewsCard key={item.id} item={item} onClick={() => handleOpenStory(idx)} />
              ))}
            </div>
          </div>

          {/* ── Story Modal ── */}
          <StoryViewerModal
            isOpen={storyOpen}
            stories={newsItems}
            initialIndex={storyIndex}
            onClose={() => setStoryOpen(false)}
          />
        </div>
      )}
    </SectionWrapper>
  );
}
