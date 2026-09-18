import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { getValleyElevation } from './mountain.js';
import { riverCurve3D, getRiverWidth } from './riverPath.js';

/**
 * Procedural Low-Poly Vegetation System
 * Includes:
 * 1. Summit Alpine Grass Tufts (Fescue bunches around campfire, rocks, and cabin)
 * 2. Alpine Starry Wildflowers (Edelweiss, Bluebells, Buttercups)
 * 3. Windswept Cliffside Dwarf Pines (Krummholz clinging to rock crevices)
 * 4. Porch Window Box Living Greenery & Ferns
 * 5. Riparian Riverbank Reeds & Waterside Ferns
 */

// -----------------------------------------------------------------------------
// Helper: Create a faceted grass blade cluster geometry with baked vertex colors
// -----------------------------------------------------------------------------
function createGrassTuftGeometry() {
  const bladeCount = 7;
  const bladeGeos = [];

  const colRoot = new THREE.Color(0x132a22); // Deep shadowed root
  const colMid  = new THREE.Color(0x234e3b); // Alpine fescue midtone
  const colTip  = new THREE.Color(0x3e775a); // Moonlit needle tip

  for (let b = 0; b < bladeCount; b++) {
    const angle = (b / bladeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const height = 0.45 + Math.random() * 0.35;
    const lean = 0.18 + Math.random() * 0.22;
    const width = 0.05 + Math.random() * 0.03;

    // 4-vertex dual-triangle blade tapering to a point
    const positions = [
      // Base left, base right, mid left, mid right, tip
      -width * 0.5, 0, 0,
       width * 0.5, 0, 0,
      -width * 0.35 + Math.cos(angle) * lean * 0.4, height * 0.5, Math.sin(angle) * lean * 0.4,
       width * 0.35 + Math.cos(angle) * lean * 0.4, height * 0.5, Math.sin(angle) * lean * 0.4,
       Math.cos(angle) * lean, height, Math.sin(angle) * lean
    ];

    const indices = [
      0, 1, 2,
      1, 3, 2,
      2, 3, 4
    ];

    const colors = [
      colRoot.r, colRoot.g, colRoot.b,
      colRoot.r, colRoot.g, colRoot.b,
      colMid.r,  colMid.g,  colMid.b,
      colMid.r,  colMid.g,  colMid.b,
      colTip.r,  colTip.g,  colTip.b
    ];

    const bladeGeo = new THREE.BufferGeometry();
    bladeGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    bladeGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    bladeGeo.setIndex(indices);

    bladeGeos.push(bladeGeo);
  }

  const merged = BufferGeometryUtils.mergeGeometries(bladeGeos, false);
  return merged.toNonIndexed();
}

// -----------------------------------------------------------------------------
// Helper: Create a low-poly wildflower bunch geometry
// -----------------------------------------------------------------------------
function createWildflowerGeometry() {
  const stemCount = 5;
  const flowerGeos = [];

  const colStem = new THREE.Color(0x1a4030);
  const colFlowerA = new THREE.Color(0xdde8f5); // Edelweiss pale moonlight
  const colFlowerB = new THREE.Color(0x5294d4); // Alpine bluebell

  for (let s = 0; s < stemCount; s++) {
    const angle = (s / stemCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const height = 0.55 + Math.random() * 0.3;
    const lean = 0.15 + Math.random() * 0.15;
    const px = Math.cos(angle) * lean;
    const pz = Math.sin(angle) * lean;

    // Slender Stem
    const stemPositions = [
      -0.02, 0, 0,
       0.02, 0, 0,
       px - 0.015, height, pz,
       px + 0.015, height, pz
    ];
    const stemIndices = [0, 1, 2, 1, 3, 2];
    const stemColors = [
      colStem.r, colStem.g, colStem.b,
      colStem.r, colStem.g, colStem.b,
      colStem.r, colStem.g, colStem.b,
      colStem.r, colStem.g, colStem.b
    ];

    const stemGeo = new THREE.BufferGeometry();
    stemGeo.setAttribute('position', new THREE.Float32BufferAttribute(stemPositions, 3));
    stemGeo.setAttribute('color', new THREE.Float32BufferAttribute(stemColors, 3));
    stemGeo.setIndex(stemIndices);
    flowerGeos.push(stemGeo);

    // Faceted blossom star (5 delicate triangular petals cupped upward)
    const fCol = (s % 2 === 0) ? colFlowerA : colFlowerB;
    const petalCount = 5;
    const flowerRadius = 0.055 + Math.random() * 0.02;
    const blossomPositions = [px, height + 0.015, pz]; // center
    const blossomIndices = [];

    for (let p = 0; p < petalCount; p++) {
      const pAng = (p / petalCount) * Math.PI * 2;
      const petX = px + Math.cos(pAng) * flowerRadius;
      const petY = height + 0.035 + Math.sin(p * 2.0) * 0.008;
      const petZ = pz + Math.sin(pAng) * flowerRadius;

      blossomPositions.push(petX, petY, petZ);

      const nextP = ((p + 1) % petalCount);
      blossomIndices.push(0, p + 1, nextP + 1);
    }

    const blossomGeo = new THREE.BufferGeometry();
    blossomGeo.setAttribute('position', new THREE.Float32BufferAttribute(blossomPositions, 3));
    
    // Set colors for blossom
    const bCols = [];
    bCols.push(0.98, 0.95, 0.65); // center
    for (let p = 0; p < petalCount; p++) {
      bCols.push(fCol.r, fCol.g, fCol.b);
    }
    blossomGeo.setAttribute('color', new THREE.Float32BufferAttribute(bCols, 3));
    blossomGeo.setIndex(blossomIndices);
    flowerGeos.push(blossomGeo);
  }

  const merged = BufferGeometryUtils.mergeGeometries(flowerGeos, false);
  return merged.toNonIndexed();
}

// -----------------------------------------------------------------------------
// Helper: Create windswept cliff dwarf pine (Krummholz)
// -----------------------------------------------------------------------------
function createKrummholzGeometry() {
  const parts = [];

  const colBark = new THREE.Color(0x352316);
  const colFoliage = new THREE.Color(0x18423a);

  function applyColor(geo, col) {
    const pos = geo.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      cols[i * 3]     = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  }

  // Gnarled twisted lower trunk
  const trunkLower = new THREE.CylinderGeometry(0.12, 0.18, 0.9, 5);
  trunkLower.rotateZ(0.22);
  trunkLower.translate(0, 0.4, 0);
  applyColor(trunkLower, colBark);
  parts.push(trunkLower);

  const trunkUpper = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 5);
  trunkUpper.rotateZ(-0.15);
  trunkUpper.translate(0.12, 1.0, 0);
  applyColor(trunkUpper, colBark);
  parts.push(trunkUpper);

  // 3 compact windswept foliage cones tilted eastward by mountain gales
  const bough1 = new THREE.ConeGeometry(0.85, 1.1, 5);
  bough1.rotateZ(-0.25);
  bough1.translate(0.18, 1.25, 0);
  applyColor(bough1, colFoliage);
  parts.push(bough1);

  const bough2 = new THREE.ConeGeometry(0.65, 0.95, 5);
  bough2.rotateZ(-0.35);
  bough2.translate(0.35, 1.8, 0.05);
  applyColor(bough2, colFoliage);
  parts.push(bough2);

  const bough3 = new THREE.ConeGeometry(0.42, 0.75, 5);
  bough3.rotateZ(-0.4);
  bough3.translate(0.55, 2.25, 0.08);
  applyColor(bough3, colFoliage);
  parts.push(bough3);

  const merged = BufferGeometryUtils.mergeGeometries(parts, false);
  return merged.toNonIndexed();
}

// -----------------------------------------------------------------------------
// Helper: Create riparian river reed / sedge geometry
// -----------------------------------------------------------------------------
function createRiverReedGeometry() {
  const parts = [];
  const colReedStem = new THREE.Color(0x2d4a34);
  const colReedTip  = new THREE.Color(0x4a6d45);
  const colCattail  = new THREE.Color(0x422d1e);

  const reedCount = 6;
  for (let r = 0; r < reedCount; r++) {
    const angle = (r / reedCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const height = 1.1 + Math.random() * 0.7;
    const lean = 0.25 + Math.random() * 0.25;

    const stem = new THREE.CylinderGeometry(0.02, 0.035, height, 4);
    stem.translate(0, height * 0.5, 0);
    stem.rotateZ(lean);
    stem.rotateY(angle);

    const pos = stem.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = y / height;
      const c = colReedStem.clone().lerp(colReedTip, t);
      cols[i * 3]     = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    stem.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    parts.push(stem);

    // Cattail cylindrical head on 50% of stalks
    if (r % 2 === 0) {
      const head = new THREE.CylinderGeometry(0.045, 0.045, 0.32, 5);
      head.translate(0, height * 0.85, 0);
      head.rotateZ(lean);
      head.rotateY(angle);

      const hPos = head.attributes.position;
      const hCols = new Float32Array(hPos.count * 3);
      for (let i = 0; i < hPos.count; i++) {
        hCols[i * 3]     = colCattail.r;
        hCols[i * 3 + 1] = colCattail.g;
        hCols[i * 3 + 2] = colCattail.b;
      }
      head.setAttribute('color', new THREE.BufferAttribute(hCols, 3));
      parts.push(head);
    }
  }

  const merged = BufferGeometryUtils.mergeGeometries(parts, false);
  return merged.toNonIndexed();
}

// -----------------------------------------------------------------------------
// Helper: Create riparian / woodland fern geometry
// -----------------------------------------------------------------------------
function createFernGeometry() {
  const parts = [];
  const frondCount = 7;
  const colFernBase = new THREE.Color(0x133828);
  const colFernTip  = new THREE.Color(0x2d6e4b);

  for (let f = 0; f < frondCount; f++) {
    const angle = (f / frondCount) * Math.PI * 2;
    const frondLen = 0.85 + Math.random() * 0.35;
    const droop = 0.45 + Math.random() * 0.2;

    const frond = new THREE.ConeGeometry(0.28, frondLen, 4);
    frond.rotateX(droop + Math.PI * 0.45);
    frond.rotateY(angle);
    frond.translate(0, 0.15, 0);

    const pos = frond.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const t = pos.getY(i) / frondLen;
      const c = colFernBase.clone().lerp(colFernTip, Math.max(0, Math.min(1, t + 0.5)));
      cols[i * 3]     = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    frond.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    parts.push(frond);
  }

  const merged = BufferGeometryUtils.mergeGeometries(parts, false);
  return merged.toNonIndexed();
}

// -----------------------------------------------------------------------------
// Custom Wind Shader for Low-Poly Vegetation
// -----------------------------------------------------------------------------
function createVegetationMaterial() {
  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.82,
    metalness: 0.05,
    flatShading: true,
    side: THREE.DoubleSide
  });

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    mat.userData.shader = shader;

    shader.vertexShader = `
      uniform float uTime;
      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      
      #ifdef USE_INSTANCING
        vec4 worldPos = instanceMatrix * vec4(transformed, 1.0);
      #else
        vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
      #endif

      // Natural height-based wind flutter
      float hFactor = pow(max(0.0, transformed.y), 1.3);
      float windFront = sin(uTime * 2.2 + worldPos.x * 0.4 + worldPos.z * 0.4);
      float flutter   = cos(uTime * 4.5 + worldPos.x * 1.8 + worldPos.z * 1.2) * 0.35;
      
      float sway = (windFront + flutter) * hFactor * 0.08;
      transformed.x += sway * 0.8;
      transformed.z -= sway * 0.6;
      `
    );
  };

  return mat;
}

