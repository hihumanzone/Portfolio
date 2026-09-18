import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { getCarvedValleyElevation } from './riverPath.js';

// Exact mathematical valley terrain elevation at world coordinate (x, z)
// Automatically carves a smooth natural riverbed channel along the river path
export function getValleyElevation(x, z) {
  const raw = -5.0 + (Math.sin(x * 0.04) * Math.cos(z * 0.04) * 4.0) + (Math.sin(x * 0.08) * 1.8);
  return getCarvedValleyElevation(x, z, raw);
}

// Deterministic pseudo-random hash for procedural variation
function hash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

// Deterministic Distant Mountain Ridge Peak Definitions (Sculpted alpine massifs, crags, and ridges)
export const RIDGE_PEAKS = [
  // --- EAST / NORTH-EAST BACKDROP (Towering Massifs, Dramatic Horns, and Rugged Ridges on Screen Right) ---
  // The Great Northeast Massif (Dominant 4-ridge alpine massif with sprawling snowfields)
  { name: 'East_DistantWall',        x: 0.3,   z: -131.1, radius: 34, height: 54, segs: 6, scaleX: 1.3,  scaleZ: 0.8, rot: 0.4,  ridgeCount: 4, ridgeAmp: 0.30, twist: 0.25, hasSnow: true, snowLine: 0.54 },
  // Northeast Craggy Shoulder (Asymmetrical flank)
  { name: 'East_HighMassif',         x: -5.2,  z: -90.3,  radius: 26, height: 46, segs: 5, scaleX: 1.0,  scaleZ: 1.2, rot: -0.3, ridgeCount: 3, ridgeAmp: 0.34, twist: 0.35, hasSnow: true, snowLine: 0.58 },
  // Alpine Sharp Needle (Steep 3-sided horn rising behind the campfire)
  { name: 'East_SharpCrag',          x: -11.3, z: -73.6,  radius: 17, height: 43, segs: 4, scaleX: 0.9,  scaleZ: 0.9, rot: 0.8,  ridgeCount: 3, ridgeAmp: 0.38, twist: 0.45, hasSnow: true, snowLine: 0.60, jx: 1.2, jz: -0.8 },
  // East Valley Ridge (Broad midground massif)
  { name: 'East_MidRidge',           x: -31.6, z: -97.9,  radius: 30, height: 48, segs: 5, scaleX: 1.2,  scaleZ: 0.9, rot: 0.2,  ridgeCount: 4, ridgeAmp: 0.32, twist: -0.3, hasSnow: true, snowLine: 0.56 },
  // Campfire Vista Sentinel (Grounded overlook peak)
  { name: 'East_CampfireOverlook',   x: -25.7, z: -57.0,  radius: 22, height: 39, segs: 5, scaleX: 1.1,  scaleZ: 1.0, rot: -0.5, ridgeCount: 3, ridgeAmp: 0.34, twist: 0.30, hasSnow: true, snowLine: 0.62 },
  // Deep Background Horn (Distant pyramid cresting through the ridge)
  { name: 'East_DeepSpire',          x: -82.4, z: -132.4, radius: 24, height: 56, segs: 4, scaleX: 0.8,  scaleZ: 1.1, rot: 0.6,  ridgeCount: 3, ridgeAmp: 0.36, twist: 0.40, hasSnow: true, snowLine: 0.50 },

  // --- NEW EAST FLANK RIDGES (Fills blank space on Screen Right in Signal Tower & Panoramic views) ---
  // Mid-East Jagged Horn (Rises to the right of East_DistantWall, visible in Signal Tower)
  { name: 'East_FlankHorn',          x: 12.5,  z: -85.0,  radius: 20, height: 43, segs: 5, scaleX: 1.0,  scaleZ: 1.1, rot: 0.5,  ridgeCount: 3, ridgeAmp: 0.36, twist: 0.35, hasSnow: true, snowLine: 0.58, jx: 0.8, jz: -0.6 },
  // Towering Eastern Ridge Wall
  { name: 'East_RidgeWall',          x: 22.0,  z: -112.0, radius: 32, height: 50, segs: 6, scaleX: 1.2,  scaleZ: 0.9, rot: -0.3, ridgeCount: 4, ridgeAmp: 0.32, twist: -0.25,hasSnow: true, snowLine: 0.54 },
  // Deep Distant Apex Massif on far right
  { name: 'East_DistantApex',        x: 36.0,  z: -142.0, radius: 36, height: 56, segs: 6, scaleX: 1.3,  scaleZ: 0.8, rot: 0.3,  ridgeCount: 4, ridgeAmp: 0.30, twist: 0.30, hasSnow: true, snowLine: 0.52 },
  // Eastern Overlook Shoulder (Midground crags framing right screen)
  { name: 'East_OverlookMid',        x: 25.0,  z: -70.0,  radius: 18, height: 34, segs: 5, scaleX: 1.1,  scaleZ: 1.0, rot: -0.6, ridgeCount: 3, ridgeAmp: 0.28, twist: 0.25, hasSnow: false },
  // Eastern Horizon Ridge Shoulder
  { name: 'East_HorizonShoulder',    x: 34.0,  z: -90.0,  radius: 28, height: 38, segs: 5, scaleX: 1.2,  scaleZ: 0.9, rot: 0.4,  ridgeCount: 3, ridgeAmp: 0.28, twist: -0.20,hasSnow: true, snowLine: 0.62 },
  // Receding Eastern Vista Foothill
  { name: 'East_VistaFoothill',      x: 48.0,  z: -72.0,  radius: 26, height: 26, segs: 5, scaleX: 1.3,  scaleZ: 0.8, rot: -0.4, ridgeCount: 3, ridgeAmp: 0.25, twist: 0.15, hasSnow: false },

  // --- CENTER (Screen Center, framing the Cabin & Chimney) ---
  // Cabin Sentinel Massif (Broad 4-ridge alpine backdrop with jagged snow-dusted aretes behind chimney smoke)
  { name: 'Center_CabinBackdrop',    x: -49.4, z: -58.7,  radius: 28, height: 46, segs: 6, scaleX: 1.3,  scaleZ: 0.8, rot: 0.1,  ridgeCount: 4, ridgeAmp: 0.32, twist: 0.25, hasSnow: true, snowLine: 0.54, jx: -0.8, jz: -0.5 },
  // Deep Northern Horizon Spire (Receding background horn behind the cabin roof)
  { name: 'Center_NorthSpire',       x: -97.2, z: -95.2,  radius: 22, height: 52, segs: 5, scaleX: 0.9,  scaleZ: 1.1, rot: -0.4, ridgeCount: 3, ridgeAmp: 0.36, twist: -0.35,hasSnow: true, snowLine: 0.52 },

  // --- WESTERN RIDGE (Screen Left: Organic Massifs, Saddles, Twin Horns, Buttresses, and Receding Foothills) ---
  // Massif 1: Porch Overlook Horn (Sharp 3-sided crag with tilted apex and snow crest)
  { name: 'West_PorchCrag',          x: -75.0, z: -56.0,  radius: 19, height: 38, segs: 4, scaleX: 0.85, scaleZ: 1.1, rot: 0.7,  ridgeCount: 3, ridgeAmp: 0.38, twist: 0.40, hasSnow: true, snowLine: 0.58, jx: -1.5, jz: 0.5 },
  // Massif 1: Porch Overlook Shoulder (Broad sprawling base supporting the horn)
  { name: 'West_PorchShoulder',      x: -95.8, z: -60.3,  radius: 32, height: 31, segs: 6, scaleX: 1.4,  scaleZ: 0.8, rot: -0.2, ridgeCount: 4, ridgeAmp: 0.28, twist: 0.20, hasSnow: false },

  // Natural Mountain Pass / Valley Saddle (Foreground dip with a towering distant peak visible through it)
  { name: 'West_SaddleGapDip',       x: -88.6, z: -48.2,  radius: 24, height: 23, segs: 5, scaleX: 1.2,  scaleZ: 0.9, rot: 0.3,  ridgeCount: 3, ridgeAmp: 0.26, twist: -0.20,hasSnow: false },
  { name: 'West_GapDistantSpire',    x: -154.5,z: -76.7,  radius: 21, height: 39, segs: 4, scaleX: 0.8,  scaleZ: 1.1, rot: -0.6, ridgeCount: 3, ridgeAmp: 0.34, twist: 0.30, hasSnow: true, snowLine: 0.56 },

  // Massif 2: Twin Horns (Asymmetrical jagged horn rising above the saddle + broad sprawling dome)
  { name: 'West_HornMain',           x: -115.8,z: -48.0,  radius: 17, height: 34, segs: 5, scaleX: 0.9,  scaleZ: 1.0, rot: 0.5,  ridgeCount: 3, ridgeAmp: 0.36, twist: 0.35, hasSnow: true, snowLine: 0.60, jx: 1.0, jz: -1.0 },
  { name: 'West_HornBroadDome',      x: -140.9,z: -52.4,  radius: 35, height: 25, segs: 6, scaleX: 1.5,  scaleZ: 0.7, rot: -0.3, ridgeCount: 4, ridgeAmp: 0.25, twist: 0.15, hasSnow: false },
  { name: 'West_MidSisterPeak',      x: -180.2,z: -69.7,  radius: 23, height: 33, segs: 5, scaleX: 1.0,  scaleZ: 1.2, rot: 0.4,  ridgeCount: 3, ridgeAmp: 0.32, twist: 0.25, hasSnow: true, snowLine: 0.60 },

  // Massif 3: Western Buttress (Sharp craggy buttress and elongated alpine ridge)
  { name: 'West_ButtressCrag',       x: -136.4,z: -42.1,  radius: 16, height: 25, segs: 4, scaleX: 0.9,  scaleZ: 0.9, rot: -0.7, ridgeCount: 3, ridgeAmp: 0.30, twist: -0.20,hasSnow: false },
  { name: 'West_ButtressShoulder',   x: -166.4,z: -40.9,  radius: 30, height: 21, segs: 5, scaleX: 1.3,  scaleZ: 0.8, rot: 0.2,  ridgeCount: 3, ridgeAmp: 0.26, twist: 0.20, hasSnow: false },
  { name: 'West_DistantWallNorth',   x: -217.8,z: -54.8,  radius: 25, height: 29, segs: 6, scaleX: 1.2,  scaleZ: 1.0, rot: -0.5, ridgeCount: 4, ridgeAmp: 0.28, twist: -0.30,hasSnow: true, snowLine: 0.58 },

  // Receding Alpine Foothills (Tapering naturally into the horizon haze on the far left)
  { name: 'West_FoothillRidgeA',     x: -158.0,z: -32.3,  radius: 22, height: 18, segs: 5, scaleX: 1.3,  scaleZ: 0.8, rot: 0.6,  ridgeCount: 3, ridgeAmp: 0.24, twist: 0.20, hasSnow: false },
  { name: 'West_FarSpire',           x: -209.8,z: -32.2,  radius: 16, height: 22, segs: 4, scaleX: 0.85, scaleZ: 1.0, rot: -0.3, ridgeCount: 3, ridgeAmp: 0.30, twist: 0.25, hasSnow: false },
  { name: 'West_TaperingLowHill',    x: -189.9,z: -25.0,  radius: 24, height: 15, segs: 6, scaleX: 1.4,  scaleZ: 0.7, rot: 0.1,  ridgeCount: 3, ridgeAmp: 0.22, twist: 0.10, hasSnow: false },
  { name: 'West_HorizonFadeRidge',   x: -242.1,z: -21.7,  radius: 22, height: 17, segs: 5, scaleX: 1.1,  scaleZ: 1.0, rot: -0.4, ridgeCount: 3, ridgeAmp: 0.22, twist: 0.10, hasSnow: false }
];

