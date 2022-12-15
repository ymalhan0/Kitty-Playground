import * as THREE from './lib/three.module.js';
import { OrbitControls } from './lib/OrbitControls.js';
import { OBJLoader } from './lib/OBJLoader.js';
import { MTLLoader } from './lib/MTLLoader.js';

// import * as THREE from './three.js-master/build/three.module.js';
// import { OrbitControls } from './three.js-master/examples/jsm/controls/OrbitControls.js';
// import { OBJLoader } from './three.js-master/examples/jsm/loaders/OBJLoader.js';
// import { MTLLoader } from './three.js-master/examples/jsm/loaders/MTLLoader.js';
//import { MtlObjBridge } from './lib/MtlObjBridge.js';

function main() {
  // SETUP
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;


  // CAMERA ----------------------------------------------------
  let camera;
  initCamera();
  //function updateCamera() { camera.updateProjectionMatrix(); }
  let controls = new OrbitControls(camera, canvas);

  const scene = new THREE.Scene();
  function initCamera() {
    const fov = 80;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 12, 30);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 12, 0);
    controls.update();
  }


  // LIGHTS ----------------------------------------------------------------
  {
    const color = 0xFFFFFF;
    const intensity = 0.3;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
  }

  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 0.4;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(-8, 22, -15);
    light.castShadow = true;
    scene.add(light);

  }

  {
    const color = 0xFFEAD0;
    const intensity = 0.2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);

    scene.add(light);
    scene.add(light.target);
  }

  { // GROUND PLANE ---------------------------------------------------------
    const planeSize = 80;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('./sand.jpg');
    texture.encoding = THREE.sRGBEncoding;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  // SKYBOX -------------------------------------------------------------
  {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      './background/wall2.png',
      './background/wall4.png',
      './background/cieling.png',
      './background/floor.png',
      './background/wall3.png',
      './background/wall1.png',
    ]);
    scene.background = texture;
  }

  // FOG ----------------------------------------------------------------
  {
    const color = 0xFFEAD0;
    const near = 0;
    const far = 80;
    scene.fog = new THREE.Fog(color, near, far);
  }

  { // LOAD CAT ---------------------------------------------------------

    const mtlLoader = new MTLLoader();
    mtlLoader.load('./Cat/Mesh_Cat.mtl', (mtl) => {
      mtl.preload();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);

      objLoader.load('./Cat/Mesh_Cat.obj', (root) => {
        root.traverse(function (obj) {
          if (obj.isMesh) {
            obj.receiveShadow = true;
            obj.castShadow = true;
            obj.material.color.set(0xffffff);
          }
        });
        root.scale.set(.2, .2, .2);
        root.position.set(0, 7.2, -2);
        scene.add(root);
      });
    });
  }
  makeLabel(400, 100, 'Jocelyn', [0, 7.2, 3]);

  { // LOAD KITTEN ---------------------------------------------------------

    const mtlLoader = new MTLLoader();
    mtlLoader.load('./Kitten/Mesh_Kitten.mtl', (mtl) => {
      mtl.preload();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);

      objLoader.load('./Kitten/Mesh_Kitten.obj', (root) => {
        root.traverse(function (obj) {
          if (obj.isMesh) {
            obj.receiveShadow = true;
            obj.castShadow = true;
            obj.material.color.set(0xffffff);
          }
        });
        root.rotation.y = 30;
        root.scale.set(.2, .2, .2);
        root.position.set(10, 4.2, 4);
        scene.add(root);
      });
    });
  }

  makeLabel(400, 100, 'Jace', [10, 4, 4]);

  { // CAT TREE ---------------------------------------------------------

    const mtlLoader = new MTLLoader();
    mtlLoader.load('./CatTree/SIEFRING_CatTree_LP.mtl', (mtl) => {
      mtl.preload();
      for (const material of Object.values(mtl.materials)) {
        material.side = THREE.DoubleSide;
      }
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);

      objLoader.load('./CatTree/SIEFRING_CatTree_LP.obj', (root) => {
        root.traverse(function (obj) {
          if (obj.isMesh) {
            obj.receiveShadow = true;
            obj.castShadow = true;
            obj.material.color.set(0xffffff);
          }
        });
        root.rotation.y = -15;
        root.scale.set(3, 3, 3);
        root.position.set(19, 0.2, 20);
        scene.add(root);
      });
    });
  }


  // CUBE SHAPES (8) ---------------------------------------------------------

  const cubes = [];  // just an array we can use to rotate the cubes
  const boxWidth = 7;
  const boxHeight = 7;
  const boxDepth = 7;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const loadManager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader();

  const materials = [
    new THREE.MeshPhongMaterial({ map: loader.load('./dice/d1.png') }),
    new THREE.MeshPhongMaterial({ map: loader.load('./dice/d2.png') }),
    new THREE.MeshPhongMaterial({ map: loader.load('./dice/d3.png') }),
    new THREE.MeshPhongMaterial({ map: loader.load('./dice/d4.png') }),
    new THREE.MeshPhongMaterial({ map: loader.load('./dice/d5.png') }),
    new THREE.MeshPhongMaterial({ map: loader.load('./dice/d6.png') }),
  ];

  const cube = new THREE.Mesh(geometry, materials);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(17, 3.5, -8);
  cube.rotation.y = 15;

  scene.add(cube);
  // cubes.push(cube);  // add to our list of cubes to rotate
  // box stack 
  {
    const boxWidth1 = 10;
    const boxHeight1 = 10;
    const boxDepth1 = 10;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const material1 = new THREE.MeshPhongMaterial({ color: 0x1A535C });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    cube1.position.set(15, 5, -20);
    scene.add(cube1);
  }

  {
    const boxWidth1 = 10;
    const boxHeight1 = 10;
    const boxDepth1 = 10;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const material1 = new THREE.MeshPhongMaterial({ color: 0x4ECDC4 });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    cube1.position.set(20, 15, -20);
    scene.add(cube1);
  }

  {
    const boxWidth1 = 10;
    const boxHeight1 = 10;
    const boxDepth1 = 10;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const material1 = new THREE.MeshPhongMaterial({ color: 0xFFEAD0 });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    cube1.position.set(18, 25, -20);
    scene.add(cube1);
  }
  // back wall
  {
    const boxWidth1 = 80;
    const boxHeight1 = 5;
    const boxDepth1 = 5;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const loader1 = new THREE.TextureLoader();
    const material1 = new THREE.MeshPhongMaterial({ map: loader1.load('./stone.jpg') });
    const cube1 = new THREE.Mesh(geometry1, material1);

    cube1.position.set(0, 2.5, -40);
    scene.add(cube1);
  }
  // left wall
  {
    const boxWidth1 = 80;
    const boxHeight1 = 5;
    const boxDepth1 = 5;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const loader1 = new THREE.TextureLoader();
    const material1 = new THREE.MeshPhongMaterial({ map: loader1.load('./stone.jpg') });
    const cube1 = new THREE.Mesh(geometry1, material1);

    cube1.position.set(-38, 2.5, 0);
    cube1.rotation.y = 4.7;
    scene.add(cube1);
  }
  // right wall
  {
    const boxWidth1 = 80;
    const boxHeight1 = 5;
    const boxDepth1 = 5;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const loader1 = new THREE.TextureLoader();
    const material1 = new THREE.MeshPhongMaterial({ map: loader1.load('./stone.jpg') });
    const cube1 = new THREE.Mesh(geometry1, material1);

    cube1.position.set(37, 2.5, 0);
    cube1.rotation.y = 4.7;
    scene.add(cube1);
  }
  // front wall
  {
    const boxWidth1 = 80;
    const boxHeight1 = 5;
    const boxDepth1 = 5;
    const geometry1 = new THREE.BoxGeometry(boxWidth1, boxHeight1, boxDepth1);
    const loader1 = new THREE.TextureLoader();
    const material1 = new THREE.MeshPhongMaterial({ map: loader1.load('./stone.jpg') });
    const cube1 = new THREE.Mesh(geometry1, material1);

    cube1.position.set(-1, 2.5, 40);
    scene.add(cube1);
  }


  // SPHERE SHAPES (11) -------------------------------------------------------
  {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const numSpheres = 10;
    for (let i = 0; i < numSpheres; ++i) {
      const sphereMat = new THREE.MeshPhongMaterial();
      sphereMat.color.setHSL(i * .3, 1, 0.3);
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(-sphereRadius - 18, sphereRadius, i * sphereRadius - 12);
      scene.add(mesh);
    }
  }

  {
    const sphereRadius = 1.5;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);

    const loader1 = new THREE.TextureLoader();
    const sphereMat = new THREE.MeshPhongMaterial({ map: loader1.load('./stone.jpg') });

    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(5, 1.5, 5);
    scene.add(mesh);
  }

  // OTHER SHAPES (4)  ----------------------------------------------------------------
  {
    const geometry1 = new THREE.IcosahedronGeometry(2.3);
    const loader1 = new THREE.TextureLoader();
    const material1 = new THREE.MeshPhongMaterial({ map: loader1.load('./fire.jpg') });
    const cube1 = new THREE.Mesh(geometry1, material1);

    cube1.position.set(-8, 18, -15);
    cubes.push(cube1);
    scene.add(cube1);
  }
  {
    const geometry1 = new THREE.CylinderGeometry(1, 1, 15, 20);
    const material1 = new THREE.MeshPhongMaterial({ color: 0xF87666 });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    cube1.position.set(-8, 7.5, -15);
    scene.add(cube1);
  }
  // cat tree cyl
  {
    const geometry1 = new THREE.CylinderGeometry(0.3, 0.3, 4, 20);
    const material1 = new THREE.MeshPhongMaterial({ color: 0xCCD5AE });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.position.set(17, 18, 25.5);
    scene.add(cube1);
  }
  {
    const geometry1 = new THREE.IcosahedronGeometry(1);
    const material1 = new THREE.MeshPhongMaterial({ color: 0xDD1155 });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.position.set(17, 15.5, 25.5);
    cubes.push(cube1);
    scene.add(cube1);
  }

  {
    const geometry1 = new THREE.TetrahedronGeometry(2);
    const material1 = new THREE.MeshPhongMaterial({ color: 0x5A0B4D });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    cube1.position.set(-5, 2, 25.5);
    cube1.rotation.y = 25;
    scene.add(cube1);
  }

  {
    const geometry1 = new THREE.OctahedronGeometry(2);
    const material1 = new THREE.MeshPhongMaterial({ color: 0x6E0E0A });
    const cube1 = new THREE.Mesh(geometry1, material1);
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    cube1.position.set(-8, 2, 18.5);
    cube1.rotation.y = 15;
    scene.add(cube1);
  }

  // BILLBOARDS --------------------------------------------------------------------
  function makeLabel(labelWidth, size, name, posxyz) {
    const canvas = makeLabelCanvas(labelWidth, size, name);
    const texture = new THREE.CanvasTexture(canvas);

    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const labelMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    });

    const root = new THREE.Object3D();

    const labelBaseScale = 0.01;
    const label = new THREE.Sprite(labelMaterial);
    root.add(label);
    label.position.x = posxyz[0];
    label.position.y = posxyz[1] + 4;
    label.position.z = posxyz[2];

    label.scale.x = canvas.width * labelBaseScale;
    label.scale.y = canvas.height * labelBaseScale;

    scene.add(root);
    return root;
  }

  function makeLabelCanvas(baseWidth, size, name) {
    const borderSize = 2;
    const ctx = document.createElement('canvas').getContext('2d');
    const font = `${size}px bold sans-serif`;
    ctx.font = font;
    // measure how long the name will be
    const textWidth = ctx.measureText(name).width;

    const doubleBorderSize = borderSize * 2;
    const width = baseWidth + doubleBorderSize;
    const height = size + doubleBorderSize;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // need to set font again after resizing canvas
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, width, height);

    // scale to fit but don't stretch
    const scaleFactor = Math.min(1, baseWidth / textWidth);
    ctx.translate(width / 2, height / 2);
    ctx.scale(scaleFactor, 1);
    ctx.fillStyle = 'white';
    ctx.fillText(name, 0, 0);

    return ctx.canvas;
  }

  // RESIZE RENDER -------------------------------------------------------------------

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // RENDER -------------------------------------------------------------------

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 5 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();