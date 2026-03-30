'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SubForge() {
  const [submission, setSubmission] = useState(5);
  const [imageUrl, setImageUrl] = useState('');
  const [power, setPower] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  const generate = async (level: number) => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionLevel: level, intensity: 10 }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        setPower((prev) => Math.min(100, prev + 15));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => generate(submission), 800);
    return () => clearTimeout(timer);
  }, [submission]);

  const handleShare = () => {
    const text = `My Submission Level ${submission} scene in SubForge AI — who can take more? #GayKinkAI #SubForge`;
    navigator.clipboard.writeText(text).then(() => {
      setShareMsg('Copied to clipboard!');
      setTimeout(() => setShareMsg(''), 2000);
    });
  };

  return (
    <div className="bg-black text-lime-400 font-mono min-h-screen p-6 md:p-8 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ff00ff_1px,#000_1px)] bg-[length:40px_40px] opacity-10 pointer-events-none" />

      <h1 className="neon-text text-4xl md:text-6xl font-bold tracking-[0.3em] text-center mb-2">
        SUBFORGE AI
      </h1>
      <p className="text-center text-xs tracking-widest text-lime-300 mb-8 opacity-70">
        SERVERLESS KINK CUSTOMIZER v1.0
      </p>

      <div className="max-w-4xl mx-auto">
        {/* Image display */}
        <div className="neon-border rounded-xl overflow-hidden relative mb-8 min-h-[300px] md:min-h-[500px] flex items-center justify-center bg-zinc-950">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
              <div className="text-center">
                <div className="text-2xl font-bold neon-text animate-pulse">GENERATING 8K HYPERREAL...</div>
                <div className="text-sm mt-2 text-lime-300">SUBMISSION LEVEL: {submission}</div>
              </div>
            </div>
          )}
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`SubForge Scene Level ${submission}`}
              width={1024}
              height={1024}
              className="w-full h-auto rounded-xl"
              priority
            />
          ) : !loading ? (
            <div className="text-center p-12">
              <div className="text-3xl neon-text mb-4">⚡ SUBFORGE READY</div>
              <div className="text-sm text-lime-300">Adjust the slider to generate your scene</div>
            </div>
          ) : null}
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Submission slider */}
          <div className="neon-border rounded-xl p-6">
            <label className="block text-lg font-bold mb-2">
              SUBMISSION LEVEL: <span className="neon-text text-2xl">{submission}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={submission}
              onChange={(e) => setSubmission(Number(e.target.value))}
              className="w-full accent-lime-400 cursor-pointer"
            />
            <div className="flex justify-between text-xs mt-1 text-lime-300 opacity-70">
              <span>GENTLE</span>
              <span>EXTREME</span>
            </div>
            <p className="text-xs text-lime-300 mt-3 opacity-80">
              {submission >= 8
                ? '⚠️ MAX GEAR: chains, clamps, stretchers, full exchange'
                : submission >= 5
                ? '🔗 CHAINED: glowing restraints + nipple clamps'
                : '🌚 Entry level: leather + restraints'}
            </p>
          </div>

          {/* Power exchange meter */}
          <div className="neon-border rounded-xl p-6">
            <label className="block text-lg font-bold mb-4">
              POWER EXCHANGE METER
            </label>
            <div className="relative h-6 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="power-bar absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${power}%` }}
              />
            </div>
            <div className="text-right mt-2">
              <span className="text-xl font-bold neon-text">{power}%</span>
            </div>
            <p className="text-xs text-lime-300 mt-2 opacity-70">
              Fills with each generation. At 100% — full surrender.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => generate(submission)}
            disabled={loading}
            className={`generate-btn flex-1 py-4 px-8 text-xl rounded-xl disabled:opacity-50 ${
              submission >= 10 ? 'maxed' : ''
            }`}
          >
            {loading
              ? '⏳ GENERATING...'
              : submission >= 10
              ? '🔥 MAXED OUT — GENERATE AGAIN'
              : '⚡ GENERATE SCENE (TIME-WASTE MODE)'}
          </button>

          <button
            onClick={handleShare}
            className="border-2 border-lime-400 text-lime-400 py-4 px-8 text-sm rounded-xl hover:bg-lime-400 hover:text-black transition font-bold tracking-widest"
          >
            {shareMsg || '📊 SHARE SCENE'}
          </button>
        </div>

        {/* Freemium gate */}
        {power >= 45 && (
          <div className="mt-8 border-2 border-pink-500 rounded-xl p-6 bg-pink-500/10 text-center">
            <div className="text-xl font-bold text-pink-400 mb-2">
              🔓 UNLOCK UNLIMITED GENERATIONS
            </div>
            <p className="text-sm text-pink-300 mb-4">
              You&apos;ve hit the free limit. Upgrade for unlimited 8K gens, video loops, and Gay AI Agent roleplay.
            </p>
            <button className="bg-pink-500 text-black font-black py-3 px-12 text-lg rounded-xl hover:scale-105 transition tracking-widest">
              UPGRADE — $14.99/MO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
