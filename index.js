const WebSocket = require("ws");

const BotBaseConfig = {
    BotName: "random",
    BotsAmount: 25,
    BotPrefix: "[BOT]",
    BotDirection: 'random', // random, closest, ai
    UpdateDirectionFrequenty: 1500 // ms
};

const BotMessageConfig = {
    EnableMessage: false,
    MessageInterval: 1, // second
    BotMessage: "botzzz",
};

const mouse_controller = {
    to_bottom: { x: 0, y: 300 },
    to_up: { x: 0, y: -300 },
    to_left: { x: -300, y: 0 },
    to_right: { x: 300, y: 0 },
    to_bottom_left: { x: -300, y: 300 },
    to_bottom_right: { x: 300, y: 300 },
    to_up_left: { x: -300, y: -300 },
    to_up_right: { x: 300, y: -300 },
};

const store = {
    bots: [],
    encoder: new TextEncoder(),
    buffer: new DataView(new ArrayBuffer(1024)),
    RandomBotNames: [],
};

const packets = {
    spawn: [0, 1],
    chat: [0, 128],
    mouse: [0, 7],
};

async function sock() {
    for (let i = 0; i < BotBaseConfig.BotsAmount; i++) {
        let bot;
        try {
            bot = new WebSocket("wss://count.land:8443/", {
                rejectUnauthorized: false,
            });
        } catch (error) {
            console.error(`${i + 1} `, error);
            continue;
        }

        store.bots.push(bot);

        bot.on("open", function open() {
            console.log(`${i + 1} connected`);

            bot.binaryType = "arraybuffer";

            function write_payload(arr, data, m) {
                if (m == false) {
                    let pce = 1 + store.encoder.encodeInto(data, new Uint8Array(store.buffer.buffer, 1)).written;
                    store.buffer.setUint8(arr[0], arr[1]);
                    bot.send(new Uint8Array(store.buffer.buffer, 0, pce));
                } else {
                    store.buffer.setUint8(0, 0);
                    store.buffer.setInt16(1, data.x);
                    store.buffer.setInt16(3, data.y);
                    store.buffer.setInt16(5, 0);
                    bot.send(new Uint8Array(store.buffer.buffer, arr[0], arr[1]));
                }
            }

            const botname = BotBaseConfig.BotName === "random" ? store.RandomBotNames[Math.floor(Math.random() * store.RandomBotNames.length)] : BotBaseConfig.BotPrefix + BotBaseConfig.BotName;

            setTimeout(() => {
                write_payload(packets.spawn, botname, false);
                write_payload(packets.mouse, { x: mouse_controller.to_left.x, y: mouse_controller.to_left.y }, true);
            }, 1000);

          setInterval(()=> {
            const { x, y } = mouse_controller[Object.keys(mouse_controller)[Math.floor(Math.random() * Object.keys(mouse_controller).length)]];

            write_payload(packets.mouse, { x: x, y: y }, true);
          }, BotBaseConfig.UpdateDirectionFrequenty);

            if (BotMessageConfig.EnableMessage) {
                setInterval(() => {
                    write_payload(packets.chat, BotMessageConfig.BotMessage, false);
                }, BotMessageConfig.MessageInterval * 1000);
            }
        });

        bot.on("error", function error(err) {
            console.error(`${i + 1} error:`, err);
        });

        bot.on("close", function close() {
            console.log(`${i + 1} disconnected.`);
        });
    }
}

store.RandomBotNames = [
    "Cypher",
    "Apex",
    "Nebula",
    "Blitz",
    "Rogue",
    "la gripe yt",
    "Zen",
    "Alpha",
    "Omega",
    "ohio master",
    "Fusion",
    "Infinity",
    "Velocity",
    "Chronos",
    "Aether",
    "fire806",
    "Lunar",
    "Solar",
    "crazy carrot",
    "trv 9000",
    "Blade",
    "Storm",
    "Fury",
    "Doom",
    "Rogue",
    "hi im octo",
    "Ninja",
    "Sphinx",
    "Mystic",
    "Whisper",
    "Player50",
    "Pro123",
    "ShadowKnight",
    "NEPTUUN",
    "IceBreaker",
    "FireStorm",
    "StormChaser",
    "SwiftStriker",
    "ShadowWalker",
    "EagleEye",
];

sock().catch((err) => console.error("Error spawning bots:", err));
