const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = await import("@whiskeysockets/baileys");

const pino = require("pino");

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    browser: ["BLACK-CODE-AI", "Chrome", "1.0.0"]
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      console.log("BLACK-CODE-AI CONNECTED!");
    }

    if (connection === "close") {
      const code = lastDisconnect?.error?.output?.statusCode;

      if (code !== DisconnectReason.loggedOut) {
        startBot();
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    const msg = messages[0];

    if (!msg.message || msg.key.fromMe) return;

    const jid = msg.key.remoteJid;

    if (!jid || jid.endsWith("@g.us")) return;

    await sock.sendMessage(jid, {
      text: "BLACK-CODE-AI imepokea ujumbe wako. AI inajiandaa..."
    });
  });
}

startBot();
