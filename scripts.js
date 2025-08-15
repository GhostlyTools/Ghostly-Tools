const webhookURL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";
const adminUser = "Ghostly";
const adminPass = "Dare2995!";
let users = {}; // store username, password, approved status

const usernameInput = document.getElementById("username");
const userpassInput = document.getElementById("userpass");
const signUpBtn = document.getElementById("sign-up-btn");
const signInBtn = document.getElementById("sign-in-btn");
const popup = document.getElementById("popup-message");
const popupText = document.getElementById("popup-text");
const downloads = document.getElementById("downloads");

// Sign Up
signUpBtn.addEventListener("click", () => {
    const u = usernameInput.value.trim();
    const p = userpassInput.value;
    if(!u || !p) return alert("Enter username and password");
    if(users[u]) return alert("Username already exists");

    users[u] = {pass:p, approved:false};
    showPopup("Your account is pending admin approval. You cannot access downloads yet.");
    sendDiscordNotification(u);
});

// Sign In
signInBtn.addEventListener("click", () => {
    const u = usernameInput.value.trim();
    const p = userpassInput.value;

    // Admin login
    if(u === adminUser && p === adminPass){
        window.location.href = "admin.html";
        return;
    }

    if(!users[u]) return alert("User not found");
    if(users[u].pass !== p) return alert("Wrong password");

    if(users[u].approved){
        downloads.style.display = "block";
        alert("Access granted! Downloads unlocked.");
    } else {
        showPopup("Your account is pending admin approval. You cannot access downloads yet.");
    }
});

// Pop-up
function showPopup(msg){
    popup.style.display = "block";
    popupText.innerText = msg;
}
function closePopup(){
    popup.style.display = "none";
}

// Discord webhook
function sendDiscordNotification(username){
    fetch(webhookURL, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({content:`New signup request: **${username}**`})
    });
}

// Play music (force autoplay)
const music = document.getElementById('bg-music');
music.volume = 0.8;
music.play().catch(() => {
    const resume = () => { music.play().finally(()=>{
        window.removeEventListener('click', resume);
        window.removeEventListener('keydown', resume);
        window.removeEventListener('scroll', resume);
    })};
    window.addEventListener('click', resume);
    window.addEventListener('keydown', resume);
    window.addEventListener('scroll', resume);
});

// Smoke opacity on scroll
window.addEventListener('scroll', () => {
    const smokes = document.querySelectorAll('.smoke');
    smokes.forEach(s => s.style.opacity = Math.max(0.1, 0.2 - window.scrollY/1000));
});