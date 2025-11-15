import { 
  generateErkenntnisProtokollPDF, 
  generateTransformationsManifestPDF,
  downloadPDF 
} from './pdfGenerator';
import { toast } from 'sonner';

/**
 * Download Erkenntnis-Protokoll PDF (Old Frequency)
 */
export async function downloadErkenntnisProtokoll(sessionData: any) {
  try {
    const steps = sessionData.steps;
    const themeName = sessionData.themeName || 'Persönliche Transformation';

    // Helper to get step text
    const getStepText = (stepNumber: number): string => {
      const step = steps.find((s: any) => s.stepNumber === stepNumber);
      return step?.userInput || '';
    };

    const step1 = getStepText(1);
    const step2 = getStepText(2);
    const step3 = getStepText(3);
    const step4 = getStepText(4);
    const step5 = getStepText(5);

    // For now, use step content directly as "alte Geschichte"
    // In future, we can call LLM here if needed
    const alteGeschichte = `
Meine Gedanken: ${step1}

Meine Emotionen: ${step2}

Meine Körperempfindungen: ${step3}

Meine Handlungen: ${step4}

Die Wirkung in meinem Leben: ${step5}
    `.trim();

    const glaubenssatz = step5;

    // Generate PDF
    const pdfBlob = await generateErkenntnisProtokollPDF({
      themeName,
      alteGeschichte,
      glaubenssatz
    });

    // Download
    const filename = `Erkenntnis-Protokoll_${new Date().toISOString().split('T')[0]}.pdf`;
    downloadPDF(pdfBlob, filename);

    toast.success('PDF erfolgreich heruntergeladen!');
    
  } catch (error: any) {
    console.error('PDF generation error:', error);
    toast.error(`PDF-Erstellung fehlgeschlagen: ${error.message}`);
    throw error;
  }
}

/**
 * Download Transformations-Manifest PDF (New Frequency)
 */
export async function downloadTransformationsManifest(sessionData: any) {
  try {
    const steps = sessionData.steps;
    const themeName = sessionData.themeName || 'Persönliche Transformation';

    // Helper to get step text
    const getStepText = (stepNumber: number): string => {
      const step = steps.find((s: any) => s.stepNumber === stepNumber);
      return step?.userInput || '';
    };

    const step9 = getStepText(9);
    const step10 = getStepText(10);
    const step11 = getStepText(11);
    const step12 = getStepText(12);
    const step13 = getStepText(13);

    // For now, use step content directly as "neue Frequenz"
    // In future, we can call LLM here if needed
    const neueFrequenz = `
Meine neuen Gedanken: ${step9}

Meine neuen Emotionen: ${step10}

Meine neuen Körperempfindungen: ${step11}

Meine neuen Handlungen: ${step12}
    `.trim();

    const commitment = step13;

    // Generate PDF
    const pdfBlob = await generateTransformationsManifestPDF({
      themeName,
      neueFrequenz,
      commitment
    });

    // Download
    const filename = `Transformations-Manifest_${new Date().toISOString().split('T')[0]}.pdf`;
    downloadPDF(pdfBlob, filename);

    toast.success('PDF erfolgreich heruntergeladen!');
    
  } catch (error: any) {
    console.error('PDF generation error:', error);
    toast.error(`PDF-Erstellung fehlgeschlagen: ${error.message}`);
    throw error;
  }
}

