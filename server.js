// server.js
const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // For Discord webhook
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // serve auth.html, signup.html, index.html, pending.html, style.css

// In-memory users storage
let users = [];
let websiteDisabled = false;

// Discord webhook URL
const WEBHOOK_URL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

// Helper to send webhook notifications
async function sendWebhook(content) {
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

// Signup
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;
  const exists = users.find(u => u.username === username);
  if (exists) return res.json({ message: "Username already exists" });

  const newUser = { username, password, status: "pending", ip };
  users.push(newUser);

  await sendWebhook(`📝 New signup:\nUsername: ${username}\nIP: ${ip}\nStatus: Pending`);
  res.json({ message: "Signup successful! Waiting for admin approval." });
});

// Signin
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.json({ message: "Invalid credentials" });

  await sendWebhook(`🔑 User signed in:\nUsername: ${username}\nIP: ${ip}\nStatus: ${user.status}`);
  if (user.status === "pending") return res.json({ status: "pending" });
  res.json({ status: "approved" });
});

// Admin authentication middleware
function adminAuth(req, res, next) {
  const { username, password } = req.headers;
  if (username === "Ghostly" && password === "Dare2995!") return next();
  res.status(403).json({ message: "Forbidden" });
}

// Get all users
app.get("/users", adminAuth, (req, res) => {
  res.json(users);
});

// Approve user
app.post("/approve", adminAuth, async (req, res) => {
  const { username } = req.body;
  const user = users.find(u => u.username === username);
  if (user) {
    user.status = "approved";
    await sendWebhook(`✅ User approved:\nUsername: ${username}\nIP: ${user.ip}`);
    return res.json({ message: "User approved" });
  }
  res.json({ message: "User not found" });
});

// Deny user
app.post("/deny", adminAuth, async (req, res) => {
  const { username } = req.body;
  const user = users.find(u => u.username === username);
  if (user) {
    user.status = "denied";
    await sendWebhook(`❌ User denied:\nUsername: ${username}\nIP: ${user.ip}`);
    return res.json({ message: "User denied" });
  }
  res.json({ message: "User not found" });
});

// Kick user
app.post("/kick", adminAuth, async (req, res) => {
  const { username } = req.body;
  const index = users.findIndex(u => u.username === username);
  if (index !== -1) {
    const kickedUser = users.splice(index, 1)[0];
    await sendWebhook(`🦵 User kicked:\nUsername: ${kickedUser.username}\nIP: ${kickedUser.ip}`);
    return res.json({ message: "User kicked" });
  }
  res.json({ message: "User not found" });
});

// Disable/enable website
app.post("/disable", adminAuth, async (req, res) => {
  const { disable } = req.body;
  websiteDisabled = disable;
  await sendWebhook(`⚠️ Website ${disable ? "disabled" : "enabled"} by admin`);
  res.json({ message: `Website ${disable ? "disabled" : "enabled"}` });
});

// Check website status
app.get("/status", (req, res) => {
  res.json({ disabled: websiteDisabled });
});

// Start server
app.listen(port, () => {
  console.log(`Ghostly Tools server running on port ${port}`);
});