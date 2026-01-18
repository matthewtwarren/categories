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
  const base = window.location.href.split('#')[0];
  return `${base}#/play?p=${payload}`;
}

export function getPayloadFromSearch(search: string): string | null {
  const params = new URLSearchParams(search);
  return params.get('p');
}
