import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import content from './content.json';

/**
 * High-Resolution Procedural Wood Texture Generator (Color, Bump, Roughness)
 * Creates authentic dark American walnut with organic grain, cathedral arches, and satin lacquer.
 */
function createDetailedWoodTextures() {
  const width = 2048;
  const height = 1024;

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = width;
  colorCanvas.height = height;
  const cctx = colorCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bctx = bumpCanvas.getContext('2d');

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rctx = roughCanvas.getContext('2d');

  // Fill base coats - Deep rich American Walnut
  cctx.fillStyle = '#3a2416';
  cctx.fillRect(0, 0, width, height);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, width, height);

  // Soft satin furniture lacquer finish (roughness ~0.55)
  rctx.fillStyle = '#8c8c8c';
  rctx.fillRect(0, 0, width, height);

  const plankCount = 5;
  const plankHeight = height / plankCount;

  // Render each plank horizontally with authentic wood grain
  for (let p = 0; p < plankCount; p++) {
    const yStart = p * plankHeight;
    const yEnd = yStart + plankHeight;

    // Organic warmth variation per plank
    const rBase = 54 + (p % 2 === 0 ? 4 : -3) + Math.sin(p * 1.7) * 3;
    const gBase = 35 + (p % 2 === 0 ? 3 : -2) + Math.sin(p * 1.7) * 2;
    const bBase = 22 + (p % 2 === 0 ? 2 : -1) + Math.sin(p * 1.7) * 1;

    const plankGrad = cctx.createLinearGradient(0, yStart, 0, yEnd);
    plankGrad.addColorStop(0, `rgb(${rBase - 6}, ${gBase - 4}, ${bBase - 3})`);
    plankGrad.addColorStop(0.25, `rgb(${rBase + 3}, ${gBase + 2}, ${bBase + 1})`);
    plankGrad.addColorStop(0.55, `rgb(${rBase + 6}, ${gBase + 4}, ${bBase + 3})`);
    plankGrad.addColorStop(0.85, `rgb(${rBase}, ${gBase}, ${bBase})`);
    plankGrad.addColorStop(1, `rgb(${rBase - 8}, ${gBase - 6}, ${bBase - 4})`);

    cctx.fillStyle = plankGrad;
    cctx.fillRect(0, yStart, width, plankHeight);

    // Subtle cathedral wood grain arches & flowing fibers
    const archCenterX = width * (0.28 + (p * 0.23) % 0.5);
    const waveFreq1 = 0.0018 + (p % 3) * 0.0006;
    const waveFreq2 = 0.0055 + (p % 2) * 0.0012;
    const amp1 = 7 + (p % 3) * 3;
    const amp2 = 2.2;

    // Continuous fine wood fibers (smooth continuous curves, no step artifacts)
    const fiberCount = 420;
    for (let i = 0; i < fiberCount; i++) {
      const baseY = yStart + Math.random() * plankHeight;
      const distFromPlankCenter = Math.abs(baseY - (yStart + plankHeight * 0.5)) / (plankHeight * 0.5);

      // Cathedral grain curvature
      const archInfluence = (1 - distFromPlankCenter) * 10;
      const alpha = 0.022 + Math.random() * 0.05;
      const isPore = Math.random() > 0.85;

      cctx.beginPath();
      bctx.beginPath();
      rctx.beginPath();

      cctx.moveTo(0, baseY);
      bctx.moveTo(0, baseY);
      rctx.moveTo(0, baseY);

      // Stepping x += 4 for perfectly smooth, continuous wood grain curves
      for (let x = 4; x <= width; x += 4) {
        const dx = (x - archCenterX) / width;
        const arch = Math.exp(-dx * dx * 7) * archInfluence;
        const wave = Math.sin(x * waveFreq1 + p) * amp1 + Math.sin(x * waveFreq2 + p * 2) * amp2;
        const y = baseY + wave + arch;
        cctx.lineTo(x, y);
        bctx.lineTo(x, y);
        rctx.lineTo(x, y);
      }

      const lineWidth = isPore ? 0.7 : 1.1 + Math.random() * 1.3;
      cctx.lineWidth = lineWidth;
      bctx.lineWidth = lineWidth;
      rctx.lineWidth = lineWidth;

      // Soft natural dark wood tones — completely eliminating bright white speckles and harsh ridges
      cctx.strokeStyle = `rgba(18, 10, 5, ${alpha})`;
      bctx.strokeStyle = `rgba(112, 112, 112, ${alpha * 0.7})`; // very subtle pore indentation
      rctx.strokeStyle = `rgba(146, 146, 146, ${alpha * 0.5})`; // gentle diffuse pore texture

      cctx.stroke();
      bctx.stroke();
      rctx.stroke();
    }

    // Micro-pores (natural hardwood pore texture, 20-50px fine hairlines)
    for (let j = 0; j < 500; j++) {
      const px = Math.random() * (width - 50);
      const py = yStart + Math.random() * plankHeight;
      const pLen = 14 + Math.random() * 32;
      const pAlpha = 0.025 + Math.random() * 0.035;

      cctx.fillStyle = `rgba(14, 8, 4, ${pAlpha})`;
      cctx.fillRect(px, py, pLen, 0.8);

      bctx.fillStyle = `rgba(105, 105, 105, ${pAlpha * 0.5})`;
      bctx.fillRect(px, py, pLen, 0.8);
    }

    // Clean, micro-beveled plank joint (dark groove line + subtle edge highlight)
    cctx.fillStyle = 'rgba(10, 5, 2, 0.72)';
    cctx.fillRect(0, yEnd - 2, width, 2);
    bctx.fillStyle = '#222222';
    bctx.fillRect(0, yEnd - 2, width, 2);

    // Subtle edge highlight on adjacent plank edge
    if (p > 0) {
      cctx.fillStyle = 'rgba(215, 175, 135, 0.08)';
      cctx.fillRect(0, yStart, width, 1.2);
      bctx.fillStyle = '#9c9c9c';
      bctx.fillRect(0, yStart, width, 1.2);
    }
  }

  // Clamped texture mapping: ZERO repeating seam across the tabletop
  const colorTex = new THREE.CanvasTexture(colorCanvas);
  colorTex.wrapS = THREE.ClampToEdgeWrapping;
  colorTex.wrapT = THREE.ClampToEdgeWrapping;
  colorTex.repeat.set(1, 1);
  colorTex.anisotropy = 8;

  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  bumpTex.wrapS = THREE.ClampToEdgeWrapping;
  bumpTex.wrapT = THREE.ClampToEdgeWrapping;
  bumpTex.repeat.set(1, 1);
  bumpTex.anisotropy = 8;

  const roughTex = new THREE.CanvasTexture(roughCanvas);
  roughTex.wrapS = THREE.ClampToEdgeWrapping;
  roughTex.wrapT = THREE.ClampToEdgeWrapping;
  roughTex.repeat.set(1, 1);
  roughTex.anisotropy = 8;

  return { colorTex, bumpTex, roughTex };
}

