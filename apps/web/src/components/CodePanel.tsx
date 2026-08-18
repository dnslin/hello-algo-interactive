import { useState, useMemo } from 'react';
import {
  bubbleSortContentManifest,
  type SupportedLanguage,
  type LanguageCodeManifest,
} from '@hello-algo/content-adapter';
import { Code, Check, Copy } from 'lucide-react';
import { Button } from '@hello-algo/ui';

export interface CodePanelProps {
  currentAnchor?: string;
  className?: string;
}

export function CodePanel({ currentAnchor, className = '' }: CodePanelProps) {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('typescript');
  const [copied, setCopied] = useState(false);

  const codeManifest: LanguageCodeManifest | undefined =
    bubbleSortContentManifest.codeManifests[selectedLang];

  const lines = useMemo(() => {
    return codeManifest ? codeManifest.code.split('\n') : [];
  }, [codeManifest]);

  const activeSpan = useMemo<[number, number] | undefined>(() => {
    if (!codeManifest || !currentAnchor) return undefined;
    return codeManifest.anchors[currentAnchor];
  }, [codeManifest, currentAnchor]);

  const handleCopy = async () => {
    if (!codeManifest) return;
    try {
      await navigator.clipboard.writeText(codeManifest.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API unavailable
    }
  };

  const languages: { id: SupportedLanguage; label: string }[] = [
    { id: 'typescript', label: 'TypeScript' },
    { id: 'python', label: 'Python' },
    { id: 'go', label: 'Go' },
  ];

  return (
    <div
      className={`flex flex-col rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden ${className}`}
    >
      {/* Header with Language Tabs & Copy Button */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/70 bg-muted/40 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
          <Code className="w-3.5 h-3.5" />
          <div className="flex gap-1">
            {languages.map((lang) => {
              const isActive = selectedLang === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`px-2.5 py-1 rounded-md transition-all font-mono ${
                    isActive
                      ? 'bg-background text-foreground shadow-xs font-semibold border border-border/60'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentAnchor && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-medium">
              @{currentAnchor}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500 mr-1" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                <span>复制</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code Viewer with Line Highlights */}
      <div className="p-3 font-mono text-xs overflow-x-auto bg-slate-950 text-slate-100 dark:bg-slate-950/90 leading-relaxed max-h-[420px] overflow-y-auto">
        <div className="table w-full border-collapse">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isHighlighted =
              activeSpan !== undefined &&
              lineNum >= activeSpan[0] &&
              lineNum <= activeSpan[1];

            return (
              <div
                key={`line-${lineNum}`}
                className={`table-row transition-colors duration-150 ${
                  isHighlighted
                    ? 'bg-amber-500/25 border-l-2 border-amber-400 font-semibold'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                <span className="table-cell w-8 pr-3 text-right text-slate-500 select-none opacity-60 text-[11px]">
                  {lineNum}
                </span>
                <span
                  className={`table-cell pl-2 whitespace-pre font-mono ${
                    isHighlighted ? 'text-amber-200' : 'text-slate-200'
                  }`}
                >
                  {line || ' '}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
