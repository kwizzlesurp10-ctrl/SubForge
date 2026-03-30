import { vi } from 'vitest';
import { BASE_PROMPT, PUTER_MODELS, buildPrompt } from '../lib/puter-generate';

// ---------------------------------------------------------------------------
// 1. buildPrompt — prompt composition logic
// ---------------------------------------------------------------------------
describe('buildPrompt', () => {
  it('returns only the base prompt for level < 5', () => {
    expect(buildPrompt(1)).toBe(BASE_PROMPT);
    expect(buildPrompt(4)).toBe(BASE_PROMPT);
  });

  it('appends mid-tier modifiers at level 5', () => {
    const prompt = buildPrompt(5);
    expect(prompt).toContain(BASE_PROMPT);
    expect(prompt).toContain('glowing chains wrapping limbs');
    expect(prompt).toContain('shiny nipple clamps');
    expect(prompt).toContain('heavy ball stretchers');
    // Level-8 modifiers must NOT appear yet
    expect(prompt).not.toContain('thick glowing chains');
  });

  it('appends high-tier modifiers at level 8', () => {
    const prompt = buildPrompt(8);
    expect(prompt).toContain('thick glowing chains');
    expect(prompt).toContain('extreme ball stretchers');
    expect(prompt).toContain('visible tears of pleasure');
    // Level-10 modifiers must NOT appear yet
    expect(prompt).not.toContain('maximum power-exchange meter glowing red');
  });

  it('appends all modifiers at level 10 (max)', () => {
    const prompt = buildPrompt(10);
    expect(prompt).toContain('glowing chains wrapping limbs');
    expect(prompt).toContain('thick glowing chains');
    expect(prompt).toContain('maximum power-exchange meter glowing red');
    expect(prompt).toContain('full submission');
    expect(prompt).toContain('leaking profusely');
  });
});

// ---------------------------------------------------------------------------
// 2. PUTER_MODELS — model registry
// ---------------------------------------------------------------------------
describe('PUTER_MODELS', () => {
  it('contains the correct SD3 model ID', () => {
    expect(PUTER_MODELS.sd3).toBe('stabilityai/stable-diffusion-3-medium');
  });

  it('contains the correct SDXL model ID', () => {
    expect(PUTER_MODELS.sdxl).toBe('stabilityai/stable-diffusion-xl-base-1.0');
  });
});

// ---------------------------------------------------------------------------
// 3. Puter txt2img integration (mocked)
// ---------------------------------------------------------------------------
describe('Puter txt2img integration', () => {
  const FAKE_BLOB_URL = 'blob:http://localhost/fake-image-uuid';

  beforeEach(() => {
    // Install a mock puter object on window (as the browser SDK would)
    Object.defineProperty(window, 'puter', {
      value: {
        ai: {
          txt2img: vi.fn().mockResolvedValue({ src: FAKE_BLOB_URL }),
        },
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Clean up so other tests are not affected
    // @ts-expect-error – deleting a non-optional property for cleanup
    delete window.puter;
    vi.restoreAllMocks();
  });

  it('window.puter.ai.txt2img is detected as available', () => {
    expect(typeof window.puter?.ai?.txt2img).toBe('function');
  });

  it('txt2img is called with the correct prompt and model for level 1 + sd3', async () => {
    const prompt = buildPrompt(1);
    const imgEl = await window.puter!.ai.txt2img(prompt, {
      model: PUTER_MODELS.sd3,
      negative_prompt: 'ugly, deformed, blurry, low quality, watermark, text, logo',
    });

    expect(window.puter!.ai.txt2img).toHaveBeenCalledOnce();
    expect(window.puter!.ai.txt2img).toHaveBeenCalledWith(
      prompt,
      expect.objectContaining({ model: PUTER_MODELS.sd3 }),
    );
    expect(imgEl.src).toBe(FAKE_BLOB_URL);
  });

  it('txt2img is called with the correct prompt and model for level 10 + sdxl', async () => {
    const prompt = buildPrompt(10);
    const imgEl = await window.puter!.ai.txt2img(prompt, {
      model: PUTER_MODELS.sdxl,
      negative_prompt: 'ugly, deformed, blurry, low quality, watermark, text, logo',
    });

    expect(window.puter!.ai.txt2img).toHaveBeenCalledWith(
      prompt,
      expect.objectContaining({ model: PUTER_MODELS.sdxl }),
    );
    expect(imgEl.src).toBe(FAKE_BLOB_URL);
    // Level-10 prompt must include max-tier modifiers
    expect(prompt).toContain('maximum power-exchange meter glowing red');
  });

  it('returns an HTMLImageElement-like object with a src blob URL', async () => {
    const imgEl = await window.puter!.ai.txt2img(buildPrompt(5), {
      model: PUTER_MODELS.sd3,
    });
    expect(imgEl).toHaveProperty('src');
    expect(imgEl.src).toMatch(/^blob:/);
  });

  it('throws when txt2img rejects (simulates network / model error)', async () => {
    (window.puter!.ai.txt2img as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Puter model unavailable'),
    );

    await expect(
      window.puter!.ai.txt2img(buildPrompt(3), { model: PUTER_MODELS.sd3 }),
    ).rejects.toThrow('Puter model unavailable');
  });
});
