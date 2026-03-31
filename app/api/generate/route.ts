import { fal } from '@fal-ai/client';

const BASE_PROMPT = `ultra-detailed 8k hyperrealistic kink customizer screen for Gay AI Agent app, holographic preview of a ripped twink edging a massive bear daddy\u2019s throbbing 12-inch cock with a glowing cock-ring UI slider set to \u201cEdging Duration: 45min\u201d, precum dripping endlessly while denial toggle \u201cOrgasm Lock: ON\u201d visibly prevents climax, daddy\u2019s face desperate and moaning, side sliders for \u201cChastity Level\u201d, \u201cTease Intensity\u201d, \u201cRuined Orgasm Chance\u201d actively spawning vibrating toys and holographic hands stroking without release, sweat-soaked bodies, (edging denial gay mechanics:1.6), neon control panel glow, 8k

Negatives: censored, blurred genitals, deformed anatomy, low quality, text watermark, female, underage, clothing on main subjects, soft lighting, cartoon, 3d render, extra limbs, bad hands, static scene`;

export async function POST(req: Request) {
  try {
    const body = await req.json() as { submissionLevel?: unknown };
    const submissionLevel = Number(body.submissionLevel);

    if (!Number.isInteger(submissionLevel) || submissionLevel < 1 || submissionLevel > 10) {
      return Response.json({ error: 'submissionLevel must be an integer between 1 and 10' }, { status: 400 });
    }

    if (!process.env.FAL_KEY) {
      return Response.json({ error: 'FAL_KEY not configured' }, { status: 500 });
    }

    fal.config({ credentials: process.env.FAL_KEY });

    let dynamicPrompt = BASE_PROMPT;

    if (submissionLevel >= 5) {
      dynamicPrompt += ', chastity cage glowing locked, tease intensity maxed, edging duration extended to 90min';
    }
    if (submissionLevel >= 8) {
      dynamicPrompt += ', ruined orgasm sequence activated, continuous denial loop, visible desperation and tears';
    }
    if (submissionLevel >= 10) {
      dynamicPrompt += ', maximum denial timer glowing red, full orgasm lock, complete submission, leaking uncontrollably';
    }

    const result = await fal.subscribe('fal-ai/flux-pro/v1.1', {
      input: {
        prompt: dynamicPrompt,
        image_size: 'square_hd',
        num_images: 1,
      },
    });

    const imageUrl = result?.data?.images?.[0]?.url;

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
