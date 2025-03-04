import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 100, 400);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls for zoom and camera movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.autoRotate = true;

// Sun with glowing effect
const sunGeometry = new THREE.SphereGeometry(30, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Point light to illuminate planets
const light = new THREE.PointLight(0xffffff, 25, 5000);
light.position.set(0, 0, 0);
scene.add(light);

// Ambient light for subtle illumination
const ambientLight = new THREE.AmbientLight(0x404040, 30);
scene.add(ambientLight);

// Planets with names
const planets = [
  { name: 'Mercury', size: 5, distance: 50, color: 0xaaaaaa, speed: 0.02 },
  { name: 'Venus', size: 8, distance: 80, color: 0xffa07a, speed: 0.015 },
  { name: 'Earth', size: 10, distance: 110, color: 0x0000ff, speed: 0.01 },
  { name: 'Mars', size: 7, distance: 150, color: 0xff4500, speed: 0.009 },
  { name: 'Jupiter', size: 20, distance: 200, color: 0xff8c00, speed: 0.005 },
  { name: 'Saturn', size: 18, distance: 250, color: 0xffd700, speed: 0.004 },
  { name: 'Uranus', size: 15, distance: 300, color: 0x00ffff, speed: 0.003 },
  { name: 'Neptune', size: 15, distance: 350, color: 0x0000cd, speed: 0.002 }
];

const planetMeshes = planets.map(planet => {
  const geometry = new THREE.SphereGeometry(planet.size, 64, 64);
  const material = new THREE.MeshStandardMaterial({ color: planet.color, roughness: 0.5, metalness: 0.5 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Orbits
  const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.5, planet.distance + 0.5, 128);
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);

  return { mesh, distance: planet.distance, speed: planet.speed, angle: Math.random() * Math.PI * 2 };
});

// Jupiter's ring
const jupiter = planetMeshes[4]; // Jupiter is the 5th planet
const jupiterRingGeometry = new THREE.RingGeometry(15, 25, 64);
const jupiterRingMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
const jupiterRing = new THREE.Mesh(jupiterRingGeometry, jupiterRingMaterial);
jupiterRing.rotation.x = Math.PI / 2;
scene.add(jupiterRing);

// Saturn's ring
const saturn = planetMeshes[5]; // Saturn is the 6th planet
const saturnRingGeometry = new THREE.RingGeometry(20, 35, 64);
const saturnRingMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 3;
scene.add(saturnRing);

// Starfield background
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;
  planetMeshes.forEach(planet => {
    planet.angle += planet.speed;
    planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
    planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
  });

  // Update Jupiter's ring position
  jupiterRing.position.set(jupiter.mesh.position.x, 0, jupiter.mesh.position.z);

  // Update Saturn's ring position
  saturnRing.position.set(saturn.mesh.position.x, 0, saturn.mesh.position.z);

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize event
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
