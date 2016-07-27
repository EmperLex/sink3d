'use strict';


var SINK3D = SINK3D || {}; //define namespace

SINK3D.init = function () {
	SINK3D.cvs = document.getElementById("canvas2d");
	SINK3D.ctx = SINK3D.cvs.getContext("2d");
	SINK3D.bbuf = SINK3D.ctx.getImageData(0, 0, SINK3D.cvs.width, SINK3D.cvs.height);
	SINK3D.vmat = mat4.create();
	SINK3D.pmat = mat4.create();

	
	mat4.ortho(SINK3D.pmat, -10, 10, -10, 10, 0.1, 100); 
	
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

SINK3D.pix = function (idx, r, g, b, a) {
	var pixIdx = idx * 4;
	SINK3D.bbuf.data[pixIdx    ] = r;
	SINK3D.bbuf.data[pixIdx + 1] = g;
	SINK3D.bbuf.data[pixIdx + 2] = b;
	SINK3D.bbuf.data[pixIdx + 3] = a;
}

SINK3D.pixXy = function (x, y, r, g, b, a) {
	var pixIdx = Math.round(y * SINK3D.cvs.width + x) * 4;
	SINK3D.bbuf.data[pixIdx    ] = r;
	SINK3D.bbuf.data[pixIdx + 1] = g;
	SINK3D.bbuf.data[pixIdx + 2] = b;
	SINK3D.bbuf.data[pixIdx + 3] = a;
}

SINK3D.drawBuffer = function () {
	SINK3D.ctx.putImageData(SINK3D.bbuf, 0,0);
}

// GEOMETRY DEF

SINK3D.Vertex = function (position, color) {
	this.position = position;
	this.color = color;
}

SINK3D.Geometry = function (verticies, faces) {
	this.verticies = verticies;
	this.faces = faces;
}

SINK3D.Face = function (idx1, idx2, idx3) {
	this.idx1 = idx1;
	this.idx2 = idx2;
	this.idx3 = idx3;
}

SINK3D.draw = function (geometry) {
	for(var vertex of geometry.verticies) {
		
		var position = vec4.clone(vertex.position);
		var color = vec4.clone(vertex.color);

		vec4.transformMat4(position, position, geometry.mmat);
		vec4.transformMat4(position, position, SINK3D.vmat);
		vec4.transformMat4(position, position, SINK3D.pmat);

		var hw = (SINK3D.cvs.width / 2);
		var hh = (SINK3D.cvs.height / 2);

		position[0] = hw + hw * position[0];
		position[1] = hh + hh * position[1];

		SINK3D.pixXy(position[0], position[1], color[0], 
				color[1], color[2], color[3]);
	}
}


