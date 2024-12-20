// 1. 根据intensity改：
//    1. 半径大小 v
//    2. 颜色saturationparcile class - circle - addParticles里面的lerp value
// 2. 呼吸不要同步,呼吸不要消失，变大变小就ok 不要暗掉
// 3. 保留base circle
// 4. 相近的圆圈 合并成一个 update变成更大的半径
// 5. 大圆不要消失
// 6. 大圆的粒子透明度 v
// 7. 加flow movement ***
// 8. 最后汇聚到中间 v
// 9. 颜色都浅一点 白一点 v

// import { setupFastSinCos, addImagePlane, randomNumber } from './utils.js';

let earth_params = {
  sizeMin: 30,
  sizeMax: 60,
  breathAmplMin: 5,
  breathAmplMax: 10,
  breathFreq: 0.02,
  gaussianSD: 10,
  moveRangeMin: 100,
  moveRangeMax: 200,
  moveThreshold: 0.5, // 0~1, >threshold的比例是会有起伏的比例
  WaveFrameFreq: 0.004,
  WaveRadFreq: 0.01,
  WaveAngleFreq: 0.005, // don't know what this controls
  // 
  MoveSpd: 0.001,
  lifeReductionMin: 0.005,
  lifeReductionMax: 0.02,
};

let coordinate_particle = [];
let emotion_circle = [];
let emotion_particle = [];

let params = {
  particleNum: 0,
  WORLD_WIDTH: 1600,
  WORLD_HEIGHT: 900,
  WORLD_DEPTH: 500,
}

let data = {
  polar_angle: 45,
  polar_radius: 0.7,
}

let MAX_PARTICLE_NUMBER = 3000;
let coordinate_particleNum = 200;
let total_PARTICLE_NUMBER = coordinate_particleNum;

let pointCloud;
let particles = [];

let spacePressed = false;

let TWO_PI = 2 * Math.PI

let convert = false;
// let noise;

function setupThree() {

  // console.log(Noise);
  // const noise = new Noise(Math.random());
  // print(noise.simplex2(10, 20))

  setupFastSinCos();
  addImagePlane();

  // particles
  for (let i = 0; i < MAX_PARTICLE_NUMBER; i++) {
    // console.log("test")
    let x = randomNumber(-params.WORLD_WIDTH / 2, params.WORLD_WIDTH / 2)
    let y = randomNumber(-params.WORLD_HEIGHT / 2, params.WORLD_HEIGHT / 2)
    let tParticle = new ParticleBasic()
      .set_pos(x, y, randomNumber(-5, 5))
      .set_vel(randomNumber(-1, 1), randomNumber(-1, 1), randomNumber(-1, 1))
      .set_lifeReduction(0.01, 0.7);
    particles.push(tParticle);
  }
  params.drawCount = particles.length;

  // Points
  pointCloud = getPoints(particles);
  scene.add(pointCloud);

  // Gui
  // gui.add(params, "particleNum").listen();
}

function updateThree() {
  if (convert == false) {
    generate_coordinateCircle();
    update_coordinateCircle();
    update_circle();
  }
  else {
    convertParticles();
  }
  updatePoints();
  params.particleNum = particles.length; // update GUI
}


// ====================== coordinate circle ==========================

let coordinateRadius = 150;

function generate_coordinateCircle() {
  if (particles.length < total_PARTICLE_NUMBER) {
    let angle = randomNumber(0, TWO_PI);
    let x = mCos(angle) * coordinateRadius * 2;
    let y = mSin(angle) * coordinateRadius * 2;
    let velocity = 0.02;
    let tParticle = new ParticleBasic()
      .set_color(0.8, 0.8, 0.8)
      .set_pos(x, y, randomNumber(-5, 5))
      .set_vel(randomNumber(-velocity, velocity), randomNumber(-velocity, velocity), randomNumber(-velocity, velocity))
      .set_lifeReduction(0.005, 0.001);
    particles.push(tParticle);
  }
}

function update_coordinateCircle() {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    if (p.isBasic) {
      // p.flow();
      p.age();
      p.move();
      p.remove();
      p.check_boundary();
    }
    else if (p.isCoord == true) {
      // p.flow();
      p.move();
      p.remove();
      p.check_boundary();
    }
    else if (p.isEmo == true) {
      // p.wave();
      // p.flow();
      p.age();
      p.move();
      p.update_opacity();
      p.remove();
    }
  }
}

// ======================== Emotions ==========================
function emotion_at(angle, percentage) {
  angle = radians(angle)
  let x = mCos(angle) * 150 * 2;
  let y = mSin(angle) * 150 * 2;
  let z = 0;
  let r = map(percentage, 0, 1, 0, 80);
  let hue = map(angle, 0, TWO_PI, 0, 360);
  let rgbColor = hslToRgb(hue, 1, 0.5);
  let saturation = percentage;
  setup_circle(x, y, z, r, rgbColor, saturation);
}

function setup_circle(centerX, centerY, centerZ, Rad, color, saturation) {
  let circle = new Circle()
    .set_startframe()
    .set_color(color)
    .set_saturation(saturation)
    .set_pos(centerX, centerY, centerZ)
    .set_baseRad(Rad)
    .set_breath_FreqAmpl(earth_params.breathFreq, earth_params.breathAmplMin, earth_params.breathAmplMax);
  // console.log("c:", circle, circle.color)
  emotion_circle.push(circle);
}

function update_circle() { // for circles
  for (let i = 0; i < emotion_circle.length; i++) {
    let c = emotion_circle[i];
    c.breath();
    c.set_breath_FreqAmpl(earth_params.breathFreq, earth_params.breathAmplMin, earth_params.breathAmplMax);
    if (c.updatedR < c.baseR && c.startBreath == false) {
      c.updatedR = lerp(c.updatedR, params.phase1_breathCircle_Rad, 0.05); // circle spread 
    }
  }
  if (emotion_circle.length > 0) {
    while (particles.length < total_PARTICLE_NUMBER) {
      let rand = Math.floor(Math.random() * emotion_circle.length);
      emotion_circle[rand].addParticles();
    }
  }
}

initThree();

document.addEventListener('keydown', function (event) {
  if (event.code === 'Space') {
    convert = true;
  }
});

function convertParticles() {
  // console.log("convert");
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let xdirection = Math.random() < 0.5 ? 1 : -1;
    let ydirection = Math.random() < 0.5 ? 1 : -1;
    let zdirection = Math.random() < 0.5 ? 1 : -1;
    let v = Math.random() * 0.1
    randomForce = new createVector(v * xdirection, v * ydirection, v * zdirection);
    p.apply_force(randomForce);
    // p.age();
    p.move();
    p.update_opacity();
    p.remove();
    p.check_boundary();
  }
}
