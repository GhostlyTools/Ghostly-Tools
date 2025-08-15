let users = [];
const admin = { username: "Ghostly", password: "Dare2995!", verified: true };
const WEBHOOK_URL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

const music = document.getElementById('bg-music');
music.volume = 0.8;
music.play().catch(()=>{});

document.getElementById('sign-up-btn').onclick = ()=>{
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('userpass').value.trim();
    if(!username||!password){alert("Enter username & password");return;}
    if(users.find(u=>u.username===username)){alert("Username exists!");return;}
    users.push({username,password,verified:false});
    alert("Signed up! Waiting for admin approval.");
    showPopup("Waiting for verification...");
    notifyDiscord(username);
};

document.getElementById('sign-in-btn').onclick = ()=>{
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('userpass').value.trim();
    if(username===admin.username && password===admin.password){
        window.location.href="admin.html";return;
    }
    let user = users.find(u=>u.username===username && u.password===password);
    if(!user){alert("Invalid credentials");return;}
    if(!user.verified){showPopup("Waiting for verification...");return;}
    document.getElementById('downloads').style.display="block";
    alert("Access granted!");
};

function showPopup(msg){
    document.getElementById('popup-text').innerText = msg;
    document.getElementById('popup-message').style.display="block";
}
function closePopup(){document.getElementById('popup-message').style.display="none";}

function notifyDiscord(username){
    fetch(WEBHOOK_URL,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({content:`New user signed up: ${username}`})
    });
}

window.addEventListener('scroll',()=>{
    document.querySelectorAll('.smoke').forEach(s=> s.style.opacity = Math.max(0.1,0.2-window.scrollY/1000));
});