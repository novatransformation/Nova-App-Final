// import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/lib/constants";
import { useLocation } from "wouter";
import { Sparkles, History as HistoryIcon, Settings, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import NovaBranding from "@/components/NovaBranding";

export default function Home() {
  // const { isAuthenticated, user } = useAuth();
  const isAuthenticated = true; // Auth disabled
  const user = null;
  const [, setLocation] = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  // Check if user has completed Teil 1
  const { data: sessions } = trpc.transformations.list.useQuery(undefined, {
    enabled: true, // Always enabled
  });

  // Check if user has completed Teil 1 (step 8)
  // Check if ANY session is completed (not just the latest)
  const hasPart1Completed = sessions?.some(s => s.status === "completed") || false;
  // Get the first completed session for Teil 2
  const completedSession = sessions?.find(s => s.status === "completed");
  const latestSession = sessions?.[0];

  useEffect(() => {
    // Trigger animations after component mount
    setLoaded(true);

    // Check if we should show unlock animation
    const shouldShowUnlock = sessionStorage.getItem("showPart2Unlock");
    if (shouldShowUnlock === "true") {
      setTimeout(() => {
        setShowUnlockAnimation(true);
        sessionStorage.removeItem("showPart2Unlock");
      }, 500);
    }
  }, []);

  if (false) { // Auth check disabled
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#183847] to-[#2C5F6F] flex items-center justify-center p-6">
        <div className="text-center space-y-12 max-w-3xl">
          {/* Main Heading */}
          <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight " style={{color: "#E8DCC8"}}>
            Bereit für deine
          </h1>
          <h2 className="text-4xl md:text-5xl font-semibold gradient-text leading-tight">
            Transformation?
          </h2>
          <p className="text-base md:text-lg  mt-8 max-w-2xl mx-auto font-extralight" style={{color: "#E8DCC8"}}>
            Ändere deine innere Frequenz, ändere deine Welt
          </p>
            
            {/* Core Message */}
            <div className="mt-12 p-6 rounded-2xl bg-white/10 border border-white/20 max-w-xl mx-auto">
              <p className="text-sm  leading-relaxed font-light" style={{color: "#E8DCC8"}}>
                <span className="text-primary font-semibold">Ursache:</span> Deine herrschende Frequenz.<br/>
                <span className="text-xs">(Jeder Gedanke, jedes Gefühl, jede Intention.)</span>
              </p>
              <div className="my-3 text-primary text-2xl">↓</div>
              <p className="text-sm  leading-relaxed font-light" style={{color: "#E8DCC8"}}>
                <span className="text-primary font-semibold">Wirkung:</span> Deine physische Realität.<br/>
                <span className="text-xs">(Deine Umstände, Erfahrungen und Ergebnisse.)</span>
              </p>
            </div>
            
            {/* Inspirational Quote */}
            <div className="mt-8">
              <p className="text-base italic font-light  max-w-2xl mx-auto" style={{color: "#E8DCC8"}}>
                „Alles, was wir sind, ist das Ergebnis dessen, was wir gedacht haben."
              </p>
              <p className="text-sm font-light  mt-2" style={{color: "#A6805B"}}>
                – Buddha
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button
              className="w-full max-w-sm text-base py-3 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-lg"
              onClick={() => window.location.href = getLoginUrl()}
            >
              Jetzt starten
            </Button>
            <p className="text-sm  font-extralight" style={{color: "#E8DCC8"}}>Kostenlos und unverbindlich.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* TEIL 1: Alte Frequenz erkennen (Obere Hälfte) */}
      <div className="flex-1 relative flex flex-col bg-gradient-to-b from-[#183847] to-[#2C5F6F]">
        {/* Animated Background Particles */}
        <div className="particles-container">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${15 + Math.random() * 15}s`,
              }}
            />
          ))}
        </div>

        {/* Text ganz oben */}
        <div className="relative z-10 text-center pt-8 px-8">
          <div className="space-y-4">
            <h2 className={`text-3xl md:text-4xl font-bold text-[#A6805B] transition-all duration-1000 delay-200 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
              Teil 1: Erkenne deine alte Frequenz
            </h2>
            <p className={`text-lg text-[#E8DCC8] font-light transition-all duration-1000 delay-500 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
              Werde dir bewusst, was dich bisher geformt hat.
            </p>
          </div>
        </div>

        {/* Lotus in der Mitte */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className={`transition-all duration-1000 delay-800 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}>
            <svg width="80" height="80" viewBox="0 0 100 100" className="lotus-closed">
              <path
                d="M50 20 L40 50 L30 80 L50 70 L70 80 L60 50 L50 20 Z"
                fill="none"
                stroke="#244451"
                strokeWidth="2"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>

        {/* Button unten */}
        <div className="relative z-10 text-center pb-8 px-4">
          <Button
            onClick={() => setLocation('/new')}
            className={`bg-transparent border-2 border-[#C9A961] text-[#A6805B] hover:bg-[#C9A961]/10 px-6 py-4 text-base sm:text-lg font-medium relative overflow-hidden group transition-all duration-1000 delay-1100 w-full max-w-md mx-auto ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="shine-effect"></div>
            <Sparkles className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="break-words">Transformation starten</span>
          </Button>
        </div>
      </div>

      {/* Trennlinie */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#A6805B] to-transparent"></div>

      {/* TEIL 2: Neue Frequenz erschaffen (Untere Hälfte) */}
      <div className={`flex-1 relative flex flex-col transition-all duration-1000 ${
        hasPart1Completed 
          ? 'bg-gradient-to-b from-[#FAF7F0] to-[#F5E6D3]' 
          : 'bg-gradient-to-b from-[#3A3A3A] to-[#2A2A2A]'
      } ${showUnlockAnimation ? 'unlock-animation' : ''}`}>
        
        {/* Schleier für gesperrten Zustand */}
        {!hasPart1Completed && (
          <div className="absolute inset-0 bg-black/40 z-0"></div>
        )}

        {/* Text ganz oben */}
        <div className="relative z-10 text-center pt-8 px-8">
          <div className="space-y-4">
            <h2 className={`text-3xl md:text-4xl font-bold transition-all duration-1000 delay-200 ${
              hasPart1Completed ? 'text-[#C9A961]' : 'text-gray-500'
            } ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={{ textShadow: hasPart1Completed ? '0 2px 4px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
              Teil 2: Erschaffe deine neue Frequenz
            </h2>
            <p className={`text-lg font-light transition-all duration-1000 delay-500 ${
              hasPart1Completed ? 'text-gray-700' : 'text-gray-400'
            } ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={{ textShadow: hasPart1Completed ? '0 1px 2px rgba(0, 0, 0, 0.1)' : '0 2px 6px rgba(0, 0, 0, 0.8)' }}>
              Kreiere die Realität, die du leben möchtest.
            </p>
          </div>
        </div>

        {/* Spacer for centered layout */}
        <div className="flex-1"></div>

        {/* Button unten */}
        <div className="relative z-10 text-center pb-8 px-4">
          {hasPart1Completed && completedSession ? (
            <Button
              onClick={() => setLocation(`/process/${completedSession.id}?part=2`)}
              className={`bg-transparent border-2 border-[#C9A961] text-[#C9A961] hover:bg-[#C9A961]/10 px-6 py-4 text-base sm:text-lg font-medium relative overflow-hidden group transition-all duration-1000 delay-1100 w-full max-w-md mx-auto ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="shine-effect"></div>
              <Sparkles className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="break-words">Neue Frequenz erschaffen</span>
            </Button>
          ) : (
            <div className={`px-8 py-4 text-gray-500 font-medium transition-all duration-1000 delay-1100 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              [ Gesperrt ]
            </div>
          )}
        </div>
      </div>



      <style>{`
        /* Floating particles */
        .particles-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .particle {
          position: absolute;
          bottom: -10px;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, #A6805B 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          animation: particle-rise infinite ease-in;
          box-shadow: 0 0 6px #A6805B;
        }
        
        @keyframes particle-rise {
          0% {
            opacity: 0;
            transform: translateY(0) translateX(0);
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: translateY(-50vh) translateX(calc((var(--random, 0.5) - 0.5) * 100px));
          }
        }
        
        /* Lotus animations */
        .lotus-closed {
          animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        .lotus-active {
          animation: bloom-glow 2s ease-in-out infinite;
        }
        
        @keyframes bloom-glow {
          0%, 100% {
            filter: drop-shadow(0 0 8px #A6805B);
          }
          50% {
            filter: drop-shadow(0 0 16px #F4D03F);
          }
        }
        
        .lotus-locked {
          filter: grayscale(1);
        }
        
        /* Unlock animation */
        .unlock-animation {
          animation: unlock-flash 2s ease-out;
        }
        
        @keyframes unlock-flash {
          0% {
            background: #2A2A2A;
          }
          50% {
            background: linear-gradient(135deg, #FFD700 0%, #F4D03F 100%);
          }
          100% {
            background: linear-gradient(to bottom, #FAF7F0, #F5E6D3);
          }
        }
        
        /* Shine effect on button */
        .shine-effect {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          animation: shine 3s ease-in-out infinite;
        }
        
        @keyframes shine {
          0% {
            left: -100%;
          }
          20%, 100% {
            left: 100%;
          }
        }
        
        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #A6805B 0%, #F4D03F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}

