var leiaCamera, leiaRenderer, leiaDisplay, group, scene, sceneCube;
var cube, sphere, torus, cylinder, plane;
var cube0, sphere0, torus0, cylinder0, plane0;
var isAnimating = true;

var KEY = {ESC:27, SPACE:32, LEFT:37, UP:38, RIGHT:39, DOWN:40};
var spheres = [];//sphere list
window.onload = function () {
    init();
    animate();
};

function init() {
    // Initialize Everything that LEIA needs
    leiaDisplay  = new LeiaDisplay('./Coruscant.json');
    leiaCamera   = new LeiaCamera(leiaDisplay);
    leiaCameraCube = new LeiaCamera(leiaDisplay);
    leiaRenderer = new LeiaRenderer(leiaDisplay);

    // Three.JS scene initializations
    scene  = new THREE.Scene();
    sceneCube = new THREE.Scene();
    
    group  = new THREE.Object3D();
    scene.add(group);
    
    var path = "skybox/";
    var format = '.jpg';
    var urls = [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
    ];

    
    var sphereGeometry = new THREE.SphereGeometry(1.0, 32, 32);
    var textureCube = THREE.ImageUtils.loadTextureCube( urls );
    textureCube.format = THREE.RGBFormat;
    //fresnel shader
    var shader = THREE.FresnelShader;
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    uniforms[ "tCube" ].value = textureCube;

    var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms };
    var material = new THREE.ShaderMaterial( parameters );
    
    for ( var i = 0; i < 50; i ++ ) {

        var mesh = new THREE.Mesh( sphereGeometry, material );

        mesh.position.x = Math.random() * 100 - 50;
        mesh.position.y = Math.random() * 100 - 50;
        mesh.position.z = Math.random() * 100 - 50;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

        group.add( mesh );

        spheres.push( mesh );

    }
    group.scale.set(2.0, 2.0, 2.0);
    group.rotation.x = -0.3;
    group.position.z = -2.5;
    //skybox
    var shader = THREE.ShaderLib[ "cube" ];
    shader.uniforms[ "tCube" ].value = textureCube;

    var material = new THREE.ShaderMaterial( {

        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        side: THREE.BackSide

    } ),

    mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
    mesh.rotation.y = -30;
    scene.add( mesh );
    
    document.body.appendChild(leiaRenderer.renderer.domElement);
}

function addEvents() {
    var lks = new LeiaKeystrokeHandler(scene, leiaCamera, leiaRenderer);
    lks.addKeyHandlerForCharCode(KEY.SPACE, function(event){
        isAnimating = !isAnimating;
    });
}

function renderScene() { 
    leiaRenderer.render(scene, leiaCamera);
}

function animate() {
    requestAnimationFrame(animate);

    if(isAnimating) {
        var timer = 0.0001 * Date.now();
        for(var i = 0, il = spheres.length; i < il; i++){
            var thisSphere = spheres[i];
            
            thisSphere.position.x = 10 * Math.cos(timer +i);
            thisSphere.position.y = 10 * Math.sin(timer + i * 1.1);
        }
        renderScene();
    }
    else{
        leiaRenderer.render( scene, leiaCamera );
    }   
}
