'use strict'

var videoplay  = document.querySelector("video#player");


function gotMediaStream(stream) {
	videoplay.srcObject = stream;
}

function handleError (err) {
	console.log('getUserMedia error:', err);
}

if(!navigator.mediaDevices ||
	!navigator.mediaDevices.getUserMedia){
	console.log('getUserMedia is not supported!');
}else {
	var constraints = {
		video : true,
		audio : true
	}
	navigator.mediaDevices.getUserMedia(constraints).then(gotMediaStream)
}


