import type { SolvedGroup } from "../lib/types";
import { COLOR_STYLES } from "../lib/types";

type SolvedRowProps = {
  group: SolvedGroup;
};

export function SolvedRow({ group }: SolvedRowProps) {
  const colors = COLOR_STYLES[group.color];

  return (
    <div
      className={`${colors.bg} ${colors.text} rounded-lg p-4 text-center`}
    >
      {group.name && (
        <div className="font-bold text-sm uppercase tracking-wide mb-1">
          {group.name}
        </div>
      )}
      <div className="text-sm font-medium">
        {group.words.join(", ")}
      </div>
    </div>
  );
}
