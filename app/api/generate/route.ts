import { fal } from '@fal-ai/client';

const BASE_PROMPT = `ultra-detailed 8k hyperrealistic kink customizer mechanics view for the Gay AI Agent app, holographic scene of a dominant leather daddy flogging and spanking a bound twink sub, the twink caged yet leaking as the daddy alternates power in his hole, power-exchange meter filling with each slap, sweat and tears of pleasure, (BDSM power gay mechanics:1.6), dark leather club UI neon, hyperrealistic anatomy, 8k`;

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
