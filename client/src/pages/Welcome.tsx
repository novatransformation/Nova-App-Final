import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import NovaBranding from "../components/NovaBranding";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const [fadeOut, setFadeOut] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Navigate to intro after 8 seconds
    const navigationTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLocation("/intro");
      }, 1000); // Wait for fade out
    }, 8000);
    
    // Cleanup
    return () => {
      clearTimeout(navigationTimer);
    };
  }, [setLocation]);

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Fullscreen Lotus Background with Breathing Animation */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
        style={{
          backgroundImage: imageLoaded ? 'url(/lotus-pause.png)' : 'none',
          backgroundColor: '#183847',
          animation: imageLoaded ? 'breathe 6s ease-in-out infinite' : 'none',
          opacity: imageLoaded ? 1 : 0
        }}
      />
      
      {/* Preload image */}
      <img 
        src="/lotus-pause.png" 
        alt="" 
        className="hidden"
        onLoad={() => setImageLoaded(true)}
        loading="eager"
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Skip Button */}
      <button
        onClick={() => {
          setFadeOut(true);
          setTimeout(() => setLocation("/intro"), 500);
        }}
        className="absolute bottom-8 right-8 z-10 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm font-light transition-all hover:scale-105"
        aria-label="Animation überspringen"
      >
        Überspringen →
      </button>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center">
        {/* Nova Branding at top */}
        <div 
          className="absolute top-12 left-0 right-0 flex justify-center px-4"
          style={{
            animation: 'fadeIn 2s ease-in-out 0.5s forwards',
            opacity: 0
          }}
        >
          <div className="text-center">
            <NovaBranding variant="welcome" showClaim={true} />
          </div>
        </div>
      </div>

      {/* Background music - HTML audio element like MusicPause */}
      <audio 
        autoPlay 
        loop
        className="hidden"
      >
        <source src="/welcome-audio.mp4" type="audio/mp4" />
      </audio>

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

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

