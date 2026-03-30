export const PUTER_MODELS = {
  sd3: 'stabilityai/stable-diffusion-3-medium',
  sdxl: 'stabilityai/stable-diffusion-xl-base-1.0',
} as const;

export type PuterModel = keyof typeof PUTER_MODELS;

export const BASE_PROMPT =
  `ultra-detailed 8k hyperrealistic kink customizer mechanics view for the Gay AI Agent app, ` +
  `holographic scene of a dominant leather daddy flogging and spanking a bound twink sub, ` +
  `the twink caged yet leaking as the daddy alternates power in his hole, power-exchange meter ` +
  `filling with each slap, sweat and tears of pleasure, (BDSM power gay mechanics:1.6), ` +
  `dark leather club UI neon, hyperrealistic anatomy, 8k`;

export function buildPrompt(level: number): string {
  let prompt = BASE_PROMPT;
  if (level >= 5) prompt += ', glowing chains wrapping limbs, shiny nipple clamps, heavy ball stretchers';
  if (level >= 8) prompt += ', thick glowing chains, extreme ball stretchers, visible tears of pleasure';
  if (level >= 10) prompt += ', maximum power-exchange meter glowing red, full submission, leaking profusely';
  return prompt;
}
