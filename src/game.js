var game = {
    fps: 60,
    step: 1 / 60,
    dt: 0,
    last: null,

    init: function () {

        webgl.init(document.querySelector("#board"))

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

    },

    render: function (dt) {

        webgl.render();

    }
}