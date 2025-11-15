import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface MusicPause2Props {
  onContinue: () => void;
}

export default function MusicPause2({ onContinue }: MusicPause2Props) {
  const [currentText, setCurrentText] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);

  const texts = [
    "Du hast losgelassen...",
    "Du hast angenommen, was ist...",
    "Jetzt erschaffst du...",
    "Fühle die Kraft in dir...",
    "Du bist bereit..."
  ];

  useEffect(() => {
    // Text rotation every 20 seconds
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 20000);

    // Auto-advance after 2 minutes
    const autoTimer = setTimeout(() => {
      setAutoAdvance(true);
      setTimeout(() => {
        onContinue();
      }, 3000); // 3 seconds to show the button before auto-advancing
    }, 120000); // 2 minutes

    return () => {
      clearInterval(textInterval);
      clearTimeout(autoTimer);
    };
  }, [onContinue]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, #183847 0%, #1a4d5f 50%, #244451 100%)'
         }}>
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'url(/lotus-opening.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)'
        }}
      />

      {/* Breathing Animation Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
          animation: 'breathe 6s ease-in-out infinite'
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Main Text */}
        <h1 
          className="text-4xl md:text-5xl font-bold mb-8 transition-all duration-1000"
          style={{
            color: '#A6805B',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            opacity: 1
          }}
        >
          {texts[currentText]}
        </h1>

        {/* Continue Button (appears after auto-advance triggers) */}
        {autoAdvance && (
          <Button
            onClick={onContinue}
            size="lg"
            className="mt-8 px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: '#A6805B',
              color: '#183847'
            }}
          >
            Jetzt erschaffen
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>

      {/* Audio Player */}
      <audio autoPlay loop>
        <source src="https://www.bensound.com/bensound-music/bensound-epic.mp3" type="audio/mpeg" />
      </audio>

      <style>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.25;
          }
        }
      `}</style>
    </div>
  );
}

