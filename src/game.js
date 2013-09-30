var game = {
    fps: 60,
    step: 1 / 60,
    dt: 0,
    last: null,

    msg: "",

    init: function () {

        this.input = Input.init();
        this.input.bind({
            "left": "left",
            "right": "right",
            "forward": "up",
            "backward": "down",
            "up": "w",
            "down": "s",
            "strafe_left": "a",
            "strafe_right": "d",
            "fire": "space",
            "0": 48,
            "1": 49,
            "2": 50,
            "3": 51,
            "4": 52,
            "5": 53,
            "6": 54

        });

        this.camera = new Camera().init();
        this.simplex = new SimplexNoise();
        this.player = new Player().init(2, 2, 5);

        webgl.init(document.querySelector("#board"));
        this.initHud();

        this.chunks = Chunks.init(webgl);

        this.last = Date.now();
        this.run();

    },

    initHud: function () {

        this.hud = document.querySelector("#hud").getContext("2d");

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

        var c = this.hud;
        c.clearRect(0, 0, c.canvas.width, c.canvas.height);
        c.fillStyle = "#fff";
        c.fillText(
            "p: " + this.player.pos.x.toFixed(1) +
            " " + this.player.pos.z.toFixed(1) +
            " " + this.player.pos.y.toFixed(1),
            10,
            15
        );

        c.fillText(
            "c: " + this.player.getChunk().join(" "),
            10,
            30
        );

        c.fillText("r: " + this.player.rotation.y.toFixed(2), 10, 45)

        this.msg && c.fillText(this.msg, 10, 60);

    }
}