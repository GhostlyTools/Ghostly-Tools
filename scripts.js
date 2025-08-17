/* ---------- Users Utilities ---------- */
function getUsers() {
  return JSON.parse(localStorage.getItem('ghostlyUsers') || '{}');
}
function setUsers(users) {
  localStorage.setItem('ghostlyUsers', JSON.stringify(users));
}

/* ---------- Login ---------- */
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;

    // Admin login
    if (u === 'Ghostly' && p === 'Dare2995!') {
      sessionStorage.setItem('loggedInUser', 'Ghostly');
      location.href = 'admin.html';
      return;
    }

    const users = getUsers();
    if (!users[u] || users[u].password !== p) {
      alert('Invalid username or password.');
      return;
    }

    if (users[u].kicked) {
      alert('You have been removed by the admin.');
      return;
    }

    sessionStorage.setItem('loggedInUser', u);
    location.href = 'index.html';
  });
}

/* ---------- Sign Up ---------- */
const signupLink = document.querySelector('a[href="signup.html"]');
if (signupLink) {
  signupLink.addEventListener('click', e => {
    e.preventDefault();
    const username = prompt("Choose a username:");
    if (!username) return;

    const password = prompt("Choose a password:");
    if (!password) return;

    const users = getUsers();
    if (users[username]) {
      alert('Username already exists!');
      return;
    }

    users[username] = { password: password, approved: false, kicked: false };
    setUsers(users);
    alert('Account created! Wait for admin approval, then sign in.');
  });
}

/* ---------- Background Music ---------- */
const music = document.getElementById("bg-music");
if (music) {
  music.volume = 1.0;
  music.play().catch(()=>{});
  // Gesture fallback
  window.addEventListener('pointerdown', ()=>{ music.play().catch(()=>{}); }, { once:true });
}

/* ---------- Random Visual Jump Scare ---------- */
const jumpscare = document.getElementById("jumpscare");
if (jumpscare) {
  setTimeout(()=>{
    if(Math.random() < 0.5){ // 50% chance
      jumpscare.style.display = "block";
      setTimeout(()=>{ jumpscare.style.display = "none"; }, 2000);
    }
  }, 5000); // after 5 sec
}