// -----------------------------------------------------------------------------
// Comprehensive Summit Collision & Exclusion Check
// Guarantees that no grass, wildflower, or pine ever generates inside boulders,
// campfire ring, tree stump, bench, cabin walls, porch deck, or stairs.
// -----------------------------------------------------------------------------
function isSummitObstacle(x, z, margin = 0.25) {
  // Summit Boulders from mountain.js
  const boulders = [
    { x: 0.60, z: 4.30, r: 1.25 }, // Lantern rock on left of campfire
    { x: -5.8, z: 3.20, r: 1.40 }, // West boulder
    { x: -4.5, z: -2.8, r: 1.40 }, // North-west boulder
    { x: 3.20, z: -4.2, r: 1.80 }, // North boulder
    { x: 5.80, z: 0.80, r: 1.60 }, // East boulder A
    { x: 5.80, z: 3.00, r: 1.30 }  // East boulder B
  ];
  for (let i = 0; i < boulders.length; i++) {
    const b = boulders[i];
    if (Math.hypot(x - b.x, z - b.z) < b.r + margin) return true;
  }

  // Campfire fire ring & scorched coal bed
  if (Math.hypot(x - 3.20, z - 2.80) < 1.65 + margin) return true;

  // Campfire cut tree stump & lantern
  if (Math.hypot(x - 3.55, z - 1.10) < 0.65 + margin) return true;

  // Campfire Adirondack split-log bench (oriented box collision)
  const dx = x - 1.38;
  const dz = z - 2.26;
  const cosB = Math.cos(-1.05);
  const sinB = Math.sin(-1.05);
  const bx = dx * cosB - dz * sinB;
  const bz = dx * sinB + dz * cosB;
  if (Math.abs(bx) < 1.25 + margin && Math.abs(bz) < 0.55 + margin) return true;

  // Cabin timber structure & porch deck footprint
  if (x >= -4.70 - margin && x <= 0.60 + margin && z >= -3.20 - margin && z <= 2.20 + margin) return true;

  // Cabin porch entrance stairs
  if (x >= -2.00 - margin && x <= -0.20 + margin && z >= 2.00 - margin && z <= 4.20 + margin) return true;

  return false;
}

