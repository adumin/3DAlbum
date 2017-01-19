'use strict'

let camera, scene, renderer;
let controls;
let element, container;
let picture = [], number = 0, station;
let radian = [], radius = [], omega = 360;
const cameraOffsetZ = -85;
const pi = Math.PI;

threeJsInit();
render();

// 描画領域のリサイズ
function resize() {
  let width = container.offsetWidth;
  let height = container.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// フルスクリーン化
function fullscreen() {
    if (container.requestFullscreen) {
        container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
    }
}

// 視点コントロール
// function setOrientationControls(e) {
//   if (!e.alpha) {
//       return;
//   }
//   controls = new THREE.DeviceOrientationControls(camera, true);
//   controls.connect();
//   controls.update();
//   element.addEventListener('click', fullscreen, false);
//   window.removeEventListener('deviceorientation', setOrientationControls, true);
// }

// 毎フレームの描画処理
function render() {
  omega -= 0.1;
  for(let i = 0; i < number; i++){
    picture[i].position.x = radius[i] * Math.sin(pi * (omega + radian[i]) / 180);
    picture[i].position.z = radius[i] * Math.cos(pi * (omega + radian[i]) / 180);
    picture[i].lookAt( new THREE.Vector3(
      station.position.x,
      station.position.y,
      station.position.z
    ));
    // picture[i].lookAt( new THREE.Vector3(
    //   camera.position.x,
    //   camera.position.y,
    //   camera.position.z
    // ));
  }
  if(omega <= 0) omega = 360;
  // controls.update(); // コントローラの更新
  renderer.render(scene, camera);
  requestAnimationFrame(render); // 再描画のリクエスト
}


function threeJsInit(){

  // レンダラの作成
  {
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x000000, 1); // 背景色の設定
  }

  // Webページへの埋め込み設定
  {
    element = renderer.domElement;
    container = document.getElementById('example');
    container.appendChild(element);
  }

  // シーンの作成
  scene = new THREE.Scene();

  // カメラの作成
  {
    camera = new THREE.PerspectiveCamera(90, 1, 10, 5000);
    camera.position.set(0, 15, cameraOffsetZ);
    camera.name = "camera";
    scene.add(camera);
    camera.lookAt(new THREE.Vector3(0, 0, 100));
  }

  // マウスによる視点操作の設定
  {
    // controls = new THREE.OrbitControls(camera, element);
    // controls.rotateUp(Math.PI / 4);
    // controls.target.set(
    //   camera.position.x,
    //   camera.position.y,
    //   camera.position.z + 0.1
    //   // 0, 0, 100
    // );
    // controls.noZoom = true;
    // controls.noPan = true;
  }

  // window.addEventListener('deviceorientation', setOrientationControls, true); // デバイスの傾きが変化した時の処理を設定
  window.addEventListener('resize', resize, false); // ウィンドウのリサイズが発生した時の処理を設定
  setTimeout(resize, 1); // 1m秒後にリサイズ処理を実行

  // 照明の作成
  {
    let light = new THREE.HemisphereLight(0xffffff, 0x999999, 1);
    light.name = "light";
    scene.add(light);
  }

  {
    let stationGeometry = new THREE.SphereGeometry(5, 30, 30);
    let stationMaterial = new THREE.MeshPhongMaterial({
      color: 0xdddddd,
      // ambient: 0x595654
      side: THREE.FrontSide,
      specular:0xffff00,
      shininess:30,
    });
    station = new THREE.Mesh(stationGeometry, stationMaterial);
    scene.add(station);
    station.position.set(0, 0, 0);
  }
}

function helper(mesh){
  let axis = new THREE.AxisHelper(50);
  scene.add(axis);
  axis.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
}

//画像のドラッグアンドドロップ処理
{
  let obj = $(window);
  obj.on('dragenter', function(e){
    e.stopPropagation();
    e.preventDefault();
  });
  obj.on('dragover', function(e){
    e.stopPropagation();
    e.preventDefault();
  });
  obj.on('drop', function(e){
    e.preventDefault();
    let files = e.originalEvent.dataTransfer.files;
    console.log(e);
    handleFileUpload(files, obj);
  });

  function handleFileUpload(files, obj){
    for(let i = 0; i < files.length; i++){
      let data = new FileReader();
      data.readAsDataURL(files[i]);
      console.log(files[i].name, files[i].size);
      data.addEventListener('load', fileLoad, false);

      function fileLoad(){
        let image = new Image();
        image.src = data.result;
        // console.log(data.result);
        let texture = new THREE.Texture();
        texture.image = image;
        image.onload = function() {
        	texture.needsUpdate = true;
          texture.minFilter = THREE.LinearFilter;
          let material = new THREE.MeshBasicMaterial({
            map: texture,
            opacity: 0.5
          });
          // console.log(Math.ceil( (number + 1) / 6 ) );
          // console.log(Math.ceil( number % 6 ));
          radius[number] = 100 * Math.ceil( (number + 1) / 6 );
          radian[number] = ( 30 * ( Math.ceil( (number + 1) / 6 ) - 1 ) ) + 60 * Math.ceil( number % 6 );
          const width = texture.image.width;
          const height = texture.image.height;
          const displayWidth = radius[number] / 2 * Math.sqrt(3);
          const t = height * displayWidth / width;
          let planegeometry = new THREE.PlaneGeometry(displayWidth, t);
          picture[number] = new THREE.Mesh(planegeometry, material);
          scene.add(picture[number]);
          // console.log(Math.floor(-25 + 50 * Math.random()));
          picture[number].position.y = Math.floor(-100 + 200 * Math.random());
          console.log("画像の数: ", number);
          number ++;
        };
      }
    }
  }
}
