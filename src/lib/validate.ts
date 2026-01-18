import { normalizeWord } from "./game";

export type ValidationError = {
  field: string;
  message: string;
};

export type CreateFormData = {
  title: string;
  groups: Array<{
    name: string;
    words: [string, string, string, string];
  }>;
  shuffleOnLoad: boolean;
  maxMistakes: number;
};

export function validateCreateForm(data: CreateFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Collect all words for duplicate checking
  const allWords: string[] = [];
  const normalizedWords = new Set<string>();

  data.groups.forEach((group, groupIndex) => {
    const groupWords = new Set<string>();

    group.words.forEach((word, wordIndex) => {
      const trimmed = word.trim();
      const normalized = normalizeWord(trimmed);

      // Check if word is empty
      if (!trimmed) {
        errors.push({
          field: `group-${groupIndex}-word-${wordIndex}`,
          message: `Word ${wordIndex + 1} in group ${groupIndex + 1} is empty`,
        });
        return;
      }

      // Check for duplicates within the group
      if (groupWords.has(normalized)) {
        errors.push({
          field: `group-${groupIndex}-word-${wordIndex}`,
          message: `Duplicate word "${trimmed}" in group ${groupIndex + 1}`,
        });
      } else {
        groupWords.add(normalized);
      }

      // Check for duplicates across all groups
      if (normalizedWords.has(normalized)) {
        errors.push({
          field: `group-${groupIndex}-word-${wordIndex}`,
          message: `Word "${trimmed}" is used in multiple groups`,
        });
      } else {
        normalizedWords.add(normalized);
      }

      allWords.push(trimmed);
    });
  });

  // Check maxMistakes range
  if (data.maxMistakes < 1 || data.maxMistakes > 10) {
    errors.push({
      field: "maxMistakes",
      message: "Max mistakes must be between 1 and 10",
    });
  }

  return errors;
}
