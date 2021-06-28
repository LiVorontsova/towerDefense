// 'use strict';


//Add music
let music = new Audio() 
music.autoplay = true
music.volume = 0.1
music.loop = true
let musicPlaying 


//Add slides
const firstSlide = document.querySelector('.main');
const game = document.querySelector('#game');
const menu = document.querySelector('.menu');
const lastSlide = document.querySelector('.ending');
const btnOpenGame = document.querySelector('#btn__open');

btnOpenGame.addEventListener('click', openMenu);

function openMenu() { //open menu with instruction
    firstSlide.classList.add('hide')
    menu.classList.remove('hide')
    menu.classList.add('show')
    menuTitle.textContent = `Welcome, ${(document.querySelector('#text').value) || 'Player'}!`
    music.src = 'audio/StrongHold.mp3'
    musicPlaying = true
    playMusic()
}

//click to start and play
const menuBtnStart = document.querySelector('.btn__game')

    menuBtnStart.addEventListener('click', () => {
        menu.classList.remove('show')
        menu.classList.add('hide')
        game.classList.remove('hide')
        game.classList.add('show')
        music.src = 'audio/Combat04.mp3'
        drawGenderImg()
        start()
    } )


const canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      wrapper = document.querySelector('.wrapper');

//Game size for canvas
const width = 825,
      blockSize = Math.floor(width / 25),
      height = blockSize * 16,
      halfBlockSize = Math.floor(blockSize/2),
      blockSizeMove = blockSize * 100;

canvas.width = width
canvas.height = height


let countWave = 0; //counts the waves of enemies that were rendered


//Flag (end of the road)
const endGameImg = new Image();
endGameImg.src = 'img/flag.svg';

function drawFlag () {
    ctx.drawImage(endGameImg, endGame.x, endGame.y, blockSize*1.5, blockSize*1.5);
}
const endGame = { //flag that you can't let enemies touch
    x: 24*blockSize - halfBlockSize,
    y: 6*blockSize + halfBlockSize
}

//Map tiles
let g = new Image(); //ground
    g.src = 'img/ground.png';
 let   r = new Image(); //road
    r.src = 'img/road.png';
 let   o = new Image(); //obstacle
    o.src = 'img/water.png';

let lvl = 0; //current level

let level = [
    {
        i: 0,
        gold: 200,
        lives: 3,
        isComplete: false,
        map: [
            [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o],
            [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o,o,o,o,o,o,o],
            [g,g,g,g,g,g,g,g,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o],
            [g,g,g,o,o,o,o,r,r,r,r,r,r,r,r,r,r,r,r,g,g,g,g,o,o],
            [g,g,g,o,o,o,o,r,o,o,o,o,o,o,g,o,o,g,r,g,g,g,g,o,o],
            [g,g,g,o,o,o,o,r,r,r,r,o,g,g,g,o,g,g,r,o,g,g,g,o,o],
            [g,g,g,o,o,o,o,o,g,g,r,o,g,g,g,o,o,o,r,o,g,g,g,o,o],
            [r,r,r,r,r,r,r,r,r,r,r,o,g,g,g,o,o,o,r,r,r,r,r,r,r],
            [o,o,o,o,o,o,o,o,o,o,o,o,g,g,g,o,o,o,o,o,o,o,g,o,o],
            [o,o,o,o,o,o,o,o,o,o,o,o,g,g,g,g,g,g,g,g,g,g,g,o,o],
            [o,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o],
            [o,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o],
            [o,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o],
            [o,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o],
            [o,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o],
            [o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o]
        ],
        startY: blockSize*7*100,
        wave: [{
                assasin: 4,
                knight: 0,
                dragon: 0,
                genie: 0
           }, {
                assasin: 0,
                knight: 7,
                dragon: 0,
                genie: 1
            }, {
                assasin: 4,
                knight: 0,
                dragon: 2,
                genie: 1
            }]
    }, 
    {
        i: 1,
        gold : 200,
        lives : 3,
        isComplete: false,
        map: [
            [o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o],
            [o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o],
            [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o],
            [g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o],
            [g,g,g,g,g,g,o,o,o,o,o,o,o,o,o,r,r,r,r,r,r,r,r,o,o],
            [g,g,g,g,g,g,o,o,o,o,o,o,o,o,o,r,g,g,o,o,o,g,r,o,o],
            [g,g,g,g,g,g,o,o,o,o,o,o,o,o,o,r,g,o,o,o,o,o,r,o,o],
            [g,g,g,g,g,g,o,o,o,o,o,o,o,o,o,r,g,o,o,o,o,g,r,r,r],
            [o,g,g,g,g,g,o,o,o,o,o,o,o,o,o,r,r,r,r,r,r,r,g,o,o],
            [o,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o,o,o,g,o,o,r,g,o,o],
            [o,g,g,g,g,g,g,g,g,g,g,g,g,g,o,o,o,o,o,o,g,r,o,o,o],
            [o,g,g,o,o,o,g,g,o,o,o,o,g,o,o,o,o,o,o,o,o,r,o,o,o],
            [o,g,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,r,o,o,o],
            [r,r,r,o,o,o,o,o,o,o,o,o,o,g,o,o,o,g,g,o,o,o,g,o,o],
            [o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,g,o,o,o,g,g,g,o,o],
            [o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o,o]
        ],
        startY: blockSize*13*100,
        wave: [{
                assasin: 2,
                knight: 5,
                dragon: 0,
                genie: 0
           }, {
                assasin: 3,
                knight: 0,
                dragon: 3,
                genie: 0
           }, {
                assasin: 0,
                knight: 3,
                dragon: 0,
                genie: 2
            }, {
                assasin: 2,
                knight: 0,
                dragon: 3,
                genie: 3
            }]
    }
]