// Comprehensive Collision Check: Returns true if (x, z) is inside or too close to any mountain
export function isInsideMountain(x, z, safetyMargin = 2.2) {
  // 1. Central Summit Mountain Cliff exclusion
  // Summit cylinder has top radius 7.5m (y=7) and base radius ~13.8m at valley elevation
  const distFromCenter = Math.hypot(x, z);
  if (distFromCenter < 14.5 + safetyMargin * 0.6) {
    return true;
  }

  // 2. Valley mesh extent boundary
  if (Math.abs(x) > 220 || Math.abs(z) > 220) {
    return true;
  }

  const valleyY = getValleyElevation(x, z);

  // 3. Proximity & elevation check for every mountain cone
  for (let i = 0; i < RIDGE_PEAKS.length; i++) {
    const p = RIDGE_PEAKS[i];
    const maxR = p.radius * 1.5 + safetyMargin;
    let dx = x - p.x;
    let dz = z - p.z;
    if (Math.abs(dx) > maxR || Math.abs(dz) > maxR) {
      continue;
    }

    if (p.rot) {
      const cosR = Math.cos(-p.rot);
      const sinR = Math.sin(-p.rot);
      const rx = dx * cosR - dz * sinR;
      const rz = dx * sinR + dz * cosR;
      dx = rx;
      dz = rz;
    }
    const sx = p.scaleX || 1.0;
    const sz = p.scaleZ || 1.0;
    const normDist = Math.hypot(dx / sx, dz / sz);

    // Calculate mountain collision radius at current valley elevation.
    // Mountains in createAlpineMassifMesh have steep rock crags in upper tiers, while
    // the lower talus apron tapers gently into the valley floor where trees naturally grow up to the base.
    const peakApexY = p.height * 0.95 - 5;
    const rAtGround = ((peakApexY - valleyY) / p.height) * p.radius;
    const effectiveRadius = Math.min(Math.max(0, rAtGround), p.radius) * 0.70;

    if (normDist < effectiveRadius + safetyMargin) {
      return true;
    }
  }

  return false;
}

