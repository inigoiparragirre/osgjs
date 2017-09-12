'use strict';
var MACROUTILS = require('osg/Utils');
var StateAttribute = require('osg/StateAttribute');

// Used to notify the Compiler to create a Depth Casting optimized shader
var ShadowCastAttribute = function(disable, shadowReceiveAttribute) {
    StateAttribute.call(this);
    this._enable = !disable;
    this._shadowReceiveAttribute = shadowReceiveAttribute;
    this._dirtyHash = true;
    this._hash = '';
};

MACROUTILS.createPrototypeStateAttribute(
    ShadowCastAttribute,
    MACROUTILS.objectInherit(StateAttribute.prototype, {
        attributeType: 'ShadowCast',
        cloneType: function() {
            return new ShadowCastAttribute(true);
        },
        setReceiveAttribute: function(shadowReceiveAttribute) {
            this._shadowReceiveAttribute = shadowReceiveAttribute;
        },
        getReceiveAttribute: function() {
            return this._shadowReceiveAttribute;
        },
        getDefines: function() {
            return this._shadowReceiveAttribute.getDefines();
        },
        _computeHash: function() {
            return 'ShadowCast' + this._enable + this._shadowReceiveAttribute.getPrecision();
        },
        getHash: function() {
            var receiveAttributeDirty = false;
            if (this._shadowReceiveAttribute && this._shadowReceiveAttribute._dirtyHash)
                this._receiveAttributeDirty = true;

            if (!this._dirtyHash && !receiveAttributeDirty) return this._hash;

            this._hash = this._computeHash();
            this._dirtyHash = false;
            return this._hash;
        },
        // need a isEnabled to let the ShaderGenerator to filter
        // StateAttribute from the shader compilation
        isEnabled: function() {
            return this._enable;
        }
    }),
    'osgShadow',
    'ShadowCastAttribute'
);

module.exports = ShadowCastAttribute;