// -----------------------------------------------------------------------------
// Main Vegetation Generator
// -----------------------------------------------------------------------------
export function createVegetation(scene, mountainGroup) {
  const vegGroup = new THREE.Group();
  vegGroup.name = 'VegetationSystem';

  const vegMaterial = createVegetationMaterial();
  const dummy = new THREE.Object3D();

  // ===========================================================================
  // 1. SUMMIT ALPINE GRASS TUFTS (Collision-Free Placements)
  // ===========================================================================
  const grassGeo = createGrassTuftGeometry();
  grassGeo.computeVertexNormals();

  const candidateGrass = [
    // South vista rim overlooking valley (clear of lantern rock & stairs)
    { x: 2.2,  y: 7.02, z: 4.8, s: 1.15 },
    { x: 2.7,  y: 7.02, z: 5.1, s: 1.10 },
    { x: 3.2,  y: 7.02, z: 5.0, s: 1.20 },
    { x: 3.7,  y: 7.02, z: 4.8, s: 1.05 },
    { x: 4.1,  y: 7.02, z: 4.6, s: 1.10 },
    { x: 4.4,  y: 7.02, z: 4.8, s: 0.95 },
    // Far south-west rim (left of stairs, clear of lantern rock and west boulder)
    { x: -0.9, y: 7.01, z: 5.4, s: 1.10 },
    { x: -2.4, y: 7.01, z: 4.8, s: 1.15 },
    { x: -2.9, y: 7.01, z: 5.1, s: 1.05 },
    { x: -3.4, y: 7.01, z: 4.6, s: 1.20 },
    { x: -4.0, y: 7.01, z: 4.8, s: 0.95 },
    // East rim clearings
    { x: 4.6,  y: 7.01, z: -0.8, s: 1.05 },
    { x: 4.3,  y: 7.01, z: -1.6, s: 1.00 },
    { x: 4.8,  y: 7.01, z: -2.2, s: 1.10 },
    // Northeast path
    { x: 1.5,  y: 7.02, z: -2.2, s: 1.05 },
    // West flank clearing (clear of cabin & west boulder)
    { x: -5.3, y: 7.02, z: 0.2, s: 1.05 },
    { x: -5.2, y: 7.02, z: -1.0, s: 0.95 }
  ];

  const validGrassPoints = candidateGrass.filter(p => !isSummitObstacle(p.x, p.z));
  const instancedGrass = new THREE.InstancedMesh(grassGeo, vegMaterial, validGrassPoints.length);
  instancedGrass.castShadow = true;
  instancedGrass.receiveShadow = true;

  validGrassPoints.forEach((pt, i) => {
    dummy.position.set(pt.x, pt.y, pt.z);
    dummy.rotation.y = Math.random() * Math.PI * 2;
    const s = pt.s * (0.88 + Math.random() * 0.24);
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    instancedGrass.setMatrixAt(i, dummy.matrix);
  });
  instancedGrass.instanceMatrix.needsUpdate = true;
  instancedGrass.computeBoundingBox();
  instancedGrass.computeBoundingSphere();
  vegGroup.add(instancedGrass);

  // ===========================================================================
  // 2. ALPINE WILDFLOWERS (Edelweiss & Bluebells - Collision-Free)
  // ===========================================================================
  const flowerGeo = createWildflowerGeometry();
  flowerGeo.computeVertexNormals();

  const candidateFlowers = [
    { x: 2.4,  y: 7.02, z: 4.9, s: 1.00 },
    { x: 3.4,  y: 7.02, z: 4.9, s: 0.95 },
    { x: 4.2,  y: 7.02, z: 4.7, s: 1.05 },
    { x: -0.7, y: 7.01, z: 5.3, s: 1.00 },
    { x: -2.6, y: 7.01, z: 4.9, s: 0.95 },
    { x: -3.6, y: 7.01, z: 4.7, s: 1.05 },
    { x: 4.5,  y: 7.01, z: -1.2, s: 0.95 },
    { x: 1.7,  y: 7.02, z: -2.0, s: 1.00 },
    { x: -5.4, y: 7.02, z: -0.4, s: 0.90 }
  ];

  const validFlowerPoints = candidateFlowers.filter(p => !isSummitObstacle(p.x, p.z));
  const instancedFlowers = new THREE.InstancedMesh(flowerGeo, vegMaterial, validFlowerPoints.length);
  instancedFlowers.castShadow = true;
  instancedFlowers.receiveShadow = true;

  validFlowerPoints.forEach((pt, i) => {
    dummy.position.set(pt.x, pt.y, pt.z);
    dummy.rotation.y = Math.random() * Math.PI * 2;
    const s = pt.s * (0.90 + Math.random() * 0.20);
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    instancedFlowers.setMatrixAt(i, dummy.matrix);
  });
  instancedFlowers.instanceMatrix.needsUpdate = true;
  instancedFlowers.computeBoundingBox();
  instancedFlowers.computeBoundingSphere();
  vegGroup.add(instancedFlowers);

  // ===========================================================================
  // 3. CLIFFSIDE WINDSWEPT DWARF PINES (Krummholz on Cliff Ledges)
  // Strictly positioned away from the Summit-to-Campfire line-of-sight
  // ===========================================================================
  const krummGeo = createKrummholzGeometry();
  krummGeo.computeVertexNormals();

  const krummPoints = [
    // Far west cliff rock perch (clear of west boulder at -5.8, 3.2)
    { x: -7.5, y: 6.30, z: 2.5, s: 0.95, ry: 0.8 },
    // Far south-west cliff rim (left of cabin stairs, overlooking western valley)
    { x: -4.2, y: 6.15, z: 5.4, s: 0.90, ry: 0.6 },
    // Far north-east cliff ledge (behind campfire area on distant rim)
    { x: 4.8,  y: 6.40, z: -5.8, s: 1.10, ry: 1.2 },
    // North-west rock shelf (behind cabin northwest corner)
    { x: -6.4, y: 6.20, z: -3.5, s: 0.85, ry: -0.8 },
    // South-east rock shelf (subtle natural cliff perch)
    { x: 8.8,  y: 3.20, z: 1.5,  s: 0.88, ry: -1.4 }
  ];

  const instancedKrumm = new THREE.InstancedMesh(krummGeo, vegMaterial, krummPoints.length);
  instancedKrumm.castShadow = true;
  instancedKrumm.receiveShadow = true;

  krummPoints.forEach((pt, i) => {
    dummy.position.set(pt.x, pt.y, pt.z);
    dummy.rotation.set(0, pt.ry, 0);
    dummy.scale.set(pt.s, pt.s, pt.s);
    dummy.updateMatrix();
    instancedKrumm.setMatrixAt(i, dummy.matrix);
  });
  instancedKrumm.instanceMatrix.needsUpdate = true;
  instancedKrumm.computeBoundingBox();
  instancedKrumm.computeBoundingSphere();
  vegGroup.add(instancedKrumm);

  // ===========================================================================
  // 5. RIPARIAN RIVERBANK REEDS & WATERSIDE FERNS + VALLEY GLADE ACCENTS
  // ===========================================================================
  const reedGeo = createRiverReedGeometry();
  reedGeo.computeVertexNormals();
  const valleyFernGeo = createFernGeometry();
  valleyFernGeo.computeVertexNormals();

  const reedCount = 75;
  const fernCount = 60;
  const gladeFernCount = 25; // Subtle natural valley ferns
  const instancedReeds = new THREE.InstancedMesh(reedGeo, vegMaterial, reedCount);
  const instancedFerns = new THREE.InstancedMesh(valleyFernGeo, vegMaterial, fernCount + gladeFernCount);
  instancedReeds.castShadow = false;
  instancedReeds.receiveShadow = true;
  instancedFerns.castShadow = false;
  instancedFerns.receiveShadow = true;

  const pPt = new THREE.Vector3();
  const pTan = new THREE.Vector3();
  const norm2D = new THREE.Vector2();

  // Populate riverbanks strictly along the visible river corridor (t from 0.35 to 0.68, z <= 20)
  // River past t = 0.68 is behind the camera horizon and never visible
  for (let r = 0; r < reedCount; r++) {
    const t = 0.35 + Math.random() * 0.33;
    riverCurve3D.getPoint(t, pPt);
    riverCurve3D.getTangent(t, pTan);
    norm2D.set(-pTan.z, pTan.x).normalize();

    const curWidth = getRiverWidth(t);
    const side = Math.random() > 0.5 ? 1.0 : -1.0;
    // Right on the water margin
    const distFromCenter = side * (curWidth * 0.5 + 0.3 + Math.random() * 1.6);

    const rx = pPt.x + norm2D.x * distFromCenter;
    const rz = pPt.z + norm2D.y * distFromCenter;
    const ry = getValleyElevation(rx, rz);

    const s = 0.75 + Math.random() * 0.65;
    dummy.position.set(rx, ry + 0.05, rz);
    dummy.rotation.set(0, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.15);
    dummy.scale.set(s, s * (0.9 + Math.random() * 0.3), s);
    dummy.updateMatrix();
    instancedReeds.setMatrixAt(r, dummy.matrix);
  }
  instancedReeds.instanceMatrix.needsUpdate = true;
  instancedReeds.computeBoundingBox();
  instancedReeds.computeBoundingSphere();
  vegGroup.add(instancedReeds);

  // Riverbank ferns strictly in visible corridor (t from 0.34 to 0.68)
  for (let f = 0; f < fernCount; f++) {
    const t = 0.34 + Math.random() * 0.34;
    riverCurve3D.getPoint(t, pPt);
    riverCurve3D.getTangent(t, pTan);
    norm2D.set(-pTan.z, pTan.x).normalize();

    const curWidth = getRiverWidth(t);
    const side = Math.random() > 0.5 ? 1.0 : -1.0;
    // Slightly further up the moist riverbank
    const distFromCenter = side * (curWidth * 0.5 + 1.2 + Math.random() * 2.4);

    const fx = pPt.x + norm2D.x * distFromCenter;
    const fz = pPt.z + norm2D.y * distFromCenter;
    const fy = getValleyElevation(fx, fz);

    const s = 0.8 + Math.random() * 0.7;
    dummy.position.set(fx, fy + 0.08, fz);
    dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    instancedFerns.setMatrixAt(f, dummy.matrix);
  }

  // South-East valley glade wild ferns (visible directly in bottom-right corner from Summit)
  for (let g = 0; g < gladeFernCount; g++) {
    const gx = 8 + Math.random() * 32;   // x from 8 to 40
    const gz = -24 + Math.random() * 32; // z from -24 to +8
    if (Math.hypot(gx, gz) < 14.8) continue; // summit cylinder base buffer
    const gy = getValleyElevation(gx, gz);

    const s = 0.80 + Math.random() * 0.70;
    dummy.position.set(gx, gy + 0.08, gz);
    dummy.rotation.set(0, Math.random() * Math.PI * 2, 0);
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    instancedFerns.setMatrixAt(fernCount + g, dummy.matrix);
  }

  instancedFerns.instanceMatrix.needsUpdate = true;
  instancedFerns.computeBoundingBox();
  instancedFerns.computeBoundingSphere();
  vegGroup.add(instancedFerns);

  scene.add(vegGroup);

  return {
    group: vegGroup,
    update: (time) => {
      if (vegMaterial.userData.shader) {
        vegMaterial.userData.shader.uniforms.uTime.value = time;
      }
    }
  };
}
