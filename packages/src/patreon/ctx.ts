import { Core, Maybe, OAuthToken, Option } from "@macrograph/core";
import { createResource, createSignal } from "solid-js";
import { z } from "zod";

import { createEndpoint } from "../httpEndpoint";

export const TOKEN_LOCALSTORAGE = "patreonToken";

export function createCtx(core: Core) {
  const [authToken, setAuthToken] = createSignal<Option<OAuthToken>>(
    Maybe(localStorage.getItem(TOKEN_LOCALSTORAGE)).map(JSON.parse)
  );

  const client = createEndpoint({
    path: "https://www.patreon.com/api",
    fetch: async (url, opts) => {
      return await core
        .fetch(url, {
          ...opts,
          headers: {
            Authorization: `Bearer ${authToken().unwrap().access_token}`,
            ...opts?.headers,
          },
        })
        .then((res) => res.json());
    },
  });

  const api = {
    oauth: (() => {
      const oauth = client.extend("/oauth2/api");

      return {
        currentUser: oauth.extend("/current_user"),
      };
    })(),
  };

  const [user] = createResource(
    () => authToken().toNullable(),
    async () => {
      const resp = await api.oauth.currentUser.get(
        z.object({
          data: z.object({
            attributes: z.object({
              email: z.string(),
              full_name: z.string(),
              thumb_url: z.string(),
            }),
          }),
        })
      );

      return resp;
    }
  );

  return {
    core,
    authToken,
    setAuthToken: (token: Option<OAuthToken>) => {
      setAuthToken(token);
      if (token.isNone()) localStorage.removeItem(TOKEN_LOCALSTORAGE);
      else
        token.peek((token) =>
          localStorage.setItem(TOKEN_LOCALSTORAGE, JSON.stringify(token))
        );
    },
    user,
  };
}

export type Ctx = ReturnType<typeof createCtx>;