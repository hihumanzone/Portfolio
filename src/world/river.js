import * as THREE from 'three';
import { RIVER_3D_POINTS, riverCurve3D, getRiverWidth } from './riverPath.js';
import { getValleyElevation } from './mountain.js';

export { RIVER_3D_POINTS, riverCurve3D, getRiverWidth };

// ---------------------------------------------------------------------------
// 1. Spatial Clearance Check for Procedural Forest Placement
// ---------------------------------------------------------------------------
const COLLISION_SAMPLES = 120;
const riverCollisionSegments = [];
let riverMinX = Infinity, riverMaxX = -Infinity;
let riverMinZ = Infinity, riverMaxZ = -Infinity;

for (let i = 0; i <= COLLISION_SAMPLES; i++) {
  const t = i / COLLISION_SAMPLES;
  const pt = riverCurve3D.getPoint(t);
  const width = getRiverWidth(t);
  riverCollisionSegments.push({ x: pt.x, z: pt.z, width, t });
  if (pt.x < riverMinX) riverMinX = pt.x;
  if (pt.x > riverMaxX) riverMaxX = pt.x;
  if (pt.z < riverMinZ) riverMinZ = pt.z;
  if (pt.z > riverMaxZ) riverMaxZ = pt.z;
}

export function isInsideRiver(x, z, margin = 3.6) {
  const boundMargin = 12 + margin;
  if (x < riverMinX - boundMargin || x > riverMaxX + boundMargin ||
      z < riverMinZ - boundMargin || z > riverMaxZ + boundMargin) {
    return false;
  }

  for (let i = 0; i < riverCollisionSegments.length - 1; i++) {
    const p1 = riverCollisionSegments[i];
    const p2 = riverCollisionSegments[i + 1];

    const dx = p2.x - p1.x;
    const dz = p2.z - p1.z;
    const lenSq = dx * dx + dz * dz;

    let segT = 0;
    if (lenSq > 0.0001) {
      segT = Math.max(0, Math.min(1, ((x - p1.x) * dx + (z - p1.z) * dz) / lenSq));
    }

    const projX = p1.x + segT * dx;
    const projZ = p1.z + segT * dz;
    const distSq = (x - projX) * (x - projX) + (z - projZ) * (z - projZ);

    const curWidth = p1.width + segT * (p2.width - p1.width);
    const radius = (curWidth * 0.5) + margin;

    if (distSq < radius * radius) {
      return true;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// 2. Complete Low-Poly Animated River System
// ---------------------------------------------------------------------------
export function createRiver(scene, mountainGroup) {
  const riverGroup = new THREE.Group();
  riverGroup.name = 'RiverSystem';

  const LENGTH_SEGS = 160;
  const WIDTH_SEGS = 5;
  const BED_START_I = Math.floor(LENGTH_SEGS * 0.34);

  const waterPositions = [];
  const waterUvs = [];
  const waterIndices = [];

  const bedPositions = [];
  const bedColors = [];
  const bedIndices = [];

  const pCurrent = new THREE.Vector3();
  const pTangent = new THREE.Vector3();
  const normal2D = new THREE.Vector2();

  // Raycaster for hugging mountain rock facets on descent
  const raycaster = new THREE.Raycaster();
  const downDir = new THREE.Vector3(0, -1, 0);
  const rayOrigin = new THREE.Vector3();
  const mountainMeshes = mountainGroup ? mountainGroup.children : [];

  for (let i = 0; i <= LENGTH_SEGS; i++) {
    const t = i / LENGTH_SEGS;
    riverCurve3D.getPoint(t, pCurrent);
    riverCurve3D.getTangent(t, pTangent);

    normal2D.set(-pTangent.z, pTangent.x).normalize();

    const curWidth = getRiverWidth(t);
    const bedWidth = curWidth * 1.24;

    // Calculate level cross-section elevation for this row across rock facets
    let maxFacetY = -999;
    if (t < 0.26 && mountainMeshes.length > 0) {
      for (let k = 0; k <= WIDTH_SEGS; k++) {
        const uSample = (k / WIDTH_SEGS) - 0.5;
        const testX = pCurrent.x + normal2D.x * (uSample * curWidth);
        const testZ = pCurrent.z + normal2D.y * (uSample * curWidth);
        rayOrigin.set(testX, 60, testZ);
        raycaster.set(rayOrigin, downDir);
        const hits = raycaster.intersectObjects(mountainMeshes, true);
        if (hits.length > 0 && hits[0].point.y > maxFacetY) {
          maxFacetY = hits[0].point.y;
        }
      }
    }

    const localValley = getValleyElevation(pCurrent.x, pCurrent.z);

    let rowWY = pCurrent.y;
    if (t < 0.23) {
      // Mountain ridge descent: hug rock facets with +0.20m water depth
      rowWY = Math.max(pCurrent.y, maxFacetY + 0.20);
    } else if (t < 0.34) {
      // Waterfall cascade: smoothly project from lip into vertical drop
      const b = (t - 0.23) / (0.34 - 0.23);
      const sb = b * b * (3.0 - 2.0 * b);
      const lipY = Math.max(pCurrent.y, maxFacetY + 0.20);
      rowWY = lipY * (1.0 - sb) + pCurrent.y * sb;
    } else {
      // Valley floor: guaranteed clearance above carved riverbed
      rowWY = Math.max(pCurrent.y, localValley + 0.28);
    }

    for (let j = 0; j <= WIDTH_SEGS; j++) {
      const u = (j / WIDTH_SEGS) - 0.5;
      const offset = u * curWidth;

      const wx = pCurrent.x + normal2D.x * offset;
      const wz = pCurrent.z + normal2D.y * offset;

      waterPositions.push(wx, rowWY, wz);
      waterUvs.push(j / WIDTH_SEGS, t);

      // Riverbed trench geometry: strictly in the valley floor (t >= 0.34)
      if (i >= BED_START_I) {
        const bedOffset = u * bedWidth;
        const bx = pCurrent.x + normal2D.x * bedOffset;
        const bz = pCurrent.z + normal2D.y * bedOffset;
        const edgeFactor = Math.abs(u) * 2.0;
        const depth = (1.0 - edgeFactor * 0.70) * 0.55;
        const by = rowWY - depth + (edgeFactor > 0.85 ? 0.20 : -0.05);

        bedPositions.push(bx, by, bz);

        const tone = 0.07 + (1.0 - edgeFactor) * 0.06;
        bedColors.push(tone * 0.8, tone * 1.2, tone * 1.5);
      }
    }
  }

  const vertsPerRow = WIDTH_SEGS + 1;
  for (let i = 0; i < LENGTH_SEGS; i++) {
    const r0 = i * vertsPerRow;
    const r1 = (i + 1) * vertsPerRow;

    for (let j = 0; j < WIDTH_SEGS; j++) {
      const v00 = r0 + j;
      const v01 = r0 + j + 1;
      const v10 = r1 + j;
      const v11 = r1 + j + 1;

      waterIndices.push(v00, v11, v10);
      waterIndices.push(v00, v01, v11);
    }
  }

  const bedRows = LENGTH_SEGS - BED_START_I;
  for (let i = 0; i < bedRows; i++) {
    const r0 = i * vertsPerRow;
    const r1 = (i + 1) * vertsPerRow;

    for (let j = 0; j < WIDTH_SEGS; j++) {
      const v00 = r0 + j;
      const v01 = r0 + j + 1;
      const v10 = r1 + j;
      const v11 = r1 + j + 1;

      bedIndices.push(v00, v11, v10);
      bedIndices.push(v00, v01, v11);
    }
  }

  let waterGeo = new THREE.BufferGeometry();
  waterGeo.setAttribute('position', new THREE.Float32BufferAttribute(waterPositions, 3));
  waterGeo.setAttribute('uv', new THREE.Float32BufferAttribute(waterUvs, 2));
  waterGeo.setIndex(waterIndices);
  waterGeo = waterGeo.toNonIndexed();
  waterGeo.computeVertexNormals();

  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x1880a8,
    emissive: 0x082e44,
    emissiveIntensity: 0.32,
    roughness: 0.14,
    metalness: 0.28,
    flatShading: true,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.94
  });

  waterMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = { value: 0 };
    waterMaterial.userData.shader = shader;

    shader.vertexShader = `
      uniform float uTime;
      varying vec3 vWorldPos;
      varying vec2 vFlowUv;
      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      vFlowUv = uv;
      
      #ifdef USE_INSTANCING
        vec4 wPos = instanceMatrix * vec4(transformed, 1.0);
      #else
        vec4 wPos = modelMatrix * vec4(transformed, 1.0);
      #endif
      vWorldPos = wPos.xyz;

      float isWaterfallV = smoothstep(0.20, 0.24, uv.y) * (1.0 - smoothstep(0.33, 0.36, uv.y));
      
      // River surface wave displacement
      float flowProg = uv.y * 22.0 - uTime * 2.4;
      float crossProg = uv.x * 4.0;
      
      float wave = sin(flowProg + cos(crossProg * 1.5) * 0.8) * 0.05;
      wave += cos(flowProg * 1.5 + transformed.x * 0.15) * 0.02;
      
      // Strongly damp wave displacement on mountain ridge & vertical cascade to prevent facet clipping or vertical bouncing
      float waveDamp = smoothstep(0.0, 0.18, uv.y) * (1.0 - isWaterfallV * 0.90);
      transformed.y += wave * waveDamp;
      `
    );

    shader.fragmentShader = `
      uniform float uTime;
      varying vec3 vWorldPos;
      varying vec2 vFlowUv;
      ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>

      // Continuous alpine origin taper: smooth fade out to 0 at mountain crevice
      float rOriginFade = smoothstep(0.005, 0.16, vFlowUv.y);

      // Waterfall zone mask (precisely from cliff lip down to plunge pool)
      float isWaterfall = smoothstep(0.20, 0.24, vFlowUv.y) * (1.0 - smoothstep(0.34, 0.37, vFlowUv.y));

      // 1. Enhanced waterfall cascade (rushing whitewater torrents down the cliff)
      float fallSpeed = 13.5;
      float fallV = vFlowUv.y * 42.0 - uTime * fallSpeed;
      float fallCross1 = sin(vFlowUv.x * 32.0 + sin(fallV * 0.25) * 1.8);
      float fallCross2 = cos(vFlowUv.x * 48.0 - uTime * 2.2);

      // Multi-layer downward cascading whitewater streams
      float stream1 = sin(fallV * 1.5 + fallCross1 * 2.2);
      float stream2 = cos(vFlowUv.y * 75.0 - uTime * (fallSpeed * 1.25) + fallCross2 * 1.6);
      float stream3 = sin(vFlowUv.y * 110.0 - uTime * (fallSpeed * 1.5) + vFlowUv.x * 20.0);
      float rushingStreams = smoothstep(0.08, 0.78, stream1 * 0.45 + stream2 * 0.35 + stream3 * 0.20);

      // Waterfall lip crest curl
      float lipMask = smoothstep(0.20, 0.23, vFlowUv.y) * (1.0 - smoothstep(0.235, 0.265, vFlowUv.y));
      float lipCurl = smoothstep(0.25, 0.80, sin(vFlowUv.y * 38.0 - uTime * 7.0 + sin(vFlowUv.x * 16.0) * 2.0)) * lipMask;

      // Plunge pool impact churn at t ~ 0.355 (downstream offset, softened intensity)
      float impactZone = smoothstep(0.33, 0.355, vFlowUv.y) * (1.0 - smoothstep(0.375, 0.42, vFlowUv.y));
      float impactDist = length(vec2((vFlowUv.x - 0.5) * 2.0, (vFlowUv.y - 0.355) * 14.0));
      float impactChurn = sin(impactDist * 22.0 - uTime * 11.0) * smoothstep(1.5, 0.05, impactDist) * impactZone;
      float impactFoam = smoothstep(0.32, 0.85, impactChurn) * 0.50;

      // 2. Restored Beautiful Flowing River Water (Exact colors, ripples & foam!)
      float flowV = vFlowUv.y * 22.0 - uTime * 2.4;
      float crossU = vFlowUv.x * 4.0;
      float ripple = sin(flowV + sin(crossU * 1.6) * 0.8);
      float foamSparks = smoothstep(0.70, 0.95, ripple);
      float bankDist = abs(vFlowUv.x - 0.5) * 2.0;
      float shoreFoam = smoothstep(0.72, 0.98, bankDist);

      vec3 deepGlacial = vec3(0.06, 0.26, 0.45);
      vec3 turquoiseCrest = vec3(0.18, 0.62, 0.85);
      vec3 paleFoam = vec3(0.92, 0.97, 1.0);

      vec3 riverColor = mix(deepGlacial, turquoiseCrest, clamp(ripple * 0.5 + 0.5, 0.0, 1.0));
      float totalRiverFoam = clamp(foamSparks * 0.30 + shoreFoam * 0.45, 0.0, 1.0);
      riverColor = mix(riverColor, paleFoam, totalRiverFoam);

      // Waterfall cascade coloring
      vec3 cascadeCyan = vec3(0.24, 0.64, 0.86);
      vec3 pureWhitewater = vec3(0.96, 0.98, 1.0);
      vec3 cascadeColor = mix(cascadeCyan, pureWhitewater, rushingStreams * 0.88 + 0.12);
      cascadeColor = mix(cascadeColor, pureWhitewater, lipCurl * 0.90);

      // Blend river and waterfall
      vec3 finalColor = mix(riverColor, cascadeColor, isWaterfall);
      finalColor = mix(finalColor, pureWhitewater, impactFoam);

      diffuseColor.rgb = finalColor;
      diffuseColor.a *= rOriginFade;
      `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `
      #include <emissivemap_fragment>

      float rOrigFade = smoothstep(0.005, 0.16, vFlowUv.y);

      vec3 faceNorm = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
      vec3 moonPos = vec3(-156.0, 49.0, -110.0);
      vec3 toMoon = normalize(moonPos - vWorldPos);
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      vec3 hVec = normalize(toMoon + viewDir);
      float spec = pow(max(0.0, dot(faceNorm, hVec)), 26.0);

      float isWfall = smoothstep(0.20, 0.24, vFlowUv.y) * (1.0 - smoothstep(0.34, 0.37, vFlowUv.y));

      // 1. Restored Beautiful Flowing River Radiance (Luminous glowing turquoise depth!)
      float rFlowV = vFlowUv.y * 22.0 - uTime * 2.4;
      float rCrossU = vFlowUv.x * 4.0;
      float rRipple = sin(rFlowV + sin(rCrossU * 1.6) * 0.8);
      float rFoamSparks = smoothstep(0.70, 0.95, rRipple);
      float rBankDist = abs(vFlowUv.x - 0.5) * 2.0;
      float rShoreFoam = smoothstep(0.72, 0.98, rBankDist);
      float rTotalRiverFoam = clamp(rFoamSparks * 0.30 + rShoreFoam * 0.45, 0.0, 1.0);

      vec3 radianceBase = mix(vec3(0.05, 0.22, 0.38), vec3(0.14, 0.46, 0.68), clamp(rRipple * 0.5 + 0.5, 0.0, 1.0));
      vec3 foamRadiance = vec3(0.75, 0.88, 0.96);
      vec3 riverRadiance = mix(radianceBase, foamRadiance, rTotalRiverFoam * 0.65);
      riverRadiance += vec3(0.70, 0.85, 1.0) * spec * 1.2;

      // 2. Waterfall cascade froth radiance (rushing whitewater strands, crisp and controlled)
      vec3 cascadeFroth = mix(vec3(0.08, 0.28, 0.42), vec3(0.55, 0.65, 0.75), rushingStreams);
      cascadeFroth = mix(cascadeFroth, vec3(0.65, 0.75, 0.85), lipCurl);
      cascadeFroth += vec3(0.35, 0.45, 0.55) * spec * 0.45;

      vec3 poolFroth = vec3(0.58, 0.68, 0.78) * impactFoam;

      // Blend river radiance and waterfall radiance
      vec3 finalRadiance = mix(riverRadiance, cascadeFroth, isWfall);
      finalRadiance += poolFroth;

      totalEmissiveRadiance += finalRadiance * 0.32 * rOrigFade;
      `
    );
  };

  const waterMesh = new THREE.Mesh(waterGeo, waterMaterial);
  waterMesh.receiveShadow = true;
  riverGroup.add(waterMesh);

  let bedGeo = new THREE.BufferGeometry();
  bedGeo.setAttribute('position', new THREE.Float32BufferAttribute(bedPositions, 3));
  bedGeo.setAttribute('color', new THREE.Float32BufferAttribute(bedColors, 3));
  bedGeo.setIndex(bedIndices);
  bedGeo = bedGeo.toNonIndexed();
  bedGeo.computeVertexNormals();

  const bedMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.94,
    metalness: 0.05,
    flatShading: true
  });

  const bedMesh = new THREE.Mesh(bedGeo, bedMaterial);
  bedMesh.receiveShadow = true;
  riverGroup.add(bedMesh);

  // Shoreline stones flanking the valley riverbanks (clear of water flow, optimized as InstancedMesh)
  const stoneGeo = new THREE.DodecahedronGeometry(1.0, 0);
  const stoneColors = [
    new THREE.Color(0x223344),
    new THREE.Color(0x2c4056),
    new THREE.Color(0x1c2937)
  ];
  const stoneMat = new THREE.MeshStandardMaterial({
    roughness: 0.86,
    metalness: 0.05,
    flatShading: true
  });

  const boulderCount = 110;
  const instancedStones = new THREE.InstancedMesh(stoneGeo, stoneMat, boulderCount);
  instancedStones.receiveShadow = true;
  instancedStones.castShadow = false;

  const stoneDummy = new THREE.Object3D();

  for (let b = 0; b < boulderCount; b++) {
    const t = 0.35 + Math.random() * 0.63;
    riverCurve3D.getPoint(t, pCurrent);
    riverCurve3D.getTangent(t, pTangent);
    normal2D.set(-pTangent.z, pTangent.x).normalize();

    const curWidth = getRiverWidth(t);
    const side = Math.random() > 0.5 ? 1.0 : -1.0;
    const distFromCenter = side * (curWidth * 0.5 + 0.8 + Math.random() * 1.8);

    const bx = pCurrent.x + normal2D.x * distFromCenter;
    const bz = pCurrent.z + normal2D.y * distFromCenter;
    const localGround = getValleyElevation(bx, bz);

    const scale = 0.40 + Math.random() * 0.75;
    stoneDummy.position.set(bx, localGround + scale * 0.28, bz);
    stoneDummy.scale.set(scale, scale * (0.65 + Math.random() * 0.4), scale * (0.85 + Math.random() * 0.4));
    stoneDummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    stoneDummy.updateMatrix();

    instancedStones.setMatrixAt(b, stoneDummy.matrix);
    instancedStones.setColorAt(b, stoneColors[b % 3]);
  }
  instancedStones.instanceMatrix.needsUpdate = true;
  if (instancedStones.instanceColor) instancedStones.instanceColor.needsUpdate = true;
  instancedStones.computeBoundingBox();
  instancedStones.computeBoundingSphere();
  riverGroup.add(instancedStones);

  // Waterfall plunge impact coordinates: located right at the base of the cascade cliff
  // where the water drops into the valley floor basin (elevation ~ -4.40)
  const IMPACT_CENTER = new THREE.Vector3(-82.4, -4.36, -20.8);

  // A. Ballistic Water Splash Bubble Particles (lively, charming, crisp low-poly bubbles)
  const dropCount = 110;
  const dropGeo = new THREE.BufferGeometry();
  const dropPositions = new Float32Array(dropCount * 3);
  const dropData = [];

  function resetDroplet(idx) {
    const angle = Math.random() * Math.PI * 2;
    const rad = Math.random() * 1.15;
    const px = IMPACT_CENTER.x + Math.cos(angle) * rad;
    const py = IMPACT_CENTER.y + 0.05 + Math.random() * 0.18;
    const pz = IMPACT_CENTER.z + Math.sin(angle) * rad;

    dropPositions[idx * 3]     = px;
    dropPositions[idx * 3 + 1] = py;
    dropPositions[idx * 3 + 2] = pz;

    const hSpeed = 0.8 + Math.random() * 2.4;
    const dir = Math.random() * Math.PI * 2;
    dropData[idx] = {
      vx: Math.cos(dir) * hSpeed,
      vy: 3.2 + Math.random() * 4.2, // Plunge bounce upwards into the air
      vz: Math.sin(dir) * hSpeed,
      life: 0,
      maxLife: 0.42 + Math.random() * 0.42
    };
  }

  for (let d = 0; d < dropCount; d++) {
    resetDroplet(d);
    const initProg = Math.random();
    dropData[d].life = initProg * dropData[d].maxLife;
    dropPositions[d * 3]     += dropData[d].vx * dropData[d].life;
    dropPositions[d * 3 + 1] += dropData[d].vy * dropData[d].life - 0.5 * 14.0 * dropData[d].life * dropData[d].life;
    dropPositions[d * 3 + 2] += dropData[d].vz * dropData[d].life;
  }
  dropGeo.setAttribute('position', new THREE.BufferAttribute(dropPositions, 3));

  // Crisp, bright low-poly water droplet bead texture (clearly visible bubble)
  const dropCanvas = document.createElement('canvas');
  dropCanvas.width = 64;
  dropCanvas.height = 64;
  const dropCtx = dropCanvas.getContext('2d');
  const dropGrad = dropCtx.createRadialGradient(32, 32, 0, 32, 32, 28);
  dropGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
  dropGrad.addColorStop(0.50, 'rgba(230, 248, 255, 0.90)');
  dropGrad.addColorStop(0.82, 'rgba(180, 232, 255, 0.55)');
  dropGrad.addColorStop(1, 'rgba(150, 215, 250, 0)');
  dropCtx.fillStyle = dropGrad;
  dropCtx.beginPath();
  dropCtx.arc(32, 32, 28, 0, Math.PI * 2);
  dropCtx.fill();

  const dropTex = new THREE.CanvasTexture(dropCanvas);
  const dropMat = new THREE.PointsMaterial({
    size: 1.55,
    map: dropTex,
    transparent: true,
    opacity: 0.90,
    blending: THREE.NormalBlending,
    depthWrite: false
  });

  const dropPoints = new THREE.Points(dropGeo, dropMat);
  riverGroup.add(dropPoints);

  // B. Expanding Impact Foam Shockwave Rings (radiating clearly across pool surface)
  const ringCount = 4;
  const rings = [];
  const ringGeo = new THREE.RingGeometry(0.70, 1.45, 32);
  ringGeo.rotateX(-Math.PI / 2);

  for (let r = 0; r < ringCount; r++) {
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe8f4ff,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(IMPACT_CENTER.x, IMPACT_CENTER.y + 0.08, IMPACT_CENTER.z);
    riverGroup.add(ringMesh);
    rings.push({ mesh: ringMesh, mat: ringMat, offset: r / ringCount });
  }

  // C. Grounded Soft Plunge Pool Mist (subtle atmospheric spray without glow)
  const mistCount = 16;
  const mistGeo = new THREE.BufferGeometry();
  const mistPositions = new Float32Array(mistCount * 3);
  const mistOffsets = [];

  for (let m = 0; m < mistCount; m++) {
    const ang = Math.random() * Math.PI * 2;
    const rad = 0.5 + Math.random() * 1.8;
    const mx = IMPACT_CENTER.x + Math.cos(ang) * rad;
    const my = IMPACT_CENTER.y + 0.15 + Math.random() * 0.7;
    const mz = IMPACT_CENTER.z + Math.sin(ang) * rad;

    mistPositions[m * 3]     = mx;
    mistPositions[m * 3 + 1] = my;
    mistPositions[m * 3 + 2] = mz;

    mistOffsets.push({
      baseX: mx,
      baseY: my,
      baseZ: mz,
      phase: Math.random() * Math.PI * 2,
      speed: 0.8 + Math.random() * 0.9,
      amp: 0.25 + Math.random() * 0.25
    });
  }

  mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPositions, 3));

  const mistCanvas = document.createElement('canvas');
  mistCanvas.width = 64;
  mistCanvas.height = 64;
  const mistCtx = mistCanvas.getContext('2d');
  const mistGrad = mistCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  mistGrad.addColorStop(0, 'rgba(215, 235, 250, 0.14)');
  mistGrad.addColorStop(0.5, 'rgba(180, 215, 240, 0.05)');
  mistGrad.addColorStop(1, 'rgba(160, 200, 235, 0)');
  mistCtx.fillStyle = mistGrad;
  mistCtx.fillRect(0, 0, 64, 64);

  const mistTex = new THREE.CanvasTexture(mistCanvas);
  const mistMat = new THREE.PointsMaterial({
    size: 2.0,
    map: mistTex,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
    blending: THREE.NormalBlending
  });

  const mistPoints = new THREE.Points(mistGeo, mistMat);
  riverGroup.add(mistPoints);

  scene.add(riverGroup);

  return {
    group: riverGroup,
    update: (time, delta) => {
      if (waterMaterial.userData.shader) {
        waterMaterial.userData.shader.uniforms.uTime.value = time;
      }

      const dt = Math.min(delta, 0.05);

      // 1. Update leaping water splash droplets
      for (let d = 0; d < dropCount; d++) {
        const data = dropData[d];
        data.life += dt;
        data.vy -= 14.0 * dt;

        const idx = d * 3;
        dropPositions[idx]     += data.vx * dt;
        const newY = dropPositions[idx + 1] + data.vy * dt;
        dropPositions[idx + 1] = newY;
        dropPositions[idx + 2] += data.vz * dt;

        if (newY < -4.48 || data.life >= data.maxLife) {
          resetDroplet(d);
        }
      }
      dropGeo.attributes.position.needsUpdate = true;

      // 2. Update expanding impact foam shockwave rings
      for (let r = 0; r < ringCount; r++) {
        const ring = rings[r];
        const phase = ((time * 0.85) + ring.offset) % 1.0;
        const s = 0.4 + phase * 3.2;
        ring.mesh.scale.set(s, 1.0, s);
        ring.mat.opacity = (1.0 - phase) * (1.0 - phase) * 0.65;
      }

      // 3. Update gentle grounded mist drift
      const mPosArr = mistGeo.attributes.position.array;
      for (let m = 0; m < mistCount; m++) {
        const off = mistOffsets[m];
        mPosArr[m * 3]     = off.baseX + Math.sin(time * off.speed + off.phase) * off.amp;
        mPosArr[m * 3 + 1] = off.baseY + Math.sin(time * off.speed * 1.2 + off.phase) * 0.18;
        mPosArr[m * 3 + 2] = off.baseZ + Math.cos(time * off.speed + off.phase) * off.amp;
      }
      mistGeo.attributes.position.needsUpdate = true;
    }
  };
}
