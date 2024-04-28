const WebSocket = require("ws");

const botname = "botzzzz";
const botcount = 100;

const bots = [];
const txt = new TextEncoder();
const pck = new DataView(new ArrayBuffer(1024));

async function sock() {
    for (let i = 0; i < botcount; i++) {
      
        const bot = new WebSocket("wss://count.land:8443/");
        bots.push(bot);

        bot.on("open", function open() {
            console.log(`${i + 1} connected.`);
          
            pck.setUint8(0, 1);
            bot.binaryType = "arraybuffer";
            let q = txt.encodeInto(botname, new Uint8Array(pck.buffer, 1)).written;
          
            // auto respawn in case of bot died
            setInterval(()=> {
              bot.send(new Uint8Array(pck.buffer, 0, q));
            }, 2000)
          
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
