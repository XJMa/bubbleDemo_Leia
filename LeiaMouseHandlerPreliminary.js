'use strict';

// For Tuning Panel View
var dragControls = function(object, domElement) {
    var _this = this;
    var STATE = {
        NONE: -1,
        ROTATE: 0,
        ZOOM: 1,
        PAN: 2,
        TOUCH_ROTATE: 3,
        TOUCH_ZOOM_PAN: 4
    };
    this.object = object;
    this.domElement = domElement !== undefined ? domElement : document;
    this.enabled = true;
    this.screen = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };
    this.rotateSpeed = .2;
    this.zoomSpeed = .2;
    this.panSpeed = .6;
    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;
    this.noRoll = false;
    this.staticMoving = false;
    this.dynamicDampingFactor = .3;
    this.minDistance = 0;
    this.maxDistance = Infinity;
    this.target = new THREE.Vector3;
    var EPS = 1E-6;
    var lastPosition = new THREE.Vector3;
    var _state = STATE.NONE,
        _prevState = STATE.NONE,
        _eye = new THREE.Vector3,
        _rotateStart = new THREE.Vector3,
        _rotateEnd = new THREE.Vector3,
        _zoomStart = new THREE.Vector2,
        _zoomEnd = new THREE.Vector2,
        _touchZoomDistanceStart = 0,
        _touchZoomDistanceEnd = 0,
        _panStart = new THREE.Vector2,
        _panEnd = new THREE.Vector2;

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();
    this.up0 = this.object.up.clone();

    var changeEvent = {
        type: "change"
    };
    var startEvent = {
        type: "start"
    };
    var endEvent = {
        type: "end"
    };

    var getMouseOnScreen = function() {
        var vector = new THREE.Vector2;
        return function(layerX, layerY) {
            vector.set((layerX - _this.screen.left) / _this.screen.width, (layerY - _this.screen.top) / _this.screen.height);
            return vector
        }
    }();

    var getMouseProjectionOnBall = function() {
        var vector = new THREE.Vector3;
        var objectUp = new THREE.Vector3;
        var mouseOnBall = new THREE.Vector3;
        return function(layerX, layerY) {

            mouseOnBall.set((layerX - _this.screen.width * .5 - _this.screen.left) / (_this.screen.width * .5),
                (_this.screen.height * .5 + _this.screen.top - layerY) / (_this.screen.height * .5), 0);

            var length = mouseOnBall.length();

            if (_this.noRoll)
                if (length < Math.SQRT1_2) mouseOnBall.z = Math.sqrt(1 - length * length);
                else mouseOnBall.z = .5 / length;
            else if (length > 1) mouseOnBall.normalize();
            else mouseOnBall.z = Math.sqrt(1 - length * length);

            _eye.copy(_this.object.position).sub(_this.target);
            vector.copy(_this.object.up).setLength(mouseOnBall.y);
            vector.add(objectUp.copy(_this.object.up).cross(_eye).setLength(mouseOnBall.x));
            vector.add(_eye.setLength(mouseOnBall.z));
            return vector
        }
    }();

    this.rotateCamera = function() {
        var axis = new THREE.Vector3;
        var quaternion = new THREE.Quaternion;

        return function() {
            var angle = Math.acos(_rotateStart.dot(_rotateEnd) / _rotateStart.length() / _rotateEnd.length());
            if (angle) {
                axis.crossVectors(_rotateStart, _rotateEnd).normalize();
                angle *= _this.rotateSpeed;
                quaternion.setFromAxisAngle(axis, -angle);
                _eye.applyQuaternion(quaternion);
                _this.object.up.applyQuaternion(quaternion);
                _rotateEnd.applyQuaternion(quaternion);
                if (_this.staticMoving) _rotateStart.copy(_rotateEnd);
                else {
                    quaternion.setFromAxisAngle(axis, angle * (_this.dynamicDampingFactor - 1));
                    _rotateStart.applyQuaternion(quaternion)
                }
            }
        }
    }();

    this.zoomCamera = function() {
        if (_state === STATE.TOUCH_ZOOM_PAN) {
            var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
            _touchZoomDistanceStart = _touchZoomDistanceEnd;
            _eye.multiplyScalar(factor)
        } else {
            var factor = 1 + (_zoomEnd.y - _zoomStart.y) * _this.zoomSpeed;
            if (factor !== 1 && factor > 0) {
                _eye.multiplyScalar(factor);
                if (_this.staticMoving) _zoomStart.copy(_zoomEnd);
                else _zoomStart.y += (_zoomEnd.y -
                _zoomStart.y) * this.dynamicDampingFactor
            }
        }
    };

    this.panCamera = function() {
        var mouseChange = new THREE.Vector2,
            objectUp = new THREE.Vector3,
            pan = new THREE.Vector3;
        return function() {
            mouseChange.copy(_panEnd).sub(_panStart);
            if (mouseChange.lengthSq()) {
                mouseChange.multiplyScalar(_eye.length() * _this.panSpeed);
                pan.copy(_eye).cross(_this.object.up).setLength(mouseChange.x);
                pan.add(objectUp.copy(_this.object.up).setLength(mouseChange.y));
                _this.object.position.add(pan);
                _this.target.add(pan);
                if (_this.staticMoving) _panStart.copy(_panEnd);
                else _panStart.add(mouseChange.subVectors(_panEnd, _panStart).multiplyScalar(_this.dynamicDampingFactor))
            }
        }
    }();

    this.checkDistances = function() {
        if (!_this.noZoom || !_this.noPan) {
            if (_eye.lengthSq() > _this.maxDistance * _this.maxDistance) _this.object.position.addVectors(_this.target, _eye.setLength(_this.maxDistance));
            if (_eye.lengthSq() < _this.minDistance * _this.minDistance) _this.object.position.addVectors(_this.target, _eye.setLength(_this.minDistance))
        }
    };

    this.update = function() {
        _eye.subVectors(_this.object.position, _this.target);
        if (!_this.noRotate) _this.rotateCamera();
        if (!_this.noZoom) _this.zoomCamera();
        if (!_this.noPan) _this.panCamera();
        _this.object.position.addVectors(_this.target, _eye);
        _this.checkDistances();
        _this.object.lookAt(_this.target);
        if (lastPosition.distanceToSquared(_this.object.position) > EPS) {
            _this.dispatchEvent(changeEvent);
            lastPosition.copy(_this.object.position)
        }
    };

    this.reset = function() {
        _state = STATE.NONE;
        _prevState = STATE.NONE;
        _this.target.copy(_this.target0);
        _this.object.position.copy(_this.position0);
        _this.object.up.copy(_this.up0);
        _eye.subVectors(_this.object.position, _this.target);
        _this.object.lookAt(_this.target);
        _this.dispatchEvent(changeEvent);
        lastPosition.copy(_this.object.position)
    };

    function mousedown(event) {
        if (_this.enabled == false) return;

        var leftBunder   = _this.screen.left;
        var rightBunder  = _this.screen.left + _this.screen.width;
        var topBunder    = _this.screen.top;
        var bottomBunder = _this.screen.top + _this.screen.height;

        if (event.layerX > leftBunder && event.layerX < rightBunder &&
            event.layerY > topBunder  && event.layerY < bottomBunder) {

            if (_this.enabled === false) return;
            if (_state === STATE.NONE) _state = event.button;
            if (_state === STATE.ROTATE && !_this.noRotate) {
                _rotateStart.copy(getMouseProjectionOnBall(event.layerX, event.layerY));
                _rotateEnd.copy(_rotateStart);
            } else if (_state === STATE.ZOOM && !_this.noZoom) {
                _zoomStart.copy(getMouseOnScreen(event.layerX, event.layerY));
                _zoomEnd.copy(_zoomStart);
            } else if (_state === STATE.PAN && !_this.noPan) {
                _panStart.copy(getMouseOnScreen(event.layerX, event.layerY));
                _panEnd.copy(_panStart);
            }
            document.addEventListener("mousemove", mousemove, false);
            document.addEventListener("mouseup",   mouseup, false);
            _this.dispatchEvent(startEvent);
        }
    }

    function mousemove(event) {
        if (_this.enabled == false) return;

        var leftBunder   = _this.screen.left;
        var rightBunder  = _this.screen.left + _this.screen.width;
        var topBunder    = _this.screen.top;
        var bottomBunder = _this.screen.top  + _this.screen.height;

        if (event.layerX > leftBunder && event.layerX < rightBunder &&
            event.layerY > topBunder  && event.layerY < bottomBunder) {

            if (_this.enabled === false) return;

            event.preventDefault();

            if (_state === STATE.ROTATE && !_this.noRotate)
                _rotateEnd.copy(getMouseProjectionOnBall(event.layerX, event.layerY));
            else if (_state === STATE.ZOOM && !_this.noZoom)
                _zoomEnd.copy(getMouseOnScreen(event.layerX, event.layerY));
            else if (_state === STATE.PAN && !_this.noPan)
                _panEnd.copy(getMouseOnScreen(event.layerX, event.layerY));
        }
    }

    function mouseup(event) {
        var leftBunder   = _this.screen.left;
        var rightBunder  = _this.screen.left + _this.screen.width;
        var topBunder    = _this.screen.top;
        var bottomBunder = _this.screen.top  + _this.screen.height;

        if (event.layerX > leftBunder && event.layerX < rightBunder &&
            event.layerY > topBunder  && event.layerY < bottomBunder) {
            _state = STATE.NONE;
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("mouseup", mouseup);
            _this.dispatchEvent(endEvent)
        }
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup)
    }

    function mousewheel(event) {
        var leftBunder = _this.screen.left;
        var rightBunder = _this.screen.left + _this.screen.width;
        var topBunder = _this.screen.top;
        var bottomBunder = _this.screen.top +
            _this.screen.height;
        if (event.layerX > leftBunder && event.layerX < rightBunder && event.layerY > topBunder && event.layerY < bottomBunder) {
            if (_this.enabled === false) return;
            event.preventDefault();
            var delta = 0;
            if (event.wheelDelta) delta = event.wheelDelta / 40;
            else if (event.detail) delta = -event.detail / 3;
            _zoomStart.y += delta * .01;
            _this.dispatchEvent(startEvent);
            _this.dispatchEvent(endEvent)
        }
    }
    this.domElement.addEventListener("mousedown", mousedown, false);
    this.domElement.addEventListener("mousewheel", mousewheel, false);
    this.update()
};
dragControls.prototype = Object.create(THREE.EventDispatcher.prototype);

