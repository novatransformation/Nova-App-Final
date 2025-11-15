import { useEffect, useState } from 'react';

interface MusicPauseProps {
  onComplete: () => void;
  duration?: number; // in seconds, default 180 (3 minutes)
}

export default function MusicPause({ onComplete, duration = 180 }: MusicPauseProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / duration);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fullscreen Lotus Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/lotus-pause.png)',
          animation: 'breathe 6s ease-in-out infinite'
        }}
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center">
        {/* Calming texts */}
        <div className="text-center space-y-8 px-4">
          <p 
            className="text-[#F5F1E8] text-2xl md:text-3xl font-light italic opacity-0"
            style={{
              animation: 'fadeInOut 6s ease-in-out infinite',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Atme...
          </p>
          <p 
            className="text-[#F5F1E8] text-2xl md:text-3xl font-light italic opacity-0"
            style={{
              animation: 'fadeInOut 6s ease-in-out infinite 2s',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Lass los...
          </p>
          <p 
            className="text-[#F5F1E8] text-2xl md:text-3xl font-light italic opacity-0"
            style={{
              animation: 'fadeInOut 6s ease-in-out infinite 4s',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Du bist sicher...
          </p>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute top-8 right-8 px-6 py-3 bg-[#A6805B]/20 hover:bg-[#A6805B]/40 border border-[#A6805B]/50 rounded-full text-[#F5F1E8] text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
      >
        Überspringen →
      </button>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#A6805B] transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>

      {/* Background music */}
      <audio 
        autoPlay 
        loop
        className="hidden"
      >
        <source src="/music/calm-meditation.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

