// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// client-side js, loaded by index.html
// run by the browser each time the page is loaded


//canvas variables
const canvas = document.getElementById('messageCanvas')
const ctx = canvas.getContext('2d')
ctx.canvas.clientWidth = 300
ctx.canvas.clientHeight = 300
ctx.lineWidth = 10
ctx.imageSmoothingEnabled = true;
const DEFAULTCOLOR = '#111111'
let stop = true
ctx.strokeStyle = "black"
let pCoords
let pCoords2

//timer variables
let timerStarted = false
let drawingTimeLimit = 10
let drawingTimeout



canvas.addEventListener('click', (event) => {
    if (!timerStarted) {

        //start timer
        drawingTimeout = setInterval(timer, 1000)
        timerStarted = true

        //disable closing window after starting a drawing
        document.querySelector('#closeDrawingWindow').disabled = true
    } else {
        let coordinates = trueCoordinates(event)
        draw(coordinates.xLoc, coordinates.yLoc)
        ctx.beginPath()
    }
}, false)


canvas.addEventListener('mousedown', (event => {
    stop = false
    let coordinates = trueCoordinates(event)
    pCoords = coordinates;
}))

canvas.addEventListener('mousemove', (event => {
    if (stop) {
        pCoords2 = trueCoordinates(event)
        return
    }
    let coordinates = trueCoordinates(event)
    draw(coordinates.xLoc, coordinates.yLoc)
}))

canvas.addEventListener('mouseup', (event => {
    ctx.beginPath()
    stop = true;
}))

function trueCoordinates(event) {
    let rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.x
    let y = event.clientY - rect.y
    return {xLoc: x, yLoc: y}
}

function draw(x, y) {
    ctx.lineCap = 'round';
    ctx.bezierCurveTo(pCoords2.xLoc, pCoords2.yLoc, pCoords.xLoc, pCoords.yLoc, x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
    pCoords2 = pCoords
    pCoords = {xLoc: x, yLoc: y}
}


//get all color buttons
color_buttons = document.querySelectorAll('[id^=color_]')
//add stroke style to each button
color_buttons.forEach(button => button.addEventListener('click', () => {
    ctx.strokeStyle = button.id.split('_')[1]
}))


//set pen size
document.querySelector('#penSize').addEventListener('input', (event) => {
    ctx.lineWidth = event.target.value
})


//close drawing window and clear canvas
document.querySelector('#closeDrawingWindow').addEventListener('click', () => {
    ctx.fillStyle = DEFAULTCOLOR
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
})


let timeRemaining = drawingTimeLimit
function timer() {
    if (timeRemaining > 0) {

        timeRemaining--

        //update timer element
        document.querySelector('#drawingTimer').innerHTML = `${timeRemaining}s`
    } else {

        //reset time remaining
        timeRemaining = drawingTimeLimit
        document.querySelector('#drawingTimer').innerHTML = ''

        //clear setTimeout
        clearTimeout(drawingTimeout)

        //reset timer flag
        timerStarted = false

        //enable the close button
        document.querySelector('#closeDrawingWindow').disabled = false

        //trigger close button
        document.querySelector('#closeDrawingWindow').click()

    }
}



class point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class curve {
    constructor(point1, point2, point3) {
        this.point1 = point1
        this.point2 = point2
        this.point3 = point3
    }
}

class stroke {
    constructor() {
        this.curves = []
    }

    appendCurve(curve) {
        this.curves.push(curve);
    }
}

class drawing {
    constructor() {
        this.strokes = []
    }

    appendStroke(stroke) {
        this.strokes.push(stroke);
    }
}

