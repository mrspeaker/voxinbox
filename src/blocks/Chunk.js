function Chunk() {
    this.blocks = null;
    this.CHUNK_SIZE = 16;
    this.mesh = {}
}
Chunk.prototype = {

    init: function (y, x, z) {
        this.off = [y, x, z];
        this.chunkOffs = {
            x: x * this.CHUNK_SIZE,
            y: y * this.CHUNK_SIZE,
            z: z * this.CHUNK_SIZE
        };
        this.createChunk();
        this.createMesh(y * this.CHUNK_SIZE, x * this.CHUNK_SIZE, z * this.CHUNK_SIZE);
        return this;
    },

    createChunk: function () {
        this.blocks = [];
        for (var y = 0; y < this.CHUNK_SIZE; y++) {
            this.blocks.push([]);
            for (var x = 0; x < this.CHUNK_SIZE; x++) {
                this.blocks[y].push([]);
                // var value2d = game.simplex.noise3D(
                //     (this.off[0] * this.CHUNK_SIZE + x) / this.CHUNK_SIZE / 5,
                //     (this.off[1] * this.CHUNK_SIZE + y) / this.CHUNK_SIZE / 5,
                //     (this.off[2] * this.CHUNK_SIZE + z) / this.CHUNK_SIZE / 5);
                // value2d = (value2d + 0.5) * 0.5;

                for (var z = 0; z < this.CHUNK_SIZE; z++) {
                    this.blocks[y][x][z] = new Block();
                    // if (z / this.CHUNK_SIZE < value2d) {
                    //     this.blocks[x][y][z].isActive = true;
                    // }
                    if (y === 0) {
                        this.blocks[y][x][z].isActive = true;
                    }
                    if (y === 1) {
                        if (x === 0 && z  === 0) {
                            this.blocks[y][x][z].isActive = true;
                        }
                        if (x === 1 && z  === 0) {
                            this.blocks[y][x][z].isActive = true;
                        }
                    }

                    if (y === 1 && Math.random() < 0.01) {
                            this.blocks[y][x][z].isActive = true;
                    }
                }
            }
        }

        // Empty out invisible blocks
        var toHide = [];
        for (var y = 1; y < this.CHUNK_SIZE - 2; y++) {
            this.blocks.push([]);
            for (var x = 1; x < this.CHUNK_SIZE - 2; x++) {
                this.blocks[y].push([]);
                for (var z = 1; z < this.CHUNK_SIZE - 2; z++) {
                    var block = this.blocks[y][x][z];
                    if (block.isActive) {
                        if (
                            this.blocks[y - 1][x][z].isActive &&
                            this.blocks[y + 1][x][z].isActive &&
                            this.blocks[y][x - 1][z].isActive &&
                            this.blocks[y][x + 1][z].isActive &&
                            this.blocks[y][x][z + 1].isActive &&
                            this.blocks[y][x][z - 1].isActive
                        ) {
                            toHide.push(block);
                        }
                    }
                }
            }
        }
        toHide.forEach(function(b) {
            b.isActive = false;
        });
    },

    createMesh: function (yo, xo, zo) {
        this.mesh = {
            verts: [],
            indices: [],
            colors: []
        };
        var cubeid = 0;

        for (var y = 0; y < this.CHUNK_SIZE; y++) {
            for (var x = 0; x < this.CHUNK_SIZE; x++) {
                for (var z = 0; z < this.CHUNK_SIZE; z++) {
                    var block = this.blocks[y][x][z];
                    if (block.isActive) {
                        var cube = this.createCube(block, yo + y, xo + x, zo + z, cubeid);
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

    createCube: function (block, yo, xo, zo, id) {
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
            var dark = (Math.random() * 30 - 15) | 0,
                colors = [
                    [(72 + dark)/255, (163 + dark)/255, (65 + dark)/255, 1.0], // Front face
                    [0.4, 0.4, 0.2, 1.0], // Back face
                    [(145 + dark)/255, (97 + dark)/255, (48 + dark)/255, 1.0], // Top face
                    [(145 + dark)/255, (97 + dark)/255, (48 + dark)/255, 1.0], // Bottom face
                    [(105 + dark)/255, (57 + dark)/255, (8 + dark)/255, 1.0], // Right face
                    [(105 + dark)/255, (57 + dark)/255, (8 + dark)/255, 1.0]  // Left face
                ],
            // var dark = id / total,
            //     colors = [
            //         [dark, 0.0, 0.0, 1.0], // Front face
            //         [dark, 0.0, 0.0, 1.0], // Back face
            //         [0.0, dark, 0.0, 1.0], // Top face
            //         [0.0, 0.0, dark, 1.0], // Bottom face
            //         [dark, dark, 0.0, 1.0], // Right face
            //         [0.0, dark, dark, 1.0]  // Left face
            //     ],
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