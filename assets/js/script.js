var trooper = document.getElementById('movingElement');
var field = document.getElementById('movingContainer');
var missile = document.getElementById('missile');

var isAnimating = false;

//sounds
var blasterSound = new Audio('trprsht2.wav');
var impact = new Audio('impact.wav');

//positional
var troopPos = $(trooper).position();
var targetLoc = $('#target').position();
var goX = 0;
var goY = 0;


//counters
var shotsFired = 0;
var hitCount = 0;

//character movement increment
var moveAmount = 18;




function animateElement(e) {
  if (e.keyCode == 27) {
    //quit game
    $('.quit-modal').modal('show');
  }

  if (e.keyCode == 39) {
    //go right (forward)
    goX += moveAmount;
    troopPos.left = trooper.style.left = goX;
    if (troopPos.left >= 920) {
      //detect right edge
      goX -= moveAmount;
      troopPos.left = trooper.style.left = goX;
      troopPos.left = trooper.style.left = 920;
    }
    return troopPos.left;
  } else if (e.keyCode == 37) {
    //go left (backwards)
    goX -= moveAmount;
    troopPos.left = trooper.style.left = goX;
    if (troopPos.left <= 0) {
      //detect left edge
      goX += moveAmount;
      troopPos.left = trooper.style.left = goX;
      troopPos.left = trooper.style.left = 0;
    }
    return troopPos.left;
  } else if (e.keyCode == 40) {
    //go down
    goY += moveAmount;
    troopPos.top = trooper.style.top = goY;
    if (troopPos.top >= 477) {
      //detect bottom edge
      goY -= moveAmount;
      troopPos.top = trooper.style.top = goY;
      troopPos.top = trooper.style.top = 477;
    }
    return troopPos.top;
  }
  if (e.keyCode == 38) {
    //go up
    goY -= moveAmount;
    troopPos.top = trooper.style.top = goY;
    if (troopPos.top <= 0) {
      //detect top edge
      goY += moveAmount;
      troopPos.top = trooper.style.top = goY;
      troopPos.top = trooper.style.top = 0;
    }
    return troopPos.top;
  }

  if (e.keyCode == 32 && isAnimating == false) {
    shotsFired++;

    //shoot with spacebar
    isAnimating = true;
    blasterSound.play();
    fire(troopPos.left, troopPos.top)

    document.getElementById('shotDisplay').innerHTML = "Shots Fired: " + shotsFired;
  }


  function fire(x, y) {
    //fire with provided coordinates
    //add offsets so blaster shot comes out from the gun
    var posX = x + 60;
    var posY = y + 46;

    var id = setInterval(frame, 1);

    function frame() {
      if (posX >= 1080) {
        clearInterval(id);
        missile.style.display = 'none';
        setTimeout(function() {
          isAnimating = false;
        }, 330);
      } else {
        posX += 12;
        missile.style.top = posY;
        detectCollision(targetLoc.left, targetLoc.top, $(missile).position().left, $(missile).position().top);
        missile.style.left = posX;

      }
    }
  }
}

function detectCollision(targetPosLeft, targetPosTop, missilePosLeft, missilePosTop) {

  var m = missilePosLeft;
  var t = targetPosLeft;
  var mt = missilePosTop;
  var tt = targetPosTop;

  missile.style.display = 'block';

  if ((m >= (t + 60)) && (mt >= tt) && (mt <= (tt + 120))) {
    //check to see if it is a hit

    $('#target').animateCss('wobble');
    missile.style.display = "none";
    hitCount++;
    impact.play();
    blasterSound.load();
    document.getElementById('scoreDisplay').innerHTML = "Hits Scored: " + hitCount;
  };
}

window.onload = function() {
  //give page time to load
  setTimeout(function() {
    alert("Ready To Begin?\nSelecting  'OK' will start the 60 second game timer."), moveBottom();
    beginCountDown();
  }, 100);
}



function moveBottom() {
  var elem = document.getElementById("target");
  var pos = 0;
  var id = setInterval(frame, 5);

  function frame() {
    if (pos == 476) {
      clearInterval(id);
      moveTop();
    } else {
      pos += 1;
      targetLoc.top = elem.style.top = pos;
      //console.log(targetLoc.top);
    }
  }
}

function moveTop() {
  var elem = document.getElementById("target");
  var pos = 476;
  var id = setInterval(frame, 5);

  function frame() {
    if (pos <= 0) {
      clearInterval(id);
      moveBottom();
    } else {
      pos -= 1;
      targetLoc.top = elem.style.top = pos;
      //console.log(targetLoc.top);
    }
  }
}


document.onkeydown = animateElement;

//animate css
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);
      if (callback) {
        callback();
      }
    });
    return this;
  }
});


//game timer
function startTimer(duration, display) {
  var timer = duration,
    minutes, seconds;
  var id = setInterval(function() {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);
    //console.log(timer, duration)

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = "Time: " + minutes + ":" + seconds;

    if (timer == 30) {
      document.getElementById('time-left').style.color = "yellow";
      $('#time-left').animateCss('tada');
    }
    if (timer == 10) {
      document.getElementById('time-left').style.color = "red";
      $('#time-left').animateCss('tada');
    }
    if (timer == 0) {
      tallyPoints();
      timer = 0;
      console.log("gameOver")
      clearInterval(id)
    }
    if (--timer < 0) {

    }
  }, 1000);

}

//timer settings
function beginCountDown() {
  var fiveMinutes = 60 * 1,
    display = document.getElementById('time-left');
  startTimer(fiveMinutes, display);
}
//tally up points
function tallyPoints() {
  var score = hitCount*100;
  document.getElementById('show-shotsFired').innerHTML = "Total Shots Fired: " + shotsFired;
  document.getElementById('show-hits').innerHTML = "Total Target Hits: " + hitCount;
  document.getElementById('show-score').innerHTML = "Your Score: " + score;
  if (shotsFired >= 1) {
    var hitRatio = (hitCount / shotsFired) * 100;

    document.getElementById('show-hitRatio').innerHTML = "Your Hit Ratio: " + hitRatio.toFixed(2) + "%";
  } else {
    document.getElementById('show-hitRatio').innerHTML = "Must fire at least one shot to calculate hit ratio.";
    document.getElementById('show-hitRatio').style.color = "red";
  }
  $('.score-modal').modal('show');
}

function goHome() {
  document.location.href = 'index.html'
}
//keyboard key codes ==**

//left = 37
//right = 39
//down = 40
//up = 38

//escape = 27
//enter = 13
//space = 32
//backspace = 8

//a = 65
//b = 66
//c = 67
//d = 68
//e = 69
//f = 70
//g = 71
//h = 72
//i = 73
//j = 74

//r = 82
//s = 83
//x = 88
//z = 90
