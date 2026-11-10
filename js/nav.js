/* 공통 상단 바 + 왼쪽 메뉴(드로어)
   <body data-base="">       → 홈(index.html)에서는 앵커로 이동
   <body data-base="index.html"> → 다른 페이지에서는 홈의 앵커로 이동 */
(function () {
  /* ── 세션 플래너 공개 스위치 ──────────────────────────────
     PLANNER_OPEN = false : 메뉴·바로가기 버튼·로그인 화면을 모두 숨김
     PLANNER_OPEN = true  : 모두에게 공개
     테스트: 주소 끝에 ?planner=test 를 붙여 한 번 열면 그 브라우저에서만 계속 보임
             (?planner=off 로 해제) */
  var PLANNER_OPEN = false;
  try {
    var qp = location.search.match(/[?&]planner=(test|off)/);
    if (qp) qp[1] === 'test' ? localStorage.setItem('wcf_planner_test', '1') : localStorage.removeItem('wcf_planner_test');
  } catch (e) {}
  var PL = PLANNER_OPEN;
  try { PL = PL || localStorage.getItem('wcf_planner_test') === '1'; } catch (e) {}
  window.WCF_PLANNER = PL;
  if (!PL) { try { sessionStorage.removeItem('wcf_my'); sessionStorage.removeItem('wcf_cred'); } catch (e) {} }

  var base = document.body.getAttribute('data-base') || '';
  var here = location.pathname.split('/').pop() || 'index.html';
  var EN = document.documentElement.lang === 'en';
  var R = document.body.getAttribute('data-root') || '';
  var page = (location.pathname.split('/').pop() || '') + location.search;
  var MENU = EN ? [
    ['my', 'Session Planner Login', 'planner.html'],
    ['sp'],
    ['hl', 'Home', '#top'],
    ['', 'About World Coffee Forum', '#home'],
    ['', 'WCF at a Glance', '#glance'],
    ['h', 'Programs'],
    ['', 'The Stage', 'session.html?prog=stage'],
    ['', 'The Sessions', 'session.html?prog=sessions'],
    ['', 'Origin Discovery', 'session.html?prog=origin'],
    ['', 'Champion Live', 'session.html?prog=champion'],
    ['', 'SCA Education', 'session.html?prog=sca'],
    ['', 'Coffee Futures Challenge', 'session.html?prog=futures'],
    ['h', 'Partner Event'],
    ['', "Asia-Pacific's 100 Best Coffee Shops GALA", 'session.html?id=gala-1'],
    ['h', 'Information'],
    ['', 'Venue Guide', '#venue'],
    ['', 'Registration', '#registration'],
    ['', 'Contact', '#contact']
  ] : [
    ['my', '세션 플래너 로그인', 'planner.html'],
    ['sp'],
    ['hl', '홈', '#top'],
    ['', '월드커피포럼 소개', '#home'],
    ['', '한눈에 보는 월커포', '#glance'],
    ['h', '프로그램'],
    ['', 'The Stage', 'session.html?prog=stage'],
    ['', 'The Sessions', 'session.html?prog=sessions'],
    ['', 'Origin Discovery', 'session.html?prog=origin'],
    ['', 'Champion Live', 'session.html?prog=champion'],
    ['', 'SCA Education', 'session.html?prog=sca'],
    ['', 'Coffee Futures Challenge', 'session.html?prog=futures'],
    ['h', '연계 행사'],
    ['', "Asia-Pacific's 100 Best Coffee Shops GALA", 'session.html?id=gala-1'],
    ['h', '안내'],
    ['', '베뉴 가이드', '#venue'],
    ['', '등록대', '#registration'],
    ['', '문의', '#contact']
  ];
  if (!PL) MENU = MENU.filter(function (m) { return m[0] !== 'my' && m[0] !== 'sp'; });
  function href(h) { return h.charAt(0) === '#' ? base + h : h; }

  var items = MENU.map(function (m) {
    if (m[0] === 'h') return '<li class="dr-h">' + m[1] + '</li>';
    if (m[0] === 'hl') return '<li class="dr-h"><a href="' + href(m[2]) + '">' + m[1] + '</a></li>';
    if (m[0] === 'sp') return '<li class="dr-sp" aria-hidden="true"></li>';
    var cur = (m[2] === here || (here.indexOf('session.html') === 0 && location.search && m[2].indexOf(location.search) > -1)) ? ' aria-current="page"' : '';
    return '<li><a href="' + href(m[2]) + '"' + cur + (m[0] === 'my' ? ' class="dr-my"' : '') + '>' + m[1] + '</a></li>';
  }).join('');

  var wrap = document.querySelector('.wrap') || document.body;
  var bar = document.createElement('header');
  bar.className = 'topbar';
  bar.innerHTML =
    '<button class="hb" id="hb" aria-label="' + (EN ? 'Open menu' : '메뉴 열기') + '" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>' +
    '<a class="tb-logo" href="' + (base || '#top') + '"><img src="' + R + 'assets/wcf-logo.png?v=2" alt="' + (EN ? 'The 15th World Coffee Forum' : '제15회 월드커피포럼') + '" width="164" height="25"></a>' +
    (EN ? '<span class="tb-lang"><a href="../' + page + '">KO</a><b>EN</b></span>' : '<span class="tb-lang"><b>KO</b><a href="en/' + page + '">EN</a></span>');
  wrap.insertBefore(bar, wrap.firstChild);

  var dr = document.createElement('div');
  dr.className = 'drawer'; dr.id = 'drawer'; dr.setAttribute('aria-hidden', 'true');
  dr.innerHTML = '<div class="scrim" data-close></div><nav class="dr-panel" aria-label="' + (EN ? 'Menu' : '전체 메뉴') + '">' +
    '<div class="dr-top"><span>15th World Coffee Forum</span><button class="dr-x" data-close aria-label="' + (EN ? 'Close menu' : '메뉴 닫기') + '">×</button></div>' +
    '<ul>' + items + '</ul></nav>';
  document.body.appendChild(dr);

  var hb = document.getElementById('hb');
  function open(v) {
    document.body.classList.toggle('dr-open', v);
    dr.setAttribute('aria-hidden', String(!v));
    hb.setAttribute('aria-expanded', String(v));
  }
  hb.addEventListener('click', function () { open(true); });
  dr.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) return open(false);
    if (e.target.closest('a')) open(false);   // 이동하면서 닫기
  });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });

  // 오른쪽 아래: 세션 플래너 바로가기 (플래너 페이지에서는 숨김)
  if (PL && here !== 'planner.html') {
    var fab = document.createElement('a');
    fab.className = 'fab on'; fab.href = 'planner.html'; fab.setAttribute('aria-label', EN ? 'Session Planner' : '세션 플래너');
    fab.innerHTML = '<svg viewBox="0 0 24 24"><rect x="4" y="5.5" width="16" height="14.5" rx="2"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/><path d="M8 14h2.5M13.5 14H16M8 17h2.5"/></svg>';
    document.body.appendChild(fab);
  }

  // 플래너 비공개일 때 planner.html 로 들어오면 준비 중 안내만 표시
  if (!PL && here === 'planner.html') {
    var mn = document.querySelector('main.page');
    if (mn) mn.innerHTML = '<a class="back" href="index.html">‹ ' + (EN ? 'Home' : '홈') + '</a><h1 class="pg-t">' + (EN ? 'Session Planner' : '세션 플래너') + '</h1>' +
      '<p class="pg-m">' + (EN ? 'The Session Planner is not open yet. Please check back soon.' : '세션 플래너는 준비 중입니다. 곧 열릴 예정입니다.') + '</p>';
  }
})();
