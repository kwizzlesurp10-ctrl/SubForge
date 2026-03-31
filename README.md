# SubForge AI

Serverless Gay BDSM kink customizer — Next.js, Puter SD3/SDXL + fal.ai fallback, Vercel edge deployment.

## Features

- **Puter-powered client-side generation** — SD3 & SDXL via [Puter.js](https://puter.com), no API key required in the browser.
- **fal.ai server-side fallback** — FLUX Pro v1.1 when Puter is unavailable, requires `FAL_KEY`.
- **Submission Level slider** (1-10) with dynamic prompt escalation.
- **Power Exchange Meter** — persists across sessions via `localStorage`.
- **Freemium upsell gate** — surfaces at 45% power.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/kwizzlesurp10-ctrl/SubForge.git
cd SubForge
npm install
```

### 2. Environment variables

Copy the example file and fill in your API key:

```bash
cp .env.example .env.local
```

| Variable  | Required | Description |
|-----------|----------|-------------|
| `FAL_KEY` | Optional | fal.ai API key for server-side FLUX generation. Get one at [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys). Not needed when using the Puter browser path. |

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command        | Description                    |
|----------------|--------------------------------|
| `npm run dev`  | Start the development server   |
| `npm run build`| Production build               |
| `npm run start`| Start the production server    |
| `npm run lint` | Lint the source files          |
| `npm run test` | Run the Vitest test suite      |

## Testing

```bash
npm run test
```

For type-checking the test files:

```bash
npx tsc --project tsconfig.test.json --noEmit
```

## Deployment

Deploy to [Vercel](https://vercel.com) in one click. Set `FAL_KEY` as an environment variable in your project settings if you want the fal.ai fallback.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkwizzlesurp10-ctrl%2FSubForge)
