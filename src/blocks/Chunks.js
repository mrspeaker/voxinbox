var Chunks = {
    xrange: 4,
    yrange: 4,
    zrange: 3,

    CHUNK_SIZE: 16,

    buffers: null,
    chunks: null,

    init: function (gl) {

        this.chunks = [];
        this.buffers = [];

        for (var i = 0; i < this.xrange; i++) {
            this.chunks.push([]);
            for (var j = 0; j < this.yrange; j++) {
                this.chunks[i].push([]);
                for (var k = 0; k < this.zrange; k++) {
                    var chunk = new Chunk().init(i, j, k);
                    this.buffers.push(gl.getBuffers(chunk.mesh));
                    delete chunk.mesh;
                    this.chunks[i][j].push(chunk);
                }
            }
        }
        return this;
    },
    tick: function () {

    },
    render: function (gl, camera) {

        gl.render(this.buffers, camera);

    }
};