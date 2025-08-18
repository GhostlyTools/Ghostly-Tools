const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const app = express();
const PORT = 3000;

// In-memory users list
let users = []; // {username, password, status: "pending"/"approved", ip, area}

// Website disable flag
let websiteDisabled = false;

const WEBHOOK = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

app.use(express.static("public"));
app.use(bodyParser.json());

function sendWebhook(content) {
  fetch(WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

// Middleware to block site if disabled
app.use((req, res, next) => {
  if (websiteDisabled && !req.path.startsWith("/admin")) {
    res.sendFile(__dirname + "/public/updates.html");
  } else next();
});

// Signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.json({ message: "Username already exists" });
  }
  const ip = req.ip;
  const area = "Unknown"; // Could integrate a geo IP API
  users.push({ username, password, status: "pending", ip, area });
  sendWebhook(`New signup: ${username} | IP: ${ip} | Area: ${area}`);
  res.json({ message: "Signup successful! Await admin approval." });
});

// Signin
app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.json({ message: "Invalid credentials" });
  if (user.status === "pending") return res.json({ message: "pending" });
  sendWebhook(`User signed in: ${username} | IP: ${user.ip} | Area: ${user.area}`);
  res.json({ message: "success" });
});

// Admin login
app.post("/adminlogin", (req, res) => {
  const { username, password } = req.body;
  if (username === "Ghostly" && password === "Dare2995!") {
    res.json({ message: "success" });
  } else res.json({ message: "Invalid admin credentials" });
});

// Get users for admin panel
app.get("/users", (req, res) => res.json(users));

// Approve user
app.post("/approve", (req, res) => {
  const { username } = req.body;
  const user = users.find(u => u.username === username);
  if (user) {
    user.status = "approved";
    sendWebhook(`✅ Approved: ${username}`);
  }
  res.json({ success: true });
});

// Deny user
app.post("/deny", (req, res) => {
  const { username } = req.body;
  const index = users.findIndex(u => u.username === username);
  if (index !== -1) {
    sendWebhook(`❌ Denied: ${username}`);
    users.splice(index, 1);
  }
  res.json({ success: true });
});

// Kick user
app.post("/kick", (req, res) => {
  const { username } = req.body;
  const index = users.findIndex(u => u.username === username);
  if (index !== -1) {
    sendWebhook(`🛑 Kicked: ${username}`);
    users.splice(index, 1);
  }
  res.json({ success: true });
});

// Disable/enable site
app.post("/disable", (req, res) => {
  websiteDisabled = req.body.disable;
  sendWebhook(`⚠️ Website ${websiteDisabled ? "disabled for updates" : "enabled"}`);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));