// ---- admin.js ----
const webhookURL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

// Load users from localStorage
let users = JSON.parse(localStorage.getItem("users")) || [];

// Container for users
const container = document.getElementById("users");

// Flag for site disabled
let siteDisabled = JSON.parse(localStorage.getItem("siteDisabled")) || false;

// Display users
function displayUsers() {
  container.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user-dropdown";
    if(user.status === "pending") div.classList.add("pending");

    const header = document.createElement("h3");
    header.textContent = user.username;
    if(user.status === "pending"){
      const pendingLabel = document.createElement("span");
      pendingLabel.textContent = " (Pending)";
      pendingLabel.className = "pending-label";
      header.appendChild(pendingLabel);
    }
    div.appendChild(header);

    const content = document.createElement("div");
    content.className = "user-dropdown-content";
    content.innerHTML = `
      <p>Status: ${user.status}</p>
      <p>IP: ${user.ip}</p>
      <p>Area: ${user.area}</p>
      <button onclick="approveUser('${user.username}')">✅ Approve</button>
      <button onclick="denyUser('${user.username}')">❌ Deny</button>
      <button onclick="kickUser('${user.username}')">🦵 Kick</button>
    `;
    div.appendChild(content);

    header.onclick = () => content.classList.toggle("open");
    container.appendChild(div);
  });
}

// Approve user
function approveUser(username){
  const user = users.find(u => u.username === username);
  if(user) user.status = "approved";
  localStorage.setItem("users", JSON.stringify(users));
  sendWebhook(`${username} approved by admin`);
  displayUsers();
}

// Deny user
function denyUser(username){
  const user = users.find(u => u.username === username);
  if(user) user.status = "denied";
  localStorage.setItem("users", JSON.stringify(users));
  sendWebhook(`${username} denied by admin`);
  displayUsers();
}

// Kick user (removes from localStorage)
function kickUser(username){
  users = users.filter(u => u.username !== username);
  localStorage.setItem("users", JSON.stringify(users));
  sendWebhook(`${username} kicked by admin`);
  displayUsers();
}

// Disable website
document.getElementById("disableSiteBtn")?.addEventListener("click", () => {
  siteDisabled = !siteDisabled;
  localStorage.setItem("siteDisabled", JSON.stringify(siteDisabled));
  alert(siteDisabled ? "Website is now DISABLED" : "Website ENABLED");
  sendWebhook(`Website ${siteDisabled ? "disabled" : "enabled"} by admin`);
});

// Webhook function
function sendWebhook(message){
  fetch(webhookURL, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({content: message})
  });
}

// Initial load
displayUsers();

// Auto-refresh every 5 seconds
setInterval(displayUsers, 5000);