/*
import from other js file:

function runDemo();
function updateCanvas();

*/
window.addEventListener("load", onload, { once: true });

const ASPECT_RATIO = {
  width: 16,
  height: 9,
  ratio: 16 / 9
};


let gl = null;

let canvas = {
  element: null,
  width: 0,
  height: 0
};

// RGB triplets
const COLORS = {
  black: [0.0, 0.0, 0.0],
  white: [1.0, 1.0, 1.0]
}

function onload(_event) {

  canvas.element = document.getElementById("main-canvas");

  if (canvas.element === null) {
    return;
  }

  initGl();

  runDemo();
}


function initGl() {

  gl = canvas.element.getContext("webgl2");

  if (!gl) {
    canvas.element.innerText = "Your browser doesn't seem to support WebGL 2";
    throw new Error("Uh oh");
  }

  resizeCanvas();
  clearCanvas(COLORS.black);

  window.addEventListener("resize", (_event) => {
    resizeCanvas();
    updateCanvas();
  });
}

function clearCanvas(clearColor) {
  gl.clearColor(...clearColor, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function resizeCanvas() {
  let newSize = getOptimalCanvasSize();

  canvas.element.width = newSize.x;
  canvas.element.height = newSize.y;

  canvas.width = newSize.x;
  canvas.height = newSize.y;

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}

function getOptimalCanvasSize() {
  
  let bodyElement = canvas.element.parentElement;
  let maxWidth = bodyElement.clientWidth;
  
  let viewportHeight = bodyElement.clientHeight;
  let canvasTop = canvas.element.offsetTop;
  let maxHeight = viewportHeight - canvasTop;

  let availableAspectRatio = maxWidth / maxHeight;

  let optimalSize = {
    x: 0,
    y: 0
  };

  let aspectMultiple;
  if (availableAspectRatio > ASPECT_RATIO.ratio) {
    // limited by height

    aspectMultiple = Math.floor(maxHeight / ASPECT_RATIO.height);

  } else {
    // limited by width

    aspectMultiple = Math.floor(maxWidth / ASPECT_RATIO.width);
  }

  optimalSize.y = aspectMultiple * ASPECT_RATIO.height;
  optimalSize.x = aspectMultiple * ASPECT_RATIO.width;

  return optimalSize;
}