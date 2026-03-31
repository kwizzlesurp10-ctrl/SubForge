'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PUTER_MODELS, NEGATIVE_PROMPT, buildPrompt, type PuterModel, type PromptStyle } from '../lib/puter-generate';
import { FalButton, PuterButton, FluxButton } from '../components/AIButtons';

type Provider = 'puter' | 'fal' | 'flux';

const clampPower = (value: number) => Math.min(100, Math.max(0, value));

export default function SubForge() {
  const [submission, setSubmission] = useState(5);
  const [imageUrl, setImageUrl] = useState('');
  const [power, setPower] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('subforge_power');
      if (saved !== null) {
        const parsed = Number(saved);
        if (Number.isFinite(parsed)) {
          setPower(clampPower(parsed));
        }
      }
    }
  }, []);
  const [loading, setLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const [error, setError] = useState('');
  const [puterModel, setPuterModel] = useState<PuterModel>('sd3');
  const [selectedProvider, setSelectedProvider] = useState<Provider>('puter');
  const [promptStyle, setPromptStyle] = useState<PromptStyle>('bdsm');
  const [activeEngine, setActiveEngine] = useState('');

  const generate = useCallback(async (level: number) => {
    setLoading(true);
    setError('');
    try {
      let newImageUrl: string;

      // Primary logic based on selectedProvider
      if (selectedProvider === 'puter' && typeof window !== 'undefined' && window.puter?.ai?.txt2img) {
        const imgEl = await window.puter.ai.txt2img(buildPrompt(level, promptStyle), {
          model: PUTER_MODELS[puterModel],
          negative_prompt: NEGATIVE_PROMPT,
        });
        newImageUrl = imgEl.src;
        setActiveEngine(puterModel === 'sd3' ? 'PUTER SD3' : 'PUTER SDXL');
      } else {
        // Fallback to FAL.ai (either forced or if Puter unavailable)
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionLevel: level, style: promptStyle }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || 'Generation failed');
        }
        newImageUrl = data.imageUrl;
        setActiveEngine(selectedProvider === 'flux' ? 'FAL.AI FLUX' : 'FAL.AI');
      }

      setImageUrl((prev) => {
        if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        return newImageUrl;
      });
      setPower((prev) => {
        const next = clampPower(prev + 15);
        localStorage.setItem('subforge_power', String(next));
        return next;
      });
    } catch (err) {
      console.error(err);
      setError('Image generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [puterModel, selectedProvider, promptStyle]);

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
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setShareMsg('Copied!');
        setTimeout(() => setShareMsg(''), 2000);
      }).catch(() => {
        setShareMsg('Copy failed');
        setTimeout(() => setShareMsg(''), 2000);
      });
    } else {
      // Fallback for browsers without Clipboard API
      try {
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setShareMsg('Copied!');
        setTimeout(() => setShareMsg(''), 2000);
      } catch {
        setShareMsg('Copy failed');
        setTimeout(() => setShareMsg(''), 2000);
      }
    }
  };

  return (
    <div className="bg-black text-lime-400 min-h-screen relative overflow-x-hidden pt-12 pb-24 px-4 sm:px-6 md:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(163,230,53,0.15),transparent_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.8)),url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-400/50 to-transparent shadow-[0_0_20px_rgba(163,230,53,0.5)]" />

      {/* Main Container */}
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="mb-12 text-center">
          <div className="inline-block relative group mb-2">
            <h1 className="neon-text text-5xl md:text-8xl tracking-[0.2em] font-black italic relative z-10 pointer-events-none select-none">
              SUBFORGE
            </h1>
            <div className="absolute inset-0 blur-2xl bg-lime-400/20 rounded-full group-hover:bg-lime-400/30 transition-all" />
          </div>
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-lime-400/60 to-transparent" />
            <p className="text-xs uppercase tracking-[0.5em] text-lime-300/40 font-bold">
              Autonomous Kink Interface v2.2 // Neural Forge Ready
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-lime-400/60 to-transparent" />
          </div>
        </header>

        {/* Global Alert Notification (Terminal Style) */}
        <div className="mb-8 border border-lime-400/20 bg-lime-400/5 px-4 py-2 rounded-lg flex items-center gap-3 overflow-hidden">
          <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse shrink-0" />
          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest whitespace-nowrap overflow-hidden">
            [SYS_LOG] ENGINE: {activeEngine || 'INITIALIZING'} // STATUS: {loading ? 'PROCESSING_NEURAL_STREAM' : 'SYSTEM_IDLE'} // REGION: SUBMISSION_CORE
          </p>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Output Display */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6">
            <div className="neon-border rounded-2xl overflow-hidden relative group aspect-square bg-zinc-950/80 ring-1 ring-lime-400/10">
              
              {/* Corner Ornaments */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-lime-400/40 group-hover:border-lime-400/100 transition-all pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-lime-400/40 group-hover:border-lime-400/100 transition-all pointer-events-none" />

              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-md bg-black/60">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-lime-400/20 border-t-lime-400 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-black tracking-widest">
                      {submission}
                    </div>
                  </div>
                  <div className="mt-8 space-y-2 text-center px-8">
                    <p className="text-xl font-black neon-text tracking-[0.2em]">GENERATING_SCENE</p>
                    <div className="h-1 w-48 bg-zinc-900 rounded-full overflow-hidden mx-auto border border-lime-400/10">
                      <div className="h-full bg-lime-400 animate-[shimmer_0.8s_infinite] w-full" />
                    </div>
                    <p className="text-[10px] text-lime-300/40 uppercase tracking-widest leading-relaxed">
                      Compiling anatomical layers // Applying kink logic // Level {submission} // Provider: {selectedProvider}
                    </p>
                  </div>
                </div>
              )}

              {imageUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={imageUrl}
                    alt={`SubForge AI Level ${submission}`}
                    fill
                    className="object-cover transition-opacity duration-1000 opacity-0 data-[loaded=true]:opacity-100"
                    onLoadingComplete={(img) => img.setAttribute('data-loaded', 'true')}
                    priority
                    unoptimized
                  />
                  {/* Digital overlay text */}
                  <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-sm border border-lime-400/20 rounded text-[10px] font-bold tracking-widest uppercase text-lime-400/80">
                    Neural Output: SD3-XL-FORGE // H-RES: 1024x1024
                  </div>
                </div>
              ) : !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.05),transparent_70%)]">
                  <div className="text-6xl mb-6 opacity-30 group-hover:scale-110 transition-transform duration-700">⚡</div>
                  <h3 className="text-3xl font-black neon-text mb-4 opacity-70">FORGE READY</h3>
                  <p className="text-xs text-lime-300/40 leading-relaxed max-w-sm uppercase tracking-widest">
                    The SubForge AI is standing by. Adjust the submission parameters on the right to begin the neural generation sequence.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="border border-red-500/40 bg-red-500/5 text-red-400 p-4 rounded-xl text-xs font-bold tracking-[0.1em] flex items-center gap-3 animate-pulse">
                <span className="text-lg">⚠️</span>
                <span>ERROR DETECTED: {error} (Check network or provider status)</span>
              </div>
            )}
          </div>

          {/* Right Column: Controls */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
            
            {/* Control Panel: Submission & Style */}
            <div className="neon-border rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
                <svg className="w-12 h-12" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
                </svg>
              </div>

              <div className="flex justify-between items-end mb-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-lime-300/50 mb-1">Configuration</h4>
                  <p className="text-lg font-black tracking-widest">SUBMISSION_LEVEL</p>
                </div>
                <div className="text-4xl font-black neon-text transition-all group-hover:scale-110">{submission}</div>
              </div>

              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={submission}
                onChange={(e) => setSubmission(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-lime-400 mb-6 hover:ring-2 hover:ring-lime-400/20 transition-all border border-lime-400/10"
              />

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-lime-400/10">
                <button
                  onClick={() => setPromptStyle('bdsm')}
                  className={`px-4 py-3 text-[10px] font-bold rounded-lg border transition-all uppercase tracking-widest flex flex-col items-center gap-1 ${
                    promptStyle === 'bdsm'
                      ? 'border-lime-400 bg-lime-400/10 text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                      : 'border-white/5 text-white/40 hover:border-lime-400/40 hover:text-white/80'
                  }`}
                >
                  <span>BDSM CORE</span>
                  <span className="text-[8px] opacity-40">Original</span>
                </button>
                <button
                  onClick={() => setPromptStyle('classical')}
                  className={`px-4 py-3 text-[10px] font-bold rounded-lg border transition-all uppercase tracking-widest flex flex-col items-center gap-1 ${
                    promptStyle === 'classical'
                      ? 'border-lime-400 bg-lime-400/10 text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                      : 'border-white/5 text-white/40 hover:border-lime-400/40 hover:text-white/80'
                  }`}
                >
                  <span>ART STUDIO</span>
                  <span className="text-[8px] opacity-40">Classical</span>
                </button>
              </div>
            </div>

            {/* Control Panel: Progress & Provider */}
            <div className="neon-border rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-lime-300/50 mb-1">Power Exchange</h4>
                  <p className="text-lg font-black tracking-widest uppercase">METER_SYNC</p>
                </div>
                <div className="text-3xl font-black text-lime-400/80 transition-all">{power}%</div>
              </div>

              <div className="relative h-10 bg-zinc-950 rounded-lg overflow-hidden mb-6 border border-white/5 p-1">
                <div
                  className="power-bar absolute inset-y-1 left-1 rounded-md"
                  style={{ width: `calc(${power}% - 8px)` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-[0.3em] uppercase italic pointer-events-none drop-shadow-md">
                  {power >= 45 ? 'UNLEASHING_NEURAL_STORM' : 'ACCUMULATING_ENERGY'}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-lime-400/10">
                <span className="text-[8px] uppercase tracking-widest font-black text-lime-300/30 w-full mb-2">NEURAL_PROVIDER</span>
                <PuterButton onClick={() => setSelectedProvider('puter')} active={selectedProvider === 'puter'} />
                <FalButton onClick={() => setSelectedProvider('fal')} active={selectedProvider === 'fal'} />
                <FluxButton onClick={() => setSelectedProvider('flux')} active={selectedProvider === 'flux'} />
              </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col gap-4 mt-auto">
              <button
                onClick={() => generate(submission)}
                disabled={loading}
                className={`generate-btn py-5 px-8 text-2xl rounded-2xl shadow-xl flex items-center justify-center gap-4 group/btn ${
                  submission >= 10 ? 'maxed' : ''
                }`}
              >
                {loading ? (
                  <span className="animate-pulse">SYNCHRONIZING...</span>
                ) : (
                  <>
                    <span className="group-hover/btn:rotate-12 transition-transform duration-500">⚡</span>
                    <span>{submission >= 10 ? 'MAXED_SYNC' : 'GENERATE_SCENE'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="py-4 border border-lime-400/30 hover:border-lime-400 text-lime-400/60 hover:text-lime-400 rounded-xl transition-all text-[10px] font-black tracking-[0.5em] uppercase bg-lime-400/5 hover:bg-lime-400/10"
              >
                {shareMsg || 'EXPORT_TELEMETRY'}
              </button>
            </div>

          </div>
        </main>

        {/* Upsell / Footer */}
        <footer className="mt-16 text-center">
          {power >= 45 ? (
            <div className="neon-border rounded-2xl p-8 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.1),transparent)] border-pink-500/20 group">
              <h3 className="text-3xl font-black text-pink-400 mb-4 tracking-[0.1em] group-hover:scale-105 transition-all">🔓 UNLOCK_ABSOLUTE_CONTROL</h3>
              <p className="text-xs text-pink-300/40 uppercase tracking-widest leading-loose max-w-lg mx-auto mb-8">
                Threshold reached. You are currently operating at 45% neural capacity. Upgrade to full spectrum dominance for unlimited generations and elite AI agent roleplay sequences.
              </p>
              <button className="bg-pink-500 hover:bg-pink-400 text-black font-black py-4 px-12 text-xl rounded-2xl transition-all hover:shadow-[0_0_50px_rgba(236,72,153,0.6)] uppercase tracking-[0.2em]">
                UPGRADE_NOW — $14.99/MO
              </button>
            </div>
          ) : (
            <div className="opacity-20 flex flex-col items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.5em]">Forge Logic: 2.2 Neural Engine Powered By Puter.js & fal.ai</p>
              <div className="h-px w-48 bg-gradient-to-r from-transparent via-lime-400 to-transparent" />
            </div>
          )}
        </footer>
      </div>

      {/* Decorative Floating Elements (Desktop only) */}
      <div className="fixed top-0 left-0 w-32 h-32 bg-lime-400/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-lime-400/5 blur-3xl pointer-events-none" />
    </div>
  );
}
