/**
 * Props for StepHeader component
 * @property {number} stepNumber - Current step number (1-9)
 * @property {string} stepName - Name/title of the current step (e.g., "Gedanken", "Gefühle")
 * @property {number} [totalSteps=9] - Total number of steps in the transformation process
 */
interface StepHeaderProps {
  stepNumber: number;
  stepName: string;
  totalSteps?: number;
}

/**
 * Header component displaying step progress and title
 * 
 * @purpose Shows users where they are in the 9-step transformation process.
 * Displays both the step number (e.g., "Schritt 3 von 9") and the step name.
 * Uses golden color (#A6805B) for progress indicator to match brand theme.
 * 
 * @props {StepHeaderProps} props - Component properties
 * @returns {JSX.Element} A centered header with step number and name
 * 
 * @example
 * ```tsx
 * <StepHeader 
 *   stepNumber={3} 
 *   stepName="Gefühle" 
 *   totalSteps={9} 
 * />
 * // Renders: "Schritt 3 von 9" + "Gefühle"
 * ```
 */
export function StepHeader({ stepNumber, stepName, totalSteps = 9 }: StepHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <div className="text-[#A6805B] text-sm font-medium tracking-wider uppercase">
        Schritt {stepNumber} von {totalSteps}
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        {stepName}
      </h2>
    </div>
  );
}

