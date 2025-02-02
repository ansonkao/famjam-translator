"use client";

import { useState } from "react";

export function TranslationBox() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<{
    responseMs: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setMetrics(null);

    const start = performance.now();
    const response = await fetch("/api/speech", {
      method: "POST",
      body: JSON.stringify({ text: inputText }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      setIsLoading(false);
      return;
    }

    // Create audio element and set source to stream URL
    const audio = new Audio();
    audio.src = URL.createObjectURL(await response.blob());

    // Start playing as soon as enough data is buffered
    audio.addEventListener("canplay", () => {
      audio.playbackRate = 0.8;
      void audio.play();
      setIsLoading(false);
    });

    setMetrics({
      responseMs: Math.round(performance.now() - start),
    });

    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type something in English..."
          className="h-32 w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Translating...</span>
            </div>
          ) : (
            "Translate and Speak"
          )}
        </button>
      </form>

      {metrics && (
        <div className="mt-4 flex gap-8 text-sm text-gray-300">
          <p>
            <span className="text-gray-400">Response Time:</span>{" "}
            {(metrics.responseMs / 1000).toFixed(2)}s
          </p>
        </div>
      )}
    </div>
  );
}
