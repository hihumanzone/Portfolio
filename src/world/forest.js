import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { getValleyElevation, isInsideMountain } from './mountain.js';
import { isInsideRiver } from './river.js';

/**
 * Enhanced Procedural Alpine Forest System
 *
 * Features:
 * 1. 4 Distinct Tree Archetypes + 1 Understory Shrub Archetype
 *    - Archetype A: Multi-Tier Low-Poly Alpine Spruce (4 stepped bough skirts)
 *    - Archetype B: Tall Slender Lodgepole Pine (high compact canopy + tall bare trunk)
 *    - Archetype C: Compact Pyramidal Mountain Fir (broad low boughs, talus slope hardy)
 *    - Archetype D: Subalpine Birch / Aspen Accent (pale slender trunk + faceted leaf clumps)
 *    - Archetype E: Valley Understory Mountain Bushes (faceted clusters filling the floor)
 * 2. Dual Vertex Colors: Rich Cedar Bark for trunks, Organic Multi-Palette for foliage
 * 3. Directional Wind & Sway Shader matching NW 14KT breeze with harmonic flutter
 * 4. Ecological Clustering: Dense evergreen groves, river glades, and subalpine tree lines
 */

// -----------------------------------------------------------------------------
// Helper: Assign vertex color and aIsFoliage attribute to a geometry
// -----------------------------------------------------------------------------
function tagGeometry(geo, color, isFoliage) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const count = g.attributes.position.count;
  const colors = new Float32Array(count * 3);
  const foliage = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    colors[i * 3]     = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    foliage[i] = isFoliage ? 1.0 : 0.0;
  }

  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.setAttribute('aIsFoliage', new THREE.BufferAttribute(foliage, 1));
  return g;
}

// -----------------------------------------------------------------------------
// 1. ARCHETYPE A: Multi-Tiered Alpine Spruce (4 Conical Skirts)
// -----------------------------------------------------------------------------
function createAlpineSpruceGeometry() {
  const parts = [];
  const colBark = new THREE.Color(0x352317);
  const colFoliageBase = new THREE.Color(1.0, 1.0, 1.0);

  // Sturdy anchored trunk extending below y = 0
  const trunk = new THREE.CylinderGeometry(0.18, 0.32, 1.8, 5);
  trunk.translate(0, 0.65, 0);
  parts.push(tagGeometry(trunk, colBark, false));

  // 4 Stepped Faceted Cones
  const tiers = [
    { r: 1.75, h: 1.8, y: 1.7 },
    { r: 1.35, h: 1.7, y: 2.8 },
    { r: 0.95, h: 1.5, y: 3.8 },
    { r: 0.55, h: 1.3, y: 4.7 }
  ];

  tiers.forEach(t => {
    const cone = new THREE.ConeGeometry(t.r, t.h, 5);
    cone.translate(0, t.y, 0);
    parts.push(tagGeometry(cone, colFoliageBase, true));
  });

  return BufferGeometryUtils.mergeGeometries(parts, false);
}

// -----------------------------------------------------------------------------
// 2. ARCHETYPE B: Tall Slender Lodgepole Pine (Bare Trunk + High Crown)
// -----------------------------------------------------------------------------
function createLodgepolePineGeometry() {
  const parts = [];
  const colBark = new THREE.Color(0x3d291c);
  const colFoliageBase = new THREE.Color(1.0, 1.0, 1.0);

  // Tall straight timber trunk
  const trunk = new THREE.CylinderGeometry(0.13, 0.23, 3.4, 5);
  trunk.translate(0, 1.5, 0);
  parts.push(tagGeometry(trunk, colBark, false));

  // 3 Compact High Tiers
  const tiers = [
    { r: 1.15, h: 1.9, y: 3.7 },
    { r: 0.85, h: 1.7, y: 4.8 },
    { r: 0.50, h: 1.4, y: 5.8 }
  ];

  tiers.forEach(t => {
    const cone = new THREE.ConeGeometry(t.r, t.h, 5);
    cone.translate(0, t.y, 0);
    parts.push(tagGeometry(cone, colFoliageBase, true));
  });

  return BufferGeometryUtils.mergeGeometries(parts, false);
}

