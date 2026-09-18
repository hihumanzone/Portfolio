import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// ---------------------------------------------------------------------------
// 1. Procedural Celestial Sky Dome (Deep Inky Night Gradient & Lunar Glow)
// ---------------------------------------------------------------------------
function createSkyDome(moonPos) {
  const geo = new THREE.SphereGeometry(492, 32, 24);

  const vertexShader = `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vWorldPosition;
    uniform vec3 uTopColor;
    uniform vec3 uMidColor;
    uniform vec3 uHorizonColor;
    uniform vec3 uSaddleGlowColor;
    uniform vec3 uMoonGlowColor;
    uniform vec3 uMoonPos;

    float dither(vec2 coord) {
      return (fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0 * 2.0;
    }

    void main() {
      vec3 dir = normalize(vWorldPosition);
      float h = dir.y;

      // Authentic Deep Night Sky Gradient:
      // Preserves pure nocturnal darkness while maintaining subtle atmospheric depth
      vec3 color;
      if (h < 0.04) {
        float t = clamp((h + 0.15) / 0.19, 0.0, 1.0);
        color = mix(uHorizonColor * 0.55, uHorizonColor, t);
      } else if (h < 0.40) {
        float t = (h - 0.04) / 0.36;
        float smoothT = t * t * (3.0 - 2.0 * t);
        color = mix(uHorizonColor, uMidColor, smoothT);
      } else {
        float t = clamp((h - 0.40) / 0.60, 0.0, 1.0);
        float smoothT = t * t * (3.0 - 2.0 * t);
        color = mix(uMidColor, uTopColor, smoothT);
      }

      // Subtle Mountain Ridge Silhouette Rim (Gentle, low-intensity backlight)
      float horizonBand = smoothstep(-0.02, 0.08, h) * smoothstep(0.26, 0.06, h);
      color += uSaddleGlowColor * horizonBand * 0.24;

      // Directional Celestial Moon Atmospheric Scatter (Soft and contained)
      vec3 moonDir = normalize(uMoonPos);
      float moonDot = max(0.0, dot(dir, moonDir));
      float moonGlow = pow(moonDot, 4.5) * 0.26 + pow(moonDot, 2.0) * 0.08;
      color += uMoonGlowColor * moonGlow;

      color += vec3(dither(gl_FragCoord.xy));
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const mat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTopColor: { value: new THREE.Color(0x020409) },        // Deepest obsidian abyss
      uMidColor: { value: new THREE.Color(0x060c18) },        // Deep ink night navy
      uHorizonColor: { value: new THREE.Color(0x0b1526) },    // Midnight slate
      uSaddleGlowColor: { value: new THREE.Color(0x15283e) }, // Subtle alpine silhouette rim
      uMoonGlowColor: { value: new THREE.Color(0x1e344e) },   // Soft lunar atmosphere
      uMoonPos: { value: moonPos.clone() }
    },
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    fog: false
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = -1000;
  return mesh;
}

// ---------------------------------------------------------------------------
// 2. Multi-Tier Twinkling Starfield with Atmospheric Extinction Horizon Fade
// ---------------------------------------------------------------------------
const starVertexShader = `
  attribute vec3 color;
  attribute float aSize;
  attribute float aTwinkleSpeed;
  attribute float aTwinklePhase;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vExtinction;
  uniform float uTime;

  void main() {
    vColor = color;
    float s1 = sin(uTime * aTwinkleSpeed + aTwinklePhase);
    float s2 = sin(uTime * (aTwinkleSpeed * 1.6) + aTwinklePhase * 2.1);
    float twinkle = 0.5 * (s1 + s2);
    
    // Natural delicate twinkling: gentle breathing luminance
    float intensity = clamp(0.55 + 0.45 * twinkle, 0.15, 1.0);
    vAlpha = intensity;

    // Atmospheric Extinction Horizon Fade:
    // Stars higher in the sky are crisp and bright. As they approach the distant mountain ridges,
    // atmospheric scattering smoothly fades them out so there is NEVER an abrupt cutoff line.
    float normY = position.y / 462.0;
    // Fade starts at normY = 0.28 (upper mountain band) and softly fades to 0 at normY = -0.06 (below horizon)
    vExtinction = smoothstep(-0.06, 0.28, normY);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (0.85 + 0.25 * twinkle);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Mathematical procedural circle with bright pinprick core and delicate halo
const starFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vExtinction;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Crisp pinprick center with soft falloff
    float core = smoothstep(0.30, 0.0, dist);
    float glow = pow(smoothstep(0.5, 0.0, dist), 1.8);
    float combinedAlpha = clamp((core * 0.85 + glow * 0.35) * vAlpha * vExtinction * 0.88, 0.0, 1.0);

    // Refined nocturnal star intensity (natural starlight without excess glare)
    gl_FragColor = vec4(vColor * (0.85 + core * 0.40), combinedAlpha);
  }
`;

// Hero star shader with delicate 4-point cross diffraction glints
const heroStarFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vExtinction;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    float core = smoothstep(0.24, 0.0, dist);
    float glow = pow(smoothstep(0.5, 0.0, dist), 1.6);

    // Delicate, subtle 4-point cross diffraction glints
    vec2 absCoord = abs(coord);
    float spikeH = max(0.0, 1.0 - absCoord.y / 0.07) * max(0.0, 1.0 - absCoord.x / 0.5);
    float spikeV = max(0.0, 1.0 - absCoord.x / 0.07) * max(0.0, 1.0 - absCoord.y / 0.5);
    float spikes = max(spikeH, spikeV) * 0.28;

    float combinedAlpha = clamp((core * 0.90 + glow * 0.35 + spikes) * vAlpha * vExtinction * 0.90, 0.0, 1.0);
    gl_FragColor = vec4(vColor * (0.95 + core * 0.50), combinedAlpha);
  }
`;

function createCelestialStarfield() {
  const group = new THREE.Group();

  // Tier 1 & Tier 2: Micro and Medium Spectral Stars
  const microCount = 2800;
  const mediumCount = 520;
  const totalRegular = microCount + mediumCount;

  const positions = new Float32Array(totalRegular * 3);
  const colors = new Float32Array(totalRegular * 3);
  const sizes = new Float32Array(totalRegular);
  const speeds = new Float32Array(totalRegular);
  const phases = new Float32Array(totalRegular);

  const tempCol = new THREE.Color();

  const spectralColors = [
    new THREE.Color(0xffffff), // Pure Diamond White
    new THREE.Color(0xb8dcff), // Sirius Cyan-Blue
    new THREE.Color(0xcde8ff), // Vega Pale Ice Blue
    new THREE.Color(0xffe6c4), // Capella Warm Gold
    new THREE.Color(0xffcca8)  // Betelgeuse Warm Peach
  ];

  let ptr = 0;

  // Generate Micro Background Stars (2,800 stars)
  // phi extends all the way from 1.14 down to 1.62 (below horizon), seamlessly blended by vExtinction
  // theta spans full visible panorama from western moon flank (-3.25) across summit to eastern signal ridge (-0.65)
  for (let i = 0; i < microCount; i++) {
    let theta, phi;
    if (i < 2150) {
      // Visible front quadrant and eastern ridge (covers Signal Tower view upper-right thoroughly)
      theta = -3.25 + Math.random() * 2.60;
      // Continuous coverage down to phi = 1.62 (so no gap or abrupt line exists)
      phi = 1.14 + Math.random() * 0.48;
    } else {
      // High zenith dome & 360-degree rotation coverage
      theta = Math.random() * Math.PI * 2;
      phi = 0.08 + Math.random() * 1.36;
    }

    const r = 462 + Math.random() * 18;

    positions[ptr * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[ptr * 3 + 1] = r * Math.cos(phi);
    positions[ptr * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const tint = 0.86 + Math.random() * 0.14;
    tempCol.setRGB(tint * 0.92, tint * 0.96, tint);
    colors[ptr * 3] = tempCol.r;
    colors[ptr * 3 + 1] = tempCol.g;
    colors[ptr * 3 + 2] = tempCol.b;

    // Delicate, authentic star sizes (1.4 to 2.8px)
    sizes[ptr] = 1.4 + Math.random() * 1.4;
    speeds[ptr] = 0.8 + Math.random() * 2.6;
    phases[ptr] = Math.random() * Math.PI * 2;

    ptr++;
  }

  // Generate Medium Spectral Stars (520 stars)
  for (let i = 0; i < mediumCount; i++) {
    let theta, phi;
    if (i < 400) {
      theta = -3.25 + Math.random() * 2.60;
      phi = 1.16 + Math.random() * 0.44;
    } else {
      theta = Math.random() * Math.PI * 2;
      phi = 0.12 + Math.random() * 1.30;
    }

    const r = 458 + Math.random() * 16;

    positions[ptr * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[ptr * 3 + 1] = r * Math.cos(phi);
    positions[ptr * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const cIdx = Math.floor(Math.random() * spectralColors.length);
    tempCol.copy(spectralColors[cIdx]);
    colors[ptr * 3] = tempCol.r;
    colors[ptr * 3 + 1] = tempCol.g;
    colors[ptr * 3 + 2] = tempCol.b;

    // Medium star size: 2.6 to 4.2px
    sizes[ptr] = 2.6 + Math.random() * 1.6;
    speeds[ptr] = 1.2 + Math.random() * 3.0;
    phases[ptr] = Math.random() * Math.PI * 2;

    ptr++;
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  starGeo.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(speeds, 1));
  starGeo.setAttribute('aTwinklePhase', new THREE.BufferAttribute(phases, 1));

  const starMat = new THREE.ShaderMaterial({
    vertexShader: starVertexShader,
    fragmentShader: starFragmentShader,
    uniforms: {
      uTime: { value: 0 }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    fog: false
  });

  const starsMesh = new THREE.Points(starGeo, starMat);
  group.add(starsMesh);

  // Tier 3: Hero Stars & Recognizable Alpine Constellations
  // Mapped directly into the visible mountain sky in front of the camera
  const heroStarsDef = [
    // --- The Big Dipper (Ursa Major Asterism: 7 Stars in saddle sky between Moon and Cabin) ---
    // Handle curving down to bowl:
    { name: 'Alkaid', theta: -2.52, phi: 1.34, size: 5.4, color: 0xc4e6ff, speed: 1.4 },
    { name: 'Mizar',  theta: -2.46, phi: 1.32, size: 5.0, color: 0xffffff, speed: 2.1 },
    { name: 'Alioth', theta: -2.40, phi: 1.30, size: 5.8, color: 0xd8eeff, speed: 1.1 },
    // Ladle bowl:
    { name: 'Megrez', theta: -2.34, phi: 1.29, size: 4.8, color: 0xffeedd, speed: 2.4 },
    { name: 'Phecda', theta: -2.35, phi: 1.34, size: 5.2, color: 0xffffff, speed: 1.6 },
    { name: 'Merak',  theta: -2.28, phi: 1.33, size: 5.2, color: 0xbfe2ff, speed: 1.8 },
    { name: 'Dubhe',  theta: -2.27, phi: 1.28, size: 5.6, color: 0xffdbaf, speed: 1.3 }, // Amber pointer star

    // --- Polaris (The North Star: Guided beacon star directly north above cabin) ---
    { name: 'Polaris', theta: -2.25, phi: 1.24, size: 6.4, color: 0xfff6e8, speed: 0.9 },

    // --- Cassiopeia (The Celestial 'W': 5 Stars in High Northeast above East Massifs) ---
    { name: 'Caph',    theta: -2.03, phi: 1.34, size: 5.2, color: 0xffebcd, speed: 1.5 },
    { name: 'Schedar', theta: -1.96, phi: 1.30, size: 5.5, color: 0xffd2a0, speed: 1.2 },
    { name: 'Navi',    theta: -1.90, phi: 1.33, size: 5.6, color: 0xaad8ff, speed: 1.7 },
    { name: 'Ruchbah', theta: -1.84, phi: 1.29, size: 5.2, color: 0xffffff, speed: 2.2 },
    { name: 'Segin',   theta: -1.78, phi: 1.33, size: 4.8, color: 0xb5dcff, speed: 1.9 },

    // --- High Zenith Beacons (Vega, Deneb, Altair) ---
    { name: 'Vega',    theta: -2.40, phi: 1.12, size: 6.0, color: 0xb8e2ff, speed: 1.0 },
    { name: 'Deneb',   theta: -1.95, phi: 1.10, size: 5.6, color: 0xffffff, speed: 1.3 },
    { name: 'Altair',  theta: -2.18, phi: 1.15, size: 5.5, color: 0xf4f8ff, speed: 1.6 },

    // --- Flank Sentinel Stars Framing Mountain Saddle ---
    { name: 'WestFlank_Alpha', theta: -2.80, phi: 1.35, size: 5.0, color: 0xa8d8ff, speed: 2.0 },
    { name: 'WestFlank_Beta',  theta: -2.95, phi: 1.30, size: 4.8, color: 0xffdfb8, speed: 1.4 },
    { name: 'EastFlank_Alpha', theta: -1.68, phi: 1.35, size: 5.2, color: 0xfff0db, speed: 1.7 },
    { name: 'EastFlank_Beta',  theta: -1.62, phi: 1.29, size: 4.8, color: 0xb8e0ff, speed: 2.3 },

    // --- Perseus & Eastern Ridge Asterism (Visible on upper-right in Signal Tower View) ---
    { name: 'Mirfak',      theta: -1.48, phi: 1.27, size: 5.4, color: 0xfff3df, speed: 1.1 },
    { name: 'Algol',       theta: -1.36, phi: 1.33, size: 5.0, color: 0xd2eaff, speed: 2.0 },
    { name: 'Alpheratz',   theta: -1.22, phi: 1.26, size: 5.2, color: 0xe2f2ff, speed: 1.5 },
    { name: 'Mirach',      theta: -1.08, phi: 1.31, size: 5.2, color: 0xffdfb5, speed: 1.3 },
    { name: 'Almach',      theta: -0.92, phi: 1.25, size: 5.0, color: 0xffe8c2, speed: 1.8 },
    { name: 'EastBeacon',  theta: -0.78, phi: 1.30, size: 4.8, color: 0xbbe2ff, speed: 2.2 }
  ];

  const heroCount = heroStarsDef.length;
  const hPositions = new Float32Array(heroCount * 3);
  const hColors = new Float32Array(heroCount * 3);
  const hSizes = new Float32Array(heroCount);
  const hSpeeds = new Float32Array(heroCount);
  const hPhases = new Float32Array(heroCount);

  heroStarsDef.forEach((star, i) => {
    const r = 464;
    hPositions[i * 3] = r * Math.sin(star.phi) * Math.cos(star.theta);
    hPositions[i * 3 + 1] = r * Math.cos(star.phi);
    hPositions[i * 3 + 2] = r * Math.sin(star.phi) * Math.sin(star.theta);

    const col = new THREE.Color(star.color);
    hColors[i * 3] = col.r;
    hColors[i * 3 + 1] = col.g;
    hColors[i * 3 + 2] = col.b;

    hSizes[i] = star.size;
    hSpeeds[i] = star.speed;
    hPhases[i] = i * 0.73;
  });

  const heroGeo = new THREE.BufferGeometry();
  heroGeo.setAttribute('position', new THREE.BufferAttribute(hPositions, 3));
  heroGeo.setAttribute('color', new THREE.BufferAttribute(hColors, 3));
  heroGeo.setAttribute('aSize', new THREE.BufferAttribute(hSizes, 1));
  heroGeo.setAttribute('aTwinkleSpeed', new THREE.BufferAttribute(hSpeeds, 1));
  heroGeo.setAttribute('aTwinklePhase', new THREE.BufferAttribute(hPhases, 1));

  const heroMat = new THREE.ShaderMaterial({
    vertexShader: starVertexShader,
    fragmentShader: heroStarFragmentShader,
    uniforms: {
      uTime: { value: 0 }
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    fog: false
  });

  const heroMesh = new THREE.Points(heroGeo, heroMat);
  group.add(heroMesh);

  return {
    group,
    update: (time) => {
      starMat.uniforms.uTime.value = time;
      heroMat.uniforms.uTime.value = time;
    }
  };
}

// ---------------------------------------------------------------------------
// 3. Milky Way Cosmic Stardust Ribbon (Faint, subtle, non-intrusive)
// ---------------------------------------------------------------------------
function createMilkyWay() {
  const particleCount = 460;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const opacities = new Float32Array(particleCount);

  // Deep dark celestial shades that preserve deep inky night
  const cViolet = new THREE.Color(0x180d2c);
  const cIndigo = new THREE.Color(0x0e1b34);
  const cCyan   = new THREE.Color(0x142b42);
  const cSilver = new THREE.Color(0x45688e);

  const tempCol = new THREE.Color();

  for (let i = 0; i < particleCount; i++) {
    const t = i / particleCount;
    // Expands smoothly from western saddle across to eastern massifs
    const theta = -3.10 + t * 2.35 + (Math.random() - 0.5) * 0.14;
    const phi = 1.38 - Math.sin(t * Math.PI) * 0.16 + (Math.random() - 0.5) * 0.06;

    const r = 460 + (Math.random() - 0.5) * 8;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    if (t < 0.35) {
      tempCol.copy(cViolet).lerp(cIndigo, t / 0.35);
    } else if (t < 0.70) {
      tempCol.copy(cIndigo).lerp(cCyan, (t - 0.35) / 0.35);
    } else {
      tempCol.copy(cCyan).lerp(cSilver, (t - 0.70) / 0.30);
    }

    colors[i * 3] = tempCol.r;
    colors[i * 3 + 1] = tempCol.g;
    colors[i * 3 + 2] = tempCol.b;

    // Delicate stardust sizing and very gentle opacity
    sizes[i] = 18.0 + Math.random() * 22.0;
    opacities[i] = 0.025 + Math.random() * 0.04;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

  const vertexShader = `
    attribute vec3 color;
    attribute float aSize;
    attribute float aOpacity;
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = color;
      vAlpha = aOpacity;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float soft = pow(smoothstep(0.5, 0.0, dist), 2.2);
      gl_FragColor = vec4(vColor, soft * vAlpha);
    }
  `;

  const mat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    fog: false
  });

  return new THREE.Points(geo, mat);
}

// ---------------------------------------------------------------------------
// 4. Dynamic Shooting Stars (Meteors with camera-facing luminous ribbons)
// ---------------------------------------------------------------------------
function createShootingStarSystem(parentGroup, camera) {
  const POOL_SIZE = 3;
  const meteors = [];

  for (let i = 0; i < POOL_SIZE; i++) {
    const positions = new Float32Array(4 * 3);
    const colors = new Float32Array(4 * 3);
    const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.attributes.position.setUsage(THREE.DynamicDrawUsage);
    geo.attributes.color.setUsage(THREE.DynamicDrawUsage);
    geo.setIndex(new THREE.BufferAttribute(indices, 1));

    const mat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: false,
      fog: false
    });

    const ribbonMesh = new THREE.Mesh(geo, mat);
    ribbonMesh.visible = false;
    parentGroup.add(ribbonMesh);

    meteors.push({
      ribbonMesh,
      geo,
      active: false,
      progress: 0,
      speed: 1.0,
      totalDist: 1.0,
      startPos: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      trailLen: 38,
      colorHead: new THREE.Color(0xffffff),
      colorTail: new THREE.Color(0x328ec7)
    });
  }

  let nextSpawnTime = 3.0;
  const tempHead = new THREE.Vector3();
  const tempTail = new THREE.Vector3();
  const tempToCam = new THREE.Vector3();
  const tempSide = new THREE.Vector3();
  const tempTarget = new THREE.Vector3();
  const fallbackCamPos = new THREE.Vector3(14, 11.5, 17);

  function spawnMeteor() {
    const meteor = meteors.find(m => !m.active);
    if (!meteor) return;

    // Start location in visible upper sky band (spanning summit and signal tower skies)
    const theta = -2.90 + Math.random() * 2.10;
    const phi = 1.24 + Math.random() * 0.05;
    const r = 445;

    meteor.startPos.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );

    const endTheta = theta + 0.16 + (Math.random() - 0.5) * 0.12;
    const endPhi = phi + 0.14 + Math.random() * 0.06;

    const targetPos = tempTarget.set(
      r * Math.sin(endPhi) * Math.cos(endTheta),
      r * Math.cos(endPhi),
      r * Math.sin(endPhi) * Math.sin(endTheta)
    );

    meteor.dir.subVectors(targetPos, meteor.startPos);
    meteor.totalDist = meteor.dir.length();
    meteor.dir.normalize();

    meteor.speed = (340 + Math.random() * 100) / meteor.totalDist;
    meteor.trailLen = 32 + Math.random() * 18;
    meteor.progress = 0;
    meteor.active = true;

    meteor.ribbonMesh.visible = true;
  }

  return {
    update: (delta) => {
      nextSpawnTime -= delta;
      if (nextSpawnTime <= 0) {
        spawnMeteor();
        nextSpawnTime = 7.0 + Math.random() * 6.5;
      }

      const camPos = (camera && camera.position) ? camera.position : fallbackCamPos;

      meteors.forEach((m) => {
        if (!m.active) return;

        m.progress += m.speed * delta;
        if (m.progress >= 1.0) {
          m.active = false;
          m.ribbonMesh.visible = false;
          return;
        }

        tempHead.copy(m.startPos).addScaledVector(m.dir, m.progress * m.totalDist);

        let trailFade = 1.0;
        if (m.progress < 0.15) {
          trailFade = m.progress / 0.15;
        } else if (m.progress > 0.75) {
          trailFade = Math.max(0, (1.0 - m.progress) / 0.25);
        }

        const currentTrail = m.trailLen * trailFade;
        tempTail.copy(tempHead).addScaledVector(m.dir, -currentTrail);

        tempToCam.subVectors(camPos, tempHead).normalize();
        tempSide.crossVectors(m.dir, tempToCam).normalize();

        const wHead = 1.4 * trailFade;
        const wTail = 0.2 * trailFade;

        const posAttr = m.geo.attributes.position;
        posAttr.setXYZ(0, tempHead.x - tempSide.x * wHead * 0.5, tempHead.y - tempSide.y * wHead * 0.5, tempHead.z - tempSide.z * wHead * 0.5);
        posAttr.setXYZ(1, tempHead.x + tempSide.x * wHead * 0.5, tempHead.y + tempSide.y * wHead * 0.5, tempHead.z + tempSide.z * wHead * 0.5);
        posAttr.setXYZ(2, tempTail.x - tempSide.x * wTail * 0.5, tempTail.y - tempSide.y * wTail * 0.5, tempTail.z - tempSide.z * wTail * 0.5);
        posAttr.setXYZ(3, tempTail.x + tempSide.x * wTail * 0.5, tempTail.y + tempSide.y * wTail * 0.5, tempTail.z + tempSide.z * wTail * 0.5);
        posAttr.needsUpdate = true;

        const colAttr = m.geo.attributes.color;
        const hR = m.colorHead.r * trailFade * 1.3;
        const hG = m.colorHead.g * trailFade * 1.3;
        const hB = m.colorHead.b * trailFade * 1.3;
        const tR = m.colorTail.r * trailFade * 0.25;
        const tG = m.colorTail.g * trailFade * 0.25;
        const tB = m.colorTail.b * trailFade * 0.25;

        colAttr.setXYZ(0, hR, hG, hB);
        colAttr.setXYZ(1, hR, hG, hB);
        colAttr.setXYZ(2, tR, tG, tB);
        colAttr.setXYZ(3, tR, tG, tB);
        colAttr.needsUpdate = true;
      });
    }
  };
}

// ---------------------------------------------------------------------------
// Main Sky Creation Function
// ---------------------------------------------------------------------------
export function createSky(scene, camera) {
  const skyGroup = new THREE.Group();

  // 1. Procedural Celestial Sky Dome
  const moonWorldPos = new THREE.Vector3(-156, 49, -110);
  const skyDome = createSkyDome(moonWorldPos);
  skyGroup.add(skyDome);

  // 2. Slowly Rotating Celestial Sphere (Stars, Constellations, Milky Way)
  const celestialGroup = new THREE.Group();
  skyGroup.add(celestialGroup);

  const starfield = createCelestialStarfield();
  celestialGroup.add(starfield.group);

  const milkyWay = createMilkyWay();
  celestialGroup.add(milkyWay);

  // 3. Dynamic Shooting Stars (Meteors)
  const shootingStars = createShootingStarSystem(skyGroup, camera);

  // 4. 3D Crescent Moon Mesh (Framed in the open saddle sky to the left of Porch Crag)
  const moonGroup = new THREE.Group();
  moonGroup.position.copy(moonWorldPos);

  // Exact mathematical crescent path (Circle intersection)
  const crescentShape = new THREE.Shape();
  const R1 = 8.5;
  const R2 = 7.5;
  const d = 3.6;
  const x0 = (R1 * R1 - R2 * R2 + d * d) / (2 * d);
  const y0 = Math.sqrt(Math.max(0, R1 * R1 - x0 * x0));
  const theta1 = Math.atan2(y0, x0);
  const theta2 = Math.atan2(y0, x0 - d);

  crescentShape.absarc(0, 0, R1, -theta1, theta1, false);
  crescentShape.absarc(d, 0, R2, theta2, -theta2, true);

  const extrudeSettings = {
    depth: 0.9,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.18,
    bevelThickness: 0.18
  };

  const moonGeo = new THREE.ExtrudeGeometry(crescentShape, extrudeSettings);
  moonGeo.center();

  const moonMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.62,
    roughness: 0.30,
    metalness: 0.05,
    fog: false
  });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.rotation.z = -0.30;
  moonGroup.add(moonMesh);

  moonGroup.rotation.y = Math.atan2(14 - (-156), 17 - (-110));

  // Expanded Soft Moon Glow Corona
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(235, 245, 255, 0.38)');
  gradient.addColorStop(0.22, 'rgba(195, 228, 255, 0.22)');
  gradient.addColorStop(0.48, 'rgba(155, 205, 255, 0.10)');
  gradient.addColorStop(0.76, 'rgba(125, 180, 250, 0.03)');
  gradient.addColorStop(1, 'rgba(100, 160, 240, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const coronaTexture = new THREE.CanvasTexture(canvas);
  const coronaMat = new THREE.SpriteMaterial({
    map: coronaTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    fog: false
  });
  const corona = new THREE.Sprite(coronaMat);
  corona.scale.set(36, 36, 1);
  corona.position.z = -1.0;
  moonGroup.add(corona);

  // Add moon directly to scene so it remains stationary and coordinates match directional light
  scene.add(moonGroup);

  // 5. Natural Stylized Low-Poly Volumetric Clouds (Matches mountain_cabin_wide.jpg)
  function createCloudGeometry(type, seed) {
    const lobes = [];
    const rng = (s) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const flipX = (rng(seed * 7.7) > 0.5) ? -1 : 1;

    let lobeDefs = [];
    if (type === 'asym_tower') {
      lobeDefs = [
        { r: 6.8, x: -7.0, y: 3.2, z: 0.4,  sx: 1.25, sy: 1.00, sz: 1.15 },
        { r: 5.5, x: -3.5, y: 2.2, z: -1.0, sx: 1.20, sy: 0.92, sz: 1.10 },
        { r: 4.4, x: -15.0, y: 1.0, z: 0.2, sx: 1.25, sy: 0.85, sz: 1.05 },
        { r: 3.0, x: -21.5, y: -0.2, z: -0.2, sx: 1.20, sy: 0.75, sz: 0.95 },
        { r: 5.2, x: 2.5,  y: 1.5, z: 0.6,  sx: 1.30, sy: 0.88, sz: 1.10 },
        { r: 4.6, x: 9.5,  y: 0.8, z: -0.4, sx: 1.35, sy: 0.82, sz: 1.05 },
        { r: 3.8, x: 16.5, y: 1.0, z: 0.3,  sx: 1.25, sy: 0.80, sz: 1.00 },
        { r: 2.6, x: 23.0, y: -0.3, z: -0.2, sx: 1.20, sy: 0.70, sz: 0.90 },
        { r: 4.2, x: -7.5, y: -0.8, z: 0.1, sx: 1.25, sy: 0.70, sz: 1.05 },
        { r: 3.8, x: 7.0,  y: -0.9, z: 0.0, sx: 1.30, sy: 0.68, sz: 1.00 }
      ];
    } else if (type === 'rolling_bank') {
      lobeDefs = [
        { r: 5.2, x: -14.0, y: 1.8, z: 0.3,  sx: 1.30, sy: 0.88, sz: 1.10 },
        { r: 4.4, x: -7.0,  y: 0.6, z: -0.5, sx: 1.25, sy: 0.82, sz: 1.05 },
        { r: 5.8, x: 1.5,   y: 2.2, z: 0.5,  sx: 1.35, sy: 0.92, sz: 1.15 },
        { r: 4.6, x: 9.0,   y: 0.8, z: -0.4, sx: 1.25, sy: 0.82, sz: 1.05 },
        { r: 4.8, x: 16.5,  y: 1.5, z: 0.2,  sx: 1.30, sy: 0.86, sz: 1.05 },
        { r: 3.2, x: -21.0, y: 0.2, z: -0.2, sx: 1.20, sy: 0.74, sz: 0.95 },
        { r: 3.0, x: 23.5,  y: 0.0, z: 0.1,  sx: 1.20, sy: 0.74, sz: 0.95 },
        { r: 4.0, x: -11.5, y: -0.9, z: 0.0, sx: 1.30, sy: 0.65, sz: 1.05 },
        { r: 4.2, x: 3.5,   y: -0.8, z: -0.2, sx: 1.35, sy: 0.65, sz: 1.10 },
        { r: 3.6, x: 14.5,  y: -0.9, z: 0.1, sx: 1.25, sy: 0.65, sz: 1.00 }
      ];
    } else if (type === 'twin_peaks') {
      lobeDefs = [
        { r: 5.6, x: -9.5,  y: 2.6, z: 0.4,  sx: 1.25, sy: 0.95, sz: 1.10 },
        { r: 4.5, x: -12.0, y: 1.6, z: -0.9, sx: 1.20, sy: 0.88, sz: 1.05 },
        { r: 3.6, x: -17.5, y: 0.4, z: 0.2,  sx: 1.25, sy: 0.78, sz: 0.95 },
        { r: 3.8, x: -1.0,  y: 0.3, z: 0.2,  sx: 1.30, sy: 0.78, sz: 1.05 },
        { r: 6.2, x: 8.5,   y: 3.2, z: -0.2, sx: 1.25, sy: 0.98, sz: 1.15 },
        { r: 4.8, x: 15.5,  y: 1.5, z: 0.5,  sx: 1.25, sy: 0.86, sz: 1.05 },
        { r: 3.0, x: 22.0,  y: 0.0, z: -0.3, sx: 1.20, sy: 0.72, sz: 0.90 },
        { r: 4.0, x: -8.0,  y: -0.9, z: 0.0, sx: 1.25, sy: 0.65, sz: 1.05 },
        { r: 4.4, x: 9.0,   y: -0.8, z: 0.2, sx: 1.30, sy: 0.68, sz: 1.10 }
      ];
    } else if (type === 'wispy_drift') {
      lobeDefs = [
        { r: 3.0, x: -18.0, y: -0.1, z: 0.0,  sx: 1.45, sy: 0.70, sz: 0.95 },
        { r: 4.4, x: -10.5, y: 1.0,  z: 0.3,  sx: 1.40, sy: 0.78, sz: 1.05 },
        { r: 4.8, x: -2.0,  y: 1.4,  z: -0.3, sx: 1.45, sy: 0.82, sz: 1.10 },
        { r: 4.5, x: 7.0,   y: 1.2,  z: 0.4,  sx: 1.40, sy: 0.78, sz: 1.05 },
        { r: 3.6, x: 15.5,  y: 0.4,  z: -0.2, sx: 1.35, sy: 0.72, sz: 1.00 },
        { r: 2.4, x: 22.5,  y: -0.3, z: 0.1,  sx: 1.30, sy: 0.65, sz: 0.85 },
        { r: 3.8, x: -4.0,  y: -0.7, z: 0.0,  sx: 1.40, sy: 0.60, sz: 1.00 },
        { r: 3.4, x: 8.0,   y: -0.6, z: 0.1,  sx: 1.35, sy: 0.60, sz: 0.95 }
      ];
    } else {
      lobeDefs = [
        { r: 5.4, x: -11.0, y: 2.6, z: 0.2,  sx: 1.30, sy: 0.92, sz: 1.10 },
        { r: 4.2, x: -17.0, y: 1.2, z: -0.3, sx: 1.25, sy: 0.82, sz: 1.00 },
        { r: 4.8, x: -3.5,  y: 1.5, z: 0.4,  sx: 1.30, sy: 0.86, sz: 1.05 },
        { r: 4.4, x: 5.0,   y: 0.8, z: -0.2, sx: 1.35, sy: 0.80, sz: 1.05 },
        { r: 3.8, x: 13.5,  y: 0.2, z: 0.3,  sx: 1.30, sy: 0.76, sz: 1.00 },
        { r: 2.6, x: 20.5,  y: -0.3, z: -0.1, sx: 1.20, sy: 0.68, sz: 0.88 },
        { r: 3.9, x: -10.0, y: -0.8, z: 0.1, sx: 1.30, sy: 0.65, sz: 1.05 },
        { r: 3.6, x: 4.0,   y: -0.7, z: 0.0, sx: 1.30, sy: 0.65, sz: 1.00 }
      ];
    }

    lobeDefs.forEach((def, i) => {
      const s = seed * 19.1 + i * 4.3;
      const rVar = def.r * (0.94 + rng(s) * 0.12);
      const geo = new THREE.IcosahedronGeometry(rVar, 1);

      const pos = geo.attributes.position;
      for (let v = 0; v < pos.count; v++) {
        let vx = pos.getX(v);
        let vy = pos.getY(v);
        let vz = pos.getZ(v);

        if (vy < 0) {
          vy = vy * 0.78;
        }

        const noise = Math.sin(vx * 0.55 + s) * Math.cos(vy * 0.65 + s * 1.3) * Math.sin(vz * 0.50 + s * 0.7);
        const disp = 1.0 + noise * 0.12;

        pos.setXYZ(v, vx * disp, vy * disp, vz * disp);
      }
      pos.needsUpdate = true;

      geo.scale(def.sx, def.sy, def.sz);
      geo.translate(
        (def.x * flipX) + (rng(s + 1) - 0.5) * 1.4,
        def.y + (rng(s + 2) - 0.5) * 0.6,
        def.z + (rng(s + 3) - 0.5) * 1.0
      );

      lobes.push(geo);
    });

    let mergedGeo = mergeGeometries(lobes, false);
    if (mergedGeo.index) {
      mergedGeo = mergedGeo.toNonIndexed();
    }
    mergedGeo.computeVertexNormals();
    return mergedGeo;
  }

  function applyCloudVertexColors(geo, cloudPos, rotY = 0) {
    const posAttr = geo.attributes.position;
    const normAttr = geo.attributes.normal;
    const count = posAttr.count;

    let minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < count; i++) {
      const y = posAttr.getY(i);
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const heightRange = Math.max(0.1, maxY - minY);

    const colors = new Float32Array(count * 3);

    const moonDir = new THREE.Vector3().subVectors(moonWorldPos, cloudPos).normalize();
    const camPos = new THREE.Vector3(14, 11.5, 17);
    const toCam = new THREE.Vector3().subVectors(camPos, cloudPos).normalize();

    const invRot = new THREE.Matrix4().makeRotationY(-rotY);
    const localMoonDir = moonDir.clone().applyMatrix4(invRot);
    const localToCam = toCam.clone().applyMatrix4(invRot);

    const highlightColor = new THREE.Color('#ffffff');
    const lightBodyColor = new THREE.Color('#e6f2fd');
    const flankColor     = new THREE.Color('#bad8f4');
    const midtoneColor   = new THREE.Color('#8eb0d4');
    const shadowColor    = new THREE.Color('#58759a');

    const distFromOverlook = Math.hypot(cloudPos.x - 14, cloudPos.z - 17);
    const hazeT = THREE.MathUtils.clamp((distFromOverlook - 85) / 180, 0, 0.20);
    const hazeColor = new THREE.Color('#384e6c');

    const tempCol = new THREE.Color();
    const vNorm = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      vNorm.set(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
      const vy = posAttr.getY(i);
      const heightNorm = (vy - minY) / heightRange;

      const skyDot = Math.max(0, vNorm.y);
      const moonDot = vNorm.dot(localMoonDir);
      const directMoon = Math.max(0, moonDot);
      const forwardScatter = Math.pow(Math.max(0, -moonDot), 2.0) * 0.50;
      const viewDot = Math.abs(vNorm.dot(localToCam));
      const rim = Math.pow(1.0 - viewDot, 2.2) * 0.45;
      const frontFacing = Math.max(0, vNorm.dot(localToCam));

      tempCol.copy(shadowColor).lerp(midtoneColor, heightNorm * 0.60 + frontFacing * 0.40);
      tempCol.lerp(flankColor, skyDot * 0.55 + directMoon * 0.35 + forwardScatter);
      tempCol.lerp(lightBodyColor, Math.pow(skyDot, 1.2) * 0.70 + heightNorm * 0.30);

      const crestFactor = Math.min(1.0, Math.pow(skyDot, 1.4) * 0.85 + directMoon * 0.45 + rim * 0.55);
      tempCol.lerp(highlightColor, crestFactor);

      if (hazeT > 0) {
        tempCol.lerp(hazeColor, hazeT);
      }

      colors[i * 3] = tempCol.r;
      colors[i * 3 + 1] = tempCol.g;
      colors[i * 3 + 2] = tempCol.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }

  const cloudConfigs = [
    { type: 'asym_tower',    x: -540, y: 64, z: -142, scale: 1.60, speed: 0.0090, opacity: 0.94, seed: 11.2 },
    { type: 'rolling_bank',  x: -460, y: 26, z: -112, scale: 1.35, speed: 0.0091, opacity: 0.92, seed: 12.8 },
    { type: 'asym_tower',    x: -380, y: 66, z: -140, scale: 1.65, speed: 0.0090, opacity: 0.95, seed: 1.5 },
    { type: 'wispy_drift',   x: -310, y: 31, z: -115, scale: 1.30, speed: 0.0091, opacity: 0.88, seed: 3.4 },
    { type: 'twin_peaks',    x: -240, y: 68, z: -138, scale: 1.40, speed: 0.0092, opacity: 0.92, seed: 4.2 },
    { type: 'stepped_shelf', x: -170, y: 34, z: -114, scale: 1.30, speed: 0.0091, opacity: 0.92, seed: 6.9 },
    { type: 'rolling_bank',  x: -100, y: 65, z: -145, scale: 1.60, speed: 0.0090, opacity: 0.96, seed: 5.8 },
    { type: 'wispy_drift',   x: -30,  y: 36, z: -122, scale: 1.30, speed: 0.0091, opacity: 0.92, seed: 8.6 },
    { type: 'asym_tower',    x: -12,  y: 60, z: -138, scale: 1.50, speed: 0.0090, opacity: 0.95, seed: 9.3 },
    { type: 'rolling_bank',  x: 12,   y: 52, z: -135, scale: 1.35, speed: 0.0091, opacity: 0.91, seed: 10.6 }
  ];

  const clouds = [];

  cloudConfigs.forEach((cfg) => {
    const cloudPos = new THREE.Vector3(cfg.x, cfg.y, cfg.z);
    const camRef = (camera && camera.position) ? camera.position : { x: 14, y: 11.5, z: 17 };
    const angleToCam = Math.atan2(cfg.x - camRef.x, cfg.z - camRef.z);
    const rotYOffset = ((cfg.seed * 1.7) % 0.14 - 0.07);
    const initialRotY = angleToCam + rotYOffset;

    const geo = createCloudGeometry(cfg.type, cfg.seed);
    applyCloudVertexColors(geo, cloudPos, initialRotY);

    const cloudMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.70,
      metalness: 0.02,
      flatShading: true,
      transparent: true,
      opacity: cfg.opacity,
      depthWrite: true,
      depthTest: true,
      emissive: new THREE.Color(0x354e6d),
      emissiveIntensity: 0.55,
      fog: false
    });

    const mesh = new THREE.Mesh(geo, cloudMat);
    mesh.position.copy(cloudPos);
    mesh.scale.setScalar(cfg.scale);
    mesh.rotation.y = initialRotY;

    mesh.userData = {
      baseX: cfg.x,
      baseY: cfg.y,
      baseZ: cfg.z,
      baseScale: cfg.scale,
      baseOpacity: cfg.opacity,
      speed: cfg.speed,
      seed: cfg.seed,
      baseRotZ: mesh.rotation.z,
      rotYOffset: rotYOffset
    };

    clouds.push(mesh);
    skyGroup.add(mesh);
  });

  scene.add(skyGroup);

  const minX = -580;
  const maxX = 140;
  const spanX = maxX - minX;
  const fadeZone = 45;
  let lastTime = 0;

  return {
    group: skyGroup,
    update: (time) => {
      const delta = Math.min(0.1, lastTime === 0 ? 0.016 : time - lastTime);
      lastTime = time;

      // 1. Clouds remain completely stationary in the sky
      // (Position, rotation, and scale stay fixed at their placed coordinates)

      // 2. Slowly rotate celestial starfield & Milky Way across polar axis
      celestialGroup.rotation.y = time * 0.00045;

      // 3. Update dynamic star twinkling
      starfield.update(time);

      // 4. Update dynamic shooting stars
      shootingStars.update(delta);
    }
  };
}
