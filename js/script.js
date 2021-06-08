'use strict';

const canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      wrapper = document.querySelector('.wrapper');
//Field size
const width = Math.floor(window.innerWidth),
      blockSize = Math.floor(width / 36),
      height = blockSize * 16,
      halfBlockSize = Math.floor(blockSize/2),
      widthField = width - blockSize,
      heightField = height - halfBlockSize,
      widthPlay = blockSize * 25;

let startRoadY = heightField - blockSize*8,
    heightRoad = blockSize,
    widthRoad = widthPlay;

function resize() {
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);

let timerId, timer;
let countIntervalSec = 0;
let countWave = 0;
const endGame = {
    x: 24*blockSize + halfBlockSize,
    y: 7*blockSize + halfBlockSize
}
let wave = [
   {
        assasin: 7,
        knight: 0,
        dragon: 0,
        genie: 0
   }, {
        assasin: 5,
        knight: 7,
        dragon: 0,
        genie: 0
   }, {
        assasin: 2,
        knight: 2,
        dragon: 3,
        genie: 0
   }, {
        assasin: 2,
        knight: 2,
        dragon: 3,
        genie: 0
    }, {
        assasin: 2,
        knight: 0,
        dragon: 0,
        genie: 6
   }, {
        assasin: 2,
        knight: 2,
        dragon: 3,
        genie: 6
    }
];
let playerName = 'Larisa';
let msg = 'save the kingdom!';
let g = new Image(); //ground
    g.src = 'Sprites/grass_tile_2.png';
 let   r = new Image(); //road
    r.src = 'Sprites/sand_tile.png';
 let   o = new Image(); //obstacle
    o.src = 'img/48.png';
 let   f = new Image(); //obstacle
    f.src = 'Sprites/grass_tile_1.png';
const map = [
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o],
    [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o,o,o,o,o,o,o],
    [g,g,g,g,g,g,g,g,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o],
    [g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,o,o],
    [g,g,g,g,g,g,g,r,o,o,o,o,o,o,g,o,o,g,r,g,g,g,g,o,o],
    [g,g,g,g,g,g,o,r,r,r,r,o,g,g,g,o,g,g,r,o,g,g,g,o,o],
    [g,g,g,o,o,o,o,o,g,g,r,o,g,g,g,o,o,o,r,o,g,g,g,o,o],
    [r,r,r,r,r,r,r,r,r,r,r,o,g,g,g,g,g,g,r,o,o,r,r,r,r],
    [o,o,o,o,o,o,o,o,o,o,o,o,g,g,g,g,g,g,r,o,o,r,g,o,o],
    [o,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,o,g,r,g,o,o],
    [o,g,g,g,g,g,g,g,g,g,g,g,g,g,r,o,o,o,o,o,g,r,g,o,o],
    [o,g,g,g,g,g,g,g,g,g,g,g,g,g,r,g,g,g,o,o,o,r,g,o,o],
    [o,g,g,g,g,g,g,g,g,g,g,g,g,g,r,r,r,r,r,r,r,r,g,o,o],
    [o,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o],
    [o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o]
]

function drawMap() {
    let countRowTile = 25,
        countColumnTile  = 15;
    for (let i = 0; i < countColumnTile ; i++) {
        for (let j = 0; j < countRowTile; j++) {
            let tile = map[i][j];
            ctx.drawImage(tile, halfBlockSize + blockSize * j, halfBlockSize + blockSize * i, blockSize, blockSize);
        }
    }
}

function drawField() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};
//Border
function drawBorder() {
    ctx.fillStyle = 'Black';
    ctx.fillRect(0, 0, width, halfBlockSize);
    ctx.fillRect(0, heightField, width, halfBlockSize);
    ctx.fillRect(0, 0, halfBlockSize, height);
    ctx.fillRect(width - halfBlockSize, 0, halfBlockSize, height);
} 

function drawGrid () {
    for (let x = halfBlockSize; x < widthPlay - blockSize; x += blockSize) {
        ctx.moveTo(x, halfBlockSize);
        ctx.lineTo(x, heightField);
      }
      for (let y = halfBlockSize; y < heightField; y += blockSize) {
        ctx.moveTo(halfBlockSize, y);
        ctx.lineTo(widthPlay - 1.5*blockSize, y);
      }
      ctx.strokeStyle = "#03a003";
      ctx.stroke();
}