// -----------------------------------------------------------------------------
// 3. ARCHETYPE C: Compact Pyramidal Mountain Fir (Broad Foothill Hardy)
// -----------------------------------------------------------------------------
function createPyramidalFirGeometry() {
  const parts = [];
  const colBark = new THREE.Color(0x2d1f15);
  const colFoliageBase = new THREE.Color(1.0, 1.0, 1.0);

  // Short thick anchored trunk
  const trunk = new THREE.CylinderGeometry(0.20, 0.32, 1.2, 6);
  trunk.translate(0, 0.45, 0);
  parts.push(tagGeometry(trunk, colBark, false));

  // 3 Wide Pyramidal Tiers touching low near ground
  const tiers = [
    { r: 1.95, h: 2.2, y: 1.45 },
    { r: 1.40, h: 2.0, y: 2.65 },
    { r: 0.80, h: 1.7, y: 3.85 }
  ];

  tiers.forEach(t => {
    const cone = new THREE.ConeGeometry(t.r, t.h, 6);
    cone.translate(0, t.y, 0);
    parts.push(tagGeometry(cone, colFoliageBase, true));
  });

  return BufferGeometryUtils.mergeGeometries(parts, false);
}

// -----------------------------------------------------------------------------
// 4. ARCHETYPE D: Subalpine Aspen / Birch Accent (Pale Trunk + Leaf Clusters)
// -----------------------------------------------------------------------------
function createAspenGeometry() {
  const parts = [];
  const colBark = new THREE.Color(0x756e63); // Weathered pale birch bark
  const colFoliageBase = new THREE.Color(1.0, 1.0, 1.0);

  // Graceful slender trunk
  const trunk = new THREE.CylinderGeometry(0.12, 0.19, 2.5, 5);
  trunk.rotateZ(0.08);
  trunk.translate(0, 1.15, 0);
  parts.push(tagGeometry(trunk, colBark, false));

  // Clustered faceted foliage boughs
  const clumps = [
    { r: 0.92, x:  0.15, y: 2.6, z:  0.12, sy: 0.85 },
    { r: 0.80, x: -0.18, y: 3.1, z: -0.10, sy: 0.90 },
    { r: 0.65, x:  0.08, y: 3.65, z:  0.06, sy: 0.82 }
  ];

  clumps.forEach(c => {
    const bough = new THREE.DodecahedronGeometry(c.r, 0);
    bough.scale(1.0, c.sy, 1.0);
    bough.translate(c.x, c.y, c.z);
    parts.push(tagGeometry(bough, colFoliageBase, true));
  });

  return BufferGeometryUtils.mergeGeometries(parts, false);
}

// -----------------------------------------------------------------------------
// 5. ARCHETYPE E: Valley Understory Mountain Bush / Shrub
// -----------------------------------------------------------------------------
function createValleyShrubGeometry() {
  const parts = [];
  const colFoliageBase = new THREE.Color(1.0, 1.0, 1.0);

  const clump1 = new THREE.DodecahedronGeometry(0.75, 0);
  clump1.scale(1.25, 0.70, 1.1);
  clump1.translate(0, 0.45, 0);
  parts.push(tagGeometry(clump1, colFoliageBase, true));

  const clump2 = new THREE.DodecahedronGeometry(0.55, 0);
  clump2.scale(1.1, 0.65, 1.0);
  clump2.translate(0.35, 0.40, 0.25);
  parts.push(tagGeometry(clump2, colFoliageBase, true));

  return BufferGeometryUtils.mergeGeometries(parts, false);
}

