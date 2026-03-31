import React from 'react';

interface AIButtonProps {
  onClick: () => void;
  active?: boolean;
}

const baseStyles = "px-4 py-2 text-xs font-bold rounded-full border transition-all uppercase tracking-widest";
const activeStyles = "border-lime-400 bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.5)]";
const inactiveStyles = "border-lime-400/40 text-lime-400/60 hover:border-lime-400/70 hover:text-lime-400";

export const FalButton: React.FC<AIButtonProps> = ({ onClick, active }) => (
  <button
    data-testid="fal-button"
    onClick={onClick}
    className={`${baseStyles} ${active ? activeStyles : inactiveStyles}`}
  >
    Fal.ai
  </button>
);

export const PuterButton: React.FC<AIButtonProps> = ({ onClick, active }) => (
  <button
    data-testid="puter-button"
    onClick={onClick}
    className={`${baseStyles} ${active ? activeStyles : inactiveStyles}`}
  >
    Puter
  </button>
);

export const FluxButton: React.FC<AIButtonProps> = ({ onClick, active }) => (
  <button
    data-testid="flux-button"
    onClick={onClick}
    className={`${baseStyles} ${active ? activeStyles : inactiveStyles}`}
  >
    Flux
  </button>
);
