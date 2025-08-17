const WEBHOOK_URL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

// Toggle between Sign Up / Sign In forms
document.getElementById('show-signup').addEventListener('click', ()=>{
    document.getElementById('signin-form').style.display='none';
    document.getElementById('signup-form').style.display='block';
});
document.getElementById('show-signin').addEventListener('click', ()=>{
    document.getElementById('signup-form').style.display='none';
    document.getElementById('signin-form').style.display='block';
});

// Pop-up
function showPopup(message){
    const popup = document.getElementById('popup');
    const msg = document.getElementById('popup-message');
    msg.innerText = message;
    popup.style.display = 'flex';
}
function closePopup(){
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

// Discord webhook notification
function sendDiscord(type, username){
    fetch(WEBHOOK_URL, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({content:`${type}: ${username}`})
    }).catch(err=>console.log(err));
}

// Sign Up
document.getElementById('signup-btn').addEventListener('click', ()=>{
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    if(!username||!password){
        showPopup("Please enter both fields.");
        return;
    }
    let users = JSON.parse(localStorage.getItem('ghostlyUsers')||'{}');
    if(users[username]){
        showPopup("Username already exists.");
        return;
    }
    users[username] = {password: password, approved: false};
    localStorage.setItem('ghostlyUsers', JSON.stringify(users));
    sendDiscord("New Signup / Request Approval", username);
    showPopup("Account created! Waiting for admin approval.");
    document.getElementById('signup-form').style.display='none';
    document.getElementById('signin-form').style.display='block';
});

// Sign In
document.getElementById('signin-btn').addEventListener('click', ()=>{
    const username = document.getElementById('signin-username').value.trim();
    const password = document.getElementById('signin-password').value.trim();
    let users = JSON.parse(localStorage.getItem('ghostlyUsers')||'{}');
    if(users[username] && users[username].password===password){
        sessionStorage.setItem('loggedInUser', username);
        if(!users[username].approved){
            sendDiscord("Approval Request", username);
            showPopup("Waiting for admin approval. Downloads are locked.");
            window.location.href='index.html'; // redirect to index but downloads hidden
        } else {
            sendDiscord("Login", username);
            window.location.href='index.html';
        }
    } else {
        showPopup("Incorrect username or password.");
    }
});