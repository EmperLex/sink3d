Sink3D
======
## An experimental just for fun 3D software renderer

This is an experimental software renderer I created just for fun. It does not use any 3D rendering frameworks. It starts its journey very low-level by drawing pixels into a HTML5 canvas element.

The only library its using is the awesome gl-matrix.js for matrix calculations (http://glmatrix.net/).

##DEMO:
You can see it in action by just downloading the project and opening the index.html within your browser. 

Keyboard shortcuts:
c - enable / disable backface culling
w - go forward (but be warned, strange things will happen :D )

##FAQ:

Q: Can I use it for ...

A: Yes please! If you find it useful for ANY purpose just take it, copy it, print and burn it. 

Q: Bro, just take three.js or BabylonJS

A: Please read the headlines...

Q: Your javascript is awful!

A: Yes indeed! Beside learning the internals of rendering pipelines I was willing to learn javascript simultaneously with this project so ...

Q: Why does going forward mess up the rendering so hard?

A: Because there is no clipping implemented right now. Geometry which is "behind the camera" is still visible.

##UPDATES:

- Took this project to GitHub :)
