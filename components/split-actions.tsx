"use client";

import { Download, Loader2, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplitActionsProps {
  selectedCount: number;
  totalPages: number;
  isSplitting: boolean;
  outputFileName: string;
  onOutputFileNameChange: (name: string) => void;
  onSplit: () => void;
}

export function SplitActions({
  selectedCount,
  totalPages,
  isSplitting,
  outputFileName,
  onOutputFileNameChange,
  onSplit,
}: SplitActionsProps) {
  const canSplit = selectedCount > 0 && !isSplitting;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="output-name"
          className="text-sm font-medium text-foreground"
        >
          Output file name
        </label>
        <input
          id="output-name"
          type="text"
          value={outputFileName}
          onChange={(e) => onOutputFileNameChange(e.target.value)}
          placeholder="split-output"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedCount} of {totalPages} pages will be extracted
        </p>
        <button
          onClick={onSplit}
          disabled={!canSplit}
          className={cn(
            "inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors",
            canSplit
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {isSplitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Splitting...
            </>
          ) : (
            <>
              <Scissors className="h-4 w-4" />
              Split & Download
              <Download className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
