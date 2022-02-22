// console.log("test")
// grabbing html elemnts and setting them up as variables to manipulate
const game = document.getElementById("canvas")

// getting game's context, which allows to specify where to put things and how big to make them.
const ctx = game.getContext("2d")

// now you can set attributes to the game,
// to set heigh and width based on COMPUTED STYLE
// it basically means reading how it's displaying in the current state of the browser
game.setAttribute("width", getComputedStyle(game)["width"])
game.setAttribute("height", getComputedStyle(game)["height"])

//*********************** Class Constructor for Ball *******************************

class Ball {
    constructor(x, y, color, height, width) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.height = height,
        this.width = width,
        // this.speedX = 0,
        this.speedY = 0,
        this.gravity = 0,
        this.gravitySpeed = 3,
        this.alive = true,
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.height, this.width)
        },
        // this.update = function () {
        //     ctx = game
        //     ctx.fillStyle = this.color
        //     ctx.fillRect(this.x, this.y, this.height, this.width)
        // }
        this.newPos = function () {
            if(this.y > canvas.height - this.height) {
              this.y = canvas.height - this.height
              this.vy = 0
            }
            this.gravitySpeed += this.gravity
            // this.x += this.speedX
            this.y += this.speedY + this.gravitySpeed
        }
    }
}

//******************* Class Constructor for Obstacles ***************************
//need new wall to appear every so often
//wall should appear a end of canvas <--- done
//should work its way to 0 x coordinate


// should be singular (below)
class Obstacles {
    constructor(x, y, color, height, width) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.height = height,
        this.width = width,
        this.alive = true,
        this.moveObstacles = function () {
            if (this.x < 0) {
                this.x -= 1
            }
        },
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.height, this.width)
        }
    } 
}

//******************* Class Constructor for Stars ***************************

class Star {
    constructor(x, y, color, height, width) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.height = height,
        this.width = width,
        this.alive = true,
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.height, this.width)
        }
    }
}


let ball = new Ball(40, 200, "black", 46, 46) // <---- correct placement
// let ball = new Ball(480, 100, "black", 46, 46) // <-------detectHit (test) placement
let obstacles = new Obstacles(920, 250, "white", 50, 250)
let star = new Star(40, 40, "yellow", 20, 20)

// let frame = 0

const gameLoop = () => {

    // the "win condition is to collect  # of stars"
    // don't touch the obastacles <-- collision detection
    // otherwise game will end 
    if (ball.alive) {
        
    }
    ctx.clearRect(0, 0, game.width, game.height)
    obstacles.render()
    obstacles.moveObstacles()
    star.render() 
    ball.render()
    ball.newPos()
    ball.update()
    // requestAnimationFrame(gameLoop)   
}



//******************* Collision Detection ***************************

const detectHit = () => {
    // if () {

    // }
}


const jump = (e) => {
    // spacebar keycode ----> 32
    switch (e.keyCode) {
        case (32):
            ball.y -= 60
            break
    }
}


document.addEventListener("DOMContentLoaded", function () {
    
    document.addEventListener("keydown", jump)
    setInterval(gameLoop, 30)

})