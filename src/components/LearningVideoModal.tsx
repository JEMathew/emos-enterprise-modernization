import React, { useEffect, useId, useRef, useState } from 'react';
import { Clock3, Maximize2, X } from 'lucide-react';
import type { LearningVideo } from '../data/learningVideos';

interface LearningVideoModalProps {
  video: LearningVideo;
  onClose: () => void;
  returnFocusTo: HTMLElement | null;
}

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'video[controls]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export const LearningVideoModal: React.FC<LearningVideoModalProps> = ({
  video,
  onClose,
  returnFocusTo,
}) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [playbackState, setPlaybackState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    setPlaybackState('loading');
  }, [video.mediaUrl]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute('disabled'));

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      returnFocusTo?.focus();
    };
  }, [onClose, returnFocusTo]);

  const enterFullscreen = () => {
    const requestFullscreen = playerContainerRef.current?.requestFullscreen;
    if (requestFullscreen) {
      void requestFullscreen.call(playerContainerRef.current).catch(() => undefined);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#08111f] text-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-amber-100">
                {video.sequence}
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1">
                EMOS V2
              </span>
              {video.duration && (
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3 w-3" aria-hidden="true" />
                  {video.duration}
                </span>
              )}
            </div>
            <h2 id={titleId} className="font-serif text-lg font-bold leading-snug sm:text-2xl">
              {video.title}
            </h2>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">{video.category}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={`Close video: ${video.title}`}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div ref={playerContainerRef} className="relative aspect-video w-full bg-black">
            {video.mediaUrl ? (
              <>
                <video
                  ref={mediaRef}
                  src={video.mediaUrl}
                  poster={video.thumbnailUrl}
                  aria-label={`${video.sequence}: ${video.title} video player`}
                  controls
                  tabIndex={0}
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain"
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    const player = event.currentTarget;
                    if (event.key.toLowerCase() === 'k') {
                      event.preventDefault();
                      if (player.paused) void player.play().catch(() => setPlaybackState('error'));
                      else player.pause();
                    }
                    if (event.key.toLowerCase() === 'm') {
                      event.preventDefault();
                      player.muted = !player.muted;
                    }
                    if (['ArrowLeft', 'ArrowRight'].includes(event.key) && Number.isFinite(player.duration)) {
                      event.preventDefault();
                      player.currentTime = Math.max(0, Math.min(player.duration, player.currentTime + (event.key === 'ArrowLeft' ? -5 : 5)));
                    }
                  }}
                  onLoadedData={() => setPlaybackState('ready')}
                  onCanPlay={() => setPlaybackState('ready')}
                  onPlaying={() => setPlaybackState('ready')}
                  onWaiting={() => setPlaybackState('loading')}
                  onError={() => setPlaybackState('error')}
                />
                {playbackState === 'loading' && (
                  <div role="status" className="pointer-events-none absolute inset-x-0 top-4 text-center">
                    <span className="rounded-lg bg-slate-950/90 px-3 py-2 text-sm text-white">Loading video…</span>
                  </div>
                )}
                {playbackState === 'error' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950/95 p-6 text-center">
                    <p role="alert">This video could not load. Check your connection and try again.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPlaybackState('loading');
                        mediaRef.current?.load();
                      }}
                      className="min-h-11 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Retry video
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p role="alert" className="p-6 text-center">This video is temporarily unavailable.</p>
            )}
          </div>

          <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <p className="max-w-2xl text-sm leading-relaxed text-slate-300">{video.description}</p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={enterFullscreen}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 text-xs font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
                Full screen
              </button>
              {video.burnedInCaptions && (
                <span className="inline-flex min-h-10 items-center text-xs text-slate-300">Captions in video · Cillian narration</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
