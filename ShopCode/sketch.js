let coins;
let selectedItem, retrievedItem;

let santaHatImg, reindeerHatImg, reindeerNoseImg, pixelGlassesImg;
let glasses1Img, glasses2Img, santaMaskImg, winterHatImg, christmasHatImg, reindeerMaskImg, noneImg;
let items = [];

let retrievedObjName;
let retrievedObjType;
let retrievedObjImg;
let container = document.getElementById('container');

let font;
function preload() {
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

  items.push(new Item("Santa Hat", "hat", santaHatImg));
  items.push(new Item("Reindeer Hat", "hat", reindeerHatImg));
  items.push(new Item("Reindeer Nose", "nose", reindeerNoseImg));

  items.push(new Item("Glasses Style 1", "glasses", glasses1Img));
  // items.push(new Item("Glasses Style 2", "glasses", glasses2Img));

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
  font = loadFont('../MusicGame/sounds/dream.ttf');

}

function setup() {
  let c = createCanvas(960, 720);
  c.parent('container');
  background(255,155);
  // myCanvas.parent("container");
  // Retrieve the object from local storage
  retrievedObjName = localStorage.getItem('selectedItemName');
  retrievedObjType= localStorage.getItem('selectedItemType');
  retrievedObjImg = localStorage.getItem('selectedItemImg');


  // const retrievedObject = JSON.parse(retrievedObjectString);


  // const savedItem = JSON.parse(localStorage.getItem('selectedItemObj'));
  console.log(retrievedObjName);
  console.log(retrievedObjType);
  console.log(retrievedObjImg);

  // Check if the item was successfully retrieved
  // if (retrievedObject) {
    // Instantiate the object from the retrieved data
    // retrievedItem = new Item(savedItem.name, savedItem.price,savedItem.img);

    // Now, `retrievedItem` is an instance of the Item class
    // console.log(retrievedObject);
  // } else {
    // console.log('No item found in local storage');
    // retrievedItem = new Item("nada","nada",santaMaskImg);
  // }

  drawShop(); 
}
function imageLookup(){
  for(let i=0; i < items.length; i++){
    if(retrievedObjName == items[i].name){
      return (items[i]);
    }
  }
  return (items[items.length - 1]);
}
function drawShop() {
  background(255);
  coins = JSON.parse(localStorage.getItem('coins')) || 0;
  textAlign(CENTER, CENTER);
  textSize(20);
  strokeWeight(0.6);
  fill(0);
  textFont(font);
  text("Selection: " + retrievedObjName , 140,20 );

  strokeWeight(0.6);
  fill(0);
  textFont(font);
  text(`Coins: ${coins}`, width / 2, 20);

  for (let i = 0; i < items.length; i++) {
    let x = (i % 3) * 320 + 160;
    let y = floor(i / 3) * 240 + 120;

    // Draw item image
    image(items[i].graphic, x - 80, y - 90, 160, 160);

    // Display item name, price, and unlock status
    strokeWeight(0.3);
    stroke(0);
    fill(0);
    text(`${items[i].name}\n${items[i].price} coins\nUnlocked: ${items[i].unlocked ? 'Yes' : 'No'}`, x, y + 80);

    // Highlight selected item
    if (selectedItem === i) {
      strokeWeight(5);
      stroke(0,0,255);
      noFill();
      rect(x - 80, y - 88, 160, 160,20);
    }
  }
}

function mouseClicked() {
  for (let i = 0; i < items.length; i++) {
    let x = (i % 3) * 320 + 160;
    let y = floor(i / 3) * 240 + 100;

    if (mouseX > x - 80 && mouseX < x + 80 && mouseY > y - 80 && mouseY < y + 80) {
      if (selectedItem === i) {
        // Confirm purchase
        if (coins >= items[i].price && !items[i].unlocked) {
          coins -= items[i].price;
          items[i].unlocked = true;
          localStorage.setItem('coins', JSON.stringify(coins));
          localStorage.setItem(`item_${i}_unlocked`, JSON.stringify(true));
          localStorage.setItem('selectedItem', JSON.stringify(i));
          localStorage.setItem('selectedItemName', JSON.stringify(items[i].name));
          localStorage.setItem('selectedItemType', JSON.stringify(items[i].type));
          // localStorage.setItem('selectedItemImg', JSON.stringify(items[i].img));
          alert(`Purchase successful!\nRemaining coins: ${coins}`);
        } else if (items[i].unlocked) {
          alert('Item already unlocked!');
          // will add a reload/redirect to main screen here
          localStorage.setItem('selectedItem', JSON.stringify(i));
          localStorage.setItem('selectedItemName', JSON.stringify(items[i].name));
          localStorage.setItem('selectedItemType', JSON.stringify(items[i].type));
          // localStorage.setItem('selectedItemImg', JSON.stringify(items[i].graphic));
          window.location.href = "../index.html";
        } else {
          alert('Not enough coins!');
        }
      } else {
        // Select item
        selectedItem = i;
        localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
        localStorage.setItem('selectedItemName', JSON.stringify(items[i].name));
        localStorage.setItem('selectedItemType', JSON.stringify(items[i].type));
        // localStorage.setItem('selectedItemImg', JSON.stringify(items[i].graphic));

        drawShop();
      }
    }
  }
}

class Item {
  constructor(name, type, img) {
    this.name = name;
    this.type = type;
    this.graphic = img;
    this.price = 100;
    this.unlocked = false;
  }
}
