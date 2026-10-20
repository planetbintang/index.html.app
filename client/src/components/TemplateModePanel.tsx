/**
 * TemplateModePanel — sistem direktori utama://
 *
 * Struktur:
 *   /                         → direktori inti (root)
 *   /utama/                   → folder utama
 *     index.utama             → viewer kode tampilan + style + fungsi
 *   /rgx/                     → folder regex
 *     teks.rgx                → pola A-Z dan a-z
 *     angka.rgx               → pola 0-9
 *     simbol.rgx              → pola simbol
 *     komponen.rgx            → pola bit, byte, ekstensi, bahasa, pattern
 */

import { useState, useEffect, useRef } from "react";
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  ChevronRight,
  ChevronDown,
  X,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  MoveRight,
  Eye,
  Code2,
  Layers,
  Hash,
  Type,
  Cpu,
  AtSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Tipe Data ────────────────────────────────────────────────────────────────

type RgxDocType = "teks" | "angka" | "simbol" | "komponen";

type ActiveView =
  | { type: "root" }
  | { type: "utama-index"; section?: number }
  | { type: "rgx-list" }
  | { type: "rgx-file"; fileId: string };

interface RgxFile {
  id: string;
  name: string;
  path: string;
  docType: RgxDocType;
  content: string;
}

// ─── Konten /utama/index.utama ────────────────────────────────────────────────

const INDEX_SECTIONS = [
  {
    id: "tampilan",
    label: "Tampilan",
    icon: <Layers className="w-3.5 h-3.5" />,
    lang: "tsx",
    content: `// /utama/index.utama — Tampilan (HTML/JSX)
// Komponen kolom pencarian utama + template mode

export const SearchBar = ({ query, onChange, onSearch, isPending }) => (
  <div className="w-full max-w-2xl space-y-4">
    <div className="flex gap-3">
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder='Ketik query atau "utama" untuk direktori...'
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(query)}
          className="search-input"
          disabled={isPending}
        />
        {/* TemplateModePanel muncul saat query dimulai dengan 'utama' */}
        {query.toLowerCase().startsWith("utama") && (
          <TemplateModePanel onClose={() => onChange("")} />
        )}
      </div>
      <Button
        onClick={() => onSearch(query)}
        disabled={isPending || !query.trim()}
        className="search-button"
      >
        <Search className="w-5 h-5" />
        <span className="ml-2">Search</span>
      </Button>
    </div>
    {/* Hint template mode */}
    <p className="text-xs text-foreground/30 text-right font-mono">
      Ketik <span className="text-accent">utama</span> untuk direktori sistem
    </p>
  </div>
);

export const ResultCard = ({ result }) => (
  <Card className="result-item p-6 bg-card/50 backdrop-blur-sm border border-border">
    <h3 className="text-lg font-semibold text-accent mb-2">
      Query: {result.query}
    </h3>
    <p className="text-xs text-foreground/50 mb-4">
      {result.timestamp.toLocaleString()}
    </p>
    <div className="prose prose-invert max-w-none">
      <Streamdown>{result.response}</Streamdown>
    </div>
  </Card>
);`,
  },
  {
    id: "style",
    label: "Style",
    icon: <Code2 className="w-3.5 h-3.5" />,
    lang: "css",
    content: `/* /utama/index.utama — Style (CSS/Tailwind) */

/* Latar belakang gradien ungu → teal */
.gradient-bg {
  background: linear-gradient(
    135deg,
    oklch(0.15 0.08 280) 0%,
    oklch(0.25 0.15 280) 25%,
    oklch(0.20 0.12 260) 50%,
    oklch(0.18 0.10 240) 75%,
    oklch(0.22 0.14 180) 100%
  );
  position: relative;
  overflow: hidden;
}

/* Efek radial ambient */
.gradient-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, oklch(0.30 0.20 280 / 0.10) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, oklch(0.40 0.25 180 / 0.08) 0%, transparent 50%);
  pointer-events: none;
}

/* Kolom pencarian dengan border teal */
.search-input {
  @apply w-full px-6 py-4
    bg-background/50 backdrop-blur-md
    border-2 border-accent/40 rounded-xl
    text-foreground placeholder-foreground/40
    focus:outline-none focus:border-accent
    focus:ring-2 focus:ring-accent/30
    transition-all duration-300;
}

/* Tombol cari dengan gradien */
.search-button {
  @apply px-8 py-4
    bg-gradient-to-r from-primary to-accent
    text-primary-foreground font-semibold rounded-xl
    hover:shadow-lg hover:shadow-accent/30
    active:scale-95 transition-all duration-200;
}

/* Panel template mode */
.template-panel {
  background: oklch(0.18 0.07 280 / 0.97);
  backdrop-filter: blur(20px) saturate(1.5);
  border: 1px solid oklch(0.60 0.25 180 / 0.25);
  border-radius: 0.85rem;
  box-shadow:
    0 8px 32px oklch(0.10 0.05 280 / 0.60),
    0 0 0 1px oklch(0.60 0.25 180 / 0.08),
    inset 0 1px 0 oklch(1 0 0 / 0.05);
}`,
  },
  {
    id: "fungsi",
    label: "Fungsi",
    icon: <FileCode className="w-3.5 h-3.5" />,
    lang: "typescript",
    content: `// /utama/index.utama — Fungsi (TypeScript)

/** Deteksi apakah query memicu template mode */
export function isTemplateModeQuery(query: string): boolean {
  return query.toLowerCase().startsWith("utama");
}

/** Parse protokol utama:// dari query */
export function parseUtamaProtocol(query: string): {
  protocol: string; path: string; params: Record<string, string>;
} {
  const match = query.match(/^utama:\\/\\/([^?]*)?(?:\\?(.*))?$/i);
  if (!match) return { protocol: "utama", path: "/", params: {} };
  const path = match[1] || "/";
  const params: Record<string, string> = {};
  if (match[2]) {
    match[2].split("&").forEach((p) => {
      const [k, v] = p.split("=");
      if (k) params[k] = v || "";
    });
  }
  return { protocol: "utama", path, params };
}

/** Navigasi ke path direktori */
export function navigateTo(path: string): ActiveView {
  if (path === "/" || path === "") return { type: "root" };
  if (path.startsWith("/utama")) return { type: "utama-index" };
  if (path.startsWith("/rgx")) return { type: "rgx-list" };
  return { type: "root" };
}

/** Proses query dengan regex indexing + LLM */
export async function processSearchQuery(
  query: string,
  patterns: RegexIndex
): Promise<string> {
  const context = extractQueryContext(query, patterns);
  return await invokeLLM(query, context);
}

/** Analisis query dengan semua pola regex */
export function analyzeQuery(query: string): RegexMatch[] {
  return DEFAULT_REGEX_PATTERNS
    .flatMap((doc) => doc.patterns)
    .filter((p) => new RegExp(p.pattern, "g").test(query))
    .map((p) => ({ pattern: p.pattern, description: p.description }));
}`,
  },
];

