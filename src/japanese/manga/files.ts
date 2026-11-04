import type { PDFDocumentProxy } from "pdfjs-dist";

// ---------------------------------------------------------------------------
// Text files
// ---------------------------------------------------------------------------

/**
 * Reads a .txt file. Japanese text files are often Shift_JIS rather than
 * UTF-8, so fall back to that (and handle UTF-16 byte-order marks).
 */
export async function readTextFile(file: Blob): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return new TextDecoder("utf-16le").decode(bytes);
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return new TextDecoder("utf-16be").decode(bytes);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    for (const enc of ["shift_jis", "euc-jp"]) {
      try {
        return new TextDecoder(enc, { fatal: true }).decode(bytes);
      } catch {
        /* try the next encoding */
      }
    }
    return new TextDecoder("utf-8").decode(bytes);
  }
}

/** Splits long text into parts of about `size` characters, at line breaks. */
export function splitText(text: string, size = 2500): string[] {
  const clean = text.replace(/\r\n?/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!clean) return [];
  const parts: string[] = [];
  let current = "";
  for (const line of clean.split("\n")) {
    if (current && current.length + line.length + 1 > size) {
      parts.push(current.trim());
      current = "";
    }
    // A single very long line is cut where it must be.
    let rest = line;
    while (rest.length > size) {
      parts.push(rest.slice(0, size));
      rest = rest.slice(size);
    }
    current += rest + "\n";
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

// ---------------------------------------------------------------------------
// PDF files (rendered to images, since manga PDFs are usually scans)
// ---------------------------------------------------------------------------

declare const __ARTIFACT__: boolean;

let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const pdfjs = await import("pdfjs-dist");
      if (__ARTIFACT__) {
        // The single-file claude.ai page can't load a separate worker file, so
        // pdf.js runs its worker code on the page itself (fine for a few pages).
        const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs");
        (globalThis as unknown as { pdfjsWorker: unknown }).pdfjsWorker = worker;
      } else {
        pdfjs.GlobalWorkerOptions.workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
      }
      return pdfjs;
    })();
  }
  return pdfjsPromise;
}

export interface OpenPdf {
  pageCount: number;
  /** Renders pages `from`..`from+count-1` (1-based) as JPEG images. */
  render(from: number, count: number): Promise<Blob[]>;
  /** Any text layer on those pages (empty for scanned manga). */
  text(from: number, count: number): Promise<string>;
}

export async function openPdf(file: Blob): Promise<OpenPdf> {
  const pdfjs = await loadPdfjs();
  const doc: PDFDocumentProxy = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = (from: number, count: number) => {
    const last = Math.min(doc.numPages, from + count - 1);
    return Array.from({ length: Math.max(0, last - from + 1) }, (_, i) => from + i);
  };
  return {
    pageCount: doc.numPages,
    async render(from, count) {
      const out: Blob[] = [];
      for (const n of pages(from, count)) {
        const page = await doc.getPage(n);
        const base = page.getViewport({ scale: 1 });
        const scale = Math.min(3, 1800 / Math.max(base.width, base.height));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.88));
        if (blob) out.push(blob);
      }
      return out;
    },
    async text(from, count) {
      const chunks: string[] = [];
      for (const n of pages(from, count)) {
        const content = await (await doc.getPage(n)).getTextContent();
        const t = content.items.map((it) => ("str" in it ? it.str : "")).join("").trim();
        if (t) chunks.push(`[Page ${n - from + 1}]\n${t}`);
      }
      return chunks.join("\n\n");
    },
  };
}
