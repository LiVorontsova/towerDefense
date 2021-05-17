'use strict';

const canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      wrapper = document.querySelector('.wrapper');
      
let timerId;

//Field size
const width = window.innerWidth,
      height = window.innerHeight - 150,
      blockSize = width / 40;

function resize() {
    canvas.width = width;
    canvas.height = height;
}

//Border
let drawBorder = function () {
    ctx.fillStyle = 'Blue';
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
} 

//Road
let startRoad = height / 2 - blockSize,
    heightRoad = blockSize * 2,
    widthRoad = width - blockSize * 2;

let drawRoad = function() {
    ctx.fillStyle = 'Gray';
    ctx.fillRect(blockSize, startRoad, widthRoad , heightRoad);
}

//Enemies
class Enemies {
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
    }
    Update() {
        this.x += this.speed;
        if (this.x + this.width - blockSize / 2 >= width - blockSize) {
            stop()
        }
    }
    GetDamage(damage) {
        this.hp -= damage; 
    }
}

let enemies = [
    new Enemies('img/knight.svg', startRoad - 10, blockSize*2, blockSize*2, 4, 600, 1),
    new Enemies('img/knight.svg', startRoad + 10, blockSize*2, blockSize*2, 1)
]

let drawEnemies = function() {
    ctx.drawImage(enemies[0].image, enemies[0].x, enemies[0].y, enemies[0].width, enemies[0].height);
    ctx.drawImage(enemies[1].image, enemies[1].x, enemies[1].y, enemies[0].width, enemies[0].height);
}

class Tower {
    constructor(image, x, y, attack, rate, range) {
        this.x = x,
        this.y = y, 
        this.image = new Image(),
        this.image.src = image,
        this.attack = attack,
        this.rate = rate,
        this.range = range
    }
    Update() {
        if (enemies[0].x >= this.x - this.range && enemies[0].x <= this.x + this.range) {
            enemies[0].GetDamage(this.attack);
            console.log(`new enemy[0] HP = ${enemies[0].hp}`);
        }
    }
}

let towers = [
    new Tower('img/tower.svg', 501.05, 300, 50, 3, 50)
]

let drawTowers = function() {
    ctx.drawImage(towers[0].image, towers[0].x, towers[0].y, blockSize*3, blockSize*3);
}

//Functions
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Очистка холста от предыдущего кадра
    drawBorder();
    drawRoad();
    drawEnemies();
    drawTowers();
    
       
}

function update() {
    enemies[0].Update();
    console.log(`new enemies[0].x = ${enemies[0].x}`)
    enemies[1].Update();
    towers[0].Update();
    draw();
    
}

function start()
{
    timerId = setInterval(update, 100);
}

function stop()
{
    clearInterval(timerId);
    showMessage('Game over!');
}

function showMessage(msg) {
    let text = document.createElement('div');
    text.classList.add('msg');
    text.innerHTML = msg;
    wrapper.append(text);
}

resize();
window.onload = start;