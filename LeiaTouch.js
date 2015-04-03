logPrefix = "LeiaTouch: ";
var socket = io();
var TOUCH_ACTION = { PROXIMITY_IN:1, PROXIMITY_OUT:0 };


function LeiaTouch() {
    var touchHandlers = { motion:null, touch:null, release:null, moveX:null, moveY:null };

    log("Testing context logging");

    socket.on('port data', function(msg) {
        //console.log("Recieved touch data");
        //console.log(msg);
        if( msg ) {
            if(msg.fs == TOUCH_ACTION.PROXIMITY_IN && touchHandlers.touch) {
                touchHandlers.touch();
            } else if(touchHandlers.release) {
                touchHandlers.release();
            }
        } else {
            error("This shit is broken, yo");
        }

    });

    this.touchMotionDetectedHandler = function(callback) {

    };

    this.touchHandler = function(callback) {

    };

    this.touchReleaseHandler = function(callback) {

    };

    this.touchMoveXHandler = function(callback) {

    };

    this.touchMoveYHandler = function(callback) {

    };
}