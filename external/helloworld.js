var leiaCamera, leiaRenderer, scene;

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
        case KEY.SPACE:
            isAnimating = !isAnimating;
            // leiaRenderer.render(scene, leiaCamera);
            break;
    }
}


function AddTextObject() {

    var font = "helvetiker";
    var HelloWorld = createTextGeometry("Hello World", {size: 5, font: font, bevelThickness: 0.6});

    var material = new THREE.MeshFaceMaterial([
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading
        }), // front
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.SmoothShading
        }) // side
    ]);
    

    var MeshHelloWorld = new THREE.Mesh(HelloWorld, material);

    MeshHelloWorld.position.set( -18, 0, 0);
    
    MeshHelloWorld.castShadow    = true;
    MeshHelloWorld.receiveShadow = true;

    scene.add(MeshHelloWorld);


    // Utility for Creating Text Geometry
    function createTextGeometry(textString, parameters) {

        var textGeometry = new THREE.TextGeometry(textString, 
            {
                size:            chooseParameter(parameters.size,            12),
                height:          chooseParameter(parameters.height,           2),
                curveSegments:   chooseParameter(parameters.curveSegments,    4),
                font:            chooseParameter(parameters.font,          font),
                weight:          chooseParameter(parameters.weight,    "normal"),
                style:           chooseParameter(parameters.style,     "normal"),
                bevelThickness:  chooseParameter(parameters.bevelThickness, 0.5),
                bevelSize:       chooseParameter(parameters.bevelSize,     0.25),
                bevelEnabled:    chooseParameter(parameters.bevelEnabled,  true),
                material:        chooseParameter(parameters.material,         0),
                extrudeMaterial: chooseParameter(parameters.extrudeMaterial,  1)
            });


        function chooseParameter(parameter, defaultValue) {
            return (typeof parameter === 'undefined') ? defaultValue : parameter;
        }

        return textGeometry;
    }

}

function addObjectsToScene() { // Add your objects here
    
    AddTextObject();

    // Background Plane
    // LEIA_setBackgroundPlane('underwater.jpg');
    LEIA_setBackgroundPlane('brickwall_900x600_small.jpg');
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

// Belong to LEIA_UTILS
function LEIA_setBackgroundPlane(filename, aspect) {
    var foregroundPlaneTexture = new THREE.ImageUtils.loadTexture(filename);
    foregroundPlaneTexture.wrapS = foregroundPlaneTexture.wrapT = THREE.RepeatWrapping;
    foregroundPlaneTexture.repeat.set(1, 1);

    //
    var planeMaterial = new THREE.MeshPhongMaterial({
        map: foregroundPlaneTexture,
        // color: 0x999999
        color: 0xffdd99
    });
    
    var planeGeometry = new THREE.PlaneGeometry(60, 40, 10, 10);
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    
    plane.position.z = 0;
    plane.castShadow = false;
    plane.receiveShadow = true;

    scene.add(plane);
}

