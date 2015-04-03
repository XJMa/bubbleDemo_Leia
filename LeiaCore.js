'use strict';
var logPrefix = "LeiaCore: "; //The pattern is to override this variable at the head of all supporting libraries for the correct context, i.e. logPrefix = "LeiaTouch: "; in LeiaTouch(), etc.

// Global Shorthand Methods
function log(message) {
    console.log(logPrefix+message);
}

function error(message) {   
    console.error(logPrefix+message);
}

function Leia(scene, leiaCamera, leiaRenderer) {
    this.REVISION = "0.0.xxx";
}

function LeiaDisplay(url) {
    var self = this;
    function loadCameraPositions(url) {
        var request = new XMLHttpRequest;
        request.open('GET', url, false); 
        request.send(null);
        if (request.status === 200) {
            var data = JSON.parse(request.responseText);
            self.viewLocation           = data.emissionPatternG;
            self.model                  = data.model;
            self.version                = data.version;
            self.serial                 = data.serial;
            self.type                   = data.type;
            self.dimensions             = data.dimensions;
            self.displayResolution      = data.displayResolution;
            self.numberOfViews          = data.numberOfViews;
            self.isCameraPositionLoaded = true;
        } else {
            console.log('FATAL: Cannot read file ', url);
        }
    }

    if (url == undefined) {
        console.log('taking undefined path');
        this.physicalScreen = {
            type:                   'rectangular',
            displayDimensions:      new THREE.Vector2(40, 30),      // 40 millimeters by 30 millimeters
            aspectRatio:            4/3,                            // width / height
            displayResolution:      new THREE.Vector2(1600, 1200),  // native screen resolution
            numberOfViews:          new THREE.Vector2(8, 8),        // number of views in x and y
            resolutionOfViews:      new THREE.Vector2(200, 150),    // resulting tile resolution
            emissionPatternR :      [],                             // THREE.Vector3 array describing the emission pattern for the red channel in directional cosines
            emissionPatternG :      [],                             // THREE.Vector3 array describing the emission pattern for the green channel in directional cosines
            emissionPatternB :      [],                             // THREE.Vector3 array describing the emission pattern for the blue channel in directional cosines
            emissionIntensityR:     [],                             // floating point array describing the peak intensity for the red channel
            emissionIntensityG:     [],                             // floating point array describing the peak intensity for the green channel
            emissionIntensityB:     [],                             // floating point array describing the peak intensity for the blue channel
            emissionGaussianR:      [],                             // THREE.Vector2 array describing the x and y standard deviations for the red channel
            emissionGaussianG:      [],                             // THREE.Vector2 array describing the x and y standard deviations for the green channel
            emissionGaussianB:      []                              // THREE.Vector2 array describing the x and y standard deviations for the blue channel
        };
    } else {
        console.log('loading ', url);
        loadCameraPositions(url);
    }
}

