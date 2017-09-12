'use strict';

// Base class for GLResources: Textures, Buffers, Programs, Shaders, FrameBuffers and RenderBuffers
// It holds a reference to the graphic context that is needed for resource deletion
var GLObject = function() {
    this._gl = undefined;
    this._lostContextCallback = undefined;
};

GLObject.prototype = {
    setGraphicContext: function(gl) {
        this._gl = gl;
        GLObject.addObject(this._gl, this);
    },
    getGraphicContext: function() {
        return this._gl;
    },
    setLostContextCallback: function(cb) {
        this._lostContextCallback = cb;
    },
    lostContext: function() {
        if (typeof this.invalidate === 'function') {
            this.invalidate();
        } else if (this._dirty !== undefined) {
            this._dirty = true;
        } else {
            console.error('Object needs Dirty mechanism');
        }
        if (this._lostContextCallback) this._lostContextCallback();
    }
};

// handle webgl restore by indexing all GLObject
GLObject._sResourcesArrayCache = new window.Map();

GLObject.addObject = function(gl, glObject) {
    if (!GLObject._sResourcesArrayCache.has(gl)) GLObject._sResourcesArrayCache.set(gl, []);
    var ressouresArray = GLObject._sResourcesArrayCache.get(gl);

    if (ressouresArray.indexOf(glObject) !== -1) return;
    ressouresArray.push(glObject);
};

GLObject.removeObject = function(gl, glObject) {
    if (!GLObject._sResourcesArrayCache.has(gl)) return;

    var ressouresArray = GLObject._sResourcesArrayCache.get(gl);
    var i = ressouresArray.indexOf(glObject);
    if (i === -1) return;
    ressouresArray.splice(i, 1);
};

GLObject.lostContext = function(gl) {
    if (!GLObject._sResourcesArrayCache.has(gl)) return;

    var ressouresArray = GLObject._sResourcesArrayCache.get(gl);
    for (var i = 0, l = ressouresArray.length; i < l; i++) {
        ressouresArray[i].lostContext();
    }
};

module.exports = GLObject;
