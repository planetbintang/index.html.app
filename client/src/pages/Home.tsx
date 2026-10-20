import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Search, Trash2, Clock, Terminal } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import { useLocation } from "wouter";
import TemplateModePanel from "@/components/TemplateModePanel";

interface SearchResult {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
}

interface SearchHistory {
  query: string;
  timestamp: Date;
}

/** Deteksi apakah query memicu template mode */
function isTemplateModeQuery(q: string): boolean {
  return q.toLowerCase().startsWith("utama");
}

export default function Home() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [templateMode, setTemplateMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // tRPC mutation
  const searchMutation = trpc.search.query.useMutation();

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(
          parsed.map((item: { query: string; timestamp: string }) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }))
        );
      } catch (e) {
        console.error("Failed to load search history:", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }, [history]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Deteksi template mode saat query berubah
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (isTemplateModeQuery(value)) {
      setTemplateMode(true);
      setShowHistory(false);
    } else {
      setTemplateMode(false);
    }
  }, []);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return;
      if (isTemplateModeQuery(searchQuery)) return; // jangan submit template mode

      setShowHistory(false);
      setTemplateMode(false);

      searchMutation.mutate(
        { query: searchQuery },
        {
          onSuccess: (data) => {
            setHistory((prev) => [
              { query: searchQuery, timestamp: new Date() },
              ...prev.slice(0, 49),
            ]);
            setResults((prev) => [
              {
                id: Date.now().toString(),
                query: searchQuery,
                response: data.response,
                timestamp: data.timestamp,
              },
              ...prev,
            ]);
            setQuery("");
          },
          onError: (error) => {
            setResults((prev) => [
              {
                id: Date.now().toString(),
                query: searchQuery,
                response: `Error: ${error.message || "Search failed"}`,
                timestamp: new Date(),
              },
              ...prev,
            ]);
          },
        }
      );
    },
    [searchMutation]
  );

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const closeTemplateMode = useCallback(() => {
    setTemplateMode(false);
    setQuery("");
    inputRef.current?.focus();
  }, []);

  if (authLoading) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="gradient-bg min-h-screen flex flex-col">
      {/* ── Main hero ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        {/* Header */}
        <div className="w-full max-w-2xl mb-12">
          <div className="flex flex-col">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                AI Search
              </h1>
              <p className="text-lg md:text-xl text-foreground/60 mt-2">
                Intelligent query processing
              </p>
            </div>
            <div className="flex justify-end mb-8">
              <p className="text-sm md:text-base text-foreground/50 max-w-xs text-right">
                Powered by advanced LLM technology for real-time insights
              </p>
            </div>
          </div>
        </div>

        {/* ── Search interface ──────────────────────────────────────── */}
        <div className="w-full max-w-2xl space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              {/* Kolom pencarian */}
              <Input
                ref={inputRef}
                type="text"
                placeholder='Ketik query atau "utama" untuk direktori sistem...'
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !searchMutation.isPending) {
                    handleSearch(query);
                  }
                  if (e.key === "Escape") {
                    setTemplateMode(false);
                    setShowHistory(false);
                  }
                }}
                onFocus={() => {
                  if (isTemplateModeQuery(query)) {
                    setTemplateMode(true);
                  } else if (history.length > 0) {
                    setShowHistory(true);
                  }
                }}
                className={`search-input transition-all duration-300 ${
                  templateMode
                    ? "border-primary/70 ring-2 ring-primary/20 shadow-lg shadow-primary/10"
                    : ""
                }`}
                disabled={searchMutation.isPending}
              />

              {/* Indikator template mode */}
              {templateMode && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-mono text-primary/80 font-semibold">
                    utama://
                  </span>
                </div>
              )}

              {/* TemplateModePanel */}
              {templateMode && (
                <TemplateModePanel
                  onClose={closeTemplateMode}
                  onSelectQuery={(q) => {
                    setQuery(q);
                    setTemplateMode(false);
                    inputRef.current?.focus();
                  }}
                />
              )}

              {/* History dropdown (hanya tampil jika bukan template mode) */}
              {!templateMode && showHistory && history.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {history.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleHistoryClick(item.query)}
                        className="history-item flex items-center gap-2"
                      >
                        <Clock className="w-3 h-3 text-accent/60" />
                        <span className="flex-1 truncate">{item.query}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => handleSearch(query)}
              disabled={
                searchMutation.isPending ||
                !query.trim() ||
                isTemplateModeQuery(query)
              }
              className="search-button"
            >
              {searchMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span className="hidden sm:inline ml-2">Search</span>
            </Button>
          </div>

          {/* Hint template mode */}
          {!templateMode && (
            <p className="text-xs text-foreground/30 text-right font-mono">
              Ketik{" "}
              <button
                onClick={() => {
                  setQuery("utama");
                  setTemplateMode(true);
                  inputRef.current?.focus();
                }}
                className="text-accent/60 hover:text-accent transition-colors cursor-pointer underline-offset-2 hover:underline"
              >
                utama
              </button>{" "}
              untuk membuka direktori sistem
            </p>
          )}

          {/* Control buttons */}
          {(results.length > 0 || history.length > 0) && (
            <div className="flex gap-2 justify-end">
              {results.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResults([])}
                  className="text-xs"
                >
                  Clear Results
                </Button>
              )}
              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem("searchHistory");
                  }}
                  className="text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear History
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Results section ───────────────────────────────────────────── */}
      {results.length > 0 && (
        <div className="w-full max-w-4xl mx-auto px-4 pb-12 relative z-10">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Search Results
          </h2>
          <div className="results-container">
            {results.map((result) => (
              <Card
                key={result.id}
                className="result-item fade-in p-6 bg-card/50 backdrop-blur-sm border border-border"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-accent mb-2">
                    Query: {result.query}
                  </h3>
                  <p className="text-xs text-foreground/50">
                    {result.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="prose prose-invert max-w-none">
                  <Streamdown>{result.response}</Streamdown>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {results.length === 0 && !searchMutation.isPending && (
        <div className="flex-1 flex items-center justify-center px-4 relative z-10">
          <div className="text-center">
            <Search className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
            <p className="text-foreground/40 text-lg">
              Start searching to see results
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
