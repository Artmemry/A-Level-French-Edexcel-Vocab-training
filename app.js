/* Le Lexique — engine
   Data: window.CORPUS (entries), window.POLYSEMY (curated groups), window.COLLISIONS (auto sets)
   Storage: localStorage "lexique-fr-v1"
*/
(function(){
"use strict";

/* ───────── state ───────── */
const LS = "lexique-fr-v1";
const DAY = 86400000;
let S = load();
function load(){
  try{
    const raw = localStorage.getItem(LS);
    if(raw){ const s = JSON.parse(raw); s.srs=s.srs||{}; s.poly=s.poly||{}; s.coll=s.coll||{}; s.sessions=s.sessions||[]; return s; }
  }catch(e){}
  return {name:"", srs:{}, poly:{}, coll:{}, sessions:[], created:Date.now()};
}
function save(){ try{ localStorage.setItem(LS, JSON.stringify(S)); }catch(e){} }

/* ───────── indexes ───────── */
const byId = {}; CORPUS.forEach(e=>byId[e.id]=e);
const UNITS = {}; // uid -> {name, ids:[], lessons:{lid:{title, ids}}}
const UNIT_ORDER = [];
CORPUS.forEach(e=>{
  if(!UNITS[e.unit]){ UNITS[e.unit]={name:e.unitName, ids:[], lessons:{}}; UNIT_ORDER.push(e.unit); }
  const u = UNITS[e.unit]; u.ids.push(e.id);
  if(!u.lessons[e.lesson]) u.lessons[e.lesson]={title:e.lessonTitle, ids:[]};
  u.lessons[e.lesson].ids.push(e.id);
});
// collision membership: entry id -> {en, siblings:[ids]}
const COLL_OF = {};
COLLISIONS.forEach(c=>c.ids.forEach(id=>{
  if(byId[id]) (COLL_OF[id]=COLL_OF[id]||[]).push(c);
}));
const POLY_BY_ID = {}; POLYSEMY.forEach(g=>POLY_BY_ID[g.id]=g);

/* ───────── SM-2 ───────── */
function srsGet(id){ return S.srs[id] || (S.srs[id]={ef:2.5,int:0,reps:0,due:0,seen:0,ok:0,lapses:0}); }
function srsGrade(id,q){ // q 0..5
  const r = srsGet(id);
  r.seen++; if(q>=3) r.ok++;
  if(q<3){ r.reps=0; r.int=0; r.lapses++; r.due=Date.now(); }
  else{
    r.reps++;
    if(r.reps===1) r.int=1; else if(r.reps===2) r.int=6; else r.int=Math.round(r.int*r.ef);
    r.ef=Math.max(1.3, r.ef + (0.1 - (5-q)*(0.08 + (5-q)*0.02)));
    r.due=Date.now() + r.int*DAY;
  }
  save();
}
const isMastered = id => { const r=S.srs[id]; return r && r.int>=21; };
const isSeen = id => { const r=S.srs[id]; return r && r.seen>0; };
const isDue = id => { const r=S.srs[id]; return r && r.seen>0 && r.due<=Date.now(); };

/* ───────── utils ───────── */
const $ = sel => document.querySelector(sel);
function el(tag, attrs, ...kids){
  const n=document.createElement(tag);
  if(attrs) for(const k in attrs){
    if(k==="class") n.className=attrs[k];
    else if(k==="html") n.innerHTML=attrs[k];
    else if(k.startsWith("on")) n.addEventListener(k.slice(2), attrs[k]);
    else n.setAttribute(k, attrs[k]);
  }
  kids.flat().forEach(c=>{ if(c==null) return; n.append(c.nodeType?c:document.createTextNode(c)); });
  return n;
}
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function sample(a,n,excl){ const pool=a.filter(x=>!excl||!excl.has(x)); return shuffle(pool).slice(0,n); }
function esc(s){ return String(s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function stripAcc(s){ return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/œ/g,"oe").replace(/æ/g,"ae"); }
function normFr(s){ return s.toLowerCase().replace(/\s*\([^)]*\)/g,"").replace(/’/g,"'").replace(/\s+/g," ").trim(); }
function stripArt(s){ return s.replace(/^(le |la |les |l'|un |une |des |se |s')/,""); }
function pct(a,b){ return b? Math.round(100*a/b) : 0; }
// «gap» helpers
function ctxHighlight(ctx){ return esc(ctx).replace(/«([^»]+)»/g,'<mark>$1</mark>'); }
function ctxGap(ctx){ return esc(ctx).replace(/«([^»]+)»/g,'<span class="gap">…</span>'); }
function ctxFill(ctx, ok){ return esc(ctx).replace(/«([^»]+)»/g, '<mark>$1</mark>'); }

/* ───────── poly stats ───────── */
function polyStat(gid, si){
  const g = S.poly[gid] = S.poly[gid] || {};
  return g[si] = g[si] || {a:0,c:0,conf:{}};
}
function polyRecord(gid, si, chosenIdx, ok){
  const st = polyStat(gid, si);
  st.a++; if(ok) st.c++; else st.conf[chosenIdx]=(st.conf[chosenIdx]||0)+1;
  save();
}

/* ───────── router ───────── */
const VIEWS = ["accueil","apprendre","polysemie","suivi"];
function go(view){
  VIEWS.forEach(v=>{
    $("#view-"+v).classList.toggle("hidden", v!==view);
    $("#tab-"+v).setAttribute("aria-selected", v===view ? "true":"false");
  });
  if(view==="accueil") renderAccueil();
  if(view==="apprendre") renderApprendreConfig();
  if(view==="polysemie") renderPolyConfig();
  if(view==="suivi") renderSuivi();
  window.scrollTo(0,0);
}
VIEWS.forEach(v=>$("#tab-"+v).addEventListener("click", ()=>go(v)));

/* ═════════ ACCUEIL ═════════ */
let selUnits = new Set(JSON.parse(localStorage.getItem(LS+"-units")||"[]"));
if(!selUnits.size) selUnits = new Set(["U1"]);
function saveUnits(){ localStorage.setItem(LS+"-units", JSON.stringify([...selUnits])); }

function renderAccueil(){
  const v = $("#view-accueil"); v.innerHTML="";
  const seen = Object.keys(S.srs).filter(isSeen).length;
  const due = Object.keys(S.srs).filter(isDue).length;
  const mast = Object.keys(S.srs).filter(isMastered).length;

  v.append(
    el("h2",null,"Tableau de bord"),
    el("p",{class:"lede"},"Coche tes unités, puis lance une session dans Apprendre ou entraîne-toi aux pièges de sens dans Polysémie. Ta progression est enregistrée sur cet appareil — exporte ton code dans Suivi pour l'envoyer à ton professeur."),
    el("div",{class:"card"},
      el("label",{for:"student-name",style:"font-weight:600;font-size:.9rem"},"Ton nom (apparaît dans le code exporté)"),
      el("input",{id:"student-name",class:"typed",style:"margin-top:8px",value:S.name||"",placeholder:"Prénom + initiale, ex. Sophie K.",
        oninput:e=>{S.name=e.target.value.trim(); save();}})
    ),
    el("div",{class:"kpi-row"},
      kpi(CORPUS.length,"mots au total"),
      kpi(seen,"mots rencontrés"),
      kpi(due,"révisions dues"),
      kpi(mast,"mots maîtrisés")
    ),
    el("div",{class:"section-label"},"Unités"),
    unitGrid(),
    el("div",{class:"btn-row"},
      el("button",{class:"btn primary",onclick:()=>go("apprendre")},"Apprendre ces unités →"),
      el("button",{class:"btn",onclick:()=>go("polysemie")},"Laboratoire de polysémie →")
    )
  );
}
function kpi(n,l){ return el("div",{class:"kpi"}, el("div",{class:"n"},String(n)), el("div",{class:"l"},l)); }
function unitGrid(){
  const g = el("div",{class:"unit-grid"});
  UNIT_ORDER.forEach(uid=>{
    const u = UNITS[uid];
    const seen = u.ids.filter(isSeen).length, mast = u.ids.filter(isMastered).length;
    const tile = el("label",{class:"unit-tile"+(selUnits.has(uid)?" on":"")},
      el("input",{type:"checkbox", ...(selUnits.has(uid)?{checked:""}:{}),
        onchange:e=>{ e.target.checked?selUnits.add(uid):selUnits.delete(uid); saveUnits(); tile.classList.toggle("on",e.target.checked); }}),
      el("div",{style:"flex:1"},
        el("div",{class:"u-code"},uid),
        el("div",{class:"u-name"},u.name),
        el("div",{class:"u-meta"},`${u.ids.length} mots · ${seen} vus · ${mast} maîtrisés`),
        el("div",{class:"u-bar"}, el("i",{style:"width:"+pct(mast,u.ids.length)+"%"}))
      )
    );
    g.append(tile);
  });
  return g;
}

/* ═════════ APPRENDRE ═════════ */
let cfg = {mode:"qcm", len:20};
function renderApprendreConfig(){
  const v=$("#view-apprendre"); v.innerHTML="";
  const ids = [...selUnits].flatMap(u=>UNITS[u]?UNITS[u].ids:[]);
  const due = ids.filter(isDue).length, fresh = ids.filter(id=>!isSeen(id)).length;
  v.append(
    el("h2",null,"Apprendre"),
    el("p",{class:"lede"},
      selUnits.size ? `Unités : ${[...selUnits].join(", ")} — ${ids.length} mots · ${due} dus en révision · ${fresh} nouveaux.` :
      "Aucune unité sélectionnée — retourne au tableau de bord pour en choisir."),
    el("div",{class:"card"},
      el("h3",null,"Mode"),
      pills([["cartes","Cartes (auto-évaluation)"],["qcm","QCM"],["ecrit","Écrit (anglais → français)"]], cfg.mode, m=>cfg.mode=m),
      el("h3",{style:"margin-top:18px"},"Longueur de la session"),
      pills([["10","10"],["20","20"],["30","30"],["50","50"]], String(cfg.len), n=>cfg.len=+n),
      el("div",{class:"btn-row"},
        el("button",{class:"btn primary",onclick:startSession, ...(ids.length?{}:{disabled:""})},"Commencer la session"))
    )
  );
}
function pills(items, current, on){
  const w = el("div",{class:"pill-select"});
  items.forEach(([val,label])=>{
    const b = el("button",{class:val===current?"on":"", onclick:()=>{ on(val); [...w.children].forEach(c=>c.classList.remove("on")); b.classList.add("on"); }},label);
    w.append(b);
  });
  return w;
}

let sess = null;
function startSession(){
  const ids = [...selUnits].flatMap(u=>UNITS[u]?UNITS[u].ids:[]);
  const due = shuffle(ids.filter(isDue));
  const fresh = shuffle(ids.filter(id=>!isSeen(id)));
  const learning = shuffle(ids.filter(id=>isSeen(id)&&!isDue(id)));
  const queue = due.concat(fresh, learning).slice(0, cfg.len);
  sess = {queue, i:0, ok:0, mode:cfg.mode, wrong:[]};
  renderQuestion();
}
function sessionChrome(v){
  v.innerHTML="";
  const p = pct(sess.i, sess.queue.length);
  v.append(el("div",{class:"session-bar"},
    el("button",{class:"btn small ghost",onclick:()=>renderApprendreConfig()},"← Quitter"),
    el("div",{class:"progress"}, el("i",{style:"width:"+p+"%"})),
    el("span",{class:"session-count"},`${sess.i+1} / ${sess.queue.length}`),
    el("span",{class:"score-pill"},`✓ ${sess.ok}`)
  ));
}
function renderQuestion(){
  const v=$("#view-apprendre");
  if(sess.i>=sess.queue.length) return renderSessionEnd(v);
  sessionChrome(v);
  const id = sess.queue[sess.i], e = byId[id];
  if(sess.mode==="cartes") qFlash(v,e);
  else if(sess.mode==="ecrit") qTyped(v,e);
  else qMcq(v,e);
}
function entryCard(top, meta, ...kids){
  return el("div",{class:"entry"},
    el("div",{class:"entry-meta"},meta),
    top, ...kids);
}
function nextBtn(label){ return el("div",{class:"btn-row"}, el("button",{class:"btn primary",onclick:()=>{sess.i++; renderQuestion();}},label||"Suivant →")); }

/* — flashcards — */
function qFlash(v,e){
  const card = entryCard(
    el("div",{class:"headword"},e.fr.join(" ; ")),
    `${e.lesson} · ${e.lessonTitle}`
  );
  const reveal = el("div",{class:"btn-row"},
    el("button",{class:"btn primary",onclick:()=>{
      reveal.remove();
      card.append(
        el("div",{class:"fc-back"},
          el("div",{class:"entry-meta"},"anglais"),
          el("div",{class:"fc-answers"},e.en.join(" ; "))),
        el("div",{class:"grade-row"},
          el("button",{class:"btn g-again",onclick:()=>grade(1)},"Encore"),
          el("button",{class:"btn g-hard",onclick:()=>grade(3)},"Difficile"),
          el("button",{class:"btn g-good",onclick:()=>grade(4)},"Bien"),
          el("button",{class:"btn g-easy",onclick:()=>grade(5)},"Facile"))
      );
    }},"Voir la réponse"));
  function grade(q){ srsGrade(e.id,q); if(q>=3)sess.ok++; else sess.wrong.push(e.id); sess.i++; renderQuestion(); }
  v.append(card, reveal);
}

/* — MCQ (alternating direction, collision traps in EN→FR) — */
function qMcq(v,e){
  const frDir = Math.random()<0.5;
  let options, correctText, prompt, meta;
  if(frDir){ // FR shown → pick EN
    prompt = el("div",{class:"headword"},e.fr[0]);
    meta = `${e.lesson} · français → anglais`;
    correctText = e.en.join(" ; ");
    const pool = UNITS[e.unit].lessons[e.lesson].ids.filter(x=>x!==e.id);
    const wide = UNITS[e.unit].ids.filter(x=>x!==e.id);
    const dis = sample(pool.length>=3?pool:wide,3).map(x=>byId[x].en.join(" ; "));
    options = shuffle([correctText, ...dis]);
  } else { // EN shown → pick FR, force a collision trap when available
    prompt = el("div",{class:"headword",style:"font-family:var(--font-body);font-weight:600;font-size:1.5rem"},e.en[0]);
    meta = `${e.lesson} · anglais → français`;
    correctText = e.fr[0];
    const excl = new Set([e.id]);
    let dis = [];
    (COLL_OF[e.id]||[]).slice(0,1).forEach(c=>{
      c.ids.filter(x=>x!==e.id && byId[x]).slice(0,2).forEach(x=>{dis.push(byId[x].fr[0]); excl.add(x);});
    });
    const pool = UNITS[e.unit].lessons[e.lesson].ids.filter(x=>!excl.has(x));
    dis = dis.concat(sample(pool,3-dis.length>0?3-dis.length:1).map(x=>byId[x].fr[0])).slice(0,3);
    options = shuffle([correctText, ...dis]);
  }
  const card = entryCard(prompt, meta);
  const opts = el("div",{class:"opts"});
  const isTrap = !frDir && (COLL_OF[e.id]||[]).length>0;
  options.forEach((txt,i)=>{
    const b = el("button",{class:"opt",onclick:()=>{
      const ok = txt===correctText;
      [...opts.children].forEach(o=>{o.disabled=true; if(o.textContent.includes(correctText))o.classList.add("good");});
      if(!ok) b.classList.add("bad");
      card.append(el("div",{class:"feedback "+(ok?"good":"bad")},
        ok? "Exact." : `Non — la bonne réponse est « ${correctText} ».`,
        (!ok && isTrap)? el("span",{class:"note"},"Piège de traduction : plusieurs mots français partagent cette traduction anglaise. Va les départager dans le Laboratoire de polysémie."):null));
      srsGrade(e.id, ok?4:1); if(ok)sess.ok++; else sess.wrong.push(e.id);
      card.append(nextBtn());
    }}, el("span",{class:"k"},"ABCD"[i]), txt);
    opts.append(b);
  });
  card.append(opts);
  v.append(card);
}

/* — typed EN→FR — */
function qTyped(v,e){
  const card = entryCard(
    el("div",{class:"headword",style:"font-family:var(--font-body);font-weight:600;font-size:1.5rem"},e.en[0]),
    `${e.lesson} · écris le mot français (avec l'article)`);
  const inp = el("input",{class:"typed",type:"text",autocapitalize:"off",autocomplete:"off",spellcheck:"false",placeholder:"ta réponse…"});
  const rowB = el("div",{class:"btn-row"});
  const check = el("button",{class:"btn primary"},"Vérifier");
  check.addEventListener("click", doCheck);
  inp.addEventListener("keydown",ev=>{ if(ev.key==="Enter") doCheck(); });
  function doCheck(){
    const raw = normFr(inp.value); if(!raw) return;
    const variants = e.fr.map(normFr);
    let q, msg, cls;
    if(variants.includes(raw)){ q=5; msg="Parfait."; cls="good"; }
    else if(variants.map(stripAcc).includes(stripAcc(raw))){ q=4; msg=`Presque — attention aux accents : « ${e.fr[0]} ».`; cls="good"; }
    else if(variants.map(x=>stripArt(x)).includes(stripArt(raw)) || variants.map(x=>stripAcc(stripArt(x))).includes(stripAcc(stripArt(raw)))){
      q=3; msg=`Le mot est bon, mais vérifie l'article : « ${e.fr[0]} ».`; cls="good";
    } else { q=1; msg=`Non — la réponse attendue : « ${e.fr.join(" ; ")} ».`; cls="bad"; }
    srsGrade(e.id,q); if(q>=3)sess.ok++; else sess.wrong.push(e.id);
    inp.disabled=true; check.disabled=true;
    card.append(el("div",{class:"feedback "+cls},msg), nextBtn());
  }
  rowB.append(check);
  card.append(inp,rowB);
  v.append(card);
  setTimeout(()=>inp.focus(),50);
}

function renderSessionEnd(v){
  v.innerHTML="";
  S.sessions.push({t:Date.now(), mode:sess.mode, n:sess.queue.length, ok:sess.ok, kind:"vocab"}); save();
  v.append(
    el("h2",null,"Session terminée"),
    el("div",{class:"kpi-row"},
      kpi(sess.queue.length,"questions"),
      kpi(sess.ok,"réussies"),
      kpi(pct(sess.ok,sess.queue.length)+" %","précision")),
    sess.wrong.length? el("div",{class:"card"},
      el("h3",null,"À revoir"),
      el("p",{style:"margin:6px 0 0"}, sess.wrong.map(id=>byId[id].fr[0]).join(" · "))): null,
    el("div",{class:"btn-row"},
      el("button",{class:"btn primary",onclick:startSession},"Nouvelle session"),
      el("button",{class:"btn",onclick:()=>go("suivi")},"Voir mon suivi"))
  );
}

/* ═════════ POLYSÉMIE ═════════ */
let pcfg = {drill:"sens", len:10};
function renderPolyConfig(){
  const v=$("#view-polysemie"); v.innerHTML="";
  const nPoly = POLYSEMY.filter(g=>g.kind==="poly").length;
  const nCon = POLYSEMY.filter(g=>g.kind==="contrast").length;
  v.append(
    el("h2",null,"Laboratoire de polysémie"),
    el("p",{class:"lede"},`Un mot, plusieurs sens — un sens, plusieurs mots. ${nPoly} mots français polysémiques, ${nCon} groupes de contraste anglais → français, et ${COLLISIONS.length} pièges détectés automatiquement dans ton vocabulaire. Le contexte décide toujours.`),
    el("div",{class:"card"},
      el("h3",null,"Exercice"),
      pills([
        ["sens","Sens en contexte (FR → EN)"],
        ["mot","Le bon mot (EN → FR)"],
        ["tri","Tri des sens (associer)"],
        ["valables","Toutes les traductions valables"]
      ], pcfg.drill, d=>pcfg.drill=d),
      el("h3",{style:"margin-top:18px"},"Nombre de questions"),
      pills([["5","5"],["10","10"],["15","15"]], String(pcfg.len), n=>pcfg.len=+n),
      el("div",{class:"btn-row"}, el("button",{class:"btn primary",onclick:startPoly},"Commencer"))
    )
  );
}
let psess=null;
function startPoly(){
  let items=[];
  if(pcfg.drill==="sens"){
    // each item: (group of kind poly, target sense index)
    POLYSEMY.filter(g=>g.kind==="poly").forEach(g=>g.senses.forEach((s,i)=>items.push({g,si:i})));
  } else if(pcfg.drill==="mot"){
    POLYSEMY.filter(g=>g.kind==="contrast").forEach(g=>g.senses.forEach((s,i)=>items.push({g,si:i})));
  } else if(pcfg.drill==="tri"){
    POLYSEMY.filter(g=>g.senses.length>=2).forEach(g=>items.push({g}));
  } else {
    COLLISIONS.filter(c=>c.ids.filter(id=>byId[id]).length>=3).forEach(c=>items.push({c}));
  }
  // prioritise weakest: sort by accuracy asc (unseen counts as 60%)
  items = shuffle(items).sort((a,b)=>polyAcc(a)-polyAcc(b)).slice(0, pcfg.len);
  psess={items:shuffle(items), i:0, ok:0, drill:pcfg.drill};
  renderPolyQ();
}
function polyAcc(it){
  if(it.c) { const st=S.coll[it.c.en]; return st? (st.a? st.c/st.a : .6) : .6; }
  const gs=S.poly[it.g.id]; if(!gs) return .6;
  if(it.si!=null){ const st=gs[it.si]; return st&&st.a? st.c/st.a : .6; }
  let a=0,c=0; Object.values(gs).forEach(s=>{a+=s.a;c+=s.c;}); return a? c/a : .6;
}
function polyChrome(v){
  v.innerHTML="";
  const p=pct(psess.i,psess.items.length);
  v.append(el("div",{class:"session-bar"},
    el("button",{class:"btn small ghost",onclick:renderPolyConfig},"← Quitter"),
    el("div",{class:"progress"},el("i",{style:"width:"+p+"%"})),
    el("span",{class:"session-count"},`${psess.i+1} / ${psess.items.length}`),
    el("span",{class:"score-pill"},`✓ ${psess.ok}`)));
}
function pNext(){ psess.i++; renderPolyQ(); }
function renderPolyQ(){
  const v=$("#view-polysemie");
  if(psess.i>=psess.items.length){ return polyEnd(v); }
  polyChrome(v);
  const it=psess.items[psess.i];
  if(psess.drill==="sens") pqSens(v,it);
  else if(psess.drill==="mot") pqMot(v,it);
  else if(psess.drill==="tri") pqTri(v,it);
  else pqValables(v,it);
}
function headwordWithSup(head, si){
  const h=el("div",{class:"headword"},head);
  if(si!=null) h.append(el("sup",null,String(si+1)));
  return h;
}
/* — A. sense in context: FR ctx → choose EN gloss — */
function pqSens(v,it){
  const {g,si}=it, s=g.senses[si];
  const card = entryCard(headwordWithSup(g.head,si), "polysémie · quel est le sens ici ?");
  card.append(el("p",{class:"ctx",html:ctxHighlight(s.ctx)}));
  const order = shuffle(g.senses.map((_,i)=>i));
  const opts = el("div",{class:"opts"});
  order.forEach((idx,k)=>{
    const b=el("button",{class:"opt",onclick:()=>{
      const ok = idx===si;
      [...opts.children].forEach((o,j)=>{o.disabled=true; if(order[j]===si)o.classList.add("good");});
      if(!ok)b.classList.add("bad");
      polyRecord(g.id,si,idx,ok); if(ok)psess.ok++;
      card.append(el("div",{class:"feedback "+(ok?"good":"bad")},
        ok? `Oui — ici, ${g.head} = ${s.en} (${s.tag}).`
          : `Ici, le contexte impose « ${s.en} » (${s.tag}). Tu as choisi le sens « ${g.senses[idx].en} ».`,
        g.note? el("span",{class:"note"},g.note):null), nextBtnP());
    }}, el("span",{class:"k"},"ABCD"[k]), g.senses[idx].en, el("span",{class:"tag"},g.senses[idx].tag||""));
    opts.append(b);
  });
  card.append(opts); v.append(card);
}
/* — B. right word: gap ctx → choose FR — */
function pqMot(v,it){
  const {g,si}=it, s=g.senses[si];
  const card = entryCard(
    el("div",{class:"headword",style:"font-family:var(--font-body);font-weight:600;font-size:1.5rem"},"« "+g.head+" »"),
    "contraste · quel mot français convient ?");
  card.append(el("p",{class:"ctx",html:ctxGap(s.ctx)}));
  const order = shuffle(g.senses.map((_,i)=>i));
  const opts = el("div",{class:"opts"});
  order.forEach((idx,k)=>{
    const b=el("button",{class:"opt",onclick:()=>{
      const ok = idx===si;
      [...opts.children].forEach((o,j)=>{o.disabled=true; if(order[j]===si)o.classList.add("good");});
      if(!ok)b.classList.add("bad");
      polyRecord(g.id,si,idx,ok); if(ok)psess.ok++;
      card.append(el("div",{class:"feedback "+(ok?"good":"bad"),html:
        (ok? "Exact — " : `Non — c'est « ${esc(s.fr)} » (${esc(s.tag||"")}). `) + ctxFill(s.ctx)},
        g.note? el("span",{class:"note"},g.note):null), nextBtnP());
    }}, el("span",{class:"k"},"ABCD"[k]), g.senses[idx].fr, el("span",{class:"tag"},g.senses[idx].tag||""));
    opts.append(b);
  });
  card.append(opts); v.append(card);
}
/* — C. sort senses: match sentences ↔ glosses — */
function pqTri(v,it){
  const g=it.g;
  const card = entryCard(headwordWithSup(g.head,null), "tri des sens · associe chaque phrase à son sens");
  const left = shuffle(g.senses.map((_,i)=>i));   // sentences
  const right = shuffle(g.senses.map((_,i)=>i));  // glosses
  let selL=null, done=0, errs=0;
  const colL=el("div"), colR=el("div");
  const wrap=el("div",{class:"match-cols"},colL,colR);
  const lBtns={}, rBtns={};
  left.forEach(i=>{
    const b=el("button",{class:"opt",onclick:()=>{ if(b.classList.contains("paired"))return;
      Object.values(lBtns).forEach(x=>x.classList.remove("sel")); b.classList.add("sel"); selL=i; }},
      el("span",{html:ctxGap(g.senses[i].ctx)}));
    lBtns[i]=b; colL.append(b);
  });
  right.forEach(i=>{
    const b=el("button",{class:"opt",onclick:()=>{
      if(selL==null || b.classList.contains("paired")) return;
      const ok = i===selL;
      polyRecord(g.id, selL, i, ok);
      if(ok){ lBtns[selL].classList.remove("sel"); lBtns[selL].classList.add("paired"); b.classList.add("paired");
        lBtns[selL].querySelector(".gap") && (lBtns[selL].querySelector("span").innerHTML = ctxHighlight(g.senses[selL].ctx));
        done++; selL=null;
        if(done===g.senses.length){
          if(errs===0) psess.ok++;
          card.append(el("div",{class:"feedback "+(errs===0?"good":"info")},
            errs===0? "Toutes les paires du premier coup." : `Terminé — ${errs} erreur${errs>1?"s":""} en route.`,
            g.note? el("span",{class:"note"},g.note):null), nextBtnP());
        }
      } else { errs++; b.classList.add("bad"); setTimeout(()=>b.classList.remove("bad"),600); }
    }}, el("span",null, g.senses[i].fr+" — "+g.senses[i].en), el("span",{class:"tag"},g.senses[i].tag||""));
    rBtns[i]=b; colR.append(b);
  });
  card.append(wrap); v.append(card);
}
/* — D. all valid translations (auto collisions) — */
function pqValables(v,it){
  const c=it.c;
  const valid = c.ids.filter(id=>byId[id]);
  const validFr = valid.map(id=>byId[id].fr[0]);
  const decoyPool = CORPUS.filter(e=>!valid.includes(e.id) && !e.en.some(g=>g.toLowerCase().includes(c.en)));
  const decoys = sample(decoyPool, Math.max(2, 6-validFr.length)).map(e=>e.fr[0]);
  const all = shuffle(validFr.concat(decoys));
  const card = entryCard(
    el("div",{class:"headword",style:"font-family:var(--font-body);font-weight:600;font-size:1.5rem"},"« "+c.en+" »"),
    "piège détecté dans ton vocabulaire · coche TOUTES les traductions possibles");
  const opts=el("div",{class:"opts two-col"});
  const boxes=[];
  all.forEach(fr=>{
    const cb=el("input",{type:"checkbox"});
    boxes.push([cb,fr]);
    opts.append(el("label",{class:"opt check"},cb,el("span",null,fr)));
  });
  const row=el("div",{class:"btn-row"});
  const btn=el("button",{class:"btn primary",onclick:()=>{
    let hits=0,misses=0,fp=0;
    boxes.forEach(([cb,fr])=>{
      const isValid=validFr.includes(fr);
      const lab=cb.closest("label");
      if(isValid){ lab.classList.add(cb.checked?"good":"bad"); cb.checked?hits++:misses++; }
      else if(cb.checked){ lab.classList.add("bad"); fp++; }
      else lab.classList.add("dim");
      cb.disabled=true;
    });
    const perfect = misses===0 && fp===0;
    const st = S.coll[c.en]=S.coll[c.en]||{a:0,c:0}; st.a++; if(perfect){st.c++; psess.ok++;} save();
    btn.disabled=true;
    card.append(el("div",{class:"feedback "+(perfect?"good":"bad")},
      perfect? `Parfait — « ${c.en} » a bien ${validFr.length} traductions dans ton vocabulaire.`
        : `Traductions valables : ${validFr.join(" · ")}. (${hits} trouvées, ${misses} oubliées, ${fp} intruses.)`), nextBtnP());
  }},"Vérifier");
  row.append(btn);
  card.append(opts,row); v.append(card);
}
function nextBtnP(){ return el("div",{class:"btn-row"}, el("button",{class:"btn primary",onclick:pNext},"Suivant →")); }
function polyEnd(v){
  v.innerHTML="";
  S.sessions.push({t:Date.now(), mode:psess.drill, n:psess.items.length, ok:psess.ok, kind:"poly"}); save();
  v.append(
    el("h2",null,"Exercice terminé"),
    el("div",{class:"kpi-row"},
      kpi(psess.items.length,"questions"),
      kpi(psess.ok,"réussies"),
      kpi(pct(psess.ok,psess.items.length)+" %","précision")),
    el("div",{class:"btn-row"},
      el("button",{class:"btn primary",onclick:startPoly},"Recommencer"),
      el("button",{class:"btn",onclick:()=>go("suivi")},"Voir mes confusions"))
  );
}

/* ═════════ SUIVI ═════════ */
function confusionList(limit){
  const rows=[];
  Object.entries(S.poly).forEach(([gid,senses])=>{
    const g=POLY_BY_ID[gid]; if(!g)return;
    Object.entries(senses).forEach(([si,st])=>{
      Object.entries(st.conf).forEach(([ci,n])=>{
        rows.push({g, si:+si, ci:+ci, n});
      });
    });
  });
  rows.sort((a,b)=>b.n-a.n);
  return limit?rows.slice(0,limit):rows;
}
function renderSuivi(){
  const v=$("#view-suivi"); v.innerHTML="";
  const seenIds=Object.keys(S.srs).filter(isSeen);
  const seen=seenIds.length, mast=seenIds.filter(isMastered).length, due=seenIds.filter(isDue).length;
  let asks=0, oks=0; seenIds.forEach(id=>{asks+=S.srs[id].seen; oks+=S.srs[id].ok;});
  let pAsks=0,pOks=0; Object.values(S.poly).forEach(g=>Object.values(g).forEach(s=>{pAsks+=s.a;pOks+=s.c;}));

  v.append(
    el("h2",null,"Suivi"),
    el("p",{class:"lede"},"Ta progression, tes confusions de sens les plus fréquentes, et ton code à envoyer au professeur."),
    el("div",{class:"kpi-row"},
      kpi(seen+" ",Object.keys(byId).length? "mots vus / "+CORPUS.length : "mots vus"),
      kpi(mast,"maîtrisés (≥ 3 sem.)"),
      kpi(due,"révisions dues"),
      kpi(pct(oks,asks)+" %","précision vocabulaire"),
      kpi(pct(pOks,pAsks)+" %","précision polysémie")),
    el("div",{class:"section-label"},"Par unité")
  );
  const tbl=el("table",{class:"stats"},
    el("thead",null,el("tr",null,el("th",null,"Unité"),el("th",null,"Vus"),el("th",null,"Maîtrisés"),el("th",null,"Précision"),el("th",null,""))));
  const tb=el("tbody");
  UNIT_ORDER.forEach(uid=>{
    const u=UNITS[uid];
    const s=u.ids.filter(isSeen), m=u.ids.filter(isMastered);
    let a=0,c=0; s.forEach(id=>{a+=S.srs[id].seen;c+=S.srs[id].ok;});
    const acc=pct(c,a);
    tb.append(el("tr",null,
      el("td",null,el("b",null,uid)," ",u.name),
      el("td",{class:"num"},`${s.length}/${u.ids.length}`),
      el("td",{class:"num"},String(m.length)),
      el("td",{class:"num"},a? acc+" %":"—"),
      el("td",null,el("div",{class:"bar"},el("i",{class:acc<60?"low":acc<80?"warn":"",style:"width:"+(a?acc:0)+"%"})))));
  });
  tbl.append(tb); v.append(tbl);

  v.append(el("div",{class:"section-label"},"Confusions de sens les plus fréquentes"));
  const conf=confusionList(12);
  if(!conf.length) v.append(el("p",{style:"color:var(--muted)"},"Aucune donnée pour l'instant — fais quelques exercices de polysémie."));
  else{
    const w=el("div",{class:"card"});
    conf.forEach(r=>{
      w.append(el("span",{class:"conf-pair"},
        el("b",null,r.g.head)," : « ",r.g.senses[r.si].en," » confondu avec « ",r.g.senses[r.ci].en," » ×",String(r.n)));
    });
    v.append(w);
  }

  /* export */
  v.append(el("div",{class:"section-label"},"Envoyer au professeur"));
  const code = buildExportCode();
  const ta = el("textarea",{class:"code",readonly:""},code);
  v.append(el("div",{class:"card"},
    el("p",{style:"margin:0 0 10px"},"Copie ce code et colle-le dans le formulaire / e-mail indiqué par ton professeur. Il contient uniquement tes statistiques (aucune donnée personnelle au-delà du nom saisi)."),
    ta,
    el("div",{class:"btn-row"},
      el("button",{class:"btn primary",onclick:async()=>{ try{ await navigator.clipboard.writeText(code); }catch(e){ ta.select(); document.execCommand("copy"); } }},"Copier le code"),
      el("button",{class:"btn ghost",onclick:downloadBackup},"Sauvegarde complète (.json)"),
      el("button",{class:"btn ghost",onclick:restoreBackup},"Restaurer une sauvegarde"),
      el("button",{class:"btn ghost",style:"color:var(--rouge);border-color:var(--rouge)",onclick:()=>{
        if(confirm("Effacer toute la progression sur cet appareil ? Cette action est définitive.")){ localStorage.removeItem(LS); S=load(); renderSuivi(); }
      }},"Réinitialiser"))
  ));
}
function buildExportCode(){
  const u={};
  UNIT_ORDER.forEach(uid=>{
    const ids=UNITS[uid].ids, s=ids.filter(isSeen);
    if(!s.length) return;
    let a=0,c=0; s.forEach(id=>{a+=S.srs[id].seen;c+=S.srs[id].ok;});
    u[uid]=[s.length, ids.length, ids.filter(isMastered).length, pct(c,a)];
  });
  const confs=confusionList(8).map(r=>[r.g.id, r.g.head, r.g.senses[r.si].en, r.g.senses[r.ci].en, r.n]);
  let pAsks=0,pOks=0; Object.values(S.poly).forEach(g=>Object.values(g).forEach(s=>{pAsks+=s.a;pOks+=s.c;}));
  const payload={v:1, n:S.name||"(sans nom)", t:Date.now(),
    o:{seen:Object.keys(S.srs).filter(isSeen).length, total:CORPUS.length,
       mast:Object.keys(S.srs).filter(isMastered).length,
       sess:S.sessions.length, pAcc:pct(pOks,pAsks)},
    u, c:confs};
  return "LEXFR1."+btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}
function downloadBackup(){
  const blob=new Blob([JSON.stringify(S)],{type:"application/json"});
  const a=el("a",{href:URL.createObjectURL(blob),download:"lexique-sauvegarde.json"}); a.click();
}
function restoreBackup(){
  const inp=el("input",{type:"file",accept:".json"});
  inp.addEventListener("change",()=>{
    const f=inp.files[0]; if(!f)return;
    const r=new FileReader();
    r.onload=()=>{ try{ const s=JSON.parse(r.result); if(!s.srs) throw 0; S=s; save(); renderSuivi(); alert("Sauvegarde restaurée."); }
      catch(e){ alert("Fichier non reconnu — choisis une sauvegarde exportée depuis ce site."); } };
    r.readAsText(f);
  });
  inp.click();
}

/* init */
go("accueil");
})();
