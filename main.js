import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 30;

// const geometry = new THREE.BoxGeometry(2, 1, 2);
// // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
// const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const floorGeometry = new THREE.PlaneGeometry(2500, 2500);

const floorTexture = new THREE.TextureLoader().load('texture/grass2.jpg');
// const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x3a4f3f });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const pointlight = new THREE.PointLight(0xF9E79F, 20000, 200);
// const pointlight = new THREE.PointLight(0xF9E79F);
pointlight.position.set(10, 30, 10);
const AmbientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointlight, AmbientLight);
// scene.add(pointlight);

const lightHelper = new THREE.PointLightHelper(pointlight);
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);
scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addTree() {
    const geometry = new THREE.ConeGeometry(2, 5, 10);
    // const geometry = new THREE.TetrahedronGeometry(2, 0);
    const material = new THREE.MeshStandardMaterial({ color: 0x587e60 });
    const leaf = new THREE.Mesh(geometry, material);
    // scene.add(leaf);

    const geometry1 = new THREE.ConeGeometry(2, 5, 10);
    // const geometry = new THREE.TetrahedronGeometry(2, 0);
    const material1 = new THREE.MeshStandardMaterial({ color: 0x5f926a });
    const leaf1 = new THREE.Mesh(geometry1, material1);

    const geometry2 = new THREE.CylinderGeometry(0.5, 0.5, 5);
    const material2 = new THREE.MeshStandardMaterial({ color: 0x6F4E37 });
    const tree = new THREE.Mesh(geometry2, material2);
    // scene.add(tree);

    const [x, z] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread(200))
    leaf.position.set(x, 5, z);
    leaf1.position.set(x, 7, z);
    tree.position.set(x, 2.5, z);
    scene.add(leaf)
    scene.add(leaf1)
    scene.add(tree)
}

Array(400).fill().forEach(addTree)

const skyTexture = new THREE.TextureLoader().load('texture/sky.jpg');
scene.background = skyTexture;

function animate() {
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
}

animate();