// Procedural Alpine Massif Geometry Generator
// Builds multi-tiered, faceted low-poly mountains with knife-edge arete ridges,
// couloirs, flaring talus bases, and slope-aware vertex colors.
function createAlpineMassifMesh(p, idx) {
  const radialSegs = 14;
  const heightSegs = 10;
  const radius = p.radius;
  const height = p.height;
  const ridgeCount = p.ridgeCount || 3;
  const ridgeAmp = p.ridgeAmp !== undefined ? p.ridgeAmp : 0.32;
  const twist = p.twist !== undefined ? p.twist : 0.3;
  const tiltX = (p.jx || 0) * 1.5;
  const tiltZ = (p.jz || 0) * 1.5;

  const positions = [];
  const indices = [];

  // 1. Generate concentric height rings from base (j = 0, t = 0) to shoulder (j = heightSegs - 1)
  for (let j = 0; j < heightSegs; j++) {
    const t = j / (heightSegs - 1); // 0 at base, 1 at top ring
    // Non-linear alpine profile: steep upper crags, gently flaring scree base
    const profileR = (Math.pow(1.0 - t * 0.94, 0.78)) * radius;
    const yBase = t * (height * 0.92);

    for (let i = 0; i < radialSegs; i++) {
      const angle = (i / radialSegs) * Math.PI * 2;

      // Primary Arête Ridges (sharpened cosine wave)
      const ridgeVal = Math.cos(ridgeCount * angle + (p.rot || 0) + twist * t);
      const ridgeShape = Math.sign(ridgeVal) * Math.pow(Math.abs(ridgeVal), 0.72);

      // Secondary fine cross-ridge / couloir texture
      const subRidge = 0.20 * Math.cos(ridgeCount * 2 * angle + 1.25);

      // Radial perturbation
      let r = profileR * (1.0 + ridgeAmp * ridgeShape + subRidge);

      // Faceted low-poly pseudo-noise jitter
      const jitter = (hash(j * 43 + i * 17 + idx * 31) - 0.5) * 0.15 * (1.0 - t * 0.4) * radius;
      r = Math.max(0.2, r + jitter);

      // Ridges are slightly elevated along their spines
      const ridgeHeightBoost = ridgeShape > 0 ? ridgeShape * height * 0.05 * (1.0 - t) * t * 4.0 : 0;
      let yLocal = yBase + ridgeHeightBoost - 5.0;

      // Lateral tilt for natural wind-sculpted asymmetry
      const xLocal = r * Math.cos(angle) + tiltX * Math.pow(t, 1.35);
      const zLocal = r * Math.sin(angle) + tiltZ * Math.pow(t, 1.35);

      // Ground anchoring: base ring (j = 0) firmly embeds into the valley elevation
      if (j === 0) {
        // Calculate world coordinates of this base vertex
        const cosR = Math.cos(p.rot || 0);
        const sinR = Math.sin(p.rot || 0);
        const sx = p.scaleX || 1.0;
        const sz = p.scaleZ || 1.0;
        const wx = p.x + (xLocal * cosR - zLocal * sinR) * sx;
        const wz = p.z + (xLocal * sinR + zLocal * cosR) * sz;
        const valleyY = getValleyElevation(wx, wz);
        yLocal = Math.min(-5.2, valleyY - 0.8);
      } else if (j === 1) {
        yLocal = Math.max(yLocal, -4.6);
      }

      positions.push(xLocal, yLocal, zLocal);
    }
  }

  // 2. Apex Summit Crest Vertex
  const apexIdx = heightSegs * radialSegs;
  positions.push(tiltX, height - 5.0, tiltZ);

  // 3. Construct Quad Mesh Triangles between Height Tiers
  for (let j = 0; j < heightSegs - 1; j++) {
    const ring0 = j * radialSegs;
    const ring1 = (j + 1) * radialSegs;
    for (let i = 0; i < radialSegs; i++) {
      const next = (i + 1) % radialSegs;
      indices.push(ring0 + i, ring1 + i, ring1 + next);
      indices.push(ring0 + i, ring1 + next, ring0 + next);
    }
  }

  // 4. Connect Top Ring to Apex
  const topRing = (heightSegs - 1) * radialSegs;
  for (let i = 0; i < radialSegs; i++) {
    const next = (i + 1) % radialSegs;
    indices.push(topRing + i, apexIdx, topRing + next);
  }

  // 5. Convert to Non-Indexed Geometry for Flat Faceted Low-Poly Shading
  let geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo = geo.toNonIndexed();
  geo.computeVertexNormals();

  // 6. Compute Rich Per-Face Stylized Colors
  // Layers: Low-poly Snow Caps, Sheer Cliff Granite Striations, Scree Ledges, Alluvial Earth Base
  const posAttr = geo.attributes.position;
  const vertCount = posAttr.count;
  const colors = new Float32Array(vertCount * 3);

  // Directional moonlight direction (aligned with Moon in sky: -156, 49, -110)
  const moonDir = new THREE.Vector3(-156 - p.x, 49 - p.z, -110 - p.z).normalize();

  // Palette definitions
  const cSnowLit    = new THREE.Color(0xdcebf8); // Crisp pale moonlit snow
  const cSnowShadow = new THREE.Color(0x7695b7); // Soft twilight blue snow shadow
  const cFrostRock  = new THREE.Color(0x92aac6); // High altitude frosty rock
  const cRockLit    = new THREE.Color(0x384e70); // Moonlit alpine slate / granite
  const cRockShadow = new THREE.Color(0x1a2538); // Deep shadowed rock precipice
  const cRockLedge  = new THREE.Color(0x486082); // Weathered talus shelf
  const cBaseEarth  = new THREE.Color(0x152534); // Subalpine dark spruce earth / valley transition
  const cFarHaze    = new THREE.Color(0x2d3e64); // Atmospheric depth horizon haze

  // Distance from summit overlook for aerial perspective
  const dist = Math.hypot(p.x - 14, p.z - 17);
  const tDist = Math.max(0, Math.min(1, (dist - 80) / (240 - 80)));

  const p0 = new THREE.Vector3();
  const p1 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const edge1 = new THREE.Vector3();
  const edge2 = new THREE.Vector3();
  const faceNormal = new THREE.Vector3();
  const faceCentroid = new THREE.Vector3();
  const faceColor = new THREE.Color();

  const faceCount = vertCount / 3;
  for (let f = 0; f < faceCount; f++) {
    const i0 = f * 3;
    const i1 = f * 3 + 1;
    const i2 = f * 3 + 2;

    p0.fromBufferAttribute(posAttr, i0);
    p1.fromBufferAttribute(posAttr, i1);
    p2.fromBufferAttribute(posAttr, i2);

    edge1.subVectors(p1, p0);
    edge2.subVectors(p2, p0);
    faceNormal.crossVectors(edge1, edge2).normalize();

    faceCentroid.addVectors(p0, p1).add(p2).multiplyScalar(1 / 3);

    // Normalized altitude t in [0, 1]
    const altT = Math.max(0, Math.min(1, (faceCentroid.y + 5.0) / height));
    const slope = faceNormal.y; // 1 = flat horizontal, 0 = vertical cliff
    const dotMoon = faceNormal.dot(moonDir);
    const moonLitFactor = Math.max(0, Math.min(1, dotMoon * 0.65 + 0.35));

    // Deterministic facet pseudo-random hash for mineral variation
    const hFacet = hash(f * 19.3 + idx * 37.1);

    const snowLine = (p.snowLine || 0.58) + (hFacet - 0.5) * 0.08;

    if (p.hasSnow && altT > snowLine) {
      // High Alpine Snow Zone
      // Realism: Vertical cliff faces (slope < 0.36) shed snow and expose dark granite ribs!
      if (slope < 0.36) {
        // Exposed dark rock face cutting through snowfields
        const rockBase = moonLitFactor > 0.4 ? cRockLit : cRockShadow;
        faceColor.copy(rockBase);
        faceColor.offsetHSL(0, 0, (hFacet - 0.5) * 0.06);
      } else {
        // Alpine Snow Cap
        faceColor.copy(cSnowShadow).lerp(cSnowLit, moonLitFactor);
        // Frosty crest highlight near top
        if (altT > 0.86) {
          faceColor.lerp(new THREE.Color(0xf2f8ff), 0.35);
        }
      }
    } else if (p.hasSnow && altT > snowLine - 0.10 && slope > 0.52 && hFacet > 0.50) {
      // Transitional Dusted Frost / Shelves
      faceColor.copy(cFrostRock).lerp(cSnowLit, moonLitFactor * 0.5);
    } else {
      // Alpine Granite & Base Scree Zone
      if (altT < 0.26) {
        // Lower slope alluvial apron transitioning to valley floor
        const tBase = altT / 0.26;
        const rockTone = moonLitFactor > 0.4 ? cRockLit : cRockShadow;
        faceColor.copy(cBaseEarth).lerp(rockTone, tBase);
      } else {
        // Mid-elevation faceted rock crags
        if (slope > 0.62) {
          // Ledges and scree benches catching light
          faceColor.copy(cRockLedge).offsetHSL(0, 0, (hFacet - 0.5) * 0.05);
        } else {
          // Standard rock face
          faceColor.copy(cRockShadow).lerp(cRockLit, moonLitFactor);
          // Subtle mineral hue variation per facet
          faceColor.offsetHSL((hFacet - 0.5) * 0.04, 0, (hFacet - 0.5) * 0.05);
        }
      }
    }

    // Atmospheric aerial perspective (fog depth blending for distant mountains)
    if (tDist > 0) {
      faceColor.lerp(cFarHaze, tDist * 0.40);
    }

    // Assign color to all 3 vertices of this triangle
    colors[i0 * 3]     = faceColor.r;
    colors[i0 * 3 + 1] = faceColor.g;
    colors[i0 * 3 + 2] = faceColor.b;

    colors[i1 * 3]     = faceColor.r;
    colors[i1 * 3 + 1] = faceColor.g;
    colors[i1 * 3 + 2] = faceColor.b;

    colors[i2 * 3]     = faceColor.r;
    colors[i2 * 3 + 1] = faceColor.g;
    colors[i2 * 3 + 2] = faceColor.b;
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Pre-transform geometry with world position, rotation, and scaling
  const m = new THREE.Matrix4();
  const rotY = p.rot !== undefined ? p.rot : ((idx * 47) % 314) / 100;
  m.compose(
    new THREE.Vector3(p.x, 0, p.z),
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY),
    new THREE.Vector3(p.scaleX || 1.0, 1.0, p.scaleZ || 1.0)
  );
  geo.applyMatrix4(m);

  return geo;
}

