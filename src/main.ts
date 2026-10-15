import './style.css';
import {banter,freshDuel,startDuel,answer,nextExchange,question,saveDuel,loadDuel} from './duel';
import {newGame,transition,inventory,itemNames,has,objective,hint,encodeSave,decodeSave,type State,type Action,type Verb,type Location,type Item} from './domain';
import {scenes,conversations} from './world';
import {illustration,itemIcon} from './art';
const root=document.querySelector<HTMLDivElement>('#app')!;
const saveKey='last-laugh-lagoon-save-v1';
let state:State=newGame();
let verb:Verb='look',selected:Item|null=null,combining=false;
let overlay:'intro'|'map'|'journal'|'restart'|'load'|'duel'|null='intro';
let conversation:string|null=null;
let message='The Laughing Bell has been impounded. Tonight, you’re bringing it home.';
let speaker='Juniper’s field notes';
let history:string[]=[];
let hintLevel=-1,hintObjective='';
let saved:State|null=null;
let storageIssue=false;
const duelKey='last-laugh-banter-v1';
let duel=freshDuel(),duelStorage='Retorts save separately; the story save stays untouched.';
try{duel=loadDuel(localStorage.getItem(duelKey));}catch{duelStorage='Storage unavailable: retorts last for this visit.';}
function keepDuel(){try{localStorage.setItem(duelKey,saveDuel(duel));}catch{duelStorage='Retorts could not be saved; keep this tab open.';}}
try{const raw=localStorage.getItem(saveKey);saved=raw?decodeSave(raw):null;storageIssue=!!raw&&!saved;}catch{storageIssue=true;}
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const button=(label:string,id:string,cls='')=>`<button data-id="${id}" class="${cls}">${label}</button>`;
function note(text:string,who='Juniper’s field notes'){
 message=text;speaker=who;history=[...history,text].slice(-14);
}
function clearIntent(){selected=null;combining=false;verb='look';conversation=null;}
function apply(action:Action){
 const before=state;
 const r=transition(state,action);state=r.state;
 note(r.message,action.type==='say'?(conversations[conversation||'']?.name||'Conversation'):'Juniper’s field notes');
 if(action.type==='move'){clearIntent();}
 if(selected&&!inventory(state).includes(selected)){selected=null;combining=false;verb='look';}
 if(state.flags.length!==before.flags.length){hintLevel=-1;hintObjective='';}
 render();
}
function intro(){return `<div class="modal intro" role="dialog" aria-modal="true" aria-labelledby="modal-title"><span class="eyebrow">An original pirate comedy adventure</span><div class="intro-bell">${itemIcon('bell')}</div><h2 id="modal-title">The Last Laugh<br><em>Lagoon</em></h2><p class="intro-lead">A stolen bell. A sea of paperwork.<br>One very determined courier.</p><p>Commodore Clasp has impounded the lagoon’s Laughing Bell for “unlicensed joy”. Bring it home before the evening toast—and make a little room at the table.</p><div class="intro-actions">${button('Begin the adventure →','begin','primary')}${saved?button('Resume saved voyage','resume'):''}</div><p class="small">Explore six scenes · combine curious objects · talk your way through<br>No timers. No danger. Hints when you want them.</p><p class="small muted">Click named objects or use Tab + Enter. 1–4 choose verbs, M opens the map, J opens the journal, Esc cancels.</p>${storageIssue?'<p class="warning">A previous save could not be read. Your new voyage is safe; saving again will replace that save.</p>':''}</div>`;}
function journal(){
 const o=objective(state);
 const clues=[has(state,'heardToast')?'Pella: Everybody gets a seat.':null,has(state,'heardMending')?'Miri: Mend what we share.':null,has(state,'heardWeather')?'Orrin: We carry the risk together.':null,has(state,'signalSent')?'The beacon is signalling safe passage.':null,has(state,'permitGranted')?'Ada granted the fort permit.':null].filter(Boolean);
 return `<div class="modal journal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><span class="eyebrow">Juniper Quill’s</span><h2 id="modal-title">Field journal</h2><p class="small">Hints are optional. Opening this journal changes no puzzle progress.</p><div class="objective-box"><span class="eyebrow">Current lead</span><h3>${o.title}</h3>${hintLevel>=0?`<p id="hint-text">${esc(hint(state,hintLevel))}</p>`:'<p>A nudge, a direction, or the full solution. Your choice.</p>'}<div class="hint-buttons">${[0,1,2].map(i=>button(['Gentle nudge','Clear direction','Full solution'][i],`hint-${i}`,hintLevel===i?'active':'')).join('')}</div></div><h3>Things worth remembering</h3>${clues.length?`<ul>${clues.map(c=>`<li>${esc(c!)}</li>`).join('')}</ul>`:'<p class="muted">Talk to the people of the lagoon to collect field notes.</p>'}<details><summary>Recent exchanges</summary>${history.map(line=>`<p class="small">${esc(line)}</p>`).join('')||'<p>You have a whole evening ahead.</p>'}</details>${button('Close journal','close','primary')}</div>`;
}
function map(){return `<div class="modal chart" role="dialog" aria-modal="true" aria-labelledby="modal-title"><span class="eyebrow">A conveniently small archipelago</span><h2 id="modal-title">Chart of the lagoon</h2><p>Every open destination can be revisited. A fort boat requires a permit and a beacon signal.</p><div class="map-grid">${Object.entries(scenes).map(([id,scene],i)=>`<button data-id="travel-${id}" class="map-island ${id===state.location?'current':''}" ${id==='fort'&&(!has(state,'permitGranted')||!has(state,'signalSent'))?'aria-disabled="true"':''}><span class="map-number">0${i+1}</span><strong>${scene.name}</strong><span>${id===state.location?'You are here':id==='fort'&&(!has(state,'permitGranted')||!has(state,'signalSent'))?'Permit + signal needed':'Travel here →'}</span></button>`).join('')}</div>${button('Fold the chart','close','primary')}</div>`;}
function duelView(){
 const active=duel.phase==='ask'||duel.phase==='feedback',prompt=banter[question(duel)]??banter[0];
 return `<div class="modal sword-trial" role="dialog" aria-modal="true" aria-labelledby="modal-title"><span class="eyebrow">OPTIONAL SWORD-BANTER TRIAL · ORIGINAL DIALOGUE</span><h2 id="modal-title">The last word wins.</h2><p>No reflex timer. Learn retorts by sparring, then answer new instructor insults with the same meanings.</p><svg viewBox="0 0 440 115" role="img" aria-label="Two fencers on a dock"><path d="M10 105H430" stroke="#a37755" stroke-width="8"/><g stroke="#4b6874" stroke-width="6" fill="none"><circle cx="95" cy="22" r="12"/><path d="M95 35v38m0-26 42 12m-42 0L72 79m23-6-20 30m20-30 22 30"/><circle cx="345" cy="22" r="12"/><path d="M345 35v38m0-26-42 12m42 0 23 20m-23-6-22 30m22-30 20 30"/></g><path d="m137 59 105-25m61 25-105-25" stroke="#b78b50" stroke-width="3"/></svg><p><b>${duel.opponent==='master'?'Instructor':'Practice captain'}</b> · ${duel.score[0]} — ${duel.score[1]} · Notebook ${duel.learned.length}/3</p><p role="status" aria-live="polite">${esc(duel.message)}</p>${active?`<blockquote>${esc(duel.opponent==='master'?prompt.master:prompt.insult)}</blockquote>`:''}${duel.phase==='ask'?`<div class="duel-replies">${duel.learned.map(i=>button(esc(banter[i].reply),'duel-answer-'+i)).join('')}${button('I have no answer.','duel-answer--1')}</div>`:duel.phase==='feedback'?button('Next exchange →','duel-next','primary'):`<div class="intro-actions">${button('Spar with a practice captain','duel-practice','primary')}${duel.learned.length===3?button('Challenge the instructor','duel-master'):''}</div>`}<details><summary>Learned retorts</summary>${duel.learned.map(i=>`<p>${esc(banter[i].insult)}<br><strong>${esc(banter[i].reply)}</strong></p>`).join('')||'<p>No retorts yet. Losing a practice exchange teaches its answer.</p>'}</details><p class="small">${esc(duelStorage)} ${duel.masterWon?'Instructor defeated. Replay whenever you like.':''}</p>${button('Return to the adventure','close')}</div>`;
}
function confirmation(kind:'restart'|'load'){return `<div class="modal confirm" role="dialog" aria-modal="true" aria-labelledby="modal-title"><span class="eyebrow">A moment to consider</span><h2 id="modal-title">${kind==='restart'?'Begin a new evening?':'Return to your saved voyage?'}</h2><p>${kind==='restart'?'This resets the current voyage. Your manual save stays available until you save again.':'This replaces the current voyage with your last manual save.'}</p><div class="intro-actions">${button(kind==='restart'?'Yes, restart':'Yes, load save',`confirm-${kind}`,'primary')}${button('Keep playing','close')}</div></div>`;}
function render(){
 const focus=(document.activeElement as HTMLElement|null)?.dataset.id;
 const oldOverlay=root.querySelector('.modal')!==null;
 const won=has(state,'won');
 const scene={...scenes[state.location],hotspots:scenes[state.location].hotspots.map(h=>h.id==='mooring'&&won?{...h,name:'Laughing Bell stand'}:h)};
 const bag=inventory(state);
 const sceneDescription=state.location==='weather'&&has(state,'signalSent')?'The beacon turns. A gold beam guides the boatman. Orrin considers predicting success.':state.location==='fort'&&has(state,'bellTaken')?'An empty cage. A clean latch. A filing cabinet with significantly less joy.':scene.description;
 if(hintObjective!==objective(state).title){hintLevel=-1;hintObjective=objective(state).title;}
 root.innerHTML=`<div class="shell" ${overlay?'inert':''}><header class="masthead"><a class="wordmark" href="#" aria-label="The Last Laugh Lagoon">${itemIcon('bell')}<span>The Last Laugh <em>Lagoon</em></span></a><div class="header-actions">${button('Sword-banter trial','duel')}${button('Chart <kbd>M</kbd>','map')}${button('Journal <kbd>J</kbd>','journal')}${button('Save','save')}${button('Load','load')}${button('Restart','restart')}</div></header><main><div class="chapter"><div><span class="eyebrow">${won?'Epilogue / A seat for everyone':scene.kicker}</span><h1>${won?'The last laugh is yours.':scene.name}</h1><p>${won?'The bell is home. Ada has a seat. The paperwork can wait.':sceneDescription}</p></div><span class="time-tag">☼ &nbsp; The evening is yours</span></div><div class="adventure-grid"><section class="stage-panel" aria-label="Adventure scene"><div class="stage">${illustration(state)}${scene.hotspots.map(h=>`<button data-id="target-${h.id}" class="hotspot ${h.kind==='person'?'person-spot':''}" style="left:${h.x}%;top:${h.y}%" aria-label="${verb==='use'&&selected?`Use ${itemNames[selected]} on`:verb[0].toUpperCase()+verb.slice(1)} ${h.name}"><span class="hot-dot"></span><span class="hot-label">${h.name}</span></button>`).join('')}<span class="scene-stamp">${won?'Joy, licensed by everyone':'LAGOON FIELD STUDY · '+(Object.keys(scenes).indexOf(state.location)+1).toString().padStart(2,'0')}</span></div><div class="scene-footer"><span><span class="compass">✥</span> Nearby</span><div>${scene.neighbors.map(id=>button(`${scenes[id].name} →`,`travel-${id}`)).join('')}</div></div><div class="accessible-targets"><span>In this scene</span>${scene.hotspots.map(h=>button(h.name,`object-${h.id}`)).join('')}</div></section><aside class="story-panel"><div class="lead"><span class="eyebrow">Your heading</span><h2>${objective(state).title}</h2><p>${won?'A good evening needs no permission.':'Bring the Laughing Bell back to its stand at Lantern Wharf.'}</p>${button('Need a nudge? Open journal →','journal-side','text-button')}</div><div class="narration"><div class="speaker"><span class="speaker-dot"></span><span>${esc(speaker)}</span></div><p id="narration" role="status" aria-live="polite">${esc(message)}</p></div>${conversation?`<div class="conversation"><span class="eyebrow">${conversations[conversation].role}</span><h3>Talk to ${conversations[conversation].name}</h3><div>${conversations[conversation].topics.map(t=>button(t.label,`say-${t.id}`)).join('')}</div>${button('End conversation','end-talk','text-button')}</div>`:`<div class="quiet-tip"><span>✦</span><p>Curiosity is your best compass.<br>Look first. Talk often. Keep your hat on.</p></div>`}</aside></div><section class="controls" aria-label="Adventure controls"><div class="verb-bar"><div class="verbs" role="group" aria-label="Choose an action">${(['look','talk','take','use'] as Verb[]).map((v,i)=>`<button data-id="verb-${v}" aria-pressed="${verb===v&&!combining}" class="${verb===v&&!combining?'active':''}"><span class="verb-icon">${['◉','❝','↥','◇'][i]}</span>${v[0].toUpperCase()+v.slice(1)}<kbd>${i+1}</kbd></button>`).join('')}</div><div class="intent">${selected?`${combining?'Combine':'Use'} <strong>${itemNames[selected]}</strong> ${combining?'with another item':'on a scene object'}`:combining?'Choose the first item to combine.':`${verb[0].toUpperCase()+verb.slice(1)} at a named object in the scene.`}</div>${button('Cancel <kbd>Esc</kbd>','cancel','cancel')}</div><div class="inventory"><div class="inventory-heading"><span class="eyebrow">Your satchel</span><span>${bag.length} ${bag.length===1?'item':'items'}</span>${button('Combine items','combine',combining?'active':'')}</div><div class="bag">${bag.length?bag.map(id=>`<button data-id="item-${id}" aria-pressed="${selected===id}" class="item ${selected===id?'selected':''}">${itemIcon(id)}<span>${itemNames[id]}</span></button>`).join(''):'<p class="empty-bag">Room for a few useful things and one enormous ambition.</p>'}</div></div></section><footer><span>An original tale of pirates, paperwork &amp; public joy.</span><span>No timers · No lost items · Optional hints</span></footer>${won?'<div class="ending-ribbon"><span>✦</span> THE END <span>✦</span><p>Juniper Quill will return when somebody misfiles the moon.</p></div>':''}</main></div>${overlay?`<div class="overlay">${overlay==='intro'?intro():overlay==='journal'?journal():overlay==='map'?map():overlay==='duel'?duelView():confirmation(overlay)}</div>`:''}`;
 root.querySelectorAll<HTMLButtonElement>('button[data-id]').forEach(b=>b.addEventListener('click',()=>handle(b.dataset.id!)));
 root.querySelector('.wordmark')?.addEventListener('click',e=>{e.preventDefault();overlay='journal';render();});
 if(overlay&&!oldOverlay)root.querySelector<HTMLButtonElement>('.modal button')?.focus();
 else if(focus){const buttons=[...root.querySelectorAll<HTMLButtonElement>('button[data-id]')];(buttons.find(b=>b.dataset.id===focus)||root.querySelector<HTMLButtonElement>(overlay?'.modal button':'.verbs button'))?.focus({preventScroll:true});}
}
function handle(id:string){
 if(id==='duel'||id==='say-practice'){clearIntent();overlay='duel';render();return;}
 if(id==='duel-practice'||id==='duel-master'){duel=startDuel(duel,id==='duel-master'?'master':'practice');render();return;}
 if(id.startsWith('duel-answer-')){duel=answer(duel,Number(id.slice(12)));keepDuel();render();return;}
 if(id==='duel-next'){duel=nextExchange(duel);keepDuel();render();return;}
 if(id==='begin'){overlay=null;note('Juniper: “Recover one bell. Defy one commodore. Preferably in that order.” Look at objects for clues; talk to people for ideas.');render();return;}
 if(id==='resume'){if(saved)state=structuredClone(saved);clearIntent();overlay=null;note('Your saved voyage is aboard.');render();return;}
 if(id==='close'){overlay=null;render();return;}
 if(id==='map'||id==='journal'||id==='journal-side'){overlay=id==='map'?'map':'journal';render();return;}
 if(id==='restart'){overlay='restart';render();return;}
 if(id==='confirm-restart'){state=newGame();clearIntent();hintLevel=-1;history=[];overlay=null;note('A fresh evening. A familiar missing bell. Your previous manual save is still available.');render();return;}
 if(id==='confirm-load'){if(saved)state=structuredClone(saved);clearIntent();overlay=null;note('Loaded your saved voyage.');render();return;}
 if(id==='save'){
  try{localStorage.setItem(saveKey,encodeSave(state));saved=structuredClone(state);note('Voyage saved in this browser. You can close the tab and resume later.');}catch{note('This browser could not store the save. Your current voyage is still intact.');}render();return;
 }
 if(id==='load'){
  try{const raw=localStorage.getItem(saveKey);saved=raw?decodeSave(raw):null;note(saved?'A saved voyage is available.':'No valid save was found. Your current voyage is unchanged.');if(saved)overlay='load';}catch{note('Storage is unavailable. Your current voyage is unchanged.');}render();return;
 }
 if(id.startsWith('hint-')){hintLevel=Number(id.slice(5));render();return;}
 if(id==='cancel'){clearIntent();note('Action cancelled. Your satchel and progress are unchanged.');render();return;}
 if(id==='end-talk'){conversation=null;note('You can return to this conversation whenever you like.');render();return;}
 if(id==='combine'){selected=null;combining=!combining;conversation=null;render();return;}
 if(id.startsWith('verb-')){verb=id.slice(5) as Verb;combining=false;conversation=null;if(verb!=='use')selected=null;render();return;}
 if(id.startsWith('item-')){
  const item=id.slice(5) as Item;if(!(item in itemNames))return;conversation=null;
  if(combining&&selected){apply({type:'combine',a:selected,b:item});selected=null;combining=false;render();}
  else{selected=item;if(!combining)verb='use';render();}return;
 }
 if(id.startsWith('travel-')){overlay=null;apply({type:'move',location:id.slice(7) as Location});return;}
 if(id.startsWith('say-')){apply({type:'say',topic:id.slice(4)});return;}
 if(id.startsWith('target-')||id.startsWith('object-')){
  const target=id.slice(7);combining=false;
  if(verb==='talk'&&conversations[target]&&!has(state,'won'))conversation=target;else conversation=null;
  apply({type:'interact',verb,target,item:selected||undefined});return;
 }
}
document.addEventListener('keydown',e=>{
 if(e.altKey||e.metaKey||e.ctrlKey)return;
 if(e.key==='Tab'&&overlay){
  const controls=[...root.querySelectorAll<HTMLElement>('.modal button, .modal summary')];
  const first=controls[0],last=controls[controls.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
  return;
 }
 if(e.key==='Escape'){if(overlay==='intro')return;if(overlay){overlay=null;render();}else handle('cancel');return;}
 if(overlay)return;
 const v=['look','talk','take','use'][Number(e.key)-1];
 if(v){e.preventDefault();handle(`verb-${v}`);}
 else if(e.key.toLowerCase()==='m')handle('map');
 else if(e.key.toLowerCase()==='j')handle('journal');
});
render();
