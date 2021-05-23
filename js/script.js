'use strict';

const canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      wrapper = document.querySelector('.wrapper');

let text = document.createElement('div'); 
text.classList.add('msg');
let timerId, timer;

//Field size
const width = window.innerWidth,
      blockSize = width / 36,
      height = blockSize * 16,
      halfBlockSize = blockSize/2,
      widthField = width - blockSize,
      heightField = height - halfBlockSize,
      widthPlay = blockSize * 27;

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
    imgTower.src = 'img/tower2.svg';
    const imgCatapult = new Image();
    imgCatapult.src = 'img/catapult2.svg';
    const imgMagic = new Image();
    imgMagic.src = 'img/magic2.svg';
    const imgPlay = new Image();
    imgPlay.src = 'img/play.svg';
    const imgPause = new Image();
    imgPause.src = 'img/pause.svg';

let imgPlayer = new Image();
    imgPlayer.src = 'img/king.svg';

const towerSize = blockSize,
    paramSize = blockSize,
    playerSize = blockSize*2,
    paramXFirst = widthPlay + blockSize,
    paramXSecond = widthPlay + blockSize*4,
    paramXFThird = widthPlay + blockSize*7,
    paramYFirst = blockSize,
    paramYSecond = blockSize*8,
    paramYPlayer = blockSize*4;

function drawGUI () {
    ctx.fillStyle = 'Yellow';
    ctx.fillRect(widthPlay + halfBlockSize, halfBlockSize, width - (widthPlay + blockSize), height - blockSize);
    ctx.drawImage(imgEnemy, paramXSecond, paramYFirst, paramSize, paramSize); //Params
    ctx.drawImage(imgGold, paramXFThird, paramYFirst, paramSize, paramSize);
    ctx.drawImage(imgLives, paramXFirst, paramYFirst, paramSize, paramSize );
    ctx.drawImage(imgPlayer, paramXFirst, paramYPlayer, playerSize, playerSize ); //Player
    ctx.drawImage(imgTower, paramXFirst, paramYSecond, towerSize, towerSize); //Towers
    ctx.drawImage(imgCatapult, paramXSecond, paramYSecond, towerSize, towerSize);
    ctx.drawImage(imgMagic, paramXFThird, paramYSecond, towerSize, towerSize);
    ctx.drawImage(imgPause, paramXFirst, paramYSecond + blockSize*4, towerSize, towerSize);//Settings
    ctx.drawImage(imgPlay, paramXSecond, paramYSecond + blockSize*4, towerSize, towerSize);
} 
let tX, tY;
let towerInd;
let clickCount = 0;

function getEvent () {
    canvas.addEventListener("click", e => {
        if(clickCount == 0 && e.offsetX < paramXFirst + towerSize && e.offsetX > paramXFirst && e.offsetY > paramYSecond && e.offsetY < paramYSecond + towerSize ||e.offsetX < paramXSecond + towerSize && e.offsetX > paramXSecond && e.offsetY > paramYSecond && e.offsetY < paramYSecond + towerSize || e.offsetX < paramXFThird + towerSize && e.offsetX > paramXFThird && e.offsetY > paramYSecond && e.offsetY < paramYSecond + towerSize) {
            stop('Select location');
            drawGrid();
            clickCount = 1;
            if(e.offsetX < paramXFirst + towerSize && e.offsetX > paramXFirst && e.offsetY > paramYSecond && e.offsetY < paramYSecond + towerSize) {
                towerInd = 0
            } else if(e.offsetX < paramXSecond + towerSize && e.offsetX > paramXSecond && e.offsetY > paramYSecond && e.offsetY < paramYSecond + towerSize) { 
                towerInd = 1
            } else if(e.offsetX < paramXFThird + towerSize && e.offsetX > paramXFThird && e.offsetY > paramYSecond && e.offsetY < paramYSecond + towerSize) {
                towerInd = 2
            }
            canvas.addEventListener('click', putTower, {once:true})
            clickCount = 0; 
        }
      }, {once: true});
}
function drawIcon(e) {
    console.log(towers[towerInd].img)
    let img = new Image();
    img.src = towers[towerInd].img
    ctx.drawImage(img, e.offsetX, e.offsetY, blockSize, blockSize)
}
function putTower(e) {
    if(e.offsetX < widthPlay - 1.5*blockSize && e.offsetX > halfBlockSize && e.offsetY > halfBlockSize && e.offsetY < heightField) {
        let corX = e.offsetX - ((e.offsetX - halfBlockSize) % blockSize)
        let corY = e.offsetY - ((e.offsetY - halfBlockSize) % blockSize)
        SelectTower(towerInd, corX, corY);
        canvas.removeEventListener('mousemove', drawIcon)
        clearMessage()
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
    Update() {
        this.x += this.speed;
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
    new Enemy('img/knight.svg', startRoadY - 10, heightRoad, heightRoad, 8, 600, 1),
    new Enemy('img/knight.svg', startRoadY + 10, heightRoad, heightRoad, 4, 600)
]

// let visibleEnemies = [];
// let wave = [
//     {
//         knight: 10, 
//         archer: 20,
//         knight: 13
//     }
//     ];

// function drawEnemies(param) {
//     let count = wave[0][param]
//     enemies[0].Draw()
//     count--
//     console.log(wave[0][param])
// }
// console.log(wave[0].knight)

function updateEnemies () {
    enemies.forEach((item) => {
        item.Update();
        visibleTowers.forEach((tower) => {
            tower.Update(item);
        })
        item.Draw()
    })
}

//Tower
class Tower {
    constructor(image, attack, rate, range, x, y, circle) {
        this.image = new Image(),
        this.image.src = image,
        this.attack = attack,
        this.rate = rate,
        this.range = range,
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
        attack: 50,
        rate: 3,
        range: blockSize*3
    },
    {
        img: 'img/catapult.svg',
        attack: 30,
        rate: 3,
        range: 40
    },
    {
        img: 'img/magic.svg',
        attack: 20,
        rate: 3,
        range: 50
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
    
    visibleTowers.push(new Tower(towers[i].img, towers[i].attack, towers[i].rate, towers[i].range, x, y, circle))
}

//Functions
function draw() {
    drawField();
    drawTowers();
    // drawGrid();
    drawBorder();
    drawRoad();
    drawGUI();
    // getEnemies(0)
}

let countInterval = 0

function update() {
    ctx.clearRect(blockSize, startRoadY-blockSize, widthRoad, heightRoad+blockSize);
    draw();
    // if(countInterval == 10) {
    //     drawEnemies( 'knight');
    //     countInterval = 0
    // }
    countInterval++
    updateEnemies();
}

function start() {
    timerId = setInterval(update, 100);
    getEvent()
}

function stop(msg) {
    clearInterval(timerId);
    clearMessage()
    showMessage(msg);
}

function showMessage(msg) {
    text.innerHTML = msg;
    wrapper.append(text);
}

function clearMessage() {
    text.innerHTML = ''
}

resize();
window.onload = start;
