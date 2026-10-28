import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Send,
  ExternalLink,
  Instagram,
  Video,
  Volume2,
  VolumeX,
  Clock,
  Infinity as InfinityIcon,
} from 'lucide-react';
import ImageWithSkeleton from './ImageWithSkeleton';
import { resolveMediaInfo, getDeadlineInfo } from '../../lib/media';

const STORY_DURATION = 6500; // 6.5 seconds per story

export default function StoryViewerModal({ isOpen, stories = [], initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);
  const videoRef = useRef(null);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setProgress(0);
      setIsPaused(false);
      pausedTimeRef.current = 0;
    }
  }, [isOpen, initialIndex]);

  const currentStory = stories[currentIndex] || stories[0];
  const media = resolveMediaInfo(currentStory);
  const deadline = getDeadlineInfo(
    currentStory?.deadlineAt || currentStory?.deadline_at,
    currentStory?.postType || currentStory?.post_type
  );

  // Synchronize HTML5 video play/pause
  useEffect(() => {
    if (videoRef.current && media.type === 'video' && !media.isDriveVideo) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isPaused, media.type, media.isDriveVideo]);

  // Handle auto-progress timer (Instagram embeds pause auto-progress so users can interact)
  useEffect(() => {
    if (!isOpen || stories.length === 0 || isPaused || media.type === 'instagram') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp - pausedTimeRef.current;
      const elapsed = timestamp - startTimeRef.current;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);

      setProgress(newProgress);

      if (elapsed >= STORY_DURATION) {
        if (currentIndex < stories.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setProgress(0);
          startTimeRef.current = null;
          pausedTimeRef.current = 0;
        } else {
          // Finished all stories
          onClose();
        }
      } else {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, currentIndex, isPaused, stories.length, onClose, media.type]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, stories.length]);

  const resetTimer = () => {
    setProgress(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetTimer();
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetTimer();
    } else {
      resetTimer();
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  if (!isOpen || !stories || stories.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none animate-fadeIn">
      {/* Desktop Previous Button */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        aria-label="Previous Story"
        className="hidden md:flex absolute left-8 z-50 items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Desktop Next Button */}
      <button
        onClick={handleNext}
        aria-label="Next Story"
        className="hidden md:flex absolute right-8 z-50 items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
      >
        <ChevronRight size={28} />
      </button>

      {/* Main WhatsApp/Instagram Story Screen Frame */}
      <div
        className="relative w-full h-full md:h-[92vh] md:max-w-[430px] md:rounded-[2.5rem] overflow-hidden bg-slate-950 flex flex-col justify-between shadow-2xl border border-white/10"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background / Media Player */}
        <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden">
          {media.type === 'instagram' ? (
            <div className="w-full h-full flex flex-col bg-slate-900 overflow-y-auto pt-16 pb-28">
              <iframe
                src={media.embedUrl}
                className="w-full flex-1 border-0 min-h-[460px] bg-white rounded-xl"
                title={currentStory.title}
                allowTransparency="true"
                allowFullScreen
                scrolling="yes"
              />
            </div>
          ) : media.type === 'youtube' ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <iframe
                src={media.embedUrl}
                className="w-full h-full border-0"
                title={currentStory.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : media.type === 'video' && media.isDriveVideo ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <iframe
                src={media.embedUrl}
                className="w-full h-full border-0"
                title={currentStory.title}
                allow="autoplay"
                allowFullScreen
              />
            </div>
          ) : media.type === 'video' ? (
            <video
              ref={videoRef}
              src={media.url}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              loop
              muted={isMuted}
            />
          ) : (
            <ImageWithSkeleton
              src={media.url}
              alt={currentStory.title}
              className="w-full h-full"
              imageClassName="object-cover w-full h-full animate-pulse-slow"
              fallbackClassName="bg-slate-900"
            />
          )}

          {/* Top & Bottom Gradient Overlays for High Contrast Text */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95 pointer-events-none" />
        </div>

        {/* Story Header: Segmented Progress Bars + Profile Info */}
        <div className="relative z-20 p-4 pt-5 space-y-3">
          {/* Multi-segment Progress Bar */}
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((story, idx) => {
              let fillPercentage = 0;
              if (idx < currentIndex) fillPercentage = 100;
              else if (idx === currentIndex) fillPercentage = media.type === 'instagram' ? 100 : progress;
              else fillPercentage = 0;

              return (
                <div key={story.id || idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-75 ease-linear"
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Profile Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md">
                <img
                  src="/Labschool-UNESA-logo.svg"
                  alt="Labschool Logo"
                  className="w-full h-full rounded-full object-contain bg-white p-1"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none flex items-center gap-1.5">
                  smalabschoolunesa.official
                  {media.type === 'instagram' && (
                    <Instagram size={13} className="text-pink-400 inline" />
                  )}
                </p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-2">
              {media.type === 'video' && !media.isDriveVideo && (
                <button
                  onClick={() => setIsMuted((p) => !p)}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>
              )}
              <button
                onClick={togglePause}
                aria-label={isPaused ? 'Play' : 'Pause'}
                className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                {isPaused ? <Play size={17} /> : <Pause size={17} />}
              </button>
              <button
                onClick={onClose}
                aria-label="Close Story"
                className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                <X size={19} />
              </button>
            </div>
          </div>
        </div>

        {/* Tap Hotspots for Left/Right Story Navigation */}
        <div className="absolute inset-y-16 inset-x-0 z-10 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={handlePrev}
            title="Sebelumnya"
          />
          <div
            className="w-2/3 h-full cursor-pointer"
            onClick={handleNext}
            title="Berikutnya"
          />
        </div>

        {/* Story Footer Content: Title, Caption, Hashtags & Action CTA */}
        <div className="relative z-20 p-5 pb-6 space-y-3 text-white">
          <div className="flex flex-wrap items-center gap-2">
            {/* Instagram Link Badge */}
            {media.type === 'instagram' && (
              <a
                href={media.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-md hover:opacity-90"
              >
                <Instagram size={11} />
                Buka di Instagram
                <ExternalLink size={10} />
              </a>
            )}
          </div>

          <h3 className="text-xl font-bold text-white drop-shadow-md leading-tight">
            {currentStory.title}
          </h3>

          {currentStory.caption && (
            <p className="text-xs md:text-sm text-slate-200 line-clamp-3 leading-relaxed drop-shadow">
              {currentStory.caption}
            </p>
          )}

          {currentStory.hashtags && (
            <p className="text-xs text-orange-300 font-medium">
              {currentStory.hashtags}
            </p>
          )}

          {/* Action CTA Button */}
          <div className="pt-2 flex items-center gap-3">
            <a
              href="#admissions"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs text-center shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <span>Daftar / Info PPDB</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://wa.me/62821232937212"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center transition-transform active:scale-95"
              title="Hubungi via WhatsApp"
            >
              <Send size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
