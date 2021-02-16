// create our AudioContext and Oscillator Nodes
let audioContext, osc, gain

// assign our sliders and buttons to variables
const startButton = document.querySelector('.start')
const stopButton = document.querySelector('.stop')
const waveformButtons = document.querySelectorAll('.waveforms button')
const freqSlider = document.querySelector('.freq-slider')
const detuneSlider = document.querySelector('.detune-slider')
const gainSlider = document.querySelector('.gain-slider')
const gainDisplay = document.querySelector('.gain')
const freqDisplay = document.querySelector('.freq')
const detuneDisplay = document.querySelector('.detune')

// load our default value
init()

// setup start/stop
startButton.onclick = start
stopButton.onclick = stop

// setup waveform changes
addEventListenerBySelector('.waveforms button', 'click', function (event) {
  var type = event.target.dataset.waveform
  changeType(type)
})

// setup note changes using detune
addEventListenerBySelector('.notes button', 'click', function (event) {
  var note = event.target.dataset.note
  changeDetune(note)
})

// update frequency when slider moves
freqSlider.oninput = function () {
  changeFreq(freqSlider.value)
}

// detune frequency when slider moves
detuneSlider.oninput = function () {
  changeDetune(detuneSlider.value)
}

// update gain when slider moves
gainSlider.oninput = function () {
  changeGain(gainSlider.value)
}

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

// start everything by connecting to destination
function start () {
  UI('start')
  gain.connect(audioContext.destination)
}

// stop everything by connecting to destination
function stop () {
  UI('stop')
  gain.disconnect(audioContext.destination)
}

// change waveform type
function changeType (type) {
  osc.type = type
}

// change frequency
function changeFreq (freq) {
  osc.frequency.value = freq
  freqDisplay.innerHTML = freq + 'Hz'
}

// detune
function changeDetune (cents) {
  osc.detune.value = cents
  detuneDisplay.innerHTML = cents + ' cents'
}

// change gain
function changeGain (volume) {
  gain.gain.value = volume
  gainDisplay.innerHTML = volume
}

// utilities
function addEventListenerBySelector (selector, event, fn) {
  var list = document.querySelectorAll(selector)
  for (var i = 0, len = list.length; i < len; i++) {
    list[i].addEventListener(event, fn, false)
  }
}

function UI (state) {
  switch (state) {
    case 'start':
      startButton.disabled = true
      waveformButtons.disable = false
      stopButton.disabled = false
      break
    case 'stop':
      startButton.disabled = false
      waveformButtons.disable = true
      stopButton.disabled = true
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

// let appInit = false

// const play = document.getElementById('play')
// const type = document.getElementById('oscillator-type')
// const freq = document.getElementById('freq')
// const freqReading = document.getElementById('freq-reading')

// // Display initial frequency beneath scrollbar
// freqReading.innerHTML = freq.value

// // Update frequency input for oscillator
// freq.oninput = function () { freqReading.innerHTML = this.value }

// // const amp = document.getElementById('amp')
// // const ampReading = document.getElementById('amp-reading')
// // ampReading.innerHTML = amp.value

// // amp.oninput = function () { ampReading.innerHTML = this.value }

// // TODO: update play status once right after init
// play.addEventListener('click', init)

// function init () {
//   // Prevent re-initiation of app
//   if (appInit) return

//   console.log('App initiated')

//   // Create web audio api context
//   const AudioContext = window.AudioContext || window.webkitAudioContext
//   const audioCtx = new AudioContext()

//   // Init oscillator and gain nodes
//   const oscillator = audioCtx.createOscillator()
//   const gainNode = audioCtx.createGain()

//   // Apply gain to signal source
//   oscillator.connect(gainNode)
//   gainNode.connect(audioCtx.destination)

//   // Init
//   new setOscillatorType
//   new startOscillator
//   new toggleAudioOutput

//   // Triggers to update oscillator properties
//   type.onchange = setOscillatorType
//   freq.onclick = setOscillatorFrequency
//   freq.onchange = setOscillatorFrequency
//   freq.onmousemove = setOscillatorFrequency
//   freq.ontouchmove = setOscillatorFrequency

//   console.log('Current mute status is: ' + play.getAttribute('data-muted'))

//   play.onclick = toggleAudioOutput

//   // Catch when oscillator ends
//   oscillator.onended = () => console.log('Oscillator ended')

//   function startOscillator () {
//     oscillator.frequency.setValueAtTime(freq.value, audioCtx.currentTime)
//     oscillator.connect(audioCtx.destination)

//     oscillator.start()
//     console.log('Oscillator started')
//   }

//   /**
//    * Sets oscillator type based on user's choice
//    */
//   function setOscillatorType () {
//     oscillator.type = type.value
//     console.log('Current oscillator: ' + type.value)
//   }

//   /**
//    * Set oscillator frequency based on current value on frequency scrollbar
//    */
//   function setOscillatorFrequency () {
//     oscillator.frequency.value = freq.value
//     console.log('Current frequency: ' + freq.value)
//   }

//   /**
//    * Toggles audio output on/off
//    */
//   function toggleAudioOutput () {
//     if (play.getAttribute('data-muted') === 'false') {
//       // gainNode.disconnect(audioCtx.destination)
//       gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
//       play.setAttribute('data-muted', 'true')
//       play.innerHTML = 'Make some noise'

//       console.log('Gain set to 0. Should be muted.')
//     } else {
//       // gainNode.connect(audioCtx.destination)
//       gainNode.gain.setValueAtTime(1, audioCtx.currentTime)
//       play.setAttribute('data-muted', 'false')
//       play.innerHTML = 'Mute'

//       console.log('Gain set to 1. Should have sound.')
//     }
//   }

//   appInit = true
// }
