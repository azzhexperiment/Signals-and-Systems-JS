let appInit = false

const type = document.getElementById('oscillator-type')
// const amp = document.getElementById('amp')
const freq = document.getElementById('freq')
// const ampReading = document.getElementById('amp-reading')
const freqReading = document.getElementById('freq-reading')
const play = document.getElementById('play')

// ampReading.innerHTML = amp.value
freqReading.innerHTML = freq.value

// amp.oninput = function () {
//   ampReading.innerHTML = this.value
// }

freq.oninput = function () {
  freqReading.innerHTML = this.value
}

play.addEventListener('click', init)

function init () {
  // Prevent re-initiation of app
  if (appInit) return

  // Create web audio api context
  const AudioContext = window.AudioContext || window.webkitAudioContext
  const audioCtx = new AudioContext()

  // Create Oscillator and gain node
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  // Connect oscillator to gain node to speakers
  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  updateOscillatorType

  oscillator.frequency.setValueAtTime(freq.value, audioCtx.currentTime)
  oscillator.connect(audioCtx.destination)

  oscillator.start()

  type.onchange = updateOscillatorType
  freq.onmousemove = updateFrequency
  freq.ontouchmove = updateFrequency

  console.log('The oscillator frequency is ' + freq.value)

  play.onclick = function () {
    if (play.getAttribute('data-muted') === 'false') {
      gainNode.disconnect(audioCtx.destination)
      play.setAttribute('data-muted', 'true')
      play.innerHTML = 'Make some noise'
    } else {
      gainNode.connect(audioCtx.destination)
      play.setAttribute('data-muted', 'false')
      play.innerHTML = 'Mute'
    }
  }

  // Catch when oscillator ends
  oscillator.onended = () => console.log('Oscillator ended')

  function updateOscillatorType () {
    oscillator.type = type.value
    console.log('Current oscillator: ' + oscillatorType)
  }

  function updateFrequency () {
    oscillator.frequency.value = freq.value
    console.log('Current frequency: ' + freq.value)
  }

  appInit = true
}
