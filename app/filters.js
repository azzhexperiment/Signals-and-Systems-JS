const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const filter = audioContext.createBiquadFilter()
const sampleURL = 'https://azzhexperiment.github.io/Signals-and-Systems-JS/assets/audio/beatbox.m4a'
let sampleBuffer; let sound
const playButton = document.querySelector('.play')
const stopButton = document.querySelector('.stop')
let loop = false
const loopButton = document.querySelector('.loop')

const filterType = document.querySelector('.filtertype')
const filterFreq = document.querySelector('.freq')
const filterFreqSlider = document.querySelector('.filter-slider')

const filterQ = document.querySelector('.filter-q-value')
const filterQSlider = document.querySelector('.filter-q-slider')

const filterGain = document.querySelector('.filter-gain-value')
const filterGainSlider = document.querySelector('.filter-gain-slider')

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
  loop = event.target.checked
}

filterType.oninput = function () {
  changeFilterType(filterType.value)
}

filterFreqSlider.oninput = function () {
  changeFilterFreq(filterFreqSlider.value)
}

filterQSlider.oninput = function () {
  changeFilterQ(filterQSlider.value)
}

filterGainSlider.oninput = function (event) {
  changeFilterGain(event.target.value)
}

// function to load sounds via AJAX
function loadSound (url) {
  const request = new window.XMLHttpRequest()
  request.open('GET', url, true)
  request.responseType = 'arraybuffer'

  request.onload = function () {
    audioContext.decodeAudioData(request.response, function (buffer) {
      sampleBuffer = buffer
      playButton.disabled = false
      playButton.innerHTML = 'play'
    })
  }

  request.send()
}
// setup sound, loop, and connect to destination
function setupSound () {
  sound = audioContext.createBufferSource()
  sound.buffer = sampleBuffer
  sound.loop = loop
  sound.connect(filter)
  filter.connect(audioContext.destination)
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

// change filter type and enable / disable controls depending on filter type
function changeFilterType (type) {
  filter.type = type
  switch (type) {
    case 'peaking':
      filterQSlider.disabled = false
      filterGainSlider.disabled = false
      break
    case 'lowpass':
    case 'highpass':
    case 'bandpass':
    case 'notch':
    case 'allpass':
      filterGainSlider.disabled = true
      filterQSlider.disabled = false
      break
    case 'lowshelf':
    case 'highshelf':
      filterGainSlider.disabled = false
      filterQSlider.disabled = true
      break
  }
}

// change filter frequency and update display
function changeFilterFreq (freq) {
  filter.frequency.value = freq
  filterFreq.innerHTML = freq + 'Hz'
}

// change filter Q and update display
function changeFilterQ (Q) {
  filter.Q.value = Q
  filterQ.innerHTML = Q
}

// change filter Gain and update display
function changeFilterGain (gain) {
  filter.gain.value = gain
  filterGain.innerHTML = gain + 'dB'
}

function UI (state) {
  switch (state) {
    case 'play':
      playButton.disabled = true
      stopButton.disabled = false
      filterFreqSlider.disabled = false
      filterQSlider.disabled = false
      filterGainSlider.disabled = false
      break
    case 'stop':
      playButton.disabled = false
      stopButton.disabled = true
      filterFreqSlider.disabled = true
      filterQSlider.disabled = true
      filterGainSlider.disabled = true
      break
  }
}

/* ios enable sound output */
window.addEventListener('touchstart', function () {
  // create empty buffer
  const buffer = audioContext.createBuffer(1, 1, 22050)
  const source = audioContext.createBufferSource()
  source.buffer = buffer
  source.connect(audioContext.destination)
  source.start(0)
}, false)
