const canvas = document.getElementById("myCanvas");
const scoreDiv = document.getElementById("score");
const bestScoreDiv = document.getElementById("bestScore");
const ctx = canvas.getContext("2d");
ctx.canvas.height = 600;
ctx.canvas.width = 360;
let speed = 500;
const bok = 30;
const width = ctx.canvas.width / bok;
const height = ctx.canvas.height / bok;
const rand = (min, max) => {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}


const block = {
    x: 5,
    y: 0,
    type: "L",
    matrix: [],
    matrixCreator() {
        this.type = randomBlock();
        if (this.type === "T") {
            this.matrix = [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ];
        } else if (this.type === "L") {
            this.matrix = [
                [0, 2, 0],
                [0, 2, 0],
                [0, 2, 2]
            ]
        } else if (this.type === "J") {
            this.matrix = [
                [0, 3, 0],
                [0, 3, 0],
                [3, 3, 0]
            ]
        } else if (this.type === "Z") {
            this.matrix = [
                [0, 0, 0],
                [4, 4, 0],
                [0, 4, 4]
            ]
        } else if (this.type === "S") {
            this.matrix = [
                [0, 0, 0],
                [0, 5, 5],
                [5, 5, 0]
            ]
        } else if (this.type === "I") {
            this.matrix = [
                [0, 6, 0, 0],
                [0, 6, 0, 0],
                [0, 6, 0, 0],
                [0, 6, 0, 0]
            ]
        } else if (this.type === "O") {
            this.matrix = [
                [7, 7],
                [7, 7]
            ]
        }
    }
}

function addReducer(accumulator, a) {
    return accumulator + a;
}

function blockMove(dir) {

    block.x += dir;
    if (colide(area, block)) {
        block.x -= dir;
    }
}

function creatMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function colide(area, block) {
    const blockMatrix = block.matrix;
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

const area = creatMatrix(12, 20);


function drowMatrix(matrix, w = 0, h = 0) {


    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] !== 0) {
                if (matrix[y][x] === 1) ctx.fillStyle = "#e6b800";
                else if (matrix[y][x] === 2) ctx.fillStyle = "#5200cc";
                else if (matrix[y][x] === 3) ctx.fillStyle = "#cc3300";
                else if (matrix[y][x] === 4) ctx.fillStyle = "#009900";
                else if (matrix[y][x] === 5) ctx.fillStyle = "#cc33ff";
                else if (matrix[y][x] === 6) ctx.fillStyle = "#0000ff";
                else if (matrix[y][x] === 7) ctx.fillStyle = "#ff0000";

                ctx.fillRect((x + w) * bok, (y + h) * bok, bok, bok);
            }
        }
    }
}

function mergeMatrix(area, block) {
    for (let y = 0; y < block.matrix.length; y++) {
        if (block.matrix[y].reduce(addReducer, 0) !== 0)
            for (let x = 0; x < block.matrix[y].length; x++) {
                if (area[y + block.y][x + block.x] === 0) {
                    area[y + block.y][x + block.x] = block.matrix[y][x];
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

function rotateBlock(block, rotate = "R") {
    let offset = 1;
    for (let x = 0; x < block.matrix.length; x++) {
        for (let y = x; y < block.matrix[x].length; y++) {
            [block.matrix[x][y], block.matrix[y][x]] = [block.matrix[y][x], block.matrix[x][y]]
        }

    }
    if (rotate === "L")
        block.matrix.reverse();

    else if (rotate === "R") {
        for (let x = 0; x < block.matrix.length; x++) {
            block.matrix[x].reverse();
        }
    }
    while (colide(area, block)) {
        block.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1))

    }
}



function matrixFullRow(arr) {
    for (let x = 0; x < arr.length; x++) {
        if (arr[x] == 0) {
            return false;
        }
    }
    return true;
}


function cutRow() {
    for (let x = 0; x < area.length; x++) {
        if (matrixFullRow(area[x])) {
            area.splice(x, 1);
            area.unshift(new Array(area[0].length).fill(0))
        }


    }

}


function reset() {
    block.y--;
    mergeMatrix(area, block);
    cutRow();
    block.matrixCreator();
    block.y = 0;
    block.x = 5;
    if (colide(area, block)) {
        area.forEach(row => row.fill(0));
    }
}


function drow() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drowMatrix(block.matrix, block.x, block.y);
    drowMatrix(area);
    if (colide(area, block))
        reset();

}

let dropCounter = 0;
let dropInterval = 1000;
let LastTime = 0;

function frame(time = 0) {

    const deltaTime = time - LastTime;
    LastTime = time;

    dropCounter += deltaTime;

    if (dropCounter > dropInterval) {
        block.y++;
        dropCounter = 0;
    }
    drow();
    requestAnimationFrame(frame);
}

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, canvas.width, canvas.height);

drowMatrix(block.matrix, block.x, block.y);
drowMatrix(area);

frame();
block.matrixCreator();
window.addEventListener("keydown", function (event) {
    if (event.keyCode == 40) {
        // down
        dropCounter = 0;
        block.y++;
        if (colide(area, block))
            reset();

    } else if (event.keyCode == 81) {
        // q
        rotateBlock(block, "R");
    } else if (event.keyCode == 69) {
        // e
        rotateBlock(block, "L");
    } else if (event.keyCode == 37) {
        //left
        blockMove(-1);
    } else if (event.keyCode == 39) {
        blockMove(1);
        //right
    }


});