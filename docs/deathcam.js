const photoButton = document.getElementById('snapPicture');
photoButton.addEventListener('click', picCapture, false);
const video = document.querySelector("#webcam");
const WIDTH = 600;
const HEIGHT = 400;
const trackSize = {};
navigator.mediaDevices
    .getUserMedia({
	video: {
	    width: { max: 400 },
	    height: { max: 400 },
	},
	audio:false,
	facingMode: 'user',
    })
    .then((mediaStream) => {
	const videoTrackSettings = mediaStream.getVideoTracks()[0].getSettings();
	trackSize.width = videoTrackSettings.width;
	trackSize.height = videoTrackSettings.height;
	debugger;
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
     const picture = document.getElementById('capture'),
     context = picture.getContext('2d');

     picture.width = trackSize.width;
     picture.height = trackSize.height;
     context.drawImage(video, 0, 0, picture.width, picture.height);

    context.strokeStyle = 'rgba(0,0,0,0.5)';
    context.fillStyle = 'rgba(0,0,0,0.5)';
    context.lineWidth = 3;
    context.lineCap = "round";
    context.beginPath(); // Start a new path

    const point1 = createRandomPoint();
    let point2 = createRandomPoint();
    while (dist(point1, point2) < 100) {
	point2 = createRandomPoint();
    }
    context.moveTo(point1.x, point1.y); // Move the pen to (30, 50)
    context.lineTo(point2.x, point2.y); // Draw a line to (150, 100)
    context.stroke(); // Render the path
    
    var dataURL = picture.toDataURL();
    const img = document.getElementById('canvasImg');
    img.src = dataURL;
    img.style.display = 'block';
}


function createRandomPoint() {
    const x = Math.floor(Math.random() * trackSize.width);
    const y = Math.floor(Math.random() * trackSize.height);
    return {x, y};
}

function dist(a, b) {
    return Math.sqrt(
	Math.pow(Math.abs(a.x - b.x), 2) +
	Math.pow(Math.abs(a.y - b.y), 2));
}
