const canvas = document.getElementById('canvasLoad')
const ctx = canvas.getContext('2d')

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

function draw(x, y) {
  ctx.lineCap = 'round';
  ctx.lineTo(x,y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x,y)
}

function loadImage() {
  for (let line of picture.strokes) {
    ctx.strokeStyle = line.brushColor
    ctx.lineWidth = line.brushSize
    for (let dot of line.points) {
      draw(dot.x, dot.y)
    }
    ctx.beginPath()
  }
}

