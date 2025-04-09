const el = document.querySelector('video');
el.onended = function (e) {
  //Do whatever you want
  el.play();
}
const a = new AudioSynthView();
a.draw();
