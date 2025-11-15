import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

export default function ProcessIntro() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase timing (in milliseconds)
    const timings = [
      0,      // Start
      4000,   // Phase 1: DENKEN (4s)
      8000,   // Phase 2: FÜHLEN (4s)
      12000,  // Phase 3: SEIN (4s)
      15000,  // Phase 4: VERBINDUNG (3s)
      17000,  // Finale (2s)
      19000   // Navigate to next page
    ];

    const timeouts = timings.map((timing, index) => {
      return setTimeout(() => {
        if (index === timings.length - 1) {
          setLocation('/intro');
        } else {
          setPhase(index);
        }
      }, timing);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#183847] to-[#244451] flex items-center justify-center relative overflow-hidden">
      {/* DENKEN - Center */}
      <div 
        className={`absolute transition-all duration-1000 ${
          phase >= 1 ? 'denken-container' : 'opacity-0 scale-50'
        }`}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Cloud Icon */}
          <div className={`icon-circle ${phase >= 1 ? 'icon-appear' : ''}`}>
            <svg className="w-16 h-16 md:w-20 md:h-20 cloud-morph" viewBox="0 0 24 24" fill="none" stroke="#A6805B" strokeWidth="1.5">
              <path d="M6.5 19C4.01472 19 2 16.9853 2 14.5C2 12.3023 3.58273 10.4722 5.68977 10.0862C5.24087 9.29778 5 8.38017 5 7.5C5 4.46243 7.46243 2 10.5 2C12.5711 2 14.3592 3.13538 15.2711 4.81545C15.6711 4.6 16.1119 4.5 16.5 4.5C18.433 4.5 20 6.067 20 8C20 8.26046 19.9741 8.51523 19.9246 8.76156C21.1437 9.35418 22 10.5862 22 12C22 14.2091 20.2091 16 18 16H6.5Z" />
            </svg>
          </div>
          {/* Word */}
          <div className={`word-appear ${phase >= 1 ? 'word-visible' : ''}`} style={{ animationDelay: '500ms' }}>
            <span className="text-3xl md:text-4xl font-bold " style={{color: "#A6805B"}}>Denken</span>
          </div>
        </div>
      </div>

      {/* FÜHLEN - Top Right */}
      <div 
        className={`absolute transition-all duration-1000 ${
          phase >= 2 ? 'fuehlen-container' : 'opacity-0 scale-50'
        }`}
        style={{
          left: '65%',
          top: '30%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Heart Icon */}
          <div className={`icon-circle ${phase >= 2 ? 'icon-appear' : ''}`}>
            <svg className="w-16 h-16 md:w-20 md:h-20 heart-beat" viewBox="0 0 24 24" fill="#A6805B">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          {/* Word */}
          <div className={`word-appear ${phase >= 2 ? 'word-visible' : ''}`} style={{ animationDelay: '500ms' }}>
            <span className="text-3xl md:text-4xl font-bold " style={{color: "#A6805B"}}>Fühlen</span>
          </div>
        </div>
      </div>

      {/* SEIN - Top Left */}
      <div 
        className={`absolute transition-all duration-1000 ${
          phase >= 3 ? 'sein-container' : 'opacity-0 scale-50'
        }`}
        style={{
          left: '35%',
          top: '30%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Star Icon */}
          <div className={`icon-circle ${phase >= 3 ? 'icon-appear' : ''}`}>
            <svg className="w-16 h-16 md:w-20 md:h-20 stars-sparkle" viewBox="0 0 24 24" fill="#A6805B">
              <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z"/>
              <path opacity="0.6" d="M18 8l1.2 3.7h3.8l-3 2.3 1.15 3.5-3.15-2.35-3.15 2.35 1.15-3.5-3-2.3h3.8z" transform="translate(2, 2) scale(0.4)"/>
            </svg>
          </div>
          {/* Word */}
          <div className={`word-appear ${phase >= 3 ? 'word-visible' : ''}`} style={{ animationDelay: '500ms' }}>
            <span className="text-3xl md:text-4xl font-bold " style={{color: "#A6805B"}}>Sein</span>
          </div>
        </div>
      </div>

      {/* Arrow 1: Denken → Fühlen */}
      <svg 
        className={`absolute arrow-draw ${phase >= 4 ? 'arrow-visible' : ''}`}
        style={{
          left: '50%',
          top: '50%',
          width: '200px',
          height: '200px',
          transform: 'translate(-50%, -50%)'
        }}
        viewBox="0 0 200 200"
      >
        <defs>
          <marker id="arrowhead1" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#C9A961" />
          </marker>
        </defs>
        <path 
          className="arrow-path"
          d="M 100 100 Q 130 70 150 50" 
          stroke="#C9A961" 
          strokeWidth="3" 
          fill="none" 
          markerEnd="url(#arrowhead1)"
        />
      </svg>

      {/* Arrow 2: Fühlen → Sein */}
      <svg 
        className={`absolute arrow-draw ${phase >= 4 ? 'arrow-visible' : ''}`}
        style={{
          left: '50%',
          top: '30%',
          width: '200px',
          height: '100px',
          transform: 'translate(-50%, -50%)',
          animationDelay: '500ms'
        }}
        viewBox="0 0 200 100"
      >
        <defs>
          <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#C9A961" />
          </marker>
        </defs>
        <path 
          className="arrow-path"
          d="M 150 50 L 50 50" 
          stroke="#C9A961" 
          strokeWidth="3" 
          fill="none" 
          markerEnd="url(#arrowhead2)"
        />
      </svg>

      {/* Finale: Golden Glow */}
      <div className={`absolute inset-0 finale-glow ${phase >= 5 ? 'finale-active' : ''}`}></div>

      <style>{`
        /* Icon circle */
        .icon-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(201, 169, 97, 0.1));
          border: 2px solid #A6805B;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.5);
        }
        
        .icon-appear {
          animation: icon-grow 1s ease-out forwards;
        }
        
        @keyframes icon-grow {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        /* Word appear */
        .word-appear {
          opacity: 0;
          transform: translateY(10px);
        }
        
        .word-visible {
          animation: word-pop 0.5s ease-out forwards;
        }
        
        @keyframes word-pop {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.9);
          }
          50% {
            transform: translateY(-5px) scale(1.05);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Cloud morph animation */
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
        
        /* Heart beat animation */
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
        
        /* Stars sparkle animation */
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
        
        /* Arrow drawing animation */
        .arrow-draw {
          opacity: 0;
        }
        
        .arrow-visible {
          animation: arrow-appear 1s ease-out forwards;
        }
        
        .arrow-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
        }
        
        .arrow-visible .arrow-path {
          animation: draw-arrow 1s ease-out forwards;
        }
        
        @keyframes arrow-appear {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes draw-arrow {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        /* Finale golden glow */
        .finale-glow {
          background: radial-gradient(circle, rgba(212, 175, 55, 0) 0%, rgba(212, 175, 55, 0) 100%);
          opacity: 0;
          pointer-events: none;
        }
        
        .finale-active {
          animation: finale-glow 2s ease-in-out forwards;
        }
        
        @keyframes finale-glow {
          0% {
            background: radial-gradient(circle, rgba(212, 175, 55, 0) 0%, rgba(212, 175, 55, 0) 100%);
            opacity: 0;
          }
          50% {
            background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0) 70%);
            opacity: 1;
          }
          100% {
            background: radial-gradient(circle, rgba(212, 175, 55, 0) 0%, rgba(212, 175, 55, 0) 100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

