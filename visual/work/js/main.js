let params = {
  particleNum: 0,
}

let data = {
  polar_angle: 45,
  polar_radius: 0.7,
}

let MAX_PARTICLE_NUMBER = 2000;
let coordinate_particleNum = 1000;

const WORLD_SIZE = 1000;

let pointCloud;
let particles = [];

let centerPos;
let mouseIsClicked = false;
// fast Sin & Cos
let sinArray = [];
let cosArray = [];
let sinCosResolution = 360 * 2; // 720




function setupThree() {
  setupFastSinCos();
  centerPos = createVector(0, 0);
  // particles
  for (let i = 0; i < MAX_PARTICLE_NUMBER; i++) {
    let x = random(-WORLD_SIZE / 2, WORLD_SIZE / 2)
    let y = random(-WORLD_SIZE / 2, WORLD_SIZE / 2)
    let tParticle = new Particle()
      .setPosition(x, y, random(-5, 5))
      .setVelocity(random(-1, 1), random(-1, 1), random(-1, 1))
      .setLifeReduction(0.01, 0.007);
    particles.push(tParticle);
  }
  params.drawCount = particles.length;

  // Points
  pointCloud = getPoints(particles);
  scene.add(pointCloud);

  gui.add(params, "particleNum").listen();

  addImagePlane();
}

