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
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x3a4f3f});
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
const gridHelper = new THREE.GridHelper(2500, 50);
// scene.add(lightHelper, gridHelper);
scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addCliff() {
    // const cliffHeight = THREE.MathUtils.randFloat(10, 50);
    // const cliffWidth = THREE.MathUtils.randFloat(20, 100);
    // const cliffDepth = THREE.MathUtils.randFloat(10, 50);

    const geometry = new THREE.CylinderGeometry(50, 2, 20, 32);
    // const material = new THREE.MeshStandardMaterial({ color: 0x3a4f3f, wireframe: true });
    const material = new THREE.MeshStandardMaterial({ color: 0x3a4f3f});
    const cliff = new THREE.Mesh(geometry, material);

    cliff.rotation.x = Math.PI;

    const x = THREE.MathUtils.randFloat(-500, 500);
    const z = THREE.MathUtils.randFloat(-500, 500);

    cliff.position.set(x, 10, z);
    scene.add(cliff);
}

Array(100).fill().forEach(addCliff);

function addTree() {
    const geometry = new THREE.ConeGeometry(2, 5, 10);
    const material = new THREE.MeshStandardMaterial({ color: 0x587e60 });
    const leaf = new THREE.Mesh(geometry, material);

    const geometry1 = new THREE.ConeGeometry(2, 5, 10);
    const material1 = new THREE.MeshStandardMaterial({ color: 0x5f926a });
    const leaf1 = new THREE.Mesh(geometry1, material1);

    const geometry2 = new THREE.CylinderGeometry(0.5, 0.5, 5);
    const material2 = new THREE.MeshStandardMaterial({ color: 0x6F4E37 });
    const tree = new THREE.Mesh(geometry2, material2);

    const [x, z] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread(500))
    const y = getYPosition(x, z);

    leaf.position.set(x, y + 2.5, z);
    leaf1.position.set(x, y + 4.5, z);
    tree.position.set(x, y, z);

    // leaf.position.set(x, y + 5, z);
    // leaf1.position.set(x, y + 7, z);
    // tree.position.set(x, y + 2.5, z);

    scene.add(leaf);
    scene.add(leaf1);
    scene.add(tree);
}

function getYPosition(x, z) {
    for (const child of scene.children) {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry) {
            const distance = Math.sqrt((child.position.x - x) ** 2 + (child.position.z - z) ** 2);
            if (distance < 50) {
                return child.position.y;
            }
        }
    }
    return 0;
}

Array(2000).fill().forEach(addTree);

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