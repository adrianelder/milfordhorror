const score = {
  commited: [],
  pending: [],
};

function merge(a, b) {

}
const a = new AudioSynthView(score);
a.draw();
const el = document.querySelector('video');
el.onplay = function() {
  a.start();
};
el.onended = function (e) {
  a.start();
  el.play();
}
