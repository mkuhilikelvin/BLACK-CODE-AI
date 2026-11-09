import express from "express";
const app = express();
const PORT = 3000;

app.use(express.json());

let botStatus = "Offline";
let autoReply = true;
let replyMessage = "BLACK-CODE-AI: Nimepokea ujumbe wako!";

const members = [
  { name: "Pacha", role: "admin" },
  { name: "Latitude", role: "admin" },
  { name: "You", role: "member" }
];

const permissions = {
  "Edit group info": "admin",
  "Send messages": "all",
  "Add members": "admin",
  "Manage admins": "admin"
};

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>BLACK-CODE-AI</title>
      <style>
        body {
          background:#080d18;
          color:white;
          font-family:Arial;
          padding:20px;
        }
        .card {
          background:#151e30;
          padding:20px;
          border-radius:15px;
          margin-bottom:15px;
        }
        button {
          background:#00c878;
          padding:12px 20px;
          border:0;
          border-radius:8px;
          margin:5px;
        }
        textarea {
          width:100%;
          box-sizing:border-box;
          padding:10px;
        }
        .member {
          padding:10px;
          background:#202d42;
          margin:8px 0;
          border-radius:8px;
        }
      </style>
    </head>
    <body>
      <h1>BLACK-CODE-AI</h1>
      <p>CONTROL PANEL</p>

      <div class="card">
        <h3>Bot Status</h3>
        <p id="status">Loading...</p>
      </div>

      <div class="card">
        <h3>Auto Reply</h3>
        <p id="replyStatus"></p>
        <button onclick="toggleReply()">ON / OFF</button>
      </div>

      <div class="card">
        <h3>Reply Message</h3>
        <textarea id="message" rows="4"></textarea>
        <br><br>
        <button onclick="saveMessage()">SAVE</button>
      </div>

      <div class="card">
        <h3>GROUP SECURITY LAB</h3>
        <p>Simulator members and roles</p>
        <div id="members"></div>
        <button onclick="testPermissions()">TEST PERMISSIONS</button>
        <pre id="results"></pre>
      </div>

      <script>
        async function loadData() {
          const r = await fetch("/api/status");
          const d = await r.json();

          document.getElementById("status").innerText = d.botStatus;
          document.getElementById("replyStatus").innerText =
            d.autoReply ? "ON" : "OFF";
          document.getElementById("message").value = d.replyMessage;
        }

        async function toggleReply() {
          await fetch("/api/toggle", {method:"POST"});
          loadData();
        }

        async function saveMessage() {
          const message = document.getElementById("message").value;

          const r = await fetch("/api/message", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({message})
          });

          if (r.ok) alert("Saved!");
          else alert("Imeshindikana kuhifadhi");

          loadData();
        }

        async function loadMembers() {
          const r = await fetch("/api/lab/members");
          const d = await r.json();

          document.getElementById("members").innerHTML =
            d.members.map(m =>
              '<div class="member">' + m.name + ' — ' + m.role + '</div>'
            ).join("");
        }

        async function testPermissions() {
          const r = await fetch("/api/lab/test");
          const d = await r.json();

          document.getElementById("results").textContent =
            d.results.map(x =>
              x.name + "\\n" + x.tests.join("\\n")
            ).join("\\n\\n");
        }

        loadData();
        loadMembers();
      </script>
    </body>
    </html>
  `);
});

app.get("/api/status", (req, res) => {
  res.json({botStatus, autoReply, replyMessage});
});

app.post("/api/toggle", (req, res) => {
  autoReply = !autoReply;
  res.json({autoReply});
});

app.post("/api/message", (req, res) => {
  if (typeof req.body.message !== "string" ||
      !req.body.message.trim()) {
    return res.status(400).json({error:"Invalid message"});
  }

  replyMessage = req.body.message.trim().slice(0,1000);
  res.json({success:true});
});

app.get("/api/lab/members", (req, res) => {
  res.json({members});
});

app.get("/api/lab/test", (req, res) => {
  const results = members.map(member => ({
    name: member.name,
    tests: Object.entries(permissions).map(([action, required]) => {
      const allowed =
        required === "all" || member.role === "admin";

      return action + ": " + (allowed ? "ALLOWED" : "DENIED");
    })
  }));

  res.json({results});
});

app.listen(PORT, "127.0.0.1", () => {
  console.log("BLACK-CODE-AI PANEL: http://127.0.0.1:3000");
});0

