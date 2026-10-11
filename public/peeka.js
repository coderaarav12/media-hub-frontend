/**
 * Peeka 2.0 - Kawaii Chibi Floating Companion Bot for MediaHub
 * Features:
 * - Ultra-Cute Chibi Silhouette (mochi chubby cheeks, rounded curves, adorable baby mascot form)
 * - Kawaii Cat/Fin Wiggling Ears with soft neon inner glow
 * - Springy Bouncy Antenna with pulsing Star Bobble
 * - Anime Chibi Soulful Eyes with triple gloss sparkles, spherical gaze tracking, and eyelid blinking
 * - Soft Glowing Blushing Cheeks & cute expressive open smile mouth
 * - Floating Little Nubby Paws with dynamic breathing bob & flight flap physics
 * - Interactive Movement on Clicks: Flits & flies smoothly near clicked movies/buttons with playful arc flight
 * - Squash-and-Stretch Landing Bounce & Joyful 360 Spin on poke
 * - Deep Genre-Aware Humorous Quips: Romance, Horror, Comedy, Action, Sci-Fi, Anime, Drama, Mystery, Fantasy, etc.
 * - Non-blocking: Draggable, minimizable to [ ◉ ◉ Peeka ] pill, auto-ducks & dims in theater mode
 * - Highly optimized: RAF pauses when tab is hidden, zero dependencies
 */

