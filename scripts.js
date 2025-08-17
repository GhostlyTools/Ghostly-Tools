const webhookURL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";
const userDropdownsContainer = document.getElementById("user-dropdowns");

const music=document.getElementById("bg-music");
music.volume=1.0;
function playMusic(){music.play().catch(()=>{});}
playMusic();
['click','keydown','touchstart'].forEach(e=>document.addEventListener(e, playMusic, {once:true}));

function filterUsersDropdown() {
  const filter = document.getElementById("search").value.toLowerCase();
  const dropdowns = document.querySelectorAll(".user-dropdown");
  dropdowns.forEach(drop => {
    const username = drop.dataset.username.toLowerCase();
    const ip = drop.dataset.ip;
    drop.style.display = (username.includes(filter) || ip.includes(filter)) ? "block" : "none";
  });
}

function updateOnlineCount() {
  const online = document.querySelectorAll(".user-dropdown .status.online").length;
  document.getElementById("online-count").innerText = online;
}

function loadUsers() {
  const users = JSON.parse(localStorage.getItem("ghostlyUsers")||"{}");
  userDropdownsContainer.innerHTML = "";

  for(const [username, data] of Object.entries(users)){
    const drop = document.createElement("div");
    drop.className = "user-dropdown";
    drop.dataset.username = username;
    drop.dataset.ip = data.ip;

    let pendingLabel = null;
    if(!data.approved){
        drop.classList.add("pending");
        pendingLabel = document.createElement("span");
        pendingLabel.innerText = "PENDING";
        pendingLabel.className = "pending-label";
    }

    const h3 = document.createElement("h3");
    h3.innerText = username;
    if(pendingLabel) h3.appendChild(pendingLabel);

    const content = document.createElement("div");
    content.className = "user-dropdown-content";

    const pIP = document.createElement("p");
    pIP.innerText = IP: ${data.ip || "N/A"};

    const pStatus = document.createElement("p");
    pStatus.innerText = "Online";
    pStatus.className = "status online";

    const kickBtn = document.createElement("button");
    kickBtn.innerText = "Kick";
    kickBtn.className = "kick";
    kickBtn.onclick = ()=>{
      pStatus.innerText = "Offline";
      pStatus.className = "status offline";
      updateOnlineCount();
    };

    const approveBtn = document.createElement("button");
    approveBtn.innerText = "Approve";
    approveBtn.onclick = ()=>{
      users[username].approved = true;
      localStorage.setItem("ghostlyUsers", JSON.stringify(users));
      drop.classList.remove("pending");
      if(pendingLabel) pendingLabel.remove();
      const liveCount = Object.values(users).filter(u=>u.approved).length;
      fetch(webhookURL, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({content:`✅ User approved!\nUsername: ${username}\nIP: ${data.ip}\nLive Users: ${liveCount}`})
      });
      alert(${username} approved!);
      updateOnlineCount();
    };

    const denyBtn = document.createElement("button");
    denyBtn.innerText = "Deny";
    denyBtn.onclick = ()=>{
      delete users[username];
      localStorage.setItem("ghostlyUsers", JSON.stringify(users));
      drop.remove();
      const liveCount = Object.values(users).filter(u=>u.approved).length;
      fetch(webhookURL, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({content:`❌ User denied!\nUsername: ${username}\nIP: ${data.ip}\nLive Users: ${liveCount}`})
      });
      alert(${username} denied access.);
      updateOnlineCount();
    };

    content.appendChild(pIP);
    content.appendChild(pStatus);
    content.appendChild(kickBtn);
    content.appendChild(approveBtn);
    content.appendChild(denyBtn);

    drop.appendChild(h3);
    drop.appendChild(content);

    h3.onclick = () => {
      const isOpen = content.classList.contains("open");
      if (isOpen) content.classList.remove("open");
      else content.classList.add("open");
      content.style.animation = "hauntedFlicker 1.5s infinite";
    }

    userDropdownsContainer.appendChild(drop);
  }
  updateOnlineCount();
}

loadUsers();