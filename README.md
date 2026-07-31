# Anupam Sarkar — Portfolio

Next.js 15 portfolio with an agent-driven experience, deployed to **Cloudflare Workers** via the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare).

## Pages

- `/` — classic portfolio (agent-driven homepage with Chitra)
- `/agentic` — **Design Systems Agent** landing page: intent-first console, gravity capability field, indexed cases
- `/about`, `/contact`, `/frameworks`, `/work/[slug]` — supporting pages

## Local development

```bash
npm install
npm run dev          # Next.js dev server at http://localhost:3000
npm run preview      # Build and preview in the Cloudflare Workers runtime (workerd)
```

## Deploying to Cloudflare

This repo is connected to **Cloudflare Workers Builds** (Git integration), so Cloudflare
builds and deploys the worker `portfolio-website` automatically on push. In the Cloudflare
dashboard build settings, use:

- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy`

The Chitra chat API route needs an Anthropic key on the deployed Worker (one time):

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

Manual deploys also work from a machine that's logged in to Cloudflare (`npx wrangler login`
or `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` env vars):

```bash
npm run deploy
```
