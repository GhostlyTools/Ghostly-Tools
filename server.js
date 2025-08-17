const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const app = express();
const PORT = 3000;

// Your Discord Webhook
const WEBHOOK_URL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

// Local memory store
let users = []; // { username, password, ip, status: 'pending'|'approved'|'denied' }

// Middleware
app.use(bodyParser.json());
app.use(express.static("public")); // your HTML/CSS/JS files

// Send message to Discord webhook
async function sendToWebhook(message) {
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
  } catch (err) {
    console.error("Webhook error:", err.message);
  }
}

// Signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  users.push({ username, password, ip, status: "pending" });
  sendToWebhook(📝 New signup request:\n**User:** ${username}\n**IP:** ${ip}\nStatus: Pending);

  res.json({ success: true });
});

// Signin
app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

  if (user.status !== "approved") {
    return res.status(403).json({ success: false, message: "Not approved yet" });
  }

  sendToWebhook(🔑 User signed in:\n**User:** ${username}\n**IP:** ${req.ip});
  res.json({ success: true });
});

// Get users (for admin panel)
app.get("/users", (req, res) => {
  res.json(users);
});

// Approve user
app.post("/approve", (req, res) => {
  const { username } = req.body;
  const user = users.find(u => u.username === username);
  if (user) {
    user.status = "approved";
    sendToWebhook(✅ Approved access: **${username}**);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

// Deny user
app.post("/deny", (req, res) => {
  const { username } = req.body;
  const user = users.find(u => u.username === username);
  if (user) {
    user.status = "denied";
    sendToWebhook(❌ Denied access: **${username}**);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});

app.listen(PORT, () => console.log(Server running at http://localhost:${PORT}));