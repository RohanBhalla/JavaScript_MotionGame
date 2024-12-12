let gameState = 0;
let bg;
let tappingCs = [];
let thunder, worldApart,jingle;
let jingleList = [1.2, 1.67, 2.25, 2.84, 3.4, 3.97, 4.54, 5.11, 5.7, 6.28, 6.85, 7.5, 8.09, 8.36, 8.62, 8.91, 9.25, 10.42, 11.58, 12.73, 13.9, 15.04, 15.68, 16.24, 16.51, 16.83, 17.43, 18.59, 19.73, 20.88, 22.07, 23.25, 24.43, 25.04, 25.65, 26.76, 27.03, 27.33, 27.65, 28, 28.52, 29.13, 30.3, 31.38, 32.58, 33.8, 34.89, 36.08, 37.32, 38.48, 39.67, 40.81, 41.97, 43.18, 44.36, 45.56, 46.71];

let thunderList =[1.06, 2.43, 3.86, 5.28, 6.71, 8.16, 9.61, 10.33, 11.03, 12.83, 14.31, 15.3, 16.03, 17.46, 18.85, 20.29, 21.69, 22.43, 23.16, 24.54, 25.97, 27.39, 28.15, 28.84, 30.29, 31.66, 33.13, 33.89, 34.57, 34.93, 35.65, 35.84, 36.05, 36.41, 37.77, 38.84, 39.55, 40.29, 40.61, 41.38, 41.57, 41.78, 42.14, 43.5, 44.62, 45.96, 47.45, 48.84, 50.31];

let worldApartList =[2.25, 4.67, 6.92, 8.87, 10.91, 13.03, 15.19, 17.4, 19.47, 21.45, 23.68, 25.75, 27.98, 28.51, 29.03, 29.53, 30.03, 32.46, 33.75, 34.78, 35.88, 36.95, 38.04, 38.86, 39.15, 40.2, 41.21, 42.32, 43.29, 44.38, 45.47, 46.55, 47.57, 48.67, 49.7, 53.53, 54.48, 55.49, 56, 56.54, 57.08, 57.63, 58.77, 60.84, 61.39, 61.91, 63.03, 65.05, 66.2, 68.28, 69.33, 70.45, 71.5, 73.09, 73.6, 74.14, 74.66, 75.78, 77.77, 78.91, 79.95, 82.03, 83.18, 85.25, 86.3, 87.39];

let count = 3;
let timeStamp = 180;
let tappingPosition = "left";
let musicNum = 1;
let chosenMusic;
let chosenMusicList;
let container = document.getElementById('container');
let video = document.getElementById('video');

let coins = 0;
let credit = 0;

let el1,el2,el3,el4,el5,el6;
let e1,e2,e3,e4;

let snowflakes=[]
let resetFlag = true;

function preload(){
    jingle = loadSound("sounds/JingleBell.mov");
    thunder = loadSound("sounds/thunder.mov");
    worldApart = loadSound("sounds/worldApart.mov");
    font = loadFont('sounds/dream.ttf');

    el1 = loadImage('sounds/el1.png');
    el2 = loadImage('sounds/el2.png');
    el3 = loadImage('sounds/el3.png');
    el4 = loadImage('sounds/el4.png');
    el5 = loadImage('sounds/el5.png');
    el6 = loadImage('sounds/el6.png');

    bg = loadImage('sounds/bg.jpg');
    coins = JSON.parse(localStorage.getItem('coins')) || 0;
}


function setup(){
    let c = createCanvas(960,720);
    video.style.display = 'none';
    c.parent('container');
    c.style.id='canvas';
    canvas.style['border-radius']='25px';
    frameRate = 60;
    jingle.setVolume(0.5);
    thunder.setVolume(0.5);
    worldApart.setVolume(0.5);
    for(let i = 0 ; i< 20; i++){
        let temp = new Snowflake();
        snowflakes.push(temp);
    }

    //still have bug iadd the credit to the coins
    


}

function chooseMusic(musicNum){
    if(musicNum == 0){
        chosenMusic = jingle;
        chosenMusicList = jingleList;
    }
    else if(musicNum == 1){
        chosenMusic = thunder;
        chosenMusicList = thunderList;
    }
    else{
        chosenMusic = worldApart;
        chosenMusicList = worldApartList;
    }
}

