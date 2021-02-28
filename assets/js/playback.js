let sampleBuffer, sound
let loop = false

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const sampleURL = 'https://azzhexperiment.github.io/Signals-and-Systems-JS/assets/audio/beatbox.m4a'

const startButton    = document.querySelector('.start')
const stopButton     = document.querySelector('.stop')
const loopButton     = document.querySelector('.loop')
const loopStart      = document.querySelector('.loop-start')
const loopEnd        = document.querySelector('.loop-end')
const playbackSlider = document.querySelector('.playback-slider')
const playbackRate   = document.querySelector('.rate')

// Setup start/stop
startButton.onclick = playSound
stopButton.onclick  = stopSound

// load our sound
loadSound(sampleURL)

loopButton.onclick = (event) => { loopOn(event) }

playbackSlider.oninput = changeRate(playbackSlider.value)

// // Loop control
// loopStart.oninput = setLoopStart(loopStart.value)
// loopEnd.oninput   = setLoopEnd(loopEnd.value)

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
      // playButton.disabled = false
      // playButton.innerHTML = 'play'
    })
  }

  request.send()
}

// set our sound buffer, loop, and connect to destination
function setupSound () {
  sound                    = audioContext.createBufferSource()
  sound.buffer             = sampleBuffer
  sound.loop               = true
  sound.loopStart          = 0 // Start loop from beginning
  sound.loopEnd            = 0 // Immediately begin loop
  // sound.loopStart          = loopStart.value
  // sound.loopEnd            = loopEnd.value
  sound.playbackRate.value = playbackSlider.value
  // sound.detune.value = -1000;
  sound.connect(audioContext.destination)
}

// Play sound
function playSound () {
  setupSound()
  UI('play')

  startButton.classList.add('d-none')
  stopButton.classList.remove('d-none')
  playbackSlider.disabled = false

  sound.start(0)
  // sound.onended = function () {
  //   UI('stop')
  // }
}

// Stop sound
function stopSound () {
  UI('stop')
  sound.stop(0)
}

// change playback speed/rate
function changeRate (rate) {
  sound.playbackRate.value = rate
  playbackRate.innerHTML   = rate
}

function loopOn (event) {
  loop = event.target.checked
  if (sound) { // sound needs to be set before setting loop points
    if (loop) {
      loopStart.disabled = false
      loopEnd.disabled   = false
    } else {
      loopStart.disabled = true
      loopEnd.disabled   = true
    }
  } else {
    console.log('press play first and then set loop')
  }
}

// // change loopStart
// function setLoopStart (start) {
//   sound.loopStart = start
// }

// // change loopEnd
// function setLoopEnd (end) {
//   sound.loopEnd = end
// }

function UI (state) {
  switch (state) {
    case 'play':
      // playButton.disabled = true
      // stopButton.disabled = false
      startButton.classList.add('d-none')
      stopButton.classList.remove('d-none')
      playbackSlider.disabled = false
      break
    case 'stop':
      // playButton.disabled = false
      // stopButton.disabled = true
      startButton.classList.remove('d-none')
      stopButton.classList.add('d-none')
      playbackSlider.disabled = true
      break
  }
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
