
const background = document.querySelector('body');
      
displayHeight = () => background.style.height = window.innerHeight + "px";
displayWidth = () => background.style.width = window.innerWidth + "px";
window.addEventListener('load', function(){ // decline the function inside the event listener
    displayHeight();
 });

window.addEventListener('resize', function(){
    displayHeight();
});

let content = document.getElementById("content");
let symbol=document.getElementById("image");


let text = content.innerHTML;

let letters = text.split("");

// let letterSpans = [];
// for (var i = 0; i < letters.length; i ++){
//   letterSpans[i] = '<span class="ltr">' + letters[i] + "</spans>";
// }

let letterSpans = letters.map((letter)=>{ return '<span class="ltr">'+letter+"</span>"});

content.innerHTML = letterSpans.join("");
let spanTags = content.getElementsByClassName("ltr");

// let speed = [];
// for (var i = 0; i < letterSpans.length; i ++){
//     speed[i] = Math.random()*5;
// }

// let angle = [];
// for (var i = 0; i < letterSpans.length; i ++){
//     angle[i] = Math.floor(Math.random()*360);
// }

// console.log(letters);

// function letterfloat(letter, spd, angle){
//     content.addEventListener("mouseover", floathelper(letter, spd, angle));
//     // letter.style.transform = "rotate(" + angle + "deg) translate(" + spd * 10 + "px)";
// }

  
// function floathelper(letter, spd, angle){
//     // console.log(letter);
//     letter.style.transform = "rotate(" + angle + "deg) translate(" + spd * 10 + "px)";
// }

// for (var i = 0; i < spanTags.length; i ++){
//     console.log(spanTags[i]);
//     letterfloat(spanTags[i], speed[i], angle[i]);
// }

// yPos = Math.abs(Math.random()*50);
// for (var i = 0; i < letterSpans.length(); i ++){
//     yPos = Math.abs(Math.random()*50);
//     letterSpans[i].style.top = yPos + "px";
// }

function move(event) {
    if (event.target.className == 'ltr') { // only work with grid items
        yPos = Math.abs(Math.random()*50);
        event.target.style.transition = "2s";
        event.target.style.top = yPos + "px";

    }
  }
  
content.addEventListener('pointerover', move, false); 

function getMousePos(event){ 
    x_pos = event.clientX;
    x_deg = x_pos / window.innerHeight * 360;
    // console.log("x_deg", x_deg);
    changeDeg(x_deg);
}

function changeDeg(x_deg){
        symbol.style.transform = "rotate(" + Math.floor(x_deg) + "deg)";
        // squares[i].style.transform = "rotateY(" + Math.floor(y_deg) + "deg)";
    }

window.addEventListener("mousemove", getMousePos);

// window.addEventListener('load', function(){ 
//     getMousePos();
//   });


// symbol.addEventListener("mouseover",()=>{
//   symbol.style.transform="rotate(360deg)";
// });

// symbol.addEventListener("mouseout",()=>{
//   symbol.style.transform="rotate(0deg)";
// });


