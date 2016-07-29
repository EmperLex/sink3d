'use strict'

var SINK3D = SINK3D || {};

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

// primitive drawing
SINK3D.drawLine = function(p1, p2, img, cvs) {
	var disp = vec2.create();
	var p2d1 = vec2.fromValues(p1[0], p1[1]);
	var p2d2 = vec2.fromValues(p2[0], p2[1]);
	vec3.subtract(disp, p2d2, p2d1);
	
	var len = vec2.length(disp);
	var step = 1.0/len;
	
	for(var i = 0; i <= 1.0; i += step) {
		var partDisp = vec2.create();
		vec2.scale(partDisp, disp, i);
		
		var p = vec2.create();
		vec2.add(p, p2d1, partDisp);
		
		SINK3D.pixXy(p[0] >> 0, p[1] >> 0, 255, 0, 0, 255, img, cvs);
	}
}

SINK3D.drawTriangle = function (v1, v2, v3, img, cvs) {
	SINK3D.drawLine(v1, v2, img, cvs);
	SINK3D.drawLine(v2, v3, img, cvs);
	SINK3D.drawLine(v3, v1, img, cvs);
}

SINK3D.drawObject = function (obj3d) {

	var mmat = mat4.create();
	mat4.fromYRotation(mmat, obj3d.geometry.rotation[1]);

	var xmat = mat4.create();
	mat4.fromXRotation(xmat, obj3d.geometry.rotation[0]);

	mat4.mul(mmat, mmat, xmat);	

	for(var triangle of obj3d.geometry.triangles) {
		
		var p = [];
		p[0] = vec3.clone(obj3d.geometry.vertices[triangle.indices[0]].position);
		p[1] = vec3.clone(obj3d.geometry.vertices[triangle.indices[1]].position);
		p[2] = vec3.clone(obj3d.geometry.vertices[triangle.indices[2]].position);

		for(var position of p) {
			vec3.transformMat4(position, position, mmat);
			vec3.transformMat4(position, position, SINK3D.vmat);
			vec3.transformMat4(position, position, SINK3D.pmat);

			var hw = (SINK3D.cvs.width / 2);
			var hh = (SINK3D.cvs.height / 2);

			position[0] = hw + hw * position[0];
			position[1] = hh + hh * position[1];
		}

		SINK3D.drawTriangle(p[0], p[1], p[2]);
	}
}


