let coins;
let selectedItem;

let items = [];

function preload() {
    coins = JSON.parse(localStorage.getItem('coins')) || 0;
    selectedItem = JSON.parse(localStorage.getItem('selectedItem')) || null;
    santaHatImg = loadImage("../images/items/santaHat.png");
    reindeerHatImg = loadImage("../images/items/reindeer.png");
    reindeerNoseImg = loadImage("../images/items/redNose.png");
    pixelGlassesImg = loadImage("../images/items/glasses.png");

    items.push(new Item("Santa Hat", "hat", santaHatImg));
    items.push(new Item("Reindeer Hat", "hat", reindeerHatImg));
    items.push(new Item("Reindeer Nose", "nose", reindeerNoseImg));
    items.push(new Item("Pixel Glasses", "glasses",pixelGlassesImg));
}

function setup() {
createCanvas(960, 720);
drawShop();
}

function drawShop() {
    background(220);
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0);
    text(`Coins: ${coins}`, width / 2, 40);

    let startIndex = currentPage * itemsPerPage;
    let endIndex = min(startIndex + itemsPerPage, items.length);

    for (let i = startIndex; i < endIndex; i++) {
        let x = (i % 3) * 320 + 160;
        let y = floor((i - startIndex) / 3) * 240 + 120;

        // Draw item image
        image(items[i].graphic, x - 80, y - 80, 160, 160);

        // Display item name and price
        text(`${items[i].name}\n${items[i].price} coins`, x, y + 120);

        // Highlight selected item
        if (selectedItem === i) {
        stroke(255, 0, 0);
        noFill();
        rect(x - 80, y - 80, 160, 160);
        }
}

// Draw navigation buttons
if (currentPage > 0) {
    fill(50);
    rect(width / 4 - 50, height - 60, 100, 40);
    fill(255);
    text('Previous', width / 4, height - 40);
}

if (endIndex < items.length) {
    fill(50);
    rect(width * 3 / 4 - 50, height - 60, 100, 40);
    fill(255);
    text('Next', width * 3 / 4, height - 40);
}
}

function mouseClicked() {
for (let i = 0; i < items.length; i++) {
    let x = (i % 3) * 320 + 160;
    let y = floor(i / 3) * 240 + 120;

    if (mouseX > x - 80 && mouseX < x + 80 && mouseY > y - 80 && mouseY < y + 80) {
    if (selectedItem === i) {
        // Confirm purchase
        if (coins >= items[i].price) {
        coins -= items[i].price;
        localStorage.setItem('coins', JSON.stringify(coins));
        localStorage.setItem('selectedItem', JSON.stringify(i));
        alert(`Purchase successful!\nRemaining coins: ${coins}`);
        } else {
        alert('Not enough coins!');
        }
    } else {
        // Select item
        selectedItem = i;
        localStorage.setItem('selectedItem', JSON.stringify(selectedItem));
        drawShop();
    }
    }
}

// Check if navigation buttons are clicked
if (mouseX > width / 4 - 50 && mouseX < width / 4 + 50 && mouseY > height - 60 && mouseY < height - 20) {
    if (currentPage > 0) {
    currentPage--;
    drawShop();
    }
}

if (mouseX > width * 3 / 4 - 50 && mouseX < width * 3 / 4 + 50 && mouseY > height - 60 && mouseY < height - 20) {
    if (endIndex < items.length) {
    currentPage++;
    drawShop();
    }
}
}

class Item{
    constructor(name, type,img){
        this.name = name;
        this.type = type;
        this.graphic = img;
        this.price = 10;
        this.unlocked = false;
    }
  }