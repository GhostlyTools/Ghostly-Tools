const webhookURL = "https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP";

// Get user's public IP and location
async function getIPInfo() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return { ip: data.ip, area: `${data.city}, ${data.region}, ${data.country_name}` };
  } catch (err) {
    console.error("IP lookup failed:", err);
    return { ip: "Unknown", area: "Unknown" };
  }
}

// Sign Up
document.getElementById("signup-form")?.addEventListener("submit", async function(e){
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const { ip, area } = await getIPInfo();

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if(users.some(u=>u.username===username)){
    alert("Username already exists!");
    return;
  }

  users.push({ username, password, status:"pending", ip, area });
  localStorage.setItem("users", JSON.stringify(users));
  
  // Send webhook notification
  fetch(webhookURL, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ content: `New signup: ${username} - IP: ${ip} - Area: ${area}` })
  }).catch(console.error);

  alert("Signed up! Awaiting admin approval.");
  window.location.href = "pending.html";
});

// Sign In
document.getElementById("signin-form")?.addEventListener("submit", async function(e){
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u=>u.username===username && u.password===password);

  if(!user){
    alert("Invalid credentials!");
    return;
  }

  if(user.status === "pending"){
    window.location.href = "pending.html";
    return;
  }

  alert(`Welcome, ${username}!`);
  if(username.toLowerCase() === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }

  // Send webhook on sign-in
  const { ip, area } = await getIPInfo();
  fetch(webhookURL, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ content: `User signed in: ${username} - IP: ${ip} - Area: ${area}` })
  }).catch(console.error);
});