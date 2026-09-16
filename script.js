(function(){
  "use strict";

  /* =========================================================
     CONFIG — ajuste aqui o ritmo e o conteúdo da experiência
     ========================================================= */
  var CONFIG = {
    countdownFrom: 10,                 // segundos da contagem regressiva
    enigmaLines: [
      "Você já sentiu que este mundo não é real?",
      "Alguém está prestes a te mostrar o porquê."
    ],
    enigmaLineDelayMs: 2200,          // tempo entre as frases enigmáticas
    matrixFontSize: 16,               // tamanho dos caracteres da chuva
    matrixSpeedMin: 0.4,
    matrixSpeedMax: 1.1,
    matrixChars: "アイウエオカキクケコサシスセソ0123456789ﾊﾐﾑﾒﾓﾔﾕﾖ+=<>",
    /*matrixChars: "0123456789",*/
    /*matrixChars: "01",*/
    interactionRadius: 130            // raio de reação ao cursor/toque, em px
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var body = document.body;
  var stageWhite = document.getElementById("stage-white");
  var enigmaEl = document.getElementById("enigma");
  var countdownEl = document.getElementById("countdown");
  var flashEl = document.getElementById("flash");
  var canvas = document.getElementById("matrix-canvas");
  var stageReveal = document.getElementById("stage-reveal");
  var detailsSection = document.getElementById("details-section");
  var ctaMore = document.getElementById("cta-more");
  var skipBtn = document.getElementById("skip-intro");
  var soundBtn = document.getElementById("sound-toggle");
  var soundLabel = document.getElementById("sound-label");
  var announcer = document.getElementById("announcer");

  var ctx = canvas.getContext("2d");
  var introFinished = false;
  var timers = [];

  function announce(msg){ announcer.textContent = msg; }

  function clearTimers(){
    timers.forEach(function(t){ clearTimeout(t); clearInterval(t); });
    timers = [];
  }

  /* =========================================================
     STAGE 1 — sala branca: mensagem enigmática + contagem
     ========================================================= */
  function typeLine(el, text, done){
    if (reduceMotion){
      el.textContent = text;
      el.classList.add("show");
      done && done();
      return;
    }
    el.textContent = "";
    el.classList.add("show");
    var i = 0;
    var t = setInterval(function(){
      el.textContent += text.charAt(i);
      i++;
      if (i >= text.length){
        clearInterval(t);
        done && done();
      }
    }, 34);
    timers.push(t);
  }

  function runEnigma(){
    var lines = CONFIG.enigmaLines;
    var idx = 0;
    function showNext(){
      if (introFinished) return;
      typeLine(enigmaEl, lines[idx], function(){
        idx++;
        if (idx < lines.length){
          var t = setTimeout(showNext, CONFIG.enigmaLineDelayMs);
          timers.push(t);
        } else {
          var t2 = setTimeout(startCountdown, CONFIG.enigmaLineDelayMs * 0.7);
          timers.push(t2);
        }
      });
    }
    showNext();
  }

  function startCountdown(){
    if (introFinished) return;
    var n = CONFIG.countdownFrom;
    countdownEl.classList.add("show");
    announce("Contagem regressiva iniciada.");

    function tick(){
      if (introFinished) return;
      countdownEl.textContent = n;
      countdownEl.setAttribute("data-value", n);
      if (!reduceMotion && Math.random() < 0.6){
        countdownEl.classList.add("glitching");
        var g = setTimeout(function(){ countdownEl.classList.remove("glitching"); }, 160);
        timers.push(g);
      }
      if (n % 2 === 0) announce(n + " segundos.");

      if (n <= 0){
        var t = setTimeout(triggerTransformation, 550);
        timers.push(t);
        return;
      }
      n--;
      var t2 = setTimeout(tick, 1000);
      timers.push(t2);
    }
    tick();
  }

  /* =========================================================
     TRANSIÇÃO — sala branca -> chuva digital
     ========================================================= */
  function triggerTransformation(){
    if (introFinished) return;
    introFinished = true;
    clearTimers();
    announce("A simulação está sendo revelada.");

    if (!reduceMotion){
      flashEl.classList.add("pulse");
    }

    stageWhite.style.opacity = "0";
    stageWhite.style.filter = "blur(6px)";
    body.classList.add("in-matrix");
    initMatrixRain();

    var t = setTimeout(function(){
      stageWhite.setAttribute("aria-hidden", "true");
      stageWhite.style.display = "none";
      revealCinematic();
    }, reduceMotion ? 120 : 1500);
    timers.push(t);
  }

  function skipIntro(){
    if (introFinished){
      // já revelado — leva o foco ao conteúdo principal
      stageReveal.querySelector(".glitch-title").focus && stageReveal.focus();
      return;
    }
    triggerTransformation();
  }
  skipBtn.addEventListener("click", skipIntro);

  /* =========================================================
     STAGE 2 — chuva de caracteres em canvas
     ========================================================= */
  var columns = [];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var pointer = { x: -9999, y: -9999, active: false };
  var burst = null;

  function resizeCanvas(){
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    setupColumns();
  }

  function setupColumns(){
    var fs = CONFIG.matrixFontSize;
    var count = Math.floor(window.innerWidth / fs);
    columns = [];
    for (var i = 0; i < count; i++){
      columns.push({
        x: i * fs,
        y: Math.random() * -window.innerHeight,
        speed: CONFIG.matrixSpeedMin + Math.random() * (CONFIG.matrixSpeedMax - CONFIG.matrixSpeedMin)
      });
    }
  }

  function initMatrixRain(){
    resizeCanvas();
    if (!rafId) drawFrame();
  }

  var rafId = null;
  function drawFrame(){
    var fs = CONFIG.matrixFontSize;
    ctx.fillStyle = "rgba(3,10,6,0.15)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.font = fs + "px monospace";
    ctx.textBaseline = "top";

    for (var i = 0; i < columns.length; i++){
      var col = columns[i];
      var ch = CONFIG.matrixChars.charAt(Math.floor(Math.random() * CONFIG.matrixChars.length));

      var dx = col.x - pointer.x;
      var dy = col.y - pointer.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var near = pointer.active && dist < CONFIG.interactionRadius;

      if (near){
        var glow = 1 - (dist / CONFIG.interactionRadius);
        ctx.fillStyle = glow > 0.6 ? "#eafff2" : "#8dffc4";
      } else if (Math.random() < 0.04){
        ctx.fillStyle = "#c9fff0"; // leading spark, ocasional
      } else {
        ctx.fillStyle = Math.random() < 0.5 ? "#0c5c2c" : "#17b352";
      }

      ctx.fillText(ch, col.x, col.y);

      col.y += fs * col.speed * (near ? 1.6 : 1);
      if (col.y > window.innerHeight && Math.random() > 0.975){
        col.y = Math.random() * -200;
      }
    }
    rafId = requestAnimationFrame(drawFrame);
  }

  window.addEventListener("resize", debounce(resizeCanvas, 150));

  function debounce(fn, wait){
    var t;
    return function(){
      clearTimeout(t);
      var args = arguments;
      t = setTimeout(function(){ fn.apply(null, args); }, wait);
    };
  }

  function setPointer(x, y){
    pointer.x = x; pointer.y = y; pointer.active = true;
  }
  function clearPointer(){ pointer.active = false; }

  canvas.addEventListener("pointermove", function(e){ setPointer(e.clientX, e.clientY); });
  canvas.addEventListener("pointerleave", clearPointer);
  canvas.addEventListener("pointerdown", function(e){
    setPointer(e.clientX, e.clientY);
    burstAt(e.clientX);
  });
  window.addEventListener("blur", clearPointer);

  function burstAt(x){
    var fs = CONFIG.matrixFontSize;
    columns.forEach(function(col){
      if (Math.abs(col.x - x) < 90){
        col.y = 0;
        col.speed = CONFIG.matrixSpeedMax * 1.8;
      }
    });
  }

  /* =========================================================
     STAGE 3 — revelação cinematográfica
     ========================================================= */
  function revealCinematic(){
    stageReveal.hidden = false;
    stageReveal.classList.add("visible");
    stageReveal.setAttribute("tabindex", "-1");
    announce("Matrix. Relançamento nos cinemas.");
    var t = setTimeout(function(){ stageReveal.focus(); }, 900);
    timers.push(t);
  }

  ctaMore.addEventListener("click", function(){
    var expanded = ctaMore.getAttribute("aria-expanded") === "true";
    ctaMore.setAttribute("aria-expanded", String(!expanded));
    if (!expanded){
      detailsSection.hidden = false;
      requestAnimationFrame(function(){ detailsSection.classList.add("visible"); });
      ctaMore.textContent = "Ocultar detalhes";
      detailsSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    } else {
      detailsSection.classList.remove("visible");
      detailsSection.hidden = true;
      ctaMore.textContent = "Saiba mais";
    }
  });

  /* =========================================================
     MODAL — Óculos Meta × Matrix
     O vídeo só é carregado/tocado quando o usuário clica no
     botão (preload="none" no HTML). Fecha com Esc, clique fora
     ou no botão de fechar; o foco volta ao botão que abriu.
     ========================================================= */
  var glassesBtn = document.getElementById("cta-glasses");
  var glassesModal = document.getElementById("glasses-modal");
  var glassesClose = document.getElementById("glasses-modal-close");
  var glassesVideo = document.getElementById("glasses-video");
  var lastFocusedBeforeModal = null;

  function onModalKeydown(e){
    if (e.key === "Escape") closeGlassesModal();
  }

  function openGlassesModal(){
    lastFocusedBeforeModal = document.activeElement;
    glassesModal.hidden = false;
    body.style.overflow = "hidden";
    requestAnimationFrame(function(){ glassesModal.classList.add("visible"); });
    glassesClose.focus();
    document.addEventListener("keydown", onModalKeydown);
    // toca o vídeo pois a ação já é um clique explícito do usuário no botão
    glassesVideo.play().catch(function(){ /* alguns navegadores exigem novo clique no player */ });
  }

  function closeGlassesModal(){
    glassesModal.classList.remove("visible");
    glassesVideo.pause();
    glassesVideo.currentTime = 0;
    body.style.overflow = "";
    document.removeEventListener("keydown", onModalKeydown);
    setTimeout(function(){ glassesModal.hidden = true; }, 250);
    if (lastFocusedBeforeModal) lastFocusedBeforeModal.focus();
  }

  glassesBtn.addEventListener("click", openGlassesModal);
  glassesClose.addEventListener("click", closeGlassesModal);
  glassesModal.addEventListener("click", function(e){
    if (e.target === glassesModal) closeGlassesModal();
  });

  /* =========================================================
     SOM OPCIONAL — nunca autoplay, só inicia por clique
     Áudio gerado via Web Audio API: nenhum arquivo externo.
     ========================================================= */
  var audioCtx = null;
  var soundOn = false;
  var soundNodes = null;

  function buildAmbience(){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    var master = audioCtx.createGain();
    master.gain.value = 0.0001;
    master.connect(audioCtx.destination);

    // zumbido grave contínuo
    var drone = audioCtx.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 52;
    var droneGain = audioCtx.createGain();
    droneGain.gain.value = 0.18;
    drone.connect(droneGain).connect(master);
    drone.start();

    // ruído filtrado, como estática de terminal
    var bufferSize = audioCtx.sampleRate * 2;
    var noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    var data = noiseBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++){ data[i] = (Math.random() * 2 - 1) * 0.35; }
    var noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    var noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 1200;
    var noiseGain = audioCtx.createGain();
    noiseGain.gain.value = 0.05;
    noise.connect(noiseFilter).connect(noiseGain).connect(master);
    noise.start();

    master.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 1.2);

    soundNodes = { master: master, drone: drone, noise: noise, blipTimer: null };
    scheduleBlips();
  }

  function scheduleBlips(){
    function blip(){
      if (!soundOn || !audioCtx) return;
      var osc = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.value = 300 + Math.random() * 900;
      g.gain.value = 0;
      osc.connect(g).connect(soundNodes.master);
      var now = audioCtx.currentTime;
      g.gain.linearRampToValueAtTime(0.06, now + 0.01);
      g.gain.linearRampToValueAtTime(0, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.1);
      soundNodes.blipTimer = setTimeout(blip, 600 + Math.random() * 1800);
    }
    soundNodes.blipTimer = setTimeout(blip, 700);
  }

  function stopAmbience(){
    if (!soundNodes) return;
    clearTimeout(soundNodes.blipTimer);
    var m = soundNodes.master;
    var now = audioCtx.currentTime;
    m.gain.cancelScheduledValues(now);
    m.gain.setValueAtTime(m.gain.value, now);
    m.gain.linearRampToValueAtTime(0.0001, now + 0.4);
    var ctxToClose = audioCtx;
    setTimeout(function(){
      try{ soundNodes.drone.stop(); soundNodes.noise.stop(); }catch(e){}
      ctxToClose.close();
    }, 450);
    soundNodes = null;
    audioCtx = null;
  }

  soundBtn.addEventListener("click", function(){
    soundOn = !soundOn;
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundLabel.textContent = soundOn ? "Som ativado" : "Som desativado";
    announce(soundOn ? "Som ativado." : "Som desativado.");
    if (soundOn){
      buildAmbience();
    } else {
      stopAmbience();
    }
  });

  /* =========================================================
     INÍCIO
     ========================================================= */
  if (reduceMotion){
    // experiência ainda cinematográfica, mas sem glitch/flicker constante
    enigmaEl.textContent = CONFIG.enigmaLines.join(" ");
    enigmaEl.classList.add("show");
    var t0 = setTimeout(startCountdown, 900);
    timers.push(t0);
  } else {
    runEnigma();
  }
})();