let msg = 'save the kingdom!';

function drawMap() {
    let countRowTile = 25,
        countColumnTile  = 16;
    for (let i = 0; i < countColumnTile ; i++) {
        for (let j = 0; j < countRowTile; j++) {
            let tile = level[lvl].map[i][j]
            ctx.drawImage(tile, blockSize * j, blockSize * i, blockSize, blockSize);
        }
    }
}


//Enemies

let enemies = [];

//Direction for enemy
let left = {x: -1, y: 0};
let right = {x: 1, y: 0};
let up = {x: 0, y: -1};
let down = {x: 0, y: 1};

class Enemy {
    constructor(y, image, speed, hp, armor, bounty ) {
        this.x = 0,
        this.y = y,
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
        for (let counter = 0; counter < this.speed * this.slowDown; counter += 1){
            let map = level[lvl].map
            let mapX = Math.floor(this.x / blockSizeMove); //find cell's number in map array
            let mapXRemainder =  (this.x  % blockSizeMove);

            let mapY = Math.floor(this.y / blockSizeMove);
            let mapYRemainder =  (this.y % blockSizeMove);

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
            level[lvl].gold +=this.bounty
        }
        if (this.x/100 + this.width - blockSize >= endGame.x) {
            level[lvl].lives -= 1
            createdEnemies.splice(createdEnemies.indexOf(this), 1)
        };
    }
    Draw() {
        if (this.currentHP > 0) {
            ctx.drawImage(this.image, this.x/100, this.y/100, this.width, this.height) //draw enemy

            ctx.fillStyle = '#000000';
            ctx.fillRect(this.x/100, this.y/100 - this.height/4, this.width + 2, this.height/5) //draw HP bg
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.x/100 + 1, this.y/100 - this.height/4+1, this.width * this.currentHP / this.hp, this.height/5-2) //draw current HP
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
        speed: 60,
        hp: 350,
        armor: 0,
        bounty: 10,
        descr: `Assasin: <br> moderate, little health, no armor`
    },
    {
        name: 'knight',
        img: 'img/knight.svg',
        speed: 55,
        hp: 500,
        armor: 0.1,
        bounty: 15
    },
    {
        name: 'dragon',
        img: 'img/dragon.svg',
        speed: 50,
        hp: 1000,
        armor: 0.4,
        bounty: 25
    },
    {
        name: 'genie',
        img: 'img/genie.svg',
        speed: 120,
        hp: 400,
        armor: 0.2,
        bounty: 30
    }
]

let createdEnemies = [];
let nextWaveFlag = false;
let wavesAreOver;


