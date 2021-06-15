// 'use strict';


const firstSlide = document.querySelector('.main');
const game = document.querySelector('#game');
const btnStartGame = document.querySelector('#btn__start');


btnStartGame.addEventListener('click', start);


let stopGame;


const canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      wrapper = document.querySelector('.wrapper');




//Field size
const width = 825,
      blockSize = Math.floor(width / 25),
      height = blockSize * 16,
      halfBlockSize = Math.floor(blockSize/2),
      widthField = blockSize * 25;

canvas.width = width
canvas.height = height


let timerId, timer;
let countIntervalSec = 0;
let level = 0;
let countWave = 0;
const endGame = {
    x: 24*blockSize - halfBlockSize,
    y: 6*blockSize + halfBlockSize
}
let wave = [[
   {
        assasin: 2,
        knight: 0,
        dragon: 0,
        genie: 0
   }, {
        assasin: 0,
        knight: 1,
        dragon: 1,
        genie: 0
   }, {
        assasin: 0,
        knight: 0,
        dragon: 0,
        genie: 2}
//    }, {
//         assasin: 2,
//         knight: 2,
//         dragon: 3,
//         genie: 0
//     }, {
//         assasin: 2,
//         knight: 0,
//         dragon: 0,
//         genie: 6
//    }, {
//         assasin: 2,
//         knight: 2,
//         dragon: 3,
//         genie: 6
//     }
], [
    {   
        assasin: 1,
        knight: 0,
        dragon: 1,
        genie: 1
    }, {
        assasin: 1,
        knight: 0,
        dragon: 1,
        genie: 1
    }, {  
        assasin: 1,
        knight: 0,
        dragon: 1,
        genie: 1
    }]
];
let msg = 'save the kingdom!';
let g = new Image(); //ground
    g.src = 'Sprites/grass_tile_2.png';
 let   r = new Image(); //road
    r.src = 'Sprites/sand_tile.png';
 let   o = new Image(); //obstacle
    o.src = 'img/48.png';
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
    [o,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o],
    [o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o]
]

function drawMap() {
    let countRowTile = 25,
        countColumnTile  = 16;
    for (let i = 0; i < countColumnTile ; i++) {
        for (let j = 0; j < countRowTile; j++) {
            let tile = map[i][j];
            ctx.drawImage(tile, blockSize * j, blockSize * i, blockSize, blockSize);
        }
    }
}

function drawField() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, widthField, height);
};

//Road
const endGameImg = new Image();
endGameImg.src = 'img/flag.svg';

function drawFlag () {
    ctx.drawImage(endGameImg, endGame.x, endGame.y, blockSize*1.5, blockSize*1.5);
}

let playerLives = 3; 
let playerGold = 250;

let tX, tY;
let towerInd;
let clickCount = 0;


let enemies = [];
let towers = [];
let left = {x: -1, y: 0};
let right = {x: 1, y: 0};
let up = {x: 0, y: -1};
let down = {x: 0, y: 1};

