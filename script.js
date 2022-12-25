// global constants
const clueHoldTime = 400; //how long to hold each clue's light/sound
const cluePauseTime = 222; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

const randomIntArrayInRange = (min, max, n) =>
  Array.from(
    { length: n },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

//Global Variables
var pattern = randomIntArrayInRange(1,4,8);     //Generates random numbers from 1-4 in an array of size 8
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;           //between 0.0 and 1.0 (1.0 being the loudest)
var guessCounter = 0;

function startGame()
{
    //initialize game variables
    progress = 0;
    gamePlaying = true;

    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence(); 
}


function stopGame()
{
    //initialize game variables
    progress = 0;
    gamePlaying = false;

    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

// Sound Synthesis Functions
const freqMap = 
{
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}

function playTone(btn,len)
{ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn)
{
  if(!tonePlaying)
  {
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}

function stopTone()
{
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

function lightButton(btn)
{
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn)
{
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn)
{
  if(gamePlaying)
  {
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence()
{
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame()
{
  stopGame();
  alert("Game Over. You lost.");
}

function winGame()
{
  stopGame();
  alert("Congrats! You won!!");
}

function guess(btn)
{
  console.log("user guessed: " + btn);
  if(!gamePlaying)
  {
    return;
  }
  
  // add game logic here
  if(pattern[guessCounter] == btn)
  {
    if(guessCounter == progress)
    {
      if(progress == pattern.length - 1)
      {
        
        winGame();
      }
      else
      {
        progress++;
        playClueSequence();
      }
    }
    else
    {
      guessCounter++;
    }
  }
  else
  {
    loseGame();
  }
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
