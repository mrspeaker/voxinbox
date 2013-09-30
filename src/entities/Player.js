function Player() {
    this.pos = null;
    this.rotation = null;

    this.velocity = null;
    this.acceleration = null;

    this.speed = 4.3; // m/s
    this.rotSpeed = 43;
    this.gravity = { x:0, y:-9.8 * 0.7, z: 0 };

    this.falling = false;
    this.jumpSpeed = 0;

    this.eyeH = 0.5;//1.62;
    this.w = 0.6;
    this.d = 0.6;
    this.h = 1.8;

    this.tmp = null;
};
Player.prototype = {

    init: function (x, z, y) {

        this.pos = { x: x, y: y, z: z };
        this.rotation = { x: 0, y: 280, z: 0 };
        this.velocity = { x: 0, y: 0, z: 0 };
        this.acceleration = { x: 0, y: 0, z: 0 };

        return this;
    },

    tick: function (dt, input, chunks) {

        var moves = this.tickInput(dt, input);

        this.velocity.y += this.acceleration.y;

        if (this.falling) {

            this.velocity.y += this.gravity.y * dt;

            //moves.y = this.velocity.y;

        }
        this.acceleration.y = 0;

        chunk = chunks.getChunk(this);
        if(!chunk) {
            game.msg = "no chunk"
            this.pos.y += moves.y;
            this.pos.x += moves.x;
            this.pos.z += moves.z;
        }

        if (chunk) {

            var worldPos = [
                Math.floor(this.pos.y),
                Math.floor(this.pos.x + (this.w / 2)),
                Math.floor(this.pos.z + (this.d / 2))];

            var block = chunk.getBlock(
                worldPos[0],
                worldPos[1],
                worldPos[2]
            );

            if (!block[0]) {
                console.error(worldPos, chunk.blocks, block);
                throw new Error("no block");
            }
            game.msg = worldPos.join(" ") + "---"  + block[1] + ":" + block[2] + ":" + block[3] + " --- ";
            block = block[0];

            /*worldPos = [
                Math.floor(this.pos.y + moves.y),
                Math.floor(this.pos.x + (this.w / 2)),
                Math.floor(this.pos.z + (this.d / 2))];*/

            if (block.isActive) {
                game.msg += "hit";
                this.falling = false;
                moves.y = 0;
                if (this.velocity.y < 0) {
                    this.velocity.y = 0;
                    this.acceleration.y = 0;
                }
            } else {
                this.falling = true;
            }
        }

        if(this.velocity.y > 3) {
            this.velocity.y > 3;
        }
        if (this.velocity.y < -3) {
            this.velocity.y  = -3;
        }

        this.pos.x += moves.x;
        this.pos.y += moves.y;
        this.pos.z += moves.z;

    },

    //1.0  sec = 4.3 blocks
    //0.5  sec = 2.15 blocks
    //0.25 sec = 1.075
    tickInput: function (dt, input) {

        var speed = this.speed * dt,
            xo = 0,
            yo = 0,
            zo = 0;

        if (Input.isDown("left")) {
            this.rotation.y -= this.rotSpeed * dt;
        }
        if (Input.isDown("right")) {
            this.rotation.y += this.rotSpeed * dt;
        }

        if (Input.isDown("up")) {
            yo += speed * 10;
        }
        if (Input.isDown("down")) {
            yo -= speed * 10;
        }

        if (Input.isDown("forward")) {
            var rot = this.rotation.y;
            xo += speed * Math.sin(rot * (Math.PI / 180.0));
            zo -= speed * Math.cos(rot * (Math.PI / 180.0));
        }
        if (Input.isDown("backward")) {
            xo -= speed * Math.sin(this.rotation.y * (Math.PI / 180.0));
            zo += speed * Math.cos(this.rotation.y * (Math.PI / 180.0));
        }
        if (Input.isDown("strafe_left")) {
            zo += speed;
        }
        if (Input.isDown("strafe_right")) {
            zo -= speed;
        }

        if (Input.isDown("fire")) {
            if (!this.falling) {
                this.jump();
            }
        }

        ["0", "1", "2", "3", "4", "5", "6"].forEach(function(k) {
            if (Input.isDown(k)) {
                xo = 0;
                yo = 0;
                zo = 0;
                this.pos.x = parseInt(k);
                this.pos.z = this.pos.x;

                this.velocity.x = 0;
                this.velocity.z = 0;
            }
        }, this);

        return {
            x: xo,
            y: yo,
            z: zo
        }
    },

    getChunk: function () {
        return [
            this.pos.x,
            this.pos.z,
            this.pos.y
        ].map(function (p) { return Math.floor(p / 16); });
    },

    jump: function () {
        this.acceleration.z += 1.5;
    }


}