/* Le Lexique / El Léxico — engine v3
   Shared logic; language-specific parts live only in CFG and T blocks.
   v3 additions: direction-split SRS, dictation (TTS), leech deck, exam mode,
   weekly assignment, per-lesson export (code v2), print support.
*/
(function(){
"use strict";

/*CFG-START*/
const CFG={
  key:"fr",
  ls:"lexique-fr-v2",
  prefix:"LEXFR2.",
  ttsLang:"fr-FR",
  artRe:/^(le |la |les |l'|un |une |des )/,
  accents:["é","è","à","ê","ç","ô","î","œ","ï","â","û","ë","ù"],
  stop:"le la les un une des de du au aux a en y et ou que qui se me te nous vous son sa ses mon ma mes ton ta tes est sont etre avoir comme pour par avec sans plus tres deja dans sur ce cet cette d l n s c j qu tout toute tous toutes chez vers depuis entre quand ou ici la si tellement",
  FORMS_URL:"https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=dBTLADSljUaCn2NuzjLCTEWSzXdNOvRDicS2YScslGFURTU4UjdJOTZWSEQyQzRHRTUxNzk4OEpFNyQlQCNjPTEu",
  FORMS_FIELD_NAME:"r08cab71007074f60a012ed77717b62d2",
  FORMS_FIELD_CODE:"rbd3a09625c5c42399a03efd42ac1d5fa"
};
/*CFG-END*/

/*T-START*/
const T={
  padLabel:"Accents français",
  audioLabel:"Audio", audioTitle:"Prononcer automatiquement le mot en français",
  audioTest:"audio activé",
  voiceLabel:"Voix", voiceHint:"★ = la meilleure voix disponible sur cet appareil. Essaie les autres si elle ne te convient pas.",
  homeTitle:"Tes listes de vocabulaire",
  homeLede:"Les listes reprennent exactement le classeur : choisis une unité, puis une leçon. Consulte la liste ou entraîne-toi en tapant tes réponses — dans les deux sens. Ta progression reste sur cet appareil ; exporte ton code dans Suivi pour l'envoyer au professeur.",
  nameLabel:"Ton nom (pour le code exporté)",
  namePh:"Prénom + initiale, ex. Sophie K.",
  dueCard:n=>n+" carte"+(n>1?"s":"")+" à réviser aujourd'hui",
  startReview:"Lancer la révision →",
  unitsLabel:"Unités",
  unitMeta:(l,w,s,m)=>`${l} leçons · ${w} mots · ${s} vus · ${m} maîtrisés`,
  lessonLine:(n,t,c)=>`Leçon ${n} — ${t} (${c} mots)`,
  lessonMeta:(s,m)=>`${s} vus · ${m} maîtrisés`,
  accSuffix:" % de précision",
  list:"Liste", practise:"S'entraîner",
  backUnits:"← Retour aux unités", practiseThis:"S'entraîner sur cette liste",
  print:"Imprimer",
  colTarget:"Français", colEn:"English", colStatus:"Statut",
  stMast:"maîtrisé", stCur:"en cours", stNew:"pas encore vu",
  listLegend:"○ pas encore vu · ◐ en cours · ● maîtrisé (intervalle ≥ 3 semaines). Les formes séparées par « ; » sont interchangeables : n'importe laquelle compte juste.",
  back:"← Retour",
  dirLabel:"Sens de traduction",
  dirEnFr:"Anglais → Français", dirFrEn:"Français → Anglais", dirMix:"Mixte", dirDict:"Dictée 🔊",
  dictNoTts:"Ton navigateur n'offre pas de voix — dictée indisponible",
  startLesson:"Commencer — toute la leçon",
  reviewTitle:"Révision du jour",
  reviewLede:n=>`${n} carte${n>1?"s":""} arrivent à échéance (toutes unités, production d'abord). La répétition espacée choisit pour toi.`,
  reviewEmpty:"Rien à réviser pour l'instant — entraîne-toi sur une leçon depuis l'accueil, et les mots reviendront ici au bon moment.",
  nWords:"Nombre de mots", all:"Tout", start:"Commencer",
  quit:"← Quitter",
  metaEnFrArt:"anglais → français (avec l'article)", metaEnFr:"anglais → français",
  metaFrEn:"français → anglais", metaDict:"dictée — écoute et écris",
  replay:"🔊 Réécouter",
  alsoPrompt:"aussi : ",
  phTarget:"ta réponse en français…", phEn:"your answer in English…",
  check:"Vérifier", next:"Suivant →",
  exact:"Exact.", accentTier:"Bien — mais attention aux accents.",
  artTier:"Le mot est bon — vérifie l'article.",
  artWrong:"L'article n'est pas le bon — le genre compte comme de la grammaire.",
  typoTier:"Presque — vérifie l'orthographe.", wrong:"Non.",
  senseTier:"Sens correct — compare ta version avec celle de la liste.",
  selfOk:"Ma version est aussi valable", selfDone:"Acceptée ✓",
  phraseNear:"Sens correct — mais la citation exacte est celle ci-dessous.",
  enTypo:"Bien — petite faute d'orthographe.",
  altNote:v=>["Ta réponse « ",v," » figure aussi dans tes listes pour ce sens — les deux comptent."],
  sibNote:"Aussi dans tes listes pour ce sens : ",
  sessDone:"Session terminée", qs:"questions", right:"réussies", prec:"précision",
  toReview:"À revoir", cont:"Continuer", seeProgress:"Voir mon suivi",
  leechTitle:"Mots rebelles", leechCard:n=>`${n} mot${n>1?"s":""} rebelle${n>1?"s":""} — ratés encore et encore`,
  leechGo:"Les dompter →", leechLabel:"Rebelles",
  examTab:"Épreuve", examTitle:"Mode épreuve",
  examLede:"Des questions au hasard dans les unités choisies, sens mixte, aucune correction avant la fin — comme en vraie épreuve. Le résultat est enregistré dans ton code.",
  examUnits:"Unités de l'épreuve", examStart:"Commencer l'épreuve",
  examNeedUnits:"Choisis au moins une unité.",
  examDone:"Épreuve terminée", examScore:"note", examWrong:"Réponses incorrectes",
  examGiven:"ta réponse", examNone:"(vide)", examAgain:"Nouvelle épreuve",
  taskTitle:"Tâche de la semaine", taskDone:"faite ✓", taskPending:"à faire",
  progressTitle:"Suivi",
  progressLede:"Ta progression par unité, tes leçons les plus fragiles et ton code à envoyer au professeur.",
  kSeen:"mots vus / ", kMast:"maîtrisés (≥ 3 sem.)", kDue:"révisions dues",
  kProd:"précision production", kRec:"précision reconnaissance",
  byUnit:"Par unité",
  thUnit:"Unité", thSeen:"Vus", thMast:"Maîtrisés", thAcc:"Précision",
  weakLessons:"Leçons à retravailler",
  weakEmpty:"Pas encore assez de données — entraîne-toi sur quelques leçons.",
  weakLine:(u,n)=>`${u} · Leçon ${n}`,
  examsHist:"Tes épreuves",
  sendTitle:"Envoyer au professeur",
  sendFormsTxt:"Clique sur « Envoyer via MS Forms » : le formulaire s'ouvre avec ton nom et ton code déjà remplis — tu n'as plus qu'à appuyer sur Envoyer. Le code ne contient que tes statistiques et le nom saisi à l'accueil.",
  sendCopyTxt:"Copie ce code et transmets-le à ton professeur (e-mail, Teams…). Il ne contient que tes statistiques et le nom saisi à l'accueil.",
  sendForms:"Envoyer via MS Forms", copyCode:"Copier le code",
  sendPasteTxt:"Clique sur « Envoyer via MS Forms » : ton code est copié et le formulaire s\u2019ouvre. Colle le code dans la case « Code », écris ton nom et appuie sur Envoyer.",
  formsPasteHint:"Code copié. Colle-le dans la case « Code » du formulaire.",
  backup:"Sauvegarde complète (.json)", restore:"Restaurer une sauvegarde", reset:"Réinitialiser",
  resetConfirm:"Effacer toute la progression sur cet appareil ? Cette action est définitive.",
  restored:"Sauvegarde restaurée.", badFile:"Fichier non reconnu — choisis une sauvegarde exportée depuis ce site.",
  noName:"(sans nom)",
  backupFile:"lexique-sauvegarde.json",
  sessionLabel:(u,n)=>`${u} · Leçon ${n}`, reviewLabel:"Révision", examLabel:"Épreuve"
};
/*T-END*/

/* ───────── state & migration ───────── */
const DAY=86400000;
let S=load();
function load(){
  let s=null;
  try{ const r=localStorage.getItem(CFG.ls); if(r) s=JSON.parse(r); }catch(e){}
  if(!s) s={name:"",srs:{},sessions:[],exams:[],created:Date.now(),v:3};
  s.srs=s.srs||{}; s.sessions=s.sessions||[]; s.exams=s.exams||[]; if(s.audio===undefined)s.audio=true;
  if(!s.v||s.v<3){ // split legacy per-entry records into production/recognition
    const old=s.srs; s.srs={};
    Object.keys(old).forEach(id=>{
      if(id.indexOf("|")>=0){ s.srs[id]=old[id]; return; }
      s.srs[id+"|f"]=JSON.parse(JSON.stringify(old[id]));
      s.srs[id+"|r"]=JSON.parse(JSON.stringify(old[id]));
    });
    s.v=3;
  }
  return s;
}
function save(){ try{ localStorage.setItem(CFG.ls, JSON.stringify(S)); }catch(e){} }

/* ───────── indexes ───────── */
const K=CFG.key;
const byId={}; CORPUS.forEach(e=>byId[e.id]=e);
const UNITS={}, UNIT_ORDER=[];
CORPUS.forEach(e=>{
  if(!UNITS[e.unit]){ UNITS[e.unit]={name:e.unitName, ids:[], lessons:{}, lessonOrder:[]}; UNIT_ORDER.push(e.unit); }
  const u=UNITS[e.unit]; u.ids.push(e.id);
  if(!u.lessons[e.lesson]){ u.lessons[e.lesson]={title:e.lessonTitle, ids:[]}; u.lessonOrder.push(e.lesson); }
  u.lessons[e.lesson].ids.push(e.id);
});

/* ───────── SM-2, direction-split ─────────
   rec key = `${id}|f` production (EN → target)  ·  `${id}|r` recognition (target → EN) */
function rk(id,dir){ return id+"|"+(dir==="fren"?"r":"f"); }  // dict & enfr grade production
function srsGet(k){ return S.srs[k]||(S.srs[k]={ef:2.5,int:0,reps:0,due:0,seen:0,ok:0,lapses:0}); }
function srsGrade(id,dir,q){
  const r=srsGet(rk(id,dir));
  r.seen++; if(q>=3)r.ok++;
  if(q<3){ r.reps=0; r.int=0; r.lapses++; r.due=Date.now(); }
  else{ r.reps++;
    if(r.reps===1)r.int=1; else if(r.reps===2)r.int=6; else r.int=Math.round(r.int*r.ef);
    r.ef=Math.max(1.3, r.ef+(0.1-(5-q)*(0.08+(5-q)*0.02)));
    r.due=Date.now()+r.int*DAY;
  }
  save();
}
const recOf=(id,d)=>S.srs[id+"|"+d];
const isSeen=id=>{const f=recOf(id,"f"),r=recOf(id,"r");return (f&&f.seen>0)||(r&&r.seen>0)};
const isMastered=id=>{const f=recOf(id,"f");return f&&f.int>=21};          // production is the exam skill
function dueDirs(id){
  const out=[]; const f=recOf(id,"f"), r=recOf(id,"r");
  if(f&&f.seen>0&&f.due<=Date.now()) out.push("enfr");
  if(r&&r.seen>0&&r.due<=Date.now()) out.push("fren");
  return out;
}
const isDue=id=>dueDirs(id).length>0;
function leeches(){
  const out=[];
  Object.keys(S.srs).forEach(k=>{
    const r=S.srs[k];
    if(r.lapses>=3 && r.int<21){
      const [id,d]=k.split("|");
      if(byId[id]) out.push({id, dir:d==="r"?"fren":"enfr", lapses:r.lapses});
    }
  });
  return out.sort((a,b)=>b.lapses-a.lapses);
}

/* ───────── utils ───────── */
const $=s=>document.querySelector(s);
function el(tag,attrs,...kids){
  const n=document.createElement(tag);
  if(attrs)for(const k2 in attrs){
    if(k2==="class")n.className=attrs[k2];
    else if(k2==="html")n.innerHTML=attrs[k2];
    else if(k2.startsWith("on"))n.addEventListener(k2.slice(2),attrs[k2]);
    else n.setAttribute(k2,attrs[k2]);
  }
  kids.flat().forEach(c=>{ if(c==null)return; n.append(c.nodeType?c:document.createTextNode(c)); });
  return n;
}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pct(a,b){return b?Math.round(100*a/b):0}
function stripAcc(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/œ/g,"oe").replace(/æ/g,"ae")}
function normFr(s){return s.toLowerCase().replace(/’/g,"'").replace(/\s*\([^)]*\)/g,"").replace(/\.{3}$/,"").replace(/[¡!¿?]/g,"").replace(/\s+/g," ").trim()}
function stripArt(s){return s.replace(CFG.artRe,"")}
function expandEn(s){
  return s
   .replace(/\bcan't\b/g,"cannot").replace(/\bwon't\b/g,"will not").replace(/\bshan't\b/g,"shall not")
   .replace(/\bi'm\b/g,"i am")
   .replace(/\b(he|she|it|that|this|there|here|what|who|where|when|how|one|nobody|somebody|everybody)'s\b/g,"$1 is")
   .replace(/\blet's\b/g,"let us")
   .replace(/\b(\w+)n't\b/g,"$1 not")
   .replace(/\b(\w+)'ll\b/g,"$1 will")
   .replace(/\b(\w+)'ve\b/g,"$1 have")
   .replace(/\b(\w+)'re\b/g,"$1 are")
   .replace(/\b(\w+)'d\b/g,"$1 would");
}
function normEn(s){return expandEn(s.toLowerCase().replace(/’/g,"'")).replace(/-/g," ").replace(/(\w)iz(e[sdr]?|ing|ation)\b/g,"$1is$2").replace(/\s*\([^)]*\)/g,"").replace(/\.{3}$/,"").replace(/[!?.]+$/,"").replace(/\s+/g," ").trim()}

/* ───────── phrase marking ─────────
   Items of 4+ words (quotations, expressions) are marked on MEANING, not wording:
   content-word overlap, function words ignored, synonyms and 1-letter slips tolerated.
   Single words and short phrases keep the strict word-level rules. */
const EN_STOP=new Set(("a an the to of in on at for with by from as and or but if so than then that this these those "
 +"is are was were be been being am do does did done have has had will would shall should can could may might must "
 +"i you he she it we they me him her us them my your his its our their there here one ones s "
 +"into onto upon out over under about through across between within during after before again still just very own "
 +"all any some each every own more most much many").split(" "));
const TG_STOP=new Set(CFG.stop.split(" "));
function lightStem(w){
  return w.replace(/ies$/,"y").replace(/([^aeiou])s$/,"$1").replace(/ing$/,"").replace(/ed$/,"")
          .replace(/([a-z])\1$/,"$1");
}
function toks(s,stop){
  return String(s).split(/[^\p{L}\p{N}']+/u).map(w=>w.toLowerCase().replace(/^'+|'+$/g,""))
    .filter(w=>w&&!stop.has(w)).map(lightStem).filter(w=>w.length>1);
}
/* multi-word equivalences collapsed to one token before scoring */
const EN_MULTI=[["blow up","explode"],["blows up","explode"],["blew up","explode"],["burst","explode"],
 ["take down","lower"],["takes down","lower"],["get down","lower"],["bring down","lower"],
 ["get away","move_away"],["go away","move_away"],["step away","move_away"],["move away","move_away"],
 ["speed up","hurry"],["speeds up","hurry"],["hurry up","hurry"],["bring forward","hurry"],
 ["get up","rise"],["got up","rise"],["gets up","rise"],["stand up","rise"],
 ["keep watch","watch"],["no longer","not_now"],["any more","not_now"],["anymore","not_now"]];
function preMulti(s){ let t=" "+s+" "; EN_MULTI.forEach(([a,b])=>{ t=t.split(" "+a+" ").join(" "+b+" ") }); return t.trim(); }
const enToks=s=>toks(preMulti(normEn(s)),EN_STOP);
/* extra English token equivalences for phrase marking (meaning, not wording) */
const EN_TOKSYN=[["explode","erupt"],["sink","drown"],["sorrow","grief"],["sorrow","mourning"],["grief","mourning"],
 ["place","station"],["place","spot"],["remedy","cure"],["remedy","solution"],["gossip","rumour"],["gossip","talk"],
 ["gossip","litany"],["dishonour","shame"],["dishonour","disgrace"],["shame","disgrace"],["weakness","frailty"],
 ["sign","mark"],["watch","guard"],["storm","tempest"],["room","chamber"],["neighbour","neighbor"],
 ["darkness","dark"],["deserve","earn"],["sure","certain"],["poison","venom"],["blessed","praised"],
 ["celestial","spiritual"],["celestial","heavenly"],["sky","heaven"],["pour","spill"],["pour","tip"],
 ["reed","rush"],["shore","bank"],["pony","mare"],["pony","horse"],["thing","matter"],["mean","meaning"],
 ["sweep","wipe"],["step","pace"],["never","not"],["woman","women"],["want","love"]];
const tgToks=s=>toks(stripAcc(normFr(s)),TG_STOP);
/* token-level synonyms are built later, once the synonym layer has loaded */
const SYN_TOK={};
function tokMatch(a,b){
  if(a===b)return true;
  if(SYN_TOK[a]&&SYN_TOK[a].has(b))return true;
  return Math.max(a.length,b.length)>=4 && levDist(a,b,1)<=1;   // phrase scoring only
}
function overlap(ansT, expT){
  if(!expT.length) return {r:0,p:0};
  const used=new Array(ansT.length).fill(false);
  let hit=0;
  expT.forEach(e=>{
    for(let i=0;i<ansT.length;i++){ if(!used[i]&&tokMatch(e,ansT[i])){used[i]=true;hit++;return} }
  });
  return {r:hit/expT.length, p:ansT.length?hit/ansT.length:0};
}
/* short expected sets are brittle: 2 content words make one miss look like 50% failure,
   so the bar eases as the expected answer gets shorter. */
function phraseBars(expLen){
  // With very few content words, partial overlap cannot distinguish a paraphrase
  // from a different sentence ("women without a man" vs "men without work"),
  // so short items demand every content word.
  if(expLen<=2) return {full:1,   part:1};
  if(expLen===3)return {full:0.75,part:0.5};
  if(expLen===4)return {full:0.6, part:0.4};
  return {full:0.65,part:0.4};
}
function isPhrase(entry){
  return entry[K].some(v=>v.trim().split(/\s+/).length>=4)
      || entry.en.some(g=>g.trim().split(/\s+/).length>=4);
}
function bestOverlap(ans, list, tokFn){
  let best={r:0,p:0};
  list.forEach(x=>{ const s=overlap(tokFn(ans), tokFn(x)); if(s.r>best.r||(s.r===best.r&&s.p>best.p)) best=s; });
  return best;
}
function stripEnLead(s){return s.replace(/^(the |a |an |to )/,"")}
function levDist(a,b,max){
  if(a===b)return 0;
  if(Math.abs(a.length-b.length)>max)return max+1;
  let prev=Array(b.length+1).fill(0).map((_,i)=>i);
  for(let i=1;i<=a.length;i++){
    const cur=[i]; let rowMin=i;
    for(let j=1;j<=b.length;j++){
      cur[j]=Math.min(prev[j]+1, cur[j-1]+1, prev[j-1]+(a[i-1]===b[j-1]?0:1));
      if(cur[j]<rowMin)rowMin=cur[j];
    }
    if(rowMin>max)return max+1;
    prev=cur;
  }
  return prev[b.length];
}
function nearMiss(a,b){ // grammar-safe: suffix zone (last 2 chars of each word) must match exactly
  const ta=a.split(" "), tb=b.split(" ");
  if(ta.length!==tb.length) return false;
  const phraseTol=Math.max(a.length,b.length)>=12?2:1;
  let edits=0;
  for(let i=0;i<ta.length;i++){
    const wa=ta[i], wb=tb[i];
    if(wa===wb) continue;
    if(Math.max(wa.length,wb.length)<5) return false;
    if(wa.slice(-2)!==wb.slice(-2)) return false;
    const d=levDist(wa.slice(0,-2), wb.slice(0,-2), 2);
    if(d>2) return false;
    edits+=d; if(edits>phraseTol) return false;
  }
  return edits>0 && edits<=phraseTol;
}

/* ───────── cross-acceptance indexes ───────── */
function xLexkey(s){
  s=s.toLowerCase().replace(/’/g,"'").replace(/\s*\([^)]*\)/g,"");
  s=s.replace(CFG.artRe,"");
  s=s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/œ/g,"oe").replace(/-/g," ");
  return s.replace(/\s+/g," ").trim();
}
function xCanonEn(s){
  s=s.toLowerCase().replace(/’/g,"'").replace(/-/g," ").replace(/\s*\([^)]*\)/g,"");
  s=s.replace(/^(the |a |an |to )/,"").replace(/\.{3}$/,"");
  return s.replace(/\s+/g," ").trim();
}
const GLOSS_TO_ENTRIES={}, LEX_TO_GLOSSES={};
CORPUS.forEach(e=>{
  e.en.forEach(g=>{const c=xCanonEn(g);(GLOSS_TO_ENTRIES[c]=GLOSS_TO_ENTRIES[c]||[]).push(e)});
  e[K].forEach(f=>{const lk=xLexkey(f);const set=(LEX_TO_GLOSSES[lk]=LEX_TO_GLOSSES[lk]||new Set());e.en.forEach(g=>set.add(g))});
});
/* ───────── synonym layer (data/synonyms.js, optional) ───────── */
const _SY=(typeof window!=="undefined"&&window.SYNONYMS)?window.SYNONYMS:{tg:[],en:[]};
function synNorm(s){ return stripAcc(stripArt(normFr(s))); }
const SYN_TG_IDX={}, SYN_EN_IDX={};
(_SY.tg||[]).forEach(g=>{
  const words=Array.isArray(g)?g:(g.w||[]);
  const gate=Array.isArray(g)?null:(g.for||[]).map(xCanonEn);
  const rec={words,gate};
  words.forEach(w=>{const k=synNorm(w);(SYN_TG_IDX[k]=SYN_TG_IDX[k]||[]).push(rec)});
});
(_SY.en||[]).forEach(g=>{
  const words=Array.isArray(g)?g:(g.w||[]);
  const rec={words};
  words.forEach(w=>{const k=xCanonEn(w);(SYN_EN_IDX[k]=SYN_EN_IDX[k]||[]).push(rec)});
});
function gateOk(gate, entry){
  if(!gate||!gate.length) return true;
  const gl=entry.en.map(xCanonEn);
  return gate.some(g=>gl.some(x=>x===g||new RegExp("(^|\\s)"+g.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"($|\\s)").test(x)));
}
function synVariants(entry){
  const own=new Set(entry[K].map(synNorm)), out=[];
  entry[K].forEach(v=>{
    (SYN_TG_IDX[synNorm(v)]||[]).forEach(rec=>{
      if(!gateOk(rec.gate,entry))return;
      rec.words.forEach(w=>{ if(!own.has(synNorm(w)) && out.indexOf(w)<0) out.push(w); });
    });
  });
  return out;
}
function synGlosses(entry){
  const own=new Set(entry.en.map(xCanonEn)), out=[];
  entry.en.forEach(g=>{
    (SYN_EN_IDX[xCanonEn(g)]||[]).forEach(rec=>{
      rec.words.forEach(w=>{ if(!own.has(xCanonEn(w)) && out.indexOf(w)<0) out.push(w); });
    });
  });
  return out;
}

/* token-level synonyms from the layer's single-word groups (needs _SY above) */
(function(){
  const add=(a,b)=>{ (SYN_TOK[a]=SYN_TOK[a]||new Set()).add(b); (SYN_TOK[b]=SYN_TOK[b]||new Set()).add(a); };
  ((_SY.en||[]).concat(_SY.tg||[])).forEach(g=>{
    const words=(Array.isArray(g)?g:(g.w||[])).map(w=>String(w)
      .replace(/^(to |the |a |an |el |la |los |las |un |una |le |les |l'|des |du )/,"").trim());
    const single=words.filter(w=>w&&w.indexOf(" ")<0).map(w=>lightStem(stripAcc(w.toLowerCase())));
    for(let i=0;i<single.length;i++)for(let j=i+1;j<single.length;j++)
      if(single[i]!==single[j]) add(single[i],single[j]);
  });
  EN_TOKSYN.forEach(([a,b])=>add(lightStem(a),lightStem(b)));
})();

const ANSWER_FORMS=new Set();
CORPUS.forEach(e=>e[K].forEach(v=>ANSWER_FORMS.add(stripAcc(stripArt(normFr(v))))));

/* ───────── answer checking ───────── */
function frTiers(raw, variants, allowFuzzy){
  const vars=variants.map(normFr);
  if(vars.includes(raw)) return {q:5,msg:T.exact,cls:"good"};
  if(vars.map(stripAcc).includes(stripAcc(raw))) return {q:4,msg:T.accentTier,cls:"good"};
  const rawHasArt = raw!==stripArt(raw);
  if(vars.map(v=>stripArt(v)).includes(stripArt(raw))||vars.map(v=>stripAcc(stripArt(v))).includes(stripAcc(stripArt(raw)))){
    const target=variants.map(normFr).find(v=>stripAcc(stripArt(v))===stripAcc(stripArt(raw)));
    const varHasArt = target && target!==stripArt(target);
    if(rawHasArt && varHasArt){
      const ra=raw.match(CFG.artRe)[0], va=target.match(CFG.artRe)[0];
      if(ra!==va) return {q:1,msg:T.artWrong,cls:"bad"};
    }
    if(rawHasArt && !varHasArt) return {q:5,msg:T.exact,cls:"good"};
    return {q:3,msg:T.artTier,cls:"good"};
  }
  if(allowFuzzy && vars.some(v=>nearMiss(stripAcc(stripArt(v)),stripAcc(stripArt(raw)))))
    return {q:3,msg:T.typoTier,cls:"good"};
  return null;
}
function checkFr(ans, entry, promptedGloss){
  const raw=normFr(ans); if(!raw)return null;
  const rawForm=stripAcc(stripArt(raw));
  const own=frTiers(raw, entry[K], false);
  if(own) return own;
  const sibs=(GLOSS_TO_ENTRIES[xCanonEn(promptedGloss||entry.en[0])]||[]).filter(x=>x.id!==entry.id);
  for(const s of sibs){
    const hit=frTiers(raw, s[K], false);
    if(hit) return {...hit, alt:s};
  }
  // curated synonym layer: any interchangeable form for this entry's sense
  const syn=synVariants(entry);
  for(const w of syn){
    const hit=frTiers(raw, [w], false);
    if(hit) return {...hit, altTxt:w};
  }
  const inPool=[entry].concat(sibs).some(x=>x[K].some(v=>stripAcc(stripArt(normFr(v)))===rawForm))
    || syn.some(w=>stripAcc(stripArt(normFr(w)))===rawForm);
  const allowFuzzy=inPool || !ANSWER_FORMS.has(rawForm);
  if(allowFuzzy){
    const own2=frTiers(raw, entry[K], true);
    if(own2) return own2;
    for(const s of sibs){
      const hit=frTiers(raw, s[K], true);
      if(hit) return {...hit, alt:s};
    }
    for(const w of syn){
      const hit=frTiers(raw, [w], true);
      if(hit) return {...hit, altTxt:w};
    }
  }
  if(isPhrase(entry)){                       // quotation recalled with different wording
    let best={r:0,p:0,n:0};
    entry[K].concat(syn).forEach(v=>{ const t=tgToks(v); const s=overlap(tgToks(ans),t);
      if(s.r>best.r||(s.r===best.r&&s.p>best.p)) best={...s,n:t.length}; });
    const bar=phraseBars(best.n);
    if(best.r>=bar.part && best.p>=0.25) return {q:3,msg:T.phraseNear,cls:"good"};
  }
  return {q:1,msg:T.wrong,cls:"bad"};
}
function checkEn(ans, entry){
  const raw=normEn(ans); if(!raw)return null;
  const pool=new Set(entry.en);
  entry[K].forEach(f=>{const s=LEX_TO_GLOSSES[xLexkey(f)]; if(s)s.forEach(g=>pool.add(g))});
  synGlosses(entry).forEach(g=>pool.add(g));
  const vars=[...pool].map(normEn);
  if(vars.includes(raw)||vars.map(stripEnLead).includes(stripEnLead(raw)))
    return {q:5,msg:T.exact,cls:"good"};
  if(vars.some(v=>nearMiss(stripEnLead(v),stripEnLead(raw))))
    return {q:4,msg:T.enTypo,cls:"good"};
  if(isPhrase(entry)){                       // meaning-level marking for quotations/expressions
    let best={r:0,p:0,n:0};
    [...pool].forEach(g=>{ const t=enToks(g); const s=overlap(enToks(ans),t);
      if(s.r>best.r||(s.r===best.r&&s.p>best.p)) best={...s,n:t.length}; });
    const bar=phraseBars(best.n);
    if(best.r>=bar.full && best.p>=0.4)  return {q:5,msg:T.exact,cls:"good"};
    if(best.r>=bar.part && best.p>=0.25) return {q:3,msg:T.senseTier,cls:"good"};
  }
  return {q:1,msg:T.wrong,cls:"bad"};
}

/* ───────── TTS ───────── */
const ttsOK="speechSynthesis" in window;
let _voice=null;
/* Voice quality varies enormously between the voices installed on a device.
   Rank them instead of taking whichever the browser lists first. */
function voiceScore(v){
  const n=(v.name||""), ln=n.toLowerCase(), lang=(v.lang||"").replace("_","-");
  let s=0;
  if(lang===CFG.ttsLang) s+=40; else if(lang.toLowerCase().startsWith(CFG.ttsLang.split("-")[0])) s+=15;
  // modern neural engines
  if(/natural|neural|premium|enhanced|siri|wavenet|studio/.test(ln)) s+=45;
  if(/google/.test(ln)) s+=30;             // Chrome's server voices — clearly better than local ones
  if(v.localService===false) s+=20;        // network voices are generally the good ones
  if(/online/.test(ln)) s+=10;
  // known-decent named system voices
  if(/thomas|am(é|e)lie|audrey|marie|denise|henri|c(é|e)line|mónica|monica|paulina|jorge|helena|elvira|sabina|lucia|alvaro/.test(ln)) s+=12;
  // known-poor engines
  if(/espeak|compact|festival|pico|robot/.test(ln)) s-=60;
  if(/eloquence/.test(ln)) s-=30;
  return s;
}
function voiceList(){
  if(!ttsOK)return [];
  const base=CFG.ttsLang.split("-")[0].toLowerCase();
  return (speechSynthesis.getVoices()||[])
    .filter(v=>v.lang&&v.lang.toLowerCase().replace("_","-").startsWith(base))
    .sort((a,b)=>voiceScore(b)-voiceScore(a));
}
function pickVoice(){
  const vs=voiceList();
  if(!vs.length)return null;
  if(S.voice){ const saved=vs.find(v=>v.name===S.voice); if(saved)return saved; }
  return vs[0];
}
if(ttsOK&&speechSynthesis.addEventListener) speechSynthesis.addEventListener("voiceschanged",()=>{_voice=pickVoice()});
/* iOS/Safari require a user gesture before any speech is allowed */
let _unlocked=false;
function unlockTts(){
  if(_unlocked||!ttsOK)return;
  _unlocked=true;
  try{const u=new SpeechSynthesisUtterance(" ");u.volume=0;speechSynthesis.speak(u)}catch(e){}
}
document.addEventListener("pointerdown",unlockTts,{once:true});
document.addEventListener("keydown",unlockTts,{once:true});
function speak(txt){
  if(!ttsOK)return;
  unlockTts();
  const u=new SpeechSynthesisUtterance(String(txt).replace(/\s*\([^)]*\)/g,"").replace(/;.*/,"").trim());
  _voice=_voice||pickVoice();
  if(_voice)u.voice=_voice;
  u.lang=CFG.ttsLang; u.rate=(S.rate||0.88); u.pitch=1;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
function autoSpeak(txt){ if(S.audio!==false) speak(txt); }
function audioToggle(){
  if(!ttsOK)return null;
  const b=el("button",{class:"btn small ghost",type:"button",title:T.audioTitle});
  const paint=()=>{ b.textContent=(S.audio===false?"🔇 ":"🔊 ")+T.audioLabel; };
  b.addEventListener("click",()=>{ S.audio=!(S.audio!==false); save(); paint(); if(S.audio!==false)speak(T.audioTest); });
  paint(); return b;
}
function voicePicker(){
  if(!ttsOK)return null;
  const vs=voiceList();
  if(vs.length<2)return null;                       // nothing to choose between
  const wrap=el("div",{style:"margin-top:10px"});
  const sel=el("select",{class:"typed",style:"margin-top:6px;font-size:.95rem",
    onchange:e=>{ S.voice=e.target.value; save(); _voice=pickVoice(); speak(T.audioTest); }});
  vs.forEach((v,i)=>{
    const o=el("option",{value:v.name}, v.name+(i===0?" ★":""));
    if((S.voice||vs[0].name)===v.name) o.setAttribute("selected","");
    sel.append(o);
  });
  wrap.append(el("label",{style:"font-weight:600;font-size:.9rem"},T.voiceLabel), sel,
    el("div",{style:"font-size:.8rem;color:var(--muted);margin-top:4px"},T.voiceHint));
  return wrap;
}
function speakBtn(txt,small){
  if(!ttsOK)return null;
  return el("button",{class:"speak"+(small?" small":""),type:"button",title:"🔊","aria-label":"🔊",
    onclick:ev=>{ev.stopPropagation();speak(txt)}},"🔊");
}

/* ───────── accent pad ───────── */
let padTarget=null;
const pad=(function(){
  const p=el("div",{class:"accent-pad hidden",role:"toolbar","aria-label":T.padLabel});
  CFG.accents.forEach(ch=>{
    const b=el("button",{type:"button",tabindex:"-1"},ch);
    b.addEventListener("mousedown",ev=>ev.preventDefault());
    b.addEventListener("click",()=>{
      if(!padTarget)return;
      const st=padTarget.selectionStart??padTarget.value.length, en=padTarget.selectionEnd??padTarget.value.length;
      padTarget.setRangeText(ch,st,en,"end");
      padTarget.dispatchEvent(new Event("input",{bubbles:true}));
      padTarget.focus();
    });
    p.append(b);
  });
  document.body.append(p);
  return p;
})();
function showPad(i){ padTarget=i; pad.classList.remove("hidden"); document.body.classList.add("pad-on"); }
function hidePad(){ padTarget=null; pad.classList.add("hidden"); document.body.classList.remove("pad-on"); }

/* ───────── router ───────── */
const VIEWS=["accueil","revision","examen","suivi"];
function go(v){
  hidePad();
  VIEWS.forEach(x=>{
    $("#view-"+x).classList.toggle("hidden",x!==v);
    $("#tab-"+x).setAttribute("aria-selected",x===v?"true":"false");
  });
  if(v==="accueil")renderAccueil();
  if(v==="revision")renderRevisionConfig();
  if(v==="examen")renderExamConfig();
  if(v==="suivi")renderSuivi();
  window.scrollTo(0,0);
}
VIEWS.forEach(v=>$("#tab-"+v).addEventListener("click",()=>go(v)));

function kpi(n,l){return el("div",{class:"kpi"},el("div",{class:"n"},String(n)),el("div",{class:"l"},l))}
function pills(items,current,on){
  const w=el("div",{class:"pill-select"});
  items.forEach(([val,label,dis])=>{
    const b=el("button",{class:val===current?"on":"",...(dis?{disabled:"",title:T.dictNoTts}:{}),
      onclick:()=>{on(val);[...w.children].forEach(c=>c.classList.remove("on"));b.classList.add("on")}},label);
    w.append(b);
  });
  return w;
}

/* ───────── assignment ───────── */
function assignment(){
  const a=window.ASSIGNMENT;
  if(!a||!a.label||!Array.isArray(a.lessons)||!a.lessons.length) return null;
  const since=Date.parse(a.since||"2000-01-01");
  const done=a.lessons.map(lid=>S.sessions.some(s=>s.lid===lid&&s.t>=since));
  return {...a, since, done};
}

/* ═════════ ACCUEIL ═════════ */
let openUnit=null;
function renderAccueil(){
  const v=$("#view-accueil"); v.innerHTML="";
  const dueN=CORPUS.reduce((n,e)=>n+dueDirs(e.id).length,0);
  const lee=leeches();
  const a=assignment();
  v.append(
    el("h2",null,T.homeTitle),
    el("p",{class:"lede"},T.homeLede),
    el("div",{class:"card"},
      el("label",{for:"student-name",style:"font-weight:600;font-size:.9rem"},T.nameLabel),
      el("input",{id:"student-name",class:"typed",style:"margin-top:8px",value:S.name||"",placeholder:T.namePh,
        oninput:e=>{S.name=e.target.value.trim();save()}}),
      el("div",{class:"btn-row"},audioToggle()), voicePicker()));
  if(a){
    const card=el("div",{class:"card",style:"margin-top:14px;border-color:var(--bleu)"},
      el("h3",null,T.taskTitle+" — "+a.label));
    a.lessons.forEach((lid,i)=>{
      const [uid]=lid.split(".");
      const L=UNITS[uid]&&UNITS[uid].lessons[lid];
      if(!L)return;
      card.append(el("div",{style:"display:flex;gap:10px;align-items:center;padding:4px 0"},
        el("span",{style:"flex:1"},T.lessonLine(lid.split(".")[1],L.title,L.ids.length)),
        el("span",{class:"session-count",style:a.done[i]?"color:var(--vert)":"color:var(--rouge)"},a.done[i]?T.taskDone:T.taskPending),
        el("button",{class:"btn small primary",onclick:()=>startLesson(uid,lid)},T.practise)));
    });
    v.append(card);
  }
  if(dueN) v.append(el("div",{class:"card",style:"margin-top:14px;border-color:var(--rouge)"},
    el("h3",null,T.dueCard(dueN)),
    el("div",{class:"btn-row"},el("button",{class:"btn primary",onclick:()=>go("revision")},T.startReview))));
  if(lee.length) v.append(el("div",{class:"card",style:"margin-top:14px;border-color:#B07B12"},
    el("h3",null,T.leechTitle+" ("+lee.length+")"),
    el("p",{style:"margin:4px 0 0;color:var(--ink-soft);font-size:.9rem"},T.leechCard(lee.length)),
    el("div",{class:"btn-row"},el("button",{class:"btn",onclick:startLeech},T.leechGo))));
  v.append(el("div",{class:"section-label"},T.unitsLabel));
  UNIT_ORDER.forEach(uid=>{
    const u=UNITS[uid];
    const mast=u.ids.filter(isMastered).length, seen=u.ids.filter(isSeen).length;
    const head=el("button",{class:"unit-tile",style:"width:100%",onclick:()=>{openUnit=openUnit===uid?null:uid;renderAccueil()}},
      el("div",{style:"flex:1"},
        el("div",{class:"u-code"},uid+(openUnit===uid?" ▾":" ▸")),
        el("div",{class:"u-name"},u.name),
        el("div",{class:"u-meta"},T.unitMeta(u.lessonOrder.length,u.ids.length,seen,mast)),
        el("div",{class:"u-bar"},el("i",{style:"width:"+pct(mast,u.ids.length)+"%"}))));
    v.append(head);
    if(openUnit===uid){
      const wrap=el("div",{style:"margin:6px 0 14px 10px;display:grid;gap:6px"});
      u.lessonOrder.forEach(lid=>{
        const L=u.lessons[lid];
        const n=L.ids.length, m=L.ids.filter(isMastered).length, s=L.ids.filter(isSeen).length;
        let a2=0,c2=0; L.ids.forEach(id=>["f","r"].forEach(d=>{const r=recOf(id,d);if(r){a2+=r.seen;c2+=r.ok}}));
        wrap.append(el("div",{class:"card",style:"display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 16px"},
          el("div",{style:"flex:1;min-width:220px"},
            el("div",{style:"font-weight:600"},T.lessonLine(lid.split(".")[1],L.title,n)),
            el("div",{class:"u-meta"},T.lessonMeta(s,m)+(a2?` · ${pct(c2,a2)}${T.accSuffix}`:"")),
            el("div",{class:"u-bar",style:"max-width:220px"},el("i",{style:"width:"+pct(m,n)+"%"}))),
          el("div",{class:"btn-row",style:"margin:0"},
            el("button",{class:"btn small ghost",onclick:()=>renderListe(uid,lid)},T.list),
            el("button",{class:"btn small primary",onclick:()=>startLesson(uid,lid)},T.practise))));
      });
      v.append(wrap);
    }
  });
}

/* — liste (printable) — */
function renderListe(uid,lid){
  const v=$("#view-accueil"); v.innerHTML="";
  const u=UNITS[uid], L=u.lessons[lid];
  v.append(
    el("div",{class:"session-bar no-print"},
      el("button",{class:"btn small ghost",onclick:renderAccueil},T.backUnits),
      el("button",{class:"btn small ghost",style:"margin-left:auto",onclick:()=>window.print()},T.print),
      el("button",{class:"btn small primary",onclick:()=>startLesson(uid,lid)},T.practiseThis)),
    el("h2",null,`${uid} ${u.name} · `+T.lessonLine(lid.split(".")[1],L.title,L.ids.length)));
  const tbl=el("table",{class:"stats"},
    el("thead",null,el("tr",null,el("th",null,T.colTarget),el("th",null,T.colEn),el("th",{class:"no-print",style:"width:70px"},T.colStatus))));
  const tb=el("tbody");
  L.ids.forEach(id=>{
    const e=byId[id];
    const st=isMastered(id)?"●":isSeen(id)?"◐":"○";
    const stTitle=isMastered(id)?T.stMast:isSeen(id)?T.stCur:T.stNew;
    tb.append(el("tr",null,
      el("td",null,el("b",null,e[K].join(" ; "))," ",speakBtn(e[K][0],true)),
      el("td",null,e.en.join(" ; ")),
      el("td",{class:"num no-print",title:stTitle,style:"color:"+(isMastered(id)?"var(--vert)":isSeen(id)?"var(--bleu)":"var(--muted)")},st)));
  });
  tbl.append(tb);
  v.append(tbl, el("p",{class:"no-print",style:"font-size:.82rem;color:var(--muted);margin-top:10px"},T.listLegend));
}

/* ═════════ SESSIONS ═════════ */
let sess=null, lessonPrefs={dir:"mixte"}, revLen=20;
function startLesson(uid,lid){
  go("accueil");
  const v=$("#view-accueil"); v.innerHTML="";
  const u=UNITS[uid], L=u.lessons[lid];
  v.append(
    el("div",{class:"session-bar"},el("button",{class:"btn small ghost",onclick:renderAccueil},T.back)),
    el("h2",null,T.lessonLine(lid.split(".")[1],L.title,L.ids.length)),
    el("div",{class:"card"},
      el("h3",null,T.dirLabel),
      pills([["enfr",T.dirEnFr],["fren",T.dirFrEn],["mixte",T.dirMix],["dict",T.dirDict,!ttsOK]],lessonPrefs.dir,d=>lessonPrefs.dir=d),
      el("div",{class:"btn-row"},
        el("button",{class:"btn primary",onclick:()=>{
          const ids=shuffle(L.ids);
          const q=ids.map((id,i)=>({id,dir:lessonPrefs.dir==="mixte"?(i%2?"fren":"enfr"):lessonPrefs.dir}));
          sess={queue:q,i:0,ok:0,wrong:[],back:renderAccueil,label:T.sessionLabel(uid,lid.split(".")[1]),view:"#view-accueil",lid,silent:false};
          renderQ();
        }},T.startLesson))));
}
function startLeech(){
  const q=leeches().slice(0,20).map(l=>({id:l.id,dir:l.dir}));
  if(!q.length)return;
  sess={queue:shuffle(q),i:0,ok:0,wrong:[],back:renderAccueil,label:T.leechLabel,view:"#view-accueil",lid:"leech",silent:false};
  go("accueil"); renderQ();
}
function renderRevisionConfig(){
  const v=$("#view-revision"); v.innerHTML="";
  // production first, then recognition
  const dueF=[],dueR=[];
  CORPUS.forEach(e=>{const d=dueDirs(e.id); if(d.includes("enfr"))dueF.push({id:e.id,dir:"enfr"}); if(d.includes("fren"))dueR.push({id:e.id,dir:"fren"})});
  const due=shuffle(dueF).concat(shuffle(dueR));
  v.append(
    el("h2",null,T.reviewTitle),
    el("p",{class:"lede"},due.length?T.reviewLede(due.length):T.reviewEmpty),
    due.length? el("div",{class:"card"},
      el("h3",null,T.nWords),
      pills([["10","10"],["20","20"],["30","30"],["999",T.all]],"20",n=>revLen=+n),
      el("div",{class:"btn-row"},el("button",{class:"btn primary",onclick:()=>{
        sess={queue:due.slice(0,revLen),i:0,ok:0,wrong:[],back:renderRevisionConfig,label:T.reviewLabel,view:"#view-revision",lid:"rev",silent:false};
        renderQ();
      }},T.start))):null);
}

/* ═════════ EXAM ═════════ */
let examUnits=new Set(), examLen=30;
function renderExamConfig(){
  const v=$("#view-examen"); v.innerHTML="";
  v.append(el("h2",null,T.examTitle), el("p",{class:"lede"},T.examLede),
    el("div",{class:"card"}, el("h3",null,T.examUnits)));
  const grid=el("div",{class:"pill-select",style:"margin-top:4px"});
  UNIT_ORDER.forEach(uid=>{
    const b=el("button",{class:examUnits.has(uid)?"on":"",onclick:()=>{
      examUnits.has(uid)?examUnits.delete(uid):examUnits.add(uid);
      b.classList.toggle("on");
    }},uid);
    grid.append(b);
  });
  const card=v.lastChild;
  card.append(grid,
    el("h3",{style:"margin-top:18px"},T.nWords),
    pills([["20","20"],["30","30"],["50","50"]],String(examLen),n=>examLen=+n),
    el("div",{class:"btn-row"},el("button",{class:"btn primary",onclick:()=>{
      if(!examUnits.size){alert(T.examNeedUnits);return}
      const ids=shuffle([...examUnits].flatMap(u=>UNITS[u]?UNITS[u].ids:[])).slice(0,examLen);
      const q=ids.map((id,i)=>({id,dir:i%2?"fren":"enfr"}));
      sess={queue:q,i:0,ok:0,wrong:[],back:renderExamConfig,label:T.examLabel,view:"#view-examen",lid:"exam",silent:true,answers:[]};
      renderQ();
    }},T.examStart)));
}

/* ═════════ question renderer (shared) ═════════ */
function renderQ(){
  const v=$(sess.view);
  hidePad();
  if(sess.i>=sess.queue.length)return sess.silent?examEnd(v):sessionEnd(v);
  v.innerHTML="";
  const p=pct(sess.i,sess.queue.length);
  v.append(el("div",{class:"session-bar"},
    el("button",{class:"btn small ghost",onclick:sess.back},T.quit),
    el("div",{class:"progress"},el("i",{style:"width:"+p+"%"})),
    el("span",{class:"session-count"},`${sess.i+1} / ${sess.queue.length}`),
    sess.silent?null:el("span",{class:"score-pill"},`✓ ${sess.ok}`),
    audioToggle()));
  const {id,dir}=sess.queue[sess.i], e=byId[id];
  const enfr=dir==="enfr", dict=dir==="dict";
  const hasArt=e[K].some(vv=>CFG.artRe.test(vv.toLowerCase()));
  const meta=dict?T.metaDict:enfr?(hasArt?T.metaEnFrArt:T.metaEnFr):T.metaFrEn;
  let promptNode;
  if(dict){
    promptNode=el("div",null,
      el("button",{class:"btn primary",onclick:()=>speak(e[K][0])},T.replay));
    setTimeout(()=>speak(e[K][0]),300);
  } else if(enfr){
    promptNode=el("div",{class:"headword",style:"font-family:var(--font-body);font-weight:600;font-size:1.5rem"},e.en[0]);
  } else {
    promptNode=el("div",{class:"headword"},e[K][0]," ",speakBtn(e[K][0]));
  }
  const others=(dict||enfr)?[]:e[K].slice(1);   // production shows ONE gloss to translate; full set revealed in feedback
  const card=el("div",{class:"entry"},
    el("div",{class:"entry-meta"},`${sess.label} · ${meta}`),
    promptNode,
    others.length&&!sess.silent? el("div",{class:"gramm"},T.alsoPrompt+others.join(" ; ")):null);
  const targetLang = enfr||dict;
  const inp=el("input",{class:"typed",type:"text",autocapitalize:"off",autocomplete:"off",spellcheck:"false",
    placeholder:targetLang?T.phTarget:T.phEn});
  const row=el("div",{class:"btn-row"});
  const check=el("button",{class:"btn primary"},sess.silent?T.next:T.check);
  let done=false;
  function doCheck(){
    if(done)return;
    const res=targetLang? checkFr(inp.value,e,e.en[0]) : checkEn(inp.value,e);
    if(!res&&!sess.silent)return;
    done=true;
    const q=res?res.q:1;
    srsGrade(e.id, dict?"enfr":dir, q);
    if(q>=3)sess.ok++; else sess.wrong.push(e.id);
    if(sess.silent){
      sess.answers.push({id:e.id,dir,given:inp.value.trim(),q});
      sess.i++; renderQ(); return;
    }
    inp.disabled=true; check.disabled=true;
    hidePad();
    let sibs="";
    if(targetLang && q<3){
      const oth=(GLOSS_TO_ENTRIES[xCanonEn(e.en[0])]||[]).filter(x=>x.id!==e.id).map(x=>x[K][0]);
      if(oth.length) sibs=[...new Set(oth)].slice(0,3).join(" · ");
    }
    const fb=el("div",{class:"feedback "+res.cls},res.msg,
        sibs? el("span",{class:"note"},T.sibNote,sibs):null,
        res.alt? el("span",{class:"note"},...T.altNote(res.alt[K][0])):
        res.altTxt? el("span",{class:"note"},...T.altNote(res.altTxt)):null,
        el("span",{class:"note"},
          el("b",null,e[K].join(" ; "))," ",speakBtn(e[K][0],true)," — ",e.en.join(" ; ")));
    /* Translation of a phrase has many valid renderings; where the automatic
       check can't decide, the student judges against the model answer. */
    if(isPhrase(e) && res.q<4){
      const sg=el("button",{class:"btn small ghost",style:"margin-top:10px",onclick:()=>{
        const r=srsGet(rk(e.id, dict?"enfr":dir));
        r.seen--; if(res.q>=3)r.ok--;                 // undo the automatic mark
        srsGrade(e.id, dict?"enfr":dir, 4);
        if(res.q<3){ sess.ok++; const i=sess.wrong.lastIndexOf(e.id); if(i>=0)sess.wrong.splice(i,1); }
        sg.disabled=true; sg.textContent=T.selfDone; fb.className="feedback good";
      }},T.selfOk);
      fb.append(sg);
    }
    card.append(fb, nextBtn());
    autoSpeak(e[K][0]);                                        // correct form revealed → say it
  }
  check.addEventListener("click",doCheck);
  inp.addEventListener("keydown",ev=>{if(ev.key==="Enter")doCheck()});
  row.append(check);
  card.append(inp,row);
  v.append(card);
  if(targetLang) showPad(inp);
  if(!dict && !enfr) setTimeout(()=>autoSpeak(e[K][0]),220);   // target word on screen → say it
  setTimeout(()=>inp.focus(),50);
}
function nextBtn(){
  const b=el("button",{class:"btn primary",onclick:()=>{sess.i++;renderQ()}},T.next);
  setTimeout(()=>b.focus(),50);
  return el("div",{class:"btn-row"},b);
}
function sessionEnd(v){
  hidePad();
  v.innerHTML="";
  S.sessions.push({t:Date.now(),n:sess.queue.length,ok:sess.ok,label:sess.label,lid:sess.lid});save();
  v.append(
    el("h2",null,T.sessDone),
    el("div",{class:"kpi-row"},
      kpi(sess.queue.length,T.qs), kpi(sess.ok,T.right), kpi(pct(sess.ok,sess.queue.length)+" %",T.prec)),
    sess.wrong.length? el("div",{class:"card"},
      el("h3",null,T.toReview),
      el("div",{style:"margin-top:8px"},
        [...new Set(sess.wrong)].map(id=>el("div",{style:"padding:4px 0;border-bottom:1px solid var(--line)"},
          el("b",null,byId[id][K].join(" ; "))," ",speakBtn(byId[id][K][0],true)," — ",byId[id].en.join(" ; "))))):null,
    el("div",{class:"btn-row"},
      el("button",{class:"btn primary",onclick:sess.back},T.cont),
      el("button",{class:"btn",onclick:()=>go("suivi")},T.seeProgress)));
}
function examEnd(v){
  hidePad(); v.innerHTML="";
  const p=pct(sess.ok,sess.queue.length);
  S.exams.push({t:Date.now(),units:[...examUnits],n:sess.queue.length,ok:sess.ok,pct:p});
  S.sessions.push({t:Date.now(),n:sess.queue.length,ok:sess.ok,label:T.examLabel,lid:"exam"});save();
  v.append(
    el("h2",null,T.examDone),
    el("div",{class:"kpi-row"},
      kpi(sess.queue.length,T.qs), kpi(sess.ok,T.right), kpi(p+" %",T.examScore)));
  const wrongs=sess.answers.filter(a=>a.q<3);
  if(wrongs.length){
    const card=el("div",{class:"card"},el("h3",null,T.examWrong));
    wrongs.forEach(a=>{
      const e=byId[a.id];
      card.append(el("div",{style:"padding:6px 0;border-bottom:1px solid var(--line)"},
        el("div",null,el("b",null,e[K].join(" ; "))," ",speakBtn(e[K][0],true)," — ",e.en.join(" ; ")),
        el("div",{style:"font-size:.85rem;color:var(--rouge)"},T.examGiven+": "+(a.given||T.examNone))));
    });
    v.append(card);
  }
  v.append(el("div",{class:"btn-row"},
    el("button",{class:"btn primary",onclick:renderExamConfig},T.examAgain),
    el("button",{class:"btn",onclick:()=>go("suivi")},T.seeProgress)));
}

/* ═════════ SUIVI ═════════ */
function renderSuivi(){
  const v=$("#view-suivi"); v.innerHTML="";
  const seenIds=CORPUS.map(e=>e.id).filter(isSeen);
  const mast=seenIds.filter(isMastered).length;
  const dueN=CORPUS.reduce((n,e)=>n+dueDirs(e.id).length,0);
  let fa=0,fc=0,ra=0,rc=0;
  CORPUS.forEach(e=>{
    const f=recOf(e.id,"f"); if(f){fa+=f.seen;fc+=f.ok}
    const r=recOf(e.id,"r"); if(r){ra+=r.seen;rc+=r.ok}
  });
  v.append(
    el("h2",null,T.progressTitle),
    el("p",{class:"lede"},T.progressLede),
    el("div",{class:"kpi-row"},
      kpi(seenIds.length,T.kSeen+CORPUS.length),
      kpi(mast,T.kMast),
      kpi(dueN,T.kDue),
      kpi(fa?pct(fc,fa)+" %":"—",T.kProd),
      kpi(ra?pct(rc,ra)+" %":"—",T.kRec)),
    el("div",{class:"section-label"},T.byUnit));
  const tbl=el("table",{class:"stats"},
    el("thead",null,el("tr",null,el("th",null,T.thUnit),el("th",null,T.thSeen),el("th",null,T.thMast),el("th",null,T.thAcc),el("th",null,""))));
  const tb=el("tbody");
  UNIT_ORDER.forEach(uid=>{
    const u=UNITS[uid], s=u.ids.filter(isSeen), m=u.ids.filter(isMastered);
    let ua=0,uc=0; u.ids.forEach(id=>["f","r"].forEach(d=>{const r=recOf(id,d);if(r){ua+=r.seen;uc+=r.ok}}));
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
  UNIT_ORDER.forEach(uid=>UNITS[uid].lessonOrder.forEach(lid=>{
    let la=0,lc=0; UNITS[uid].lessons[lid].ids.forEach(id=>["f","r"].forEach(d=>{const r=recOf(id,d);if(r){la+=r.seen;lc+=r.ok}}));
    if(la>=5)rows.push({uid,lid,title:UNITS[uid].lessons[lid].title,acc:pct(lc,la)});
  }));
  rows.sort((x,y)=>x.acc-y.acc);
  v.append(el("div",{class:"section-label"},T.weakLessons));
  if(!rows.length)v.append(el("p",{style:"color:var(--muted)"},T.weakEmpty));
  else{
    const w=el("div",{class:"card"});
    rows.slice(0,8).forEach(r=>w.append(el("div",{style:"display:flex;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--line)"},
      el("div",{style:"flex:1"},el("b",null,T.weakLine(r.uid,r.lid.split(".")[1]))," — "+r.title),
      el("span",{class:"session-count"},r.acc+" %"),
      el("button",{class:"btn small primary",onclick:()=>startLesson(r.uid,r.lid)},T.practise))));
    v.append(w);
  }

  /* exam history */
  if(S.exams.length){
    v.append(el("div",{class:"section-label"},T.examsHist));
    const w=el("div",{class:"card"});
    S.exams.slice(-8).reverse().forEach(x=>w.append(el("div",{style:"display:flex;gap:12px;padding:4px 0;border-bottom:1px solid var(--line)"},
      el("span",{class:"session-count"},new Date(x.t).toLocaleDateString()),
      el("span",{style:"flex:1"},x.units.join(", ")),
      el("b",null,x.pct+" %"),
      el("span",{class:"session-count"},x.ok+"/"+x.n))));
    v.append(w);
  }

  /* export */
  const code=buildExportCode();
  const ta=el("textarea",{class:"code",readonly:""},code);
  v.append(el("div",{class:"section-label"},T.sendTitle),
    el("div",{class:"card"},
      el("p",{style:"margin:0 0 10px"},CFG.FORMS_URL?((CFG.FORMS_FIELD_NAME&&CFG.FORMS_FIELD_CODE)?T.sendFormsTxt:T.sendPasteTxt):T.sendCopyTxt),
      ta,
      el("div",{class:"btn-row"},
        CFG.FORMS_URL? el("button",{class:"btn primary",onclick:async()=>{
          const prefill = CFG.FORMS_FIELD_NAME && CFG.FORMS_FIELD_CODE;
          if(!prefill){                       // tokens unknown: copy first so one paste finishes it
            try{ await navigator.clipboard.writeText(code); }catch(e){ ta.select(); document.execCommand("copy"); }
            alert(T.formsPasteHint);
            window.open(CFG.FORMS_URL,"_blank","noopener");
            return;
          }
          window.open(CFG.FORMS_URL+"&"+CFG.FORMS_FIELD_NAME+"="+encodeURIComponent(S.name||T.noName)
                       +"&"+CFG.FORMS_FIELD_CODE+"="+encodeURIComponent(code),"_blank","noopener");
        }},T.sendForms):null,
        el("button",{class:"btn"+(CFG.FORMS_URL?" ghost":" primary"),onclick:async()=>{try{await navigator.clipboard.writeText(code)}catch(e){ta.select();document.execCommand("copy")}}},T.copyCode),
        el("button",{class:"btn ghost",onclick:downloadBackup},T.backup),
        el("button",{class:"btn ghost",onclick:restoreBackup},T.restore),
        el("button",{class:"btn ghost",style:"color:var(--rouge);border-color:var(--rouge)",onclick:()=>{
          if(confirm(T.resetConfirm)){localStorage.removeItem(CFG.ls);S=load();renderSuivi()}
        }},T.reset))));
}
function buildExportCode(){
  const u={};
  UNIT_ORDER.forEach(uid=>{
    const ids=UNITS[uid].ids, s=ids.filter(isSeen);
    if(!s.length)return;
    let a=0,c=0; ids.forEach(id=>["f","r"].forEach(d=>{const r=recOf(id,d);if(r){a+=r.seen;c+=r.ok}}));
    u[uid]=[s.length,ids.length,ids.filter(isMastered).length,pct(c,a)];
  });
  let l=[];
  UNIT_ORDER.forEach(uid=>UNITS[uid].lessonOrder.forEach(lid=>{
    const ids=UNITS[uid].lessons[lid].ids;
    const s=ids.filter(isSeen); if(!s.length)return;
    let a=0,c=0; ids.forEach(id=>["f","r"].forEach(d=>{const r=recOf(id,d);if(r){a+=r.seen;c+=r.ok}}));
    l.push([lid,s.length,ids.length,pct(c,a)]);
  }));
  const x=S.exams.slice(-5).map(e2=>[Math.round(e2.t/DAY),e2.pct,e2.n]);
  const a2=assignment();
  const payload={v:2,n:S.name||T.noName,t:Date.now(),
    o:{seen:CORPUS.map(e=>e.id).filter(isSeen).length,total:CORPUS.length,
       mast:CORPUS.map(e=>e.id).filter(isMastered).length,sess:S.sessions.length,lee:leeches().length},
    u,l,x, a:a2?{lab:a2.label,done:a2.done}:null};
  let code=CFG.prefix+btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  if(code.length>3800){ // MS Forms long-answer safety: keep weakest 30 lessons
    payload.l=l.slice().sort((p,q2)=>p[3]-q2[3]).slice(0,30);
    payload.lt=true;
    code=CFG.prefix+btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  }
  return code;
}
function downloadBackup(){
  const blob=new Blob([JSON.stringify(S)],{type:"application/json"});
  const a=el("a",{href:URL.createObjectURL(blob),download:T.backupFile});a.click();
}
function restoreBackup(){
  const inp=el("input",{type:"file",accept:".json"});
  inp.addEventListener("change",()=>{
    const f=inp.files[0];if(!f)return;
    const r=new FileReader();
    r.onload=()=>{try{const s=JSON.parse(r.result);if(!s.srs)throw 0;localStorage.setItem(CFG.ls,r.result);S=load();save();renderSuivi();alert(T.restored)}
      catch(e){alert(T.badFile)}};
    r.readAsText(f);
  });
  inp.click();
}

go("accueil");
})();
