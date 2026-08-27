/**
 * BioShelter Studio - 3D Digital Twin Visualizer (Three.js)
 * Real-time parametric 3D shelter modeling, solar celestial arc, thermal heatmaps & airflow streamlines.
 */

/* global THREE */

export class Shelter3DVisualizer {
    constructor(containerElement) {
        this.container = containerElement;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.shelterGroup = null;
        this.sunMesh = null;
        this.sunLight = null;
        this.ambientLight = null;
        this.sunPathLine = null;
        this.particles = null;
        this.particleGeo = null;

        this.currentConfig = {};
        this.currentSimulation = null;
        this.currentHour = 13;
        this.showHeatmap = true;
        this.showAirflow = true;
        this.isCutaway = false;

        this.init();
    }

    init() {
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 500;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f172a); // Deep slate
        this.scene.fog = new THREE.FogExp2(0x0f172a, 0.035);

        // Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.camera.position.set(10, 8, 12);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Controls (OrbitControls from THREE)
        if (THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.maxPolarAngle = Math.PI / 2 + 0.05; // Don't go below ground
            this.controls.minDistance = 3;
            this.controls.maxDistance = 30;
            this.controls.target.set(0, 1.5, 0);
        }

        // Lighting
        this.ambientLight = new THREE.AmbientLight(0xdbeafe, 0.45);
        this.scene.add(this.ambientLight);

        this.sunLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 40;
        this.sunLight.shadow.camera.left = -10;
        this.sunLight.shadow.camera.right = 10;
        this.sunLight.shadow.camera.top = 10;
        this.sunLight.shadow.camera.bottom = -10;
        this.sunLight.shadow.bias = -0.0005;
        this.scene.add(this.sunLight);

        // Ground & Environment
        this.createGround();
        this.createSunPathDome();
        this.createAirflowStreamlines();

        // Shelter container group
        this.shelterGroup = new THREE.Group();
        this.scene.add(this.shelterGroup);

        // Resize handler
        window.addEventListener('resize', () => this.onWindowResize());

        // Animation Loop
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    createGround() {
        // Ground plane
        const groundGeo = new THREE.PlaneGeometry(40, 40);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.85,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        ground.receiveShadow = true;
        this.ground = ground;
        this.scene.add(ground);

        // Circular Grid helper
        const gridHelper = new THREE.GridHelper(30, 30, 0x38bdf8, 0x334155);
        gridHelper.position.y = 0;
        this.gridHelper = gridHelper;
        this.scene.add(gridHelper);

        // Compass orientation markers
        this.createCompassLabel('N', 0, 0, -8, 0x38bdf8);
        this.createCompassLabel('S', 0, 0, 8, 0xf97316);
        this.createCompassLabel('E', 8, 0, 0, 0xe2e8f0);
        this.createCompassLabel('W', -8, 0, 0, 0xe2e8f0);
    }

    createCompassLabel(text, x, y, z, colorHex) {
        // Simple 3D compass pole/indicator
        const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
        const poleMat = new THREE.MeshBasicMaterial({ color: colorHex });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(x, y + 0.3, z);
        this.scene.add(pole);

        const tipGeo = new THREE.ConeGeometry(0.2, 0.4, 8);
        const tip = new THREE.Mesh(tipGeo, poleMat);
        tip.position.set(x, y + 0.7, z);
        this.scene.add(tip);
    }

    createSunPathDome() {
        // Celestial Sun Arc
        const points = [];
        const radius = 12;
        for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI; // 0 to 180 deg
            const x = radius * Math.cos(theta);
            const y = Math.max(0, radius * Math.sin(theta) * 0.85);
            const z = radius * Math.sin(theta) * 0.3;
            points.push(new THREE.Vector3(x, y, z));
        }

        const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
        const arcMat = new THREE.LineDashedMaterial({
            color: 0xfbbf24,
            dashSize: 0.4,
            gapSize: 0.2,
            opacity: 0.5,
            transparent: true
        });
        this.sunPathLine = new THREE.Line(arcGeo, arcMat);
        this.sunPathLine.computeLineDistances();
        this.scene.add(this.sunPathLine);

