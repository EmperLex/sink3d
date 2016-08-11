'use strict'

var SINK3D = SINK3D || {};

//MODES TO IMPLEMENT FOR DEMONSTRATION PURPOSES
// NAIVE ALEX ALGO / BRESENHAM
// NO CLIPPING VS SUTHERLAND HODGEMAN ALGO
//PERSPECTIVE AND ORTHO

SINK3D.pix = function (idx, r, g, b, a) {
	var pixIdx = idx * 4;
	SINK3D.bbuf.data[pixIdx    ] = r;
	SINK3D.bbuf.data[pixIdx + 1] = g;
	SINK3D.bbuf.data[pixIdx + 2] = b;
	SINK3D.bbuf.data[pixIdx + 3] = a;
}

SINK3D.pixXy = function (x, y, r, g, b, a) {

	if(x >= 0 && x < SINK3D.cvs.width &&
			y >= 0 && y <= SINK3D.cvs.height) {
		var pixIdx = Math.round(y * SINK3D.cvs.width + x) * 4;
		SINK3D.bbuf.data[pixIdx    ] = r;
		SINK3D.bbuf.data[pixIdx + 1] = g;
		SINK3D.bbuf.data[pixIdx + 2] = b;
		SINK3D.bbuf.data[pixIdx + 3] = a;
	}
}


//bresenham
SINK3D.drawLine2 = function(p1, p2, img, cvs) {
	var displacment = vec2.create();
	var start = vec2.fromValues(p1[0], p1[1]);
	var end = vec2.fromValues(p2[0], p2[1]);
	vec3.subtract(displacement, p2d2, p2d1);

	var x = displacement[0];
	var y = displacement[1];
	var fast = x < y ? 'x' : 'y';

	var error = fast === 'x' ? x / 2 : y / 2; //initial error
}

//naive
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

//vec4 inc
SINK3D.drawTriangle = function (v1, v2, v3, img, cvs) {
	

	//culling
	var visible;
	if(SINK3D.cfg.bfcull) {
		var v2tov3 = vec3.create();
		vec3.sub(v2tov3, v3, v2);
		var v1tov2 = vec3.create();
		vec3.sub(v1tov2, v2, v1);
		var normal = vec3.create();
		vec3.cross(normal, v2tov3, v1tov2);
		var eyetov1 = vec3.create();
		vec3.sub(eyetov1, v1, SINK3D.cam.eye);

		visible = vec3.dot(eyetov1, normal) > 1;
	} else {
		visible = true;
	}

	if(visible) {
		SINK3D.drawLine(v1, v2, img, cvs);
		SINK3D.drawLine(v2, v3, img, cvs);
		SINK3D.drawLine(v3, v1, img, cvs);
	}
}

SINK3D.drawObject = function (obj3d) {

	//build model matrix
	var mmat = mat4.create();

	var scale = mat4.create();
	mat4.fromScaling(scale, obj3d.geometry.scale);
	var xrot = mat4.create();
	mat4.fromXRotation(xrot, obj3d.geometry.rotation[0]);
	var yrot = mat4.create();
	mat4.fromYRotation(yrot, obj3d.geometry.rotation[1]);
	var zrot = mat4.create();
	mat4.fromZRotation(zrot, obj3d.geometry.rotation[2]);
	var translation = mat4.create();
	mat4.fromTranslation(translation, obj3d.geometry.translation);

	mat4.mul(mmat, mmat, scale);
	mat4.mul(mmat, mmat, xrot);
	mat4.mul(mmat, mmat, yrot);
	mat4.mul(mmat, mmat, zrot);
	mat4.mul(mmat, mmat, translation);

	for(var triangle of obj3d.geometry.triangles) {
		
		var p = [];
		p[0] = obj3d.geometry.vertices[triangle.indices[0]].position;
		p[1] = obj3d.geometry.vertices[triangle.indices[1]].position;
		p[2] = obj3d.geometry.vertices[triangle.indices[2]].position;

		var p_prime = [];
		p_prime[0] = vec4.create(); 
		p_prime[1] = vec4.create(); 
		p_prime[2] = vec4.create(); 

		for(var i = 0; i < 3; i++) {
			vec4.transformMat4(p_prime[i], p[i], mmat);
			vec4.transformMat4(p_prime[i], p_prime[i], SINK3D.vmat);
			vec4.transformMat4(p_prime[i], p_prime[i], SINK3D.pmat);
			
			var hw = (SINK3D.cvs.width / 2);
			var hh = (SINK3D.cvs.height / 2);

			//divide by W
			p_prime[i][0] = p_prime[i][0] / p_prime[i][3];
			p_prime[i][1] = p_prime[i][1] / p_prime[i][3];
			p_prime[i][2] = p_prime[i][2] / p_prime[i][3];
			p_prime[i][3] = 1;

			p_prime[i][0] = hw + hw * p_prime[i][0];
			p_prime[i][1] = hh + hh * p_prime[i][1];
		}

		SINK3D.drawTriangle(p_prime[0], p_prime[1], p_prime[2]);
	}
}


