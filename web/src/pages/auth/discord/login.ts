import type { APIRoute } from "astro";
import * as jose from "jose";

import { env } from "~/env/server";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  const state = await new jose.SignJWT({
    ...JSON.parse(
      Buffer.from(ctx.url.searchParams.get("state")!, "base64").toString()
    ),
    redirect_uri: `${env.VERCEL_URL}/auth/discord/callback`,
  })
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(env.AUTH_SECRET));

  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    redirect_uri: `${env.AUTH_REDIRECT_PROXY_URL}/auth/proxy`,
    response_type: "code",
    scope: "identify",
    state,
  });

  return ctx.redirect(
    new URL(`https://discord.com/api/oauth2/authorize?${params}`).toString()
  );
};
