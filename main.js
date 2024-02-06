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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

camera.position.z = 30;

// var leaf1_color = 0x587e60;
// var leaf2_color = 0x5f926a;
var tree_log_color = 0x6F4E37;
// var point_light_color = 0xF9E79F;
// var ambient_light_color = 0xffffff;
var sun_position = new THREE.Vector3(10, 50, -20);

const meshNameMap = new Map();

scene.fog = new THREE.Fog(0xcccccc, 0.1, 300);

// const geometry = new THREE.BoxGeometry(2, 1, 2);
// // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
// const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// const floorShaderMaterial = new THREE.ShaderMaterial({
//     vertexShader: `
//         void main() {
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//     `,
//     fragmentShader: `
//         uniform sampler2D floorTexture;

//         void main() {
//             gl_FragColor = texture2D(floorTexture, vec2(0.5, 0.5));
//         }
//     `,
//     uniforms: {
//         floorTexture: { value: new THREE.TextureLoader().load('texture/Grass_whwnabbhr_1k_Diffuse.jpg') }
//     }
// });

const floorGeometry = new THREE.PlaneGeometry(2500, 2500);

const floorTexture = new THREE.TextureLoader().load('texture/Grass_whwnabbhr_1k_Diffuse.jpg', onLoad);
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(10, 10); // Adjust the repeat values to control the zoom level

function onLoad(texture) {
    console.log('Texture loaded successfully:', texture);
}

const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture, color: 0x3a4f3f });
// const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x3a4f3f });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// const floor = new THREE.Mesh(floorGeometry, floorShaderMaterial);
floor.rotation.x = -Math.PI / 2;
meshNameMap.set(floor, 'floorMesh');
scene.add(floor);

var skyColor = 0xffffbb; // Light blue color for a sunny day
var sunColor = 0xF9E79F; // Sun color (light yellow)

const geometry = new THREE.SphereGeometry(5, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: sunColor });
const sun = new THREE.Mesh(geometry, material);
meshNameMap.set(sun, 'sun');
sun.position.copy(sun_position);
scene.add(sun);

// const directionalLight = new THREE.DirectionalLight( point_light_color, 0.5 );

// const pointlight = new THREE.PointLight(point_light_color, 200000, 200);
// // const pointlight = new THREE.PointLight(0xF9E79F);
// pointlight.position.copy(sun_position);
// const AmbientLight = new THREE.AmbientLight(ambient_light_color);
// // scene.add(directionalLight);
// scene.add(pointlight, AmbientLight);

// scene.add(new THREE.HemisphereLight(0xf0f5f5, 0x3a4f3f, 0.5));

// const light = new THREE.DirectionalLight( 0xF9E79F, 20 );
// light.position.set( 0, 100, 0 ); //default; light shining from top
// light.castShadow = true; // default false
// scene.add( light );

// Hemisphere light representing the sky
const hemisphereLight = new THREE.HemisphereLight(skyColor, 0x3a4f3f, 0.5);
scene.add(hemisphereLight);