export function createMountain(scene) {
  const mountainGroup = new THREE.Group();
  mountainGroup.name = 'MountainGroup';

  // 1. The Summit Peak Cliff (High Plateau where the Cabin & Campfire sit)
  const summitGeo = new THREE.CylinderGeometry(7.5, 14, 12, 12, 4);
  const pos = summitGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const x = pos.getX(i);
    const z = pos.getZ(i);
    if (y < 4.8) {
      const angle = Math.atan2(z, x);
      const r = Math.hypot(x, z);
      // Smooth continuous angular perturbation without seam tearing (2π-periodic harmonics):
      const rockDisplacement = Math.sin(angle * 3.0) * 0.9 +
                               Math.cos(angle * 5.0 + y * 0.6) * 0.6 +
                               Math.sin(y * 1.2) * 0.4;
      const newR = Math.max(3.0, r + rockDisplacement);
      pos.setX(i, newR * Math.cos(angle));
      pos.setZ(i, newR * Math.sin(angle));
    }
  }
  const nonIndexedSummit = summitGeo.toNonIndexed();
  nonIndexedSummit.computeVertexNormals();

  // Subtle faceted vertex coloring for the summit cliff
  const sPos = nonIndexedSummit.attributes.position;
  const sColors = new Float32Array(sPos.count * 3);
  const cCliffLit = new THREE.Color(0x303c52);
  const cCliffShadow = new THREE.Color(0x1e2738);
  const sNormal = new THREE.Vector3();
  const sEdge1 = new THREE.Vector3();
  const sEdge2 = new THREE.Vector3();
  const sp0 = new THREE.Vector3();
  const sp1 = new THREE.Vector3();
  const sp2 = new THREE.Vector3();

  for (let f = 0; f < sPos.count / 3; f++) {
    const idx0 = f * 3;
    sp0.fromBufferAttribute(sPos, idx0);
    sp1.fromBufferAttribute(sPos, idx0 + 1);
    sp2.fromBufferAttribute(sPos, idx0 + 2);
    sEdge1.subVectors(sp1, sp0);
    sEdge2.subVectors(sp2, sp0);
    sNormal.crossVectors(sEdge1, sEdge2).normalize();

    const dotL = Math.max(0, Math.min(1, sNormal.x * -0.35 + sNormal.y * 0.45 + sNormal.z * -0.8 + 0.3));
    const h = hash(f * 23.7);
    const col = cCliffShadow.clone().lerp(cCliffLit, dotL).offsetHSL(0, 0, (h - 0.5) * 0.05);

    for (let v = 0; v < 3; v++) {
      sColors[(idx0 + v) * 3]     = col.r;
      sColors[(idx0 + v) * 3 + 1] = col.g;
      sColors[(idx0 + v) * 3 + 2] = col.b;
    }
  }
  nonIndexedSummit.setAttribute('color', new THREE.BufferAttribute(sColors, 3));

  const summitMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.85,
    metalness: 0.1,
    flatShading: true
  });
  const summitMesh = new THREE.Mesh(nonIndexedSummit, summitMat);
  summitMesh.position.set(0, 1.0, 0);
  summitMesh.receiveShadow = true;
  summitMesh.castShadow = true;
  mountainGroup.add(summitMesh);

  // 2. Summit Rocks & Boulders along cliff edge (Merged into a single draw call)
  const rockGeo = new THREE.DodecahedronGeometry(1.1, 0);
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x344258,
    roughness: 0.8,
    metalness: 0.12,
    flatShading: true
  });

  const rockPositions = [
    { x: -5.8, y: 6.7, z: 3.2, s: 1.0, rx: 0.8, ry: 1.2 },
    { x: -4.5, y: 7.1, z: -2.8, s: 1.0, rx: 1.5, ry: 0.4 },
    { x: 3.2, y: 6.9, z: -4.2, s: 1.4, rx: 0.5, ry: 2.1 },
    { x: 5.8, y: 6.8, z: 0.8, s: 1.2, rx: 1.1, ry: 1.8 },
    { x: 5.8, y: 6.6, z: 3.0, s: 0.85, rx: 2.2, ry: 0.7 },
    { x: 0.6, y: 7.0, z: 4.3, s: 0.85, rx: 2.01, ry: 5.25 }
  ];

  const rockGeos = rockPositions.map(r => {
    const g = rockGeo.clone();
    const rm = new THREE.Matrix4();
    rm.compose(
      new THREE.Vector3(r.x, r.y, r.z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(r.rx, r.ry, 0)),
      new THREE.Vector3(r.s, r.s * 0.8, r.s * 1.1)
    );
    g.applyMatrix4(rm);
    return g;
  });
  const mergedRockGeo = BufferGeometryUtils.mergeGeometries(rockGeos, false);
  const rocksMesh = new THREE.Mesh(mergedRockGeo, rockMat);
  rocksMesh.castShadow = true;
  rocksMesh.receiveShadow = true;
  mountainGroup.add(rocksMesh);

  // 3. Valley Floor (Rolling terrain below the summit with carved river channel)
  // Bounded strictly to the visible mountain valley (-265 <= x <= 115, -175 <= z <= 85)
  // Eliminates 10,000+ redundant vertices previously generated deep behind the camera
  const valleyCenterX = -75;
  const valleyCenterZ = -45;
  const valleyWidth = 380;
  const valleyDepth = 260;
  const valleyGeo = new THREE.PlaneGeometry(valleyWidth, valleyDepth, 96, 72);
  const valleyPos = valleyGeo.attributes.position;
  for (let i = 0; i < valleyPos.count; i++) {
    const vx = valleyPos.getX(i);
    const vy = valleyPos.getY(i);
    const worldX = valleyCenterX + vx;
    const worldZ = valleyCenterZ - vy;
    const elevation = getValleyElevation(worldX, worldZ) - (-5.0);
    valleyPos.setZ(i, elevation);
  }
  valleyGeo.computeVertexNormals();

  const valleyMat = new THREE.MeshStandardMaterial({
    color: 0x162c3c, // Rich alpine midnight valley terrain
    roughness: 0.95,
    metalness: 0.05,
    flatShading: true
  });
  const valleyMesh = new THREE.Mesh(valleyGeo, valleyMat);
  valleyMesh.rotation.x = -Math.PI / 2;
  valleyMesh.position.set(valleyCenterX, -5.0, valleyCenterZ);
  valleyMesh.receiveShadow = true;
  mountainGroup.add(valleyMesh);

  // 4. Distant Mountain Ridges (Merged into a single unified mesh and draw call)
  const peakGeos = RIDGE_PEAKS.map((p, idx) => createAlpineMassifMesh(p, idx));
  const mergedPeaksGeo = BufferGeometryUtils.mergeGeometries(peakGeos, false);

  const peaksMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.84,
    metalness: 0.08,
    flatShading: true
  });

  const distantRidgesMesh = new THREE.Mesh(mergedPeaksGeo, peaksMat);
  distantRidgesMesh.name = 'DistantRidges';
  distantRidgesMesh.receiveShadow = true;
  // Distant massifs lie far beyond the moonlight shadow camera frustum; disabling castShadow cuts shadow overhead
  distantRidgesMesh.castShadow = false;
  mountainGroup.add(distantRidgesMesh);

  scene.add(mountainGroup);
  return mountainGroup;
}
