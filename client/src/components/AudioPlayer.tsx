import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download, Loader2 } from 'lucide-react';
import { getRandomQuote } from '@/lib/motivationalQuotes';

interface AudioPlayerProps {
  audioUrl?: string;
  isLoading?: boolean;
  onGenerate?: () => void;
  className?: string;
}

export function AudioPlayer({ audioUrl, isLoading, onGenerate, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `transformation-audio-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 p-6 bg-white/10 border border-white/20 rounded-lg ${className}`}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-[#A6805B]" />
          <span className="text-sm text-gray-200">Audio wird generiert...</span>
        </div>
        <p className="text-sm italic text-gray-300/80 animate-pulse text-center">
          {getRandomQuote('audio')}
        </p>
      </div>
    );
  }

  if (!audioUrl && onGenerate) {
    return (
      <Button
        onClick={onGenerate}
        className={`w-full bg-transparent border-2 border-[#A6805B] text-[#A6805B] hover:bg-[#A6805B]/10 px-6 py-4 text-base sm:text-lg font-medium ${className}`}
      >
        🎧 Audio generieren
      </Button>
    );
  }

  if (!audioUrl) {
    return null;
  }

  return (
    <div className={`space-y-3 p-4 bg-white/10 border border-white/20 rounded-lg ${className}`}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Controls */}
      <div className="flex items-center gap-3">
        <Button
          onClick={togglePlay}
          size="sm"
          className="bg-[#A6805B] hover:bg-[#C9A961] text-white"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#A6805B] transition-all duration-100"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-300">{formatTime(currentTime)}</span>
            <span className="text-xs text-gray-300">{formatTime(duration)}</span>
          </div>
        </div>

        <Button
          onClick={downloadAudio}
          size="sm"
          variant="outline"
          className="border-[#A6805B] text-[#A6805B] hover:bg-[#A6805B]/10"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

