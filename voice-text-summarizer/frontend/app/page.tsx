"use client";
import React, { useState, useRef, useEffect } from "react";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState<{ id: number; label: string; url: string }[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Typing effect for title
  const [displayText, setDisplayText] = useState("");
  const text = "V!oice Note Summarizer";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      setShowSummary(true);
      addToHistory("Recorded Audio", url);
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setShowSummary(true);
      addToHistory(file.name, url);
    }
  };

  const addToHistory = (label: string, url: string) => {
    setHistory((prev) => [
      ...prev,
      { id: Date.now(), label, url },
    ]);
  };

  const handleHistoryClick = (url: string) => {
    setAudioUrl(url);
    setShowSummary(true);
  };

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      {/* Sidebar for history */}
      <aside className="sidebar">
        <h2 className="sidebar-title">History</h2>
        <ul className="history-list">
          {history.length === 0 && <p className="empty-history">No history yet</p>}
          {history.map((item) => (
            <li
              key={item.id}
              className="history-item"
              onClick={() => handleHistoryClick(item.url)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Mode Toggle */}
        <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Title */}
        <h1 className="typing-title">{displayText}</h1>

        {/* Summary Section */}
        {showSummary && (
          <div className="summary-box">
            {audioUrl && <audio controls src={audioUrl} className="audio-player" />}
            <p className="summary-text">
              ✨ AI Summary will appear here after processing your audio...
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="button-container">
          {!isRecording ? (
            <button className="mic-btn pulse" onClick={startRecording}>
              🎤 Start Recording
            </button>
          ) : (
            <button className="stop-btn recording" onClick={stopRecording}>
              ⏹ Stop Recording
            </button>
          )}

          <label className="upload-label">
            📂 Upload Audio
            <input type="file" accept="audio/*" onChange={handleFileUpload} />
          </label>
        </div>
      </div>
    </div>
  );
}
