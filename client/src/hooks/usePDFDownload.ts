import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import type { PDFType, PDFStatus } from '@/lib/types';

/**
 * Loading messages displayed during PDF generation
 * Cycles through these messages every 4 seconds to keep user engaged
 */
const LOADING_MESSAGES = [
  "Sammle deine Erkenntnisse...",
  "Die KI webt deine Geschichte...",
  "Formatiere dein Protokoll...",
  "Fast fertig..."
];

/**
 * Custom hook for managing PDF download workflow
 * 
 * @purpose Handles the entire PDF generation and download process:
 * 1. Starts a background job on the server
 * 2. Polls job status every 3 seconds
 * 3. Displays rotating loading messages
 * 4. Provides download function when ready
 * 
 * @param {number} sessionId - ID of the transformation session
 * @param {PDFType} type - Type of PDF to generate ('erkenntnis' | 'manifest')
 * 
 * @returns {Object} PDF download state and controls
 * @returns {PDFStatus} status - Current status: 'idle' | 'starting' | 'processing' | 'ready' | 'error'
 * @returns {string} loadingMessage - Current loading message to display
 * @returns {Function} startDownload - Function to initiate PDF generation
 * @returns {Function} downloadPDF - Function to download the generated PDF
 * @returns {string | null} pdfUrl - URL of the generated PDF (null until ready)
 * 
 * @example
 * ```tsx
 * const { status, loadingMessage, startDownload, downloadPDF } = usePDFDownload(123, 'erkenntnis');
 * 
 * if (status === 'idle') {
 *   return <button onClick={startDownload}>Generate PDF</button>;
 * }
 * if (status === 'processing') {
 *   return <div>{loadingMessage}</div>;
 * }
 * if (status === 'ready') {
 *   return <button onClick={downloadPDF}>Download PDF</button>;
 * }
 * ```
 */
export function usePDFDownload(sessionId: number, type: PDFType) {
  const [status, setStatus] = useState<PDFStatus>('idle');
  const [jobId, setJobId] = useState<number | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  const startJobMutation = trpc.nova.startPDFJob.useMutation();
  const { data: jobStatus } = trpc.nova.getPDFJobStatus.useQuery(
    { jobId: jobId! },
    { 
      enabled: jobId !== null && status === 'processing',
      // Poll every 3 seconds - balance between responsiveness and server load
      // PDF generation typically takes 10-30 seconds, so 3s polling is optimal
      refetchInterval: 3000
    }
  );

  // Cycle through loading messages
  useEffect(() => {
    if (status === 'processing') {
      const interval = setInterval(() => {
        setMessageIndex((prev) => {
          const next = (prev + 1) % LOADING_MESSAGES.length;
          setLoadingMessage(LOADING_MESSAGES[next]);
          return next;
        });
      }, 4000); // Change message every 4 seconds to keep user engaged during wait

      return () => clearInterval(interval);
    }
  }, [status]);

  // Check job status
  useEffect(() => {
    if (!jobStatus) return;

    if (jobStatus.status === 'completed' && jobStatus.pdfUrl) {
      setStatus('ready');
      setPdfUrl(jobStatus.pdfUrl);
      toast.success('PDF ist bereit zum Download!');
    } else if (jobStatus.status === 'failed') {
      setStatus('error');
      toast.error(jobStatus.error || 'PDF-Erstellung fehlgeschlagen.');
    }
  }, [jobStatus]);

  const startDownload = async () => {
    try {
      setStatus('starting');
      setMessageIndex(0);
      setLoadingMessage(LOADING_MESSAGES[0]);
      
      const result = await startJobMutation.mutateAsync({ sessionId, type });
      setJobId(result.jobId);
      setStatus('processing');
    } catch (error) {
      console.error('Failed to start PDF job:', error);
      setStatus('error');
      toast.error('PDF-Erstellung konnte nicht gestartet werden.');
    }
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
      toast.success('PDF wird heruntergeladen...');
    }
  };

  const reset = () => {
    setStatus('idle');
    setJobId(null);
    setPdfUrl(null);
    setMessageIndex(0);
    setLoadingMessage(LOADING_MESSAGES[0]);
  };

  return {
    status,
    loadingMessage,
    pdfUrl,
    startDownload,
    downloadPDF,
    reset
  };
}

