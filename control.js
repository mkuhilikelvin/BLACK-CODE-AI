import express from "express";

const app = express();
app.use(express.json());

export let botStatus = "Offline";
export let autoReply = true;
export let replyMessage = "BLACK-CODE-AI: Nimepokea ujumbe wako!";

app.get("/api/status", (req, res) => {
  res.json({ botStatus, autoReply, replyMessage });
});

app.post("/api/toggle", (req, res) => {
  autoReply = !autoReply;
  res.json({ autoReply });
});

app.post("/api/message", (req, res) => {
  const message = req.body.message;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Invalid message" });
  }

  replyMessage = message.trim().slice(0, 1000);
  res.json({ success: true });
});

app.listen(3001, "127.0.0.1", () => {
  console.log("CONTROL READY: 3001");
});0

