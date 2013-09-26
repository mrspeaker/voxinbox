var game = {
    fps: 60,
    step: 1 / 60,
    dt: 0,
    last: null,

    init: function () {

        this.input = Input.init();
        this.input.bind({
            "left": "left",
            "right": "right",
            "up": "up",
            "down": "down",
            "forward": "w",
            "backward": "s",
            "strafe_left": "a",
            "strafe_right": "d",
            "fire": "space"

        });

        this.camera = new Camera().init();
        this.simplex = new SimplexNoise();
        this.player = new Player().init(-10, -10, 15);

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

        this.player.tick(dt, this.input, this.chunks);
        this.camera.tick(this.player);
        this.input.tick()

    },

    render: function (dt) {

        this.chunks.render(webgl, this.camera);

    }
}