//Enemies
class Enemy {
    constructor(image, speed, hp, armor, bounty ) {
        this.x = 0,
        this.y = blockSize*7,
        this.image = new Image(),
        this.image.src = image,
        this.width = blockSize,
        this.height = blockSize,
        this.slowDown = 1,
        this.speed = speed,
        this.hp = hp,
        this.currentHP = hp,
        this.armor = armor,
        this.bounty = bounty,
        this.direction = right
    }
    Move() {
        for (let counter = 0; counter < this.speed * this.slowDown; counter += 3){
            let mapX = Math.floor(this.x  / blockSize); //find cell's number in map array
            let mapXRemainder =  (this.x  % blockSize);

            let mapY = Math.floor(this.y / blockSize);
            let mapYRemainder =  (this.y  % blockSize);

            if(this.direction == right && map[mapY][mapX + 1] != r) { //if next tile != road, change direction
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
        if (this.currentHP <= 0) {
            createdEnemies.splice(createdEnemies.indexOf(this), 1)
            playerGold +=this.bounty
        }
        if (this.x + this.width - halfBlockSize >= endGame.x) {
            msg = 'game over!';
            stop();
        };
    }
    Draw() {
        if (this.currentHP > 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height) //draw enemy

            ctx.fillStyle = '#000000';
            ctx.fillRect(this.x, this.y - this.height/3, this.width + 2, this.height/5) //draw HP
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.x+1, this.y - this.height/3+1, this.width * this.currentHP / this.hp, this.height/5-2)
        }
    }
    GetDamage(damage) {
        this.currentHP -= (damage * (1 - this.armor)) 
        if (this.currentHP <= 0) {
            this.currentHP = 0
        }
    }
}
enemies = [
    {   
        name: 'assasin',
        img: 'img/assasin.svg',
        speed: blockSize / 12,
        hp: 350,
        armor: 0,
        bounty: 10
    },
    {
        name: 'knight',
        img: 'img/knight.svg',
        speed: blockSize / 12,
        hp: 500,
        armor: 0.1,
        bounty: 15
    },
    {
        name: 'dragon',
        img: 'img/dragon.svg',
        speed: blockSize / 14,
        hp: 1000,
        armor: 0.4,
        bounty: 30
    },
    {
        name: 'genie',
        img: 'img/genie.svg',
        speed: blockSize / 6,
        hp: 400,
        armor: 0.2,
        bounty: 40
    }
]

let createdEnemies = [];
let nextWaveFlag = false;
let wavesAreOver;


function getWave(lvl, i) {
    if (countWave + 1 == wave[lvl].length && !wave[lvl][i].assasin && !wave[lvl][i].knight && !wave[lvl][i].dragon && !wave[lvl][i].genie) {
        wavesAreOver = true
                console.log(createdEnemies, wavesAreOver, msg)
    }
    else if (!wave[lvl][i].assasin && !wave[lvl][i].knight && !wave[lvl][i].dragon && !wave[lvl][i].genie) { //get next wave
        if (!nextWaveFlag){
        nextWaveFlag = true;
        setTimeout(() => {
            countWave++;
            nextWaveFlag = false;   
        }, 3000);
        }
    } else if (!wave[lvl][i].assasin && !wave[lvl][i].knight && !wave[lvl][i].dragon && wave[lvl][i].genie ) { //render enemy
        createEnemies(3, 'genie', wave[lvl][i]);
    } else if (!wave[lvl][i].assasin && !wave[lvl][i].knight && wave[lvl][i].dragon) {
        createEnemies(2, 'dragon', wave[lvl][i]);
    } else if (!wave[lvl][i].assasin && wave[lvl][i].knight) {
        createEnemies(1, 'knight', wave[lvl][i])
    } else if (wave[lvl][i].assasin) {
        createEnemies(0, 'assasin', wave[lvl][i]);
    }
}

function createEnemies(i, enemy, wave) {
    createdEnemies.push(new Enemy(enemies[i].img, enemies[i].speed, enemies[i].hp, enemies[i].armor, enemies[i].bounty))
    switch(enemy) {
        case 'assasin' : wave.assasin--
        break;
        case 'knight' : wave.knight--
        break;
        case 'dragon' : wave.dragon--
        break;
        case 'genie' : wave.genie--
        break;
    }
}

function drawEnemies() {
    if(createdEnemies.length > 0) {
        for (let i = 0; i < createdEnemies.length; i++){
            createdEnemies[i].Move()
            createdEnemies[i].Draw()
            createdEnemies[i].Update()
        }
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
        this.projectile = new Image(),
        this.projectile.src = projectile,
        this.projectileX = this.x + blockSize/4, //tower center
        this.projectileY = this.y + blockSize/4,
        this.flightX = 0, //distance of one shot
        this.flightY = 0,
        this.counter = 0, //shot counter
        this.currentEnemy = 0 //attacked enemy
    }
    Draw() {
        ctx.drawImage(this.image, this.x, this.y, blockSize, blockSize);
        // ctx.stroke(this.circle)
    }
    Update() {
        if (this.currentEnemy) {
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
            case 'archers tower':
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
            case 'magic tower':
                let aura = new Image();
                    aura.src = 'img/smoke.svg';
                    ctx.drawImage(aura, this.x, this.y - blockSize/2, blockSize, blockSize)
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
                    this.SetInitialParams()
                }
            break
        }
    }
}


