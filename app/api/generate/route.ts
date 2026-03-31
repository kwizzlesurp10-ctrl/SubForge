import { fal } from '@fal-ai/client';

const BASE_PROMPT = `ultra-detailed 8k hyperrealistic kink customizer screen for Gay AI Agent app, holographic preview of a ripped twink edging a massive bear daddy’s throbbing 12-inch cock with a glowing cock-ring UI slider set to “Edging Duration: 45min”, precum dripping endlessly while denial toggle “Orgasm Lock: ON” visibly prevents climax, daddy’s face desperate and moaning, side sliders for “Chastity Level”, “Tease Intensity”, “Ruined Orgasm Chance” actively spawning vibrating toys and holographic hands stroking without release, sweat-soaked bodies, (edging denial gay mechanics:1.6), neon control panel glow, 8k

Negatives: censored, blurred genitals, deformed anatomy, low quality, text watermark, female, underage, clothing on main subjects, soft lighting, cartoon, 3d render, extra limbs, bad hands, static scene`;

export async function POST(req: Request) {
  try {
    const { submissionLevel } = await req.json();

    if (!process.env.FAL_KEY) {
      return Response.json({ error: 'FAL_KEY not configured' }, { status: 500 });
    }

    fal.config({ credentials: process.env.FAL_KEY });

    let dynamicPrompt = BASE_PROMPT;

    if (submissionLevel >= 5) {
      dynamicPrompt += ', glowing chains wrapping limbs, shiny nipple clamps, heavy ball stretchers';
    }
    if (submissionLevel >= 8) {
      dynamicPrompt += ', thick glowing chains, extreme ball stretchers, visible tears of pleasure';
    }
    if (submissionLevel >= 10) {
      dynamicPrompt += ', maximum power-exchange meter glowing red, full submission, leaking profusely';
    }

    const result = await fal.subscribe('fal-ai/flux-pro/v1.1', {
      input: {
        prompt: dynamicPrompt,
        image_size: 'square_hd',
        num_inference_steps: 28,
        num_images: 1,
      },
    }) as { images: Array<{ url: string }> };

    const imageUrl = result?.images?.[0]?.url;

    if (!imageUrl) {
      return Response.json({ error: 'No image generated' }, { status: 500 });
    }

    return Response.json({ imageUrl });
  } catch (error) {
    console.error('Generation error:', error);
    return Response.json(
      { error: 'Generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