// Class Camera
function LeiaCamera(leiaDisplay) {
    this.virtualScreen = {
        dimensions:             new THREE.Vector2(60, 40),
        center:                 new THREE.Vector3(0, 0, 0),
        normal:                 new THREE.Vector3(0, 0, 1),
        distanceToCamera:       50,                                                         // distance between virtual screen and leiaCamera, together with ...
        screenFOV:              new THREE.Vector2(50 * Math.PI / 180, 50 * Math.PI / 180),  // the field of view of the screen, determines camera array positions
        baselineScaling:        1.0,
        maxDisparity:           5,

        update: function(parameters) {
            // if parameters.maxDisparity = undefined, don't update
            this.maxDisparity = (parameters.maxDisparity !== undefined) ? parameters.maxDisparity : this.maxDisparity;
        },

        // Add getNearPlane, getFarPlane functions
        getNearPlane: function(maxDisparity) {
            // return calculated near plane
        }
    };
    this.numberOfViews = leiaDisplay.numberOfViews;
    this.Nx = leiaDisplay.numberOfViews.x;
    this.Ny = leiaDisplay.numberOfViews.y;

    this.isCameraPositionLoaded = false;
    this.isRendererNeedsUpdate  = true;
    this.cameraPositions = [];
    this.cameraProjectionMatrices  = [];

    this.nearPlane = 30;
    this.farPlane = 150;

    this.init = function(parameters) {
        this.canvasSize     = (parameters.canvasSize     !== undefined) ? parameters.canvasSize     : this.canvasSize;
        this.targetPosition = (parameters.targetPosition !== undefined) ? parameters.targetPosition : this.targetPosition;

        // LoadCameraPositions from config.json file
        var self = this;  // points to leiaCamera object
        self.updateCameraArrayProperties();  // in call back function, this will be the 'window' object
        self.isRendererNeedsUpdate = true;

        // Initialize Camera Settings
        // (Not very useful, will be modified by projectionMatrix anyways)
        this.resetCenteralCamera();
    };


    this.updateCameraVirtualScreenDistance = function(distance) {
        this.virtualScreen.distanceToCamera = distance;
        this.nearPlane =  30 + distance - 50;  // <---- PAY ATTENTION, hardcoded
        this.farPlane  = 150 + distance - 50;  // <---- PAY ATTENTION, hardcoded
        this.cameraCenterPosition = new THREE.Vector3(0, 0, this.virtualScreen.distanceToCamera);
        this.camera.position.copy(this.cameraCenterPosition);
        this.updateCameraArrayProperties();
    }


    this.updateCameraArrayProperties = function(camShift) {
        // this function will access this.virtualScreen object to get latest parameters
        this.cameraPositions = [];
        this.cameraProjectionMatrices  = [];
        // camShift is used for creating super sampled render target
        if (camShift == undefined) {
            camShift = {x: 0, y: 0};
        }
        var nx = leiaDisplay.numberOfViews.x;  // number of cameras along x direction
        var ny = leiaDisplay.numberOfViews.y;  // number of cameras along y direction
        var distanceToScreen = this.virtualScreen.distanceToCamera;  // unit: webgl
        var fov              = this.virtualScreen.screenFOV;         // unit: rad
        var camBaseline = {
            x: Math.tan(0.5 * fov.x) * distanceToScreen * 2,
            y: Math.tan(0.5 * fov.y) * distanceToScreen * 2
        };
        var baselineStep = {
            x: camBaseline.x / (nx - 1),
            y: camBaseline.y / (ny - 1)
        };
        this.baselineStep = baselineStep;

        for (var i = 0; i < nx; i++) {
            for (var j = 0; j < ny; j++) {

                var camPosition;
                // If calculated from external file
                if (this.isCameraPositionLoaded) {

                    var idx = (ny - j - 1) * nx + i; // <--- PAY ATTENTION HERE, config.json might store things in different order
                    var camTangent = this.viewLocation[idx];

                    camPosition = {
                        x: camShift.x + camTangent[0] * distanceToScreen,
                        y: camShift.y + camTangent[1] * distanceToScreen
                    };
                }
                else {
                    // If calculated directly
                    camPosition = {
                        x: camShift.x - 0.5 * camBaseline.x + i * baselineStep.x,
                        y: camShift.y - 0.5 * camBaseline.y + j * baselineStep.y
                    };
                }

                var camPositionZ = distanceToScreen;

                var position = new THREE.Vector3(camPosition.x, camPosition.y, camPositionZ);
                this.cameraPositions.push(position);

                var projectionMatrix = this.calculateProjectionMatrix(camPosition);
                this.cameraProjectionMatrices.push(projectionMatrix);
            }
        }

        this.isUpdated = true;
    };


    this.calculateProjectionMatrix = function(camPosition) {

        // camPosition is the XY position of sub-camera relative to the camera array center

        var Dc = this.virtualScreen.distanceToCamera;

        // Armands Version
        var X = {max: 0.5 * this.virtualScreen.dimensions.x, min: -0.5 * this.virtualScreen.dimensions.x};
        var Y = {max: 0.5 * this.virtualScreen.dimensions.y, min: -0.5 * this.virtualScreen.dimensions.y};

        // Shanghai Team Version
        // var X = {max: 0.5 * virtualScreen.width  - camPosition.x,  min: -camPosition.x - 0.5 * virtualScreen.width};
        // var Y = {max: 0.5 * virtualScreen.height - camPosition.y,  min: -camPosition.y - 0.5 * virtualScreen.height};

        var Z = {max: this.farPlane, min: this.nearPlane};

        var projectionMatrix = new THREE.Matrix4();

        var m11 = (2 * Dc) / (X.max - X.min);
        var m22 = (2 * Dc) / (Y.max - Y.min);

        // Armands Version
        var m13 = (X.max + X.min - 2 * camPosition.x) / (X.max - X.min);
        var m23 = (Y.max + Y.min - 2 * camPosition.y) / (Y.max - Y.min);

        // Shanghai Team Version
        // var m13 = (X.max + X.min) / (X.max - X.min);
        // var m23 = (Y.max + Y.min) / (Y.max - Y.min);

        var m14 = (-2 * Dc * camPosition.x) / (X.max - X.min);
        var m24 = (-2 * Dc * camPosition.y) / (Y.max - Y.min);

        var m33 = -(Z.max + Z.min) / (Z.max - Z.min);
        var m34 = -2 * Z.max * Z.min / (Z.max - Z.min);

        // Armands Version
        projectionMatrix.set( m11,    0,  m13,  m14,
            0,  m22,  m23,  m24,
            0,    0,  m33,  m34,
            0,    0,   -1,    0);

        // Shanghai Team Version
        // projectionMatrix.set( m11,    0,  m13,    0,
        //                         0,  m22,  m23,    0,
        //                         0,    0,  m33,  m34,
        //                         0,    0,   -1,    0);

        return projectionMatrix;
    };


    this.getCameraPositionInArray = function(idx) {
        var newIdx = idx.x * this.Ny + idx.y;
        return this.cameraPositions[newIdx];
    };

    this.getProjectionMatrixInArray = function(idx) {
        var newIdx = idx.x * this.Ny + idx.y;
        return this.cameraProjectionMatrices[newIdx];
    };

    this.resetCenteralCamera = function() {
        var cameraFOV = 50;
        var aspectRatio = this.canvasSize.x / this.canvasSize.y; // should be canvasW / canvasH
        this.cameraCenterPosition = new THREE.Vector3(0, 0, this.virtualScreen.distanceToCamera);
        // (Above settings will be modified by projectionMatrix anyways)

        this.camera = new THREE.PerspectiveCamera(cameraFOV, aspectRatio, this.nearPlane, this.farPlane);
        this.camera.position.copy(this.cameraCenterPosition);
        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(this.targetPosition);
    };

    this.init({
        // distanceToScreen:    this.virtualScreen.distanceToCamera,
        // virtualScreenNormal: this.virtualScreen.normal,
        targetPosition:      this.virtualScreen.center,
//        canvasSize: {x: _canvas.width, y: _canvas.height}
//        canvasSize: {x: 2*_canvas.width, y: 2*_canvas.height} // XXX XXX XXX introduced factor of 2 for debugging - should throw things off but does not matter right now.
        canvasSize: {x: 1600, y: 1200} // XXX XXX XXX introduced factor of 2 for debugging - should throw things off but does not matter right now.
    });

}

