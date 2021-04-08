let sampleBuffer, sound

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const sampleURL = 'https://azzhexperiment.github.io/Signals-and-Systems-JS/assets/audio/beatbox.m4a'

const playButton     = document.querySelector('.play')
const stopButton     = document.querySelector('.stop')
const playbackSlider = document.querySelector('.playback-slider')
const playbackRate   = document.querySelector('.rate')

// Setup start/stop
playButton.onclick = playSound
stopButton.onclick = stopSound

// Init
loadSound(sampleURL)

playbackSlider.oninput = changeRate(playbackSlider.value)

/**
 * Load sounds via ajax
 *
 * @param {String} url
 */
function loadSound (url) {
  const request = new window.XMLHttpRequest()
  request.open('GET', url, true)
  request.responseType = 'arraybuffer'

  request.onload = function () {
    audioContext.decodeAudioData(request.response, function (buffer) {
      const soundLength = buffer.duration
      sampleBuffer = buffer
    })
  }

  request.send()
}

/**
 * Setup sound settings
 */
function setupSound () {
  sound                    = audioContext.createBufferSource()
  sound.buffer             = sampleBuffer
  sound.loop               = true
  sound.playbackRate.value = playbackSlider.value
  // sound.detune.value = -1000;
  sound.connect(audioContext.destination)
}

/**
 * Play sound and toggle button
 */
function playSound () {
  setupSound()
  playButton.classList.add('d-none')
  stopButton.classList.remove('d-none')
  playbackSlider.disabled = false

  sound.start(0)
}

/**
 * Stop sound and toggle button
 */
function stopSound () {
  stopButton.classList.add('d-none')
  playButton.classList.remove('d-none')
  playbackSlider.disabled = true

  sound.stop(0)
}

/**
 * Change playback speed/rate
 *
 * @param {Number} rate
 */
function changeRate (rate) {
  sound.playbackRate.value = rate
  playbackRate.innerHTML   = rate
}

// Enable sound output in iOS
window.addEventListener('touchstart', function () {
  const buffer = audioContext.createBuffer(1, 1, 22050)
  const source = audioContext.createBufferSource()

  source.buffer = buffer
  source.connect(audioContext.destination)
  source.start(0)
}, false)
