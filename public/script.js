// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("hello world :o");

// client-side js, loaded by index.html
// run by the browser each time the page is loaded

  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  console.log(canvas)
  ctx.canvas.width = canvas.offsetWidth
  ctx.canvas.height = canvas.offsetHeight
  ctx.lineWidth = 10
  ctx.imageSmoothingEnabled = true;
  const DEFAULTCOLOR = '#111111'
  let stop = true
  const maxColors = 9
  ctx.strokeStyle = "black"
  let pCoords
  let pCoords2

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
  constructor () {
    this.curves = []
  }
  
  appendCurve (curve) {
    this.curves.push(curve);
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

   canvas.addEventListener('click', (event) => {
        let coordinates = trueCoordinates(event)
        draw(coordinates.xLoc, coordinates.yLoc)
        ctx.beginPath()
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
    let canvasLeft = canvas.offsetLeft + canvas.clientLeft
    let canvasTop = canvas.offsetTop + canvas.clientTop
    let x = event.pageX - canvasLeft
    let y = event.pageY - canvasTop
    return {xLoc : x, yLoc : y}
  }

  function draw(x, y) {
    ctx.lineCap = 'round';
    ctx.bezierCurveTo(pCoords2.xLoc, pCoords2.yLoc, pCoords.xLoc, pCoords.yLoc,x,y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x,y)
    pCoords2 = pCoords
    pCoords = {xLoc : x, yLoc : y}
  }

  for (let i = 0; i < maxColors; i++) {
      document.getElementById(`color${i}`).addEventListener('click', (event => {
          ctx.strokeStyle = document.getElementById(`color${i}`).innerHTML;
      }))
  }

  document.getElementById('clear').addEventListener ( 'click', (event => {
    ctx.fillStyle = DEFAULTCOLOR
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
  }))