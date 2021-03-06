let audioContext, osc, gain

const playButton    = document.querySelector('.play')
const stopButton    = document.querySelector('.stop')
const freqSlider    = document.querySelector('.freq-slider')
const detuneSlider  = document.querySelector('.detune-slider')
const gainSlider    = document.querySelector('.gain-slider')
const gainDisplay   = document.querySelector('.gain')
const freqDisplay   = document.querySelector('.freq')
const detuneDisplay = document.querySelector('.detune')

// Starts the app. If no waveform selected, defaults to 440Hz sine wave
init()

// Setup start/stop
playButton.onclick = start
stopButton.onclick = stop

// Setup waveform changes
addEventListenerBySelector('.waveforms', 'click', function (event) {
  const type = event.target.dataset.waveform
  changeType(type)
})

// Setup note changes using detune
addEventListenerBySelector('.notes', 'click', function (event) {
  const note = event.target.dataset.note
  changeDetune(note)
})

// Update frequency when slider moves
freqSlider.oninput = function () {
  changeFreq(freqSlider.value)
}

// Detune frequency when slider moves
detuneSlider.oninput = function () {
  changeDetune(detuneSlider.value)
}

// Update gain when slider moves
gainSlider.oninput = function () {
  changeGain(gainSlider.value)
}

/**
 * Starts the app. If no waveform selected, defaults to 440Hz sine wave.
 */
function init () {
  audioContext = new (window.AudioContext || window.webkitAudioContext)()

  gain = audioContext.createGain()
  gain.gain.value = 1
  osc = audioContext.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = 440
  osc.detune.value = 0
  osc.connect(gain)
  osc.start(0)
}

/**
 * Start everything by connecting to destination
 */
function start () {
  playButton.classList.add('d-none')
  stopButton.classList.remove('d-none')

  gain.connect(audioContext.destination)
}

/**
 * stop everything by connecting to destination
 */
function stop () {
  stopButton.classList.add('d-none')
  playButton.classList.remove('d-none')

  gain.disconnect(audioContext.destination)
}

/**
 * change waveform type
 */
function changeType (type) {
  osc.type = type
}

/**
 * change frequency
 */
function changeFreq (freq) {
  osc.frequency.value = freq
  freqDisplay.innerHTML = freq + 'Hz'
}

/**
 * detune
 */
function changeDetune (cents) {
  osc.detune.value = cents
  detuneDisplay.innerHTML = cents + ' cents'
}

/**
 * change gain
 */
function changeGain (volume) {
  gain.gain.value = volume
  gainDisplay.innerHTML = volume
}

/**
 * utilities
 */
function addEventListenerBySelector (selector, event, fn) {
  const list = document.querySelectorAll(selector)

  for (let i = 0; i < list.length; i++) {
    list[i].addEventListener(event, fn, false)
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
