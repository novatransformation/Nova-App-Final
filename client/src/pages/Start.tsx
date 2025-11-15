import { useLocation } from "wouter";

export default function Start() {
  const [, setLocation] = useLocation();

  const handleStart = () => {
    setLocation("/welcome");
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden cursor-pointer"
      onClick={handleStart}
      style={{
        background: 'linear-gradient(135deg, #183847 0%, #244451 100%)'
      }}
    >
      {/* Subtle sparkle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <div 
              className="w-1 h-1 rounded-full"
              style={{ 
                backgroundColor: '#A6805B',
                boxShadow: '0 0 4px 1px rgba(212, 175, 55, 0.6)'
              }}
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 space-y-12">

        {/* Logo with Slogan */}
        <div className="space-y-8">
          <img 
            src="/marketing/nova-logo-with-slogan.png" 
            alt="Nova Transformations - Echte Transformation beginnt hier"
            className="w-full max-w-md mx-auto"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
            }}
          />
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
          <h1 
            className="text-3xl md:text-4xl font-light"
            style={{ 
              color: '#F5F1E8',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            Berühre um zu beginnen
          </h1>
        </div>

        {/* Subtle hint */}
        <div 
          className="text-sm font-light opacity-60"
          style={{ 
            color: '#E8DCC8',
            animation: 'fadeInOut 3s ease-in-out infinite'
          }}
        >
          Tippe irgendwo auf den Bildschirm
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}

