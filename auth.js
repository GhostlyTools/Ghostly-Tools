// Admin credentials
const adminUser = "admin";
const adminPass = "Dare2995!";

document.getElementById("login-form").addEventListener("submit", function(e){
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Admin login
  if(username === adminUser && password === adminPass){
    localStorage.setItem("signedInUser", username);
    window.location.href = "admin.html"; // redirect to admin panel
    return;
  }

  // Regular user login
  let users = JSON.parse(localStorage.getItem("users")||"[]");
  const user = users.find(u=>u.username === username && u.password === password);
  if(!user){
    alert("Invalid username or password.");
    return;
  }

  localStorage.setItem("signedInUser", username);

  if(user.status === "approved"){
    window.location.href = "index.html"; // downloads/main page
  } else {
    window.location.href = "pending.html"; // pending approval
  }
});