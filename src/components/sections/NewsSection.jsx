import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Calendar, ArrowRight, Play } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import Skeleton from '../common/Skeleton';
import ImageWithSkeleton from '../common/ImageWithSkeleton';
import StoryViewerModal from '../common/StoryViewerModal';
import useNews from '../../hooks/useNews';

const primaryOrange = '#FF7A00';

function SpotlightImageItem({ item, isActive }) {
  const [isTall, setIsTall] = useState(false);
  const containerRef = useRef(null);

  const handleLoad = (e) => {
    const img = e.target;
    if (img && containerRef.current) {
      const imgRatio = img.naturalHeight / img.naturalWidth;
      const containerRatio = containerRef.current.clientHeight / containerRef.current.clientWidth;
      if (imgRatio > containerRatio) {
        setIsTall(true);
      }
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
      {/* Gradient Overlays for High Contrast Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent hidden md:block" />
    </div>
  );
}

function SpotlightSlider({ items, onOpenStory }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [items.length, isPaused, currentIndex]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div
      className="relative mb-10 rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel Container */}
      <div className="relative min-h-[380px] md:min-h-[440px] w-full overflow-hidden flex items-end">
        {items.map((item, index) => (
          <SpotlightImageItem
            key={item.id}
            item={item}
            isActive={index === currentIndex}
          />
        ))}

        {/* Spotlight Content Overlay */}
        <div className="relative z-20 p-6 md:p-10 max-w-3xl text-white">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase text-white shadow-lg backdrop-blur-md"
              style={{ background: primaryOrange }}
            >
              <Sparkles size={13} className="animate-pulse" />
              {currentItem.tag || 'SPOTLIGHT'}
            </span>
            {currentItem.publishedAt && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <Calendar size={12} />
                {currentItem.publishedAt}
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
            <div className="mt-3 text-xs text-orange-300 font-medium">
              {currentItem.hashtags}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenStory(currentIndex)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white shadow-lg hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              style={{ background: primaryOrange }}
            >
              <Play size={16} className="fill-white" /> Putar Story Short
            </button>
            <a
              href="#admissions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
            >
              Info PPDB <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        {items.length > 1 && (
          <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-105"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-105"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Carousel Indicator Dots */}
        {items.length > 1 && (
          <div className="absolute bottom-4 right-6 z-30 flex items-center gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-8 bg-orange-500'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Original Instagram-style News Card with Click-to-Open Story Feature
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
        
        {/* Play Icon Badge */}
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

      {item.hashtags && (
        <div className="px-4 mt-1 text-xs text-slate-500 truncate">{item.hashtags}</div>
      )}

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

export default function NewsSection() {
  const { data: newsItems, loading, error } = useNews();
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  const handleOpenStory = (index) => {
    setStoryIndex(index);
    setStoryOpen(true);
  };

  const spotlightItems = newsItems.slice(0, 3);

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
          {/* 1. Large Spotlight Hero Carousel Slider at Top */}
          <SpotlightSlider items={spotlightItems} onOpenStory={handleOpenStory} />

          {/* 2. Original Social Feed News Cards Layout below the Slider */}
          <div className="-mx-4 sm:-mx-6 lg:mx-0">
            <div className="grid grid-flow-col auto-cols-[minmax(240px,_80vw)] sm:auto-cols-[minmax(260px,_60vw)] gap-6 overflow-x-auto snap-x snap-mandatory pb-4 pl-6 pr-4 sm:pl-8 sm:pr-6 lg:grid-flow-row lg:grid-cols-4 xl:grid-cols-5 lg:auto-cols-auto lg:overflow-visible lg:snap-none lg:pb-0 lg:px-0">
              {newsItems.map((item, idx) => (
                <NewsCard key={item.id} item={item} onClick={() => handleOpenStory(idx)} />
              ))}
            </div>
          </div>

          {/* 3. Fullscreen WhatsApp / Instagram Story Modal */}
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
