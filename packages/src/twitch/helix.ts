import { ApiClient } from "@twurple/api";
import { createRoot, createEffect, createMemo, createSignal } from "solid-js";
import { accessToken, authProvider } from "./auth";
import pkg from "./pkg";
import { None, types, Maybe } from "@macrograph/core";

export const { helix, user } = createRoot(() => {
  const helix = createMemo(
    () => authProvider().map((p) => new ApiClient({ authProvider: p })),
    None
  );

  const getUser = () =>
    accessToken()
      .zip(helix())
      .andThenAsync(([token, helix]) =>
        helix.getTokenInfo().then(({ userId, userName }) =>
          Maybe(
            userId !== null && userName !== null
              ? {
                  id: userId,
                  name: userName,
                  token,
                }
              : null
          )
        )
      );

  const [user, setUser] =
    createSignal<Awaited<ReturnType<typeof getUser>>>(None);

  createEffect(() => getUser().then(setUser));

  return {
    helix,
    user,
  };
});

const unwrapApi = () => {
  const [h, u] = helix().zip(user()).unwrap();

  return {
    helix: h,
    user: u,
  };
};

pkg.createNonEventSchema({
  name: "Ban User",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      name: "userID",
      id: "userId",
      type: types.string(),
    });
    t.dataInput({
      name: "Duration",
      id: "duration",
      type: types.int(),
    });
    t.dataInput({
      name: "Reason",
      id: "reason",
      type: types.string(),
    });
  },
  async run({ ctx }) {
    const { helix, user } = unwrapApi();

    helix.moderation.banUser(user.id, user.id, {
      user: ctx.getInput("userId"),
      duration: ctx.getInput("duration"),
      reason: ctx.getInput("reason"),
    });
  },
});

pkg.createNonEventSchema({
  name: "Unban User",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      name: "userID",
      id: "userId",
      type: types.string(),
    });
  },
  run({ ctx }) {
    const { user, helix } = unwrapApi();

    helix.moderation.unbanUser(user.id, user.id, ctx.getInput("userId"));
  },
});

pkg.createNonEventSchema({
  name: "Add Moderator",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      name: "userID",
      id: "userId",
      type: types.string(),
    });
  },
  run({ ctx }) {
    const { user, helix } = unwrapApi();

    helix.moderation.addModerator(user.id, ctx.getInput("userId"));
  },
});

pkg.createNonEventSchema({
  name: "Remove Moderator",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      name: "userID",
      id: "userId",
      type: types.string(),
    });
  },
  run({ ctx }) {
    const { user, helix } = unwrapApi();

    helix.moderation.removeModerator(user.id, ctx.getInput("userId"));
  },
});

pkg.createNonEventSchema({
  name: "Delete Chat message",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      name: "Message ID",
      id: "messageId",
      type: types.string(),
    });
  },
  run({ ctx }) {
    const { user, helix } = unwrapApi();

    helix.moderation.deleteChatMessages(
      user.id,
      user.id,
      ctx.getInput("messageId")
    );
  },
});

pkg.createNonEventSchema({
  name: "Create Clip",
  variant: "Exec",
  generateIO: (t) => {
    t.dataOutput({
      name: "Clip ID",
      id: "clipId",
      type: types.string(),
    });
  },
  async run({ ctx }) {
    const { user, helix } = unwrapApi();

    let clipId = await helix.clips.createClip({
      channel: user.id,
    });

    ctx.setOutput("clipId", clipId);
  },
});

pkg.createNonEventSchema({
  name: "Check User Subscription",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      name: "User ID",
      id: "userId",
      type: types.string(),
    });
    t.dataOutput({
      name: "Is Subscribed",
      id: "subbed",
      type: types.bool(),
    });
    t.dataOutput({
      name: "Tier",
      id: "tier",
      type: types.string(),
    });
    t.dataOutput({
      name: "Gifted",
      id: "gifted",
      type: types.bool(),
    });
    t.dataOutput({
      name: "Gifter Name",
      id: "gifterName",
      type: types.string(),
    });
    t.dataOutput({
      name: "Gifter Display Name",
      id: "gifterDisplayName",
      type: types.string(),
    });
    t.dataOutput({
      name: "Gifter ID",
      id: "gifterId",
      type: types.int(),
    });
  },
  async run({ ctx }) {
    const { user, helix } = unwrapApi();

    let data = await helix.subscriptions.getSubscriptionForUser(
      user.id,
      ctx.getInput("userId")
    );

    ctx.setOutput("subbed", data !== null);

    if (!data) return;

    ctx.setOutput("tier", data.tier);
    ctx.setOutput("gifted", data.isGift);
    ctx.setOutput("gifterName", data.gifterName);
    ctx.setOutput("gifterDisplayName", data.gifterDisplayName);
    ctx.setOutput("gifterId", data.gifterId);
  },
});

pkg.createNonEventSchema({
  name: "Check User Follow",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      name: "User ID",
      id: "userId",
      type: types.string(),
    });
    t.dataOutput({
      name: "Following",
      id: "following",
      type: types.bool(),
    });
  },
  async run({ ctx }) {
    const { user, helix } = unwrapApi();

    let data = await helix.channels.getChannelFollowers(
      user.id,
      user.id,
      ctx.getInput("userId")
    );

    ctx.setOutput("following", data?.data.length === 1);
  },
});

