var leiaCamera, leiaRenderer, scene;
var group;

var KEY = {ESC:27, SPACE:32, LEFT:37, UP:38, RIGHT:39, DOWN:40, SHIFT:16, A:65, C:67, S:83, T:84, U:85, V:86, W: 87, K:75, L:76, B:66};

window.onload = function () { 
    Init();
    animate();
    // leiaRenderer.render(scene, leiaCamera);
};

function Init() {
    // Initialize Everything that LEIA needs
    leiaCamera   = new LeiaCamera();
    leiaRenderer = new LeiaRenderer();

    // Three.JS scene initializations
    scene  = new THREE.Scene();
    group  = new THREE.Object3D();

    addObjectsToScene();
    addLights();
    addEvents();

    document.body.appendChild(leiaRenderer.renderer.domElement);
}

function animate() {
    
    requestAnimationFrame(animate);
    leiaRenderer.render(scene, leiaCamera);
}

function addEvents() {
    document.addEventListener( 'keydown', onDocumentKeyDown, false);
}

var dist = 50;

function onDocumentKeyDown(event) {
    console.log(event.keyCode);

    switch (event.keyCode) {
        case KEY.A:
            leiaRenderer.setSwizzleView(!leiaRenderer.isSwizzle);
            console.log('isSwizzle:' + leiaRenderer.isSwizzle);
            leiaRenderer.render(scene, leiaCamera);
            break;
        case KEY.C:
            leiaRenderer.setSwizzleColor(!leiaRenderer.isColor);
            console.log('isColor:' + leiaRenderer.isColor);
            leiaRenderer.render(scene, leiaCamera);
            break;
        case KEY.U:
            leiaRenderer.setRenderMode(leiaRenderer.RENDER_MODES.TILED_VIEW);
            leiaRenderer.render(scene, leiaCamera);
            break;
        case KEY.T:
            leiaRenderer.setRenderMode(leiaRenderer.RENDER_MODES.SINGLE_VIEW);
            leiaRenderer.render(scene, leiaCamera);
            break;
        case KEY.V:
            leiaRenderer.setRenderMode(leiaRenderer.RENDER_MODES.SWIZZLE_VIEW);
            leiaRenderer.render(scene, leiaCamera);
            break;
        case KEY.W:
            leiaRenderer.setRenderMode(leiaRenderer.RENDER_MODES.TUNING_VIEW);
            leiaRenderer.render(scene, leiaCamera);
            break;
        case KEY.S:
            leiaRenderer.setShaderMode(leiaRenderer.SHADER_MODES.SUPERSAMPLE_SWIZZLE);
            leiaRenderer.render(scene, leiaCamera);
            break;
        case KEY.B:
            leiaRenderer.setShaderMode(leiaRenderer.SHADER_MODES.BASIC_SWIZZLE);
            leiaRenderer.render(scene, leiaCamera);
            break;
        case KEY.K:
            dist = dist - 10;
            console.log('distance: ' + dist);
            leiaCamera.updateCameraVirtualScreenDistance(dist);
            leiaRenderer.render(scene, leiaCamera);
            break;
        case KEY.L:
            dist = dist + 10;
            console.log('distance: ' + dist);
            leiaCamera.updateCameraVirtualScreenDistance(dist);
            leiaRenderer.render(scene, leiaCamera);
            break;
    }
}

function addObjectsToScene() {
    // Add 2 Cubes to the Scene
    var geometry1 = new THREE.BoxGeometry( 10, 10, 10 );
    var material1 = new THREE.MeshPhongMaterial( {color: 0x00ff00, shading: THREE.SmoothShading} );
    var cube = new THREE.Mesh( geometry1, material1 );
    cube.position.set(5, 0, 0);
    scene.add( cube );

    var geometry2 = new THREE.SphereGeometry( 5, 32, 32 );
    var material2 = new THREE.MeshPhongMaterial( {color: 0xff0000, shading: THREE.SmoothShading} );
    var sphere = new THREE.Mesh( geometry2, material2 );
    sphere.position.set(-10, 0, 0);
    scene.add( sphere );
}


function addLights() {
    //Add Lights Here
    var light = new THREE.SpotLight(0xffffff);

    //light.color.setHSL( Math.random(), 1, 0.5 );
    light.position.set(0, 60, 60);
    light.shadowCameraVisible = false;
    light.castShadow = true;
    light.shadowMapWidth = light.shadowMapHeight = 512;
    light.shadowDarkness = 0.7;
    scene.add(light);

    //var ambientLight = new THREE.AmbientLight(0x222222);
    var ambientLight = new THREE.AmbientLight(0x666666);;
    scene.add(ambientLight);
}

