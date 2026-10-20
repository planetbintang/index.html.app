import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Login() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground">AI Search</h1>
          <p className="text-lg text-foreground/60">
            Intelligent query processing powered by LLM
          </p>
        </div>

        {/* Login card */}
        <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Welcome Back
            </h2>
            <p className="text-foreground/60">
              Sign in to access your search assistant
            </p>
          </div>

          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            className="w-full search-button py-6 text-lg"
          >
            Sign in with Manus
          </Button>

          {/* Features list */}
          <div className="space-y-3 pt-4 border-t border-border">
            <p className="text-sm text-foreground/70 font-medium">Features:</p>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Real-time query processing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Advanced regex indexing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Search history management
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                LLM-powered responses
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-foreground/40">
          Secure authentication powered by Manus OAuth
        </p>
      </div>
    </div>
  );
}
