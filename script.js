const year=document.getElementById("year")
year.textContent=new Date().getFullYear()

window.addEventListener("scroll",()=>{

const scrollTop=document.documentElement.scrollTop
const scrollHeight=document.documentElement.scrollHeight-document.documentElement.clientHeight

const progress=(scrollTop/scrollHeight)*100

document.getElementById("progressBar").style.width=progress+"%"

})

const tl=document.getElementById("logoTL")
const br=document.getElementById("logoBR")

function draw(path,duration){

const length=path.getTotalLength()

path.style.strokeDasharray=length
path.style.strokeDashoffset=length

requestAnimationFrame(()=>{

path.style.transition=`stroke-dashoffset ${duration}ms cubic-bezier(.19,1,.22,1)`
path.style.strokeDashoffset=0

})

}

function reset(path){

path.style.transition="none"
path.style.strokeDashoffset=path.getTotalLength()

}

function loop(){

draw(tl,1300)

setTimeout(()=>{
draw(br,1300)
},1300)

setTimeout(()=>{

document.querySelector(".logo svg").style.opacity=".85"

setTimeout(()=>{

reset(tl)
reset(br)

document.querySelector(".logo svg").style.opacity="1"

setTimeout(loop,200)

},250)

},5200)

}

window.onload=()=>setTimeout(loop,400)
