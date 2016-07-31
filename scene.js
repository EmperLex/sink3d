
var SINK3D = SINK3D || {};

// scene graph

SINK3D.Scene = function() {
	this._objects = [];
}

SINK3D.Scene.prototype.clear = function() {
	this._objects = [];
}

SINK3D.Scene.prototype.append = function(obj3d) {
	this._objects.push(obj3d);
}

// objects

SINK3D.Object3D = function() {

    this.geometry = {};
	
	this.parent = null;
	this.children = [];
}

/**
 * @param {Array[vec3]} indices
 * @param {Array[Triangle]} triangles
 */
SINK3D.Geometry = function(vertices, triangles) {

    this.vertices = vertices;
	this.triangles = triangles;
	    
    this.scale = vec3.fromValues(1, 1, 1);
    this.rotation = vec3.fromValues(0, 0, 0);
    this.translation = vec3.fromValues(0, 0, 0);
}

/**
 * @param {vec3}
 * @param {vec4}
 */
SINK3D.Vertex = function(pos, color, normal) {
    this.position = vec4.fromValues(pos[0], pos[1], pos[2], 1);
	this.color = color != 'undefined' ? 
		color : vec4.fromValues(255, 0, 0, 255); //red is default
	this.normal = normal;
}

/**
 * @param {Array} indices
 */
SINK3D.Triangle = function(indices, normal) {
    this.indices = indices;
	this.normal = normal;
}



