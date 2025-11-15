import { useLocation } from "wouter";
import Onboarding from "../components/Onboarding";

export default function Tutorial() {
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    // After tutorial, go back to home
    setLocation("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#183847] to-[#0a1f2a] flex items-center justify-center p-4">
      <Onboarding onComplete={handleComplete} />
    </div>
  );
}

