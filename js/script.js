'use strict';

const canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      wrapper = document.querySelector('.wrapper');

let text = document.createElement('div'); 
text.classList.add('msg');
let timerId, timer;
let countIntervalSec = 0;
let countWave = 0;
let wave = [
   {
       assasin: 3,
       knight: 4
   }, 
   {}, {}, {}, {}
];
let playerName = 'Larisa';
let msg = 'save the kingdom!';

//Field size
const width = window.innerWidth,
      blockSize = width / 36,
      height = blockSize * 16,
      halfBlockSize = blockSize/2,
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
function drawRoad () {
    ctx.fillStyle = 'Gray';
    ctx.fillRect(halfBlockSize, startRoadY, widthRoad, heightRoad);
    ctx.drawImage(finish, widthRoad - blockSize, startRoadY - heightRoad, heightRoad, heightRoad);
}

const finish = new Image();
      finish.src = 'img/flag.svg';

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
let countEnemies = wave.length - countWave - 1;
let gold = 200;

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
    ctx.fillText(countEnemies, paramXSecond + paramSize * 1.2, paramYFirst + paramSize / 1.2);
    ctx.fillText(gold, paramXThird + paramSize * 1.3, paramYFirst + paramSize / 1.2);
}
function drawPlayer() {
    ctx.font = `${blockSize*0.8}px Mate SC`
    ctx.drawImage(imgPlayer, paramXFirst-blockSize*0.2, paramYPlayer, playerSize, playerSize); 
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
        } else if( e.offsetX < paramXFirst + towerSize*8 && e.offsetX > paramXFirst && (e.offsetY > paramYTower && e.offsetY < paramYTower + towerSize ||  e.offsetY > paramYCatapult && e.offsetY < paramYCatapult + towerSize || e.offsetY > paramYMagic && e.offsetY < paramYMagic + towerSize)) {
            msg = 'select location';
            stop();
            drawGrid();
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
        let corX = e.offsetX - ((e.offsetX - halfBlockSize) % blockSize)
        let corY = e.offsetY - ((e.offsetY - halfBlockSize) % blockSize)
        SelectTower(towerInd, corX, corY);
        start()
    } else {
        start()
    }
}

let enemies = [];
let towers = [];

//Enemies
class Enemy {
    constructor(image, y, width, height, speed, hp, armor ) {
        this.x = blockSize,
        this.y = y,
        this.image = new Image(),
        this.image.src = image,
        this.width = width,
        this.height = height,
        this.speed = speed,
        this.hp = hp,
        this.armor = armor;
        this.visible = true;
    }
    Move() {
        this.x += this.speed;
    }
    Update() {
        if (this.hp <= 0) {
            this.visible = false
        }
        if (this.x + this.width - blockSize / 2 >= widthPlay - blockSize) {
            stop('Game over!')
        };
    }
    Draw() {
        if (this.hp > 0 && this.visible) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        }
    }
    GetDamage(damage) {
        this.hp -= damage; 
        if (this.hp <= 0) {
            this.hp = 0
        }
    }
}
enemies = [
    {   
        name: 'assasin',
        y: startRoadY - 10,
        width: heightRoad,
        height: heightRoad,
        speed: 4,
        hp: 5000,
        armor: 1
    },
    {
        name: 'knight',
        y: startRoadY - 10,
        width: heightRoad,
        height: heightRoad,
        speed: 3,
        hp: 5000,
        armor: 2
    }
]

let count = 0
let countAssasin = 0;
let countKnight = 0;
let visibleEnemies = [];

function getWave(i) {
    if(countAssasin == wave[i].assasin && countKnight < wave[i].knight) {
        createEnemies(1, 'knight')
    }
    if(countAssasin < wave[i].assasin) {
        createEnemies(0, 'assasin');
    }
}

function createEnemies(i, enemy) {
    visibleEnemies.push(new Enemy(`img/${enemy}.svg`, enemies[i].y, enemies[i].width, enemies[i].height, enemies[i].speed, enemies[i].hp, enemies[i].armor))
    console.log(visibleEnemies)
    switch(enemy) {
        case 'assasin' : countAssasin++
        break;
        case 'knight' : countKnight++
        break;
    }
}

function drawEnemies() {
    if(visibleEnemies) {
        visibleEnemies.forEach((item) => {
            item.Update();
            visibleTowers.forEach((tower) => {
                tower.Update(item);
            })
            item.Move();
            item.Draw();
        })
    }
}

//Tower
class Tower {
    constructor(image, attack, rate, range, cost, x, y, circle) {
        this.image = new Image(),
        this.image.src = image,
        this.attack = attack,
        this.rate = rate,
        this.range = range,
        this.cost = cost,
        this.x = x, 
        this.y = y,
        this.circle = circle
    }
    Update(item) {
        if (ctx.isPointInPath(this.circle, item.x, item.y)) {
            item.GetDamage(this.attack);
            console.log(`new enemy HP = ${item.hp}`);
        }
    }
    Draw(x, y) {
        ctx.drawImage(this.image, x, y, blockSize, blockSize);
        ctx.stroke(this.circle)
    }
}

towers = [
    {
        img: 'img/tower.svg',
        attack: 20,
        rate: 3,
        range: Math.floor(blockSize*3),
        cost: 70
    },
    {
        img: 'img/catapult.svg',
        attack: 50,
        rate: 2,
        range: Math.floor(blockSize*3),
        cost: 90
    },
    {
        img: 'img/magic.svg',
        attack: 20,
        rate: 2,
        range: Math.floor(blockSize*2),
        cost: 80
    }
]
let visibleTowers = [];

function drawTowers () {
    visibleTowers.forEach((tower) => {
        tower.Draw(tower.x, tower.y);
    })
}

//Player
function SelectTower(i, x, y) {
    let circle = new Path2D();
    circle.arc(x + halfBlockSize, y + halfBlockSize, towers[i].range, 0, Math.PI * 2)
    visibleTowers.push(new Tower(towers[i].img, towers[i].attack, towers[i].rate, towers[i].range, towers[i].cost, x, y, circle))
}

//Functions
function draw() {
    drawField();
    drawTowers();
    drawBorder();
    drawRoad();
    drawGUI();
    drawEnemies();
    showMessage(msg)
}

function update() {
    ctx.clearRect(blockSize, startRoadY-blockSize, widthRoad, heightRoad+blockSize);
    draw();
    if(countIntervalSec == 20) {
        getWave(countWave)
        countIntervalSec = 0
    }
    countIntervalSec++
}

function start() {
    timerId = setInterval(update, 100);
    getEvent()
}

function stop() {
    clearInterval(timerId);
    showMessage(msg)
}

resize();
window.onload = start;
