const WebSocket = require('ws');

const botcount = 100;
const bots = [];
var pck = new DataView(new ArrayBuffer(1024))

async function sock() {

  for (let i = 0; i < botcount; i++) {
    const bot = new WebSocket('wss://count.land:8443/');
    bots.push(bot);

    bot.on('open', function open() {
      console.log(`${i + 1} connected.`);
      let q = 1
      pck.setUint8(0, 1)
      bot.binaryType = 'arraybuffer'
      bot.send(new Uint8Array(pck.buffer, 0, q));
    });

    bot.on('message', function incoming(data) {
    });

    bot.on('error', function error(err) {
      console.error(`${i + 1} error:`, err);
    });

    bot.on('close', function close() {
      console.log(`${i + 1} disconnected.`);
    });
  }
}

sock().catch(err => console.error('Error spawning bots:', err));
