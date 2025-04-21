// Math Attack Game, Programming Task for Module 6 - Greg A. Baugher

//Global Scene-Related Variable Declarations
var scene = new THREE.Scene();
const levels = ['Beginner', 'Intermediate', 'Difficult', 'Expert'];
scene.level = 0;
const texLoader = new THREE.TextureLoader();
const spaceTexture = texLoader.load( 'assets/sky.jpg' );
scene.background = spaceTexture;
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({ antialias:true });

// Global Object-Related Variable Declarations
var expPos = new THREE.Vector3( 0, 0, 0 );      // Sets initial position of an explosion to blast a number
var shipPos = new THREE.Vector3( 0, -1, 15 );   // Sets initial position of the spacecraft (ship)
var shipVel = new THREE.Vector3( 0, 0, 0 );     // Sets the initial velocity of the ship (in three dimensions)
var dodecahedron, cube, earth, moon, crosshairs;
let numberBalls = [], origBallPosition = [], explosions = [], numTextures = [], spacecraft = [];

// Global Control-Related Variable Declarations
var ViewportAngleLR = 0, ViewportAngleUD = 0, cameraDir, theta, phi, t = 0, pausedTvalue = 0; 
const AngleIncrement = (Math.PI * 2) / 144; 
var currentSprite = 0, previousSprite = 0;
var Fast_ForRev = 0, Fast_LeftRight = 0, Fast_UpDown = 0;  
var viewMode = false, pauseQuestions = false, nextLevelUpdated = false, pauseGame = false, usedPausedTvalue = false, gameOver = false;
var control = { ControlKeys1: "W:Fw, S:Rv, L:Lft, R:Rt", ControlKeys2: "U:Up, J:Dwn, Z:AllStop", ControlKeys3: "L/R Arrow: ViewMode", 
    Fast_ForRev: shipVel.z, Fast_LeftRight: shipVel.x, Fast_UpDown: shipVel.y };
const stats = Stats();
document.body.appendChild(stats.dom);
var controlgui, stats3D;

// Global Variables for title lines and indicators, and question, progress, and points boxes
const titleLine = document.getElementById( 'titleLine' );
const titleLine2 = document.getElementById( 'titleLine2' );
let speedIndicator = document.getElementById( 'speedIndicator' );
const question = document.getElementById( 'question' );  
const progress = document.getElementById( 'progress' );
const level = document.getElementById( 'level' );
const points = document.getElementById( 'points' );
const timeRem = document.getElementById( 'timeRem' );
var newQuest = false, questions = [], answers = [], answer = 9, index = 0; 
var number = -9, previousNumber = -99, penaltyScored = false, pointsEarned = 0, timeAllotted = 900, timeRemaining = 900;

function setTitleBoxPositions() {
    const w = window.innerWidth;
    titleLine.style.top = `${10}px`;
    titleLine.style.left = `${w/2 - 450}px`;
    titleLine2.style.bottom = `${30}px`;
    titleLine2.style.left = `${w/2 - 290}px`;
    speedIndicator.style.bottom = `${30}px`;
    speedIndicator.style.right = `${10}px`;
    question.style.top = `${100}px`;
    question.style.left = `${30}px`;
    progress.style.top = `${220}px`; 
    progress.style.left = `${30}px`;
    level.style.right = `${30}px`;
    level.style.top =  `${190}px`;
    points.style.top = `${240}px`;
    points.style.right = `${30}px`;
    timeRem.style.top = `${290}px`;
    timeRem.style.right = `${30}px`;
};
setTitleBoxPositions();

