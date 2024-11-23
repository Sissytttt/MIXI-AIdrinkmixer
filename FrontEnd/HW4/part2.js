const background = document.querySelector('body');
const squares = document.querySelectorAll('.square');
const context = document.getElementById('context');

displayHeight = () => background.style.height = window.innerHeight + 'px';

window.addEventListener('load', displayHeight);
window.addEventListener('resize', displayHeight);



/* animation */



let angle = 0;
let animation = requestAnimationFrame(rotatefunc);

function rotatefunc() {
  animation = requestAnimationFrame(rotatefunc);
  if (angle < 360){
    angle += 0.5;
    context.style.transform = "rotateY(" + angle + "deg)";
  }
  else{
    angle = 0;
  }
  // console.log(angle);
}

// function rotatefunc() {
//   animation = requestAnimationFrame(rotatefunc);
//   context.style.transform = "rotateY(90deg)";
//   context.style.transition = "4s ease-in-out";

//   // console.log(angle);
// }

function rearrange(){
  for(var i = 0; i < squares.length; i ++){
    // temp = Math.random()
    // console.log(Math.random());
    squares[i].style.transform = "rotateY(" + Math.floor(Math.random()*360) + "deg) translateZ(-" + Math.floor(Math.random()*360) + "px)";
    // console.log("translateZ(" + Math.floor(Math.random()*360) + "px)");
    // if (temp <  0.5){
    //   squares[i].style.transform = "translateZ(-" + Math.floor(temp*360) + "px) rotateY(90deg)";
    // }
  }
}

function reverseRotate(){
  animation = requestAnimationFrame(reverseRotate);
  if (angle < 360){
    angle -= 0.5;
    context.style.transform = "rotateY(" + angle + "deg)";
  }
  else{
    angle = 0;
  }
}

normalAnimation = () => animation = requestAnimationFrame(rotatefunc);
reverseAnimation = () =>animation = requestAnimationFrame(reverseRotate);



// stopAnimation = () => cancelAnimationFrame(animation); // cancel animation
// startAnimation = () => animation = requestAnimationFrame(rotatefunc());

context.addEventListener('pointerover', normalAnimation);
context.addEventListener('pointerout', reverseAnimation);

window.addEventListener("load", rearrange);
window.addEventListener("resize", rearrange);
