var Chunks = {
    xrange: 3,
    yrange: 3,
    zrange: 1,

    chunks: null,

    init: function (gl) {

        this.chunks = [];

        for (var i = 0; i < this.xrange; i++) {
            for (var j = 0; j < this.yrange; j++) {
                for (var k = 0; k < this.zrange; k++) {
                    var chunk = new Chunk().init(i, j, k);
                    chunk.buffers = gl.getBuffers(chunk.mesh);
                    delete chunk.mesh;

                    this.chunks.push(chunk.buffers);
                }
            }
        }
        return this;
    },
    tick: function () {

    },
    render: function (gl) {

        gl.render(this.chunks);

    }
};