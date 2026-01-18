export type GroupColor = "yellow" | "green" | "blue" | "purple";

export type PuzzleGroup = {
  name?: string;
  color: GroupColor;
  words: [string, string, string, string];
};

export type PuzzleSettings = {
  shuffleOnLoad: boolean;
  maxMistakes: number;
};

export type PuzzleV1 = {
  v: 1;
  title?: string;
  groups: [PuzzleGroup, PuzzleGroup, PuzzleGroup, PuzzleGroup];
  settings: PuzzleSettings;
};

export type Slot =
  | { kind: "word"; text: string; selected: boolean }
  | { kind: "blank" };

export type SolvedGroup = {
  color: GroupColor;
  name?: string;
  words: string[];
};

export type Toast = {
  type: "info" | "success" | "error";
  message: string;
};

export type PlayState = {
  puzzle: PuzzleV1;
  slots: Slot[];
  mistakes: number;
  solved: SolvedGroup[];
  toast?: Toast;
  gameStatus: "playing" | "won" | "lost";
};

export const GROUP_COLORS: GroupColor[] = ["yellow", "green", "blue", "purple"];

export const COLOR_STYLES: Record<GroupColor, { bg: string; text: string }> = {
  yellow: { bg: "bg-yellow-400", text: "text-yellow-900" },
  green: { bg: "bg-green-500", text: "text-green-900" },
  blue: { bg: "bg-blue-500", text: "text-white" },
  purple: { bg: "bg-purple-600", text: "text-white" },
};