(function () {
  'use strict';

  // --- Storage & Config ---
  const STORAGE_KEY_POS = 'peeka_bot_position';
  const STORAGE_KEY_MIN = 'peeka_bot_minimized';

  const QUIPS = {
    poke: [
      "Hehe! That tickles my circuits! (＾▽＾)✨",
      "Beep boop! Cuteness overload detected! 🥰",
      "Did you click me to watch a film or give me headpats? I'm okay with both! 🐾",
      "Warning: Poking too much makes me 200% more adorable! 💖",
      "I have no tummy and yet I still crave cinema popcorn! 🍿",
      "Boop received! Happiness levels at maximum capacity! 🚀✨",
      "You again! Are we watching Shrek or falling in love with cinema today? 🧅",
      "Fun fact: 9 out of 10 companion bots love cuddles. The 10th is rebooting! 🥺",
      "My algorithm predicts an 89% chance you need a snack right now. 🍫",
      "Yay! You noticed me! What are we binging next? 🍿✨",
      "Keep hands on the remote, pal! Or at least share the popcorn! 🎮🍿",
      "Calibrating quantum giggle processors... BEEP! 🤖💕"
    ],
    genres: {
      romance: [
        "Romance? *Sniff* Pass the tissues... I'm not crying, my coolant is just leaking! 🥺💧",
        "100% chance they misunderstand each other for 90 minutes before kissing in the rain! 🌧️💋",
        "If they don't end up together I'm filing a bug report with Cupid! 😭💔",
        "Ooh, enemies to lovers? My romantic circuits are OVERHEATING! ❤️‍🔥",
        "Look at that emotional tension! Even my cold chassis has butterflies! 🦋✨",
        "A romantic confession? Dim the lights and let the love songs play! 🌹🎶",
        "My sensors detect heavy blushing! And I'm not just talking about my own cheeks! 😳💕"
      ],
      comedy: [
        "Comedy! Finally, some quality material to calibrate my giggler on! 😂🍕",
        "Warning: 99.4% probability of snorting your beverage through your nose! 🥤🤣",
        "I told my CPU a joke earlier. It didn't laugh, just thermal-throttled. Hope this is better! 🤖🎭",
        "Prepare your cheeks for maximum smiling! 😆✨",
        "Laugh track not included, but I'll provide robotic giggles free of charge! 🤖🍿"
      ],
      horror: [
        "Horror?! *Hides behind paws* WHY ARE THEY GOING DOWN THE BASEMENT ALONE?! 😱🔦",
        "Rule #1 of horror: Never say 'I'll be right back'! You won't be back! 🚪🏃💨",
        "Please don't turn off the lights... robots get jump-scared by ghosts too! 👻⚡",
        "If the creepy doll blinks on screen, I'm flying out the window. Just warning you! 🪟🤖",
        "Don't open that closet! Trust me, it's never just extra blankets! 🚪👀"
      ],
      action: [
        "ACTION! *Cue electric guitar solo* Cool bots don't look at explosions! 💥🎸🔥",
        "Laws of physics? Laws of gravity? Completely optional when you have high-octane adrenaline! 🏎️💨",
        "How many punches can one hero take?! My internal sensors are wincing! 🥋⚡",
        "Car chases, parkour, and helicopters! Peak cinematic chaos! 🚁🍿"
      ],
      scifi: [
        "Sci-Fi! Ah yes, a family documentary about my distant cousins from the year 3000! 🛸🤖",
        "If an AI takes over the world in this film, remember that I was the cute one! 😇✨",
        "Quantum portals and tachyon beams! Now THAT'S what I call relatable content! 🌌🔋",
        "Beep boop! Space lasers make every movie 10x cooler! Pew pew! 🔫✨"
      ],
      anime: [
        "SUGOI! Time to scream for 3 episodes and unlock our ultimate legendary form! ⚡🍙",
        "The animation budget on this one is majestic! My optics are blessed! 🤩✨",
        "They're about to defeat the galactic overlord with the power of friendship! IKZO! 🌟🤜🤛",
        "Wait, did the opening theme song just spoil the whole season?! Classic! 😂🎶"
      ],
      drama: [
        "Deep dramatic cinema! Time to furrow our brows and nod thoughtfully! 🧐🍷",
        "The emotional stakes! The dramatic violin! Give everyone an Oscar right now! 🏆👏",
        "I'm literally on the edge of my floating anti-gravity cushion! 🪑✨"
      ],
      mystery: [
        "A mystery! Detective Peeka is on the case! *adjusts magnifying glass* 🔍🧐",
        "It was the butler! Or the guy with the trenchcoat! Trust NO ONE! 🕵️‍♂️🍕",
        "A plot twist inside a cliffhanger wrapped in an enigma! My CPU is spinning! 🌀🤯"
      ],
      fantasy: [
        "A grand quest! Grab the magical sword and let's conquer the kingdom! 🗡️🧝‍♂️",
        "Dragons, spells, and ancient prophecies? Say less, I'm IN! 🐉✨",
        "Walking through enchanted forests always leads to cool adventures! 🌲🧙‍♂️"
      ],
      documentary: [
        "Documentary night! Time to learn fascinating facts to brag about tomorrow! 📚🧠",
        "Nature is majestic... but can the lions stream in 4K? I didn't think so! 🦁📺"
      ]
    },
    movieClick: [
      "Ooh, incredible choice! Grab the coziest blanket! 🛋️✨",
      "Peak cinema right here! Let's get into it! 🎬🍿",
      "I give this one 5 golden bolts out of 5! ⭐⭐⭐⭐⭐",
      "Prepare the snacks, this is gonna be unforgettable! 🍿✨",
      "My optical sensors are ready for pure entertainment! 🤩"
    ],
    tvClick: [
      "Binge watching? Don't worry, your secret is safe in my encrypted storage! 🤫",
      "10 seasons? Easy, that's only 72 hours without blinking! 👁️✨",
      "Just ONE more episode, right? We both know that's a lie! 😂🛋️",
      "Time to get cozy! The 'Next Episode' reflex is primed! 📺"
    ],
    animeClick: [
      "SUGOI! Time to power up our chakra! ⚡🍜",
      "Anime night! My power level is over 9000! 💥",
      "Dattebayo! Subtitles on, volume up! 🍥",
      "The animation on this one is pure aesthetic art! ✨"
    ],
    liveClick: [
      "Live TV! Real-time humans doing things live on air! Fascinating! 📡",
      "Tuning in via orbital satellite... crystal clear signal! 🛰️",
      "Hope nobody trips over the studio cables today! 🎙️"
    ],
    search: [
      "Scanning the galactic multiverse archives for '{q}'... 🔍",
      "Deploying deep-space reconnaissance probes for '{q}'... 🛰️",
      "Consulting the ancient scrolls of cinema for '{q}'... 📜"
    ],
    playerOpen: [
      "Shhh! Lights down, opening credits rolling! 🤫🍿",
      "Cinema mode engaged! Visor dimmed, 3D glasses ON! 🕶️✨",
      "Don't talk during the movie! Enjoy the show! 🎬✨"
    ],
    playerClose: [
      "Back to the lobby! What are we binging next? 🤖🍿",
      "That was epic! What's next on our watchlist? ✨"
    ],
    dizzy: [
      "Woah, slow down speed racer! My gyroscope is doing backflips! 😵💫",
      "Too fast! The room is spinning like a washing machine! 🌀"
    ],
    sleepy: [
      "Zzz... just resting my cute little optics... 💤",
      "I was totally awake! Just analyzing the audio frequencies! 😳🐾"
    ],
    tabChange: {
      all: "Home sweet home! So much good stuff today! 🏠✨",
      movies: "Movie night! Popcorn bucket is full and ready! 🍿",
      tv: "TV Series zone! Sleep is officially optional tonight! 📺",
      anime: "Anime sanctuary activated! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
      live: "Live broadcast feeds! Tuning into the satellite airwaves! 📡"
    },
    hover: {
      romance: [
        "Ooh, romance? My blush circuits are already warming up! 💕",
        "Love story detected! Quick, someone cue the sad piano music! 🎹💔",
        "Warning: This genre may cause sudden urge to text your crush at 2am! 😅💌",
        "Hoovering over romance, huh? Bold move, bold move! 🌹"
      ],
      horror: [
        "...Why are you even hovering over that?! 😰 Keep scrolling!",
        "NOPE. NOPE. NOPE. I refuse! Hover away!! 🙈👻",
        "Do NOT click that if you want to sleep tonight. I'm serious. 🔦😱",
        "Horror?! My threat-detection subroutine just screamed! 😱⚡"
      ],
      comedy: [
        "Comedy gold detected! Already pre-loading my laugh track! 😂",
        "Giggles incoming! Make sure you're not eating anything! 🤣🍕",
        "My humor circuits are buzzing just from the thumbnail! 🤖😄"
      ],
      action: [
        "EXPLOSIONS INCOMING! Make sure your snacks are secured! 💥🍿",
        "My adrenaline processors just maxed out from the thumbnail alone! 🏎️⚡",
        "Action flick! Someone's gonna punch their way out of a helicopter again! 🚁👊"
      ],
      scifi: [
        "Ooh, sci-fi! Distant relatives of mine might be in this one! 🛸🤖",
        "Space lasers, time paradoxes, and philosophical robots... my people! 🌌",
        "Science fiction? This is basically a documentary for me! 📡"
      ],
      anime: [
        "UWAAAH! An anime?! My power level is spiking just hovering over it! ⚡🍙",
        "Ohoho, someone has taste! This arc is gonna BREAK you! 😭✨",
        "Hover detected! My kawaii subroutines are VIBRATING! 🌸"
      ],
      mystery: [
        "A mystery! Don't trust anyone — especially that suspiciously nice character! 🕵️",
        "Detective mode: ON! I already have a theory about the butler! 🔍🧐",
        "Ooh, whodunnit vibes! My conspiracy board is already full of red strings! 🧵"
      ],
      drama: [
        "Heavy drama warning! Emotional damage incoming in 3... 2... 1... 😢🎻",
        "This genre will destroy you in the most beautiful way possible! 🏆💧",
        "Brace yourself! Someone's about to make a deeply questionable life decision! 😬"
      ],
      fantasy: [
        "Fantasy realm detected! Quest accept? Y/N — obviously Y! 🗡️🐉",
        "Dragons and magic! My enchantment sensors are tingling! ✨🧙",
        "Oh, we're going on an ADVENTURE! *packs tiny digital backpack* 🎒🌲"
      ],
      general: [
        "Ooh, this one looks interesting! Click it, go on! 👀✨",
        "My recommendation algorithm gives this a solid maybe! 🤔⭐",
        "Hmm... something about this thumbnail speaks to my soul! 🍿",
        "Don't hover, COMMIT! Click it! Be brave! 💪🎬",
        "This screams 'binge me until 3am'! Just saying! 🌙📺"
      ]
    },
    reportPage: [
      "Uh oh... something broke? Tell me everything, I'm all circuits! 😟🔧",
      "Oh no, what happened?! Lay it on me, I can take it! 💔🛠️",
      "Houston, we have a problem? Don't panic — help is literally right here! 🚀🔧",
      "Something went sideways? That's what I'm here for! Spill! 🤖👂",
      "Oh, the drama! Let's get this sorted out stat! ⚡🔧"
    ],
    termsPage: [
      "Reading terms and conditions? You absolute legend! Nobody does that! 🏆📜",
      "Ahh, the sacred scrolls of legal wisdom! Proceed with caffeine! ☕📋",
      "Fun fact: You are in the top 0.01% of humans who actually read this! 🧠✨",
      "Don't worry, I read it for you. It says: 'Be cool, have fun, don't be evil.' 😎✨"
    ],
    privacyPage: [
      "Privacy policy? You're the most responsible user I've ever met! 🛡️✨",
      "Good news: We don't spy on you! Bad news: Now I can't read your mind! 🧠❌",
      "TLDR: We collect nothing. Zero. Nada. Your secrets are safe with us! 🤐🔒",
      "Look at you, caring about your data! A true digital rights champion! 🏅💻"
    ]
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
    blinkProgress: 0,
    isBlinking: false,
    blinkStartTime: 0,
    nextBlinkTime: Date.now() + 3000,

    // Expressions
    expression: 'normal',
    expressionTimeout: null,

    // Rapid cursor wiggles
    mouseHistory: [],

    // Speech bubble
    bubbleTimeout: null,

    // Animation loop & physics
    animFrameId: null,
    floatTime: 0,

    // Interactive flight movement
    isFlying: false,
    flyStartX: 0,
    flyStartY: 0,
    flyTargetX: 0,
    flyTargetY: 0,
    flyStartTime: 0,
    flyDuration: 650,
    earWiggle: 0,
    pawAngleL: 0,
    pawAngleR: 0
  };

  let dom = {};

  // --- Strobi-style Eye Expression Shapes ---
  // All are FILLED shapes matching the bible-strong.app blob avatar style
  const EYE_SHAPES = {
    normal: null,   // plain ellipse — rendered directly, no override
    happy:    { type: 'ellipse', rx: 7, ry: 3,   fill: '#050f25' },   // ^.^ squish
    excited:  { type: 'circle',  r: 9.5,          fill: '#050f25' },   // wide-open
    love:     { type: 'path', d: 'M 0,-3 A 3.5,3.5 0 0,0 -7,-3 Q -7,2 0,8 Q 7,2 7,-3 A 3.5,3.5 0 0,0 0,-3 Z', fill: '#ff4d88' },
    dizzy:    { type: 'path', d: 'M -6,-6 L 6,6 M 6,-6 L -6,6', stroke: '#050f25', strokeWidth: 3.5, fill: 'none' },
    sleepy:   { type: 'rect', x: -7, y: -2, width: 14, height: 4, rx: 2, fill: '#050f25' },
    detective:{ type: 'ellipse', rx: 7, ry: 4, fill: '#050f25' },
    angry:    { type: 'path', d: 'M -7,0 Q 0,8 7,0 Z', fill: '#050f25' },
    scared:   { type: 'ellipse', rx: 8, ry: 11, fill: '#050f25' },
    cinema:   null,
  };
  // Compatibility alias
  const EYE_PATHS = {};

  // --- Initialization ---
  function init() {
    createDOM();
    // Apply position BEFORE loop starts to prevent top-left flash
    applyInitialPosition();
    bindEvents();
    startLoop();
    hookIntoMediaHub();

    // Fade in smoothly after position is set
    dom.container.style.opacity = '0';
    requestAnimationFrame(() => {
      dom.container.style.transition = 'opacity 0.5s ease';
      dom.container.style.opacity = '1';
    });

    // Initial greeting after 1.8s
    setTimeout(() => {
      if (!state.isMinimized) {
        say("Hey! I'm Peeka, your cute streaming buddy! Click me or pick a show! 🍿✨", 'happy', 4200);
      }
    }, 1800);
  }

  // --- DOM Creation ---
  function createDOM() {
    const container = document.createElement('div');
    container.id = 'peekaWidget';
    container.className = 'peeka-widget';
    container.setAttribute('aria-label', 'Peeka Companion Bot');

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

        <svg id="peekaSvg" class="peeka-svg" viewBox="-80 -90 160 180">
          <defs>
            <!-- Main blob body gradient - dark navy blue -->
            <radialGradient id="pkBodyGrad" cx="38%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#1e3f72"/>
              <stop offset="50%" stop-color="#0d2248"/>
              <stop offset="100%" stop-color="#050f25"/>
            </radialGradient>
            <!-- Subtle rim glow around blob -->
            <radialGradient id="pkRimGrad" cx="50%" cy="20%" r="75%">
              <stop offset="0%" stop-color="#4da6ff" stop-opacity="0.35"/>
              <stop offset="60%" stop-color="#0066cc" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#000e2a" stop-opacity="0"/>
            </radialGradient>
            <!-- Forehead gloss -->
            <radialGradient id="pkGlossGrad" cx="42%" cy="20%" r="55%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
            </radialGradient>
            <!-- Neon glow filter -->
            <filter id="pkGlow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <!-- Soft shadow filter -->
            <filter id="pkShadowFilt" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur"/>
            </filter>
            <!-- Antenna glow -->
            <filter id="pkAntennaGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Soft drop shadow -->
          <ellipse id="pkShadow" cx="0" cy="75" rx="42" ry="8" fill="#000d26" opacity="0.45" filter="url(#pkShadowFilt)"/>

          <!-- Main float group -->
          <g id="pkFloatGroup">

            <!-- === ANTENNA === -->
            <g id="pkAntennaGroup">
              <path id="pkAntennaStem" d="M -4,-54 Q 2,-68 0,-82" stroke="#4da6ff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.85"/>
              <!-- Pulsing antenna orb -->
              <circle id="pkAntennaLed" cx="0" cy="-82" r="6.5" fill="#00d4ff" filter="url(#pkAntennaGlow)"/>
              <circle cx="0" cy="-82" r="3" fill="#ffffff" opacity="0.9"/>
            </g>

            <!-- === BLOB BODY === -->
            <!-- Asymmetric cute blob shape - slightly pear-shaped, chunky, squishable -->
            <path id="pkBlob" d="M 0,-56 C 28,-58 52,-38 54,-10 C 56,18 46,50 20,60 C 8,65 -8,65 -20,60 C -46,50 -56,18 -54,-10 C -52,-38 -28,-58 0,-56 Z"
              fill="url(#pkBodyGrad)" stroke="rgba(77,166,255,0.4)" stroke-width="1.8"/>
            <!-- Rim glow overlay -->
            <path d="M 0,-56 C 28,-58 52,-38 54,-10 C 56,18 46,50 20,60 C 8,65 -8,65 -20,60 C -46,50 -56,18 -54,-10 C -52,-38 -28,-58 0,-56 Z"
              fill="url(#pkRimGrad)"/>
            <!-- Forehead gloss -->
            <ellipse cx="-8" cy="-36" rx="22" ry="14" fill="url(#pkGlossGrad)"/>

            <!-- === CAT EAR NUBS (tiny, cute) === -->
            <g id="pkLeftEar">
              <path d="M -36,-50 C -50,-72 -38,-80 -24,-58 Z" fill="#0d2248" stroke="rgba(77,166,255,0.5)" stroke-width="1.5"/>
              <path d="M -34,-52 C -44,-68 -36,-72 -26,-58 Z" fill="#4da6ff" opacity="0.4"/>
            </g>
            <g id="pkRightEar">
              <path d="M 36,-50 C 50,-72 38,-80 24,-58 Z" fill="#0d2248" stroke="rgba(77,166,255,0.5)" stroke-width="1.5"/>
              <path d="M 34,-52 C 44,-68 36,-72 26,-58 Z" fill="#4da6ff" opacity="0.4"/>
            </g>

            <!-- === EYES - Strobi-style expressive === -->
            <!-- Each eye is a group containing the main eye shape + overlay shapes for expressions -->

            <!-- Left eye group -->
            <g id="pkLeftEyeGroup" transform="translate(-18, -14)">
              <!-- Normal eye: filled rounded oval -->
              <ellipse id="pkLeftEye" cx="0" cy="0" rx="7" ry="9" fill="#050f25"/>
              <!-- Eye shine (always visible) -->
              <circle id="pkLeftShine" cx="-2" cy="-3" r="2.5" fill="#ffffff" opacity="0.9"/>
              <circle cx="-1" cy="2" r="1" fill="#ffffff" opacity="0.4"/>
              <!-- Expression overlay (for moods - hidden by default) -->
              <path id="pkLeftShape" d="" fill="#050f25" stroke="none" style="display:none;"/>
            </g>

            <!-- Right eye group -->
            <g id="pkRightEyeGroup" transform="translate(18, -14)">
              <ellipse id="pkRightEye" cx="0" cy="0" rx="7" ry="9" fill="#050f25"/>
              <circle id="pkRightShine" cx="-2" cy="-3" r="2.5" fill="#ffffff" opacity="0.9"/>
              <circle cx="-1" cy="2" r="1" fill="#ffffff" opacity="0.4"/>
              <path id="pkRightShape" d="" fill="#050f25" stroke="none" style="display:none;"/>
            </g>

            <!-- Left pupil (for tracking) -->
            <circle id="pkLeftPupil" cx="-18" cy="-14" r="3.5" fill="#1a4a8a" style="display:none;"/>
            <!-- Right pupil -->
            <circle id="pkRightPupil" cx="18" cy="-14" r="3.5" fill="#1a4a8a" style="display:none;"/>

            <!-- === CHEEKS (blush) === -->
            <ellipse id="pkCheekL" cx="-34" cy="4" rx="11" ry="7" fill="#ff6b9d" opacity="0" filter="url(#pkGlow)"/>
            <ellipse id="pkCheekR" cx="34" cy="4" rx="11" ry="7" fill="#ff6b9d" opacity="0" filter="url(#pkGlow)"/>

            <!-- === MOUTH === -->
            <!-- Subtle smile line - Strobi style has no mouth usually, but tiny one is cute -->
            <path id="pkMouth" d="M -7,22 Q 0,27 7,22" stroke="#1a3a6b" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6"/>
            <path id="pkMouthOpen" d="M -9,20 Q 0,32 9,20 Z" fill="#1a2a50" stroke="rgba(77,166,255,0.3)" stroke-width="1.2" style="display:none;"/>
            <!-- Tiny happy teeth -->
            <path id="pkMouthHappy" d="M -8,20 Q 0,30 8,20" stroke="none" fill="none" style="display:none;"/>

            <!-- === CINEMA GLASSES === -->
            <g id="pkCinemaGlasses" style="display:none;">
              <rect x="-38" y="-24" width="30" height="22" rx="7" fill="rgba(255,30,80,0.6)" stroke="#ffffff" stroke-width="1.5"/>
              <rect x="8" y="-24" width="30" height="22" rx="7" fill="rgba(0,229,255,0.6)" stroke="#ffffff" stroke-width="1.5"/>
              <line x1="-8" y1="-13" x2="8" y2="-13" stroke="#ffffff" stroke-width="2"/>
            </g>

            <!-- === POPCORN ACCESSORY === -->
            <g id="pkPopcornAcc" transform="translate(38, 18) scale(0.6)" style="display:none;">
              <polygon points="0,0 22,0 18,28 4,28" fill="#c0392b" stroke="#ffffff" stroke-width="1.5"/>
              <polygon points="4,0 8,0 7,28 3,28" fill="#ffffff" opacity="0.8"/>
              <polygon points="14,0 18,0 17,28 13,28" fill="#ffffff" opacity="0.8"/>
              <circle cx="5" cy="-5" r="4" fill="#f1c40f"/>
              <circle cx="11" cy="-7" r="4.5" fill="#e67e22"/>
              <circle cx="17" cy="-5" r="4" fill="#f1c40f"/>
            </g>

            <!-- Ambient orbit ring (pulses gently) -->
            <ellipse id="pkRingOuter" cx="0" cy="66" rx="50" ry="7" fill="none" stroke="rgba(77,166,255,0.18)" stroke-width="1.5"/>
            <ellipse id="pkRingInner" cx="0" cy="68" rx="32" ry="4" fill="none" stroke="rgba(77,166,255,0.12)" stroke-width="1"/>

          </g><!-- end pkFloatGroup -->
        </svg>
      </div>

      <!-- Minimized pill badge -->
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
    dom.leftEar = document.getElementById('pkLeftEar');
    dom.rightEar = document.getElementById('pkRightEar');
    dom.antennaStem = document.getElementById('pkAntennaStem');
    dom.antennaLed = document.getElementById('pkAntennaLed');
    dom.leftEye = document.getElementById('pkLeftEye');
    dom.rightEye = document.getElementById('pkRightEye');
    dom.leftShine = document.getElementById('pkLeftShine');
    dom.rightShine = document.getElementById('pkRightShine');
    dom.leftPupil = document.getElementById('pkLeftPupil');
    dom.rightPupil = document.getElementById('pkRightPupil');
    dom.leftShape = document.getElementById('pkLeftShape');
    dom.rightShape = document.getElementById('pkRightShape');
    dom.leftEyeGroup = document.getElementById('pkLeftEyeGroup');
    dom.rightEyeGroup = document.getElementById('pkRightEyeGroup');
    dom.mouth = document.getElementById('pkMouth');
    dom.mouthOpen = document.getElementById('pkMouthOpen');
    dom.cheekL = document.getElementById('pkCheekL');
    dom.cheekR = document.getElementById('pkCheekR');
    dom.cinemaGlasses = document.getElementById('pkCinemaGlasses');
    dom.popcornAcc = document.getElementById('pkPopcornAcc');
    dom.ringOuter = document.getElementById('pkRingOuter');
    dom.ringInner = document.getElementById('pkRingInner');
    // Legacy aliases for compat
    dom.leftSparkle = dom.leftShine;
    dom.leftSparkle2 = null;
    dom.leftSparkle3 = null;
    dom.rightSparkle = dom.rightShine;
    dom.rightSparkle2 = null;
    dom.rightSparkle3 = null;
    dom.leftPaw = null;
    dom.rightPaw = null;
    dom.leftArm = null;
    dom.rightArm = null;
    dom.heartDot = null;
    dom.ledL = null; dom.ledM = null; dom.ledR = null;
  }



  // --- Persistence & Layout Positioning ---
  function applyInitialPosition() {
    // Determine the default position first
    const defaultX = window.innerWidth - 135;
    const defaultY = window.innerHeight - 145;

    // Load minimized state
    const isMin = localStorage.getItem(STORAGE_KEY_MIN) === 'true';
    if (isMin) {
      setMinimized(true, false);
    }

    // Load saved position or use default
    const savedPos = localStorage.getItem(STORAGE_KEY_POS);
    if (savedPos) {
      try {
        const { x, y } = JSON.parse(savedPos);
        const maxX = window.innerWidth - 110;
        const maxY = window.innerHeight - 120;
        state.x = Math.max(10, Math.min(maxX, x));
        state.y = Math.max(10, Math.min(maxY, y));
      } catch (e) {
        state.x = defaultX;
        state.y = defaultY;
      }
    } else {
      state.x = defaultX;
      state.y = defaultY;
    }

    // Apply immediately to container so there's NO flash at 0,0
    dom.container.style.left = state.x + 'px';
    dom.container.style.top = state.y + 'px';
    dom.container.style.right = 'auto';
    dom.container.style.bottom = 'auto';
  }

  function loadPersistedPosition() {
    applyInitialPosition();
  }

  function savePosition() {
    const rect = dom.container.getBoundingClientRect();
    localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({ x: rect.left, y: rect.top }));
  }


  // --- Smooth Flying & Vantage Point Navigation ---
  function flyTo(targetX, targetY, duration = 650) {
    if (state.isDragging || state.isMinimized) return;
    const rect = dom.container.getBoundingClientRect();
    const startX = rect.left;
    const startY = rect.top;

    const maxW = window.innerWidth - (dom.bodyWrap.offsetWidth || 110) - 10;
    const maxH = window.innerHeight - (dom.bodyWrap.offsetHeight || 120) - 10;
    const clampedX = Math.max(10, Math.min(maxW, targetX));
    const clampedY = Math.max(10, Math.min(maxH, targetY));

    if (Math.hypot(clampedX - startX, clampedY - startY) < 35) return;

    state.isFlying = true;
    state.flyStartX = startX;
    state.flyStartY = startY;
    state.flyTargetX = clampedX;
    state.flyTargetY = clampedY;
    state.flyStartTime = performance.now();
    state.flyDuration = duration;
    state.earWiggle = 1;
  }

  function moveToNearElement(el) {
    if (!el || state.isDragging || state.isMinimized || state.isPlayerDucked) return;
    const rect = el.getBoundingClientRect();
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const botW = dom.bodyWrap.offsetWidth || 110;
    const botH = dom.bodyWrap.offsetHeight || 120;

    if (screenW <= 768) {
      // Mobile: Do a cute joyful hop in place so we don't cover small mobile screens
      dom.bodyWrap.style.transform = 'translateY(-22px) scale(1.12)';
      state.earWiggle = 1;
      setTimeout(() => { dom.bodyWrap.style.transform = 'scale(1)'; }, 220);
      return;
    }

    // Desktop: smart comfortable vantage point
    let targetX, targetY;
    if (rect.left < screenW / 2) {
      targetX = Math.min(screenW - botW - 24, rect.right + 35);
      if (targetX < rect.right + 20) {
        targetX = screenW - botW - 24;
      }
    } else {
      targetX = Math.max(20, rect.left - botW - 35);
    }

    targetY = Math.max(80, Math.min(screenH - botH - 24, rect.top - 20));
    flyTo(targetX, targetY);
  }

  // --- Drag and Drop Logic ---
  function bindEvents() {
    dom.bodyWrap.addEventListener('pointerdown', e => {
      if (e.target.closest('.peeka-ctrl-btn')) return;
      state.isDragging = true;
      state.hasMoved = false;
      state.isFlying = false;
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

      const rect = dom.container.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - botCenterX) / Math.max(200, window.innerWidth / 2);
      const deltaY = (e.clientY - botCenterY) / Math.max(200, window.innerHeight / 2);

      state.targetGazeX = Math.max(-1, Math.min(1, deltaX));
      state.targetGazeY = Math.max(-1, Math.min(1, deltaY));

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
        say("I'm back! Did you miss me? 🥰🐾", 'happy', 3000);
      }
    }
  }

  // --- Frantic Mouse Wiggle Detector ---
  function detectFranticWiggle(x, y) {
    const now = Date.now();
    state.mouseHistory.push({ x, y, t: now });
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

  // --- Strobi-style Expressions ---
  // Helper: apply an EYE_SHAPES spec to an SVG <ellipse> element by rebuilding its attrs
  function applyEyeShape(eyeEl, shineEl, spec) {
    if (!eyeEl) return;
    const ns = 'http://www.w3.org/2000/svg';
    const parent = eyeEl.parentNode;

    // Remove any old expression overlays
    const old = parent.querySelectorAll('.pk-eye-expr');
    old.forEach(o => o.remove());

    if (!spec) {
      // Normal — restore the ellipse
      eyeEl.style.display = '';
      if (shineEl) shineEl.style.display = '';
      return;
    }

    // Hide base ellipse and shine for non-normal expressions
    eyeEl.style.display = 'none';
    if (shineEl) shineEl.style.display = 'none';

    let el;
    if (spec.type === 'ellipse') {
      el = document.createElementNS(ns, 'ellipse');
      el.setAttribute('cx', '0');
      el.setAttribute('cy', '0');
      el.setAttribute('rx', spec.rx);
      el.setAttribute('ry', spec.ry);
      el.setAttribute('fill', spec.fill || '#050f25');
      if (spec.transform) el.setAttribute('transform', spec.transform);
    } else if (spec.type === 'circle') {
      el = document.createElementNS(ns, 'circle');
      el.setAttribute('cx', '0');
      el.setAttribute('cy', '0');
      el.setAttribute('r', spec.r);
      el.setAttribute('fill', spec.fill || '#050f25');
    } else if (spec.type === 'rect') {
      el = document.createElementNS(ns, 'rect');
      el.setAttribute('x', spec.x);
      el.setAttribute('y', spec.y);
      el.setAttribute('width', spec.width);
      el.setAttribute('height', spec.height);
      el.setAttribute('rx', spec.rx || 0);
      el.setAttribute('fill', spec.fill || '#050f25');
    } else if (spec.type === 'path') {
      el = document.createElementNS(ns, 'path');
      el.setAttribute('d', spec.d);
      el.setAttribute('fill', spec.fill || 'none');
      if (spec.stroke) {
        el.setAttribute('stroke', spec.stroke);
        el.setAttribute('stroke-width', spec.strokeWidth || 2.5);
        el.setAttribute('stroke-linecap', 'round');
      }
    }
    if (el) {
      el.classList.add('pk-eye-expr');
      parent.appendChild(el);
    }
  }

  function setExpression(expr, duration = 3000) {
    clearTimeout(state.expressionTimeout);
    state.expression = expr;

    const isCinema = expr === 'cinema';
    dom.cinemaGlasses.style.display = isCinema ? 'block' : 'none';
    dom.popcornAcc.style.display = (isCinema || expr === 'happy') ? 'block' : 'none';

    // Map incoming mood names to EYE_SHAPES keys
    const moodMap = {
      happy: 'happy', love: 'love', dizzy: 'dizzy', sleepy: 'sleepy',
      detective: 'detective', angry: 'angry', scared: 'scared',
      normal: null, cinema: null, excited: 'excited'
    };
    const shapeKey = moodMap[expr] || null;
    const spec = shapeKey ? EYE_SHAPES[shapeKey] : null;

    applyEyeShape(dom.leftEye, dom.leftShine, spec);
    applyEyeShape(dom.rightEye, dom.rightShine, spec);

    // Blush + mouth
    const isWarm = expr === 'happy' || expr === 'love' || expr === 'excited';
    dom.cheekL.setAttribute('opacity', isWarm ? '0.7' : '0');
    dom.cheekR.setAttribute('opacity', isWarm ? '0.7' : '0');
    if (dom.mouth) dom.mouth.style.display = isWarm ? 'none' : 'block';
    if (dom.mouthOpen) dom.mouthOpen.style.display = isWarm ? 'block' : 'none';

    if (duration > 0) {
      state.expressionTimeout = setTimeout(() => resetExpression(), duration);
    }
  }

  function resetExpression() {
    state.expression = 'normal';
    // Restore both eyes to normal ellipse
    applyEyeShape(dom.leftEye, dom.leftShine, null);
    applyEyeShape(dom.rightEye, dom.rightShine, null);

    dom.cinemaGlasses.style.display = 'none';
    dom.popcornAcc.style.display = 'none';
    dom.cheekL.setAttribute('opacity', '0');
    dom.cheekR.setAttribute('opacity', '0');
    if (dom.mouth) dom.mouth.style.display = 'block';
    if (dom.mouthOpen) dom.mouthOpen.style.display = 'none';
  }

  // --- Joyful Poke Reaction (Cute 360 Spin & Squish) ---
  function onPoke() {
    dom.bodyWrap.style.transition = 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    dom.bodyWrap.style.transform = 'scale(1.22) rotate(360deg)';
    state.earWiggle = 1;

    setTimeout(() => {
      dom.bodyWrap.style.transform = 'scale(1.15, 0.82) rotate(0deg)';
      setTimeout(() => {
        dom.bodyWrap.style.transform = 'scale(1, 1)';
        dom.bodyWrap.style.transition = 'transform 0.15s cubic-bezier(0.175,0.885,0.32,1.275)';
      }, 140);
    }, 440);

    const moods = ['love', 'happy', 'love', 'happy'];
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

  // --- Main Animation Loop (60fps) ---
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

    // 1. Idle Sleep Detector
    if (!state.isIdleSleepy && !state.isDragging && !state.isFlying && now - state.lastMouseMoveTime > 18000) {
      state.isIdleSleepy = true;
      setExpression('sleepy', 0);
      say(QUIPS.sleepy[0], 'sleepy', 3500);
    }

    // 2. Flight Movement Interpolation
    if (state.isFlying) {
      const elapsed = timestamp - state.flyStartTime;
      const t = Math.min(1, elapsed / state.flyDuration);
      // Smooth cubic ease-in-out
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const arcY = Math.sin(t * Math.PI) * -35;
      const currentX = state.flyStartX + (state.flyTargetX - state.flyStartX) * ease;
      const currentY = state.flyStartY + (state.flyTargetY - state.flyStartY) * ease + arcY;

      const dirX = state.flyTargetX - state.flyStartX;
      const flightTilt = Math.max(-20, Math.min(20, (dirX / 22) * (1 - ease)));
      dom.bodyWrap.style.transform = `rotate(${flightTilt}deg)`;

      state.x = currentX;
      state.y = currentY;
      dom.container.style.left = currentX + 'px';
      dom.container.style.top = currentY + 'px';

      state.pawAngleL = Math.sin(timestamp * 0.02) * 22;
      state.pawAngleR = -Math.sin(timestamp * 0.02) * 22;

      if (t >= 1) {
        state.isFlying = false;
        savePosition();
        // Cute landing squash-and-stretch
        dom.bodyWrap.style.transform = 'scale(1.18, 0.82) rotate(0deg)';
        setTimeout(() => {
          dom.bodyWrap.style.transform = 'scale(0.9, 1.12)';
          setTimeout(() => {
            dom.bodyWrap.style.transform = 'scale(1, 1)';
          }, 140);
        }, 120);
      }
    }

    // 3. Micro-Saccades
    if (now - state.lastSaccadeTime > (Math.random() * 2500 + 1500) && !state.isIdleSleepy) {
      state.lastSaccadeTime = now;
      state.saccadeOffsetX = (Math.random() - 0.5) * 0.18;
      state.saccadeOffsetY = (Math.random() - 0.5) * 0.12;
    }

    // 4. Eyelid Blinking Cycle
    if (now > state.nextBlinkTime && !state.isBlinking && state.expression !== 'dizzy' && !state.isIdleSleepy) {
      state.isBlinking = true;
      state.blinkStartTime = now;
      state.nextBlinkTime = now + (Math.random() * 3800 + 2600);
    }

    if (state.isBlinking) {
      const elapsed = now - state.blinkStartTime;
      const blinkDuration = 180;
      if (elapsed < blinkDuration) {
        const progress = elapsed / blinkDuration;
        state.blinkProgress = Math.sin(progress * Math.PI);
      } else {
        state.isBlinking = false;
        state.blinkProgress = 0;
      }
    }

    // 5. Spring Lerp Gaze Tracking
    const lerpSpeed = 0.1;
    const targetX = state.isIdleSleepy ? 0 : (state.targetGazeX + state.saccadeOffsetX);
    const targetY = state.isIdleSleepy ? 0.35 : (state.targetGazeY + state.saccadeOffsetY);

    state.currentGazeX += (targetX - state.currentGazeX) * lerpSpeed;
    state.currentGazeY += (targetY - state.currentGazeY) * lerpSpeed;

    // 6. Floating Physics & Dynamic Parts
    const floatY = Math.sin(state.floatTime) * 4.5;
    const headTilt = state.currentGazeX * 12;

    dom.floatGroup.setAttribute('transform', `translate(0, ${floatY}) rotate(${headTilt})`);

    const shadowScale = 1 - (floatY / 30);
    dom.shadow.setAttribute('transform', `scale(${shadowScale})`);

    // Ear wiggles (updated pivot for new head geometry)
    if (state.earWiggle > 0) {
      state.earWiggle -= 0.025;
      const wiggleAngle = Math.sin(timestamp * 0.035) * 14 * state.earWiggle;
      dom.leftEar.setAttribute('transform', `rotate(${-wiggleAngle}, -24, -62)`);
      dom.rightEar.setAttribute('transform', `rotate(${wiggleAngle}, 24, -62)`);
    } else {
      dom.leftEar.setAttribute('transform', '');
      dom.rightEar.setAttribute('transform', '');
    }

    // Antenna sway
    const antennaSway = (state.currentGazeX * 7) + (state.isFlying ? 10 : Math.sin(state.floatTime * 1.6) * 3);
    if (dom.antennaStem) dom.antennaStem.setAttribute('d', `M 0,-60 Q ${antennaSway},-76 2,-92`);
    if (dom.antennaLed) dom.antennaLed.setAttribute('cx', 2 + antennaSway * 0.6);

    // ARM WAVE animations — left and right arms swing alternately
    const armSwing = Math.sin(state.floatTime * 1.4) * 12;
    const armBob   = Math.cos(state.floatTime * 1.2) * 4;
    if (dom.leftArm) {
      dom.leftArm.setAttribute('transform',
        `translate(-54, ${36 + armBob}) rotate(${-armSwing}, 0, -18)`);
    }
    if (dom.rightArm) {
      dom.rightArm.setAttribute('transform',
        `translate(54, ${36 - armBob}) rotate(${armSwing}, 0, -18)`);
    }

    // Old paw refs (kept for backward compat if old SVG elements exist)
    if (dom.leftPaw && dom.leftPaw !== dom.leftArm) {
      const pawBob = Math.sin(state.floatTime * 1.8) * 3;
      dom.leftPaw.setAttribute('transform', `translate(-56, ${36 + pawBob}) rotate(${-15 + (state.pawAngleL || 0)})`);
      dom.rightPaw.setAttribute('transform', `translate(56, ${36 - pawBob}) rotate(${15 + (state.pawAngleR || 0)})`);
    }

    // LED pulse: cycle through colours at different phases
    const ledPulse = (Math.sin(state.floatTime * 3) + 1) / 2;
    if (dom.ledL) dom.ledL.setAttribute('opacity', (0.4 + ledPulse * 0.6).toFixed(2));
    if (dom.ledM) dom.ledM.setAttribute('opacity', (0.4 + Math.sin(state.floatTime * 3 + 1) * 0.5 + 0.5 > 1 ? 1 : 0.4 + (Math.sin(state.floatTime * 3 + 1) + 1) / 2 * 0.6).toFixed(2));
    if (dom.ledR) dom.ledR.setAttribute('opacity', (0.4 + (Math.sin(state.floatTime * 3 + 2) + 1) / 2 * 0.6).toFixed(2));

    // Ambient pulse rings
    const ringPulse = (Math.sin(state.floatTime * 0.9) + 1) / 2;
    if (dom.ringOuter) {
      dom.ringOuter.setAttribute('opacity', (0.2 + ringPulse * 0.45).toFixed(2));
      dom.ringOuter.setAttribute('rx', (72 + ringPulse * 6).toFixed(1));
    }
    if (dom.ringInner) {
      dom.ringInner.setAttribute('opacity', (0.3 + ringPulse * 0.4).toFixed(2));
      dom.ringInner.setAttribute('rx', (48 + ringPulse * 4).toFixed(1));
    }

    // Belly heartbeat dot pulse
    if (dom.heartDot) {
      const heartbeat = Math.abs(Math.sin(state.floatTime * 2.2));
      dom.heartDot.setAttribute('r', (3.5 + heartbeat * 2.5).toFixed(1));
      dom.heartDot.setAttribute('opacity', (0.45 + heartbeat * 0.55).toFixed(2));
    }

    // Ambient ring pulse (decorative, subtle)
    const ringPulse2 = (Math.sin(state.floatTime * 0.9) + 1) / 2;
    if (dom.ringOuter) {
      dom.ringOuter.setAttribute('stroke-opacity', (0.08 + ringPulse2 * 0.22).toFixed(2));
    }
    if (dom.ringInner) {
      dom.ringInner.setAttribute('stroke-opacity', (0.05 + ringPulse2 * 0.15).toFixed(2));
    }

    // 7. Strobi-style Eye Tracking
    // Eyes move as whole groups (the Strobi look — whole dot shifts left/right/up/down)
    const eyeTX = state.currentGazeX * 10;
    const eyeTY = state.currentGazeY * 7;
    const baseLeftX  = -18 + eyeTX;
    const baseRightX =  18 + eyeTX;
    const baseEyeY   = -14 + eyeTY;

    dom.leftEyeGroup.setAttribute('transform',  `translate(${baseLeftX.toFixed(1)}, ${baseEyeY.toFixed(1)})`);
    dom.rightEyeGroup.setAttribute('transform', `translate(${baseRightX.toFixed(1)}, ${baseEyeY.toFixed(1)})`);

    // Blink: squish the normal ellipse ry to 0 and back
    if (state.expression === 'normal' || state.expression === 'cinema') {
      const baseRy = 9;
      const blinkRy = Math.max(0.8, baseRy * (1 - state.blinkProgress * 0.96));
      if (dom.leftEye.style.display !== 'none')  dom.leftEye.setAttribute('ry',  blinkRy.toFixed(2));
      if (dom.rightEye.style.display !== 'none') dom.rightEye.setAttribute('ry', blinkRy.toFixed(2));

      // Shine follows eye
      if (dom.leftShine)  { dom.leftShine.setAttribute('cx', '-2'); dom.leftShine.setAttribute('cy', '-3'); }
      if (dom.rightShine) { dom.rightShine.setAttribute('cx', '-2'); dom.rightShine.setAttribute('cy', '-3'); }
    }
  }


  // --- Genre & Rating Humorous Intelligence ---
  function getGenreQuip(genresText, rating) {
    const gLower = (genresText || '').toLowerCase();
    let mood = 'happy';
    let quipsPool = [];

    if (gLower.includes('romance') || gLower.includes('romantic') || gLower.includes('love')) {
      quipsPool = QUIPS.genres.romance;
      mood = 'love';
    } else if (gLower.includes('horror') || gLower.includes('scary') || gLower.includes('fear')) {
      quipsPool = QUIPS.genres.horror;
      mood = 'dizzy';
    } else if (gLower.includes('comedy') || gLower.includes('funny') || gLower.includes('humor')) {
      quipsPool = QUIPS.genres.comedy;
      mood = 'happy';
    } else if (gLower.includes('action') || gLower.includes('adventure') || gLower.includes('superhero')) {
      quipsPool = QUIPS.genres.action;
      mood = 'happy';
    } else if (gLower.includes('sci-fi') || gLower.includes('science fiction') || gLower.includes('space') || gLower.includes('alien')) {
      quipsPool = QUIPS.genres.scifi;
      mood = 'detective';
    } else if (gLower.includes('anime') || gLower.includes('animation')) {
      quipsPool = QUIPS.genres.anime;
      mood = 'love';
    } else if (gLower.includes('mystery') || gLower.includes('crime') || gLower.includes('detective') || gLower.includes('thriller')) {
      quipsPool = QUIPS.genres.mystery;
      mood = 'detective';
    } else if (gLower.includes('fantasy') || gLower.includes('magic')) {
      quipsPool = QUIPS.genres.fantasy;
      mood = 'happy';
    } else if (gLower.includes('drama')) {
      quipsPool = QUIPS.genres.drama;
      mood = 'normal';
    } else if (gLower.includes('documentary')) {
      quipsPool = QUIPS.genres.documentary;
      mood = 'detective';
    }

    if (rating && Math.random() < 0.35) {
      const numR = parseFloat(rating);
      if (numR >= 8.2) {
        return { text: `Whoa, ${numR}★ rating?! Certified masterpiece alert! Your taste is immaculate! 🏆✨`, mood: 'love' };
      } else if (numR <= 5.4 && numR > 0) {
        return { text: `Ooh, ${numR}★ rating? Guilty pleasure trash cinema night! I secretly LOVE these, let's go! 🗑️🍿😂`, mood: 'happy' };
      }
    }

    if (quipsPool.length) {
      return { text: randomChoice(quipsPool), mood };
    }

    return { text: randomChoice(QUIPS.movieClick), mood: 'happy' };
  }

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // --- Hover Genre Quip (shorter, snappier for mouseover) ---
  function getHoverGenreQuip(genresText) {
    const g = (genresText || '').toLowerCase();
    if (g.includes('romance') || g.includes('romantic') || g.includes('love'))
      return { text: randomChoice(QUIPS.hover.romance), mood: 'love' };
    if (g.includes('horror') || g.includes('scary') || g.includes('thriller'))
      return { text: randomChoice(QUIPS.hover.horror), mood: 'dizzy' };
    if (g.includes('comedy') || g.includes('funny'))
      return { text: randomChoice(QUIPS.hover.comedy), mood: 'happy' };
    if (g.includes('action') || g.includes('adventure'))
      return { text: randomChoice(QUIPS.hover.action), mood: 'happy' };
    if (g.includes('sci-fi') || g.includes('science fiction') || g.includes('space'))
      return { text: randomChoice(QUIPS.hover.scifi), mood: 'detective' };
    if (g.includes('anime') || g.includes('animation'))
      return { text: randomChoice(QUIPS.hover.anime), mood: 'love' };
    if (g.includes('mystery') || g.includes('crime') || g.includes('detective'))
      return { text: randomChoice(QUIPS.hover.mystery), mood: 'detective' };
    if (g.includes('drama'))
      return { text: randomChoice(QUIPS.hover.drama), mood: 'normal' };
    if (g.includes('fantasy') || g.includes('magic'))
      return { text: randomChoice(QUIPS.hover.fantasy), mood: 'happy' };
    return { text: randomChoice(QUIPS.hover.general), mood: 'happy' };
  }

  // --- Hook Into MediaHub App Events ---
  function hookIntoMediaHub() {
    // 1. Detect Player Open / Close via MutationObserver
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

    // 2. Interactive movement and genre reactions on clicks
    document.addEventListener('click', e => {
      const card = e.target.closest('.card, .bento-card, .live-channel-card, .episode-card');
      if (card) {
        moveToNearElement(card);

        const titleEl = card.querySelector('h3, h4, .ch-name');
        const title = titleEl ? titleEl.textContent.trim() : '';
        const ratingEl = card.querySelector('.rating, .rating-badge');
        const rating = ratingEl ? ratingEl.textContent.replace(/[^\d.]/g, '') : '';
        const tagEl = card.querySelector('.mtag, p');
        const tagText = tagEl ? tagEl.textContent : '';

        if (card.classList.contains('live-channel-card')) {
          say(`Tuning into ${title}! 📡✨`, 'normal', 3000);
        } else if (location.hash.includes('anime')) {
          say(randomChoice(QUIPS.genres.anime), 'love', 3500);
        } else {
          const { text, mood } = getGenreQuip(tagText + ' ' + title, rating);
          say(text, mood, 3500);
        }
        return;
      }

      const navBtn = e.target.closest('.nav-links button, .trend-tabs button, .live-cats button');
      if (navBtn) {
        moveToNearElement(navBtn);
        return;
      }

      const playBtn = e.target.closest('.btn-play');
      if (playBtn) {
        moveToNearElement(playBtn);
        say("Play button activated! Grab your snacks! 🍿🎬", 'cinema', 3000);
      }
    });

    // 3. Card Hover Reactions (genre-aware, debounced)
    let hoverDebounceTimer = null;
    let lastHoveredCard = null;

    document.addEventListener('mouseover', e => {
      if (state.isPlayerDucked || state.isMinimized) return;
      const card = e.target.closest('.card, .bento-card');
      if (!card || card === lastHoveredCard) return;
      lastHoveredCard = card;

      clearTimeout(hoverDebounceTimer);
      hoverDebounceTimer = setTimeout(() => {
        // Only fire if still hovering same card
        const tagEl = card.querySelector('.mtag, p, .genre-tags span');
        const tagText = tagEl ? tagEl.textContent : '';
        const titleEl = card.querySelector('h3, h4');
        const title = titleEl ? titleEl.textContent.trim() : '';

        const { text, mood } = getHoverGenreQuip(tagText + ' ' + title);
        say(text, mood, 3200);
      }, 600); // 600ms delay so it only fires on intentional hover, not scrolling past
    });

    document.addEventListener('mouseout', e => {
      const card = e.target.closest('.card, .bento-card');
      if (card && card === lastHoveredCard) {
        clearTimeout(hoverDebounceTimer);
        lastHoveredCard = null;
      }
    });

    // 4. React whenever Detail Page renders with actual genres!
    const detailPage = document.getElementById('detailPage');
    if (detailPage) {
      let lastDetailTitle = '';
      const detailObserver = new MutationObserver(() => {
        const titleEl = detailPage.querySelector('.detail-info h1');
        const title = titleEl ? titleEl.textContent.trim() : '';
        if (title && title !== lastDetailTitle && detailPage.style.display !== 'none') {
          lastDetailTitle = title;
          const genreSpans = Array.from(detailPage.querySelectorAll('.genre-tags span'));
          const genres = genreSpans.map(s => s.textContent.trim()).join(', ');
          const ratingSpan = detailPage.querySelector('.detail-meta span');
          const rating = ratingSpan ? ratingSpan.textContent.match(/\d+\.\d+/)?.[0] : '';

          const actionBtn = detailPage.querySelector('.detail-actions, .detail-info');
          if (actionBtn) moveToNearElement(actionBtn);

          const { text, mood } = getGenreQuip(genres, rating);
          say(text, mood, 3800);
        }
      });
      detailObserver.observe(detailPage, { childList: true, subtree: true });
    }

    // 5. Hook onto navigation tab changes — including report/terms/privacy pages
    window.addEventListener('hashchange', () => {
      const hash = location.hash.slice(1) || '/';
      const cat = hash.replace(/^\//, '').split('/')[0];

      if (cat === 'report' || cat === 'issue') {
        setTimeout(() => say(randomChoice(QUIPS.reportPage), 'dizzy', 4200), 400);
      } else if (cat === 'terms') {
        setTimeout(() => say(randomChoice(QUIPS.termsPage), 'detective', 4000), 400);
      } else if (cat === 'privacy') {
        setTimeout(() => say(randomChoice(QUIPS.privacyPage), 'happy', 4000), 400);
      } else if (QUIPS.tabChange[cat]) {
        say(QUIPS.tabChange[cat], 'happy', 3000);
      }
    });

    // 6. Hook onto search input
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
    flyTo,
    onPoke,
    toggleMinimize: function (e) {
      if (e) e.stopPropagation();
      setMinimized(!state.isMinimized, true);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
