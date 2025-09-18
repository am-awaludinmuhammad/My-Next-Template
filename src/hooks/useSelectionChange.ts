import { useEffect, useRef, useState } from "react";

type GetContainers = () => HTMLElement[];

export type SelectedHit =
  | { text: string; range: Range; container: HTMLElement }
  | null;

export function pickSelectionIn(containers: HTMLElement[]): SelectedHit {
  const sel = window.getSelection?.();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;

  const range = sel.getRangeAt(0);
  const { startContainer, endContainer } = range;

  // pastikan dua-duanya di container yang sama
  const container = containers.find(
    (c) => c.contains(startContainer) && c.contains(endContainer)
  );
  if (!container) return null;

  // abaikan input/textarea/contenteditable=false
  const startEl =
    startContainer.nodeType === Node.ELEMENT_NODE
      ? (startContainer as Element)
      : (startContainer.parentElement as Element | null);
  if (startEl?.closest("input, textarea, [contenteditable='false']")) return null;

  const text = sel.toString().replace(/\s+/g, " ").trim();
  if (!text) return null;

  return { text, range, container };
}

export function useSelectionChange(getContainers: GetContainers) {
  const [selectedText, setSelectedText] = useState("");
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const onSelectionChange = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const containers = getContainers().filter(Boolean);
        const res = containers.length ? pickSelectionIn(containers) : null;
        setSelectedText(res?.text ?? "");
      });
    };

    document.addEventListener("selectionchange", onSelectionChange, {
      passive: true,
    });

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [getContainers]);

  return [selectedText, setSelectedText] as const;
}
