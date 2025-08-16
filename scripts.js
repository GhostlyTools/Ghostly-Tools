// Pop-up functions
function showPopup(message){
    const popup=document.getElementById('popup');
    document.getElementById('popup-message').innerText=message;
    popup.style.display='flex';
}
function closePopup(){
    document.getElementById('popup').style.display='none';
}

// Background music autoplay at max volume
const music = document.getElementById('bg-music');
if(music){
    music.volume = 1.0; // max volume
    music.play().catch(()=>{
        document.body.addEventListener('click', ()=>music.play(), { once: true });
        document.body.addEventListener('touchstart', ()=>music.play(), { once: true });
    });
}

// Kick check on load
window.addEventListener('load', ()=>{
    const user = sessionStorage.getItem('loggedInUser');
    if(user && localStorage.getItem('kick_'+user)){
        alert("You have been kicked by the admin.");
        sessionStorage.removeItem('loggedInUser');
        localStorage.removeItem('kick_'+user);
        window.location.href='auth.html';
    }
});