import { fal } from '@fal-ai/client';
import { buildPrompt, NEGATIVE_PROMPT } from '../../lib/puter-generate';

export async function POST(req: Request) {
  try {
    const { submissionLevel } = await req.json();

    if (!process.env.FAL_KEY) {
      return Response.json({ error: 'FAL_KEY not configured' }, { status: 500 });
    }

    fal.config({ credentials: process.env.FAL_KEY });

    const dynamicPrompt = buildPrompt(submissionLevel);

    const result = await fal.subscribe('fal-ai/flux-pro/v1.1', {
      input: {
        prompt: dynamicPrompt,
        negative_prompt: NEGATIVE_PROMPT,
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
