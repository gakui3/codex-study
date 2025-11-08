const errorLabel = document.querySelector("#error");

const cubeVertices = new Float32Array([
  // front
  -1, -1, 1,
  1, -1, 1,
  1, 1, 1,
  -1, -1, 1,
  1, 1, 1,
  -1, 1, 1,
  // back
  -1, -1, -1,
  -1, 1, -1,
  1, 1, -1,
  -1, -1, -1,
  1, 1, -1,
  1, -1, -1,
  // top
  -1, 1, -1,
  -1, 1, 1,
  1, 1, 1,
  -1, 1, -1,
  1, 1, 1,
  1, 1, -1,
  // bottom
  -1, -1, -1,
  1, -1, -1,
  1, -1, 1,
  -1, -1, -1,
  1, -1, 1,
  -1, -1, 1,
  // right
  1, -1, -1,
  1, 1, -1,
  1, 1, 1,
  1, -1, -1,
  1, 1, 1,
  1, -1, 1,
  // left
  -1, -1, -1,
  -1, -1, 1,
  -1, 1, 1,
  -1, -1, -1,
  -1, 1, 1,
  -1, 1, -1,
]);

function mat4Identity(out) {
  out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
  out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
  out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
  out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
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

  out[0] = a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30;
  out[1] = a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31;
  out[2] = a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32;
  out[3] = a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33;

  out[4] = a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30;
  out[5] = a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31;
  out[6] = a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32;
  out[7] = a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33;

  out[8] = a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30;
  out[9] = a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31;
  out[10] = a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32;
  out[11] = a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33;

  out[12] = a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30;
  out[13] = a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31;
  out[14] = a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32;
  out[15] = a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33;
  return out;
}

function mat4Perspective(out, fovy, aspect, near, far) {
  const f = 1.0 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);

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
  out[10] = (far + near) * nf;
  out[11] = -1;

  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
  return out;
}

function mat4LookAt(out, eye, center, up) {
  let zx = eye[0] - center[0];
  let zy = eye[1] - center[1];
  let zz = eye[2] - center[2];

  let len = Math.hypot(zx, zy, zz);
  if (len === 0) {
    zz = 1;
  } else {
    zx /= len;
    zy /= len;
    zz /= len;
  }

  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz);
  if (len === 0) {
    xx = 0;
    xy = 0;
    xz = 0;
  } else {
    xx /= len;
    xy /= len;
    xz /= len;
  }

  let yx = zy * xz - zz * xy;
  let yy = zz * xx - zx * xz;
  let yz = zx * xy - zy * xx;

  len = Math.hypot(yx, yy, yz);
  if (len !== 0) {
    yx /= len;
    yy /= len;
    yz /= len;
  }

  out[0] = xx; out[1] = xy; out[2] = xz; out[3] = 0;
  out[4] = yx; out[5] = yy; out[6] = yz; out[7] = 0;
  out[8] = zx; out[9] = zy; out[10] = zz; out[11] = 0;
  out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]);
  out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
  out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
  out[15] = 1;
  return out;
}

function mat4RotateX(out, rad) {
  mat4Identity(out);
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  out[5] = c;
  out[6] = s;
  out[9] = -s;
  out[10] = c;
  return out;
}

