import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FalButton, PuterButton, FluxButton } from '../components/AIButtons';

describe('AIButtons', () => {
  it('FalButton calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<FalButton onClick={onClick} />);
    const button = screen.getByTestId('fal-button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('PuterButton calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<PuterButton onClick={onClick} />);
    const button = screen.getByTestId('puter-button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('FluxButton calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<FluxButton onClick={onClick} />);
    const button = screen.getByTestId('flux-button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('buttons have active class when active prop is true', () => {
    render(<FalButton onClick={() => {}} active={true} />);
    const button = screen.getByTestId('fal-button');
    expect(button.className).toContain('border-lime-400 bg-lime-400 text-black');
  });

  it('buttons have inactive class when active prop is false', () => {
    render(<FalButton onClick={() => {}} active={false} />);
    const button = screen.getByTestId('fal-button');
    expect(button.className).toContain('border-lime-400/40 text-lime-400/60');
  });
});
