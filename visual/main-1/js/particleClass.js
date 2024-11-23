class ParticleBasic {
    constructor() {
        this.isBasic = true;
        this.pos = createVector();
        this.vel = createVector();
        this.acc = createVector();

        this.scl = createVector(1, 1, 1);
        this.mass = this.scl.x * this.scl.y * this.scl.z;
        this.color = { r: 255, g: 255, b: 255 };
        this.opacity = 1;
        this.lifespan = 1.0;
        this.lifeReduction = 0;
        this.isDone = false;

        this.color = {
            r: 255,
            g: 255,
            b: 255
        };
    }
    set_pos(x, y, z) {
        this.pos = createVector(x, y, z);
        return this;
    }
    set_vel(x, y, z) {
        this.vel = createVector(x, y, z);
        return this;
    }
    set_color(r, g, b) {
        this.color.r = r;
        this.color.g = g;
        this.color.b = b;
        return this;
    }
    set_scl(w, h = w, d = w) { // ?
        const minScale = 0.01;
        if (w < minScale) w = minScale;
        if (h < minScale) h = minScale;
        if (d < minScale) d = minScale;
        this.scl = createVector(w, h, d);
        this.mass = this.scl.x * this.scl.y * this.scl.z;
        return this;
    }
    set_lifeReduction(min, max) {
        this.lifeReduction = random(min, max);
        return this;
    }
    set_lifeSpan(lifeSpan) {
        this.lifeSpan = lifeSpan;
        return this;
    }
    move() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    update_opacity() {
        this.opacity = this.lifespan;
    }
    apply_force(f) {
        let force = f.copy();
        this.acc.add(force);
    }
    age(lifeReduction = this.lifeReduction) {
        this.lifespan -= lifeReduction;
        if (this.lifespan <= 0) {
            this.lifespan = 0;
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
    flow(posFreq = 0.005, timeFreq = 0.005, spd = 0.01) { // some might need to overwrite
        let xFreq = this.pos.x * posFreq + frame * timeFreq;
        let yFreq = this.pos.y * posFreq + frame * timeFreq;
        let zFreq = this.pos.z * posFreq + frame * timeFreq;
        let noiseValue1 = map(noise(xFreq, yFreq, zFreq), 0.0, 1.0, -1, 1);
        let noiseValue2 = map(noise(xFreq + 1000, yFreq + 1000, zFreq + 1000), 0.0, 1.0, -1, 1);
        let noiseValue3 = map(noise(xFreq + 2000, yFreq + 2000, zFreq + 2000), 0.0, 1.0, -1, 1);
        let force = new p5.Vector(noiseValue1, noiseValue2, noiseValue3);
        force.normalize();
        force.mult(spd);
        this.apply_force(force);
    }
    disappear() { // when PLAY_VISUALIZATION == false, everything disappear
        this.set_lifeReduction(0.05, 0.000001);
        this.age();
        this.flow();
        this.move();
        this.check_boundary();
        this.remove();
    }
    check_boundary() { // check canvas boundary
        // if (this.pos.x > params_basic.W)
        if (this.pos.x < - params.WORLD_WIDTH / 2
            || this.pos.x > params.WORLD_WIDTH / 2
            || this.pos.y < -params.WORLD_HEIGHT / 2
            || this.pos.y > params.WORLD_HEIGHT / 2
            || this.pos.z < -params.WORLD_DEPTH / 2
            || this.pos.z > params.WORLD_DEPTH / 2
        ) {
            this.isDone = true;
        }
    }
}

class BreathingParticle extends ParticleBasic {
    constructor() {
        super();
        this.isBasic = false;
        this.angle = 0;
        this.rad = 0;
        this.moveRange = 0;
        // particles.push(this);
    }
    adj_pos(val) {
        this.pos.y += val;
    }
    set_angle(angle) {
        this.angle = angle;
        return this;
    }
    set_rad(rad) {
        this.rad = rad;
        return this;
    }
    set_moveRange(val) {
        this.moveRange = val;
        return this;
    }
    wave() {
        let angleFreq = this.angle;
        let radFreq = this.rad * earth_params.WaveRadFreq;
        let frameFreq = frame * 0.0025;
        let noiseVal = noise(angleFreq, radFreq, frameFreq);
        let zPos = 0;
        if (noiseVal > earth_params.moveThreshold) {
            zPos = map(noiseVal, earth_params.moveThreshold, 1, 0, this.moveRange, true);
        }
        this.pos.z = zPos;
    }
}

class Circle {
    constructor() {
        this.pos = createVector();
        this.color = { r: 255, g: 255, b: 255 };
    }
    set_pos(x, y, z) {
        this.pos = createVector(x, y, z);
        return this;
    }
    set_color(r, g, b) {
        this.color.r = r;
        this.color.g = g;
        this.color.b = b;
        return this;
    }
    update_pos() {
        let noiseVal = noise(this.pos.x * earth_params.WaveAngleFreq, this.pos.z * earth_params.WaveAngleFreq, frame * earth_params.WaveAngleFreq);
        let zPos = map(noiseVal, 0, 1, -150, 150)
        this.pos.z = zPos;
    }
    set_size(r) {
        this.radians = r;
        this.updatedR = this.radians;
        return this;
    }
    set_rAdj(rAdj) { // outer distance toward the base rad // remember for calculating breath ampl
        this.rAdj = rAdj;
        return this;
    }
    set_breath_FreqAmpl(freq, min, max) {
        let breathAmp = map(this.rAdj, 0, earth_params.sizeMax - earth_params.sizeMin, min, max);
        this.breathFreq = freq;
        this.breathAmpl = breathAmp;
        return this;
    }
    breath() { // update R
        this.updatedR = this.radians + mSin(frame * this.breathFreq) * this.breathAmpl;
    }
    addParticles() {
        let randomAngle = random(PI / 2, 2 * PI + PI / 2);
        let randomPosX = mSin(randomAngle) * this.updatedR;
        let randomPosY = mCos(randomAngle) * this.updatedR;
        let moveRange = map(this.radians, earth_params.sizeMin, earth_params.sizeMax, earth_params.moveRangeMin, earth_params.moveRangeMin);
        let particle = new BreathingParticle()
            .set_pos(this.pos.x + randomPosX, this.pos.y + randomPosY, this.pos.z)
            .set_lifeReduction(earth_params.lifeReductionMin, earth_params.lifeReductionMax)
            .set_angle(randomAngle)
            .set_color(this.color.r, this.color.g, this.color.b)
            .set_rad(this.radians) // 粒子所在的相对大圆的角度位置，用于之后flow的noise的参数（连贯数值）
            .set_moveRange(moveRange);
        particles.push(particle);
    }
}

