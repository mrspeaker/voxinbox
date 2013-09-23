var game = {
    fps: 60,
    step: 1 / 60,
    dt: 0,
    last: null,

    init: function () {

        this.simplex = new SimplexNoise();
        //console.log(this.simplex.noise2D(100, 20))
        //console.log(this.simplex.noise3D(0.1, 0.2, 0.3));

        webgl.init(document.querySelector("#board"));

        this.chunks = Chunks.init(webgl);

        this.run();
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

        this.chunks.render(webgl);

    }
}