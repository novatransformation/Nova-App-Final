import { ReactNode } from "react";

/**
 * Props for StepCard component
 * @property {ReactNode} children - Content to be rendered inside the card
 * @property {string} [className] - Optional additional CSS classes for customization
 */
interface StepCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable card component for transformation step content
 * 
 * @purpose Provides consistent visual styling for step content cards.
 * Creates a glassmorphism effect with golden border (#A6805B) and backdrop blur.
 * Max width is set to 4xl (896px) for optimal readability.
 * 
 * @props {StepCardProps} props - Component properties
 * @returns {JSX.Element} A styled card container with glassmorphism effect
 * 
 * @example
 * ```tsx
 * <StepCard>
 *   <StepHeader stepNumber={1} stepName="Gedanken" />
 *   <p>Step content goes here</p>
 * </StepCard>
 * ```
 */
export function StepCard({ children, className = "" }: StepCardProps) {
  return (
    <div className={`w-full max-w-4xl space-y-6 p-8 rounded-2xl border-2 border-[#A6805B]/40 bg-gradient-to-br from-[#A6805B]/10 to-[#A6805B]/5 backdrop-blur-sm shadow-2xl shadow-[#A6805B]/20 ${className}`}>
      {children}
    </div>
  );
}

