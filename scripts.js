// ===========================
// Ghostly Tools Scripts.js
// Handles Sign-in, Sign-up, Admin, Downloads, Music, Jumpscare
// ===========================

// ---------------------------
// Background Music
// ---------------------------
const music = document.getElementById("bg-music");
music.volume = 1.0; // max volume
music.play().catch(() => {});

// ---------------------------
// Jumpscare (random chance on page load)
// ---------------------------
setTimeout(() => {
  if (Math.random() < 0.5) { // 50% chance
    const jump = document.getElementById("jumpscare");
    if (jump) {
      jump.style.display = "block";
      setTimeout(() => { jump.style.display = "none"; }, 2000);
    }
  }
}, 5000);

// ---------------------------
// Users data
// ---------------------------
let users = JSON.parse(localStorage.getItem("ghostlyUsers") || "{}");

// ---------------------------
// Sign-up
// ---------------------------
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    if (users[username]) {
      alert("Username already exists!");
      return;
    }

    users[username] = {
      password: password,
      approved: false,
      isAdmin: false
    };
    localStorage.setItem("ghostlyUsers", JSON.stringify(users));

    // Send new signup to Discord webhook
    fetch("https://discord.com/api/webhooks/1405861054017179708/rYLQuKpFZCXOHT1nPhBPvq4hDeWiyohO46jMVjL6bWVSATni6QLX1umoxDeAoUQwBTXP", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: New signup: ${username} })
    });

    alert("Signup successful! Waiting for admin approval.");
    window.location.href = "auth.html";
  });
}

// ---------------------------
// Sign-in
// ---------------------------
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!users[username] || users[username].password !== password) {
      alert("Invalid username or password!");
      return;
    }

    sessionStorage.setItem("loggedInUser", username);

    // Admin redirect
    if (username === "Ghostly" && password === "Dare2995!") {
      users[username].isAdmin = true;
      localStorage.setItem("ghostlyUsers", JSON.stringify(users));
      window.location.href = "admin.html";
      return;
    }

    // Normal user
    window.location.href = "dashboard.html";
  });
}

// ---------------------------
// Dashboard / Downloads
// ---------------------------
const user = sessionStorage.getItem("loggedInUser");
if (user) {
  const approved = users[user] && users[user].approved;
  const downloadsDiv = document.querySelector(".downloads");
  if (downloadsDiv) {
    if (approved) downloadsDiv.style.display = "block";
    else showPopup("Waiting for admin approval. Downloads are locked.");
  }
  const userSpan = document.getElementById("user-name");
  if (userSpan) userSpan.innerText = user;
}

// ---------------------------
// Logout
// ---------------------------
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "auth.html";
  });
}

// ---------------------------
// Pop-up
// ---------------------------
function showPopup(message) {
  const popup = document.getElementById("popup");
  const popupMsg = document.getElementById("popup-message");
  if (popup && popupMsg) {
    popupMsg.innerText = message;
    popup.style.display = "block";
  }
}
function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.style.display = "none";
}

// ---------------------------
// Admin Panel Functions
// ---------------------------
function approveUser(username) {
  if (users[username]) {
    users[username].approved = true;
    localStorage.setItem("ghostlyUsers", JSON.stringify(users));
    alert(${username} approved!);
    renderUserList();
  }
}

function kickUser(username) {
  if (users[username]) {
    delete users[username];
    localStorage.setItem("ghostlyUsers", JSON.stringify(users));
    alert(${username} kicked!);
    renderUserList();
  }
}

// Render users in admin panel
function renderUserList() {
  const ul = document.getElementById("user-list");
  if (!ul) return;
  ul.innerHTML = "";
  Object.keys(users).forEach((u) => {
    if (u === "Ghostly") return; // skip admin
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${u} - ${users[u].approved ? "Approved" : "Pending"}</span>
      <div>
        <button onclick="approveUser('${u}')">Approve</button>
        <button onclick="kickUser('${u}')">Kick</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

// Only render user list if on admin page
if (document.getElementById("user-list")) renderUserList()