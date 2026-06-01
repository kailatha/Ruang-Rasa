"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// react icons
import { HiArrowLeft } from "react-icons/hi2";
import { RiSendPlaneFill, RiRobot2Line, RiUserLine } from "react-icons/ri";

// shadcn ui
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import "./page.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// quick replies component
function QuickReplies({ options, onSelect, disabled }) {
  return (
    <div className="cb-quick-replies">
      {options.map((opt) => (
        <Button
          key={opt}
          variant="outline"
          size="sm"
          className="cb-chip"
          disabled={disabled}
          onClick={() => onSelect(opt)}
        >
          {opt}
        </Button>
      ))}
    </div>
  );
}

// single chat bubble bot dan user
function Bubble({ msg }) {
  const isBot = msg.role === "bot" || msg.role === "assistant";
  const isCrisis = msg.source === "crisis";

  return (
    <div className={`cb-row ${isBot ? "cb-row--bot" : "cb-row--user"}`}>
      {isBot && (
        <Avatar className={`cb-avatar ${isCrisis ? "cb-avatar--crisis" : ""}`}>
          <AvatarFallback className="cb-avatar-fallback">
            <RiRobot2Line size={14} />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={`cb-bubble ${isBot ? "cb-bubble--bot" : "cb-bubble--user"} ${
          isCrisis ? "cb-bubble--crisis" : ""
        }`}
      >
        {isCrisis && (
          <Badge variant="destructive" className="cb-crisis-badge">
            ⚠ Perhatian Penting
          </Badge>
        )}
        <p className="cb-bubble-text">{msg.content}</p>
        {msg.quickReplies?.length > 0 && (
          <QuickReplies
            options={msg.quickReplies}
            onSelect={msg.onQuickReply}
            disabled={msg.quickRepliesDisabled}
          />
        )}
        <span className="cb-time">
          {msg.timestamp
            ? new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </span>
      </div>

      {!isBot && (
        <Avatar className="cb-avatar cb-avatar--user">
          <AvatarFallback className="cb-avatar-fallback cb-avatar-fallback--user">
            <RiUserLine size={14} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

// typing indicator component
function TypingIndicator() {
  return (
    <div className="cb-row cb-row--bot">
      <Avatar className="cb-avatar">
        <AvatarFallback className="cb-avatar-fallback">
          <RiRobot2Line size={14} />
        </AvatarFallback>
      </Avatar>
      <div className="cb-bubble cb-bubble--bot cb-typing">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

// MAIN PAGE
export default function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const quickReplyState = useRef({});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    setMessages([
      {
        id: "greet",
        role: "bot",
        content:
          "Halo, senang bertemu kamu di sini. Aku ada untuk menemani dan mendengarkan apapun yang sedang kamu rasakan. Bagaimana perasaanmu hari ini?",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const addBotMessage = useCallback((content, extra = {}) => {
    const id = `bot-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id, role: "bot", content, timestamp: new Date().toISOString(), ...extra },
    ]);
    return id;
  }, []);

  const disableQuickReplies = useCallback((msgId) => {
    quickReplyState.current[msgId] = true;
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, quickRepliesDisabled: true } : m))
    );
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || isLoading) return;

      setInput("");
      setError(null);

      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          role: "user",
          content: trimmed,
          timestamp: new Date().toISOString(),
        },
      ]);

      setIsLoading(true);

      try {
        const body = { message: trimmed };
        if (sessionId) body.sessionId = sessionId;

        const res = await apiFetch("/chatbot/message", {
          method: "POST",
          body: JSON.stringify(body),
        });

        if (res.success && res.data) {
          const { sessionId: sid, answer, source } = res.data;
          if (sid && !sessionId) setSessionId(sid);

          const quickReplies = extractQuickReplies(answer);
          const cleanAnswer = stripQuickReplyMeta(answer);
          const botMsgId = `bot-${Date.now()}`;

          setMessages((prev) => [
            ...prev,
            {
              id: botMsgId,
              role: "bot",
              content: cleanAnswer,
              source,
              timestamp: new Date().toISOString(),
              ...(quickReplies.length > 0 && {
                quickReplies,
                quickRepliesDisabled: false,
                onQuickReply: (opt) => {
                  disableQuickReplies(botMsgId);
                  sendMessage(opt);
                },
              }),
            },
          ]);
        }
      } catch (err) {
        setError(err.message || "Terjadi kesalahan. Coba lagi.");
        addBotMessage("Maaf, ada gangguan teknis sebentar. Boleh ulangi pesanmu?");
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [input, isLoading, sessionId, addBotMessage, disableQuickReplies]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="cb-root">
      {/* header */}
      <header className="cb-header">
        <Button
          variant="ghost"
          size="icon"
          className="cb-back"
          onClick={() => window.history.back()}
          aria-label="Kembali"
        >
          <HiArrowLeft size={18} />
        </Button>

        <div className="cb-header-title">
          <div className="cb-header-dot" />
          <span>Chatbot</span>
        </div>

        <div className="cb-header-spacer" />
      </header>

      {/* messages */}
      <main className="cb-messages" role="log" aria-live="polite">
        <div className="cb-date-divider">
          <span>
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>

        {messages.map((msg) => (
          <Bubble key={msg.id} msg={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <p className="cb-error-toast" role="alert">
            {error}
          </p>
        )}

        <div ref={bottomRef} />
      </main>

      {/* footer */}
      <footer className="cb-footer">
        <a
          className="cb-crisis-link"
          href="https://www.intothelightid.org/tentang-bunuh-diri/hotline-bunuh-diri-di-indonesia/#:~:text=Apakah%20Into%20The%20Light%20Indonesia,jiwa%20atau%20pencegahan%20bunuh%20diri."
          target="_blank"
          rel="noopener noreferrer"
        >
          ✳ Hubungi Tenaga Ahli jika kamu membutuhkan bantuan medis
        </a>

        <div className="cb-input-row">
          <Textarea
            ref={inputRef}
            className="cb-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bagikan pemikiranmu..."
            rows={1}
            disabled={isLoading}
            aria-label="Pesan"
          />
          <Button
            size="icon"
            className="cb-send"
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            aria-label="Kirim pesan"
          >
            <RiSendPlaneFill size={14} />
          </Button>
        </div>
      </footer>
    </div>
  );
}

// ─helpers
function extractQuickReplies(text) {
  const match = text?.match(/\[QR:\s*(.+?)\]/);
  if (!match) return [];
  return match[1].split("|").map((s) => s.trim()).filter(Boolean);
}

function stripQuickReplyMeta(text) {
  return (text || "").replace(/\[QR:.*?\]/g, "").trim();
}
