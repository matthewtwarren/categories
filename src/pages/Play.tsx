import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tile } from "../components/Tile";
import { SolvedRow } from "../components/SolvedRow";
import { ToastBanner } from "../components/ToastBanner";
import type { PlayState } from "../lib/types";
import { decodePuzzle, getPayloadFromHash } from "../lib/encode";
import {
  initializePlayState,
  toggleSelection,
  clearSelection,
  getSelectedWords,
  getSelectedCount,
  checkGuess,
  checkOneAway,
  getUnsolvedGroups,
  markWordsAsBlank,
  shuffleWordSlots,
} from "../lib/game";

type InitResult =
  | { ok: true; initialState: PlayState }
  | { ok: false; error: string };

function initFromHash(): InitResult {
  const payload = getPayloadFromHash();
  if (!payload) {
    return { ok: false, error: "No puzzle data found in the URL." };
  }

  const puzzle = decodePuzzle(payload);
  if (!puzzle) {
    return { ok: false, error: "Invalid or corrupted puzzle data." };
  }

  return { ok: true, initialState: initializePlayState(puzzle) };
}

function PlayGame({ initialState }: { initialState: PlayState }) {
  const [state, setState] = useState<PlayState>(initialState);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleTileClick = (index: number) => {
    if (state.gameStatus !== "playing") return;
    setState((prev) => ({ ...prev, slots: toggleSelection(prev.slots, index) }));
  };

  const handleSubmit = () => {
    if (state.gameStatus !== "playing") return;

    const selectedCount = getSelectedCount(state.slots);
    if (selectedCount !== 4) return;

    const selectedWords = getSelectedWords(state.slots);
    const unsolvedGroups = getUnsolvedGroups(state.puzzle, state.solved);
    const matchedGroup = checkGuess(selectedWords, unsolvedGroups);

    if (matchedGroup) {
      const newSolved = [
        ...state.solved,
        {
          color: matchedGroup.color,
          name: matchedGroup.name,
          words: matchedGroup.words,
        },
      ];
      const newSlots = markWordsAsBlank(state.slots, matchedGroup.words);
      const isWin = newSolved.length === 4;

      setState({
        ...state,
        slots: newSlots,
        solved: newSolved,
        gameStatus: isWin ? "won" : "playing",
        toast: isWin
          ? { type: "success", message: "Congratulations! You solved it!" }
          : { type: "success", message: "Correct!" },
      });

      if (!isWin) {
        setTimeout(() => {
          setState((prev) => ({ ...prev, toast: undefined }));
        }, 2000);
      }
    } else {
      const isOneAway = checkOneAway(selectedWords, unsolvedGroups);
      const newMistakes = state.mistakes + 1;
      const isLoss = newMistakes >= state.puzzle.settings.maxMistakes;

      setState({
        ...state,
        slots: clearSelection(state.slots),
        mistakes: newMistakes,
        gameStatus: isLoss ? "lost" : "playing",
        toast: isLoss
          ? { type: "error", message: "Game Over!" }
          : isOneAway
          ? { type: "info", message: "One away..." }
          : { type: "error", message: "Not quite!" },
      });

      if (!isLoss) {
        setTimeout(() => {
          setState((prev) => ({ ...prev, toast: undefined }));
        }, 2000);
      }
    }
  };

  const handleShuffle = () => {
    if (state.gameStatus !== "playing") return;
    setState((prev) => ({ ...prev, slots: shuffleWordSlots(prev.slots) }));
  };

  const handleDeselectAll = () => {
    if (state.gameStatus !== "playing") return;
    setState((prev) => ({ ...prev, slots: clearSelection(prev.slots) }));
  };

  const selectedCount = getSelectedCount(state.slots);
  const canSubmit = selectedCount === 4 && state.gameStatus === "playing";
  const mistakesRemaining =
    state.puzzle.settings.maxMistakes - state.mistakes;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="text-neutral-600 hover:text-neutral-900 transition"
          >
            &larr; Home
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">
            {state.puzzle.title || "Categories"}
          </h1>
          <div className="w-16" />
        </div>

        {state.toast && (
          <div className="mb-4">
            <ToastBanner toast={state.toast} />
          </div>
        )}

        <div className="mb-4 text-center text-sm text-neutral-600">
          {state.gameStatus === "playing" && (
            <>
              Mistakes remaining:{" "}
              <span className="font-semibold">{mistakesRemaining}</span>
            </>
          )}
          {state.gameStatus === "won" && (
            <span className="text-green-600 font-semibold">You won!</span>
          )}
          {state.gameStatus === "lost" && (
            <span className="text-red-600 font-semibold">Game over!</span>
          )}
        </div>

        {state.solved.length > 0 && (
          <div className="space-y-2 mb-4">
            {state.solved.map((group, index) => (
              <SolvedRow key={index} group={group} />
            ))}
          </div>
        )}

        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 mb-6">
          <div className="grid grid-cols-4 gap-2">
            {state.slots.map((slot, index) => (
              <Tile
                key={index}
                slot={slot}
                onClick={() => handleTileClick(index)}
                disabled={state.gameStatus !== "playing"}
              />
            ))}
          </div>
        </div>

        {state.gameStatus === "playing" && (
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleShuffle}
              className="px-6 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition"
            >
              Shuffle
            </button>
            <button
              type="button"
              onClick={handleDeselectAll}
              disabled={selectedCount === 0}
              className={`px-6 py-3 border border-neutral-300 rounded-lg font-medium transition ${
                selectedCount === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-neutral-50"
              }`}
            >
              Deselect All
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                canSubmit
                  ? "bg-neutral-900 text-white hover:bg-neutral-800"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        )}

        {state.gameStatus === "lost" && !showAnswers && (
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={() => setShowAnswers(true)}
              className="px-6 py-3 bg-neutral-700 text-white rounded-lg font-medium hover:bg-neutral-600 transition"
            >
              Reveal Answers
            </button>
          </div>
        )}

        {showAnswers && (
          <div className="space-y-2 mb-6">
            <p className="text-center text-sm text-neutral-500 mb-2">The remaining groups were:</p>
            {getUnsolvedGroups(state.puzzle, state.solved).map((group, index) => (
              <SolvedRow
                key={index}
                group={{
                  color: group.color,
                  name: group.name,
                  words: [...group.words],
                }}
              />
            ))}
          </div>
        )}

        {state.gameStatus !== "playing" && (
          <div className="flex justify-center gap-3">
            <Link
              to="/"
              className="px-6 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition"
            >
              Create New Puzzle
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorView({ error }: { error: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="text-6xl mb-4">:(</div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Oops!</h1>
        <p className="text-neutral-600 mb-8">{error}</p>
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition"
          >
            Go Home
          </Link>
          <Link
            to="/create"
            className="inline-block px-6 py-3 border border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition"
          >
            Create Puzzle
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Play() {
  const location = useLocation();

  // Use location.hash as key to reinitialize when hash changes
  const initResult = initFromHash();

  if (!initResult.ok) {
    return <ErrorView error={initResult.error} />;
  }

  // Key forces remount when hash changes
  return <PlayGame key={location.hash} initialState={initResult.initialState} />;
}
