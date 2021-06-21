const createScene = () => {
  const scene = new BABYLON.Scene(engine);

  /**** Set camera and light *****/
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    10,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0)
  );
  const light2 = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(-1, 1, 0)
  );

  //--------------------------------------------------------------------------------- my code here

  class ParentBox {
    constructor(options) {
      const mat = new BABYLON.StandardMaterial("mat", scene);
      mat.alpha = 0.9;
      this.selected = false;

      this.box = BABYLON.MeshBuilder.CreateBox(
        "box",
        {
          size: 0.5,
          faceColors: options.sideColors,
        },
        scene
      );

      if (options.sideColors) {
        this.box.material = mat;
      }

      this.box.position.x = options.x;
      this.box.position.y = options.y;
      this.box.position.z = options.z;
    }
  }

  class Interface {
    constructor() {
      this.mainCubeSideColors = {
        frontColor: BABYLON.Color3.Blue(),
        backColor: BABYLON.Color3.Teal(),
        leftColor: BABYLON.Color3.Red(),
        rightColor: BABYLON.Color3.Purple(),
        topColor: BABYLON.Color3.Green(),
        bottomColor: BABYLON.Color3.Yellow(),
      };

      this.helpersClasses = {
        parentBoxClass: ParentBox,
      };

      this.cubies = [];

      //colors Scheme
      // 0 ------------- back
      // 1 ---------------- front
      // 2 ----------------- right
      // 3 ---------------- left
      // 4 --------------- top
      // 5 -------------- bottom

      this.cubieSideColors = [];
      this.cubieSideColors[0] = BABYLON.Color3.Black();
      this.cubieSideColors[1] = BABYLON.Color3.Black();
      this.cubieSideColors[2] = BABYLON.Color3.Black();
      this.cubieSideColors[3] = BABYLON.Color3.Black();
      this.cubieSideColors[4] = BABYLON.Color3.Black();
      this.cubieSideColors[5] = BABYLON.Color3.Black();

      //the cube will be created with 3 parts of 9 small cubes in depth
      //   this.cubeEachPartScheme = [
      //     [0,0,0],
      //     [0,0,0],
      //     [0,0,0]
      // ]
    }

    makeCubeFromCubies() {
      for (let z = -0.5; z <= 0.5; z += 0.5) {
        for (let y = -0.5; y <= 0.5; y += 0.5) {
          for (let x = -0.5; x <= 0.5; x += 0.5) {
            let currentCubieSideColors = [...this.cubieSideColors];

            switch (x) {
              case -0.5:
                currentCubieSideColors[3] = this.mainCubeSideColors.leftColor;
                break;
              case 0.5:
                currentCubieSideColors[2] = this.mainCubeSideColors.rightColor;
                break;
            }

            switch (y) {
              case -0.5:
                currentCubieSideColors[5] = this.mainCubeSideColors.bottomColor;
                break;
              case 0.5:
                currentCubieSideColors[4] = this.mainCubeSideColors.topColor;
                break;
            }

            switch (z) {
              case -0.5:
                currentCubieSideColors[1] = this.mainCubeSideColors.frontColor;
                break;
              case 0.5:
                currentCubieSideColors[0] = this.mainCubeSideColors.backColor;
                break;
            }

            const cubie = new this.helpersClasses.parentBoxClass({
              x: x,
              y: y,
              z: z,
              sideColors: currentCubieSideColors,
            });

            this.cubies.push(cubie);
          }
        }
      }
    }

    moveWhilePickingDown(event) {
      console.log(Date.now());
    }

    moveSides() {
      let move = false

      scene.onPointerDown = function () {
        
        let pickResult = scene.pick(scene.pointerX, scene.pointerY)
        let pickedCubie = pickResult.pickedMesh
        let normal = pickResult.getNormal()
        console.log(camera);


        if(pickResult.hit) {
          console.log(normal.x);
          camera.inputs.attached.pointers.detachControl();

          scene.onPointerMove = function(event) {

            pickedCubie.rotation.x = event.offsetX / 100
            pickedCubie.rotation.y = event.offsetY / 100
           }
   
           scene.onPointerUp = function() {
            camera.inputs.attachInput(camera.inputs.attached.pointers);
             scene.onPointerMove = null
             scene.onPointerUp = null
                    
           }
        }

        
    };
      
    }
  }

  // const centralParentBox = new ParentBox({
  //   x: 0,
  //   y: 0,
  //   z: 0,
  // });
  // const frontParentBox = new ParentBox({
  //   x: 0,
  //   y: 0,
  //   z: -0.5,
  // });
  // const backParentBox = new ParentBox({
  //   x: 0,
  //   y: 0,
  //   z: 0.5,
  // });
  // const leftParentBox = new ParentBox({
  //   x: -0.5,
  //   y: 0,
  //   z: 0,
  // });
  // const rightParentBox = new ParentBox({
  //   x: 0.5,
  //   y: 0,
  //   z: 0,
  // });
  // const topParentBox = new ParentBox({
  //   x: 0,
  //   y: 0.5,
  //   z: 0,
  // });
  // const bottomParentBox = new ParentBox({
  //   x: 0,
  //   y: -0.5,
  //   z: 0,
  // });

  const MainCubeInterface = new Interface();
  MainCubeInterface.makeCubeFromCubies();
  MainCubeInterface.moveSides();

  // const boxMat = new BABYLON.StandardMaterial("boxMat");
  // boxMat.diffuseColor = new BABYLON.Color3(0, 1, 8);
  // centralParentBox.box.material = boxMat;

  return scene;
};

//----------------------------------------------------------------------------------------------

const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true, { stencil: true }); // Generate the BABYLON 3D engine

// Add your code here matching the playground format

const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});
