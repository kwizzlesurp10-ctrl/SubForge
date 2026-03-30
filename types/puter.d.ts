interface PuterImageGenerateOptions {
  model?: string;
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
}

interface PuterImageGenerateResult {
  image: Blob | string;
}

interface Puter {
  ai: {
    image: {
      generate(options: PuterImageGenerateOptions): Promise<PuterImageGenerateResult>;
    };
  };
}

declare const puter: Puter;
