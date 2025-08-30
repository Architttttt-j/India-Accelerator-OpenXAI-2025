"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setHistory([...history, { type: "user", text: input }]);
    setInput("");

    // placeholder for backend summary response
    setTimeout(() => {
      setHistory((prev) => [
        ...prev,
        { type: "ai", text: "This is a placeholder summary from backend." },
      ]);
    }, 500);
  };

  return (
    <div className={darkMode ? "bg-gray-900 text-white h-screen flex" : "bg-white text-black h-screen flex"}>
      {/* Sidebar */}
      <div className="w-1/4 border-r p-4 overflow-y-auto">
        <h2 className="font-bold mb-2">History</h2>
        {history.map((item, idx) => (
          <div key={idx} className={item.type === "user" ? "text-blue-500" : "text-green-500"}>
            {item.text}
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="font-bold">Voice Note Summarizer</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 border rounded"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {history.map((item, idx) => (
            <div
              key={idx}
              className={`my-2 ${item.type === "user" ? "text-right" : "text-left"}`}
            >
              <span
                className={`inline-block px-3 py-2 rounded ${
                  item.type === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or upload a voice note..."
            className="flex-1 border px-3 py-2 rounded"
          />
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">
            Send
          </button>
          <button className="border px-3 py-2 rounded">🎤</button>
        </div>
      </div>
    </div>
  );
}
