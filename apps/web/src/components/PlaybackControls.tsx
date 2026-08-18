import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Repeat,
  Gauge,
} from 'lucide-react';
import { Button } from '@hello-algo/ui';
import type { PlayerStatus } from '@hello-algo/algorithm-engine';

export interface PlaybackControlsProps {
  status: PlayerStatus;
  currentIndex: number;
  totalMarkers: number;
  speed: number;
  isLooping: boolean;
  onPlay: () => void;
  onPause: () => void;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSeek: (index: number) => void;
  onSetSpeed: (speed: number) => void;
  onToggleLoop: () => void;
  onReset: () => void;
  className?: string;
}

const SPEEDS = [0.5, 1, 1.5, 2, 4];

export function PlaybackControls({
  status,
  currentIndex,
  totalMarkers,
  speed,
  isLooping,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onSeek,
  onSetSpeed,
  onToggleLoop,
  onReset,
  className = '',
}: PlaybackControlsProps) {
  const isPlaying = status === 'playing';
  const progressPercent =
    totalMarkers > 1 ? Math.round((currentIndex / (totalMarkers - 1)) * 100) : 0;

  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm ${className}`}
    >
      {/* Timeline Scrubber */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying
                  ? 'bg-emerald-500 animate-ping'
                  : status === 'ended'
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
            />
            {isPlaying
              ? '播放中'
              : status === 'ended'
              ? '已完成'
              : status === 'paused'
              ? '已暂停'
              : '就绪'}
          </span>
          <span>
            步数: {currentIndex + 1} / {Math.max(1, totalMarkers)} ({progressPercent}%)
          </span>
        </div>

        <input
          type="range"
          aria-label="算法执行时间轴进度"
          aria-valuemin={0}
          aria-valuemax={Math.max(0, totalMarkers - 1)}
          aria-valuenow={currentIndex}
          aria-valuetext={`第 ${currentIndex + 1} 步，共 ${totalMarkers} 步`}
          min={0}
          max={Math.max(0, totalMarkers - 1)}
          value={currentIndex}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary transition-all"
        />
      </div>

      {/* Control Buttons & Settings Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Main Playback Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            title="重置到第一步 (R)"
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onStepBackward}
            disabled={currentIndex <= 0}
            title="单步后退 (Left Arrow)"
            className="h-8 w-8 p-0"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant={isPlaying ? 'secondary' : 'default'}
            size="sm"
            onClick={onTogglePlay}
            title={isPlaying ? '暂停 (Space)' : '播放 (Space)'}
            className="h-8 px-3 font-semibold gap-1.5 min-w-[76px]"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>暂停</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>播放</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onStepForward}
            disabled={currentIndex >= totalMarkers - 1}
            title="单步前进 (Right Arrow)"
            className="h-8 w-8 p-0"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Speed Selector & Loop Toggle */}
        <div className="flex items-center gap-2 text-xs">
          {/* Speed Buttons */}
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/50">
            <Gauge className="w-3 h-3 text-muted-foreground ml-1.5 mr-1" />
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  speed === s
                    ? 'bg-background text-foreground font-bold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Loop Toggle */}
          <Button
            variant={isLooping ? 'secondary' : 'ghost'}
            size="sm"
            onClick={onToggleLoop}
            title="循环播放"
            className={`h-8 px-2 text-xs gap-1 ${
              isLooping ? 'text-primary font-semibold' : 'text-muted-foreground'
            }`}
          >
            <Repeat className="w-3 h-3" />
            <span className="hidden sm:inline">循环</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
