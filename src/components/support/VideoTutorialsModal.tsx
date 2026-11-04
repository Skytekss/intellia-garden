import React, { useState, useEffect } from 'react';
import {
  X,
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Maximize2,
  Clock,
  ListVideo,
} from 'lucide-react';
import { VideoTutorial } from './types';
import { useApp } from '../../context/AppContext';
import { getLocalizedVideos } from '../../context/localizedData';

export interface VideoTutorialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialVideoId?: string;
}

export const VideoTutorialsModal: React.FC<VideoTutorialsModalProps> = ({
  isOpen,
  onClose,
  initialVideoId,
}) => {
  const { isEnglish } = useApp();
  const videos = getLocalizedVideos(isEnglish);

  const [activeVideoId, setActiveVideoId] = useState<string>(
    initialVideoId || (videos.length > 0 ? videos[0].id : 'video-quickstart')
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(25); // initial simulated 25%

  useEffect(() => {
    if (isOpen) {
      if (initialVideoId) {
        setActiveVideoId(initialVideoId);
      }
      setIsPlaying(false);
      setPlaybackProgress(15);
    }
  }, [isOpen, initialVideoId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Simulated progress timer when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlaybackProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  const currentVideo = videos.find((v) => v.id === activeVideoId) || videos[0];

  const handleSelectVideo = (video: VideoTutorial) => {
    setActiveVideoId(video.id);
    setIsPlaying(true);
    setPlaybackProgress(0);
  };

  const handleJumpToChapter = (seconds: number) => {
    // estimate progress percent
    const progress = Math.min(100, Math.max(0, Math.round((seconds / 300) * 100)));
    setPlaybackProgress(progress);
    setIsPlaying(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="videos-modal-title"
      data-testid="video-tutorials-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        data-testid="videos-modal-backdrop"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full p-4 sm:p-6 md:p-7 space-y-5 my-auto z-10 animate-in zoom-in-95 fade-in duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <Video className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2
                id="videos-modal-title"
                data-testid="videos-modal-title"
                className="text-base sm:text-lg font-bold text-slate-900 tracking-tight"
              >
                {isEnglish ? 'Video Tutorials & Walkthroughs' : 'Видеоуроки и обзоры системы'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEnglish
                  ? 'Visual walkthroughs of platform navigation, drone flight workflows, and predictive analytics'
                  : 'Наглядные скринкасты по работе с дашбордом, картой сада и симулятором сбора урожая'}
              </p>
            </div>
          </div>

          <button
            type="button"
            data-testid="videos-modal-close"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={isEnglish ? 'Close modal' : 'Закрыть окно'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content: Player + Playlist */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Simulated Video Player Stage */}
          <div
            data-testid="video-player-container"
            className="relative rounded-2xl bg-[#03261d] overflow-hidden aspect-video border border-emerald-950/60 shadow-lg flex flex-col justify-between p-4 sm:p-6 text-white group"
          >
            {/* Background Texture & Watermark */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 pointer-events-none" />
            <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xs text-xs font-semibold text-emerald-300 border border-emerald-800/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full HD 1080p</span>
            </div>

            {/* Video Title in Player */}
            <div className="relative z-10 max-w-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                {currentVideo.categoryLabel}
              </span>
              <h3
                data-testid="video-player-title"
                className="text-base sm:text-xl font-bold text-white drop-shadow-sm line-clamp-2"
              >
                {currentVideo.title}
              </h3>
            </div>

            {/* Center Play Button Overlay */}
            <div className="relative z-10 flex items-center justify-center my-auto">
              <button
                type="button"
                data-testid="video-player-toggle"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#07503b] hover:bg-[#096047] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-emerald-400/40"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-white" />
                ) : (
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                )}
              </button>
            </div>

            {/* Player Bottom Control Bar */}
            <div className="relative z-10 space-y-2 pt-2">
              {/* Progress Bar */}
              <div
                data-testid="video-progress-track"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                  setPlaybackProgress(Math.round(ratio));
                }}
                className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden hover:h-2 transition-all relative"
              >
                <div
                  data-testid="video-progress-bar"
                  style={{ width: `${playbackProgress}%` }}
                  className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                />
              </div>

              {/* Controls Footer */}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-white cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlaybackProgress(0)}
                    className="hover:text-white cursor-pointer"
                    title={isEnglish ? 'Replay' : 'В начало'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs text-slate-300">
                    {Math.floor((playbackProgress / 100) * 4)}:{String(Math.floor(((playbackProgress / 100) * 240) % 60)).padStart(2, '0')} / {currentVideo.duration}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-slate-300" />
                  <Maximize2 className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Quick Timeline Navigation */}
          {currentVideo.chapters.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isEnglish ? 'Video Chapters' : 'Ключевые эпизоды'}</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {currentVideo.chapters.map((chapter) => (
                  <button
                    key={chapter.timecode}
                    type="button"
                    data-testid={`chapter-${chapter.timecode}`}
                    onClick={() => handleJumpToChapter(chapter.seconds)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-900 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span className="font-mono font-bold text-emerald-800">{chapter.timecode}</span>
                    <span>{chapter.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Playlist / Available Videos */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ListVideo className="w-4 h-4 text-emerald-700" />
              <span>{isEnglish ? 'All Video Tutorials' : 'Все видеоуроки курса'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videos.map((vid) => {
                const isSelected = vid.id === currentVideo.id;

                return (
                  <div
                    key={vid.id}
                    data-testid={`video-item-${vid.id}`}
                    onClick={() => handleSelectVideo(vid)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 group ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="relative w-24 h-18 rounded-xl bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                      <div className="absolute inset-0 bg-[#05382b]/70" />
                      <Play className="w-5 h-5 text-white fill-white relative z-10 group-hover:scale-110 transition-transform" />
                      <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-white font-mono text-[10px] leading-none z-10">
                        {vid.duration}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-xs font-semibold text-emerald-800 block">
                        {vid.categoryLabel}
                      </span>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-2 leading-snug">
                        {vid.title}
                      </h5>
                      <p className="text-xs text-slate-500 line-clamp-1">{vid.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-100 shrink-0">
          <button
            type="button"
            data-testid="videos-modal-done"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#07503b] hover:bg-[#096047] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {isEnglish ? 'Close' : 'Закрыть'}
          </button>
        </div>
      </div>
    </div>
  );
};
