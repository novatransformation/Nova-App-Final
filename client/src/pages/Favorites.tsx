import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Favorites() {
  const [, setLocation] = useLocation();
  const { data: favorites, isLoading } = trpc.transformations.getFavorites.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#183847] to-[#2C5F6F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#A6805B" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#183847] to-[#2C5F6F] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: "#A6805B" }}>
            ⭐ Deine Favoriten
          </h1>
          <p className="text-xl text-[#F5F1E8] font-light">
            Alle deine gespeicherten Transformationen
          </p>
        </div>

        {/* Favorites List */}
        {!favorites || favorites.length === 0 ? (
          <div className="text-center space-y-6 py-12">
            <p className="text-2xl text-[#F5F1E8]/60">
              Du hast noch keine Favoriten gespeichert.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-[#A6805B] hover:bg-[#C9A961] text-[#183847] font-medium px-8 py-4"
            >
              Neue Transformation starten
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {favorites.map((session) => (
              <div
                key={session.id}
                className="bg-[#183847]/40 border-2 border-[#A6805B]/30 rounded-lg p-6 hover:border-[#A6805B] transition-all cursor-pointer"
                onClick={() => setLocation(`/transformation/${session.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">⭐</span>
                      <h3 className="text-2xl font-semibold" style={{ color: "#A6805B" }}>
                        {session.customTheme || session.theme}
                      </h3>
                    </div>
                    <p className="text-[#F5F1E8]/60 text-sm">
                      Erstellt am {new Date(session.createdAt).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    {session.completedAt && (
                      <p className="text-[#A6805B]/80 text-sm mt-1">
                        ✓ Abgeschlossen
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/transformation/${session.id}`);
                    }}
                    className="bg-transparent border-2 border-[#A6805B] hover:bg-[#A6805B]/10 text-[#A6805B] px-6 py-2"
                  >
                    Öffnen
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center pt-8">
          <Button
            onClick={() => setLocation("/")}
            variant="ghost"
            className="text-[#F5F1E8]/60 hover:text-[#F5F1E8]"
          >
            ← Zurück zur Startseite
          </Button>
        </div>
      </div>
    </div>
  );
}

