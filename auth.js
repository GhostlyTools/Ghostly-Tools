<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ghostly Tools 👻 - Sign In</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="login-container">
<h1>Ghostly Tools 👻</h1>
<form id="signin-form">
<input type="text" id="username" placeholder="Username" required>
<input type="password" id="password" placeholder="Password" required>
<button type="submit">Sign In</button>
</form>
<p>Don't have an account? <a href="signup.html">Sign Up</a></p>
</div>

<script>
document.getElementById("signin-form").addEventListener("submit", async function(e){
  e.preventDefault();
  const username=document.getElementById("username").value;
  const password=document.getElementById("password").value;
  try{
    const res = await fetch("/signin", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username,password})
    });
    const data = await res.json();
    if(data.status==="pending"){ window.location.href="pending.html"; }
    else if(data.status==="approved"){
      const statusRes = await fetch("/status");
      const statusData = await statusRes.json();
      if(statusData.disabled){ alert("Website is down for updates."); return; }
      window.location.href="index.html";
    } else { alert(data.message||"Invalid login"); }
  }catch(err){console.error(err); alert("Error signing in");}
});
</script>
</body>
</html>