function setQuestionsAndAnswers() {
    questions = [ // Level One Questions
        'Evaluate -3 + -1', 'Evaluate -9 + 3', 'Evaluate 5 - (-2)', 
        'Evaluate | -3 |', 'Evaluate | -2 + -3 |', 'Evaluate -7 + |-4|', 
        'Evaluate -2 - |-3|', 'Evaluate x^2 if x= -2', 'Simplify -4x + 4x', 
        'Simplify 2x - 2(x + 1)', 'Simplify 5 - 4 + 2( 7 - 8 )', 'Solve 6x - 6 = 0', 
        'Solve 3x - 7 = -1', 'Solve 18 + 3x = -4 + 1', 'Simplify 3(x + 2) - 3x', 'LEVEL ONE COMPLETED!', 
        // Level Two Questions
        'Solve 4(x + 5) = 0', 'Solve 2(2x - 5) = -x', 'Solve -12 - 5x = 23', 
        'Solve 5(2x - 1) = 5', 'Simplify -2(x - 1) - 6 + 2x', 'Evaluate 3x + y if x= -2 & y= 4',
        'Evaluate -3(-5) - 2( 4^2 - 11 )', 'Evaluate x - y if x= -3 & y= -2', 'Evaluate 2x^2 - 5x if x= -1', 
        'Evaluate -(0 - 3)^2 + 12', 'Solve 7 - 3( -2x + 5 ) = 4x', 'Simplify 2x( x^2 - 1 ) - x( 2x^2 - 2 )',
        'Solve -3y + 2 = 5 - 7( y - 3 )', 'Evaluate 10x - x^3 if x = -3', 'Solve 7 + 3x = 2x + 1', 'LEVEL TWO COMPLETED!!', 
        // Level Three Questions
        'Simplify |3 - 7| - |-5 + 2|', 'Evaluate 3(x - 2) + x^2 if x = -5', 'Solve 3 - 4(x - 5) = 7 - (x + 2)', 
        'Evaluate |3x - 5| - |7 - x| if x = -2', 'Simplify 8 - 3(2x - 3) + 6(x - 2)', 'Evaluate -5x - (4 + x)^2 if x = -1', 
        'Solve (x - 3)(x + 5) + 1 = x^2', 'Solve 3x - 5 - 2(5x - 2) = -3(x - 9)', 'Solve 2[ 3 - ( 5x + 17 )] = 3( x + 4) - 5x', 
        'Evaluate [3 - 2(x - 4) + 7x] - 2(5x - 1) if x = 3', 'Solve x(x - 4) - 5(2x + 2) = x^2 - 4x', 'Simplify 2[3x - 4(x - 2)] + 2(x - 8)',
        'Solve 2(x - 1)(x + 6) - 10x = 6 if x < 0', 'Evaluate 4x^3 + 2x^2 - 7x + 4 if x = -2', 'Solve 4x - 2x^2 = -6 if x > 0', 
        'GAME OVER - Press R to Restart' ];
    answers = [ // Level One Answers
        -4, -6, 7,
        3, 5, -3, 
        -5, 4, 0, 
        -2, -1, 1, 
        2, -7, 6, 99, 
        // Level Two Answers
        -5, 2, -7, 
        1, -4, -2, 
        5, -1, 7, 
        3, 4, 0, 
        6, -3, -6, 99, 
        // Level Three Answers
        1, 4, 6, 
        2, 5, -4, 
        7, -7, -5,
        -2, -1, 0,
        -3, -6, 3, 99 ];
};
setQuestionsAndAnswers();

// Code to cause an object to be "highlighted" when a user clicks on it 
const raycaster = new THREE.Raycaster();
document.addEventListener( 'mousedown', onMouseDown );

