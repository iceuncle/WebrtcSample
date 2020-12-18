'use strict'

//devices
var audioSource  = document.querySelector("select#audioSource");
var audioOutput  = document.querySelector("select#audioOutput");
var videoSource  = document.querySelector("select#videoSource");

//filter
var filtersSelect = document.querySelector('select#filter');

var snapshot = document.querySelector('button#snapshot');
var picture = document.querySelector('canvas#picture');
picture.width = 320;
picture.height = 240;

//videplay
var videoplay  = document.querySelector("video#player");
// var audioplay  = document.querySelector("audio#audioplayer");

var divConstraints = document.querySelector('div#constraints')

function gotDevices(deviceInfos) {

	deviceInfos.forEach(function(deviceInfo){

		var option = document.createElement('option');
		option.value = deviceInfo.deviceId;

		if (deviceInfo.kind === 'audioinput') {
			option.text = deviceInfo.label || `microphone ${audioSource.length + 1}`;
			audioSource.appendChild(option);
		}else if (deviceInfo.kind === 'audiooutput') {
			option.text = deviceInfo.label || `speaker ${audioOutput.length + 1}`;
			audioOutput.appendChild(option);
		}else if (deviceInfo.kind === 'videoinput') {
			option.text = deviceInfo.label || `camera ${videoSource.length + 1}`;
			videoSource.appendChild(option);
		};

	});
}

function gotMediaStream(stream) {
	videoplay.srcObject = stream;
	// audioplay.srcObject = stream;

	var videoTrack = stream.getVideoTracks()[0];
	var videoConstraints = videoTrack.getSettings();

	divConstraints.textContent = JSON.stringify(videoConstraints, null, 2);

	return navigator.mediaDevices.enumerateDevices();
}

function handleError (err) {
	console.log('getUserMedia error:', err);
}

function start() {
	if(!navigator.mediaDevices ||
		!navigator.mediaDevices.getUserMedia){
		console.log('getUserMedia is not supported!');
	} else {
		var deviceId = videoSource.value;
		var constraints = {
			video : {
				width: 640,
				height: 480,
				frameRate: 30,
				facingMode: 'environment',
				deviceId : deviceId ? deviceId : undefined
			},
			audio : false
			// video: false,
			// audio : {
			// 	noiseSuppression: true,
			// 	echoCancellation: true
			// }
		}
		navigator.mediaDevices.getUserMedia(constraints)
							.then(gotMediaStream)
							.then(gotDevices)
							.catch(handleError);
	}
}

start();

videoSource.onchange = start;

filtersSelect.onchange = function() {
	videoplay.className = filtersSelect.value;
}


snapshot.onclick = function() {
	picture.getContext('2d').drawImage(videoplay, 
										0, 0,
										picture.width,
										picture.height);
}

