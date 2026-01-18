import type { GroupColor } from "../lib/types";
import { COLOR_STYLES } from "../lib/types";

type PuzzleEditorGroupProps = {
  color: GroupColor;
  name: string;
  words: [string, string, string, string];
  onNameChange: (name: string) => void;
  onWordChange: (index: number, value: string) => void;
};

const COLOR_LABELS: Record<GroupColor, string> = {
  yellow: "Yellow (Easiest)",
  green: "Green",
  blue: "Blue",
  purple: "Purple (Hardest)",
};

export function PuzzleEditorGroup({
  color,
  name,
  words,
  onNameChange,
  onWordChange,
}: PuzzleEditorGroupProps) {
  const colors = COLOR_STYLES[color];

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div
          className={`${colors.bg} w-4 h-4 rounded-full flex-shrink-0`}
        />
        <span className="text-sm font-medium text-neutral-600">
          {COLOR_LABELS[color]}
        </span>
      </div>

      <input
        type="text"
        placeholder="Group name (optional)"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
      />

      <div className="grid grid-cols-2 gap-2">
        {words.map((word, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Word ${index + 1}`}
            value={word}
            onChange={(e) => onWordChange(index, e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
          />
        ))}
      </div>
    </div>
  );
}
