// Haunted Effects
const ghostCount=5, ghosts=[];
for(let i=0;i<ghostCount;i++){
    const g=document.createElement('div');
    g.innerText='👻';
    g.style.position='absolute';
    g.style.fontSize=`${2+Math.random()*2}rem`;
    g.style.top=Math.random()*window.innerHeight+'px';
    g.style.left=Math.random()*window.innerWidth+'px';
    g.style.opacity=Math.random()*0.7+0.3;
    g.style.transition='all 1.5s linear';
    document.body.appendChild(g); ghosts.push(g);
}
setInterval(()=>ghosts.forEach(g=>{ g.style.top=Math.random()*window.innerHeight+'px'; g.style.left=Math.random()*window.innerWidth+'px'; }),2000);

const smokeCount=10, smokes=[];
for(let i=0;i<smokeCount;i++){
    const s=document.createElement('div');
    s.innerText='💨';
    s.style.position='absolute';
    s.style.fontSize=`${1+Math.random()*2}rem`;
    s.style.top=Math.random()*window.innerHeight+'px';
    s.style.left=Math.random()*window.innerWidth+'px';
    s.style.transition='all 1.5s linear';
    document.body.appendChild(s); smokes.push(s);
}
setInterval(()=>smokes.forEach(s=>{ 
    s.style.top=Math.random()*window.innerHeight+'px'; 
    s.style.left=Math.random()*window.innerWidth+'px'; 
    s.style.color=['red','green','yellow','white'][Math.floor(Math.random()*4)]; 
}),1500);

document.addEventListener('mousemove', e=>{
    const spark=document.createElement('div');
    spark.style.position='absolute';
    spark.style.width='5px';
    spark.style.height='5px';
    spark.style.backgroundColor='white';
    spark.style.borderRadius='50%';
    spark.style.top=e.clientY+'px';
    spark.style.left=e.clientX+'px';
    spark.style.opacity=1;
    spark.style.pointerEvents='none';
    document.body.appendChild(spark);
    setTimeout(()=>{ spark.style.transition='opacity 0.5s'; spark.style.opacity=0; setTimeout(()=>spark.remove(),500); },50);
});

(function flicker(){ document.body.style.opacity=Math.random()*0.5+0.5; setTimeout(flicker,Math.random()*1000+500); })();

// Pop-ups
function showPopup(message){
    const popup = document.getElementById('popup');
    const msg = document.getElementById('popup-message');
    msg.innerText = message;
    popup.style.display = 'block';
}

function closePopup(){
    document.getElementById('popup').style.display = 'none';
}

window.onclick = function(event) {
    const popup = document.getElementById('popup');
    if (event.target == popup) closePopup();
}