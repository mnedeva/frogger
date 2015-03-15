// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 0;
    this.y = 72;
    this.speed = 0;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x > 505) {
        this.y = 72*Math.floor(Math.random()*3 +1);
        this.x = 0;
    }    
    this.x += (this.speed + level*2 + Math.floor(Math.random()*50 +10))*dt;
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Enemy.prototype.reset = function () {
}
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.x = 200;
    this.y = 410;
    this.sprite = "images/char-princess-girl.png";  
}
//Check if a player hits bug or additional entity on the board
Player.prototype.checkCollisions = function(allEnemies, additionalEntity){
        var $this = this;
     
        allEnemies.forEach(function(enemy) {
            // checks if player coords are same with coords of an enemy
            if (enemy.y -45  < $this.y && $this.y < enemy.y + 45 && 
                enemy.x +45 > $this.x && $this.x > enemy.x - 45) {
                lives--;
                if (lives == 0){  //no more lives; game over
                    stopped = true;   
                    allEnemies = []; //reset enemies array
                   
                }
                player.reset(); //the hit is done, player goes at the start position
            }
        });   
        //check if rock, heart or diamond is hit
        if (additionalEntity.y -45  < $this.y && $this.y < additionalEntity.y + 45 && 
            additionalEntity.x +45 > $this.x && $this.x > additionalEntity.x - 45) {
            
            if (additionalEntity.rock){ //rock
                return false;
            } else if (additionalEntity.heart){ //heaer
                additionalEntity.hide(); //heart disappears
                lives++; //live increments by one
                return true;
            } else { //diamod
                additionalEntity.hide(); //diamond disappears
                points += 50; //plus 50 points
                return true;
            }            
        }       
        
    return true;
}

Player.prototype.render = function(){    
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function(dt){
}

//set player at start position
Player.prototype.reset = function () {
    this.x = 200;
    this.y = 400;
}

//handle player's behavior when key is pressed
Player.prototype.handleInput = function(key){
    switch (key) {
        case 'left': //left key is hit           
            if (this.x > 0) { 
                this.x -= 100;
                if (!this.checkCollisions(allEnemies, additionalEntity)) {
                    //rock is hit, turn back
                    this.x += 100;
                }
            }
        break;    
        case 'up':
            if (this.y > 60) {
                this.y -=90;
                if (!this.checkCollisions(allEnemies, additionalEntity)) {
                    //rock is hit, turn back
                    this.y += 90;
                }                
            } else {
                //the player succeed to go to the water
                this.reset();
                if (lives > 0) {
                    level++; //level up
                    points += 10; //points up
                    if (level%4 == 0 && allEnemies.length < 6) {
                        //every fourth level enemies are incremented by one
                        //but not more then 6 appears
                        addEnemy();
                    }
                }
            }
        break;
        case 'right':
            if (this.x < 400) {
                this.x +=100;
                if (!this.checkCollisions(allEnemies, additionalEntity)) {
                    //rock is hit, turn back
                    this.x -= 100;
                }                
            }
        break;
        case 'down':
            if (this.y < 400)  {
                this.y += 90;
                if (!this.checkCollisions(allEnemies, additionalEntity)) {
                    //rock is hit, turn back
                    this.y -= 90;
                }                
            }
        break;        
    }
    
}

//Diamonds, hearts and rock 
var AdditionalEntity = function(){
   this.lastTime = Date.now();
   this.x = -100;    
   this.y = -100;
   this.sprites = [
                'images/Gem Blue.png',
                'images/Gem Green.png', 
                'images/Gem Orange.png',
                'images/Heart.png',
                'images/Rock.png'
            ];
   index = Math.floor(Math.random()*5);
   this.rock = (index == 4);
   this.heart = (index == 3);
   this.sprite = this.sprites[index];       
   
}
//hide the entity outside the board
AdditionalEntity.prototype.hide =  function(){
        this.x = -100;
        this.y = -100;
        this.lastTime = Date.now();
}
//render entity
AdditionalEntity.prototype.render =  function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
AdditionalEntity.prototype.update =  function(){ 
     var now = Date.now();
        
     if (now - this.lastTime > 5000 ){   
        /*
         * every 5 seconds if there is no additional entity
         * on the board add new random entity 
         */
        if (this.x < 0) {
            this.x = Math.floor(Math.random()*5) * 101;    
            this.y = Math.floor(Math.random()*3+1) * 72;
            index = Math.floor(Math.random()*5); //random entity pick up
            this.rock = (index == 4);
            this.heart = (index == 3);            
            this.sprite = this.sprites[index];
            this.lastTime = now;
        }
    } 
    
   if (now - this.lastTime > 5000 ){ 
       //if the entity stayed already 5 seconds, hide it
       this.hide();
   } 
}



// Now instantiate your objects.
// 
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies =[];

function addEnemy(){
    var enemy = new Enemy();
    enemy.y *= Math.floor(Math.random()*3 +1);
    enemy.x  = 0;
    enemy.speed = Math.floor(Math.random()*100 +50); //every enemy has random own speed
    //with random time offset we add new enemies
    setTimeout(function(){allEnemies.push(enemy);}, Math.floor(Math.random()*10000 +500));        
}
var additionalEntity = new AdditionalEntity();
var player = new Player();
for (i=0; i < 3; i++){
    addEnemy();
}



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (!stopped) { //game is not over
        player.handleInput(allowedKeys[e.keyCode]);
    }
});