function mat4RotateY(out, rad) {
  mat4Identity(out);
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  out[0] = c;
  out[2] = -s;
  out[8] = s;
  out[10] = c;
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

  let depthTexture;
  let depthTextureView;

  function configureContext() {
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    context.configure({
      device,
      format,
      alphaMode: "premultiplied",
    });

    if (depthTexture) {
      depthTexture.destroy();
    }

    depthTexture = device.createTexture({
      size: [canvas.width, canvas.height, 1],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    depthTextureView = depthTexture.createView();
  }

  configureContext();
  window.addEventListener("resize", configureContext);

  const vertexBuffer = device.createBuffer({
    size: cubeVertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Float32Array(vertexBuffer.getMappedRange()).set(cubeVertices);
  vertexBuffer.unmap();

  const matrixBuffer = new Float32Array(16);
  const colorData = new Float32Array([0.2, 0.8, 0.9, 1.0]);
  const colorScratch = new Float32Array(4);
  const uniformBufferSize = (16 + 4) * 4; // mat4 + color
  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(uniformBuffer, 64, colorData);

  const shaderModule = device.createShaderModule({
    code: /* wgsl */ `
      struct Uniforms {
        mvp : mat4x4f,
        color : vec4f,
      };

      @group(0) @binding(0)
      var<uniform> u : Uniforms;

      struct VSOut {
        @builtin(position) position : vec4f;
      };

      @vertex
      fn vs_main(@location(0) position : vec3f) -> VSOut {
          var output : VSOut;
          output.position = u.mvp * vec4f(position, 1.0);
          return output;
      }

      @fragment
      fn fs_main() -> @location(0) vec4f {
          return u.color;
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
          arrayStride: 12,
          attributes: [{ shaderLocation: 0, offset: 0, format: "float32x3" }],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs_main",
      targets: [{ format }],
    },
    primitive: {
      topology: "triangle-list",
      cullMode: "back",
    },
    depthStencil: {
      format: "depth24plus",
      depthWriteEnabled: true,
      depthCompare: "less",
    },
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
      view: depthTextureView,
      depthLoadOp: "clear",
      depthClearValue: 1.0,
      depthStoreOp: "store",
    },
  };

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: { buffer: uniformBuffer },
      },
    ],
  });

  const projectionMatrix = new Float32Array(16);
  const viewMatrix = new Float32Array(16);
  const modelMatrix = new Float32Array(16);
  const rotXMatrix = new Float32Array(16);
  const rotYMatrix = new Float32Array(16);
  const tempMatrix = new Float32Array(16);
  mat4LookAt(viewMatrix, [0, 0, 4], [0, 0, 0], [0, 1, 0]);

  function updateUniforms(time) {
    const aspect = canvas.width / canvas.height;
    mat4Perspective(projectionMatrix, Math.PI / 4, aspect, 0.1, 100);

    const angle = time * 0.001;
    mat4RotateX(rotXMatrix, angle * 0.7);
    mat4RotateY(rotYMatrix, angle);
    mat4Multiply(modelMatrix, rotYMatrix, rotXMatrix);
    mat4Multiply(tempMatrix, viewMatrix, modelMatrix);
    mat4Multiply(matrixBuffer, projectionMatrix, tempMatrix);

    device.queue.writeBuffer(uniformBuffer, 0, matrixBuffer);
  }

  function updateColorFromPointer(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    colorScratch[0] = Math.min(Math.max(x, 0), 1);
    colorScratch[1] = Math.min(Math.max(1 - y, 0), 1);
    colorScratch[2] = 0.8;
    colorScratch[3] = 1.0;
    device.queue.writeBuffer(uniformBuffer, 64, colorScratch);
  }

  function resetColor() {
    device.queue.writeBuffer(uniformBuffer, 64, colorData);
  }

  canvas.addEventListener("pointermove", updateColorFromPointer);
  canvas.addEventListener("pointerleave", resetColor);
  canvas.addEventListener("pointerdown", updateColorFromPointer);

  function frame(time) {
    updateUniforms(time);

    renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
    renderPassDescriptor.depthStencilAttachment.view = depthTextureView;

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass(renderPassDescriptor);
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setBindGroup(0, bindGroup);
    pass.draw(cubeVertices.length / 3);
    pass.end();

    device.queue.submit([encoder.finish()]);
    requestAnimationFrame(frame);
  }

  frame(0);
}

initWebGPU().catch((err) => {
  errorLabel.hidden = false;
  errorLabel.textContent = err.message;
  console.error(err);
});
