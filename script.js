document.getElementById("year").textContent=new Date().getFullYear();

/* Scroll spy */
const sections=document.querySelectorAll("section");
const links=document.querySelectorAll(".nav__links a");

window.addEventListener("scroll",()=>{
 let current="";
 sections.forEach(sec=>{
   const rect=sec.getBoundingClientRect();
   if(rect.top<=window.innerHeight*0.35 && rect.bottom>=window.innerHeight*0.35){
     current=sec.id;
   }
 });
 links.forEach(l=>{
   l.classList.remove("active");
   if(l.getAttribute("href")==="#"+current){
     l.classList.add("active");
   }
 });
});

/* Reveal */
const reveals=document.querySelectorAll(".reveal");
function reveal(){
 reveals.forEach(el=>{
  const rect=el.getBoundingClientRect();
  if(rect.top<window.innerHeight*0.85){
    el.classList.add("visible");
  }
 });
}
window.addEventListener("scroll",reveal);
window.addEventListener("load",reveal);

/* Magnetic button */
const magnetic=document.querySelector(".magnetic");
if(magnetic){
 magnetic.addEventListener("mousemove",(e)=>{
   const rect=magnetic.getBoundingClientRect();
   const x=e.clientX-rect.left-rect.width/2;
   const y=e.clientY-rect.top-rect.height/2;
   magnetic.style.transform=`translate(${x*0.15}px,${y*0.15}px)`;
 });
 magnetic.addEventListener("mouseleave",()=>{
   magnetic.style.transform="translate(0,0)";
 });
}

/* Top progress bar */
const bar=document.createElement("div");
bar.style.position="fixed";
bar.style.top="0";
bar.style.left="0";
bar.style.height="3px";
bar.style.width="0%";
bar.style.background="linear-gradient(90deg,#7c5cff,#22d3ee)";
bar.style.zIndex="2000";
document.body.appendChild(bar);

window.addEventListener("scroll",()=>{
 const progress=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
 bar.style.width=progress+"%";
});