/**
 * Procedural Wood Edge Texture Generator for the front edge of the table
 */
function createWoodEdgeTextures() {
  const width = 2048;
  const height = 256;

  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = width;
  colorCanvas.height = height;
  const cctx = colorCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bctx = bumpCanvas.getContext('2d');

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rctx = roughCanvas.getContext('2d');

  // Deep rich walnut base matching tabletop
  cctx.fillStyle = '#342013';
  cctx.fillRect(0, 0, width, height);

  bctx.fillStyle = '#808080';
  bctx.fillRect(0, 0, width, height);

  rctx.fillStyle = '#8c8c8c';
  rctx.fillRect(0, 0, width, height);

  // Subtle horizontal gradient across edge
  const grad = cctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#462c1b');
  grad.addColorStop(0.25, '#3b2517');
  grad.addColorStop(0.75, '#2e1c11');
  grad.addColorStop(1, '#22140d');
  cctx.fillStyle = grad;
  cctx.fillRect(0, 0, width, height);

  // Horizontal wood grain edge lines
  for (let i = 0; i < 90; i++) {
    const y = Math.random() * height;
    const alpha = 0.025 + Math.random() * 0.045;
    cctx.beginPath();
    bctx.beginPath();
    rctx.beginPath();

    cctx.moveTo(0, y);
    bctx.moveTo(0, y);
    rctx.moveTo(0, y);

    for (let x = 8; x <= width; x += 8) {
      const wave = Math.sin(x * 0.003) * 2;
      cctx.lineTo(x, y + wave);
      bctx.lineTo(x, y + wave);
      rctx.lineTo(x, y + wave);
    }

    cctx.strokeStyle = `rgba(14, 8, 4, ${alpha})`;
    bctx.strokeStyle = `rgba(115, 115, 115, ${alpha * 0.6})`;
    rctx.strokeStyle = `rgba(150, 150, 150, ${alpha * 0.5})`;
    cctx.lineWidth = 1 + Math.random();
    bctx.lineWidth = 1 + Math.random();
    rctx.lineWidth = 1 + Math.random();
    cctx.stroke();
    bctx.stroke();
    rctx.stroke();
  }

  const colorTex = new THREE.CanvasTexture(colorCanvas);
  colorTex.wrapS = THREE.ClampToEdgeWrapping;
  colorTex.wrapT = THREE.ClampToEdgeWrapping;
  colorTex.anisotropy = 8;

  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  bumpTex.wrapS = THREE.ClampToEdgeWrapping;
  bumpTex.wrapT = THREE.ClampToEdgeWrapping;
  bumpTex.anisotropy = 8;

  const roughTex = new THREE.CanvasTexture(roughCanvas);
  roughTex.wrapS = THREE.ClampToEdgeWrapping;
  roughTex.wrapT = THREE.ClampToEdgeWrapping;
  roughTex.anisotropy = 8;

  return { colorTex, bumpTex, roughTex };
}

