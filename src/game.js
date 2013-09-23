var game = {
    fps: 60,
    step: 1 / 60,
    dt: 0,
    last: null,

    init: function () {

        webgl.init(document.querySelector("#board"));

        this.makeAChunk();

        this.run();
    },

    makeAChunk: function () {
        this.chunk = new Chunk().init();
        this.chunk.buffers = webgl.getBuffers(this.chunk.mesh);
        delete this.chunk.mesh;
    },

    run: function () {
        var now = Date.now(),
            self = this;
        this.dt = this.dt + Math.min(1, (now - this.last) / 1000);
        while(this.dt > this.step) {
          this.dt = this.dt - this.step;
          this.tick(this.step);
        }
        this.render(this.dt);
        this.last = now;
        requestAnimationFrame(function () {
            self.run();
        });
    },

    tick: function (dt) {

        if (Math.random() < 0.02) {
            //this.makeAChunk();
        }
    },

    render: function (dt) {

        webgl.render(this.chunk.buffers);

    }
}