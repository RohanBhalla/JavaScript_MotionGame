let capture;
let poseNet;
let poses = [];
let readyToGo = false;
let facesReady = false;
let game_state = 0;
let pose1 = [];
let pose2 = [];
let pose3 = [];
let count = 300;
let rightHipX, rightHipY;
let leftHipX, lefthipY;
let checkDist;
let pose1_blue, pose1_green, pose1_red;
let pose2_blue, pose2_green, pose2_red;
let pose3_blue, pose3_green, pose3_red;
let start, font, hat, hat2;
let coin_bgm, lose_bgm;
let walls = [];
let wanderers = [];
let time = 0;
let HP = 3;
let credit = -1;
let gap = 200;


let startGame = false;

//Face Mesh (variables)
let predictions = [];
let itemType;

//Image variables for face mesh
let santaHatImg, reindeerHatImg, reindeerNoseImg, pixelGlassesImg;
let glasses1Img, glasses2Img, santaMaskImg, winterHatImg, christmasHatImg, reindeerMaskImg, noneImg;
//Currency and item selection
let coins, selectedItem;

let retrievedObjName;
let retrievedObjType;
let retrievedObjImg;
let itemIndex;

let itemObject;
let items = [];

function preload(){
    pose1_blue = loadImage("images/pose1_blue.png");
    pose1_green = loadImage("images/pose1_green.png");
    pose1_red = loadImage("images/pose1_red.png");
    pose2_blue = loadImage("images/pose2_blue.png");
    pose2_green = loadImage("images/pose2_green.png");
    pose2_red = loadImage("images/pose2_red.png");
    pose3_blue = loadImage("images/pose3_blue.png");
    pose3_green = loadImage("images/pose3_green.png");
    pose3_red = loadImage("images/pose3_red.png");
    start = loadImage("images/start.png");
    hat = loadImage("images/hat.png");
    hat2 = loadImage("images/hat2.png");
    candy = loadImage("images/candy.png");
    font = loadFont("images/retro.ttf");
    coin_bgm = loadSound("sounds/coin.mp3");
    lose_bgm = loadSound("sounds/lose.mp3");


    //Face Mesh (preload)
    coins = JSON.parse(localStorage.getItem('coins')) || 0;
    // coins = 200;
    selectedItem = JSON.parse(localStorage.getItem('selectedItem')) || null;
    santaHatImg = loadImage("../images/items/santaHat.png");
    reindeerHatImg = loadImage("../images/items/reindeerHat.png");
    reindeerNoseImg = loadImage("../images/items/redNose.png");
    glasses1Img = loadImage("../images/items/glasses1.png");
    glasses2Img = loadImage("../images/items/glasses2.png");
    santaMaskImg = loadImage("../images/items/santaMask.png");
    reindeerMaskImg = loadImage("../images/items/reindeerMask.png");
    christmasHatImg = loadImage("../images/items/christmasHat.png");
    winterHatImg = loadImage("../images/items/winterHat.png");
    noneImg = loadImage("../images/items/none.png");

    
}

