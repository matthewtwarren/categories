import type { PuzzleV1, Slot, PlayState, PuzzleGroup, SolvedGroup } from "./types";

export function normalizeWord(s: string): string {
  return s.trim().toUpperCase();
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function initializePlayState(puzzle: PuzzleV1): PlayState {
  // Extract all 16 words
  let words = puzzle.groups.flatMap((group) => group.words);

  // Shuffle if enabled
  if (puzzle.settings.shuffleOnLoad) {
    words = shuffleArray(words);
  }

  // Create 16 slots
  const slots: Slot[] = words.map((text) => ({
    kind: "word",
    text,
    selected: false,
  }));

  return {
    puzzle,
    slots,
    mistakes: 0,
    solved: [],
    gameStatus: "playing",
  };
}

export function getSelectedWords(slots: Slot[]): string[] {
  return slots
    .filter((slot): slot is Extract<Slot, { kind: "word" }> =>
      slot.kind === "word" && slot.selected
    )
    .map((slot) => slot.text);
}

export function getSelectedCount(slots: Slot[]): number {
  return slots.filter(
    (slot) => slot.kind === "word" && slot.selected
  ).length;
}

export function toggleSelection(slots: Slot[], index: number): Slot[] {
  const slot = slots[index];
  if (slot.kind !== "word") return slots;

  const currentSelected = getSelectedCount(slots);

  // If already at 4 selected and trying to select another, ignore
  if (!slot.selected && currentSelected >= 4) {
    return slots;
  }

  return slots.map((s, i) => {
    if (i !== index || s.kind !== "word") return s;
    return { ...s, selected: !s.selected };
  });
}

export function clearSelection(slots: Slot[]): Slot[] {
  return slots.map((slot) => {
    if (slot.kind !== "word") return slot;
    return { ...slot, selected: false };
  });
}

export function checkGuess(
  selectedWords: string[],
  unsolvedGroups: PuzzleGroup[]
): PuzzleGroup | null {
  const normalizedSelected = new Set(selectedWords.map(normalizeWord));

  for (const group of unsolvedGroups) {
    const normalizedGroup = new Set(group.words.map(normalizeWord));

    // Check if sets are equal
    if (
      normalizedSelected.size === normalizedGroup.size &&
      [...normalizedSelected].every((word) => normalizedGroup.has(word))
    ) {
      return group;
    }
  }

  return null;
}

export function checkOneAway(
  selectedWords: string[],
  unsolvedGroups: PuzzleGroup[]
): boolean {
  const normalizedSelected = new Set(selectedWords.map(normalizeWord));

  for (const group of unsolvedGroups) {
    const normalizedGroup = group.words.map(normalizeWord);
    const matchCount = normalizedGroup.filter((word) =>
      normalizedSelected.has(word)
    ).length;

    if (matchCount === 3) {
      return true;
    }
  }

  return false;
}

export function getUnsolvedGroups(
  puzzle: PuzzleV1,
  solved: SolvedGroup[]
): PuzzleGroup[] {
  const solvedColors = new Set(solved.map((s) => s.color));
  return puzzle.groups.filter((group) => !solvedColors.has(group.color));
}

export function markWordsAsBlank(
  slots: Slot[],
  words: string[]
): Slot[] {
  const normalizedWords = new Set(words.map(normalizeWord));

  return slots.map((slot) => {
    if (slot.kind !== "word") return slot;
    if (normalizedWords.has(normalizeWord(slot.text))) {
      return { kind: "blank" };
    }
    return { ...slot, selected: false };
  });
}

export function shuffleWordSlots(slots: Slot[]): Slot[] {
  // Get indices of word slots
  const wordIndices: number[] = [];
  const wordTexts: string[] = [];

  slots.forEach((slot, index) => {
    if (slot.kind === "word") {
      wordIndices.push(index);
      wordTexts.push(slot.text);
    }
  });

  // Shuffle texts
  const shuffledTexts = shuffleArray(wordTexts);

  // Create new slots array with shuffled texts
  const newSlots = [...slots];
  wordIndices.forEach((originalIndex, i) => {
    const slot = newSlots[originalIndex];
    if (slot.kind === "word") {
      newSlots[originalIndex] = {
        ...slot,
        text: shuffledTexts[i],
        selected: false,
      };
    }
  });

  return newSlots;
}
