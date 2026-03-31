import { generateImage } from 'ai';
import fs from 'node:fs';
import 'dotenv/config';
import { buildPrompt } from './lib/puter-generate';

async function main() {
  const prompt = buildPrompt(10);
  
  console.log('Generating image with Flux via CUSTOM Vercel AI Gateway...');
  console.log('Target model: black-forest-labs/flux-1.1-pro');

  try {
    const result = await generateImage({
      // We use the string ID directly as requested.
      // This will call the local gateway route.
      model: 'black-forest-labs/flux-1.1-pro' as any,
      prompt: prompt,
      // experimental_aiGateway handles base URL mapping for generic IDs
      // @ts-expect-error – utilizing gateway configuration
      experimental_aiGateway: 'http://localhost:3000/api/gateway/image',
    });

    const imageData = result.images[0];
    if (imageData) {
      console.log('Image generated successfully!');

      // Write the image from the base64 data provided by the SDK
      try {
        fs.writeFileSync('output.png', Buffer.from(imageData.base64, 'base64'));
        console.log('Image saved to output.png');
      } catch (e) {
        console.warn('Could not save file locally, but generation succeeded.');
      }
    } else {
      console.log('No image returned in result.');
    }
  } catch (error: any) {
    console.error('Generation failed:', error);
  }
}

main().catch(console.error);
