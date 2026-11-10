import "dotenv/config";
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";

import OpenAI from "openai";
import pino from "pino";
import readline from "readline";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let aiEnabled = false;
const chatHistories = new Map();
const cooldowns = new Map();
let dailyRequests = 0;
let requestDate = new Date().toDateString();
const DAILY_LIMIT = 40;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", (input) => {
  const command = input.trim().toLowerCase();

  if (command === "ai on") {
    aiEnabled = true;
    console.log("BLACK-CODE-AI: AI IMEWASHWA!");
  } else if (command === "ai off") {
    aiEnabled = false;
    console.log("BLACK-CODE-AI: AI IMEZIMWA!");
  } else if (command === "status") {
    console.log("AI STATUS:", aiEnabled ? "ON" : "OFF");
  } else {
    console.log("Commands: ai on | ai off | status");
  }
});

async function startBot() {
  const { state, saveCreds } =
    await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "warn" })
  });

  let pairingRequested = false;

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (
      qr &&
      !sock.authState.creds.registered &&
      !pairingRequested
    ) {
      pairingRequested = true;

      rl.question(
        "Weka namba yako (255XXXXXXXXX): ",
        async (number) => {
          try {
            const phone = number.trim();

            if (!/^255\d{9}$/.test(phone)) {
              console.log("Namba si sahihi.");
              return;
            }

            const code =
              await sock.requestPairingCode(phone);

            console.log("BLACK-CODE-AI PAIRING CODE:", code);
          } catch (error) {
            console.error("PAIRING ERROR:", error.message);
          }
        }
      );
    }

    if (connection === "open") {
      console.log("BLACK-CODE-AI CONNECTED!");
      console.log("AI STATUS: OFF");
      console.log("Tumia: ai on | ai off | status");
    }

    if (connection === "close") {
      const status =
        lastDisconnect?.error?.output?.statusCode;

      console.log("CONNECTION CLOSED. STATUS:", status);

      if (status === DisconnectReason.restartRequired) {
        console.log("Restarting BLACK-CODE-AI...");
        await startBot();
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify" || !aiEnabled) return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const jid = msg.key.remoteJid;
if (jid?.endsWith("@g.us")) {
  console.log("GROUP ID:", jid);
}
      if (
        !jid ||
        jid.endsWith("@newsletter") ||
        jid.endsWith("@status")
      ) continue;

      const messageText =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        msg.message.videoMessage?.caption;

      if (!messageText?.trim()) continue;

      // Kikomo cha matumizi ya AI
      const today = new Date().toDateString();

      if (requestDate !== today) {
        requestDate = today;
        dailyRequests = 0;
      }

      if (dailyRequests >= DAILY_LIMIT) {
        console.log("BLACK-CODE-AI: Kikomo cha leo kimefika!");
        continue;
      }

      const now = Date.now();
      const lastReply = cooldowns.get(jid) || 0;

      if (now - lastReply < 30000) continue;

      cooldowns.set(jid, now);
      dailyRequests++;

      const history = chatHistories.get(jid) || [];

      history.push({
        role: "user",
        content: messageText.trim()
      });

      if (history.length > 10) {
        history.splice(0, history.length - 10);
      }

      chatHistories.set(jid, history);

      try {
        console.log("AI INAPOKEA:", messageText);

        const response = await openai.responses.create({
          model: "gpt-6-luna",
          instructions:
            "You are BLACK-CODE-AI, a helpful assistant. " +
            "Understand Swahili and English. Reply naturally, " +
            "clearly and concisely. Use the language of the user.",
          input: history,
          max_output_tokens: 300
        });

        const answer = response.output_text;

        if (answer) {
          history.push({
            role: "assistant",
            content: answer
          });

          chatHistories.set(jid, history);

          await sock.sendMessage(jid, {
            text: "BLACK-CODE-AI 🤖\n\n" + answer
          });
        }

      } catch (error) {
        cooldowns.delete(jid);
        console.error("AI ERROR:", error.message);
      }
    }
  });
}

startBot().catch(console.error);