        // Sun Mesh Sphere
        const sunGeo = new THREE.SphereGeometry(0.6, 16, 16);
        const sunMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
        this.scene.add(this.sunMesh);

        // Sun Glow Halo
        const glowGeo = new THREE.SphereGeometry(1.0, 16, 16);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            transparent: true,
            opacity: 0.35,
            wireframe: true
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        this.sunMesh.add(glow);
    }

    createAirflowStreamlines() {
        // Particle system representing dynamic wind streamlines
        const particleCount = 200;
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 8 - 4; // Windward inlet
            positions[i * 3 + 1] = Math.random() * 2.5 + 0.2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;

            velocities.push({
                x: 0.04 + Math.random() * 0.03,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            });
        }

        this.particleGeo = new THREE.BufferGeometry();
        this.particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.particleVelocities = velocities;

        const particleMat = new THREE.PointsMaterial({
            color: 0x38bdf8,
            size: 0.15,
            transparent: true,
            opacity: 0.75,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(this.particleGeo, particleMat);
        this.scene.add(this.particles);
    }

    updateSunPosition(hour, weatherHour) {
        this.currentHour = hour;
        const elev = weatherHour ? weatherHour.sunElevation : 45;
        const azim = weatherHour ? weatherHour.sunAzimuth : 180;
        const isDay = elev > 0;

        const radius = 14;
        const phi = (90 - elev) * (Math.PI / 180);
        const theta = (azim - 90) * (Math.PI / 180);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = Math.max(-2, radius * Math.cos(phi));
        const z = radius * Math.sin(phi) * Math.sin(theta);

        if (this.sunMesh) {
            this.sunMesh.position.set(x, y, z);
            this.sunMesh.visible = isDay;
        }

        if (this.sunLight) {
            this.sunLight.position.set(x, y, z);
            this.sunLight.intensity = isDay ? Math.max(0.2, (elev / 90) * 1.5) : 0.02;
            this.sunLight.color.set(elev < 15 ? 0xf97316 : (elev < 30 ? 0xfef08a : 0xffffff));
        }

        if (this.ambientLight) {
            this.ambientLight.intensity = isDay ? 0.45 : 0.12;
            this.ambientLight.color.set(isDay ? 0xdbeafe : 0x1e1b4b);
        }

        // Sky background tone adjustment
        if (isDay) {
            const dayBlue = new THREE.Color(0x0f172a);
            this.scene.background = dayBlue;
            this.scene.fog.color = dayBlue;
        } else {
            const nightDark = new THREE.Color(0x030712);
            this.scene.background = nightDark;
            this.scene.fog.color = nightDark;
        }
    }

    /**
     * Rebuilds the 3D parametric shelter geometry based on configuration
     */
    buildShelter(config, simulationData = null) {
        this.currentConfig = config;
        this.currentSimulation = simulationData;

        // Clear existing shelter meshes
        while (this.shelterGroup.children.length > 0) {
            const obj = this.shelterGroup.children[0];
            if (obj.geometry) obj.geometry.dispose();
            this.shelterGroup.remove(obj);
        }

        const L = Number(config.length || 6.0); // East-West length (X)
        const W = Number(config.width || 4.0);  // North-South width (Z)
        const H = Number(config.height || 3.0); // Eaves Height (Y)
        const pitchDeg = Number(config.roofPitch || 20);
        const pitchRad = (pitchDeg * Math.PI) / 180;
        const roofRise = (W / 2) * Math.tan(pitchRad);
        const typology = config.typology || 'gable'; // 'gable', 'hip', 'flat', 'shed', 'vault', 'wind_tower', 'trombe'
        const foundation = config.foundationType || 'slab';
        const wwr = Number(config.wwr || 15) / 100;
        const overhang = Number(config.overhangDepth || 0.4);

        // Thermal Color Palette Helper (Heatmap mapper)
        const getHeatmapColor = (tempC) => {
            if (!this.showHeatmap) return new THREE.Color(0xd6d3d1); // Neutral warm stone
            // Mapping from 15°C (Cyan) -> 24°C (Green) -> 32°C (Yellow/Orange) -> 44°C+ (Crimson Red)
            const t = Math.min(45, Math.max(12, tempC));
            if (t <= 20) {
                // 12 to 20: Deep Blue to Azure
                const factor = (t - 12) / 8;
                return new THREE.Color().lerpColors(new THREE.Color(0x0284c7), new THREE.Color(0x38bdf8), factor);
            } else if (t <= 26) {
                // 20 to 26: Azure to Emerald Comfort Green
                const factor = (t - 20) / 6;
                return new THREE.Color().lerpColors(new THREE.Color(0x38bdf8), new THREE.Color(0x10b981), factor);
            } else if (t <= 33) {
                // 26 to 33: Green to Amber Yellow
                const factor = (t - 26) / 7;
                return new THREE.Color().lerpColors(new THREE.Color(0x10b981), new THREE.Color(0xf59e0b), factor);
            } else {
                // 33 to 45: Amber to Deep Red/Crimson
                const factor = (t - 33) / 12;
                return new THREE.Color().lerpColors(new THREE.Color(0xf59e0b), new THREE.Color(0xef4444), factor);
            }
        };

        const currentHourData = (simulationData && simulationData.hourly) ? simulationData.hourly[this.currentHour] : null;
        const tIndoor = currentHourData ? currentHourData.indoorTemp : 26;
        const tAmb = currentHourData ? currentHourData.ambientTemp : 32;

        // Temperatures for facades
        const tWallS = tAmb + 3;
        const tWallN = tAmb - 1;
        const tWallE = tAmb + 1;
        const tWallW = tAmb + 2;
        const tRoof = tAmb + 6;

        // Foundation / Stilts
        if (foundation === 'stilt_elevated') {
            const stiltHeight = 1.0;
            const postGeo = new THREE.CylinderGeometry(0.12, 0.12, stiltHeight, 8);
            const postMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
            const xOffsets = [-L / 2 + 0.3, 0, L / 2 - 0.3];
            const zOffsets = [-W / 2 + 0.3, W / 2 - 0.3];

            xOffsets.forEach(x => {
                zOffsets.forEach(z => {
                    const post = new THREE.Mesh(postGeo, postMat);
                    post.position.set(x, stiltHeight / 2, z);
                    post.castShadow = true;
                    this.shelterGroup.add(post);
                });
            });

            // Elevated Floor Plinth
            const floorGeo = new THREE.BoxGeometry(L + 0.2, 0.15, W + 0.2);
            const floorMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
            const floor = new THREE.Mesh(floorGeo, floorMat);
            floor.position.set(0, stiltHeight, 0);
            floor.receiveShadow = true;
            floor.castShadow = true;
            this.shelterGroup.add(floor);
            this.shelterGroup.position.y = stiltHeight;
        } else {
            // Slab on grade
            const slabGeo = new THREE.BoxGeometry(L + 0.4, 0.2, W + 0.4);
            const slabMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
            const slab = new THREE.Mesh(slabGeo, slabMat);
            slab.position.set(0, 0.1, 0);
            slab.receiveShadow = true;
            this.shelterGroup.add(slab);
            this.shelterGroup.position.y = 0.2;
        }

        // Walls Construction
        const wallThickness = 0.25;

        // Helper to make a wall with window cut-out
        const createWall = (length, height, temp, hasWindow, isSouth = false) => {
            const wallMat = new THREE.MeshStandardMaterial({
                color: getHeatmapColor(temp),
                roughness: 0.8,
                metalness: 0.05,
                side: THREE.DoubleSide
            });

            const wallGroup = new THREE.Group();

            if (!hasWindow) {
                const geom = new THREE.BoxGeometry(length, height, wallThickness);
                const mesh = new THREE.Mesh(geom, wallMat);
                mesh.position.set(0, height / 2, 0);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                wallGroup.add(mesh);
            } else {
                // Window opening
                const winWidth = length * 0.35;
                const winHeight = height * 0.40;
                const sillHeight = height * 0.30;

                // Left segment
                const leftW = (length - winWidth) / 2;
                const leftGeo = new THREE.BoxGeometry(leftW, height, wallThickness);
                const leftMesh = new THREE.Mesh(leftGeo, wallMat);
                leftMesh.position.set(-length / 2 + leftW / 2, height / 2, 0);
                leftMesh.castShadow = true;
                leftMesh.receiveShadow = true;
                wallGroup.add(leftMesh);

                // Right segment
                const rightGeo = new THREE.BoxGeometry(leftW, height, wallThickness);
                const rightMesh = new THREE.Mesh(rightGeo, wallMat);
                rightMesh.position.set(length / 2 - leftW / 2, height / 2, 0);
                rightMesh.castShadow = true;
                rightMesh.receiveShadow = true;
                wallGroup.add(rightMesh);

                // Bottom sill segment
                const bottomGeo = new THREE.BoxGeometry(winWidth, sillHeight, wallThickness);
                const bottomMesh = new THREE.Mesh(bottomGeo, wallMat);
                bottomMesh.position.set(0, sillHeight / 2, 0);
                bottomMesh.castShadow = true;
                bottomMesh.receiveShadow = true;
                wallGroup.add(bottomMesh);

                // Top lintel segment
                const topH = height - (sillHeight + winHeight);
                const topGeo = new THREE.BoxGeometry(winWidth, topH, wallThickness);
                const topMesh = new THREE.Mesh(topGeo, wallMat);
                topMesh.position.set(0, height - topH / 2, 0);
                topMesh.castShadow = true;
                topMesh.receiveShadow = true;
                wallGroup.add(topMesh);

                // Window Glazing
                const glassMat = new THREE.MeshPhysicalMaterial({
                    color: 0x93c5fd,
                    transparent: true,
                    opacity: 0.45,
                    roughness: 0.1,
                    transmission: 0.85,
                    thickness: 0.05
                });
                const glassGeo = new THREE.BoxGeometry(winWidth - 0.05, winHeight - 0.05, 0.03);
                const glassMesh = new THREE.Mesh(glassGeo, glassMat);
                glassMesh.position.set(0, sillHeight + winHeight / 2, 0);
                wallGroup.add(glassMesh);

                // Overhang Shading Louver
                if (overhang > 0.1) {
                    const louverMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
                    const louverGeo = new THREE.BoxGeometry(winWidth + 0.4, 0.06, overhang);
                    const louverMesh = new THREE.Mesh(louverGeo, louverMat);
                    louverMesh.position.set(0, sillHeight + winHeight + 0.1, wallThickness / 2 + overhang / 2);
                    louverMesh.castShadow = true;
                    wallGroup.add(louverMesh);
                }

                // Special Trombe Wall glazed module (if cold climate / Trombe typology)
                if (typology === 'trombe' && isSouth) {
                    const trombeGlassGeo = new THREE.BoxGeometry(length * 0.8, height * 0.85, 0.05);
                    const trombeGlassMesh = new THREE.Mesh(trombeGlassGeo, glassMat);
                    trombeGlassMesh.position.set(0, height / 2, wallThickness / 2 + 0.15);
                    wallGroup.add(trombeGlassMesh);
                }
            }

            return wallGroup;
        };

        // South Wall (+Z)
        const southWall = createWall(L, H, tWallS, wwr > 0.05, true);
        southWall.position.set(0, 0, W / 2);
        this.shelterGroup.add(southWall);

        // North Wall (-Z)
        const northWall = createWall(L, H, tWallN, wwr > 0.08, false);
        northWall.position.set(0, 0, -W / 2);
        this.shelterGroup.add(northWall);

        // East Wall (+X)
        const eastWall = createWall(W, H, tWallE, wwr > 0.12, false);
        eastWall.rotation.y = Math.PI / 2;
        eastWall.position.set(L / 2, 0, 0);
        this.shelterGroup.add(eastWall);

        // West Wall (-X)
        const westWall = createWall(W, H, tWallW, wwr > 0.12, false);
        westWall.rotation.y = Math.PI / 2;
        westWall.position.set(-L / 2, 0, 0);
        this.shelterGroup.add(westWall);

        // Roof Construction (Skip if isCutaway is active)
        if (!this.isCutaway) {
            const roofMat = new THREE.MeshStandardMaterial({
                color: getHeatmapColor(tRoof),
                roughness: 0.85,
                metalness: 0.1,
                side: THREE.DoubleSide
            });

            if (typology === 'gable' || typology === 'stilt_vernacular' || typology === 'modular_transitional') {
                // Gable Roof
                const roofLen = L + overhang * 2;
                const slopeLen = Math.sqrt(Math.pow(W / 2 + overhang, 2) + Math.pow(roofRise, 2));

                // South Pitch
                const southSlopeGeo = new THREE.BoxGeometry(roofLen, 0.10, slopeLen);
                const southSlope = new THREE.Mesh(southSlopeGeo, roofMat);
                southSlope.rotation.x = pitchRad;
                southSlope.position.set(0, H + roofRise / 2, (W / 4) + overhang / 2);
                southSlope.castShadow = true;
                southSlope.receiveShadow = true;
                this.shelterGroup.add(southSlope);

                // North Pitch
                const northSlopeGeo = new THREE.BoxGeometry(roofLen, 0.10, slopeLen);
                const northSlope = new THREE.Mesh(northSlopeGeo, roofMat);
                northSlope.rotation.x = -pitchRad;
                northSlope.position.set(0, H + roofRise / 2, -(W / 4) - overhang / 2);
                northSlope.castShadow = true;
                northSlope.receiveShadow = true;
                this.shelterGroup.add(northSlope);

                // Gable Triangular End Walls
                const createGableTri = (xPos) => {
                    const triShape = new THREE.Shape();
                    triShape.moveTo(-W / 2, 0);
                    triShape.lineTo(W / 2, 0);
                    triShape.lineTo(0, roofRise);
                    triShape.closePath();
                    const triGeo = new THREE.ShapeGeometry(triShape);
                    const triMesh = new THREE.Mesh(triGeo, roofMat);
                    triMesh.rotation.y = Math.PI / 2;
                    triMesh.position.set(xPos, H, 0);
                    triMesh.castShadow = true;
                    return triMesh;
                };

                this.shelterGroup.add(createGableTri(L / 2));
                this.shelterGroup.add(createGableTri(-L / 2));
            } else if (typology === 'vault') {
                // Curved Earthen Vault
                const vaultGeo = new THREE.CylinderGeometry(W / 2, W / 2, L + overhang * 2, 24, 1, false, 0, Math.PI);
                const vaultMesh = new THREE.Mesh(vaultGeo, roofMat);
                vaultMesh.rotation.z = Math.PI / 2;
                vaultMesh.rotation.y = Math.PI / 2;
                vaultMesh.position.set(0, H, 0);
                vaultMesh.castShadow = true;
                vaultMesh.receiveShadow = true;
                this.shelterGroup.add(vaultMesh);
            } else if (typology === 'wind_tower') {
                // Arid Flat Roof with Central Badgir (Wind Tower Scoop)
                const flatRoofGeo = new THREE.BoxGeometry(L + overhang * 2, 0.15, W + overhang * 2);
                const flatRoof = new THREE.Mesh(flatRoofGeo, roofMat);
                flatRoof.position.set(0, H + 0.08, 0);
                flatRoof.castShadow = true;
                this.shelterGroup.add(flatRoof);

                // Wind Tower Tower Structure
                const towerH = 2.2;
                const towerW = 1.2;
                const towerGeo = new THREE.BoxGeometry(towerW, towerH, towerW);
                const towerMat = new THREE.MeshStandardMaterial({ color: getHeatmapColor(tRoof - 2), roughness: 0.9 });
                const tower = new THREE.Mesh(towerGeo, towerMat);
                tower.position.set(0, H + towerH / 2, 0);
                tower.castShadow = true;
                this.shelterGroup.add(tower);

                // Wind Scoop Top Cap
                const capGeo = new THREE.ConeGeometry(towerW * 0.9, 0.6, 4);
                const cap = new THREE.Mesh(capGeo, towerMat);
                cap.position.set(0, H + towerH + 0.3, 0);
                cap.rotation.y = Math.PI / 4;
                this.shelterGroup.add(cap);
            } else {
                // Default Flat / Compact
                const roofGeo = new THREE.BoxGeometry(L + overhang * 2, 0.15, W + overhang * 2);
                const roof = new THREE.Mesh(roofGeo, roofMat);
                roof.position.set(0, H + 0.08, 0);
                roof.castShadow = true;
                this.shelterGroup.add(roof);
            }
        }

        // Interior Floor Bed / Thermal Mass Furniture representation
        const matFloorGeo = new THREE.BoxGeometry(L - 0.5, 0.05, W - 0.5);
        const matFloorMat = new THREE.MeshStandardMaterial({ color: getHeatmapColor(tIndoor), roughness: 0.9 });
        const matFloor = new THREE.Mesh(matFloorGeo, matFloorMat);
        matFloor.position.set(0, 0.03, 0);
        this.shelterGroup.add(matFloor);
    }

    setCutaway(isCutaway) {
        this.isCutaway = isCutaway;
        if (this.currentConfig) {
            this.buildShelter(this.currentConfig, this.currentSimulation);
        }
    }

    setHeatmapVisible(visible) {
        this.showHeatmap = visible;
        if (this.currentConfig) {
            this.buildShelter(this.currentConfig, this.currentSimulation);
        }
    }

    setAirflowVisible(visible) {
        this.showAirflow = visible;
        if (this.particles) {
            this.particles.visible = visible;
        }
    }

    animate() {
        requestAnimationFrame(this.animate);

        // Update particle airflow
        if (this.showAirflow && this.particles && this.particleGeo) {
            const positions = this.particleGeo.attributes.position.array;
            const L = Number(this.currentConfig.length || 6.0);
            const W = Number(this.currentConfig.width || 4.0);

            for (let i = 0; i < this.particleVelocities.length; i++) {
                const vel = this.particleVelocities[i];
                positions[i * 3] += vel.x;
                positions[i * 3 + 1] += vel.y;
                positions[i * 3 + 2] += vel.z;

                // Reset particles when they exit the leeward side
                if (positions[i * 3] > L / 2 + 3) {
                    positions[i * 3] = -L / 2 - 3;
                    positions[i * 3 + 1] = Math.random() * 2.5 + 0.3;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * (W * 0.8);
                }
            }
            this.particleGeo.attributes.position.needsUpdate = true;
        }

        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }

    setTheme(isDark) {
        if (!this.scene) return;
        const bgHex = isDark ? 0x070b14 : 0xf1f5f9;
        this.scene.background = new THREE.Color(bgHex);
        if (this.scene.fog) {
            this.scene.fog.color = new THREE.Color(bgHex);
        }
        if (this.ambientLight) {
            this.ambientLight.color = new THREE.Color(isDark ? 0xdbeafe : 0xffffff);
            this.ambientLight.intensity = isDark ? 0.45 : 0.85;
        }
        if (this.ground && this.ground.material) {
            this.ground.material.color.setHex(isDark ? 0x1e293b : 0xe2e8f0);
        }
        if (this.gridHelper) {
            this.scene.remove(this.gridHelper);
            this.gridHelper = new THREE.GridHelper(30, 30, isDark ? 0x38bdf8 : 0x0284c7, isDark ? 0x334155 : 0xcbd5e1);
            this.gridHelper.position.y = 0;
            this.scene.add(this.gridHelper);
        }
    }

    onWindowResize() {
        if (!this.container) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width === 0 || height === 0) return;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}
