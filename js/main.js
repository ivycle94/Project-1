// console.log("test")
// grabbing html elemnts and setting them up as variables to manipulate
const game = document.getElementById("canvas")
const starCounter = document.getElementById("stars-counter")
const gameoverScreen = document.getElementById("gameover")
const youWinScreen = document.getElementById("you-win")
// getting game's context, which allows to specify where to put things and how big to make them.
const ctx = game.getContext("2d")
// declare obstacles as a variable for an array
let counter = 0
let starsWin = 10
// now you can set attributes to the game,
// to set heigh and width based on COMPUTED STYLE
// it basically means reading how it's displaying in the current state of the browser
game.setAttribute("width", getComputedStyle(game)["width"])
game.setAttribute("height", getComputedStyle(game)["height"])

// const kirby = new Image()
// kirby.src = "img/kirby.png"
// const kirbWidth = 130
// const kirbHeight = 119
// let spriteX = 0

//*********************** Class Constructor for Ball *******************************
const kirbySprite = new Image()
kirbySprite.src = "img/kirby.png"
class Ball {
    constructor () {
        this.x = 150,
        this.y = 200,
        this.vy = 0,
        this.kirbWidth = 130,
        this.width = 40,
        this.kirbHeight = 119,
        this.height = 40,
        this.color = "black",
        this.weight = 1,
        this.alive = true,
        this.kirbFrameX = 0
    }
    update = function () {
        if(this.y > canvas.height - this.height) {
            //bottom barrier
            this.y = canvas.height - this.height
            this.vy = 0
        } else {
            // add gravity to pull player down
            this.vy += this.weight
            this.y += this.vy
            // friction effect below
            this.vy *= 0.9
        }
        if(this.y < 0) {
            //top barrier
            this.y = 0,
            this.vy = 0
        }
        if (pressedJump === true) {
            this.jump()
        }   
    }
    render = function () {
        ctx.fillStyle = this.color
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(kirbySprite, this.kirbFrameX * this.width, 0, this.kirbWidth, this.kirbHeight, this.x - 15, this.y - 15, this.width * 1.6, this.height * 1.6)
    }
    jump = function () {
        this.vy -= 2
        // if(this.kirbFrameX > 6) {
        //     this.kirbFrameX = 0
        // } else {
        //     this.kirbFrameX += 1
        // }
    }
}
let player = new Ball()
// let ball = new Ball(40, 200, "black", 40, 40)

//******************* Class Constructor for Obstacles ***************************

//need new wall to appear every so often
//wall should appear a end of canvas <--- done
//should work its way to 0 x coordinate
// const obstacleSprite = new Image()
// obstacleSprite.src = "img/test.png"
const obstacles = []

class Obstacle {
    constructor () {
        // this.imageWidth = 100,
        this.topObstacles = (Math.random() * canvas.height/3) + 50,
        this.bottomObstacles = (Math.random() * canvas.height/3) + 70,
        this.x = canvas.width,
        this.width = 50,
        this.color = "black"
    }
    render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, 0, this.width, this.topObstacles) 
        ctx.strokeRect(this.x, 0, this.width, this.topObstacles)// <----------------------------------------- top walls
        ctx.fillRect(this.x, canvas.height - this.bottomObstacles, this.width, this.bottomObstacles)
        ctx.strokeRect(this.x, canvas.height - this.bottomObstacles, this.width, this.bottomObstacles) // <--- bottom walls
        ctx.lineWidth = 1
        ctx.strokeStyle = "whitesmoke"
        
        // ctx.drawImage(obstacleSprite, 0, 0, this.imageWidth, this.topObstacles, this.x, 0, this.width, this.bottomObstacles)
    }
    update = function () {
        this.x -= 1
        this.render()
    }
}

const spawnObstacles = () => {
    // 10 walls per 50 frames (500)
    if (frame % 300 === 0) {
        obstacles.push(new Obstacle)
        //add more speed after each spawn
        // gamespeed ++ <-- doesn't work.
    }
    for (let i = 0; i < obstacles.length; i++){
        obstacles[i].update()
    }
    // Laptop crashed, must get rid of extra obstacles
    if (obstacles.length > 20) {
        obstacles.pop()
    }
}
// DOESN"T WORK
//  const spawnObstacles = () => {
//             if (obstacle.x < 800) {
//             let obstacle2 = new Obstacle(920, 250, "white", 50, 250)
//             obstacles.push(obstacle2)
//             obstacle2.render()
//             let obstacle3 = new Obstacle(920, 250, "white", 50, 250) 
//             obstacles.push(obstacle3) 
//             obstacle3.render()
//             }  
//     }

