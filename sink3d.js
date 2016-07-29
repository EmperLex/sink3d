'use strict';

var SINK3D = SINK3D || {}; //define namespace

SINK3D.init = function () {
	SINK3D.cvs = document.getElementById("canvas2d");
	SINK3D.ctx = SINK3D.cvs.getContext("2d");
	SINK3D.bbuf = SINK3D.ctx.getImageData(0, 0, SINK3D.cvs.width, SINK3D.cvs.height);
	SINK3D.vmat = mat4.create();
	SINK3D.pmat = mat4.create();

	
	mat4.ortho(SINK3D.pmat, -2, 2, -2, 2, 0.1, 2); 
	
	mat4.lookAt(SINK3D.vmat, 
			vec3.fromValues(0,0,0),
			vec3.fromValues(0,0,-1),
			vec3.fromValues(0,1,0)
			);
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