pkg.createNonEventSchema({
  name: "Check User VIP",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      name: "User ID",
      id: "userId",
      type: types.string(),
    });
    t.dataOutput({
      name: "Vip",
      id: "vip",
      type: types.bool(),
    });
  },
  async run({ ctx }) {
    const { user, helix } = unwrapApi();

    let data = await helix.channels.checkVipForUser(
      user.id,
      ctx.getInput("userId")
    );

    ctx.setOutput("vip", data);
  },
});

pkg.createNonEventSchema({
  name: "Check User Mod",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      name: "User ID",
      id: "userId",
      type: types.string(),
    });
    t.dataOutput({
      name: "Moderator",
      id: "moderator",
      type: types.bool(),
    });
  },
  async run({ ctx }) {
    const { user, helix } = unwrapApi();

    let data = await helix.moderation.checkUserMod(
      user.id,
      ctx.getInput("userId")
    );

    ctx.setOutput("moderator", data);
  },
});

pkg.createNonEventSchema({
  name: "Create Custom Redemption",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      name: "Title",
      id: "title",
      type: types.string(),
    });
    t.dataInput({
      name: "Cost",
      id: "cost",
      type: types.int(),
    });
    t.dataInput({
      name: "Prompt",
      id: "prompt",
      type: types.string(),
    });
    t.dataInput({
      name: "Enabled",
      id: "isEnabled",
      type: types.bool(),
    });
    t.dataInput({
      name: "Background Color",
      id: "backgroundColor",
      type: types.string(),
    });
    t.dataInput({
      name: "User Input Required",
      id: "userInputRequired",
      type: types.bool(),
    });
    t.dataInput({
      name: "Max Redemptions Per Stream",
      id: "maxRedemptionsPerStream",
      type: types.int(),
    });
    t.dataInput({
      name: "Max Redemptions Per User Per Stream",
      id: "maxRedemptionsPerUserPerStream",
      type: types.int(),
    });
    t.dataInput({
      name: "Global Cooldown",
      id: "globalCooldown",
      type: types.int(),
    });
    t.dataInput({
      name: "Skip Redemption Queue",
      id: "autoFulfill",
      type: types.bool(),
    });
    t.dataOutput({
      name: "Success",
      id: "success",
      type: types.bool(),
    });
    t.dataOutput({
      name: "Error Message",
      id: "errorMessage",
      type: types.string(),
    });
    t.dataOutput({
      name: "Redemption ID",
      id: "redemptionId",
      type: types.string(),
    });
  },
  async run({ ctx }) {
    const { user, helix } = unwrapApi();

    try {
      let data = await helix.channelPoints.createCustomReward(user.id, {
        title: ctx.getInput("title"),
        cost: ctx.getInput("cost"),
        prompt: ctx.getInput("prompt"),
        isEnabled: ctx.getInput("isEnabled"),
        backgroundColor: ctx.getInput("backgroundColor"),
        userInputRequired: ctx.getInput("userInputRequired"),
        maxRedemptionsPerStream: ctx.getInput("maxRedemptionsPerStream"),
        maxRedemptionsPerUserPerStream: ctx.getInput(
          "maxRedemptionsPerUserPerStream"
        ),
        globalCooldown: ctx.getInput("globalCooldown"),
        autoFulfill: ctx.getInput("autoFulfill"),
      });
      ctx.setOutput("success", true);
      ctx.setOutput("redemptionId", data?.id);
    } catch (error: any) {
      ctx.setOutput("success", false);
      ctx.setOutput("errorMessage", (JSON.parse(error.body) as any).message);
    }
  },
});

pkg.createNonEventSchema({
  name: "Follower Only Mode",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      id: "delay",
      name: "Delay (minutes)",
      type: types.int(),
    });
    t.dataInput({
      id: "enabled",
      type: types.bool(),
    });
  },
  run({ ctx }) {
    const { user, helix } = unwrapApi();

    helix.chat.updateSettings(user.id, user.id, {
      followerOnlyModeEnabled: ctx.getInput("enabled"),
      followerOnlyModeDelay: ctx.getInput("delay"),
    });
  },
});

pkg.createNonEventSchema({
  name: "Slow Mode",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      id: "delay",
      name: "Delay (seconds)",
      type: types.int(),
    });
    t.dataInput({
      id: "enabled",
      type: types.bool(),
    });
  },
  run({ ctx }) {
    const { user, helix } = unwrapApi();

    helix.chat.updateSettings(user.id, user.id, {
      slowModeEnabled: ctx.getInput("enabled"),
      slowModeDelay: ctx.getInput("delay"),
    });
  },
});

pkg.createNonEventSchema({
  name: "Sub Only Mode",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      id: "enabled",
      type: types.bool(),
    });
  },
  run({ ctx }) {
    const { user, helix } = unwrapApi();

    helix.chat.updateSettings(user.id, user.id, {
      subscriberOnlyModeEnabled: ctx.getInput("enabled"),
    });
  },
});

pkg.createNonEventSchema({
  name: "R9K Mode",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      id: "enabled",
      type: types.bool(),
    });
  },
  run({ ctx }) {
    const { user, helix } = unwrapApi();

    helix.chat.updateSettings(user.id, user.id, {
      uniqueChatModeEnabled: ctx.getInput("enabled"),
    });
  },
});

pkg.createNonEventSchema({
  name: "Shoutout User",
  variant: "Exec",
  generateIO: (t) => {
    t.dataInput({
      id: "userId",
      name: "User ID",
      type: types.string(),
    });
  },
  run({ ctx }) {
    const { user, helix } = unwrapApi();

    helix.chat.shoutoutUser(user.id, ctx.getInput("userId"), user.id);
  },
});