towers = [
    {   
        name: 'archers tower',
        img: 'img/tower.svg',
        attack: 25,
        rate: 10,
        range: blockSize*3,
        cost: 70,
        slowDown: 1,
        projectile: 'img/arrow.svg'
    },
    {
        name: 'catapult',
        img: 'img/catapult.svg',
        attack: 60,
        rate: 30,
        range: blockSize*3,
        cost: 90,
        slowDown: 1,
        projectile: 'img/circle.svg'
    },
    {
        name: 'magic tower',
        img: 'img/magic.svg',
        attack: 10,
        rate: 15,
        range: blockSize*3,
        cost: 80,
        slowDown: 0.6,
        projectile: 'img/star.svg'
    }
]
let createdTowers = [];

function drawTowers () {
    for (let i = 0; i < createdTowers.length; i ++) {
        createdTowers[i].Draw()
        createdTowers[i].Update()
    }
}

function checkLvlIsComplete () {
    if (wavesAreOver && createdEnemies.length == 0) {
        console.log('win')
        msg = 'you win!';
        stop()
    }
}

//Functions
function draw() {
    drawMap()
    drawTowers();
    drawFlag();
    drawEnemies();
    writeGuiParams()
    createMsgField()
}
let idReqAnimFrame ;

function start() {
    firstSlide.classList.add('hide')
    game.classList.remove('hide')
    game.classList.add('show')
        writeGuiParams()

    if (!stopGame) {
        ctx.clearRect(0, 0, width, height);
        draw();
        if(countIntervalSec == 90 && !wavesAreOver) {
            getWave(level, countWave)
            countIntervalSec = 0
        } else if (wavesAreOver) {
            checkLvlIsComplete()
        }
        countIntervalSec++
        idReqAnimFrame = window.requestAnimationFrame(start)
    } else {
        window.cancelAnimationFrame(idReqAnimFrame)
        stopGame = false
    }
    
}
function stop() {
    stopGame = true
 
}

// resize();
// window.onload = window.requestAnimationFrame(start);
// window.onload = start();
// window.requestAnimationFrame(start)

//Create field Towers on GUI

const guiTowers = document.querySelector('.towers');
let selectedTower;

function drawGuiTowers() {
    for (let i = 0; i < towers.length; i++) { //create buttons on GUI
        let item = document.createElement('button');
        item.classList.add('gui__item', 'show')
        item.id = i


        let itemImg = document.createElement('img');
        itemImg.src = towers[i].img
        itemImg.width = blockSize
        itemImg.classList.add('img__icon');


        let descr = document.createElement('div'); //description 
        descr.classList.add('gui__descr')

        let descrAttack = document.createElement('div');
        descrAttack.textContent = 'attack '
        descrAttack.append(towers[i].attack)
        let descrRate = document.createElement('div');
        descrRate.textContent = 'delay '
        descrRate.append(towers[i].rate)
        let descrSlowDown = document.createElement('div');
        descrSlowDown.textContent = 'slowDown '
        descrSlowDown.append(((1 - towers[i].slowDown)*100) +'%')


        let cost = document.createElement('div') //cost 
        cost.classList.add('show');
        let costImg = document.createElement('img')
        costImg.classList.add('img__icon')
        costImg.width = blockSize
        costImg.src = 'img/money-bag.svg'
        let costDescr = document.createElement('span');
        costDescr.textContent = towers[i].cost

        descr.append(descrAttack, descrRate, descrSlowDown)
        cost.append(costImg, costDescr)
        item.append(itemImg, descr, cost)
        guiTowers.append(item)

       
    }
}
drawGuiTowers()


