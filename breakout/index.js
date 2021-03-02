var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius=10;
var color = "#0095DD"

var lives=3;

//brick-y brick info
var brickRowCount =5;
var brickColumnCount=5;
var brickWidth=75;
var brickHeight=20;
var brickPadding=10;
var brickOffsetTop=30;
var brickOffsetLeft=30;
var mySound = new sound("bell_ding1.wav");
var wallSound = new sound("wallBounce.wav");
var gameOver = new sound("gameOver.mp3")

//le score
var score =0;

//build up the bricks
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status:1, color: randoColor() };
    }//end for
}//end for


document.addEventListener("mousemove",mouseMoveHandler,false);
function mouseMoveHandler(e){
  var relativeX=e.clientX-canvas.offsetLeft;
  if(relativeX>0 && relativeX<canvas.width){
    paddleX=relativeX-paddleWidth/2;
  }
}//end mousemovehandler
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//booleans tracking if a button is pressed or not
var rightPressed = false;
var leftPressed = false;

//paddle definition
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

function keyDownHandler(e){
  if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft"){
    leftPressed = true;
  }
}//end keyDownHandler

function keyUpHandler(e){
  if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft"){
    leftPressed = false;
  }
}//end keyUpHandler

//handles collision with le bricks
function collisionDetection(){
  for(var c=0; c<brickColumnCount; c++){
    for(var r=0; r<brickRowCount; r++){
      var b =bricks[c][r];
      //calculations yo yo yo
      if (b.status==1){
        if ( x> b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
          dy = -dy;
          b.status=0;
          score++;
          mySound.play();
          if (score == brickRowCount*brickColumnCount){
            alert("A WINNER IS YOU!");
            document.location.reload();
            //clearInterval(interval);//needed for chrome to end game;
          }
        }
      }
    }
  }
}//end collisionDetection

function drawScore(){
  ctx.font="16px Arial";
  ctx.fillStyle="#0095DD";
  ctx.fillText("Score: "+ score,8,20);
}//end drawScore

function drawLives(){
  ctx.font ="16px Arial";
  ctx.fillStyle="#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65,20);
}//end drawlives


function drawBall() {
  ctx.beginPath();

  ctx.arc(x,y, ballRadius,0,Math.PI*2);
  ctx.fillStyle=color;
  ctx.fill();
  ctx.closePath();
}//end drawBall


function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth,paddleHeight);
  ctx.fillStyle="#0095DD";
  ctx.fill();
  ctx.closePath();
}//end drawPaddle

function sound(src){
  this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function drawBricks() {
  for(var c=0; c<brickColumnCount; c++){
    for(var r=0; r<brickRowCount; r++){
      if (bricks[c][r].status==1){
        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY=(r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x=brickX;
        bricks[c][r].y=brickY;
        ctx.beginPath();
        ctx.rect(brickX,brickY,brickWidth,brickHeight);
        ctx.fillStyle=bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }

    }
  }
}//end drawBricks


function randoColor() {
  return "#" + Math.floor(Math.random()*16777215).toString(16);
}//end randoColor

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  drawBricks();
  x += dx;
  y += dy;
  //if ball hits top or bottom edge
  //reverse it

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
    //change to a rando color
    color = randoColor();
    wallSound.play();
  }

  if(y + dy < ballRadius) {
      dy = -dy;
      wallSound.play();
  }
  else if (y + dy > canvas.height-ballRadius){

    //did we hit the paddle
    if(x > paddleX && x < paddleX + paddleWidth){
      //change to a rando color
      color = randoColor();
      dy = -dy;
    }
    //nah we didn't you lose a live brah. or you ded.
    else {
      lives--;
      if(!lives){
        gameOver.play();
        alert("GAME OVER");
        gameOver.play();
        document.location.reload();
        //clearInterval(interval);//needed for chrome to end game
      }
      else{
        x=canvas.width/2;
        y=canvas.height-30;
        dx=2;
        dy=-2;
        paddleX=(canvas.width-paddleWidth)/2;
      }

    }

  }


  if (rightPressed){
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width){
      paddleX = canvas.width - paddleWidth;
    }
  }

  if (leftPressed){
    paddleX -= 7;
    if (paddleX <0){
      paddleX =0;
    }
  }
  requestAnimationFrame(draw);
}//end draw

draw()