function initiateScene() {

    function setupCamera() {  // Set initial position and direction of camera
        camera.position.set( shipPos.x, shipPos.y + 1, shipPos.z + 4 );
        camera.lookAt( shipPos.x, shipPos.y, shipPos.z );
        cameraDir = new THREE.Vector3( 0, 2, -3 ).normalize();
        theta = Math.atan( -0.2 );
        phi = Math.PI;
      }
      
    function setupRenderer() {  // Setup renderer with Shadow Mapping and Clear Color, then resize and appendChild
        renderer.shadowMap.enabled = true;
        renderer.setClearColor( "#000000" );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
      }

    function addLights() {
        // add lights
        scene.add(new THREE.AmbientLight("rgb(183, 193, 224)"));
        const dirLight1 = new THREE.DirectionalLight( 0xffffff );
        dirLight1.position.set(2, 3, 2);
        dirLight1.castShadow = true;
        scene.add( dirLight1);  
        const dirLight2 = new THREE.DirectionalLight( 0xffffff );
        dirLight2.position.set(0, 3, 0);
        dirLight2.castShadow = true;
        scene.add( dirLight2); 
        const dirLight3 = new THREE.DirectionalLight( 0xffffff );
        dirLight3.position.set(-2, 2, 0);
        dirLight3.castShadow = true;
        scene.add( dirLight3); 
        const ptLight = new THREE.PointLight( 0xffffff );
        ptLight.position.set(2, -3, 4);
        ptLight.castShadow = true;
        scene.add( ptLight);  
        // scene.fog = new THREE.Fog( "rgb(23, 29, 25)", 0.015, 20); 
        };
    
    function addBasicObjects() {  // Creates basic objects (stationary or non-sprites)

        function createMesh( geometry, material, x, y, z, name ) {
            const mesh = new THREE.Mesh( geometry, material.clone());
            mesh.position.set( x, y, z );
            mesh.name = name;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            return mesh;
        }

        function createDodec() {   // Builds the dodecahedron:
            const metallicTexture = texLoader.load( 'textures/metallic.jpg' );
            var dodecGeom = new THREE.DodecahedronGeometry( .8 );
            var dodecMat = new THREE.MeshPhysicalMaterial( { color: "rgb(248, 142, 21)", map: metallicTexture } );
            dodecahedron = createMesh( dodecGeom, dodecMat, -5, 2, 2, 'dodecahedron' );
            return dodecahedron;
        };
    
        function createCube() {  // Builds the cube
            const shinyMetalTexture = texLoader.load('textures/shinyMetallic.png');     
            var cubeGeom = new THREE.BoxGeometry( 1.5, 1.5, 1.5 );
            var cubeMat = new THREE.MeshPhysicalMaterial( { map: shinyMetalTexture } ); 
            cube = createMesh(cubeGeom, cubeMat, 5, 2, 2, 'cube' );
            return cube;
        };
    
        function createEarth() {  // Earth: Create a sphere using physical material mapped with textureEarth
            const textureEarth = texLoader.load( 'assets/earth.jpg' );
            var earthGeom = new THREE.SphereGeometry( 1, 32, 16 ); 
            var earthMat = new THREE.MeshPhongMaterial( { map: textureEarth } ); 
            earth = createMesh( earthGeom, earthMat, 0, 3, 0, 'earth' ); 
            return earth;
        };
    
        function createMoon() { // Create a sphere using physical material mapped with textureMoon
            const textureMoon = texLoader.load( 'assets/moon.jpg' );
            var moonGeom = new THREE.SphereGeometry( .3, 32, 16 ); 
            var moonMat = new THREE.MeshPhongMaterial( { map: textureMoon } ); 
            moon = createMesh( moonGeom, moonMat, 0, 3, 4, 'moon' ); 
            return moon;
        };
          
        const basicObjects = new THREE.Group();
        basicObjects.add( createDodec() );
        basicObjects.add( createCube() );
        basicObjects.add( createEarth() );
        basicObjects.add( createMoon() ); 
        scene.add( basicObjects );
    };

    function createCrosshairs() {
        const crosshairsTexture = texLoader.load( "textures/crosshairs.jpg" );
        const crosshairsMaterial = new THREE.SpriteMaterial( { color: "rgb(250, 247, 252)", map: crosshairsTexture, opacity: 0.5, transparent: true } );
        crosshairs = new THREE.Sprite( crosshairsMaterial );
        crosshairs.scale.set( .6, .6, .6 );
        crosshairs.position.set( shipPos.x, shipPos.y + 1, shipPos.z );
    }
    
    function Spacecraft() {
        this.particleGroup = new THREE.Group();
        this.position = new THREE.Vector3();
        var sc = 2;  // scale value
    
        function createSprite( texture, name, number ) {
            const material = new THREE.SpriteMaterial( { color: "rgb(250, 247, 252)", map: texture, opacity: 0.5, transparent: true } );
            const sprite = new THREE.Sprite( material );
            sprite.scale.set( sc, sc, sc );
            sprite.position.set( shipPos.x, shipPos.y, shipPos.z );
            sprite.name = name;
            sprite.number = number;
            return sprite;
        };

        spacecraft.push( createSprite( texLoader.load( "textures/spacecraft-coasting.jpg" ), 'coast', 0 ) );
        spacecraft.push( createSprite( texLoader.load( "textures/spacecraft-forward.jpg" ), 'forward', 1 ) );
        spacecraft.push( createSprite( texLoader.load( "textures/spacecraft-reverse.jpg" ), 'reverse', 2 ) );
        spacecraft.push( createSprite( texLoader.load( "textures/spacecraft-left.jpg" ), 'left', 3 ) );
        spacecraft.push( createSprite( texLoader.load( "textures/spacecraft-right.jpg" ), 'right', 4 ) );
        spacecraft.push( createSprite( texLoader.load( "textures/spacecraft-up.jpg" ), 'up', 5 ) );
        spacecraft.push( createSprite( texLoader.load( "textures/spacecraft-down.jpg" ), 'down', 6 ) ); 

    };
  
    setupCamera(); 
      
    setupRenderer();
      
    addLights();

    addBasicObjects();

    let e = new Spacecraft();

    createCrosshairs();
    
    scene.add( spacecraft[0] );   // Starts with the coasting spacecraft with "USS Pegasus" over it. 
    scene.add( crosshairs );      // Adds the crosshairs over spacecraft

};  // End of initiateScene()

initiateScene();

function loadNumTextures() {  // Loads textures for number sprites ahead of time before use in NumberBalls()
    var string;
    for ( let i = -7; i < 8; i++ ) {  // Loads all the number sprites
        let str = Math.floor(Math.abs(i)).toString();
        if ( i < 0 ) { string = 'textures/smoke' + str + 'n.jpg'; }
        else  string = 'textures/smoke' + str + '.jpg';
        numTextures.push( texLoader.load( string ) );
    };
};

loadNumTextures();

