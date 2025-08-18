const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public")); // serve CSS, JS, etc.

let users = []; // in-memory user database
let websiteDisabled = false;

const WEBHOOK = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

// Sign up route
app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.json({ message: "Username already exists!" });
    }
    users.push({ username, password, status: "pending", ip: req.ip, area: "Unknown" });
    // Discord webhook notification
    fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: `🆕 Signup request: **${username}** | IP: ${req.ip}` })
    });
    res.json({ message: "Signup successful! Waiting for admin approval." });
});

// Sign in route
app.post("/signin", (req, res) => {
    if (websiteDisabled) return res.json({ message: "Website is temporarily down for updates." });

    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.json({ message: "Invalid credentials!" });
    
    if (user.status === "pending") return res.json({ message: "pending" });

    // Send webhook notification
    fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: `✅ User signed in: **${username}** | IP: ${req.ip}` })
    });

    res.json({ message: "success" });
});

// Admin routes
app.get("/users", (req, res) => {
    res.json(users);
});

app.post("/approve", (req, res) => {
    const { username } = req.body;
    const user = users.find(u => u.username === username);
    if (user) {
        user.status = "approved";
        fetch(WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: `✅ Approved user: **${username}**` })
        });
    }
    res.json({ message: "approved" });
});

app.post("/deny", (req, res) => {
    const { username } = req.body;
    users = users.filter(u => u.username !== username);
    fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: `❌ Denied user: **${username}**` })
    });
    res.json({ message: "denied" });
});

app.post("/kick", (req, res) => {
    const { username } = req.body;
    users = users.filter(u => u.username !== username);
    fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: `⚡ Kicked user: **${username}**` })
    });
    res.json({ message: "kicked" });
});

app.post("/toggle-website", (req, res) => {
    websiteDisabled = !websiteDisabled;
    res.json({ message: websiteDisabled ? "Website disabled" : "Website enabled" });
});

app.listen(PORT, () => console.log(`Ghostly Tools server running on http://localhost:${PORT}`));