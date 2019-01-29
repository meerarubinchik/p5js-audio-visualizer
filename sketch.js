var stars = [];
var shootingStar;
var yoff = 0.0; 
var time = 0;
var waves = [];
var mic;



function setup() 
{
    noFill();
    strokeWeight(0.25);
    
    
    createCanvas(windowWidth, windowHeight);
    frameRate(10);
    
    for (var i = 0; i < 50; i++) 
    {
        stars.push(new Star());
    }
    
    shootingStar = new ShootingStar();
    
    mic = new p5.AudioIn();
    mic.start();

    
}

function draw() 
{
    background(220);
    var color1 = color(0, 34, 62);
    var color2 = color(19, 80, 178);
    setGradient(0, 0, windowWidth, windowHeight, color1, color2, "Y");
    
    for (var i = 0; i < 20; i++) 
    {
        stars[i].draw();
    }
    
    shootingStar.draw();
    
    
    
    
    //start
    
    if (waves.length < 30) {
        waves.push(new Wave());
    }
    
    
    for (var i = waves.length - 1; i >= 0; i--) {
        waves[i].update();
        waves[i].display();
        if (waves[i].isDead()) {
            // delete it
            waves.splice(i, 1);
        }
    }
    time += 0.035;
}

function mousePressed() {
    waves.push(new Wave());
}

function Wave() {
    this.lifespan = 256;

    this.location = [];
    var vol = mic.getLevel();
    var h = map(vol, 0, 1,1, 0)
    
    this.color = color(random(240,255), random(240,255), random(240,255));

    // location array with x, y coordinates
    for (var x = 0; x <= width; x++) {
        var y = height*1.9 * noise(x / 800, time);
        this.location[x] = y+h*3;
    }

    this.update = function() {
        this.lifespan -=15;
    }

    this.display = function() {
        blendMode(OVERLAY);
        var prevX = -1;
        var prevY;
        for (var x = 0; x < this.location.length; x+=20) {
            stroke(this.color, this.lifespan);
            if (prevX > -1) {
                line(x, this.location[x], prevX, prevY*h);

            }
            prevX = x;
            prevY = this.location[x]+h;
        }
        blendMode(NORMAL);
    }

    this.isDead = function() {
        if (this.lifespan < 0) {
            return true;
        } else {
            return false;
        }
    }

    
    
    
}

function setGradient(x, y, w, h, c1, c2, axis) 
{
  noFill();
  if (axis == "Y") 
  {  // Top to bottom gradient
    for (let i = y; i <= y+h; i++) 
    {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == "X") 
  {  // Left to right gradient
    for (let j = x; j <= x+w; j++) 
    {
      var inter2 = map(j, x, x+w, 0, 1);
      var d = lerpColor(c1, c2, inter2);
      stroke(d);
      line(j, y, j, y+h);
    }
  }
}


function Star() {
    this.x = random(windowWidth);
    this.y = random(windowHeight-200);
    this.w = 2;
    this.h = 2;
}
Star.prototype.draw = function() {
   noStroke();
    fill(249, 244, 212);
    ellipse(this.x, this.y, this.w, this.h);
    this.x += (random(10) - 5);
    this.y += (random(10) - 5);
    if (this.w == 2) 
    {
        this.w = 3;
        this.h = 3;
    } 
    else 
    {
        this.w = 2;
        this.h = 2;
    }
}


function ShootingStar() {
  this.x = random(windowWidth-200);
  this.y = random(windowHeight-400);
  this.w = 70;
  this.h = 4;
}

ShootingStar.prototype.draw = function() {
  noStroke();
  fill(249, 244, 212);
  ellipse(this.x, this.y, this.w, this.h);
  if (this.h > 0) {
    this.h -= 0.5;
  }
  this.w += 10;
  this.x += 7;
}