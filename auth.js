// ---- auth.js ----
const webhookURL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

// Hardcoded admin
const adminUser = {
  username: "Ghostly",
  password: "Dare2995!"
};

// Load users from localStorage or create empty array
let users = JSON.parse(localStorage.getItem("users")) || [];

// Sign In
document.getElementById("signin-form").addEventListener("submit", function(e){
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Admin login
  if(username === adminUser.username && password === adminUser.password){
    alert(`Welcome Admin ${username}!`);
    sendWebhook(`${username} signed in as ADMIN`);
    window.location.href = "admin.html";
    return;
  }

  // Regular user login
  const user = users.find(u => u.username === username && u.password === password);
  if(!user){
    alert("Invalid username or password");
    return;
  }

  alert(`Welcome ${user.username}!`);
  sendWebhook(`${user.username} signed in`);

  if(user.status === "approved"){
    window.location.href = "index.html";
  } else {
    window.location.href = "pending.html";
  }
});

// Sign Up
document.getElementById("signup-form")?.addEventListener("submit", function(e){
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if(users.find(u => u.username === username)){
    alert("Username already exists!");
    return;
  }

  const newUser = { username, password, status: "pending", ip: "Unknown", area: "Unknown" };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created! Waiting for admin approval.");
  sendWebhook(`${username} signed up (pending)`);
  window.location.href = "pending.html";
});

// Webhook function
function sendWebhook(message){
  fetch(webhookURL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ content: message })
  });
}