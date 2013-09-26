function Player() {
    this.pos = null;
    this.rotation = null;

    this.velocity = null;
    this.acceleration = null;

    this.speed = 0.3;
    this.gravity = {x:0, y:0, z:-9.8 * 0.7};

    this.falling = false;
    this.jumpSpeed = 0;

};
Player.prototype = {
    init: function (x, y, z) {

        this.pos = {
            x: x,
            y: y,
            z: z
        };

        this.rotation = {
            x: -90,
            y: 0,
            z: 0
        };

        this.velocity = { x: 0, y: 0, z: 0 };
        this.acceleration = { x: 0, y: 0, z: 0 };

        return this;
    },

    tick: function (dt, input, chunks) {

        var moves = this.tickInput(dt, input);

        this.velocity.z += this.acceleration.z;

        if (this.falling) {

            this.velocity.z += this.gravity.z * dt;

            moves.z = this.velocity.z;

        }
        this.acceleration.z = 0;

        var worldPos = [
                Math.floor((-this.pos.x) / 2),
                Math.floor((-this.pos.y) / 2),
                Math.floor((this.pos.z + moves.z) / 2)],
            chunkPos = worldPos.map(function (p) { return Math.floor(p / chunks.CHUNK_SIZE); }),
            inWorld = chunkPos.every(function(c) { return c >= 0; });

        if (inWorld) {
            var chunk = chunks.chunks[chunkPos[0]][chunkPos[1]][chunkPos[2]];
            if (!chunk) {
                //console.error(chunkPos, chunks);
                 this.pos.x += moves.x;
                this.pos.y += moves.y;
                this.pos.z += moves.z;
                return;
                //throw new Error("no chunk");
            }
            var block = chunk.blocks[worldPos[0] % chunks.CHUNK_SIZE][worldPos[1] % chunks.CHUNK_SIZE][worldPos[2] % chunks.CHUNK_SIZE];
            if (!block) {
                console.error(worldPos, chunk.blocks);
                throw new Error("no block");
            }

            if (block.isActive) {
                this.falling = false;
                moves.z = 0;
                if (this.velocity.z < 0) {
                    this.velocity.z = 0;
                    this.acceleration.z = 0;
                }
            } else {
                this.falling = true;
                /*if (worldPos[1] > 0) {
                    var footBlock = chunk.blocks[worldPos[0] % chunks.CHUNK_SIZE][(worldPos[1] - 1) % chunks.CHUNK_SIZE][Math.floor((this.pos.z + moves.z) / 2) % chunks.CHUNK_SIZE];
                    if (!footBlock.isActive) {
                        this.falling = true;
                    }
                }*/
            }
        }

        if(this.velocity.z > 3) {
            this.velocity.z > 3;
        }
        if (this.velocity.z < -3) {
            this.velocity.z  = -3;
        }

        this.pos.x += moves.x;
        this.pos.y += moves.y;
        this.pos.z += moves.z;

    },

    tickInput: function (dt, input) {

        var speed = this.speed,
            xo = 0,
            yo = 0,
            zo = 0;

        if (Input.isDown("left")) {
            this.rotation.y -= speed * 3.5;
        }
        if (Input.isDown("right")) {
            this.rotation.y += speed * 3.5;
        }

        if (Input.isDown("forward")) { // move up
            this.acceleration.z = 8 * dt;
        }
        if (Input.isDown("backward")) {
            zo -= speed;
        }

        if (Input.isDown("up")) { // move forward!
            xo -= speed * Math.sin(this.rotation.y * (Math.PI / 180.0));
            yo -= speed * Math.cos(this.rotation.y * (Math.PI / 180.0));
        }
        if (Input.isDown("down")) {// move backward
            xo += speed * Math.sin(this.rotation.y * (Math.PI / 180.0));
            yo += speed * Math.cos(this.rotation.y * (Math.PI / 180.0));
        }
        if (Input.isDown("strafe_left")) {
            xo += speed;
        }
        if (Input.isDown("strafe_right")) {
            xo -= speed;
        }

        if (Input.isDown("fire")) {
            if (!this.falling) {
                this.jump();
            }
        }

        return {
            x: xo,
            y: yo,
            z: zo
        }
    },

    jump: function () {
        this.acceleration.z += 1.5;
    }


}