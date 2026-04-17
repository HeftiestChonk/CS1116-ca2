// Tileset is from https://pixel-poem.itch.io/dungeon-assetpuck
// Sprites are from https://zerie.itch.io/tiny-rpg-character-asset-pack

let kills = 0

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

// Defining a player sprite + position + health
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

let playerHealth = 100;

let hBarWidth = 512;
let hBarHeight = 10;
let damage = 512 / playerHealth;

let playerImage = new Image();

let moveLeft = false;
let moveUp = false;
let moveRight = false;
let moveDown = false;
let attack = false;

// Defining enemy sprite lists + images 
let enemies = []

let enemyImage1 = new Image();

let Tenemies = []

let enemyImage2 = new Image();

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
        {"var": enemyImage2, "url": "Free Character Sprites 2 - Fantasy Dreamland/24x24/Char_010.png"}, // EnemyT moving sprite
        {"var": backgroundImage, "url": "Dungeon_Tileset.png"}], draw); // Background tileset
}

// Defining the empty space in the sprites
let empty = {
    x: 6,
    y: 4
};

// Defining the timer //
let subCounter = 0;
let counter = 0;
let body = document.querySelector("body");
let timer = document.createElement("p");
timer.id = "timer";
body.appendChild(timer);

let reset = false

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

    // Player attacks //
    // Regular enemy
    if (attack) {
        for (let enemy of enemies) {
            if(player_attack(player, enemy)) {
                enemy.x = -100
                enemy.y = -100
                enemy.yChange = 0
                enemy.xChange = 0
            }
        }
    }

    // Tracking enemy
    if (attack) {
        for (let enemyT of Tenemies) {
            if(player_attack(player, enemyT)) {
                enemyT.x = -100
                enemyT.y = -100
                enemyT.yChange = 0
                enemyT.xChange = 0
            }
        }
    }


    // Key presses
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

    // Update the player movement
    player.x = player.x + player.xChange;
    player.y = player.y + player.yChange;

    // Draw Enemies //
    // Draw straight line enemy
    if (enemies.length < 5) {
        let enemy = {
            x: randint(30, 492),
            y: randint(30, 290),
            width: 24,
            height: 24,
            frameX: 0,
            frameY: 0,
            xChange: randint(-5, 5),
            yChange: randint(-5, 5),
        };
        enemies.push(enemy);
    }
    // Drawing the sprite of the enemy
    for (let enemy of enemies) {
        context.drawImage(enemyImage1,
            enemy.frameX * enemy.width, enemy.frameY * enemy.height, enemy.width, enemy.height, 
            enemy.x, enemy.y, enemy.width, enemy.height);
    }

    // Enemy movement
    for (let enemy of enemies) {
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
    }

    // Changing the direction the enemy faces
    for (let enemy of enemies){
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
    }
    for (let enemy of enemies) {
    enemy.frameX = (enemy.frameX + 1) % 4;
    }

    // Update the enemy
    for (let enemy of enemies) {
    enemy.x = enemy.x + enemy.xChange;
    enemy.y = enemy.y + enemy.yChange;
    }

    // Draw tracking enemy
    if (Tenemies.length < 5) {
        let enemyT = {
        x: randint(30, 492),
        y: randint(30, 300),
        width: 24,
        height: 24,
        frameX: 0,
        frameY: 0,
        xChange: 0,
        yChange: 0,
        };
        Tenemies.push(enemyT)
    }
    // Tracking enemy sprite
    for (let enemyT of Tenemies) {
        context.drawImage(enemyImage2,
            enemyT.frameX * enemyT.width, enemyT.frameY * enemyT.height, enemyT.width, enemyT.height, 
            enemyT.x, enemyT.y, enemyT.width, enemyT.height);
    }

    // Tracking enemy movement
    for (let enemyT of Tenemies) {
        if (player.x > enemyT.x){
            enemyT.xChange = 1;
        } else if (player.x < enemyT.x){
            enemyT.xChange = -1;
        } else if (player.x === enemyT.x){
            enemyT.xChange = 0
        }
        if (player.y > enemyT.y){
            enemyT.yChange = 1;
        } else if (player.y < enemyT.y){
            enemyT.yChange = -1;
        } else if (player.y === enemyT.y){
            enemyT.yChange = 0
        }
    }

    // Changing the direction the enemy faces
    for (let enemyT of Tenemies) {
        // Left
        if (enemyT.xChange < 0) {
            enemyT.frameY = 1;
        }
        // Right
        if (enemyT.xChange > 0) {
            enemyT.frameY = 2;
        }
        // Up
        if (enemyT.yChange < 0) {
            enemyT.frameY = 3
        }
        // Down
        if (enemyT.yChange > 0) {
            enemyT.frameY = 0
        }
    }
    
    for (let enemyT of Tenemies) {
        enemyT.frameX = (enemyT.frameX + 1) % 4;
    }

    // Update the enemy
    for (let enemyT of Tenemies) {
        enemyT.x = enemyT.x + enemyT.xChange;
        enemyT.y = enemyT.y + enemyT.yChange;
    }

    // Tracking enemy colliding with a wall
    for (let enemyT of Tenemies) {
        if (enemyT.x + enemyT.width >= canvas.width){
            enemyT.x = canvas.width - enemyT.width
        } else if (enemyT.x <= 0){
            enemyT.x = 0
        }
        if (enemyT.y + enemyT.height >= canvas.height){
            enemyT.y = canvas.height - enemyT.height
        } else if (enemyT.y <= 0){
            enemyT.y = 0
        }
    }


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
    if (player.y + player.height >= canvas.height - hBarHeight){
        player.y = canvas.height - hBarHeight - player.height
    } else if (player.y <= 0){
        player.y = 0
    }

    // Player getting hit be the enemy
    if (subCounter / 30 === 0 ) {
        for (let enemy of enemies) {
            if (is_colliding(player, enemy)) {
                playerHealth -= 1;
                hBarWidth -= damage;
            }
        }

        for (let enemyT of Tenemies) {
            if (is_colliding(player, enemyT)) {
                playerHealth -= 1;
                hBarWidth -= damage;
            }
        }
    }

    // Resetting
    if (reset) {
        location.reload()
    }
    
    // Timer //
    subCounter += 1;
    if (subCounter >= 30) {
    subCounter = 0;
    counter ++;
    timer.innerHTML = counter;
    } else if (counter == 60) {
        stop("You win!")
    }
    
    // Player health
    if (playerHealth <= 0) {
        stop("You Lose!!");
    }
    if (playerHealth <= 0) {
        playerHealth = 0
    }
    // Drawing the health bar
    if (playerHealth < 5) {
        context.fillStyle = "red";
    } else {
        context.fillStyle = "green";
    }
    context.fillRect(0, canvas.height - hBarHeight, hBarWidth, hBarHeight)
}
// End of draw function

