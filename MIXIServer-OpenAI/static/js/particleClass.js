class createVector {
    constructor(_x = 0, _y = 0, _z = 0) {
        this.x = _x
        this.y = _y
        this.z = _z
    }

    add(_v) {
        if (isNumber(_v)) {
            this.x += _v
            this.y += _v
            this.z += _v
        }
        else {
            this.x += _v.x
            this.y += _v.y
            this.z += _v.z
        }
    }

    mult(_v) {
        if (isNumber(_v)) {
            this.x *= _v
            this.y *= _v
            this.z *= _v
        }
        else {
            this.x *= _v.x
            this.y *= _v.y
            this.z *= _v.z
        }
    }
}

class ParticleBasic {
    constructor() {
        this.isBasic = true;
        this.isCoord = false;
        this.isEmo = false;
        this.pos = new createVector();
        this.vel = new createVector();
        this.acc = new createVector();

        this.scl = new createVector(1, 1, 1);
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
    is_coord() {
        this.isBasic = false;
        this.isCoord = true;
        return this;
    }
    set_pos(x, y, z) {
        this.pos = new createVector(x, y, z);
        return this;
    }
    set_vel(x, y, z) {
        this.vel = new createVector(x, y, z);
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
        this.scl = new createVector(w, h, d);
        this.mass = this.scl.x * this.scl.y * this.scl.z;
        return this;
    }
    set_lifeReduction(min, max) {
        this.lifeReduction = randomNumber(min, max);
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
        let force = new createVector(f.x, f.y, f.z);
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
        noise.seed(Math.random());
        let xFreq = this.pos.x * posFreq + frame * timeFreq;
        let yFreq = this.pos.y * posFreq + frame * timeFreq;
        let zFreq = this.pos.z * posFreq + frame * timeFreq;
        let noiseValue1 = map(noise.simplex3(xFreq, yFreq, zFreq), 0.0, 1.0, -1, 1);
        let noiseValue2 = map(noise.simplex3(xFreq + 1000, yFreq + 1000, zFreq + 1000), 0.0, 1.0, -1, 1);
        let noiseValue3 = map(noise.simplex3(xFreq + 2000, yFreq + 2000, zFreq + 2000), 0.0, 1.0, -1, 1);
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
class EmoParticle extends ParticleBasic {
    constructor() {
        super();
        this.isBasic = false;
        this.isCoord = false;
        this.isEmo = true;
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
        let noiseVal = noise.simplex2(angleFreq, radFreq, frameFreq);
        let zPos = 0;
        if (noiseVal > earth_params.moveThreshold) {
            zPos = map(noiseVal, earth_params.moveThreshold, 1, 0, this.moveRange, true);
        }
        this.pos.z = zPos;
    }
}

class Circle {
    constructor() {
        this.pos = new createVector();
        this.color = { r: 255, g: 255, b: 255 };
        this.startBreath = false;
    }
    set_startframe() {
        this.startframe = Math.floor(randomRange(0, 5000));
        return this;
    }
    set_pos(x, y, z) {
        this.pos = new createVector(x, y, z);
        return this;
    }
    set_color(color) {
        this.color.r = color[0];
        this.color.g = color[1];
        this.color.b = color[2];
        return this;
    }
    set_saturation(intensity) { // intensity = 0-1
        // 1 -> strong ; saturation -> 0 small
        this.saturation = map(intensity, 0, 1, 1, 0.4);
        return this;
    }
    set_baseRad(r) {
        this.baseR = r;
        this.updatedR = this.baseR;
        return this;
    }
    set_breath_FreqAmpl(freq, min, max) {
        let breathAmp = map(this.baseR, 0, earth_params.sizeMax - earth_params.sizeMin, min, max);
        this.breathFreq = freq;
        this.breathAmpl = breathAmp;
        return this;
    }
    breath() { // update R
        this.updatedR = this.baseR + mSin((frame - this.startframe) * this.breathFreq) * this.breathAmpl;
    }
    addParticles() {
        let randomAngle = randomNumber(Math.PI / 2, 2 * Math.PI + Math.PI / 2);
        let circlePosX = mSin(randomAngle) * this.updatedR;
        let circlePosY = mCos(randomAngle) * this.updatedR;
        let moveRange = map(this.baseR, earth_params.sizeMin, earth_params.sizeMax, earth_params.moveRangeMin, earth_params.moveRangeMin);
        let lerpValue = randomRange(0.2, 0.5)
        let r = lerp(this.color.r, 1, lerpValue);
        let g = lerp(this.color.g, 1, lerpValue);
        let b = lerp(this.color.b, 1, lerpValue);
        let particle = new EmoParticle()
            .set_pos(this.pos.x + circlePosX, this.pos.y + circlePosY, this.pos.z)
            .set_lifeReduction(earth_params.lifeReductionMin, earth_params.lifeReductionMax)
            .set_angle(randomAngle)
            .set_color(r, g, b)
            .set_rad(this.baseR)
            .set_moveRange(moveRange);
        particles.push(particle);
    }
}

