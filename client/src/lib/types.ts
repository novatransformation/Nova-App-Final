/**
 * Central Type Definitions - Single Source of Truth
 * 
 * This file contains all shared type definitions used across the application.
 * Component-specific props remain in their respective component files.
 */

// ============================================================================
// Theme Types
// ============================================================================

export type Theme = "light" | "dark";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

// ============================================================================
// Quote Types
// ============================================================================

export type QuoteCategory = 'analyzing' | 'manifest' | 'pdf' | 'audio' | 'general';

export interface Quote {
  text: string;
  category: QuoteCategory;
  author?: string;
}

// ============================================================================
// PDF Types
// ============================================================================

export type PDFType = 'erkenntnis' | 'manifest';
export type PDFStatus = 'idle' | 'starting' | 'processing' | 'ready' | 'error';

// ============================================================================
// Auth Types
// ============================================================================

export type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

