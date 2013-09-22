var webgl = {

    gl: null,
    shaderProgram: null,
    cube: {},

    init: function (canvas) {
        this.initGL(canvas);
        this.shaderProgram = this.initShaders();
        this.initBuffers();
    },

    initGL: function (canvas) {
        var gl = this.gl = canvas.getContext("experimental-webgl");
        if (!gl) {
            throw new Error("Sorry, no webgl.");
        }
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        gl.clearColor(0.0, 0.0, 0.0, 0.5);
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

    getChunk: function () {
        var verts = [],
            cols = [],
            indices = [],
            cubes = 100;

        for (var i = 0; i < cubes; i++) {

            var xo = i % (cubes / 10) | 0,
                yo = i / (cubes / 10) | 0,
                zo = Math.random() * 20 | 0;

        verts = verts.concat([
                // Front face
            xo + -0.5, yo + -0.5,  zo + 0.5,
            xo +  0.5, yo + -0.5,  zo + 0.5,
            xo +  0.5, yo +  0.5,  zo + 0.5,
            xo + -0.5, yo +  0.5,  zo + 0.5,

            // Back face
            xo + -0.5, yo + -0.5, zo + -0.5,
            xo + -0.5, yo +  0.5, zo + -0.5,
            xo +  0.5, yo +  0.5, zo + -0.5,
            xo +  0.5, yo + -0.5, zo + -0.5,

            // Top face
            xo + -0.5, yo + 0.5, zo + -0.5,
            xo + -0.5, yo + 0.5, zo +  0.5,
            xo +  0.5, yo + 0.5, zo +  0.5,
            xo +  0.5, yo + 0.5, zo + -0.5,

            // Bottom face
            xo + -0.5, yo + -0.5, zo + -0.5,
            xo +  0.5, yo + -0.5, zo + -0.5,
            xo +  0.5, yo + -0.5, zo +  0.5,
            xo + -0.5, yo + -0.5, zo +  0.5,

            // Right face
            xo +  0.5, yo + -0.5, zo + -0.5,
            xo +  0.5, yo +  0.5, zo + -0.5,
            xo +  0.5, yo +  0.5, zo +  0.5,
            xo +  0.5, yo + -0.5, zo +  0.5,

            // Left face
            xo + -0.5, yo + -0.5, zo + -0.5,
            xo + -0.5, yo + -0.5, zo +  0.5,
            xo + -0.5, yo +  0.5, zo +  0.5,
            xo + -0.5, yo +  0.5, zo + -0.5
            ])

        cols = cols.concat(function () {
            var colors = [
                    [0.8, 0.0, 0.0, 0.8], // Front face
                    [0.8, 0.8, 0.0, 0.8], // Back face
                    [0.0, 0.8, 0.0, 0.8], // Top face
                    [0.8, 0.5, 0.5, 0.8], // Bottom face
                    [0.8, 0.0, 0.8, 0.8], // Right face
                    [0.0, 0.0, 0.8, 0.8]  // Left face
                ],
                unpackedColors = [];
            for (var i in colors) {
                var color = colors[i];
                for (var j=0; j < 4; j++) {
                    unpackedColors = unpackedColors.concat(color);
                }
            }
            return unpackedColors;
        }());

        indices = indices.concat([
                0, 1, 2,      0, 2, 3,    // Front face
                4, 5, 6,      4, 6, 7,    // Back face
                8, 9, 10,     8, 10, 11,  // Top face
                12, 13, 14,   12, 14, 15, // Bottom face
                16, 17, 18,   16, 18, 19, // Right face
                20, 21, 22,   20, 22, 23  // Left face
        ].map(function(f){
            return i * 24 + f;
        }));


        }

        return {
            verts: verts,
            colors: cols,
            indices: indices,
            cubes: cubes
        }
    },

    initBuffers: function () {

        var gl = this.gl,
            cubePos,
            cubeCol,
            cubeIndex,
            k;

        cubePos = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubePos);

        var chunk = this.getChunk();

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(chunk.verts),
            gl.STATIC_DRAW
        );
        cubePos.itemSize = 3;
        cubePos.numItems = 24 * chunk.cubes;

        cubeCol = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeCol);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(chunk.colors), gl.STATIC_DRAW);
        cubeCol.itemSize = 4;
        cubeCol.numItems = 24 * chunk.cubes;

        cubeIndex = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndex);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(chunk.indices),
            gl.STATIC_DRAW
        );
        cubeIndex.itemSize = 1;
        cubeIndex.numItems = 36 * chunk.cubes;

        this.cube = {
            pos: cubePos,
            col: cubeCol,
            indices: cubeIndex
        };
    },

    render: function () {
        var gl = this.gl,
            prog = this.shaderProgram;

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cube.pos);
        gl.vertexAttribPointer(prog.vertexPositionAttribute, this.cube.pos.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.cube.col);
        gl.vertexAttribPointer(prog.vertexColorAttribute, this.cube.col.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cube.indices);

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
        tmp[12] = -10;//-10 *(Math.sin(Date.now() / 1000) * 2);
        tmp[13] = 0.2;
        tmp[14] = 30 * -1;
        out = matrix.mult(out, tmp);

        gl.uniformMatrix4fv(prog.pMatrixUniform, false, matrix.perspective(45, gl.viewportWidth / gl.viewportHeight, 1, 1000.0));
        gl.uniformMatrix4fv(prog.mvMatrixUniform, false, out);

        gl.drawElements(gl.TRIANGLES, this.cube.indices.numItems, gl.UNSIGNED_SHORT, 0);

    }
};
