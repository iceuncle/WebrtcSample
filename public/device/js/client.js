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

//div
var divConstraints = document.querySelector('div#constraints')


//record
var recvideo = document.querySelector('video#replayer')
var btnRecord = document.querySelector('button#record')
var btnPlay = document.querySelector('button#recplay')
var btnDownload = document.querySelector('button#download')

var mediaRecorder;
var buffer;


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

	var videoTrack = stream.getVideoTracks()[0];
	var videoConstraints = videoTrack.getSettings();

	divConstraints.textContent = JSON.stringify(videoConstraints, null, 2);

	window.stream = stream;
	videoplay.srcObject = stream;
	// audioplay.srcObject = stream;

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


function handleDataAvailable(e) {
	if (e && e.data && e.data.size > 0) {
		buffer.push(e.data);
	};
}

function startRecord() {

	buffer = [];

	var options = {
		mimeType: 'video/webm;codecs=vp8'
	}

	if(!MediaRecorder.isTypeSupported(options.mimeType)){
		console.error(`${options.mimeType} is not supported!`);
		return;	
	}

	try{
		mediaRecorder = new MediaRecorder(window.stream, options);
	}catch(e){
		console.error('Failed to create MediaRecorder:', e);
		return;	
	}

	mediaRecorder.ondataavailable = handleDataAvailable;
	mediaRecorder.start(10);
}

function stopRecord() {
	mediaRecorder.stop();
}


btnRecord.onclick = function() {
	if (btnRecord.textContent === 'Start Record') {
		startRecord();
		btnRecord.textContent = 'Stop Record';
		btnPlay.disabled = true;
		btnDownload.disabled = true;
	} else {
		stopRecord();
		btnRecord.textContent = 'Start Record';
		btnPlay.disabled = false;
		btnDownload.disabled = false;
	}
}

btnPlay.onclick = function() {
	var blob = new Blob(buffer, {type: 'video/webm'});
	recvideo.src = window.URL.createObjectURL(blob);
	recvideo.srcObject = null;
	recvideo.controls = true;
	recvideo.play();
}

btnDownload.onclick = ()=> {
	var blob = new Blob(buffer, {type: 'video/webm'});
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement('a');

	a.href = url;
	a.style.display = 'none';
	a.download = 'aaa.webm';
	a.click();
}







