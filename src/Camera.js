function Camera() {

    this.pos = {
        X: -7.7,
        Y: -28,
        Z: 30
    };

    this.scale = {
        X: 1.0,
        Y: 1.0,
        Z: 1.0
    };

    this.rotation = {
        X: -90,
        Y: 0,
        Z: 0
    }

};

Camera.prototype = {

    init: function () {

        return this;
    },

    set: function (x, y, z) {
        this.pos.x = x;
        this.pos.y = y;
        this.pos.z = z;
    },

    getTransforms: function () {
        //Create a Blank Identity Matrix
        var id = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            out = id.slice(0);

        //Scaling
        // var tmp = id.slice(0);
        // tmp[0] *= this.scale.X;
        // tmp[5] *= this.scale.Y;
        // tmp[10] *= this.scale.Z;
        // out = matrix.mult(out, tmp);

        //Moving
        tmp = id.slice(0);
        tmp[12] = this.pos.X;
        tmp[13] = this.pos.Y;
        tmp[14] = this.pos.Z * -1;

        out =  matrix.mult(out, tmp);

        //Rotating X
        tmp = id.slice(0);
        var X = this.rotation.X * (Math.PI / 180.0);
        tmp[5] = Math.cos(X);
        tmp[6] = Math.sin(X);
        tmp[9] = -1 * Math.sin(X);
        tmp[10] = Math.cos(X);
        out = matrix.mult(out, tmp);

        //Rotating Y
        tmp = id.slice(0);
        var Y = this.rotation.Y * (Math.PI / 180.0);
        tmp[0] = Math.cos(Y);
        tmp[2] = -1 * Math.sin(Y);
        tmp[8] = Math.sin(Y);
        tmp[10] = Math.cos(Y);
        out = matrix.mult(out, tmp);

        //Rotating Z
        tmp = id.slice(0);
        var Z = this.rotation.Z * (Math.PI / 180.0);
        tmp[0] = Math.cos(Z);
        tmp[1] = Math.sin(Z);
        tmp[4] = -1 * Math.sin(Z);
        tmp[5] = Math.cos(Z);
        out = matrix.mult(out, tmp);

        return out;

    },

    tick: function (target) {

        this.pos.X = target.pos.x;
        this.pos.Y = target.pos.y;
        this.pos.Z = target.pos.z + 1.4;

        this.rotation.X = target.rotation.x;
        this.rotation.Y = target.rotation.y;
        this.rotation.Z = target.rotation.z;

    }

};
