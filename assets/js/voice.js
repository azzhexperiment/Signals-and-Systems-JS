let source, soundSource, drawVisual

const convolverUrl  = 'https://azzhexperiment.github.io/Signals-and-Systems-JS/assets/audio/concert-crowd.ogg'

const heading       = document.querySelector('h3')
const canvas        = document.querySelector('.visualizer')
const playButton    = document.querySelector('.play')
const stopButton    = document.querySelector('.stop')
const intendedWidth = document.querySelector('main').clientWidth
const voiceSelect   = document.getElementById('voice')
const visualSelect  = document.getElementById('visual')

heading.textContent = 'CLICK ANYWHERE TO START'

document.body.addEventListener('click', init)

/**
 * Main function to power experiment
 */
function init () {
  prepUI()

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  const analyser     = audioCtx.createAnalyser()
  const distortion   = audioCtx.createWaveShaper()
  const gainNode     = audioCtx.createGain()
  const biquadFilter = audioCtx.createBiquadFilter()
  const convolver    = audioCtx.createConvolver()

  setAnalyser()
  getConvolver()

  // Set up canvas context for visualizer
  const canvasCtx = canvas.getContext('2d')

  canvas.setAttribute('width', intendedWidth)

  // Event listeners to change visualize and voice settings
  visualSelect.onchange = setVisual
  voiceSelect.onchange  = voiceChange

  // Setup start/stop
  playButton.onclick = start
  stopButton.onclick = stop

  start()

  // main block for doing the audio recording
  if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.')
    const constraints = { audio: true }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function (stream) {
        source = audioCtx.createMediaStreamSource(stream)
        source.connect(distortion)
        distortion.connect(biquadFilter)
        biquadFilter.connect(gainNode)
        convolver.connect(gainNode)
        gainNode.connect(analyser)
        analyser.connect(audioCtx.destination)

        visualize()
        voiceChange()
      })
      .catch(function (err) {
        console.log('The following gUM error occured: ' + err)
      })
  } else {
    console.log('getUserMedia not supported by browser')
  }

  /**
   * Clears header
   */
  function prepUI () {
    heading.textContent = ''
    document.body.removeEventListener('click', init)

    queryMediaDevices()
  }

  /**
   * Polyfill for media devices
   *
   * @returns {Promise}
   */
  function queryMediaDevices () {
    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if (navigator.mediaDevices === undefined) { navigator.mediaDevices = {} }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        // First get ahold of the legacy getUserMedia, if present
        const getUserMedia = navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject)
        })
      }
    }
  }

  /**
   * Calculate distortion curve for audio visualisation
   *
   * Distortion curve for the waveshaper, thanks to Kevin Ennis
   * http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion
   *
   * @param {Number} amount
   * @returns {Array} curve
   */
  function makeDistortionCurve (amount) {
    let x

    const k = typeof amount === 'number' ? amount : 50
    const nSamples = 44100
    const curve    = new Float32Array(nSamples)
    const deg      = Math.PI / 180

    for (let i = 0; i < nSamples; ++i) {
      x = i * 2 / nSamples - 1
      curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x))
    }

    return curve
  }

  /**
   * Sets initial values of analyser
   */
  function setAnalyser () {
    analyser.minDecibels = -90
    analyser.maxDecibels = -10
    analyser.smoothingTimeConstant = 0.85
  }

  /**
   * Get convolver node audio track
   */
  function getConvolver () {
    const ajax = new window.XMLHttpRequest()

    ajax.open('GET', convolverUrl, true)

    ajax.responseType = 'arraybuffer'

    ajax.onload = function () {
      const audioData = ajax.response

      audioCtx.decodeAudioData(audioData, function (buffer) {
        soundSource = audioCtx.createBufferSource()
        convolver.buffer = buffer
      }, function (e) { console.log('Error with decoding audio data' + e.err) })

      soundSource.connect(audioCtx.destination)
      soundSource.loop = true
      soundSource.start()
    }

    ajax.send()
  }

  /**
   * Sets current frame for audio visual
   */
  function setVisual () {
    window.cancelAnimationFrame(drawVisual)
    visualize()
  }

  function visualize () {
    const WIDTH  = canvas.width
    const HEIGHT = canvas.height

    const visualSetting = visualSelect.value
    console.log(visualSetting)

    if (visualSetting === 'sinewave') {
      analyser.fftSize = 2048
      const bufferLength = analyser.fftSize
      console.log(bufferLength)
      const dataArray = new Uint8Array(bufferLength)

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

      const draw = function () {
        drawVisual = window.requestAnimationFrame(draw)

        analyser.getByteTimeDomainData(dataArray)

        canvasCtx.fillStyle = 'rgb(200, 200, 200)'
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

        canvasCtx.lineWidth = 2
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)'

        canvasCtx.beginPath()

        const sliceWidth = WIDTH * 1.0 / bufferLength
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0
          const y = v * HEIGHT / 2

          if (i === 0) {
            canvasCtx.moveTo(x, y)
          } else {
            canvasCtx.lineTo(x, y)
          }

          x += sliceWidth
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2)
        canvasCtx.stroke()
      }

      draw()
    } else if (visualSetting === 'frequencybars') {
      analyser.fftSize = 256
      const bufferLengthAlt = analyser.frequencyBinCount
      console.log(bufferLengthAlt)
      const dataArrayAlt = new Uint8Array(bufferLengthAlt)

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)

      const drawAlt = function () {
        drawVisual = window.requestAnimationFrame(drawAlt)

        analyser.getByteFrequencyData(dataArrayAlt)

        canvasCtx.fillStyle = 'rgb(0, 0, 0)'
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

        const barWidth = (WIDTH / bufferLengthAlt) * 2.5
        let barHeight
        let x = 0

        for (let i = 0; i < bufferLengthAlt; i++) {
          barHeight = dataArrayAlt[i]

          canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)'
          canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2)

          x += barWidth + 1
        }
      }

      drawAlt()
    } else if (visualSetting === 'off') {
      console.log('This is turned off')
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT)
      canvasCtx.fillStyle = 'rgb(0, 0, 0)'
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)
    }
  }

  function voiceChange () {
    distortion.oversample = '4x'
    biquadFilter.gain.setTargetAtTime(0, audioCtx.currentTime, 0)

    const voiceSetting = voiceSelect.value
    console.log(voiceSetting)

    // when convolver is selected it is connected back into the audio path
    if (voiceSetting === 'convolver') {
      biquadFilter.disconnect(0)
      biquadFilter.connect(convolver)
    } else {
      biquadFilter.disconnect(0)
      biquadFilter.connect(gainNode)

      if (voiceSetting === 'distortion') {
        distortion.curve = makeDistortionCurve(400)
      } else if (voiceSetting === 'biquad') {
        biquadFilter.type = 'lowshelf'
        biquadFilter.frequency.setTargetAtTime(1000, audioCtx.currentTime, 0)
        biquadFilter.gain.setTargetAtTime(25, audioCtx.currentTime, 0)
      } else if (voiceSetting === 'off') {
        console.log('Voice settings turned off')
      }
    }
  }

  /**
   * Start sound and toggle button
   */
  function start () {
    gainNode.gain.value = 1
    playButton.classList.add('d-none')
    stopButton.classList.remove('d-none')
  }

  /**
   * Stop sound and toggle button
   */
  function stop () {
    gainNode.gain.value = 0
    stopButton.classList.add('d-none')
    playButton.classList.remove('d-none')
  }
}
