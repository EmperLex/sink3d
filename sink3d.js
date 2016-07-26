
var SINK3D = SINK3D || {}; //define namespace
		
SINK3D.init = function () {
	SINK3D.cvs = document.getElementById("canvas2d");
	SINK3D.ctx = SINK3D.cvs.getContext("2d");
	SINK3D.img = SINK3D.ctx.getImageData(0, 0, SINK3D.cvs.width, SINK3D.cvs.height);
}

SINK3D.pix = function (idx, r, b, g, a) {
	var pixIdx = idx * 4;
	img.data[pixIdx    ] = r;
	img.data[pixIdx + 1] = b;
	img.data[pixIdx + 2] = g;
	img.data[pixIdx + 3] = a;
}


