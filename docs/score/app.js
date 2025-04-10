// Hides mobile browser's address bar when page is done loading.
window.addEventListener('load', function(e) {
    setTimeout(function() { window.scrollTo(0, 1); }, 1);
}, false);

const helpButton = document.querySelector('#help-button');
const helpDialog = document.querySelector('#help-dialog');
helpButton.onclick = () => {
    helpDialog.style.display = 'block';
}
helpDialog.onclick = () => {
    helpDialog.style.display = 'none';
}
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

const shareButton = document.querySelector('#share');
if (!navigator.share) {
  shareButton.style.display = 'none';
} else {
  shareButton.onclick = function () {
    const tmp = [...score.commited, ...score.pending];
    tmp.sort(function (a, b) {
      return a[1] - b[1];
    });
    location.hash = serializeSong(tmp);
    const shareData = {
      title: "My Nosferatu Score",
      text: "",
      url: location.href,
    };
    navigator.share(shareData);
  };
}
