let osc, playing, freq, amp

function setup () {
  const cnv = createCanvas(1500, 1000)
  cnv.mousePressed(playOscillator)
  osc = new p5.Oscillator('sine')
}

function draw () {
  background(110)
  freq = constrain(map(mouseX, 0, width, 0, 20000), 0, 20000)
  amp = constrain(map(mouseY, height, 0, 0, 10), 0, 10)

  text('tap to play', 20, 20)
  text('freq: ' + freq, 20, 40)
  text('amp: ' + amp, 20, 60)

  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0.1)
    osc.amp(amp, 0.1)
  }
}

function playOscillator () {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  osc.start()
  playing = true
}

function mouseReleased () {
  // ramp amplitude to 0 over 0.5 seconds
  osc.amp(0, 0.5)
  playing = false
}