function addImagePlane() {
  const loader = new THREE.TextureLoader();
  loader.load(
    'assets/coordinate.png',
    function (texture) {
      const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE);
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

function updateThree() {
  generate_coordinateCircle();
  update_coordinateCircle();
  params.particleNum = particles.length; // update GUI

  // update the points' info
  let positionArray = pointCloud.geometry.attributes.position.array;
  let colorArray = pointCloud.geometry.attributes.color.array;
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let ptIndex = i * 3;
    // position
    positionArray[ptIndex + 0] = p.pos.x;
    positionArray[ptIndex + 1] = p.pos.y;
    positionArray[ptIndex + 2] = p.pos.z;
    //color
    let intensity;
    if (p.lifespan > 0.7) {
      intensity = (1 - p.lifespan) * (1 / 0.3)
    } else if (p.lifespan > 0.5) {
      intensity = 1;
    } else {
      intensity = p.lifespan * (1 / 0.3);
    }
    colorArray[ptIndex + 0] = p.col.x * p.lifespan;
    colorArray[ptIndex + 1] = p.col.y * p.lifespan;
    colorArray[ptIndex + 2] = p.col.z * p.lifespan;
  }
  pointCloud.geometry.setDrawRange(0, particles.length); // ***
  pointCloud.geometry.attributes.position.needsUpdate = true;
  pointCloud.geometry.attributes.color.needsUpdate = true;

  // update GUI
  params.drawCount = particles.length;
}


function getPoints(objects) {
  const vertices = [];
  const colors = [];

  for (let obj of objects) {
    vertices.push(obj.pos.x, obj.pos.y, obj.pos.z);
    colors.push(1, 1, 1);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const drawCount = objects.length; // draw the whole objects
  geometry.setDrawRange(0, drawCount);
  const texture = new THREE.TextureLoader().load('assets/particle_texture.jpg');
  const material = new THREE.PointsMaterial({
    //color: 0xFF9911,
    vertexColors: true,
    size: 5,
    sizeAttenuation: true, // default
    opacity: 0.9,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    map: texture
  });
  const points = new THREE.Points(geometry, material);
  return points;
}


// ====================== coordinate circle ==========================

let coordinateRadius = 200;

function generate_coordinateCircle() {
  while (particles.length < coordinate_particleNum) {
    let angle = random(TWO_PI);
    let x = mCos(angle) * coordinateRadius * 2;
    let y = mSin(angle) * coordinateRadius * 2;
    let velocity = 0.02;
    let tParticle = new Particle()
      .setPosition(x, y, random(-5, 5))
      .setVelocity(random(-velocity, velocity), random(-velocity, velocity), random(-velocity, velocity))
      // .setColor(1, 0, 0)
      .setLifeReduction(0.005, 0.001);
    particles.push(tParticle);
  }
}

function update_coordinateCircle() {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    // p.flow(1);
    p.age();
    p.move();
    p.rotate();
    p.remove();
  }
}


// ======================= class ===========================
class Particle {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();

    this.col = createVector(1, 1, 1);
    this.scl = createVector(1, 1, 1);
    this.mass = this.scl.x * this.scl.y * this.scl.z;

    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();

    this.lifespan = 1.0;
    this.lifeReduction = 1;
    this.isDone = false;
  }

  setColor(x, y, z) {
    this.col = createVector(x, y, z);
    return this;
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = createVector(x, y, z);
    return this;
  }
  setLifeReduction(min, max) {
    this.lifeReduction = random(min, max);
    return this;
  }
  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = createVector(w, h, d);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    return this;
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.mult(0);
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }
  reappear() {
    if (this.pos.z > WORLD_SIZE / 2) {
      this.pos.z = -WORLD_SIZE / 2;
    }
  }
  disappear() {
    if (this.pos.z > WORLD_SIZE / 2) {
      this.isDone = true;
    }
  }
  age() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  attractedTo(x, y, z) {
    let target = new p5.Vector(x, y, z);
    let force = p5.Vector.sub(target, this.pos);
    if (force.mag() < 100) {
      force.mult(-0.005);
    } else {
      force.mult(0.0001);
    }
    this.applyForce(force);
  }
  flow(spd = 1) {
    let xFreq = this.pos.x * 0.05 + frame * 0.005;
    let yFreq = this.pos.y * 0.05 + frame * 0.005;
    let noiseValue = map(noise(xFreq, yFreq), 0.0, 1.0, -1.0, 1.0);
    let force = new p5.Vector(mCos(frame * 0.005), mSin(frame * 0.005));
    force.normalize();
    force.mult(noiseValue * spd * 0.01);
    this.applyForce(force);
  }
  move_up(spd) {
    let xFreq = this.pos.x * 0.5 + frame * 0.005;
    let yFreq = this.pos.y * 0.01 + frame * 0.005;
    let noiseVal = noise(xFreq, yFreq);
    let up_force;
    if (noiseVal < 0.4) {
      up_force = map(noiseVal, 0, 0.4, 0, 0.1);
    }
    else if (noiseVal < 0.7) {
      up_force = map(noiseVal, 0.4, 0.7, 0.15, 9);
    }
    else {
      up_force = map(noiseVal, 0.7, 1, 9, 1);
    }
    let forceUp = createVector(0, up_force, 0);
    forceUp.mult(spd);
    this.applyForce(forceUp);
  }
  check_dist_reduce(limit) {
    let distance = this.pos.mag();
    if (distance < limit) {
      this.lifeReduction *= 4;
    }
  }
  check_dist_slice(limit) {
    let distance = this.pos.mag();
    if (distance < limit) {
      this.isDone = true;
    }
  }
  check_boundary() {
    if (this.pos.x > params.WORLD_SIZE / 2 || this.pos.x < -params.WORLD_SIZE / 2
      || this.pos.y > params.WORLD_SIZE / 2 || this.pos.y < -params.WORLD_SIZE / 2) {
      this.isDone = true;
    }
  }
  remove() {
    if (this.isDone) {
      let index = particles.indexOf(this);
      if (index > -1) {
        particles.splice(index, 1);
      }
    }
  }
  set_breathCen() { }
  set_breathPos() { }
  set_breathFreq() { }
  set_breathAmp() { }
  breath() { }
  phase5_age() { }
  repulse_from() { }
}


function setupFastSinCos() {
  for (let i = 0; i < sinCosResolution; i++) {
    let deg = map(i, 0, sinCosResolution, 0, 360);
    let rad = radians(deg);
    sinArray.push(sin(rad));
    cosArray.push(cos(rad));
  }
}
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
