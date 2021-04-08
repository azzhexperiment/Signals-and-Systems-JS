let sampleBuffer, sound

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const filter = audioContext.createBiquadFilter()
const sampleURL = 'https://azzhexperiment.github.io/Signals-and-Systems-JS/assets/audio/beatbox.m4a'

const playButton       = document.querySelector('.play')
const stopButton       = document.querySelector('.stop')
const filterType       = document.querySelector('.filtertype')
const filterFreq       = document.querySelector('.freq')
const filterFreqSlider = document.querySelector('.filter-slider')
const filterQ          = document.querySelector('.filter-q-value')
const filterQSlider    = document.querySelector('.filter-q-slider')
const filterGain       = document.querySelector('.filter-gain-value')
const filterGainSlider = document.querySelector('.filter-gain-slider')

// Init
loadSound(sampleURL)

playButton.onclick = playSound
stopButton.onclick = stopSound

filterType.oninput       = changeFilterType(filterType.value)
filterFreqSlider.oninput = changeFilterFreq(filterFreqSlider.value)
filterQSlider.oninput    = changeFilterQ(filterQSlider.value)
filterGainSlider.oninput = (event) => { changeFilterGain(event.target.value) }

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
      sampleBuffer = buffer
      playButton.disabled = false
      playButton.innerHTML = 'play'
    })
  }

  request.send()
}

/**
 * Setup sound settings
 */
function setupSound () {
  sound        = audioContext.createBufferSource()
  sound.buffer = sampleBuffer
  sound.loop   = true
  sound.connect(filter)
  filter.connect(audioContext.destination)
}

/**
 * Play sound and toggle button
 */
function playSound () {
  setupSound()
  UI('play')
  sound.start(0)
}

/**
 * Stop sound and toggle button
 */
function stopSound () {
  UI('stop')
  sound.stop(0)
}

/**
 * change filter type and enable / disable controls depending on filter type
 *
 * @param {String} type
 */
function changeFilterType (type) {
  filter.type = type
  switch (type) {
    case 'peaking':
      filterQSlider.disabled    = false
      filterGainSlider.disabled = false
      break
    case 'lowpass':
    case 'highpass':
    case 'bandpass':
    case 'notch':
    case 'allpass':
      filterGainSlider.disabled = true
      filterQSlider.disabled    = false
      break
    case 'lowshelf':
    case 'highshelf':
      filterGainSlider.disabled = false
      filterQSlider.disabled    = true
      break
  }
}

/**
 * Change filter frequency and update display
 *
 * @param {Number} freq
 */
function changeFilterFreq (freq) {
  filter.frequency.value = freq
  filterFreq.innerHTML = freq + 'Hz'
}

/**
 * Change filter Q and update display
 *
 * @param {Number} Q
 */
function changeFilterQ (Q) {
  filter.Q.value = Q
  filterQ.innerHTML = Q
}

/**
 * Change filter Gain and update display
 *
 * @param {Number} gain
 */
function changeFilterGain (gain) {
  filter.gain.value = gain
  filterGain.innerHTML = gain + 'dB'
}

/**
 * Set state of play button
 *
 * @param {String} state
 */
function UI (state) {
  switch (state) {
    case 'play':
      playButton.classList.add('d-none')
      stopButton.classList.remove('d-none')
      filterFreqSlider.disabled = false
      filterQSlider.disabled    = false
      filterGainSlider.disabled = false
      break
    case 'stop':
      stopButton.classList.add('d-none')
      playButton.classList.remove('d-none')
      filterFreqSlider.disabled = true
      filterQSlider.disabled    = true
      filterGainSlider.disabled = true
      break
  }
}

// Enable sound output in iOS
window.addEventListener('touchstart', function () {
  const buffer = audioContext.createBuffer(1, 1, 22050)
  const source = audioContext.createBufferSource()

  source.buffer = buffer
  source.connect(audioContext.destination)
  source.start(0)
}, false)
