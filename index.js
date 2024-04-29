const WebSocket = require("ws");
const fs = require("fs");

const botname = "AI bot testing";
var botsa = 10;
const botmsg = "bot spawned";

const bots = [];
const encoder = new TextEncoder();
const buffer = new DataView(new ArrayBuffer(1024));

const packets = {
    spawn: [0, 1],
    chat: [0, 128],
    mouse: [5, 0]
};

async function sock() {
    for (let i = 0; i < botsa; i++) {

        let bot;
        try {
            bot = new WebSocket("wss://count.land:8443/", { rejectUnauthorized: false });
        } catch (error) {
            console.error(`${i + 1} `, error);
            continue;
        }

        bots.push(bot);

        bot.on("open", function open() {
            console.log(`${i + 1} connected`);

            bot.binaryType = "arraybuffer";

            function write_payload(arr, data, m) {
                if(m == false) {
                    let pce = 1 + encoder.encodeInto(data, new Uint8Array(buffer.buffer, 1)).written;
                    buffer.setUint8(arr[0], arr[1]);
                    bot.send(new Uint8Array(buffer.buffer, 0, pce));
                } else {
                    buffer.setUint8(0, 0)
                    bot.send(new Uint8Array(buffer.buffer, 0, 7));
                }
            }

            setTimeout(() => {
                write_payload(packets.spawn, botname, false);
                write_payload(packets.chat, botmsg, false);
                write_payload(0,0,true)
            }, 1000);

          // prevent timeout
          setInterval(()=> {
            write_payload(packets.chat, 'ping', false);
          }, 5000)

          
        });

        bot.on("message", function incoming(data) {});

        bot.on("error", function error(err) {
            console.error(`${i + 1} error:`, err);
        });

        bot.on("close", function close() {
            console.log(`${i + 1} disconnected.`);
        });
    }
}


sock().catch((err) => console.error("Error spawning bots:", err));
