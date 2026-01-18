import { useState } from "react";

type ShareLinkBoxProps = {
  link: string;
};

export function ShareLinkBox({ link }: ShareLinkBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-neutral-700">
        Share this link with your friend:
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={link}
          className="flex-1 px-3 py-2 border rounded-lg text-sm bg-neutral-50 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
