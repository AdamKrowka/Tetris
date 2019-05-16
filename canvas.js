const canvas = document.getElementById("myCanvas");
const scoreDiv = document.getElementById("score");
const bestScoreDiv = document.getElementById("bestScore");
const ctx = canvas.getContext("2d");
ctx.canvas.height = 600;
ctx.canvas.width = 360;

let y = 0;
let x = 5;
let speed = 500;
const bok = 30;
const width = ctx.canvas.width / bok;
const height = ctx.canvas.height / bok;
const rand = (min, max) => {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}


const block = {
    x: 0,
    y: 0,
    type: "L",
    matrix() {
        if (this.type === "T") {
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ];
        } else if (this.type === "L") {
            return [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ]
        } else if (this.type === "J") {
            return [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]
            ]
        } else if (this.type === "Z") {
            return [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1]
            ]
        } else if (this.type === "S") {
            return [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0]
            ]
        } else if (this.type === "I") {
            return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        } else if (this.type === "O") {
            return [
                [1, 1],
                [1, 1]
            ]
        }
    }
}
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, canvas.width, canvas.height)

function creatMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

const area = creatMatrix(12, 20);

function mergeMatrix(area, block) {
    for (let y = 0; y < block.matrix().length; y++) {
        for (let x = 0; x < block.matrix()[y].length; x++) {
            if (area[y + block.y][x + block.x] === 0) {
                area[y + block.y][x + block.x] = block.matrix()[y][x];
            }

        }

    }
}

function randomBlock() {
    switch (rand(1, 7)) {
        case 1:
            return "T"
            break;
        case 2:
            return "L"
            break;
        case 3:
            return "J"
            break;
        case 4:
            return "Z"
            break;
        case 5:
            return "S"
            break;
        case 6:
            return "I"
            break;
        case 7:
            return "O"
            break;


    }
}

function colide(area, block) {
    const blockMatrix = block.matrix();
    for (let y = 0; y < blockMatrix.length; y++) {
        for (let x = 0; x < blockMatrix[y].length; x++) {
            if (blockMatrix[y][x] !== 0 &&
                (area[y + block.y] &&
                    area[y + block.y][x + block.x]) !== 0) {
                return true;
            }

        }

    }
    return false;
}

ctx.fillStyle = "red";

function drowMatrix(matrix, w = 0, h = 0) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] === 1)
                ctx.fillRect((x + w) * bok, (y + h) * bok, bok, bok);
        }
    }
}

drowMatrix(area);

setInterval(() => {

}, speed);


    drowMatrix(block.matrix(), block.x, block.y);
window.addEventListener("keydown", function (event) {
    if (event.keyCode == 40) {
        // down
        block.y++;
    } else if (event.keyCode == 38) {
        // up
        block.y--;
    } else if (event.keyCode == 37) {
        //left
        block.x--;
    } else if (event.keyCode == 39) {
        block.x++;
        //right
    }
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "red";
    if (colide(area, block)) {
        block.y--;
        mergeMatrix(area, block);
        block.type = randomBlock();
        block.y = 0;
        block.x = 5;
    }

    drowMatrix(block.matrix(), block.x, block.y);
    drowMatrix(area);
});
