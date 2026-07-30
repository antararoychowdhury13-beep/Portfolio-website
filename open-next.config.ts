// OpenNext configuration for Cloudflare Workers.
// Empty defineCloudflareConfig() uses OpenNext's default in-memory dummy
// cache — perfect for this portfolio, which has no ISR / on-demand
// revalidation. Avoids the need for a WORKER_SELF_REFERENCE binding
// (which is what caused the first deploy to fail with "Worker not found").
//
// Docs: https://opennext.js.org/cloudflare/get-started

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
