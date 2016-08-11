'use strict';

var SINK3D = SINK3D || {}; //define namespace

function handleKeyEvent(event) {

	//enable disable backface culling
	if(event.keyCode == 67 /*'c'*/) {
		SINK3D.cfg.bfcull = !SINK3D.cfg.bfcull;
	} else if (event.keyCode == 87 /*'w'*/) {
		SINK3D.cam.eye[2] = SINK3D.cam.eye[2] - 0.01;
		updateCam();
	}
}

function updateCam() {
	mat4.lookAt(SINK3D.vmat, 
			SINK3D.cam.eye,
			SINK3D.cam.fwd,
			SINK3D.cam.up
			);
}

SINK3D.init = function () {

	SINK3D.cfg = {};
	SINK3D.cfg.bfcull = true;

	SINK3D.cvs = document.getElementById("canvas2d");
	window.addEventListener('keydown', handleKeyEvent, false);	

	SINK3D.ctx = SINK3D.cvs.getContext("2d");
	SINK3D.bbuf = SINK3D.ctx.getImageData(0, 0, SINK3D.cvs.width, SINK3D.cvs.height);
	SINK3D.vmat = mat4.create();
	SINK3D.pmat = mat4.create();

	SINK3D.cam = {};
	SINK3D.cam.eye = vec3.fromValues(0,0,4);
	SINK3D.cam.fwd = vec3.fromValues(0,0,-1);
	SINK3D.cam.up = vec3.fromValues(0,1,0);

	mat4.perspective(SINK3D.pmat, 3.1415 / 2, SINK3D.cvs.width / SINK3D.cvs.height, 0.1, 10);
	//mat4.ortho(SINK3D.pmat, -8, 8, -6, 6, 0.1, 10);
	
	updateCam();
}

SINK3D.clearColor = function (color) {
	SINK3D.cc = color;	
}

SINK3D.clear = function () {

	if(typeof SINK3D.cc === "undefined") {
		SINK3D.cc = vec4.create();
		SINK3D.cc[3] = 255;
	}

	for(var x=0; x < SINK3D.cvs.width * SINK3D.cvs.height; x++) {
		var cc = SINK3D.cc;
		SINK3D.pix(x, cc[0], cc[1], cc[2], cc[3]);	
	}
}

SINK3D.drawBuffer = function () {
	SINK3D.ctx.putImageData(SINK3D.bbuf, 0,0);
}

