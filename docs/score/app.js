
function parseSong(serialized) {
  return serialized.length > 0 ? JSON.parse(LZString.decompressFromBase64(serialized)) : [];
}

function serializeSong(json) {
  return LZString.compressToBase64(JSON.stringify(json));
}

const score = {
  commited: parseSong(decodeURI(location.hash).slice(1)),
  pending: [],
};
const a = new AudioSynthView(score);
a.draw();
const video = document.querySelector('video');
const start = document.querySelector('#start');
start.onclick = function () {
  a.start();
  video.play();
  start.style.display = 'none';
}
video.onended = function (e) {
  a.start();
  location.hash = serializeSong(score.commited);
  video.play();
}
const reset = document.querySelector('#reset');
reset.onclick = function () {
  video.pause();
  video.currentTime = 0;
  a.stop();

  score.commited = [];
  score.pending = [];
  location.hash = '';

  a.start();
  video.play();
};
