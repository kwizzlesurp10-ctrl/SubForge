export const PUTER_MODELS = {
  sd3: 'stabilityai/stable-diffusion-3-medium',
  sdxl: 'stabilityai/stable-diffusion-xl-base-1.0',
} as const;

export type PuterModel = keyof typeof PUTER_MODELS;

export const BASE_PROMPT =
  `ultra-detailed 8k hyperrealistic kink customizer screen for Gay AI Agent app, ` +
  `holographic preview of a ripped twink edging a massive bear daddy's throbbing cock ` +
  `with a glowing cock-ring UI slider set to "Edging Duration: 45min", precum dripping ` +
  `endlessly while denial toggle "Orgasm Lock: ON" visibly prevents climax, daddy's face ` +
  `desperate and moaning, side sliders for "Chastity Level", "Tease Intensity", ` +
  `"Ruined Orgasm Chance" actively spawning vibrating toys and holographic hands stroking ` +
  `without release, sweat-soaked bodies, (edging denial gay mechanics:1.6), neon control panel glow, 8k`;

export function buildPrompt(level: number): string {
  let prompt = BASE_PROMPT;
  if (level >= 5) prompt += ', chastity cage glowing locked, tease intensity maxed, edging duration extended to 90min';
  if (level >= 8) prompt += ', ruined orgasm sequence activated, continuous denial loop, visible desperation and tears';
  if (level >= 10) prompt += ', maximum denial timer glowing red, full orgasm lock, complete submission, leaking uncontrollably';
  return prompt;
}
