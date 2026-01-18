import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";

export function Home() {
  const [linkInput, setLinkInput] = useState("");
  const navigate = useNavigate();

  const handlePlayFromLink = () => {
    const trimmed = linkInput.trim();
    if (!trimmed) return;

    let payload = "";

    // Extract payload from various URL formats
    if (trimmed.includes("?p=")) {
      // Full URL with query param: ...#/play?p=payload
      const match = trimmed.match(/[?&]p=([^&]+)/);
      if (match) payload = match[1];
    } else if (trimmed.startsWith("p=")) {
      payload = trimmed.slice(2);
    } else {
      // Assume it's just the raw payload
      payload = trimmed;
    }

    if (payload) {
      navigate(`/play?p=${payload}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo size={48} />
            <h1 className="text-4xl font-bold text-neutral-900">
              Categories
            </h1>
          </div>
          <p className="text-lg text-neutral-600">
            Create and share custom word puzzles with your friends
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Create a New Puzzle
            </h2>
            <p className="text-neutral-600 mb-6">
              Build a custom 4x4 word puzzle with 4 hidden groups
            </p>
            <Link
              to="/create"
              className="inline-block px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition"
            >
              Create Puzzle
            </Link>
          </div>

          <div className="text-center text-neutral-400">or</div>

          <div className="bg-neutral-50 rounded-2xl border p-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4 text-center">
              Play from Link
            </h2>
            <p className="text-neutral-600 mb-6 text-center">
              Paste a puzzle link shared by a friend
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste puzzle link here..."
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePlayFromLink()}
                className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400"
              />
              <button
                type="button"
                onClick={handlePlayFromLink}
                className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition"
              >
                Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
