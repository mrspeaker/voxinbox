var Chunks = {
    ys: 0,
    ye: 1,
    xs: -5,
    xe: 5,
    zs: -1,
    ze: 1,

    CHUNK_SIZE: 16,

    buffers: null,
    chunks: null,

    init: function (gl) {

        this.chunks = {};
        this.buffers = [];

        for (var y = this.ys; y < this.ye; y++) {
            this.chunks[y] = {};
            for (var x = this.xs; x < this.xe; x++) {

                this.chunks[y][x] = {};

                for (var z = this.zs; z < this.ze; z++) {
                    var chunk = new Chunk().init(y, x, z);
                    this.buffers.push(gl.getBuffers(chunk.mesh));
                    delete chunk.mesh;

                    this.chunks[y][x][z] = chunk;
                }
            }
        }
        return this;
    },
    tick: function () {

    },

    getChunk: function (target) {

        var cs = this.CHUNK_SIZE,
            offs = [
                Math.floor(target.pos.y / this.CHUNK_SIZE),
                Math.floor(target.pos.x / this.CHUNK_SIZE),
                Math.floor(target.pos.z / this.CHUNK_SIZE)
            ];

        var y = this.chunks[offs[0]],
            x = y ? y[offs[1]] : null,
            z = x ? x[offs[2]] : null;
        return z;
    },

    render: function (gl, camera) {

        gl.render(this.buffers, camera);

    }
};