function NumberBalls() {  // Creates a group of balls (sprites) using a smoky texture that spread out from a center and then migrate
    
    // Properties of each smokyBall group
    this.particleGroup = new THREE.Group();  // smokyBalls held in a group
    this.explosion = false;  // not activated yet
    this.numberParticles = 100;  // number of particles in smokyBall group
    this.spd = 0.002;  // velocity of particles
    this.color = new THREE.Color();
    this.number = 0;
    this.bodyToOrbit = 'none';
    this.center = new THREE.Vector3();

    this.ranOrbit = Math.floor( Math.random()*4 ); 
    switch ( this.ranOrbit ) {
        case 0 : this.center = new THREE.Vector3( -5, 2, 2 ); this.bodyToOrbit = 'dodecahedron'; break;   // orbits the dodecahedron
        case 1 : this.center = new THREE.Vector3( 5, 2, 2 ); this.bodyToOrbit = 'cube'; break;    // orbits the cube
        case 2 : this.center = new THREE.Vector3( 0, 3, 0 ); this.bodyToOrbit = 'earth'; break;    // orbits the earth
        case 3 : this.center = new THREE.Vector3( 0, 3, 4 ); this.bodyToOrbit = 'moon'; break;    // orbits the moon 
    };
    this.orbitDistance = 2;
    this.colorNum = Math.floor( Math.random()*5 ); 
    switch ( this.colorNum ) {
        case 0 : this.color.set( "rgba(247, 54, 54, 0.57)" ); break;   // orbits the dodecahedron
        case 1 : this.color.set( "rgba(37, 241, 98, 0.57)" ); break;    // orbits the cube
        case 2 : this.color.set( "rgba(61, 64, 240, 0.57)" ); break;    // orbits the earth
        case 3 : this.color.set( "rgba(248, 24, 200, 0.57)" ); break;    // orbits the moon 
    };

    const radius = 2;   // Initial boundary radius

    // Raycaster for detecting clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(); 

    this.makeParticles = function() {
        
        // Create particles
        for (let i = 0; i < this.numberParticles; i++) {
            let rand = Math.floor( Math.random()*15 );
            this.particleTexture = numTextures[ rand ];
            let particleMaterial = new THREE.SpriteMaterial( { map: this.particleTexture, depthTest: false } );
            let sprite = new THREE.Sprite( particleMaterial );
            sprite.number = rand - 7;
            sprite.userData.velocity = new THREE.Vector3( Math.random() * this.spd - this.spd / 2, 
                Math.random() * this.spd - this.spd / 2, Math.random() * this.spd - this.spd / 2 );
            sprite.userData.velocity.multiplyScalar( Math.random() * Math.random() * 2 + 1 );
            sprite.material.color = this.color;
            sprite.material.opacity = Math.random() * 0.2 + 0.4;
            let size = Math.random() * 0.06 + 0.18;
            sprite.scale.set( size, size, size );
            sprite.position.set(this.center.x, this.center.y, this.center.z);
            sprite.userData.glowing = false;  // Property to check if the sprite is glowing
            this.particleGroup.add( sprite );
        }

        this.particleGroup.position.set( this.center.x, this.center.y, this.center.z );
        scene.add( this.particleGroup );
        this.numberBall = true;
    };

    var distance, vector;

    this.update = function(t) {
        this.particleGroup.children.forEach((child) => {  // Causes this group of sprites to follow the moon as it revolves
            if ( this.bodyToOrbit == 'moon' ) { this.center = new THREE.Vector3( moon.position.x, moon.position.y, moon.position.z ); };
            if ( this.bodyToOrbit == 'cube' ) { this.center = new THREE.Vector3( cube.position.x, cube.position.y, cube.position.z ); };
            if ( this.bodyToOrbit == 'dodecahedron' ) { this.center = new THREE.Vector3( dodecahedron.position.x, dodecahedron.position.y, dodecahedron.position.z ); };
            if ( this.bodyToOrbit == 'earth' ) { this.center = new THREE.Vector3( earth.position.x, earth.position.y, earth.position.z ); };
             
            if (Math.random() > 0.5) child.material.rotation += 0.01;  // Rotates texture
                else child.material.rotation -= 0.01;           

            var scale = child.scale.x + Math.sin( t / 3000 + 1 ) / 500;  // Oscillates the scale of number sprites
            child.scale.set(scale, scale, 0);

            distance = Math.sqrt(Math.pow(child.position.x - this.center.x, 2) + Math.pow(child.position.y - this.center.y, 2) + 
                Math.pow(child.position.z - this.center.z, 2)); // Calculates distance sprite is from this.center
            const speed = 1000;
            if (distance < radius) { 
                child.position.add(child.userData.velocity);  // add velocity vector to position if distance from center is less than 5 
            } else { 
                if ( distance < 10 ) {
                    vector = new THREE.Vector3( (this.center.x - child.position.x), (this.center.y - child.position.y), (this.center.z-child.position.z));
                    child.position.x += Math.sin(t / 3000) / 100 + (t/speed)*vector.x/100;
                    child.position.y += -1*Math.sin(t / 3000) / 100 + (t/speed)*vector.y/100;
                    child.position.z += Math.cos(t / 3000) / 100 + (t/speed)*vector.z/100;
                }
            };
        });

        // Sort particles based on their distance from the camera for depth sorting
        this.particleGroup.children.sort((a, b) => {
            var cameraDistanceA = a.position.distanceTo(camera.position);
            var cameraDistanceB = b.position.distanceTo(camera.position);
            return cameraDistanceB - cameraDistanceA;
        });

        // if particle not visible, remove from particleGroup
        this.particleGroup.children = this.particleGroup.children.filter((child) => child.material.opacity > 0.0);

        if (this.particleGroup.children.length === 0) this.numberBall = false;
        // if numberBall is false (done), remove from numberBall array
        numberBalls = numberBalls.filter((exp) => exp.numberBall);
    };  // End of update function

    // Mouse click event to detect sprite click and make it glow
    window.addEventListener('click', (event) => {
        // Normalize mouse coordinates to [-1, 1] range for raycasting
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // Get the intersected objects with the ray
        var intersects = raycaster.intersectObject(this.particleGroup);

        // If an object was clicked, glow it
        if (intersects.length > 0) {
            var selectedSprite = intersects[0].object;
            if (!selectedSprite.userData.glowing) {
                selectedSprite.material.color.set(0xf15025); // Change color to red as glowing effect
                selectedSprite.userData.glowing = true;
            } else {
                selectedSprite.material.color.set(this.color); // Restore original color
                selectedSprite.userData.glowing = false;
            }
        }
    });
};   //  End of function NumberBalls()

