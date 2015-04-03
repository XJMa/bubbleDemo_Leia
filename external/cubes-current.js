var camera, renderer, scene;

var group;
var material;

window.onload = function () {
  
  LEIA.physicalScreen.InitFromExternalJson('external/config.json', function(){
    
    Init();
    animate();

  });

};

function Init() {

  LEIA.virtualScreen.Init();
  //LEIA.virtualScreen.loadDefault();
  
  LEIA.virtualScreen.width = 60;
  LEIA.virtualScreen.center.copy({x:0.00,y:0.00,z:0.00});
  LEIA.virtualScreen.normal.copy({x:0.00,y:0.00,z:1.00});
  LEIA.virtualScreen.b = 1.0;
  LEIA.virtualScreen.d = 50;
  LEIA.virtualScreen.disp = 15;
  LEIA.virtualScreen.h = 0;

  LEIA.physicalScreen.resolution = new THREE.Vector2(200,150);
  
  scene = new THREE.Scene();
  group = new THREE.Object3D();

    material = new THREE.MeshFaceMaterial([
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading
        }), // front
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shading: THREE.SmoothShading
        }) // side
    ]);
  
  // camera setup
  camera = new LeiaCamera({
    dCtoZDP: LEIA.virtualScreen.d,
    zdpNormal: LEIA.virtualScreen.normal,
    targetPosition: LEIA.virtualScreen.center
  });
  scene.add(camera);

  // rendering setup
  renderer = new LeiaWebGLRenderer({
    antialias: true,
    renderMode: _renderMode,
    colorMode: _colorMode,
    devicePixelRatio: 1,
    superSampleSharpen:false,
    messageFlag: _targetEnvironment
  });
  renderer.shadowMapEnabled = true;
  

  Leia_addRender(renderer, {
    bFPSVisible: false
  });



  addObjectsToScene();

  addLights();
}


function animate() {
    
    requestAnimationFrame(animate);

    renderer.setClearColor(new THREE.Color().setRGB(1.0, 1.0, 1.0));
  
    renderer.Leia_render({
      scene: scene,
      camera: camera
    });
}


function addObjectsToScene() { // Add your objects here

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
    // background Plane
    // LEIA_setBackgroundPlane('resource/brickwall_900x600_small.jpg');
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

function LEIA_setBackgroundPlane(filename, aspect) {
    var foregroundPlaneTexture = new THREE.ImageUtils.loadTexture(filename);
    foregroundPlaneTexture.wrapS = foregroundPlaneTexture.wrapT = THREE.RepeatWrapping;
    foregroundPlaneTexture.repeat.set(1, 1);

    //
    var planeMaterial = new THREE.MeshPhongMaterial({
        map: foregroundPlaneTexture,
        color: 0xffdd99
    });
    var planeGeometry = new THREE.PlaneGeometry(80, 60, 10, 10);
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.z = -6;
    plane.castShadow = false;
    plane.receiveShadow = true;
    scene.add(plane);
}

