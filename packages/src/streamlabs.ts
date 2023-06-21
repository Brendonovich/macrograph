import { Maybe, None, Option, core, t } from "@macrograph/core";
import { io } from "socket.io-client";
import { createRoot, createSignal } from "solid-js";

const pkg = core.createPackage({
  name: "Streamlabs",
});

const { setToken, token, connect, disconnect, slState } = createRoot(() => {
  const [slState, setSLState] = createSignal<string>("disconnected");
  const [token, setToken] = createSignal<Option<string>>(
    Maybe(localStorage.getItem("streamlabsToken"))
  );

  const socket = io(`https://sockets.streamlabs.com?token=${token()}`, {
    transports: ["websocket"],
  });

  console.log("test");

  const connect = async () => {
    setSLState("connected");
    socket.connect();
  };

  const disconnect = async () => {
    console.log("test2");
    setSLState("disconnected");
    socket.disconnect();
    localStorage.removeItem("streamlabsToken");
  };

  socket.on("event", (eventData) => {
    console.log(eventData);
    if (!eventData.for && eventData.type === "donation") {
      console.log(eventData.message[0]);
      pkg.emitEvent({ name: "SLDonation", data: eventData.message[0] });
    }
  });

  return {
    token,
    connect,
    disconnect,
    slState,
    setToken: (token: string | null) => {
      setToken(Maybe(token));

      if (token === null) localStorage.removeItem("streamlabsToken");
      else localStorage.setItem("streamlabsToken", token);
    },
  };
});

export { setToken, token, connect, disconnect, slState };

pkg.createEventSchema({
  name: "Streamlabs Donation",
  event: "SLDonation",
  generateIO: (io) => {
    io.execOutput({
      id: "exec",
    });
    io.dataOutput({
      name: "Name",
      id: "name",
      type: t.string(),
    });
    io.dataOutput({
      name: "Amount",
      id: "amount",
      type: t.string(),
    });
    io.dataOutput({
      name: "Message",
      id: "message",
      type: t.string(),
    });
    io.dataOutput({
      name: "Currency",
      id: "currency",
      type: t.string(),
    });
    io.dataOutput({
      name: "From",
      id: "from",
      type: t.string(),
    });
    io.dataOutput({
      name: "From User Id",
      id: "fromUserId",
      type: t.string(),
    });
  },
  run({ ctx, data }) {
    ctx.setOutput("name", data.name);
    ctx.setOutput("amount", data.amount);
    ctx.setOutput("message", data.message);
    ctx.setOutput("currency", data.currency);
    ctx.setOutput("from", data.from);
    ctx.setOutput("fromUserId", data.from_user_id);
    ctx.exec("exec");
  },
});
