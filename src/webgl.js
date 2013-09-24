var webgl = {

    gl: null,
    shaderProgram: null,

    init: function (canvas, chunk) {
        this.initGL(canvas);
        this.shaderProgram = this.initShaders();
   },

    initGL: function (canvas) {
        var gl = this.gl = canvas.getContext("experimental-webgl");
        if (!gl) {
            throw new Error("Sorry, no webgl.");
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
    },

    compile: function (code, isFrag) {
        var gl = this.gl,
            shader = gl.createShader(isFrag ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER);

        gl.shaderSource(shader, code);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            throw new Error("Bad shader code");
        }
        return shader;
    },

    initShaders: function () {
        var gl = this.gl,
            prog = null,
            fs = "\
                precision mediump float;\
                varying vec4 vColor;\
                void main(void) {\
                    gl_FragColor = vColor;\
                }",
            vs = "\
                attribute vec3 aVertexPosition;\
                attribute vec4 aVertexColor;\
                \
                uniform mat4 uMVMatrix;\
                uniform mat4 uPMatrix;\
                \
                varying vec4 vColor;\
                \
                void main(void) {\
                    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 0.5);\
                    vec4 fog_color = vec4(0.13, 0.13, 0.03, 1.0);\
                    float fog_end = 100.0;\
                    float fog_coord = clamp(abs(gl_Position.z), 0.0, fog_end);\
                    float fog = clamp((fog_end - fog_coord) / fog_end, 0.0, 1.0);\
                    vColor = mix(fog_color, aVertexColor, fog);\
                }";
        prog = gl.createProgram();
        gl.attachShader(prog, this.compile(vs, false));
        gl.attachShader(prog, this.compile(fs, true));
        gl.linkProgram(prog);

        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error("No linky.");
        }
        gl.useProgram(prog);

        prog.vertexPositionAttribute = gl.getAttribLocation(prog, "aVertexPosition");
        gl.enableVertexAttribArray(prog.vertexPositionAttribute);

        prog.vertexColorAttribute = gl.getAttribLocation(prog, "aVertexColor");
        gl.enableVertexAttribArray(prog.vertexColorAttribute);

        prog.pMatrixUniform = gl.getUniformLocation(prog, "uPMatrix");
        prog.mvMatrixUniform = gl.getUniformLocation(prog, "uMVMatrix");

        return prog;
    },

    getBuffers: function (mesh) {
        var gl = this.gl,
            posBuffer = gl.createBuffer(),
            colBuffer = gl.createBuffer(),
            idxBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.verts), gl.STATIC_DRAW);
        posBuffer.size = 3;
        posBuffer.items = (mesh.verts.length / posBuffer.size) | 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.colors), gl.STATIC_DRAW);
        colBuffer.size = 4;
        colBuffer.items = (mesh.colors.length / colBuffer.size) | 0;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
        idxBuffer.size = 1;
        idxBuffer.items = (mesh.indices.length / idxBuffer.size ) | 0;

        return  {
            verts: posBuffer,
            colors: colBuffer,
            indices: idxBuffer
        }
    },

    render: function (bufferss, camera) {

        var gl = this.gl,
            prog = this.shaderProgram;

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(prog.pMatrixUniform, false, matrix.perspective(45, gl.viewportWidth / gl.viewportHeight, 1, 1000.0));
        gl.uniformMatrix4fv(prog.mvMatrixUniform, false, camera.getTransforms());

        bufferss.forEach(function (buffers) {

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.verts);
            gl.vertexAttribPointer(prog.vertexPositionAttribute, buffers.verts.size, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
            gl.vertexAttribPointer(prog.vertexColorAttribute, buffers.colors.size, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
            gl.drawElements(gl.TRIANGLES, buffers.indices.items, gl.UNSIGNED_SHORT, 0);

        });

    }
};
