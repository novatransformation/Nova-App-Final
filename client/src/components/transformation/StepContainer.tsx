import { ReactNode } from "react";

/**
 * Props for StepContainer component
 * @property {ReactNode} children - Content to be rendered inside the container
 * @property {string} [className] - Optional additional CSS classes for customization
 */
interface StepContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable container component for transformation step screens
 * 
 * @purpose Provides consistent visual styling and layout for all transformation steps.
 * Creates a full-screen gradient background with centered content and fade-in animation.
 * 
 * @props {StepContainerProps} props - Component properties
 * @returns {JSX.Element} A full-screen container with gradient background
 * 
 * @example
 * ```tsx
 * <StepContainer>
 *   <StepCard>
 *     <h1>Step Content</h1>
 *   </StepCard>
 * </StepContainer>
 * ```
 */
export function StepContainer({ children, className = "" }: StepContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#183847] to-[#2C5F6F] flex items-center justify-center p-6 animate-in fade-in duration-1000 ${className}`}>
      {children}
    </div>
  );
}

