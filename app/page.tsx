"use client";

import { PdfSplitter } from "@/components/pdf-splitter";
import { Scissors, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Scissors className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight text-balance">
              PDF Split
            </h1>
            <p className="text-xs text-muted-foreground">
              Extract pages from any PDF, entirely in your browser
            </p>
          </div>
        </div>
      </header>

      {/* Feature pills */}
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 pt-6 pb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <Shield className="h-3 w-3" />
          100% Private
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <Zap className="h-3 w-3" />
          Instant Processing
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          No file uploads to any server
        </span>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-3xl px-4 py-6 pb-16">
        <PdfSplitter />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Your files never leave your browser. All processing happens locally
            using{" "}
            <a
              href="https://pdf-lib.js.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              pdf-lib
            </a>
            .
          </p>
        </div>
      </footer>
    </main>
  );
}