//******************* Class Constructor for Stars ***************************
const starSprite = new Image()
starSprite.src = "img/star.png"

const stars = []
class Star {
    constructor() {
        this.x = 550, // chnage this value if your canvas isnt 960 px (width should be 480)
        this.y = (Math.floor(Math.random() * canvas.height) - player.height),
        this.color = "yellow",
        this.starHeight = 40,
        this.height = 20,
        this.starWidth = 40,
        this.width = 20,
        this.alive = true  
    }
    render = function () {
        ctx.fillStyle = this.color
        // ctx.fillRect(this.x, this.y, this.height, this.width)
        ctx.drawImage(starSprite, 0, 0, this.starWidth, this.starHeight, this.x - 2, this.y - 3, this.width * 1.2, this.height * 1.2)
    }
    update = function () {
        this.x -= 1
        this.render()
    }
}
// let star = new Star(40, 40, "yellow", 20, 20)

const spawnStars = () => {
    if (frame % 400 === 0) {
        stars.unshift(new Star)
    }
    for (let i = 0; i < stars.length; i++){
        stars[i].update()
    }
    // Laptop crashed, must get rid of extra obstacles
    if (stars.length > 1) {
        stars.pop(stars[0])
    }
}

//******************* Collision Detection ***************************

const detectHit = () => {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            player.x < obstacles[i].x + obstacles[i].width && 
            player.x + player.width > obstacles[i].x && 
            ((player.y < 0 + obstacles[i].topObstacles && 
            player.y + player.height > 0) || 
            (player.y > (canvas.height - obstacles[i].bottomObstacles -45) && 
            player.y - player.height < canvas.height))) {

            // console.log('HIT!')
            player.alive = false
        }
    } 
}  

//******************* Collect Stars ***************************

//let counter = 0
const starCollected = () => {
    for (let i = 0; i < stars.length; i++) {
        if (
            stars[i].x < player.x + player.width &&
            stars[i].x + stars[i].width > player.x &&
            stars[i].y < player.y + player.height &&
            stars[i].y + stars[i].height > player.y
        ) {
            console.log("COLLECTED STAR")
            // ctx.clearRect(0, 0, game.width, game.height)
            // return Star.alive = false
            // counter++
            console.log(counter)
            //~~~~~~~~~ retry ~~~~~~~~~~~~
             stars.splice(stars)
             counter++
             starCounter.textContent = "Stars: " + counter + "/" + starsWin
             if (counter === starsWin) {
                 console.log("YOU WIN!")
                // return
            }
        }
    }
}

// console.log(counter)

let pressedJump = false
let frame = 0
let gamespeed = 2

const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height)
    spawnStars()
    starCollected()
    player.update()
    player.render()
    spawnObstacles()
    detectHit()
    if(counter === starsWin) {
        youWinScreen.textContent = "Y O U   W I N!"
        return
    }
    if (player.alive === false) {
        console.log("GAMEOVER")
        //insert game over text
        gameoverScreen.textContent = "G A M E  O V E R !"
       
        return
    }
    requestAnimationFrame(gameLoop)  
    frame ++ 
    // console.log(frame)
}
gameLoop();


addEventListener("keydown", function(e){
    // console.log("you pressed", e.code)
    if (e.code === "Space") {
        // player.y -= 50
        pressedJump = true
        if(player.kirbFrameX >= 3) {
            player.kirbFrameX = 0
        } else {
            player.kirbFrameX += 3
        }
        
    }
})
addEventListener("keyup", function(e){
    // console.log("you released", e.code)
    if (e.code === "Space") {
        pressedJump = false
    }
})

// const jump = (e) => {
//     // spacebar keycode ----> 32
//     switch (e.keyCode) {
//         case (32):
//             ball.y -= 40
//             break
//     }
// }

document.addEventListener("DOMContentLoaded", function () {
    
    // document.addEventListener("keydown", jump)
    // setInterval(gameLoop, 1000)
})