"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PageSelectorProps {
  totalPages: number;
  selectedPages: number[];
  onSelectionChange: (pages: number[]) => void;
}

export function PageSelector({
  totalPages,
  selectedPages,
  onSelectionChange,
}: PageSelectorProps) {
  const [rangeInput, setRangeInput] = useState("");

  const togglePage = (page: number) => {
    if (selectedPages.includes(page)) {
      onSelectionChange(selectedPages.filter((p) => p !== page));
    } else {
      onSelectionChange([...selectedPages, page].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    onSelectionChange(Array.from({ length: totalPages }, (_, i) => i + 1));
  };

  const deselectAll = () => {
    onSelectionChange([]);
  };

  const applyRange = () => {
    const trimmed = rangeInput.trim();
    if (!trimmed) return;

    const newPages = new Set<number>(selectedPages);

    const parts = trimmed.split(",");
    for (const part of parts) {
      const rangeParts = part.trim().split("-");
      if (rangeParts.length === 2) {
        const start = parseInt(rangeParts[0].trim(), 10);
        const end = parseInt(rangeParts[1].trim(), 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (
            let i = Math.max(1, start);
            i <= Math.min(totalPages, end);
            i++
          ) {
            newPages.add(i);
          }
        }
      } else if (rangeParts.length === 1) {
        const page = parseInt(rangeParts[0].trim(), 10);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
          newPages.add(page);
        }
      }
    }

    onSelectionChange(Array.from(newPages).sort((a, b) => a - b));
    setRangeInput("");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Range input */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="range-input"
          className="text-sm font-medium text-foreground"
        >
          Page range
        </label>
        <div className="flex gap-2">
          <input
            id="range-input"
            type="text"
            value={rangeInput}
            onChange={(e) => setRangeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyRange();
            }}
            placeholder="e.g. 1-3, 5, 8-10"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={applyRange}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={selectAll}
          className="text-xs font-medium text-primary hover:underline"
        >
          Select all
        </button>
        <span className="text-xs text-muted-foreground">|</span>
        <button
          onClick={deselectAll}
          className="text-xs font-medium text-primary hover:underline"
        >
          Deselect all
        </button>
        <span className="ml-auto text-xs text-muted-foreground">
          {selectedPages.length} of {totalPages} pages selected
        </span>
      </div>

      {/* Page grid */}
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isSelected = selectedPages.includes(page);
          return (
            <button
              key={page}
              onClick={() => togglePage(page)}
              aria-pressed={isSelected}
              className={cn(
                "relative flex items-center justify-center rounded-md border py-2 text-sm font-medium transition-colors",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted"
              )}
            >
              {page}
              {isSelected && (
                <Check className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-primary text-primary-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