function LeiaRenderer(leiaDisplay, parameters) {

    this.RENDER_MODES = {SINGLE_VIEW: 1, TILED_VIEW: 2, SWIZZLE_VIEW: 3, TUNING_VIEW: 4};
    this.SHADER_MODES = {BASIC_SWIZZLE: 1, SUPERSAMPLE_SWIZZLE: 2};

    this.shaderMode = this.SHADER_MODES.BASIC_SWIZZLE; // Default

    this.isSwizzle = true;
    this.isColor   = true;

    // some parameters need to be passed to WebGLRenderer
    this.init = function(parameters) {

        this.antialias   = (parameters.antialias   !== undefined) ? parameters.antialias   : this.antialias;

        this.messageFlag = (parameters.messageFlag !== undefined) ? parameters.messageFlag : this.messageFlag;  // _targetEnvironment
        this.renderMode  = (parameters.renderMode  !== undefined) ? parameters.renderMode  : this.renderMode;
        this.colorMode   = (parameters.colorMode   !== undefined) ? parameters.colorMode   : this.colorMode;

        this.canvasSize     = (parameters.canvasSize !== undefined) ? parameters.canvasSize : leiaDisplay.displayResolution;

        this.canvasShift    = new THREE.Vector2(3, 1);

        this.devicePixelRatio   = (parameters.devicePixelRatio   !== undefined) ? parameters.devicePixelRatio   : this.devicePixelRatio;
        this.superSampleSharpen = (parameters.superSampleSharpen !== undefined) ? parameters.superSampleSharpen : this.superSampleSharpen;


        // THREE.WebGLRenderer Settings
        this.renderer = new THREE.WebGLRenderer(parameters);

        this.setSize(this.canvasSize.x, this.canvasSize.y);

        // Preparing Swizzle Scene
        var width  = this.canvasSize.x;
        var height = this.canvasSize.y;

        this.renderTarget = new THREE.WebGLRenderTarget(width, height,
            {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            });

        this.swizzleRenderTargetSftX = new THREE.WebGLRenderTarget(width, height,
            {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            });

        this.swizzleRenderTargetSftY = new THREE.WebGLRenderTarget(width, height,
            {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            });

        this.swizzleRenderTargetSftXY = new THREE.WebGLRenderTarget(width, height,
            {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                format: THREE.RGBAFormat
            });

        this.currentShaderMaterial = this.createShaderMaterial(this.shaderMode, this.canvasSize, this.isSwizzle, this.isColor, this.canvasShift);


        this.renderer.shadowMapEnabled = true;
        // this.renderer.shadowMapEnabled = false;

    };

    this.prepareTuningView = function(scene, leiaCamera) {
        var cameraFOV = 50;
        var aspectRatio = this.canvasSize.x / this.canvasSize.y;

        this.cameraTuning = new THREE.PerspectiveCamera(cameraFOV, aspectRatio, .01, 4E4);
        this.cameraTuning.position.copy(new THREE.Vector3(60, 60, 60));
        this.cameraTuning.up.set(0, 1, 0);
        // this.cameraTuning.lookAt(leiaCamera.targetPosition);

        this.LocalControls = new dragControls(this.cameraTuning);
        this.LocalControls.screen.left   = 0;
        this.LocalControls.screen.top    = 0; // * (1 - this.GObserveView.bottom - this.GObserveView.height);
        this.LocalControls.screen.width  = this.canvasSize.x;// * this.GObserveView.width;
        this.LocalControls.screen.height = this.canvasSize.y;// * this.GObserveView.height;

        // Prepare Visualization Objects in Tuning Panel View
        var geoObj = new THREE.CylinderGeometry(0, 1, 2, 20);  // radiusTop, radiusBottom, height, segments
        var matObj = new THREE.MeshBasicMaterial( {color: 37779, shading: THREE.SmoothShading} );

        geoObj.applyMatrix((new THREE.Matrix4).makeRotationFromEuler(new THREE.Euler(-Math.PI / 2, Math.PI, 0)));
        var obj = new THREE.Mesh(geoObj, matObj);

        // Prepare the Tuning Panel Scene
        this.sceneTuning = scene.clone();

        for (var i = 0; i < leiaCamera.numberOfViews.x; i++) {
            for (var j = 0; j < leiaCamera.numberOfViews.y; j++) {

                var position = leiaCamera.getCameraPositionInArray({x:i, y:j});

                var subCameraMesh = obj.clone();
                subCameraMesh.position.copy(position);
                this.sceneTuning.add( subCameraMesh );
            }
        }
    };

    this.render = function(scene, leiaCamera) {
        // this.renderMode  = parameters.renderMode  || this.renderMode;
        switch(this.renderMode) {
            case this.RENDER_MODES.SINGLE_VIEW: {
                this.renderSingleView(scene, leiaCamera);
                break;
            }
            case this.RENDER_MODES.TILED_VIEW: {
                this.renderTiledView(scene, leiaCamera);
                break;
            }
            case this.RENDER_MODES.SWIZZLE_VIEW: {
                this.renderSwizzleView(scene, leiaCamera);
                break;
            }
            case this.RENDER_MODES.TUNING_VIEW: {
                this.renderTuningView(scene, leiaCamera);
                break;
            }
        }
    };

    this.renderSingleView = function(scene, leiaCamera, renderTarget) {

        this.renderer.setViewport(0, 0, this.canvasSize.x, this.canvasSize.y);
        this.renderer.setScissor (0, 0, this.canvasSize.x, this.canvasSize.y);
        this.renderer.enableScissorTest(true);
        this.renderer.setClearColor(new THREE.Color().setRGB(1.0, 1.0, 1.0));

        this.renderer.render(scene, leiaCamera.camera, renderTarget);
    };

    this.renderTuningView = function(scene, leiaCamera) {

        if (leiaCamera.isUpdated) {
            this.prepareTuningView(scene, leiaCamera);  // Settings for Tuning Panel
            leiaCamera.isUpdated = false;
        }

        this.LocalControls.update();

        // Preparing Swizzle Camera and Scene
        var width  = this.canvasSize.x;
        var height = this.canvasSize.y;

        this.renderer.setViewport(0, 0, width, height);
        this.renderer.setScissor (0, 0, width, height);
        this.renderer.enableScissorTest(true);
        this.renderer.setClearColor(new THREE.Color().setRGB(0.11, 0.12, 0.18));  // dark blue background

        this.renderer.render(this.sceneTuning, this.cameraTuning);
    };

    this.renderTiledView = function(scene, leiaCamera, renderTarget, forceClear) {
        leiaCamera.updateCameraArrayProperties();  // reset camera positions
        // Update Camera Parameters based on Display Frustum before rendering

// this.renderer.shadowMapEnabled = true;

        if (leiaCamera.isRendererNeedsUpdate) {
            leiaCamera.updateCameraArrayProperties();
            leiaCamera.isRendererNeedsUpdate = false;
        };

        this.renderer.setClearColor(new THREE.Color().setRGB(1.0, 1.0, 1.0));

        var nx = leiaCamera.numberOfViews.x;
        var ny = leiaCamera.numberOfViews.y;

        var canv = {
            x: this.canvasSize.x,
            y: this.canvasSize.y
        };

        var currentCamera = leiaCamera.camera;

        for (var ii = 0; ii < nx; ii++) {

            for (var jj = 0; jj < ny; jj++) {

                this.renderer.setViewport(canv.x / nx * ii, canv.y / ny * jj, canv.x / nx, canv.y / ny);
                this.renderer.setScissor (canv.x / nx * ii, canv.y / ny * jj, canv.x / nx, canv.y / ny);
                this.renderer.enableScissorTest(true);

                // Update Projection Matrix for Current Camera
                var projectionMatrix = leiaCamera.getProjectionMatrixInArray({x: ii, y: jj});
                currentCamera.projectionMatrix.copy( projectionMatrix );


// Hack on renderTarget, work with modified three.js code to reveal shadow map
                if (renderTarget !== undefined) {
                    renderTarget.sx = renderTarget.width  / nx * ii;
                    renderTarget.sy = renderTarget.height / ny * jj;
                    renderTarget.w  = renderTarget.width  / nx;
                    renderTarget.h  = renderTarget.height / ny;
                }
// End of Hack

                // this.renderer.setClearColor(new THREE.Color().setRGB(1.0, 0.0, 0.0));
                this.renderer.render(scene, currentCamera, renderTarget, forceClear);
                //this.renderer.render(scene, currentCamera, 0, forceClear);
            }
        }

        // Reset to default settings
        leiaCamera.resetCenteralCamera();
    };


    this.renderSwizzleView = function(scene, leiaCamera) {

        // Determine which Shader will be used:  basic, supersampled, sharpened, etc
        // console.log("ShaderMode: " + this.shaderMode);
        this.renderShaderMaterial(scene, leiaCamera, this.shaderMode);

        var swizzleMaterial = this.currentShaderMaterial;

        // var swizzleMaterial = this.getShaderMaterial(scene, leiaCamera, this.SHADER_MODES.SUPERSAMPLE_SWIZZLE);  // for debugging purpose
        //var swizzleMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});  // for debugging purpose
        // var forceClear = false;
        // this.renderer.setRenderTarget ( this.renderTarget );
        // this.renderTiledView(scene, leiaCamera, this.renderTarget, forceClear);   // first subview missing, so
        // this.renderSingleView(scene, leiaCamera, this.renderTarget);   // first subview missing, so

// swizzleMaterial = new THREE.MeshBasicMaterial( { map: this.renderTarget } );  // for debugging purpose

        // Preparing Swizzle Camera and Scene
        var width  = this.canvasSize.x;
        var height = this.canvasSize.y;

        var cameraSwizzle = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -1, 1);
//        cameraSwizzle.position.z = 0;
        cameraSwizzle.position.z = 0;

        // Prepare the Swizzle Plane for renderTarget Texture
        var meshSwizzle = new THREE.Mesh(new THREE.PlaneGeometry(this.canvasSize.x, this.canvasSize.y), swizzleMaterial);
        // meshSwizzle has all rendered result as texture

        var sceneSwizzle = new THREE.Scene;
        sceneSwizzle.add(meshSwizzle);
        sceneSwizzle.add(cameraSwizzle);

        // this.renderer.clear();
        this.renderer.setViewport(0, 0, width, height);
        this.renderer.setScissor (0, 0, width, height);
        this.renderer.enableScissorTest(true);

        // this.renderer.setClearColor(new THREE.Color().setRGB(1.0, 0.0, 0.0));
        // this.renderer.clear();

        this.renderer.render(sceneSwizzle, cameraSwizzle);
    };


    // this.getShaderMaterial = function(renderTarget, canvasSize, vertexShader, fragmentShader) {
    this.renderShaderMaterial = function(scene, leiaCamera, shaderMode) {

        // var shaderMaterial;
        var forceClear = false;

        switch(shaderMode) {
            case this.SHADER_MODES.BASIC_SWIZZLE: {

                leiaCamera.updateCameraArrayProperties();
                this.renderer.setRenderTarget(this.renderTarget);
                this.renderTiledView(scene, leiaCamera, this.renderTarget, forceClear);
                // this.renderSingleView(scene, leiaCamera, this.renderTarget);

                break;
            }

            case this.SHADER_MODES.SUPERSAMPLE_SWIZZLE: {

                var camShiftX = 0.5 * leiaCamera.baselineStep.x;
                var camShiftY = 0.5 * leiaCamera.baselineStep.y;

                var cameraShift = {x: 0, y:0};
                leiaCamera.updateCameraArrayProperties(cameraShift);
// this.renderer.setRenderTarget(this.renderTarget);
                this.renderTiledView(scene, leiaCamera, this.renderTarget, forceClear);

                cameraShift = {x: camShiftX, y: camShiftY};
                leiaCamera.updateCameraArrayProperties(cameraShift);
// this.renderer.setRenderTarget(this.swizzleRenderTargetSftXY);
                this.renderTiledView(scene, leiaCamera, this.swizzleRenderTargetSftXY, forceClear);

                cameraShift = {x: camShiftX, y: 0};
                leiaCamera.updateCameraArrayProperties(cameraShift);
// this.renderer.setRenderTarget(this.swizzleRenderTargetSftX);
                this.renderTiledView(scene, leiaCamera, this.swizzleRenderTargetSftX, forceClear);

                cameraShift = {x: 0, y: camShiftY};
                leiaCamera.updateCameraArrayProperties(cameraShift);
// this.renderer.setRenderTarget(this.swizzleRenderTargetSftY);
                this.renderTiledView(scene, leiaCamera, this.swizzleRenderTargetSftY, forceClear);

                break;
            }
        }

        // return shaderMaterial;
    };


    this.createShaderMaterial = function(shaderMode, canvasSize, isSwizzle, isColor, canvasShift) {
        // Update the 'currentShaderMaterial' property of LeiaRenderer
        // Need to access this.{ renderTarget, renderTarget{X, Y, XY} },
        //   this.vertexShaderSwizzle, this.fragmentShader{Basic, SuperSample}
        var shaderMaterial;

        switch(shaderMode) {
            case this.SHADER_MODES.BASIC_SWIZZLE: {

                shaderMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        "tNormal": {
                            type: "t",
                            value: this.renderTarget
                        },

                        "renderSize": {
                            type: "v2",
                            value: new THREE.Vector2(canvasSize.x, canvasSize.y)
                        }
                    },
                    vertexShader: this.vertexShaderSwizzle,
                    fragmentShader: this.fragmentShaderSwizzleBasic(canvasSize.x, canvasSize.y, isSwizzle, isColor, canvasShift),
                    depthWrite: false
                });
                break;
            }

            case this.SHADER_MODES.SUPERSAMPLE_SWIZZLE: {

                shaderMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        "tNormal": {
                            type: "t",
                            value: this.renderTarget
                        },
                        "tSuperX": {
                            type: "t",
                            value: this.swizzleRenderTargetSftX
                        },
                        "tSuperY": {
                            type: "t",
                            value: this.swizzleRenderTargetSftY
                        },
                        "tSuperD": {
                            type: "t",
                            value: this.swizzleRenderTargetSftXY
                        },
                        "fader": {
                            type: "f",
                            value: 1
                        },
                        "renderSize": {
                            type: "v2",
                            value: new THREE.Vector2(canvasSize.x, canvasSize.y)
                        }
                    },
                    vertexShader: this.vertexShaderSwizzle,
                    fragmentShader: this.fragmentShaderSwizzleSuperSample(canvasSize.x, canvasSize.y, isSwizzle, isColor, canvasShift),
                    depthWrite: false
                });
                break;
            }
        }  // End of Switch to Choose Different ShaderMaterial


        return shaderMaterial;
    };

    this.fragmentShaderSwizzleBasic = function(canvasWidth, canvasHeight, isSwizzle, isColor, canvasShift) {
         var snipplet;
         var debug = false;
         if (debug) {
             snipplet = 
                "varying vec2 vUv;\n" +
                "uniform sampler2D tNormal;\n" +
                "void main() {\n" +
                "  gl_FragColor = texture2D( tNormal, vUv);\n" +
                "}";
            } else {
            snipplet = 
                "precision highp float;\n" +
                "varying vec2 vUv;\n" +
                "uniform sampler2D tNormal;\n" +
                "uniform vec2 renderSize;\n" +
                LEIA_getSwizzlePixel(isColor) +
                LEIA_mainStart(canvasWidth, canvasHeight, isSwizzle, isColor, canvasShift) +
                "fc = getPixel( 1.0, tNormal, viewId, sPixId);\n" +
                LEIA_mainFinish(isColor);
        }
        return snipplet;
    };

    this.fragmentShaderSwizzleSuperSample = function(canvasWidth, canvasHeight, isSwizzle, isColor, canvasShift) {
        var snipplet =
            "precision highp float;" + "varying  vec2 vUv; \t\t\t\n" +
            "uniform sampler2D tNormal; \t\t\t\n" +
            "uniform sampler2D tSuperX; \t\t\t\n" +
            "uniform sampler2D tSuperY; \t\t\t\n" +
            "uniform sampler2D tSuperD; \t\t\t\n" +
            "uniform vec2 renderSize;\n " +
            LEIA_getSwizzlePixel(isColor) +
            LEIA_mainStart(canvasWidth, canvasHeight, isSwizzle, isColor, canvasShift) +
            "fc = getPixel( 1.0, tNormal, viewId, sPixId);" +
            "float imgCoeff = 1.0;"  +
            "float nnCoeff  = 0.5;"  +
            "float nxnCoeff = 0.25;" +
            "float coeff = imgCoeff+2.0*nnCoeff+nxnCoeff;" +
            "fc =    getPixel( imgCoeff, tNormal, viewId, sPixId );" +
            "fc = fc+getPixel(  nnCoeff, tSuperX, viewId, sPixId );" +
            "fc = fc+getPixel(  nnCoeff, tSuperY, viewId, sPixId );" +
            "fc = fc+getPixel( nxnCoeff, tSuperD, viewId, sPixId );" +
            "if (viewId.s > 0.0) { \n" +
            "   coeff = coeff + nnCoeff + nxnCoeff;" +
            "   fc = fc+getPixel( nnCoeff, tSuperX, viewId-vec2(1.0, 0.0), sPixId );" +
            "   fc = fc+getPixel( nxnCoeff, tSuperD, viewId-vec2(1.0, 0.0), sPixId );" +
            "}\n" +
            "if (viewId.t > 0.0) { \n" + "   coeff = coeff + nnCoeff + nxnCoeff;" +
            "   fc = fc+getPixel(  nnCoeff, tSuperY, viewId-vec2(0.0, 1.0), sPixId );" +
            "   fc = fc+getPixel( nxnCoeff, tSuperD, viewId-vec2(0.0, 1.0), sPixId );" +
            "   if (viewId.s > 0.0) { \n" + "       coeff = coeff + nxnCoeff;" +
            "       fc = fc + getPixel( nxnCoeff, tSuperD, viewId - vec2(1.0, 1.0), sPixId );" +
            "   }\n" +
            "}\n" +
            "fc = fc/coeff;" +
            LEIA_mainFinish(isColor);

        return snipplet;
    };

    this.setRenderMode = function(renderMode) {  // Single, Tiled, Swizzle
        this.renderMode = renderMode;
    };

    this.setShaderMode = function(shaderMode) {
        this.shaderMode = shaderMode;
        this.currentShaderMaterial = this.createShaderMaterial(this.shaderMode, this.canvasSize, this.isSwizzle, this.isColor, this.canvasShift);
    };

    this.setSwizzleColor = function(isColor) {
        this.isColor = isColor;
        this.currentShaderMaterial = this.createShaderMaterial(this.shaderMode, this.canvasSize, this.isSwizzle, this.isColor, this.canvasShift);
    }

    this.setSwizzleView = function(isSwizzle) {
        // under Swizzle Mode, choose whether to be viewed in tiles or not
        this.isSwizzle = isSwizzle;
        this.currentShaderMaterial = this.createShaderMaterial(this.shaderMode, this.canvasSize, this.isSwizzle, this.isColor, this.canvasShift);
    };

    this.setSize = function(canvasWidth, canvasHeight) {
        this.canvasSize.x = canvasWidth;
        this.canvasSize.y = canvasHeight;
        var updateStyle = true;  // what is this for??
        this.renderer.setSize(this.canvasSize.x, this.canvasSize.y, updateStyle);
// Update currentShaderMaterial
    };

    this.shiftXY = function(shiftX, shiftY) {
        // under Swizzle Mode, choose whether to be viewed in tiles or not
        this.canvasShift.x = (this.canvasShift.x + shiftX + 8) % 8; //leiaDisplay.numberOfViews.x;
        this.canvasShift.y = (this.canvasShift.y + shiftY + 8) % 8; //leiaDisplay.numberOfViews.x;
        this.currentShaderMaterial = this.createShaderMaterial(this.shaderMode, this.canvasSize, this.isSwizzle, this.isColor, this.canvasShift);
    };

    function LEIA_getSwizzlePixel(isColor) {
        var snipplet;
        snipplet = isColor ? "vec4" : "float";
        snipplet += " getPixel( in float amplitude, in sampler2D texture, in vec2 viewId, in vec2 sPixId) {\n";
        snipplet += "    vec2 id  = vec2( ( sPixId.s + viewId.s*renderSize.x/8.0 )/renderSize.x + 1.0/(2.0*renderSize.x), ( sPixId.t + viewId.t*renderSize.y/8.0 )/renderSize.y + 1.0/(2.0*renderSize.y) );\n";
        snipplet += "    vec4 p = texture2D( texture, id );\n";
        if (isColor) {
            snipplet += "    p =  amplitude * p;\n" +
            "    return p ;\n";
        }
        else {
            snipplet += "    float pb = amplitude * ( p.r + p.g + p.b ) / 3.0;\n" +
            "    return pb ;\n";
        }
        snipplet += "}\n";

        return snipplet;
    }


    function LEIA_mainStart(width, height, isSwizzle, isColor, canvasShift) {
        var tileWidth  = width  / 8;
        var tileHeight = height / 8;
        var snipplet = "void main() { \n";
        snipplet    += "    vec2 pixelCoord = vec2( floor((vUv.s)*renderSize.x), floor(vUv.t*renderSize.y) ); \n";
        snipplet    += "    pixelCoord      = vec2(max(pixelCoord.s-" + canvasShift.x.toFixed(2) + ", 0.0), max(pixelCoord.t-" + canvasShift.y.toFixed(2) + ",0.0));\n";

        if (isSwizzle) {
            snipplet += "    vec2 viewId = vec2(   mod(pixelCoord.s,8.0),   mod(pixelCoord.t,8.0) ); \n";
            snipplet += "    vec2 sPixId = vec2( floor(pixelCoord.s/8.0), floor(pixelCoord.t/8.0) ); \n";
        } else {
            snipplet += "    vec2 sPixId = vec2(   mod(pixelCoord.s, " + tileWidth.toFixed(2)  + ")," +
            " mod(pixelCoord.t, " + tileHeight.toFixed(2) + ") ); \n" +
            "    vec2 viewId = vec2( floor(pixelCoord.s/" + tileWidth.toFixed(2)  + ")  ," +
            " floor(pixelCoord.t/" + tileHeight.toFixed(2) + ") ); \n";
        }

        if (isColor) {
            snipplet += "    vec4 fc     = vec4(0.0, 0.0, 0.0, 0.0); \n";
        }
        else {
            snipplet += "    float fc    = 0.0; \n";
        }
        return snipplet;
    }


    function LEIA_mainFinish(isColor) {
        var diagonalAttenuation = 0;
        var pixelAdjust0 = 0;
        var pixelAdjust1 = 1;
        var pixelAdjust2 = 0;
        var fader = 1;
        var snipplet = "    float screenCorrection = 1.0;\n";
        snipplet    += "    float diagCompensation = 1.0 - " + diagonalAttenuation.toFixed(2) + " * exp(-(1.0 - vUv.s * vUv.s + vUv.t * vUv.t));\n";
        snipplet    += "    screenCorrection = diagCompensation;\n";
        if (isColor) {
            snipplet += "    float fca = fc.a;\n";
            snipplet += "    vec4 fc2 = vec4(fc.r * fc.r, fc.g * fc.g, fc.r * fc.r, 0.0);\n"
        } else snipplet += "    float fc2 = fc * fc;\n";
        snipplet += "    fc = screenCorrection * " + fader.toFixed(2) + " * (" + pixelAdjust0.toFixed(2) + " + " + pixelAdjust1.toFixed(2) + " * fc + " + pixelAdjust2.toFixed(2) + " * fc2);\n";
        if (isColor) {
            snipplet += "    fc.r = min(max(fc.r, 0.0), 1.0);\n";
            snipplet += "    fc.g = min(max(fc.g, 0.0), 1.0);\n";
            snipplet += "    fc.b = min(max(fc.b, 0.0), 1.0);\n";
            snipplet += "    fc.a = fca ;\n";
            snipplet += "    gl_FragColor = vec4(fc.r, fc.g, fc.b, fc.a);\n";
        } else {
            snipplet += "    fc = min(max(fc, 0.0), 1.0);\n";
            snipplet += "    gl_FragColor = vec4(fc, fc, fc, 1.0);\n";
        }
        snipplet += "}\n";
        return snipplet;
    }

    this.vertexShaderSwizzle =
        "varying vec2 vUv;" +
        "void main() {" +
        "    vUv = uv;" +
        "    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );" +
        "}";

    this.init({
        antialias: true,
        renderMode: this.RENDER_MODES.TILED_VIEW,
        //renderMode: this.SWIZZLE_VIEW,
        colorMode:  'color',
        devicePixelRatio: 1,
        superSampleSharpen: false,
        messageFlag: 'IDE'  // _targetEnvironment
//        canvasSize: {x: 10*_canvas.width, y: 10*_canvas.height}
    });
}
