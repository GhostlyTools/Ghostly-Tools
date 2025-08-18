const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const geoip = require('geoip-lite');
const app = express();
const PORT = 3000;

const WEBHOOK_URL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

// In-memory user store
let users = []; // { username, password, status: pending/approved/admin, ip, area }

// Admin credentials
const ADMIN_USERNAME = "Ghostly";
const ADMIN_PASSWORD = "Dare2995!";

app.use(bodyParser.json());
app.use(express.static('public'));

// ---------------- Sign Up ----------------
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const ip = req.ip;
    const geo = geoip.lookup(ip);
    const area = geo ? `${geo.city || "Unknown"}, ${geo.country}` : "Unknown";

    if(users.find(u => u.username === username)) {
        return res.json({ success:false, message: "Username already exists!" });
    }

    users.push({ username, password, status: "pending", ip, area });

    await axios.post(WEBHOOK_URL, {
        content: `🆕 New signup: **${username}** | IP: ${ip} | Area: ${area}`
    }).catch(console.error);

    res.json({ success:true, message: "Signed up! Waiting for admin approval." });
});

// ---------------- Sign In ----------------
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    const ip = req.ip;
    const geo = geoip.lookup(ip);
    const area = geo ? `${geo.city || "Unknown"}, ${geo.country}` : "Unknown";

    // Admin check
    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
        return res.json({ success:true, role: "admin" });
    }

    const user = users.find(u => u.username === username && u.password === password);
    if(!user) return res.json({ success:false, message:"Invalid credentials" });

    // Send webhook notification
    await axios.post(WEBHOOK_URL, {
        content: `🔑 Signin: **${username}** | IP: ${ip} | Area: ${area}`
    }).catch(console.error);

    if(user.status === "pending") return res.json({ success:true, role: "pending" });
    if(user.status === "approved") return res.json({ success:true, role: "user" });
});

// ---------------- Get Users ----------------
app.get('/users', (req,res) => res.json(users));

// ---------------- Approve ----------------
app.post('/approve', async (req,res) => {
    const { username } = req.body;
    const user = users.find(u => u.username === username);
    if(user){
        user.status = "approved";
        await axios.post(WEBHOOK_URL, { content: `✅ Approved: **${username}**` }).catch(console.error);
    }
    res.json({ success:true });
});

// ---------------- Deny ----------------
app.post('/deny', async (req,res) => {
    const { username } = req.body;
    users = users.filter(u => u.username !== username);
    await axios.post(WEBHOOK_URL, { content: `❌ Denied/Kicked: **${username}**` }).catch(console.error);
    res.json({ success:true });
});

// ---------------- Disable Website ----------------
let siteDisabled = false;
app.post('/disable', (req,res) => {
    siteDisabled = true;
    res.json({ success:true });
});
app.get('/check-disabled', (req,res) => res.json({ disabled: siteDisabled }));

app.listen(PORT, () => console.log(`Ghostly Tools server running on http://localhost:${PORT}`));