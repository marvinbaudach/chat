'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
import type { Message } from '@/lib/stream';

interface Props {
  message: Message;
  streaming?: boolean;
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button className="copy-btn" onClick={copy}>
      {copied ? '✓ Kopiert' : 'Kopieren'}
    </button>
  );
}

export function ChatMessage({ message, streaming }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`msg msg--${isUser ? 'user' : 'assistant'}`}>
      <span className="msg__prefix">{isUser ? '>' : '~'}</span>
      <div className="msg__body">
        {isUser ? (
          <span className="msg__user-text">{message.content}</span>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className ?? '');
                const code  = String(children).replace(/\n$/, '');
                if (match) {
                  return (
                    <div className="code-block">
                      <div className="code-block__header">
                        <span className="code-block__lang">{match[1]}</span>
                        <CopyButton code={code} />
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: '0 0 6px 6px', fontSize: '0.78rem' }}
                      >
                        {code}
                      </SyntaxHighlighter>
                    </div>
                  );
                }
                return <code className="inline-code" {...props}>{children}</code>;
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        {streaming && <span className="cursor" />}
      </div>
    </div>
  );
}
