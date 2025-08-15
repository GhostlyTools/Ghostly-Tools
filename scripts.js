const users = {}; // {username:{password:'',approved:false}}
const admin = {username:'Ghostly', password:'Dare2995!'};
const webhook = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const signupBtn = document.getElementById('signup-btn');
const signinBtn = document.getElementById('signin-btn');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const downloads = document.getElementById('downloads');

// Play music
const music = document.getElementById('bg-music');
music.volume = 0.8;
music.play().catch(()=>{document.addEventListener('click',()=>music.play());});

// Sign Up
signupBtn.addEventListener('click',()=>{
    const user = usernameInput.value.trim();
    const pass = passwordInput.value;
    if(!user || !pass){showPopup("Fill both fields."); return;}
    if(users[user]){showPopup("Username already exists."); return;}
    users[user] = {password:pass, approved:false};
    showPopup("Signed up! Wait for verification.");
    sendWebhook(user,pass);
    usernameInput.value=''; passwordInput.value='';
});

// Sign In
signinBtn.addEventListener('click',()=>{
    const user = usernameInput.value.trim();
    const pass = passwordInput.value;
    if(user===admin.username && pass===admin.password){
        showPopup("Admin logged in!");
        // Admin view handled separately
        usernameInput.value=''; passwordInput.value='';
        return;
    }
    if(!users[user]){showPopup("User not found."); return;}
    if(users[user].password!==pass){showPopup("Incorrect password."); return;}
    if(!users[user].approved){showPopup("Wait for verification."); return;}
    downloads.style.display='block';
    showPopup("Access granted!");
});

// Pop-up helpers
function showPopup(msg){
    popupMessage.innerText=msg;
    popup.style.display='block';
}
function closePopup(){popup.style.display='none';}

// Discord webhook
function sendWebhook(user,pass){
    fetch(webhook,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({content:`New signup: ${user}`})
    });
}

// Smoke fade on scroll
window.addEventListener('scroll',()=>{
    const smokes=document.querySelectorAll('.smoke');
    smokes.forEach(smoke=>{
        smoke.style.opacity=Math.max(0.1,0.2-window.scrollY/1000);
    });
});