function Explosion( expPos ) {  // Creates a group of exploding sprites when the ship's weapon is fired (by pressing spacebar)
    // Properties of each explosion
    this.particleGroup = new THREE.Group();  // exploding particles held in a group
    this.explosion = false;  // not activated yet
    this.particleTexture = new THREE.TextureLoader().load("textures/spot.png");  // image texture for particle
    this.numberParticles = Math.random()*50 + 100;  // number of particles in explosion
    this.spd = 0.02;  // velocity of particles
    this.color = new THREE.Color();
    expPos = new THREE.Vector3( crosshairs.position.x, crosshairs.position.y, crosshairs.position.z );
    this.particleGroup.position.set(Math.random()*.1 - .05 + expPos.x, Math.random()*.1 - .05 + expPos.y, Math.random()*.1 - .05 + expPos.z - 5 );

    this.makeParticles = function( ) {
        for (let i=0; i < this.numberParticles; i++) {
            let particleMaterial = new THREE.SpriteMaterial( { map: this.particleTexture, depthTest: false });
            let sprite = new THREE.Sprite( particleMaterial );
            sprite.material.blending = THREE.AdditiveBlending;   // blends colors together
            sprite.userData.velocity = new THREE.Vector3( Math.random()*this.spd - this.spd/2, 
                Math.random()*this.spd - this.spd/2, Math.random()*this.spd - this.spd/2 );
            sprite.userData.velocity.multiplyScalar(Math.random()*Math.random()*3 + 2 );
            sprite.material.color = this.color.setHSL((Math.random()), 0.95, 0.5); // random btw 0.1 and 0.9
            // sprite.material.color = this.color;  // use if particles to be the same color
            sprite.material.opacity = Math.random()*0.2 + 0.8;
            let size = Math.random()*0.05 + 0.02;
            sprite.scale.set( size, size, size );
            this.particleGroup.add(sprite);
        };

    scene.add( this.particleGroup );
    this.explosion = true;
    };   

    this.update = function() {
        this.particleGroup.children.forEach( (child) => {
            child.position.add( child.userData.velocity );  // add velocity vector to position
            child.material.opacity -= 0.008;  // fade particles

        });
        // if particle not visible, remove from particleGroup
        this.particleGroup.children = this.particleGroup.children.filter( (child) => 
            child.material.opacity > 0.0 );
        if ( this.particleGroup.children.length === 0 ) this.explosion = false;
        // if explosion is false (done), remove from explosions array
        explosions = explosions.filter( (exp) => exp.explosion );
    };
};  //  End of function Explosion()

function normalizeVector( vector ) {   // Converts the vector to one of length 1 in the same direction
    const magnitude = Math.sqrt( vector.x * vector.x + vector.y * vector.y + vector.z * vector.z );
    if (magnitude === 0) { return { x: 0, y: 0, z:0 }; }
    return new THREE.Vector3( vector.x / magnitude, vector.y / magnitude, vector.z / magnitude );
    };

