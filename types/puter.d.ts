interface PuterTxt2ImgOptions {
  /** Model ID. Use 'stabilityai/stable-diffusion-3-medium' for SD3 or 'stabilityai/stable-diffusion-xl-base-1.0' for SDXL. */
  model?: string;
  /** Things to exclude from the generated image. */
  negative_prompt?: string;
  width?: number;
  height?: number;
  aspect_ratio?: string;
  /** Fixed seed for reproducible results. */
  seed?: number;
  /** Number of diffusion steps (quality vs. speed). */
  steps?: number;
  /** Number of images to generate. */
  n?: number;
}

interface Puter {
  ai: {
    /**
     * Generate an image from a text prompt using Stable Diffusion via Puter.
     * Returns an HTMLImageElement whose `src` is a blob URL containing the image.
     * No API key or account required — runs entirely in the browser.
     *
     * @example
     * const img = await puter.ai.txt2img('a cat', { model: 'stabilityai/stable-diffusion-3-medium' });
     * document.body.appendChild(img);
     */
    txt2img(prompt: string, options?: PuterTxt2ImgOptions): Promise<HTMLImageElement>;
  };
}

declare const puter: Puter;

interface Window {
  puter?: Puter;
}
