import { core, t } from "@macrograph/core";
import { io } from "socket.io-client";

let socketToken = "";

const pkg = core.createPackage({
  name: "Streamlabs",
});

const socket = io(`https://sockets.streamlabs.com?token=${socketToken}`, {
  transports: ["websocket"],
});

socket.on("event", (eventData) => {
  console.log(eventData);
  if (!eventData.for && eventData.type === "donation") {
    console.log(eventData.message[0]);
    pkg.emitEvent({ name: "SLDonation", data: eventData.message[0] });
  }
});

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
