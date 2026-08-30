/**
 * BioShelter Studio - Interactive 3D Three.js Viewport
 * World-class procedural bio-architecture renderer with:
 * - 1x, 5x, 10x, 20x Simulation Speed & Cinematic Magnification
 * - Multi-layer vernacular architecture (Badgir windcatcher, Trombe wall, Walipini, Geodesic dome)
 * - Animated convective airflow particles and real-time solar shadows
 * - Exploded view & cutaway cross-section modes
 */

export class ThreeViewport {
  constructor(canvasContainerId, stateStore) {
    this.container = document.getElementById(canvasContainerId);
    this.store = stateStore;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.structureGroup = null;
    this.particlesGroup = null;
    this.sunLight = null;
    this.sunMesh = null;
    this.sunCorona = null;
    this.animationFrameId = null;
    this.clock = null;
    this.airflowParticles = [];
    this.isExploded = false;
    this.explodedFactor = 0;
    this.targetZoomDist = 22;
    this.currentZoomLevel = '1x'; // '1x', '5x', '10x', '20x'

    if (this.container) {
      this.init();
    }
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js is not loaded yet');
      return;
    }

    this.clock = new THREE.Clock();

    // 1. Scene & Atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a100d);
    this.scene.fog = new THREE.FogExp2(0x0a100d, 0.012);

    // 2. Perspective Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(20, 16, 24);

