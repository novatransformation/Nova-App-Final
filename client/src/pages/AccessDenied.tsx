import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { getLoginUrl } from "@/lib/constants";

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-destructive" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Zugriff nicht autorisiert
            </h1>
            <p className="" style={{color: "#E8DCC8"}}>
              Deine E-Mail-Adresse ist nicht für diese App freigeschaltet.
            </p>
          </div>

          {/* Message */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm " style={{color: "#E8DCC8"}}>
              Diese App ist derzeit nur für ausgewählte Nutzer verfügbar. 
              Wenn du Zugang erhalten möchtest, kontaktiere bitte den App-Administrator.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = getLoginUrl()}
              variant="outline"
              className="w-full"
            >
              Mit anderem Account anmelden
            </Button>
            <Button
              onClick={() => window.location.href = "/"}
              variant="ghost"
              className="w-full"
            >
              Zurück zur Startseite
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

