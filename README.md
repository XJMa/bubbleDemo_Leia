# Make History: Be A Holographer!! #

Want to be a pioneer in interactive holographic design? Write the first mobile holographic apps and be remembered for the ages?

Well here is your chance! :-)

[LEIA](https://www.leiainc.com) has developed an API, [LeiaCore](https://github.com/LeiaInc/LeiaCore), using [WebGL](https://www.khronos.org/webgl) and [THREE.js](http://threejs.org) making it super easy to create interactive holographic content running directly in your browser. You can write code from scratch, or adapt existing [WebGL](https://www.khronos.org/webgl) and [THREE.js](http://threejs.org) based apps. In essence, the main difference between standard code and our 3D code is using our holographic renderer function instead of the standard renderer.

Not only will your designs come to life on our display, you’ll also get the chance to interact with them using a variety of cool new user interfaces such as the [Leap Motion Controller™](https://developer.leapmotion.com), [Intel® RealSense™ 3D cameras](http://www.intel.com/RealSense), hovering panels, even our very own holographic camera. You can use existing JavaScript plug-ins, or write your own to integrate the device of your choice to our ecosystem.

We will invite the best would-be holographers to our [Menlo Park headquarters](https://www.google.com/maps/place/2440+Sand+Hill+Rd+%23303,+Menlo+Park,+CA+94025/@37.4220027,-122.2039758,17z) to try our latest prototypes while we are still in stealth mode.

A little later in the year we’ll be releasing a higher level API, jQuery style, that will let non-graphic experts contribute holographic content without any prior knowledge of 3D graphics. Doesn’t get any better than that !

Have a look at [our website](https://www.leiainc.com) to read our [BLOG](https://www.leiainc.com/blog), have a look at and even try editing some of our example applications in the Alpha version of our [IDE](http://ide.leiainc.com/), [download our holographic 3D creation guidelines](https://www.leiainc.com/wp-content/uploads/2014/11/Holographic-content-creation-guidelines.pdf) for an overview of the technology involved in the [LEIA](https://www.leiainc.com) display, and get more details on where the [LEIA](https://www.leiainc.com) platform is headed in general.

Welcome to the holographic future!

# LeiaCore API #

We'd like to give you, the developer, the smoothest possible onramp to implementing some basic 3D functionality using the LeiaCore library that will render as a three dimensional hologram on a [LEIA](https://www.leiainc.com) display.

Exposure and experience with the [THREE.js](http://threejs.org) library will help you immeasurably in quickly understanding how to best create more complex 3D scenes for Leia holographic devices, as the core library heavily leverages [THREE](http://threejs.org) for anything involving custom content creation.

It is also possible to use pre-rendered content and have it appear holographically, however in most cases its more ideal to render your content as [THREE.js](http://threejs.org) vector primitives for optimum design flexibility and rendering performance.

## Getting Started ##

Now lets go through an example of what it takes to render the simplest single shape scene using LeiaCore and [THREE.js](http://threejs.org).

Most of our work will be done in JavaScript, but we need to create a mechanism to be able to have our web browser load the required libraries, as well as run our LeiaCore code, so we'll create a very basic HTML page for handling this:

      <!DOCTYPE html>
      <head>
          <meta charset="utf-8">
          <title>Single Shape Demo Example</title>
          <style type="text/css">
          body {
              overflow: hidden;
          }
          </style>
              <!-- !!! IMPORTANT TO USE THIS AND ONLY THIS VERSION OF THREE.JS !!! -->
              <script src="three.min.js"></script>
              <script src="helvetiker_bold.typeface.js"></script>
              <script src="helvetiker_regular.typeface.js"></script>
              <!--    ADD THE LEIA CORE LIBRARY    -->
              <script src="https://www.leiainc.com/build/LeiaCore-latest.min.js"></script>
      </head>
      <body style="margin: 0 0 0 0;"></body>
            <script>
              // LeiaCore Code Goes Here!
            </script>
      </html>
      
[This file](https://github.com/LeiaInc/LeiaSingleShape/blob/master/index.html), as well as the rest of the files for this example ara available for viewing or download in the [LeiaSingleShape](https://github.com/LeiaInc/LeiaSingleShape) repository.

Ultimately we are looking to arrive at an instance of [THREE.Scene()](http://threejs.org/docs/#Reference/Scenes/Scene) that will contain our visulal environment space. In order to do this, we need to construct its dependent objects; [LeiaDisplay()](https://github.com/LeiaInc/LeiaCore/wiki#leiadisplay), [LeiaCamera()](https://github.com/LeiaInc/LeiaCore/wiki#leiacamera), and [LeiaRenderer()](https://github.com/LeiaInc/LeiaCore/wiki#leiarenderer). Full documentation of these objetcs is described in the [LeiaCore Wiki](https://github.com/LeiaInc/LeiaCore/wiki). You can learn the extent of thier full capability there, but we'll just focus on instantiating and using them in this example.

Let's do it!

## Build The LeiaCore Objects ##

    var leiaDisplay = new LeiaDisplay('./Coruscant.js');

We now have an instance of LeiaDisplay() as leiaDisplay. This example assumes we are using the Coruscant LEIA display. There are and will be more device descriptor files such as Coruscant.js in the future. Simply choose the appropriate device decriptor file, and pass its path to LeiaDisplay(). Typically the path to all decice descriptor files will be the root of LeiaCore. 

Through this instance, we will be able to communicate with the physical deivice. At the moment all device I/O can be considered read-only. However, we need to retain a hook to the hardware to move to the next step, which is constructing a LeiaCamera() instance. Let's see how thats done now.

    var leiaCamera = new LeiaCamera(leiaDisplay);

Simply pass the instance of LeiaDisplay() to LeiaCamera() and voila! We now have an instance of LeiaCamera() as leiaCamera. 

Finally, we need an instance of LeiaRenderer() in order to actually output our scene to our LEIA display. Lets build one!

    var leiaRenderer = new LeiaRenderer(leiaDisplay);

We now have instances of all three essential LieaCore objects to be able to render our 3D scene onto our LEIA display. Now is a good time to construct an instance THREE.Scene(). Since we've already configuered our project to include the THREE library in the root namespace, this is simply done with:

    var scene = new THREE.Scene();

Yor script block at the bottom of your HTML file should look exactly like this at this point:

    <script>
        // Build The LeiaCore Objects
        var leiaDisplay = new LeiaDisplay('./Coruscant.js');
        var leiaCamera = new LeiaCamera(leiaDisplay);
        var leiaRenderer = new LeiaRenderer(leiaDisplay);
        var scene = new THREE.Scene();
    </script>

**Note:** Its usually a good idea to build at least one THREE group in advance, to contain some or all of your visual objects to make it easier to move or otherwise manipulate them. Since we're only dealing with one visual object in this example, we can omit doing this for now. Don't worry, we'll show you how to make extensive use of groups in later examples.

## Generate A Cube ##

Now we need to actually build something to send to our new scene. Lets start with a single cube, and see what it takes to place it into our new basic scene.

First we'll need to define what kind of geometry we'll be buiding a displayable 3d object for. THREE provides a whole assortment of prebuilt primitives for us to use to base any other more complex shape out of. For now lets just focus on rendering one though. In order to draw a cube, first we instantiate a THREE [BoxGeometry()](http://threejs.org/docs/#Reference/Extras.Geometries/BoxGeometry) thusly:

    var boxGeometry = new THREE.BoxGeometry(3, 3, 3);

This gives us a 3x3x3 (x:3, y:3, z:3) instance of [BoxGeometry()](http://threejs.org/docs/#Reference/Extras.Geometries/BoxGeometry) as boxGeometry. The coordinates are relative to THREE's built in cartesian system, and you can treat as just arbitrary units for the time bieng. Thier relationship to actual pixel size on the screen isn't important right now. Just assume a 3x3x3 cube will be large enough to be visible, but not so large so as to take up the entire environment space.
    
Next we need to tell THREE what kind of material we want our new box to use when we render it. Just like with THREE's geometries, there are a plethora of available materials to choose from. The simplest possible one in our context is a [MeshBasicMaterial()](http://threejs.org/docs/#Reference/Materials/MeshBasicMaterial). Here's how you construct an instance of one:

    var greenMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

This will give us a MeshBasicMaterial() set to the color green as greenMaterial.

**Note:** You're probably getting excited at this point that you have something almost working, or possibly you've skimmed ahead and figured the rest out, and are staring at a green cube. Resist the temptation to try to add shadows and other effects to your scene right now, since using MeshBasicMaterial() will only allow the most primitive of rendering features, and doesn't support the more advanced, such as reflective surfaces or shadows. We promise we'll get to showing you how to implement those and many other things later! :-)

Now that we have a geometry and a material constructed, we need to get THREE to use them to generate the actual shape we've embodied in these two dependent objects. For this weill will generate a THREE Mesh() like so: 

    var cube = new THREE.Mesh(boxGeometry, greenMaterial);
    
Now we have a THREE Mesh() instantiated as the cube variable. This completes the basics for constructing our cube, but we will need to get the shape into the viewable environment. For this we need to add it to the scene.

**Note:** Normally, if we were going to play around with the initial position of our object(s), this would be a good place in the initialization routine to set thier default state, and initial orientation or global placement in our scene. For the purposes of this example, we're just going to let THREE render our cube from the 0,0,0 origin point in the world coordinate space. THREE will assume that our cube's world origin is already at 0,0,0, and is identical to if we had called:

    cube.position.set(0,0,0);
    
At this point, the script block in our HTML should look identical to:

    <script>
        // Build The LeiaCore Objects
        var leiaDisplay = new LeiaDisplay('./Coruscant.js');
        var leiaCamera = new LeiaCamera(leiaDisplay);
        var leiaRenderer = new LeiaRenderer(leiaDisplay);
        var scene = new THREE.Scene();
        
        // Generate A Cube
        var boxGeometry = new THREE.BoxGeometry(3, 3, 3);
        var greenMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh(boxGeometry, greenMaterial);
    </script>

## Add The Cube To The Scene ##

Now that we've built a simple cube we can add it to the scene we created earlier. It's literally this easy:

    scene.add(cube);

Simple as that! Now that we've contrsucted our root objects, built a simple shape, added that shape to our scene, lets get it to show up on the screen. This is where we pass our scene and leiaCamera we built in the first part of this example, off to [LeiaRenderer()](https://github.com/LeiaInc/LeiaCore/wiki#leiarenderer) in order to display our visual objects. For this we need to tell the LEIA renderer to render it to our display.

At this point, the script block in our HTML should look identical to:

    <script>
        // Build The LeiaCore Objects
        var leiaDisplay = new LeiaDisplay('./Coruscant.js');
        var leiaCamera = new LeiaCamera(leiaDisplay);
        var leiaRenderer = new LeiaRenderer(leiaDisplay);
        var scene = new THREE.Scene();
        
        // Generate A Cube
        var boxGeometry = new THREE.BoxGeometry(3, 3, 3);
        var greenMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh(boxGeometry, greenMaterial);
        
        // Add The Cube To The Scene
        scene.add(cube);
    </script>

## Render The Scene ##

In order to be able to actually see the cube we've just created, we need to tell the LEIA renderer that the scene exists, and to actually draw it to the display. In order to do this we simply call leiaRenderer.render() passing it the scene and the leiaCamera we constructed eralier in the example like so:
    
    leiaRenderer.render(scene, leiaCamera);

The call to LeiaRenderer.render() is static, so you don't need to handle any return value from it.

At this point, the script block in our HTML should look identical to:

    <script>
        // Build The LeiaCore Objects
        var leiaDisplay = new LeiaDisplay('./Coruscant.js');
        var leiaCamera = new LeiaCamera(leiaDisplay);
        var leiaRenderer = new LeiaRenderer(leiaDisplay);
        var scene = new THREE.Scene();
        
        // Generate A Cube
        var boxGeometry = new THREE.BoxGeometry(3, 3, 3);
        var greenMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh(boxGeometry, greenMaterial);
        
        // Add The Cube To The Scene
        scene.add(cube);
        
        // Render The Scene
        leiaRenderer.render(scene, leiaCamera);
    </script>
    
## Competed Example ##

The [complete HTML file](https://github.com/LeiaInc/LeiaSingleShape/blob/master/index.html) filled in with our new 3D shape, and all of our LEIA rendering code is [available here](https://github.com/LeiaInc/LeiaSingleShape/blob/master/index.html), and should look identical to:

    <!DOCTYPE html>
      <head>
          <meta charset="utf-8">
          <title>Single Shape Demo Example</title>
          <style type="text/css">
          body {
              overflow: hidden;
          }
          </style>
              <!-- !!! IMPORTANT TO USE THIS AND ONLY THIS VERSION OF THREE.JS !!! -->
              <script src="three.min.js"></script>
              <script src="helvetiker_bold.typeface.js"></script>
              <script src="helvetiker_regular.typeface.js"></script>
              <!--    ADD THE LEIA CORE LIBRARY    -->
              <script src="https://www.leiainc.com/build/LeiaCore-latest.min.js"></script>
      </head>
      <body style="margin: 0 0 0 0;"></body>
            <script>
                // Build The LeiaCore Objects
                var leiaDisplay = new LeiaDisplay('./Coruscant.js');
                var leiaCamera = new LeiaCamera(leiaDisplay);
                var leiaRenderer = new LeiaRenderer(leiaDisplay);
                var scene = new THREE.Scene();
        
                // Generate A Cube
                var boxGeometry = new THREE.BoxGeometry(3, 3, 3);
                var greenMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
                var cube = new THREE.Mesh(boxGeometry, greenMaterial);
        
                // Add The Cube To The Scene
                scene.add(cube);
        
                // Render The Scene
                leiaRenderer.render(scene, leiaCamera);
            </script>
      </html>

## Extra: The Rendering Loop ##

### Tell The Browser What To Loop To Animate ###

    <script>
        // Build The LeiaCore Objects
        var leiaDisplay = new LeiaDisplay('./Coruscant.js');
        var leiaCamera = new LeiaCamera(leiaDisplay);
        var leiaRenderer = new LeiaRenderer(leiaDisplay);
        var scene = new THREE.Scene();
        
        // Generate A Cube
        var boxGeometry = new THREE.BoxGeometry(3, 3, 3);
        var greenMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh(boxGeometry, greenMaterial);
        
        // Add The Cube To The Scene
        scene.add(cube);
        
        function animate() {
            // Tell The Browser What To Loop To Animate
            requestAnimationFrame(animate);
            
            /** Do Fun Stuff Here **/
            
            // Render The Scene
            leiaRenderer.render(scene, leiaCamera);
        }
        
        window.onload = function () {
            animate();
        };
    </script>