/**
 * Procedural Badge Texture Generator: "RIDDHIMAN KUNDAL PORTFOLIO"
 */
function createBadgeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 92;
  const ctx = canvas.getContext('2d');

  // Badge metallic dark slate background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 92);
  bgGrad.addColorStop(0, '#1c1f26');
  bgGrad.addColorStop(0.5, '#12141a');
  bgGrad.addColorStop(1, '#0b0d11');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 640, 92);

  // Metallic border
  ctx.strokeStyle = '#484f5e';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 636, 88);

  // Inner metallic highlight bevel
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(4, 4, 632, 84);

  // Retro 4-color spectrum stripe (Red, Amber, Green, Blue)
  const stripeX = 18;
  const stripeW = 8;
  const colors = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(stripeX, 16 + i * 15, stripeW, 14);
  }

  // Text: RIDDHIMAN KUNDAL PORTFOLIO
  const badgeTitle = `${content.personal?.name || 'RIDDHIMAN KUNDAL'} PORTFOLIO`;
  ctx.font = 'bold 26px "Fira Code", monospace';
  ctx.fillStyle = '#f0ece2';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;
  ctx.fillText(badgeTitle, 42, 44);

  // Subtitle: HIGH RESOLUTION COLOR DISPLAY • MODEL RK-2026
  ctx.font = '500 15px "Fira Code", monospace';
  ctx.fillStyle = '#9e9686';
  ctx.shadowBlur = 0;
  ctx.fillText('HIGH RESOLUTION COLOR DISPLAY • MODEL RK-2026', 44, 70);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

/**
 * Procedural Plastic Stipple Texture for Vintage Beige Chassis
 */
function createPlasticTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#cfc6b5';
  ctx.fillRect(0, 0, 256, 256);

  // Stippled plastic micro-dots
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const val = Math.random();
    ctx.fillStyle = val > 0.5 ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

/**
 * True 3D Retro Monitor & Desk Application
 */
