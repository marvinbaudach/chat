'use client';

import { STARTER_PROMPTS } from '@/lib/prompts';

interface Props { onSelect: (prompt: string) => void; }

export function StarterPrompts({ onSelect }: Props) {
  return (
    <div className="starters">
      <p className="starters__label">— Themen —</p>
      <div className="starters__grid">
        {STARTER_PROMPTS.map(p => (
          <button key={p.label} className="starter-btn" onClick={() => onSelect(p.prompt)}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