function setup(){
    let c = createCanvas(960, 720);
    c.parent("container");
    capture = createCapture(VIDEO);
    capture.size(width, height);


    // 

    //Facemesh
    // const facemesh = ml5.facemesh(capture, faceModelReady);
    

    const facemesh = ml5.facemesh(capture, function() {
        console.log('FaceMesh model is ready!');
        // Once FaceMesh is loaded, load PoseNet
        loadPoseNet();
      });

    facemesh.on('predict', gotResults);

    // poseNet = ml5.poseNet(capture, modelReady);
    
    // video.hide();
    colorMode(HSB);
    noStroke();


    textAlign(CENTER, CENTER);
    capture.hide();

    noiseDetail(24);
    for (let x = 0; x < start.width; x += 50) {
        for (let y = 0; y < start.height; y += 50) {
            let strip = createGraphics(50, 50);
            strip.copy(start, x, y, 50, 50, 0, 0, 50, 50);
            wanderers.push(new Wanderer(x, y, strip));
        }
    }

    //Face Mesh  + Object Code below
    items.push(new Item("Santa Hat", "hat", santaHatImg));
    items.push(new Item("Reindeer Hat", "hat", reindeerHatImg));
    items.push(new Item("Reindeer Nose", "nose", reindeerNoseImg));
    items.push(new Item("Glasses Style 1", "glasses", glasses1Img));
    items.push(new Item("Christmas Hat", "hat", christmasHatImg));
    items.push(new Item("Santa Mask", "mask", santaMaskImg));
    items.push(new Item("Reindeer Mask", "mask", reindeerMaskImg));
    items.push(new Item("Winter Hat", "hat", winterHatImg));
    items.push(new Item("Nothing", "none", noneImg));

    // Update the unlocked status based on local storage
    for (let i = 0; i < items.length; i++) {
        items[i].unlocked = JSON.parse(localStorage.getItem(`item_${i}_unlocked`)) || false;
    }
    items[items.length - 1].unlocked = true;    

    // Retrieve the object from local storage
    retrievedObjName = localStorage.getItem('selectedItemName') || "nada";
    retrievedObjType= localStorage.getItem('selectedItemType') || "nada";
    // retrievedObjImg = localStorage.getItem('selectedItemImg');

    console.log(retrievedObjName);
    console.log(retrievedObjType);
    // console.log(retrievedObjImg);
    itemIndex = imageLookup();
    console.log("Index: " + itemIndex);

}

function loadPoseNet() {
    poseNet = ml5.poseNet(capture, function() {
      console.log('PoseNet model is ready!');
      // Both models are now loaded, proceed with the game setup
      poseNet.on('pose',gotPoses);
      startGame = true;
    //   startGame();
    });
  }