function draw() {
  translate(width,0);
  scale(-1,1);
  background(0,200);
  if(detections != undefined){
      if(detections.multiHandLandmarks != undefined){
          //p.drawHands();
          // p.drawParts();
          // drawLandmarks([0, 1], 0);//palm base
          drawLandmarks([4, 5], 60);//thumb
          drawLandmarks([8, 9], 120);//index finger
          drawLandmarks([12, 13], 180);//middle finger
          drawLandmarks([16, 17], 240);//ring finger
          drawLandmarks([20, 21], 300);//pinky
      }
    }
    if(gameState == 0){
      startGame();
 }
 else if(gameState == 1){
      countDown();
 }
 else if(gameState == 2){
      gaming();
 }
 else{
      endGame();
 }
}

function drawHands(){
    for(let i=0; i<detections.multiHandLandmarks.length; i++){
      for(let j=0; j<detections.multiHandLandmarks[i].length; j++){
        let x = detections.multiHandLandmarks[i][j].x * width;
        let y = detections.multiHandLandmarks[i][j].y * height;
        let z = detections.multiHandLandmarks[i][j].z;
        stroke(255);
        strokeWeight(10);
        point(x, y);
      }
    }
  }

function drawLandmarks(indexArray, hue){
    noFill();
    strokeWeight(8);
    for(let i=0; i<detections.multiHandLandmarks.length; i++){
      for(let j=indexArray[0]; j<indexArray[1]; j++){
        let x = detections.multiHandLandmarks[i][j].x * width;
        let y = detections.multiHandLandmarks[i][j].y * height;

        push();
        scale(-1,1);
        stroke(hue, 30, 255);
        ellipse(-x, y,15,15);
        pop();
        checkCollision(x,y);
      }
    }
  }

  
  function countDown(){
    translate(width,0);
    scale(-1,1);
    background(0);
    timeStamp--;
    fill(255);
    strokeWeight(2);
    textFont(font);
    textSize(50);
    text(count,width/2,height/2);
    if(timeStamp % 60 == 0){
        fill(255);
        count --;
        if(count < 0){
            gameState = 2;
        }
    }
}

function startGame(){
    translate(width,0);
    scale(-1,1);
    imageMode(CORNER);
    image(bg,0,0,width,height);
    strokeWeight(1);
    textSize(30);
    textFont(font);
    fill(255);
    text('Click on one song below to start your music journey!',100,100);
    textSize(30);
    text('Orient your hands in front of camera',50,600);
    text('to touch the bubbles to gain credits!', 50,650);
    if(keyIsDown(13)){
        console.log("Enter");
        gameState = 1;
    }
    imageMode(CENTER);
    strokeWeight(10);
    stroke(255);
    fill(130,195,236);
    e1 = ellipse(200,360,150,150);
    image(el1,200,360,200,200);
    fill(203,237,213);
    e2 = ellipse(480,360,150,150);
    image(el2,480,360,200,200);
    fill(235,100,64);
    e3 = ellipse(760,360,150,150);
    image(el3,760,360,150,150);
    mouseOver();

}

function mouseOver(){
    if(mouseX>= 125 && mouseX <= 275 && mouseY>= 285 && mouseY<=435){
        fill(130,195,236); 
        e1 = ellipse(200,360,200,200);
        image(el1,200,360,250,250);
    }
    else if((mouseX >= 405 && mouseX <= 555)&&(mouseY>= 285 && mouseY<=435)){
        fill(203,237,213);
        e2 = ellipse(480,360,200,200);
        image(el2,480,360,250,250);
    }
    else if(mouseX>= 685 && mouseX <= 835 && mouseY>= 285 && mouseY<=435){
        fill(235,100,64);
        e3 = ellipse(760,360,200,200);
        image(el3,760,360,200,200);
    }
}

function mouseClicked(){
    if(gameState == 0){
        if(mouseX>= 125 && mouseX <= 275 && mouseY>= 285 && mouseY<=435){
        musicNum = 0;
        chooseMusic(musicNum);
        gameState = 1;
        }
        else if((mouseX >= 405 &&mouseX <= 555)&&(mouseY>= 285 && mouseY<=435)) {
            musicNum = 1;
            chooseMusic(musicNum);
            gameState = 1;
        }
        else if(mouseX>= 685 && mouseX <= 835 && mouseY>= 285 && mouseY<=435){
            musicNum = 2;
            chooseMusic(musicNum);
            gameState = 1;
        }
        else{
        }
    }
}

