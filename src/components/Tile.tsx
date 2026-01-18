import type { Slot } from "../lib/types";

type TileProps = {
  slot: Slot;
  onClick?: () => void;
  disabled?: boolean;
};

export function Tile({ slot, onClick, disabled }: TileProps) {
  if (slot.kind === "blank") {
    return (
      <div className="h-16 sm:h-20 rounded-lg bg-transparent border border-dashed border-neutral-300" />
    );
  }

  const baseClasses =
    "h-16 sm:h-20 rounded-lg flex items-center justify-center text-sm sm:text-base font-semibold transition active:scale-[0.98] select-none";

  const stateClasses = slot.selected
    ? "bg-neutral-900 text-white"
    : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900";

  const cursorClasses = disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer";

  return (
    <button
      type="button"
      className={`${baseClasses} ${stateClasses} ${cursorClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="px-2 text-center break-words leading-tight">
        {slot.text}
      </span>
    </button>
  );
}