class RetroWorkspaceApp {
  constructor() {
    this.webglContainer = document.getElementById('webgl-container');
    this.css3dContainer = document.getElementById('css3d-container');
    this.portraitAlert = document.getElementById('portrait-alert');
    this.dismissBtn = document.getElementById('dismiss-portrait-alert');
    this.alertDismissed = false;

    if (content.meta?.siteTitle) {
      document.title = content.meta.siteTitle;
    }
    if (content.meta?.landscapeAlert) {
      const heading = document.querySelector('.alert-heading');
      const body = document.querySelector('.alert-body');
      if (heading && content.meta.landscapeAlert.heading) heading.textContent = content.meta.landscapeAlert.heading;
      if (body && content.meta.landscapeAlert.body) body.textContent = content.meta.landscapeAlert.body;
      if (this.dismissBtn && content.meta.landscapeAlert.dismissText) this.dismissBtn.textContent = content.meta.landscapeAlert.dismissText;
    }

    this.initScene();
    this.initLights();
    this.createTableMesh();
    this.createMonitorMesh();
    this.createCSS3DScreen();
    this.initEvents();
    this.onResize();
    this.animate();

    window.__retroApp = this;
  }

  initScene() {
    // 1. WebGL Scene & Renderer
    this.scene = new THREE.Scene();
    // Solid black background
    this.scene.background = new THREE.Color(0x000000);

    // 2. CSS3D Scene & Renderer
    this.cssScene = new THREE.Scene();

    // 3. Camera (viewed from a subtle bottom-left angle, zoomed in)
    this.camera = new THREE.PerspectiveCamera(
      32.5,
      window.innerWidth / window.innerHeight,
      1,
      8000
    );
    this.camera.position.set(-115, 390, 1680);
    this.cameraTarget = new THREE.Vector3(-15, 460, 0);
    this.camera.lookAt(this.cameraTarget);

    // 4. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.webglContainer.appendChild(this.renderer.domElement);

    // 5. CSS3D Renderer
    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
    this.css3dContainer.appendChild(this.cssRenderer.domElement);
  }

  initLights() {
    // 1. Key Directional Light (Warm studio desk lamp from top-left, casts real-time soft shadows)
    this.keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    this.keyLight.position.set(-600, 1100, 900);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 200;
    this.keyLight.shadow.camera.far = 3200;
    this.keyLight.shadow.camera.left = -1100;
    this.keyLight.shadow.camera.right = 1100;
    this.keyLight.shadow.camera.top = 1300;
    this.keyLight.shadow.camera.bottom = -900;
    this.keyLight.shadow.bias = -0.0004;
    this.keyLight.shadow.normalBias = 0.05;
    this.scene.add(this.keyLight);

    // 2. Soft Fill Light (Brings out right chamfers and bevels)
    const fillLight = new THREE.DirectionalLight(0x557799, 0.85);
    fillLight.position.set(700, 600, 600);
    this.scene.add(fillLight);

    // 3. Rim / Top Light (Highlights top cowl and edges against black void)
    const rimLight = new THREE.DirectionalLight(0x7799bb, 0.95);
    rimLight.position.set(0, 900, -700);
    this.scene.add(rimLight);

    // 4. Soft Ambient Studio Light
    const ambientLight = new THREE.AmbientLight(0x1a1a24, 0.7);
    this.scene.add(ambientLight);
  }

