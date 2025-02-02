"use client";

import { useState } from "react";

type Message = {
  text: string;
  timestamp: Date;
  responseTime: number;
  status: "loading" | "complete";
};

export function TranslationBox() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [metrics, setMetrics] = useState<{
    responseMs: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const start = performance.now();

    // Add message to history immediately with loading status
    setMessages((prev) => [
      ...prev,
      {
        text: inputText,
        timestamp: new Date(),
        responseTime: 0,
        status: "loading",
      },
    ]);

    // Clear input immediately
    setInputText("");

    const response = await fetch("/api/speech", {
      method: "POST",
      body: JSON.stringify({ text: inputText }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
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

    const responseTime = performance.now() - start;
    setMetrics({ responseMs: Math.round(responseTime) });

    // Update the message with complete status and response time
    setMessages((prev) => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (!lastMessage) return prev;

      newMessages[newMessages.length - 1] = {
        text: lastMessage.text,
        timestamp: lastMessage.timestamp,
        responseTime: Math.round(responseTime),
        status: "complete",
      };
      return newMessages;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(e);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-4">
      {messages.length > 0 && (
        <div className="mb-8 space-y-4 rounded-lg bg-gray-800/50 p-4">
          {messages.map((msg, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex-1">
                <p className="text-xl text-white">{msg.text}</p>
                {msg.status === "loading" ? (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                    <span>Generating audio...</span>
                  </div>
                ) : (
                  <p className="mt-0 text-xs text-gray-400">
                    Generated in {(msg.responseTime / 1000).toFixed(2)}s
                  </p>
                )}
              </div>
              {msg.status === "loading" ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              ) : (
                <button
                  onClick={() => {
                    void fetch("/api/speech", {
                      method: "POST",
                      body: JSON.stringify({ text: msg.text }),
                      headers: { "Content-Type": "application/json" },
                    }).then(async (res) => {
                      if (!res.ok) return;
                      const audio = new Audio();
                      audio.src = URL.createObjectURL(await res.blob());
                      audio.playbackRate = 0.8;
                      void audio.play();
                    });
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:scale-105 hover:bg-blue-700 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type something in English..."
          className="h-32 w-full rounded-lg border border-gray-700 bg-gray-800 p-4 text-xl text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Translate and Speak
        </button>
      </form>
    </div>
  );
}