// -----------------------------------------------------------------------------
// Custom Wind Shader Material
// -----------------------------------------------------------------------------
function createForestMaterial() {
  const treeMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.84,
    metalness: 0.08,
    flatShading: true,
    vertexColors: true
  });

  treeMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    treeMaterial.userData.shader = shader;

    shader.vertexShader = `
      attribute float aIsFoliage;
      uniform float uTime;
      ${shader.vertexShader}
    `;

    // 1. Separate Bark vs Instance Color:
    // If aIsFoliage == 0.0 (trunk), preserve rich cedar bark color.
    // If aIsFoliage == 1.0 (foliage), apply per-instance foliage palette.
    shader.vertexShader = shader.vertexShader.replace(
      '#include <color_vertex>',
      `
      #if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
        vColor = vec4( 1.0 );
      #endif
      #if defined( USE_COLOR ) && defined( USE_INSTANCING_COLOR )
        vColor.xyz = mix(color.xyz, instanceColor.xyz, aIsFoliage);
      #elif defined( USE_COLOR )
        vColor.xyz = color.xyz;
      #elif defined( USE_INSTANCING_COLOR )
        vColor.xyz = instanceColor.xyz;
      #endif
      `
    );

    // 2. Multi-Harmonic Wind & Sway (Aligned with NW 14KT mountain breeze)
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>

      #ifdef USE_INSTANCING
        vec4 worldPos = instanceMatrix * vec4(transformed, 1.0);
      #else
        vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
      #endif

      // Wind direction NW: coordinate projection
      float windPhase = (worldPos.x * -0.05 + worldPos.z * 0.05);
      float windCross = (worldPos.x * 0.04 + worldPos.z * 0.04);

      // Multi-layer harmonic gusts (broad rolling front + high-frequency foliage flutter)
      float gustWave = sin(uTime * 1.6 + windPhase * 2.0 + sin(windCross * 1.5) * 0.6);
      float flutter  = cos(uTime * 3.5 + worldPos.x * 0.28) * 0.26;
      float wave     = gustWave * 0.78 + flutter * 0.22;

      // Ground anchoring: bases firmly embedded in earth have 0 sway
      float swayFactor = pow(max(0.0, transformed.y - 0.45) * 0.15, 1.35) * aIsFoliage;

      // Displace towards NW (-X, +Z)
      transformed.x += wave * swayFactor * -1.0;
      transformed.z += wave * swayFactor * 0.8;
      transformed.y -= abs(wave) * swayFactor * 0.12;
      `
    );
  };

  return treeMaterial;
}

// -----------------------------------------------------------------------------
// Curated Color Palettes for Diverse Alpine Species
// -----------------------------------------------------------------------------
const EVERGREEN_PALETTE = [
  new THREE.Color(0x13383a), // Rich twilight spruce
  new THREE.Color(0x163e3d), // Deep alpine green
  new THREE.Color(0x184452), // Glacial blue spruce
  new THREE.Color(0x1e4e5e), // Crisp moonlit teal fir
  new THREE.Color(0x1a483a), // Highland pine
  new THREE.Color(0x112b33), // Shadowed forest fir
  new THREE.Color(0x235766), // Frost crest spruce
  new THREE.Color(0x295b68)  // Subalpine mountain pine
];

const ASPEN_PALETTE = [
  new THREE.Color(0x384c30), // Golden-green subalpine aspen
  new THREE.Color(0x445836), // Twilight birch foliage
  new THREE.Color(0x4f603c), // Warm autumn meadow leaf
  new THREE.Color(0x33452b)  // Deep valley willow
];

const SHRUB_PALETTE = [
  new THREE.Color(0x1b4438), // Mountain juniper
  new THREE.Color(0x224e42), // Alpine heath
  new THREE.Color(0x163b36), // Subalpine shrub
  new THREE.Color(0x2d5540)  // Highland mossy bush
];

function pickColor(palette, x, z, y, out) {
  const hash = Math.sin(x * 12.9898 + z * 78.233 + y * 37.719) * 43758.5453;
  const idx = Math.floor(Math.abs(hash) % palette.length);
  const baseCol = out.copy(palette[idx]);
  // Subtle organic lightness shift
  const shift = ((hash - Math.floor(hash)) - 0.5) * 0.08;
  baseCol.offsetHSL(0, 0, shift);
  return baseCol;
}

// -----------------------------------------------------------------------------
// Waypoint Frustum Envelope & Spatial Sector Partitioning
// -----------------------------------------------------------------------------
const WAYPOINT_DEFS = [
  { pos: new THREE.Vector3(14, 11.5, 17), target: new THREE.Vector3(-1.5, 7.8, 0), fov: 54 },
  { pos: new THREE.Vector3(-0.2, 9.75, 5.8), target: new THREE.Vector3(-1.7, 8.85, 0.9), fov: 50 },
  { pos: new THREE.Vector3(6.4, 8.7, 4.5), target: new THREE.Vector3(2.5, 7.3, 2.3), fov: 50 },
  { pos: new THREE.Vector3(1.8, 14.2, 5.5), target: new THREE.Vector3(-0.8, 13.8, -1.4), fov: 54 }
];

function createWaypointFrustums() {
  const frustums = [];
  const aspect = 2.4; // Broad coverage for ultrawide & multi-monitor displays
  const offsets = [
    [0, 0],
    [-1.5, -1.5],
    [1.5, 1.5],
    [-1.5, 1.5],
    [1.5, -1.5]
  ];

  WAYPOINT_DEFS.forEach(wp => {
    offsets.forEach(([ox, oz]) => {
      const cam = new THREE.PerspectiveCamera(wp.fov, aspect, 0.1, 500);
      cam.position.set(wp.pos.x + ox, wp.pos.y, wp.pos.z + oz);
      cam.lookAt(wp.target.x - ox * 0.5, wp.target.y, wp.target.z - oz * 0.5);
      cam.updateMatrixWorld();
      cam.updateProjectionMatrix();
      const f = new THREE.Frustum();
      f.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
      frustums.push(f);
    });
  });

  return frustums;
}

const WAYPOINT_FRUSTUMS = createWaypointFrustums();
const _visTestSphere = new THREE.Sphere(new THREE.Vector3(), 4.0);

/**
 * Checks if a candidate position is visible in any camera waypoint.
 * Trees failing this check are never instantiated or added.
 */
function isPointVisibleInAnyWaypoint(x, y, z, radius = 3.5) {
  // Fast bounding box early rejection (behind camera or outside visible valley footprint)
  if (x < -215 || x > 48 || z < -125 || z > 28) {
    return false;
  }

  _visTestSphere.center.set(x, y, z);
  _visTestSphere.radius = radius;

  for (let i = 0; i < WAYPOINT_FRUSTUMS.length; i++) {
    if (WAYPOINT_FRUSTUMS[i].intersectsSphere(_visTestSphere)) {
      return true;
    }
  }

  return false;
}

/**
 * Assigns an (x, z) coordinate to one of 6 spatial sectors across the visible valley.
 * Enables Three.js to automatically frustum-cull out-of-view sectors on each frame.
 */
function getSectorIndex(x, z) {
  const col = x < -105 ? 0 : (x < -20 ? 1 : 2);
  const row = z < -45 ? 0 : 1;
  return row * 3 + col;
}

// -----------------------------------------------------------------------------
// Main Forest Generator
// -----------------------------------------------------------------------------
export function createForest(scene) {
  const forestGroup = new THREE.Group();
  forestGroup.name = 'AlpineForestSystem';

  const forestMaterial = createForestMaterial();
  const dummy = new THREE.Object3D();

  // Curated Archetype Configurations:
  // Counts scaled to the visible valley footprint to preserve 100% of the authentic visual tree density
  const archetypes = [
    {
      id: 'spruce',
      count: 620,
      geo: createAlpineSpruceGeometry(),
      margin: 2.7,
      riverMargin: 4.4,
      scaleMin: 0.70,
      scaleMax: 1.35,
      palette: EVERGREEN_PALETTE
    },
    {
      id: 'lodgepole',
      count: 510,
      geo: createLodgepolePineGeometry(),
      margin: 2.5,
      riverMargin: 4.2,
      scaleMin: 0.65,
      scaleMax: 1.25,
      palette: EVERGREEN_PALETTE
    },
    {
      id: 'fir',
      count: 390,
      geo: createPyramidalFirGeometry(),
      margin: 2.8,
      riverMargin: 4.2,
      scaleMin: 0.60,
      scaleMax: 1.20,
      palette: EVERGREEN_PALETTE
    },
    {
      id: 'aspen',
      count: 140,
      geo: createAspenGeometry(),
      margin: 2.5,
      riverMargin: 3.5,
      scaleMin: 0.65,
      scaleMax: 1.15,
      palette: ASPEN_PALETTE
    },
    {
      id: 'shrub',
      count: 210,
      geo: createValleyShrubGeometry(),
      margin: 1.9,
      riverMargin: 3.2,
      scaleMin: 0.50,
      scaleMax: 1.10,
      palette: SHRUB_PALETTE
    }
  ];

  archetypes.forEach(arch => {
    arch.geo.computeVertexNormals();
  });

  // Collect placed instances partitioned by (sectorIndex, archetypeIndex)
  // 6 sectors x 5 archetypes
  const sectorInstances = Array.from({ length: 6 }, () => 
    archetypes.map(() => ({ matrices: [], colors: [] }))
  );

  archetypes.forEach((arch, archIdx) => {
    let placed = 0;
    let attempts = 0;
    const maxAttempts = arch.count * 25;
    const clearingQuota = Math.round(arch.count * 0.009);
    // Memoize valley elevation per quantized (x,z) — placement probes revisit
    // nearby coordinates across archetypes and margin checks
    const elevCache = new Map();
    const cachedElevation = (x, z) => {
      const key = `${Math.round(x * 2)}:${Math.round(z * 2)}`;
      let v = elevCache.get(key);
      if (v === undefined) {
        v = getValleyElevation(x, z);
        elevCache.set(key, v);
      }
      return v;
    };
    const tmpColor = new THREE.Color();
    const tmpMatrix = new THREE.Matrix4();
    const tmpCol = new THREE.Color();

    while (placed < arch.count && attempts < maxAttempts) {
      attempts++;

      let x, z;
      if (placed < clearingQuota) {
        x = 10.5 + Math.random() * 15;
        z = -18 + Math.random() * 22;
      } else {
        // Sample strictly within the visible valley envelope
        x = -215 + Math.random() * 260; // x from -215 to +45
        z = -125 + Math.random() * 151; // z from -125 to +26
      }

      // 1. Central Summit Mountain Cliff exclusion (cylinder base radius is ~14.2m)
      if (Math.hypot(x, z) < 14.8 + arch.margin * 0.5) continue;

      // 2. Mountain collision check
      if (isInsideMountain(x, z, arch.margin)) continue;

      // 3. River corridor clearance check
      if (isInsideRiver(x, z, arch.riverMargin)) continue;

      // 4. Natural Glade / Meadow Density Modulation
      const groveDensity = Math.sin(x * 0.032) * Math.cos(z * 0.035) +
                           Math.sin(x * 0.075 + z * 0.06) * 0.4;
      if (groveDensity < -0.65 && arch.id !== 'aspen') {
        if (Math.random() > 0.15) continue;
      }

      const yElevation = cachedElevation(x, z);
      const scaleRange = arch.scaleMax - arch.scaleMin;
      const s = arch.scaleMin + Math.random() * scaleRange;

      // 5. Frustum Visibility Check: Never add trees that are not visible in any waypoint
      if (!isPointVisibleInAnyWaypoint(x, yElevation, z, s * 2.5)) {
        continue;
      }

      dummy.position.set(x, yElevation, z);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.scale.set(s, s * (0.92 + Math.random() * 0.25), s);
      dummy.updateMatrix();

      const col = pickColor(arch.palette, x, z, yElevation, tmpColor);
      const sector = getSectorIndex(x, z);

      // Copy values instead of cloning heap objects per instance
      tmpMatrix.copy(dummy.matrix);
      tmpCol.copy(col);
      sectorInstances[sector][archIdx].matrices.push(tmpMatrix.clone());
      sectorInstances[sector][archIdx].colors.push(tmpCol.clone());

      placed++;
    }
  });

  // Build sector InstancedMeshes with compact bounding spheres for native Three.js frustum culling
  for (let s = 0; s < 6; s++) {
    for (let a = 0; a < archetypes.length; a++) {
      const data = sectorInstances[s][a];
      const count = data.matrices.length;
      if (count === 0) continue;

      const instMesh = new THREE.InstancedMesh(archetypes[a].geo, forestMaterial, count);
      instMesh.castShadow = false;
      instMesh.receiveShadow = true;

      for (let i = 0; i < count; i++) {
        instMesh.setMatrixAt(i, data.matrices[i]);
        instMesh.setColorAt(i, data.colors[i]);
      }

      instMesh.instanceMatrix.needsUpdate = true;
      if (instMesh.instanceColor) {
        instMesh.instanceColor.needsUpdate = true;
      }

      instMesh.computeBoundingBox();
      instMesh.computeBoundingSphere();
      forestGroup.add(instMesh);
    }
  }

  scene.add(forestGroup);

  return {
    group: forestGroup,
    update: (time) => {
      if (forestMaterial.userData.shader) {
        forestMaterial.userData.shader.uniforms.uTime.value = time;
      }
    }
  };
}
