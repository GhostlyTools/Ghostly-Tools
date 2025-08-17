<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ghostly Tools 👻 - Admin Panel</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="login-container">
    <h1>Ghostly Tools 👻 - Admin Panel</h1>
    <h2>Users Online: <span id="online-count">0</span></h2>
    <div id="user-list"></div>
  </div>
  <audio id="bg-music" src="Ghostly_music.mp3" loop autoplay></audio>

  <script>
    const music = document.getElementById("bg-music");
    music.volume = 1.0;

    function updateUserList() {
      const container = document.getElementById("user-list");
      container.innerHTML = "";
      const users = JSON.parse(localStorage.getItem("ghostlyUsers") || "{}");
      let count = 0;

      for (const username in users) {
        const userData = users[username];
        count++;

        const drop = document.createElement("div");
        drop.className = "dropdown";
        if (!userData.approved) drop.classList.add("pending");

        const title = document.createElement("div");
        title.innerHTML = username + (!userData.approved ? '<span class="pending-label">Pending</span>' : '');
        drop.appendChild(title);

        const content = document.createElement("div");
        content.className = "dropdown-content";
        content.innerHTML = `
          <p><strong>IP:</strong> ${userData.ip}</p>
          <button class="approve-btn">Approve</button>
          <button class="deny-btn">Deny</button>
        `;
        drop.appendChild(content);

        container.appendChild(drop);

        content.querySelector(".approve-btn").onclick = () => {
          userData.approved = true;
          users[username] = userData;
          localStorage.setItem("ghostlyUsers", JSON.stringify(users));
          drop.classList.remove("pending");
          content.querySelector(".pending-label")?.remove();

          fetch("http://localhost:3000/status-webhook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body