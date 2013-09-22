function Chunk() {
    this.blocks = null;
    this.CHUNK_SIZE = 16;
}
Chunk.prototype = {
    init: function () {
        this.blocks = [];
        for (var x = 0; x < this.CHUNK_SIZE; x++) {
            this.blocks.push([]);
            for (var y = 0; y < this.CHUNK_SIZE; y++) {
                this.blocks[x].push([]);
                for (var z = 0; z < this.CHUNK_SIZE; z++) {
                    this.blocks[x][y][z] = new Block();
                }
            }
        }

    },
    tick: function () {

    },
    createMesh: function () {

    },
    createCube: function () {

    },
    render: function () {

    }
}