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
                    vColor = aVertexColor;\
                }\
                ";
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

    render: function (bufferss) {

        var gl = this.gl,
            prog = this.shaderProgram;

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        bufferss.forEach(function (buffers) {

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.verts);
        gl.vertexAttribPointer(prog.vertexPositionAttribute, buffers.verts.size, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colors);
        gl.vertexAttribPointer(prog.vertexColorAttribute, buffers.colors.size, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        var id = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            out = id.slice(0)
            tmp = id.slice(0),
            rot = 0;

        var X = (Date.now() / 20 % 360 | 0) * (Math.PI / 180.0);
        tmp[5] = Math.cos(X);
        tmp[6] = Math.sin(X);
        tmp[9] = -1 * Math.sin(X);
        tmp[10] = Math.cos(X);
        out = matrix.mult(out, tmp);

        tmp = id.slice(0);
        var Z = (Date.now() / 20 % 360 | 0) * (Math.PI / 180.0);
        tmp[0] = Math.cos(Z);
        tmp[1] = Math.sin(Z);
        tmp[4] = -1 * Math.sin(Z);
        tmp[5] = Math.cos(Z);
        out = matrix.mult(out, tmp);

        // Translate
        tmp = id.slice(0);
        tmp[12] = -10;
        tmp[13] = 0.2;
        tmp[14] = 150 * -1;
        out = matrix.mult(out, tmp);

        gl.uniformMatrix4fv(prog.pMatrixUniform, false, matrix.perspective(45, gl.viewportWidth / gl.viewportHeight, 1, 1000.0));
        gl.uniformMatrix4fv(prog.mvMatrixUniform, false, out);

        gl.drawElements(gl.TRIANGLES, buffers.indices.items, gl.UNSIGNED_SHORT, 0);

    });

    }
};