function draw(){
    background(0, 10);
    textFont(font);
    if(startGame){
        //game starts
        if(game_state == 0){
            for (let i = 0; i < wanderers.length; i++) {
                if(frameCount % 180 == 0){
                    if(wanderers[i].move == 0){
                        wanderers[i].move = 1;
                    }
                    else{
                        wanderers[i].move = 0;
                    }
                }
                wanderers[i].moveAndDisplay();
            }
            textSize(30);
            fill(200, 0, 200);
            text("Collect Your Postures Before Game", 390, 100)
            text("Click To Collect", 200, 150);
            if(mouseIsPressed){
                game_state = 1;
            }
        }
        //collect pose1
        else if(game_state == 1){
            let pose1_1 = [];
            let pose1_2 = [];
            let pose1_3 = [];
            if(count <= 0){
                game_state = 2;
                count = 330;
            }
            else if(count <= 80){
                imageMode(CENTER);
                image(hat, 400, height / 2 - 40);
                imageMode(CORNER);
                textSize(30);
                fill(255);
                text("Pose1 Collected", width / 2, height / 2);
                count--;
            }
            else if(count <= 100){
                push();
                translate(width,0);
                scale(-1, 1);
                image(capture, 0, 0, width, height);
                pop();
                image(pose1_blue, 0, 0);
                textSize(30);
                fill(0);
                text("Collecting Pose1", 200, 80);
                recordPose(pose1_3);
                for(let i = 0; i < pose1_1.length; i++){
                    pose1.push((pose1_1[i] + pose1_2[i] + pose1_3[i]) / 3);
                }
                rightHipX = pose1[16];
                rightHipY = pose1[17];
                leftHipX = pose1[14];
                lefthipY = pose1[15];
                checkDist = dist(pose1[0], pose1[1], pose1[2], pose1[3]);
                drawHip();
                recordPose(pose1);
                count--;
            }
            else if(count <= 120){
                count--;
                push();
                translate(width,0);
                scale(-1, 1);
                image(capture, 0, 0, width, height);
                pop();
                image(pose1_blue, 0, 0);
                textSize(30);
                fill(0);
                text("Collecting Pose1", 200, 80);
                recordPose(pose1_2);
            }
            else{
                count--;
                push();
                translate(width,0);
                scale(-1, 1);
                image(capture, 0, 0, width, height);
                pop();
                image(pose1_blue, 0, 0);
                textSize(30);
                fill(0);
                text("Collecting Pose1", 200, 80);
                recordPose(pose1_1);
            }
        }
        //collect pose2
        else if(game_state == 2){
            if(count <= 0){
                game_state = 3;
                count = 360;
            }
            else if(count <= 80){
                imageMode(CENTER);
                image(hat2, 400, height / 2 - 40);
                imageMode(CORNER);
                textSize(30);
                fill(255);
                text("Pose2 Collected", width / 2, height / 2);
                count--;
            }
            else{
                push();
                translate(width,0);
                scale(-1, 1);
                image(capture, 0, 0, width, height);
                pop();
                image(pose2_blue, 0, 0); 
                fill(0, 0, 200, 200);
                ellipse(rightHipX, rightHipY, 20, 20);
                ellipse(leftHipX, lefthipY, 20, 20);
                textSize(30);
                fill(0);
                text("Collecting Pose2", 200, 80);
                drawHip();
                recordPose(pose2);
                count--;
            }
        }
        //collect pose3
        else if(game_state == 3){
            if(count <= 0){
                game_state = 4;
                count = 330;
            }
            else if(count <= 60){
                textSize(30);
                fill(255);
                text("Ready For The Game", width / 2, height / 2);
                count--;
            }
            else if(count <= 120){
                imageMode(CENTER);
                image(hat, 400, height / 2 - 40);
                imageMode(CORNER);
                textSize(30);
                fill(255);
                text("Pose3 Collected", width / 2, height / 2);
                count--;
            }
            else{
                push();
                translate(width,0);
                scale(-1, 1);
                image(capture, 0, 0, width, height);
                pop();
                image(pose3_blue, 0, 0); 
                fill(0, 0, 200, 200);
                ellipse(rightHipX, rightHipY, 20, 20);
                ellipse(leftHipX, lefthipY, 20, 20);
                drawHip();
                textSize(30);
                fill(0);
                text("Collecting Pose3", 200, 80);
                recordPose(pose3);
                count--;
            }  
        }
        //gaming
        else if(game_state == 4){
            if(HP <= 0){
                game_state = 5;
            }
            push();
            translate(width,0);
            scale(-1, 1);
            image(capture, 0, 0, width, height);
            pop();
            if(time % gap == 0){
                walls.push(new Wall(width / 2, height / 2, 0));
            }
            for(let i = 0; i < walls.length; i++){
                walls[i].moveAndDisplay();
                walls[i].count++;
                if(walls[i].count == 270){
                    if(walls[i].select <= 1){
                        //if the poseture is correct
                        if(checkPose(pose1)){
                            coin_bgm.play();
                            walls[i].check = 1;
                        }
                        // if not
                        else{
                            lose_bgm.play();
                            walls[i].check = 2;
                            HP--;
                        }
                    }
                    else if(walls[i].select <= 2){
                        if(checkPose(pose2)){
                            coin_bgm.play();
                            walls[i].check = 1;
                        }
                        else{
                            walls[i].check = 2;
                            lose_bgm.play();
                            HP--;
                        }
                    }
                    else{
                        if(checkPose(pose3)){
                            coin_bgm.play();
                            walls[i].check = 1;
                        }
                        else{
                            lose_bgm.play();
                            walls[i].check = 2;
                            HP--;
                        }
                    }
                }
                if(walls[i].count >= 300){
                    walls.splice(i, 1);
                }
            }
            fill(0, 0, 200, 200);
            ellipse(rightHipX, rightHipY, 20, 20);
            ellipse(leftHipX, lefthipY, 20, 20);
            drawHip();
            textSize(25);
            fill(0);
            text("Credit: " + credit, 850, 40);
            text("HP: " + HP, 850, 70);
            if(time % 360 == 0){
                credit++;
            }
            if(time >= 720){
                gap = 170;
            }
            if(time >= 1440){
                gap = 100;
            }
            if(time >= 1700){
                gap = 70;
            }
            time++;
        }
        //game over
        else if(game_state ==5){
            textSize(30);
            fill(255);
            imageMode(CENTER);
            image(hat2, 400, height / 2 - 40);
            imageMode(CORNER);
            text("Game Over", width / 2, height / 2);
            text("Click to return to home screen", 400, height / 3);


            //Save Collected coins when game is over
        }
        // capture.hide();

        drawKeypoints(items[itemIndex].type,items[itemIndex].graphic);
        // basicKeypoints();
    }
    else {
        textSize(50);
        textAlign(CENTER);
        fill(255);
        text("Model Loading...", width/2, height/2);
    }
}

