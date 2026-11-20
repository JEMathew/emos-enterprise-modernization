import React, { useEffect, useId, useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import type { LearningVideo } from '../data/learningVideos';

interface LearningVideoModalProps {
  video: LearningVideo;
  onClose: () => void;
  returnFocusTo: HTMLElement | null;
  autoPlay?: boolean;
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
  autoPlay = false,
}) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [playbackState, setPlaybackState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    setPlaybackState((mediaRef.current?.readyState ?? 0) >= 2 ? 'ready' : 'loading');
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

  const enterFullscreen = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    const container = playerContainerRef.current;
    if (container?.requestFullscreen) {
      try {
        await container.requestFullscreen();
        return;
      } catch { /* Embedded browsers may reject native fullscreen. */ }
    }
    const safariPlayer = mediaRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (safariPlayer?.webkitEnterFullscreen) {
      try {
        safariPlayer.webkitEnterFullscreen();
        return;
      } catch { /* Keep an accessible viewport-sized fallback. */ }
    }
    setExpanded(true);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm ${expanded ? 'p-0' : 'p-2 sm:p-5'}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex w-full flex-col overflow-hidden border border-white/15 bg-[#08111f] text-white shadow-2xl ${expanded ? 'h-dvh max-w-none' : 'max-h-[95vh] max-w-7xl rounded-2xl'}`}
      >
        <div className="flex shrink-0 items-center gap-3 px-4 py-3 sm:px-5">
          <h2 id={titleId} className="min-w-0 flex-1 text-sm font-semibold leading-snug sm:text-base">{video.title}</h2>
          <button type="button" aria-label={expanded ? 'Exit full screen' : 'Full screen'} onClick={() => { void enterFullscreen(); }} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3 text-xs text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white">
            <Maximize2 className="h-4 w-4" aria-hidden="true" /><span className="hidden sm:inline" aria-hidden="true">{expanded ? 'Exit full screen' : 'Full screen'}</span>
          </button>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label={`Close video: ${video.title}`} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>

        <div className={`min-h-0 ${expanded ? 'flex-1' : 'overflow-y-auto'}`}>
          <div ref={playerContainerRef} className={`relative mx-auto w-full bg-black [&:fullscreen]:h-screen [&:fullscreen]:max-h-none [&:fullscreen]:w-screen ${expanded ? 'h-full' : 'aspect-video max-h-[calc(95dvh-68px)]'}`}>
            {video.mediaUrl ? (
              <>
                <video
                  ref={mediaRef}
                  src={video.mediaUrl}
                  poster={video.thumbnailUrl}
                  aria-label={`${video.title} video player`}
                  controls
                  autoPlay={autoPlay}
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
                  onTimeUpdate={(event) => { if (event.currentTarget.readyState >= 2) setPlaybackState('ready'); }}
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
        </div>
      </div>
    </div>
  );
};
