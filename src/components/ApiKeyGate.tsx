'use client';

import { useState } from 'react';

interface Props { onKey: (key: string) => void; }

export function ApiKeyGate({ onKey }: Props) {
  const [value, setValue] = useState('');
  const [error, setError]  = useState('');

  const submit = () => {
    const k = value.trim();
    if (!k.startsWith('sk-ant-')) {
      setError('Kein gültiger Anthropic API-Key (muss mit sk-ant- beginnen)');
      return;
    }
    onKey(k);
  };

  return (
    <div className="gate">
      <div className="gate__box">
        <div className="gate__title">CLAUDE CHAT</div>
        <p className="gate__sub">
          Dein API-Key wird nur im Browser gespeichert (localStorage) und nie übertragen.
        </p>
        <input
          className="gate__input"
          type="password"
          placeholder="sk-ant-api03-..."
          value={value}
          onChange={e => { setValue(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          autoFocus
        />
        {error && <p className="gate__error">{error}</p>}
        <button className="gate__btn" onClick={submit}>Verbinden →</button>
        <p className="gate__hint">
          Key holen:{' '}
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">
            console.anthropic.com
          </a>
        </p>
      </div>
    </div>
  );
}
