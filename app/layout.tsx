import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'SubForge AI',
  description: 'Serverless BDSM kink customizer — powered by Puter SD3/SDXL + Next.js 15',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Puter.js — client-side Stable Diffusion (SD3 & SDXL), no API key required */}
        <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
