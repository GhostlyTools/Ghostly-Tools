const WEBHOOK_URL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

// Admin credentials
const ADMIN_USERNAME = "Ghostly";
const ADMIN_PASSWORD = "Dare2995!";

document.getElementById('admin-login').addEventListener('click', ()=>{
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD){
        document.getElementById('admin-username').style.display = 'none';
        document.getElementById('admin-password').style.display = 'none';
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('user-list').style.display = 'block';
        loadUsers();
    } else {
        showPopup("Incorrect username or password.");
    }
});

function loadUsers(){
    const users = JSON.parse(localStorage.getItem('ghostlyUsers')) || {};
    const ul = document.getElementById('users-ul');
    ul.innerHTML = '';
    for(let username in users){
        const li = document.createElement('li');
        li.innerText = username + ' ';
        
        if(!users[username].approved){
            const approveBtn = document.createElement('button');
            approveBtn.innerText = 'Approve';
            approveBtn.addEventListener('click', ()=>{
                users[username].approved = true;
                localStorage.setItem('ghostlyUsers', JSON.stringify(users));
                sendDiscord("Approved User", username);
                showPopup(User ${username} approved.);
                li.remove();
            });
            li.style.marginBottom='5px';
            li.appendChild(approveBtn);
        }

        const kickBtn = document.createElement('button');
        kickBtn.innerText = 'Kick';
        kickBtn.style.marginLeft = '5px';
        kickBtn.addEventListener('click', ()=>{
            confirmKick(username, ()=>{
                delete users[username];
                localStorage.setItem('ghostlyUsers', JSON.stringify(users));
                sendDiscord("Kicked User", username);
                showPopup(User ${username} kicked.);
                li.remove();
            });
        });
        li.appendChild(kickBtn);
        ul.appendChild(li);
    }
}

// Confirm kick with popup
function confirmKick(username, callback){
    showPopup(Are you sure you want to kick ${username}?);
    const btn = document.querySelector('#popup .popup-content button');
    btn.onclick = () => { closePopup(); callback(); };
}

function sendDiscord(type, username){
    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({content:`${type}: ${username}`})
    }).catch(err => console.log(err));
}