function mousePressed()
{
    if(game_state == 5){
        coins += credit;
        localStorage.setItem('coins', JSON.stringify(coins));
        window.location.href = "../index.html";

    }
}
function modelReady() {
    console.log("Poses ready!");
    readyToGo = true;
}

function faceModelReady() {
    if(readyToGo == true){
        facesReady = true;
        console.log('Facemesh model ready');
    }
}

function gotResults(answers) {
    predictions = answers;
}

function gotPoses(results) {
    poses = results;
}
  

function recordPose(collect){
    if (poses.length > 0 && poses[0].pose.nose) {
        let noseX = poses[0].pose.nose.x;
        let noseY = poses[0].pose.nose.y;
        collect[0] = noseX;
        collect[1] = noseY;
    }
    if(poses.length > 0 && poses[0].pose.leftShoulder){
        let leftShoulderX = poses[0].pose.leftShoulder.x;
        let leftShoulderY = poses[0].pose.leftShoulder.y;
        collect[2] = leftShoulderX;
        collect[3] = leftShoulderY; 
    }
    if(poses.length > 0 && poses[0].pose.rightShoulder){
        let rightShoulderX = poses[0].pose.rightShoulder.x;
        let rightShoulderY = poses[0].pose.rightShoulder.y;
        collect[4] = rightShoulderX;
        collect[5] = rightShoulderY; 
    }
    if(poses.length > 0 && poses[0].pose.leftElbow){
        let leftElbowX = poses[0].pose.leftElbow.x;
        let leftElbowY = poses[0].pose.leftElbow.y;
        collect[6] = leftElbowX;
        collect[7] = leftElbowY;
    }
    if(poses.length > 0 && poses[0].pose.rightElbow){
        let rightElbowX = poses[0].pose.rightElbow.x;
        let rightElbowY = poses[0].pose.rightElbow.y;
        collect[8] = rightElbowX;
        collect[9] = rightElbowY;
    }
    if(poses.length > 0 && poses[0].pose.leftWrist){
        let leftWristX = poses[0].pose.leftWrist.x;
        let leftWristY = poses[0].pose.leftWrist.y;
        collect[10] = leftWristX;
        collect[11] = leftWristY;
    }
    if(poses.length > 0 && poses[0].pose.rightWrist){
        let rightWristX = poses[0].pose.rightWrist.x;
        let rightWristY = poses[0].pose.rightWrist.y;
        collect[12] = rightWristX;
        collect[13] = rightWristY;
    }
    if(poses.length > 0 && poses[0].pose.leftHip){
        let leftHipX = poses[0].pose.leftHip.x;
        let leftHipY = poses[0].pose.leftHip.y;
        collect[14] = leftHipX;
        collect[15] = leftHipY;
    }
    if(poses.length > 0 && poses[0].pose.rightHip){
        let rightHipX = poses[0].pose.rightHip.x;
        let rightHipY = poses[0].pose.rightHip.y;
        collect[16] = rightHipX;
        collect[17] = rightHipY;
    }
}

