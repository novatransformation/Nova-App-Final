import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const slides = [
    {
      title: "13 Schritte zu deinem neuen Selbst",
      description: "Eine tiefgreifende Transformation in zwei Teilen. Nimm dir Zeit für jede Frage – es gibt kein Richtig oder Falsch.",
      icon: "✨",
      color: "#D4AF37"
    },
    {
      title: "Teil 1: Erkenne deine alte Frequenz",
      description: "8 Schritte, um deine aktuellen Gedanken, Gefühle und Gewohnheiten zu verstehen. Werde dir bewusst, was dich heute ausmacht.",
      icon: "🔍",
      color: "#D4AF37"
    },
    {
      title: "Teil 2: Erschaffe deine neue Realität",
      description: "5 Schritte, um dein neues Selbst zu definieren und zu manifestieren. Gestalte bewusst die Realität, die du verdienst.",
      icon: "🌟",
      color: "#C9A961"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Mark tutorial as seen
      localStorage.setItem('onboarding_seen', 'true');
      setFadeOut(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_seen', 'true');
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div 
      className={`fixed inset-0 z-[60] bg-[#183847]/95 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="max-w-2xl w-full">
        {/* Slide Content */}
        <div className="slide-enter-right bg-[#1e4555]/80 backdrop-blur-md rounded-2xl p-8 md:p-12 border-2 border-[#D4AF37]/20 shadow-2xl">
          {/* Icon */}
          <div className="text-center mb-6">
            <div 
              className="text-6xl md:text-7xl animate-bounce"
              style={{ animationDuration: '2s' }}
            >
              {slides[currentSlide].icon}
            </div>
          </div>

          {/* Title */}
          <h2 
            className="text-2xl md:text-3xl font-bold text-center mb-4"
            style={{ color: slides[currentSlide].color }}
          >
            {slides[currentSlide].title}
          </h2>

          {/* Description */}
          <p className="text-[#E8DCC8] text-center text-base md:text-lg leading-relaxed mb-8">
            {slides[currentSlide].description}
          </p>

          {/* Progress Dots - Larger and higher contrast for accessibility */}
          <div className="flex justify-center gap-3 mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-3 rounded-full transition-all duration-300 shadow-lg ${
                  index === currentSlide
                    ? 'w-10 bg-[#D4AF37]'
                    : 'w-3 bg-[#D4AF37]/50'
                }`}
                aria-label={`Schritt ${index + 1} von ${slides.length}`}
                aria-current={index === currentSlide ? 'step' : undefined}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center items-center">
            {currentSlide < slides.length - 1 ? (
              <>
                <Button
                  onClick={handleNext}
                  className="btn-ripple bg-[#D4AF37] hover:bg-[#C9A961] text-[#183847] font-semibold px-10 py-6 text-base shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Weiter
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  size="sm"
                  className="text-[#E8DCC8]/70 hover:text-[#E8DCC8] text-sm font-light"
                >
                  Überspringen
                </Button>
              </>
            ) : (
              <Button
                onClick={handleNext}
                className="btn-ripple bg-[#D4AF37] hover:bg-[#C9A961] text-[#183847] font-semibold px-12 py-6 text-lg"
              >
                Los geht's!
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>

          {/* Time Estimate */}
          <p className="text-[#E8DCC8]/60 text-center text-sm mt-6">
            Geschätzte Gesamtzeit: ~60 Minuten
          </p>
        </div>
      </div>
    </div>
  );
}

