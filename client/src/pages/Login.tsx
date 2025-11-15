import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const utils = trpc.useUtils();
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await registerMutation.mutateAsync({
          email,
          password,
          name: name || undefined,
        });
        toast.success("Registrierung erfolgreich!");
      } else {
        await loginMutation.mutateAsync({
          email,
          password,
        });
        toast.success("Anmeldung erfolgreich!");
      }
      
      // Invalidate auth query to refetch user
      await utils.auth.me.invalidate();
      
      // Wait a bit for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to welcome page
      setLocation("/welcome");
    } catch (error: any) {
      toast.error(error.message || "Ein Fehler ist aufgetreten");
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, #183847 0%, #244451 100%)'
      }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-lg"
        style={{
          background: 'rgba(36, 68, 81, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/marketing/nova-logo-with-slogan.png" 
            alt="Nova Transformations"
            className="w-48 mx-auto mb-4"
          />
        </div>

        {/* Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={!isRegister ? "default" : "outline"}
            className="flex-1"
            onClick={() => setIsRegister(false)}
            style={{
              backgroundColor: !isRegister ? '#D4AF37' : 'transparent',
              color: !isRegister ? '#183847' : '#F5F1E8',
              borderColor: '#D4AF37',
            }}
          >
            Anmelden
          </Button>
          <Button
            type="button"
            variant={isRegister ? "default" : "outline"}
            className="flex-1"
            onClick={() => setIsRegister(true)}
            style={{
              backgroundColor: isRegister ? '#D4AF37' : 'transparent',
              color: isRegister ? '#183847' : '#F5F1E8',
              borderColor: '#D4AF37',
            }}
          >
            Registrieren
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <Label 
                htmlFor="name"
                style={{ color: '#F5F1E8' }}
              >
                Name (optional)
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dein Name"
                style={{
                  backgroundColor: 'rgba(24, 56, 71, 0.5)',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  color: '#F5F1E8',
                }}
              />
            </div>
          )}

          <div>
            <Label 
              htmlFor="email"
              style={{ color: '#F5F1E8' }}
            >
              E-Mail
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              style={{
                backgroundColor: 'rgba(24, 56, 71, 0.5)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                color: '#F5F1E8',
              }}
            />
          </div>

          <div>
            <Label 
              htmlFor="password"
              style={{ color: '#F5F1E8' }}
            >
              Passwort
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isRegister ? "Mindestens 8 Zeichen" : "Dein Passwort"}
              required
              minLength={isRegister ? 8 : undefined}
              style={{
                backgroundColor: 'rgba(24, 56, 71, 0.5)',
                borderColor: 'rgba(212, 175, 55, 0.3)',
                color: '#F5F1E8',
              }}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            style={{
              backgroundColor: '#D4AF37',
              color: '#183847',
              fontWeight: 600,
            }}
          >
            {loading ? "Wird geladen..." : isRegister ? "Registrieren" : "Anmelden"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div 
              className="w-full border-t"
              style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }}
            />
          </div>
          <div className="relative flex justify-center text-sm">
            <span 
              className="px-2"
              style={{ 
                backgroundColor: 'rgba(36, 68, 81, 0.8)',
                color: '#E8DCC8'
              }}
            >
              oder
            </span>
          </div>
        </div>

        {/* Google Login (Placeholder) */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled
          style={{
            borderColor: 'rgba(212, 175, 55, 0.3)',
            color: '#F5F1E8',
          }}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Mit Google anmelden (Bald verfügbar)
        </Button>

        {/* Back to Start */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setLocation("/")}
            className="text-sm"
            style={{ color: '#E8DCC8' }}
          >
            ← Zurück zur Startseite
          </button>
        </div>
      </div>
    </div>
  );
}

