var leiaCamera, leiaRenderer, scene;

// For Spine Demo
var mesh;
var newMeshReady = false;
var sizeMesh = 30;

var KEY = {ESC:27, SPACE:32, LEFT:37, UP:38, RIGHT:39, DOWN:40, SHIFT:16, A:65, C:67, S:83, T:84, U:85, V:86, W: 87, K:75, L:76, B:66};

window.onload = function () {
    Init();
    animate();
};

// the LeapMotion update function
Leap.loop( {enableGestures: true}, function( frame ) 
{    
    if (!newMeshReady) {
        return;
    };

    handData = frame.hands[0];
    if (!(frame.pointables.length==1)) {
        
        mesh.position.set(0,-2,1);

        // first finger if exists
        if ( !handData ) {
            mesh.scale.set(sizeMesh,sizeMesh,sizeMesh);
            //mesh.rotation.set(-Math.PI,0,0);
            //mesh.rotation.set(-Math.PI/2,0,0);
            //mesh.rotation.set(-Math.PI/2,Math.PI/2,0);
            mesh.rotation.set(-Math.PI/2,-Math.PI/2,0);
            return;
        } else {    

            //mesh.rotation.set(-Math.PI/2,-Math.PI/2,0);
            var y = handData.palmPosition[0]/10;
            var x = handData.palmPosition[2]/10;
            var z = handData.palmPosition[1]/100-3;
            //var s = sizeMesh*Math.min(Math.max((1+handData.palmPosition[1]/200-1), 0.1), 3.0);
            var s = sizeMesh*Math.min(Math.max((1+handData.palmPosition[1]/100-1), 0.1), 5.0);
            var yy = Math.atan2(handData.palmNormal[2], handData.palmNormal[1])+Math.PI/2;
            var zz = Math.atan2(handData.palmNormal[0], handData.palmNormal[1])-Math.PI/2;
        //console.log(x.toFixed(2), y.toFixed(2), z.toFixed(2), s.toFixed(2));
            mesh.rotation.set(0, yy, zz);
            mesh.position.set(x, y, z);
            mesh.scale.set(s,s,s);          
        }
    }
});
// end of LeapMotion update


function Init() {    
    // Initialize Everything that LEIA needs
    leiaCamera   = new LeiaCamera();
    leiaRenderer = new LeiaRenderer();

    // Three.JS scene initializations
    scene  = new THREE.Scene();
    group  = new THREE.Object3D();
    scene.add(group);

    addObjectsToScene();
    addLights();
    addEvents();

    document.body.appendChild(leiaRenderer.renderer.domElement);
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

function renderScene() {
    leiaRenderer.render(scene, leiaCamera);
}


function animate() {
    requestAnimationFrame(animate);
    renderScene();
}

function addObjectsToScene() { // Add your objects here

    readSTL('resource/SpineAndKidneys50K.stl');

    // setBackgroundPlane('brickwall_900x600_small.jpg');
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


function readSTL(fname) 
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if ( xhr.readyState == 4 ) {
            if ( xhr.status == 200 || xhr.status == 0 ) {
                var rep = xhr.response;

                mesh = parseStlBinary(rep);
                mesh.scale.set(sizeMesh, sizeMesh, sizeMesh);
                mesh.rotation.y = 3.14;
                mesh.rotation.z = 3.14;

                scene.add(mesh);
                newMeshReady = true;
            }
        }
    }
    xhr.onerror = function(e) {
        console.log(e);
    }
    xhr.open( "GET", fname, true );
    xhr.responseType = "arraybuffer";
    xhr.send( null );
}
