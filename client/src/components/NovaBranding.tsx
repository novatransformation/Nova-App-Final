import React from 'react';

interface NovaBrandingProps {
  variant?: 'header' | 'footer' | 'welcome' | 'inline';
  showClaim?: boolean;
}

export default function NovaBranding({ variant = 'inline', showClaim = true }: NovaBrandingProps) {
  const renderLogo = () => (
    <div className="flex items-center gap-3">
      {/* Lotus Symbol */}
      <div className="relative">
        <svg
          width={variant === 'welcome' ? '48' : variant === 'header' ? '32' : '24'}
          height={variant === 'welcome' ? '48' : variant === 'header' ? '32' : '24'}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Lotus petals - gradient from petrol to gold */}
          <defs>
            <linearGradient id="lotus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2C5F6F" />
              <stop offset="50%" stopColor="#C9A961" />
              <stop offset="100%" stopColor="#A6805B" />
            </linearGradient>
          </defs>
          
          {/* Center petal */}
          <path
            d="M50 20 C55 30, 55 40, 50 50 C45 40, 45 30, 50 20"
            fill="url(#lotus-gradient)"
            opacity="0.9"
          />
          
          {/* Left petal */}
          <path
            d="M35 30 C40 35, 42 42, 45 48 C40 45, 35 40, 35 30"
            fill="url(#lotus-gradient)"
            opacity="0.8"
          />
          
          {/* Right petal */}
          <path
            d="M65 30 C60 35, 58 42, 55 48 C60 45, 65 40, 65 30"
            fill="url(#lotus-gradient)"
            opacity="0.8"
          />
          
          {/* Bottom left petal */}
          <path
            d="M30 45 C35 48, 40 50, 45 52 C42 48, 38 45, 30 45"
            fill="url(#lotus-gradient)"
            opacity="0.7"
          />
          
          {/* Bottom right petal */}
          <path
            d="M70 45 C65 48, 60 50, 55 52 C58 48, 62 45, 70 45"
            fill="url(#lotus-gradient)"
            opacity="0.7"
          />
          
          {/* Center glow */}
          <circle cx="50" cy="48" r="6" fill="#A6805B" opacity="0.6" />
          <circle cx="50" cy="48" r="3" fill="#F5F1E8" opacity="0.9" />
        </svg>
      </div>
      
      {/* Brand Name */}
      <div className="flex flex-col text-center sm:text-left">
        <h1 
          className={`font-serif font-semibold tracking-tight ${
            variant === 'welcome' ? 'text-4xl' : 
            variant === 'header' ? 'text-2xl' : 
            variant === 'footer' ? 'text-lg' :
            'text-xl'
          }`}
          style={{ 
            background: 'linear-gradient(135deg, #A6805B 0%, #C9A961 50%, #E8C5A0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Nova Transformations
        </h1>
        
        {showClaim && (
          <p 
            className={`text-[#E8DCC8] italic ${
              variant === 'welcome' ? 'text-base' : 
              variant === 'header' ? 'text-sm' : 
              'text-xs'
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Erschaffe die Realität, die du verdienst.
          </p>
        )}
      </div>
    </div>
  );

  if (variant === 'header') {
    return (
      <div className="py-4 px-6 border-b border-[#B8956A]/30 bg-[#183847]">
        {renderLogo()}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="py-6 px-6 border-t border-[#B8956A]/30 bg-[#183847] text-center">
        <div className="flex justify-center mb-3">
          {renderLogo()}
        </div>
        <p className="text-xs text-[#E8DCC8]/70">
          © {new Date().getFullYear()} Nova Transformations. Alle Rechte vorbehalten.
        </p>
      </div>
    );
  }

  if (variant === 'welcome') {
    return (
      <div className="flex flex-col items-center justify-center text-center w-full">
        <div className="flex flex-col items-center gap-3">
          {/* Lotus Symbol */}
          <div className="relative">
            <svg
              width='48'
              height='48'
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="lotus-gradient-welcome" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2C5F6F" />
                  <stop offset="50%" stopColor="#C9A961" />
                  <stop offset="100%" stopColor="#A6805B" />
                </linearGradient>
              </defs>
              <path d="M50 20 C55 30, 55 40, 50 50 C45 40, 45 30, 50 20" fill="url(#lotus-gradient-welcome)" opacity="0.9" />
              <path d="M35 30 C40 35, 42 42, 45 48 C40 45, 35 40, 35 30" fill="url(#lotus-gradient-welcome)" opacity="0.8" />
              <path d="M65 30 C60 35, 58 42, 55 48 C60 45, 65 40, 65 30" fill="url(#lotus-gradient-welcome)" opacity="0.8" />
              <path d="M30 45 C35 48, 40 50, 45 52 C42 48, 38 45, 30 45" fill="url(#lotus-gradient-welcome)" opacity="0.7" />
              <path d="M70 45 C65 48, 60 50, 55 52 C58 48, 62 45, 70 45" fill="url(#lotus-gradient-welcome)" opacity="0.7" />
              <circle cx="50" cy="48" r="6" fill="#A6805B" opacity="0.6" />
              <circle cx="50" cy="48" r="3" fill="#F5F1E8" opacity="0.9" />
            </svg>
          </div>
          
          {/* Brand Name */}
          <div className="flex flex-col items-center">
            <h1 
              className="font-serif font-semibold tracking-tight text-3xl sm:text-4xl"
              style={{ 
                background: 'linear-gradient(135deg, #A6805B 0%, #C9A961 50%, #E8C5A0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Nova Transformations
            </h1>
            
            {showClaim && (
              <p 
                className="text-[#E8DCC8] italic text-sm sm:text-base mt-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Erschaffe die Realität, die du verdienst.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return renderLogo();
}

