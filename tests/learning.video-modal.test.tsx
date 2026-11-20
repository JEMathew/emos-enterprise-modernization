// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LearningCenterPage } from '../src/components/LearningCenterPage';
import { LearningVideoModal } from '../src/components/LearningVideoModal';
import {
  LEARNING_MASTERS,
  LEARNING_VIDEOS,
  type LearningVideo,
} from '../src/data/learningVideos';
import { ThemeProvider } from '../src/lib/theme';

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function renderLearningCenter(videos?: readonly LearningVideo[]) {
  return render(
    <ThemeProvider>
      <LearningCenterPage onNavigate={vi.fn()} videos={videos} />
    </ThemeProvider>,
  );
}

describe('EMOS Learning Center embedded video playback', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('maps every lesson and master to a V2 asset with on-video captions', () => {
    expect(LEARNING_VIDEOS).toHaveLength(20);
    expect(Object.keys(LEARNING_MASTERS)).toHaveLength(18);
    for (const video of [...LEARNING_VIDEOS, ...Object.values(LEARNING_MASTERS)]) {
      expect(video.mediaUrl).toMatch(/^\/media\/learning\/emos-v2-[a-z-]+\.mp4$/);
      expect(video.version).toBe('V2');
      expect(video.burnedInCaptions).toBe(true);
      expect(video.durationSeconds).toBeGreaterThan(0);
      expect(video.durationSeconds).toBeLessThanOrEqual(90);
      expect(LEARNING_MASTERS[video.masterId].mediaUrl).toBe(video.mediaUrl);
    }
  });

  it('loads the selected native video only after the user chooses Play', () => {
    renderLearningCenter();
    expect(screen.queryByLabelText(/video player/i)).not.toBeInTheDocument();
    const video = LEARNING_VIDEOS[3];
    fireEvent.click(screen.getByRole('button', { name: `Play ${video.sequence}: ${video.title} in EMOS` }));
    expect(screen.getByRole('dialog', { name: video.title })).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByLabelText(`${video.sequence}: ${video.title} video player`)).toHaveAttribute('src', video.mediaUrl);
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('closes with Escape and restores focus to the originating Play button', () => {
    renderLearningCenter();

    const video = LEARNING_VIDEOS[0];
    const playButton = screen.getByRole('button', {
      name: `Play ${video.sequence}: ${video.title} in EMOS`,
    });
    playButton.focus();
    fireEvent.click(playButton);

    expect(screen.getByRole('button', { name: `Close video: ${video.title}` })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(playButton).toHaveFocus();
  });

  it('keeps keyboard focus inside the modal', () => {
    renderLearningCenter();

    const video = LEARNING_VIDEOS[1];
    fireEvent.click(
      screen.getByRole('button', { name: `Play ${video.sequence}: ${video.title} in EMOS` }),
    );

    const closeButton = screen.getByRole('button', { name: `Close video: ${video.title}` });
    const finalButton = screen.getByRole('button', { name: 'Full screen' });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(finalButton).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(closeButton).toHaveFocus();
  });

  it('offers an explicit full-screen action for the embedded player', () => {
    const requestFullscreen = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreen,
    });
    renderLearningCenter();

    const video = LEARNING_VIDEOS[2];
    fireEvent.click(
      screen.getByRole('button', { name: `Play ${video.sequence}: ${video.title} in EMOS` }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Full screen' }));

    expect(requestFullscreen).toHaveBeenCalledTimes(1);
  });

  it('marks a video without a verified media URL as unavailable and creates no iframe', () => {
    const unavailableVideo: LearningVideo = {
      ...LEARNING_VIDEOS[0],
      mediaUrl: undefined,
    };
    renderLearningCenter([unavailableVideo]);

    expect(
      screen.getByRole('button', {
        name: `Video temporarily unavailable for ${unavailableVideo.sequence}: ${unavailableVideo.title}`,
      }),
    ).toBeDisabled();
    expect(screen.queryByRole('button', { name: /Play .* in EMOS/i })).not.toBeInTheDocument();
    expect(screen.queryByTitle(/video player/i)).not.toBeInTheDocument();
  });

  it('plays direct media inside EMOS with accessible controls, loading, and error recovery', () => {
    const load = vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
    const video: LearningVideo = {
      ...LEARNING_VIDEOS[0],
      mediaUrl: '/media/learning/emos-v2-orientation.mp4',
      version: 'V2',
      burnedInCaptions: true,
    };
    renderLearningCenter([video]);
    fireEvent.click(screen.getByRole('button', { name: 'Start Guided Journey' }));
    const player = screen.getByLabelText(`${video.sequence}: ${video.title} video player`);
    expect(player.tagName).toBe('VIDEO');
    expect(player).toHaveAttribute('controls');
    expect(player).toHaveAttribute('playsinline');
    expect(player).toHaveAttribute('src', video.mediaUrl);
    expect(screen.queryByRole('link', { name: /Open in Google Drive/i })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Loading video');
    fireEvent.loadedData(player);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    fireEvent.waiting(player);
    expect(screen.getByRole('status')).toHaveTextContent('Loading video');
    fireEvent.error(player);
    expect(screen.getByRole('alert')).toHaveTextContent('could not load');
    fireEvent.click(screen.getByRole('button', { name: 'Retry video' }));
    expect(load).toHaveBeenCalledOnce();
    fireEvent.canPlay(player);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('unmounts direct media and restores trigger focus when closed', () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    const onClose = vi.fn();
    const { unmount } = render(<LearningVideoModal
      video={{ ...LEARNING_VIDEOS[0], mediaUrl: '/media/learning/emos-v2-orientation.mp4', version: 'V2' }}
      onClose={onClose}
      returnFocusTo={trigger}
    />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
    unmount();
    expect(document.querySelector('video')).toBeNull();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).not.toBe('hidden');
    trigger.remove();
  });
});
