(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(2, '0');
  const LINE = 'https://lin.ee/5tmSsMp';
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  /* ---------- 作品（全部為真實作品；清單見 media-library/gallery.json） ---------- */
  // [id, 英文, 中文, 寬, 高, 分類]
  const works = [
    ['return-01', '白髮共存', '11 月灰棕回訪・髮色細節', 1212, 2160, 'gray'],
    ['edit-5', '長髮', '直髮輪廓', 795, 1280, 'long'],
    ['warm-5', '長髮', '暖棕波浪・側面層次', 720, 1280, 'long'],
    ['return-02', '白髮共存', '同次回訪・另一角度', 1236, 2160, 'gray'],
    ['gray-4', '白髮共存', '白髮共存・側面輪廓', 1033, 1280, 'gray'],
    ['edit-10', '短髮', '中短髮層次', 720, 1280, 'short'],
    ['cool-2', '長髮', '冷棕長髮・完整背面', 720, 1280, 'long'],
    ['edit-9', '短髮', '柔和灰紫', 778, 1280, 'short'],
    ['warm-4', '長髮', '暖棕波浪・轉身的光澤', 720, 1280, 'long'],
    ['edit-4', '短髮', '短髮亮線', 720, 1280, 'short'],
    ['return-03', '白髮共存', '同次回訪・內層深淺', 1226, 2160, 'gray'],
    ['gray-3', '白髮共存', '白髮共存・線條分布', 837, 1280, 'gray'],
    ['cool-1', '長髮', '冷棕長髮・波浪中的亮線', 720, 1280, 'long'],
    ['edit-3', '短髮', '短髮線條', 720, 1280, 'short'],
    ['gray-5', '白髮共存', '白髮共存・頭頂與分線', 816, 1280, 'gray'],
    ['warm-3', '長髮', '暖棕波浪・波浪細節', 720, 1280, 'long'],
    ['edit-6', '短髮', '灰棕線條', 720, 1280, 'short'],
    ['edit-7', '短髮', '短髮灰棕', 720, 1280, 'short'],
    ['edit-8', '短髮', '短髮灰棕・另一角度', 720, 1280, 'short'],
    ['edit-2', '長髮', '長髮層次・多角度', 960, 1280, 'long'],
    ['edit-1', '長髮', '綁髮內層線條・多角度', 960, 1280, 'long']
  ].map(([id, en, zh, w, h, cat]) => ({ id, en, zh, w, h, cat }));
  const byId = Object.fromEntries(works.map((w) => [w.id, w]));
  const big = (w) => `assets/${w.id}.${w.id.startsWith('return-') ? 'jpg' : 'webp'}`;
  const thumb = (w) => w.id.startsWith('return-') ? big(w) : `assets/thumbs/${w.id}.webp`;
  const imgTag = (w, cls = '') => `<img${cls ? ` class="${cls}"` : ''} src="${thumb(w)}" alt="${w.zh}（COOPER 真實作品）" width="${w.w}" height="${w.h}" loading="lazy" decoding="async">`;

  /* ---------- 小工具 ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 3200);
  }
  function copy(text) {
    // 不等待：讓同一次點擊能順利開啟 LINE
    try {
      const p = navigator.clipboard && navigator.clipboard.writeText(text);
      if (p) p.then(() => toast('已複製。到 LINE 對話貼上即可，不會自動傳送。'), () => toast('無法自動複製，請在 LINE 直接描述你的需求。'));
      else toast('無法自動複製，請在 LINE 直接描述你的需求。');
    } catch { toast('無法自動複製，請在 LINE 直接描述你的需求。'); }
  }
  function openSheet(d) { d.showModal(); document.documentElement.classList.add('locked'); }
  $$('dialog').forEach((d) => {
    d.addEventListener('close', () => document.documentElement.classList.remove('locked'));
    d.addEventListener('click', (e) => { if (e.target === d && d.classList.contains('sheet')) d.close(); });
    d.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => d.close()));
  });

  /* ---------- 選單 ---------- */
  const menu = $('#menu');
  function setMenu(open) {
    menu.hidden = !open;
    $('#menuOpen').setAttribute('aria-expanded', open);
    document.documentElement.classList.toggle('locked', open);
    (open ? $('#menuClose') : $('#menuOpen')).focus();
  }
  $('#menuOpen').addEventListener('click', () => setMenu(true));
  $('#menuClose').addEventListener('click', () => setMenu(false));
  menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- TOP STORIES ---------- */
  const stories = [
    { kicker: '客製刷染', title: '刷染，會不會一條一條很明顯？', img: 'edit-3', filter: 'all',
      body: ['很多人怕刷染完，線條像一條一條畫上去，分界很硬，跟髮型分開。', '我會先看你的層次與髮量，再安排線條的位置和深淺，讓顏色自然融進髮型。長髮、短髮的線條，各自設計。', '也會一起考慮頭髮留長之後的銜接。'] },
    { kicker: '白髮共存', title: '有白髮，可以染得自然一點嗎？', img: 'gray-4', filter: 'gray',
      body: ['一位我服務過多次的客人，白髮越來越明顯。這次依她頭頂、分線與鬢角的白髮分布安排線條，讓白髮融進深淺之間。', '新生髮的銜接也放進設計裡。照片是本次完成的樣子，之後仍會依生長與退色安排維護，不是做一次就永遠不用再染。'] },
    { kicker: '真實回訪', title: '想少補染，可以隔多久再整理？', img: 'return-02', filter: 'gray',
      body: ['這位客人隔了四個月回來，照片是這次整理完成的樣子。', '這次沒有再漂，不代表她從來沒漂過，也不代表每個人第一次做都不用漂。', '我會看白髮分布、過去染髮紀錄和目前髮況，再一起討論維護方式。四個月是這位客人的回訪間隔，不能直接套用在每個人身上。'] },
    { kicker: '髮色', title: '不想做刷染，還有什麼選擇？', img: 'edit-9', filter: 'all',
      body: ['從你喜歡的明暗、現在的底色、膚色與穿搭日常一起討論，先確認你能接受的改變，再決定方向。', '不一定要做線條，單色染也能有好看的光澤與一致的質感。'] }
  ];
  const storyList = $('#storyList');
  let activeStory = null;
  stories.forEach((s, i) => {
    const w = byId[s.img];
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'story reveal';
    b.innerHTML = `${imgTag(w)}<div><p class="kicker">${s.kicker}</p><h3>${s.title}</h3><p class="story-summary">${s.body[0]}</p><span class="read">點開看解答</span></div>`;
    b.addEventListener('click', () => {
      activeStory = s;
      $('#artKicker').textContent = s.kicker;
      $('#artTitle').textContent = s.title;
      const img = $('#artImg');
      img.src = big(w); img.alt = `${w.zh}（COOPER 真實作品）`; img.width = w.w; img.height = w.h;
      $('#artBody').replaceChildren(...s.body.map((t) => Object.assign(document.createElement('p'), { textContent: t })));
      openSheet($('#article'));
    });
    storyList.append(b);
  });
  $('#artBook').addEventListener('click', () => {
    if (activeStory) copy(`COOPER 你好，我看了網站的「${activeStory.title}」，想預約諮詢。`);
  });
  $('#artEdit').addEventListener('click', () => {
    $('#article').close();
    setFilter(activeStory ? activeStory.filter : 'all');
    $('#edit').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
  });

  /* ---------- READ THE LINE ---------- */
  const spots = [
    ['髮根附近要柔和', '看頭頂分線附近：亮色是慢慢出現的，不會一開始就是一條很明顯的線。'],
    ['亮色跟著層次分布', '亮色和深色交錯，跟著頭髮的層次落下，不是每個地方都染滿。要多密，會看你的髮量決定。'],
    ['髮尾也要接得自然', '亮色一路延續到髮尾。設計時也會先想好，頭髮留長之後顏色怎麼接得自然。']
  ];
  let si = 0;
  const dots = $$('.dot');
  function showSpot(i) {
    si = (i + spots.length) % spots.length;
    dots.forEach((d, n) => { d.setAttribute('aria-pressed', n === si); d.setAttribute('aria-label', `${n + 1} ${spots[n][0]}`); });
    $$('[data-spot-tab]').forEach((b, n) => b.setAttribute('aria-pressed', n === si));
    $('#spotNo').textContent = `${pad(si + 1)} / ${pad(spots.length)}`;
    $('#spotTitle').textContent = spots[si][0];
    $('#spotText').textContent = spots[si][1];
    const p = $('.spot-panel');
    p.classList.remove('fade-in'); void p.offsetWidth; p.classList.add('fade-in');
  }
  dots.forEach((d, i) => d.addEventListener('click', () => showSpot(i)));
  $$('[data-spot-tab]').forEach((b, i) => b.addEventListener('click', () => showSpot(i)));
  $('#spotPrev').addEventListener('click', () => showSpot(si - 1));
  $('#spotNext').addEventListener('click', () => showSpot(si + 1));
  showSpot(0);

  /* ---------- HAIR MATCH ---------- */
  const qs = [
    { q: '你的頭髮，現在大概多長？', key: 'len', opts: [['short', '短髮・下巴附近', ''], ['medium', '中長・肩膀附近', ''], ['long', '長髮・過肩', '']] },
    { q: '這次，最想要的感覺是？', key: 'feel', opts: [['balayage', '自然有層次的線條', ''], ['gray', '讓白髮看起來更自然', ''], ['colour', '只想換個好看的顏色', ''], ['cut', '想換個輪廓、好整理', '']] },
    { q: '你最擔心的是？', key: 'worry', opts: [['line', '線條太粗、不自然', ''], ['root', '白髮長出來，分界明顯', ''], ['damage', '髮質受損', ''], ['care', '回家不好整理', '']] }
  ];
  const services = {
    balayage: { name: '客製刷染', en: '手刷線條', text: '依層次與髮量決定線條的粗細、密度與位置，讓深淺自然融合，也考慮留長後的銜接。' },
    gray: { name: '白髮共存設計', en: '讓白髮變成設計', text: '依白髮分布安排線條，讓白髮成為設計的一部分，並把新生髮的銜接一起規劃。' },
    colour: { name: '單色染', en: '不做線條的髮色', text: '依膚色、底色與喜歡的明暗挑選色調，在意光澤與整體的一致。' },
    cut: { name: '剪裁輪廓', en: '剪髮', text: '依臉型、髮流與整理習慣調整輪廓和層次，讓回家自己整理也有樣子。' }
  };
  const worries = {
    line: '你擔心線條太粗：我會先看層次、髮量和分線習慣，再決定線條的粗細與密度。',
    root: '你擔心分界：會依白髮分布與生長安排線條，把新生髮的銜接放進設計，並說明之後的維護。',
    damage: '你在意髮質：會先了解染、燙、漂的紀錄，說明可行的亮度與做法，再一起決定這次做到哪裡。',
    care: '你在意整理：會考慮你每天願意花多少時間，讓設計回到日常也好整理。'
  };
  const picks = { gray: ['return-01', 'return-03'], short: ['edit-3', 'edit-10'], medium: ['edit-5', 'edit-10'], long: ['warm-5', 'cool-1'] };
  const ans = {};
  let step = 0;
  let advancing = false;
  const stage = $('#matchStage');
  function renderQ() {
    advancing = false;
    $('#matchBar').style.width = `${(step / qs.length) * 100}%`;
    const q = qs[step];
    stage.innerHTML = `<div class="fade-in"><p class="q-step">第 ${step + 1} 題／共 ${qs.length} 題</p><h3 class="q-title">${q.q}</h3><div class="opts">${q.opts.map(([v, t, en]) => `<button type="button" class="opt${ans[q.key] === v ? ' picked' : ''}" data-v="${v}"><span>${t}</span>${en ? `<small>${en}</small>` : '<small>選這個</small>'}</button>`).join('')}</div>${step ? '<button type="button" class="q-back">上一題</button>' : ''}</div>`;
    stage.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
      if (advancing) return;
      advancing = true;
      stage.querySelectorAll('.opt, .q-back').forEach((el) => { el.disabled = true; });
      ans[q.key] = b.dataset.v;
      b.classList.add('picked');
      setTimeout(() => { step += 1; step < qs.length ? renderQ() : renderResult(); }, reduced() ? 0 : 220);
    }));
    const back = stage.querySelector('.q-back');
    if (back) back.addEventListener('click', () => { step -= 1; renderQ(); });
  }
  function label(key, v) { return qs.find((q) => q.key === key).opts.find((o) => o[0] === v)[1]; }
  function renderResult() {
    advancing = false;
    $('#matchBar').style.width = '100%';
    const s = services[ans.feel];
    const ids = ans.feel === 'gray' ? picks.gray : picks[ans.len];
    const msg = `COOPER 你好，我在網站做了配對：頭髮${label('len', ans.len)}，想要「${label('feel', ans.feel)}」，最擔心「${label('worry', ans.worry)}」。結果是「${s.name}」，想預約諮詢。`;
    stage.innerHTML = `<div class="result fade-in"><p class="kicker">可以一起討論的方向</p><h3>${s.name}</h3><p class="en">${s.en}</p><p>${s.text}</p><p style="margin-top:10px">${worries[ans.worry]}</p>
      <div class="result-works">${ids.map((id) => `<button type="button" data-id="${id}" aria-label="看完整照片：${byId[id].zh}">${imgTag(byId[id])}<span class="result-view">看完整照片</span><span>${byId[id].zh}</span></button>`).join('')}</div>
      <p class="fine" style="color:#999;margin-bottom:14px">配對只是方向參考，實際做法會在看過你的髮況後討論。${ans.feel === 'gray' ? '照片為同次回訪的不同角度，皆為本次整理完成。' : ans.feel === 'colour' ? '以下照片只供長度與輪廓參考，並非單色染案例；髮色會另外討論。' : '真實作品，供風格參考。'}</p>
      <p class="fine" style="margin-bottom:16px">按下按鈕會複製結果並開啟 LINE。在對話貼上後，由你決定是否送出。</p>
      <div class="result-actions"><a class="btn btn-white" id="matchSend" href="${LINE}" target="_blank" rel="noopener">複製結果並開啟 LINE</a><button type="button" class="btn btn-ghost" id="matchAgain">重新配對</button></div></div>`;
    stage.querySelectorAll('.result-works button').forEach((b) => b.addEventListener('click', (e) => openLightbox(ids.indexOf(b.dataset.id), e.currentTarget, ids.map((id) => byId[id]))));
    $('#matchSend').addEventListener('click', () => copy(msg));
    $('#matchAgain').addEventListener('click', () => { step = 0; Object.keys(ans).forEach((k) => delete ans[k]); renderQ(); });
  }
  renderQ();

  /* ---------- 收藏 ---------- */
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem('cooper-saved') || '[]').filter((id) => byId[id]); } catch { saved = []; }
  function persist() { try { localStorage.setItem('cooper-saved', JSON.stringify(saved)); } catch { /* 無痕模式等情況略過 */ } }
  function isSaved(id) { return saved.includes(id); }
  function toggleSave(id, btn) {
    saved = isSaved(id) ? saved.filter((x) => x !== id) : [...saved, id];
    persist();
    if (btn) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
    if (isSaved(id)) toast(`已收藏 ${saved.length} 款。可繼續挑，或點「查看收藏」聊預約。`);
    syncSaved();
  }
  function syncSaved() {
    $$('[data-save]').forEach((b) => {
      const on = isSaved(b.dataset.save);
      b.setAttribute('aria-pressed', on);
      b.innerHTML = `<span aria-hidden="true">${on ? '♥' : '♡'}</span> ${on ? '已收藏' : '收藏這款'}`;
      b.setAttribute('aria-label', `${on ? '取消收藏' : '收藏'}：${byId[b.dataset.save].zh}`);
    });
    $('#savedCount').textContent = saved.length;
    $('#savedPill').hidden = saved.length === 0;
    $('#savedList').replaceChildren(...saved.map((id) => {
      const li = document.createElement('li');
      li.innerHTML = `${imgTag(byId[id])}<span>${byId[id].zh}</span><button type="button" aria-label="移除：${byId[id].zh}">✕</button>`;
      li.querySelector('button').addEventListener('click', () => toggleSave(id));
      return li;
    }));
    if (lightbox.open) syncLbSave();
  }
  $('#savedPill').addEventListener('click', () => openSheet($('#savedSheet')));
  $('#sendSaved').addEventListener('click', (e) => {
    if (!saved.length) { e.preventDefault(); toast('還沒有收藏的作品'); return; }
    copy(`COOPER 你好，我在網站收藏了這幾件作品：${saved.map((id) => `「${byId[id].zh}」`).join('、')}，想做類似的方向，想預約諮詢。`);
  });

  /* ---------- THE EDIT ---------- */
  const chips = [['all', '全部'], ['long', '長髮'], ['short', '短髮'], ['gray', '白髮共存']];
  const chipBtns = chips.map(([k, t]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.dataset.k = k;
    b.textContent = `${t} ${k === 'all' ? works.length : works.filter((w) => w.cat === k).length}`;
    b.addEventListener('click', () => setFilter(k));
    $('#chips').append(b);
    return b;
  });
  const rail = $('#rail');
  let list = works;
  let expandedWorks = false;
  function setFilter(k) {
    expandedWorks = false;
    list = k === 'all' ? works : works.filter((w) => w.cat === k);
    chipBtns.forEach((b) => b.setAttribute('aria-pressed', b.dataset.k === k));
    rail.replaceChildren(...list.map((w, i) => {
      const li = document.createElement('li');
      li.className = 'card';
      li.hidden = i >= 6;
      li.innerHTML = `<button type="button" class="card-img" aria-label="看完整照片：${w.zh}">${imgTag(w)}<span class="view-work">看完整照片</span></button><div class="card-meta"><div><p class="kicker">${w.en}</p><p>${w.zh}</p></div><button type="button" class="heart" data-save="${w.id}" aria-pressed="false">♡ 收藏這款</button></div>`;
      li.querySelector('.card-img').addEventListener('click', (e) => openLightbox(i, e.currentTarget, list));
      li.querySelector('.heart').addEventListener('click', (e) => toggleSave(w.id, e.currentTarget));
      return li;
    }));
    rail.scrollLeft = 0;
    $('#showMoreWorks').hidden = list.length <= 6;
    $('#showMoreWorks').textContent = `看更多作品（還有 ${Math.max(0, list.length - 6)} 張）`;
    syncSaved();
  }
  $('#showMoreWorks').addEventListener('click', () => {
    if (expandedWorks) return;
    expandedWorks = true;
    const next = rail.children[6];
    Array.from(rail.children).forEach((el) => { el.hidden = false; });
    $('#showMoreWorks').hidden = true;
    if (next) { next.querySelector('button').focus({ preventScroll: true }); next.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' }); }
  });

  /* ---------- 全螢幕照片 ---------- */
  const lightbox = $('#lightbox');
  const lbImg = $('#lbImg');
  let lbList = works, li = 0, opener = null;
  function syncLbSave() {
    const on = isSaved(lbList[li].id);
    $('#lbSave').setAttribute('aria-pressed', on);
    $('#lbSave').textContent = on ? '♥ 已收藏' : '♡ 收藏';
  }
  function renderLb() {
    const w = lbList[li];
    if (lbImg.getAttribute('src') !== big(w)) {
      lbImg.classList.add('is-changing');
      lbImg.onload = lbImg.onerror = () => lbImg.classList.remove('is-changing');
      lbImg.width = w.w; lbImg.height = w.h; lbImg.alt = `${w.zh}（COOPER 真實作品）`; lbImg.src = big(w);
    }
    $('#lbCaption').textContent = w.zh;
    $('#lbCounter').textContent = `${pad(li + 1)} / ${pad(lbList.length)}`;
    syncLbSave();
    [li + 1, li - 1].forEach((n) => { new Image().src = big(lbList[(n + lbList.length) % lbList.length]); });
  }
  function lbStep(d) { li = (li + d + lbList.length) % lbList.length; renderLb(); }
  function openLightbox(i, el, from) {
    lbList = from || works; li = i; opener = el;
    lightbox.showModal(); document.documentElement.classList.add('locked');
    renderLb(); $('#lbClose').focus();
  }
  $('#lbClose').addEventListener('click', () => lightbox.close());
  $('#lbPrev').addEventListener('click', () => lbStep(-1));
  $('#lbNext').addEventListener('click', () => lbStep(1));
  $('#lbSave').addEventListener('click', (e) => toggleSave(lbList[li].id, e.currentTarget));
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); lbStep(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); lbStep(1); }
  });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox || e.target.id === 'lbStage') lightbox.close(); });
  lightbox.addEventListener('close', () => { if (opener && document.contains(opener)) opener.focus(); });
  (() => {
    const el = $('#lbStage');
    let x0 = null, y0 = 0;
    el.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; x0 = e.clientX; y0 = e.clientY; });
    el.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) lbStep(dx < 0 ? 1 : -1);
    });
    el.addEventListener('pointercancel', () => { x0 = null; });
  })();

  setFilter('all');

  /* ---------- VOICES ---------- */
  const quotes = [['被理解的安心','我說我這次終於找到懂我的設計師了\n謝謝你這麼有耐心'],['線條的細緻','她說這次線條比以前細緻\n我有跟她說是你弄的'],['回家後依然喜歡','昨天洗完頭髮今天看還是很喜歡\n本來擔心自己弄會變一個樣\n還好沒有哈哈'],['每個角度的細節','今天綁馬尾才發現後面好漂亮\n裡面的線條也有做欸\n不是只有外面那一層'],['白髮的柔和銜接','這次白髮看起來不會那麼突兀\n以前染完都覺得頭頂跟下面兩個顏色\n謝謝你幫我弄得比較柔和'],['髮色的質感','我女兒說我這次髮色很有質感\n她以前都說我染得太黑\n昨天回去終於被稱讚了'],['日常整理','今天自己整理覺得還不錯欸\n沒有我想的那麼難弄'],['光線裡的變化','今天在太陽下看髮色好漂亮\n昨天在店裡就喜歡了\n沒想到外面看又不一樣'],['好好說明，才安心','謝謝你昨天一直跟我解釋\n本來很怕白髮會弄得更明顯\n做完真的比我想的自然'],['整體感覺的變化','今天有同事說我臉看起來變小\n是不是你昨天剪的關係\n整個感覺都不一樣了']];
  $('#quoteRail').replaceChildren(...quotes.map(([topic, text], i) => {
    const li = document.createElement('li');
    li.className = 'quote';
    li.innerHTML = `<p class="kicker">${pad(i + 1)} / ${pad(quotes.length)}</p><blockquote></blockquote><p class="fine">${topic}</p>`;
    li.querySelector('blockquote').textContent = text;
    return li;
  }));

  $('#quotePrev').addEventListener('click', () => $('#quoteRail').scrollBy({ left: -$('#quoteRail').clientWidth * .85, behavior: reduced() ? 'auto' : 'smooth' }));
  $('#quoteNext').addEventListener('click', () => $('#quoteRail').scrollBy({ left: $('#quoteRail').clientWidth * .85, behavior: reduced() ? 'auto' : 'smooth' }));

  /* ---------- 進場 ---------- */

  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }
})();
