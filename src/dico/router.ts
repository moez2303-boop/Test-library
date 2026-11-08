import { useEffect, useState } from "react";

export type Route =
  | { name: "search"; q: string }
  | { name: "word"; id: number }
  | { name: "kanji"; c: string }
  | { name: "lists" }
  | { name: "list"; id: string }
  | { name: "review" }
  | { name: "settings" };

export function parse(hash: string): Route {
  const h = decodeURIComponent(hash.replace(/^#/, ""));
  let m: RegExpMatchArray | null;
  if ((m = h.match(/^\/mot\/(\d+)/))) return { name: "word", id: Number(m[1]) };
  if ((m = h.match(/^\/kanji\/(.+)$/))) return { name: "kanji", c: [...m[1]][0] };
  if ((m = h.match(/^\/listes\/(.+)$/))) return { name: "list", id: m[1] };
  if (h.startsWith("/listes")) return { name: "lists" };
  if (h.startsWith("/reviser")) return { name: "review" };
  if (h.startsWith("/reglages")) return { name: "settings" };
  const q = h.match(/^\/?\?q=(.*)$/);
  return { name: "search", q: q ? q[1] : "" };
}

export function href(r: Route): string {
  switch (r.name) {
    case "search":
      return r.q ? `#/?q=${encodeURIComponent(r.q)}` : "#/";
    case "word":
      return `#/mot/${r.id}`;
    case "kanji":
      return `#/kanji/${encodeURIComponent(r.c)}`;
    case "lists":
      return "#/listes";
    case "list":
      return `#/listes/${encodeURIComponent(r.id)}`;
    case "review":
      return "#/reviser";
    case "settings":
      return "#/reglages";
  }
}

export function go(r: Route, replace = false) {
  const h = href(r);
  if (replace) history.replaceState(null, "", h);
  else location.hash = h;
  if (replace) window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(location.hash));
  useEffect(() => {
    const on = () => setRoute(parse(location.hash));
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

export function back() {
  if (history.length > 1) history.back();
  else location.hash = "#/";
}
