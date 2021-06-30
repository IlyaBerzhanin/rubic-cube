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
      let cubieRelativesAndParentsToRotate = {};

      if (pickedCubieItem) {
        let actionsWithCoordinates = {
          x: () => {
            console.log("xxx");
            cubieRelativesAndParentsToRotate.horizontalRelatives =
              this.cubies.filter(
                (cubie) => cubie.box.position.y === pickedCubieItem.position.y
              );
            cubieRelativesAndParentsToRotate.horizontalParent =
              cubieRelativesAndParentsToRotate.horizontalRelatives.find(
                (cubie) => {
                  if (cubie.box.position.x === 0 && cubie.box.position.z === 0)
                    return cubie;
                }
              );
            cubieRelativesAndParentsToRotate.horizontalPlaneToRotateIn = "y";

            cubieRelativesAndParentsToRotate.verticalRelatives =
              this.cubies.filter(
                (cubie) => cubie.box.position.z === pickedCubieItem.position.z
              );
            cubieRelativesAndParentsToRotate.verticalParent =
              cubieRelativesAndParentsToRotate.verticalRelatives.find(
                (cubie) => {
                  if (cubie.box.position.x === 0 && cubie.box.position.y === 0)
                    return cubie;
                }
              );
            cubieRelativesAndParentsToRotate.verticalPlaneToRotateIn = "z";
          },

          y: () => {
            console.log("yyy");
            cubieRelativesAndParentsToRotate.horizontalRelatives =
              this.cubies.filter(
                (cubie) => cubie.box.position.z === pickedCubieItem.position.z
              );
            cubieRelativesAndParentsToRotate.horizontalParent =
              cubieRelativesAndParentsToRotate.horizontalRelatives.find(
                (cubie) => {
                  if (cubie.box.position.x === 0 && cubie.box.position.y === 0)
                    return cubie;
                }
              );
            cubieRelativesAndParentsToRotate.horizontalPlaneToRotateIn = "z";

            cubieRelativesAndParentsToRotate.verticalRelatives =
              this.cubies.filter(
                (cubie) => cubie.box.position.x === pickedCubieItem.position.x
              );
            cubieRelativesAndParentsToRotate.verticalParent =
              cubieRelativesAndParentsToRotate.verticalRelatives.find(
                (cubie) => {
                  if (cubie.box.position.z === 0 && cubie.box.position.y === 0)
                    return cubie;
                }
              );
            cubieRelativesAndParentsToRotate.verticalPlaneToRotateIn = "x";
          },

          z: () => {
            console.log("zzz");
            cubieRelativesAndParentsToRotate.horizontalRelatives =
              this.cubies.filter(
                (cubie) => cubie.box.position.y === pickedCubieItem.position.y
              );
            cubieRelativesAndParentsToRotate.horizontalParent =
              cubieRelativesAndParentsToRotate.horizontalRelatives.find(
                (cubie) => {
                  if (cubie.box.position.x === 0 && cubie.box.position.z === 0)
                    return cubie;
                }
              );
            cubieRelativesAndParentsToRotate.horizontalPlaneToRotateIn = "y";

            cubieRelativesAndParentsToRotate.verticalRelatives =
              this.cubies.filter(
                (cubie) => cubie.box.position.x === pickedCubieItem.position.x
              );
            cubieRelativesAndParentsToRotate.verticalParent =
              cubieRelativesAndParentsToRotate.verticalRelatives.find(
                (cubie) => {
                  if (cubie.box.position.z === 0 && cubie.box.position.y === 0)
                    return cubie;
                }
              );

            cubieRelativesAndParentsToRotate.verticalPlaneToRotateIn = "x";
          },
        };

        actionsWithCoordinates[maxPickedPointCoordinateName]();
      }

      return cubieRelativesAndParentsToRotate;
    }

    moveSides() {
      let horizontalMove = false;
      let verticalMove = false;
      let isSideChosen = false;

      let that = this;
      let horizontalRelatives;
      let verticalRelatives;
      let horizontalParent;
      let verticalParent;

      scene.onPointerDown = function () {
        console.log(BABYLON.Tools.ToRadians(90));
        let pickResult = scene.pick(scene.pointerX, scene.pointerY);
        let pickedCubie = pickResult.pickedMesh;
        let pickedPoint = pickResult.pickedPoint;

        if (pickResult.hit) {
          pickedCubie.material.alpha = 1;

          camera.inputs.attached.pointers.detachControl();

          let relativesAndParents = that.findPickedCubieRelatives(
            pickedCubie,
            that.findMaxCoordinateOfPickedCubie(pickedPoint)
          );

          horizontalRelatives = relativesAndParents.horizontalRelatives;
          horizontalParent = relativesAndParents.horizontalParent;

          verticalRelatives = relativesAndParents.verticalRelatives;
          verticalParent = relativesAndParents.verticalParent;


          scene.onPointerMove = function (event) {
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
            //pickedCubie.parent = null
            pickedCubie.material.alpha = 0.5;
            camera.inputs.attachInput(camera.inputs.attached.pointers);
            scene.onPointerMove = null;
            scene.onPointerUp = null;
            scene.onPointerDown = null;

            if (horizontalMove) {

              horizontalRelatives.forEach((rel) => {
                if (
                  JSON.stringify(rel.box.position) !==
                  JSON.stringify(horizontalParent.box.position)
                ) {
                  console.log(rel.box.position);
                  // rel.box.parent = verticalParent.box;
                  rel.box.setParent(horizontalParent.box);
                }
              });

              const xSlide = new BABYLON.Animation(
                "xSlide",
                `rotation.${relativesAndParents.horizontalPlaneToRotateIn}`,
                1000 / 60,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
              );

              let keyFrames = [];

              keyFrames.push({
                frame: 0,
                value:
                  horizontalParent.box.rotation[
                    relativesAndParents.horizontalPlaneToRotateIn
                  ],
              });

              keyFrames.push({
                frame: 20,
                value:
                  horizontalParent.box.rotation[
                    relativesAndParents.horizontalPlaneToRotateIn
                  ] - BABYLON.Tools.ToRadians(90),
              });

              xSlide.setKeys(keyFrames);

              horizontalParent.box.animations.push(xSlide);
              const myAnim = scene.beginAnimation(horizontalParent.box, 0, 20);
              myAnim.onAnimationEnd = function () {
                console.log("end");
                // scene.stopAnimation(verticalParent.box);
                // verticalParent.box.animations = new Array();
                horizontalRelatives.forEach((relative) => {
                  relative.box.position.x =
                    Math.round(relative.box.position.x * 10) / 10;
                  relative.box.position.y =
                    Math.round(relative.box.position.y * 10) / 10;
                  relative.box.position.z =
                    Math.round(relative.box.position.z * 10) / 10;
                  
                  relative.box.position._isDirty = false;
                  
                  console.log('after', relative.box.position._isDirty);
                  // relative.box.parent = null;
                  relative.box.setParent(null);
                });
              };
            }

            if (verticalMove) {
              verticalRelatives.forEach((rel) => {
                if (
                  JSON.stringify(rel.box.position) !==
                  JSON.stringify(verticalParent.box.position)
                ) {
                  //  console.log(rel.box.position);
                  // rel.box.parent = verticalParent.box;
                  rel.box.setParent(verticalParent.box);
                }
              });

              const xSlide = new BABYLON.Animation(
                "xSlide",
                `rotation.${relativesAndParents.verticalPlaneToRotateIn}`,
                1000 / 60,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
              );

              let keyFrames = [];

              keyFrames.push({
                frame: 0,
                value:
                  verticalParent.box.rotation[
                    relativesAndParents.verticalPlaneToRotateIn
                  ],
              });

              keyFrames.push({
                frame: 20,
                value:
                  verticalParent.box.rotation[
                    relativesAndParents.verticalPlaneToRotateIn
                  ] - BABYLON.Tools.ToRadians(90),
              });

              xSlide.setKeys(keyFrames);

              verticalParent.box.animations.push(xSlide);
              const myAnim = scene.beginAnimation(verticalParent.box, 0, 20);
              myAnim.onAnimationEnd = function () {
                console.log("end");
                // scene.stopAnimation(verticalParent.box);
                // verticalParent.box.animations = new Array();
                verticalRelatives.forEach((relative) => {
                  //relative.box.position = relative.box.getAbsolutePosition();

                  // relative.box.parent = null;
                  relative.box.setParent(null);
                });
              };
            }

            horizontalMove = false;
            verticalMove = false;

            that.moveSides();
          };
        }
      };
    }
  }

  const MainCubeInterface = new Interface();
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
