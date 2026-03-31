export const PUTER_MODELS = {
  sd3: 'stabilityai/stable-diffusion-3-medium',
  sdxl: 'stabilityai/stable-diffusion-xl-base-1.0',
} as const;

export type PuterModel = keyof typeof PUTER_MODELS;

export type PromptStyle = 'bdsm' | 'classical';

export const NEGATIVE_PROMPT =
  'deformed, blurry, low quality, cartoon, 3d render, extra limbs, bad hands, deformed anatomy';

export const PROMPTS: Record<PromptStyle, string> = {
  bdsm: `ultra-detailed 8k hyperrealistic kink customizer screen for Gay AI Agent app, ` +
    `holographic preview of a ripped twink edging a massive bear daddy's throbbing cock ` +
    `with a glowing cock-ring UI slider set to "Edging Duration: 45min", precum dripping ` +
    `endlessly while denial toggle "Orgasm Lock: ON" visibly prevents climax, daddy's face ` +
    `desperate and moaning, side sliders for "Chastity Level", "Tease Intensity", ` +
    `"Ruined Orgasm Chance" actively spawning vibrating toys and holographic hands stroking ` +
    `without release, sweat-soaked bodies, (edging denial gay mechanics:1.6), neon control panel glow, 8k`,
  classical: `ultra-detailed, hyperrealistic, photorealistic rendering of handsome adult male figures in a classical art studio setting, focusing on precise anatomical studies of the human form in its natural, unadorned state, slender and muscular builds, diverse ethnicities, engaging in platonic mentorship poses with close physical interaction, soft natural lighting highlighting skin textures, pores, subtle shadows on bare contours, educational focus on full-body proportions without fabric obstructions, serene expressions of concentration and guidance, wooden easels and sketchpads in background, (anatomical accuracy emphasis:1.4), in the style of Renaissance master drawings blended with modern fitness photography, masterpiece, 8k, --ar 2:3 --stylize 700 --v 6`
};

export function buildPrompt(level: number, style: PromptStyle = 'bdsm'): string {
  let prompt = PROMPTS[style];
  
  if (style === 'bdsm') {
    if (level >= 5) prompt += ', chastity cage glowing locked, tease intensity maxed, edging duration extended to 90min';
    if (level >= 8) prompt += ', ruined orgasm sequence activated, continuous denial loop, visible desperation and tears';
    if (level >= 10) prompt += ', maximum denial timer glowing red, full orgasm lock, complete submission, leaking uncontrollably';
  } else {
    if (level >= 5) prompt += ', glowing chains wrapping limbs, shiny nipple clamps, heavy ball stretchers';
    if (level >= 8) prompt += ', thick glowing chains, extreme ball stretchers, visible tears of pleasure';
    if (level >= 10) prompt += ', maximum power-exchange meter glowing red, full submission, leaking profusely';
  }
  
  return prompt;
}

/** Alias kept for backward compatibility with tests. */
export const BASE_PROMPT = PROMPTS.bdsm;
