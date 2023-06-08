window.addEventListener("load", setupWebGL, false);

let width;
let height;

let gl;
let program;

let buffers = [];

function setupWebGL(event) {
  window.removeEventListener(event.type, setupWebGL, false);

  let glInfo = initGl();

  width = glInfo.width;
  height = glInfo.height;

  gl = glInfo.context;
  program = null;

  if (!gl) {
    throw new Error("Uh oh");
  }
  
  // Compile shaders

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, SHADERS.vertex.main);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, SHADERS.fragment.main);
  gl.compileShader(fragmentShader);

  // Build program

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // Cleanup shaders

  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  // Verify success

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const linkError = gl.getProgramInfoLog(program);

    cleanup();

    alert(`Shader program link failed:\r\n\r\n${linkError}`);

    throw new Error("Oh no");
  }

  initializeAttributes();
  gl.useProgram(program);
  gl.drawArrays(gl.POINTS, 0, 1);

  cleanup();
}


const SHADERS = {
  vertex: {
    main: `
#version 100
void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 64.0;
}`
  },
  fragment: {
    main: `
#version 100
void main() {
  gl_FragColor = vec4(0.25, 0.5, 0.75, 1.0);
}`
  }
}

function initGl() {

  let canvas = document.querySelector("canvas");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  let gl = canvas.getContext("webgl") ||
           canvas.getContext("experimental-webgl");

  if (!gl) {
    throw new Error("Uh oh");
  }

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  return {
    context: gl,
    width: canvas.width,
    height: canvas.height
  }
}

function initializeAttributes() {
  gl.enableVertexAttribArray(0);

  buffers.push(gl.createBuffer());

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
  gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
}

function cleanup() {
  gl.useProgram(null);

  let index = buffers.length;
  while(index > 0) {
    let buffer = buffers[index];
    if (buffer) {
      gl.deleteBuffer(buffer);
    }
    buffers[index] = null;
    index--;
  }
  buffers = null;

  if (program) {
    gl.deleteProgram(program);
  }
}