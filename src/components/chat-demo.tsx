import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

type Message = {
  role: "user" | "ai";
  content: string;
};

const suggestions = [
  "I am new in investing. Can you explain it's working?",
  "What are Stocks?",
  "How does CryptoCurrency work?",
];

// Helper component to render AI message with bullet points and numbered lists
const RenderAIResponse: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split("\n");

  const elements: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let isOrdered = false;

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      if (isOrdered) {
        elements.push(
          <ol
            key={elements.length}
            style={{ paddingLeft: "1.25rem", marginTop: 0, marginBottom: "0.75rem" }}
          >
            {bulletBuffer.map((line, i) => (
              <li key={i}>{line.replace(/^\d+\.\s*/, "")}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul
            key={elements.length}
            style={{ paddingLeft: "1.25rem", marginTop: 0, marginBottom: "0.75rem" }}
          >
            {bulletBuffer.map((line, i) => (
              <li key={i}>{line.replace(/^[-*]\s*/, "")}</li>
            ))}
          </ul>
        );
      }
      bulletBuffer = [];
      isOrdered = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    const isUnorderedBullet = /^[-*]\s+/.test(trimmed);
    const isOrderedBullet = /^\d+\.\s+/.test(trimmed);

    if (isUnorderedBullet || isOrderedBullet) {
      if (bulletBuffer.length === 0) {
        isOrdered = isOrderedBullet;
      }
      bulletBuffer.push(trimmed);
    } else {
      flushBullets();
      if (trimmed) {
        elements.push(
          <p key={elements.length} style={{ marginTop: 0, marginBottom: "0.75rem", whiteSpace: "pre-wrap" }}>
            {trimmed}
          </p>
        );
      }
    }
  });
  flushBullets();

  return <>{elements}</>;
};

const ChatDemo: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (message: string) => {
    const trimmedMessage = message.trim();
    if (trimmedMessage === "") return;

    setMessages((prev) => [...prev, { role: "user", content: trimmedMessage }]);
    setLoading(true);
    try {
      const response = await axios.post("/api/chat", {
        messages: [{ role: "user", content: trimmedMessage }],
      });
      setMessages((prev) => [...prev, { role: "ai", content: response.data.response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const displayMessages = async () => {
    if (userMessage.trim() === "") return;
    await sendMessage(userMessage);
    setUserMessage("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const showSuggestions = messages.filter((m) => m.role === "user").length === 0;

  return (
    <div
      style={{
        background: "#11111C",
        minHeight: "90vh",
        color: "#fff",
        fontFamily: "Serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", fontStyle: "italic", fontWeight: "bold" }}>
        FinGenius AI
      </h1>
      <h2 style={{ fontSize: "1rem", marginBottom: "1rem", fontWeight: "bold" }}>
        Your AI finance Guide{" "}
        <span role="img" aria-label="money">
          🧑‍💻💲
        </span>
      </h2>

      {showSuggestions ? (
        <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              style={cardStyle}
              onClick={() => sendMessage(suggestion)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  sendMessage(suggestion);
                }
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      ) : (
        <div
          ref={chatContainerRef}
          style={{
            width: "70%",
            height: "400px", // fixed height for internal scroll
            background: "#181828",
            borderRadius: "12px",
            padding: "1rem 2rem",
            overflowY: "auto",
            marginBottom: "0.5rem",
            boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          }}
        >
          {messages.length === 0 && (
            <div style={{ color: "#888", textAlign: "center", paddingTop: "3rem" }}>
              No messages yet. Ask me anything!
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: "1rem", textAlign: msg.role === "user" ? "right" : "left" }}>
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: msg.role === "user" ? "#3A3B5B" : "#2F9E44",
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "18px",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  whiteSpace: "normal",
                }}
              >
                {msg.role === "ai" ? <RenderAIResponse text={msg.content} /> : msg.content}
              </span>
            </div>
          ))}
          {loading && (
            <div style={{ color: "#ccc", fontStyle: "italic", marginTop: "0.5rem" }}>
              AI is typing...
            </div>
          )}
        </div>
      )}

      <div
        style={{
          width: "70%",
          background: "#181828",
          borderRadius: "12px",
          padding: "0.5rem 1rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Ask AI..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "1rem",
            outline: "none",
            padding: "0.75rem",
          }}
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) displayMessages();
          }}
          disabled={loading}
        />
        <button
          style={{
            background: "#212133",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.5rem 1rem",
            marginLeft: "0.5rem",
            cursor: userMessage.trim() === "" || loading ? "not-allowed" : "pointer",
          }}
          onClick={displayMessages}
          disabled={userMessage.trim() === "" || loading}
          aria-label="Send message"
        >
          ⬆
        </button>
      </div>

      <footer style={{ color: "#bbbbbb", fontStyle: "italic" }}>
        Powered by <span style={{ fontWeight: "bold" }}>MyFinance</span>
      </footer>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  background: "#181828",
  borderRadius: "12px",
  color: "#fff",
  padding: "1.5rem 2rem",
  fontSize: "1.15rem",
  width: "330px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
  cursor: "pointer",
  textAlign: "center",
  userSelect: "none",
};

export default ChatDemo;
