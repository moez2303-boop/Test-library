import { IS_ARTIFACT } from "./platform";

/**
 * Paths like "/lesson/1.1/quiz". The web build keeps them in location.hash;
 * the Artifact build keeps them in memory because claude.ai only passes a
 * plain #name between the page and its link.
 */
let memoryPath = "/";
const listeners = new Set<() => void>();

export function currentPath(): string {
  return IS_ARTIFACT ? memoryPath : window.location.hash.replace(/^#/, "") || "/";
}

export function go(path: string) {
  if (!IS_ARTIFACT) {
    window.location.hash = path;
    return;
  }
  if (path === memoryPath) return;
  memoryPath = path;
  listeners.forEach((l) => l());
}

export function onRoute(l: () => void): () => void {
  listeners.add(l);
  if (!IS_ARTIFACT) window.addEventListener("hashchange", l);
  return () => {
    listeners.delete(l);
    if (!IS_ARTIFACT) window.removeEventListener("hashchange", l);
  };
}

/** In the Artifact build, turn clicks on <a href="#/..."> into in-memory navigation. */
export function interceptLinks() {
  if (!IS_ARTIFACT) return;
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = (e.target as Element | null)?.closest?.("a[href^='#/']");
    if (!a) return;
    e.preventDefault();
    go(a.getAttribute("href")!.slice(1));
  });
}
