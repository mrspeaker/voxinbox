function Chunk() {
    this.blocks = null;
    this.CHUNK_SIZE = 16;
    this.mesh = {}
}
Chunk.prototype = {

    init: function (x, y, z) {
        this.off = [x, y, z];
        this.createChunk();
        this.createMesh(x * this.CHUNK_SIZE, y * this.CHUNK_SIZE, z * this.CHUNK_SIZE);
        return this;
    },

    createChunk: function () {
        var rad = this.CHUNK_SIZE / 2;
        this.blocks = [];
        for (var x = 0; x < this.CHUNK_SIZE; x++) {
            this.blocks.push([]);
            for (var y = 0; y < this.CHUNK_SIZE; y++) {
                this.blocks[x].push([]);
                for (var z = 0; z < this.CHUNK_SIZE; z++) {
                    this.blocks[x][y][z] = new Block();

                    //this.blocks[x][y][z].isActive = true;
                    if (Math.sqrt(
                        (x - rad) * (x - rad) +
                        (y - rad) * (y - rad) +
                        (z - rad) * (z - rad)) <= rad) {
                        //if ( Math.random() < 0.1 ) {
                            this.blocks[x][y][z].isActive = true;
                        //}
                    }
                }
            }
        }

        var toHide = [],
            toShow = [];
        for (var x = 1; x < this.CHUNK_SIZE - 2; x++) {
            this.blocks.push([]);
            for (var y = 1; y < this.CHUNK_SIZE - 2; y++) {
                this.blocks[x].push([]);
                for (var z = 1; z < this.CHUNK_SIZE - 2; z++) {
                    var block = this.blocks[x][y][z];
                    if (block.isActive) {
                        if (
                            this.blocks[x - 1][y][z].isActive &&
                            this.blocks[x + 1][y][z].isActive &&
                            this.blocks[x][y - 1][z].isActive &&
                            this.blocks[x][y + 1][z].isActive &&
                            this.blocks[x][y][z + 1].isActive &&
                            this.blocks[x][y][z - 1].isActive
                        ) {
                            toHide.push(block);
                        } else {
                            toShow.push(block);
                        }
                    }
                }
            }
        }
        toHide.forEach(function(b) {
            b.isActive = false;
        });
    },

    createMesh: function (xo, yo, zo) {
        this.mesh = {
            verts: [],
            indices: [],
            colors: []
        };
        var cubeid = 0;
        for (var x = 0; x < this.CHUNK_SIZE; x++) {
            for (var y = 0; y < this.CHUNK_SIZE; y++) {
                for (var z = 0; z < this.CHUNK_SIZE; z++) {
                    var block = this.blocks[x][y][z];
                    if (block.isActive) {
                        var cube = this.createCube(block, xo + x, yo + y, zo + z, cubeid);
                        cube.verts.forEach(function (v) {
                            this.mesh.verts.push(v);
                        }, this);
                        cube.indices.forEach(function (i) {
                            this.mesh.indices.push(i);
                        }, this);
                        cube.colors.forEach(function (c) {
                            this.mesh.colors.push(c);
                        }, this);
                        cubeid++;
                    }
                }
            }
        }
    },

    createCube: function (block, xo, yo, zo, id) {
        var verts = [],
            cols = [],
            indices = [];

        verts = [
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
            ];

        cols = (function () {
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

        indices = [
                0, 1, 2,      0, 2, 3,    // Front face
                4, 5, 6,      4, 6, 7,    // Back face
                8, 9, 10,     8, 10, 11,  // Top face
                12, 13, 14,   12, 14, 15, // Bottom face
                16, 17, 18,   16, 18, 19, // Right face
                20, 21, 22,   20, 22, 23  // Left face
        ].map(function(f){
            return (id * 24) + f;
        });

        return {
            verts: verts,
            colors: cols,
            indices: indices
        };

    },

    tick: function () {

    },
    render: function () {

    }
}