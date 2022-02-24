// console.log("test")
// grabbing html elemnts and setting them up as variables to manipulate
const game = document.getElementById("canvas")
// getting game's context, which allows to specify where to put things and how big to make them.
const ctx = game.getContext("2d")
// declare obstacles as a variable for an array

// now you can set attributes to the game,
// to set heigh and width based on COMPUTED STYLE
// it basically means reading how it's displaying in the current state of the browser
game.setAttribute("width", getComputedStyle(game)["width"])
game.setAttribute("height", getComputedStyle(game)["height"])

//*********************** Class Constructor for Ball *******************************

class Ball {
    constructor () {
        this.x = 150,
        this.y = 200,
        this.vy = 0,
        this.width = 40,
        this.height = 40,
        this.color = "black",
        this.weight = 1,
        this.alive = true
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
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    jump = function () {
        this.vy -= 2
    }
}
let player = new Ball()
// let ball = new Ball(40, 200, "black", 40, 40)

//******************* Class Constructor for Obstacles ***************************

//need new wall to appear every so often
//wall should appear a end of canvas <--- done
//should work its way to 0 x coordinate
const obstacles = []

class Obstacle {
    constructor () {
        this.topObstacles = (Math.floor(Math.random() * canvas.height/3)) + 50,
        this.bottomObstacles = (Math.floor(Math.random() * canvas.height/3)) + 70,
        this.x = canvas.width,
        this.width = 100,
        this.color = "white"
    }
    render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, 0, this.width, this.topObstacles) // <----------------------------------------- top walls
        ctx.fillRect(this.x, canvas.height - this.bottomObstacles, this.width, this.bottomObstacles) // <--- bottom walls
    }
    update = function () {
        this.x -= 1
        this.render()
    }
}

const spawnObstacles = () => {
    // 10 frames per wall 
    if (frame % 500 === 0) {
        obstacles.push(new Obstacle)
        //add more speed after each spawn
        // gamespeed ++ <-- doesn't work.
    }
    for (let i = 0; i < obstacles.length; i++){
        obstacles[i].update()
    }
    // Laptop crashed, must get rid of extra obstacles
    if (obstacles.length > 10) {
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
const stars = []

class Star {
    constructor() {
        this.x = 480,
        this.y = (Math.floor(Math.random() * canvas.height)),
        this.color = "yellow",
        this.height = 20,
        this.width = 20,
        this.alive = true  
    }
    render = function () {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.height, this.width)
    }
    update = function () {
        this.x -= 1
        this.render()
    }
}


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



// let star = new Star(40, 40, "yellow", 20, 20)


//******************* Collision Detection ***************************
const detectHit = () => {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            player.x < obstacles[i].x + obstacles[i].width && 
            player.x + player.width > obstacles[i].x && 
            ((player.y < 0 + obstacles[i].topObstacles && 
            player.y + player.height > 0) || 
            (player.y > canvas.height - obstacles[i].bottomObstacles && 
            player.y - player.height < canvas.height))) {

            // console.log('HIT!')
            player.alive = false
        }
    } 
} 

let pressedJump = false
let frame = 0
let gamespeed = 2

const gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height)
    player.update()
    player.render()
    spawnStars()
    spawnObstacles()
    detectHit()
    if (player.alive === false) {
        console.log("GAMEOVER")
        //insert game over text
        return
    }
    requestAnimationFrame(gameLoop)  
    frame ++ 
    // console.log(frame)
}
gameLoop();

//******************* Collect Detection ***************************

const detectCollect = () => {

}

addEventListener("keydown", function(e){
    // console.log("you pressed", e.code)
    if (e.code === "Space") {
        // player.y -= 50
        pressedJump = true
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