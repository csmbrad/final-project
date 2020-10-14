// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// client-side js, loaded by index.html
// run by the browser each time the page is loaded

  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  ctx.canvas.width = canvas.offsetWidth
  ctx.canvas.height = canvas.offsetHeight
  ctx.lineWidth = 10
  ctx.imageSmoothingEnabled = true;
  const DEFAULTCOLOR = '#111111'
  const maxColors = 9
  ctx.strokeStyle = "black"
  let pCoords
  //stop controls if the brush is actively drawing or not
  let stop = true
  //inFrame controls if the mouse can actively change the canvas
  let inFrame = false
  
  
class point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class stroke {
  constructor (brushColor, brushSize) {
    this.brushColor = brushColor
    this.brushSize = brushSize
    this.points = []
  }
  
  appendPoint (point) {
    this.points.push(point);
  }

  changeColor(color) {
    this.brushColor = color
  }

  changeSize(brushSize) {
    this.brushSize = brushSize
  }
}

class drawing {
  constructor () {
    this.strokes = []
  }

  appendStroke (stroke) {
    this.strokes.push(stroke);
  }
}

let picture = new drawing()
let currentStroke = new stroke(ctx.strokeStyle, ctx.lineWidth)

//mouse over/out
  canvas.addEventListener('mouseover', (event => {
    ctx.beginPath()
    stop = true
    pCoords = trueCoordinates(event)
  }))

  canvas.addEventListener('mouseout', (event => {
    stop = true
    inFrame = false
    if (currentStroke.points.length > 0) {
    picture.appendStroke(currentStroke)
    currentStroke = new stroke(ctx.strokeStyle, ctx.lineWidth)
    console.log(picture)
  }
  }))

  canvas.addEventListener('click', (event => {
    if (inFrame) {
      pCoords = trueCoordinates(event)
      // let pointStroke = new stroke(ctx.strokeStyle, ctx.lineWidth)
      // pointStroke.appendPoint(pCoords)
      // picture.appendStroke(pointStroke)
      draw(pCoords.x, pCoords.y)
      ctx.beginPath()
    }
  }))

  
  canvas.addEventListener('mousedown', (event => {
    stop = false
    inFrame = true
    currentStroke = new stroke(ctx.strokeStyle, ctx.lineWidth)
    pCoords = trueCoordinates(event)
  }))

  canvas.addEventListener('mousemove', (event => {
    if (!stop) {
      pCoords = trueCoordinates(event)
      currentStroke.appendPoint(pCoords)
      draw(pCoords.x, pCoords.y)
    }
  }))
    
  canvas.addEventListener('mouseup', (event => {
    ctx.beginPath()
    stop = true
    if (currentStroke.points.length > 0) {
      picture.appendStroke(currentStroke)
      currentStroke = new stroke(ctx.strokeStyle, ctx.lineWidth)
      console.log(picture)
    }
  }))


  function trueCoordinates(event) {
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft
    let canvasTop = canvas.offsetTop + canvas.clientTop
    let x = event.pageX - canvasLeft
    let y = event.pageY - canvasTop
    return new point(x,y)
  }

  function draw(x, y) {
    ctx.lineCap = 'round';
     //ctx.bezierCurveTo(pCoords2.xLoc, pCoords2.yLoc, pCoords.xLoc, pCoords.yLoc,x,y)
    ctx.lineTo(x,y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x,y)
  }

  for (let i = 0; i < maxColors; i++) {
      document.getElementById(`color${i}`).addEventListener('click', (event => {
          ctx.strokeStyle = document.getElementById(`color${i}`).innerHTML
          currentStroke.changeColor(ctx.strokeStyle)
      }))
  }

  document.getElementById('clear').addEventListener ( 'click', (event => {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
  }))


  
