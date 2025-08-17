// ---------------------------
// Users storage
// ---------------------------
let users = JSON.parse(localStorage.getItem("ghostlyUsers") || "{}");

// ---------------------------
// Background music autoplay
// ---------------------------
const music = document.getElementById("bg-music");
if (music) {
  music.volume = 1.0;
  music.play().catch(() => {
    document.addEventListener("click", () => music.play());
  });
}

// ---------------------------
// Jumpscare
// ---------------------------
const jumpscare = document.getElementById("jumpscare");
if (jumpscare) {
  setTimeout(() => {
    if (Math.random() < 0.5) {
      jumpscare.style.display = "block";
      setTimeout(() => jumpscare.style.display = "none", 2000);
    }
  }, 5000);
}

// ---------------------------
// Pop-ups
// ---------------------------
function showPopup(msg) {
  const popup = document.getElementById("popup");
  const popupMsg = document.getElementById("popup-message");
  if (popup && popupMsg) {
    popupMsg.innerText = msg;
    popup.style.display = "block";
  }
}
function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.style.display = "none";
}

// ---------------------------
// Sign-up
// ---------------------------
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    if (users[username]) return alert("Username exists!");

    users[username] = { password, approved: false, isAdmin: false };
    localStorage.setItem("ghostlyUsers", JSON.stringify(users));

    // Discord webhook notification
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

    if (!users[username] || users[username].password !== password)
      return alert("Invalid username or password!");

    sessionStorage.setItem("loggedInUser", username);

    if (username === "Ghostly" && password === "Dare2995!") window.location.href = "admin.html";
    else window.location.href = "dashboard.html";
  });
}

// ---------------------------
// Dashboard
// ---------------------------
const currentUser = sessionStorage.getItem("loggedInUser");
if (currentUser) {
  const userSpan = document.getElementById("user-name");
  if (userSpan) userSpan.innerText = currentUser;

  const downloadsDiv = document.querySelector(".downloads");
  if (downloadsDiv) {
    if (users[currentUser] && users[currentUser].approved) downloadsDiv.style.display = "block";
    else showPopup("Waiting for admin approval. Downloads are locked.");
  }
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
// Admin functions
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
function renderUserList() {
  const ul = document.getElementById("user-list");
  if (!ul) return;
  ul.innerHTML = "";
  Object.keys(users).forEach(u => {
    if (u === "Ghostly") return;
    const li = document.createElement("li");
    li.innerHTML = `<span>${u} - ${users[u].approved ? "Approved" : "Pending"}</span>
      <div>
        <button onclick="approveUser('${u}')">Approve</button>
        <button onclick="kickUser('${u}')">Kick</button>
      </div>`;
    ul.appendChild(li);
  });
}
if (document.getElementById("user-list")) renderUserList();