import { initQueryClient } from "@ts-rest/solid-query";
import { initClient } from "@ts-rest/core";
import { contract } from "@macrograph/api-contract";
import { createSignal } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";

import { env } from "./env";
import { action } from "@solidjs/router";
import { queryClient } from "./rspc";

export const [sessionToken, setSessionToken] = makePersisted(
  createSignal<string | null>(null),
  { name: "mg-auth-token" }
);

export const rawApi = initClient(contract, {
  baseUrl: `${env.VITE_MACROGRAPH_API_URL}/api`,
  get baseHeaders(): Record<string, string> {
    const token = sessionToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

export const api = initQueryClient(contract, {
  baseUrl: `${env.VITE_MACROGRAPH_API_URL}/api`,
  get baseHeaders(): Record<string, string> {
    const token = sessionToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

export const logOutAction = action(async () => {
  setSessionToken(null);
  queryClient.clear();
});