  /**
   * Builds the enhanced pure 3D Desk/Table geometry
   */
  createTableMesh() {
    this.woodTextures = createDetailedWoodTextures();
    this.woodEdgeTextures = createWoodEdgeTextures();

    // High-end satin furniture lacquer walnut material for top surface
    const topMat = new THREE.MeshStandardMaterial({
      map: this.woodTextures.colorTex,
      bumpMap: this.woodTextures.bumpTex,
      bumpScale: 0.16,
      roughnessMap: this.woodTextures.roughTex,
      roughness: 0.5,
      metalness: 0.0
    });

    // Matching edge-grain walnut material for front, sides, and legs
    const edgeMat = new THREE.MeshStandardMaterial({
      map: this.woodEdgeTextures.colorTex,
      bumpMap: this.woodEdgeTextures.bumpTex,
      bumpScale: 0.14,
      roughnessMap: this.woodEdgeTextures.roughTex,
      roughness: 0.48,
      metalness: 0.0
    });

    this.tableGroup = new THREE.Group();

    // BoxGeometry materials: [+X, -X, +Y, -Y, +Z, -Z]
    // Top surface (+Y) has topMat; Front face (+Z) and sides have edgeMat
    const slabMaterials = [
      edgeMat, // +X right
      edgeMat, // -X left
      topMat,  // +Y top surface (seamless horizontal planks)
      edgeMat, // -Y bottom
      edgeMat, // +Z front edge
      edgeMat  // -Z back edge
    ];

    // 1. Single Solid Seamless Tabletop Slab (Top surface at y = -95, front edge at z = 650)
    const slabGeo = new THREE.BoxGeometry(2800, 56, 1700);
    const slabMesh = new THREE.Mesh(slabGeo, slabMaterials);
    slabMesh.position.set(0, -123, -200);
    slabMesh.receiveShadow = true;
    this.tableGroup.add(slabMesh);

    // 2. Heavy Solid Timber Table Legs with Dark Brass Leveler Feet
    const legGeo = new THREE.BoxGeometry(100, 650, 100);
    const brassFootGeo = new THREE.BoxGeometry(106, 25, 106);
    const brassFootMat = new THREE.MeshStandardMaterial({
      color: 0x221a12,
      roughness: 0.35,
      metalness: 0.6
    });

    const legPositions = [
      [-1200, -450, 500],
      [1200, -450, 500],
      [-1200, -450, -900],
      [1200, -450, -900]
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, edgeMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      leg.receiveShadow = true;
      this.tableGroup.add(leg);

      const brassFoot = new THREE.Mesh(brassFootGeo, brassFootMat);
      brassFoot.position.set(x, -760, z);
      this.tableGroup.add(brassFoot);
    });

    // 3. Table Support Apron/Skirt
    const apronGeo = new THREE.BoxGeometry(2450, 75, 24);
    const apronFront = new THREE.Mesh(apronGeo, edgeMat);
    apronFront.position.set(0, -188, 520);
    apronFront.receiveShadow = true;
    this.tableGroup.add(apronFront);

    // 4. Subtle CRT Screen Glow Reflection onto Wood Table
    const screenBounce = new THREE.PointLight(0x78bceb, 0.3, 450);
    screenBounce.position.set(0, 30, 240);
    this.tableGroup.add(screenBounce);

