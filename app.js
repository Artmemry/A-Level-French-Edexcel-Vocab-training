/* Le Lexique v2 — engine
   Typed recall only, both directions. Entries carry interchangeable variants:
   fr:[…] French forms, en:[…] English meanings. Any variant = correct; the
   full set is revealed after every answer.
   Data: window.CORPUS. Storage: localStorage "lexique-fr-v2".
*/
(function(){
"use strict";

/* ───────── state ───────── */
const LS="lexique-fr-v2", DAY=86400000;
let S=load();
function load(){
  try{ const r=localStorage.getItem(LS); if(r){ const s=JSON.parse(r); s.srs=s.srs||{}; s.sessions=s.sessions||[]; return s; } }catch(e){}
  return {name:"", srs:{}, sessions:[], created:Date.now()};
}
function save(){ try{ localStorage.setItem(LS, JSON.stringify(S)); }catch(e){} }

/* ───────── indexes ───────── */
const byId={}; CORPUS.forEach(e=>byId[e.id]=e);
const UNITS={}, UNIT_ORDER=[];
CORPUS.forEach(e=>{
  if(!UNITS[e.unit]){ UNITS[e.unit]={name:e.unitName, ids:[], lessons:{}, lessonOrder:[]}; UNIT_ORDER.push(e.unit); }
  const u=UNITS[e.unit]; u.ids.push(e.id);
  if(!u.lessons[e.lesson]){ u.lessons[e.lesson]={title:e.lessonTitle, ids:[]}; u.lessonOrder.push(e.lesson); }
  u.lessons[e.lesson].ids.push(e.id);
});

/* ───────── SM-2 ───────── */
function srsGet(id){ return S.srs[id]||(S.srs[id]={ef:2.5,int:0,reps:0,due:0,seen:0,ok:0,lapses:0}); }
function srsGrade(id,q){
  const r=srsGet(id);
  r.seen++; if(q>=3)r.ok++;
  if(q<3){ r.reps=0; r.int=0; r.lapses++; r.due=Date.now(); }
  else{ r.reps++;
    if(r.reps===1)r.int=1; else if(r.reps===2)r.int=6; else r.int=Math.round(r.int*r.ef);
    r.ef=Math.max(1.3, r.ef+(0.1-(5-q)*(0.08+(5-q)*0.02)));
    r.due=Date.now()+r.int*DAY;
  }
  save();
}
const isSeen=id=>{const r=S.srs[id];return r&&r.seen>0};
const isDue=id=>{const r=S.srs[id];return r&&r.seen>0&&r.due<=Date.now()};
const isMastered=id=>{const r=S.srs[id];return r&&r.int>=21};

/* ───────── utils ───────── */
const $=s=>document.querySelector(s);
function el(tag,attrs,...kids){
  const n=document.createElement(tag);
  if(attrs)for(const k in attrs){
    if(k==="class")n.className=attrs[k];
    else if(k==="html")n.innerHTML=attrs[k];
    else if(k.startsWith("on"))n.addEventListener(k.slice(2),attrs[k]);
    else n.setAttribute(k,attrs[k]);
  }
  kids.flat().forEach(c=>{ if(c==null)return; n.append(c.nodeType?c:document.createTextNode(c)); });
  return n;
}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pct(a,b){return b?Math.round(100*a/b):0}
function stripAcc(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/œ/g,"oe").replace(/æ/g,"ae")}
function normFr(s){return s.toLowerCase().replace(/’/g,"'").replace(/\s*\([^)]*\)/g,"").replace(/\.{3}$/,"").replace(/\s+/g," ").trim()}
function stripArt(s){return s.replace(/^(le |la |les |l'|un |une |des )/,"")}
function normEn(s){return s.toLowerCase().replace(/’/g,"'").replace(/-/g," ").replace(/\s*\([^)]*\)/g,"").replace(/\.{3}$/,"").replace(/[!?.]+$/,"").replace(/\s+/g," ").trim()}
function stripEnLead(s){return s.replace(/^(the |a |an |to )/,"")}
function lev1(a,b){ // true if levenshtein distance ≤1
  if(a===b)return true;
  if(Math.abs(a.length-b.length)>1)return false;
  let i=0,j=0,edits=0;
  while(i<a.length&&j<b.length){
    if(a[i]===b[j]){i++;j++;continue}
    if(++edits>1)return false;
    if(a.length>b.length)i++; else if(b.length>a.length)j++; else{i++;j++}
  }
  return edits+(a.length-i)+(b.length-j)<=1;
}

/* answer checking — returns {q, msg, cls} */
function checkFr(ans, entry){
  const raw=normFr(ans); if(!raw)return null;
  const vars=entry.fr.map(normFr);
  if(vars.includes(raw)) return {q:5,msg:"Exact.",cls:"good"};
  if(vars.map(stripAcc).includes(stripAcc(raw))) return {q:4,msg:"Bien — mais attention aux accents.",cls:"good"};
  if(vars.map(v=>stripArt(v)).includes(stripArt(raw))||vars.map(v=>stripAcc(stripArt(v))).includes(stripAcc(stripArt(raw))))
    return {q:3,msg:"Le mot est bon — vérifie l'article.",cls:"good"};
  if(vars.some(v=>lev1(stripAcc(stripArt(v)),stripAcc(stripArt(raw)))&&stripArt(v).length>=5))
    return {q:3,msg:"Presque — vérifie l'orthographe.",cls:"good"};
  return {q:1,msg:"Non.",cls:"bad"};
}
function checkEn(ans, entry){
  const raw=normEn(ans); if(!raw)return null;
  const vars=entry.en.map(normEn);
  if(vars.includes(raw)||vars.map(stripEnLead).includes(stripEnLead(raw)))
    return {q:5,msg:"Exact.",cls:"good"};
  if(vars.some(v=>lev1(stripEnLead(v),stripEnLead(raw))&&stripEnLead(v).length>=5))
    return {q:4,msg:"Bien — petite faute d'orthographe.",cls:"good"};
  return {q:1,msg:"Non.",cls:"bad"};
}

/* ───────── accent pad ─────────
   Only the characters that actually occur in the French lists. */
const ACCENTS=["é","è","à","ê","ç","ô","î","œ","ï","â","û","ë","ù"];
let padTarget=null;
const pad=(function(){
  const p=el("div",{class:"accent-pad hidden",role:"toolbar","aria-label":"Accents français"});
  ACCENTS.forEach(ch=>{
    const b=el("button",{type:"button",tabindex:"-1"},ch);
    b.addEventListener("mousedown",ev=>ev.preventDefault()); // keep input focus
    b.addEventListener("click",()=>{
      if(!padTarget)return;
      const st=padTarget.selectionStart??padTarget.value.length,
            en=padTarget.selectionEnd??padTarget.value.length;
      padTarget.setRangeText(ch,st,en,"end");
      padTarget.dispatchEvent(new Event("input",{bubbles:true}));
      padTarget.focus();
    });
    p.append(b);
  });
  document.body.append(p);
  return p;
})();
function showPad(input){ padTarget=input; pad.classList.remove("hidden"); document.body.classList.add("pad-on"); }
function hidePad(){ padTarget=null; pad.classList.add("hidden"); document.body.classList.remove("pad-on"); }

/* ───────── router ───────── */
const VIEWS=["accueil","revision","suivi"];
function go(v){
  hidePad();
  VIEWS.forEach(x=>{
    $("#view-"+x).classList.toggle("hidden",x!==v);
    $("#tab-"+x).setAttribute("aria-selected",x===v?"true":"false");
  });
  if(v==="accueil")renderAccueil();
  if(v==="revision")renderRevisionConfig();
  if(v==="suivi")renderSuivi();
  window.scrollTo(0,0);
}
VIEWS.forEach(v=>$("#tab-"+v).addEventListener("click",()=>go(v)));

function kpi(n,l){return el("div",{class:"kpi"},el("div",{class:"n"},String(n)),el("div",{class:"l"},l))}
function pills(items,current,on){
  const w=el("div",{class:"pill-select"});
  items.forEach(([val,label])=>{
    const b=el("button",{class:val===current?"on":"",onclick:()=>{on(val);[...w.children].forEach(c=>c.classList.remove("on"));b.classList.add("on")}},label);
    w.append(b);
  });
  return w;
}

/* ═════════ ACCUEIL — units → lessons → liste / practice ═════════ */
let openUnit=null;
function renderAccueil(){
  const v=$("#view-accueil"); v.innerHTML="";
  const due=Object.keys(S.srs).filter(isDue).length;
  v.append(
    el("h2",null,"Tes listes de vocabulaire"),
    el("p",{class:"lede"},"Les listes reprennent exactement le classeur : choisis une unité, puis une leçon. Consulte la liste ou entraîne-toi en tapant tes réponses — dans les deux sens. Ta progression reste sur cet appareil ; exporte ton code dans Suivi pour l'envoyer au professeur."),
    el("div",{class:"card"},
      el("label",{for:"student-name",style:"font-weight:600;font-size:.9rem"},"Ton nom (pour le code exporté)"),
      el("input",{id:"student-name",class:"typed",style:"margin-top:8px",value:S.name||"",placeholder:"Prénom + initiale, ex. Sophie K.",
        oninput:e=>{S.name=e.target.value.trim();save()}})),
    due? el("div",{class:"card",style:"margin-top:14px;border-color:var(--rouge)"},
      el("h3",null,due+" mot"+(due>1?"s":"")+" à réviser aujourd'hui"),
      el("div",{class:"btn-row"},el("button",{class:"btn primary",onclick:()=>go("revision")},"Lancer la révision →"))):null,
    el("div",{class:"section-label"},"Unités")
  );
  UNIT_ORDER.forEach(uid=>{
    const u=UNITS[uid];
    const mast=u.ids.filter(isMastered).length, seen=u.ids.filter(isSeen).length;
    const head=el("button",{class:"unit-tile",style:"width:100%",onclick:()=>{openUnit=openUnit===uid?null:uid;renderAccueil()}},
      el("div",{style:"flex:1"},
        el("div",{class:"u-code"},uid+(openUnit===uid?" ▾":" ▸")),
        el("div",{class:"u-name"},u.name),
        el("div",{class:"u-meta"},`${u.lessonOrder.length} leçons · ${u.ids.length} mots · ${seen} vus · ${mast} maîtrisés`),
        el("div",{class:"u-bar"},el("i",{style:"width:"+pct(mast,u.ids.length)+"%"}))));
    v.append(head);
    if(openUnit===uid){
      const wrap=el("div",{style:"margin:6px 0 14px 10px;display:grid;gap:6px"});
      u.lessonOrder.forEach(lid=>{
        const L=u.lessons[lid];
        const n=L.ids.length, m=L.ids.filter(isMastered).length, s=L.ids.filter(isSeen).length;
        let a=0,c=0; L.ids.forEach(id=>{const r=S.srs[id];if(r){a+=r.seen;c+=r.ok}});
        wrap.append(el("div",{class:"card",style:"display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 16px"},
          el("div",{style:"flex:1;min-width:220px"},
            el("div",{style:"font-weight:600"},`Leçon ${lid.split(".")[1]} — ${L.title} (${n} mots)`),
            el("div",{class:"u-meta"},`${s} vus · ${m} maîtrisés`+(a?` · ${pct(c,a)} % de précision`:"")),
            el("div",{class:"u-bar",style:"max-width:220px"},el("i",{style:"width:"+pct(m,n)+"%"}))),
          el("div",{class:"btn-row",style:"margin:0"},
            el("button",{class:"btn small ghost",onclick:()=>renderListe(uid,lid)},"Liste"),
            el("button",{class:"btn small primary",onclick:()=>startLesson(uid,lid)},"S'entraîner"))));
      });
      v.append(wrap);
    }
  });
}

/* — liste view: mirrors the workbook table — */
function renderListe(uid,lid){
  const v=$("#view-accueil"); v.innerHTML="";
  const u=UNITS[uid], L=u.lessons[lid];
  v.append(
    el("div",{class:"session-bar"},
      el("button",{class:"btn small ghost",onclick:renderAccueil},"← Retour aux unités"),
      el("button",{class:"btn small primary",style:"margin-left:auto",onclick:()=>startLesson(uid,lid)},"S'entraîner sur cette liste")),
    el("h2",null,`${uid} ${u.name} · Leçon ${lid.split(".")[1]} — ${L.title} (${L.ids.length} mots)`));
  const tbl=el("table",{class:"stats"},
    el("thead",null,el("tr",null,el("th",null,"Français"),el("th",null,"English"),el("th",{style:"width:70px"},"Statut"))));
  const tb=el("tbody");
  L.ids.forEach(id=>{
    const e=byId[id], r=S.srs[id];
    const st=isMastered(id)?"●":isSeen(id)?"◐":"○";
    const stTitle=isMastered(id)?"maîtrisé":isSeen(id)?"en cours":"pas encore vu";
    tb.append(el("tr",null,
      el("td",null,el("b",null,e.fr.join(" ; "))),
      el("td",null,e.en.join(" ; ")),
      el("td",{class:"num",title:stTitle,style:"color:"+(isMastered(id)?"var(--vert)":isSeen(id)?"var(--bleu)":"var(--muted)")},st)));
  });
  tbl.append(tb);
  v.append(tbl,
    el("p",{style:"font-size:.82rem;color:var(--muted);margin-top:10px"},"○ pas encore vu · ◐ en cours · ● maîtrisé (intervalle ≥ 3 semaines). Les formes séparées par « ; » sont interchangeables : n'importe laquelle compte juste."));
}

/* ═════════ SESSIONS (typed only) ═════════ */
let sess=null;
let lessonPrefs={dir:"mixte"};
function startLesson(uid,lid){
  const v=$("#view-accueil"); v.innerHTML="";
  const u=UNITS[uid], L=u.lessons[lid];
  v.append(
    el("div",{class:"session-bar"},el("button",{class:"btn small ghost",onclick:renderAccueil},"← Retour")),
    el("h2",null,`Leçon ${lid.split(".")[1]} — ${L.title} (${L.ids.length} mots)`),
    el("div",{class:"card"},
      el("h3",null,"Sens de traduction"),
      pills([["enfr","Anglais → Français"],["fren","Français → Anglais"],["mixte","Mixte"]],lessonPrefs.dir,d=>lessonPrefs.dir=d),
      el("div",{class:"btn-row"},
        el("button",{class:"btn primary",onclick:()=>{
          const ids=shuffle(L.ids);
          sess={queue:ids.map((id,i)=>({id,dir:lessonPrefs.dir==="mixte"?(i%2?"fren":"enfr"):lessonPrefs.dir})),
                i:0,ok:0,wrong:[],back:renderAccueil,label:`${uid} · Leçon ${lid.split(".")[1]}`,view:"#view-accueil"};
          renderQ();
        }},"Commencer — toute la leçon"))));
}

function renderRevisionConfig(){
  const v=$("#view-revision"); v.innerHTML="";
  const due=shuffle(Object.keys(S.srs).filter(isDue));
  v.append(
    el("h2",null,"Révision du jour"),
    el("p",{class:"lede"},due.length?
      `${due.length} mot${due.length>1?"s":""} arrivent à échéance (toutes unités confondues). La répétition espacée choisit pour toi.`:
      "Rien à réviser pour l'instant — entraîne-toi sur une leçon depuis l'accueil, et les mots reviendront ici au bon moment."),
    due.length? el("div",{class:"card"},
      el("h3",null,"Nombre de mots"),
      pills([["10","10"],["20","20"],["30","30"],["999","Tout"]],"20",n=>revLen=+n),
      el("div",{class:"btn-row"},el("button",{class:"btn primary",onclick:()=>{
        const q=due.slice(0,revLen).map((id,i)=>({id,dir:i%2?"fren":"enfr"}));
        sess={queue:q,i:0,ok:0,wrong:[],back:renderRevisionConfig,label:"Révision",view:"#view-revision"};
        renderQ();
      }},"Commencer")) ):null
  );
}
let revLen=20;

function renderQ(){
  const v=$(sess.view);
  hidePad();
  if(sess.i>=sess.queue.length)return sessionEnd(v);
  v.innerHTML="";
  const p=pct(sess.i,sess.queue.length);
  v.append(el("div",{class:"session-bar"},
    el("button",{class:"btn small ghost",onclick:sess.back},"← Quitter"),
    el("div",{class:"progress"},el("i",{style:"width:"+p+"%"})),
    el("span",{class:"session-count"},`${sess.i+1} / ${sess.queue.length}`),
    el("span",{class:"score-pill"},`✓ ${sess.ok}`)));
  const {id,dir}=sess.queue[sess.i], e=byId[id];
  const enfr=dir==="enfr";
  const promptTxt=enfr? e.en[0] : e.fr[0];
  const card=el("div",{class:"entry"},
    el("div",{class:"entry-meta"},`${sess.label} · ${enfr?"anglais → français (avec l'article)":"français → anglais"}`),
    el("div",{class:"headword",style:enfr?"font-family:var(--font-body);font-weight:600;font-size:1.5rem":""},promptTxt),
    (enfr?e.en:e.fr).length>1? el("div",{class:"gramm"},"aussi : "+(enfr?e.en:e.fr).slice(1).join(" ; ")):null);
  const inp=el("input",{class:"typed",type:"text",autocapitalize:"off",autocomplete:"off",spellcheck:"false",
    placeholder:enfr?"ta réponse en français…":"your answer in English…"});
  const row=el("div",{class:"btn-row"});
  const check=el("button",{class:"btn primary"},"Vérifier");
  let done=false;
  function doCheck(){
    if(done)return;
    const res=enfr? checkFr(inp.value,e) : checkEn(inp.value,e);
    if(!res)return;
    done=true;
    srsGrade(e.id,res.q);
    if(res.q>=3)sess.ok++; else sess.wrong.push(e.id);
    inp.disabled=true; check.disabled=true;
    hidePad();
    card.append(
      el("div",{class:"feedback "+res.cls},res.msg,
        el("span",{class:"note"},
          el("b",null,e.fr.join(" ; "))," — ",e.en.join(" ; "))),
      nextBtn());
  }
  check.addEventListener("click",doCheck);
  inp.addEventListener("keydown",ev=>{if(ev.key==="Enter")doCheck()});
  row.append(check);
  card.append(inp,row);
  v.append(card);
  if(enfr) showPad(inp);
  setTimeout(()=>inp.focus(),50);
}
function nextBtn(){
  const b=el("button",{class:"btn primary",onclick:()=>{sess.i++;renderQ()}},"Suivant →");
  setTimeout(()=>b.focus(),50);
  return el("div",{class:"btn-row"},b);
}
function sessionEnd(v){
  hidePad();
  v.innerHTML="";
  S.sessions.push({t:Date.now(),n:sess.queue.length,ok:sess.ok,label:sess.label});save();
  v.append(
    el("h2",null,"Session terminée"),
    el("div",{class:"kpi-row"},
      kpi(sess.queue.length,"questions"),
      kpi(sess.ok,"réussies"),
      kpi(pct(sess.ok,sess.queue.length)+" %","précision")),
    sess.wrong.length? el("div",{class:"card"},
      el("h3",null,"À revoir"),
      el("div",{style:"margin-top:8px"},
        sess.wrong.map(id=>el("div",{style:"padding:4px 0;border-bottom:1px solid var(--line)"},
          el("b",null,byId[id].fr.join(" ; "))," — ",byId[id].en.join(" ; "))))):null,
    el("div",{class:"btn-row"},
      el("button",{class:"btn primary",onclick:sess.back},"Continuer"),
      el("button",{class:"btn",onclick:()=>go("suivi")},"Voir mon suivi")));
}

/* ═════════ SUIVI ═════════ */
function renderSuivi(){
  const v=$("#view-suivi"); v.innerHTML="";
  const seenIds=Object.keys(S.srs).filter(isSeen);
  const seen=seenIds.length, mast=seenIds.filter(isMastered).length, due=seenIds.filter(isDue).length;
  let a=0,c=0; seenIds.forEach(id=>{a+=S.srs[id].seen;c+=S.srs[id].ok});
  v.append(
    el("h2",null,"Suivi"),
    el("p",{class:"lede"},"Ta progression par unité, tes leçons les plus fragiles, et ton code à envoyer au professeur."),
    el("div",{class:"kpi-row"},
      kpi(seen,"mots vus / "+CORPUS.length),
      kpi(mast,"maîtrisés (≥ 3 sem.)"),
      kpi(due,"révisions dues"),
      kpi(a?pct(c,a)+" %":"—","précision globale")),
    el("div",{class:"section-label"},"Par unité"));
  const tbl=el("table",{class:"stats"},
    el("thead",null,el("tr",null,el("th",null,"Unité"),el("th",null,"Vus"),el("th",null,"Maîtrisés"),el("th",null,"Précision"),el("th",null,""))));
  const tb=el("tbody");
  UNIT_ORDER.forEach(uid=>{
    const u=UNITS[uid], s=u.ids.filter(isSeen), m=u.ids.filter(isMastered);
    let ua=0,uc=0; s.forEach(id=>{ua+=S.srs[id].seen;uc+=S.srs[id].ok});
    const acc=pct(uc,ua);
    tb.append(el("tr",null,
      el("td",null,el("b",null,uid)," ",u.name),
      el("td",{class:"num"},`${s.length}/${u.ids.length}`),
      el("td",{class:"num"},String(m.length)),
      el("td",{class:"num"},ua?acc+" %":"—"),
      el("td",null,el("div",{class:"bar"},el("i",{class:acc<60?"low":acc<80?"warn":"",style:"width:"+(ua?acc:0)+"%"})))));
  });
  tbl.append(tb); v.append(tbl);

  /* weakest lessons */
  const rows=[];
  UNIT_ORDER.forEach(uid=>{
    const u=UNITS[uid];
    u.lessonOrder.forEach(lid=>{
      let la=0,lc=0; u.lessons[lid].ids.forEach(id=>{const r=S.srs[id];if(r){la+=r.seen;lc+=r.ok}});
      if(la>=5)rows.push({uid,lid,title:u.lessons[lid].title,acc:pct(lc,la),n:la});
    });
  });
  rows.sort((x,y)=>x.acc-y.acc);
  v.append(el("div",{class:"section-label"},"Leçons à retravailler"));
  if(!rows.length)v.append(el("p",{style:"color:var(--muted)"},"Pas encore assez de données — entraîne-toi sur quelques leçons."));
  else{
    const w=el("div",{class:"card"});
    rows.slice(0,8).forEach(r=>w.append(el("div",{style:"display:flex;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--line)"},
      el("div",{style:"flex:1"},el("b",null,`${r.uid} · Leçon ${r.lid.split(".")[1]}`)," — "+r.title),
      el("span",{class:"session-count"},r.acc+" %"),
      el("button",{class:"btn small ghost",onclick:()=>{go("accueil");renderListe(r.uid,r.lid)}},"Liste"))));
    v.append(w);
  }

  /* export */
  const code=buildExportCode();
  const ta=el("textarea",{class:"code",readonly:""},code);
  v.append(el("div",{class:"section-label"},"Envoyer au professeur"),
    el("div",{class:"card"},
      el("p",{style:"margin:0 0 10px"},"Copie ce code et transmets-le à ton professeur (e-mail, Teams…). Il ne contient que tes statistiques et le nom saisi à l'accueil."),
      ta,
      el("div",{class:"btn-row"},
        el("button",{class:"btn primary",onclick:async()=>{try{await navigator.clipboard.writeText(code)}catch(e){ta.select();document.execCommand("copy")}}},"Copier le code"),
        el("button",{class:"btn ghost",onclick:downloadBackup},"Sauvegarde complète (.json)"),
        el("button",{class:"btn ghost",onclick:restoreBackup},"Restaurer une sauvegarde"),
        el("button",{class:"btn ghost",style:"color:var(--rouge);border-color:var(--rouge)",onclick:()=>{
          if(confirm("Effacer toute la progression sur cet appareil ? Cette action est définitive.")){localStorage.removeItem(LS);S=load();renderSuivi()}
        }},"Réinitialiser"))));
}
function buildExportCode(){
  const u={};
  UNIT_ORDER.forEach(uid=>{
    const ids=UNITS[uid].ids, s=ids.filter(isSeen);
    if(!s.length)return;
    let a=0,c=0; s.forEach(id=>{a+=S.srs[id].seen;c+=S.srs[id].ok});
    u[uid]=[s.length,ids.length,ids.filter(isMastered).length,pct(c,a)];
  });
  // weakest lessons (≥5 answers), top 6
  const w=[];
  UNIT_ORDER.forEach(uid=>UNITS[uid].lessonOrder.forEach(lid=>{
    let a=0,c=0; UNITS[uid].lessons[lid].ids.forEach(id=>{const r=S.srs[id];if(r){a+=r.seen;c+=r.ok}});
    if(a>=5)w.push([lid,UNITS[uid].lessons[lid].title,pct(c,a)]);
  }));
  w.sort((x,y)=>x[2]-y[2]);
  const payload={v:1,n:S.name||"(sans nom)",t:Date.now(),
    o:{seen:Object.keys(S.srs).filter(isSeen).length,total:CORPUS.length,
       mast:Object.keys(S.srs).filter(isMastered).length,sess:S.sessions.length},
    u,w:w.slice(0,6)};
  return "LEXFR1."+btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}
function downloadBackup(){
  const blob=new Blob([JSON.stringify(S)],{type:"application/json"});
  const a=el("a",{href:URL.createObjectURL(blob),download:"lexique-sauvegarde.json"});a.click();
}
function restoreBackup(){
  const inp=el("input",{type:"file",accept:".json"});
  inp.addEventListener("change",()=>{
    const f=inp.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=()=>{try{const s=JSON.parse(r.result);if(!s.srs)throw 0;S=s;save();renderSuivi();alert("Sauvegarde restaurée.")}
      catch(e){alert("Fichier non reconnu — choisis une sauvegarde exportée depuis ce site.")}};
    r.readAsText(f);
  });
  inp.click();
}

go("accueil");
})();
