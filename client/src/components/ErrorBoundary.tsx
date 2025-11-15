import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-b from-[#F5F1E8] via-[#FAF7F0] to-[#F5F1E8]">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-[#A6805B] mb-6 flex-shrink-0"
            />

            <h2 className="text-xl mb-4 text-[#A89968]" style={{
              textShadow: '0 1px 0 rgba(255, 255, 255, 0.5), 0 -1px 0 rgba(0, 0, 0, 0.1)'
            }}>Ein unerwarteter Fehler ist aufgetreten.</h2>

            <div className="p-4 w-full rounded bg-white border border-[#C9A961]/30 overflow-auto mb-6">
              <pre className="text-sm text-[#6B5D4F] whitespace-break-spaces">
                {this.state.error?.stack}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-transparent border-2 border-[#C9A961] text-[#A6805B]",
                "hover:bg-[#C9A961]/10 cursor-pointer"
              )}
            >
              <RotateCcw size={16} />
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
