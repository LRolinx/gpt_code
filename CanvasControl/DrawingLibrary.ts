/**设置画布大小 */
export const setCanvasSize = (canvas: HTMLCanvasElement, width: number, height: number) => {
  canvas.setAttribute('width', `${width}px`)
  canvas.setAttribute('height', `${height}px`)
}

/**绘制背景 */
export const draingBakcgournd = (gl: WebGLRenderingContext, color: RGBA) => {
  gl.clearColor(color.r, color.g, color.b, color.a);
}

/**绘制矩形 */
export const draingRect = (canvas: HTMLCanvasElement, gl: WebGLRenderingContext, x?: number, y?: number, w?: number, h?: number, color?: RGBA) => {
  // const w = 10
  // const h = 10
  const vp = w <= 0 || h <= 0 ? 0 : 0.00565
  //顶点数据
  const vertices = [
    -vp * (canvas.height/canvas.width) - (w*vp*(canvas.height/canvas.width)), vp + (h*vp), 0.0,
    -vp * (canvas.height/canvas.width) - (w*vp*(canvas.height/canvas.width)), -vp - (w*vp), 0.0,
    vp * (canvas.height/canvas.width) + (w*vp*(canvas.height/canvas.width)), -vp - (w*vp), 0.0,
    vp * (canvas.height/canvas.width) + (w*vp*(canvas.height/canvas.width)), vp + (h*vp), 0.0
  ];

  

  // const vertices = [
  //   0, 0, 0,
  //   0, -vp - (h * vp), 0,
  //   vp * (canvas.height / canvas.width) + (w * vp * (canvas.height / canvas.width)), -vp - (h * vp), 0,
  //   vp * (canvas.height / canvas.width) + (w * vp * (canvas.height / canvas.width)), 0, 0.0
  // ];

  //连接顶点索引
  const indices = [3, 2, 1, 3, 1, 0];

  //创建缓冲区
  const vertex_buffer = gl.createBuffer();

  // 绑定顶点数据方式
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // 将顶点数据添加到缓冲区
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // 清除顶点数据缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // 创建顶点索引缓冲区
  var Index_Buffer = gl.createBuffer();

  // 绑定顶点索引方式
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

  // 将顶点索引添加到缓冲区
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  // 清除顶点索引缓冲区
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  //--------------以下准备Shader 渲染---------------
  // Vertex shader source code
  var vertCode = `
  attribute vec3 coordinates;
  uniform vec4 translation;
  void main(void) {
    gl_Position = translation + vec4(coordinates, 1.0);
  }
  `

  // Create a vertex shader object
  var vertShader = gl.createShader(gl.VERTEX_SHADER);

  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertCode);

  // Compile the vertex shader
  gl.compileShader(vertShader);

  // Fragment shader source code
  var fragCode = `
  void main(void) {
    gl_FragColor = vec4(${color?.r ?? 1},${color?.g ?? 1},${color?.b ?? 1},${color?.a ?? 1});
  }
  `

  // Create fragment shader object 
  var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  // Attach fragment shader source code
  gl.shaderSource(fragShader, fragCode);

  // Compile the fragmentt shader
  gl.compileShader(fragShader);

  // Create a shader program object to
  // store the combined shader program
  var shaderProgram = gl.createProgram();

  // Attach a vertex shader
  gl.attachShader(shaderProgram, vertShader);

  // Attach a fragment shader
  gl.attachShader(shaderProgram, fragShader);

  // Link both the programs
  gl.linkProgram(shaderProgram);

  // 使用合并的着色器程序对象
  gl.useProgram(shaderProgram);

  /* ======= Associating shaders to buffer objects =======*/

  // Bind vertex buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // Bind index buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Index_Buffer);

  // 获取属性位置
  var coord = gl.getAttribLocation(shaderProgram, "coordinates");

  // Point an attribute to the currently bound VBO
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

  // Enable the attribute
  gl.enableVertexAttribArray(coord);

  /*============= Drawing the Quad ================*/

  //变换矩阵
  const xformMatrix = new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    x ?? 0, y ?? 0, 1.0, 1.0
  ]);
  const translation = gl.getUniformLocation(shaderProgram, 'translation');

  // const canvasx = ((x - (canvas.width / 2)))+((-canvas.width) / (canvas.width / 2))
  const canvasx = ((0 - (canvas.width / 2))) / (canvas.width / 2)

  gl.uniform4f(translation, 0, 0, 0, 1);

  // 启用深度测试
  gl.enable(gl.DEPTH_TEST);

  // 清除颜色缓冲区位
  // gl.clear(gl.COLOR_BUFFER_BIT);

  // 设置视图端口
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Draw the triangle
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

/**颜色转RGBA颜色 */
export const colorToRGBA = (color: string): RGBA => {
  const s = 1 / 255
  const rgba: RGBA = {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  }

  if (color.indexOf("#") != -1 && color.length <= 5) {
    //缩写hex
    const str_hex = color.replace("#", "")
    let canvert = ""
    for (let i = 0; i < str_hex.length; i++) {
      canvert += (str_hex[i] + str_hex[i])
    }
    rgba.r = Number(`0x${canvert.slice(0, 2)}`) * s
    rgba.g = Number(`0x${canvert.slice(2, 4)}`) * s
    rgba.b = Number(`0x${canvert.slice(4, 6)}`) * s
    if (canvert.length == 6) {
      //纯色
      rgba.a = 1
    } else if (canvert.length == 8) {
      //带透明色
      rgba.a = Number(`0x${canvert.slice(6, 8)}`) * s
    }
  } else if (color.indexOf("#") != -1 && color.length <= 9) {
    //hex
    const str_hex = color.replace("#", "")
    rgba.r = Number(`0x${str_hex.slice(0, 2)}`) * s
    rgba.g = Number(`0x${str_hex.slice(2, 4)}`) * s
    rgba.b = Number(`0x${str_hex.slice(4, 6)}`) * s
    if (str_hex.length == 6) {
      //纯色
      rgba.a = 1
    } else if (str_hex.length == 8) {
      //带透明色
      rgba.a = Number(`0x${str_hex.slice(6, 8)}`) * s
    }
  } else if (color.indexOf("rgb(") != -1) {
    const str_rgb = color.replace("rgb(", "").replace(")", "").split(",")
    rgba.r = Number(str_rgb[0]) * s
    rgba.g = Number(str_rgb[1]) * s
    rgba.b = Number(str_rgb[2]) * s
    rgba.a = 1
  } else if (color.indexOf("rgba(") != -1) {
    const str_rgba = color.replace("rgba(", "").replace(")", "").split(",")
    rgba.r = Number(str_rgba[0]) * s
    rgba.g = Number(str_rgba[1]) * s
    rgba.b = Number(str_rgba[2]) * s
    rgba.a = Number(str_rgba[3])
  } else if (color.indexOf("rgb[") != -1) {
    const str_rgb2 = color.replace("rgb[", "").replace("]", "").split(",")
    rgba.r = Number(str_rgb2[0])
    rgba.g = Number(str_rgb2[1])
    rgba.b = Number(str_rgb2[2])
    rgba.a = 1
  } else if (color.indexOf("rgba[") != -1) {
    const str_rgba2 = color.replace("rgba[", "").replace("]", "").split(",")
    rgba.r = Number(str_rgba2[0])
    rgba.g = Number(str_rgba2[1])
    rgba.b = Number(str_rgba2[2])
    rgba.a = Number(str_rgba2[3])
  }

  return rgba
}

/**颜色类型 */
export type RGBA = {
  r: number,
  g: number,
  b: number,
  a: number,
}