function getWave(lvl, i) {
    let wave = level[lvl].wave
    if (countWave + 1 == wave.length && !wave[i].assasin && !wave[i].knight && !wave[i].dragon && !wave[i].genie) {
        wavesAreOver = true
    } //check if waves on this lvl are over
    else if (!wave[i].assasin && !wave[i].knight && !wave[i].dragon && !wave[i].genie) { //get next wave
        if (!nextWaveFlag){
        nextWaveFlag = true;
        setTimeout(() => {
            countWave++;
            nextWaveFlag = false;   
        }, 5000);
        }
    } else if (!wave[i].assasin && !wave[i].knight && !wave[i].dragon && wave[i].genie ) { //render enemy
        createEnemies(3, 'genie', wave[i]);
    } else if (!wave[i].assasin && !wave[i].knight && wave[i].dragon) {
        createEnemies(2, 'dragon', wave[i]);
    } else if (!wave[i].assasin && wave[i].knight) {
        createEnemies(1, 'knight', wave[i])
    } else if (wave[i].assasin) {
        createEnemies(0, 'assasin', wave[i]);
    }
}

function createEnemies(i, enemy, wave) {//push new enemy to createdEnemies array
    createdEnemies.push(new Enemy(level[lvl].startY, enemies[i].img, enemies[i].speed, enemies[i].hp, enemies[i].armor, enemies[i].bounty))
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
    if(createdEnemies.length) {
        for (let i = 0; i < createdEnemies.length; i++){
            createdEnemies[i].Move()
            createdEnemies[i].Draw()
            createdEnemies[i].Update()
        }
    }
}



//Tower

let towers = [];

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
    FindEnemy() { //find current enemy within radius of attack
        this.currentEnemy = createdEnemies.find((item) => ctx.isPointInPath(this.circle, item.x/100, item.y/100))
        if (this.currentEnemy) {
            let diffX = this.currentEnemy.x/100 + halfBlockSize - this.x  //find distance to enemy
            let diffY = this.currentEnemy.y/100 + halfBlockSize - this.y
            this.flightX = Math.floor(diffX / this.rate) //get distance of one shot
            this.flightY = Math.floor(diffY / this.rate)
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
                    // ctx.strokeRect(splashX, splashY, blockSize*4, blockSize*4)
                    for (let i = 0; i < createdEnemies.length; i++) { 
                        (createdEnemies[i].x/100 <= splashX + blockSize*4 && createdEnemies[i].x/100 >= splashX - blockSize 
                        && createdEnemies[i].y/100 <= splashY + blockSize*4 && createdEnemies[i].y/100 >= splashY - blockSize) 
                        && createdEnemies[i].GetDamage(this.attack) //get damage if enemy is in this area
                    }
                    this.SetInitialParams()
                }
            break
            case 'magic':
                let aura = new Image();
                    aura.src = 'img/smoke.svg';
                    ctx.drawImage(aura, this.x, this.y - blockSize/2, blockSize, blockSize)
                for (let i = 0; i < createdEnemies.length; i++) { //area magic attack (slowDown)
                    ctx.isPointInPath(this.circle, createdEnemies[i].x/100, createdEnemies[i].y/100) 
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
        name: 'archers',
        img: 'img/archers.svg',
        attack: 30,
        rate: 10,
        range: blockSize*3,
        cost: 70,
        slowDown: 1,
        projectile: 'img/arrow.svg',
        descr: `Archers tower:  single target <img src='img/arrow.svg' class='img__icon'>`
    },
    {
        name: 'catapult',
        img: 'img/catapult.svg',
        attack: 50,
        rate: 40,
        range: blockSize*3,
        cost: 90,
        slowDown: 1,
        projectile: 'img/circle.svg',
        descr: `Catapult: splash  <img src='img/circle.svg' class='img__icon'> `

    },
    {
        name: 'magic',
        img: 'img/magic.svg',
        attack: 15,
        rate: 20,
        range: blockSize*3,
        cost: 80,
        slowDown: 0.75,
        projectile: 'img/star.svg',
        descr: `Magic tower: single target <img src='img/star.svg' class='img__icon'> <br>Superpower <img src='img/smoke.svg' class='img__icon'> - slows enemies around self`

    }
]
let createdTowers = [];

