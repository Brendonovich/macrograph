import { Core } from "@macrograph/core";
import Interface from "@macrograph/interface";
import * as pkgs from "@macrograph/packages";
import { onMount } from "solid-js";

import { env } from "~/env/client";

const AUTH_URL = `${env.PUBLIC_VERCEL_URL}/auth`;

export default () => {
  const core = new Core({
    fetch,
    oauth: {
      authorize: async (provider) => {
        const loginWindow = window.open(
          `${AUTH_URL}/${provider}/login?${new URLSearchParams({
            state: window.btoa(
              JSON.stringify({
                env: "web",
                targetOrigin: window.origin,
              })
            ),
          })}`
        );

        if (!loginWindow) {
          return null;
        }

        return await new Promise<any>((res) =>
          window.addEventListener("message", (e) => {
            if (e.source !== loginWindow) return;

            console.log(provider, e.data);

            res(e.data);
          })
        );
      },
      refresh: async (provider, refreshToken) => {
        const res = await fetch(`${AUTH_URL}/${provider}/refresh`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        return await res.json();
      },
    },
  });

  onMount(() => {
    [
      pkgs.github.pkg,
      pkgs.google.pkg,
      pkgs.goxlr.pkg,
      pkgs.json.pkg,
      pkgs.keyboard.pkg,
      pkgs.list.pkg,
      pkgs.localStorage.pkg,
      pkgs.logic.pkg,
      pkgs.map.pkg,
      pkgs.obs.pkg,
      pkgs.patreon.pkg,
      pkgs.spotify.pkg,
      pkgs.streamlabs.pkg,
      pkgs.twitch.pkg,
      pkgs.utils.pkg,
    ].map((p) => core.registerPackage(p));
  });

  return <Interface core={core} />;
};
