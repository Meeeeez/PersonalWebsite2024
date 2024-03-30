class ArrayList extends Array {
    constructor() {
        super(...[]);
    }
    size() {
        return this.length;
    }
    add(x) {
        this.push(x);
    }
    get(i) {
        return this[i];
    }
    remove(i) {
        this.splice(i, 1);
    }
}

let pts;
let onPressed;
let f;
let w = window.innerWidth;
let h = window.innerHeight;
let x = 0;

function setup() {
    canvas = createCanvas(w, h);
    canvas.style("position: absolute; top: 0; right: 0;");
    colorMode(HSB, 255);
    rectMode(CENTER);
    pts = new ArrayList();
}

function draw() {
    if (x == 0) {
        for (let j = 0; j <= window.innerWidth; j += 30) {
            for (let i = 0; i < random(10, 30); i++) {
                let newP = new Particle(
                    j,
                    window.innerHeight,
                    i + pts.size(),
                    i + pts.size()
                );
                pts.add(newP);
            }
        }
        x++;
    }

    if (onPressed) {
        for (let i = 0; i < 10; i++) {
            let newP = new Particle(
                mouseX,
                mouseY,
                i + pts.size(),
                i + pts.size()
            );
            pts.add(newP);
        }
    }
    for (let i = pts.size() - 1; i > -1; i--) {
        let p = pts.get(i);
        if (p.dead) {
            pts.remove(i);
        } else {
            p.update();
            p.display();
        }
    }
}

class Particle {
    loc;
    vel;
    acc;
    lifeSpan;
    passedLife = 0;
    dead;
    alpha;
    weight;
    weightRange;
    decay;
    xOfst;
    yOfst;
    c;
    constructor(x, y, xOfst, yOfst) {

        let colors = [
            '#A32810',
            '#727A18',
            '#A37720',
            '#3D6266',
            '#7A4955',
            '#557A55',
            '#998D6B',
            '#4C4635',
            '#CC3214',
            '#8E991E',
            '#CC9528',
            '#4C7B7F',
            '#995B6B',
            '#6B996B',
            '#CCBC8E',
            '#B7A980',
            '#CCBC8E',
            '#A34110',
            '#7A7155',
        ];

        this.loc = new p5.Vector(x, y);
        let randDegrees = random(360);
        this.vel = new p5.Vector(
            cos(radians(randDegrees)),
            sin(radians(randDegrees))
        );
        this.vel.mult(random(5));
        this.acc = new p5.Vector(0, 0);
        this.lifeSpan = parseInt(random(30, 90));
        this.decay = random(0.75, 0.9);
        this.c = color(random(colors));
        this.weightRange = random(3, 50);
        this.xOfst = xOfst;
        this.yOfst = yOfst;
    }
    update() {
        if (this.passedLife >= this.lifeSpan) {
            this.dead = true;
        } else {
            this.passedLife++;
        }
        this.alpha =
            (parseFloat(this.lifeSpan - this.passedLife) / this.lifeSpan) * 70 +
            50;
        this.weight =
            (parseFloat(this.lifeSpan - this.passedLife) / this.lifeSpan) *
            this.weightRange;

        this.acc.set(0, 0);
        let rn =
            (noise(
                (this.loc.x + frameCount + this.xOfst) * 0.01,
                (this.loc.y + frameCount + this.yOfst) * 0.01
            ) -
                0.5) *
            TWO_PI *
            4;
        let mag = noise(
            (this.loc.y - frameCount) * 0.01,
            (this.loc.x - frameCount) * 0.01
        );
        let dir = new p5.Vector(cos(rn), sin(rn));
        this.acc.add(dir);
        this.acc.mult(mag);
        let randRn = random(TWO_PI);
        let randV = new p5.Vector(cos(randRn), sin(randRn));
        randV.mult(0.25);
        this.acc.add(randV);
        this.vel.add(this.acc);
        this.vel.mult(this.decay);
        this.vel.limit(3);
        this.loc.add(this.vel);
    }
    display() {
        strokeWeight(this.weight + 1.5);
        stroke(0, this.alpha);
        point(this.loc.x, this.loc.y);
        strokeWeight(this.weight);
        stroke(this.c);
        point(this.loc.x, this.loc.y);
    }
}
function mousePressed() {
    onPressed = true;
}
function mouseReleased() {
    onPressed = false;
}
function keyPressed() {
    for (let i = pts.size() - 1; i > -1; i--) {
        let p = pts.get(i);
        pts.remove(i);
    }
    clear();

    for (let j = 0; j <= window.innerWidth; j += 30) {
        for (let i = 0; i < random(10, 30); i++) {
            let newP = new Particle(
                j,
                window.innerHeight,
                i + pts.size(),
                i + pts.size()
            );
            pts.add(newP);
        }
    }
    x++;
}
