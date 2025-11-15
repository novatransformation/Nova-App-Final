// import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/lib/constants";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Home, DollarSign, Heart, Brain, Users, Target, Compass, Lightbulb, Loader2, Sparkles, Briefcase, Users2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const THEMES = [
  { id: "money", label: "Geld & Fülle", icon: DollarSign, description: "Lerne, materiellen und inneren Reichtum zu verbinden." },
  { id: "health", label: "Gesundheit & Vitalität", icon: Heart, description: "Finde Energie und Lebenskraft in deinem Körper." },
  { id: "emotions", label: "Emotionen & Selbstregulation", icon: Brain, description: "Finde Ruhe im inneren Sturm." },
  { id: "self-worth", label: "Selbstwert & Selbstliebe", icon: Sparkles, description: "Erkenne deinen wahren Wert und liebe dich selbst." },
  { id: "relationships", label: "Beziehungen & Liebe", icon: Users, description: "Erschaffe tiefe, authentische Verbindungen." },
  { id: "work", label: "Arbeit & Karriere", icon: Briefcase, description: "Verbinde Erfolg mit Erfüllung und Freude." },
  { id: "family", label: "Familie & Herkunft", icon: Users2, description: "Heile alte Muster und schaffe neue Beziehungen." },
  { id: "success", label: "Persönliche Entwicklung & Erfolg", icon: Target, description: "Wachse über dich hinaus und erreiche deine Ziele." },
  { id: "identity", label: "Identität & Sinnsuche", icon: Compass, description: "Finde deinen wahren Purpose und deine Bestimmung." },
  { id: "spirituality", label: "Spiritualität & Bewusstsein", icon: Lightbulb, description: "Verbinde dich mit deiner inneren Weisheit." },
];

export default function NewTransformation() {
  // const { isAuthenticated } = useAuth();
  const isAuthenticated = true; // Auth disabled
  const [, setLocation] = useLocation();
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [customTheme, setCustomTheme] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  const createMutation = trpc.transformations.create.useMutation({
    onSuccess: (data) => {
      console.log('✅ Session created:', data.sessionId);
      setLocation(`/process/${data.sessionId}`);
    },
    onError: (error) => {
      toast.error(
        error.message || "Fehler beim Erstellen der Transformation. Bitte versuche es erneut.",
        {
          description: "Falls das Problem weiterhin besteht, kontaktiere bitte den Support.",
          duration: 5000,
        }
      );
    },
  });

  if (false) { // Auth check disabled
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Button onClick={() => window.location.href = getLoginUrl()}>
          Bitte anmelden
        </Button>
      </div>
    );
  }

  const handleThemeSelect = (themeId: string) => {
    console.log('🟡 Theme selected:', themeId);
    setSelectedTheme(themeId);
    setIsCustom(false);
    setCustomTheme("");
    const theme = THEMES.find(t => t.id === themeId);
    console.log('🟡 Theme found:', theme);
    if (theme) {
      console.log('🟡 Calling mutation with theme:', theme.label);
      createMutation.mutate({ theme: theme.label });
    } else {
      console.error('❌ Theme not found for ID:', themeId);
    }
  };

  const handleCustomTheme = () => {
    if (!customTheme.trim()) {
      toast.error("Bitte gib ein Thema ein");
      return;
    }
    createMutation.mutate({ 
      theme: "Freies Thema",
      customTheme 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#183847] to-[#2C5F6F]">
      {/* Minimal Header */}
        <div className="sticky top-0 z-10 bg-[#183847]/95 backdrop-blur">
        <div className="px-4 py-3 flex justify-end">
          <Button onClick={() => setLocation("/")} variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Home className="w-3.5 h-3.5 icon-gold" />
          </Button>
        </div>
        <div className="divider-gold" />
      </div>

      <div className="p-6 pb-32">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold " style={{color: "#E8DCC8"}}>Wähle dein <span className=" font-bold" style={{color: "#A6805B"}}>Thema</span></h2>
            <p className="text-sm  max-w-md mx-auto font-extralight" style={{color: "#E8DCC8"}}>
              Erkenne die <span className="text-primary font-medium">Ursache</span> in deinem Inneren und verändere die <span className="text-primary font-medium">Wirkung</span> in deinem Außen.
            </p>
          </div>

          {/* Theme Grid - Responsive: 1 column on mobile, 2 on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
            {THEMES.map((theme) => {
              const Icon = theme.icon;
              
              return (
                <Card
                  key={theme.id}
                  className={`theme-card group cursor-pointer p-4 transition-all ${
                    selectedTheme === theme.id 
                      ? 'bg-[#A6805B]/20 ring-2 ring-[#D4AF37] shadow-lg shadow-[#D4AF37]/30' 
                      : 'bg-card/50 hover:bg-card/70'
                  }`}
                  style={{ 
                    border: selectedTheme === theme.id ? '2px solid #D4AF37' : '2px solid #A6805B', 
                    borderRadius: '12px' 
                  }}
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Icon className="theme-icon w-6 h-6" style={{color: "#A6805B"}} />
                    <span className="text-sm font-light leading-tight " style={{color: "#E8DCC8"}}>{theme.label}</span>
                    <p className="text-xs  font-light italic mt-1" style={{color: "#E8DCC8"}}>{theme.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Custom Theme - Moved below predefined themes */}
          <div className="mt-8 overflow-x-hidden">
            <Card className="p-5 bg-card/50 overflow-x-hidden" style={{ border: '2px solid #A6805B', borderRadius: '12px' }}>
              <div className="space-y-4 overflow-x-hidden">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-medium " style={{color: "#E8DCC8"}}>Freies Thema</h3>
                </div>
                <p className="text-xs  font-light" style={{color: "#E8DCC8"}}>
                  Möchtest du ein anderes Thema bearbeiten? Beschreibe es hier.
                </p>
                <Input
                  placeholder="z.B. Meine Beziehung zu meiner Mutter"
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  className="text-sm bg-white/90 text-[#183847] placeholder:text-[#183847]/50 border-2 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                  style={{ borderColor: '#C9A961', borderRadius: '8px' }}
                />
                <Button
                  onClick={handleCustomTheme}
                  disabled={createMutation.isPending || !customTheme.trim()}
                  className={`w-full max-w-full text-sm transition-all px-4 ${
                    !customTheme.trim() || createMutation.isPending
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105'
                  }`}
                  style={{ textAlign: 'center' }}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird erstellt...
                    </>
                  ) : (
                    "Transformation starten ✨"
                  )}
                </Button>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