    this.scene.add(this.tableGroup);
  }

  /**
   * Builds the pure 3D Vintage CRT Monitor geometry & materials
   */
  createMonitorMesh() {
    this.monitorGroup = new THREE.Group();
    // Subtle 2.5-degree upward tilt typical of desktop CRT workstations
    this.monitorGroup.rotation.x = -0.04;

    this.plasticTexture = createPlasticTexture();

    // Main Vintage Beige Material
    this.chassisMat = new THREE.MeshStandardMaterial({
      color: 0xcfc6b5,
      bumpMap: this.plasticTexture,
      bumpScale: 0.6,
      roughness: 0.58,
      metalness: 0.04
    });

    // Darker Bezel & Recess Material
    this.darkBezelMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.65,
      metalness: 0.05
    });

    // Outer Bezel Rim Material (Intermediate warm tone)
    this.bezelRimMat = new THREE.MeshStandardMaterial({
      color: 0xb5ab9a,
      roughness: 0.52,
      metalness: 0.05
    });

    // -------------------------------------------------------------------------
    // 1. Main Tapered CRT Housing Body
    // -------------------------------------------------------------------------
    // Top Cowl / Hood
    const topPanelGeo = new THREE.BoxGeometry(1180, 40, 680);
    const topPanel = new THREE.Mesh(topPanelGeo, this.chassisMat);
    topPanel.position.set(0, 940, -320);
    topPanel.castShadow = true;
    topPanel.receiveShadow = true;
    this.monitorGroup.add(topPanel);

    // Bottom Base Panel of Cabinet
    const bottomPanelGeo = new THREE.BoxGeometry(1160, 40, 640);
    const bottomPanel = new THREE.Mesh(bottomPanelGeo, this.chassisMat);
    bottomPanel.position.set(0, 60, -300);
    bottomPanel.castShadow = true;
    bottomPanel.receiveShadow = true;
    this.monitorGroup.add(bottomPanel);

    // Left Side Cheek
    const leftCheekGeo = new THREE.BoxGeometry(40, 880, 660);
    const leftCheek = new THREE.Mesh(leftCheekGeo, this.chassisMat);
    leftCheek.position.set(-570, 500, -310);
    leftCheek.castShadow = true;
    leftCheek.receiveShadow = true;
    this.monitorGroup.add(leftCheek);

    // Right Side Cheek
    const rightCheekGeo = new THREE.BoxGeometry(40, 880, 660);
    const rightCheek = new THREE.Mesh(rightCheekGeo, this.chassisMat);
    rightCheek.position.set(570, 500, -310);
    rightCheek.castShadow = true;
    rightCheek.receiveShadow = true;
    this.monitorGroup.add(rightCheek);

    // Tapered Rear Enclosure
    const rearCapGeo = new THREE.BoxGeometry(780, 640, 60);
    const rearCap = new THREE.Mesh(rearCapGeo, this.chassisMat);
    rearCap.position.set(0, 500, -660);
    rearCap.castShadow = true;
    this.monitorGroup.add(rearCap);

    // -------------------------------------------------------------------------
    // 2. Front Bezel Frame (Frames the 1024x768 screen cavity at z = 0)
    // -------------------------------------------------------------------------
    // Top Front Bezel
    const fTopGeo = new THREE.BoxGeometry(1180, 76, 50);
    const fTop = new THREE.Mesh(fTopGeo, this.chassisMat);
    fTop.position.set(0, 922, 12);
    fTop.castShadow = true;
    fTop.receiveShadow = true;
    this.monitorGroup.add(fTop);

    // Left Front Bezel
    const fLeftGeo = new THREE.BoxGeometry(78, 768, 50);
    const fLeft = new THREE.Mesh(fLeftGeo, this.chassisMat);
    fLeft.position.set(-551, 500, 12);
    fLeft.castShadow = true;
    fLeft.receiveShadow = true;
    this.monitorGroup.add(fLeft);

    // Right Front Bezel
    const fRightGeo = new THREE.BoxGeometry(78, 768, 50);
    const fRight = new THREE.Mesh(fRightGeo, this.chassisMat);
    fRight.position.set(551, 500, 12);
    fRight.castShadow = true;
    fRight.receiveShadow = true;
    this.monitorGroup.add(fRight);

    // Bottom Chin Bezel (Houses Badge, Dials, LED)
    const fBottomGeo = new THREE.BoxGeometry(1180, 116, 50);
    const fBottom = new THREE.Mesh(fBottomGeo, this.chassisMat);
    fBottom.position.set(0, 58, 12);
    fBottom.castShadow = true;
    fBottom.receiveShadow = true;
    this.monitorGroup.add(fBottom);

    // Recessed Rubber CRT Tube Gasket (Inner frame around screen)
    const gasketTop = new THREE.Mesh(new THREE.BoxGeometry(1030, 8, 16), this.darkBezelMat);
    gasketTop.position.set(0, 886, 6);
    this.monitorGroup.add(gasketTop);

    const gasketBottom = new THREE.Mesh(new THREE.BoxGeometry(1030, 8, 16), this.darkBezelMat);
    gasketBottom.position.set(0, 114, 6);
    this.monitorGroup.add(gasketBottom);

    const gasketLeft = new THREE.Mesh(new THREE.BoxGeometry(8, 768, 16), this.darkBezelMat);
    gasketLeft.position.set(-514, 500, 6);
    this.monitorGroup.add(gasketLeft);

    const gasketRight = new THREE.Mesh(new THREE.BoxGeometry(8, 768, 16), this.darkBezelMat);
    gasketRight.position.set(514, 500, 6);
    this.monitorGroup.add(gasketRight);

    // -------------------------------------------------------------------------
    // 3. Top Ventilation Louvers / Cooling Grille
    // -------------------------------------------------------------------------
    const ventGroup = new THREE.Group();
    const ventSlotGeo = new THREE.BoxGeometry(38, 5, 8);
    const ventMat = new THREE.MeshStandardMaterial({ color: 0x3a342a, roughness: 0.8 });
    for (let i = -6; i <= 6; i++) {
      const slot = new THREE.Mesh(ventSlotGeo, ventMat);
      slot.position.set(i * 50, 962, -20);
      ventGroup.add(slot);
    }
    this.monitorGroup.add(ventGroup);

    // -------------------------------------------------------------------------
    // 4. Bottom Chin Details: Nameplate Badge, Dials, LED
    // -------------------------------------------------------------------------
    // Nameplate Badge Mesh: "RIDDHIMAN KUNDAL PORTFOLIO"
    const badgeTexture = createBadgeTexture();
    const badgeGeo = new THREE.BoxGeometry(320, 46, 6);
    const badgeMat = new THREE.MeshStandardMaterial({
      map: badgeTexture,
      roughness: 0.35,
      metalness: 0.15
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(-330, 58, 38);
    this.monitorGroup.add(badgeMesh);

    // Decorative Center Mini-Vents
    for (let i = -2; i <= 2; i++) {
      const miniVent = new THREE.Mesh(new THREE.BoxGeometry(4, 22, 4), ventMat);
      miniVent.position.set(i * 9, 58, 36);
      this.monitorGroup.add(miniVent);
    }

    // Rotary Knobs: Brightness & Contrast
    const knobGeo = new THREE.CylinderGeometry(13, 13, 12, 24);
    const knobMat = new THREE.MeshStandardMaterial({
      color: 0xb5ab9a,
      roughness: 0.45,
      metalness: 0.1
    });

    // Brightness Knob
    const brightKnob = new THREE.Mesh(knobGeo, knobMat);
    brightKnob.rotation.x = Math.PI / 2;
    brightKnob.position.set(240, 58, 40);
    this.monitorGroup.add(brightKnob);

    // Contrast Knob
    const contrastKnob = new THREE.Mesh(knobGeo, knobMat);
    contrastKnob.rotation.x = Math.PI / 2;
    contrastKnob.position.set(310, 58, 40);
    this.monitorGroup.add(contrastKnob);

    // Degauss Push Button
    const degaussGeo = new THREE.CylinderGeometry(9, 9, 8, 20);
    const degaussMat = new THREE.MeshStandardMaterial({ color: 0x9c9282, roughness: 0.5 });
    const degaussBtn = new THREE.Mesh(degaussGeo, degaussMat);
    degaussBtn.rotation.x = Math.PI / 2;
    degaussBtn.position.set(380, 58, 38);
    this.monitorGroup.add(degaussBtn);

    // Power Rocker Switch
    const switchBase = new THREE.Mesh(new THREE.BoxGeometry(26, 20, 10), this.darkBezelMat);
    switchBase.position.set(445, 58, 38);
    this.monitorGroup.add(switchBase);

    // Glowing Power LED (Phosphor Emerald Green)
    const ledGeo = new THREE.SphereGeometry(5.5, 16, 16);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x66ff99,
      emissive: 0x38ef7d,
      emissiveIntensity: 1.6,
      roughness: 0.2
    });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(505, 58, 39);
    this.monitorGroup.add(ledMesh);

    // LED Glow Light (soft real-time bounce onto bezel)
    const ledLight = new THREE.PointLight(0x38ef7d, 1.2, 140);
    ledLight.position.set(505, 58, 48);
    this.monitorGroup.add(ledLight);

    // -------------------------------------------------------------------------
    // 5. Pedestal Swivel Stand (Rests firmly on Tabletop at y = -95)
    // -------------------------------------------------------------------------
    const pedestalGroup = new THREE.Group();

    // Swivel Neck
    const neckGeo = new THREE.BoxGeometry(220, 100, 180);
    const neckMat = new THREE.MeshStandardMaterial({
      color: 0xb5ab9a,
      roughness: 0.55,
      metalness: 0.05
    });
    const neckMesh = new THREE.Mesh(neckGeo, neckMat);
    neckMesh.position.set(0, -12, -220);
    neckMesh.castShadow = true;
    neckMesh.receiveShadow = true;
    pedestalGroup.add(neckMesh);

    // Broad Beveled Pedestal Foot (bottom touches table at y = -95)
    const footGeo = new THREE.BoxGeometry(540, 32, 420);
    const footMat = new THREE.MeshStandardMaterial({
      color: 0xc8bfae,
      roughness: 0.52,
      metalness: 0.05
    });
    const footMesh = new THREE.Mesh(footGeo, footMat);
    footMesh.position.set(0, -79, -200);
    footMesh.castShadow = true;
    footMesh.receiveShadow = true;
    pedestalGroup.add(footMesh);

    this.monitorGroup.add(pedestalGroup);

    this.scene.add(this.monitorGroup);
  }

  /**
   * Embeds the 1024x768 website iframe inside the 3D Monitor Screen via CSS3DObject
   */
  createCSS3DScreen() {
    // 1. Create Screen Container DOM Element
    const screenEl = document.createElement('div');
    screenEl.className = 'screen-3d-viewport';

    // 2. Iframe loading portfolio.html (untouched website)
    const iframe = document.createElement('iframe');
    iframe.id = 'portfolio-frame';
    iframe.src = 'portfolio.html';
    iframe.title = 'Riddhiman Kundal Portfolio';
    iframe.allow = 'autoplay';
    iframe.loading = 'eager';
    screenEl.appendChild(iframe);

    // 3. Subtle Vintage CRT Filter Overlays (pointer-events: none)
    const overlay = document.createElement('div');
    overlay.className = 'crt-glass-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="crt-reflection"></div>
      <div class="crt-scanlines"></div>
      <div class="crt-aperture-mask"></div>
      <div class="crt-vignette"></div>
      <div class="crt-phosphor-glow"></div>
    `;
    screenEl.appendChild(overlay);

    // 4. Wrap in CSS3DObject
    this.screenObject = new CSS3DObject(screenEl);
    // Scale 1440x1080 display down to exact 1024x768 3D bezel dimensions
    this.screenObject.scale.set(1024 / 1440, 768 / 1080, 1);
    // Align screen with monitor tilt and position in 3D space
    const screenLocalPos = new THREE.Vector3(0, 500, 14);
    screenLocalPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.monitorGroup.rotation.x);
    this.screenObject.position.copy(screenLocalPos);
    this.screenObject.rotation.x = this.monitorGroup.rotation.x;

    this.cssScene.add(this.screenObject);
  }

  initEvents() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('orientationchange', () => this.onResize());

    if (this.dismissBtn) {
      this.dismissBtn.addEventListener('click', () => {
        this.alertDismissed = true;
        if (this.portraitAlert) {
          this.portraitAlert.classList.add('hidden');
        }
      });
    }
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    this.camera.aspect = aspect;

    // Target framing aspect for 3D monitor + desk: ~1.25 (1500 / 1200)
    const targetAspect = 1500 / 1200;
    const baseFov = 32.5;

    if (aspect < targetAspect) {
      // Narrow screens (mobile portrait / square): widen vertical FOV so full monitor & table remain in view
      const fovRad = 2 * Math.atan(Math.tan((baseFov * Math.PI) / 360) * (targetAspect / aspect));
      this.camera.fov = (fovRad * 180) / Math.PI;
    } else {
      // Wide screens (desktop landscape): use standard cinematic FOV
      this.camera.fov = baseFov;
    }

    this.camera.updateProjectionMatrix();
    this.camera.lookAt(this.cameraTarget);

    this.renderer.setSize(width, height);
    this.cssRenderer.setSize(width, height);

    // Portrait Orientation Notice
    const isPortrait = height > width;
    if (this.portraitAlert) {
      if (isPortrait && !this.alertDismissed) {
        this.portraitAlert.classList.remove('hidden');
      } else if (!isPortrait) {
        this.alertDismissed = false;
        this.portraitAlert.classList.add('hidden');
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    // Render WebGL 3D meshes (monitor, desk, shadows) & CSS3D screen in lockstep
    this.renderer.render(this.scene, this.camera);
    this.cssRenderer.render(this.cssScene, this.camera);
  }
}

// Launch once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new RetroWorkspaceApp());
} else {
  new RetroWorkspaceApp();
}
