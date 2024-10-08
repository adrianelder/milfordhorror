const photoButton = document.getElementById('snapPicture');
photoButton.addEventListener('click', picCapture, false);
const downloadButton = document.getElementById('download');
downloadButton.addEventListener('click', downloadImage, false);
const video = document.querySelector("#webcam");
const WIDTH = 600;
const HEIGHT = 400;
const trackSize = {};

navigator.mediaDevices
    .getUserMedia({
	video: {
	    width: {max: 400},
	    height: {max: 400},
	},
	audio:false,
	facingMode: 'user',
    })
    .then((mediaStream) => {
	const videoTrackSettings = mediaStream.getVideoTracks()[0].getSettings();
	trackSize.width = videoTrackSettings.width;
	trackSize.height = videoTrackSettings.height;
	photoButton.disabled = false;
	video.srcObject = mediaStream;
	video.onloadedmetadata = () => {
	    video.play();
	};
    })
    .catch((err) => {
	alert(`${err.name}: ${err.message}`);
    });

function picCapture(){
    const picture = document.getElementById('capture');
    const context = picture.getContext('2d');
    
     picture.width = trackSize.width;
     picture.height = trackSize.height;
     context.drawImage(video, 0, 0, picture.width, picture.height);

    context.strokeStyle = 'rgba(0,0,0,0.5)';
    context.fillStyle = 'rgba(0,0,0,0.5)';
    context.lineWidth = 3;
    context.lineCap = "round";
    context.beginPath(); 
    const point1 = createRandomPoint(trackSize.width, trackSize.height);
    let point2 = createRandomPoint(trackSize.width, trackSize.height);
    while (dist(point1, point2) < 100) {
	point2 = createRandomPoint();
    }
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.stroke()
    
    var dataURL = picture.toDataURL();
    const img = document.getElementById('canvasImg');
    img.src = dataURL;
    img.style.display = 'block';
    downloadButton.style.display = 'block';
}


function createRandomPoint(width, height) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    return {x, y};
}

function dist(a, b) {
    return Math.sqrt(
	Math.pow(Math.abs(a.x - b.x), 2) +
	    Math.pow(Math.abs(a.y - b.y), 2));
}


function downloadImage() {
  const link = document.createElement('a');
  link.download = 'omen-of-your-death.png';
  link.href = document.getElementById('capture').toDataURL()
  link.click();
}
