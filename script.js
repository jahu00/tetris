// Tetris script

const boardWidth = 10;
const boardHeight = 20;
const previewWidth = 4;
const previewHieght = 4;
const frameTime = 1000 / 60;
const states = {
  Over: "Over",
  Running: "Running",
  Paused: "Paused"
}

let state = states.Over;
let speed;
let currentTime;
let score;
let level = 1;
let totalLines = 0;

let currentShape;// = getRandomShape();
let nextShape;
let currentX;
let currentY;

let board = createGameBoard();
let preview = createPreview();

function addPoints(value){
  setScore(score + value);
}

function setScore(value){
  score = value;
  const elem = document.getElementById("score");
  elem.innerHTML = score;
}

function setLevel(value){
  level = value;
  const elem = document.getElementById("level");
  elem.innerHTML = level;
  speed = getSpeed(level)
}

function createPreview() {
  return createBoard(previewHieght, previewWidth);
}

function createGameBoard() {
  return createBoard(boardHeight, boardWidth);
}

function createBoard(height, width) {
  const board = [];
  for (let row = 0; row < height; row++) {
    board[row] = new Array(width).fill(0);
  }
  return board;
}

function drawGameBoard() {
  const elem = document.getElementById('game-board');
  drawBoard(board, elem);
}

function drawPreview() {
  const elem = document.getElementById('preview');
  drawBoard(preview, elem);
}

function drawBoard(board, target) {
  // Draw the board on the canvas
  target.innerHTML = '';
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (board[row][col] === 1) {
        cell.style.backgroundColor = '#000';
      }
      target.appendChild(cell);
    }
  }
}

function setState(newState){
  console.log("State set to: " + newState);
  state = newState;
  const message = document.querySelector(".message");
  if (state == "Running"){
    message.style.display = "none";
  } else {
    message.style.display = "block";
  }
  if (state == "Over"){
    message.innerHTML = "GAME OVER";
  } else if (state == "Paused") {
    message.innerHTML = "PAUSED";
  }

}

// Shape definitions
const shapes = [
  [[1, 1, 1, 1]], // I shape
  [[1, 1], [1, 1]], // O shape
  [[1, 1, 0], [0, 1, 1]], // T shape
  [[1, 1, 1], [0, 1, 0]], // L shape
  [[1, 1, 1], [1, 0, 0]] // J shape
];

function getRandomShape() {
  let shape = shapes[Math.floor(Math.random() * shapes.length)];
  let rotations = Math.floor(Math.random() * 4);
  for (let i = 0; i <= rotations; i++) {
    shape = rotateShape(shape);
  }
  return shape;
}

function getNextShape() {
  preview = createPreview();
  nextShape = getRandomShape();
  x = Math.floor(previewWidth / 2) - Math.floor(nextShape[0].length / 2);
  y = Math.floor(previewHieght / 2) - Math.floor(nextShape.length / 2);
  drawShape(nextShape, x, y, preview);
}

function startNewGame(){
  board = createGameBoard();
  currentShape = getRandomShape();
  //nextShape = getRandomShape();
  getNextShape();
  drawPreview();
  placeNewShape(currentShape);
  drawCurrentShape();
  drawGameBoard();
  setState(states.Running);
  currentTime = Date.now();
  setScore(0);
  setLevel(1);
  totalLines = 0;
}

function drawCurrentShape(){
  drawShape(currentShape, currentX, currentY, board);
}

function drawShape(shape, x, y, board) {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 1) {
        const boardX = x + col;
        const boardY = y + row;
        if (boardX >= 0 && boardX < boardWidth && boardY >= 0 && boardY < boardHeight) {
          board[boardY][boardX] = 1;
        }
      }
    }
  }
}

function clearCurrentShape() {
  clearShape(currentShape, currentX, currentY, board);
}

function clearShape(shape, x, y, board) {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 1) {
        const boardX = x + col;
        const boardY = y + row;
        if (boardX >= 0 && boardX < boardWidth && boardY >= 0 && boardY < boardHeight) {
          board[boardY][boardX] = 0;
        }
      }
    }
  }
}

