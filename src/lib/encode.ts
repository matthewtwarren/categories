import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import type { PuzzleV1 } from "./types";
import { parsePuzzle } from "./schema";

export function encodePuzzle(puzzle: PuzzleV1): string {
  const json = JSON.stringify(puzzle);
  return compressToEncodedURIComponent(json);
}

export function decodePuzzle(payload: string): PuzzleV1 | null {
  try {
    const json = decompressFromEncodedURIComponent(payload);
    if (!json) return null;

    const data = JSON.parse(json);
    return parsePuzzle(data);
  } catch {
    return null;
  }
}

export function createShareableLink(puzzle: PuzzleV1): string {
  const payload = encodePuzzle(puzzle);
  return `${window.location.origin}/play#p=${payload}`;
}

export function getPayloadFromHash(): string | null {
  const hash = window.location.hash;
  if (!hash.startsWith("#p=")) return null;
  return hash.slice(3);
}
