window.addEventListener("load", setupWebGL, { once: true });

let width;
let height;

let gl;
let program;

let buffers = [];
let attributeIndex;

function setupWebGL(event) {

  let glInfo = initGl();

  width = glInfo.width;
  height = glInfo.height;

  gl = glInfo.context;
  program = null;

  if (!gl) {
    throw new Error("Uh oh");
  }
  
  program = copmileProgram();
  initializeBuffer();

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  cleanup();
}


const SHADERS = {
  vertex: {
    main: `
#version 100
attribute vec2 pos;
void main() {
  gl_Position = vec4(pos, 0.0, 1.0);
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

function initializeBuffer() {

  let buffer = gl.createBuffer();
  buffers.push(buffer);

  const vertices = new Float32Array([
    0.8,  0.8,
   -0.8,  0.8,
    0.8, -0.8,
   -0.8, -0.8
 ]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    vertices,
    gl.STATIC_DRAW
  );

  attributeLocation = gl.getAttribLocation(program, "pos");
  /* parameters:
      attrib array _attributeLocation_,
      _2_ _floats_ per vertex,
      _don't normalize_,
      _2 * sizeof(float32)_ bytes between entries,
      starts at index _0_
  */
  gl.vertexAttribPointer(attributeIndex, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(attributeIndex);
}

function copmileProgram() {

  // Create shaders

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, SHADERS.vertex.main);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, SHADERS.fragment.main);
  gl.compileShader(fragmentShader);

  // Build program

  let program = gl.createProgram();
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

  return program;
}

function cleanup() {
  gl.useProgram(null);

  let index = buffers.length;
  while(index > 0) {
    index--;

    let buffer = buffers[index];
    if (buffer) {
      gl.deleteBuffer(buffer);
    }
    buffers[index] = null;
  }
  buffers = null;
  
  if (program) {
    gl.deleteProgram(program);
  }
}