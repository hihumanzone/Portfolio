import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export function createCampfire(scene) {
  const campfireGroup = new THREE.Group();
  campfireGroup.position.set(3.2, 7.0, 2.8); // Sitting on cliff edge overlooking valley

  // =========================================================================
  // 1. SCORCHED GROUND BASE & CHARRED BED
  // =========================================================================
  const scorchGeo = new THREE.CylinderGeometry(1.25, 1.35, 0.04, 12);
  const scorchMat = new THREE.MeshStandardMaterial({
    color: 0x1b1c20,
    roughness: 0.98,
    flatShading: true
  });
  const scorchBase = new THREE.Mesh(scorchGeo, scorchMat);
  scorchBase.position.set(0, 0.02, 0);
  scorchBase.receiveShadow = true;
  campfireGroup.add(scorchBase);

  // Ash and burnt charcoal bed
  const coalBedGeo = new THREE.CylinderGeometry(0.55, 0.64, 0.08, 10);
  const coalBedMat = new THREE.MeshStandardMaterial({
    color: 0x140e0b,
    emissive: 0x5a1805,
    emissiveIntensity: 0.45,
    roughness: 0.95,
    flatShading: true
  });
  const coalBed = new THREE.Mesh(coalBedGeo, coalBedMat);
  coalBed.position.set(0, 0.05, 0);
  coalBed.receiveShadow = true;
  campfireGroup.add(coalBed);

  // =========================================================================
  // 2. STONE FIRE RING & SCATTERED CLIFF PEBBLES
  // =========================================================================
  const stoneMat1 = new THREE.MeshStandardMaterial({
    color: 0x363945,
    roughness: 0.88,
    flatShading: true
  });
  const stoneMat2 = new THREE.MeshStandardMaterial({
    color: 0x2b2e38,
    roughness: 0.92,
    flatShading: true
  });
  const stoneMat3 = new THREE.MeshStandardMaterial({
    color: 0x434754,
    roughness: 0.85,
    flatShading: true
  });
  const stoneMaterials = [stoneMat1, stoneMat2, stoneMat3];

  const stoneCount = 14;
  const ringRadius = 0.92;
  const stoneGeoBase = new THREE.DodecahedronGeometry(0.23, 0);

  const stoneGeoBuckets = [[], [], []];

  for (let i = 0; i < stoneCount; i++) {
    const angle = (i / stoneCount) * Math.PI * 2;
    const varRadius = ringRadius + Math.sin(i * 3.7) * 0.08;
    const varScale = 0.95 + Math.cos(i * 4.9) * 0.25;
    const varHeight = 0.12 + Math.sin(i * 2.3) * 0.04;

    const sg = stoneGeoBase.clone();
    const sm = new THREE.Matrix4();
    sm.compose(
      new THREE.Vector3(Math.cos(angle) * varRadius, varHeight, Math.sin(angle) * varRadius),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(
        Math.sin(i * 2.1) * Math.PI,
        Math.cos(i * 1.7) * Math.PI,
        Math.sin(i * 3.4) * 0.5
      )),
      new THREE.Vector3(varScale, 0.82 + Math.sin(i * 1.5) * 0.18, varScale * (0.9 + Math.cos(i) * 0.2))
    );
    sg.applyMatrix4(sm);
    stoneGeoBuckets[i % stoneMaterials.length].push(sg);
  }

  // Scattered small pebbles and charred fragments around the fire ring
  const pebbleGeo = new THREE.DodecahedronGeometry(0.08, 0);
  const pebbleOffsets = [
    { r: 1.15, a: 0.4 }, { r: 1.25, a: 1.2 }, { r: 1.30, a: 2.1 },
    { r: 1.18, a: 3.0 }, { r: 1.35, a: 3.8 }, { r: 1.22, a: 4.6 },
    { r: 1.28, a: 5.4 }, { r: 1.40, a: 5.9 }
  ];

  pebbleOffsets.forEach((p, idx) => {
    const s = 0.6 + (idx % 4) * 0.25;
    const pg = pebbleGeo.clone();
    const pm = new THREE.Matrix4();
    pm.compose(
      new THREE.Vector3(Math.cos(p.a) * p.r, 0.04 + (idx % 2) * 0.02, Math.sin(p.a) * p.r),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(idx * 0.8, idx * 1.3, idx * 0.5)),
      new THREE.Vector3(s, s * 0.6, s)
    );
    pg.applyMatrix4(pm);
    stoneGeoBuckets[(idx + 1) % 3].push(pg);
  });

  for (let m = 0; m < 3; m++) {
    if (stoneGeoBuckets[m].length > 0) {
      const mergedStoneMesh = new THREE.Mesh(
        BufferGeometryUtils.mergeGeometries(stoneGeoBuckets[m], false),
        stoneMaterials[m]
      );
      mergedStoneMesh.castShadow = true;
      mergedStoneMesh.receiveShadow = true;
      campfireGroup.add(mergedStoneMesh);
    }
  }

  // =========================================================================
  // 3. BREATHING GLOWING COALS & EMBERS (NESTLED IN ASH)
  // =========================================================================
  const emberLumpGeo = new THREE.DodecahedronGeometry(0.085, 0);
  const emberLumps = [];
  const emberLumpConfigs = [
    { x: 0.16, z: 0.10, col: 0xff4400, s: 1.1 },
    { x: -0.14, z: 0.15, col: 0xff6600, s: 0.9 },
    { x: -0.12, z: -0.16, col: 0xff3300, s: 1.2 },
    { x: 0.15, z: -0.12, col: 0xff7700, s: 1.0 },
    { x: 0.02, z: 0.24, col: 0xff3b00, s: 0.85 },
    { x: -0.22, z: -0.04, col: 0xff5500, s: 0.95 },
    { x: 0.24, z: 0.05, col: 0xff2e00, s: 0.9 },
    { x: -0.05, z: -0.25, col: 0xff6a00, s: 0.8 },
    { x: 0.0, z: 0.0, col: 0xff8811, s: 1.3 } // Heart center
  ];

  emberLumpConfigs.forEach((cfg, idx) => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1f0600,
      emissive: cfg.col,
      emissiveIntensity: 1.3,
      roughness: 0.75,
      flatShading: true
    });
    const mesh = new THREE.Mesh(emberLumpGeo, mat);
    mesh.position.set(cfg.x, 0.08, cfg.z);
    mesh.rotation.set(idx * 0.7, idx * 1.1, idx * 0.4);
    mesh.scale.set(cfg.s, cfg.s * 0.75, cfg.s);
    campfireGroup.add(mesh);
    emberLumps.push({ mesh, mat, baseIntensity: 1.3, phase: idx * 1.2 });
  });

  // =========================================================================
  // 4. CHARRED RUSTIC FIREWOOD LOGS (TEEPEE & CROSS-STACK)
  // =========================================================================
  const barkMat = new THREE.MeshStandardMaterial({
    color: 0x483222, // Rich weathered pine bark
    roughness: 0.88,
    flatShading: true
  });
  const charredMat = new THREE.MeshStandardMaterial({
    color: 0x121010, // Carbonized charred center
    emissive: 0x6a1600,
    emissiveIntensity: 0.35,
    roughness: 0.96,
    flatShading: true
  });
  const woodEndMat = new THREE.MeshStandardMaterial({
    color: 0xb58e60, // Freshly cut timber end rings
    roughness: 0.78,
    flatShading: true
  });

  const mainLogCount = 6;
  const woodLogs = [];

  for (let j = 0; j < mainLogCount; j++) {
    const angle = (j / mainLogCount) * Math.PI * 2 + 0.3;
    const baseRadius = 0.38 + (j % 2) * 0.05;
    const basePos = new THREE.Vector3(
      Math.cos(angle) * baseRadius,
      0.08,
      Math.sin(angle) * baseRadius
    );
    const apexPos = new THREE.Vector3(
      -Math.cos(angle) * 0.07 + Math.sin(j) * 0.03,
      0.58 + (j % 2) * 0.06,
      -Math.sin(angle) * 0.07 + Math.cos(j) * 0.03
    );

    const dir = new THREE.Vector3().subVectors(apexPos, basePos);
    const len = dir.length();

    const logGroup = new THREE.Group();
    logGroup.position.addVectors(basePos, apexPos).multiplyScalar(0.5);
    logGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

    // Main log body
    const logRadius = 0.078 + (j % 3) * 0.012;
    const logMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(logRadius * 0.85, logRadius, len, 6),
      barkMat
    );
    logMesh.castShadow = true;
    logMesh.receiveShadow = true;
    logGroup.add(logMesh);

    // Charred blackened lower inner section
    const charMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(logRadius * 0.88, logRadius * 1.02, len * 0.52, 6),
      charredMat
    );
    charMesh.position.set(0, -len * 0.22, 0);
    charMesh.castShadow = true;
    logGroup.add(charMesh);

    // Cut wood end caps
    const endTop = new THREE.Mesh(new THREE.CylinderGeometry(logRadius * 0.86, logRadius * 0.86, 0.02, 6), woodEndMat);
    endTop.position.set(0, len * 0.5, 0);
    const endBottom = new THREE.Mesh(new THREE.CylinderGeometry(logRadius, logRadius, 0.02, 6), woodEndMat);
    endBottom.position.set(0, -len * 0.5, 0);
    logGroup.add(endTop, endBottom);

    campfireGroup.add(logGroup);
    woodLogs.push(charMesh);
  }

  // Horizontal kindling branch across the bed
  const kindling1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.045, 0.65, 5),
    charredMat
  );
  kindling1.position.set(0.04, 0.12, 0.02);
  kindling1.rotation.set(0.2, 0.8, Math.PI / 2);
  kindling1.castShadow = true;
  campfireGroup.add(kindling1);

  const kindling2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.032, 0.040, 0.55, 5),
    charredMat
  );
  kindling2.position.set(-0.06, 0.14, -0.05);
  kindling2.rotation.set(-0.15, -0.9, Math.PI / 2);
  kindling2.castShadow = true;
  campfireGroup.add(kindling2);

  // =========================================================================
  // 5. MULTI-TONGUE ORGANIC STYLIZED LOW-POLY FLAME
  // =========================================================================
  const flameGroup = new THREE.Group();
  campfireGroup.add(flameGroup);

  // 5a. Inner Superheated Core Flame (White-hot yellow blooming center)
  const coreFlameGeo = new THREE.ConeGeometry(0.18, 0.58, 6);
  const coreFlameMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(2.4, 2.3, 1.6),
    transparent: true,
    opacity: 0.98
  });
  const coreFlame = new THREE.Mesh(coreFlameGeo, coreFlameMat);
  coreFlame.position.set(0, 0.36, 0);
  flameGroup.add(coreFlame);

  // 5b. Primary Roaring Flame Tongue (Warm golden-orange bloom)
  const mainFlameGeo = new THREE.ConeGeometry(0.34, 1.12, 6);
  const mainFlameMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(1.85, 0.82, 0.08),
    transparent: true,
    opacity: 0.94
  });
  const mainFlame = new THREE.Mesh(mainFlameGeo, mainFlameMat);
  mainFlame.position.set(0, 0.56, 0);
  flameGroup.add(mainFlame);

  // 5c. Asynchronous Licking Flame Tongues
  const tongues = [];
  const tongueConfigs = [
    { col: new THREE.Color(1.7, 1.1, 0.1), radius: 0.22, height: 0.90, pos: [0.08, 0.48, 0.06], rotZ: 0.12, speed: 1.1, phase: 0.0 },
    { col: new THREE.Color(1.6, 0.5, 0.02), radius: 0.26, height: 0.84, pos: [-0.07, 0.45, -0.08], rotZ: -0.15, speed: 0.85, phase: 1.4 },
    { col: new THREE.Color(1.8, 1.25, 0.15), radius: 0.19, height: 0.76, pos: [-0.09, 0.42, 0.07], rotZ: 0.18, speed: 1.3, phase: 2.7 },
    { col: new THREE.Color(1.5, 0.4, 0.01), radius: 0.24, height: 0.96, pos: [0.05, 0.50, -0.09], rotZ: -0.10, speed: 0.95, phase: 4.1 }
  ];

  tongueConfigs.forEach((cfg) => {
    const geo = new THREE.ConeGeometry(cfg.radius, cfg.height, 5);
    const mat = new THREE.MeshBasicMaterial({
      color: cfg.col,
      transparent: true,
      opacity: 0.90
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    mesh.rotation.z = cfg.rotZ;
    flameGroup.add(mesh);
    tongues.push({ mesh, cfg });
  });

  // 5d. Detached Floating Flame Licks / Rising Fire Droplets
  const lickGeo = new THREE.DodecahedronGeometry(0.045, 0);
  const flameLicks = [];
  for (let l = 0; l < 4; l++) {
    const lickMat = new THREE.MeshBasicMaterial({
      color: l % 2 === 0 ? 0xffb700 : 0xff6600,
      transparent: true,
      opacity: 0.65
    });
    const lickMesh = new THREE.Mesh(lickGeo, lickMat);
    campfireGroup.add(lickMesh);
    flameLicks.push({
      mesh: lickMesh,
      mat: lickMat,
      progress: l * 0.25,
      speed: 0.65 + l * 0.15,
      offsetX: (Math.random() - 0.5) * 0.16,
      offsetZ: (Math.random() - 0.5) * 0.16
    });
  }

  // =========================================================================
  // 6. TREE STUMP PEDESTAL & LIT VINTAGE CAMPING OIL LANTERN
  // =========================================================================
  // Positioned naturally on the cabin-facing side of the campfire, shifted rightwards
  const stumpGroup = new THREE.Group();
  stumpGroup.position.set(0.35, 0, -1.70);

  // Weathered Pine Cut Tree Stump
  const stumpGeo = new THREE.CylinderGeometry(0.36, 0.44, 0.54, 7);
  const stumpBarkMat = new THREE.MeshStandardMaterial({
    color: 0x3d281a,
    roughness: 0.92,
    flatShading: true
  });
  const stumpMesh = new THREE.Mesh(stumpGeo, stumpBarkMat);
  stumpMesh.position.set(0, 0.27, 0);
  stumpMesh.castShadow = true;
  stumpMesh.receiveShadow = true;
  stumpGroup.add(stumpMesh);

  // Stump top cut wood face with tree ring styling
  const stumpTopGeo = new THREE.CylinderGeometry(0.355, 0.355, 0.02, 7);
  const stumpTopMat = new THREE.MeshStandardMaterial({
    color: 0xa88155, // Sanded pine timber face
    roughness: 0.82,
    flatShading: true
  });
  const stumpTop = new THREE.Mesh(stumpTopGeo, stumpTopMat);
  stumpTop.position.set(0, 0.54, 0);
  stumpTop.receiveShadow = true;
  stumpGroup.add(stumpTop);

  // Tree ring heartwood center
  const stumpRingGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.025, 6);
  const stumpRingMat = new THREE.MeshStandardMaterial({
    color: 0x85603c,
    roughness: 0.85,
    flatShading: true
  });
  const stumpRing = new THREE.Mesh(stumpRingGeo, stumpRingMat);
  stumpRing.position.set(0, 0.542, 0);
  stumpGroup.add(stumpRing);

  // Stump Root Flares grounding it into the rock
  const rootGeo = new THREE.ConeGeometry(0.16, 0.35, 4);
  const rootAngles = [0.4, 2.2, 4.5];
  rootAngles.forEach(ang => {
    const root = new THREE.Mesh(rootGeo, stumpBarkMat);
    root.position.set(Math.cos(ang) * 0.38, 0.12, Math.sin(ang) * 0.38);
    root.rotation.set(Math.sin(ang) * 0.4, 0, -Math.cos(ang) * 0.4);
    root.castShadow = true;
    stumpGroup.add(root);
  });

  // Vintage Camping Hurricane Oil Lantern
  const lanternGroup = new THREE.Group();
  lanternGroup.position.set(0, 0.55, 0);

  const lanternMetalMat = new THREE.MeshStandardMaterial({
    color: 0x222428, // Antique black iron/bronze
    roughness: 0.55,
    metalness: 0.45,
    flatShading: true
  });

  // Oil reservoir tank base
  const lanternBaseGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.09, 8);
  const lanternBase = new THREE.Mesh(lanternBaseGeo, lanternMetalMat);
  lanternBase.position.set(0, 0.045, 0);
  lanternBase.castShadow = true;
  lanternGroup.add(lanternBase);

  // Lower burner collar
  const burnerCollarGeo = new THREE.CylinderGeometry(0.08, 0.10, 0.04, 8);
  const burnerCollar = new THREE.Mesh(burnerCollarGeo, lanternMetalMat);
  burnerCollar.position.set(0, 0.11, 0);
  lanternGroup.add(burnerCollar);

  // Glass Globe (Translucent warm glowing cylinder)
  const glassGeo = new THREE.CylinderGeometry(0.095, 0.085, 0.18, 8);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xfff0d0,
    emissive: 0xff9900,
    emissiveIntensity: 0.65,
    transparent: true,
    opacity: 0.55,
    roughness: 0.2,
    metalness: 0.1
  });
  const glassGlobe = new THREE.Mesh(glassGeo, glassMat);
  glassGlobe.position.set(0, 0.22, 0);
  lanternGroup.add(glassGlobe);

  // Glowing Burner Wick / Mantle inside glass
  const wickGeo = new THREE.DodecahedronGeometry(0.032, 0);
  const wickMat = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  const wick = new THREE.Mesh(wickGeo, wickMat);
  wick.position.set(0, 0.20, 0);
  lanternGroup.add(wick);

  // Chimney Top Vent Hood
  const chimneyGeo = new THREE.CylinderGeometry(0.06, 0.11, 0.08, 8);
  const chimney = new THREE.Mesh(chimneyGeo, lanternMetalMat);
  chimney.position.set(0, 0.35, 0);
  chimney.castShadow = true;
  lanternGroup.add(chimney);

  const chimneyCapGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 8);
  const chimneyCap = new THREE.Mesh(chimneyCapGeo, lanternMetalMat);
  chimneyCap.position.set(0, 0.40, 0);
  lanternGroup.add(chimneyCap);

  // Protective Wire Struts around glass
  for (let w = 0; w < 4; w++) {
    const strutAng = (w / 4) * Math.PI * 2;
    const strutGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.22, 4);
    const strut = new THREE.Mesh(strutGeo, lanternMetalMat);
    strut.position.set(Math.cos(strutAng) * 0.11, 0.22, Math.sin(strutAng) * 0.11);
    lanternGroup.add(strut);
  }

  // Wire Bail Carrying Handle (Arched overhead)
  const handleGeo = new THREE.TorusGeometry(0.14, 0.008, 4, 12, Math.PI);
  const handle = new THREE.Mesh(handleGeo, lanternMetalMat);
  handle.position.set(0, 0.38, 0);
  handle.rotation.set(0, 0.3, 0);
  lanternGroup.add(handle);

  // Dedicated Warm Amber Lantern Light
  const lanternLight = new THREE.PointLight(0xff9922, 1.85, 4.2, 2.0);
  lanternLight.position.set(0, 0.25, 0);
  lanternLight.castShadow = false;
  lanternGroup.add(lanternLight);

  stumpGroup.add(lanternGroup);
  campfireGroup.add(stumpGroup);

  // =========================================================================
  // 7. AUTHENTIC ADIRONDACK SPLIT-LOG BENCH & CAMPING PROPS
  // =========================================================================
  const benchGroup = new THREE.Group();
  // Angled comfortably to flank the fire pit and frame the open vista, spaced clear of cabin
  benchGroup.position.set(-1.82, 0, -0.54);
  benchGroup.rotation.y = 1.05;

  const benchBarkMat = new THREE.MeshStandardMaterial({
    color: 0x463220,
    roughness: 0.90,
    flatShading: true
  });
  const benchTimberMat = new THREE.MeshStandardMaterial({
    color: 0x7c5737, // Polished split-log timber plank
    roughness: 0.78,
    flatShading: true
  });

  // Sturdy Log Foundation Stumps
  const legGeo = new THREE.CylinderGeometry(0.19, 0.23, 0.42, 6);
  const legA = new THREE.Mesh(legGeo, benchBarkMat);
  legA.position.set(-0.75, 0.21, 0);
  legA.castShadow = true;
  legA.receiveShadow = true;

  const legB = new THREE.Mesh(legGeo, benchBarkMat);
  legB.position.set(0.75, 0.21, 0);
  legB.castShadow = true;
  legB.receiveShadow = true;
  benchGroup.add(legA, legB);

  // Split-log timber seat (flat top, curved bark underside)
  const seatPlankGeo = new THREE.BoxGeometry(2.1, 0.14, 0.48);
  const seatPlank = new THREE.Mesh(seatPlankGeo, benchTimberMat);
  seatPlank.position.set(0, 0.45, 0);
  seatPlank.castShadow = true;
  seatPlank.receiveShadow = true;
  benchGroup.add(seatPlank);

  // Rounded bark underside contour
  const undersideGeo = new THREE.CylinderGeometry(0.24, 0.24, 2.08, 6, 1, false, Math.PI, Math.PI);
  const underside = new THREE.Mesh(undersideGeo, benchBarkMat);
  underside.rotation.z = Math.PI / 2;
  underside.position.set(0, 0.42, 0);
  underside.castShadow = true;
  benchGroup.add(underside);

  // Classic Speckled Cobalt Blue Enamel Camping Mug (Resting on bench)
  const mugGroup = new THREE.Group();
  mugGroup.position.set(-0.48, 0.52, 0.05);

  const mugMat = new THREE.MeshStandardMaterial({
    color: 0x1d3a5a, // Deep alpine enamel blue
    roughness: 0.4,
    metalness: 0.1,
    flatShading: true
  });
  const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.058, 0.12, 7), mugMat);
  mugBody.position.y = 0.06;
  mugBody.castShadow = true;
  mugGroup.add(mugBody);

  const mugRim = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.008, 4, 8), new THREE.MeshStandardMaterial({ color: 0x222428 }));
  mugRim.rotation.x = Math.PI / 2;
  mugRim.position.y = 0.12;
  mugGroup.add(mugRim);

  const mugCoffee = new THREE.Mesh(new THREE.CircleGeometry(0.058, 7), new THREE.MeshBasicMaterial({ color: 0x261408 }));
  mugCoffee.rotation.x = -Math.PI / 2;
  mugCoffee.position.y = 0.11;
  mugGroup.add(mugCoffee);

  const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.009, 4, 6, Math.PI), mugMat);
  mugHandle.position.set(0.065, 0.06, 0);
  mugHandle.rotation.y = Math.PI / 2;
  mugGroup.add(mugHandle);
  benchGroup.add(mugGroup);

  campfireGroup.add(benchGroup);

  // Whittled Marshmallow Roasting Stick (Resting across stone ring toward fire)
  const stickGroup = new THREE.Group();
  stickGroup.position.set(0.78, 0.15, 0.85);
  stickGroup.rotation.set(-0.32, -0.65, 0.45);

  const stickMat = new THREE.MeshStandardMaterial({
    color: 0x6e5238, // Whittled birch branch
    roughness: 0.85,
    flatShading: true
  });
  const stickBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.020, 1.45, 5), stickMat);
  stickBranch.position.y = 0.72;
  stickBranch.castShadow = true;
  stickGroup.add(stickBranch);

  // Toasted Golden Marshmallows on stick tip
  const mallowMat1 = new THREE.MeshStandardMaterial({
    color: 0xf5e4cb, // Golden-toasted puff
    roughness: 0.9,
    flatShading: true
  });
  const mallowMat2 = new THREE.MeshStandardMaterial({
    color: 0x4a2a16, // Crispy fire-charred tip
    roughness: 0.95,
    flatShading: true
  });
  const mallow1 = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.065, 6), mallowMat1);
  mallow1.position.y = 1.32;
  mallow1.rotation.z = 0.1;
  const mallow2 = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.030, 0.06, 6), mallowMat2);
  mallow2.position.y = 1.41;
  mallow2.rotation.z = -0.15;
  stickGroup.add(mallow1, mallow2);

  campfireGroup.add(stickGroup);

  // =========================================================================
  // 8. DYNAMIC DUAL-SPECTRUM CAMPFIRE POINT LIGHTS
  // =========================================================================
  // Primary warm fiery point light
  const fireLight = new THREE.PointLight(0xff6a00, 4.8, 12, 2.0);
  fireLight.position.set(0, 0.75, 0);
  fireLight.castShadow = false;
  campfireGroup.add(fireLight);

  // High-intensity superheated core point light (close-range radiant specular)
  const fireCoreLight = new THREE.PointLight(0xffe077, 2.4, 5.0, 2.0);
  fireCoreLight.position.set(0, 0.35, 0);
  campfireGroup.add(fireCoreLight);

  // =========================================================================
  // 9. HIGH-FIDELITY ATMOSPHERIC PARTICLE SYSTEMS
  // =========================================================================

  // 9a. Layer A: Gentle Crackling Fire Sparks (Tuned down for subtle realism)
  const sparkCount = 20;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPositions = new Float32Array(sparkCount * 3);
  const sparkColors = new Float32Array(sparkCount * 3);
  const sparkVels = [];

  for (let s = 0; s < sparkCount; s++) {
    sparkPositions[s * 3] = (Math.random() - 0.5) * 0.40;
    sparkPositions[s * 3 + 1] = 0.3 + Math.random() * 1.6;
    sparkPositions[s * 3 + 2] = (Math.random() - 0.5) * 0.40;

    sparkColors[s * 3] = 0.98;
    sparkColors[s * 3 + 1] = 0.72;
    sparkColors[s * 3 + 2] = 0.18;

    sparkVels.push({
      vx: (Math.random() - 0.5) * 0.014 + 0.003,
      vy: 0.032 + Math.random() * 0.038,
      vz: (Math.random() - 0.5) * 0.014 - 0.003,
      maxY: 1.8 + Math.random() * 1.1
    });
  }

  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
  sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));
  sparkGeo.attributes.position.setUsage(THREE.DynamicDrawUsage);
  sparkGeo.attributes.color.setUsage(THREE.DynamicDrawUsage);

  const sparkMat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  campfireGroup.add(sparks);

  // 9b. Layer B: Delicate Floating Embers (40 subtle warm specks drifting into night sky)
  const emberCount = 40;
  const emberGeo = new THREE.BufferGeometry();
  const emberPositions = new Float32Array(emberCount * 3);
  const emberColors = new Float32Array(emberCount * 3);
  const emberSpeeds = new Float32Array(emberCount);
  const emberOffsets = new Float32Array(emberCount);
  const emberMaxYs = new Float32Array(emberCount);
  const emberVortexSpeeds = new Float32Array(emberCount);

  for (let k = 0; k < emberCount; k++) {
    emberPositions[k * 3] = (Math.random() - 0.5) * 0.55;
    emberPositions[k * 3 + 1] = 0.35 + Math.random() * 5.2;
    emberPositions[k * 3 + 2] = (Math.random() - 0.5) * 0.55;

    emberColors[k * 3] = 0.98;
    emberColors[k * 3 + 1] = 0.55;
    emberColors[k * 3 + 2] = 0.08;

    emberSpeeds[k] = 0.013 + Math.random() * 0.022;
    emberOffsets[k] = Math.random() * Math.PI * 2;
    emberMaxYs[k] = 4.6 + Math.random() * 2.2;
    emberVortexSpeeds[k] = (Math.random() - 0.5) * 1.6;
  }

  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
  emberGeo.setAttribute('color', new THREE.BufferAttribute(emberColors, 3));
  emberGeo.attributes.position.setUsage(THREE.DynamicDrawUsage);
  emberGeo.attributes.color.setUsage(THREE.DynamicDrawUsage);

  const emberMat = new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 0.80,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const embers = new THREE.Points(emberGeo, emberMat);
  campfireGroup.add(embers);

  // 9c. Layer C: Soft Rising Low-Poly Smoke Wisps
  const smokeCount = 18;
  const smokeGroup = new THREE.Group();
  campfireGroup.add(smokeGroup);

  const smokeGeo = new THREE.DodecahedronGeometry(0.13, 0);
  const smokePuffs = [];

  for (let m = 0; m < smokeCount; m++) {
    const smokeMat = new THREE.MeshStandardMaterial({
      color: 0x586072,
      emissive: 0x2e180d,
      emissiveIntensity: 0.38,
      transparent: true,
      opacity: 0.0,
      roughness: 1.0,
      metalness: 0.0,
      depthWrite: false,
      flatShading: true
    });
    const puff = new THREE.Mesh(smokeGeo, smokeMat);
    puff.position.set(
      (Math.random() - 0.5) * 0.25,
      0.9 + (m / smokeCount) * 3.5,
      (Math.random() - 0.5) * 0.25
    );
    smokeGroup.add(puff);
    smokePuffs.push({
      mesh: puff,
      mat: smokeMat,
      progress: m / smokeCount,
      speed: 0.004 + Math.random() * 0.003,
      driftX: (Math.random() - 0.5) * 0.008 + 0.006,
      driftZ: (Math.random() - 0.5) * 0.006 - 0.004,
      rotSpeed: (Math.random() - 0.5) * 0.02
    });
  }

  // Interactive spark surge trigger state
  let burstActive = false;
  let burstTime = 0;

  // Lightweight proxy collider for raycasting
  const campfireCollider = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 1.8, 8),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  campfireCollider.position.set(0, 0.9, 0);
  campfireGroup.add(campfireCollider);
  campfireGroup.userData = {
    ...campfireGroup.userData,
    collider: campfireCollider
  };

  scene.add(campfireGroup);

  return {
    group: campfireGroup,
    lanternGroup,
    triggerSparks: () => {
      burstActive = true;
      burstTime = 0;
      // Gently kick up sparks and warm firelight
      const spkPos = sparkGeo.attributes.position.array;
      const spkCol = sparkGeo.attributes.color.array;
      for (let s = 0; s < sparkCount; s++) {
        spkPos[s * 3] = (Math.random() - 0.5) * 0.40;
        spkPos[s * 3 + 1] = 0.35 + Math.random() * 0.25;
        spkPos[s * 3 + 2] = (Math.random() - 0.5) * 0.40;
        spkCol[s * 3] = 0.98;
        spkCol[s * 3 + 1] = 0.78;
        spkCol[s * 3 + 2] = 0.22;
        sparkVels[s].vy = 0.048 + Math.random() * 0.038;
        sparkVels[s].vx = (Math.random() - 0.5) * 0.028;
        sparkVels[s].vz = (Math.random() - 0.5) * 0.028;
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparkGeo.attributes.color.needsUpdate = true;
    },
    update: (time) => {
      // =====================================================================
      // A. ORGANIC MULTI-TONGUE FLAME ANIMATION
      // =====================================================================
      const fTime = time * 15.0;

      // 1. Primary roaring flame tongue: multi-octave turbulence
      const mainScaleY = 1.0 + Math.sin(fTime) * 0.18 + Math.sin(fTime * 2.3) * 0.12 + Math.cos(fTime * 0.7) * 0.08;
      const mainScaleXZ = 1.0 + Math.cos(fTime * 0.9) * 0.14 + Math.sin(fTime * 1.7) * 0.07;
      mainFlame.scale.set(mainScaleXZ, mainScaleY, mainScaleXZ);
      mainFlame.rotation.z = Math.sin(time * 6.5) * 0.09;
      mainFlame.rotation.x = Math.cos(time * 5.2) * 0.07;
      mainFlame.rotation.y = time * 0.8;

      // 2. Inner superheated core flame: high-frequency vibration
      const coreScaleY = 1.0 + Math.sin(fTime * 1.8) * 0.14;
      const coreScaleXZ = 1.0 + Math.cos(fTime * 1.5) * 0.09;
      coreFlame.scale.set(coreScaleXZ, coreScaleY, coreScaleXZ);

      // 3. Asynchronous licking flame tongues: each dances independently
      tongues.forEach(({ mesh, cfg }) => {
        const tTime = fTime * cfg.speed + cfg.phase;
        const sY = 1.0 + Math.sin(tTime) * 0.22 + Math.cos(tTime * 1.8) * 0.12;
        const sXZ = 1.0 + Math.cos(tTime * 0.8) * 0.16;
        mesh.scale.set(sXZ, sY, sXZ);
        mesh.rotation.z = cfg.rotZ + Math.sin(time * 7.5 + cfg.phase) * 0.12;
        mesh.rotation.x = Math.cos(time * 6.2 + cfg.phase) * 0.10;
      });

      // 4. Detached rising flame droplets
      flameLicks.forEach((lick) => {
        lick.progress += 0.025 * lick.speed;
        if (lick.progress > 1.0) lick.progress = 0;
        const p = lick.progress;
        lick.mesh.position.set(
          lick.offsetX + Math.sin(time * 5.0 + lick.progress * 4) * 0.06,
          0.55 + p * 0.75,
          lick.offsetZ + Math.cos(time * 4.5 + lick.progress * 4) * 0.06
        );
        const lickScale = Math.sin(p * Math.PI) * (1.0 - p * 0.5);
        lick.mesh.scale.set(lickScale, lickScale * 1.4, lickScale);
        lick.mat.opacity = (1.0 - p) * 0.85;
      });

      // =====================================================================
      // B. BREATHING CHARCOAL & GLOWING EMBERS
      // =====================================================================
      const breathTime = time * 4.0;
      coalBedMat.emissiveIntensity = 0.45 + Math.sin(breathTime) * 0.15 + Math.cos(breathTime * 1.7) * 0.08;

      emberLumps.forEach((ember) => {
        ember.mat.emissiveIntensity =
          ember.baseIntensity +
          Math.sin(breathTime + ember.phase) * 0.35 +
          Math.cos(time * 12.0 + ember.phase * 2) * 0.18;
      });

      // =====================================================================
      // C. DYNAMIC LIGHTING FLICKER & SURGE
      // =====================================================================
      let burstLightBonus = 0;
      if (burstActive) {
        burstTime += 0.016;
        if (burstTime > 0.8) {
          burstActive = false;
        } else {
          burstLightBonus = Math.sin((burstTime / 0.8) * Math.PI) * 2.2;
        }
      }

      // Campfire Point Lights (deterministic hash flicker: same amplitude as
      // Math.random(), but branch-free and stable frame-to-frame)
      const hashFlicker = Math.sin(time * 47.3) * 0.5 + Math.sin(time * 31.7 + 1.7) * 0.5;
      fireLight.intensity =
        4.8 +
        Math.sin(time * 15.0) * 0.55 +
        Math.cos(time * 24.0) * 0.35 +
        hashFlicker * 0.125 +
        burstLightBonus;

      fireCoreLight.intensity = 2.4 + Math.sin(time * 18.0) * 0.35 + burstLightBonus * 0.5;

      // Vintage Lantern Soft Ambient Flicker
      lanternLight.intensity = 1.85 + Math.sin(time * 4.2) * 0.12 + Math.sin(time * 9.7) * 0.06;

      // =====================================================================
      // D. PARTICLE SYSTEM UPDATES
      // =====================================================================
      // 1. Layer A: Fast crackling sparks
      const spkPos = sparkGeo.attributes.position.array;
      const spkCol = sparkGeo.attributes.color.array;
      for (let s = 0; s < sparkCount; s++) {
        const v = sparkVels[s];
        spkPos[s * 3] += v.vx + Math.sin(time * 8.0 + s) * 0.003;
        spkPos[s * 3 + 1] += v.vy;
        spkPos[s * 3 + 2] += v.vz + Math.cos(time * 7.0 + s) * 0.003;

        // Cooling color transition over spark flight
        const lifeFrac = Math.max(0, Math.min(1, spkPos[s * 3 + 1] / v.maxY));
        spkCol[s * 3 + 1] = Math.max(0.18, 0.90 - lifeFrac * 0.65);
        spkCol[s * 3 + 2] = Math.max(0.02, 0.30 - lifeFrac * 0.28);

        if (spkPos[s * 3 + 1] > v.maxY) {
          spkPos[s * 3] = (Math.random() - 0.5) * 0.35;
          spkPos[s * 3 + 1] = 0.25;
          spkPos[s * 3 + 2] = (Math.random() - 0.5) * 0.35;
          spkCol[s * 3 + 1] = 0.88;
          spkCol[s * 3 + 2] = 0.25;
          v.vy = 0.040 + Math.random() * 0.046;
          v.vx = (Math.random() - 0.5) * 0.018 + 0.004;
          v.vz = (Math.random() - 0.5) * 0.018 - 0.003;
        }
      }
      sparkGeo.attributes.position.needsUpdate = true;
      sparkGeo.attributes.color.needsUpdate = true;

      // 2. Layer B: High-altitude floating embers plume (100 embers)
      const posArr = emberGeo.attributes.position.array;
      const colArr = emberGeo.attributes.color.array;
      for (let e = 0; e < emberCount; e++) {
        posArr[e * 3 + 1] += emberSpeeds[e];

        // Updraft vortex turbulence + mountain wind drift toward valley (+X, -Z)
        const altRatio = posArr[e * 3 + 1] / emberMaxYs[e];
        const vortex = Math.sin(time * 2.4 + emberOffsets[e]) * (0.008 + altRatio * 0.008);
        const swirl = Math.cos(time * 2.0 + emberOffsets[e] + emberVortexSpeeds[e]) * (0.007 + altRatio * 0.007);
        posArr[e * 3] += vortex + 0.008 * altRatio;
        posArr[e * 3 + 2] += swirl - 0.006 * altRatio;

        // Thermal cooling color transition as embers climb into the starry sky
        colArr[e * 3] = Math.max(0.60, 0.98 - altRatio * 0.35);
        colArr[e * 3 + 1] = Math.max(0.08, 0.55 - altRatio * 0.45);
        colArr[e * 3 + 2] = Math.max(0.01, 0.10 - altRatio * 0.09);

        if (posArr[e * 3 + 1] > emberMaxYs[e]) {
          posArr[e * 3] = (Math.random() - 0.5) * 0.55;
          posArr[e * 3 + 1] = 0.35;
          posArr[e * 3 + 2] = (Math.random() - 0.5) * 0.55;
        }
      }
      emberGeo.attributes.position.needsUpdate = true;
      emberGeo.attributes.color.needsUpdate = true;

      // 3. Layer C: Soft rising smoke wisps
      smokePuffs.forEach((smoke) => {
        smoke.progress += smoke.speed;
        if (smoke.progress > 1.0) {
          smoke.progress = 0;
          smoke.mesh.position.set(
            (Math.random() - 0.5) * 0.20,
            0.85,
            (Math.random() - 0.5) * 0.20
          );
        }
        const prog = smoke.progress;
        smoke.mesh.position.y += smoke.speed * 3.8;
        smoke.mesh.position.x += smoke.driftX;
        smoke.mesh.position.z += smoke.driftZ;
        smoke.mesh.rotation.y += smoke.rotSpeed;

        const s = 0.8 + prog * 3.2;
        smoke.mesh.scale.set(s, s * 0.85, s);
        smoke.mat.opacity = Math.sin(prog * Math.PI) * 0.28;
      });
    }
  };
}
