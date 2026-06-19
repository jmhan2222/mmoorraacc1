(function () {
  /* ── 좌표 상수 (SVG viewBox 0 0 260 430 기준) ── */
  var TOP_Y    = 52,   NECK_TOP = 200;   // 위쪽 챔버: y=52 → y=200
  var BOT_NECK = 228,  BOT_Y   = 378;   // 아래쪽 챔버: y=228 → y=378
  var TOTAL = 180;                       // 3분(초)

  var widget    = document.getElementById('widget');
  var topSand   = document.getElementById('topSand');
  var topSandHL = document.getElementById('topSandHL');
  var botSand   = document.getElementById('botSand');
  var botSandHL = document.getElementById('botSandHL');
  var readout   = document.getElementById('readout');
  var glassRoot = document.getElementById('glassRoot');

  var startTime  = null;
  var rafId      = null;
  var lastSecond = -1;

  function fmt(s) {
    s = Math.max(0, s);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' +
           String(Math.floor(s % 60)).padStart(2, '0');
  }

  function render(elapsed) {
    var frac = Math.min(elapsed / TOTAL, 1);

    /* 위쪽 모래: 수면이 NECK_TOP → TOP_Y 방향으로 내려감 */
    var topH = Math.max((NECK_TOP - TOP_Y) * (1 - frac), 0);
    var topY = NECK_TOP - topH;
    topSand.setAttribute('y', topY);
    topSand.setAttribute('height', topH);
    topSandHL.setAttribute('y', topY);

    /* 아래쪽 모래: BOT_Y 바닥에서 BOT_NECK 방향으로 쌓임 */
    var botH = Math.max((BOT_Y - BOT_NECK) * frac, 0);
    var botY = BOT_Y - botH;
    botSand.setAttribute('y', botY);
    botSand.setAttribute('height', botH);
    botSandHL.setAttribute('y', botY);

    /* 타이머 숫자 (1초 단위 업데이트) */
    var rem = Math.max(TOTAL - elapsed, 0);
    var cs  = Math.ceil(rem);
    if (cs !== lastSecond) { readout.textContent = fmt(rem); lastSecond = cs; }

    if (frac >= 1) { finish(); }
  }

  function tick(now) {
    var elapsed = (now - startTime) / 1000;
    if (elapsed >= TOTAL) { render(TOTAL); return; }
    render(elapsed);
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    widget.dataset.state = 'running';
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    startTime  = performance.now();
    lastSecond = -1;
    rafId = requestAnimationFrame(tick);
  }

  function finish() {
    widget.dataset.state = 'done';
    readout.textContent = '00:00';
  }

  /* 뒤집기: 언제든 호출 가능, 180° 회전 후 3분 재시작 */
  window.doFlip = function () {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

    var reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (reduced) { start(); return; }

    glassRoot.classList.remove('spinning');
    void glassRoot.offsetWidth;           // reflow → animation 재시작
    glassRoot.classList.add('spinning');

    glassRoot.addEventListener('animationend', function h() {
      glassRoot.removeEventListener('animationend', h);
      glassRoot.classList.remove('spinning');
      start();
    });
  };

  /* 페이지 로드 즉시 카운트다운 시작 */
  start();
})();
