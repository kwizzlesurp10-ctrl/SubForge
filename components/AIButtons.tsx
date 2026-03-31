import React from 'react';

interface AIButtonProps {
  onClick: () => void;
  active?: boolean;
}

const baseStyles = "px-4 py-2 text-[10px] sm:text-xs font-bold rounded-lg border transition-all uppercase tracking-[0.2em] relative group overflow-hidden flex items-center justify-center min-w-[80px]";
const activeStyles = "border-lime-400 bg-lime-400/10 text-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.3)] ring-1 ring-lime-400/50 scale-105 z-10 font-black";
const inactiveStyles = "border-white/10 text-white/40 hover:border-white/30 hover:text-white/60 bg-black/40 backdrop-blur-md";

export const FalButton: React.FC<AIButtonProps> = ({ onClick, active }) => (
  <button
    data-testid="fal-button"
    onClick={onClick}
    className={`${baseStyles} ${active ? activeStyles : inactiveStyles}`}
  >
    <span className="relative z-10">Fal_AI</span>
    {active && <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-transparent animate-pulse" />}
  </button>
);

export const PuterButton: React.FC<AIButtonProps> = ({ onClick, active }) => (
  <button
    data-testid="puter-button"
    onClick={onClick}
    className={`${baseStyles} ${active ? activeStyles : inactiveStyles}`}
  >
    <span className="relative z-10">Puter_ENG</span>
    {active && <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent animate-pulse" />}
  </button>
);

export const FluxButton: React.FC<AIButtonProps> = ({ onClick, active }) => (
  <button
    data-testid="flux-button"
    onClick={onClick}
    className={`${baseStyles} ${active ? activeStyles : inactiveStyles}`}
  >
    <span className="relative z-10">Flux_PRO</span>
    {active && <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent animate-pulse" />}
  </button>
);
