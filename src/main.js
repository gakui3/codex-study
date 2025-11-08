const errorLabel = document.querySelector("#error");

const tmpVecA = new Float32Array(3);
const tmpVecB = new Float32Array(3);
const tmpVecC = new Float32Array(3);

function createMat4() {
  const out = new Float32Array(16);
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}

function mat4Multiply(out, a, b) {
  const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
  const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
  const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
  const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

  out[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
  out[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
  out[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
  out[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
  out[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
  return out;
}

function mat4FromXRotation(out, rad) {
  const s = Math.sin(rad);
  const c = Math.cos(rad);

  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

function mat4FromYRotation(out, rad) {
  const s = Math.sin(rad);
  const c = Math.cos(rad);

  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

function normalizeVec3(out, v) {
  const len = Math.hypot(v[0], v[1], v[2]);
  if (len > 0.00001) {
    out[0] = v[0] / len;
    out[1] = v[1] / len;
    out[2] = v[2] / len;
  }
  return out;
}

function subtractVec3(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

function crossVec3(out, a, b) {
  const ax = a[0], ay = a[1], az = a[2];
  const bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

function dotVec3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function mat4LookAt(out, eye, center, up) {
  const f = normalizeVec3(tmpVecA, subtractVec3(tmpVecA, center, eye));
  const s = normalizeVec3(tmpVecB, crossVec3(tmpVecB, f, up));
  const u = crossVec3(tmpVecC, s, f);

  out[0] = s[0];
  out[1] = s[1];
  out[2] = s[2];
  out[3] = 0;
  out[4] = u[0];
  out[5] = u[1];
  out[6] = u[2];
  out[7] = 0;
  out[8] = -f[0];
  out[9] = -f[1];
  out[10] = -f[2];
  out[11] = 0;
  out[12] = -dotVec3(s, eye);
  out[13] = -dotVec3(u, eye);
  out[14] = dotVec3(f, eye);
  out[15] = 1;
  return out;
}

function mat4Perspective(out, fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) / (near - far);
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = (2 * far * near) / (near - far);
  out[15] = 0;
  return out;
}

async function initWebGPU() {
  if (!navigator.gpu) {
    throw new Error("このブラウザは WebGPU に対応していません。Chrome 113+ や Edge 113+ を使用してください。");
  }

  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("webgpu");

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error("WebGPU アダプターの取得に失敗しました。");
  }

  const device = await adapter.requestDevice();
  const format = navigator.gpu.getPreferredCanvasFormat();

  const devicePixelRatio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(canvas.clientWidth * devicePixelRatio);
  canvas.height = Math.floor(canvas.clientHeight * devicePixelRatio);

  context.configure({
    device,
    format,
    alphaMode: "premultiplied",
  });

  const cubeVertices = new Float32Array([
    // Front (red)
    -1, -1, 1, 1, 0, 0,
    1, -1, 1, 1, 0, 0,
    1, 1, 1, 1, 0, 0,
    -1, -1, 1, 1, 0, 0,
    1, 1, 1, 1, 0, 0,
    -1, 1, 1, 1, 0, 0,
    // Back (green)
    -1, -1, -1, 0, 1, 0,
    -1, 1, -1, 0, 1, 0,
    1, 1, -1, 0, 1, 0,
    -1, -1, -1, 0, 1, 0,
    1, 1, -1, 0, 1, 0,
    1, -1, -1, 0, 1, 0,
    // Top (blue)
    -1, 1, -1, 0, 0, 1,
    -1, 1, 1, 0, 0, 1,
    1, 1, 1, 0, 0, 1,
    -1, 1, -1, 0, 0, 1,
    1, 1, 1, 0, 0, 1,
    1, 1, -1, 0, 0, 1,
    // Bottom (yellow)
    -1, -1, -1, 1, 1, 0,
    1, -1, -1, 1, 1, 0,
    1, -1, 1, 1, 1, 0,
    -1, -1, -1, 1, 1, 0,
    1, -1, 1, 1, 1, 0,
    -1, -1, 1, 1, 1, 0,
    // Right (magenta)
    1, -1, -1, 1, 0, 1,
    1, 1, -1, 1, 0, 1,
    1, 1, 1, 1, 0, 1,
    1, -1, -1, 1, 0, 1,
    1, 1, 1, 1, 0, 1,
    1, -1, 1, 1, 0, 1,
    // Left (cyan)
    -1, -1, -1, 0, 1, 1,
    -1, -1, 1, 0, 1, 1,
    -1, 1, 1, 0, 1, 1,
    -1, -1, -1, 0, 1, 1,
    -1, 1, 1, 0, 1, 1,
    -1, 1, -1, 0, 1, 1,
  ]);

  const vertexBuffer = device.createBuffer({
    size: cubeVertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, cubeVertices);

  const uniformBuffer = device.createBuffer({
    size: 64,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const shaderModule = device.createShaderModule({
    code: /* wgsl */ `
      struct Uniforms {
        mvp : mat4x4<f32>,
      };

      @group(0) @binding(0)
      var<uniform> uniforms : Uniforms;

      struct VertexOutput {
        @builtin(position) position : vec4f,
        @location(0) color : vec3f,
      };

      @vertex
      fn vs_main(@location(0) position : vec3f, @location(1) color : vec3f) -> VertexOutput {
          var output : VertexOutput;
          output.position = uniforms.mvp * vec4f(position, 1.0);
          output.color = color;
          return output;
      }

      @fragment
      fn fs_main(@location(0) color : vec3f) -> @location(0) vec4f {
          return vec4f(color, 1.0);
      }
    `,
  });

  const pipeline = await device.createRenderPipelineAsync({
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vs_main",
      buffers: [
        {
          arrayStride: Float32Array.BYTES_PER_ELEMENT * 6,
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x3" },
            {
              shaderLocation: 1,
              offset: Float32Array.BYTES_PER_ELEMENT * 3,
              format: "float32x3",
            },
          ],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs_main",
      targets: [{ format }],
    },
    primitive: { topology: "triangle-list", cullMode: "back" },
    depthStencil: {
      format: "depth24plus",
      depthWriteEnabled: true,
      depthCompare: "less",
    },
  });

  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height, 1],
    format: "depth24plus",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const renderPassDescriptor = {
    colorAttachments: [
      {
        view: undefined,
        loadOp: "clear",
        clearValue: { r: 0.03, g: 0.03, b: 0.07, a: 1 },
        storeOp: "store",
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthLoadOp: "clear",
      depthClearValue: 1,
      depthStoreOp: "store",
    },
  };

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  });

  const modelMatrix = createMat4();
  const viewMatrix = createMat4();
  const projectionMatrix = createMat4();
  const viewProjectionMatrix = createMat4();
  const rotationXMatrix = createMat4();
  const rotationYMatrix = createMat4();

  const eye = new Float32Array([2.5, 2.5, 4]);
  const center = new Float32Array([0, 0, 0]);
  const up = new Float32Array([0, 1, 0]);

  function frame(time) {
    renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();

    mat4FromXRotation(rotationXMatrix, time * 0.0005 * Math.PI * 2);
    mat4FromYRotation(rotationYMatrix, time * 0.0003 * Math.PI * 2);
    mat4Multiply(modelMatrix, rotationYMatrix, rotationXMatrix);

    mat4LookAt(viewMatrix, eye, center, up);
    const aspect = canvas.width / canvas.height;
    mat4Perspective(projectionMatrix, (45 * Math.PI) / 180, aspect, 0.1, 100);
    mat4Multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    mat4Multiply(modelMatrix, viewProjectionMatrix, modelMatrix);

    device.queue.writeBuffer(uniformBuffer, 0, modelMatrix);

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass(renderPassDescriptor);
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setBindGroup(0, bindGroup);
    pass.draw(cubeVertices.length / 6);
    pass.end();

    device.queue.submit([encoder.finish()]);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

initWebGPU().catch((err) => {
  errorLabel.hidden = false;
  errorLabel.textContent = err.message;
  console.error(err);
});
