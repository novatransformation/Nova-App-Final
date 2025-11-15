import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Download, Sparkles, Volume2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { jsPDF } from 'jspdf';

interface NewSelfManifestProps {
  sessionId: number;
  onContinue: () => void;
}

export default function NewSelfManifest({ sessionId, onContinue }: NewSelfManifestProps) {
  const [, setLocation] = useLocation();
  const [manifestText, setManifestText] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const generateManifestMutation = trpc.nova.generateNewSelfManifest.useMutation();
  const generateAudioMutation = trpc.nova.generateAudio.useMutation();

  useEffect(() => {
    // Generate manifest on mount
    generateManifestMutation.mutate(
      { sessionId },
      {
        onSuccess: (data) => {
          setManifestText(data.manifest);
          setIsGenerating(false);
        },
        onError: (error) => {
          console.error('Failed to generate manifest:', error);
          setManifestText('Fehler beim Generieren des Manifests. Bitte versuche es erneut.');
          setIsGenerating(false);
        }
      }
    );
  }, [sessionId]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Mein Neues Ich', pageWidth / 2, 30, { align: 'center' });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('Mein persönliches Manifest', pageWidth / 2, 40, { align: 'center' });

    // Content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(manifestText, maxWidth);
    let y = 60;
    
    lines.forEach((line: string) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 7;
    });

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Nova Transformations', pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.save('mein-neues-ich.pdf');
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    generateAudioMutation.mutate(
      {
        sessionId,
        type: 'new'
      },
      {
        onSuccess: (data) => {
          setAudioUrl(data.audioUrl);
          setIsGeneratingAudio(false);
        },
        onError: (error) => {
          console.error('Failed to generate audio:', error);
          alert('Fehler beim Generieren des Audios. Bitte versuche es erneut.');
          setIsGeneratingAudio(false);
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0a1f2a] to-[#1a3a4a]">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Sparkles className="w-16 h-16 mx-auto" style={{ color: '#A6805B' }} />
          <h1 
            className="text-4xl md:text-5xl font-bold"
            style={{ color: '#A6805B' }}
          >
            Dein Neues Ich
          </h1>
          <p className="text-lg" style={{ color: '#E8DCC8' }}>
            Dein persönliches Manifest der neuen Frequenz
          </p>
        </div>

        {/* Manifest Content */}
        {isGenerating ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#A6805B' }}></div>
            <p style={{ color: '#E8DCC8' }}>Dein Manifest wird erstellt...</p>
          </div>
        ) : (
          <div 
            className="p-8 rounded-lg border-2 bg-white/10"
            style={{ borderColor: '#A6805B' }}
          >
            <p 
              className="text-lg leading-relaxed whitespace-pre-line"
              style={{ color: '#E8DCC8' }}
            >
              {manifestText}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {!isGenerating && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownloadPDF}
              size="lg"
              className="flex items-center gap-2"
              style={{
                backgroundColor: '#A6805B',
                color: '#0a1f2a'
              }}
            >
              <Download className="w-5 h-5" />
              PDF herunterladen
            </Button>

            <Button
              onClick={handleGenerateAudio}
              disabled={isGeneratingAudio || !!audioUrl}
              size="lg"
              className="flex items-center gap-2"
              style={{
                backgroundColor: audioUrl ? '#6B7280' : '#A6805B',
                color: '#0a1f2a'
              }}
            >
              <Volume2 className="w-5 h-5" />
              {isGeneratingAudio ? 'Generiere Audio...' : audioUrl ? 'Audio generiert!' : 'Audio generieren'}
            </Button>

            {audioUrl && (
              <a href={audioUrl} download="mein-neues-ich.mp3">
                <Button
                  size="lg"
                  className="flex items-center gap-2"
                  style={{
                    backgroundColor: '#A6805B',
                    color: '#0a1f2a'
                  }}
                >
                  <Download className="w-5 h-5" />
                  Audio herunterladen
                </Button>
              </a>
            )}
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center pt-8">
          <Button
            onClick={onContinue}
            size="lg"
            className="px-12 py-6 text-xl"
            style={{
              backgroundColor: '#A6805B',
              color: '#0a1f2a'
            }}
          >
            Weiter
            <Sparkles className="w-6 h-6 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

