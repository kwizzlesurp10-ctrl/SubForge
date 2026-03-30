import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SubForge AI',
  description: 'Serverless BDSM kink customizer — powered by fal.ai + Next.js 15',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
