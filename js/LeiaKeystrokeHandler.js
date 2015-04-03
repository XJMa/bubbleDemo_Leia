/**
 * Example usage:
 *
 * var lks = new LeiaKeystrokeHandler(threeScene, leiaCamera, leiaRenderer);
 * lks.addKeyHandler('t', function(event){
 *     console.log(event.keyCode + " was pressed");
 * });
 *
 * @constructor
 */
function LeiaKeystrokeHandler(threeScene, leiaCamera, leiaRenderer) {
    logPrefix = "LeiaKeystrokeHandler: ";
    var keyHandlers = [];

    this.onKeyDown = function(event) {
        var kc = event.keyCode;
        if( keyHandlers[kc] !== undefined ) {
            keyHandlers[kc](event);
        }
    };

    this.addKeyHandler = function(key, handlerFunction) {
        var keyCode = key.toUpperCase().charCodeAt(0);
        keyHandlers[keyCode] = handlerFunction;
    };

    this.addKeyHandlerForCharCode = function(keyCode, handlerFunction) {
        keyHandlers[keyCode] = handlerFunction;
    };

    document.addEventListener('keydown', this.onKeyDown, false);

    // Add Leia Reserved Keys (a,c,u,t,v,s,b)
    this.addKeyHandler("a", function(){
        leiaRenderer.setSwizzleView(!leiaRenderer.isSwizzle);
        leiaRenderer.render(threeScene, leiaCamera);
    });
    this.addKeyHandler("c", function(){
        leiaRenderer.setSwizzleColor(!leiaRenderer.isColor);
        leiaRenderer.render(threeScene, leiaCamera);
    });
    this.addKeyHandler("i", function(){
        leiaRenderer.shiftXY(0,1);
        leiaRenderer.render(threeScene, leiaCamera);
    });
    this.addKeyHandler("j", function(){
        leiaRenderer.shiftXY(-1,0);
        leiaRenderer.render(threeScene, leiaCamera);
    });
    this.addKeyHandler("k", function(){
        leiaRenderer.shiftXY(0,-1);
        leiaRenderer.render(threeScene, leiaCamera);
    });
    this.addKeyHandler("l", function(){
        leiaRenderer.shiftXY(1,0);
        leiaRenderer.render(threeScene, leiaCamera);
    });
    this.addKeyHandler("u", function(){
        leiaRenderer.setRenderMode(leiaRenderer.RENDER_MODES.TILED_VIEW);
        leiaRenderer.render(threeScene, leiaCamera);
    });
    this.addKeyHandler("t", function(){
        leiaRenderer.setRenderMode(leiaRenderer.RENDER_MODES.SINGLE_VIEW);
        leiaRenderer.render(threeScene, leiaCamera);
    });
    this.addKeyHandler("v", function(){
        leiaRenderer.setRenderMode(leiaRenderer.RENDER_MODES.SWIZZLE_VIEW);
        leiaRenderer.render(threeScene, leiaCamera);
    });
    this.addKeyHandler("s", function(){
        leiaRenderer.setShaderMode(leiaRenderer.SHADER_MODES.SUPERSAMPLE_SWIZZLE);
        leiaRenderer.render(threeScene, leiaCamera);
    });
    this.addKeyHandler("b", function(){
        leiaRenderer.setShaderMode(leiaRenderer.SHADER_MODES.BASIC_SWIZZLE);
        leiaRenderer.render(threeScene, leiaCamera);
    });
}