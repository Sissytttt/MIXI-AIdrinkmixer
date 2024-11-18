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
function hslToRgb(h, s, l) {
    h = abs(360 - ((h + 270) % 360));
    h = h / 360;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h * 6) % 2 - 1));
    let m = l - c / 2;

    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 1 / 6) {
        r = c; g = x; b = 0;
    } else if (h >= 1 / 6 && h < 2 / 6) {
        r = x; g = c; b = 0;
    } else if (h >= 2 / 6 && h < 3 / 6) {
        r = 0; g = c; b = x;
    } else if (h >= 3 / 6 && h < 4 / 6) {
        r = 0; g = x; b = c;
    } else if (h >= 4 / 6 && h < 5 / 6) {
        r = x; g = 0; b = c;
    } else if (h >= 5 / 6 && h <= 1) {
        r = c; g = 0; b = x;
    }

    r = r + m;
    g = g + m;
    b = b + m;
    return [r, g, b];
}

