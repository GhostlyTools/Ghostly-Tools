const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3000;
const WEBHOOK_URL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

app.use(cors());
app.use(express.json());

// Signup event
app.post('/signup-webhook', async (req, res) => {
    const { username, ip } = req.body;
    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: 👻 New signup request:\nUsername: ${username}\nIP: ${ip}\nStatus: Pending approval
            })
        });
        res.sendStatus(200);
    } catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Status update (approve/deny)
app.post('/status-webhook', async (req,res)=>{
    const { username, ip, status } = req.body;
    try{
        await fetch(WEBHOOK_URL,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                content: 👻 User status update:\nUsername: ${username}\nIP: ${ip}\nStatus: ${status}
            })
        });
        res.sendStatus(200);
    } catch(err){
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, ()=>console.log(Ghostly server running on http://localhost:${PORT}));