function drawTowers () {
    for (let i = 0; i < createdTowers.length; i ++) {
        createdTowers[i].Draw()
        createdTowers[i].Update()
    }
}

//Graphical user interface (GUI)

//Create field Towers in GUI
const gui = document.querySelector('.gui')
const guiTowers = document.querySelector('.gui__card-towers');

function drawGuiTowers() {
    for (let i = 0; i < towers.length; i++) { //create buttons on GUI
        let item = document.createElement('button');
        item.classList.add('gui__item', 'show')
        item.id = i
        item.name = towers[i].name

        let itemImg = document.createElement('img');
        itemImg.src = towers[i].img
        itemImg.width = blockSize
        itemImg.classList.add('img');

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
        descrSlowDown.append(Math.floor((1 - towers[i].slowDown)*100) +'%')

        let cost = document.createElement('div') //cost 
        cost.classList.add('show');
        let costImg = document.createElement('img')
        costImg.classList.add('img')
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


//add listener to btns in GUI towers

let selectedTowerOnBtn = 0

guiTowers.addEventListener('click', (e) => {
    let btn = e.target.closest('button');
    if (!btn || stopGame) return;
    msg = 'select location'
    selectedTowerOnBtn = btn.id
    document.body.style.cursor = `url(img/${btn.name}.png) 10 10, auto`
}) 


//find coordinates of click on canvas, build tower by current id

canvas.addEventListener('click', (e) => {
    if (selectedTowerOnBtn) {
        putTower(e, selectedTowerOnBtn)
        document.body.style.cursor = 'auto'
    }
})

//build tower
function putTower(e, id) {
    let corX = e.offsetX  - (e.offsetX % blockSize) //find start of tile
    let corY = e.offsetY - (e.offsetY % blockSize)
    let arrX = corX / blockSize //find cell's number in map array
    let arrY = corY / blockSize
    let result = false
    let map = level[lvl].map
    for (let i = 0; i < createdTowers.length; i++) { // check if another tower has same coordinates
        createdTowers[i].x == corX && createdTowers[i].y == corY 
        ? result = true : result = false}
    if (map[arrY][arrX] == g && !result) {
        if (level[lvl].gold >= towers[id].cost) {
            SelectTower(id, corX, corY);
        } else {
            msg = "not enough gold"
        }
    } else {
        msg = "you can't build here"
    }
    selectedTowerOnBtn = 0
}

//push new tower to createdTowers array
function SelectTower(i, x, y) {
    let circle = new Path2D(); //tower.range
    circle.arc(x + halfBlockSize, y + halfBlockSize, towers[i].range, 0, Math.PI * 2)

    createdTowers.push(new Tower(towers[i].name, towers[i].img, towers[i].attack, towers[i].rate, towers[i].range, towers[i].cost, towers[i].slowDown, x, y, circle, towers[i].projectile))

    level[lvl].gold -= towers[i].cost
    msg = "save the kingdom!"
}


//Create Parameters in GUI

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
function drawGuiParams() {
    guiParams.append(
        getGuiParams('img/heart.svg', 'lives'),
        getGuiParams('img/swords.svg', 'waves'),
        getGuiParams('img/chest.svg', 'gold'),
        )
}

drawGuiParams()


//Draw gender image in GUI

const guiMsg  = document.querySelector('.msg')
let guiMsgImg = document.querySelector('.img__gender')
let guiMsgName = document.querySelector('#text')

function drawGenderImg() {
    guiMsgImg.src = document.querySelector('input[name="gender"]:checked').value;
    guiMsgImg.width = blockSize * 2
}

//Write current values

function writeGuiParams() { 
    let lives = guiParams.querySelector('.lives')
    lives.textContent = level[lvl].lives

    let waves = guiParams.querySelector('.waves')
    waves.textContent = `${countWave + 1}/${level[lvl].wave.length}`

    let gold = guiParams.querySelector('.gold')
    gold.textContent = level[lvl].gold

    let name = guiMsg.querySelector('.gui__name')
    name.textContent =  (document.querySelector('#text').value || 'Player') + ','

    let message = guiMsg.querySelector('.gui__msg')
    message.textContent = msg
}

//Create settings in GUI

const btnPause = document.querySelector('.btn__pause');
const btnStart = document.querySelector('.btn__start');
const btnMusic = document.querySelector('.btn__music');
const btnNext = document.querySelector('.btn__next');

function getPause() {
    if (!isStopped) {
        btnPause.classList.remove('show')
        btnPause.classList.add('hide')
        btnStart.classList.remove('hide')
        btnStart.classList.add('show')
        music.src = 'audio/StrongHold.mp3'
        playMusic()
        stop()
    }
}

function getStart() {
    btnStart.classList.remove('show')
    btnStart.classList.add('hide')
    btnPause.classList.remove('hide')
    btnPause.classList.add('show')
    msg = 'save the kingdom!'
    music.src = 'audio/Combat04.mp3'
    playMusic()
    start()
}

btnPause.addEventListener('click', getPause) 
btnStart.addEventListener('click', getStart) 
btnStart.classList.add('active')

btnMusic.addEventListener('click', () => {
    if (!musicPlaying) {
        musicPlaying = true
        btnMusic.classList.remove('active')
    } else {
        musicPlaying = false
        btnMusic.classList.add('active')
    }
    playMusic()
})

function playMusic() {
    if(musicPlaying) {
        music.play()
    } else {
        music.pause()
    } 
}

btnNext.addEventListener('click', () => { //click to start new lvl
    if(level[lvl].isComplete) {
        btnNext.classList.remove('show')
        btnNext.classList.add('hide')
        createdTowers = []
        createdEnemies = []
        countWave = 0
        wavesAreOver = false
        if (lvl + 1 < level.length) {
            lvl ++
            music.src = 'audio/Combat04.mp3'
            playMusic()
            start()
        } else { //close game and open last slide
            music.src = 'audio/StrongHold.mp3'
            playMusic()
            game.classList.remove('show')
            game.classList.add('hide')
            lastSlide.classList.remove('hide')
            lastSlide.classList.add('show')
        }
    }
} ) 
btnNext.classList.add('active')

//Main menu. Instruction

let menuTitle = document.querySelector('.menu__title')
const menuTowers = document.querySelector('.menu__wrapper-towers')

//Add description about towers
function drawMenuItems() {
    for (let i = 0; i < towers.length; i++) {

    let item = document.createElement('div')
    item.classList.add('menu__item')

    let itemImg = document.createElement('img')
    itemImg.src = towers[i].img
    itemImg.width = blockSize*1.5

    let itemDescr = document.createElement('div')
    itemDescr.innerHTML = towers[i].descr

    item.append(itemImg, itemDescr)
    menuTowers.append(item)
    }

}

drawMenuItems()


//Checking game parameters

function checkLvlIsComplete () {
    if (wavesAreOver && createdEnemies.length == 0) {
        msg = 'you have won!';
        level[lvl].isComplete = true
        stop()
        btnNext.classList.remove('hide')
        btnNext.classList.add('show')
        music.src = 'audio/StrongHold.mp3'
        playMusic()
    }
}

function checkLives() {
    if (!level[lvl].lives) {
        msg = 'game over!';
        stop();
    }
}

let idReqAnimFrame;
let stopGame;
let isStopped;
let countIntervalSec = 0;


function draw() { //draw elements on canvas
    drawMap()
    drawTowers();
    drawFlag();
    drawEnemies();
}

function start() { //start requestAnimationFrame
    checkLives()
    writeGuiParams() //write the current parameters of this level
    isStopped = false

    if (!stopGame) {
        ctx.clearRect(0, 0, width, height);
        draw();
        if(!(countIntervalSec % 90) && !wavesAreOver) {
            getWave(lvl, countWave)
            countIntervalSec = 0
        } else if (wavesAreOver) {
            checkLvlIsComplete()
        }
        idReqAnimFrame = window.requestAnimationFrame(start)
        countIntervalSec++
    } else {
        window.cancelAnimationFrame(idReqAnimFrame)
        stopGame = false
    }
}

function stop() {
    stopGame = true
    isStopped = true
}