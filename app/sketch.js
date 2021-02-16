const ampInput = document.getElementById('amp')
const ampOutput = document.getElementById('ampOutput')
const freqInput = document.getElementById('freq')
const freqOutput = document.getElementById('freqOutput')
const stopAudioBtn = document.getElementById('stop')
const playAudioBtn = document.getElementById('play')

ampOutput.innerHTML = ampInput.value
freqOutput.innerHTML = freqInput.value

ampInput.oninput = function () {
  ampOutput.innerHTML = this.value
}

freqInput.oninput = function () {
  freqOutput.innerHTML = this.value
}

// create web audio api context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

// create Oscillator node
const oscillator = audioCtx.createOscillator()

oscillator.type = 'square'
oscillator.frequency.setValueAtTime(440, audioCtx.currentTime) // value in hertz
oscillator.connect(audioCtx.destination)

playAudioBtn.addEventListener('click', oscillator.start())
stopAudioBtn.addEventListener('click', oscillator.stop())

// let osc, playing, freq, amp;

// ampOutput.innerHTML = ampInput.value
// freqOutput.innerHTML = freqInput.value;

// ampInput.oninput = function () {
// 	ampOutput.innerHTML = this.value;
// }

// freqInput.oninput = function () {
// 	freqOutput.innerHTML = this.value;
// }

// function setup() {
//   let cnv = createCanvas(100, 100)
//   // cnv.mousePressed(playOscillator)
//   playAudioBtn.addEventListener('click', playOscillator)
//   stopAudioBtn.addEventListener('click', mouseReleased)
//   osc = new p5.Oscillator('sine')
// }

// function draw() {
//   // background(220)
//   // freq = constrain(map(mouseX, 0, width, 100, 500), 100, 500);
//   // amp = constrain(map(mouseY, height, 0, 0, 1), 0, 1);

//   // text('tap to play', 20, 20);
//   // text('freq: ' + freq, 20, 40);
//   // text('amp: ' + amp, 20, 60);

//   if (playing) {
//     // smooth the transitions by 0.1 seconds
//     osc.freq(freqInput, 0.1);
//     osc.amp(ampInput, 0.1);
//   }
// }

// function playOscillator() {
//   // starting an oscillator on a user gesture will enable audio
//   // in browsers that have a strict autoplay policy.
//   // See also: userStartAudio();
//   osc.start();
//   playing = true;
// }

// function mouseReleased() {
//   // ramp amplitude to 0 over 0.5 seconds
//   osc.amp(0, 0.5);
//   playing = false;
// }
