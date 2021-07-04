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
      mat.alpha = 0.5;

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
    constructor(boxClass) {
      this.mainCubeSideColors = {
        frontColor: BABYLON.Color3.Blue(),
        backColor: BABYLON.Color3.Teal(),
        leftColor: BABYLON.Color3.Red(),
        rightColor: BABYLON.Color3.Purple(),
        topColor: BABYLON.Color3.Green(),
        bottomColor: BABYLON.Color3.Yellow(),
      };

      this.helpersClasses = {
        parentBoxClass: boxClass,
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

    findMaxCoordinateOfPickedCubie(pickedPointObject) {
      let pickedPointObjectCoordinates = {
        x: pickedPointObject.x,
        y: pickedPointObject.y,
        z: pickedPointObject.z,
      };

      for (let key in pickedPointObjectCoordinates) {
        if (
          Math.abs(pickedPointObjectCoordinates[key]) ===
          Math.max.apply(
            null,
            Object.values(pickedPointObjectCoordinates).map((coord) =>
              Math.abs(coord)
            )
          )
        ) {
          return key;
        }
      }
    }

    findPickedCubieRelatives(pickedCubieItem, maxPickedPointCoordinateName) {
      let horizontalPlaneToRotateIn;
      let verticalPlaneToRotateIn;
      let horizontalRelatives;
      let verticalRelatives;
      let horizontalParent;
      let verticalParent;

      if (pickedCubieItem) {
        let actionsWithCoordinates = {
          x: () => {
            console.log("xxx");
            horizontalRelatives = this.cubies.filter(
              (cubie) => cubie.box.position.y === pickedCubieItem.position.y
            );

            horizontalParent = new BABYLON.TransformNode("root");
            horizontalParent.position.y = pickedCubieItem.position.y;
            horizontalParent.position.x = 0;
            horizontalParent.position.z = 0;

            horizontalPlaneToRotateIn = "y";

            verticalRelatives = this.cubies.filter(
              (cubie) => cubie.box.position.z === pickedCubieItem.position.z
            );

            verticalParent = new BABYLON.TransformNode("root");
            verticalParent.position.z = pickedCubieItem.position.z;
            verticalParent.position.y = 0;
            verticalParent.position.x = 0;

            verticalPlaneToRotateIn = "z";
          },

          y: () => {
            console.log("yyy");
            horizontalRelatives = this.cubies.filter(
              (cubie) => cubie.box.position.z === pickedCubieItem.position.z
            );

            horizontalParent = new BABYLON.TransformNode("root");
            horizontalParent.position.z = pickedCubieItem.position.z;
            horizontalParent.position.x = 0;
            horizontalParent.position.y = 0;

            horizontalPlaneToRotateIn = "z";

            verticalRelatives = this.cubies.filter(
              (cubie) => cubie.box.position.x === pickedCubieItem.position.x
            );

            verticalParent = new BABYLON.TransformNode("root");
            verticalParent.position.x = pickedCubieItem.position.x;
            verticalParent.position.y = 0;
            verticalParent.position.z = 0;

            verticalPlaneToRotateIn = "x";
          },

          z: () => {
            console.log("zzz");
            horizontalRelatives = this.cubies.filter(
              (cubie) => cubie.box.position.y === pickedCubieItem.position.y
            );

            horizontalParent = new BABYLON.TransformNode("root");
            horizontalParent.position.y = pickedCubieItem.position.y;
            horizontalParent.position.x = 0;
            horizontalParent.position.z = 0;

            horizontalPlaneToRotateIn = "y";

            verticalRelatives = this.cubies.filter(
              (cubie) => cubie.box.position.x === pickedCubieItem.position.x
            );

            verticalParent = new BABYLON.TransformNode("root");
            verticalParent.position.x = pickedCubieItem.position.x;
            verticalParent.position.y = 0;
            verticalParent.position.z = 0;

            verticalPlaneToRotateIn = "x";
          },
        };

        actionsWithCoordinates[maxPickedPointCoordinateName]();
      }

      return {
        horizontalPlaneToRotateIn: horizontalPlaneToRotateIn,
        verticalPlaneToRotateIn: verticalPlaneToRotateIn,
        horizontalRelatives: horizontalRelatives,
        verticalRelatives: verticalRelatives,
        horizontalParent: horizontalParent,
        verticalParent: verticalParent,
      };
    }

    animateRotation(parent, planeToRotateIn, callback) {
        const xSlide = new BABYLON.Animation(
          "xSlide",
          `rotation.${planeToRotateIn}`,
          1000 / 60,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        let keyFrames = [];

        keyFrames.push({
          frame: 0,
          value: parent.rotation[planeToRotateIn],
        });

        keyFrames.push({
          frame: 20,
          value:
            parent.rotation[planeToRotateIn] -
            BABYLON.Tools.ToRadians(90),
        });

        xSlide.setKeys(keyFrames);

        parent.animations.push(xSlide);
        const myAnim = scene.beginAnimation(parent, 0, 20);
        myAnim.onAnimationEnd = function () {
          callback()
        };
    }

    moveSides() {
      let horizontalMove = false;
      let verticalMove = false;
      let isSideChosen = false;
      let plusOrMinusDegrees

      let that = this;
      let horizontalRelatives;
      let verticalRelatives;
      let horizontalParent;
      let verticalParent;
      let horizontalPlaneToRotateIn;
      let verticalPlaneToRotateIn;

      scene.onPointerDown = function () {
        let pickResult = scene.pick(scene.pointerX, scene.pointerY);
        let pickedCubie = pickResult.pickedMesh;
        let pickedPoint = pickResult.pickedPoint;
        console.log(pickResult);

        if (pickResult.hit) {
          pickedCubie.material.alpha = 1;

          camera.inputs.attached.pointers.detachControl();

          let relativesAndParents = that.findPickedCubieRelatives(
            pickedCubie,
            that.findMaxCoordinateOfPickedCubie(pickedPoint)
          );

          horizontalRelatives = relativesAndParents.horizontalRelatives;
          horizontalParent = relativesAndParents.horizontalParent;
          horizontalPlaneToRotateIn = relativesAndParents.horizontalPlaneToRotateIn;

          verticalRelatives = relativesAndParents.verticalRelatives;
          verticalParent = relativesAndParents.verticalParent;
          verticalPlaneToRotateIn = relativesAndParents.verticalPlaneToRotateIn;

          scene.onPointerMove = function (event) {
            console.log(event);
            if (
              Math.abs(event.movementX) > Math.abs(event.movementY) &&
              !verticalMove
            ) {
              if (!isSideChosen) {
                isSideChosen = true;
                horizontalMove = true;
              }
            } else if (
              Math.abs(event.movementX) < Math.abs(event.movementY) &&
              !horizontalMove
            ) {
              if (!isSideChosen) {
                isSideChosen = true;
                verticalMove = true;
              }
            }
          };

          scene.onPointerUp = function () {
            pickedCubie.material.alpha = 0.5;
            camera.inputs.attachInput(camera.inputs.attached.pointers);
            scene.onPointerMove = null;
            scene.onPointerUp = null;
            scene.onPointerDown = null;

            if (horizontalMove) {
              horizontalRelatives.forEach((relative) => relative.box.setParent(horizontalParent));

              that.animateRotation(horizontalParent, horizontalPlaneToRotateIn, () => {
                 horizontalRelatives.forEach((relative) => relative.box.setParent(null));
                horizontalParent.dispose();
                horizontalMove = false;
              })
            }

            if (verticalMove) {
              verticalRelatives.forEach((relative) => relative.box.setParent(verticalParent));

              that.animateRotation(verticalParent, verticalPlaneToRotateIn, () => {
                  verticalRelatives.forEach((relative) => relative.box.setParent(null));
                verticalParent.dispose();
                verticalMove = false;
              })
            }

            setTimeout(() => {
              that.moveSides();
              console.log("after picked ", pickedCubie.getAbsolutePosition());
            }, 1500);
          };
        }
      };
    }
  }

  const MainCubeInterface = new Interface(ParentBox);
  MainCubeInterface.makeCubeFromCubies();
  MainCubeInterface.moveSides();

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
