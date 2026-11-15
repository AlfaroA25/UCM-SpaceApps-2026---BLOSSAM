(function () {
  const host = document.getElementById('space-background');
  if (!host) return;

  const destinations = {
    overview: { key: 'earth', base: '#176ab0', deep: '#071b3a', accent: '#459958', light: '#85bf70', glow: 'rgba(57, 153, 235, .34)', style: 'terrestrial', scale: 1.08, rotation: 0.065, seed: 11 },
    companion: { key: 'mars', base: '#a44d35', deep: '#48251f', accent: '#d1845c', light: '#efb77d', glow: 'rgba(221, 110, 67, .32)', style: 'cratered', scale: 1.03, rotation: 0.052, seed: 23 },
    health: { key: 'venus', base: '#c99445', deep: '#684023', accent: '#f0d093', light: '#ffe6ad', glow: 'rgba(237, 177, 82, .3)', style: 'clouds', scale: 1.12, rotation: 0.038, seed: 31 },
    insights: { key: 'mercury', base: '#817e7b', deep: '#383b43', accent: '#aaa6a0', light: '#d0c9bd', glow: 'rgba(171, 183, 197, .28)', style: 'cratered', scale: 0.94, rotation: 0.045, seed: 41 },
    environment: { key: 'jupiter', base: '#b67c53', deep: '#5d3c35', accent: '#d8b27f', light: '#f0d2a4', glow: 'rgba(218, 164, 112, .3)', style: 'banded', scale: 1.35, rotation: 0.11, seed: 53 },
    hydration: { key: 'neptune', base: '#225cb0', deep: '#0c214f', accent: '#527de0', light: '#84b8ed', glow: 'rgba(58, 124, 245, .33)', style: 'banded', scale: 1.06, rotation: 0.095, seed: 61 },
    meals: { key: 'saturn', base: '#b79a68', deep: '#554333', accent: '#dac69a', light: '#f1e0b6', glow: 'rgba(208, 175, 115, .3)', style: 'banded', scale: 1.12, rotation: 0.082, seed: 71, ring: '#d3bd8f' },
    medications: { key: 'uranus', base: '#56aeb7', deep: '#174d64', accent: '#83d2d3', light: '#c2efdf', glow: 'rgba(81, 206, 214, .32)', style: 'clouds', scale: 1.0, rotation: 0.075, seed: 83, ring: '#8dd8dc' },
    activity: { key: 'luna', base: '#918f8e', deep: '#333944', accent: '#c4bfba', light: '#e1dcd5', glow: 'rgba(174, 193, 214, .25)', style: 'cratered', scale: 1.02, rotation: 0.035, seed: 97 },
    wellbeing: { key: 'titan', base: '#b66b31', deep: '#503018', accent: '#dd9a53', light: '#f3c277', glow: 'rgba(225, 146, 70, .31)', style: 'clouds', scale: 1.14, rotation: 0.042, seed: 101 },
    sleep: { key: 'europa', base: '#adc9d9', deep: '#496d91', accent: '#e4e6d9', light: '#f4f3e8', glow: 'rgba(132, 192, 230, .32)', style: 'ice', scale: 0.98, rotation: 0.032, seed: 113 },
    alerts: { key: 'io', base: '#d5a92f', deep: '#65411e', accent: '#a54c23', light: '#f3d567', glow: 'rgba(239, 174, 54, .31)', style: 'volcanic', scale: 1.05, rotation: 0.06, seed: 127 },
    missions: { key: 'ganymede', base: '#827a72', deep: '#35363c', accent: '#b4a797', light: '#d3c8b7', glow: 'rgba(168, 160, 155, .27)', style: 'cratered', scale: 1.16, rotation: 0.028, seed: 139 },
    cognitive: { key: 'enceladus', base: '#c0d8e6', deep: '#527797', accent: '#edf2f2', light: '#ffffff', glow: 'rgba(164, 219, 246, .3)', style: 'ice', scale: 0.9, rotation: 0.03, seed: 149 },
    settings: { key: 'pluto', base: '#a17c72', deep: '#423a46', accent: '#d0ada0', light: '#ead9c5', glow: 'rgba(199, 157, 145, .29)', style: 'ice', scale: 0.94, rotation: 0.024, seed: 157 },
    roadmap: { key: 'charon', base: '#817b78', deep: '#35343e', accent: '#b0aaa1', light: '#d9d4c8', glow: 'rgba(178, 169, 167, .27)', style: 'cratered', scale: 0.88, rotation: 0.02, seed: 163 }
  };

  function resolveDestination(view) {
    return destinations[view] || destinations.overview;
  }

  function applyDestinationBackdrop(destination) {
    const hue = destination.seed * 17 % 360;
    host.dataset.destination = destination.key;
    host.style.setProperty('--destination-glow', destination.glow);
    host.style.setProperty('--destination-nebula', `hsla(${hue}, 78%, 58%, .19)`);
    host.style.setProperty('--destination-nebula-accent', `hsla(${(hue + 123) % 360}, 82%, 58%, .15)`);
  }

  function setFallbackDestination(view) {
    applyDestinationBackdrop(resolveDestination(view));
  }

  const three = window.THREE;
  if (!three || !three.WebGLRenderer) {
    console.warn('AstroVital planet backdrops are using their CSS space fallback because Three.js is unavailable.');
    window.AstroVitalSpace = { setDestination: setFallbackDestination };
    setFallbackDestination('overview');
    return;
  }

  let renderer;
  try {
    renderer = new three.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch (error) {
    console.warn('AstroVital planet backdrops are using their CSS space fallback because WebGL could not be initialized.', error);
    window.AstroVitalSpace = { setDestination: setFallbackDestination };
    setFallbackDestination('overview');
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.15));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = 'space-background-canvas';
  host.appendChild(renderer.domElement);

  const scene = new three.Scene();
  const camera = new three.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 160);
  camera.position.z = 10;
  scene.add(new three.AmbientLight(0x9eb5d4, 1.25));
  const sunlight = new three.DirectionalLight(0xfff2d9, 2.2);
  sunlight.position.set(-5, 6, 8);
  scene.add(sunlight);

  const planetGroup = new three.Group();
  scene.add(planetGroup);
  const surfaceCanvas = document.createElement('canvas');
  surfaceCanvas.width = 512;
  surfaceCanvas.height = 256;
  const surfaceContext = surfaceCanvas.getContext('2d');
  const surfaceTexture = new three.CanvasTexture(surfaceCanvas);
  surfaceTexture.encoding = three.sRGBEncoding;
  const planetMaterial = new three.MeshStandardMaterial({
    map: surfaceTexture,
    roughness: 0.93,
    metalness: 0.01,
    transparent: true,
    opacity: 0.82
  });
  const planet = new three.Mesh(new three.SphereGeometry(1.5, 64, 48), planetMaterial);
  planetGroup.add(planet);

  const atmosphereMaterial = new three.MeshBasicMaterial({
    color: 0x7bbde5,
    transparent: true,
    opacity: 0.14,
    side: three.BackSide,
    blending: three.AdditiveBlending,
    depthWrite: false
  });
  const atmosphere = new three.Mesh(new three.SphereGeometry(1.62, 48, 36), atmosphereMaterial);
  planetGroup.add(atmosphere);

  const ringMaterial = new three.MeshBasicMaterial({
    color: 0xd1c19b,
    transparent: true,
    opacity: 0.42,
    side: three.DoubleSide,
    depthWrite: false
  });
  const ring = new three.Mesh(new three.RingGeometry(1.92, 2.72, 72), ringMaterial);
  ring.rotation.x = three.MathUtils.degToRad(71);
  ring.visible = false;
  planetGroup.add(ring);

  const randomFor = (seed) => {
    let value = seed;
    return () => {
      value = (value * 16807) % 2147483647;
      return (value - 1) / 2147483646;
    };
  };

  function drawBands(context, destination, random) {
    const height = surfaceCanvas.height;
    const width = surfaceCanvas.width;
    const bands = 20;
    for (let index = 0; index < bands; index += 1) {
      const y = index * height / bands;
      const thickness = height / bands * (0.64 + random() * 0.4);
      const offset = random() * Math.PI * 2;
      context.beginPath();
      context.moveTo(0, y);
      for (let x = 0; x <= width; x += 16) {
        context.lineTo(x, y + Math.sin(x / width * Math.PI * 4 + offset) * (2 + random() * 4));
      }
      context.lineTo(width, y + thickness);
      context.lineTo(0, y + thickness);
      context.closePath();
      context.globalAlpha = 0.48 + random() * 0.32;
      context.fillStyle = index % 3 === 0 ? destination.light : index % 2 === 0 ? destination.accent : destination.deep;
      context.fill();
    }

    if (destination.style === 'banded') {
      const x = width * (0.52 + random() * 0.16);
      const y = height * (0.36 + random() * 0.28);
      context.globalAlpha = 0.68;
      context.fillStyle = destination.deep;
      context.beginPath();
      context.ellipse(x, y, width * 0.1, height * 0.055, -0.1, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 0.55;
      context.strokeStyle = destination.light;
      context.lineWidth = 3;
      context.beginPath();
      context.ellipse(x, y, width * 0.1, height * 0.055, -0.1, Math.PI * 1.05, Math.PI * 1.9);
      context.stroke();
    }
    context.globalAlpha = 1;
  }

  function drawRockySurface(context, destination, random) {
    const width = surfaceCanvas.width;
    const height = surfaceCanvas.height;
    for (let index = 0; index < 64; index += 1) {
      const x = random() * width;
      const y = random() * height;
      const radius = 2 + random() * (destination.style === 'volcanic' ? 10 : 14);
      const crater = context.createRadialGradient(x - radius * 0.3, y - radius * 0.35, radius * 0.08, x, y, radius);
      crater.addColorStop(0, destination.light);
      crater.addColorStop(0.52, destination.accent);
      crater.addColorStop(1, destination.deep);
      context.globalAlpha = 0.34 + random() * 0.28;
      context.fillStyle = crater;
      context.beginPath();
      context.ellipse(x, y, radius * (1.1 + random() * 0.5), radius * 0.65, random() * 0.7, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
  }

  function drawContinents(context, destination, random) {
    const width = surfaceCanvas.width;
    const height = surfaceCanvas.height;
    for (let land = 0; land < 8; land += 1) {
      const centerX = random() * width;
      const centerY = random() * height;
      const radiusX = 12 + random() * 38;
      const radiusY = 7 + random() * 20;
      context.beginPath();
      for (let point = 0; point <= 12; point += 1) {
        const angle = point / 12 * Math.PI * 2;
        const irregularity = 0.72 + random() * 0.62;
        const x = centerX + Math.cos(angle) * radiusX * irregularity;
        const y = centerY + Math.sin(angle) * radiusY * irregularity;
        if (point === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      context.globalAlpha = 0.66;
      context.fillStyle = land % 3 === 0 ? destination.light : destination.accent;
      context.fill();
    }
    context.globalAlpha = 1;
  }

  function drawIceCracks(context, destination, random) {
    const width = surfaceCanvas.width;
    const height = surfaceCanvas.height;
    context.lineWidth = 1 + random() * 2;
    for (let crack = 0; crack < 22; crack += 1) {
      let x = random() * width;
      let y = random() * height;
      context.beginPath();
      context.moveTo(x, y);
      for (let segment = 0; segment < 7; segment += 1) {
        x += (random() - 0.5) * 55;
        y += (random() - 0.5) * 34;
        context.lineTo(x, y);
      }
      context.globalAlpha = 0.32 + random() * 0.42;
      context.strokeStyle = crack % 3 === 0 ? destination.light : destination.accent;
      context.stroke();
    }
    context.globalAlpha = 1;
  }

  function drawSurface(destination) {
    const context = surfaceContext;
    const random = randomFor(destination.seed);
    const gradient = context.createLinearGradient(0, 0, 0, surfaceCanvas.height);
    gradient.addColorStop(0, destination.deep);
    gradient.addColorStop(0.48, destination.base);
    gradient.addColorStop(1, destination.deep);
    context.clearRect(0, 0, surfaceCanvas.width, surfaceCanvas.height);
    context.fillStyle = gradient;
    context.fillRect(0, 0, surfaceCanvas.width, surfaceCanvas.height);

    if (destination.style === 'banded' || destination.style === 'clouds') drawBands(context, destination, random);
    if (destination.style === 'terrestrial') drawContinents(context, destination, random);
    if (destination.style === 'cratered' || destination.style === 'volcanic') drawRockySurface(context, destination, random);
    if (destination.style === 'ice') drawIceCracks(context, destination, random);

    if (destination.style === 'clouds' || destination.style === 'terrestrial') {
      context.globalAlpha = 0.14;
      context.strokeStyle = destination.light;
      context.lineWidth = 4;
      for (let cloud = 0; cloud < 20; cloud += 1) {
        const y = random() * surfaceCanvas.height;
        context.beginPath();
        context.moveTo(0, y);
        context.bezierCurveTo(120, y - 10, 300, y + 12, surfaceCanvas.width, y - 4);
        context.stroke();
      }
      context.globalAlpha = 1;
    }

    for (let mark = 0; mark < 240; mark += 1) {
      context.globalAlpha = random() * 0.13;
      context.fillStyle = mark % 2 ? destination.light : destination.deep;
      context.fillRect(random() * surfaceCanvas.width, random() * surfaceCanvas.height, 1.5, 1.5);
    }
    context.globalAlpha = 1;
    surfaceTexture.needsUpdate = true;
  }

  const starRandom = randomFor(2026);
  const starCount = 1200;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const starPalette = [0xe8f5ff, 0x9fc8ff, 0x83e7f2, 0xc3a9ff, 0xffd5ec];
  for (let index = 0; index < starCount; index += 1) {
    starPositions[index * 3] = (starRandom() - 0.5) * 44;
    starPositions[index * 3 + 1] = (starRandom() - 0.5) * 30;
    starPositions[index * 3 + 2] = -12 - starRandom() * 48;
    new three.Color(starPalette[Math.floor(starRandom() * starPalette.length)])
      .multiplyScalar(0.62 + starRandom() * 0.38)
      .toArray(starColors, index * 3);
  }
  const starGeometry = new three.BufferGeometry();
  starGeometry.setAttribute('position', new three.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new three.BufferAttribute(starColors, 3));
  const starfield = new three.Points(starGeometry, new three.PointsMaterial({
    vertexColors: true,
    size: 1.5,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: three.AdditiveBlending
  }));
  starfield.frustumCulled = false;
  scene.add(starfield);

  let currentDestination = null;
  let arrivalStart = 0;
  let arrivalActive = false;
  let arrivalScale = 1;
  let arrivalOpacity = 0.82;
  let frameRequest = 0;
  let lastFrameTime = 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function placePlanet() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    const halfHeight = camera.position.z * Math.tan(three.MathUtils.degToRad(camera.fov / 2));
    const halfWidth = halfHeight * camera.aspect;
    const rtl = document.documentElement.dir === 'rtl';
    planetGroup.position.set(halfWidth * (rtl ? -0.52 : 0.52), halfHeight * 0.24, 0);
  }

  function renderScene() {
    renderer.render(scene, camera);
  }

  function applyArrival(progress) {
    const eased = 1 - Math.pow(1 - progress, 3);
    const startScale = arrivalScale * 0.58;
    planetGroup.scale.setScalar(startScale + (arrivalScale - startScale) * eased);
    planetMaterial.opacity = 0.1 + (arrivalOpacity - 0.1) * eased;
    atmosphereMaterial.opacity = 0.015 + 0.13 * eased;
    ringMaterial.opacity = currentDestination && currentDestination.ring ? 0.46 * eased : 0;
  }

  function setDestination(view, animate) {
    const destination = resolveDestination(view);
    if (currentDestination && currentDestination.key === destination.key) return;

    currentDestination = destination;
    applyDestinationBackdrop(destination);
    drawSurface(destination);
    planetMaterial.emissive.set(destination.deep);
    planetMaterial.emissiveIntensity = 0.12;
    atmosphereMaterial.color.set(destination.light);
    ringMaterial.color.set(destination.ring || destination.accent);
    ring.visible = Boolean(destination.ring);
    planetGroup.rotation.set(three.MathUtils.degToRad(8 + destination.seed % 23), 0, 0);
    planet.rotation.y = destination.seed * 0.013;
    arrivalScale = destination.scale;
    arrivalOpacity = 0.82;

    if (animate && !prefersReducedMotion.matches) {
      planetGroup.scale.setScalar(destination.scale * 0.58);
      planetMaterial.opacity = 0.1;
      atmosphereMaterial.opacity = 0.015;
      ringMaterial.opacity = 0;
      arrivalStart = performance.now();
      arrivalActive = true;
    } else {
      planetGroup.scale.setScalar(destination.scale);
      planetMaterial.opacity = arrivalOpacity;
      atmosphereMaterial.opacity = 0.145;
      ringMaterial.opacity = destination.ring ? 0.46 : 0;
      arrivalActive = false;
      renderScene();
    }

    syncAnimation();
  }

  function isVisible() {
    return !document.hidden && !document.body.classList.contains('show-entry');
  }

  function animate(now) {
    frameRequest = 0;
    if (!isVisible() || prefersReducedMotion.matches) return;
    if (now - lastFrameTime < 1000 / 30) {
      frameRequest = window.requestAnimationFrame(animate);
      return;
    }

    const delta = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;
    if (currentDestination) planet.rotation.y += currentDestination.rotation * delta;
    starfield.rotation.y += delta * 0.0018;
    starfield.rotation.x += delta * 0.0007;

    if (arrivalActive) {
      const progress = Math.min(1, (now - arrivalStart) / 820);
      applyArrival(progress);
      if (progress === 1) arrivalActive = false;
    }

    renderScene();
    frameRequest = window.requestAnimationFrame(animate);
  }

  function syncAnimation() {
    if (isVisible() && !prefersReducedMotion.matches) {
      if (!frameRequest) {
        lastFrameTime = performance.now();
        frameRequest = window.requestAnimationFrame(animate);
      }
      return;
    }

    if (frameRequest) window.cancelAnimationFrame(frameRequest);
    frameRequest = 0;
    if (arrivalActive && prefersReducedMotion.matches) {
      applyArrival(1);
      arrivalActive = false;
    }
    renderScene();
  }

  function resize() {
    placePlanet();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.15));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderScene();
  }

  window.AstroVitalSpace = { setDestination };
  const initialView = document.querySelector('.view.active');
  setDestination(initialView ? initialView.id.replace(/^view-/, '') : 'overview', false);
  placePlanet();
  syncAnimation();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', syncAnimation);
  prefersReducedMotion.addEventListener('change', syncAnimation);
  new MutationObserver(syncAnimation).observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
