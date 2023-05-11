import { types } from "../../types";
import { rspc } from "../../rspc";
import { rspcClient } from "../../client";

interface StreamdeckWebsocketMessage {
    action: "org.tynsoe.streamdeck.wsproxy.proxy";
    context: string;
    device: string;
    event: "willAppear" | "willDisappear" | "keyDown" | "keyUp";
    payload: {
        coordinates: {
            column: number;
            row: number;
        };
        isInMultiAction: boolean;
        settings: {
            id: string;
            remoteServer: string;
        };
    };
}

rspcClient.addSubscription(() => ["streamdeck.button"], {
    onData: (m) => {
        console.log(m);
    }
})

//   server.on("connection", (socket: any) => {
//     console.log("streamdeck connected");
//     socket.on("message", async (rawData: any) => {
//       const data = JSON.parse(rawData.toString()) as StreamdeckWebsocketMessage;
//         pkg.emitEvent({name: "streamDeck", data: data});
//     });
//   });

pkg.createEventSchema({
    name: "Streamdeck",
    event: "streamDeck",
    generateIO(t) {
        t.execOutput({
            id: "exec",
            name: "",
        });
        t.dataInput({
            id: "string",
            name: "Button Name",
            type: types.string(),
        });
    },
    run({ ctx, data }) {
        if (data.payload.settings.id === ctx.getInput("string")) ctx.exec("exec");
    }
})