//Road
const endGameImg = new Image();
endGameImg.src = 'img/flag.svg';

function drawRoad () {
    ctx.drawImage(endGameImg, endGame.x - halfBlockSize, endGame.y - blockSize, blockSize*1.5, blockSize*1.5);
}

//GUI 
const imgLives = new Image();
    imgLives.src = 'img/heart.svg';
    const imgGold = new Image();
    imgGold.src = 'img/chest.svg';
    const imgEnemy = new Image();
    imgEnemy.src = 'img/swords.svg';
    const imgTower = new Image();
    imgTower.src = 'img/tower.svg';
    const imgCatapult = new Image();
    imgCatapult.src = 'img/catapult.svg';
    const imgMagic = new Image();
    imgMagic.src = 'img/magic.svg';
    const imgPlay = new Image();
    imgPlay.src = 'img/play.svg';
    const imgPause = new Image();
    imgPause.src = 'img/pause.svg';

let imgPlayer = new Image();
    imgPlayer.src = 'img/princess.svg';

const towerSize = blockSize,
    paramSize = blockSize,
    playerSize = blockSize*2,
    paramXFirst = widthPlay + blockSize,
    paramXSecond = widthPlay + blockSize*4,
    paramXThird = widthPlay + blockSize*7,
    paramYFirst = blockSize,
    paramYTower = blockSize*7,
    paramYCatapult = blockSize*9,
    paramYMagic = blockSize*11,
    paramYPlayer = blockSize*3,
    paramXBorder = paramXFirst + playerSize*0.9,
    paramWidthBorder = playerSize*3.7;
let lives = 3; 
function countWaves() {

}
// let (countEnemies) = function () {
//     return (wave.length - countWave)
// }
let playerGold = 200;

function drawGUI () {
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(widthPlay + halfBlockSize, halfBlockSize, width - (widthPlay + blockSize), height - blockSize);
    ctx.drawImage(imgPause, paramXThird, paramYMagic + blockSize*2, towerSize, towerSize);//Settings
    drawTowerGUI()
    drawParams()
    drawPlayer()
} 
function drawTowerGUI() {
    ctx.fillStyle = '#000'
    ctx.font = `${blockSize*0.8}px Mate SC`;
    ctx.drawImage(imgTower, paramXFirst, paramYTower, towerSize, towerSize);
    ctx.fillText('Archers tower', paramXFirst + paramSize * 2, paramYTower + paramSize / 1.2);
    ctx.drawImage(imgCatapult, paramXFirst, paramYCatapult, towerSize, towerSize);
    ctx.fillText('Catapult', paramXFirst + paramSize * 2, paramYCatapult + paramSize / 1.2);
    ctx.drawImage(imgMagic, paramXFirst, paramYMagic, towerSize, towerSize);
    ctx.fillText('Magic tower', paramXFirst + paramSize * 2, paramYMagic + paramSize / 1.2);
}
function showTowerParams(i, name) {
    ctx.fillStyle = '#ffff00'
    ctx.font = `bold ${blockSize*0.6}px Mate SC`;
    ctx.strokeRect(paramXFirst - blockSize*0.2, name - blockSize*0.2, towerSize + blockSize*0.4, towerSize + blockSize*0.4)
    ctx.fillRect(paramXFirst + paramSize * 1.4, name - blockSize, blockSize*8, paramSize*3);
    ctx.strokeRect(paramXBorder, name - blockSize*0.8, paramWidthBorder, paramSize*2.8)
    ctx.fillStyle = '#530300'
    ctx.fillText(`attack: ${towers[i].attack}`, paramXFirst + paramSize * 2, name);
    ctx.fillText(`range: ${towers[i].range}`, paramXFirst + paramSize * 2, name + paramSize*0.8); 
    ctx.fillText(`rate: ${towers[i].rate}`, paramXFirst + paramSize * 2, name + paramSize*1.6);
    ctx.fillText(`cost: ${towers[i].cost}`, paramXFirst + paramSize * 6, name + paramSize*0.8);
}
function drawParams() {
    ctx.fillStyle = '#000'
    ctx.font = `${blockSize}px Mate SC`;
    ctx.drawImage(imgLives, paramXFirst, paramYFirst, paramSize, paramSize );
    ctx.drawImage(imgEnemy, paramXSecond, paramYFirst, paramSize, paramSize); 
    ctx.drawImage(imgGold, paramXThird, paramYFirst, paramSize, paramSize);
    ctx.fillText(lives, paramXFirst + paramSize * 1.2, paramYFirst + paramSize / 1.2);
    ctx.fillText((wave.length - countWave), paramXSecond + paramSize * 1.2, paramYFirst + paramSize / 1.2);
    ctx.fillText(playerGold, paramXThird + paramSize * 1.3, paramYFirst + paramSize / 1.2);
}
function drawPlayer() {
    ctx.font = `${blockSize*0.8}px Mate SC`
    ctx.drawImage(imgPlayer, paramXFirst-blockSize*0.2, paramYPlayer, blockSize*1.5, blockSize*1.5); 
    ctx.strokeStyle = "#03a003";
    // ctx.strokeRect(paramXBorder, paramYPlayer, paramWidthBorder, playerSize*1.3);
    ctx.fillText(`${playerName},`, paramXFirst + playerSize, paramYPlayer + blockSize);
}
function showMessage(msg) {
    ctx.fillStyle = '#ffff00';
    ctx.font = "Mate SC";
    ctx.fillRect(paramXFirst + playerSize*1.01, paramYPlayer + blockSize*1.2, blockSize*6.9, blockSize)
    ctx.fillStyle = '#000';
    ctx.fillText(msg, paramXFirst + playerSize, paramYPlayer + blockSize*2)
}
let tX, tY;
let towerInd;
let clickCount = 0;

