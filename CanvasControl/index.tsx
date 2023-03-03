import { defineComponent } from "@/utils/defineComponent";
import { onBeforeMount, onMounted, reactive, ref } from "vue";
import { setCanvasSize, draingBakcgournd, colorToRGBA, draingRect } from "./DrawingLibrary";
import { CanvasInfoType, ControlType, ControlEnum, CStyle, AlignEnum } from "./type.d";

// 测试画布控件
export const CanvasControl = defineComponent({
  name: "CanvasControl",
  setup(props, ctx) {


    setTimeout(() => {
      const vertexShaderSource = `
      attribute vec2 a_position;
      uniform vec2 u_resolution;
      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      }
      `;
      const fragmentShaderSource = `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
      `;
      const canvas = document.querySelector('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const gl = canvas.getContext('webgl');
      const vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader, vertexShaderSource);
      gl.compileShader(vertexShader);
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fragmentShaderSource);
      gl.compileShader(fragmentShader);
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.useProgram(program);
      const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
      const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
      const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
      const radius = 50;
      
      function drawCircle(x, y, color, size) {
        const positions = [];
        for (let i = 0; i < 360; i++) {
          const radians = i * Math.PI / 180;
          const px = Math.cos(radians) * radius * size + x;
          const py = Math.sin(radians) * radius * size + y;
          positions.push(px, py);
        }
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        gl.uniform4f(colorUniformLocation, color[0], color[1], color[2], color[3]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, positions.length / 2);
      }
      function drawCrosshair(x, y) {
        gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
        gl.uniform4f(colorUniformLocation, 1, 1, 1, 1);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
          0, y,
          canvas.width, y,
          x, 0,
          x, canvas.height,
        ]), gl.STATIC_DRAW);
        gl.drawArrays(gl.LINES, 0, 4);
      }
      canvas.addEventListener('mousemove', e => {
        const x = e.clientX;
        const y = e.clientY;
        const rect = canvas.getBoundingClientRect();
        const rx = x - rect.left;
        const ry = y - rect.top;
        gl.clear(gl.COLOR_BUFFER_BIT);
        drawCircle(rx, ry,[1,0,0,1],0.1);
        drawCrosshair(rx, ry);
      });
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }, 1000)


    return () => {
      return <>
        <canvas id="canvas" ></canvas>
      </>
    }
  },
})
