import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Onboarding from "../components/Onboarding";

export default function Intro() {
  const [, setLocation] = useLocation();
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('onboarding_seen');
  });

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress (0 to 1)
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? Math.min(window.scrollY / scrollHeight, 1) : 0;
      setScrollProgress(progress);

      // Check which paragraphs are in viewport
      paragraphRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
          
          if (isVisible && !visibleParagraphs.includes(index)) {
            setVisibleParagraphs(prev => [...prev, index]);
          }
        }
      });
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleParagraphs]);

  return (
    <>
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
      
      <div className="min-h-screen bg-gradient-to-b from-[#183847] to-[#2C5F6F] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Frequency Visualization Background */}
      <svg 
        className="frequency-waves"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      >
        {/* Old Frequency - Chaotic Wave (fades out) */}
        <path
          className="old-frequency-wave"
          d="M0,300 Q50,250 100,300 T200,300 T300,300 T400,300 T500,300 T600,300 T700,300 T800,300 T900,300 T1000,300"
          fill="none"
          stroke="#8B7355"
          strokeWidth="3"
          style={{
            opacity: Math.max(0, 0.8 - scrollProgress * 1.5),
          }}
        />
        <path
          className="old-frequency-wave-2"
          d="M0,350 Q30,380 60,350 T120,350 T180,350 T240,350 T300,350 T360,350 T420,350 T480,350 T540,350 T600,350"
          fill="none"
          stroke="#6B5D4F"
          strokeWidth="2"
          style={{
            opacity: Math.max(0, 0.6 - scrollProgress * 1.5),
          }}
        />

        {/* New Frequency - Harmonic Wave (fades in) */}
        <path
          className="new-frequency-wave"
          d="M0,400 Q100,350 200,400 T400,400 T600,400 T800,400 T1000,400"
          fill="none"
          stroke="#A6805B"
          strokeWidth="3"
          style={{
            opacity: Math.min(1, scrollProgress * 2),
            filter: `drop-shadow(0 0 ${8 + scrollProgress * 12}px #A6805B)`,
          }}
        />
        <path
          className="new-frequency-wave-2"
          d="M0,450 Q100,420 200,450 T400,450 T600,450 T800,450 T1000,450"
          fill="none"
          stroke="#F4D03F"
          strokeWidth="2"
          style={{
            opacity: Math.min(0.8, scrollProgress * 1.8),
            filter: `drop-shadow(0 0 ${6 + scrollProgress * 8}px #F4D03F)`,
          }}
        />
      </svg>

      <div className="max-w-3xl w-full space-y-6 py-8 px-4 md:px-6 relative z-10">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold" style={{color: '#A6805B', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'}}>
            Wie Veränderung wirklich funktioniert
          </h1>
        </div>

        {/* Content with Scroll-to-Reveal */}
        <div className="space-y-4 text-base md:text-lg font-light" style={{color: '#E8DCC8', lineHeight: '1.6', wordWrap: 'break-word', overflowWrap: 'break-word'}}>
          <p
            ref={el => { paragraphRefs.current[0] = el; }}
            style={{color: '#E8DCC8'}}
            className={`transition-all duration-700 ${
              visibleParagraphs.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Vielleicht hast du schon gehört, dass deine Gedanken deine Realität erschaffen. <span className=" font-medium" style={{color: "#A6805B"}}>Das ist die halbe Wahrheit.</span>
          </p>
          
          <p
            ref={el => { paragraphRefs.current[1] = el; }}
            style={{color: '#E8DCC8'}}
            className={`transition-all duration-700 delay-100 ${
              visibleParagraphs.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Diese App führt dich durch einen tieferen Prozess. Wir schauen uns zuerst an, wer du bist (deine Gedanken, Gefühle und Gewohnheiten) – das ist deine <span className=" font-semibold" style={{color: "#A6805B"}}>'alte Frequenz'</span>.
          </p>
          
          <p
            ref={el => { paragraphRefs.current[2] = el; }}
            style={{color: '#E8DCC8'}}
            className={`transition-all duration-700 delay-200 ${
              visibleParagraphs.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Dann erschaffst du nicht nur einen Wunsch, sondern ein <span className=" font-semibold" style={{color: "#A6805B"}}>neues Selbst</span>. Du fühlst heute schon die Emotionen deiner Zukunft und entscheidest, welche Handlungen zu diesem neuen Ich passen.
          </p>
          
          <p
            ref={el => { paragraphRefs.current[3] = el; }}
            style={{color: '#E8DCC8'}}
            className={`italic font-normal text-xl transition-all duration-700 delay-300 ${
              visibleParagraphs.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Es geht nicht darum, auf ein Wunder zu warten. <span className=" font-semibold" style={{color: "#A6805B"}}>Es geht darum, selbst zum Wunder zu werden.</span>
          </p>
        </div>

        {/* Button - ALWAYS VISIBLE */}
        <div className="text-center pt-4">
          <Button
            onClick={() => setLocation('/new')}
            className="bg-transparent border-2 border-[#C9A961]  hover:bg-[#C9A961]/10 px-12 py-6 text-xl font-medium transition-all duration-300 relative overflow-hidden group" style={{color: "#A6805B"}}
          >
            <div className="shine-effect"></div>
            Transformation starten ✨
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      <style>{`
        /* Cloud morph animation - wabern */
        .cloud-morph {
          animation: cloud-morph 4s ease-in-out infinite;
        }
        
        @keyframes cloud-morph {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          25% {
            transform: scale(1.05, 0.95) translateY(-2px);
          }
          50% {
            transform: scale(0.95, 1.05) translateY(2px);
          }
          75% {
            transform: scale(1.02, 0.98) translateY(-1px);
          }
        }
        
        /* Heart beat animation - pulsieren */
        .heart-beat {
          animation: heart-beat 1.5s ease-in-out infinite;
        }
        
        @keyframes heart-beat {
          0%, 100% {
            transform: scale(1);
          }
          10% {
            transform: scale(1.1);
          }
          20% {
            transform: scale(1);
          }
          30% {
            transform: scale(1.1);
          }
          40% {
            transform: scale(1);
          }
        }
        
        /* Stars sparkle animation - funkeln */
        .stars-sparkle {
          animation: stars-sparkle 3s ease-in-out infinite;
        }
        
        @keyframes stars-sparkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: scale(1.15) rotate(5deg);
            opacity: 0.8;
          }
          50% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          75% {
            transform: scale(1.15) rotate(-5deg);
            opacity: 0.8;
          }
        }
        
        /* Icon glow animations - triggered by light orb */
        .icon-glow-denken {
          animation: icon-glow-denken 12s ease-in-out infinite;
        }
        
        @keyframes icon-glow-denken {
          0%, 10% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4), 0 0 30px 10px rgba(212, 175, 55, 0.6);
          }
          15%, 100% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
          }
        }
        
        .icon-glow-fuehlen {
          animation: icon-glow-fuehlen 12s ease-in-out infinite;
        }
        
        @keyframes icon-glow-fuehlen {
          0%, 35% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
          }
          40%, 50% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4), 0 0 30px 10px rgba(212, 175, 55, 0.6);
          }
          55%, 100% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
          }
        }
        
        .icon-glow-sein {
          animation: icon-glow-sein 12s ease-in-out infinite;
        }
        
        @keyframes icon-glow-sein {
          0%, 65% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
          }
          70%, 80% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4), 0 0 30px 10px rgba(212, 175, 55, 0.6);
          }
          85%, 100% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
          }
        }
        
        /* Light orb traveling animation */
        .light-orb {
          position: absolute;
          width: 12px;
          height: 12px;
          background: radial-gradient(circle, #F4D03F 0%, #A6805B 50%, transparent 70%);
          border-radius: 50%;
          box-shadow: 0 0 20px 5px rgba(244, 208, 63, 0.8);
          animation: light-orb-travel 12s ease-in-out infinite;
          z-index: 20;
        }
        
        @keyframes light-orb-travel {
          0% {
            left: 10%;
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          10% {
            left: 10%;
          }
          35% {
            left: 50%;
          }
          40% {
            left: 50%;
          }
          65% {
            left: 90%;
          }
          70% {
            left: 90%;
          }
          75% {
            opacity: 1;
          }
          80% {
            opacity: 0;
          }
          100% {
            left: 90%;
            opacity: 0;
          }
        }
        
        /* Pulsing animation for cycle circles */
        .cycle-pulse {
          animation: cycle-pulse 3s ease-in-out infinite;
        }
        
        @keyframes cycle-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 20px 10px rgba(212, 175, 55, 0);
          }
        }
        
        /* Arrow pulse animation */
        .arrow-pulse {
          animation: arrow-pulse 2s ease-in-out infinite;
        }
        
        @keyframes arrow-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: translateX(0);
          }
          50% {
            opacity: 1;
            transform: translateX(5px);
          }
        }
        
        /* Frequency waves animation */
        .old-frequency-wave,
        .old-frequency-wave-2 {
          animation: chaotic-wave 3s ease-in-out infinite;
        }
        
        .old-frequency-wave-2 {
          animation-delay: 0.5s;
        }
        
        @keyframes chaotic-wave {
          0%, 100% {
            transform: translateY(0) scaleY(1);
          }
          25% {
            transform: translateY(-10px) scaleY(1.1);
          }
          50% {
            transform: translateY(5px) scaleY(0.9);
          }
          75% {
            transform: translateY(-5px) scaleY(1.05);
          }
        }
        
        .new-frequency-wave,
        .new-frequency-wave-2 {
          animation: harmonic-wave 4s ease-in-out infinite;
        }
        
        .new-frequency-wave-2 {
          animation-delay: 0.3s;
        }
        
        @keyframes harmonic-wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
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
            rgba(212, 175, 55, 0.3) 50%,
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
      `}</style>
    </div>
    </>
  );
}

