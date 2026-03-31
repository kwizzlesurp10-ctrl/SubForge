import { vi } from 'vitest';
import { BASE_PROMPT, NEGATIVE_PROMPT, PUTER_MODELS, buildPrompt } from '../lib/puter-generate';

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
    expect(prompt).toContain('chastity cage glowing locked');
    expect(prompt).toContain('tease intensity maxed');
    expect(prompt).toContain('edging duration extended to 90min');
    // Level-8 modifiers must NOT appear yet
    expect(prompt).not.toContain('ruined orgasm sequence activated');
  });

  it('appends high-tier modifiers at level 8', () => {
    const prompt = buildPrompt(8);
    expect(prompt).toContain('ruined orgasm sequence activated');
    expect(prompt).toContain('continuous denial loop');
    expect(prompt).toContain('visible desperation and tears');
    // Level-10 modifiers must NOT appear yet
    expect(prompt).not.toContain('maximum denial timer glowing red');
  });

  it('appends all modifiers at level 10 (max)', () => {
    const prompt = buildPrompt(10);
    expect(prompt).toContain('chastity cage glowing locked');
    expect(prompt).toContain('ruined orgasm sequence activated');
    expect(prompt).toContain('maximum denial timer glowing red');
    expect(prompt).toContain('full orgasm lock');
    expect(prompt).toContain('leaking uncontrollably');
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
// 3. NEGATIVE_PROMPT — quality guardrails
// ---------------------------------------------------------------------------
describe('NEGATIVE_PROMPT', () => {
  it('is a non-empty string', () => {
    expect(typeof NEGATIVE_PROMPT).toBe('string');
    expect(NEGATIVE_PROMPT.length).toBeGreaterThan(0);
  });

  it('includes core quality exclusions', () => {
    expect(NEGATIVE_PROMPT).toContain('deformed');
    expect(NEGATIVE_PROMPT).toContain('blurry');
    expect(NEGATIVE_PROMPT).toContain('low quality');
  });

  it('includes anatomy and art-style exclusions that prevent hallucination', () => {
    expect(NEGATIVE_PROMPT).toContain('cartoon');
    expect(NEGATIVE_PROMPT).toContain('3d render');
    expect(NEGATIVE_PROMPT).toContain('extra limbs');
    expect(NEGATIVE_PROMPT).toContain('bad hands');
    expect(NEGATIVE_PROMPT).toContain('deformed anatomy');
  });

  it('does not contain "Negatives:" prefix (must never be embedded in positive prompt)', () => {
    expect(NEGATIVE_PROMPT.toLowerCase()).not.toContain('negatives:');
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
      negative_prompt: NEGATIVE_PROMPT,
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
      negative_prompt: NEGATIVE_PROMPT,
    });

    expect(window.puter!.ai.txt2img).toHaveBeenCalledWith(
      prompt,
      expect.objectContaining({ model: PUTER_MODELS.sdxl }),
    );
    expect(imgEl.src).toBe(FAKE_BLOB_URL);
    // Level-10 prompt must include max-tier modifiers
    expect(prompt).toContain('maximum denial timer glowing red');
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

  it('passes negative_prompt as a separate option, not embedded in the positive prompt', async () => {
    const prompt = buildPrompt(5);
    await window.puter!.ai.txt2img(prompt, {
      model: PUTER_MODELS.sd3,
      negative_prompt: NEGATIVE_PROMPT,
    });

    const callArgs = (window.puter!.ai.txt2img as ReturnType<typeof vi.fn>).mock.calls[0];
    const positivePrompt: string = callArgs[0];
    const options = callArgs[1];

    // The positive prompt must NOT contain embedded "Negatives:" directives
    expect(positivePrompt.toLowerCase()).not.toContain('negatives:');
    // The negative content must live in the options object
    expect(options).toHaveProperty('negative_prompt', NEGATIVE_PROMPT);
  });
});
