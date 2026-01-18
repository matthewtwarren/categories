import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { PuzzleEditorGroup } from "../components/PuzzleEditorGroup";
import { ShareLinkBox } from "../components/ShareLinkBox";
import { Tile } from "../components/Tile";
import type { GroupColor, PuzzleV1 } from "../lib/types";
import { GROUP_COLORS } from "../lib/types";
import { validateCreateForm, type CreateFormData } from "../lib/validate";
import { createShareableLink } from "../lib/encode";
import { shuffleArray } from "../lib/game";

type GroupFormData = {
  name: string;
  words: [string, string, string, string];
};

export function Create() {
  const [title, setTitle] = useState("");
  const [groups, setGroups] = useState<GroupFormData[]>(
    GROUP_COLORS.map(() => ({
      name: "",
      words: ["", "", "", ""],
    }))
  );
  const [shuffleOnLoad, setShuffleOnLoad] = useState(true);
  const [maxMistakes, setMaxMistakes] = useState(4);
  const [showPreview, setShowPreview] = useState(false);
  const [previewOrder, setPreviewOrder] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ]);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const formData: CreateFormData = useMemo(
    () => ({
      title,
      groups,
      shuffleOnLoad,
      maxMistakes,
    }),
    [title, groups, shuffleOnLoad, maxMistakes]
  );

  const validationErrors = useMemo(
    () => validateCreateForm(formData),
    [formData]
  );

  const isValid = validationErrors.length === 0;

  const allWords = useMemo(() => {
    return groups.flatMap((g) => g.words);
  }, [groups]);

  const previewWords = useMemo(() => {
    return previewOrder.map((i) => allWords[i]);
  }, [allWords, previewOrder]);

  const updateGroupName = (groupIndex: number, name: string) => {
    setGroups((prev) =>
      prev.map((g, i) => (i === groupIndex ? { ...g, name } : g))
    );
    setGeneratedLink(null);
  };

  const updateGroupWord = (
    groupIndex: number,
    wordIndex: number,
    value: string
  ) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? {
              ...g,
              words: g.words.map((w, wi) =>
                wi === wordIndex ? value : w
              ) as [string, string, string, string],
            }
          : g
      )
    );
    setGeneratedLink(null);
  };

  const handleShufflePreview = () => {
    setPreviewOrder(shuffleArray([...Array(16).keys()]));
  };

  const handleGenerateLink = () => {
    if (!isValid) return;

    const puzzle: PuzzleV1 = {
      v: 1,
      title: title.trim() || undefined,
      groups: groups.map((g, i) => ({
        name: g.name.trim() || undefined,
        color: GROUP_COLORS[i] as GroupColor,
        words: g.words.map((w) => w.trim()) as [
          string,
          string,
          string,
          string
        ],
      })) as [
        PuzzleV1["groups"][0],
        PuzzleV1["groups"][1],
        PuzzleV1["groups"][2],
        PuzzleV1["groups"][3]
      ],
      settings: {
        shuffleOnLoad,
        maxMistakes,
      },
    };

    const link = createShareableLink(puzzle);
    setGeneratedLink(link);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="text-neutral-600 hover:text-neutral-900 transition"
          >
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">
            Create Puzzle
          </h1>
          <div className="w-16" />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Puzzle Title (optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Movie Night Trivia"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setGeneratedLink(null);
              }}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Groups
            </h2>
            {groups.map((group, index) => (
              <PuzzleEditorGroup
                key={index}
                color={GROUP_COLORS[index]}
                name={group.name}
                words={group.words}
                onNameChange={(name) => updateGroupName(index, name)}
                onWordChange={(wordIndex, value) =>
                  updateGroupWord(index, wordIndex, value)
                }
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shuffleOnLoad}
                  onChange={(e) => {
                    setShuffleOnLoad(e.target.checked);
                    setGeneratedLink(null);
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm text-neutral-700">
                  Shuffle on load
                </span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Max Mistakes
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={maxMistakes}
                onChange={(e) => {
                  setMaxMistakes(parseInt(e.target.value) || 4);
                  setGeneratedLink(null);
                }}
                className="w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-800 mb-2">
                Please fix the following errors:
              </p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {validationErrors.slice(0, 5).map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
                {validationErrors.length > 5 && (
                  <li>...and {validationErrors.length - 5} more</li>
                )}
              </ul>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPreview}
                  onChange={(e) => setShowPreview(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-neutral-700">
                  Show grid preview
                </span>
              </label>
              {showPreview && (
                <button
                  type="button"
                  onClick={handleShufflePreview}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-neutral-50 transition"
                >
                  Shuffle Preview
                </button>
              )}
            </div>

            {showPreview && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
                <div className="grid grid-cols-4 gap-2">
                  {previewWords.map((word, index) => (
                    <Tile
                      key={index}
                      slot={{
                        kind: "word",
                        text: word || `Word ${index + 1}`,
                        selected: false,
                      }}
                      disabled
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <button
              type="button"
              onClick={handleGenerateLink}
              disabled={!isValid}
              className={`w-full py-3 rounded-lg font-medium transition ${
                isValid
                  ? "bg-neutral-900 text-white hover:bg-neutral-800"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              Generate Shareable Link
            </button>
          </div>

          {generatedLink && (
            <div className="border-t pt-6">
              <ShareLinkBox link={generatedLink} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