// Directional light representing the sun
const directionalLight = new THREE.DirectionalLight(sunColor, 15);
directionalLight.position.set(10, 100, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

// const lightHelper = new THREE.PointLightHelper(pointlight);
// const gridHelper = new THREE.GridHelper(2500, 50);
// // scene.add(lightHelper, gridHelper);
// scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);

let particles;
let positions = [], velocity = [];

const numParticles = 15000;

const maxRange = 1000, minRange = maxRange / 2;
const minHeight = 150;

const geometry1 = new THREE.BufferGeometry();
const TextureLoader = new THREE.TextureLoader();

addParticles();


function addParticles() {
    for (let i = 0; i < numParticles; i++) {
        positions.push(
            Math.floor(Math.random() * maxRange - minRange),
            Math.floor(Math.random() * minRange + minHeight),
            Math.floor(Math.random() * maxRange - minRange)
        );
        velocity.push(
            Math.floor(Math.random() * 6 - 3) * 0.1,
            Math.floor(Math.random() * 5 + 0.12) * 0.18,
            Math.floor(Math.random() * 6 - 3) * 0.1
        );
    }

    geometry1.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry1.setAttribute('velocity', new THREE.Float32BufferAttribute(velocity, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 4,
        map: TextureLoader.load("texture/snow.png"),
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        opacity: 0.7,
    });

    particles = new THREE.Points(geometry1, particleMaterial)
    meshNameMap.set(particles, 'particles');
    scene.add(particles)
}

function addCliff() {
    // const cliffHeight = THREE.MathUtils.randFloat(10, 50);
    // const cliffWidth = THREE.MathUtils.randFloat(20, 100);
    // const cliffDepth = THREE.MathUtils.randFloat(10, 50);

    const geometry = new THREE.ConeGeometry(40, 15, 32);
    // const geometry = new THREE.CylinderGeometry(2, 50, 20, 32);
    // const cliffTexture = new THREE.TextureLoader().load('texture/cliff3.jpeg');
    // cliffTexture.wrapS = THREE.RepeatWrapping;
    // cliffTexture.wrapT = THREE.RepeatWrapping;
    // cliffTexture.repeat.set(10,10); // Adjust the repeat values to control the zoom level
    const material = new THREE.MeshStandardMaterial({ color: 0x3a4f3f });
    // const material = new THREE.MeshStandardMaterial({map: cliffTexture});
    const cliff = new THREE.Mesh(geometry, material);

    const x = THREE.MathUtils.randFloat(-200, 200);
    const z = THREE.MathUtils.randFloat(-200, 200);

    meshNameMap.set(cliff, 'cliff');

    cliff.position.set(x, 7, z);
    scene.add(cliff);
}

Array(10).fill().forEach(addCliff);

const leaf1ShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vNormal;
        
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vNormal = normal;
        }
    `,
    fragmentShader: `
        uniform vec3 leaf1Color;
        varying vec3 vNormal;
        uniform vec3 lightDirection;
        
        void main() {
            vec3 normal = normalize(vNormal); // Assuming vNormal is the normal vector at the fragment
            float brightness = dot(normal, lightDirection); // Calculate brightness based on the angle between normal and light direction
            vec3 finalColor = leaf1Color / 255.0 * brightness; // Adjust color based on brightness
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `,
    uniforms: {
        leaf1Color: {
            value: new THREE.Vector3(88, 126, 96)
        },
        lightDirection: {
            value: new THREE.Vector3()
        }
    }
});

const lightDirection = new THREE.Vector3();
directionalLight.getWorldDirection(lightDirection);
leaf1ShaderMaterial.uniforms.lightDirection.value.copy(lightDirection);

const leaf2ShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vNormal;
        
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vNormal = normal;
        }
    `,
    fragmentShader: `
        uniform vec3 leaf2Color;
        varying vec3 vNormal;
        uniform vec3 lightDirection;
        
        void main() {
            vec3 normal = normalize(vNormal); // Assuming vNormal is the normal vector at the fragment
            float brightness = dot(normal, lightDirection); // Calculate brightness based on the angle between normal and light direction
            vec3 finalColor = leaf2Color / 255.0 * brightness; // Adjust color based on brightness
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `,
    uniforms: {
        leaf2Color: {
            value: new THREE.Vector3(88, 126, 96)
        },
        lightDirection: {
            value: new THREE.Vector3()
        }
    }
});

leaf2ShaderMaterial.uniforms.lightDirection.value.copy(lightDirection);

const treeShaderMaterial = new THREE.ShaderMaterial({
    vertexShader: `
       
    `,
    fragmentShader: `
        
    `,
    uniforms: {

    }
});

