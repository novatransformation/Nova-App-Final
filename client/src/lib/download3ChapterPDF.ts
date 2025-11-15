import { toast } from 'sonner';

/**
 * Download 3-Chapter Transformation PDF
 * Kapitel 1: Was war (Altes Ich)
 * Kapitel 2: Die Heilung (Liebes-Stimme)
 * Kapitel 3: Was kommt (Neues Ich)
 */
export async function download3ChapterPDF(sessionData: any) {
  try {
    const steps = sessionData.steps;
    const themeName = sessionData.themeName || 'Persönliche Transformation';
    const mirrorText = sessionData.mirrorText || '';
    const healingText = sessionData.healingText || '';

    // Helper to get step text
    const getStepText = (stepNumber: number): string => {
      const step = steps.find((s: any) => s.stepNumber === stepNumber);
      return step?.userInput || '';
    };

    // Kapitel 1: Was war (Steps 1-5)
    const step1 = getStepText(1);
    const step2 = getStepText(2);
    const step3 = getStepText(3);
    const step4 = getStepText(4);
    const step5 = getStepText(5);

    const wasWar = mirrorText || `
Meine Gedanken: ${step1}

Meine Emotionen: ${step2}

Meine Körperempfindungen: ${step3}

Meine Handlungen: ${step4}

Die Wirkung in meinem Leben: ${step5}
    `.trim();

    // Kapitel 2: Die Heilung (from backend)
    const dieHeilung = healingText || 'Die Heilung wird generiert...';

    // Kapitel 3: Was kommt (Steps 9-13)
    const step9 = getStepText(9);
    const step10 = getStepText(10);
    const step11 = getStepText(11);
    const step12 = getStepText(12);
    const step13 = getStepText(13);

    const wasKommt = `
Meine neuen Gedanken: ${step9}

Meine neuen Emotionen: ${step10}

Meine neuen Körperempfindungen: ${step11}

Meine neuen Handlungen: ${step12}

Mein Commitment: ${step13}
    `.trim();

    // Generate 3-Chapter PDF
    const pdfBlob = await generate3ChapterPDF({
      themeName,
      wasWar,
      dieHeilung,
      wasKommt
    });

    // Download
    const filename = `Deine-Transformation_${new Date().toISOString().split('T')[0]}.pdf`;
    downloadPDF(pdfBlob, filename);

    toast.success('PDF erfolgreich heruntergeladen!');
    
  } catch (error: any) {
    console.error('3-Chapter PDF generation error:', error);
    toast.error(`PDF-Erstellung fehlgeschlagen: ${error.message}`);
    throw error;
  }
}

/**
 * Generate 3-Chapter PDF using jsPDF
 */
async function generate3ChapterPDF(data: {
  themeName: string;
  wasWar: string;
  dieHeilung: string;
  wasKommt: string;
}): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Helper: Add text with word wrap
  const addText = (text: string, fontSize: number, color: string, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    if (isBold) doc.setFont('helvetica', 'bold');
    else doc.setFont('helvetica', 'normal');

    const lines = doc.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string) => {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += fontSize * 0.5;
    });
  };

  // Helper: Add spacing
  const addSpacing = (space: number) => {
    yPos += space;
    if (yPos > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
  };

  // === COVER PAGE ===
  doc.setFillColor(24, 56, 71); // Petrol
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(212, 175, 55); // Gold
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('Deine Transformation', pageWidth / 2, pageHeight / 3, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(245, 241, 232); // Creme
  doc.text(data.themeName, pageWidth / 2, pageHeight / 2, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(232, 220, 200); // Beige
  doc.text('Nova Transformations', pageWidth / 2, pageHeight - 30, { align: 'center' });

  // === KAPITEL 1: WAS WAR ===
  doc.addPage();
  yPos = margin;

  addText('Kapitel 1', 24, '#A6805B', true);
  addSpacing(5);
  addText('Was war', 32, '#A6805B', true);
  addSpacing(15);
  
  addText(data.wasWar, 11, '#E8DCC8');
  addSpacing(20);

  // === KAPITEL 2: DIE HEILUNG ===
  doc.addPage();
  yPos = margin;

  addText('Kapitel 2', 24, '#A6805B', true);
  addSpacing(5);
  addText('Die Heilung', 32, '#A6805B', true);
  addSpacing(15);
  
  addText(data.dieHeilung, 11, '#E8DCC8');
  addSpacing(20);

  // === KAPITEL 3: WAS KOMMT ===
  doc.addPage();
  yPos = margin;

  addText('Kapitel 3', 24, '#A6805B', true);
  addSpacing(5);
  addText('Was kommt', 32, '#A6805B', true);
  addSpacing(15);
  
  addText(data.wasKommt, 11, '#E8DCC8');

  return doc.output('blob');
}

/**
 * Download PDF blob
 */
function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

