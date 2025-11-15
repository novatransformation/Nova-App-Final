import { useEffect, useState } from 'react';
import { Button } from './ui/button';


interface MusicPause3Props {
  onContinue: () => void;
}

export default function MusicPause3({ onContinue }: MusicPause3Props) {
  const [currentText, setCurrentText] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const texts = [
    "DU HAST ES ERSCHAFFEN!",
    "DU BIST DAS NEUE SELBST!",
    "JETZT LEBST DU ES!",
    "FÜHLE DEINE KRAFT!",
    "DU BIST UNBESIEGBAR!"
  ];

  useEffect(() => {
    // Text rotation every 30 seconds
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 30000);

    // Auto-advance after 3 minutes
    const autoTimer = setTimeout(() => {
      setAutoAdvance(true);
      setTimeout(() => {
        onContinue();
      }, 5000); // 5 seconds to show the button before auto-advancing
    }, 180000); // 3 minutes

    return () => {
      clearInterval(textInterval);
      clearTimeout(autoTimer);
    };
  }, [onContinue]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #0a1f2a 0%, #183847 50%, #244451 100%)'
         }}>
      
      {/* Background Image - User's Lotus */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'url(/lotus-pause.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8) saturate(1.2)'
        }}
      />

      {/* Radiant Energy Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.3) 0%, transparent 60%)',
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />

      {/* Sparkle Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: '#A6805B',
              opacity: 0.6,
              animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Main Text - BOLD & POWERFUL */}
        <h1 
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-8 transition-all duration-1000 tracking-tight leading-tight"
          style={{
            color: '#A6805B',
            textShadow: '0 4px 16px rgba(212, 175, 55, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8)',
            opacity: 1,
            transform: 'scale(1.05)'
          }}
        >
          {texts[currentText]}
        </h1>

        {/* Continue Button (always visible) */}
        <Button
          onClick={onContinue}
          size="lg"
          className="mt-12 px-12 py-8 text-xl font-bold transition-all duration-300 hover:scale-110 shadow-2xl"
          style={{
            backgroundColor: '#A6805B',
            color: '#0a1f2a',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.4)'
          }}
        >
          {autoAdvance ? 'Ich bin bereit!' : 'Überspringen →'}
        </Button>
      </div>

      {/* Audio Player - Local music */}
      <audio autoPlay loop>
        <source src="/welcome-audio.mp4" type="audio/mp4" />
      </audio>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}