function drawSettingsField() {
    ctx.fillStyle = '#edf585';
    ctx.font = "40px Mate SC";
    ctx.fillRect(widthPlay + halfBlockSize, halfBlockSize, width - (widthPlay + blockSize), height - blockSize);
    drawBorder()
    ctx.fillText('Click start', paramXFirst, paramYFirst + blockSize*2);
    ctx.drawImage(imgPlay, paramXSecond, paramYTower + blockSize*4, towerSize, towerSize);
    canvas.addEventListener('click', e => {
        if(e.offsetX < paramXSecond + towerSize && e.offsetX > paramXSecond && e.offsetY < paramYTower + blockSize*4 + towerSize && e.offsetY > paramYTower + blockSize*4) {
        start();
    } else {
        drawSettingsField()
    }}, {once: true})
}
function getEvent() {
    canvas.addEventListener('mousemove', e => {
        if( e.offsetX < paramXFirst + towerSize*8 && e.offsetX > paramXFirst && (e.offsetY > paramYTower && e.offsetY < paramYTower + towerSize ||  e.offsetY > paramYCatapult && e.offsetY < paramYCatapult + towerSize || e.offsetY > paramYMagic && e.offsetY < paramYMagic + towerSize )) {
            canvas.style.cursor = 'pointer';
        } else {
            canvas.style.cursor = 'default'
        }
    });
    canvas.addEventListener("click", e => {
        if( e.offsetX < paramXFirst + towerSize && e.offsetX > paramXFirst && e.offsetY < paramYMagic + blockSize*2 + towerSize && e.offsetY > paramYMagic + blockSize*2) {
            stop(); 
            drawSettingsField();
    // ctx.drawImage(imgPlay, paramXSecond, paramYTower + blockSize*4, towerSize, towerSize);
    //         canvas.addEventListener('click', e => {
    //             if(e.offsetX < paramXSecond + towerSize && e.offsetX > paramXSecond && e.offsetY < paramYTower + blockSize*4 + towerSize && e.offsetY > paramYTower + blockSize*4) {
    //             start();
    //         } }, {once:true})

        } else if( e.offsetX < paramXFirst + towerSize*8 && e.offsetX > paramXFirst && (e.offsetY > paramYTower && e.offsetY < paramYTower + towerSize ||  e.offsetY > paramYCatapult && e.offsetY < paramYCatapult + towerSize || e.offsetY > paramYMagic && e.offsetY < paramYMagic + towerSize)) {
            msg = 'select location';
            stop();
            if(e.offsetY > paramYTower && e.offsetY < paramYTower + towerSize) {
                showTowerParams(0, paramYTower)
                towerInd = 0
            } else if( e.offsetY > paramYCatapult && e.offsetY < paramYCatapult + towerSize) { 
                showTowerParams(1, paramYCatapult)
                towerInd = 1
            } else if(e.offsetY > paramYMagic && e.offsetY < paramYMagic + towerSize) {
                showTowerParams(2, paramYMagic)
                towerInd = 2
            }
            canvas.addEventListener('click', putTower, {once:true})
            msg = 'choose a tower'
        } else {
            getEvent();
        }
      }, {once: true});
}
function putTower(e) {
    if(e.offsetX < widthPlay - 1.5*blockSize && e.offsetX > halfBlockSize && e.offsetY > halfBlockSize && e.offsetY < heightField) {
        let corX = e.offsetX - ((e.offsetX - halfBlockSize) % blockSize) //find start of tile
        let corY = e.offsetY - ((e.offsetY - halfBlockSize) % blockSize)
        let arrX = (corX - halfBlockSize) / blockSize //find cell's number in map array
        let arrY = (corY - halfBlockSize) / blockSize
        let result
        for (let i = 0; i < createdTowers.length || result; i++) {  // check if another tower has same coordinates
            createdTowers[i].x == corX && createdTowers[i].y == corY 
            ? result = true : result = false}
        if (map[arrY][arrX] == g && !result) {
            if (playerGold >= towers[towerInd].cost) {
                SelectTower(towerInd, corX, corY);
            } else {
                msg = "not enough gold"
            }
        } else {
            msg = "can't build here"
        }
        start()
    } else {
        start()
    }
}
function SelectTower(i, x, y) {
    let circle = new Path2D();
    circle.arc(x + halfBlockSize, y + halfBlockSize, towers[i].range, 0, Math.PI * 2)
    let projectile = new Image();
    projectile.src = 'img/minerals.svg';
    createdTowers.push(new Tower(towers[i].name, towers[i].img, towers[i].attack, towers[i].rate, towers[i].range, towers[i].cost, towers[i].slowDown, x, y, circle, projectile))
    playerGold -= towers[i].cost
}

