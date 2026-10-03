# Prompt AI Studio

Portuguese creative workspace with reference uploads, template-based prompt composition, editable output, project history and character/product memories.

## Runtime

Next.js-compatible App Router via the bundled Vinext runtime, React, TypeScript and Tailwind. Hosted through Sites. The original Supabase/Vercel architecture is adapted to platform D1 + R2 and ChatGPT authentication so saved records and uploads work without requiring those external accounts. API authorization is enforced by owner on every data operation.

## Features

- Upload verified JPEG / PNG / WebP, up to 10 MB, to private object storage.
- Six creative objectives; camera, light, format, action and continuity controls.
- Deterministic template-based prompt composition, labeled as such in the UI. English template labels do not translate custom user text.
- Copy and edit prompts, negative prompts and UGC scene scripts.
- Durable projects / history and character / product memory.
- Optional real visual analysis through OpenAI. Requires server secret OPENAI_API_KEY and optional OPENAI_MODEL. No key is collected by the browser.
- Platform ChatGPT sign-in; no standalone password registration.
- Informational future Free / Creator / Pro / Agency tiers. Billing, paid credits, team management and automatic quality review are not implemented.

## Development

Use the Sites install, build and publication helpers for this environment. Standalone package commands: npm run dev, npm run build, npm run db:generate. SQL migrations live in drizzle/ and must be applied before local database testing. Schema changes are generated via Drizzle, never at request time.

The hosting configuration declares DB and BUCKET. Hosted production secrets must be configured through Sites. Do not commit populated .env files.

## Data security

All APIs require a platform-validated user identity. Records are scoped to user_id. Mutations check Origin when present. Prompts and descriptions are rendered as text. Upload ownership is checked before reading, saving or analysis. No customer data is included in source control.
