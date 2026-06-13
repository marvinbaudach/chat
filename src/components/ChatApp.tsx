'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ApiKeyGate }    from './ApiKeyGate';
import { ChatMessage }   from './ChatMessage';
import { StarterPrompts } from './StarterPrompts';
import { streamChat, CHAT_MODEL, type Message } from '@/lib/stream';

const KEY_STORAGE = 'claude-chat-api-key';

export function ChatApp() {
  const [apiKey,    setApiKey]    = useState<string | null>(null);
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const abortRef    = useRef<(() => void) | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(KEY_STORAGE);
    if (stored) setApiKey(stored);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  const handleKey = (key: string) => {
    localStorage.setItem(KEY_STORAGE, key);
    setApiKey(key);
  };

  const resetKey = () => {
    localStorage.removeItem(KEY_STORAGE);
    setApiKey(null);
    setMessages([]);
  };

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming || !apiKey) return;

    setError(null);
    setInput('');

    const userMsg: Message = { role: 'user', content: trimmed };
    const next = [...messages, userMsg];
    setMessages([...next, { role: 'assistant', content: '' }]);
    setStreaming(true);

    abortRef.current = streamChat(apiKey, next, {
      onToken: token => setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: copy[copy.length - 1].content + token,
        };
        return copy;
      }),
      onDone:  () => { setStreaming(false); abortRef.current = null; },
      onError: err => { setError(err); setStreaming(false); abortRef.current = null; },
    });
  }, [apiKey, messages, streaming]);

  const stop = () => { abortRef.current?.(); abortRef.current = null; setStreaming(false); };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  };

  if (!apiKey) return <ApiKeyGate onKey={handleKey} />;

  return (
    <div className="chat">
      {/* Header */}
      <header className="chat__header">
        <span className="chat__title">CLAUDE CHAT</span>
        <div className="chat__header-right">
          <span className="chat__model">{CHAT_MODEL}</span>
          <button className="chat__reset" onClick={resetKey} title="API-Key entfernen">⌫</button>
        </div>
      </header>

      {/* Messages */}
      <div className="chat__messages">
        {messages.length === 0 && (
          <StarterPrompts onSelect={p => send(p)} />
        )}
        {messages.map((m, i) => (
          <ChatMessage
            key={i}
            message={m}
            streaming={streaming && i === messages.length - 1 && m.role === 'assistant'}
          />
        ))}
        {error && <p className="chat__error">⚠ {error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat__input-area">
        <textarea
          ref={textareaRef}
          className="chat__textarea"
          placeholder="Nachricht eingeben… (Enter senden, Shift+Enter Zeilenumbruch)"
          value={input}
          onChange={autoResize}
          onKeyDown={onKeyDown}
          disabled={streaming}
          rows={1}
        />
        {streaming ? (
          <button className="chat__send chat__send--stop" onClick={stop}>■ Stop</button>
        ) : (
          <button className="chat__send" onClick={() => send(input)} disabled={!input.trim()}>
            Senden ↵
          </button>
        )}
      </div>
    </div>
  );
}