// Key presses //

// Activating a key
function activate(event) {
    let key = event.key;
    if (event.key === "ArrowLeft" ||
        event.key === "ArrowRight"||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "Shift" ||
        event.key === "r" ||
        event.key === "w" ||
        event.key === "a" ||
        event.key === "s" ||
        event.key === "d") {
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
    } else if (key === "Shift") {
        attack = true
    } else if (key === "r") {
        reset = true
    } else if (key === "a") {
        moveLeft = true;
    } else if (key === "w") {
        moveUp = true;
    } else if (key === "d") {
        moveRight = true;
    } else if (key === "s") {
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
    } else if (key === "Shift") {
        attack = false
    } else if (key === "r") {
        reset = false
    } else if (key === "a") {
        moveLeft = false;
    } else if (key === "w") {
        moveUp = false;
    } else if (key === "d") {
        moveRight = false;
    } else if (key === "s") {
        moveDown = false;
    }
}
// End of keypresses //

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

// Player and enemy collisions
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

// Player attack
function player_attack(object1, object2) {
    let attackRadius = 40
    // Using the center of the sprite instead of the top left
    let centerCircleX = object1.x + (object1.width / 2);
    let centerCircleY = object1.y + (object1.height / 2);
    let closeX = object1.x;
    let closeY = object1.y;
    if (centerCircleX > object2.x + object2.width - empty.x) {
        closeX = object2.x + object2.width
    } else if (centerCircleX < object2.x + empty.x) {
        closeX = object2.x
    }
    if (centerCircleY > object2.y + object2.height - empty.y) {
        closeY = object2.y + object2.height
    } else if (centerCircleY < object2.y + empty.y) {
        closeY = object2.y
    }
    let distX = closeX - centerCircleX;
    let distY = closeY - centerCircleY;
    let distance = Math.sqrt((distX * distX) + (distY * distY));

    if (distance <= attackRadius) {
        kills += 1
        return true;
    }
    // Drawing the circle around the player
    context.beginPath();
    context.arc(player.x + player.width / 2, player.y + player.height / 2, attackRadius, 0, 2*Math.PI);
    context.strokeStyle = "blue";
    context.stroke();
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