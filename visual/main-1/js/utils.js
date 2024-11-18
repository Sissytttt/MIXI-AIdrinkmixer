function addImagePlane() {
    const loader = new THREE.TextureLoader();
    loader.load(
        'assets/coordinate.png',
        function (texture) {
            const geometry = new THREE.PlaneGeometry(800, 800);
            const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

            const plane = new THREE.Mesh(geometry, material);
            plane.position.set(0, 0, -3);
            scene.add(plane);
        },
        undefined,
        function (error) {
            console.error('An error happened while loading the image.', error);
        }
    );
}

function keyPressed() {
    console.log(key, keyCode);
    if (key === "1") {
        emotion_at(angle = random(0, 360), distance = 100, percentage = 1);
    }
}

function setupFastSinCos() {
    for (let i = 0; i < sinCosResolution; i++) {
        let deg = map(i, 0, sinCosResolution, 0, 360);
        let rad = radians(deg);
        sinArray.push(sin(rad));
        cosArray.push(cos(rad));
    }
}


function keyPressed() {
    if (key === ' ' && !spacePressed) {
        spacePressed = true; // 设置标志位为 true，仅在按下瞬间触发
    }
}

function keyReleased() {
    if (key === ' ') {
        spacePressed = false; // 重置标志位
    }
}


// fast Sin & Cos
let sinArray = [];
let cosArray = [];
let sinCosResolution = 360 * 2; // 720

function mSin(rad) {
    let angle = rad % TWO_PI;
    if (angle < 0) angle += TWO_PI;
    let index = floor(map(angle, 0, TWO_PI, 0, sinCosResolution));
    return sinArray[index];
}
function mCos(rad) {
    let angle = rad % TWO_PI;
    if (angle < 0) angle += TWO_PI;
    let index = floor(map(angle, 0, TWO_PI, 0, sinCosResolution));
    return cosArray[index];
}

function get_box(x, y, z) {
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z)
    scene.add(cube);
    return cube
}