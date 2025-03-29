let mic;
let leaves = [];
let leafImg;
let bgImg;
let emitCounter = 0;

function preload() {
  leafImg = loadImage('leaf1.png');   // Your leaf image
  bgImg = loadImage('bg.jpg');       // Your watercolor background image
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  drawBackgroundWithAspectRatio();

  let vol = mic.getLevel();
  fill(255);
  textSize(16);
  text("Mic Volume: " + vol.toFixed(4), 20, 30);

  emitCounter++;

  // Emit new leaves based on mic volume
  if (emitCounter > 10 && vol > 0.005) {
    let numLeaves = map(vol, 0.005, 0.1, 2, 15);
    numLeaves = constrain(numLeaves, 1, 20);
    for (let i = 0; i < floor(numLeaves); i++) {
      leaves.push(new Leaf());
    }
    emitCounter = 0;
  }

  // Limit total leaves
  if (leaves.length > 300) {
    leaves.splice(0, leaves.length - 300);
  }

  // Update and display leaves
  for (let i = leaves.length - 1; i >= 0; i--) {
    leaves[i].update();
    leaves[i].display();
    if (leaves[i].offScreen()) {
      leaves.splice(i, 1);
    }
  }
}

// Draw background image with proper aspect ratio
function drawBackgroundWithAspectRatio() {
  let imgAspect = bgImg.width / bgImg.height;
  let canvasAspect = width / height;

  let drawW, drawH;

  if (canvasAspect > imgAspect) {
    drawW = width;
    drawH = width / imgAspect;
  } else {
    drawH = height;
    drawW = height * imgAspect;
  }

  image(bgImg, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
}

// Resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Leaf class
class Leaf {
  constructor() {
    this.x = random(width);
    this.y = -50;
    this.size = random(10, 35);
    this.speedY = random(1.5, 3.5);
    this.driftX = random(-0.6, 0.6);
    this.angle = random(TWO_PI);
    this.rotationSpeed = random(-0.02, 0.02);
  }

  update() {
    this.x += this.driftX;
    this.y += this.speedY;
    this.angle += this.rotationSpeed;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(leafImg, 0, 0, this.size, this.size);
    pop();
  }

  offScreen() {
    return this.y > height + this.size;
  }
}