function initialControls() {  // Creates controls that are needed for the scene, but not called in animate() method

    function addControlGUIObject() {  // Initializes Controller GUI
        controlgui = new dat.GUI();    
        controlgui.add( control, 'ControlKeys1' );
        controlgui.add( control, 'ControlKeys2' );
        controlgui.add( control, 'ControlKeys3' );
        controlgui.add( control, 'Fast_ForRev' ).min(-10).max(10).step(.001).listen().onChange(function( newValue ) { shipVel.z = -1*control.Fast_ForRev; });
        controlgui.add( control, 'Fast_LeftRight' ).min(-10).max(10).step(.001).listen().onChange(function( newValue ) { shipVel.x = control.Fast_LeftRight; });
        controlgui.add( control, 'Fast_UpDown' ).min(-10).max(10).step(.001).listen().onChange(function( newValue ) { shipVel.y = control.Fast_UpDown; });
    };

    function addStats3DObject() {  // Initializes Stats3D Object
        stats3D = new Stats();
        stats3D.setMode( 0 );
        stats3D.domElement.style.position = 'absolute';
        stats3D.domElement.style.left = '0px';
        stats3D.domElement.style.top = '0px';
        document.body.appendChild( stats3D.domElement );
        };

    function handleResize() {  // Handles and screen resize
        const w = window.innerWidth;
        camera.aspect = w / window.innerHeight;
        titleLine.style.left = `${w/2 - 360}px`;
        titleLine2.style.left = `${w/2 - 260}px`;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight); 
    };

    //EVENT LISTENERS
    window.addEventListener( "keydown", fKeyDown, false );
    window.addEventListener( "keyup", fKeyUp, false );
    window.addEventListener( "resize", handleResize, false );

    addControlGUIObject();
    addStats3DObject();
};

initialControls();

function fKeyDown(event) {  // Handles when various keys are pressed

    function togglePauseGame() { if ( !pauseGame ) { pauseGame = true; } else if ( pauseGame ) { pauseGame = false; }; };
  
    switch (event.key) {
      case 'ArrowLeft': { controls.changeViewAngle( "left" ); break; };
      case 'ArrowRight': { controls.changeViewAngle( "right" ); break; };
      case 'ArrowUp': { controls.changeViewAngle( "up" ); break; };
      case 'ArrowDown': { controls.changeViewAngle( "down" ); break; };
      case 'N', 'n': { controls.nKeyPressed(); break; };
      case 'P', 'p': { pausedTvalue = t; usedPausedTvalue = false; togglePauseGame(); break; };
      case 'W', 'w': { switchShipSprite( 1 ); shipVel.z += -0.01; viewMode = false; break; };
      case 'S', 's': { switchShipSprite( 2 ); shipVel.z += 0.01; viewMode = false; break; };
      case 'A', 'a': { switchShipSprite( 3 ); shipVel.x += -0.01; viewMode = false; break; }; 
      case 'D', 'd': { switchShipSprite( 4 ); shipVel.x += 0.01;  viewMode = false; break; };
      case 'U', 'u': { switchShipSprite( 5 ); shipVel.y += 0.01; viewMode = false; break; };
      case 'J', 'j': { switchShipSprite( 6 ); shipVel.y += -0.01; viewMode = false; break; };
      case 'R', 'r': { window.location.reload(); break; }
      case 'Z', 'z' : { shipVel.x = 0; shipVel.y = 0; shipVel.z = 0; viewMode = false; break; };
      case ' ': { explosionPressed( new THREE.Vector3( crosshairs.position.x, crosshairs.position.y, crosshairs.position.z ) ); break; };
      } ;
};
    
function fKeyUp(event) {  // Restores variables when keys are not pressed
      switch (event.key) {
          case 'ArrowLeft', 'ArrowRight' : { ViewportAngleLR = 0; break; };
          case 'ArrowUp', 'ArrowDown': { ViewportAngleUD = 0; break; };
          case 'S', 's' : { switchShipSprite( 0 ); break; };
          case 'W', 'w' : { switchShipSprite( 0 ); break; };
          case 'A', 'a' : { switchShipSprite( 0 ); break; };
          case 'D', 'd' : { switchShipSprite( 0 ); break; };
          case 'U', 'u' : { switchShipSprite( 0 ); break; };
          case 'J', 'j' : { switchShipSprite( 0 ); break; };
          };
};

function onMouseDown( event ) {
    const coords = new THREE.Vector2((event.clientX / renderer.domElement.clientWidth)*2-1, -((event.clientY/renderer.domElement.clientHeight)*2-1));
    raycaster.setFromCamera( coords, camera );
    const intersects = raycaster.intersectObjects( scene.children, true );
    
    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        selectedObject.material.color = new THREE.Color( "rgb(235, 252, 3)" );
        previousNumber = number;
        number = selectedObject.number;
        penaltyScored = false;
    };
};  

function switchShipSprite( currentSprite ) {  // Removes previous ship sprite then adds user selection to the scene
    scene.remove( spacecraft[ previousSprite] ); 
    spacecraft[ currentSprite ].position.set( shipPos.x, shipPos.y, shipPos.z );
    scene.add( spacecraft[ currentSprite ] );
    camera.position.set( shipPos.x, shipPos.y + 1, shipPos.z + 4 );
    crosshairs.position.set( shipPos.x, shipPos.y + 1, shipPos.z );
    previousSprite = currentSprite;
};