function gaming(){

    if(musicNum == 0){
        image(el5,100,600,200,200);
        image(el2,900,50,150,150);
        for(let i = 0; i < snowflakes.length;i++){
            snowflakes[i].displayAndMove();
        }
    }
    if(!chosenMusic.isPlaying()){
        chosenMusic.play();
    }
    let t = chosenMusic.currentTime();
    if(t >= chosenMusicList[0]-0.5 && t <=chosenMusicList[0]-0.45){
        console.log("currentTime: "+t);
        console.log("chosenList: "+chosenMusicList[0]);
        if(tappingPosition == "left"){
            var temp = new tappingC(random(100,450),random(50,height-50));
            tappingPosition = "right";
        }
        else{
            var temp = new tappingC(random(451,700),random(50,height-50));
            tappingPosition = "left";
        }
        tappingCs.push(temp);
        chosenMusicList.splice(0,1);
        console.log("Match");
    }
    else if(t>= chosenMusicList[0]){
        console.log('error in tappingC');
        chosenMusicList.splice(0,1);
    }

    for(let i = 0 ; i < tappingCs.length; i++){
        if(chosenMusicList[i]!= null){
            tappingCs[i].display();
            tappingCs[i].move();
            if(tappingCs[i].state == "remove"){
                tappingCs.splice(i,1);
                i-=1;
         
            }
        }
    }
    if(chosenMusic.currentTime() >= chosenMusic.duration()-0.2){
        console.log("End");
        chosenMusic.pause();
        video.pause();
        gameState = 3;
    }

    push();
    scale(-1,1);
    textSize(15);
    text("Coins: "+credit,-100,50);
    // text("Credits: "+credit,-100,50);
    // text("Coins: "+coins,-100,100);

    pop();

}

function endGame(){
    translate(width,0);
    scale(-1,1);
    background(0);
    if(musicNum == 0){
        image(el5,100,600,200,200);
    }
    fill(255);
    textFont(font);
    textSize(30);
    text('Game Over',width/2,height/2);
    text('You have collected: '+credit+' coins!',width/2,height/2+50);
    fill(255);
    e4=rect(width/2,height/2+100,300,60,20);
    fill(0);
    text('Back to Main',width/2+60,height/2+140);

    if(mouseX >= 490 && mouseX <= 767 && mouseY>= 470 && mouseY<= 510){
        fill(255);
        e4 = rect(width/2,height/2+100,400,80,20);
        fill(0);
        textSize(40);
        text('Back to Main',width/2+80,height/2+150);
        if(mouseIsPressed && resetFlag == true){
            resetFlag = false;
            coins += credit;
            localStorage.setItem('coins', JSON.stringify(coins));
            // localStorage.setItem('coins', JSON.stringify(coins));
            window.location.href = "../index.html";
        }
    }
    //set game state to 0 if button is clicked, and also set crdit to 0
}




function checkCollision(handX,handY){
  for(let i = 0 ; i < tappingCs.length;i++){
    let temp = tappingCs[i];
    if(handX >= temp.x-temp.size/2 && handX <= temp.x+temp.size/2 && handY >= temp.y-temp.size/2 && handY <= temp.y+temp.size/2){
        tappingCs[i].state = "remove";
        if(temp.size >= 25){
            credit +=1;
        }
        tappingCs.splice(i,1);
        i-=1;
    }
}
}

class tappingC{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = 10;
        this.r = 200;
        this.g = 200;
        this.b = 200;
        this.timeStamp = 40;
        this.maxSize = 50;
        this.color = 100;
        this.state = "ok";
    }
    display(){
        noStroke();
        drawingContext.shadowBlur = 50;
        drawingContext.shadowColor = color(this.r,this.g,this.b);
        fill(this.color);
        ellipse(this.x,this.y, this.size,this.size);
    }
    move(){
        if(this.timeStamp >= 0){
            this.size = map(this.timeStamp,40,0,10,this.maxSize);
            this.color = map(this.timeStamp,40,0,100,245);
            if(this.timeStamp >= 20){
                this.r = map(this.timeStamp,40,20,200,173);
                this.g = map(this.timeStamp,40,20,200,255);
                this.b = map(this.timeStamp,40,20,200,47);
            }
            else{
                this.r = map(this.timeStamp,20,0,173,255);
                this.g = map(this.timeStamp,20,0,255,0);
                this.b = map(this.timeStamp,20,0,47,255);
            }
        }
        else{
            this.color = map(this.timeStamp,0,-60,245,50);
            this.size = map(this.timeStamp,0,-60,this.maxSize,45);
            if(this.timeStamp <=-51){
                this.state = "remove";
                this.size = 0;
            }
        }
        this.timeStamp--;

    }
}

class Snowflake{
    constructor(){
        this.x = random(width);
        this.y = random(-100,-20);
        this.speed = random(0.5,2);
    }
    displayAndMove(){
        image(el4,this.x,this.y,20,20,155);

        this.y += this.speed;
        if(this.y > height+20){
            this.x = random(width);
            this.y = random(-50,-20);
            this.speed = random(0.5,2);
        }
    }
}