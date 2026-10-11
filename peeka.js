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

  // --- SVG Paths for Cute Eye Morphing ---
  const EYE_PATHS = {
    normal: '',
    happy: 'M -13,3 Q 0,-8 13,3', // Inverted happy crescent
    love: 'M 0,-4 A 4.2,4.2 0 0,0 -8.4,-4 Q -8.4,4 0,9.5 Q 8.4,4 8.4,-4 A 4.2,4.2 0 0,0 0,-4 Z', // Heart
    dizzy: 'M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M -4,0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0', // Spiral
    sleepy: 'M -13,0 L 13,0', // Flat sleepy line
    detective: 'M -12,-12 L 12,-12 L 12,12 L -12,12 Z M -12,0 L 12,0' // Reticle scanner
  };

  // --- Initialization ---
  function init() {
    createDOM();
    bindEvents();
    loadPersistedPosition();
    startLoop();

    // Hook into global MediaHub actions
    hookIntoMediaHub();

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

        <svg id="peekaSvg" class="peeka-svg" viewBox="-120 -120 240 240">
          <defs>
            <!-- Cute Pear/Mochi Chassis Gradient -->
            <linearGradient id="pkChassisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0f294d"/>
              <stop offset="45%" stop-color="#091c38"/>
              <stop offset="100%" stop-color="#030c1a"/>
            </linearGradient>
            <!-- Luminous Rim Glow -->
            <radialGradient id="pkRimGlow" cx="50%" cy="25%" r="75%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6"/>
              <stop offset="45%" stop-color="#0070f3" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#00183b" stop-opacity="0"/>
            </radialGradient>
            <!-- Forehead Gloss Highlight -->
            <linearGradient id="pkGlossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/>
              <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
            </linearGradient>
            <!-- Visor Screen -->
            <linearGradient id="pkVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#020713"/>
              <stop offset="100%" stop-color="#071730"/>
            </linearGradient>
            <!-- Kawaii Chibi Anime Eye Glow -->
            <radialGradient id="pkEyeGlow" cx="45%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="25%" stop-color="#38bdf8"/>
              <stop offset="65%" stop-color="#0070f3"/>
              <stop offset="100%" stop-color="#00224d"/>
            </radialGradient>
            <!-- Ear Glow Gradient -->
            <linearGradient id="pkEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#0070f3" stop-opacity="0.35"/>
            </linearGradient>
            <filter id="pkNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.2" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <clipPath id="pkVisorClip">
              <rect x="-56" y="-28" width="112" height="58" rx="28" ry="28"/>
            </clipPath>
          </defs>

          <!-- Floor Shadow -->
          <ellipse id="pkShadow" cx="0" cy="100" rx="55" ry="12" fill="rgba(0, 112, 243, 0.28)" filter="blur(6px)"/>

          <!-- Floating Chibi Mascot Group -->
          <g id="pkFloatGroup" transform="translate(0, 0)">

            <!-- Left Kawaii Cat/Fin Ear -->
            <g id="pkLeftEar" transform="translate(0, 0)">
              <path d="M -46,-34 C -68,-64 -50,-76 -32,-48 Z" fill="#0b2244" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
              <path d="M -44,-36 C -60,-60 -48,-68 -34,-48 Z" fill="url(#pkEarGrad)"/>
            </g>

            <!-- Right Kawaii Cat/Fin Ear -->
            <g id="pkRightEar" transform="translate(0, 0)">
              <path d="M 46,-34 C 68,-64 50,-76 32,-48 Z" fill="#0b2244" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
              <path d="M 44,-36 C 60,-60 48,-68 34,-48 Z" fill="url(#pkEarGrad)"/>
            </g>

            <!-- Bouncy Antenna with Star Bobble -->
            <g id="pkAntennaGroup">
              <path id="pkAntennaStem" d="M 0,-56 Q 5,-72 0,-85" stroke="#0090ff" stroke-width="3" stroke-linecap="round" fill="none"/>
              <circle id="pkAntennaLed" cx="0" cy="-85" r="6" fill="#00f0ff" filter="url(#pkNeonGlow)"/>
              <path d="M 0,-89 L 1.5,-86.5 L 4,-85 L 1.5,-83.5 L 0,-81 L -1.5,-83.5 L -4,-85 L -1.5,-86.5 Z" fill="#ffffff"/>
            </g>

            <!-- Chubby Mochi Body Chassis -->
            <path id="pkChassis" d="M 0,-56 C 46,-56 66,-28 66,12 C 66,54 48,70 0,70 C -48,70 -66,54 -66,12 C -66,-28 -46,-56 0,-56 Z" fill="url(#pkChassisGrad)" stroke="rgba(0,180,255,0.5)" stroke-width="2"/>
            <path id="pkRim" d="M 0,-56 C 46,-56 66,-28 66,12 C 66,54 48,70 0,70 C -48,70 -66,54 -66,12 C -66,-28 -46,-56 0,-56 Z" fill="url(#pkRimGlow)"/>

            <!-- Cute Forehead Gloss Highlight -->
            <path d="M -30,-48 C -15,-54 15,-54 30,-48 C 20,-42 -20,-42 -30,-48 Z" fill="url(#pkGlossGrad)"/>

            <!-- Cute Visor Screen -->
            <rect x="-56" y="-28" width="112" height="58" rx="28" fill="url(#pkVisorGrad)" stroke="rgba(0,190,255,0.4)" stroke-width="1.8"/>

            <!-- Eyes Layer (Clipped inside Visor) -->
            <g id="pkEyesLayer" clip-path="url(#pkVisorClip)">
              <!-- Left Eye -->
              <g id="pkLeftEyeGroup" transform="translate(-24, 0)">
                <ellipse id="pkLeftEye" cx="0" cy="0" rx="16" ry="18" fill="url(#pkEyeGlow)" filter="url(#pkNeonGlow)"/>
                <circle id="pkLeftPupil" cx="0" cy="0" r="7.5" fill="#001226"/>
                <!-- Primary Kawaii Sparkle -->
                <circle id="pkLeftSparkle" cx="-4.5" cy="-5" r="4.2" fill="#ffffff"/>
                <!-- Secondary Kawaii Glint -->
                <circle id="pkLeftSparkle2" cx="3.5" cy="4" r="2.2" fill="#ffffff"/>
                <!-- Twinkle starlet -->
                <circle id="pkLeftSparkle3" cx="4" cy="-3.5" r="1.2" fill="#a5f3fc"/>
                <!-- Morphing eye shape overlay -->
                <path id="pkLeftShape" d="" stroke="#00f0ff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" style="display:none;"/>
              </g>

              <!-- Right Eye -->
              <g id="pkRightEyeGroup" transform="translate(24, 0)">
                <ellipse id="pkRightEye" cx="0" cy="0" rx="16" ry="18" fill="url(#pkEyeGlow)" filter="url(#pkNeonGlow)"/>
                <circle id="pkRightPupil" cx="0" cy="0" r="7.5" fill="#001226"/>
                <!-- Primary Kawaii Sparkle -->
                <circle id="pkRightSparkle" cx="-4.5" cy="-5" r="4.2" fill="#ffffff"/>
                <!-- Secondary Kawaii Glint -->
                <circle id="pkRightSparkle2" cx="3.5" cy="4" r="2.2" fill="#ffffff"/>
                <!-- Twinkle starlet -->
                <circle id="pkRightSparkle3" cx="4" cy="-3.5" r="1.2" fill="#a5f3fc"/>
                <!-- Morphing eye shape overlay -->
                <path id="pkRightShape" d="" stroke="#00f0ff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none" style="display:none;"/>
              </g>
            </g>

            <!-- Cute Blushing Cheeks -->
            <ellipse id="pkCheekL" cx="-40" cy="18" rx="8" ry="4.5" fill="#ff4d88" opacity="0.45" filter="url(#pkNeonGlow)"/>
            <ellipse id="pkCheekR" cx="40" cy="18" rx="8" ry="4.5" fill="#ff4d88" opacity="0.45" filter="url(#pkNeonGlow)"/>

            <!-- Adorable Mouth -->
            <path id="pkMouth" d="M -7,22 Q 0,27 7,22" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            <path id="pkMouthOpen" d="M -7,21 Q 0,31 7,21 Z" fill="#ff4d88" stroke="#38bdf8" stroke-width="1.8" style="display:none;"/>

            <!-- Cute Floating Nubby Paws -->
            <g id="pkLeftPaw" transform="translate(-56, 36)">
              <ellipse cx="0" cy="0" rx="9" ry="12" transform="rotate(-15)" fill="#0c1f3d" stroke="rgba(0,180,255,0.45)" stroke-width="1.8"/>
              <ellipse cx="-1" cy="2" rx="4" ry="5" fill="#00f0ff" opacity="0.3"/>
            </g>
            <g id="pkRightPaw" transform="translate(56, 36)">
              <ellipse cx="0" cy="0" rx="9" ry="12" transform="rotate(15)" fill="#0c1f3d" stroke="rgba(0,180,255,0.45)" stroke-width="1.8"/>
              <ellipse cx="1" cy="2" rx="4" ry="5" fill="#00f0ff" opacity="0.3"/>
            </g>

            <!-- 3D Cinema Glasses (pops on in cinema mode) -->
            <g id="pkCinemaGlasses" style="display:none;">
              <rect x="-54" y="-18" width="46" height="34" rx="8" fill="rgba(255, 30, 80, 0.55)" stroke="#fff" stroke-width="2"/>
              <rect x="8" y="-18" width="46" height="34" rx="8" fill="rgba(0, 229, 255, 0.55)" stroke="#fff" stroke-width="2"/>
              <line x1="-8" y1="-2" x2="8" y2="-2" stroke="#fff" stroke-width="2.5"/>
            </g>

            <!-- Popcorn Tub (accessory) -->
            <g id="pkPopcornAcc" transform="translate(36, 30) scale(0.68)" style="display:none;">
              <polygon points="0,0 24,0 20,28 4,28" fill="#e74c3c" stroke="#fff" stroke-width="1.5"/>
              <polygon points="5,0 9,0 8,28 4,28" fill="#fff"/>
              <polygon points="15,0 19,0 18,28 14,28" fill="#fff"/>
              <circle cx="6" cy="-4" r="4.5" fill="#f1c40f"/>
              <circle cx="12" cy="-6" r="5" fill="#f39c12"/>
              <circle cx="18" cy="-4" r="4.5" fill="#f1c40f"/>
            </g>
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
    dom.leftEar = document.getElementById('pkLeftEar');
    dom.rightEar = document.getElementById('pkRightEar');
    dom.antennaStem = document.getElementById('pkAntennaStem');
    dom.antennaLed = document.getElementById('pkAntennaLed');
    dom.leftPaw = document.getElementById('pkLeftPaw');
    dom.rightPaw = document.getElementById('pkRightPaw');
    dom.leftEye = document.getElementById('pkLeftEye');
    dom.rightEye = document.getElementById('pkRightEye');
    dom.leftPupil = document.getElementById('pkLeftPupil');
    dom.rightPupil = document.getElementById('pkRightPupil');
    dom.leftSparkle = document.getElementById('pkLeftSparkle');
    dom.leftSparkle2 = document.getElementById('pkLeftSparkle2');
    dom.leftSparkle3 = document.getElementById('pkLeftSparkle3');
    dom.rightSparkle = document.getElementById('pkRightSparkle');
    dom.rightSparkle2 = document.getElementById('pkRightSparkle2');
    dom.rightSparkle3 = document.getElementById('pkRightSparkle3');
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
        const maxX = window.innerWidth - 110;
        const maxY = window.innerHeight - 120;
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
    state.x = window.innerWidth - 125;
    state.y = window.innerHeight - 135;
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

  // --- Expressions & Accessories ---
  function setExpression(expr, duration = 3000) {
    clearTimeout(state.expressionTimeout);
    state.expression = expr;

    const isCinema = expr === 'cinema';
    dom.cinemaGlasses.style.display = isCinema ? 'block' : 'none';
    dom.popcornAcc.style.display = (isCinema || expr === 'happy') ? 'block' : 'none';

    const sparkles = [
      dom.leftSparkle, dom.leftSparkle2, dom.leftSparkle3,
      dom.rightSparkle, dom.rightSparkle2, dom.rightSparkle3
    ];

    if (expr === 'happy' || expr === 'love' || expr === 'dizzy' || expr === 'sleepy' || expr === 'detective') {
      const pathD = EYE_PATHS[expr] || '';
      dom.leftShape.setAttribute('d', pathD);
      dom.rightShape.setAttribute('d', pathD);
      dom.leftShape.style.display = 'block';
      dom.rightShape.style.display = 'block';

      dom.leftPupil.style.display = 'none';
      dom.rightPupil.style.display = 'none';
      sparkles.forEach(s => { if (s) s.style.display = 'none'; });

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
      sparkles.forEach(s => { if (s) s.style.display = ''; });
    }

    // Blushing & open mouth when happy or in love
    if (expr === 'happy' || expr === 'love') {
      dom.cheekL.setAttribute('opacity', '0.85');
      dom.cheekR.setAttribute('opacity', '0.85');
      dom.mouth.style.display = 'none';
      dom.mouthOpen.style.display = 'block';
    } else {
      dom.cheekL.setAttribute('opacity', '0.45');
      dom.cheekR.setAttribute('opacity', '0.45');
      dom.mouth.style.display = 'block';
      dom.mouthOpen.style.display = 'none';
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
    const sparkles = [
      dom.leftSparkle, dom.leftSparkle2, dom.leftSparkle3,
      dom.rightSparkle, dom.rightSparkle2, dom.rightSparkle3
    ];
    sparkles.forEach(s => { if (s) s.style.display = ''; });

    dom.cinemaGlasses.style.display = 'none';
    dom.popcornAcc.style.display = 'none';
    dom.cheekL.setAttribute('opacity', '0.45');
    dom.cheekR.setAttribute('opacity', '0.45');
    dom.mouth.style.display = 'block';
    dom.mouthOpen.style.display = 'none';
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

    // Ear wiggles
    if (state.earWiggle > 0) {
      state.earWiggle -= 0.025;
      const wiggleAngle = Math.sin(timestamp * 0.035) * 14 * state.earWiggle;
      dom.leftEar.setAttribute('transform', `rotate(${-wiggleAngle}, -32, -48)`);
      dom.rightEar.setAttribute('transform', `rotate(${wiggleAngle}, 32, -48)`);
    } else {
      dom.leftEar.setAttribute('transform', '');
      dom.rightEar.setAttribute('transform', '');
    }

    // Antenna sway
    const antennaSway = (state.currentGazeX * 7) + (state.isFlying ? 10 : Math.sin(state.floatTime * 1.6) * 3);
    dom.antennaStem.setAttribute('d', `M 0,-56 Q ${antennaSway},-72 0,-85`);
    dom.antennaLed.setAttribute('cx', antennaSway * 0.7);

    // Floating Paws Bobbing
    const pawBob = Math.sin(state.floatTime * 1.8) * 3;
    dom.leftPaw.setAttribute('transform', `translate(-56, ${36 + pawBob}) rotate(${-15 + (state.pawAngleL || 0)})`);
    dom.rightPaw.setAttribute('transform', `translate(56, ${36 - pawBob}) rotate(${15 + (state.pawAngleR || 0)})`);

    // 7. Eye Position & Shape Rendering
    if (state.expression === 'normal' || state.expression === 'cinema') {
      const eyeTravelX = state.currentGazeX * 15;
      const eyeTravelY = state.currentGazeY * 11;

      dom.leftEyeGroup.setAttribute('transform', `translate(${-24 + eyeTravelX}, ${eyeTravelY})`);
      dom.rightEyeGroup.setAttribute('transform', `translate(${24 + eyeTravelX}, ${eyeTravelY})`);

      const baseRadiusY = 18;
      const currentRadiusY = Math.max(1.2, baseRadiusY * (1 - state.blinkProgress * 0.94));
      dom.leftEye.setAttribute('ry', currentRadiusY);
      dom.rightEye.setAttribute('ry', currentRadiusY);

      const pupilX = state.currentGazeX * 4;
      const pupilY = state.currentGazeY * 3.5;
      dom.leftPupil.setAttribute('cx', pupilX);
      dom.leftPupil.setAttribute('cy', pupilY);
      dom.rightPupil.setAttribute('cx', pupilX);
      dom.rightPupil.setAttribute('cy', pupilY);

      if (dom.leftSparkle) {
        dom.leftSparkle.setAttribute('cx', pupilX - 4.5);
        dom.leftSparkle.setAttribute('cy', pupilY - 5);
        dom.rightSparkle.setAttribute('cx', pupilX - 4.5);
        dom.rightSparkle.setAttribute('cy', pupilY - 5);
      }
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
