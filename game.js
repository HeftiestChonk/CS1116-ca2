// Tileset is from https://pixel-poem.itch.io/dungeon-assetpuck
// Sprites are from https://zerie.itch.io/tiny-rpg-character-asset-pack

let canvas;
let context;

let request;
let fpsInterval = 1000 / 30; // the denominator is frames-per-second
let now;
let then = Date.now();

let tilesPerRow = 10;
let tileSize = 16;
let backgroundImage = new Image();
let background = [
[ 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25], 
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25], 
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[20,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,25],
[40,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,52,45]
]

// Defining a player sprite + position
let player = {
    x: 0,
    y: 0,
    width: 24,
    height: 24,
    frameX : 0,
    frameY: 0,
    xChange: 0,
    yChange : 0,
};

let playerImage = new Image();

let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;

// Defining an enemy sprite + position
let enemy = {
    x: randint(30, 492),
    y: randint(30, 300),
    width: 24,
    height: 24,
    frameX: 0,
    frameY: 0,
    xChange: randint(-5, 5),
    yChange: randint(-5, 5),
};

let enemyImage1 = new Image();


document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    // Spawning the player
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    
    window.addEventListener("keydown", activate, false); 
    window.addEventListener("keyup", deactivate, false);
    
    load_assets([
        {"var": playerImage, "url": "Free Character Sprites 2 - Fantasy Dreamland/24x24/Char_008.png"}, // Player moving sprite
        {"var": enemyImage1, "url": "Free Character Sprites 2 - Fantasy Dreamland/24x24/Char_011.png"}, // Enemy moving sprite
        {"var": backgroundImage, "url": "Dungeon_Tileset.png"}], draw); // Background tileset
}

// defining the empty space in the sprites
let empty = {
    x: 6,
    y: 4
};

function draw() {
    request = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);

    // Draw background on canvas
    context.clearRect(0, 0, canvas.width, canvas.height); 
    context.fillStyle = "#87cefa";
    context.fillRect(0, 0, canvas.width, canvas.height); 
    for (let r = 0; r < 20; r += 1) {
        for (let c = 0; c < 32; c += 1) {
            let tile = background [r][c];
            if (tile >= 0) {
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(backgroundImage, 
                    tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                    c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
    }

    // Draw player
    context.drawImage(playerImage,
        player.frameX * player.width, player.frameY * player.height, player.width, player.height, 
        player.x, player.y, player.width, player.height);

    if ((moveLeft || moveRight) &&
        ! (moveLeft && moveRight)) {
            player.frameX = (player.frameX + 1) % 4;
    }

    // Handle key presses
    if (moveLeft) {
        player.xChange = player.xChange - 0.5;
        player.frameY = 1;
    }
    if (moveRight) {
        player.xChange = player.xChange + 0.5;
        player.frameY = 2;
    }
    if (moveUp) {
        player.yChange = player. yChange - 0.5;
        player.frameY = 3
    }
    if (moveDown) {
        player.yChange = player.yChange + 0.5;
        player.frameY = 0
    }

    // Update the player
    player.x = player.x + player.xChange;
    player.y = player.y + player.yChange;

    // Draw Enemies
    context.drawImage(enemyImage1,
        enemy.frameX * enemy.width, enemy.frameY * enemy.height, enemy.width, enemy.height, 
        enemy.x, enemy.y, enemy.width, enemy.height);

    if (enemy.x + enemy.width >= canvas.width){
        enemy.xChange = enemy.xChange * (-1)
    } else if (enemy.x <= 0){
        enemy.xChange = enemy.xChange * (-1)
    }
    if (enemy.y+enemy.height >= canvas.height){
        enemy.yChange = enemy.yChange * (-1)
    } else if (enemy.y <= 0){
        enemy.yChange = enemy.yChange * (-1)
    }

    // changing the direction the enemy faces
    // Left
    if (enemy.xChange < 0) {
        enemy.frameY = 1;
    }
    // Right
    if (enemy.xChange > 0) {
        enemy.frameY = 2;
    }
    // Up
    if (enemy.yChange < 0) {
        enemy.frameY = 3
    }
    // Down
    if (enemy.yChange > 0) {
        enemy.frameY = 0
    }

    enemy.frameX = (enemy.frameX + 1) % 4;

    // Update the enemy
    enemy.x = enemy.x + enemy.xChange;
    enemy.y = enemy.y + enemy.yChange;

    // Physics
    player.xChange = player.xChange * 0.9; // friction 
    player.yChange = player.yChange * 0.9; // friction

    // Collisions
    
    // Player colliding with the wall
    if (player.x + player.width >= canvas.width){
        player.x = canvas.width - player.width
    } else if (player.x <= 0){
        player.x = 0
    }
    if (player.y + player.height >= canvas.height){
        player.y = canvas.height - player.height
    } else if (player.y <= 0){
        player.y = 0
    }

    // Player getting hit be the enemy
    if (is_colliding(player, enemy)) {
        stop("YOU LOSE!");
        return;
    }

}

// Key presses
// Activating a key
function activate(event) {
    let key = event.key;
    if (event.key == "ArrowLeft" ||
        event.key === "ArrowRight"||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown") {
            event.preventDefault();
        }
    if (key === "ArrowLeft") {
        moveLeft = true;
    } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowRight") {
        moveRight = true;
    } else if (key === "ArrowDown") {
        moveDown = true;
    }
}

// Deactivating a key
function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = false;
    } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowRight") {
        moveRight = false;
    } else if (key === "ArrowDown") {
        moveDown = false;
    }
}
function load_assets(assets, callback) {
    let num_assets = assets.length;
    let loaded = function() { 
        console.log("loaded");
        num_assets = num_assets - 1;
        if (num_assets === 0) {
            callback();
        }      
    }
    for (let asset of assets) {
        let element = asset.var;
        if (element instanceof HTMLImageElement ) {
            console.log("img");
            element.addEventListener("load", loaded, false);
        }
        else if ( element instanceof HTMLAudioElement) {
            console.log("audio");
            element.addEventListener("canplaythrough", loaded, false);
        }
        element.src = asset.url;
    }
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function is_colliding(object1, object2) {
    if (object1.x + object1.width - empty.x < object2.x + empty.x ||
        object2.x + object2.width - empty.x < object1.x + empty.x ||
        object1.y + empty.y > object2.y + object2.height - empty.y ||
        object2.y + empty.y > object1.y + object1.height - empty.y) {
            return false;
        } else {
            return true;
        }
}

function stop(outcome) {
    window.cancelAnimationFrame(request);
    window.removeEventListener("keydown", activate);
    window.removeEventListener("keyup", deactivate);
    let body = document.querySelector("body");
    let endCondition = document.createElement("p");
    endCondition.innerHTML = outcome;
    endCondition.id = "endCondition";
    body.appendChild(endCondition);
}