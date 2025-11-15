// import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/lib/constants";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Home, Loader2, Plus, CheckCircle2, Clock, ArrowLeft, Download, Trash2, FileText, Mic } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function History() {
  // const { isAuthenticated } = useAuth();
  const isAuthenticated = true; // Auth disabled
  const [, setLocation] = useLocation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: sessions, isLoading } = trpc.transformations.list.useQuery(
    undefined,
    { enabled: true } // Always enabled
  );

  const exportPDFMutation = trpc.nova.exportPDF.useMutation();
  const deleteMutation = trpc.transformations.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch the list immediately
      utils.transformations.list.invalidate();
    }
  });

  if (false) { // Auth check disabled
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Button onClick={() => window.location.href = getLoginUrl()} size="lg">
          Bitte anmelden
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const allSessions = sessions || [];

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDelete = async (sessionId: number) => {
    if (!confirm("Möchtest du diese Transformation wirklich löschen?")) {
      return;
    }

    setDeletingId(sessionId);
    try {
      await deleteMutation.mutateAsync({ sessionId });
      toast.success("Transformation gelöscht");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Löschen fehlgeschlagen");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAudioDownload = async (sessionId: number, part: 'old' | 'healing' | 'new') => {
    toast.info("Audio-Download wird vorbereitet...");
    // TODO: Implement audio generation
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-3 flex justify-between items-center">
          <Button onClick={() => setLocation("/")} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <Button onClick={() => setLocation("/")} variant="ghost" size="sm">
            <Home className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-6 pb-32 max-w-2xl mx-auto space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold">Meine Transformationen</h1>

        {/* Sessions List */}
        {allSessions.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-lg " style={{color: "#E8DCC8"}}>
              Noch keine Transformationen
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {allSessions.map(session => {
              const isCompleted = session.status === "completed";
              
              return (
                <Card
                  key={session.id}
                  className="hover:border-primary transition-all p-5"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-medium flex-1">
                        {session.customTheme || session.theme}
                      </h3>
                      {isCompleted ? (
                        <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Fertig
                        </Badge>
                      ) : (
                        <Badge variant="default" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          <Clock className="w-3 h-3 mr-1" />
                          Aktiv
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm " style={{color: "#E8DCC8"}}>
                      {formatDate(session.createdAt)}
                    </p>
                    
                    {/* Downloads Section - Only for completed */}
                    {isCompleted ? (
                      <div className="space-y-3 pt-2 border-t">
                        {/* PDF Download */}
                        <div>
                          <p className="text-xs font-medium  mb-2" style={{color: "#E8DCC8"}}>📄 Downloads</p>
                          <Button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const result = await exportPDFMutation.mutateAsync({ sessionId: session.id });
                                
                                const byteCharacters = atob(result.content);
                                const byteNumbers = new Array(byteCharacters.length);
                                for (let i = 0; i < byteCharacters.length; i++) {
                                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                                }
                                const byteArray = new Uint8Array(byteNumbers);
                                const blob = new Blob([byteArray], { type: 'application/pdf' });
                                
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = result.filename;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error('PDF export failed:', error);
                                toast.error('PDF konnte nicht erstellt werden');
                              }
                            }}
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={exportPDFMutation.isPending}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {exportPDFMutation.isPending ? 'Erstelle PDF...' : 'PDF-Manifest'}
                          </Button>
                        </div>

                        {/* Audio Downloads */}
                        <div>
                          <p className="text-xs font-medium  mb-2" style={{color: "#E8DCC8"}}>🎧 Audio-Versionen</p>
                          <div className="space-y-2">
                            <Button
                              onClick={() => handleAudioDownload(session.id, 'old')}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Mic className="w-4 h-4 mr-2" />
                              Was war
                            </Button>
                            <Button
                              onClick={() => handleAudioDownload(session.id, 'healing')}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Mic className="w-4 h-4 mr-2" />
                              Die Heilung
                            </Button>
                            <Button
                              onClick={() => handleAudioDownload(session.id, 'new')}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Mic className="w-4 h-4 mr-2" />
                              Was kommt
                            </Button>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="flex justify-center pt-2">
                          <Button
                            onClick={() => handleDelete(session.id)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={deletingId === session.id}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deletingId === session.id ? 'Lösche...' : 'Löschen'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 pt-2">
                        <Button
                          onClick={() => setLocation(`/process/${session.id}`)}
                          variant="default"
                          size="sm"
                          className="w-full"
                        >
                          Fortsetzen
                        </Button>
                        <div className="flex justify-center">
                          <Button
                            onClick={() => handleDelete(session.id)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={deletingId === session.id}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deletingId === session.id ? 'Lösche...' : 'Löschen'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
        <div className="max-w-2xl mx-auto">
          <Button onClick={() => setLocation("/new")} size="lg" className="w-full text-xl py-8">
            <Plus className="w-5 h-5 mr-2" />
            Neue Transformation
          </Button>
        </div>
      </div>
    </div>
  );
}

