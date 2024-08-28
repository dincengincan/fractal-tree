const myCanvas = document.getElementById("my-canvas");
const ctx = myCanvas.getContext("2d");

const angleChangeThreshold = 20;
const lengthChangeThreshold = 0.6;
const len = 300;
const angle = 90;
const delay = 0; // Delay in milliseconds

let lastTime = 0;

const drawBranch = (startX, startY, len, angle, timestamp) => {
  if (len < 5) {
    return;
  }

  if (timestamp - lastTime < delay) {
    requestAnimationFrame((time) =>
      drawBranch(startX, startY, len, angle, time)
    );

    return;
  }

  lastTime = timestamp;

  const angleRadians = (angle / 180) * Math.PI;

  const endX = startX - Math.cos(angleRadians) * len;
  const endY = startY - Math.sin(angleRadians) * len;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Schedule the next branches to draw after the delay
  requestAnimationFrame((time) => {
    drawBranch(
      endX,
      endY,
      len * lengthChangeThreshold,
      angle + angleChangeThreshold,
      time
    );
    drawBranch(
      endX,
      endY,
      len * lengthChangeThreshold,
      angle - angleChangeThreshold,
      time
    );
  });
};

// Initial call to start the tree drawing
requestAnimationFrame((time) =>
  drawBranch(myCanvas.clientWidth / 2, myCanvas.clientHeight, len, angle, time)
);