function addTree() {
    const geometry1 = new THREE.ConeGeometry(2, 5, 10);
    const leaf1 = new THREE.Mesh(geometry1, leaf1ShaderMaterial);

    const geometry2 = new THREE.ConeGeometry(2, 5, 10);
    const leaf2 = new THREE.Mesh(geometry2, leaf2ShaderMaterial);

    // const geometry3 = new THREE.CylinderGeometry(0.5, 0.5, 5);
    // const tree = new THREE.Mesh(geometry3, treeShaderMaterial);

    // const geometry1 = new THREE.ConeGeometry(2, 5, 10);
    // // const leaf1Texture = new THREE.TextureLoader().load('texture/leaf3.webp');
    // // leaf1Texture.wrapS = THREE.RepeatWrapping;
    // // leaf1Texture.wrapT = THREE.RepeatWrapping;
    // // leaf1Texture.repeat.set(2, 2); // Adjust the repeat values to control the zoom level
    // // const material1 = new THREE.MeshStandardMaterial({ map: leaf1Texture });
    // const material1 = new THREE.MeshStandardMaterial({ color: leaf1_color });
    // const leaf1 = new THREE.Mesh(geometry1, material1);

    // const geometry2 = new THREE.ConeGeometry(2, 5, 10);
    // // const leaf2Texture = new THREE.TextureLoader().load('texture/leaf3.webp');
    // // leaf2Texture.wrapS = THREE.RepeatWrapping;
    // // leaf2Texture.wrapT = THREE.RepeatWrapping;
    // // leaf2Texture.repeat.set(2, 2); // Adjust the repeat values to control the zoom level

    // // const material2 = new THREE.MeshStandardMaterial({ map: leaf2Texture });
    // const material2 = new THREE.MeshStandardMaterial({ color: leaf2_color });
    // const leaf2 = new THREE.Mesh(geometry2, material2);

    const geometry3 = new THREE.CylinderGeometry(0.5, 0.5, 5);
    // const treeLogTexture = new THREE.TextureLoader().load('texture/log.jpg');
    // treeLogTexture.wrapS = THREE.RepeatWrapping;
    // treeLogTexture.wrapT = THREE.RepeatWrapping;
    // treeLogTexture.repeat.set(2, 2); // Adjust the repeat values to control the zoom level

    // const material3 = new THREE.MeshStandardMaterial({map: treeLogTexture});
    const material3 = new THREE.MeshStandardMaterial({ color: tree_log_color });
    const tree = new THREE.Mesh(geometry3, material3);

    const [x, z] = Array(2).fill().map(() => THREE.MathUtils.randFloatSpread(300))
    const y = getYPosition(x, z);

    meshNameMap.set(leaf1, 'leaf1');
    meshNameMap.set(leaf2, 'leaf2');

    // leaf1.position.set(x, y + 2.5, z);
    // leaf2.position.set(x, y + 4.5, z);
    // tree.position.set(x, y, z);

    leaf1.position.set(x, y + 5, z);
    leaf2.position.set(x, y + 7, z);
    tree.position.set(x, y + 2.5, z);

    scene.add(leaf1);
    scene.add(leaf2);
    scene.add(tree);
}

function getYPosition(x, z) {
    for (const child of scene.children) {
        if (meshNameMap.get(child) == 'cliff') {
            // Distance from the point to the base of the cone
            const distance = Math.sqrt((child.position.x - x) ** 2 + (child.position.z - z) ** 2);
            if (distance < child.geometry.parameters.radius - 2 && distance > child.geometry.parameters.radius * 0.3) {
                const h = child.geometry.parameters.height;
                const r = child.geometry.parameters.radius;
                const y = child.position.y + Math.sqrt(h ** 2 - ((h * distance) / r) ** 2);
                return y - 11 - 2.5;
            } else if (distance <= child.geometry.parameters.radius * 0.3) {
                const h = child.geometry.parameters.height;
                const r = child.geometry.parameters.radius;
                const y = child.position.y + Math.sqrt(h ** 2 - ((h * distance) / r) ** 2);
                return y - 11;
            }
        }
    }
    return 0;
}

Array(1000).fill().forEach(addTree);

const skyTexture = new THREE.TextureLoader().load('texture/sky.jpg');
scene.background = skyTexture;

let currentPairIndex = 0;
const colorPairs = [
    {
        leaf1: new THREE.Color(88, 126, 96),
        leaf2: new THREE.Color(95, 146, 106),
        floor: new THREE.TextureLoader().load('texture/Grass_whwnabbhr_1k_Diffuse.jpg'),
        floorColor: new THREE.Color(0x3a4f3f),
        lightColor: new THREE.Color(0xF9E79F)
    },
    {
        leaf1: new THREE.Color(105, 75, 55),
        leaf2: new THREE.Color(165, 99, 60),
        floor: new THREE.TextureLoader().load('texture/Grass_whwnabbhr_1k_Displacement.jpg'),
        floorColor: new THREE.Color(0xa5633c),
        lightColor: new THREE.Color(0xFFD700)
    },
    {
        leaf1: new THREE.Color(88, 126, 96),
        leaf2: new THREE.Color(234, 237, 242),
        floor: new THREE.TextureLoader().load('texture/Grass_whwnabbhr_1k_AmbientOcclusion.jpg'),
        floorColor: new THREE.Color(0xeaedf2),
        lightColor: new THREE.Color(0xADD8E6)
    }
];

// function changeTreeColor(color1, color2) {
//     scene.traverse(function (child) {
//         if (child instanceof THREE.Mesh && child.geometry instanceof THREE.ConeGeometry) {
//             const meshName = meshNameMap.get(child);
//             if (meshName == 'leaf1') {
//                 child.material.color.copy(color1);
//             }
//             else if (meshName == 'leaf2') {
//                 child.material.color.copy(color2);
//             }
//         }
//     });
// }