// ─── File Regex Default (/rgx/) ───────────────────────────────────────────────

const DEFAULT_RGX_FILES: RgxFile[] = [
  {
    id: "teks",
    name: "teks.rgx",
    path: "/rgx/teks.rgx",
    docType: "teks",
    content: `[A-Z]|Huruf kapital A-Z
[a-z]|Huruf kecil a-z
[A-Za-z]|Semua huruf (kapital dan kecil)
\\b[A-Z][a-z]+\\b|Kata diawali huruf kapital
\\b[A-Z]+\\b|Kata seluruhnya kapital
\\b[a-z]+\\b|Kata seluruhnya kecil
[A-Z][a-z]*(?:[A-Z][a-z]*)*|Pola CamelCase
^[A-Z]|String dimulai huruf kapital
[a-z]$|String diakhiri huruf kecil
[A-Za-z]{2,}|Kata dengan 2+ huruf
[A-Za-z]{5,}|Kata dengan 5+ huruf
^[a-z]+$|Seluruh string huruf kecil
^[A-Z]+$|Seluruh string huruf kapital
[A-Z]{2,}(?=[A-Z][a-z]|\\b|_)|Akronim (singkatan)
(?<=[a-z])(?=[A-Z])|Batas CamelCase`,
  },
  {
    id: "angka",
    name: "angka.rgx",
    path: "/rgx/angka.rgx",
    docType: "angka",
    content: `[0-9]|Satu digit 0-9
\\d|Shorthand digit
[0-9]{2,}|Beberapa digit berurutan
\\d{3}|Tepat 3 digit
\\d{1,3}|1 sampai 3 digit
^\\d+$|Seluruh string angka saja
\\b\\d+\\b|Bilangan bulat
\\d+\\.\\d+|Bilangan desimal
^[0-9]+$|Seluruh string numerik
[0-9]{4}|4 digit (tahun)
[0-9]{2}:[0-9]{2}|Format waktu HH:MM
[0-9]{1,2}/[0-9]{1,2}/[0-9]{2,4}|Format tanggal
(?:0|[1-9]\\d?)|Angka 0-99
[1-9][0-9]*|Bilangan bulat positif
-?\\d+|Bilangan bulat dengan tanda`,
  },
  {
    id: "simbol",
    name: "simbol.rgx",
    path: "/rgx/simbol.rgx",
    docType: "simbol",
    content: `[!@#$%^&*()_+\\-=\\[\\]{};:'",.<>?/\\\\|\`~]|Semua simbol umum
[!?.]|Tanda baca
[()\\[\\]{}]|Kurung dan tanda kurung kurawal
[+\\-*/=]|Operator matematika
[<>!=]|Operator perbandingan
[&|^~]|Operator bitwise
[;:,.]|Pemisah (separator)
[@#$%]|Karakter khusus
['\\"]|Tanda kutip
[\\s]|Spasi dan whitespace
[\\t\\n\\r]|Karakter whitespace (tab, newline)
[_-]|Underscore dan tanda hubung
[/\\\\]|Garis miring (slash)
[*+?]|Kuantifier regex
[|()]|Alternasi dan pengelompokan regex`,
  },
  {
    id: "komponen",
    name: "komponen.rgx",
    path: "/rgx/komponen.rgx",
    docType: "komponen",
    content: `\\b[01]{8}\\b|Byte biner (8 bit)
\\b[01]{16}\\b|Word biner (16 bit)
\\b[01]{32}\\b|Dword biner (32 bit)
0[bB][01]+|Literal biner (0b...)
\\.(js|ts|jsx|tsx)$|File JavaScript/TypeScript
\\.(jpg|jpeg|png|gif|webp|svg)$|File gambar
\\.(pdf|doc|docx|txt|md)$|File dokumen
\\.(mp3|wav|flac|aac|ogg)$|File audio
\\.(mp4|avi|mov|mkv|webm)$|File video
\\.(zip|rar|7z|tar|gz|bz2)$|File arsip
\\b(byte|bit|nibble|word|dword|qword)\\b|Satuan biner
\\b(function|class|const|let|var|type)\\b|Kata kunci kode
\\b(import|export|require|module|package)\\b|Kata kunci modul
\\b(async|await|Promise|callback|then)\\b|Pola asinkron
\\b(true|false|null|undefined|NaN|Infinity)\\b|Nilai boolean/null`,
  },
];

