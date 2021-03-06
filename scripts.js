const game = {};

let direction='';
const snake = [];

game.invincible = false;
game.snakeTop;
game.snakeLeft;


// Sets up the Snake with 1 chunk
function renderSnake(){
  $chunk = $('<div class="chunk">');
  snake.push($chunk);
}

//Appends the snake to the GameState
function appendSnake(){
  renderSnake();
  $('#game-state').append(snake);
}

//Calls the append Snake
appendSnake();


//Movement functions remove the last 'chunk' in the snake array and positions it at the front of the snake array, 10 pixels ahead of the current snake position based on the direction selected.

//Function to move the snake one position to the right
function moveRight(){
  let oldTop = snake[0].position().top;
  let oldLeft= snake[0].position().left;
  snake.unshift(snake.pop());
  snake[0].css('left',oldLeft+10);
  snake[0].css('top',oldTop);
}
//Function to move the snake one position to the left
function moveLeft(){
  let oldTop = snake[0].position().top;
  let oldLeft = snake[0].position().left;
  snake.unshift(snake.pop());
  snake[0].css('left',oldLeft-10);
  snake[0].css('top',oldTop);
}

//Function to move the snake one position to the top
function moveUp(){
  let oldTop = snake[0].position().top;
  let oldLeft = snake[0].position().left;
  snake.unshift(snake.pop());
  snake[0].css('top',oldTop-10);
  snake[0].css('left',oldLeft);
}

//Function to move the snake one position to the bottom

function moveDown(){
  let oldTop = snake[0].position().top;
  let oldLeft = snake[0].position().left;
  snake.unshift(snake.pop());
  snake[0].css('top',oldTop+10);
  snake[0].css('left',oldLeft);
}


$(document).keydown(function(e){
  //Left Key
  if(e.keyCode === 37){
    if(direction != 'right'){
      direction = 'left';
      moveLeft();
      checkSnack();
    }
  }
  //Up Key
  else if(e.keyCode === 38){
    if(direction !='down'){
      direction = 'up';
      moveUp();
      checkSnack();
    }
  }
  //Right Key
  else if(e.keyCode === 39){
    if(direction !='left'){
      direction = 'right';
      moveRight();
      checkSnack();
    }
  }
  //Down Key
  else if(e.keyCode === 40){
    //Makes sure that the direction is not up
    if(direction != 'up'){
      //changes
      direction = 'down';
      moveDown();
      checkSnack();
    }
  }
});

/// Place Snack function

function getRandomHeight(){

  //Grabs a random height that is within the game-state
  let randomHeight = Math.floor(Math.random()*$('#game-state').height());

  randomHeight = Math.floor(randomHeight/10)*10;

  return randomHeight;
}
function getRandomWidth(){

  //Grabs a random number that is within the width of the game-state
  let randomWidth = Math.floor(Math.random()*$('#game-state').width());

  randomWidth = Math.floor(randomWidth/10)*10;

  return randomWidth;

}

function placeSnack(){
  //This funciton will get a random position and will place a snack on the game-state
  let snack = $("<div id='snack'>");
  snack.css({
    'top': getRandomHeight(),
    'left': getRandomWidth()
  });
  $('#game-state').append(snack);
}


function placeStar(){
  //This funciton will get a random position and will place a "star" on the game-state
  let star = $('<div id="star">');

  star.css({
    'top': getRandomHeight(),
    'left': getRandomWidth()
  });

  $('#game-state').append(star);
}



function checkSnack(){

  //This function checks to see if a snack has been eaten
  snakeTop = snake[0].position().top;
  snakeLeft = snake[0].position().left;

  let fruitTop = $('#snack').position().top;
  let fruitLeft = $('#snack').position().left;
  let chunk = $('<div class="chunk">');

  if(snakeTop == fruitTop && snakeLeft == fruitLeft){
    //If it has been eaten, it removes the snack, and pushes a new chunk into the snake at the proper position of the snake, then re-appends the snake to the game-state
    $('#snack').remove();
    chunk.css('top',snakeTop);
    chunk.css('left',snakeLeft);
    snake.push(chunk);
    //snake.unshift(chunk); //was really cool. Made it start at the top again. Could have some wormhole functionality
    $('#game-state').append(snake);

    //Places a new snack on the board
    placeSnack();
  }
}

function checkStar(){
  //This function checks to see if a star has been eaten
  snakeTop = snake[0].position().top;
  snakeLeft = snake[0].position().left;

  let starTop = $('#star').position().top;

  let starLeft = $('#star').position().left;

  if(snakeTop == starTop && snakeLeft == starLeft){
    makeSnakeInvincible();
  }
}

function makeSnakeInvincible(){
  $('#star').remove();
  game.invincible = true;

  setTimeout(function(){
    placeStar();
  }, 60000);

  $('body').append('<audio autoplay="autoplay" id="starpower" src="./Audio/Star Power.m4a"></audio>');

  setTimeout(function(){
    $('#starpower').remove();
    game.invincible = false;
    colorSnake();
  }, 10000);
}


function disablePlay() {
  //Clears all timeouts.
  let highestTimeoutId = setTimeout(";");
  for (let i = 0 ; i < highestTimeoutId ; i++) {
    clearTimeout(i);
  }
}