function clickToBuildTower() {
    guiTowers.addEventListener('click', (e) => {
        let btn = e.target.closest('button');
        if (!btn) return;
        if (!stopGame) {
            msg = 'select location'
        stop()
        canvas.addEventListener('click', (e) => {
            if(e.offsetX < width&& e.offsetX > 0 && e.offsetY < height && e.offsetY > 0) {
                putTower(e, btn.id)
            } else clickToBuildTower()
        }, {once:true})
        }
    })
}
clickToBuildTower()

function putTower(e, id) {
    let corX = e.offsetX  - (e.offsetX % blockSize) //find start of tile
    let corY = e.offsetY - (e.offsetY % blockSize)
    let arrX = corX / blockSize //find cell's number in map array
    let arrY = corY / blockSize
    let result = false
    for (let i = 0; i < createdTowers.length; i++) { // check if another tower has same coordinates
        createdTowers[i].x == corX && createdTowers[i].y == corY 
        ? result = true : result = false}
    if (map[arrY][arrX] == g && !result) {
        if (playerGold >= towers[id].cost) {
            SelectTower(id, corX, corY);
        } else {
            msg = "not enough gold"
        }
    } else {
        msg = "can't build here"
    }
    start()
}

function SelectTower(i, x, y) {
    console.log(i)
    let circle = new Path2D(); //tower.range
    circle.arc(x + halfBlockSize, y + halfBlockSize, towers[i].range, 0, Math.PI * 2)

    createdTowers.push(new Tower(towers[i].name, towers[i].img, towers[i].attack, towers[i].rate, towers[i].range, towers[i].cost, towers[i].slowDown, x, y, circle, towers[i].projectile))

    playerGold -= towers[i].cost
    msg = "save the kingdom"
}


//Create field Parameters on GUI

const guiParams = document.querySelector('.gui__params');

function getGuiParams(src, name) {
    let item = document.createElement('div')
    let itemDescr = document.createElement('div')
    itemDescr.classList.add(name)
    let itemImg = document.createElement('img')
    itemImg.src = src
    itemImg.width = blockSize
    
    item.append(itemImg, itemDescr)

    return item
}
function drawGuiParams(playerLives, countWave, playerGold) {
    guiParams.append(
        getGuiParams('img/heart.svg', 'lives', playerLives),
        getGuiParams('img/swords.svg', 'waves', `${countWave}/${wave[level].length}`),
        getGuiParams('img/chest.svg', 'gold', playerGold),
        )
}

drawGuiParams(playerLives, countWave, playerGold.textContent)

function writeGuiParams() { //write current value
    let lives = guiParams.querySelector('.lives')
    lives.textContent = playerLives
    let waves = guiParams.querySelector('.waves')
    waves.textContent = `${countWave + 1}/${wave[level].length}`
    let gold = guiParams.querySelector('.gold')
    gold.textContent = playerGold
    let name = guiMsg.querySelector('.gui__name')
    name.textContent =  (document.querySelector('#text').value || 'Player') + ',' 
    let message = guiMsg.querySelector('.gui__msg')
    message.textContent = msg
}

//Create msg field in GUI

const guiMsg  = document.querySelector('.msg')
let guiMsgImg = document.querySelector('.img__gender')
let guiMsgName = document.querySelector('#text')
console.log(guiMsgName.value)

function createMsgField() {
    guiMsgImg.src = document.querySelector('input[name="gender"]:checked').value;
    guiMsgImg.width = blockSize * 2
}

//Create settings on GUI

const btnPause = document.querySelector('.btn__pause');
const btnStart = document.querySelector('.btn__start');
const btnMusic = document.querySelector('.btn__music');
const btnMenu = document.querySelector('.btn__menu');

btnPause.width = blockSize*2
btnStart.width = blockSize*2
btnMusic.width = blockSize*2
btnMenu.width = blockSize*2

function getPause() {
    btnPause.classList.remove('show')
    btnPause.classList.add('hide')
    btnStart.classList.remove('hide')
    btnStart.classList.add('show')
    stop()
}
function getStart() {
    btnStart.classList.remove('show')
    btnStart.classList.add('hide')
    btnPause.classList.remove('hide')
    btnPause.classList.add('show')
    start()
}
btnPause.addEventListener('click', getPause) 
btnStart.addEventListener('click', getStart) 