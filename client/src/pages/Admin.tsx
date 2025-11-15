import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Settings, FileText, Sparkles, MessageSquare, Layers, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not admin
  if (!loading && (!isAuthenticated || user?.role !== "admin")) {
    setLocation("/");
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="" style={{color: "#E8DCC8"}}>Lade Admin-Panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Admin-Panel</h1>
          </div>
          <p className="" style={{color: "#E8DCC8"}}>
            Verwalte alle Inhalte deiner Transformations-App
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Texte
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Themen
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Vorschläge
            </TabsTrigger>
            <TabsTrigger value="steps" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Schritte
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Nova
            </TabsTrigger>
            <TabsTrigger value="whitelist" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Zugriff
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content">
            <ContentEditor />
          </TabsContent>

          {/* Themes Tab */}
          <TabsContent value="themes">
            <ThemesEditor />
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions">
            <SuggestionsEditor />
          </TabsContent>

          {/* Steps Tab */}
          <TabsContent value="steps">
            <StepsEditor />
          </TabsContent>

          {/* Prompts Tab */}
          <TabsContent value="prompts">
            <PromptsEditor />
          </TabsContent>

          {/* Whitelist Tab */}
          <TabsContent value="whitelist">
            <WhitelistEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Content Editor Component
function ContentEditor() {
  const { data: contents, refetch } = trpc.admin.getAppContent.useQuery();
  const updateContent = trpc.admin.updateAppContent.useMutation({
    onSuccess: () => {
      toast.success("Inhalt gespeichert!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (key: string, value: string) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const handleSave = (key: string) => {
    updateContent.mutate({ key, value: editValue });
    setEditingKey(null);
  };

  if (!contents) {
    return <div className="text-center py-8">Lade Inhalte...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">App-Texte bearbeiten</h2>
        <p className="" style={{color: "#E8DCC8"}}>
          Hier kannst du alle Texte, Überschriften und Slogans der App anpassen.
        </p>
      </div>

      {contents.map((content: any) => (
        <Card key={content.id} className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-foreground">{content.key}</Label>
              {content.description && (
                <p className="text-xs  mt-1" style={{color: "#E8DCC8"}}>{content.description}</p>
              )}
            </div>

            {editingKey === content.key ? (
              <div className="space-y-3">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={4}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(content.key)} size="sm">
                    Speichern
                  </Button>
                  <Button
                    onClick={() => setEditingKey(null)}
                    variant="outline"
                    size="sm"
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-muted/30 rounded-md">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{content.value}</p>
                </div>
                <Button
                  onClick={() => handleEdit(content.key, content.value)}
                  variant="outline"
                  size="sm"
                >
                  Bearbeiten
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

// Themes Editor Component
function ThemesEditor() {
  const { data: themes, refetch } = trpc.admin.getThemes.useQuery();
  const updateTheme = trpc.admin.updateTheme.useMutation({
    onSuccess: () => {
      toast.success("Thema gespeichert!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleEdit = (theme: any) => {
    setEditingId(theme.id);
    setEditName(theme.name);
    setEditIcon(theme.icon);
    setEditDescription(theme.description || "");
  };

  const handleSave = (id: number) => {
    updateTheme.mutate({ 
      id, 
      name: editName, 
      icon: editIcon, 
      description: editDescription 
    });
    setEditingId(null);
  };

  if (!themes) {
    return <div className="text-center py-8">Lade Themen...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Themen verwalten</h2>
        <p className="" style={{color: "#E8DCC8"}}>
          Bearbeite Namen, Icons und Beschreibungen der 10 Themen.
        </p>
      </div>

      {themes.map((theme: any) => (
        <Card key={theme.id} className="p-6">
          <div className="space-y-4">
            {editingId === theme.id ? (
              <div className="space-y-4">
                <div>
                  <Label>Themen-Name</Label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="z.B. Geld & Fülle"
                  />
                </div>
                <div>
                  <Label>Icon (Lucide Icon Name)</Label>
                  <Input
                    value={editIcon}
                    onChange={(e) => setEditIcon(e.target.value)}
                    placeholder="z.B. DollarSign"
                  />
                </div>
                <div>
                  <Label>Beschreibung</Label>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Kurze Beschreibung des Themas"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(theme.id)} size="sm">
                    Speichern
                  </Button>
                  <Button
                    onClick={() => setEditingId(null)}
                    variant="outline"
                    size="sm"
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{theme.name}</h3>
                  <p className="text-sm " style={{color: "#E8DCC8"}}>Icon: {theme.icon}</p>
                  {theme.description && (
                    <p className="text-sm  mt-2" style={{color: "#E8DCC8"}}>{theme.description}</p>
                  )}
                </div>
                <Button
                  onClick={() => handleEdit(theme)}
                  variant="outline"
                  size="sm"
                >
                  Bearbeiten
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

// Suggestions Editor Component
function SuggestionsEditor() {
  const { data: themes } = trpc.admin.getThemes.useQuery();
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [selectedStepNumber, setSelectedStepNumber] = useState<number>(1);

  const { data: suggestions, refetch } = trpc.admin.getSuggestions.useQuery(
    { themeId: selectedThemeId || undefined, stepNumber: selectedStepNumber },
    { enabled: !!selectedThemeId }
  );

  const updateSuggestion = trpc.admin.updateSuggestion.useMutation({
    onSuccess: () => {
      toast.success("Vorschlag gespeichert!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (suggestion: any) => {
    setEditingId(suggestion.id);
    setEditText(suggestion.suggestion);
  };

  const handleSave = (id: number) => {
    updateSuggestion.mutate({ id, suggestion: editText });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Vorschläge verwalten</h2>
        <p className="" style={{color: "#E8DCC8"}}>
          Bearbeite die Vorschläge für jedes Thema und jeden Schritt.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Thema auswählen</Label>
          <Select
            value={selectedThemeId?.toString()}
            onValueChange={(value) => setSelectedThemeId(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wähle ein Thema" />
            </SelectTrigger>
            <SelectContent>
              {themes?.map((theme: any) => (
                <SelectItem key={theme.id} value={theme.id.toString()}>
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Schritt auswählen</Label>
          <Select
            value={selectedStepNumber.toString()}
            onValueChange={(value) => setSelectedStepNumber(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  Schritt {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Suggestions List */}
      {!selectedThemeId ? (
        <Card className="p-6">
          <p className=" text-center" style={{color: "#E8DCC8"}}>
            Bitte wähle zuerst ein Thema aus.
          </p>
        </Card>
      ) : !suggestions || suggestions.length === 0 ? (
        <Card className="p-6">
          <p className=" text-center" style={{color: "#E8DCC8"}}>
            Keine Vorschläge für diese Kombination gefunden.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion: any) => (
            <Card key={suggestion.id} className="p-4">
              {editingId === suggestion.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleSave(suggestion.id)} size="sm">
                      Speichern
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="outline"
                      size="sm"
                    >
                      Abbrechen
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm text-foreground flex-1">{suggestion.suggestion}</p>
                  <Button
                    onClick={() => handleEdit(suggestion)}
                    variant="outline"
                    size="sm"
                  >
                    Bearbeiten
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Steps Editor Component
function StepsEditor() {
  const { data: steps, refetch } = trpc.admin.getSteps.useQuery();
  const updateStep = trpc.admin.updateStep.useMutation({
    onSuccess: () => {
      toast.success("Schritt gespeichert!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPlaceholder, setEditPlaceholder] = useState("");
  const [editInstruction, setEditInstruction] = useState("");

  const handleEdit = (step: any) => {
    setEditingStep(step.stepNumber);
    setEditTitle(step.title);
    setEditPlaceholder(step.placeholder);
    setEditInstruction(step.instruction || "");
  };

  const handleSave = (stepNumber: number) => {
    updateStep.mutate({
      stepNumber,
      title: editTitle,
      placeholder: editPlaceholder,
      instruction: editInstruction,
    });
    setEditingStep(null);
  };

  if (!steps) {
    return <div className="text-center py-8">Lade Schritte...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Schritte konfigurieren</h2>
        <p className="" style={{color: "#E8DCC8"}}>
          Bearbeite Titel, Platzhalter und Anleitungen für alle 13 Schritte.
        </p>
      </div>

      {steps.map((step: any) => (
        <Card key={step.id} className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-primary">
                Schritt {step.stepNumber}
              </span>
              <span className="text-sm " style={{color: "#E8DCC8"}}>
                ({step.stepName})
              </span>
            </div>

            {editingStep === step.stepNumber ? (
              <div className="space-y-4">
                <div>
                  <Label>Titel</Label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="z.B. Schritt 1: Deine Gedanken"
                  />
                </div>
                <div>
                  <Label>Platzhalter-Text</Label>
                  <Input
                    value={editPlaceholder}
                    onChange={(e) => setEditPlaceholder(e.target.value)}
                    placeholder="z.B. Ich denke immer wieder..."
                  />
                </div>
                <div>
                  <Label>Anleitung (optional)</Label>
                  <Textarea
                    value={editInstruction}
                    onChange={(e) => setEditInstruction(e.target.value)}
                    placeholder="Hilfetext für den Nutzer"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(step.stepNumber)} size="sm">
                    Speichern
                  </Button>
                  <Button
                    onClick={() => setEditingStep(null)}
                    variant="outline"
                    size="sm"
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm"><strong>Titel:</strong> {step.title}</p>
                  <p className="text-sm"><strong>Platzhalter:</strong> {step.placeholder}</p>
                  {step.instruction && (
                    <p className="text-sm"><strong>Anleitung:</strong> {step.instruction}</p>
                  )}
                </div>
                <Button
                  onClick={() => handleEdit(step)}
                  variant="outline"
                  size="sm"
                >
                  Bearbeiten
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

// Prompts Editor Component
function PromptsEditor() {
  const { data: prompts, refetch } = trpc.admin.getNovaPrompts.useQuery();
  const updatePrompt = trpc.admin.updateNovaPrompt.useMutation({
    onSuccess: () => {
      toast.success("Prompt gespeichert!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState("");

  const handleEdit = (prompt: any) => {
    setEditingKey(prompt.key);
    setEditPrompt(prompt.prompt);
  };

  const handleSave = (key: string) => {
    updatePrompt.mutate({ key, prompt: editPrompt });
    setEditingKey(null);
  };

  if (!prompts) {
    return <div className="text-center py-8">Lade Prompts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Nova-Prompts anpassen</h2>
        <p className="" style={{color: "#E8DCC8"}}>
          Bearbeite die System-Prompts für Nova's AI-Analysen und PDF-Generierung.
        </p>
      </div>

      {prompts.map((prompt: any) => (
        <Card key={prompt.id} className="p-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-foreground">{prompt.key}</Label>
              {prompt.description && (
                <p className="text-xs  mt-1" style={{color: "#E8DCC8"}}>{prompt.description}</p>
              )}
            </div>

            {editingKey === prompt.key ? (
              <div className="space-y-3">
                <Textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  rows={12}
                  className="w-full font-mono text-xs"
                />
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(prompt.key)} size="sm">
                    Speichern
                  </Button>
                  <Button
                    onClick={() => setEditingKey(null)}
                    variant="outline"
                    size="sm"
                  >
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-muted/30 rounded-md max-h-64 overflow-y-auto">
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
                    {prompt.prompt}
                  </pre>
                </div>
                <Button
                  onClick={() => handleEdit(prompt)}
                  variant="outline"
                  size="sm"
                >
                  Bearbeiten
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}


// Whitelist Editor Component
function WhitelistEditor() {
  const { data: whitelist, refetch } = trpc.admin.getWhitelist.useQuery();
  const addToWhitelist = trpc.admin.addToWhitelist.useMutation({
    onSuccess: () => {
      toast.success("E-Mail hinzugefügt!");
      refetch();
      setNewEmail("");
      setNewNote("");
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const removeFromWhitelist = trpc.admin.removeFromWhitelist.useMutation({
    onSuccess: () => {
      toast.success("E-Mail entfernt!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const [newEmail, setNewEmail] = useState("");
  const [newNote, setNewNote] = useState("");

  const handleAdd = () => {
    if (!newEmail) {
      toast.error("Bitte E-Mail-Adresse eingeben");
      return;
    }
    addToWhitelist.mutate({ email: newEmail, note: newNote });
  };

  const handleRemove = (id: number) => {
    if (confirm("Möchtest du diese E-Mail wirklich von der Whitelist entfernen?")) {
      removeFromWhitelist.mutate({ id });
    }
  };

  if (!whitelist) {
    return <div className="text-center py-8">Lade Whitelist...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Zugriffskontrolle</h2>
        <p className="" style={{color: "#E8DCC8"}}>
          Nur E-Mail-Adressen auf dieser Liste können sich in der App anmelden.
        </p>
      </div>

      {/* Add new email */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Neue E-Mail hinzufügen</h3>
        <div className="space-y-4">
          <div>
            <Label>E-Mail-Adresse</Label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <div>
            <Label>Notiz (optional)</Label>
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="z.B. Beta-Tester, Freund, etc."
            />
          </div>
          <Button onClick={handleAdd} disabled={addToWhitelist.isPending}>
            <Plus className="w-4 h-4 mr-2" />
            Hinzufügen
          </Button>
        </div>
      </Card>

      {/* Whitelist entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Autorisierte E-Mails ({whitelist.length})
        </h3>
        
        {whitelist.length === 0 ? (
          <Card className="p-6">
            <p className=" text-center" style={{color: "#E8DCC8"}}>
              Noch keine E-Mails auf der Whitelist. Füge die erste hinzu!
            </p>
          </Card>
        ) : (
          whitelist.map((entry: any) => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{entry.email}</p>
                  {entry.note && (
                    <p className="text-xs  mt-1" style={{color: "#E8DCC8"}}>{entry.note}</p>
                  )}
                  <p className="text-xs  mt-1" style={{color: "#E8DCC8"}}>
                    Hinzugefügt: {new Date(entry.createdAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <Button
                  onClick={() => handleRemove(entry.id)}
                  variant="destructive"
                  size="sm"
                  disabled={removeFromWhitelist.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

