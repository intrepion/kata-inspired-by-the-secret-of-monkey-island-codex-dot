export const banter = [
 { insult:'Your hat has more holes than your arguments.', reply:'Then your point should have found its way through.', master:'I could steer a ship through the gaps in your logic.' },
 { insult:'Your sword work could put a harbor to sleep.', reply:'Then stop yawning and try to keep up.', master:'A lullaby has sharper timing than you do.' },
 { insult:'Your courage arrived without a return ticket.', reply:'Good. It has no plans to leave.', master:'Bravery like yours will never find its way home.' },
] as const;
export interface Duel {
 version:1; learned:number[]; masterWon:boolean; opponent:'practice'|'master'; phase:'idle'|'ask'|'feedback'|'won'|'lost';
 bout:number; exchange:number; score:[number,number]; message:string;
}
export const freshDuel=():Duel=>({version:1,learned:[],masterWon:false,opponent:'practice',phase:'idle',bout:0,exchange:0,score:[0,0],message:'Spar to learn retorts, then use their meanings against the instructor’s new insults.'});
export const question=(s:Duel)=>s.opponent==='master'?s.exchange%3:(s.bout-1+s.exchange)%3;
export function startDuel(s:Duel,opponent:Duel['opponent']):Duel {
 if(opponent==='master'&&s.learned.length!==3)return s;
 return {...s,learned:[...s.learned],opponent,phase:'ask',bout:s.bout+1,exchange:0,score:[0,0],message:opponent==='master'?'The instructor has new insults. Match the meaning, not the old wording.':'A lost exchange can teach a new response. No items or story progress are at risk.'};
}
export function answer(s:Duel,reply:number):Duel {
 if(s.phase!=='ask'||!Number.isInteger(reply)||reply!==-1&&!s.learned.includes(reply))return s;
 const n=structuredClone(s),id=question(s),correct=reply===id;
 n.score[correct?0:1]++;n.phase='feedback';
 if(correct)n.message='A clean parry! Your answer turns the taunt back on its speaker.';
 else {
  const learn=s.opponent==='practice'&&!n.learned.includes(id);
  if(learn)n.learned.push(id);
  n.message=learn?`You lose the exchange, but hear the answer: “${banter[id].reply}” Retort learned.`:'That response misses the meaning. Your opponent gains ground.';
 }
 return n;
}
export function nextExchange(s:Duel):Duel {
 if(s.phase!=='feedback')return s;
 const n=structuredClone(s),goal=s.opponent==='master'?3:2;
 if(n.score[0]>=goal){n.phase='won';if(n.opponent==='master')n.masterWon=true;n.message=n.opponent==='master'?'MASTER OF THE LAST WORD · The instructor bows. Your learned retorts met every new insult.':'Practice won. Keep the retorts; choose another bout or challenge the instructor.';}
 else if(n.score[1]>=goal){n.phase='lost';n.message='Bout lost, knowledge kept. Spar again; a better answer is already in your notebook.';}
 else {n.exchange++;n.phase='ask';}
 return n;
}
export const saveDuel=(s:Duel)=>JSON.stringify({version:1,learned:s.learned,masterWon:s.masterWon});
export function loadDuel(raw:string|null):Duel {
 const s=freshDuel();try{const v=JSON.parse(raw??'null');if(!v||v.version!==1||!Array.isArray(v.learned)||v.learned.length>3||v.learned.some((x:unknown)=>!Number.isInteger(x)||Number(x)<0||Number(x)>2)||new Set(v.learned).size!==v.learned.length||typeof v.masterWon!=='boolean'||v.masterWon&&v.learned.length!==3)return s;return {...s,learned:[...v.learned],masterWon:v.masterWon};}catch{return s;}
}
