function Player() {
    this.pos = null;
    this.rotation = null;

    this.speed = 0.9;
    this.gravity = 0.1;
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

        return this;
    },

    tick: function (input, chunks) {

        var moves = this.tickInput(input);

        if (this.falling) {
            moves.z -= this.gravity;
            if (this.jumpSpeed > 0) {
                moves.z += this.jumpSpeed;
                this.jumpSpeed -= 0.5;
            }
        }

        var worldPos = [
                Math.floor((-this.pos.x) / 2),
                Math.floor((-this.pos.y) / 2),
                Math.floor((this.pos.z + moves.z) / 2)],
            chunkPos = worldPos.map(function (p) { return Math.floor(p / chunks.CHUNK_SIZE); }),
            inWorld = chunkPos.every(function(c) { return c >= 0; });

        if (inWorld) {
            var chunk = chunks.chunks[chunkPos[0]][chunkPos[1]][chunkPos[2]];
            if (!chunk) {
                console.error(chunkPos, chunks);
                throw new Error("no chunk");
            }
            var block = chunk.blocks[worldPos[0] % chunks.CHUNK_SIZE][worldPos[1] % chunks.CHUNK_SIZE][worldPos[2] % chunks.CHUNK_SIZE];
            if (!block) {
                console.error(worldPos, chunk.blocks);
                throw new Error("no block");
            }

            if (block.isActive) {
                falling = false;
                moves.z = 0;
            } else {
                if (worldPos[1] > 0) {
                    var footBlock = chunk.blocks[worldPos[0] % chunks.CHUNK_SIZE][(worldPos[1] - 1) % chunks.CHUNK_SIZE][worldPos[2] % chunks.CHUNK_SIZE];
                    if (!footBlock.isActive) {
                        this.falling = true;
                    }
                }
            }
        }


        this.pos.x += moves.x;
        this.pos.y += moves.y;
        this.pos.z += moves.z;

    },

    tickInput: function (input) {

        var speed = this.speed,
            xo = 0,
            yo = 0,
            zo = 0;

        if (Input.isDown("left")) {
            this.rotation.y -= speed;
        }
        if (Input.isDown("right")) {
            this.rotation.y += speed;
        }

        if (Input.isDown("forward")) { // move up
            zo += speed;
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
            console.log(this.falling);
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
        this.jumpSpeed = 6;
        this.falling = true;
    }


}