function changeFloorTexture(texture, color, sunColor) {
    scene.traverse(function (child) {
        const meshName = meshNameMap.get(child);
        if (meshName == 'floorMesh') {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);
            child.material.map = texture;
            child.material.color = color;
            child.material.needsUpdate = true;
        }
        if (meshName == 'cliff') {
            child.material.color.copy(color);
        }
        if (meshName == 'sun') {
            child.material.color.copy(sunColor);
        }
        if (child instanceof THREE.DirectionalLight) {
            child.color.set(sunColor);
        }
    });
}

// function cycleColors() {
//     const currentPair = colorPairs[currentPairIndex];
//     changeTreeColor(currentPair.leaf1, currentPair.leaf2);
//     changeFloorTexture(currentPair.floor, currentPair.leaf2);
//     currentPairIndex = (currentPairIndex + 1) % colorPairs.length;
//     setTimeout(cycleColors, 5000);
// }


// cycleColors();

function cycleColors() {
    const currentPair = colorPairs[currentPairIndex];
    updateLeafColors(currentPair.leaf1, currentPair.leaf2);
    changeFloorTexture(currentPair.floor, currentPair.floorColor, currentPair.lightColor);
    currentPairIndex = (currentPairIndex + 1) % colorPairs.length;

    document.documentElement.style.setProperty('--dark-bg', `rgba(${currentPair.leaf1.r}, ${currentPair.leaf1.g}, ${currentPair.leaf1.b}, 0.9)`);
}

function updateLeafColors(color1, color2) {
    leaf1ShaderMaterial.uniforms.leaf1Color.value.set(color1.r, color1.g, color1.b);
    leaf2ShaderMaterial.uniforms.leaf2Color.value.set(color2.r, color2.g, color2.b);
}
cycleColors();
setInterval(cycleColors, 10000);

// function changeTreeColor(color1, color2) {
//     scene.traverse(function (child) {
//         if (child instanceof THREE.Mesh && child.geometry instanceof THREE.ConeGeometry) {
//             const meshName = meshNameMap.get(child);
//             if (meshName == 'leaf1')
//                 child.material.color.set(color1);
//             else
//                 child.material.color.set(color2);
//         }
//     });
// }

// document.addEventListener('keydown', function (event) {
//     switch (event.key) {
//         case '1':
//             changeTreeColor(new THREE.Color(leaf1_color), new THREE.Color(leaf2_color));
//             break;
//         case '2':
//             changeTreeColor(new THREE.Color(0x694b37), new THREE.Color(0xa5633c));
//             break;
//         case '3':
//             changeTreeColor(new THREE.Color(leaf1_color), new THREE.Color(0xeaedf2));
//             break;
//     }
// });

function animate() {
    requestAnimationFrame(animate);

    // console.log(camera.position.y, camera.position.z);

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;\
    updateParticles();
    animateCamera();

    controls.update();
    renderer.render(scene, camera);
}

function updateParticles(){
    for (let i = 0; i < numParticles*3; i+=3) {
        particles.geometry.attributes.position.array[i] -=particles.geometry.attributes.velocity.array[i]
        particles.geometry.attributes.position.array[i+1] -=particles.geometry.attributes.velocity.array[i+1]
        particles.geometry.attributes.position.array[i+2] -=particles.geometry.attributes.velocity.array[i+2]
    
        if(particles.geometry.attributes.position.array[i+1]<0){
            particles.geometry.attributes.position.array[i] = Math.floor(Math.random() * maxRange - minRange);
            particles.geometry.attributes.position.array[i+1] = Math.floor(Math.random() * minRange + minHeight);
            particles.geometry.attributes.position.array[i+2] = Math.floor(Math.random() * maxRange - minRange);
        }
    }
    particles.geometry.attributes.position.needsUpdate = true;
}

function animateCamera() {
    const radius = 90;
    const speed = 0.0001;
    const angle = performance.now() * speed;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    camera.position.x = x;
    camera.position.z = z;
    camera.position.y = 20;
    // camera.lookAt(scene.position);
}

// function moveCamera() {
//     const t = document.body.getBoundingClientRect().top;

//     camera.position.z = t * -0.01;
//     camera.position.x = t * -0.02;
//     camera.rotation.y = t * -0.02;
// }

function moveCamera() {
    const scrollY = window.scrollY + 1;
    // console.log(scrollY);

    camera.position.z = scrollY * 0.01;
    camera.position.x = scrollY * 0.01;
    camera.position.y = 30;
    // console.log(camera.position);
    camera.lookAt(scene.position);
}

// document.body.onscroll = moveCamera;
// moveCamera()

animate();
