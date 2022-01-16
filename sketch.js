const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground, rope2, rope3;
var fruit_con;
var fruit_con_2;
var fruit_con_3;

var bg_img;
var food;
var rabbit;

var button,button2,button3;
var bunny;
var blink,eat,sad;
var cutSound, sadSound, eatSound, bgSound, airSound
var blow
var canW, canH

function preload()
{
  bg_img = loadImage('background.png');
  food = loadImage('melon.png');
  rabbit = loadImage('Rabbit-01.png');;
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  

  cutSound = loadSound("rope_cut.mp3")
  sadSound = loadSound("sad.wav")
  eatSound = loadSound("eating_sound.mp3")
  bgSound = loadSound("sound1.mp3")
  airSound = loadSound("air.wav")
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 

}

function setup() {
  var isMobile = /iPhone | iPad | iPod | Android/i.test(navigator.userAgent);
  if(isMobile){
    canW = displayWidth;
    canH = displayHeight;
  }else{
    canW = windowWidth;
    canH = windowHeight;
  }
  createCanvas(canW,canH);
  frameRate(80);


  engine = Engine.create();
  world = engine.world;
  
  button = createImg('cut_btn.png');
  button.position(canW/3,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg("cut_btn.png");
  button2.position(canW/2+100,30);
  button2.size(50,50)
  button2.mouseClicked(drop2);

  button3 = createImg("cut_btn.png");
  button3.position(canW*2/3,canH/3-100);
  button3.size(50,50)
  button3.mouseClicked(drop3);

  blow = createImg("blower.png")
  blow.position(canW/3, canH/2-100);
  blow.size(100,100)
  blow.mouseClicked(airBlow);
  
  rope = new Rope(9,{x:canW/3+20,y:30});
  rope2 = new Rope(4,{x:canW/2+120, y:30});
  rope3 = new Rope(5, {x:canW*2/3+20, y: canH/3-100});
  ground = new Ground(canW/2,canH-10,canW,20);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(canW/2,canH-100,100,100);
  bunny.scale = 0.2;

  bunny.addAnimation('blinking',blink);

  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  fruit = Bodies.circle(canW/2,canH/2-100,20);
  Matter.Composite.add(rope2.body,fruit);
  

  fruit_con = new Link(rope,fruit);
  fruit_con_2 = new Link(rope2,fruit);
  fruit_con_3 = new Link (rope3,fruit);


  bgSound.play()
  bgSound.setVolume(0.5);

  muteButton = createImg("mute.png");
  muteButton.position(canW*3/4,20)
  muteButton.size(50,50)
  muteButton.mouseClicked(mute);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,canW/2,canH/2,canW,canH);

  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }

  rope.show();
  rope2.show();
  rope3.show();

  Engine.update(engine);
  ground.show();

  if(collide(fruit,bunny)==true)
  {
    bunny.changeAnimation('eating');
    eatSound.play();
  }
   
  if(collide(fruit,ground.body)==true )
  {
     bunny.changeAnimation('crying');
     sadSound.play();
     bgSound.stop();
   }

   drawSprites();
}

function drop()
{
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
  cutSound.play();
}

function drop2(){
  rope2.break();
  fruit_con_2.dettach();
  fruit_con_2 = null;
  cutSound.play();
}

function drop3(){
  rope3.break();
  fruit_con_3.dettach();
  fruit_con_3 = null;
  cutSound.play();
}

function collide(body,sprite)
{
  if(body!=null)
        {
         var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
          if(d<=80)
            {
              World.remove(engine.world,fruit);
               fruit = null;
               return true; 
            }
            else{
              return false;
            }
         }
}

function airBlow(){
  Matter.Body.applyForce(fruit,{x:0,y:0}, {x:0.05, y:0})
  airSound.play()
}

function mute(){
  if(bgSound.isPlaying()){
    bgSound.stop();
  }else{
    bgSound.play();
  }
}
