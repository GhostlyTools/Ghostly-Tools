// ---------- Popup Handling ----------
function showPopup(message){
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.innerText = message;
    popup.style.display = 'flex';
}

function closePopup(){
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

// ---------- Floating Logo Animation ----------
const logo = document.getElementById('logo');
let direction = 1;
setInterval(() => {
    if(logo){
        let current = parseFloat(getComputedStyle(logo).top);
        if(current <= 10) direction = 1;
        if(current >= 30) direction = -1;
        logo.style.top = (current + direction) + 'px';
    }
}, 100);

// ---------- Music Auto-Play (All Browsers) ----------
const music = document.getElementById('bg-music');
music.volume = 0.2;

function startMusic(){
    music.play().catch(()=>{});
}
music.play().catch(() => {
    document.body.addEventListener('click', startMusic, { once: true });
    document.body.addEventListener('touchstart', startMusic, { once: true });
});

// ---------- Kick / Admin Control ----------
const user = sessionStorage.getItem('loggedInUser');
if(user){
    setInterval(()=>{
        if(localStorage.getItem('kick_' + user) === 'true'){
            localStorage.removeItem('kick_' + user);
            sessionStorage.removeItem('loggedInUser');
            alert("You have been kicked by the admin.");
            window.location.href='auth.html';
        }
    }, 2000);
}

// ---------- Downloads Locking ----------
function checkDownloads(){
    const downloads = document.querySelector('.downloads');
    if(!downloads) return;

    let users = JSON.parse(localStorage.getItem('ghostlyUsers') || '{}');
    if(!users[user] || !users[user].approved){
        downloads.style.display = 'none';
        showPopup("Waiting for admin approval. Downloads are locked.");
    } else {
        downloads.style.display = 'block';
    }
}

window.addEventListener('load', checkDownloads);

// ---------- Logout Button ----------
const logoutBtn = document.getElementById('logout');
if(logoutBtn){
    logoutBtn.addEventListener('click', ()=>{
        sessionStorage.removeItem('loggedInUser');
        window.location.href='auth.html';
    });
}

// ---------- Welcome Popup ----------
window.addEventListener('load', ()=>{
    if(user){
        showPopup(Welcome to Ghostly Tools – The Ultimate Toolbox, ${user});
    }
});