(function () {
  var audio = document.getElementById('music');
  var gate = document.getElementById('gate');
  var enter = document.getElementById('enter');
  var sound = document.getElementById('sound');
  var label = document.getElementById('sound-label');
  var TARGET = 0.6;
  var fadeTimer;

  function readMuted() {
    try { return localStorage.getItem('dk-muted') === '1'; } catch (e) { return false; }
  }
  function saveMuted(v) {
    try { localStorage.setItem('dk-muted', v ? '1' : '0'); } catch (e) {}
  }

  var muted = readMuted();

  function render() {
    sound.setAttribute('aria-pressed', muted ? 'false' : 'true');
    label.textContent = muted ? 'SOUND: OFF' : 'SOUND: ON';
  }

  function fadeTo(volume, done) {
    clearInterval(fadeTimer);
    fadeTimer = setInterval(function () {
      var step = (volume - audio.volume) / 6;
      if (Math.abs(volume - audio.volume) < 0.02) {
        audio.volume = volume;
        clearInterval(fadeTimer);
        if (done) done();
      } else {
        audio.volume = Math.max(0, Math.min(1, audio.volume + step));
      }
    }, 60);
  }

  function play() {
    audio.volume = 0;
    var p = audio.play();
    if (p && p.then) p.then(function () { fadeTo(TARGET); }).catch(function () {
      muted = true; render();
    });
  }

  enter.addEventListener('click', function () {
    gate.classList.add('gone');
    document.body.classList.remove('locked');
    if (!muted) play();
    sound.focus({ preventScroll: true });
  });

  sound.addEventListener('click', function () {
    muted = !muted;
    saveMuted(muted);
    render();
    if (muted) {
      fadeTo(0, function () { audio.pause(); });
    } else {
      play();
    }
  });

  render();
})();