// ─── Warna dan ikon per tipe ──────────────────────────────────────────────────

const DOC_META: Record<RgxDocType, { color: string; badge: string; icon: React.ReactNode; label: string }> = {
  teks:      { color: "text-violet-400", badge: "A-Z", icon: <Type className="w-4 h-4 text-violet-400" />, label: "Teks" },
  angka:     { color: "text-teal-400",   badge: "0-9", icon: <Hash className="w-4 h-4 text-teal-400" />,   label: "Angka" },
  simbol:    { color: "text-amber-400",  badge: "SYM", icon: <AtSign className="w-4 h-4 text-amber-400" />, label: "Simbol" },
  komponen:  { color: "text-blue-400",   badge: "BIN", icon: <Cpu className="w-4 h-4 text-blue-400" />,    label: "Komponen" },
};

// ─── Komponen Utama ───────────────────────────────────────────────────────────

interface TemplateModeProps {
  onClose: () => void;
  onSelectQuery?: (q: string) => void;
}

export default function TemplateModePanel({ onClose, onSelectQuery }: TemplateModeProps) {
  const [view, setView] = useState<ActiveView>({ type: "root" });
  const [rgxFiles, setRgxFiles] = useState<RgxFile[]>(DEFAULT_RGX_FILES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editName, setEditName] = useState("");
  const [moveTarget, setMoveTarget] = useState("");
  const [showMoveId, setShowMoveId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [newFileName, setNewFileName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
  // Expand state untuk folder di root
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    utama: true,
    rgx: true,
  });
  const panelRef = useRef<HTMLDivElement>(null);

  // Tutup panel ketika klik di luar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const toggleFolder = (name: string) =>
    setExpandedFolders((prev) => ({ ...prev, [name]: !prev[name] }));

  // ── Breadcrumb ───────────────────────────────────────────────────────────

  const getBreadcrumb = (): string[] => {
    if (view.type === "root") return ["utama://", "/"];
    if (view.type === "utama-index") return ["utama://", "/", "utama", "index.utama"];
    if (view.type === "rgx-list") return ["utama://", "/", "rgx"];
    if (view.type === "rgx-file") {
      const f = rgxFiles.find((x) => x.id === view.fileId);
      return ["utama://", "/", "rgx", f?.name ?? ""];
    }
    return ["utama://", "/"];
  };

  // ── Render Root ──────────────────────────────────────────────────────────

  const renderRoot = () => (
    <div className="p-2 space-y-0.5">
      <div className="px-3 py-1.5 text-xs text-accent/60 font-mono font-semibold tracking-widest uppercase">
        / — direktori inti
      </div>

      {/* ── Folder /utama/ ── */}
      <div>
        <button
          onClick={() => toggleFolder("utama")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors group text-left"
        >
          {expandedFolders.utama
            ? <FolderOpen className="w-4 h-4 text-accent shrink-0" />
            : <Folder className="w-4 h-4 text-accent shrink-0" />}
          <span className="font-mono text-sm text-foreground flex-1">utama/</span>
          {expandedFolders.utama
            ? <ChevronDown className="w-3.5 h-3.5 text-foreground/30" />
            : <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />}
        </button>

        {/* File di dalam /utama/ */}
        {expandedFolders.utama && (
          <div className="ml-5 border-l border-border/30 pl-2 mt-0.5 space-y-0.5">
            <button
              onClick={() => setView({ type: "utama-index", section: 0 })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors group text-left"
            >
              <FileCode className="w-3.5 h-3.5 text-accent/70 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-mono text-sm text-accent">index.utama</span>
                <p className="text-xs text-foreground/40 mt-0.5">tampilan · style · fungsi</p>
              </div>
              <Layers className="w-3 h-3 text-foreground/20 group-hover:text-accent transition-colors" />
            </button>
          </div>
        )}
      </div>

      {/* ── Folder /rgx/ ── */}
      <div>
        <button
          onClick={() => toggleFolder("rgx")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group text-left"
        >
          {expandedFolders.rgx
            ? <FolderOpen className="w-4 h-4 text-primary shrink-0" />
            : <Folder className="w-4 h-4 text-primary shrink-0" />}
          <span className="font-mono text-sm text-foreground flex-1">rgx/</span>
          <span className="text-xs text-foreground/30 font-mono mr-1">{rgxFiles.length}</span>
          {expandedFolders.rgx
            ? <ChevronDown className="w-3.5 h-3.5 text-foreground/30" />
            : <ChevronRight className="w-3.5 h-3.5 text-foreground/30" />}
        </button>

        {/* File di dalam /rgx/ */}
        {expandedFolders.rgx && (
          <div className="ml-5 border-l border-border/30 pl-2 mt-0.5 space-y-0.5">
            {rgxFiles.map((file) => {
              const meta = DOC_META[file.docType];
              return (
                <button
                  key={file.id}
                  onClick={() => setView({ type: "rgx-file", fileId: file.id })}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors group text-left"
                >
                  {meta.icon}
                  <div className="flex-1 min-w-0">
                    <span className={`font-mono text-sm ${meta.color}`}>{file.name}</span>
                    <p className="text-xs text-foreground/40 mt-0.5">{meta.label} · 15 pola</p>
                  </div>
                  <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-muted/40 ${meta.color}`}>
                    {meta.badge}
                  </span>
                </button>
              );
            })}

            {/* Tombol buat file baru */}
            <button
              onClick={() => { setView({ type: "rgx-list" }); setShowNewFile(true); }}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/20 transition-colors text-left"
            >
              <Plus className="w-3.5 h-3.5 text-foreground/30" />
              <span className="text-xs text-foreground/30 font-mono">buat file baru...</span>
            </button>
          </div>
        )}
      </div>

      {/* Info protokol */}
      <div className="mx-2 mt-2 p-2.5 rounded-lg bg-muted/20 border border-border/40">
        <p className="text-xs font-mono text-foreground/50 leading-relaxed">
          <span className="text-accent">utama://</span> — protokol direktori inti
          <span className="mx-2 text-foreground/20">·</span>
          <span className="text-primary">utama://rgx</span> navigasi langsung
        </p>
      </div>
    </div>
  );

  // ── Render /utama/index.utama ────────────────────────────────────────────

  const renderUtamaIndex = () => (
    <div className="flex flex-col h-full">
      <div className="flex gap-1 px-3 pt-2 pb-1.5 border-b border-border/40">
        {INDEX_SECTIONS.map((sec, i) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeSection === i
                ? "bg-accent/20 text-accent"
                : "text-foreground/50 hover:text-foreground/80 hover:bg-muted/40"
            }`}
          >
            {sec.icon}
            {sec.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-3">
        <div className="relative">
          <span className="absolute top-2 right-2 text-xs font-mono text-foreground/25 bg-muted/30 px-2 py-0.5 rounded">
            {INDEX_SECTIONS[activeSection].lang}
          </span>
          <pre className="font-mono text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap p-4 bg-background/60 rounded-lg border border-border/30 overflow-x-auto">
            <code>{INDEX_SECTIONS[activeSection].content}</code>
          </pre>
        </div>
      </div>
    </div>
  );

  // ── Render /rgx/ list ────────────────────────────────────────────────────

  const handleDeleteRgx = (id: string) => setRgxFiles((prev) => prev.filter((f) => f.id !== id));

  const handleMoveRgx = (id: string, newPath: string) => {
    setRgxFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, path: newPath, name: newPath.split("/").pop() || f.name } : f
      )
    );
    setShowMoveId(null);
    setMoveTarget("");
  };

  const handleSaveEdit = () => {
    setRgxFiles((prev) =>
      prev.map((f) =>
        f.id === editingId
          ? { ...f, content: editContent, name: editName, path: `/rgx/${editName}` }
          : f
      )
    );
    setEditingId(null);
  };

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    const name = newFileName.endsWith(".rgx") ? newFileName : `${newFileName}.rgx`;
    setRgxFiles((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name,
        path: `/rgx/${name}`,
        docType: "teks",
        content: `// ${name} — format: pattern|deskripsi\n`,
      },
    ]);
    setNewFileName("");
    setShowNewFile(false);
  };

  const renderRgxList = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 pt-2 pb-2 border-b border-border/40">
        <span className="text-xs text-foreground/40 font-mono">/rgx/ — {rgxFiles.length} file</span>
        <button
          onClick={() => setShowNewFile((v) => !v)}
          className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Buat File
        </button>
      </div>

      {showNewFile && (
        <div className="flex gap-2 px-3 py-2 bg-muted/20 border-b border-border/30">
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="nama-file.rgx"
            className="h-7 text-xs font-mono bg-background/60 border-border/50"
            onKeyDown={(e) => { if (e.key === "Enter") handleCreateFile(); if (e.key === "Escape") setShowNewFile(false); }}
            autoFocus
          />
          <Button size="sm" onClick={handleCreateFile} className="h-7 text-xs px-3">Buat</Button>
        </div>
      )}

      <div className="flex-1 overflow-auto p-2 space-y-0.5">
        {rgxFiles.map((file) => {
          const meta = DOC_META[file.docType] ?? DOC_META.teks;
          return (
            <div key={file.id} className="group">
              <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted/30 transition-colors">
                {meta.icon}
                <button
                  className="flex-1 text-left min-w-0"
                  onClick={() => setView({ type: "rgx-file", fileId: file.id })}
                >
                  <span className={`font-mono text-sm truncate block ${meta.color}`}>{file.name}</span>
                  <span className="text-xs text-foreground/35 font-mono">{file.path}</span>
                </button>
                <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-muted/40 ${meta.color}`}>
                  {meta.badge}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button title="Edit" onClick={() => { setEditingId(file.id); setEditContent(file.content); setEditName(file.name); setView({ type: "rgx-file", fileId: file.id }); }}
                    className="p-1 rounded hover:bg-accent/20 text-foreground/40 hover:text-accent transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button title="Pindah" onClick={() => setShowMoveId(file.id)}
                    className="p-1 rounded hover:bg-primary/20 text-foreground/40 hover:text-primary transition-colors">
                    <MoveRight className="w-3.5 h-3.5" />
                  </button>
                  <button title="Hapus" onClick={() => handleDeleteRgx(file.id)}
                    className="p-1 rounded hover:bg-destructive/20 text-foreground/40 hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {showMoveId === file.id && (
                <div className="flex gap-2 px-2 py-1.5 ml-6">
                  <Input value={moveTarget} onChange={(e) => setMoveTarget(e.target.value)}
                    placeholder="/rgx/subfolder/nama.rgx"
                    className="h-7 text-xs font-mono bg-background/60 border-border/50"
                    onKeyDown={(e) => { if (e.key === "Enter") handleMoveRgx(file.id, moveTarget); if (e.key === "Escape") setShowMoveId(null); }}
                    autoFocus />
                  <Button size="sm" onClick={() => handleMoveRgx(file.id, moveTarget)} className="h-7 text-xs px-3">Pindah</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Render /rgx/[file] viewer/editor ────────────────────────────────────

  const renderRgxFile = (fileId: string) => {
    const file = rgxFiles.find((f) => f.id === fileId);
    if (!file) return null;
    const meta = DOC_META[file.docType] ?? DOC_META.teks;
    const isEditing = editingId === file.id;

    const parsedLines = file.content
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("//"))
      .map((line) => {
        const sep = line.indexOf("|");
        if (sep === -1) return { pattern: line, desc: "" };
        return { pattern: line.slice(0, sep), desc: line.slice(sep + 1) };
      });

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-3 pt-2 pb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            {meta.icon}
            <span className={`font-mono text-sm ${meta.color}`}>{file.name}</span>
            <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-muted/40 ${meta.color}`}>
              {meta.badge}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSaveEdit} className="h-6 text-xs px-2 gap-1">
                  <Save className="w-3 h-3" />Simpan
                </Button>
                <button onClick={() => setEditingId(null)}
                  className="p-1 rounded hover:bg-muted/40 text-foreground/40 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => { setEditingId(file.id); setEditContent(file.content); setEditName(file.name); }}
                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 px-2 py-1 rounded hover:bg-accent/10 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />Edit
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-3">
          {isEditing ? (
            <div className="space-y-2">
              <Input value={editName} onChange={(e) => setEditName(e.target.value)}
                className="h-7 text-xs font-mono bg-background/60 border-border/50" placeholder="nama-file.rgx" />
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-52 font-mono text-xs bg-background/60 border border-border/50 rounded-lg p-3 text-foreground/90 resize-none focus:outline-none focus:border-accent/50 leading-relaxed"
                placeholder="pattern|deskripsi" spellCheck={false} />
              <p className="text-xs text-foreground/35 font-mono">
                Format: <span className="text-accent">pattern</span>|<span className="text-primary">deskripsi</span>
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              <div className="grid grid-cols-[1fr_1fr] gap-2 px-2 py-1 text-xs font-semibold text-foreground/35 uppercase tracking-wider border-b border-border/25 mb-2">
                <span>Pattern</span>
                <span>Deskripsi</span>
              </div>
              {parsedLines.map((line, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr] gap-2 px-2 py-1.5 rounded hover:bg-muted/20 transition-colors">
                  <code className={`font-mono text-xs break-all ${meta.color}`}>{line.pattern}</code>
                  <span className="text-xs text-foreground/55 break-words">{line.desc}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-border/20 mt-2">
                <span className="text-xs text-foreground/25 font-mono">{parsedLines.length} / 15 pola</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Render Panel ─────────────────────────────────────────────────────────

  const breadcrumb = getBreadcrumb();

  return (
    <div
      ref={panelRef}
      className="template-panel absolute top-full left-0 right-0 mt-2 flex flex-col z-50"
      style={{ maxHeight: "500px", minHeight: "300px" }}
    >
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-muted/10 rounded-t-xl">
        <div className="flex items-center gap-1 font-mono text-xs overflow-x-auto">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1 shrink-0">
              {i > 0 && <ChevronRight className="w-3 h-3 text-foreground/25" />}
              <button
                onClick={() => {
                  if (i <= 1) setView({ type: "root" });
                  else if (crumb === "utama") setView({ type: "utama-index" });
                  else if (crumb === "rgx") setView({ type: "rgx-list" });
                }}
                className={`hover:text-accent transition-colors ${
                  i === 0 ? "text-accent font-bold"
                  : i === breadcrumb.length - 1 ? "text-foreground/70"
                  : "text-foreground/40 hover:text-accent"
                }`}
              >
                {crumb}
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {view.type !== "root" && (
            <button
              onClick={() => {
                if (view.type === "rgx-file") { setEditingId(null); setView({ type: "rgx-list" }); }
                else setView({ type: "root" });
              }}
              className="p-1 rounded hover:bg-muted/40 text-foreground/40 hover:text-foreground transition-colors"
              title="Kembali"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-destructive/20 text-foreground/40 hover:text-destructive transition-colors"
            title="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view.type === "root" && renderRoot()}
        {view.type === "utama-index" && renderUtamaIndex()}
        {view.type === "rgx-list" && renderRgxList()}
        {view.type === "rgx-file" && renderRgxFile(view.fileId)}
      </div>
    </div>
  );
}
