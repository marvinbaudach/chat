# Claude Chat

**Live demo → [klosterfrau123.github.io/chat](https://klosterfrau123.github.io/chat/)**

A minimal Claude chat interface with streaming, markdown rendering, and syntax highlighting. Bring your own Anthropic API key — it stays in your browser (localStorage), nothing is sent to any server.

## Features

- Token-by-token streaming with blinking cursor
- Markdown rendering — headings, lists, blockquotes, inline code
- Syntax-highlighted code blocks with copy button
- Auto-resizing textarea (Enter to send, Shift+Enter for newline)
- Stop button to abort a running stream
- 6 frontend-focused starter prompts
- API key stored in localStorage, never leaves the browser

## Tech

| | |
|---|---|
| LLM | Anthropic Claude (claude-sonnet-4-6) |
| Streaming | `@anthropic-ai/sdk` with `dangerouslyAllowBrowser` |
| Markdown | `react-markdown` + `remark-gfm` |
| Highlighting | `react-syntax-highlighter` (Prism, oneDark) |
| Framework | Next.js (App Router, static export) |
| Language | TypeScript |
| Hosting | GitHub Pages via GitHub Actions |

## Local Development

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000) and enter your Anthropic API key.

## Build & Export

```bash
npm run build                    # local build
GITHUB_PAGES=true npm run build  # static export for GitHub Pages (output: out/)
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # entry point
│   ├── layout.tsx        # metadata
│   └── globals.css       # all styles
├── components/
│   ├── ChatApp.tsx       # root component, state, send/stream logic
│   ├── ChatMessage.tsx   # message with markdown + syntax highlighting
│   ├── ApiKeyGate.tsx    # key input screen
│   └── StarterPrompts.tsx # preset prompt grid
└── lib/
    ├── stream.ts         # Anthropic streaming wrapper
    └── prompts.ts        # starter prompt data
```
