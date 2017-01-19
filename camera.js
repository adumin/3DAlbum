// element.addEventListener( 'contextmenu', function(event){event.preventDefault();}, false);
// element.addEventListener( 'mousedown', onMouseDown, false);
// element.addEventListener( 'mousewheel', onMouseWheel, false);
// element.addEventListener( 'DOMMouseScroll', onMouseWheel, false);//firefox

let deltaX, deltaY, mouseX, mouseY;
function onMouseDown(event){
  // console.log(event);
  mouseX = event.x;
  mouseY = event.y;
  console.log(mouseX, mouseY);

  element.addEventListener( 'mousemove', onMouseMove, false );
  element.addEventListener( 'mouseup', onMouseUp, false );
}
function onMouseMove(event){
  // console.log(event);
  deltaX = mouseX - event.x;
  deltaY =  mouseY - event.y;
  console.log(deltaX, deltaY);
  // console.log(mouseX, event.x);
  // if(100 < deltaX && event.x < mouseX) camera.position.x ++;
  // if(deltaX < 100 && mouseX < event.x) camera.position.x --;
  // if(100 < deltaY && event.y < mouseY) camera.position.z += 100;
  // if(deltaY < 100 && mouseY < event.y) camera.position.z -= 100;
}
function onMouseUp(event){
  // console.log(event);
  element.removeEventListener( 'mousemove', onMouseMove, false );
  element.removeEventListener( 'mouseup', onMouseUp, false );
}

window.onkeydown = function(event){
    // console.log(event.key);
    // if(event.key == "ArrowLeft") camera.position.x ++;
    // if(event.key == "ArrowRight") camera.position.x --;
    if(event.key == "ArrowUp") camera.position.z += 100;
    if(event.key == "ArrowDown") camera.position.z -= 100;
    if(event.key == "Enter"){
      camera.position.z = cameraOffsetZ;
    }
}



// function onMouseWheel(event){
//   console.log(event);
// }
// element.addEventListener( 'touchstart', touchstart, false );
// element.addEventListener( 'touchend', touchend, false );
// element.addEventListener( 'touchmove', touchmove, false );
