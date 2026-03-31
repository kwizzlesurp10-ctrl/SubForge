# SubForge Project Specifications

This document outlines the architectural, operational, and development standards for the SubForge AI project.

## 1. Agent Roles & Responsibilities
- **SubForge Core Agent:** Responsible for image generation logic (Puter/fal.ai), state management, and primary UI interactions.
- **Style Guardian Agent:** Ensures visual consistency with the neon/cyberpunk aesthetic and adheres to the "Gay BDSM/Kink" thematic guidelines.
- **Dependency Master Agent:** Manages package updates (Next.js, Puter.js, fal.ai) and ensures environment compatibility.
- **Testing Initiator Agent:** Maintains and executes the Vitest suite, ensuring high coverage for prompt generation and integration logic.

## 2. LLM Interaction Protocols
- **Model Selection & Providers:**
  - **Puter:** Client-side generation using `window.puter.ai.txt2img` with SD3/SDXL.
  - **Fal:** Server-side fallback using `fal-ai/flux-pro/v1.1` via standard API proxy.
  - **Flux:** Server-side generation using Flux Pro models, integrated via the AI SDK.
- **Prompt Construction:**
  - Base Prompt + Dynamic Modifiers (Level 1-10).
  - Use of `buildPrompt(level)` in `lib/puter-generate.ts` for cross-provider consistency.

## 3. Data Validation Schemas
- **Generation Input:**
  ```typescript
  interface GenerationRequest {
    submissionLevel: number; // Range: 1-10
    provider: 'puter' | 'fal' | 'flux';
    model?: string;
  }
  ```

---

## 4. Key Scripts
- `index.ts`: Example text generation using the `ai` SDK.
- `flux-gen.ts`: Standalone script for Flux image generation using `generateImage`.
- **API Response:**
  ```typescript
  interface GenerationResponse {
    imageUrl: string;
    error?: string;
  }
  ```

## 4. API Endpoint Specifications
- **POST `/api/generate`:**
  - **Body:** `{ submissionLevel: number }`
  - **Auth:** Requires `FAL_KEY` in server environment.
  - **Response:** JSON with `imageUrl` or error details.

## 5. Performance Metrics
- **Generation Time:** Target < 15s for client-side, < 10s for server-side.
- **Lighthouse Scores:** Target 90+ for Performance, Accessibility, and Best Practices.
- **Error Rate:** Monitor and maintain < 1% failure rate for image generations.

## 6. Error Handling Procedures
- **UI:** Display user-friendly error messages (neon-themed) with retry options.
- **API:** Return standardized JSON error objects with appropriate HTTP status codes (400, 500).
- **Fallback:** Gracefully switch from Puter to fal.ai upon client-side failure.

## 7. Security Protocols
- **Secrets:** Use `.env` and Vercel Environment Variables. Never commit `FAL_KEY`.
- **Sanitization:** Ensure no user-provided text (if implemented) can inject malicious prompts.
- **CORS:** Restrict API access to the application's domain.

## 8. Deployment Strategy
- **Platform:** Vercel (Edge Functions).
- **Branching:** `main` for production, `develop` for staging.
- **Automated Deploys:** Triggered on push to `main` via Vercel integration.

## 9. Scalability Plan
- **Edge Deployment:** Use Vercel Edge for global low-latency.
- **Caching:** Cache generated images via CDN where appropriate (mindful of user privacy).
- **Tiered Access:** Implement "Freemium" model to manage API costs at scale.

## 10. Monitoring & Logging
- **Logging:** Use `console.log` and `console.error` (captured by Vercel logs).
- **Analytics:** Integration with Vercel Analytics for traffic and performance monitoring.
- **Formats:** Standardized JSON logs for easy parsing.

## 11. Testing Methodologies
- **Unit Testing:** Vitest for individual functions (e.g., prompt building).
- **Integration Testing:** Mocking Puter.js and API responses to test end-to-end flows.
- **UI Testing:** React Testing Library for component verification.

## 12. CI/CD Pipeline
- **GitHub Actions:**
  - Run `npm run lint` on PR.
  - Run `npm run test` on PR.
  - Fail build if tests do not pass.

## 13. Version Control Strategy
- **Git Flow:** Feature branches merged into `develop`, then `develop` into `main`.
- **Commits:** Semantic commit messages (feat, fix, docs, chore).

## 14. User Authentication
- **Current:** Sessionless / Client-only.
- **Future:** Potential Clerk or NextAuth integration for "Premium" features.

## 15. Data Retention & Backup
- **Generated Images:** Stored on fal.ai or client-side blobs.
- **Backups:** Automated Git backups for codebase; no critical database state currently exists.

## 16. Ethical AI Guidelines
- **Consent:** Ensure all generated content aligns with consensual kink representations.
- **Bias:** Monitor generation outputs for unintended biases in anatomy or representation.
- **Safety:** Maintain strict negative prompts to avoid illegal or harmful content.

## 17. Communication & Documentation
- **Channels:** Discord/Slack for team communication.
- **Standards:** Maintain `README.md`, `GEMINI.md`, and `SPEC.md`.
- **Feedback:** User feedback via "Share" metrics and future integrated feedback forms.
