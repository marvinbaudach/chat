import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Claude Chat',
  description: 'Minimal Claude chat interface with streaming and syntax highlighting',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
