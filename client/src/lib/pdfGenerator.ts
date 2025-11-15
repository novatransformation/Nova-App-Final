import { jsPDF } from 'jspdf';

/**
 * Generate Erkenntnis-Protokoll PDF (Old Frequency)
 */
export async function generateErkenntnisProtokollPDF(data: {
  themeName: string;
  alteGeschichte: string;
  glaubenssatz: string;
}): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  // Colors
  const goldColor = [212, 175, 55]; // #A6805B
  const darkTeal = [31, 78, 95]; // #1F4E5F
  const lightGray = [107, 93, 79]; // #6B5D4F
  
  let yPosition = margin;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Erkenntnis-Protokoll', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setFont('helvetica', 'italic');
  doc.text('Deine alte Frequenz', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Divider
  doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Theme
  doc.setFontSize(11);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Thema:', margin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(data.themeName, margin + 20, yPosition);
  yPosition += 10;

  // Date
  const today = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  doc.text('Datum:', margin, yPosition);
  doc.text(today, margin + 20, yPosition);
  yPosition += 15;

  // Section 1: Alte Geschichte
  doc.setFontSize(14);
  doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Deine alte Geschichte', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.setFont('helvetica', 'normal');
  
  // Split text into lines
  const alteGeschichteLines = doc.splitTextToSize(data.alteGeschichte, contentWidth);
  
  // Check if we need a new page
  alteGeschichteLines.forEach((line: string) => {
    if (yPosition > pageHeight - margin - 10) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += 5;
  });

  yPosition += 10;

  // Section 2: Glaubenssatz
  if (yPosition > pageHeight - margin - 40) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFontSize(14);
  doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Der zentrale Glaubenssatz', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.setFont('helvetica', 'italic');
  
  const glaubenssatzLines = doc.splitTextToSize(data.glaubenssatz, contentWidth);
  glaubenssatzLines.forEach((line: string) => {
    if (yPosition > pageHeight - margin - 10) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += 6;
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Erstellt mit Transformations-App',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text('🌸', pageWidth / 2, pageHeight - 5, { align: 'center' });
  }

  return doc.output('blob');
}

/**
 * Generate Transformations-Manifest PDF (New Frequency)
 */
export async function generateTransformationsManifestPDF(data: {
  themeName: string;
  neueFrequenz: string;
  commitment: string;
}): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  // Colors
  const goldColor = [212, 175, 55]; // #A6805B
  const brightGold = [244, 208, 63]; // #F4D03F
  const darkTeal = [31, 78, 95]; // #1F4E5F
  
  let yPosition = margin;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Transformations-Manifest', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(brightGold[0], brightGold[1], brightGold[2]);
  doc.setFont('helvetica', 'italic');
  doc.text('Deine neue Frequenz', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Divider
  doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Theme
  doc.setFontSize(11);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Thema:', margin, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(data.themeName, margin + 20, yPosition);
  yPosition += 10;

  // Date
  const today = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  doc.text('Datum:', margin, yPosition);
  doc.text(today, margin + 20, yPosition);
  yPosition += 15;

  // Section 1: Neue Frequenz
  doc.setFontSize(14);
  doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Deine neue Frequenz', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.setFont('helvetica', 'normal');
  
  // Split text into lines
  const neueFrequenzLines = doc.splitTextToSize(data.neueFrequenz, contentWidth);
  
  // Check if we need a new page
  neueFrequenzLines.forEach((line: string) => {
    if (yPosition > pageHeight - margin - 10) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += 5;
  });

  yPosition += 10;

  // Section 2: Commitment
  if (yPosition > pageHeight - margin - 40) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFontSize(14);
  doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Dein Commitment', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.setFont('helvetica', 'italic');
  
  const commitmentLines = doc.splitTextToSize(data.commitment, contentWidth);
  commitmentLines.forEach((line: string) => {
    if (yPosition > pageHeight - margin - 10) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += 6;
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Erstellt mit Transformations-App',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text('✨', pageWidth / 2, pageHeight - 5, { align: 'center' });
  }

  return doc.output('blob');
}

/**
 * Download PDF blob as file
 */
export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