function isValidMove(shape, x, y) {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] === 1) {
        const boardX = x + col;
        const boardY = y + row;
        if (boardX < 0 || boardX >= boardWidth || boardY >= boardHeight || (boardY >= 0 && board[boardY][boardX] === 1)) {
          return false;
        }
      }
    }
  }
  return true;
}

function moveShape(dx, dy) {
  clearCurrentShape();
  const moveValid = isValidMove(currentShape, currentX + dx, currentY + dy)
  if (moveValid) {
    currentX += dx;
    currentY += dy;
  }
  drawCurrentShape();
  return moveValid;
}

function rotateShape(shape) {
  const newShape = [];
  for (let col = 0; col < shape[0].length; col++) {
    newShape[col] = [];
    for (let row = shape.length - 1; row >= 0; row--) {
      newShape[col][shape.length - row - 1] = shape[row][col];
    }
  }
  return newShape;
}

function rotateCurrentShape() {
  const newShape = rotateShape(currentShape);
  clearCurrentShape()
  if (isValidMove(newShape, currentX, currentY)) {
    currentShape = newShape;
  }
  drawCurrentShape();
}

document.addEventListener('keydown', (e) => {
  //console.log(e.key)
  switch (e.key) {
    case 'a':
      moveShape(-1, 0);
      break;
    case 'd':
      moveShape(1, 0);
      break;
    case 's':
      if (moveShape(0, 1))
      {
        addPoints(1);
      }
      break;
    case 'w':
      rotateCurrentShape();
      break;
    case 'Enter':
      if (state == states.Over){
        startNewGame();
      } else if (state == states.Running) {
        setState(states.Paused);
      } else if (state == states.Paused) {
        setState(states.Running);
      }

  }
});

function checkLines() {
  let linesCleared = 0;
  for (let row = boardHeight - 1; row >= 0; row--) {
    if (board[row].every(cell => cell === 1)) {
      board.splice(row, 1);
      board.unshift(new Array(boardWidth).fill(0));
      //currentY++;
      row++;
      linesCleared++;
    }
  }
  return linesCleared;
}

function getPoints(linesCleared, level){
  switch (linesCleared)
  {
    case 0:
      return 0;
    case 1:
      return 40 * level;
    case 2:
      return 100 * level;
    case 3:
      return 300 * level;
    default:
      return 1200 * level;
  }
}

function placeNewShape(shape) {
  currentX = Math.floor(boardWidth / 2) - Math.floor(shape[0].length / 2);
  currentY = (shape.length - 1) * -1;
}

function getSpeed(level) {
  if (level < 11) {
    return (11 - level) * frameTime * 10;
  }
  if (level < 21) {
    return (21 - level) * frameTime;
  }
  return frameTime;
}

function getLevel(totalLines) {
  const newLevel = Math.floor(totalLines / 10) + 1;
  return newLevel;
}

function gameLoop() {
  if (state != states.Running)
  {
    return;
  }
  const now = Date.now();
  //console.log("Running " + (now - currentTime ), speed);
  if (now - currentTime >= speed)
  {
    currentTime = now;
    clearCurrentShape()
    if (!isValidMove(currentShape, currentX, currentY + 1)) {
      drawCurrentShape();
      const linesCleared = checkLines();
      if (linesCleared > 0)
      {
        totalLines += linesCleared;
        const points = getPoints(linesCleared, level);
        addPoints(points);
        const newLevel = getLevel(totalLines);
        if (level != newLevel){
          setLevel(newLevel);
        }
      }
      currentShape = nextShape;
      getNextShape();
      drawPreview();
      placeNewShape(currentShape);
      if (!isValidMove(currentShape, currentX, currentY)) {
        setState(states.Over);
        return;
      }
      drawCurrentShape();
      //drawShape(currentShape, currentX, currentY);
    } else {
      moveShape(0, 1);
    }
  }
  drawGameBoard();
}

setScore(0);
setLevel(1);
drawPreview();
drawGameBoard();
setState(states.Over);
setInterval(gameLoop, frameTime / 2); // 60 FPS