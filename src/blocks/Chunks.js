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

        this.chunks = [];
        this.buffers = [];

        for (var y = this.ys; y < this.ye; y++) {
            this.chunks.push([]);
            for (var x = this.xs; x < this.xe; x++) {
                this.chunks[this.chunks.length - 1].push([]);
                for (var z = this.zs; z < this.ze; z++) {
                    var chunk = new Chunk().init(y, x, z);
                    this.buffers.push(gl.getBuffers(chunk.mesh));
                    delete chunk.mesh;
                    this.chunks[this.chunks.length - 1][this.chunks[0].length - 1].push(chunk);
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