const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const sampleURL = 'https://azzhexperiment.github.io/Signals-and-Systems-JS/assets/audio/beatbox.m4a'
let sampleBuffer
let sound
const playButton = document.querySelector('.play')
const stopButton = document.querySelector('.stop')
let loop = false
const loopButton = document.querySelector('.loop')
const loopStart = document.querySelector('.loop-start')
const loopEnd = document.querySelector('.loop-end')
const playbackSlider = document.querySelector('.playback-slider')
const playbackRate = document.querySelector('.rate')

console.log(loopEnd)
console.log(playbackSlider)
console.log(playbackRate)

// load our sound
init()

function init () {
  loadSound(sampleURL)
}

playButton.onclick = function () {
  playSound()
}

stopButton.onclick = function () {
  stopSound()
}

loopButton.onclick = function (event) {
  loopOn(event)
}

playbackSlider.oninput = function () {
  changeRate(playbackSlider.value)
}

loopStart.oninput = function () {
  setLoopStart(loopStart.value)
}

loopEnd.oninput = function () {
  setLoopEnd(loopEnd.value)
}

// function to load sounds via AJAX
function loadSound (url) {
  var request = new window.XMLHttpRequest()
  request.open('GET', url, true)
  request.responseType = 'arraybuffer'

  request.onload = function () {
    audioContext.decodeAudioData(request.response, function (buffer) {
      var soundLength = buffer.duration
      sampleBuffer = buffer
      loopStart.setAttribute('max', Math.floor(soundLength))
      loopEnd.setAttribute('max', Math.floor(soundLength))
      playButton.disabled = false
      playButton.innerHTML = 'play'
    })
  }

  request.send()
}

// set our sound buffer, loop, and connect to destination
function setupSound () {
  sound = audioContext.createBufferSource()
  sound.buffer = sampleBuffer
  sound.loop = loop
  sound.loopStart = loopStart.value
  sound.loopEnd = loopEnd.value
  // sound.detune.value = -1000;
  sound.playbackRate.value = playbackSlider.value
  sound.connect(audioContext.destination)
}

// play sound and enable / disable buttons
function playSound () {
  setupSound()
  UI('play')
  sound.start(0)
  sound.onended = function () {
    UI('stop')
  }
}
// stop sound and enable / disable buttons
function stopSound () {
  UI('stop')
  sound.stop(0)
}

// change playback speed/rate
function changeRate (rate) {
  sound.playbackRate.value = rate
  playbackRate.innerHTML = rate
}

function loopOn (event) {
  loop = event.target.checked
  if (sound) { // sound needs to be set before setting loop points
    if (loop) {
      loopStart.disabled = false
      loopEnd.disabled = false
    } else {
      loopStart.disabled = true
      loopEnd.disabled = true
    }
  } else {
    console.log('press play first and then set loop')
  }
}

// change loopStart
function setLoopStart (start) {
  sound.loopStart = start
}

// change loopEnd
function setLoopEnd (end) {
  sound.loopEnd = end
}

function UI (state) {
  switch (state) {
    case 'play':
      playButton.disabled = true
      stopButton.disabled = false
      playbackSlider.disabled = false
      break
    case 'stop':
      playButton.disabled = false
      stopButton.disabled = true
      playbackSlider.disabled = true
      break
  }
}

/* ios enable sound output */
window.addEventListener('touchstart', function () {
  // create empty buffer
  var buffer = audioContext.createBuffer(1, 1, 22050)
  var source = audioContext.createBufferSource()
  source.buffer = buffer
  source.connect(audioContext.destination)
  source.start(0)
}, false)
