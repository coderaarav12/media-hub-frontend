/**
 * Peeka - Procedural Interactive 3D Companion Bot for MediaHub
 * Inspired by Yrzhe/peeka (procedural 2D/3D SVG avatar geometry)
 * Features:
 * - Procedural 3D-angled SVG chassis with glowing cyan/blue rim & antenna
 * - Spherical gaze tracking (eyes & head tilt follow cursor with spring interpolation)
 * - Micro-saccades & natural eyelid blinking cycles
 * - Morphing eye expressions: Normal, Happy, Heart, Dizzy, Detective, Sleepy, Cinema
 * - Reactive humorous speech bubble system with 30+ context-aware quips
 * - Fully draggable anywhere on screen (with localStorage persistence)
 * - Minimizable into a discreet "Peeking" pill so it NEVER blocks the user
 * - Auto-ducks and dims during video playback into stealth cinema mode
 * - Highly optimized: pauses when tab is hidden, throttles when idle, zero external dependencies
 */

(function () {
  'use strict';

  // --- Configuration & Constants ---
  const STORAGE_KEY_POS = 'peeka_bot_position';
  const STORAGE_KEY_MIN = 'peeka_bot_minimized';

  const QUIPS = {
    poke: [
      "Ow! Mind the finish, that's fresh cyber-chrome! ✨",
      "Beep boop! Tickle threshold exceeded by 400%! 😂",
      "Did you click me to watch a film or just admire my curves? 😎",
      "Warning: Continuous poking may void your warranty! ⚠️",
      "I have no mouth and I must eat popcorn. 🍿",
      "Status update: Circuits 100% operational, popcorn craving 9000%! 🚀",
      "You again! Are we watching Shrek 2 or what? 🧅",
      "Fun fact: 9 out of 10 AIs prefer subtitles on. The 10th is hallucinating. 📺",
      "Wait! Stop scrolling, my optics caught a 10/10 masterpiece! 🤩",
      "I'm not procrastinating, I'm doing cinema research! 🧐",
      "Hey! Keep your hands on the remote, pal! 🎮",
      "Did you know? Popcorn was invented specifically for robots. True story. 🌽",
      "Calibrating quantum giggle sensors... BEEP! 🤖✨",
      "My algorithm predicts an 89% chance you need a snack right now. 🍫"
    ],
    movieClick: [
      "Ooh, incredible choice! Grab the blanket! 🛋️",
      "Peak cinema right here! Let's get into it! 🎬",
      "I give this one 5 bolts out of 5! ⭐⭐⭐⭐⭐",
      "Prepare your snacks, this is gonna be great! 🍿",
      "My optical sensors are ready for pure entertainment! 🤩"
    ],
    tvClick: [
      "Binge watching? Don't worry, your secret is safe with my hard drive! 🤫",
      "10 seasons? Easy, that's only 72 hours without blinking! 👁️",
      "Just ONE more episode, right? We both know that's a lie. 😂",
      "Time to get cozy! Next episode button is ready! 📺"
    ],
    animeClick: [
      "SUGOI! Time to power up our chakra! ⚡🍜",
      "Anime night! My power level is over 9000! 💥",
      "Dattebayo! Subtitles on, volume up! 🍥",
      "The animation on this one is pure art! ✨"
    ],
    liveClick: [
      "Live TV! Real-time humans doing things! Fascinating! 📡",
      "Tuning in via orbital satellite... clear signal! 🛰️",
      "Hope nobody trips on the studio cables today! 🎙️"
    ],
    search: [
      "Scanning the multiverse database for '{q}'... 🔍",
      "Deploying deep-space reconnaissance for '{q}'... 🛰️",
      "Consulting the galactic movie archives... 📜"
    ],
    playerOpen: [
      "Shhh! Lights down, opening credits rolling! 🤫🍿",
      "Cinema mode engaged! Dimming my visor! 🕶️",
      "Don't talk during the movie! Enjoy the show! 🎬✨"
    ],
    playerClose: [
      "Back to the lobby! What's next on our watchlist? 🤖",
      "That was epic! What are we binging next? 🍿"
    ],
    dizzy: [
      "Woah, slow down speed racer! My gyroscope is spinning! 😵💫",
      "Too fast! The room is doing backflips! 🌀"
    ],
    sleepy: [
      "Zzz... just resting my optics... 💤",
      "I was totally awake! Just analyzing the audio track! 😳"
    ],
    tabChange: {
      all: "Home sweet home! So much good stuff today! 🏠",
      movies: "Movie night! Popcorn at the ready! 🍿",
      tv: "TV Series zone! Sleep is officially optional! 📺",
      anime: "Anime sanctuary activated! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
      live: "Live broadcast feeds! Tuning into the airwaves! 📡"
    }
  };

  // --- Peeka State ---
  const state = {
    x: 0,
    y: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startPosX: 0,
    startPosY: 0,
    hasMoved: false,
    isMinimized: false,
    isPlayerDucked: false,
    
    // Gaze & Procedural Tracking
    targetGazeX: 0,
    targetGazeY: 0,
    currentGazeX: 0,
    currentGazeY: 0,
    headTilt: 0,
    
    // Saccades & Idle
    lastMouseMoveTime: Date.now(),
    lastSaccadeTime: Date.now(),
    saccadeOffsetX: 0,
    saccadeOffsetY: 0,
    isIdleSleepy: false,
    
    // Blinking
    blinkProgress: 0, // 0 = open, 1 = closed
    isBlinking: false,
    blinkStartTime: 0,
    nextBlinkTime: Date.now() + 3000,
    
    // Expressions: 'normal', 'happy', 'love', 'dizzy', 'detective', 'sleepy', 'cinema'
    expression: 'normal',
    expressionTimeout: null,
    
    // Rapid cursor wiggles
    mouseHistory: [],
    
    // Speech bubble
    bubbleTimeout: null,
    
    // Animation frame
    animFrameId: null,
    floatTime: 0
  };

  let dom = {};

  // --- SVG Path Definitions for Eye Morphing ---
  const EYE_PATHS = {
    // Left eye shapes (centered around 0,0)
    normal: '', // uses standard ellipse + pupil
    happy: 'M -12,2 Q 0,-9 12,2', // inverted happy crescent
    love: 'M 0,-4 A 4.2,4.2 0 0,0 -8.4,-4 Q -8.4,4 0,9.5 Q 8.4,4 8.4,-4 A 4.2,4.2 0 0,0 0,-4 Z', // heart
    dizzy: 'M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M -4,0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0', // spiral swirl
    sleepy: 'M -12,0 L 12,0', // flat sleepy line
    detective: 'M -12,-12 L 12,-12 L 12,12 L -12,12 Z M -12,0 L 12,0' // scanner reticle
  };

  // --- Initialization ---
  function init() {
    createDOM();
    bindEvents();
    loadPersistedPosition();
    startLoop();

    // Hook into global MediaHub actions if available
    hookIntoMediaHub();

    // Initial greeting after 1.8s
    setTimeout(() => {
      if (!state.isMinimized) {
        say("Hey! I'm Peeka, your streaming buddy! Click me anytime! 🍿", 'happy', 4000);
      }
    }, 1800);
  }

  // --- DOM Creation ---
  function createDOM() {
    // Create widget container
    const container = document.createElement('div');
    container.id = 'peekaWidget';
    container.className = 'peeka-widget';
    container.setAttribute('aria-label', 'Peeka Bot Companion');

    container.innerHTML = `
      <div id="peekaBubble" class="peeka-bubble" style="display:none;">
        <div id="peekaBubbleText" class="peeka-bubble-text"></div>
        <button class="peeka-bubble-close" id="peekaBubbleClose" title="Dismiss">&times;</button>
        <div class="peeka-bubble-tail"></div>
      </div>

      <div id="peekaBodyWrap" class="peeka-body-wrap">
        <div class="peeka-controls">
          <button class="peeka-ctrl-btn" id="peekaMinBtn" title="Minimize to edge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

        <svg id="peekaSvg" class="peeka-svg" viewBox="-120 -120 240 240">
          <defs>
            <linearGradient id="pkChassisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0c172d"/>
              <stop offset="50%" stop-color="#050b16"/>
              <stop offset="100%" stop-color="#020409"/>
            </linearGradient>
            <radialGradient id="pkRimGlow" cx="50%" cy="25%" r="75%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5"/>
              <stop offset="40%" stop-color="#0070f3" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#00183b" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="pkVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#010308"/>
              <stop offset="100%" stop-color="#060e1f"/>
            </linearGradient>
            <radialGradient id="pkEyeGlow" cx="42%" cy="38%" r="62%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="25%" stop-color="#38bdf8"/>
              <stop offset="65%" stop-color="#0070f3"/>
              <stop offset="100%" stop-color="#002b66"/>
            </radialGradient>
            <filter id="pkNeonGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="3.2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <clipPath id="pkVisorClip">
              <rect x="-62" y="-34" width="124" height="68" rx="30" ry="30"/>
            </clipPath>
          </defs>

          <!-- Floor Shadow -->
          <ellipse id="pkShadow" cx="0" cy="100" rx="55" ry="12" fill="rgba(0, 112, 243, 0.25)" filter="blur(6px)"/>

          <!-- Floating Bot Head Group -->
          <g id="pkFloatGroup" transform="translate(0, 0)">
            <!-- Antenna with pulsing Cyan LED -->
            <path d="M 0,-76 Q 0,-88 0,-94" stroke="#0070f3" stroke-width="3" stroke-linecap="round" fill="none"/>
            <circle id="pkAntennaLed" cx="0" cy="-94" r="5" fill="#00f0ff" filter="url(#pkNeonGlow)"/>

            <!-- Lateral Cyber Ears / Audio Fins -->
            <rect x="-78" y="-18" width="8" height="36" rx="4" fill="#0070f3" opacity="0.85"/>
            <rect x="70" y="-18" width="8" height="36" rx="4" fill="#0070f3" opacity="0.85"/>
            <circle cx="-74" cy="0" r="2.8" fill="#00f0ff" filter="url(#pkNeonGlow)"/>
            <circle cx="74" cy="0" r="2.8" fill="#00f0ff" filter="url(#pkNeonGlow)"/>

            <!-- 3D Pill Body Chassis -->
            <path id="pkChassis" d="M -64,-45 C -64,-82 64,-82 64,-45 L 64,45 C 64,82 -64,82 -64,45 Z" fill="url(#pkChassisGrad)" stroke="rgba(0,160,255,0.4)" stroke-width="2"/>
            <path id="pkRim" d="M -64,-45 C -64,-82 64,-82 64,-45 L 64,45 C 64,82 -64,82 -64,45 Z" fill="url(#pkRimGlow)"/>

            <!-- Visor Screen -->
            <rect x="-56" y="-30" width="112" height="60" rx="28" fill="url(#pkVisorGrad)" stroke="rgba(0,180,255,0.3)" stroke-width="1.5"/>

            <!-- Eyes Layer (Clipped inside Visor) -->
            <g id="pkEyesLayer" clip-path="url(#pkVisorClip)">
              <!-- Left Eye -->
              <g id="pkLeftEyeGroup" transform="translate(-24, 0)">
                <ellipse id="pkLeftEye" cx="0" cy="0" rx="15" ry="17" fill="url(#pkEyeGlow)" filter="url(#pkNeonGlow)"/>
                <circle id="pkLeftPupil" cx="0" cy="0" r="6" fill="#001530"/>
                <circle id="pkLeftSparkle" cx="-3.5" cy="-4.5" r="3" fill="#ffffff"/>
                <path id="pkLeftShape" d="" stroke="#00f0ff" stroke-width="3" stroke-linecap="round" fill="none" style="display:none;"/>
              </g>

              <!-- Right Eye -->
              <g id="pkRightEyeGroup" transform="translate(24, 0)">
                <ellipse id="pkRightEye" cx="0" cy="0" rx="15" ry="17" fill="url(#pkEyeGlow)" filter="url(#pkNeonGlow)"/>
                <circle id="pkRightPupil" cx="0" cy="0" r="6" fill="#001530"/>
                <circle id="pkRightSparkle" cx="-3.5" cy="-4.5" r="3" fill="#ffffff"/>
                <path id="pkRightShape" d="" stroke="#00f0ff" stroke-width="3" stroke-linecap="round" fill="none" style="display:none;"/>
              </g>
            </g>

            <!-- 3D Cinema Glasses (pops on in cinema mode) -->
            <g id="pkCinemaGlasses" style="display:none;">
              <rect x="-54" y="-18" width="46" height="34" rx="8" fill="rgba(255, 30, 80, 0.45)" stroke="#fff" stroke-width="2"/>
              <rect x="8" y="-18" width="46" height="34" rx="8" fill="rgba(0, 229, 255, 0.45)" stroke="#fff" stroke-width="2"/>
              <line x1="-8" y1="-2" x2="8" y2="-2" stroke="#fff" stroke-width="2.5"/>
            </g>

            <!-- Popcorn Tub (accessory) -->
            <g id="pkPopcornAcc" transform="translate(36, 32) scale(0.65)" style="display:none;">
              <polygon points="0,0 24,0 20,28 4,28" fill="#e74c3c" stroke="#fff" stroke-width="1.5"/>
              <polygon points="5,0 9,0 8,28 4,28" fill="#fff"/>
              <polygon points="15,0 19,0 18,28 14,28" fill="#fff"/>
              <!-- Popcorn kernels -->
              <circle cx="6" cy="-4" r="4.5" fill="#f1c40f"/>
              <circle cx="12" cy="-6" r="5" fill="#f39c12"/>
              <circle cx="18" cy="-4" r="4.5" fill="#f1c40f"/>
            </g>

            <!-- Blushing Cheeks -->
            <ellipse id="pkCheekL" cx="-44" cy="20" rx="7" ry="3.5" fill="#00f0ff" opacity="0.2"/>
            <ellipse id="pkCheekR" cx="44" cy="20" rx="7" ry="3.5" fill="#00f0ff" opacity="0.2"/>

            <!-- Mouth -->
            <path id="pkMouth" d="M -8,25 Q 0,28 8,25" stroke="#00d2ff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
          </g>
        </svg>
      </div>

      <!-- Minimized Edge Badge -->
      <div id="peekaMinBadge" class="peeka-min-badge" style="display:none;">
        <span class="peeka-min-eyes">◉ ◉</span>
        <span class="peeka-min-label">Peeka</span>
      </div>
    `;

    document.body.appendChild(container);

    // Cache DOM nodes
    dom.container = container;
    dom.bubble = document.getElementById('peekaBubble');
    dom.bubbleText = document.getElementById('peekaBubbleText');
    dom.bubbleClose = document.getElementById('peekaBubbleClose');
    dom.bodyWrap = document.getElementById('peekaBodyWrap');
    dom.minBtn = document.getElementById('peekaMinBtn');
    dom.minBadge = document.getElementById('peekaMinBadge');
    dom.floatGroup = document.getElementById('pkFloatGroup');
    dom.shadow = document.getElementById('pkShadow');
    dom.leftEye = document.getElementById('pkLeftEye');
    dom.rightEye = document.getElementById('pkRightEye');
    dom.leftPupil = document.getElementById('pkLeftPupil');
    dom.rightPupil = document.getElementById('pkRightPupil');
    dom.leftSparkle = document.getElementById('pkLeftSparkle');
    dom.rightSparkle = document.getElementById('pkRightSparkle');
    dom.leftShape = document.getElementById('pkLeftShape');
    dom.rightShape = document.getElementById('pkRightShape');
    dom.leftEyeGroup = document.getElementById('pkLeftEyeGroup');
    dom.rightEyeGroup = document.getElementById('pkRightEyeGroup');
    dom.mouth = document.getElementById('pkMouth');
    dom.cheekL = document.getElementById('pkCheekL');
    dom.cheekR = document.getElementById('pkCheekR');
    dom.cinemaGlasses = document.getElementById('pkCinemaGlasses');
    dom.popcornAcc = document.getElementById('pkPopcornAcc');
  }

  // --- Persistence & Layout Positioning ---
  function loadPersistedPosition() {
    const isMin = localStorage.getItem(STORAGE_KEY_MIN) === 'true';
    if (isMin) {
      setMinimized(true, false);
    }

    const savedPos = localStorage.getItem(STORAGE_KEY_POS);
    if (savedPos) {
      try {
        const { x, y } = JSON.parse(savedPos);
        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 100;
        state.x = Math.max(10, Math.min(maxX, x));
        state.y = Math.max(10, Math.min(maxY, y));
        dom.container.style.left = state.x + 'px';
        dom.container.style.top = state.y + 'px';
        dom.container.style.right = 'auto';
        dom.container.style.bottom = 'auto';
        return;
      } catch (e) {}
    }

    // Default positioning in bottom-right
    state.x = window.innerWidth - 120;
    state.y = window.innerHeight - 120;
  }

  function savePosition() {
    const rect = dom.container.getBoundingClientRect();
    localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({ x: rect.left, y: rect.top }));
  }

  // --- Drag and Drop Logic ---
  function bindEvents() {
    // Pointer down on body wrapper
    dom.bodyWrap.addEventListener('pointerdown', e => {
      if (e.target.closest('.peeka-ctrl-btn')) return;
      state.isDragging = true;
      state.hasMoved = false;
      state.dragStartX = e.clientX;
      state.dragStartY = e.clientY;
      const rect = dom.container.getBoundingClientRect();
      state.startPosX = rect.left;
      state.startPosY = rect.top;
      dom.bodyWrap.setPointerCapture(e.pointerId);
      dom.bodyWrap.style.cursor = 'grabbing';
      e.stopPropagation();
    });

    dom.bodyWrap.addEventListener('pointermove', e => {
      if (!state.isDragging) return;
      const dx = e.clientX - state.dragStartX;
      const dy = e.clientY - state.dragStartY;
      if (Math.hypot(dx, dy) > 4) {
        state.hasMoved = true;
      }

      let newX = state.startPosX + dx;
      let newY = state.startPosY + dy;

      // Clamping to screen boundaries
      const maxW = window.innerWidth - dom.bodyWrap.offsetWidth - 10;
      const maxH = window.innerHeight - dom.bodyWrap.offsetHeight - 10;
      newX = Math.max(10, Math.min(maxW, newX));
      newY = Math.max(10, Math.min(maxH, newY));

      state.x = newX;
      state.y = newY;
      dom.container.style.left = newX + 'px';
      dom.container.style.top = newY + 'px';
      dom.container.style.right = 'auto';
      dom.container.style.bottom = 'auto';
    });

    const finishDrag = e => {
      if (!state.isDragging) return;
      state.isDragging = false;
      dom.bodyWrap.style.cursor = 'grab';
      try { dom.bodyWrap.releasePointerCapture(e.pointerId); } catch(err) {}

      if (state.hasMoved) {
        savePosition();
      } else {
        // Was a tap/click, not a drag!
        onPoke();
      }
    };

    dom.bodyWrap.addEventListener('pointerup', finishDrag);
    dom.bodyWrap.addEventListener('pointercancel', finishDrag);

    // Minimize buttons
    dom.minBtn.addEventListener('click', e => {
      e.stopPropagation();
      setMinimized(true, true);
    });

    dom.minBadge.addEventListener('click', e => {
      e.stopPropagation();
      setMinimized(false, true);
    });

    // Close bubble button
    dom.bubbleClose.addEventListener('click', e => {
      e.stopPropagation();
      dismissBubble();
    });

    // Global cursor tracking & rapid wiggles detection
    window.addEventListener('pointermove', e => {
      state.lastMouseMoveTime = Date.now();
      if (state.isIdleSleepy) {
        wakeUp();
      }

      // Compute gaze angle relative to bot center
      const rect = dom.container.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - botCenterX) / Math.max(200, window.innerWidth / 2);
      const deltaY = (e.clientY - botCenterY) / Math.max(200, window.innerHeight / 2);

      state.targetGazeX = Math.max(-1, Math.min(1, deltaX));
      state.targetGazeY = Math.max(-1, Math.min(1, deltaY));

      // Detect frantic mouse wiggles
      detectFranticWiggle(e.clientX, e.clientY);
    }, { passive: true });

    // Window resize bounds safeguard
    window.addEventListener('resize', () => {
      const rect = dom.container.getBoundingClientRect();
      const maxW = window.innerWidth - rect.width - 10;
      const maxH = window.innerHeight - rect.height - 10;
      if (rect.left > maxW || rect.top > maxH) {
        state.x = Math.max(10, Math.min(maxW, rect.left));
        state.y = Math.max(10, Math.min(maxH, rect.top));
        dom.container.style.left = state.x + 'px';
        dom.container.style.top = state.y + 'px';
        savePosition();
      }
    });

    // Document visibility optimization
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (state.animFrameId) {
          cancelAnimationFrame(state.animFrameId);
          state.animFrameId = null;
        }
      } else {
        if (!state.animFrameId) {
          startLoop();
        }
      }
    });
  }

  // --- Minimize / Peek Mode ---
  function setMinimized(min, userTriggered = false) {
    state.isMinimized = min;
    localStorage.setItem(STORAGE_KEY_MIN, min ? 'true' : 'false');

    if (min) {
      dom.bodyWrap.style.display = 'none';
      dom.bubble.style.display = 'none';
      dom.minBadge.style.display = 'flex';
      if (userTriggered) {
        dom.minBadge.classList.add('peeka-bounce');
        setTimeout(() => dom.minBadge.classList.remove('peeka-bounce'), 400);
      }
    } else {
      dom.minBadge.style.display = 'none';
      dom.bodyWrap.style.display = 'block';
      dom.bodyWrap.style.transform = 'scale(0.8)';
      setTimeout(() => { dom.bodyWrap.style.transform = 'scale(1)'; }, 20);
      if (userTriggered) {
        say("I'm back! Did you miss me? 😎", 'happy', 3000);
      }
    }
  }

  // --- Frantic Mouse Wiggle Detector (Fun Easter Egg) ---
  function detectFranticWiggle(x, y) {
    const now = Date.now();
    state.mouseHistory.push({ x, y, t: now });
    // Keep last 400ms
    state.mouseHistory = state.mouseHistory.filter(pt => now - pt.t < 400);

    if (state.mouseHistory.length > 12) {
      let totalDist = 0;
      for (let i = 1; i < state.mouseHistory.length; i++) {
        totalDist += Math.hypot(
          state.mouseHistory[i].x - state.mouseHistory[i - 1].x,
          state.mouseHistory[i].y - state.mouseHistory[i - 1].y
        );
      }
      if (totalDist > 1400 && state.expression !== 'dizzy') {
        setExpression('dizzy', 3500);
        say(randomChoice(QUIPS.dizzy), 'dizzy', 3500);
        state.mouseHistory = [];
      }
    }
  }

  // --- Speech Bubble Logic ---
  function say(text, mood = 'normal', duration = 4000) {
    if (state.isMinimized) return;
    clearTimeout(state.bubbleTimeout);

    dom.bubbleText.textContent = text;
    dom.bubble.style.display = 'block';

    if (mood && mood !== 'normal') {
      setExpression(mood, duration);
    }

    state.bubbleTimeout = setTimeout(() => {
      dismissBubble();
    }, duration);
  }

  function dismissBubble() {
    clearTimeout(state.bubbleTimeout);
    dom.bubble.style.display = 'none';
  }

  // --- Expressions & Accessories ---
  function setExpression(expr, duration = 3000) {
    clearTimeout(state.expressionTimeout);
    state.expression = expr;

    // Reset eye paths / visibility
    const isSpecial = expr !== 'normal';
    const isCinema = expr === 'cinema';

    dom.cinemaGlasses.style.display = isCinema ? 'block' : 'none';
    dom.popcornAcc.style.display = (isCinema || expr === 'happy') ? 'block' : 'none';

    if (expr === 'happy' || expr === 'love' || expr === 'dizzy' || expr === 'sleepy' || expr === 'detective') {
      const pathD = EYE_PATHS[expr] || '';
      dom.leftShape.setAttribute('d', pathD);
      dom.rightShape.setAttribute('d', pathD);
      dom.leftShape.style.display = 'block';
      dom.rightShape.style.display = 'block';

      // Hide default pupils/sparkles
      dom.leftPupil.style.display = 'none';
      dom.rightPupil.style.display = 'none';
      dom.leftSparkle.style.display = 'none';
      dom.rightSparkle.style.display = 'none';

      if (expr === 'love') {
        dom.leftShape.setAttribute('fill', '#ff4d88');
        dom.rightShape.setAttribute('fill', '#ff4d88');
        dom.leftShape.setAttribute('stroke', 'none');
        dom.rightShape.setAttribute('stroke', 'none');
      } else {
        dom.leftShape.setAttribute('fill', 'none');
        dom.rightShape.setAttribute('fill', 'none');
        dom.leftShape.setAttribute('stroke', '#00f0ff');
        dom.rightShape.setAttribute('stroke', '#00f0ff');
      }
    } else {
      dom.leftShape.style.display = 'none';
      dom.rightShape.style.display = 'none';
      dom.leftPupil.style.display = '';
      dom.rightPupil.style.display = '';
      dom.leftSparkle.style.display = '';
      dom.rightSparkle.style.display = '';
    }

    // Cheeks glow brighter when happy or in love
    if (expr === 'happy' || expr === 'love') {
      dom.cheekL.setAttribute('opacity', '0.6');
      dom.cheekR.setAttribute('opacity', '0.6');
      dom.mouth.setAttribute('d', 'M -10,24 Q 0,33 10,24');
    } else {
      dom.cheekL.setAttribute('opacity', '0.2');
      dom.cheekR.setAttribute('opacity', '0.2');
      dom.mouth.setAttribute('d', 'M -8,25 Q 0,28 8,25');
    }

    if (duration > 0) {
      state.expressionTimeout = setTimeout(() => {
        resetExpression();
      }, duration);
    }
  }

  function resetExpression() {
    state.expression = 'normal';
    dom.leftShape.style.display = 'none';
    dom.rightShape.style.display = 'none';
    dom.leftPupil.style.display = '';
    dom.rightPupil.style.display = '';
    dom.leftSparkle.style.display = '';
    dom.rightSparkle.style.display = '';
    dom.cinemaGlasses.style.display = 'none';
    dom.popcornAcc.style.display = 'none';
    dom.cheekL.setAttribute('opacity', '0.2');
    dom.cheekR.setAttribute('opacity', '0.2');
    dom.mouth.setAttribute('d', 'M -8,25 Q 0,28 8,25');
  }

  // --- Poke Reaction ---
  function onPoke() {
    // Cute squish bounce animation
    dom.bodyWrap.style.transform = 'scale(1.22, 0.78)';
    setTimeout(() => {
      dom.bodyWrap.style.transform = 'scale(0.88, 1.12)';
      setTimeout(() => {
        dom.bodyWrap.style.transform = 'scale(1, 1)';
      }, 140);
    }, 120);

    const moods = ['happy', 'love', 'happy', 'normal'];
    const mood = randomChoice(moods);
    say(randomChoice(QUIPS.poke), mood, 3500);
  }

  // --- Idle Sleeping & Waking Up ---
  function wakeUp() {
    state.isIdleSleepy = false;
    resetExpression();
    dom.bodyWrap.style.transform = 'scale(1.15)';
    setTimeout(() => { dom.bodyWrap.style.transform = 'scale(1)'; }, 160);
    say(randomChoice(QUIPS.sleepy.slice(1)), 'happy', 2500);
  }

  // --- Main Animation Loop (High Performance 60fps) ---
  function startLoop() {
    const loop = (timestamp) => {
      state.animFrameId = requestAnimationFrame(loop);
      update(timestamp);
    };
    state.animFrameId = requestAnimationFrame(loop);
  }

  function update(timestamp) {
    state.floatTime += 0.04;
    const now = Date.now();

    // 1. Idle Sleep Detector (after 18s of no mouse movement)
    if (!state.isIdleSleepy && !state.isDragging && now - state.lastMouseMoveTime > 18000) {
      state.isIdleSleepy = true;
      setExpression('sleepy', 0);
      say(QUIPS.sleepy[0], 'sleepy', 3500);
    }

    // 2. Micro-Saccades (inspired by Yrzhe/peeka natural eye movements)
    if (now - state.lastSaccadeTime > (Math.random() * 2500 + 1500) && !state.isIdleSleepy) {
      state.lastSaccadeTime = now;
      state.saccadeOffsetX = (Math.random() - 0.5) * 0.18;
      state.saccadeOffsetY = (Math.random() - 0.5) * 0.12;
    }

    // 3. Eyelid Blinking Cycle
    if (now > state.nextBlinkTime && !state.isBlinking && state.expression !== 'dizzy' && !state.isIdleSleepy) {
      state.isBlinking = true;
      state.blinkStartTime = now;
      state.nextBlinkTime = now + (Math.random() * 3800 + 2600);
    }

    if (state.isBlinking) {
      const elapsed = now - state.blinkStartTime;
      const blinkDuration = 180;
      if (elapsed < blinkDuration) {
        // Curve from 0 -> 1 -> 0
        const progress = elapsed / blinkDuration;
        state.blinkProgress = Math.sin(progress * Math.PI);
      } else {
        state.isBlinking = false;
        state.blinkProgress = 0;
      }
    }

    // 4. Spring Lerp Gaze Tracking
    const lerpSpeed = 0.1;
    const targetX = state.isIdleSleepy ? 0 : (state.targetGazeX + state.saccadeOffsetX);
    const targetY = state.isIdleSleepy ? 0.35 : (state.targetGazeY + state.saccadeOffsetY);

    state.currentGazeX += (targetX - state.currentGazeX) * lerpSpeed;
    state.currentGazeY += (targetY - state.currentGazeY) * lerpSpeed;

    // 5. Floating Hover Physics
    const floatY = Math.sin(state.floatTime) * 4.5;
    const headTilt = state.currentGazeX * 12;

    dom.floatGroup.setAttribute('transform', `translate(0, ${floatY}) rotate(${headTilt})`);
    
    // Shadow scales inverse to float height
    const shadowScale = 1 - (floatY / 30);
    dom.shadow.setAttribute('transform', `scale(${shadowScale})`);

    // 6. Eye Position & Shape Rendering
    if (state.expression === 'normal' || state.expression === 'cinema') {
      const eyeTravelX = state.currentGazeX * 16;
      const eyeTravelY = state.currentGazeY * 11;

      dom.leftEyeGroup.setAttribute('transform', `translate(${-24 + eyeTravelX}, ${eyeTravelY})`);
      dom.rightEyeGroup.setAttribute('transform', `translate(${24 + eyeTravelX}, ${eyeTravelY})`);

      // Eye height compressed by blink progress
      const baseRadiusY = 17;
      const currentRadiusY = Math.max(1.2, baseRadiusY * (1 - state.blinkProgress * 0.94));
      dom.leftEye.setAttribute('ry', currentRadiusY);
      dom.rightEye.setAttribute('ry', currentRadiusY);

      // Pupils track within eyes
      const pupilX = state.currentGazeX * 4;
      const pupilY = state.currentGazeY * 3.5;
      dom.leftPupil.setAttribute('cx', pupilX);
      dom.leftPupil.setAttribute('cy', pupilY);
      dom.rightPupil.setAttribute('cx', pupilX);
      dom.rightPupil.setAttribute('cy', pupilY);

      dom.leftSparkle.setAttribute('cx', pupilX - 3.5);
      dom.leftSparkle.setAttribute('cy', pupilY - 4.5);
      dom.rightSparkle.setAttribute('cx', pupilX - 3.5);
      dom.rightSparkle.setAttribute('cy', pupilY - 4.5);
    }
  }

  // --- Helper Functions ---
  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // --- Hook Into MediaHub App Events ---
  function hookIntoMediaHub() {
    // 1. Detect Player Open / Close via DOM MutationObserver
    const playerOverlay = document.getElementById('playerOverlay');
    if (playerOverlay) {
      const observer = new MutationObserver(() => {
        const isActive = playerOverlay.classList.contains('active');
        if (isActive && !state.isPlayerDucked) {
          state.isPlayerDucked = true;
          dom.container.classList.add('player-ducked');
          setExpression('cinema', 0);
          say(randomChoice(QUIPS.playerOpen), 'cinema', 3000);
        } else if (!isActive && state.isPlayerDucked) {
          state.isPlayerDucked = false;
          dom.container.classList.remove('player-ducked');
          resetExpression();
          say(randomChoice(QUIPS.playerClose), 'happy', 2500);
        }
      });
      observer.observe(playerOverlay, { attributes: true, attributeFilter: ['class'] });
    }

    // 2. Hook onto Movie/TV/Anime card clicks
    document.addEventListener('click', e => {
      const card = e.target.closest('.card, .bento-card, .live-channel-card, .episode-card');
      if (!card) return;

      const titleEl = card.querySelector('h3, h4, .ch-name');
      const title = titleEl ? titleEl.textContent.trim() : 'this title';

      if (card.classList.contains('live-channel-card')) {
        say(`Tuning into ${title}! 📡`, 'normal', 3000);
      } else if (location.hash.includes('anime')) {
        say(randomChoice(QUIPS.animeClick), 'love', 3500);
      } else if (location.hash.includes('tv')) {
        say(randomChoice(QUIPS.tvClick), 'happy', 3500);
      } else {
        say(randomChoice(QUIPS.movieClick), 'love', 3500);
      }
    });

    // 3. Hook onto navigation tab changes
    window.addEventListener('hashchange', () => {
      const hash = location.hash.slice(1) || '/';
      const cat = hash.replace(/^\//, '').split('/')[0];
      if (QUIPS.tabChange[cat]) {
        say(QUIPS.tabChange[cat], 'happy', 3000);
      }
    });

    // 4. Hook onto search input
    const searchInputs = [document.getElementById('searchInput'), document.getElementById('searchInputMobile')];
    searchInputs.forEach(inp => {
      if (!inp) return;
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter' && inp.value.trim()) {
          const q = inp.value.trim();
          const template = randomChoice(QUIPS.search);
          say(template.replace('{q}', q), 'detective', 3500);
        }
      });
    });
  }

  // --- Public API ---
  window.Peeka = {
    init,
    say,
    dismissBubble,
    setExpression,
    resetExpression,
    onPoke,
    toggleMinimize: function (e) {
      if (e) e.stopPropagation();
      setMinimized(!state.isMinimized, true);
    }
  };

  // Auto-boot when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
