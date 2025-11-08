const errorLabel = document.querySelector("#error");

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

  context.configure({
    device,
    format,
    alphaMode: "premultiplied",
  });

  const vertices = new Float32Array([
    0.0, 0.6,
    -0.6, -0.4,
    0.6, -0.4,
  ]);

  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });

  new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
  vertexBuffer.unmap();

  const colorData = new Float32Array([0.2, 0.8, 0.9, 1.0]);
  const colorBuffer = device.createBuffer({
    size: colorData.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(colorBuffer, 0, colorData);

  const shaderModule = device.createShaderModule({
    code: /* wgsl */ `
      @group(0) @binding(0)
      var<uniform> uColor : vec4f;

      @vertex
      fn vs_main(@location(0) position : vec2f) -> @builtin(position) vec4f {
          return vec4f(position, 0.0, 1.0);
      }

      @fragment
      fn fs_main() -> @location(0) vec4f {
          return uColor;
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
          arrayStride: vertices.BYTES_PER_ELEMENT * 2,
          attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }],
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs_main",
      targets: [{ format }],
    },
    primitive: { topology: "triangle-list" },
  });

  const renderPassDescriptor = {
    colorAttachments: [
      {
        view: undefined, // updated on every frame
        loadOp: "clear",
        clearValue: { r: 0.03, g: 0.03, b: 0.07, a: 1 },
        storeOp: "store",
      },
    ],
  };

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: colorBuffer,
        },
      },
    ],
  });

  function frame() {
    renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();

    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass(renderPassDescriptor);
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, vertexBuffer);
    pass.setBindGroup(0, bindGroup);
    pass.draw(3);
    pass.end();

    device.queue.submit([encoder.finish()]);
    requestAnimationFrame(frame);
  }

  function updateColorFromPointer(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const nextColor = new Float32Array([
      Math.min(Math.max(x, 0), 1),
      Math.min(Math.max(1 - y, 0), 1),
      0.8,
      1.0,
    ]);
    device.queue.writeBuffer(colorBuffer, 0, nextColor);
  }

  function resetColor() {
    device.queue.writeBuffer(colorBuffer, 0, colorData);
  }

  canvas.addEventListener("pointermove", updateColorFromPointer);
  canvas.addEventListener("pointerleave", resetColor);
  canvas.addEventListener("pointerdown", updateColorFromPointer);

  frame();
}

initWebGPU().catch((err) => {
  errorLabel.hidden = false;
  errorLabel.textContent = err.message;
  console.error(err);
});