function updateQuestionBox() {
    if ( newQuest && !pauseQuestions ) {
        const newQuestion = questions[ index ];       
        answer = answers[ index ];
        document.getElementById('question').innerHTML = "Question: " + '<br />' + newQuestion;
        newQuest = false;
        index++;
    };
};

function blastNumber( answer, exploding ) {

    function removeBalls( element ) {
        element.particleGroup.children.forEach((child) => { 
            if (child.number == answer ) {  
                expPos = new THREE.Vector3( child.position.x, child.position.y, child.position.z );
                if (exploding) explosionPressed( expPos );   
                child.material.opacity = 0;
            };
        });
    };
    numberBalls.forEach( (e) => removeBalls( e ) );
};

function correctAnswer( answer ) {
    const levelIndex = scene.level;
    pointsEarned += (levelIndex + 1)*100;
    document.getElementById('points').innerHTML = 'Points earned: ' + pointsEarned;
    document.getElementById('progress').innerHTML += answer.toString() + ' blasted! <br />';
    newQuest = true;
    nextLevelUpdated = false;
    blastNumber( answer, true );
    previousNumber = number;
};

function nextLevel() {  
    document.getElementById('titleLine2').innerHTML = 'Excellent Job! YOU BEAT THE LEVEL ! <br /> Press N for next level or X to exit the game.';
    document.getElementById('progress').innerHTML = 'Progress: <br /> ALL NUMBERS BLASTED!<br />Press N for next level<br />Press X to Exit Game.<br />';
    pauseQuestions = true;
    previousNumber = number;
    number = -9;
    scene.level++;
    document.getElementById('level').innerHTML = 'Level: ' + levels[ scene.level ];
    if (scene.level >= 3) { processGameOver(); };
};

function processGameOver() {
    beginTimeRemaining = false;
    if ( scene.level > 2 ) {
    document.getElementById('titleLine').innerHTML = 'YOU BEAT MATH ATTACK AND SAVED EARTH!';
    document.getElementById('titleLine2').innerHTML = 'Excellent Job! YOU WON THE GAME !';
    document.getElementById('progress').innerHTML = 'Progress: <br /> ALL LEVELS BEAT ! !<br /> Press X to Exit; R to Restart';
    }
    else {
        document.getElementById('titleLine').innerHTML = 'Mission UNSUCCESSFUL...Earth will be invaded...';
        document.getElementById('titleLine2').innerHTML = 'Apparently, more practice at algebra (or flying) is needed.';
        document.getElementById('progress').innerHTML = 'Progress: <br /> Maybe next time!<br /> Press X to Exit; <br />R to Restart';
        };
    gameOver = true; 
};

function explosionPressed( position ) {  // Initiates an explosion (supposed to be when the ship's weapon is fired)
    var pos = position;
    let e = new Explosion( pos );
    e.makeParticles( pos );
    explosions.push(e);
};

