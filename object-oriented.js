const myCanvas = document.getElementById("my-canvas");
const ctx = myCanvas.getContext("2d");

const angleChangeThreshold = 20;
const lengthChangeThreshold = 0.6;
const len = 300;
const angle = 90;

let lastTime = 0;
let jitter = false;
let level = 0;

const branches = [];

class Branch {
  constructor(startX, startY, length, angle, level) {
    this.startX = startX;
    this.startY = startY;
    this.length = length;
    this.angle = angle;
    this.level = level;

    this.grown = false;

    this.angleRadians = (this.angle / 180) * Math.PI;
    this.endX = this.startX - Math.cos(this.angleRadians) * this.length;
    this.endY = this.startY - Math.sin(this.angleRadians) * this.length;
    this.previousEndX = this.endX;
    this.previousEndY = this.endY;
    this.previousStartX = this.startX;
    this.previousStartY = this.startY;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.strokeStyle = "white";
    ctx.stroke();
  }

  generateBranches() {
    const rightBranch = new Branch(
      this.endX,
      this.endY,
      this.length * lengthChangeThreshold,
      this.angle + angleChangeThreshold,
      this.level + 1
    );
    const leftBranch = new Branch(
      this.endX,
      this.endY,
      this.length * lengthChangeThreshold,
      this.angle - angleChangeThreshold,
      this.level + 1
    );

    return { rightBranch, leftBranch };
  }

  jitter() {
    const randomX = Math.random() - 0.5;
    const randomY = Math.random() - 0.5;

    this.endX += randomX;
    this.endY += randomY;
  }

  reset() {
    this.endX = this.previousEndX;
    this.endY = this.previousEndY;
  }
}

const branch = new Branch(
  myCanvas.clientWidth / 2,
  myCanvas.clientHeight,
  len,
  angle,
  1
);

branches.push(branch);

const render = () => {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

  for (let eachBranch of branches) {
    eachBranch.draw(ctx);

    if (jitter) {
      eachBranch.jitter();
    } else {
      eachBranch.reset();
    }
  }

  requestAnimationFrame(render);
};

const handleGrow = () => {
  for (let i = branches.length - 1; i >= 0; i--) {
    if (!branches[i].grown) {
      const { rightBranch, leftBranch } = branches[i].generateBranches();
      branches.push(rightBranch);
      branches.push(leftBranch);
    }

    branches[i].grown = true;
  }
};

const handleBreak = () => {
  jitter = true;
};

const handleReset = () => {
  jitter = false;
};

render();
