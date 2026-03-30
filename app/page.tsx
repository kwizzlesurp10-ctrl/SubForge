'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PUTER_MODELS, buildPrompt, type PuterModel } from '../lib/puter-generate';

export default function SubForge() {
  const [submission, setSubmission] = useState(5);
  const [imageUrl, setImageUrl] = useState('');
  const [power, setPower] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const [error, setError] = useState('');
  const [puterModel, setPuterModel] = useState<PuterModel>('sd3');
  const [activeEngine, setActiveEngine] = useState('');

  const generate = useCallback(async (level: number) => {
    setLoading(true);
    setError('');
    try {
      let newImageUrl: string;

      // Primary: client-side generation via Puter (SD3 or SDXL — no API key)
      if (typeof window !== 'undefined' && window.puter?.ai?.txt2img) {
        const imgEl = await window.puter.ai.txt2img(buildPrompt(level), {
          model: PUTER_MODELS[puterModel],
          negative_prompt: 'ugly, deformed, blurry, low quality, watermark, text, logo',
        });
        newImageUrl = imgEl.src;
        setActiveEngine(puterModel === 'sd3' ? 'PUTER SD3' : 'PUTER SDXL');
      } else {
        // Fallback: server-side FAL.ai route (requires FAL_KEY env var)
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionLevel: level }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Generation failed');
        }
        newImageUrl = data.imageUrl;
        setActiveEngine('FAL.AI');
      }

      setImageUrl((prev) => {
        if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        return newImageUrl;
      });
      setPower((prev) => Math.min(100, prev + 15));
    } catch (err) {
      console.error(err);
      setError('Image generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [puterModel]);

  useEffect(() => {
    const timer = setTimeout(() => generate(submission), 800);
    return () => clearTimeout(timer);
  }, [submission, generate]);

  useEffect(() => {
    return () => {
      if (imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = () => {
    const text = `My Submission Level ${submission} scene in SubForge AI #GayKinkAI #SubForge`;
    navigator.clipboard.writeText(text).then(() => {
      setShareMsg('Copied!');
      setTimeout(() => setShareMsg(''), 2000);
    });
  };

  return (
    <div className="bg-black text-lime-400 font-mono min-h-screen p-6 md:p-8 relative overflow-hidden">
      {/* Neon grid background - CSS only */}
      <div className="absolute inset-0 bg-[radial-gradient(#ff00ff_1px,#000_1px)] bg-[length:40px_40px] opacity-10 pointer-events-none" />
      {/* Neon scan-line overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(163,230,53,0.03) 2px, rgba(163,230,53,0.03) 4px)' }} />

      <h1 className="neon-text text-4xl md:text-6xl font-black tracking-[0.3em] text-center mb-1">
        SUBFORGE AI
      </h1>
      <p className="text-center text-xs tracking-[0.5em] text-lime-300/60 mb-8 uppercase">
        Serverless Kink Customizer v1.0 &bull; Puter SD3 / SDXL + fal.ai
      </p>

      <div className="max-w-4xl mx-auto">
        {/* Image display */}
        <div className="neon-border rounded-xl overflow-hidden relative mb-8 min-h-[300px] md:min-h-[500px] flex items-center justify-center bg-zinc-950">
          {/* Holographic corner accents - CSS only */}
          <span className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-lime-400" />
          <span className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-lime-400" />
          <span className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-lime-400" />
          <span className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-lime-400" />

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/70">
              <div className="text-center">
                <div className="text-2xl font-bold neon-text animate-pulse">GENERATING 8K HYPERREAL...</div>
                <div className="text-sm mt-2 text-lime-300">
                  {puterModel === 'sd3' ? 'PUTER SD3' : 'PUTER SDXL'} &bull; SUBMISSION LEVEL: {submission}
                </div>
                <div className="mt-4 flex gap-2 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-8 bg-lime-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
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
              unoptimized
            />
          ) : !loading ? (
            <div className="text-center p-12">
              <div className="text-5xl mb-4">⚡</div>
              <div className="text-3xl neon-text mb-2">SUBFORGE READY</div>
              <div className="text-sm text-lime-300/70">Adjust the slider to generate your scene</div>
            </div>
          ) : null}
        </div>

        {error && (
          <div className="border-2 border-red-500/60 rounded-xl p-4 mb-6 bg-red-500/10 text-center text-red-400 text-sm font-bold tracking-wide">
            ⚠️ {error}
          </div>
        )}

        {/* Controls grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Submission slider */}
          <div className="neon-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm tracking-widest uppercase">Submission Level</span>
              <span className="neon-text text-3xl font-black">{submission}</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={submission}
              onChange={(e) => setSubmission(Number(e.target.value))}
              className="w-full accent-lime-400 cursor-pointer h-2"
            />
            <div className="flex justify-between text-xs mt-2 text-lime-300/60">
              <span>GENTLE</span>
              <span>EXTREME</span>
            </div>
            <p className="text-xs text-lime-300/80 mt-3 border-t border-lime-400/20 pt-3">
              {submission >= 8
                ? '⚠️ MAX: chains + clamps + stretchers + full power exchange'
                : submission >= 5
                ? '🔗 MID: glowing restraints + nipple clamps'
                : '🌚 ENTRY: leather + light restraints'}
            </p>
          </div>

          {/* Power exchange meter */}
          <div className="neon-border rounded-xl p-6">
            <div className="text-sm tracking-widest uppercase mb-4">Power Exchange Meter</div>
            <div className="relative h-8 bg-zinc-900 rounded-full overflow-hidden mb-2">
              <div
                className="power-bar absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${power}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black/80">
                {power > 20 ? `${power}% FILLED` : ''}
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black neon-text">{power}%</span>
            </div>
            <p className="text-xs text-lime-300/60 mt-2">
              Fills with each gen. At 100% — full surrender unlocked.
            </p>
          </div>
        </div>

        {/* Puter model selector */}
        <div className="neon-border rounded-xl p-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs tracking-widest uppercase text-lime-300/70 flex-shrink-0">AI Engine:</span>
            {(Object.keys(PUTER_MODELS) as PuterModel[]).map((m) => (
              <button
                key={m}
                onClick={() => setPuterModel(m)}
                className={`px-4 py-1 text-xs font-bold rounded-full border transition-all ${
                  puterModel === m
                    ? 'border-lime-400 bg-lime-400 text-black'
                    : 'border-lime-400/40 text-lime-400/60 hover:border-lime-400/70 hover:text-lime-400'
                }`}
              >
                {m === 'sd3' ? 'SD3 (Stable Diffusion 3)' : 'SDXL (Stable Diffusion XL)'}
              </button>
            ))}
            {activeEngine && (
              <span className="ml-auto text-xs text-lime-300/40 tracking-widest">
                LAST: {activeEngine}
              </span>
            )}
          </div>
          <p className="text-xs text-lime-300/40 mt-2">
            Powered by Puter — 100% client-side, no API key required. Falls back to fal.ai if unavailable.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => generate(submission)}
            disabled={loading}
            className={`generate-btn flex-1 py-4 px-8 text-xl rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${
              submission >= 10 ? 'maxed' : ''
            }`}
          >
            {loading ? '⏳ GENERATING...' : submission >= 10 ? '🔥 MAXED — GENERATE AGAIN' : '⚡ GENERATE SCENE'}
          </button>

          <button
            onClick={handleShare}
            className="border-2 border-lime-400/60 text-lime-400 py-4 px-6 text-sm rounded-xl hover:bg-lime-400 hover:text-black transition-all font-bold tracking-widest"
          >
            {shareMsg || '📊 SHARE'}
          </button>
        </div>

        {/* Freemium upsell */}
        {power >= 45 && (
          <div className="border-2 border-pink-500/60 rounded-xl p-6 bg-pink-500/10 text-center">
            <div className="text-xl font-black text-pink-400 mb-2">🔓 UNLOCK UNLIMITED GENERATIONS</div>
            <p className="text-sm text-pink-300/80 mb-4">
              You&apos;ve hit the free limit. Upgrade for unlimited 8K gens + Gay AI Agent roleplay.
            </p>
            <button className="bg-pink-500 text-black font-black py-3 px-12 text-lg rounded-xl hover:scale-105 transition-all tracking-widest">
              UPGRADE — $14.99/MO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