var controls = function( ) {  // Encapsulates control functions used for movement, sprite initiation, object rotation/movement, etc. 

    function nKeyPressed( k ) {  // Creates a group of numbered ball sprites and launches each game level if no existing groups
        if (numberBalls.length == 0 ) {
            t = 0; 
            for ( let i = 0; i < 6; i++ ) {
                let e = new NumberBalls;
                e.makeParticles();
                numberBalls.push( e );
            };
            newQuest = true;
            pauseQuestions = false;
            document.getElementById('titleLine').innerHTML = 'MATH ATTACK ! ';
            document.getElementById('progress').innerHTML = 'Progress: <br />';
            document.getElementById('titleLine2').innerHTML = 'Fly to numbers, use mouse to select answer, then blast with spacebar!';
        };
    };

    function updateShipPos( ) {  // Adds the ship's velocity vectors to the ship's position or rotates the camera in veiwMode
        const k = 100;
        shipPos.x = shipPos.x + shipVel.x/k;
        shipPos.y = shipPos.y + shipVel.y/k;
        shipPos.z = shipPos.z + shipVel.z/k;
        if ( !viewMode ) {
            crosshairs.position.set( shipPos.x, shipPos.y + 1, shipPos.z ); 
            camera.position.set( shipPos.x, shipPos.y + 1, shipPos.z + 4 );
        };
        spacecraft[ currentSprite ].position.set( shipPos.x, shipPos.y, shipPos.z );
   
        var string = 'For(+) Rev(-): ' + (-shipVel.z).toFixed(3).toString() + '<br />Lft(-) Rgt(+): ' + shipVel.x.toFixed(3).toString() + '<br />Up(+) Dwn(-): ' + shipVel.y.toFixed(3).toString();
        speedIndicator.innerHTML = string;
    };

    function rotateOrWalkObjects() {  //  Rotating the dodecahedron, cube, Earth; revolving the moon
        dodecahedron.rotation.x += 0.01; 
        dodecahedron.rotation.y += 0.01;
        cube.rotation.x += 0.003;
        cube.rotation.y += 0.003;
        earth.rotation.y += 0.0008
        // Revolves the moon around the Earth
        var perp = new THREE.Vector3((earth.position.z-moon.position.z), 0, (moon.position.x-earth.position.x));
        var dir = normalizeVector( perp );
        moon.position.x += -dir.x/100;
        moon.position.z += -dir.z/100;

        const ri = Math.random();
        if (ri < 0.17 ) { cube.position.x += 0.01 }
            else if (ri < .33) { cube.position.x -= 0.01 }
            else {  
                if (ri < .5 ) { cube.position.y += 0.01 }
                    else if (ri < .67 ) { cube.position.y -= 0.01 }
                    else { 
                        if (ri < .83) { cube.position.z += 0.01 }
                        else { cube.position.z -= 0.01 }
                    };
                };
    };
  
    function updateCameraPosDir() {  // Updates the camera's position and direction in viewMode
        camera.position.set( shipPos.x, shipPos.y, shipPos.z );
        var distance = 3;
        cameraDir = new THREE.Vector3( distance * Math.sin( phi ), distance * Math.sin( theta ) + 1, distance * Math.cos( phi ) );               
        camera.lookAt( new THREE.Vector3( shipPos.x + cameraDir.x, shipPos.y + cameraDir.y, shipPos.z + cameraDir.z ) );
        crosshairs.position.set( shipPos.x + cameraDir.x, shipPos.y + cameraDir.y, shipPos.z + cameraDir.z );
        crosshairs.scale.set( 1, 1, 1 );
    };

    function changeViewAngle( direction ) {  // Camera Direction Changed ( using ViewportAngleLR or ViewportAngleUD ) when in viewMode
        viewMode = true;
        if ( direction == "left" ) ViewportAngleLR = -1;
        if ( direction == "right" ) ViewportAngleLR = 1; 
        if ( direction == "up" ) ViewportAngleUD = 1;
        if ( direction == "down" ) ViewportAngleUD = -1;

        //Create/update variables to update camera direction and position
        theta += ViewportAngleUD * AngleIncrement;
        phi -= ViewportAngleLR * AngleIncrement;
        updateCameraPosDir();

    };

    return { nKeyPressed, updateShipPos, rotateOrWalkObjects, updateCameraPosDir, changeViewAngle };

}();    // End of controls function

function formatTime(t) {
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

function processTimeRemaining( t ) {
    timeRemaining = timeAllotted - t/1000;
    if ( timeRemaining < 0 ) { 
        document.getElementById( 'timeRem' ).innerHTML = 'Time Out - Mission <br /> Unsuccessful';
        processGameOver();
        }
    else {
        if ( Math.floor( 10*timeRemaining ) == 10*Math.floor( timeRemaining )  ) {
            document.getElementById( 'timeRem' ).innerHTML = 'Time Remaining: <br />   ' + formatTime( Math.floor( timeRemaining ) );
        };
    };
};

function animate( t = 0 ) {  // Main animation function calling various control or intiation methods and rendering the scene

    if (( !pauseGame ) && ( !gameOver )) {

        if (!usedPausedTvalue) { t = pausedTvalue; usedPausedTvalue = true; };
        processTimeRemaining( t );

        controls.rotateOrWalkObjects(); // Rotates or revolves objects, randomly walks the cube
        controls.updateShipPos();  // Updates the ship's position based on current ship velocity

        if ( viewMode ) { controls.updateCameraPosDir(); }
        else  {
            camera.position.set( shipPos.x, shipPos.y +1, shipPos.z + 4 );
            crosshairs.position.set( shipPos.x, shipPos.y + 1, shipPos.z );
            camera.lookAt( shipPos.x, shipPos.y + 1, shipPos.z );
        };

        if (explosions.length > 0 ) { explosions.forEach( (e) => e.update(expPos) ); };   // updates each explosion particle
        if (numberBalls.length > 0 ) { numberBalls.forEach( (e) => e.update(t) ); };   // updates each explosion particle

        if (explosions.length > 0) {  // If explosion is detected while correct answer number is selected, call to correctAnswer()
            if ( answer == number ) { penaltyScored = true; correctAnswer( number ); }  // When penaltyScored is true, penalty can't 
            else if ( (!penaltyScored) && (answer != previousNumber) ) {   // be issued. This avoids giving a penalty for blast 
                pointsEarned = pointsEarned - 50; penaltyScored = true;    // explosions while the previous number is still selected 
            }; };

        if ( !pauseQuestions ) updateQuestionBox();
        
        if ( !nextLevelUpdated && ( answers[ index - 1 ] == 99 ) ) { nextLevelUpdated = true; nextLevel(); };

    };
        
    requestAnimationFrame( animate );
    stats3D.update();
    renderer.render( scene, camera );

};

animate();
