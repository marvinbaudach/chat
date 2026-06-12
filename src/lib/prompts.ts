export interface StarterPrompt {
  label: string;
  prompt: string;
}

export const STARTER_PROMPTS: StarterPrompt[] = [
  {
    label: 'useMemo vs useCallback',
    prompt: 'Was ist der Unterschied zwischen useMemo und useCallback in React? Wann verwende ich welches?',
  },
  {
    label: 'SSR · SSG · ISR',
    prompt: 'Erkläre den Unterschied zwischen SSR, SSG und ISR in Next.js — mit konkreten Anwendungsfällen.',
  },
  {
    label: 'TypeScript Generics',
    prompt: 'Erkläre TypeScript Generics an einem praktischen React-Beispiel.',
  },
  {
    label: 'CSS Container Queries',
    prompt: 'Was sind CSS Container Queries und wie unterscheiden sie sich von Media Queries?',
  },
  {
    label: 'Web Vitals optimieren',
    prompt: 'Welche konkreten Massnahmen verbessern LCP, CLS und INP am stärksten?',
  },
  {
    label: 'React Server Components',
    prompt: 'Wann sollte ich React Server Components verwenden und wann Client Components?',
  },
];
