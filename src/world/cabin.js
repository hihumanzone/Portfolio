import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function createCabin(scene) {
  const cabinGroup = new THREE.Group();
  cabinGroup.position.set(-2, 7.0, -1); // Summit plateau anchor

  // ---------------------------------------------------------------------------
  // 1. Curated Low-Poly Material Palette
  // ---------------------------------------------------------------------------
  // Rich weathered cedar for alternating horizontal logs
  const logPrimaryMat = new THREE.MeshStandardMaterial({
    color: 0x5a412c,
    roughness: 0.84,
    metalness: 0.04,
    flatShading: true
  });

  const logSecondaryMat = new THREE.MeshStandardMaterial({
    color: 0x4d3725,
    roughness: 0.88,
    metalness: 0.04,
    flatShading: true
  });

  // Pale end-grain timber for cut circular/hexagonal log ends
  const logEndMat = new THREE.MeshStandardMaterial({
    color: 0x7a5b3e,
    roughness: 0.76,
    metalness: 0.03,
    flatShading: true
  });

  // Multi-material arrays for logs: index 0 = cylinder tube, index 1 & 2 = end caps
  const logMatArray1 = [logPrimaryMat, logEndMat, logEndMat];
  const logMatArray2 = [logSecondaryMat, logEndMat, logEndMat];

  // Dark espresso trim for window frames, door casing, bargeboards, and rafter tails
  const trimWoodMat = new THREE.MeshStandardMaterial({
    color: 0x342317,
    roughness: 0.82,
    flatShading: true
  });

  // Deck planking wood with warm pine undertone
  const deckWoodMat = new THREE.MeshStandardMaterial({
    color: 0x5e4531,
    roughness: 0.78,
    flatShading: true
  });

  const deckPlankAltMat = new THREE.MeshStandardMaterial({
    color: 0x523c2a,
    roughness: 0.80,
    flatShading: true
  });

  // Dark slate timber shingles for roof
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x29221d,
    roughness: 0.88,
    flatShading: true
  });

  const roofTrimMat = new THREE.MeshStandardMaterial({
    color: 0x3a2d24,
    roughness: 0.84,
    flatShading: true
  });

  // Transparent window glass with crystal clarity (reveals interior desk & CRT!)
  const winGlassMat = new THREE.MeshStandardMaterial({
    color: 0xcde5f7,
    roughness: 0.08,
    metalness: 0.05,
    transparent: true,
    opacity: 0.12
  });

  // Glowing warm amber interior material for attic & door windows
  const windowGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffaa33,
    emissive: 0xff7711,
    emissiveIntensity: 1.85,
    roughness: 0.25,
    metalness: 0.1
  });

  // Low-poly dark wrought iron / telecom steel
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x22242a,
    roughness: 0.52,
    metalness: 0.80,
    flatShading: true
  });

  // Vintage brass accents for door hardware & desk lamp
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0x9c7638,
    roughness: 0.40,
    metalness: 0.75,
    flatShading: true
  });

  // Chiseled granite foundation stone pads
  const stoneFoundationMat = new THREE.MeshStandardMaterial({
    color: 0x484950,
    roughness: 0.95,
    flatShading: true
  });

  // Chimney multi-tone rock masonry
  const chimneyStoneDark = new THREE.MeshStandardMaterial({
    color: 0x5a5455,
    roughness: 0.94,
    flatShading: true
  });
  const chimneyStoneLight = new THREE.MeshStandardMaterial({
    color: 0x78706d,
    roughness: 0.92,
    flatShading: true
  });
  const flueMat = new THREE.MeshStandardMaterial({
    color: 0xa85538, // Terracotta clay chimney flue pot
    roughness: 0.82,
    flatShading: true
  });

  // Ceramic white porcelain for coffee mugs
  const porcelainMat = new THREE.MeshStandardMaterial({
    color: 0xf6f8fa,
    roughness: 0.20,
    metalness: 0.05
  });
  const coffeeLiquidMat = new THREE.MeshStandardMaterial({
    color: 0x1f1208,
    roughness: 0.15
  });

  // Props: split firewood & axe
  const firewoodBarkMat = new THREE.MeshStandardMaterial({ color: 0x3a281e, roughness: 0.9, flatShading: true });
  const firewoodFaceMat = new THREE.MeshStandardMaterial({ color: 0x997750, roughness: 0.75, flatShading: true });
  const axeBladeMat = new THREE.MeshStandardMaterial({ color: 0x8ca0b4, roughness: 0.25, metalness: 0.92, flatShading: true });

  // Window planter box alpine pine foliage
  const alpinePineMat = new THREE.MeshStandardMaterial({ color: 0x203b26, roughness: 0.9, flatShading: true });

  // ---------------------------------------------------------------------------
  // 2. Stilt Foundation with Diagonal Sway Bracing & Stone Footing Pads
  // ---------------------------------------------------------------------------
  const stiltPositions = [
    { x: -2.3, z: -1.9 }, { x: 2.3, z: -1.9 }, // Back corners
    { x: -2.3, z: 0.5 },  { x: 2.3, z: 0.5 },  // Mid posts
    { x: -2.3, z: 2.9 },  { x: 2.3, z: 2.9 },  // Front porch corners
    { x: 0.0,  z: 2.9 }                        // Front porch center
  ];

  const stiltGeo = new THREE.CylinderGeometry(0.16, 0.18, 2.1, 6);
  const stonePadGeo = new THREE.CylinderGeometry(0.28, 0.34, 0.25, 6);

  const stiltGeos = [];
  const stonePadGeos = [];

  stiltPositions.forEach(p => {
    const sg = stiltGeo.clone();
    sg.translate(p.x, 0.05, p.z);
    stiltGeos.push(sg);

    const pg = stonePadGeo.clone();
    pg.rotateY(p.x + p.z);
    pg.translate(p.x, -0.92, p.z);
    stonePadGeos.push(pg);
  });

  const mergedStiltsMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(stiltGeos, false), logPrimaryMat);
  mergedStiltsMesh.castShadow = true;
  mergedStiltsMesh.receiveShadow = true;
  cabinGroup.add(mergedStiltsMesh);

  const mergedPadsMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(stonePadGeos, false), stoneFoundationMat);
  mergedPadsMesh.castShadow = true;
  mergedPadsMesh.receiveShadow = true;
  cabinGroup.add(mergedPadsMesh);

  // Sturdy diagonal timber sway braces (X-bracing strictly under the deck sides)
  const sideBraceConfigs = [
    { x: -2.3, z1: -1.9, z2: 0.5 },
    { x: -2.3, z1: 0.5,  z2: 2.9 },
    { x: 2.3,  z1: -1.9, z2: 0.5 },
    { x: 2.3,  z1: 0.5,  z2: 2.9 }
  ];

  const sideBraceGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.8, 4);
  const braceAngle = Math.atan2(2.4, 1.8);
  const braceGeos = [];

  sideBraceConfigs.forEach(b => {
    const midZ = (b.z1 + b.z2) / 2;

    const b1 = sideBraceGeo.clone();
    b1.rotateX(braceAngle);
    b1.translate(b.x, 0.05, midZ);
    braceGeos.push(b1);

    const b2 = sideBraceGeo.clone();
    b2.rotateX(-braceAngle);
    b2.translate(b.x, 0.05, midZ);
    braceGeos.push(b2);
  });

  const mergedBracesMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(braceGeos, false), logSecondaryMat);
  mergedBracesMesh.castShadow = true;
  cabinGroup.add(mergedBracesMesh);

  // ---------------------------------------------------------------------------
  // 3. Deck & Porch Platform (Planked Floor & Rim Joists - Merged Batches)
  // ---------------------------------------------------------------------------
  const rimGeos = [];
  const rf = new THREE.BoxGeometry(5.3, 0.28, 0.18);
  rf.translate(0, 0.98, 3.1);
  rimGeos.push(rf);

  const rb = new THREE.BoxGeometry(5.3, 0.28, 0.18);
  rb.translate(0, 0.98, -2.1);
  rimGeos.push(rb);

  const rl = new THREE.BoxGeometry(0.18, 0.28, 5.2);
  rl.translate(-2.56, 0.98, 0.5);
  rimGeos.push(rl);

  const rr = new THREE.BoxGeometry(0.18, 0.28, 5.2);
  rr.translate(2.56, 0.98, 0.5);
  rimGeos.push(rr);

  const sf = new THREE.BoxGeometry(5.12, 0.14, 5.02);
  sf.translate(0, 0.93, 0.5);
  rimGeos.push(sf);

  const mergedRimMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(rimGeos, false), trimWoodMat);
  mergedRimMesh.castShadow = true;
  mergedRimMesh.receiveShadow = true;
  cabinGroup.add(mergedRimMesh);

  // Batched deck planks on exposed porch area
  const porchPlankCount = 23;
  const plankWidth = 5.0 / porchPlankCount;
  const primaryPlankGeos = [];
  const altPlankGeos = [];

  for (let i = 0; i < porchPlankCount; i++) {
    const px = -2.44 + i * plankWidth + plankWidth * 0.5;
    const pg = new THREE.BoxGeometry(plankWidth * 0.90, 0.08, 1.88);
    pg.translate(px, 1.10, 2.15);
    if (i % 3 === 0) {
      altPlankGeos.push(pg);
    } else {
      primaryPlankGeos.push(pg);
    }
  }

  // Interior floor included with primary deck wood
  const ifloorGeo = new THREE.BoxGeometry(4.0, 0.08, 3.2);
  ifloorGeo.translate(0, 1.10, -0.4);
  primaryPlankGeos.push(ifloorGeo);

  const mergedPrimaryPlanks = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(primaryPlankGeos, false), deckWoodMat);
  mergedPrimaryPlanks.receiveShadow = true;
  mergedPrimaryPlanks.castShadow = true;
  cabinGroup.add(mergedPrimaryPlanks);

  if (altPlankGeos.length > 0) {
    const mergedAltPlanks = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(altPlankGeos, false), deckPlankAltMat);
    mergedAltPlanks.receiveShadow = true;
    mergedAltPlanks.castShadow = true;
    cabinGroup.add(mergedAltPlanks);
  }

  // ---------------------------------------------------------------------------
  // 4. Interlocking Cedar Log Walls (Alternating Saddle-Notch Courses, Zero Clipping)
  // ---------------------------------------------------------------------------
  // Footprint: X in [-2.0, 2.0] (4.0m wide), Z in [-2.0, 1.2] (3.2m deep)
  // 12 alternating tiers:
  // - Even tiers (0, 2, 4, 6, 8, 10): Front & Back X-Logs (ends extend on Left & Right)
  // - Odd tiers (1, 3, 5, 7, 9, 11): Left & Right Z-Logs (ends extend on Front & Back)
  // No two logs share the same corner position and height, eliminating 100% of clipping & Z-fighting!
  const logTiers = 12;
  const logRadius = 0.13;
  const tierHeight = 0.245;
  const cornerExt = 0.26; // Protruding length beyond wall corners

  const logGroup = new THREE.Group();

  // Low-poly cylinder geometries (8 segments for smooth log silhouette)
  const fullXLogGeo = new THREE.CylinderGeometry(logRadius, logRadius, 4.0 + cornerExt * 2, 8, 1, false);
  const fullZLogGeo = new THREE.CylinderGeometry(logRadius, logRadius, 3.2 + cornerExt * 2, 8, 1, false);

  // Cabin interior room walls (Leaves an open cutout behind the front window! Merged into 1 mesh)
  const roomMat = new THREE.MeshStandardMaterial({ color: 0x302217, roughness: 0.92, flatShading: true });
  const roomGeos = [];

  const rbGeom = new THREE.BoxGeometry(3.8, 3.0, 0.08);
  rbGeom.translate(0, 2.65, -1.94);
  roomGeos.push(rbGeom);

  const rlGeom = new THREE.BoxGeometry(0.08, 3.0, 3.0);
  rlGeom.translate(-1.94, 2.65, -0.4);
  roomGeos.push(rlGeom);

  const rrBGeom = new THREE.BoxGeometry(0.08, 3.0, 0.9);
  rrBGeom.translate(1.94, 2.65, -1.45);
  roomGeos.push(rrBGeom);

  const rrFGeom = new THREE.BoxGeometry(0.08, 3.0, 0.9);
  rrFGeom.translate(1.94, 2.65, 0.65);
  roomGeos.push(rrFGeom);

  const rrHGeom = new THREE.BoxGeometry(0.08, 0.90, 1.22);
  rrHGeom.translate(1.94, 3.70, -0.40);
  roomGeos.push(rrHGeom);

  const rrSGeom = new THREE.BoxGeometry(0.08, 1.15, 1.22);
  rrSGeom.translate(1.94, 1.675, -0.40);
  roomGeos.push(rrSGeom);

  const rfLGeom = new THREE.BoxGeometry(0.35, 3.0, 0.08);
  rfLGeom.translate(-1.825, 2.65, 1.15);
  roomGeos.push(rfLGeom);

  const rfMGeom = new THREE.BoxGeometry(0.85, 3.0, 0.08);
  rfMGeom.translate(0.0, 2.65, 1.15);
  roomGeos.push(rfMGeom);

  const rfRGeom = new THREE.BoxGeometry(0.55, 3.0, 0.08);
  rfRGeom.translate(1.725, 2.65, 1.15);
  roomGeos.push(rfRGeom);

  const rfHGeom = new THREE.BoxGeometry(3.8, 0.8, 0.08);
  rfHGeom.translate(0, 3.75, 1.15);
  roomGeos.push(rfHGeom);

  const rfSGeom = new THREE.BoxGeometry(1.3, 0.85, 0.08);
  rfSGeom.translate(-1.10, 1.62, 1.15);
  roomGeos.push(rfSGeom);

  const mergedRoomMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(roomGeos, false), roomMat);
  mergedRoomMesh.receiveShadow = true;
  logGroup.add(mergedRoomMesh);

  for (let t = 0; t < logTiers; t++) {
    const curY = 1.25 + t * tierHeight;
    const isEven = (t % 2 === 0);
    const activeMatArray = (t % 4 < 2) ? logMatArray1 : logMatArray2;

    if (isEven) {
      // EVEN TIERS: Horizontal X-Logs on Back Wall (z = -2.0) and Front Wall (z = 1.2)
      // Log ends protrude left (-X) and right (+X)
      const backLog = new THREE.Mesh(fullXLogGeo, activeMatArray);
      backLog.rotation.z = Math.PI / 2;
      backLog.position.set(0, curY, -2.0);
      backLog.castShadow = true;
      backLog.receiveShadow = true;
      logGroup.add(backLog);

      // Front Wall X-Log segments
      if (t <= 2) {
        // Lower tiers: below front window
        const fSeg1 = new THREE.Mesh(new THREE.CylinderGeometry(logRadius, logRadius, 0.25 + cornerExt, 8, 1, false), activeMatArray);
        fSeg1.rotation.z = Math.PI / 2;
        fSeg1.position.set(-1.875 - cornerExt * 0.5, curY, 1.2);
        fSeg1.castShadow = true;

        const fUnderWin = new THREE.Mesh(new THREE.CylinderGeometry(logRadius, logRadius, 1.30, 8, 1, false), activeMatArray);
        fUnderWin.rotation.z = Math.PI / 2;
        fUnderWin.position.set(-1.10, curY, 1.2);
        fUnderWin.castShadow = true;

        const fSegMid = new THREE.Mesh(new THREE.CylinderGeometry(logRadius, logRadius, 0.90, 8, 1, false), activeMatArray);
        fSegMid.rotation.z = Math.PI / 2;
        fSegMid.position.set(0.0, curY, 1.2);
        fSegMid.castShadow = true;

        const fSegR = new THREE.Mesh(new THREE.CylinderGeometry(logRadius, logRadius, 0.55 + cornerExt, 8, 1, false), activeMatArray);
        fSegR.rotation.z = Math.PI / 2;
        fSegR.position.set(1.725 + cornerExt * 0.5, curY, 1.2);
        fSegR.castShadow = true;

        logGroup.add(fSeg1, fUnderWin, fSegMid, fSegR);
      } else if (t <= 8) {
        // Mid tiers: window opening at x in [-1.75, -0.45] and door opening at x in [0.45, 1.45]
        const fSeg1 = new THREE.Mesh(new THREE.CylinderGeometry(logRadius, logRadius, 0.25 + cornerExt, 8, 1, false), activeMatArray);
        fSeg1.rotation.z = Math.PI / 2;
        fSeg1.position.set(-1.875 - cornerExt * 0.5, curY, 1.2);
        fSeg1.castShadow = true;

        const fSegMid = new THREE.Mesh(new THREE.CylinderGeometry(logRadius, logRadius, 0.90, 8, 1, false), activeMatArray);
        fSegMid.rotation.z = Math.PI / 2;
        fSegMid.position.set(0.0, curY, 1.2);
        fSegMid.castShadow = true;

        const fSegR = new THREE.Mesh(new THREE.CylinderGeometry(logRadius, logRadius, 0.55 + cornerExt, 8, 1, false), activeMatArray);
        fSegR.rotation.z = Math.PI / 2;
        fSegR.position.set(1.725 + cornerExt * 0.5, curY, 1.2);
        fSegR.castShadow = true;

        logGroup.add(fSeg1, fSegMid, fSegR);
      } else {
        // Upper header logs spanning across
        const frontLog = new THREE.Mesh(fullXLogGeo, activeMatArray);
        frontLog.rotation.z = Math.PI / 2;
        frontLog.position.set(0, curY, 1.2);
        frontLog.castShadow = true;
        frontLog.receiveShadow = true;
        logGroup.add(frontLog);
      }
    } else {
      // ODD TIERS: Horizontal Z-Logs on Left Wall (x = -2.0) and Right Wall (x = 2.0)
      // Log ends protrude front (+Z) and back (-Z)
      const leftLog = new THREE.Mesh(fullZLogGeo, activeMatArray);
      leftLog.rotation.x = Math.PI / 2;
      leftLog.position.set(-2.0, curY, -0.4);
      leftLog.castShadow = true;
      leftLog.receiveShadow = true;
      logGroup.add(leftLog);

      if (t === 5 || t === 7) {
        // Right wall has side window opening in middle
        const rBackLen = 1.0 + cornerExt;
        const rLogBack = new THREE.Mesh(new THREE.CylinderGeometry(logRadius, logRadius, rBackLen, 8, 1, false), activeMatArray);
        rLogBack.rotation.x = Math.PI / 2;
        rLogBack.position.set(2.0, curY, -1.5 - cornerExt * 0.5);
        rLogBack.castShadow = true;

        const rFrontLen = 1.0 + cornerExt;
        const rLogFront = new THREE.Mesh(new THREE.CylinderGeometry(logRadius, logRadius, rFrontLen, 8, 1, false), activeMatArray);
        rLogFront.rotation.x = Math.PI / 2;
        rLogFront.position.set(2.0, curY, 0.7 + cornerExt * 0.5);
        rLogFront.castShadow = true;

        logGroup.add(rLogBack, rLogFront);
      } else {
        const rightLog = new THREE.Mesh(fullZLogGeo, activeMatArray);
        rightLog.rotation.x = Math.PI / 2;
        rightLog.position.set(2.0, curY, -0.4);
        rightLog.castShadow = true;
        rightLog.receiveShadow = true;
        logGroup.add(rightLog);
      }
    }
  }

  cabinGroup.add(logGroup);

  // ---------------------------------------------------------------------------
  // 5. Classic Timber Gable Roof & Attic Structure (Peaked A-Frame)
  // ---------------------------------------------------------------------------
  const roofGroup = new THREE.Group();

  const roofPitch = 0.596; // 34.15° slope
  const slopeLength = Math.sqrt(2.58 * 2.58 + 1.75 * 1.75); // ~3.12m
  const roofLength = 3.84;

  const roofSlopeGeo = new THREE.BoxGeometry(slopeLength, 0.12, roofLength);

  // Left Slope: descends from ridge (x=0) to left eave (x=-2.58) -> angle around Z is +roofPitch
  const leftSlope = new THREE.Mesh(roofSlopeGeo, roofMat);
  leftSlope.position.set(-1.29, 4.775, -0.45);
  leftSlope.rotation.z = roofPitch;
  leftSlope.castShadow = true;
  leftSlope.receiveShadow = true;

  // Right Slope: descends from ridge (x=0) to right eave (x=+2.58) -> angle around Z is -roofPitch
  const rightSlope = new THREE.Mesh(roofSlopeGeo, roofMat);
  rightSlope.position.set(1.29, 4.775, -0.45);
  rightSlope.rotation.z = -roofPitch;
  rightSlope.castShadow = true;
  rightSlope.receiveShadow = true;

  roofGroup.add(leftSlope, rightSlope);

  // Shingle Battens across both slopes
  const shingleRows = 7;
  for (let s = 0; s < shingleRows; s++) {
    const frac = (s + 0.5) / shingleRows;
    const localX = -slopeLength * 0.5 + frac * slopeLength;
    const slatGeo = new THREE.BoxGeometry(0.24, 0.05, roofLength + 0.02);

    const lSlat = new THREE.Mesh(slatGeo, roofTrimMat);
    lSlat.position.set(localX, 0.08, 0);
    leftSlope.add(lSlat);

    const rSlat = new THREE.Mesh(slatGeo, roofTrimMat);
    rSlat.position.set(localX, 0.08, 0);
    rightSlope.add(rSlat);
  }

  // Ridge Cap Beam along the peak
  const ridgeCap = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, roofLength + 0.08), roofTrimMat);
  ridgeCap.position.set(0, 5.68, -0.45);
  ridgeCap.castShadow = true;
  roofGroup.add(ridgeCap);

  // Crossed Timber Apex Finials
  const finialGeo = new THREE.BoxGeometry(0.12, 0.75, 0.14);
  [-1.48, 2.38].forEach(fz => {
    const finial1 = new THREE.Mesh(finialGeo, trimWoodMat);
    finial1.position.set(0, 5.75, fz - 0.45);
    finial1.rotation.z = 0.48;
    finial1.castShadow = true;

    const finial2 = new THREE.Mesh(finialGeo, trimWoodMat);
    finial2.position.set(0, 5.75, fz - 0.45);
    finial2.rotation.z = -0.48;
    finial2.castShadow = true;

    roofGroup.add(finial1, finial2);
  });

  // Gable Bargeboards
  const bargeboardGeo = new THREE.BoxGeometry(slopeLength + 0.1, 0.20, 0.12);
  [-1.46, 2.36].forEach(bz => {
    const bLeft = new THREE.Mesh(bargeboardGeo, trimWoodMat);
    bLeft.position.set(-1.29, 4.80, bz - 0.45);
    bLeft.rotation.z = roofPitch;
    bLeft.castShadow = true;

    const bRight = new THREE.Mesh(bargeboardGeo, trimWoodMat);
    bRight.position.set(1.29, 4.80, bz - 0.45);
    bRight.rotation.z = -roofPitch;
    bRight.castShadow = true;

    roofGroup.add(bLeft, bRight);
  });

  // Exposed Rafter Tails
  const rafterCount = 8;
  const rafterGeo = new THREE.BoxGeometry(0.08, 0.12, 0.16);
  for (let r = 0; r < rafterCount; r++) {
    const rz = -2.15 + r * (3.5 / (rafterCount - 1));
    const rLeft = new THREE.Mesh(rafterGeo, trimWoodMat);
    rLeft.position.set(-2.52, 3.88, rz);
    const rRight = new THREE.Mesh(rafterGeo, trimWoodMat);
    rRight.position.set(2.52, 3.88, rz);
    roofGroup.add(rLeft, rRight);
  }

  // Gable Walls with Horizontal Siding
  const gableSidingRows = 6;
  const gableBaseWidth = 4.0;
  const gableHeight = 1.40;
  [-2.0, 1.20].forEach(gz => {
    for (let row = 0; row < gableSidingRows; row++) {
      const frac = row / gableSidingRows;
      const rowY = 4.25 + (row + 0.5) * (gableHeight / gableSidingRows);
      const rowWidth = gableBaseWidth * (1.0 - frac * 0.92);
      const plank = new THREE.Mesh(
        new THREE.BoxGeometry(rowWidth, 0.22, 0.08),
        (row % 2 === 0) ? deckWoodMat : deckPlankAltMat
      );
      plank.position.set(0, rowY, gz);
      plank.castShadow = true;
      plank.receiveShadow = true;
      roofGroup.add(plank);
    }
  });

  // Front Gable King-Post Truss
  const kingPost = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.35, 0.10), trimWoodMat);
  kingPost.position.set(0, 4.90, 1.25);
  kingPost.castShadow = true;

  const trussTieBeam = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.14, 0.12), trimWoodMat);
  trussTieBeam.position.set(0, 4.22, 1.25);
  trussTieBeam.castShadow = true;

  const strutAngle = 0.75;
  const trussStrutGeo = new THREE.BoxGeometry(0.08, 1.15, 0.08);
  const leftStrut = new THREE.Mesh(trussStrutGeo, trimWoodMat);
  leftStrut.position.set(-0.65, 4.72, 1.25);
  leftStrut.rotation.z = strutAngle;

  const rightStrut = new THREE.Mesh(trussStrutGeo, trimWoodMat);
  rightStrut.position.set(0.65, 4.72, 1.25);
  rightStrut.rotation.z = -strutAngle;

  roofGroup.add(kingPost, trussTieBeam, leftStrut, rightStrut);

  // Glowing Diamond Attic Loft Window
  const atticWinGroup = new THREE.Group();
  atticWinGroup.position.set(0, 4.95, 1.26);

  const atticWinGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.48), windowGlowMat);
  atticWinGlass.rotation.z = Math.PI / 4;
  atticWinGroup.add(atticWinGlass);

  const atticFrame = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.08), trimWoodMat);
  const atticFrameH = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.08), trimWoodMat);
  atticWinGroup.add(atticFrame, atticFrameH);

  roofGroup.add(atticWinGroup);

  cabinGroup.add(roofGroup);

  // ---------------------------------------------------------------------------
  // 6. Porch Roof & Support Pillars with Timber Corbels
  // ---------------------------------------------------------------------------
  const porchRoofGeo = new THREE.BoxGeometry(4.6, 0.12, 2.15);
  const porchRoof = new THREE.Mesh(porchRoofGeo, roofMat);
  porchRoof.position.set(0, 3.75, 2.22);
  porchRoof.rotation.x = 0.25;
  porchRoof.castShadow = true;
  porchRoof.receiveShadow = true;
  cabinGroup.add(porchRoof);

  for (let ps = 0; ps < 5; ps++) {
    const pSlat = new THREE.Mesh(new THREE.BoxGeometry(4.62, 0.04, 0.38), roofTrimMat);
    pSlat.position.set(0, 0.07, -0.85 + ps * 0.42);
    porchRoof.add(pSlat);
  }

  // Front Porch Pillars (Corner timber columns supporting the porch roof)
  const pillarGeo = new THREE.CylinderGeometry(0.14, 0.15, 2.50, 6);
  const p1 = new THREE.Mesh(pillarGeo, logPrimaryMat);
  p1.position.set(-2.38, 2.35, 2.95);
  p1.castShadow = true;
  p1.receiveShadow = true;

  const p2 = new THREE.Mesh(pillarGeo, logPrimaryMat);
  p2.position.set(2.38, 2.35, 2.95);
  p2.castShadow = true;
  p2.receiveShadow = true;
  cabinGroup.add(p1, p2);

  const porchHeader = new THREE.Mesh(new THREE.BoxGeometry(4.88, 0.16, 0.16), trimWoodMat);
  porchHeader.position.set(0, 3.58, 2.95);
  porchHeader.castShadow = true;
  cabinGroup.add(porchHeader);

  // Timber Corbels
  const corbelGeo = new THREE.BoxGeometry(0.09, 0.55, 0.09);
  const c1 = new THREE.Mesh(corbelGeo, trimWoodMat);
  c1.position.set(-2.10, 3.32, 2.95);
  c1.rotation.z = -Math.PI / 4;
  c1.castShadow = true;

  const c2 = new THREE.Mesh(corbelGeo, trimWoodMat);
  c2.position.set(2.10, 3.32, 2.95);
  c2.rotation.z = Math.PI / 4;
  c2.castShadow = true;

  const c3 = new THREE.Mesh(corbelGeo, trimWoodMat);
  c3.position.set(-2.38, 3.32, 2.67);
  c3.rotation.x = -Math.PI / 4;

  const c4 = new THREE.Mesh(corbelGeo, trimWoodMat);
  c4.position.set(2.38, 3.32, 2.67);
  c4.rotation.x = -Math.PI / 4;
  cabinGroup.add(c1, c2, c3, c4);

  // ---------------------------------------------------------------------------
  // 7. Porch Railings & Fully Connected Balustered Staircase
  // ---------------------------------------------------------------------------
  const railingMat = deckWoodMat;

  // Deck Timber Posts with Caps (Stair opening and back wall terminations)
  const postGeo = new THREE.BoxGeometry(0.15, 0.95, 0.15);
  const capGeo = new THREE.ConeGeometry(0.12, 0.08, 4);
  const postPositions = [
    { x: -0.70, y: 1.60, z: 2.95 }, // Left stair opening post
    { x: 0.70,  y: 1.60, z: 2.95 },  // Right stair opening post
    { x: -2.38, y: 1.60, z: 1.20 }, // Back-left wall termination post
    { x: 2.38,  y: 1.60, z: 1.20 }  // Back-right wall termination post
  ];

  postPositions.forEach(p => {
    const post = new THREE.Mesh(postGeo, railingMat);
    post.position.set(p.x, p.y, p.z);
    post.castShadow = true;
    post.receiveShadow = true;

    const cap = new THREE.Mesh(capGeo, trimWoodMat);
    cap.position.set(0, 0.51, 0);
    cap.rotation.y = Math.PI / 4;
    post.add(cap);

    cabinGroup.add(post);
  });

  // Top Rails (Connecting flush between stair posts and corner pillars without clipping)
  const railFrontGeo = new THREE.BoxGeometry(1.54, 0.08, 0.10);
  const leftFrontTopRail = new THREE.Mesh(railFrontGeo, railingMat);
  leftFrontTopRail.position.set(-1.51, 2.02, 2.95);
  const rightFrontTopRail = new THREE.Mesh(railFrontGeo, railingMat);
  rightFrontTopRail.position.set(1.51, 2.02, 2.95);

  const railSideGeo = new THREE.BoxGeometry(0.10, 0.08, 1.60);
  const leftSideTopRail = new THREE.Mesh(railSideGeo, railingMat);
  leftSideTopRail.position.set(-2.38, 2.02, 2.04);
  const rightSideTopRail = new THREE.Mesh(railSideGeo, railingMat);
  rightSideTopRail.position.set(2.38, 2.02, 2.04);
  cabinGroup.add(leftFrontTopRail, rightFrontTopRail, leftSideTopRail, rightSideTopRail);

  // Bottom Rails
  const railFrontBottomGeo = new THREE.BoxGeometry(1.54, 0.06, 0.08);
  const leftFrontBottomRail = new THREE.Mesh(railFrontBottomGeo, railingMat);
  leftFrontBottomRail.position.set(-1.51, 1.26, 2.95);
  const rightFrontBottomRail = new THREE.Mesh(railFrontBottomGeo, railingMat);
  rightFrontBottomRail.position.set(1.51, 1.26, 2.95);

  const railSideBottomGeo = new THREE.BoxGeometry(0.08, 0.06, 1.60);
  const leftSideBottomRail = new THREE.Mesh(railSideBottomGeo, railingMat);
  leftSideBottomRail.position.set(-2.38, 1.26, 2.04);
  const rightSideBottomRail = new THREE.Mesh(railSideBottomGeo, railingMat);
  rightSideBottomRail.position.set(2.38, 1.26, 2.04);
  cabinGroup.add(leftFrontBottomRail, rightFrontBottomRail, leftSideBottomRail, rightSideBottomRail);

  // Balusters (Pickets evenly distributed between posts and corner pillars)
  const picketGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.68, 4);

  [-1.02, -1.35, -1.68, -2.00].forEach(bx => {
    const picket = new THREE.Mesh(picketGeo, railingMat);
    picket.position.set(bx, 1.64, 2.95);
    picket.castShadow = true;
    cabinGroup.add(picket);
  });

  [1.02, 1.35, 1.68, 2.00].forEach(bx => {
    const picket = new THREE.Mesh(picketGeo, railingMat);
    picket.position.set(bx, 1.64, 2.95);
    picket.castShadow = true;
    cabinGroup.add(picket);
  });

  [1.44, 1.74, 2.04, 2.34, 2.64].forEach(bz => {
    const leftPicket = new THREE.Mesh(picketGeo, railingMat);
    leftPicket.position.set(-2.38, 1.64, bz);
    leftPicket.castShadow = true;

    const rightPicket = new THREE.Mesh(picketGeo, railingMat);
    rightPicket.position.set(2.38, 1.64, bz);
    rightPicket.castShadow = true;

    cabinGroup.add(leftPicket, rightPicket);
  });

  // Stairs: 4 steps stepping down from porch deck to plateau rock
  const stepCount = 4;
  const stepWidth = 1.30;
  const stepDepth = 0.36;
  const stepHeight = 0.22;

  for (let s = 0; s < stepCount; s++) {
    const sy = 0.88 - s * stepHeight;
    const sz = 3.28 + s * 0.32;

    const tread = new THREE.Mesh(new THREE.BoxGeometry(stepWidth, 0.08, stepDepth), deckWoodMat);
    tread.position.set(0, sy, sz);
    tread.castShadow = true;
    tread.receiveShadow = true;

    const riser = new THREE.Mesh(new THREE.BoxGeometry(stepWidth, stepHeight, 0.05), trimWoodMat);
    riser.position.set(0, sy - stepHeight * 0.5, sz - stepDepth * 0.45);
    riser.castShadow = true;

    cabinGroup.add(tread, riser);
  }

  // Side stair stringers
  const stringerGeo = new THREE.BoxGeometry(0.08, 0.22, 1.60);
  const leftStringer = new THREE.Mesh(stringerGeo, trimWoodMat);
  leftStringer.position.set(-0.68, 0.55, 3.725);
  leftStringer.rotation.x = 0.675;
  leftStringer.castShadow = true;

  const rightStringer = new THREE.Mesh(stringerGeo, trimWoodMat);
  rightStringer.position.set(0.68, 0.55, 3.725);
  rightStringer.rotation.x = 0.675;
  rightStringer.castShadow = true;
  cabinGroup.add(leftStringer, rightStringer);

  // Stair bottom newel posts
  const bottomPostL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.90, 0.12), railingMat);
  bottomPostL.position.set(-0.70, 0.45, 4.35);
  bottomPostL.castShadow = true;

  const bottomPostR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.90, 0.12), railingMat);
  bottomPostR.position.set(0.70, 0.45, 4.35);
  bottomPostR.castShadow = true;
  cabinGroup.add(bottomPostL, bottomPostR);

  // Stair descending handrails
  const stairRailGeo = new THREE.BoxGeometry(0.08, 0.08, 1.61);
  const stairRailL = new THREE.Mesh(stairRailGeo, railingMat);
  stairRailL.position.set(-0.70, 1.16, 3.675);
  stairRailL.rotation.x = 0.577;
  stairRailL.castShadow = true;

  const stairRailR = new THREE.Mesh(stairRailGeo, railingMat);
  stairRailR.position.set(0.70, 1.16, 3.675);
  stairRailR.rotation.x = 0.577;
  stairRailR.castShadow = true;
  cabinGroup.add(stairRailL, stairRailR);

  // ---------------------------------------------------------------------------
  // 8. Detailed Rustic Doorway & Hardware
  // ---------------------------------------------------------------------------
  const doorGroup = new THREE.Group();
  doorGroup.position.set(0.92, 2.14, 1.22);

  const jambLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.98, 0.14), trimWoodMat);
  jambLeft.position.set(-0.48, 0, 0.02);
  const jambRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.98, 0.14), trimWoodMat);
  jambRight.position.set(0.48, 0, 0.02);
  const jambHeader = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.10, 0.16), trimWoodMat);
  jambHeader.position.set(0, 1.02, 0.03);
  doorGroup.add(jambLeft, jambRight, jambHeader);

  const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.88, 1.94, 0.08), logSecondaryMat);
  doorLeaf.position.set(0, 0, 0);
  doorLeaf.castShadow = true;
  doorGroup.add(doorLeaf);

  const doorWindowGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.44), windowGlowMat);
  doorWindowGlass.position.set(0, 0.42, 0.045);
  const doorWinCrossV = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.44, 0.02), trimWoodMat);
  doorWinCrossV.position.set(0, 0.42, 0.05);
  const doorWinCrossH = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.02), trimWoodMat);
  doorWinCrossH.position.set(0, 0.42, 0.05);
  doorGroup.add(doorWindowGlass, doorWinCrossV, doorWinCrossH);

  const doorBattenLower = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.10, 0.02), trimWoodMat);
  doorBattenLower.position.set(0, -0.45, 0.045);
  doorGroup.add(doorBattenLower);

  // Door Hardware (Vintage brass latch and lever)
  const handleBackplate = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.015), brassMat);
  handleBackplate.position.set(-0.32, -0.05, 0.045);
  const doorLever = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.10, 5), brassMat);
  doorLever.rotation.z = Math.PI / 2;
  doorLever.position.set(-0.36, -0.02, 0.065);
  doorGroup.add(handleBackplate, doorLever);

  cabinGroup.add(doorGroup);

  // Woven Welcome Mat
  const welcomeMat = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.025, 0.48),
    new THREE.MeshStandardMaterial({ color: 0x8a6a48, roughness: 0.95, flatShading: true })
  );
  welcomeMat.position.set(0.92, 1.15, 1.55);
  welcomeMat.receiveShadow = true;
  cabinGroup.add(welcomeMat);

  // Carriage Sconce Lantern beside Door
  const sconceGroup = new THREE.Group();
  sconceGroup.position.set(0.32, 2.62, 1.25);

  const sconceBracket = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.16), metalMat);
  sconceBracket.position.set(0, 0, 0.08);
  const sconceCap = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.10, 5), metalMat);
  sconceCap.position.set(0, 0.12, 0.16);
  const sconceBulb = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.18, 5), windowGlowMat);
  sconceBulb.position.set(0, 0, 0.16);
  sconceGroup.add(sconceBracket, sconceCap, sconceBulb);

  const sconceLight = new THREE.PointLight(0xff9922, 2.0, 5.5, 2.0);
  sconceLight.position.set(0, 0, 0.18);
  sconceLight.castShadow = false;
  sconceGroup.add(sconceLight);

  cabinGroup.add(sconceGroup);

  // ---------------------------------------------------------------------------
  // 9. Transparent Multi-Pane Windows & Clearly Visible Interior Workstation
  // ---------------------------------------------------------------------------
  // A. Front Window: Transparent 6-Pane Glass reveals the lit desk & CRT workstation!
  const frontWinGroup = new THREE.Group();
  frontWinGroup.position.set(-1.10, 2.76, 1.22);

  const winFrontGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.24, 1.04), winGlassMat);
  winFrontGlass.position.z = 0.01;
  frontWinGroup.add(winFrontGlass);

  const winFrontFrameT = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.08, 0.12), trimWoodMat);
  winFrontFrameT.position.set(0, 0.56, 0.04);
  const winFrontFrameB = new THREE.Mesh(new THREE.BoxGeometry(1.50, 0.10, 0.18), trimWoodMat);
  winFrontFrameB.position.set(0, -0.56, 0.07);
  winFrontFrameB.castShadow = true;
  const winFrontFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.10, 0.12), trimWoodMat);
  winFrontFrameL.position.set(-0.64, 0, 0.04);
  const winFrontFrameR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.10, 0.12), trimWoodMat);
  winFrontFrameR.position.set(0.64, 0, 0.04);
  frontWinGroup.add(winFrontFrameT, winFrontFrameB, winFrontFrameL, winFrontFrameR);

  // Wooden muntin bars
  const muntinV1 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.04, 0.04), trimWoodMat);
  muntinV1.position.set(-0.21, 0, 0.02);
  const muntinV2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.04, 0.04), trimWoodMat);
  muntinV2.position.set(0.21, 0, 0.02);
  const muntinH1 = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.04, 0.04), trimWoodMat);
  muntinH1.position.set(0, 0, 0.02);
  frontWinGroup.add(muntinV1, muntinV2, muntinH1);

  // Planter Box with Alpine Greenery (Positioned neatly beneath window frame)
  const planterBox = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.20, 0.22), logPrimaryMat);
  planterBox.position.set(0, -0.80, 0.14);
  planterBox.castShadow = true;
  frontWinGroup.add(planterBox);

  for (let f = 0; f < 7; f++) {
    const fol = new THREE.Mesh(new THREE.DodecahedronGeometry(0.10, 0), alpinePineMat);
    fol.position.set(-0.48 + f * 0.16 + (Math.random() - 0.5) * 0.04, -0.68, 0.14);
    fol.scale.set(1.0, 0.85, 0.85);
    frontWinGroup.add(fol);
  }

  cabinGroup.add(frontWinGroup);

  // B. Interior Cabin Workstation (Directly aligned in plain view through the front window!)
  const interiorDeskGroup = new THREE.Group();
  interiorDeskGroup.position.set(-1.10, 1.38, 0.80);

  // Wooden desk surface
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.50, 0.08, 0.70), deckWoodMat);
  deskTop.position.set(0, 0.95, 0);
  deskTop.receiveShadow = true;
  deskTop.castShadow = true;
  interiorDeskGroup.add(deskTop);

  // Desk legs
  const deskLegGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.95, 5);
  [
    { x: -0.68, z: -0.28 }, { x: 0.68, z: -0.28 },
    { x: -0.68, z: 0.28 },  { x: 0.68, z: 0.28 }
  ].forEach(lp => {
    const leg = new THREE.Mesh(deskLegGeo, trimWoodMat);
    leg.position.set(lp.x, 0.475, lp.z);
    interiorDeskGroup.add(leg);
  });

  // Retro CRT Monitor Body & Phosphor Screen
  const crtMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.75, flatShading: true });
  const crtScreenMat = new THREE.MeshStandardMaterial({
    color: 0x4ade80,
    emissive: 0x22c55e,
    emissiveIntensity: 2.8, // Crisp, bright retro terminal phosphor green
    roughness: 0.2
  });

  const crtCase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.42, 0.36), crtMat);
  crtCase.position.set(-0.08, 1.22, -0.05);
  crtCase.castShadow = true;

  const crtScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.32), crtScreenMat);
  crtScreen.position.set(-0.08, 1.22, 0.135); // Faces directly forward out through the window!

  // Keyboard in front of monitor
  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.16), crtMat);
  keyboard.position.set(-0.08, 1.01, 0.20);
  keyboard.rotation.x = -0.12;
  interiorDeskGroup.add(crtCase, crtScreen, keyboard);

  // Minicomputer Tower with blinking status LED
  const pcTower = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.46, 0.42), crtMat);
  pcTower.position.set(0.55, 1.22, -0.05);
  const pcLed = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 6, 6),
    new THREE.MeshBasicMaterial({ color: 0x22c55e })
  );
  pcLed.position.set(0.55, 1.38, 0.165);
  interiorDeskGroup.add(pcTower, pcLed);

  // Steaming Coffee Mug right on the interior desk!
  const deskMug = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.13, 8), porcelainMat);
  deskMug.position.set(-0.52, 1.06, 0.15);
  const deskCoffeeSurface = new THREE.Mesh(new THREE.CircleGeometry(0.055, 8), coffeeLiquidMat);
  deskCoffeeSurface.rotation.x = -Math.PI / 2;
  deskCoffeeSurface.position.set(-0.52, 1.126, 0.15);
  interiorDeskGroup.add(deskMug, deskCoffeeSurface);

  // Vintage Brass Banker's / Architect Desk Lamp casting dedicated warm light
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.03, 7), brassMat);
  lampBase.position.set(0.28, 1.01, -0.18);
  const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.28, 5), brassMat);
  lampStem.position.set(0.28, 1.15, -0.18);
  const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 0.16, 7), brassMat);
  lampShade.position.set(0.24, 1.28, -0.08);
  lampShade.rotation.z = -0.45;
  interiorDeskGroup.add(lampBase, lampStem, lampShade);

  // Desk Pool Light: bathes the desk surface, keyboard, mug, and CRT in warm radiance
  const deskTaskLight = new THREE.PointLight(0xffdf99, 3.8, 5.0, 1.7);
  deskTaskLight.position.set(-0.10, 1.45, 0.10);
  deskTaskLight.castShadow = false;
  interiorDeskGroup.add(deskTaskLight);

  cabinGroup.add(interiorDeskGroup);

  // C. Side Window with Shutters
  const sideWinGroup = new THREE.Group();
  sideWinGroup.position.set(2.02, 2.76, -0.40);
  sideWinGroup.rotation.y = Math.PI / 2;

  const winSideGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.10, 0.95), windowGlowMat);
  winSideGlass.position.z = 0.01;
  sideWinGroup.add(winSideGlass);

  const winSideFrameT = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.08, 0.10), trimWoodMat);
  winSideFrameT.position.set(0, 0.51, 0.03);
  const winSideFrameB = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.10, 0.16), trimWoodMat);
  winSideFrameB.position.set(0, -0.51, 0.06);
  winSideFrameB.castShadow = true;
  const winSideFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.02, 0.10), trimWoodMat);
  winSideFrameL.position.set(-0.57, 0, 0.03);
  const winSideFrameR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.02, 0.10), trimWoodMat);
  winSideFrameR.position.set(0.57, 0, 0.03);
  sideWinGroup.add(winSideFrameT, winSideFrameB, winSideFrameL, winSideFrameR);

  const sideMuntinV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.95, 0.03), trimWoodMat);
  sideMuntinV.position.set(0, 0, 0.02);
  const sideMuntinH = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.04, 0.03), trimWoodMat);
  sideMuntinH.position.set(0, 0, 0.02);
  sideWinGroup.add(sideMuntinV, sideMuntinH);

  const shutterGeo = new THREE.BoxGeometry(0.42, 1.02, 0.05);
  const leftShutter = new THREE.Mesh(shutterGeo, logSecondaryMat);
  leftShutter.position.set(-0.84, 0, 0.03);
  leftShutter.castShadow = true;
  const sZ1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.02), trimWoodMat);
  sZ1.position.set(0, 0.38, 0.03);
  const sZ2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.02), trimWoodMat);
  sZ2.position.set(0, -0.38, 0.03);
  leftShutter.add(sZ1, sZ2);

  const rightShutter = new THREE.Mesh(shutterGeo, logSecondaryMat);
  rightShutter.position.set(0.84, 0, 0.03);
  rightShutter.castShadow = true;
  const sZ3 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.02), trimWoodMat);
  sZ3.position.set(0, 0.38, 0.03);
  const sZ4 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.06, 0.02), trimWoodMat);
  sZ4.position.set(0, -0.38, 0.03);
  rightShutter.add(sZ3, sZ4);

  sideWinGroup.add(leftShutter, rightShutter);
  cabinGroup.add(sideWinGroup);

  // Cabin Ambient Interior Light
  const cabinInteriorLight = new THREE.PointLight(0xff9922, 4.4, 13, 1.8);
  cabinInteriorLight.position.set(0, 3.0, 0);
  cabinInteriorLight.castShadow = false;
  cabinGroup.add(cabinInteriorLight);

  // ---------------------------------------------------------------------------
  // 10. Tiered Stone Masonry Chimney & Smoke Flue
  // ---------------------------------------------------------------------------
  const chimneyGroup = new THREE.Group();
  chimneyGroup.position.set(-1.3, 2.0, -1.0);

  const baseStone = new THREE.Mesh(new THREE.BoxGeometry(1.02, 2.4, 1.02), chimneyStoneDark);
  baseStone.position.set(0, 1.2, 0);
  baseStone.castShadow = true;
  baseStone.receiveShadow = true;
  chimneyGroup.add(baseStone);

  const midStone = new THREE.Mesh(new THREE.BoxGeometry(0.86, 2.0, 0.86), chimneyStoneLight);
  midStone.position.set(0, 3.2, 0);
  midStone.castShadow = true;
  midStone.receiveShadow = true;
  chimneyGroup.add(midStone);

  const upperStone = new THREE.Mesh(new THREE.BoxGeometry(0.74, 1.6, 0.74), chimneyStoneDark);
  upperStone.position.set(0, 4.8, 0);
  upperStone.castShadow = true;
  chimneyGroup.add(upperStone);

  const copingCap = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.16, 0.92), chimneyStoneLight);
  copingCap.position.set(0, 5.68, 0);
  copingCap.castShadow = true;
  chimneyGroup.add(copingCap);

  const fluePot = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.24, 0.44, 7), flueMat);
  fluePot.position.set(0, 5.96, 0);
  fluePot.castShadow = true;
  chimneyGroup.add(fluePot);

  // Glowing interior embers inside flue pot mouth
  const flueEmberMat = new THREE.MeshStandardMaterial({
    color: 0xff5511,
    emissive: 0xff3300,
    emissiveIntensity: 2.8,
    roughness: 0.3
  });
  const flueEmber = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.10, 8), flueEmberMat);
  flueEmber.position.set(0, 6.14, 0);
  chimneyGroup.add(flueEmber);

  // Chimney Hearth Fire Glow Light (Illuminates terracotta flue pot, top coping cap, and base of smoke)
  const chimneyFlueLight = new THREE.PointLight(0xff7722, 4.2, 9.0, 1.4);
  chimneyFlueLight.position.set(0, 6.25, 0);
  chimneyFlueLight.castShadow = false;
  chimneyGroup.add(chimneyFlueLight);

  const stoneBlockGeo = new THREE.BoxGeometry(0.24, 0.14, 0.08);
  const reliefOffsets = [
    { x: -0.28, y: 1.8, z: 0.52, mat: chimneyStoneLight },
    { x: 0.18,  y: 2.2, z: 0.52, mat: chimneyStoneDark },
    { x: -0.12, y: 3.4, z: 0.44, mat: chimneyStoneLight },
    { x: 0.22,  y: 4.2, z: 0.38, mat: chimneyStoneDark },
    { x: 0.38,  y: 4.4, z: -0.12, mat: chimneyStoneLight, rotY: Math.PI / 2 }
  ];
  reliefOffsets.forEach(r => {
    const block = new THREE.Mesh(stoneBlockGeo, r.mat);
    block.position.set(r.x, r.y, r.z);
    if (r.rotY) block.rotation.y = r.rotY;
    chimneyGroup.add(block);
  });

  cabinGroup.add(chimneyGroup);

  // ---------------------------------------------------------------------------
  // 11. Billowy Low-Poly Smoke Particle System
  // ---------------------------------------------------------------------------
  const smokeCount = 24;
  const smokePuffs = [];
  const smokeGeo = new THREE.DodecahedronGeometry(0.25, 0);

  const warmSmokeColor = new THREE.Color(0xeda86b); // Warm hearth-fire ember glow at flue mouth
  const coolSmokeColor = new THREE.Color(0x768aa8); // Cool mountain blue-grey smoke in upper sky

  for (let i = 0; i < smokeCount; i++) {
    const frac = i / (smokeCount - 1);
    const color = warmSmokeColor.clone().lerp(coolSmokeColor, frac);
    const puffMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.38 - frac * 0.22,
      depthWrite: false
    });
    const puff = new THREE.Mesh(smokeGeo, puffMat);
    puff.position.set(
      -1.3 + (Math.random() - 0.5) * 0.10,
      8.20 + frac * 4.4,
      -1.0 + (Math.random() - 0.5) * 0.10
    );
    puff.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    puff.userData = {
      initialY: 8.20,
      maxY: 12.8,
      speed: 0.009 + Math.random() * 0.005,
      rotX: (Math.random() - 0.5) * 0.02,
      rotY: (Math.random() - 0.5) * 0.02,
      rotZ: (Math.random() - 0.5) * 0.02,
      wobbleOffset: i * 0.6 + Math.random() * 0.5,
      driftFactor: 0.85 + Math.random() * 0.45,
      baseScale: 0.65 + Math.random() * 0.35
    };
    smokePuffs.push(puff);
    cabinGroup.add(puff);
  }

  // ---------------------------------------------------------------------------
  // 12. Porch Furniture & Clearly Visible Coffee Table with Steaming Mug
  // ---------------------------------------------------------------------------
  // A. Prominent Porch Coffee Table & Mug Assembly (Positioned in direct unobstructed view!)
  const porchTableGroup = new THREE.Group();
  porchTableGroup.position.set(-0.10, 1.15, 2.50); // Open line-of-sight between stairs opening and door!

  // Sturdy round cedar tabletop
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.07, 8), deckWoodMat);
  tableTop.position.y = 0.48;
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  porchTableGroup.add(tableTop);

  // 3 splayed timber legs
  for (let l = 0; l < 3; l++) {
    const angle = (l / 3) * Math.PI * 2 + Math.PI / 6;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.50, 6), trimWoodMat);
    leg.position.set(Math.cos(angle) * 0.24, 0.24, Math.sin(angle) * 0.24);
    leg.rotation.z = Math.cos(angle) * 0.14;
    leg.rotation.x = Math.sin(angle) * 0.14;
    leg.castShadow = true;
    porchTableGroup.add(leg);
  }

  // Glossy White Ceramic Porch Mug
  const mugGeo = new THREE.CylinderGeometry(0.085, 0.075, 0.16, 8);
  const porchMug = new THREE.Mesh(mugGeo, porcelainMat);
  porchMug.position.set(0.08, 0.60, 0.04);
  porchMug.castShadow = true;

  // Mug curved handle
  const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.016, 6, 10), porcelainMat);
  mugHandle.position.set(0.165, 0.60, 0.04);

  // Dark rich coffee liquid surface at brim
  const coffeeLiquid = new THREE.Mesh(new THREE.CircleGeometry(0.076, 8), coffeeLiquidMat);
  coffeeLiquid.rotation.x = -Math.PI / 2;
  coffeeLiquid.position.set(0.08, 0.675, 0.04);

  porchTableGroup.add(porchMug, mugHandle, coffeeLiquid);

  // Open Field Journal on porch table
  const notebookCover = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.025, 0.34), new THREE.MeshStandardMaterial({ color: 0x1c2b3d, roughness: 0.7 }));
  notebookCover.position.set(-0.12, 0.53, -0.04);
  notebookCover.rotation.y = 0.32;
  const notebookPages = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.31), new THREE.MeshStandardMaterial({ color: 0xf3eee6, roughness: 0.9 }));
  notebookPages.position.set(-0.12, 0.55, -0.04);
  notebookPages.rotation.y = 0.32;
  porchTableGroup.add(notebookCover, notebookPages);

  // Dedicated Warm Accent Spotlight directly on the Porch Coffee Table & Mug!
  const porchTableLight = new THREE.PointLight(0xffa836, 2.6, 4.8, 1.8);
  porchTableLight.position.set(0.10, 1.4, 0.10);
  porchTableGroup.add(porchTableLight);

  cabinGroup.add(porchTableGroup);

  // Ascending Sinuous Steam Wisps from the Porch Coffee Mug
  const steamCount = 8;
  const steamPuffs = [];
  const steamGeo = new THREE.DodecahedronGeometry(0.048, 0);
  const steamMat = new THREE.MeshBasicMaterial({
    color: 0xedf4ff,
    transparent: true,
    opacity: 0.60,
    depthWrite: false
  });
  for (let s = 0; s < steamCount; s++) {
    const puff = new THREE.Mesh(steamGeo, steamMat.clone());
    puff.position.set(
      -0.02 + (Math.random() - 0.5) * 0.02,
      1.83 + s * 0.09,
      2.54 + (Math.random() - 0.5) * 0.02
    );
    puff.userData = {
      initialY: 1.83,
      speed: 0.0035 + Math.random() * 0.0025,
      wobbleOffset: s * 0.85,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      baseScale: 0.65 + Math.random() * 0.35
    };
    steamPuffs.push(puff);
    cabinGroup.add(puff);
  }

  // B. Split Firewood Stack on Porch Deck
  const woodStackGroup = new THREE.Group();
  woodStackGroup.position.set(2.0, 1.15, 1.55);

  const firewoodLogGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.58, 6);
  const woodRows = 3;
  const woodCols = 4;
  for (let r = 0; r < woodRows; r++) {
    for (let c = 0; c < woodCols; c++) {
      const fLog = new THREE.Mesh(firewoodLogGeo, firewoodBarkMat);
      fLog.rotation.x = Math.PI / 2;
      fLog.position.set(
        -0.24 + c * 0.16 + (r % 2 === 1 ? 0.08 : 0),
        0.08 + r * 0.13,
        (Math.random() - 0.5) * 0.04
      );
      fLog.castShadow = true;
      woodStackGroup.add(fLog);

      const faceCircle = new THREE.Mesh(new THREE.CircleGeometry(0.068, 6), firewoodFaceMat);
      faceCircle.position.set(fLog.position.x, fLog.position.y, 0.295);
      woodStackGroup.add(faceCircle);
    }
  }
  cabinGroup.add(woodStackGroup);

  // C. Chopping Block Stump with Embedded Steel Splitting Axe
  const choppingGroup = new THREE.Group();
  choppingGroup.position.set(-1.45, 0.22, 4.10);

  const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.36, 0.45, 7), logPrimaryMat);
  stump.castShadow = true;
  stump.receiveShadow = true;
  const stumpFace = new THREE.Mesh(new THREE.CircleGeometry(0.29, 7), logEndMat);
  stumpFace.rotation.x = -Math.PI / 2;
  stumpFace.position.y = 0.226;
  choppingGroup.add(stump, stumpFace);

  const axeGroup = new THREE.Group();
  axeGroup.position.set(0.04, 0.22, 0.02);
  axeGroup.rotation.z = -0.28;

  const axeHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.65, 5), logSecondaryMat);
  axeHandle.position.set(0, 0.32, 0);
  axeHandle.rotation.x = 0.15;
  axeGroup.add(axeHandle);

  const axeHead = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.15, 0.20), axeBladeMat);
  axeHead.position.set(0, 0.06, 0.03);
  axeHead.castShadow = true;
  axeGroup.add(axeHead);

  choppingGroup.add(axeGroup);
  cabinGroup.add(choppingGroup);

  // D. Cedar Rain Barrel under back-right eave
  const rainBarrelGroup = new THREE.Group();
  rainBarrelGroup.position.set(2.45, 0.55, -1.65);

  const barrelBody = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.32, 0.85, 8), logPrimaryMat);
  barrelBody.castShadow = true;
  barrelBody.receiveShadow = true;

  const band1 = new THREE.Mesh(new THREE.TorusGeometry(0.365, 0.02, 4, 8), metalMat);
  band1.rotation.x = Math.PI / 2;
  band1.position.y = 0.22;
  const band2 = new THREE.Mesh(new THREE.TorusGeometry(0.345, 0.02, 4, 8), metalMat);
  band2.rotation.x = Math.PI / 2;
  band2.position.y = -0.22;

  const waterSurface = new THREE.Mesh(
    new THREE.CircleGeometry(0.34, 8),
    new THREE.MeshStandardMaterial({ color: 0x1b2c3a, roughness: 0.15, metalness: 0.8 })
  );
  waterSurface.rotation.x = -Math.PI / 2;
  waterSurface.position.y = 0.40;

  rainBarrelGroup.add(barrelBody, band1, band2, waterSurface);
  cabinGroup.add(rainBarrelGroup);

  // E. Leather Hiking Boots by Door
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x482d1c, roughness: 0.85, flatShading: true });
  const bootSoleMat = new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.7 });
  [-0.10, 0.08].forEach((bx, bIdx) => {
    const bootGroup = new THREE.Group();
    bootGroup.position.set(0.36 + bx, 1.15, 1.62);
    bootGroup.rotation.y = -0.15 + bIdx * 0.1;

    const bootUpper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.22), bootMat);
    bootUpper.position.set(0, 0.08, 0);
    const bootSole = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.24), bootSoleMat);
    bootSole.position.set(0, 0.015, 0);

    bootGroup.add(bootUpper, bootSole);
    cabinGroup.add(bootGroup);
  });

  // F. Adirondack Slatted Porch Bench & Folded Woolen Blanket
  const benchGroup = new THREE.Group();
  benchGroup.position.set(1.48, 1.15, 2.22);

  for (let b = 0; b < 3; b++) {
    const seatSlat = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.04, 0.14), deckWoodMat);
    seatSlat.position.set(0, 0.35, -0.14 + b * 0.15);
    benchGroup.add(seatSlat);
  }

  for (let k = 0; k < 3; k++) {
    const backSlat = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.12, 0.03), deckWoodMat);
    backSlat.position.set(0, 0.50 + k * 0.13, -0.22 - k * 0.04);
    backSlat.rotation.x = -0.25;
    benchGroup.add(backSlat);
  }

  const benchLegL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.44), trimWoodMat);
  benchLegL.position.set(-0.62, 0.175, 0);
  const benchLegR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.44), trimWoodMat);
  benchLegR.position.set(0.62, 0.175, 0);
  const armrestL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.04, 0.48), trimWoodMat);
  armrestL.position.set(-0.62, 0.50, 0);
  const armrestR = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.04, 0.48), trimWoodMat);
  armrestR.position.set(0.62, 0.50, 0);
  benchGroup.add(benchLegL, benchLegR, armrestL, armrestR);

  const blanketMat = new THREE.MeshStandardMaterial({ color: 0x99352e, roughness: 0.9, flatShading: true });
  const blanket = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.12, 0.38), blanketMat);
  blanket.position.set(0.38, 0.42, 0);
  blanket.rotation.y = 0.14;
  benchGroup.add(blanket);

  cabinGroup.add(benchGroup);

  // ---------------------------------------------------------------------------
  // 13. Swinging Porch Lantern & Boulder Rock Lantern
  // ---------------------------------------------------------------------------
  const lanternPivot = new THREE.Group();
  lanternPivot.position.set(-1.8, 3.65, 2.4);

  const lanternCord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 4), metalMat);
  lanternCord.position.y = -0.2;
  lanternPivot.add(lanternCord);

  const lanternBodyGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.35, 6);
  const lanternBody = new THREE.Mesh(lanternBodyGeo, windowGlowMat);
  lanternBody.position.y = -0.5;
  lanternPivot.add(lanternBody);

  const lanternCapGeo = new THREE.ConeGeometry(0.22, 0.14, 6);
  const lanternCap = new THREE.Mesh(lanternCapGeo, metalMat);
  lanternCap.position.y = -0.32;
  lanternPivot.add(lanternCap);

  const lanternLight = new THREE.PointLight(0xffa834, 3.2, 9, 2.0);
  lanternLight.position.y = -0.5;
  lanternPivot.add(lanternLight);

  cabinGroup.add(lanternPivot);

  // Rock Lantern on Boulder
  const rockLanternGroup = new THREE.Group();
  rockLanternGroup.position.set(2.91, 0.76, 5.40);

  const rockLanternBase = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.08, 6), deckWoodMat);
  rockLanternBase.position.y = 0.04;
  rockLanternBase.castShadow = true;
  rockLanternBase.receiveShadow = true;
  rockLanternGroup.add(rockLanternBase);

  const rockLanternPost = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 5), metalMat);
  rockLanternPost.position.y = 0.18;
  rockLanternPost.castShadow = true;
  rockLanternGroup.add(rockLanternPost);

  const rockLanternCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.05, 6), metalMat);
  rockLanternCollar.position.y = 0.31;
  rockLanternGroup.add(rockLanternCollar);

  const rockBulbGeo = new THREE.CylinderGeometry(0.10, 0.13, 0.25, 6);
  const rockLanternBulb = new THREE.Mesh(rockBulbGeo, windowGlowMat);
  rockLanternBulb.position.y = 0.45;
  rockLanternGroup.add(rockLanternBulb);

  for (let c = 0; c < 4; c++) {
    const angle = (c / 4) * Math.PI * 2 + Math.PI / 4;
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.25, 4), metalMat);
    strut.position.set(Math.cos(angle) * 0.12, 0.45, Math.sin(angle) * 0.12);
    rockLanternGroup.add(strut);
  }

  const rockLanternHood = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.14, 6), metalMat);
  rockLanternHood.position.y = 0.63;
  rockLanternHood.castShadow = true;
  rockLanternGroup.add(rockLanternHood);

  const rockLanternRing = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 4, 8), metalMat);
  rockLanternRing.position.y = 0.73;
  rockLanternRing.rotation.x = Math.PI / 2;
  rockLanternGroup.add(rockLanternRing);

  const rockLanternLight = new THREE.PointLight(0xffa22e, 2.8, 8.5, 2.0);
  rockLanternLight.position.y = 0.46;
  rockLanternLight.castShadow = false;
  rockLanternGroup.add(rockLanternLight);

  cabinGroup.add(rockLanternGroup);

  // ---------------------------------------------------------------------------
  // 14. Dedicated Signal Tower Group (Waypoint 04 Interactive Feature)
  // ---------------------------------------------------------------------------
  const signalTowerGroup = new THREE.Group();
  signalTowerGroup.position.set(1.2, 4.2, -0.4);

  const towerMetalMat = new THREE.MeshStandardMaterial({
    color: 0x526075,
    roughness: 0.60,
    metalness: 0.38,
    flatShading: true
  });

  const roofSlopeAngle = -roofPitch;

  const basePlateGeo = new THREE.BoxGeometry(0.52, 0.05, 0.52);
  const basePlate = new THREE.Mesh(basePlateGeo, towerMetalMat);
  basePlate.position.set(0, 0.63, 0);
  basePlate.rotation.z = roofSlopeAngle;
  basePlate.castShadow = true;
  basePlate.receiveShadow = true;
  signalTowerGroup.add(basePlate);

  const collarGeo = new THREE.CylinderGeometry(0.16, 0.20, 0.08, 6);
  const collar = new THREE.Mesh(collarGeo, towerMetalMat);
  collar.position.set(0, 0.69, 0);
  collar.rotation.z = roofSlopeAngle;
  collar.castShadow = true;
  signalTowerGroup.add(collar);

  const mastGeo = new THREE.CylinderGeometry(0.06, 0.09, 5.4, 6);
  const mast = new THREE.Mesh(mastGeo, towerMetalMat);
  mast.position.y = 2.7;
  signalTowerGroup.add(mast);

  const mastAttachPoint = new THREE.Vector3(0, 1.9, 0);
  const strutAnchorPoints = [
    new THREE.Vector3(0.55, 0.30, 0),
    new THREE.Vector3(-0.15, 0.72, -0.55),
    new THREE.Vector3(-0.15, 0.72, 0.55)
  ];

  const footPlateGeo = new THREE.BoxGeometry(0.14, 0.04, 0.14);
  strutAnchorPoints.forEach(footPos => {
    const foot = new THREE.Mesh(footPlateGeo, towerMetalMat);
    foot.position.copy(footPos);
    foot.rotation.z = roofSlopeAngle;
    foot.castShadow = true;
    signalTowerGroup.add(foot);

    const strutDir = new THREE.Vector3().subVectors(footPos, mastAttachPoint);
    const strutLen = strutDir.length();
    const strutMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, strutLen, 5),
      towerMetalMat
    );
    strutMesh.position.addVectors(mastAttachPoint, footPos).multiplyScalar(0.5);
    strutMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), strutDir.clone().normalize());
    signalTowerGroup.add(strutMesh);
  });

  const arm1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.04, 0.04), towerMetalMat);
  arm1.position.y = 3.4;
  const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.04, 0.04), towerMetalMat);
  arm2.position.y = 4.3;
  signalTowerGroup.add(arm1, arm2);

  // Communications Satellite Dish Assembly
  const dishGroup = new THREE.Group();
  dishGroup.position.set(0, 3.75, 0);

  const dishMat = new THREE.MeshStandardMaterial({
    color: 0x5e6b7f,
    roughness: 0.72,
    metalness: 0.22,
    flatShading: true
  });
  const dishDarkMat = new THREE.MeshStandardMaterial({
    color: 0x363d4a,
    roughness: 0.8,
    metalness: 0.15,
    flatShading: true
  });

  const dishBracket = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.38, 5), towerMetalMat);
  dishBracket.position.set(0.18, 0, 0.08);
  dishBracket.rotation.z = Math.PI / 2;
  dishGroup.add(dishBracket);

  const dishBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.22, 0.14, 10), dishMat);
  dishBowl.position.set(0.36, 0.05, 0.15);
  dishBowl.rotation.x = -Math.PI / 3.5;
  dishBowl.rotation.y = 0.5;
  dishBowl.castShadow = true;
  dishGroup.add(dishBowl);

  const dishInterior = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.16, 0.08, 10), dishDarkMat);
  dishInterior.position.copy(dishBowl.position);
  dishInterior.rotation.copy(dishBowl.rotation);
  dishGroup.add(dishInterior);

  const feedArm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.32, 4), towerMetalMat);
  feedArm.position.copy(dishBowl.position);
  feedArm.rotation.copy(dishBowl.rotation);
  feedArm.translateY(0.20);
  dishGroup.add(feedArm);

  const feedHead = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.03, 0.06, 6), towerMetalMat);
  feedHead.position.copy(dishBowl.position);
  feedHead.rotation.copy(dishBowl.rotation);
  feedHead.translateY(0.36);
  dishGroup.add(feedHead);

  signalTowerGroup.add(dishGroup);

  const towerFillLight = new THREE.PointLight(0x9bc2ec, 2.2, 14, 1.8);
  towerFillLight.position.set(1.8, 3.6, 3.2);
  signalTowerGroup.add(towerFillLight);

  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff3344 });
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), beaconMat);
  beacon.position.set(0, 5.45, 0);
  signalTowerGroup.add(beacon);

  const hitBoxGeo = new THREE.CylinderGeometry(1.3, 1.3, 5.5, 8);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.position.y = 2.75;
  signalTowerGroup.add(hitBox);

  // Lightweight proxy collider for cabin body to avoid recursive raycasting over 150 sub-meshes
  const cabinCollider = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 4.2, 4.6),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  cabinCollider.position.set(0, 2.5, 0.4);
  cabinGroup.add(cabinCollider);

  signalTowerGroup.userData = {
    id: 'signalTower',
    label: 'OPEN SIGNAL TRANSMISSION',
    waypointIndex: 3,
    modalId: 'contact-modal',
    isInteractive: true,
    collider: hitBox
  };

  cabinGroup.add(signalTowerGroup);

  cabinGroup.userData = {
    id: 'cabin',
    label: 'ENTER CABIN WORKSPACE',
    waypointIndex: 1,
    modalId: 'terminal-modal',
    isInteractive: true,
    collider: cabinCollider
  };

  scene.add(cabinGroup);

  // ---------------------------------------------------------------------------
  // 15. Animation Loop Hook (Lantern swing, smoke drift, steam, light flickers)
  // ---------------------------------------------------------------------------
  return {
    group: cabinGroup,
    signalTower: signalTowerGroup,
    update: (time) => {
      lanternPivot.rotation.z = Math.sin(time * 2.2) * 0.12;
      lanternPivot.rotation.x = Math.cos(time * 1.8) * 0.08;

      const flicker = Math.sin(time * 8.0) * 0.15 + (Math.random() - 0.5) * 0.1;
      lanternLight.intensity = 3.2 + flicker;
      rockLanternLight.intensity = 2.8 + flicker * 0.7;
      sconceLight.intensity = 2.0 + flicker * 0.5;
      cabinInteriorLight.intensity = 4.4 + flicker * 0.8;
      deskTaskLight.intensity = 3.8 + flicker * 0.6;
      porchTableLight.intensity = 2.6 + flicker * 0.4;
      chimneyFlueLight.intensity = 4.2 + flicker * 0.6;

      beaconMat.color.setHex(Math.sin(time * 3.5) > 0.2 ? 0xff2233 : 0x44080e);

      // Blinking PC indicator LED
      pcLed.material.color.setHex(Math.sin(time * 6.0) > 0.1 ? 0x22c55e : 0x083315);

      smokePuffs.forEach((puff) => {
        const u = puff.userData;
        puff.position.y += u.speed;

        const progress = Math.max(0, Math.min(1, (puff.position.y - u.initialY) / (u.maxY - u.initialY)));

        const expScale = u.baseScale * (0.55 + Math.pow(progress, 0.7) * 2.1);
        puff.scale.set(expScale, expScale * 1.15, expScale);

        const windX = Math.sin(time * 1.6 + u.wobbleOffset) * 0.005 + 0.007 * u.driftFactor * progress;
        const windZ = Math.cos(time * 1.3 + u.wobbleOffset) * 0.004 - 0.005 * u.driftFactor * progress;
        puff.position.x += windX;
        puff.position.z += windZ;

        puff.rotation.x += u.rotX;
        puff.rotation.y += u.rotY;
        puff.rotation.z += u.rotZ;

        if (progress < 0.1) {
          puff.material.opacity = (progress / 0.1) * 0.38;
        } else {
          puff.material.opacity = (1 - (progress - 0.1) / 0.9) * 0.38;
        }

        if (puff.position.y > u.maxY) {
          puff.position.set(
            -1.3 + (Math.random() - 0.5) * 0.1,
            u.initialY,
            -1.0 + (Math.random() - 0.5) * 0.1
          );
        }
      });

      steamPuffs.forEach((puff) => {
        const u = puff.userData;
        puff.position.y += u.speed;

        const progress = Math.max(0, Math.min(1, (puff.position.y - u.initialY) / 0.82));

        const steamScale = u.baseScale * (0.7 + progress * 1.6);
        puff.scale.set(steamScale, steamScale * 1.3, steamScale);

        puff.position.x = -0.02 + Math.sin(time * 3.2 + u.wobbleOffset) * (0.015 + progress * 0.045);
        puff.position.z = 2.54 + Math.cos(time * 2.8 + u.wobbleOffset) * (0.012 + progress * 0.035);

        puff.rotation.y += u.rotSpeed;

        if (progress < 0.15) {
          puff.material.opacity = (progress / 0.15) * 0.60;
        } else {
          puff.material.opacity = Math.pow(1 - progress, 1.2) * 0.60;
        }

        if (puff.position.y > 2.65) {
          puff.position.set(
            -0.02 + (Math.random() - 0.5) * 0.02,
            u.initialY,
            2.54 + (Math.random() - 0.5) * 0.02
          );
        }
      });
    }
  };
}
