const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

let tree = [];
let leaves = [];
let count = 0;

let wind = false;

class Branch {
  constructor(start, end, level) {
    this.start = start;
    this.end = end;
    this.finished = false;
    this.level = level;
    this.initialEnd = new Vector(end.x, end.y);
  }

  show() {
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  branchA() {
    const dir = this.end
      .subtract(this.start)
      .rotate(-Math.PI / 6)
      .multiply(0.67);
    return new Branch(this.end, this.end.add(dir), this.level + 1);
  }

  branchB() {
    const dir = this.end
      .subtract(this.start)
      .rotate(Math.PI / 6)
      .multiply(0.67);
    return new Branch(this.end, this.end.add(dir), this.level + 1);
  }

  jitter() {
    const offset = 2;
    this.end.x += Math.random() * offset - offset / 2;
    this.end.y += Math.random() * offset - offset / 2;
  }

  applyWind() {
    const windStrength = 0.15; // Control the strength of the wind
    const windDirectionX = Math.sin(Date.now() / 1000) * windStrength; // Wind changes over time
    const windDirectionY = Math.cos((Date.now() / 1000) * 3) * windStrength; // Wind changes over time
    this.end.x += windDirectionX * this.level; // Apply wind effect based on windFactor
    this.end.y += windDirectionY * this.level; // Apply wind effect based on windFactor
  }

  stopWind() {
    if (
      // stop the function if it's close enough
      Math.abs(this.end.x - this.initialEnd.x) < 1 &&
      Math.abs(this.end.y - this.initialEnd.y) < 1
    ) {
      this.end.x = this.initialEnd.x;
      this.end.y = this.initialEnd.y;

      return;
    }

    const transitionSpeed = 0.01; // Speed of transition back
    const difVector = this.initialEnd
      .subtract(this.end)
      .multiply(transitionSpeed);

    this.end.x += difVector.x;
    this.end.y += difVector.y;
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }
}

function setup() {
  const a = new Vector(canvas.width / 2, canvas.height);
  const b = new Vector(canvas.width / 2, canvas.height - 150);
  const root = new Branch(a, b, 1);
  tree.push(root);

  draw();
}

function handleGrow() {
  for (let i = tree.length - 1; i >= 0; i--) {
    if (!tree[i].finished) {
      tree.push(tree[i].branchA());
      tree.push(tree[i].branchB());
    }
    tree[i].finished = true;
  }
  count++;

  if (count === 6) {
    for (let i = 0; i < tree.length; i++) {
      if (!tree[i].finished) {
        let leaf = { x: tree[i].end.x, y: tree[i].end.y };
        leaves.push(leaf);
      }
    }
  }
}

function handleWind() {
  wind = true;
}

function handleStopWind() {
  wind = false;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < tree.length; i++) {
    tree[i].show();
    if (wind) {
      tree[i].applyWind();
    } else {
      tree[i].stopWind();
    }
  }

  for (let i = 0; i < leaves.length; i++) {
    ctx.fillStyle = "rgba(255, 0, 100, 0.5)";
    ctx.beginPath();
    ctx.arc(leaves[i].x, leaves[i].y, 8, 0, Math.PI * 2);
    ctx.fill();
    leaves[i].y += Math.random() * 2;
  }

  requestAnimationFrame(draw);
}

setup();
