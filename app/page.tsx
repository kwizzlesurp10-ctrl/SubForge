'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SubForge() {
  const [submission, setSubmission] = useState(5);
  const [imageUrl, setImageUrl] = useState('');
  const [power, setPower] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const [error, setError] = useState('');

  const buildPrompt = (level: number): string => {
    const base = `ultra-detailed 8k hyperrealistic kink customizer mechanics view for the Gay AI Agent app, holographic scene of a dominant leather daddy flogging and spanking a bound twink sub, the twink caged yet leaking as the daddy alternates power in his hole, power-exchange meter filling with each slap, sweat and tears of pleasure, (BDSM power gay mechanics:1.6), dark leather club UI neon, hyperrealistic anatomy, 8k`;
    let prompt = base;
    if (level >= 5) prompt += ', glowing chains wrapping limbs, shiny nipple clamps, heavy ball stretchers';
    if (level >= 8) prompt += ', thick glowing chains, extreme ball stretchers, visible tears of pleasure';
    if (level >= 10) prompt += ', maximum power-exchange meter glowing red, full submission, leaking profusely';
    return prompt;
  };

  const generateImage = async (prompt: string): Promise<string> => {
    const result = await puter.ai.image.generate({
      model: 'stable-diffusion-3-medium',
      prompt,
    });
    if (result.image instanceof Blob) {
      return URL.createObjectURL(result.image);
    }
    return result.image as string;
  };

  const generate = async (level: number) => {
    setLoading(true);
    setError('');
    try {
      const url = await generateImage(buildPrompt(level));
      setImageUrl((prev) => {
        if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        return url;
      });
      setPower((prev) => Math.min(100, prev + 15));
    } catch (err) {
      console.error(err);
      setError('Image generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => generate(submission), 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submission]);

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
        Serverless Kink Customizer v1.0 &bull; Powered by fal.ai
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
                <div className="text-sm mt-2 text-lime-300">SUBMISSION LEVEL: {submission}</div>
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
