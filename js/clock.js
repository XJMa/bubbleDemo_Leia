var leiaCamera, leiaRenderer, leiaDisplay, scene;

// For Clock Demo
var group;
var g_hour = -1, g_minute = -1, g_AMPM = -1;
var isAnimating = true;

var KEY = {ESC:27, SPACE:32, LEFT:37, UP:38, RIGHT:39, DOWN:40, SHIFT:16, A:65, C:67, S:83, T:84, U:85, V:86, K:75, L:76, B:66};

window.onload = function () {
    init();
    animate();
};

function init() {    
    // Initialize Everything that LEIA needs
    leiaDisplay  = new LeiaDisplay('./Coruscant.json');
    leiaCamera   = new LeiaCamera(leiaDisplay);
    leiaRenderer = new LeiaRenderer(leiaDisplay);

    // Three.JS scene initializations
    scene  = new THREE.Scene();
    group  = new THREE.Object3D();
    scene.add(group);

    addObjectsToScene();
    addLights();
    addEvents();
    console.log(leiaRenderer.renderer.domElement);

    document.body.appendChild(leiaRenderer.renderer.domElement);
}

function addEvents() {
    var lks = new LeiaKeystrokeHandler(scene, leiaCamera, leiaRenderer);
    lks.addKeyHandlerForCharCode(KEY.SPACE, function(event){
        isAnimating = !isAnimating;
    });
}

function renderScene() {
    UpateTimeObject();
    leiaRenderer.render(scene, leiaCamera);
}


function animate() {
    requestAnimationFrame(animate);

    if(isAnimating) {
        group.rotation.x = 0.7 * Math.sin(5.0 * Date.now() * 0.001);
        group.rotation.z = 0.6 * Math.sin(3.0 * Date.now() * 0.001);
        renderScene();
    }
}

function addTextGeometry(textString, fontSize, posx, posy) {
    var textGeometry = new THREE.TextGeometry(textString,
    {
        size:            fontSize,
        height:          2,
        font:            "helvetiker",
        bevelThickness:  0.5,
        bevelSize:       0.5,
        bevelEnabled:    true,
        extrudeMaterial: 1
    });
    textGeometry.computeBoundingBox();
    textGeometry.computeVertexNormals();
    var dx = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    var dy = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
    var dz = textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z;

    var textMaterial = new THREE.MeshFaceMaterial([
        new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading }), // front
        new THREE.MeshPhongMaterial({ color: 0x000000, shading: THREE.SmoothShading }) // side
    ]);

    var textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(posx - 0.5 * dx, posy - 0.5 * dy,  - 0.5 * dz);
    textMesh.castShadow     = true;
    textMesh.receiveShadow  = true;
    group.add(textMesh);
}

function UpateTimeObject() {
    var date   = new Date(Date.now());
    var minute = date.getMinutes();
    var hour   = date.getHours();
    if (!(g_hour == hour && g_minute == minute)) {
        scene.remove(group);
        group = new THREE.Object3D();
 
        g_hour          = hour;
        g_minute        = minute;
        var AMPMHH      = (hour > 12)   ? (hour - 12)               : hour;
        var strAMPM     = (hour < 12)   ? "AM"                      : "PM";
        var strHour     = (AMPMHH < 10) ? ("0" + AMPMHH.toString()) : AMPMHH.toString();
        var strMinutes  = (minute < 10) ? ("0" + minute.toString()) : minute.toString();
 
        addTextGeometry(strHour,    18, -12,  0);
        addTextGeometry(strMinutes,  9,  12, -4);
        addTextGeometry(strAMPM,     5,  13,  6);
       
        scene.add(group);
    }
}

function addObjectsToScene() { // Add your objects here
    UpateTimeObject();
    setBackgroundPlane('brickwall_900x600_small.jpg');
}

function addLights() {
    var light = new THREE.SpotLight(0xffffff);
    light.position.set(0, 60, 60);
    light.shadowCameraVisible = false;
    light.castShadow = true;
    light.shadowMapWidth = light.shadowMapHeight = 512;
    light.shadowDarkness = 0.7;
    scene.add(light);
    var ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
}

// Belong to LEIA_UTILS
function setBackgroundPlane(filename) {
    var backgroundPlaneTexture = new THREE.ImageUtils.loadTexture(filename);
    backgroundPlaneTexture.wrapS = backgroundPlaneTexture.wrapT = THREE.RepeatWrapping;
    backgroundPlaneTexture.repeat.set(1, 1);

    var planeMaterial   = new THREE.MeshPhongMaterial({ map: backgroundPlaneTexture });
    var planeGeometry   = new THREE.PlaneGeometry(80, 60, 10, 10);
    var plane           = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.position.z    = -6;
    plane.castShadow    = false;
    plane.receiveShadow = true;
    scene.add(plane);
}