function checkPose(collect){
    if(poses.length > 0 ){
        if(poses[0].pose.nose && dist(poses[0].pose.nose.x, poses[0].pose.nose.y, collect[0], collect[1]) <= checkDist){
            if(poses[0].pose.leftShoulder && dist(poses[0].pose.leftShoulder.x, poses[0].pose.leftShoulder.y, collect[2], collect[3]) <= checkDist){
                if(poses[0].pose.rightShoulder && dist(poses[0].pose.rightShoulder.x, poses[0].pose.rightShoulder.y, collect[4], collect[5]) <= checkDist){
                    if(poses[0].pose.leftElbow && dist(poses[0].pose.leftElbow.x, poses[0].pose.leftElbow.y, collect[6], collect[7]) <= checkDist){
                        if(poses[0].pose.rightElbow && dist(poses[0].pose.rightElbow.x, poses[0].pose.rightElbow.y, collect[8], collect[9]) <= checkDist){
                            if(poses[0].pose.leftWrist && dist(poses[0].pose.leftWrist.x, poses[0].pose.leftWrist.y, collect[10], collect[11]) <= checkDist){
                                if(poses[0].pose.rightWrist && dist(poses[0].pose.rightWrist.x, poses[0].pose.rightWrist.y, collect[12], collect[13]) <= checkDist){
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}

function drawHip(){
    textSize(12);
    if(poses.length > 0 && poses[0].pose.leftHip){
        let x = poses[0].pose.leftHip.x;
        let y = poses[0].pose.leftHip.y;
        fill(0,255,0);
        ellipse(x, y, 5, 5);
        fill(0,255,0);
        text("RightHip", x, y+20);
    }
    if(poses.length > 0 && poses[0].pose.rightHip){
        let x = poses[0].pose.rightHip.x;
        let y = poses[0].pose.rightHip.y;
        fill(0,255,0);
        ellipse(x, y, 5, 5);
        fill(0,255,0);
        text("LeftHip", x, y+20);
    }
}

class Wall{
    constructor(x, y, check){
        this.x = x;
        this.y = y;
        this.index = 0;
        this.count = 0;
        this.check = 0;
        this.select = random(0, 3);
    }
    moveAndDisplay(){
        //pose1
        if(this.select <= 1){
            if(this.check == 0){
                this.graphic = pose1_blue;
            }
            else if(this.check == 1){
                this.graphic = pose1_green;
            }
            else{
                this.graphic = pose1_red;
            }
        }
        //pose2
        else if(this.select <= 2){
            if(this.check == 0){
                this.graphic = pose2_blue;
            }
            else if(this.check == 1){
                this.graphic = pose2_green;
            }
            else{
                this.graphic = pose2_red;
            }
        }
        //pose3
        else{
            if(this.check == 0){
                this.graphic = pose3_blue;
            }
            else if(this.check == 1){
                this.graphic = pose3_green;
            }
            else{
                this.graphic = pose3_red;
            }
        }
        this.count = constrain(this.count, 0, 300);
        let size = map(this.count, 0, 300, 1, 300);
        imageMode(CENTER);
        image(this.graphic, this.x, this.y, this.graphic.width / 300 * size, this.graphic.height / 300 * size);
        imageMode(CORNER);
    }
}

class Wanderer{
    constructor(x, y, graphic){
        this.x = x;
        this.y = y;
        this.destX = x;
        this.destY = y;
        this.graphic = graphic;
        this.move = 1;
        this.xOffset = random(1000);
        this.yOffset = random(1000, 2000);
    }
    moveAndDisplay(){
        if(this.move == 0){
            let distX = this.destX - this.x;
            let distY = this.destY - this.y;
            this.x += distX * 0.05;
            this.y += distY * 0.05;
        }
        else{
            this.x += map(noise(this.xOffset), 0, 1, -1, 1);
            this.y += map(noise(this.yOffset), 0, 1, -1, 1);
            this.xOffset += 0.01;
            this.yOffset += 0.01;
        }
        image(this.graphic, this.x, this.y)
    }
}


//Face mesh class and functions
class Item {
    constructor(name, type, img) {
      this.name = name;
      this.type = type;
      this.graphic = img;
      this.price = 100;
      this.unlocked = false;
    }
  }

function imageLookup(){
    let answer = items.length - 1;
    console.log("Retrieved name: " +retrievedObjName);
    for(let i=0; i < items.length; i++){
      console.log("Item name: " + JSON.stringify(items[i].name));
      let checking = JSON.stringify(items[i].name);
      if(checking === retrievedObjName ){
      // if(lookup === items[i].name){
        console.log("successful");
        answer =  i;
      }
    }
    return answer;
  }


  //Once the results are in, we draw the keypoints, therefore we first check if the variable predictions is not empty
function drawKeypoints(maskType, maskImg) {
    for (let i = 0; i < predictions.length; i += 1) {
      const keypoints = predictions[i].scaledMesh;
  
      //Draw Mask Image by figuring out the width and size between points
      //Types of images to overlay: ["faceMask", "glasses", "nose", "hat"]
      //Can be passing in paramater of maskType and pass in selectedMask as well
  
      let testX1, testX2,heightPoint;
      let [p1x, p1y, p1z] = [0,0,0];
      let [p2x, p2y, p2z] = [0,0,0];
      let [p3x, p3y, p3z] = [0,0,0];
      let maskWidth = 0;
      let maskHeight = 0;
      //HAT
      if(maskType == "hat"){
        //Identifying keypoints on facemesh map (left and right temple)
        testX1 = keypoints[70];
        testX2 = keypoints[300];
        heightPoint = keypoints[152];
        [p1x, p1y, p1z] = testX1;
        [p2x, p2y, p2z] = testX2;
        [p3x, p3y, p3z] = heightPoint;

  
        maskWidth = (p2x - p1x);
        maskHeight = abs(p3y-p1y) +50;
      }
  
      else if(maskType == "nose"){
        testX1 = keypoints[4];
        testX2 = keypoints[175];
  
        [p1x, p1y, p1z] = testX1;
        [p2x, p2y, p2z] = testX2;
        heightPoint = keypoints[152];
        maskWidth = 50 + (p2x-p1x);
  
      }
      else if(maskType == "glasses"){
        // testX1 = keypoints[226];
        // testX2 = keypoints[446];
  
        testX1 = keypoints[139];
        testX2 = keypoints[368];
        heightPoint = keypoints[117];
  
        [p1x, p1y, p1z] = testX1;
        [p2x, p2y, p2z] = testX2;
        [p3x, p3y, p3z] = heightPoint;
  
        maskWidth = abs(p2x-p1x)+20;
        maskHeight = abs(p3y-p1y) +30;
      }
      else if(maskType == "mask"){
        testX1 = keypoints[4];
        testX2 = keypoints[175];
  
        [p1x, p1y, p1z] = testX1;
        [p2x, p2y, p2z] = testX2;
  
        let rightCheek  = keypoints[23];
        let leftCheek = keypoints[280];
        heightPoint = keypoints[152];
  
  
        const [rcx, rcy, rcz] = rightCheek;
        const [lcx, lcy, lz] = leftCheek;
        maskWidth = abs(rcx-lcx);
  
  
        let chin = keypoints[152];
        const [chinx, chiny, chinz] = chin;
        maskHeight = abs(chiny-p1y);
  
      }
      
  
      
  
      //Now we can really draw the keypoints by looping trough the array  
      for (let j = 0; j < keypoints.length; j += 1) {
        
        const [x, y, z] = keypoints[j];
  
        //We set  the colorMode to HSB in the beginning this will help us now. We can use fixed values for hue and saturation. Then we convert the values from the z axis, they range from about -70 to 70, to range from 100 to 0, so we can use them as third argument for the brightness. 
        // fill(200, 100, map(z, -70, 70, 100, 0));
        //Finally we draw the ellipse at the x/y coordinates which Facemesh provides to us 
        
        // ellipse(width-x, y, 10);
        // text("Keypoints Length: " + keypoints.length, 20,20);
        fill(0, 255, 0);
        push();
        translate(width+40,-10);
        // scale(1,1);
        scale(-1.6, 1.5);
        // ellipse(x, y, 5, 5);
        // image(capture, 0, 0, width, height);
        pop();


      }
  
      if(maskType == "hat"){
        imageMode(CORNER);
        // scale(-1, 1);
        // image(maskImg, width-p1x-60, p1y-(maskHeight*0.8), maskWidth+120, maskHeight);

        fill(0, 255, 0);
        push();
        translate(width+40,-50);
        // scale(1,1);
        scale(-1.6, 1.5);
        // ellipse(x, y, 5, 5);
        image(maskImg, p1x-60, p1y-(maskHeight*0.8), maskWidth+120, maskHeight);
        // image(maskImg, 160, (maskHeight*0.8), maskWidth+120, maskHeight);
        // image(capture, 0, 0, width, height);
        pop();

      }
  
      else if(maskType == "nose"){
        imageMode(CORNER);
        // image(maskImg, width-p1x, p1y, maskWidth, maskWidth);
        push();
        translate(width+80,-30);
        // scale(1,1);
        scale(-1.6, 1.5);
        // ellipse(x, y, 5, 5);
        // image(maskImg, p1x-60, p1y-(maskHeight*0.8), maskWidth+120, maskHeight);
        image(maskImg, p1x, p1y, maskWidth, maskWidth);
        // image(maskImg, 160, (maskHeight*0.8), maskWidth+120, maskHeight);
        // image(capture, 0, 0, width, height);
        pop();

      }
      else if(maskType == "glasses"){
        imageMode(CORNER);
        
        // image(maskImg, width-p1x, p1y, maskWidth, maskHeight);
        // fill(200, 0, 0);
        // ellipse(p1x,p1y,10);
        // ellipse(p2x,p2y,10);
        push();
        translate(width+50,-30);
        // scale(1,1);
        scale(-1.6, 1.5);
        // ellipse(x, y, 5, 5);
        // image(maskImg, p1x-60, p1y-(maskHeight*0.8), maskWidth+120, maskHeight);
        image(maskImg, p1x, p1y, maskWidth, maskHeight);
        // image(maskImg, 160, (maskHeight*0.8), maskWidth+120, maskHeight);
        // image(capture, 0, 0, width, height);
        pop();
  
      }
  
      else if(maskType == "mask"){
        imageMode(CORNER);
        // image(maskImg, p1x, p1y, maskWidth+120, maskHeight+150);
        // image(maskImg, width-p1x, p1y, maskWidth+120, maskHeight+150);
        push();
        translate(width+200,-160);
        scale(-1.6, 1.5);
        image(maskImg, p1x, p1y, maskWidth+120, maskHeight+150);
        pop();
  
      }
    }
    
  }


  function basicKeypoints() {
    // the predictions array holds data about tracked models,
    // it is an array because there may be multiple faces.
    for (let i = 0; i < predictions.length; i += 1) {
      const keypoints = predictions[i].scaledMesh;
  
      // Draw facial keypoints.
      for (let j = 0; j < keypoints.length; j += 1) {
        // keypoints[j] is an array of 3 numbers: an x,y,z coordinate
        // the variable declaration below is a more succinct way to say:
        // const x = keypoints[j][0];
        // const y = keypoints[j][1];
        const [x, y] = keypoints[j];
        fill(0, 255, 0);
        push();
        translate(width+40,-10);
        // scale(1,1);
        scale(-1.6, 1.5);
        ellipse(x, y, 5, 5);
        // image(capture, 0, 0, width, height);
        pop();
        
        
      }
    }
  }