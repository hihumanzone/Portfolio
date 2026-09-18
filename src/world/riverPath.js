import * as THREE from 'three';

// ---------------------------------------------------------------------------
// 1. Master 3D River Spline Path Definition
// Smooth continuous descent from high alpine notch to off-screen foreground
// ---------------------------------------------------------------------------
export const RIVER_3D_POINTS = [
  new THREE.Vector3(-95.0, 21.2, -53.0), // 0. Notch origin under snowline (tapers to 0 width & fades out)
  new THREE.Vector3(-93.8, 17.6, -48.0), // 1. Upper arete ridge descent
  new THREE.Vector3(-92.6, 13.9, -41.5), // 2. Mountain arete descent
  new THREE.Vector3(-91.0, 10.3, -35.0), // 3. Mid ridge descent
  new THREE.Vector3(-89.2,  8.2, -30.0), // 4. Waterfall lip crest
  new THREE.Vector3(-86.8,  2.2, -25.2), // 5. Waterfall plunge chute
  new THREE.Vector3(-84.8, -3.8, -22.0), // 6. Waterfall plunge pool entry in valley basin
  new THREE.Vector3(-79.5, -4.6, -19.5), // 7. Valley entrance meander
  new THREE.Vector3(-71.0, -5.2, -15.5), // 8. Upper pine valley
  new THREE.Vector3(-62.0, -5.8,  -9.5), // 9. Mid pine valley
  new THREE.Vector3(-54.0, -6.5,  -3.5), // 10. Lower valley sweep
  new THREE.Vector3(-46.0, -7.2,   2.5), // 11. Valley curve
  new THREE.Vector3(-38.0, -7.9,   8.5), // 12. Sweeping toward screen-left
  new THREE.Vector3(-30.0, -8.6,  14.5), // 13. Screen-left vista
  new THREE.Vector3(-21.0, -9.2,  21.0), // 14. Foreground river
  new THREE.Vector3(-12.0, -9.8,  27.5), // 15. Foreground sweep
  new THREE.Vector3( -2.0,-10.4,  34.5), // 16. Lower foreground vista
  new THREE.Vector3(  9.0,-11.0,  42.0), // 17. Extended foreground vista
  new THREE.Vector3( 22.0,-11.6,  50.0), // 18. Off-screen extension
  new THREE.Vector3( 36.0,-12.2,  59.0)  // 19. Complete tilt-proof off-screen termination
];

export const riverCurve3D = new THREE.CatmullRomCurve3(RIVER_3D_POINTS, false, 'centripetal');

/**
 * Calculates continuous width along the river path.
 * - Tapers down to 0 at the mountain origin, disappearing into the rock crevice.
 * - Expands down the arete and into the roaring waterfall cascade.
 * - Broadens through the pine valley and foreground corridor.
 */
export function getRiverWidth(t) {
  if (t < 0.16) {
    // Graceful continuous taper down to 0 at the mountain origin
    return Math.pow(t / 0.16, 1.5) * 2.2;
  }
  if (t < 0.25) {
    // Sharp mountain arete ridge
    return 2.2 + ((t - 0.16) / (0.25 - 0.16)) * 1.0;
  }
  if (t < 0.35) {
    // Full cascading sheet over the waterfall cliff
    return 3.2 + ((t - 0.25) / (0.35 - 0.25)) * 2.6;
  }
  // Valley floor expands downstream to wide foreground river
  return 5.8 + Math.pow((t - 0.35) / 0.65, 0.70) * 4.2;
}

// Precomputed segment points for fast 2D distance and height queries
const SEG_COUNT = RIVER_3D_POINTS.length - 1;

// Per-segment AABB + max reach (half width + bank) for cheap early rejection.
// Identical results: rejected segments can never be the nearest within range.
const _segBounds = [];
for (let i = 6; i < SEG_COUNT; i++) {
  const p1 = RIVER_3D_POINTS[i];
  const p2 = RIVER_3D_POINTS[i + 1];
  const tMid = (i + 0.5) / SEG_COUNT;
  const reach = getRiverWidth(tMid) * 0.5 + 4.5;
  _segBounds.push({
    i,
    minX: Math.min(p1.x, p2.x) - reach,
    maxX: Math.max(p1.x, p2.x) + reach,
    minZ: Math.min(p1.z, p2.z) - reach,
    maxZ: Math.max(p1.z, p2.z) + reach,
  });
}

/**
 * Carves a natural riverbed channel into the raw valley floor terrain.
 * Guarantees zero terrain clipping along the river banks and off-screen exit.
 */
export function getCarvedValleyElevation(x, z, rawElevation) {
  // Check against valley river segments (index 6 to end)
  let minDistSq = Infinity;
  let bestWaterY = 0;
  let bestWidth = 0;

  for (let s = 0; s < _segBounds.length; s++) {
    const b = _segBounds[s];
    if (x < b.minX || x > b.maxX || z < b.minZ || z > b.maxZ) continue;
    const i = b.i;
    const p1 = RIVER_3D_POINTS[i];
    const p2 = RIVER_3D_POINTS[i + 1];

    const dx = p2.x - p1.x;
    const dz = p2.z - p1.z;
    const lenSq = dx * dx + dz * dz;

    let u = 0;
    if (lenSq > 0.0001) {
      u = Math.max(0, Math.min(1, ((x - p1.x) * dx + (z - p1.z) * dz) / lenSq));
    }

    const projX = p1.x + u * dx;
    const projZ = p1.z + u * dz;
    const dSq = (x - projX) * (x - projX) + (z - projZ) * (z - projZ);

    if (dSq < minDistSq) {
      minDistSq = dSq;
      const t = (i + u) / SEG_COUNT;
      bestWaterY = p1.y + u * (p2.y - p1.y);
      bestWidth = getRiverWidth(t);
    }
  }

  const dist = Math.sqrt(minDistSq);
  const halfW = bestWidth * 0.5;
  const bankWidth = 4.5;

  if (dist < halfW + bankWidth) {
    if (dist <= halfW) {
      // Inside river channel bed: carve 0.65m beneath water surface
      const channelBed = bestWaterY - 0.65;
      return Math.min(rawElevation, channelBed);
    } else {
      // Sloping riverbank: smooth hermite transition from channel edge to natural terrain
      const tBank = (dist - halfW) / bankWidth;
      const sBank = tBank * tBank * (3.0 - 2.0 * tBank);
      const channelEdge = bestWaterY - 0.20;
      const targetY = channelEdge * (1.0 - sBank) + rawElevation * sBank;
      return Math.min(rawElevation, targetY);
    }
  }

  return rawElevation;
}