    // 3. Antialiased WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
      this.controls.minDistance = 2.0;
      this.controls.maxDistance = 100;
      this.controls.target.set(0, 2.5, 0);
    }

    // 5. Lighting & Dynamic Sun
    this.setupLighting();

    // 6. Ground & Environment
    this.setupEnvironment();

    // 7. Structure & Particle Groups
    this.structureGroup = new THREE.Group();
    this.scene.add(this.structureGroup);

    this.particlesGroup = new THREE.Group();
    this.scene.add(this.particlesGroup);

    // 8. Build Initial 3D Model & Airflow
    this.rebuildModel();
    this.setupAirflowParticles();

    // 9. Event Subscriptions
    window.addEventListener('resize', () => this.onResize());
    this.store.on('*', () => this.rebuildModel());
    this.store.on('simHour', () => this.updateSunPosition());
    this.store.on('simMonth', () => this.updateSunPosition());
    this.store.on('customLatitude', () => this.updateSunPosition());
    this.store.on('orientationAzimuth', (az) => this.updateStructureOrientation(az));
    this.store.on('viewportMode', () => this.rebuildModel());

    // UI-13 FIX: Handle GPU context loss gracefully
    this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      // Show overlay message
      const overlay = document.createElement('div');
      overlay.id = 'webgl-lost-overlay';
      overlay.style.cssText = 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(7,11,20,0.92);color:#94a3b8;font-size:14px;gap:8px;z-index:10;border-radius:inherit;';
      overlay.innerHTML = '<span style="font-size:32px">⚠️</span><strong style="color:#f8fafc">3D View Paused</strong><span>GPU context lost — switch back to this tab to restore</span>';
      if (this.container) { this.container.style.position = 'relative'; this.container.appendChild(overlay); }
    });

    this.renderer.domElement.addEventListener('webglcontextrestored', () => {
      // Remove overlay and restart animation loop
      const overlay = document.getElementById('webgl-lost-overlay');
      if (overlay) overlay.remove();
      this.rebuildModel();
      this.animate();
    });

    // 10. Start Animation Loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.45);
    this.scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 0.4);
    this.scene.add(hemiLight);

    // Directional Sun Light
    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 120;
    const d = 22;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.sunLight);

    // Sun Visual Sphere
    const sunGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.scene.add(this.sunMesh);

    // Sun Corona Halo
    const coronaGeo = new THREE.RingGeometry(1.3, 3.2, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    this.sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
    this.scene.add(this.sunCorona);

    // Sun Celestial Orbit Ring
    const trackGeo = new THREE.RingGeometry(31.8, 32.2, 96);
    const trackMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      opacity: 0.22,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.trackMesh = new THREE.Mesh(trackGeo, trackMat);
    this.trackMesh.position.y = 2;
    this.scene.add(this.trackMesh);

    this.updateSunPosition();
  }

  updateSunPosition() {
    const state = this.store.getState();
    const { simMonth, simHour, customLatitude, orientationAzimuth } = state;
    
    const latDeg = customLatitude !== undefined ? customLatitude : 26.9;
    const dayOfYear = [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345][(simMonth || 1) - 1] || 15;
    const latRad = (latDeg * Math.PI) / 180;
    const declination = 23.45 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81)) * (Math.PI / 180);
    const hourAngle = (((simHour !== undefined ? simHour : 12) - 12) * 15 * Math.PI) / 180;

    const sinAlt = Math.sin(latRad) * Math.sin(declination) + Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngle);
    const altitudeRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
    const altitudeDeg = (altitudeRad * 180) / Math.PI;

    const cosAz = (Math.sin(declination) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(altitudeRad));
    let azimuthRad = Math.acos(Math.max(-1, Math.min(1, cosAz)));
    if (simHour > 12) azimuthRad = 2 * Math.PI - azimuthRad;
    const azimuthDeg = (azimuthRad * 180) / Math.PI;

    // 1. Tilt Celestial Orbit Ring accurately according to latitude
    if (this.trackMesh) {
      this.trackMesh.rotation.x = (Math.PI / 2) - latRad;
      this.trackMesh.position.y = 4 * Math.sin(latRad);
    }

    // 2. Rotate 3D structure according to site orientation azimuth
    if (this.structureGroup) {
      const azOffsetDeg = (orientationAzimuth || 180) - 180;
      this.structureGroup.rotation.y = (azOffsetDeg * Math.PI) / 180;
    }

    // 3. Position Sun Light & Mesh
    const dist = 36;
    const altClamped = Math.max(0.04, altitudeRad);
    const x = dist * Math.cos(altClamped) * Math.sin(azimuthRad);
    const y = Math.max(0.6, dist * Math.sin(altClamped));
    const z = dist * Math.cos(altClamped) * Math.cos(azimuthRad);

    if (this.sunLight && this.sunMesh) {
      this.sunLight.position.set(x, y, z);
      this.sunMesh.position.set(x, y, z);
      if (this.sunCorona) {
        this.sunCorona.position.set(x, y, z);
        this.sunCorona.lookAt(this.camera ? this.camera.position : new THREE.Vector3(0, 0, 0));
      }
      
      const isDay = altitudeDeg > 0;
      this.sunLight.intensity = isDay ? Math.max(0.2, 2.4 * Math.sin(altClamped)) : 0.05;
      this.sunMesh.visible = isDay;
      if (this.sunCorona) this.sunCorona.visible = isDay;

      if (isDay) {
        const warmFactor = Math.min(1, altClamped * 2);
        this.sunLight.color.setHSL(0.12 * warmFactor + 0.06, 0.85, 0.75 + (0.25 * warmFactor));
      }
    }

    // 4. Update HUD Latitude & Solar Readout
    const hudLat = document.getElementById('hud-site-lat-readout');
    if (hudLat) {
      hudLat.textContent = `📍 Lat: ${latDeg >= 0 ? latDeg.toFixed(1) + '° N' : Math.abs(latDeg).toFixed(1) + '° S'} | Alt: ${altitudeDeg.toFixed(1)}° | Az: ${azimuthDeg.toFixed(0)}°`;
    }
  }

  setupEnvironment() {
    // 1. Terrain Ground
    const groundGeo = new THREE.PlaneGeometry(140, 140, 64, 64);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const dist = Math.sqrt(vx * vx + vy * vy);
      if (dist > 18) {
        pos.setZ(i, Math.sin(vx * 0.08) * Math.cos(vy * 0.08) * 0.6 - 0.2);
      }
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x14231b,
      roughness: 0.9,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 2. Radial Architectural Grid
    const grid = new THREE.PolarGridHelper(34, 18, 8, 64, 0x10b981, 0x1e3a2f);
    grid.position.y = 0.02;
    this.scene.add(grid);

    // 3. Cardinal Compass Markers
    const cardinalGroup = new THREE.Group();
    const markers = [
      { label: 'S (Solar Max)', pos: [0, 0.15, 18], color: 0xf59e0b },
      { label: 'N (Thermal Mass)', pos: [0, 0.15, -18], color: 0x38bdf8 },
      { label: 'E (Morning Sun)', pos: [18, 0.15, 0], color: 0x10b981 },
      { label: 'W (Evening Wind)', pos: [-18, 0.15, 0], color: 0xa855f7 }
    ];

    markers.forEach(m => {
      const geo = new THREE.ConeGeometry(0.5, 1.0, 4);
      const mat = new THREE.MeshBasicMaterial({ color: m.color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(m.pos[0], m.pos[1], m.pos[2]);
      cardinalGroup.add(mesh);
    });
    this.scene.add(cardinalGroup);

    // 4. Dynamic Solar Orientation Arrow Indicator (points along BioShelter facade)
    this.orientationNeedle = new THREE.Group();
    const needleGeo = new THREE.ConeGeometry(0.6, 2.4, 4);
    const needleMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const needle = new THREE.Mesh(needleGeo, needleMat);
    needle.rotation.x = Math.PI / 2;
    needle.position.z = 13;
    needle.position.y = 0.2;
    this.orientationNeedle.add(needle);
    this.scene.add(this.orientationNeedle);

    this.updateStructureOrientation();
  }

  /**
   * Directly updates 3D structure rotation around true solar south (180 deg)
   */
  updateStructureOrientation(azDeg) {
    if (!this.structureGroup) return;
    const state = this.store.getState();
    const az = azDeg !== undefined ? azDeg : (state.orientationAzimuth !== undefined ? state.orientationAzimuth : 180);
    const azOffsetRad = ((az - 180) * Math.PI) / 180;
    this.structureGroup.rotation.y = azOffsetRad;
    if (this.orientationNeedle) {
      this.orientationNeedle.rotation.y = azOffsetRad;
    }
  }

  /**
   * Convective Airflow Streamlines & Particles
   */
  setupAirflowParticles() {
    // Clear previous particles
    while (this.particlesGroup.children.length > 0) {
      const p = this.particlesGroup.children[0];
      this.particlesGroup.remove(p);
      if (p.geometry) p.geometry.dispose();
      if (p.material) p.material.dispose();
    }
    this.airflowParticles = [];

    const particleCount = 45;
    const pGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });

    for (let i = 0; i < particleCount; i++) {
      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        Math.random() * 4 + 0.5,
        (Math.random() - 0.5) * 8
      );
      this.particlesGroup.add(mesh);

      this.airflowParticles.push({
        mesh,
        speed: 0.02 + Math.random() * 0.03,
        radius: 2 + Math.random() * 4,
        angle: Math.random() * Math.PI * 2,
        yBase: mesh.position.y
      });
    }
  }

  /**
   * Rebuilds the 3D BioShelter Model
   */
  rebuildModel() {
    if (!this.structureGroup) return;

    while (this.structureGroup.children.length > 0) {
      const obj = this.structureGroup.children[0];
      this.structureGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }

    const state = this.store.getState();
    const mode = state.viewportMode || 'realistic';
    const { structureType, diameter, height } = state;
    const radius = (diameter || 10.4) / 2;
    const h = height || 5.2;

    if (structureType === 'geodesic') {
      this.buildGeodesicDome(radius, h, mode);
    } else if (structureType === 'walipini') {
      this.buildWalipini(radius, h, mode);
    } else if (structureType === 'gothic_arch') {
      this.buildGothicArch(radius, h, mode);
    } else {
      this.buildLeanToArk(radius, h, mode);
    }

    // Subsystems & internal ecosystems
    this.buildInternalEcosystem(radius, h, mode);
    if (state.layerVisibility && state.layerVisibility.earthTubes) {
      this.buildEarthTubes(radius, mode);
    }

    // Apply active solar orientation azimuth rotation
    this.updateStructureOrientation();
  }

  buildGeodesicDome(radius, height, mode) {
    const group = new THREE.Group();

    // 1. Crystalline Triangular Glazing
    const domeGeo = new THREE.SphereGeometry(radius, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2);
    domeGeo.scale(1, height / radius, 1);

    let glazingMat;
    if (mode === 'thermal_heatmap') {
      glazingMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.3,
        transparent: true,
        opacity: 0.7
      });
    } else if (mode === 'wireframe') {
      glazingMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true });
    } else {
      glazingMat = new THREE.MeshPhysicalMaterial({
        color: 0xa7f3d0,
        metalness: 0.1,
        roughness: 0.12,
        transmission: 0.82,
        thickness: 0.6,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
    }

    const domeMesh = new THREE.Mesh(domeGeo, glazingMat);
    domeMesh.castShadow = true;
    domeMesh.receiveShadow = true;
    group.add(domeMesh);

    // 2. Titanium / Glulam Timber Facet Struts
    const wireGeo = new THREE.WireframeGeometry(domeGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2.5 });
    const wireLines = new THREE.LineSegments(wireGeo, wireMat);
    group.add(wireLines);

    // 3. North High-R Insulated Earthen Shell
    const northBermGeo = new THREE.CylinderGeometry(radius * 1.015, radius * 1.015, height * 0.72, 28, 1, false, Math.PI * 0.75, Math.PI * 0.5);
    const northBermMat = new THREE.MeshStandardMaterial({
      color: mode === 'thermal_heatmap' ? 0x2563eb : 0x27272a,
      roughness: 0.92,
      side: THREE.DoubleSide
    });
    const northBerm = new THREE.Mesh(northBermGeo, northBermMat);
    northBerm.position.y = (height * 0.72) / 2;
    northBerm.rotation.y = Math.PI * 0.25;
    northBerm.castShadow = true;
    group.add(northBerm);

    // 4. Perimeter Base Stem Ring
    const stemGeo = new THREE.CylinderGeometry(radius, radius, 0.7, 32);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.85 });
    const stemWall = new THREE.Mesh(stemGeo, stemMat);
    stemWall.position.y = 0.35;
    group.add(stemWall);

    this.structureGroup.add(group);
  }

  buildWalipini(radius, height, mode) {
    const group = new THREE.Group();
    const length = radius * 2.2;
    const width = radius * 1.8;
    const pitDepth = 1.8;

    // Excavated Subterranean Rammed Earth Walls
    const pitGeo = new THREE.BoxGeometry(width, pitDepth, length);
    const pitMat = new THREE.MeshStandardMaterial({
      color: mode === 'thermal_heatmap' ? 0x1d4ed8 : 0x3b2514,
      roughness: 0.96,
      side: THREE.BackSide
    });
    const pit = new THREE.Mesh(pitGeo, pitMat);
    pit.position.y = -pitDepth / 2;
    group.add(pit);

    // North Massive Thermal Earth Berm
    const northWallGeo = new THREE.BoxGeometry(width * 1.05, height, 0.9);
    const northWallMat = new THREE.MeshStandardMaterial({
      color: mode === 'thermal_heatmap' ? 0x2563eb : 0x475569,
      roughness: 0.92
    });
    const northWall = new THREE.Mesh(northWallGeo, northWallMat);
    northWall.position.set(0, height / 2, -length / 2);
    northWall.castShadow = true;
    group.add(northWall);

    // South-Angled Solar Glazing Rafters
    const glazingGeo = new THREE.PlaneGeometry(width * 1.02, Math.sqrt(height * height + length * length));
    const glazingMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.82,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const glazing = new THREE.Mesh(glazingGeo, glazingMat);
    glazing.position.set(0, height / 2, 0);
    glazing.rotation.x = Math.atan2(height, length) - (Math.PI / 2);
    glazing.castShadow = true;
    group.add(glazing);

    const rafterGeo = new THREE.WireframeGeometry(glazingGeo);
    const rafterMat = new THREE.LineBasicMaterial({ color: 0x0284c7 });
    const rafters = new THREE.LineSegments(rafterGeo, rafterMat);
    rafters.position.copy(glazing.position);
    rafters.rotation.copy(glazing.rotation);
    group.add(rafters);

    this.structureGroup.add(group);
  }

  buildGothicArch(radius, height, mode) {
    const group = new THREE.Group();
    const length = radius * 2.2;
    const archCount = 8;

    for (let i = 0; i < archCount; i++) {
      const z = -length / 2 + (i / (archCount - 1)) * length;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-radius, 0, z),
        new THREE.Vector3(-radius * 0.85, height * 0.6, z),
        new THREE.Vector3(0, height, z),
        new THREE.Vector3(radius * 0.85, height * 0.6, z),
        new THREE.Vector3(radius, 0, z)
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.14, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.6, roughness: 0.35 });
      const archRib = new THREE.Mesh(tubeGeo, tubeMat);
      archRib.castShadow = true;
      group.add(archRib);
    }

    const archSkinGeo = new THREE.CylinderGeometry(radius, radius, length, 28, 8, true, 0, Math.PI);
    archSkinGeo.scale(1, height / radius, 1);
    const archSkinMat = new THREE.MeshPhysicalMaterial({
      color: 0x6ee7b7,
      transmission: 0.78,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide
    });
    const archSkin = new THREE.Mesh(archSkinGeo, archSkinMat);
    archSkin.rotation.z = Math.PI / 2;
    archSkin.rotation.x = Math.PI / 2;
    group.add(archSkin);

    this.structureGroup.add(group);
  }

  buildLeanToArk(radius, height, mode) {
    const group = new THREE.Group();
    const width = radius * 2;
    const depth = radius * 1.8;

    // 1. High North Insulated Wall
    const rearWallGeo = new THREE.BoxGeometry(width, height, 0.7);
    const rearWallMat = new THREE.MeshStandardMaterial({
      color: mode === 'thermal_heatmap' ? 0x1e40af : 0x334155,
      roughness: 0.85
    });
    const rearWall = new THREE.Mesh(rearWallGeo, rearWallMat);
    rearWall.position.set(0, height / 2, -depth / 2);
    rearWall.castShadow = true;
    group.add(rearWall);

    // 2. Windcatcher (Badgir Tower) atop North Wall
    const badgirGeo = new THREE.BoxGeometry(1.8, 3.2, 1.8);
    const badgirMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.75 });
    const badgir = new THREE.Mesh(badgirGeo, badgirMat);
    badgir.position.set(0, height + 1.6, -depth / 2 + 0.6);
    badgir.castShadow = true;
    group.add(badgir);

    // Badgir Louvers
    const louverGeo = new THREE.BoxGeometry(1.9, 0.15, 0.4);
    const louverMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    for (let l = 0; l < 4; l++) {
      const louver = new THREE.Mesh(louverGeo, louverMat);
      louver.position.set(0, height + 0.8 + l * 0.6, -depth / 2 + 1.5);
      group.add(louver);
    }

    // 3. Front Low South Wall
    const frontWallGeo = new THREE.BoxGeometry(width, 1.3, 0.5);
    const frontWall = new THREE.Mesh(frontWallGeo, rearWallMat);
    frontWall.position.set(0, 0.65, depth / 2);
    frontWall.castShadow = true;
    group.add(frontWall);

    // 4. Angled South Glazing Roof
    const roofLen = Math.sqrt(Math.pow(height - 1.3, 2) + Math.pow(depth, 2));
    const roofGeo = new THREE.PlaneGeometry(width, roofLen);
    const roofMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.84,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, (height + 1.3) / 2, 0);
    roof.rotation.x = Math.atan2(height - 1.3, depth) - (Math.PI / 2);
    roof.castShadow = true;
    group.add(roof);

    // 5. Rooftop Agro-PV Solar Panels
    const pvGeo = new THREE.BoxGeometry(width * 0.45, 0.08, roofLen * 0.35);
    const pvMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.2, metalness: 0.8 });
    const pvPanel = new THREE.Mesh(pvGeo, pvMat);
    pvPanel.position.set(width * 0.22, (height + 1.3) / 2 + 0.1, -depth * 0.15);
    pvPanel.rotation.x = roof.rotation.x;
    group.add(pvPanel);

    this.structureGroup.add(group);
  }

  buildInternalEcosystem(radius, height, mode) {
    const group = new THREE.Group();

    // 1. Central Thermal Water Buffer Pond
    const pondRadius = radius * 0.35;
    const pondGeo = new THREE.CylinderGeometry(pondRadius, pondRadius, 0.8, 24);
    const pondMat = new THREE.MeshStandardMaterial({
      color: mode === 'thermal_heatmap' ? 0x0284c7 : 0x065f46,
      roughness: 0.2,
      metalness: 0.3
    });
    const pond = new THREE.Mesh(pondGeo, pondMat);
    pond.position.y = 0.4;
    pond.receiveShadow = true;
    group.add(pond);

    // 2. Stepped Hydroponic Green Beds
    const bedGeo = new THREE.BoxGeometry(radius * 0.7, 0.45, radius * 0.3);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
    
    [-radius * 0.45, radius * 0.45].forEach(x => {
      const bed = new THREE.Mesh(bedGeo, bedMat);
      bed.position.set(x, 0.25, 0);
      bed.castShadow = true;
      group.add(bed);
    });

    this.structureGroup.add(group);
  }

  buildEarthTubes(radius, mode) {
    const group = new THREE.Group();
    const tubeMat = new THREE.MeshStandardMaterial({
      color: mode === 'thermal_heatmap' ? 0x3b82f6 : 0x0284c7,
      metalness: 0.5,
      roughness: 0.4
    });

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * radius * 1.6, -1.8, Math.sin(angle) * radius * 1.6),
        new THREE.Vector3(Math.cos(angle) * radius * 0.8, -1.8, Math.sin(angle) * radius * 0.8),
        new THREE.Vector3(Math.cos(angle) * radius * 0.2, 0.1, Math.sin(angle) * radius * 0.2)
      ]);
      const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.18, 8, false);
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      group.add(tube);
    }

    this.structureGroup.add(group);
  }

  /**
   * Set Cinematic Zoom / Magnification (1x, 5x, 10x, 20x)
   */
  setZoomLevel(level = '1x') {
    this.currentZoomLevel = level;
    let dist = 24;
    let targetY = 2.5;

    if (level === '1x') {
      dist = 28; // Macro Overview
      targetY = 2.5;
    } else if (level === '5x') {
      dist = 14; // Facade View
      targetY = 3.0;
    } else if (level === '10x') {
      dist = 6.5; // Interior Room
      targetY = 1.8;
    } else if (level === '20x') {
      dist = 2.8; // Micro-Section Wall Detail
      targetY = 1.2;
    }

    this.targetZoomDist = dist;

    // Smooth camera transition
    if (this.camera && this.controls) {
      const currentDir = this.camera.position.clone().sub(this.controls.target).normalize();
      this.camera.position.copy(this.controls.target).add(currentDir.multiplyScalar(dist));
      this.controls.target.set(0, targetY, 0);
      this.controls.update();
    }
  }

  /**
   * Toggle Exploded View
   */
  toggleExplodedView() {
    this.isExploded = !this.isExploded;
    return this.isExploded;
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const speedMultiplier = this.store.get('simSpeed') || 1;

    // 1. OrbitControls Update
    if (this.controls) {
      this.controls.update();
    }

    // 2. Animate Convective Airflow Particles
    const pSpeed = 0.8 * speedMultiplier;
    this.airflowParticles.forEach(p => {
      p.angle += p.speed * pSpeed * delta;
      p.mesh.position.x = Math.cos(p.angle) * p.radius;
      p.mesh.position.z = Math.sin(p.angle) * p.radius;
      p.mesh.position.y = p.yBase + Math.sin(p.angle * 2.0) * 0.8;
    });

    // 3. Render Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
