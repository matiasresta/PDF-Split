"use client";

import { useCallback, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PdfDropzone } from "@/components/pdf-dropzone";
import { PageSelector } from "@/components/page-selector";
import { SplitActions } from "@/components/split-actions";
import { FileText, RotateCcw } from "lucide-react";

export function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [outputFileName, setOutputFileName] = useState("split-output");
  const [isSplitting, setIsSplitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);

  const handleFileSelect = useCallback(async (selected: File) => {
    setError(null);
    setFile(selected);
    setSelectedPages([]);
    setOutputFileName(
      selected.name.replace(/\.pdf$/i, "") + "-split"
    );

    try {
      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, {
        ignoreEncryption: true,
      });
      const count = pdfDoc.getPageCount();
      setTotalPages(count);
      setPdfBytes(buffer);
    } catch {
      setError(
        "Failed to read the PDF. It may be corrupted or password-protected."
      );
      setFile(null);
      setTotalPages(0);
      setPdfBytes(null);
    }
  }, []);

  const handleSplit = useCallback(async () => {
    if (!pdfBytes || selectedPages.length === 0) return;

    setIsSplitting(true);
    setError(null);

    try {
      const srcDoc = await PDFDocument.load(pdfBytes, {
        ignoreEncryption: true,
      });
      const newDoc = await PDFDocument.create();

      const pageIndices = selectedPages.map((p) => p - 1);
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);

      for (const page of copiedPages) {
        newDoc.addPage(page);
      }

      const resultBytes = await newDoc.save();
      const blob = new Blob([resultBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${outputFileName || "split-output"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("An error occurred while splitting the PDF. Please try again.");
    } finally {
      setIsSplitting(false);
    }
  }, [pdfBytes, selectedPages, outputFileName]);

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setSelectedPages([]);
    setOutputFileName("split-output");
    setIsSplitting(false);
    setError(null);
    setPdfBytes(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Step 1: Upload */}
      <section aria-labelledby="step-upload">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            1
          </span>
          <h2 id="step-upload" className="text-lg font-semibold text-foreground">
            Upload PDF
          </h2>
          {file && (
            <button
              onClick={handleReset}
              className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Start over
            </button>
          )}
        </div>
        <PdfDropzone onFileSelect={handleFileSelect} currentFile={file} />
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Step 2: Select pages */}
      {totalPages > 0 && (
        <section aria-labelledby="step-select">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            <h2
              id="step-select"
              className="text-lg font-semibold text-foreground"
            >
              Select Pages
            </h2>
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              {totalPages} {totalPages === 1 ? "page" : "pages"} total
            </span>
          </div>
          <PageSelector
            totalPages={totalPages}
            selectedPages={selectedPages}
            onSelectionChange={setSelectedPages}
          />
        </section>
      )}

      {/* Step 3: Split & download */}
      {totalPages > 0 && (
        <section aria-labelledby="step-split">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              3
            </span>
            <h2
              id="step-split"
              className="text-lg font-semibold text-foreground"
            >
              Split & Download
            </h2>
          </div>
          <SplitActions
            selectedCount={selectedPages.length}
            totalPages={totalPages}
            isSplitting={isSplitting}
            outputFileName={outputFileName}
            onOutputFileNameChange={setOutputFileName}
            onSplit={handleSplit}
          />
        </section>
      )}
    </div>
  );
}
