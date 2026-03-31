import { fal } from '@fal-ai/client';
import { buildPrompt, type PromptStyle } from '@/lib/puter-generate';

export async function POST(req: Request) {
  try {
    const body = await req.json() as { submissionLevel?: unknown; style?: string };
    const submissionLevel = Number(body.submissionLevel);
    const style = (body.style as PromptStyle) || 'bdsm';

    if (!Number.isFinite(submissionLevel) || submissionLevel < 1 || submissionLevel > 10) {
      return Response.json({ error: 'submissionLevel must be between 1 and 10' }, { status: 400 });
    }

    if (!process.env.FAL_KEY) {
      return Response.json({ error: 'FAL_KEY not configured' }, { status: 500 });
    }

    fal.config({ credentials: process.env.FAL_KEY });

    const dynamicPrompt = buildPrompt(submissionLevel, style);

    const result = (await fal.subscribe('fal-ai/flux-pro/v1.1', {
      input: {
        prompt: dynamicPrompt,
        negative_prompt: NEGATIVE_PROMPT,
        image_size: 'square_hd',
        num_images: 1,
      },
    })) as unknown as { images?: Array<{ url: string }>, data?: { images?: Array<{ url: string }> } };

    // Support both direct and .data nested response structures
    const imageUrl = result?.data?.images?.[0]?.url || result?.images?.[0]?.url;

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
