"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfDropzoneProps {
  onFileSelect: (file: File) => void;
  currentFile: File | null;
}

export function PdfDropzone({ onFileSelect, currentFile }: PdfDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload a PDF file"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors cursor-pointer",
        isDragOver
          ? "border-primary bg-primary/5"
          : currentFile
            ? "border-success bg-success/5"
            : "border-border bg-card hover:border-primary/50 hover:bg-muted/50"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={handleChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {currentFile ? (
        <>
          <FileText className="h-10 w-10 text-success mb-3" />
          <p className="text-sm font-medium text-foreground">
            {currentFile.name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {(currentFile.size / 1024).toFixed(1)} KB — Click or drop to
            replace
          </p>
        </>
      ) : (
        <>
          <Upload className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-foreground">
            Drop your PDF here or click to upload
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Only .pdf files are accepted
          </p>
        </>
      )}
    </div>
  );
}
