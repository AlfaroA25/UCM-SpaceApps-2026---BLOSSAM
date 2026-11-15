(function () {
  const layer = document.createElement('div');
  layer.className = 'star-flight';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const three = window.THREE;
  const duration = 760;
  const switchAt = 260;
  let renderer = null;
  let scene = null;
  let camera = null;
  let lineGeometry = null;
  let pointGeometry = null;
  let starDepths = null;
  let starX = null;
  let starY = null;
  let running = false;
  let switched = false;
  let pendingNavigation = null;
  let pendingReveal = null;
  let startedAt = 0;
  let previousFrame = 0;
  let frameRequest = 0;

  function initializeThree() {
    if (!three || !three.WebGLRenderer) {
      console.warn('AstroVital star travel is using its CSS fallback because Three.js is unavailable.');
      return;
    }

    try {
      renderer = new three.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch (error) {
      console.warn('AstroVital star travel is using its CSS fallback because WebGL could not be initialized.', error);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'star-flight-canvas';
    layer.appendChild(renderer.domElement);

    scene = new three.Scene();
    camera = new three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 2200);
    const starCount = window.innerWidth <= 760 ? 270 : 420;
    starDepths = new Float32Array(starCount);
    starX = new Float32Array(starCount);
    starY = new Float32Array(starCount);
    const linePositions = new Float32Array(starCount * 6);
    const lineColors = new Float32Array(starCount * 6);
    const pointPositions = new Float32Array(starCount * 3);

    for (let index = 0; index < starCount; index += 1) {
      starDepths[index] = -20 - Math.random() * 1750;
      starX[index] = Math.random() * 2 - 1;
      starY[index] = Math.random() * 2 - 1;
      const color = new three.Color().setHSL(0.52 + Math.random() * 0.09, 0.62, 0.68 + Math.random() * 0.22);
      color.toArray(lineColors, index * 6);
      color.toArray(lineColors, index * 6 + 3);
    }

    lineGeometry = new three.BufferGeometry();
    lineGeometry.setAttribute('position', new three.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new three.BufferAttribute(lineColors, 3));
    pointGeometry = new three.BufferGeometry();
    pointGeometry.setAttribute('position', new three.BufferAttribute(pointPositions, 3));

    const lines = new three.LineSegments(lineGeometry, new three.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.86,
      blending: three.AdditiveBlending,
      depthWrite: false
    }));
    const points = new three.Points(pointGeometry, new three.PointsMaterial({
      color: 0xd7faff,
      size: 2,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.78,
      blending: three.AdditiveBlending,
      depthWrite: false
    }));
    lines.frustumCulled = false;
    points.frustumCulled = false;
    scene.add(lines, points);
    updateStarPositions(0);
  }

  function updateStarPositions(streakLength) {
    if (!lineGeometry || !pointGeometry) return;
    const linePositions = lineGeometry.attributes.position.array;
    const pointPositions = pointGeometry.attributes.position.array;
    const halfFov = Math.tan(three.MathUtils.degToRad(camera.fov / 2));
    const aspect = camera.aspect;

    for (let index = 0; index < starDepths.length; index += 1) {
      const depth = starDepths[index];
      const halfHeight = -depth * halfFov;
      const x = starX[index] * halfHeight * aspect;
      const y = starY[index] * halfHeight;
      const lineOffset = index * 6;
      const pointOffset = index * 3;
      linePositions[lineOffset] = x;
      linePositions[lineOffset + 1] = y;
      linePositions[lineOffset + 2] = depth;
      linePositions[lineOffset + 3] = x;
      linePositions[lineOffset + 4] = y;
      linePositions[lineOffset + 5] = depth - Math.min(streakLength, -depth * 0.4);
      pointPositions[pointOffset] = x;
      pointPositions[pointOffset + 1] = y;
      pointPositions[pointOffset + 2] = depth;
    }

    lineGeometry.attributes.position.needsUpdate = true;
    pointGeometry.attributes.position.needsUpdate = true;
  }

  function runPendingNavigation() {
    const navigate = pendingNavigation;
    pendingNavigation = null;
    if (navigate) navigate();
  }

  function runPendingReveal() {
    const reveal = pendingReveal;
    pendingReveal = null;
    if (reveal) reveal();
  }

  function finishTransition() {
    if (!running) return;
    if (!switched) {
      switched = true;
      runPendingNavigation();
    }
    running = false;
    window.cancelAnimationFrame(frameRequest);
    layer.classList.remove('is-running');
    runPendingReveal();
  }

  function animate(now) {
    if (!running) return;
    const elapsed = Math.min(now - startedAt, duration);
    const progress = elapsed / duration;
    const delta = Math.min((now - previousFrame) / 1000, 0.05);
    previousFrame = now;

    if (!switched && elapsed >= switchAt) {
      switched = true;
      runPendingNavigation();
    }

    if (renderer && scene && camera) {
      const speed = progress < 0.24
        ? 420 + 3000 * (progress / 0.24)
        : progress < 0.68
          ? 3420
          : 3420 * (1 - (progress - 0.68) / 0.32) + 100;
      for (let index = 0; index < starDepths.length; index += 1) {
        starDepths[index] += speed * delta;
        if (starDepths[index] > -12) {
          starDepths[index] = -1000 - Math.random() * 900;
          starX[index] = Math.random() * 2 - 1;
          starY[index] = Math.random() * 2 - 1;
        }
      }
      updateStarPositions(Math.min(48, speed * 0.022));
      renderer.render(scene, camera);
    }

    if (elapsed >= duration) {
      finishTransition();
      return;
    }
    frameRequest = window.requestAnimationFrame(animate);
  }

  function travel(navigate, reveal) {
    if (typeof navigate !== 'function') return;
    pendingNavigation = navigate;
    pendingReveal = typeof reveal === 'function' ? reveal : null;
    if (prefersReducedMotion.matches || document.hidden) {
      if (running) {
        finishTransition();
      } else {
        runPendingNavigation();
        runPendingReveal();
      }
      return;
    }

    if (running) {
      if (switched) runPendingNavigation();
      return;
    }

    if (!renderer && three && three.WebGLRenderer) initializeThree();
    running = true;
    switched = false;
    startedAt = performance.now();
    previousFrame = startedAt;
    layer.classList.add('is-running');
    frameRequest = window.requestAnimationFrame(animate);
  }

  function resize() {
    if (!renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  if (!three || !three.WebGLRenderer) {
    console.warn('AstroVital star travel is using its CSS fallback because Three.js is unavailable.');
  }
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) finishTransition();
  });
  prefersReducedMotion.addEventListener('change', (event) => {
    if (event.matches) finishTransition();
  });

  window.AstroVitalFlight = {
    travel,
    get isRunning() {
      return running;
    }
  };
})();
