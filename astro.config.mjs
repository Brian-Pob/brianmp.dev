import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
	site: "https://brianmp.dev",
	integrations: [mdx(), sitemap()],
	output: "static",
	adapter: vercel({
		webAnalytics: { enabled: true },
	}),
});