let enemies = [];
let towers = [];
let left = {x: -1, y: 0};
let right = {x: Math.floor(1), y: 0};
let up = {x: 0, y: -1};
let down = {x: 0, y: 1};

//Enemies
class Enemy {
    constructor(image, speed, hp, armor, bounty ) {
        this.x = halfBlockSize,
        this.y = startRoadY,
        this.image = new Image(),
        this.image.src = image,
        this.width = blockSize,
        this.height = blockSize,
        this.slowDown = 1,
        this.speed = speed,
        this.hp = hp,
        this.armor = armor,
        this.bounty = bounty,
        this.direction = right
    }
    Move() {
        for (let counter = 0; counter < this.speed * this.slowDown; counter ++){
            let mapX = Math.floor((this.x - ((this.x - halfBlockSize)) % blockSize) / blockSize) //find cell's number in map array
            let mapXRemainder =  ((this.x - halfBlockSize) % blockSize);
            let mapY = Math.floor((this.y - ((this.y - halfBlockSize)) % blockSize) / blockSize)
            let mapYRemainder =  ((this.y - halfBlockSize) % blockSize);
            if(this.direction == right && map[mapY][mapX + 1] != r) {
                if (map[mapY - 1][mapX] != r) {
                    this.direction = down
                } else {
                    this.direction = up
                } 
            }
                if(this.direction == left && mapXRemainder == 0 && map[mapY][mapX - 1] != r  ) {
                    if (map[mapY - 1][mapX] != r) {
                        this.direction = down
                    } else {
                        this.direction = up
                    } 
                }
                if(this.direction == up &&mapYRemainder == 0 && map[mapY - 1][mapX] != r  ) {
                    if (map[mapY][mapX - 1] != r) {
                        this.direction = right
                    } else {
                        this.direction = left
                    }
                }
                if(this.direction == down && map[mapY + 1][mapX] != r ) {
                    if (map[mapY][mapX - 1] != r) {
                        this.direction = right
                    } else {
                        this.direction = left
                    } 
                }
                this.x += this.direction.x
                this.y += this.direction.y
    }}
    Update() {
        if (this.hp <= 0) {
            createdEnemies.splice(createdEnemies.indexOf(this), 1)
            playerGold +=this.bounty
        }
        if (this.x + this.width - halfBlockSize >= endGame.x) {
            msg = 'game over!'
            stop();
        };
    }
    Draw() {
        if (this.hp > 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
    }
    GetDamage(damage) {
        this.hp -= (damage * (1 - this.armor)) 
        if (this.hp <= 0) {
            this.hp = 0
        }
    }
}
enemies = [
    {   
        name: 'assasin',
        speed: blockSize / 30,
        hp: 350,
        armor: 0,
        bounty: 10
    },
    {
        name: 'knight',
        speed: blockSize / 40,
        hp: 500,
        armor: 0.1,
        bounty: 15
    },
    {
        name: 'dragon',
        speed: blockSize / 50,
        hp: 1000,
        armor: 0.4,
        bounty: 30
    },
    {
        name: 'genie',
        speed: blockSize / 15,
        hp: 400,
        armor: 0.2,
        bounty: 40
    }
]

let count = 0
let countAssasin = 0;
let countKnight = 0;
let countDragon = 0;
let countGenie = 0;
let createdEnemies = [];
let nextWaveFlag = false;
function getWave(i) {
    if (countAssasin == wave[i].assasin && countKnight == wave[i].knight && countDragon == wave[i].dragon && countGenie == wave[i].genie){
        if (!nextWaveFlag){
        nextWaveFlag = true;
        setTimeout(() => {
            countAssasin = 0;
            countKnight = 0;
            countDragon = 0;
            countGenie = 0;
            countWave++;
            nextWaveFlag = false;    
        }, 3000);
        }
    }
        else if ( countAssasin == wave[i].assasin && countKnight == wave[i].knight && countDragon == wave[i].dragon && countGenie < wave[i].genie ) {
        createEnemies(3, 'genie');
    } else if (countAssasin == wave[i].assasin && countKnight == wave[i].knight && countDragon < wave[i].dragon) {
        createEnemies(2, 'dragon');
    } else if (countAssasin == wave[i].assasin && countKnight < wave[i].knight) {
        createEnemies(1, 'knight')
    } else if (countAssasin < wave[i].assasin) {
        createEnemies(0, 'assasin');
    }
}

function createEnemies(i, enemy) {
    createdEnemies.push(new Enemy(`img/${enemy}.svg`, enemies[i].speed, enemies[i].hp, enemies[i].armor, enemies[i].bounty))
    switch(enemy) {
        case 'assasin' : countAssasin++
        break;
        case 'knight' : countKnight++
        break;
        case 'dragon' : countDragon++
        break;
        case 'genie' : countGenie++
        break;
    }
}

function drawEnemies() {
    if(createdEnemies) {
        createdEnemies.forEach((item) => {
            item.Update();
            item.Move();
            item.Draw();
        })
    }
}

//Tower
class Tower {
    constructor(name, image, attack, rate, range, cost, slowDown, x, y, circle, projectile) {
        this.name = name
        this.image = new Image(),
        this.image.src = image,
        this.attack = attack,
        this.rate = rate,
        this.range = range,
        this.cost = cost,
        this.slowDown = slowDown,
        this.x = x, 
        this.y = y,
        this.circle = circle, //visible range
        this.projectile = projectile,
        this.projectileX = this.x + blockSize/4, //tower center
        this.projectileY = this.y + blockSize/4,
        this.flightX = 0, //distance of one shot
        this.flightY = 0,
        this.counter = 0, //shot counter
        this.currentEnemy = 0 //attacked enemy
    }
    Draw(x, y) {
        ctx.drawImage(this.image, x, y, blockSize, blockSize);
        ctx.stroke(this.circle)
    }
    Update() {if (this.currentEnemy) {
            this.ShootProjectile(this.name)
        } else {
            this.FindEnemy()
        }
    }
    FindEnemy() {
        this.currentEnemy = createdEnemies.find((item) => ctx.isPointInPath(this.circle, item.x, item.y))
        if (this.currentEnemy) {
            if (this.currentEnemy) {
                let diffX = this.currentEnemy.x + halfBlockSize - this.x  //find distance to enemy
                let diffY = this.currentEnemy.y + halfBlockSize - this.y
                this.flightX = Math.floor(diffX / this.rate) //get distance of one shot
                this.flightY = Math.floor(diffY / this.rate)
            }
        }
    }
    SetInitialParams() {
        this.projectileX = this.x + blockSize/4
        this.projectileY = this.y + blockSize/4
        this.flightX = 0
        this.flightY = 0
        this.counter = 0
        this.currentEnemy = 0
    }
    ShootProjectile(name) {
        switch (name) {
            case 'archers':
                if (this.counter < this.rate) {
                    this.projectileX += this.flightX //get direction for projetile
                    this.projectileY += this.flightY
                    ctx.drawImage(this.projectile, this.projectileX, this.projectileY, halfBlockSize, halfBlockSize)
                    this.counter ++
                } else {
                this.currentEnemy.GetDamage(this.attack)
                this.SetInitialParams()
                }
            break
            case 'catapult': 
                if (this.counter < this.rate) {
                    this.projectileX += this.flightX //get direction for projetile
                    this.projectileY += this.flightY
                    ctx.drawImage(this.projectile, this.projectileX, this.projectileY, halfBlockSize, halfBlockSize)
                    this.counter ++
                } else {
                    let splashX = this.projectileX - blockSize*2 //start of splash
                    let splashY = this.projectileY - blockSize*2 
                    for (let i = 0; i < createdEnemies.length; i++) { 
                        (createdEnemies[i].x <= splashX + blockSize*4 && createdEnemies[i].x >= splashX - blockSize 
                        && createdEnemies[i].y <= splashY + blockSize*4 && createdEnemies[i].y >= splashY - blockSize) 
                        && createdEnemies[i].GetDamage(this.attack) //get damage if enemy is in this area
                    }
                    this.SetInitialParams()
                }
            break
            case 'magic':
                for (let i = 0; i < createdEnemies.length; i++) { //area magic attack (slowDown)
                    ctx.isPointInPath(this.circle, createdEnemies[i].x, createdEnemies[i].y) 
                    ? createdEnemies[i].slowDown = this.slowDown
                    : createdEnemies[i].slowDown = 1
                } 
                if (this.counter < this.rate) {
                    this.projectileX += this.flightX //get direction for projetile
                    this.projectileY += this.flightY
                    ctx.drawImage(this.projectile, this.projectileX, this.projectileY, halfBlockSize, halfBlockSize)
                    this.counter ++
                } else {
                    this.currentEnemy.GetDamage(this.attack)
                    console.log(this.currentEnemy.hp)
                    this.SetInitialParams()
                }
            break
        }
    }
}

towers = [
    {   
        name: 'archers',
        img: 'img/tower.svg',
        attack: 15,
        rate: 10,
        range: blockSize*3,
        cost: 70,
        slowDown: 1
    },
    {
        name: 'catapult',
        img: 'img/catapult.svg',
        attack: 60,
        rate: 30,
        range: blockSize*3,
        cost: 90,
        slowDown: 1
    },
    {
        name: 'magic',
        img: 'img/magic.svg',
        attack: 10,
        rate: 15,
        range: blockSize*2.5,
        cost: 80,
        slowDown: 0.8
    }
]
let createdTowers = [];

function drawTowers () {
    createdTowers.forEach((tower) => {
        tower.Draw(tower.x, tower.y);
        tower.Update();
    })
}

//Functions
function draw() {
    drawField();
    drawMap()
    drawTowers();
    drawBorder();
    drawRoad();
    drawGUI();
    drawEnemies();
    showMessage(msg)
}
let idReqAnimFrame ;

function start() {
    // console.log('start')
    ctx.clearRect(blockSize, startRoadY-blockSize, widthRoad, heightRoad+blockSize);
    draw();
    if(countIntervalSec == 60) {
        getWave(countWave)
        countIntervalSec = 0
    }
    // console.log(countWave, countEnemies)
    countIntervalSec++
    getEvent()
    idReqAnimFrame =  window.requestAnimationFrame(start)
    
    // timerId = setInterval(start, 1000/30);
}
function stop() {
    // clearInterval(timerId);
    showMessage(msg)
    // console.log('stop')
    cancelAnimationFrame(idReqAnimFrame)
}

resize();
window.onload = window.requestAnimationFrame(start);
// window.onload = start();
