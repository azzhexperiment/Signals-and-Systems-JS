let appInit = false

const play = document.getElementById('play')
const type = document.getElementById('oscillator-type')
const freq = document.getElementById('freq')
const freqReading = document.getElementById('freq-reading')

// Display initial frequency beneath scrollbar
freqReading.innerHTML = freq.value

// Update frequency input for oscillator
freq.oninput = function () { freqReading.innerHTML = this.value }

// const amp = document.getElementById('amp')
// const ampReading = document.getElementById('amp-reading')
// ampReading.innerHTML = amp.value

// amp.oninput = function () { ampReading.innerHTML = this.value }


// TODO: update play status once right after init
play.addEventListener('click', init)

function init () {
  // Prevent re-initiation of app
  if (appInit) return

  console.log('App initiated')

  // Create web audio api context
  const AudioContext = window.AudioContext || window.webkitAudioContext
  const audioCtx = new AudioContext()

  // Init oscillator and gain nodes
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  // Apply gain to signal source
  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  // Might need to use $this. Or maybe not, since setOscType and setFreq works
  new setOscillatorType
  new startOscillator
  new toggleAudioOutput

  // Triggers to update oscillator properties
  type.onchange = setOscillatorType
  freq.onclick = setOscillatorFrequency
  freq.onchange = setOscillatorFrequency
  freq.onmousemove = setOscillatorFrequency
  freq.ontouchmove = setOscillatorFrequency

  console.log('Current mute status is: ' + play.getAttribute('data-muted'))

  play.onclick = toggleAudioOutput

  // Catch when oscillator ends
  oscillator.onended = () => console.log('Oscillator ended')

  function startOscillator () {
    oscillator.frequency.setValueAtTime(freq.value, audioCtx.currentTime)
    oscillator.connect(audioCtx.destination)

    oscillator.start()
    console.log('Oscillator started')
  }

  /**
   * Sets oscillator type based on user's choice
   */
  function setOscillatorType () {
    oscillator.type = type.value
    console.log('Current oscillator: ' + type.value)
  }

  /**
   * Set oscillator frequency based on current value on frequency scrollbar
   */
  function setOscillatorFrequency () {
    oscillator.frequency.value = freq.value
    console.log('Current frequency: ' + freq.value)
  }

  /**
   * Toggles audio output on/off
   */
  function toggleAudioOutput () {
    if (play.getAttribute('data-muted') === 'false') {
      // gainNode.disconnect(audioCtx.destination)
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
      play.setAttribute('data-muted', 'true')
      play.innerHTML = 'Make some noise'

      console.log('Gain set to 0. Should be muted.')
    } else {
      // gainNode.connect(audioCtx.destination)
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime)
      play.setAttribute('data-muted', 'false')
      play.innerHTML = 'Mute'

      console.log('Gain set to 1. Should have sound.')
    }
  }

  appInit = true
}
