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

### One-time setup

1. Create a Cloudflare API token with the **Edit Cloudflare Workers** template at
   https://dash.cloudflare.com/profile/api-tokens
2. Find your Account ID on the Cloudflare dashboard (Workers & Pages → right sidebar).
3. For automatic deploys from GitHub, add both as repository secrets
   (Settings → Secrets and variables → Actions):
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. The Chitra API route needs an Anthropic key on the deployed Worker:
   ```bash
   npx wrangler secret put ANTHROPIC_API_KEY
   ```

### Deploy

- **Automatic:** every push to `main` deploys via `.github/workflows/deploy-cloudflare.yml`.
- **Manual:**
  ```bash
  CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... npm run deploy
  ```

The Worker is named `anupam-portfolio` (see `wrangler.jsonc`) and serves at
`https://anupam-portfolio.<your-subdomain>.workers.dev` until you attach a custom domain.
