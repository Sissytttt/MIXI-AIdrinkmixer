let earth_params = {
  BendMagnitude: 30,
  sizeMin: 30,
  sizeMax: 60,
  breathAmplMin: 30,
  breathAmplMax: 100,
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
let coordinate_particleNum = 500;
let total_PARTICLE_NUMBER = coordinate_particleNum; // start from 500

let pointCloud;
let particles = [];

let spacePressed = false;


function setupThree() {
  setupFastSinCos();
  addImagePlane();

  // particles
  for (let i = 0; i < MAX_PARTICLE_NUMBER; i++) {
    let x = random(-params.WORLD_WIDTH / 2, params.WORLD_WIDTH / 2)
    let y = random(-params.WORLD_HEIGHT / 2, params.WORLD_HEIGHT / 2)
    let tParticle = new ParticleBasic()
      .set_pos(x, y, random(-5, 5))
      .set_vel(random(-1, 1), random(-1, 1), random(-1, 1))
      .set_lifeReduction(0.01, 0.7);
    particles.push(tParticle);
  }
  params.drawCount = particles.length;

  // Points
  pointCloud = getPoints(particles);
  scene.add(pointCloud);

  // Gui
  gui.add(params, "particleNum").listen();
}

function updateThree() {
  generate_coordinateCircle();
  update_coordinateCircle();

  if (spacePressed) {
    if (total_PARTICLE_NUMBER < MAX_PARTICLE_NUMBER) {
      print("pressed")
      total_PARTICLE_NUMBER += 50;
      emotion_at(angle = random(360), distance = 1, percentage = 1);
      spacePressed = false;
      console.log(emotion_circle.length);
    }
    else {
      console.log("Already hit the maximum number")
    }
  }
  update_circle();
  updatePoints();
  params.particleNum = particles.length; // update GUI
}


// ====================== coordinate circle ==========================

let coordinateRadius = 150;

function generate_coordinateCircle() {
  while (particles.length < total_PARTICLE_NUMBER) {
    let angle = random(TWO_PI);
    let x = mCos(angle) * coordinateRadius * 2;
    let y = mSin(angle) * coordinateRadius * 2;
    let velocity = 0.02;
    let tParticle = new ParticleBasic()
      .set_pos(x, y, random(-5, 5))
      .set_vel(random(-velocity, velocity), random(-velocity, velocity), random(-velocity, velocity))
      .set_lifeReduction(0.005, 0.001);
    particles.push(tParticle);
  }
}

function update_coordinateCircle() {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    if (p.isBasic) {
      p.age();
      p.move();
      p.remove();
      p.check_boundary();
    }
    else if (p.isCoord == true) {
      p.move();
      p.remove();
      p.check_boundary();
    }
    else if (p.isEmo == true) {
      // p.wave();
      p.age();
      p.move();
      p.update_opacity();
      p.remove();
    }
  }
}

// ======================== Emotions ==========================
function emotion_at(angle, distance, percentage) {
  angle = radians(angle)
  let x = mCos(angle) * distance * 150 * 2;
  let y = mSin(angle) * distance * 150 * 2;
  let z = map(percentage, 0, 1, -200, 200)
  let r = 50;
  setup_circle(x, y, z, r);
}

function setup_circle(centerX, centerY, centerZ, Rad) {
  let circle = new Circle()
    .set_color(255, 0, 0)
    .set_pos(centerX, centerY, centerZ)
    .set_baseRad(Rad)
    .set_breath_FreqAmpl(earth_params.breathFreq, earth_params.breathAmplMin, earth_params.breathAmplMax);
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
    if (emotion_circle.length > 0) {
      // console.log(emotion_circle.length)
      let rand = floor(Math.random(0, emotion_circle.length));
      while (particles.length < total_PARTICLE_NUMBER) {
        emotion_circle[rand].addParticles();
        // console.log(rand)
      }
    }
    // if (abs(c.updatedR - params.phase1_breathCircle_Rad) < 0.1) {
    //   c.updatedR = params.phase1_breathCircle_Rad;
    // }
    // if (breathingAmp < params.phase1_breathCircle_Amp) {
    //   breathingAmp++;
    // }
  }
}

