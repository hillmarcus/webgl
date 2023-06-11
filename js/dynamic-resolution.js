/*

# exports:

function runDemo();
function updateCanvas();

# imports:

let Width;
let Height;

*/

let program = null;

let buffers = [];
let uniformLocation = null;
let attributeIndex;

// to be called after main.js sets up
function runDemo() {

  copmileProgram();
  initializeBuffer();

  gl.useProgram(program);

  uniformLocation = gl.getUniformLocation(program, SHADERS.identifiers.uniforms.resolution);

  updateCanvas();
}

function updateCanvas() {
  gl.uniform2f(uniformLocation, canvas.width, canvas.height);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}




function copmileProgram() {

  // Create shaders

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, SHADERS.source.vertex);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, SHADERS.source.fragment);
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
}

const SHADERS = (function() {

  let identifiers = {
    attributes: {
      pos: "pos"
    },
    uniforms: {
      resolution: "resolution"
    }
  }

  return {
    identifiers: identifiers,
    source: {
      vertex: `#version 300 es

in vec2 ${identifiers.attributes.pos};

void main() {
  gl_Position = vec4(${identifiers.attributes.pos}, 0.0, 1.0);
}`,

      fragment: `#version 300 es

precision highp float;
uniform vec2 ${identifiers.uniforms.resolution};

layout(location = 0) out vec4 fragColor;

void main() {

  vec2 uv = gl_FragCoord.xy / ${identifiers.uniforms.resolution};
  fragColor = vec4(uv.x, uv.y, 0.0, 1.0);
}`
    }
  }
})();

function initializeBuffer() {

  let buffer = gl.createBuffer();
  buffers.push(buffer);

  const vertices = new Float32Array([
    1.0,  1.0,
   -1.0,  1.0,
    1.0, -1.0,
   -1.0, -1.0
 ]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    vertices,
    gl.STATIC_DRAW
  );

  attributeLocation = gl.getAttribLocation(program, SHADERS.identifiers.attributes.pos);
  /* parameters:
      attrib array _attributeLocation_,
      _2_ _floats_ per vertex,
      _don't normalize_,
      _2 * sizeof(float32)_ bytes between entries,
      starts at index _0_
  */
  gl.vertexAttribPointer(attributeLocation, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
  gl.enableVertexAttribArray(attributeLocation);
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