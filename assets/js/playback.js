let sampleBuffer, sound
let loop = false

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const sampleURL = 'https://azzhexperiment.github.io/Signals-and-Systems-JS/assets/audio/beatbox.m4a'

const startButton    = document.querySelector('.start')
const stopButton     = document.querySelector('.stop')
const loopButton     = document.querySelector('.loop')
const playbackSlider = document.querySelector('.playback-slider')
const playbackRate   = document.querySelector('.rate')

// Setup start/stop
startButton.onclick = playSound
stopButton.onclick  = stopSound

// load our sound
loadSound(sampleURL)

loopButton.onclick = (event) => { loopOn(event) }

playbackSlider.oninput = changeRate(playbackSlider.value)

// Load sounds via ajax
function loadSound (url) {
  const request = new window.XMLHttpRequest()
  request.open('GET', url, true)
  request.responseType = 'arraybuffer'

  request.onload = function () {
    audioContext.decodeAudioData(request.response, function (buffer) {
      const soundLength = buffer.duration
      sampleBuffer = buffer
      loopStart.setAttribute('max', Math.floor(soundLength))
      loopEnd.setAttribute('max', Math.floor(soundLength))
    })
  }

  request.send()
}

// set our sound buffer, loop, and connect to destination
function setupSound () {
  sound                    = audioContext.createBufferSource()
  sound.buffer             = sampleBuffer
  sound.loop               = true
  sound.playbackRate.value = playbackSlider.value
  // sound.detune.value = -1000;
  sound.connect(audioContext.destination)
}

// Play sound
function playSound () {
  setupSound()
  startButton.classList.add('d-none')
  stopButton.classList.remove('d-none')
  playbackSlider.disabled = false

  sound.start(0)
}

// Stop sound
function stopSound () {
  startButton.classList.remove('d-none')
  stopButton.classList.add('d-none')
  playbackSlider.disabled = true

  sound.stop(0)
}

// Change playback speed/rate
function changeRate (rate) {
  sound.playbackRate.value = rate
  playbackRate.innerHTML   = rate
}

/* iOS enable sound output */
window.addEventListener('touchstart', function () {
  // create empty buffer
  const buffer = audioContext.createBuffer(1, 1, 22050)
  const source = audioContext.createBufferSource()
  source.buffer = buffer
  source.connect(audioContext.destination)
  source.start(0)
}, false)