function checkChanges(){
  //This funciton continually checks to see if the snake has run into a wall.
  snakeTop = snake[0].position().top;
  snakeLeft = snake[0].position().left;
  //If the snake is not invincible, it can lose the game
  if(game.invincible == false){
    if((snakeTop <= -1) || (snakeTop >= $('#game-state').height())){
     endGame();
     let r = 0;
   }
   else if((snakeLeft <= -1) || (snakeLeft >= $('#game-state').width())){
     endGame();
   }
  }
}

function snakeCollision(){
  snakeTop = snake[0].position().top;
  snakeLeft = snake[0].position().left;

  if(game.invincible == false){
    switch(direction){
      case 'right':
      //If the snake is moving from the left to right (direction right), it can only lose when the top positions are equal and the left of the head is 10px to the left of the left position of snake[i]
        for(let i=1; i<snake.length;i++){
          if(snakeTop == snake[i].position().top && snakeLeft+10 == snake[i].position().left){
            endGame();
          }
        }
        break
      case 'left':
      //If the snake is moving from the right to left (direction left), it can only lose when the top positions are equal and the left of the head is 10px to the right of the left position of snake[i]
        for(let i=1; i<snake.length;i++){
          if(snakeTop == snake[i].position().top && snakeLeft-10 == snake[i].position().left){
            endGame();
          }
        }
        break
      case 'up':
      //If the direction is up, the snake can only lose if the top of the head of the snake is 10px higher than the top of snake[i]. It must also have equal value of left
        for(let i=1; i<snake.length;i++){
          if(snakeTop-10 == snake[i].position().top && snakeLeft == snake[i].position().left){
            endGame();
          }
        }
        break
      case 'down':
      //If the direction is down, the snake can only lose if the top of the head of the snake is 10px lower than the top of snake[i]. It must also have equal value of left
        for(let i=1; i<snake.length;i++){
          if(snakeTop+10 == snake[i].position().top && snakeLeft == snake[i].position().left){
            endGame();
          }
        }
        break
    }

  }

}

//Tells the game which direction to move the snake chunk.

function move(){

  switch(direction){
    case 'right':
    //If direction is set to right, call the move right function, and reset the direction to right
      moveRight();
      direction = 'right';
    //Also want to confirm that a snack has not been eaten.
      checkStar();
      checkSnack();
      break
    case 'left':
    //If direction is set to left, call the move left function, and reset the direction to left
      moveLeft();
      direction = 'left';
      //Also want to confirm that a snack has not been eaten.
      checkStar();
      checkSnack();
      break
    case 'down':
    //If direction is set to down, call the move down function, and reset the direction to down
      moveDown();
      direction = 'down';
      //Also want to confirm that a snack has not been eaten.
      checkStar();
      checkSnack();
      break
    case 'up':

    //If direction is set to up, call the move up function, and reset the direction to up
      moveUp();
      direction = 'up';
      //Also want to confirm that a snack has not been eaten.
      checkStar();
      checkSnack();
      break
    }
}

//The default color of the snake. Gets more red as the tail grows.
//
function randomSnake(){
  if(game.invincible != false){
    let r = Math.floor(Math.random()*255);
    let g = Math.floor(Math.random()*255);
    let b = Math.floor(Math.random()*255);

    for(let i=0;i<snake.length;i++){
      snake[i].css('background','rgb('+r+','+g+','+b+')');
    }
  }
}

function colorSnake(){
  let r = 0;
  for(let i=0;i<snake.length;i++){
    snake[i].css('background','rgb('+r+',0,0)');
    r+=2;
  }
}

//The star will have a random color. This is called in the 80ms interval
function colorStar(){
  let r = Math.floor(Math.random()*255);
  let g = Math.floor(Math.random()*255);
  let b = Math.floor(Math.random()*255);
  $('#star').css('background-color','rgb('+r+','+g+','+b+')');
}


//When Snake is invincible, it flashes random colors;

function winCondition(){
  if(snake.length == $('#game-state').height() * $('#game-state').width()/100){
    alert('Holy Shit. You won');
  }
}

function instructions(){
  $('#instructions').click(function(){
    $('#instructions').fadeOut(1000);

    $('#instructions').css({
      'opacity': '0',
      'z-index': '0'
    });

    $('#start').css({
      'opacity': '1',
      'z-index': '1'
    })
    startGame();
  })

}

function startGame(){
  let timer = 5;
  $('#start').animate({
    'opacity': '0',
    'z-index': '0'
  }, 5000);

  $('body').append('<audio autoplay="autoplay" src="./Audio/Background.mp3" id="background"></audio>')

  setInterval(function(){
    timer -= 1;
    $('#timer').text(timer);
  },1000);


  setTimeout(function(){
    direction = 'right';
  }, 5000);
}

function restart(){
  $('#lose').click(function(){
    location.reload();
  })
}

function endGame(){
  $('#lose').css({
    'opacity': '1',
    'z-index': '1'
  });
  $('#score').text('Snake Length:   '+snake.length);

  $('#background').remove();
  $('body').append('<audio autoplay="autoplay" id="gameover" src="./Audio/GameOver.mp3"></audio>')

  disablePlay();
}

$(document).ready(function(){

  instructions();

  placeSnack();

  // setTimeout(function(){
    placeStar();
  // }, 60000);

  restart();

  setInterval(function(){
    randomSnake();
    move();
    colorStar();
    colorSnake();
  }, 100);

  setInterval(function(){
    checkSnack();
    checkStar();
    checkChanges();
    snakeCollision();
  }, 1);

  winCondition();
});
