export const locations = ['wharf','tavern','market','weather','customs','fort'] as const;
export type Location = typeof locations[number];
export type Verb = 'look'|'talk'|'take'|'use';
export type Action = {type:'interact';verb:Verb;target:string;item?:string}|{type:'move';location:Location}|{type:'combine';a:string;b:string}|{type:'say';topic:string};
export type State = {version:1;location:Location;flags:string[]};
export const milestones = ['ribbonTaken','cupTaken','corkTaken','crankTaken','clothMade','buoyMade','lensRecovered','scoopMade','beaconFixed','signalSent','heardToast','heardMending','heardWeather','duel1','duel2','duel3','permitGranted','soapTaken','latchFreed','bellTaken','won'] as const;
export const newGame = ():State => ({version:1,location:'wharf',flags:[]});
export const has = (s:State,f:string) => s.flags.includes(f);
export const itemNames:Record<string,string> = {ribbon:'Ceremony ribbon',cup:'Brass cup',cork:'Giant cork',cloth:'Sailcloth',crank:'Hand crank',buoy:'Corked cup',lens:'Lamp lens',scoop:'Wind scoop',soap:'Dock soap',bell:'Laughing Bell',permit:'Fort permit'};
const ownership:Record<string,[string,string?]> = {ribbon:['ribbonTaken','clothMade'],cup:['cupTaken','buoyMade'],cork:['corkTaken','buoyMade'],cloth:['clothMade','scoopMade'],crank:['crankTaken','scoopMade'],buoy:['buoyMade','lensRecovered'],lens:['lensRecovered','signalSent'],scoop:['scoopMade','beaconFixed'],soap:['soapTaken','latchFreed'],bell:['bellTaken','won'],permit:['permitGranted']};
export function inventory(s:State):string[]{return Object.entries(ownership).filter(([, [got,used]])=>has(s,got)&&(!used||!has(s,used))).map(([item])=>item);}
const targets:Record<Location,string[]> = {wharf:['ribbon','pool','mooring','juniper'],tavern:['cup','barkeep','toast'],market:['cork','tailor','notice'],weather:['crank','keeper','vane','beacon'],customs:['clerk','gate','rules'],fort:['latch','bell','clasp']};
const descriptions:Record<string,string> = {
 ribbon:'A crimson ceremony ribbon. The tailor at Button Market could probably give this orphaned flourish a home.',
 pool:'A lamp lens glints in the tide pool. Too far for your fingers, shallow enough for something that floats. A cup with a plugged bottom could scoop it up.',
 mooring:'The empty bell stand waits for the evening toast. Its plaque says: JOY IS A SHARED EXPENSE.',
 juniper:'Juniper Quill: courier, aspiring pirate, owner of one hat and several excellent intentions. Your boat is named Pending Approval.',
 cup:'A brass cup with a hole in its base. Captain Pella calls it a budget fountain. A cork would rescue its reputation.',
 barkeep:'Captain Pella retired from piracy when the paperwork got heavier than the cannons. She still serves a devastating cup of tea.',
 toast:'The toast menu: Everyone Gets a Seat; Repair Before Replace; Nobody Weathers a Storm Alone. Three things a civic clerk might appreciate.',
 cork:'An enormous cork from a barrel of exceedingly small rum. Free to a good hole.',
 tailor:'Miri Stitch repairs sails and wounded confidence. Her pocket is all practical buttons; her hat is missing a flourish.',
 notice:'Miri: “A ribbon for my hat earns a scrap of sailcloth. Repair before replace.” Beside it: “Weather House crank free to a useful project.”',
 crank:'A spare hand crank. A cloth paddle attached to this would make a fine wind scoop.',
 keeper:'Orrin Gale has predicted nine of the last two storms. He wants his beacon turning again.',
 vane:'The weather vane lost its paddle. Cloth on a crank would catch the breeze and turn the beacon drive.',
 beacon:'The beacon needs a moving drive and its missing lens, last seen in the wharf tide pool. It signals safe passage to Paper Fort.',
 clerk:'Ada Ledger guards the fort permits. Her uniform has four pockets, all full of doubt. Try talking to her.',
 gate:'Paper Fort needs BOTH a civic permit and the repaired beacon signal. The boatman refuses to infer either from your hat.',
 rules:'Appeal rule: explain who benefits, what you contribute, and who carries the risk. Local people know these answers. No fee is required.',
 latch:'The bell latch is glued with a century of official stamps. Soap would soften the paste without damaging the bell.',
 bell:'The Laughing Bell, held in a bureaucratic cage. Free the sticky latch, then take it home to the wharf.',
 clasp:'Commodore Clasp is a painted portrait. He has signed every painting of himself “Approved”. The real man fled at the first hint of public consultation.'
};
export function transition(s:State,a:Action):{state:State;message:string}{
 const result=(message:string,state=s)=>({state,message});
 const grant=(flags:string[],message:string)=>result(message,{...s,flags:[...s.flags,...flags.filter(f=>!has(s,f))].sort()});
 if(has(s,'won')) return result('The bell is home. The lagoon is laughing. Your work here is done—explore your journal or begin another evening.');
 if(a.type==='move') {
  if(!locations.includes(a.location)) return result('That destination is not on this chart.');
  if(a.location==='fort'&&(!has(s,'signalSent')||!has(s,'permitGranted'))) return result('The boatman needs a fort permit AND a beacon signal. Both must be in order before he rows.');
  return result(a.location===s.location?'You are already here.':'You take the scenic route. It contains the same scenery, but with confidence.',{...s,location:a.location});
 }
 if(a.type==='combine'){
  if(!inventory(s).includes(a.a)||!inventory(s).includes(a.b)||a.a===a.b)return result('You need two different items actually in your bag. Nothing is lost.');
  const pair=[a.a,a.b].sort().join('+');
  if(pair==='cork+cup')return grant(['buoyMade'],'You plug the cup with the cork. A corked cup: seaworthy, if your sea is very small.');
  if(pair==='cloth+crank')return grant(['scoopMade'],'Sailcloth around a crank makes a wind scoop. Patent pending, breeze permitting.');
  return result('They have nothing useful to say to each other. Both items stay in your bag.');
 }
 if(a.type==='say'){
  const topic=a.topic;
  if(s.location==='tavern'){
   if(topic==='toast')return grant(['heardToast'],'Pella: “A toast means everybody gets a seat. Even Ada. Especially Ada. She keeps standing outside with a clipboard.”');
   if(topic==='paste')return grant(['soapTaken'],'Pella: “Stamp paste? Dock soap softens it. Take this bar. The paperwork will smell better than its author.”');
   if(topic==='pella')return result('Pella: “I retired after discovering that a tavern can have a plank without making anybody walk it.”');
  }
  if(s.location==='market'){
   if(topic==='repair')return grant(['heardMending'],'Miri: “Repair before replace. A community needs somebody willing to mend what everybody uses. Also my hat needs a ribbon; I can trade sailcloth.”');
   if(topic==='miri')return result('Miri: “I sew for pirates. Every order begins ‘make it threatening’ and ends ‘can you add pockets?’”');
  }
  if(s.location==='weather'){
   if(topic==='storm')return grant(['heardWeather'],'Orrin: “Nobody weathers a storm alone. Shared risk means shared responsibility. For the beacon: cloth on a crank, then a lens. The tide pool ate mine.”');
   if(topic==='orrin')return result('Orrin: “Forecast: uncertain, with scattered certainty after the event.”');
  }
  if(s.location==='customs'){
   if(topic==='appeal')return result('Ada: “Three questions. Who benefits? What do you contribute? Who carries the risk? Answer with deeds, not a louder hat. You may return whenever you learn more.”');
   if(topic==='ada')return result('Ada: “I once filed an invitation under Unscheduled Happiness. Nobody corrected me. Nobody came.”');
   if(topic==='everyone'){
    if(!has(s,'heardToast'))return result('Ada: “Whose seat? Ask Pella what a toast really means, then return.”');
    return grant(['duel1'],'Ada: “Everybody gets a seat? Including clerks? I shall note that in ink rather than pencil.”');
   }
   if(topic==='repairAnswer'){
    if(!has(s,'duel1'))return result('Ada: “First tell me who benefits.”');
    if(!has(s,'heardMending'))return result('Ada: “A useful promise needs an example. Ask Miri about repairs.”');
    return grant(['duel2'],'Ada: “You will mend what we share. That is a contribution with fewer syllables than ‘synergy’. Accepted.”');
   }
   if(topic==='together'){
    if(!has(s,'duel2'))return result('Ada: “We still need to settle your contribution.”');
    if(!has(s,'heardWeather'))return result('Ada: “Ask Orrin who carries a storm. Then we can talk responsibility.”');
    return grant(['duel3','permitGranted'],'Ada: “We carry it together. Permit granted. And... could you save a seat for me?”');
   }
   if(topic==='brag')return result('Ada: “Your hat is not a public benefit. No progress is lost. Try an answer about the lagoon.”');
  }
  return result('That conversation belongs with someone else. Your ideas will keep.');
 }
 if(!targets[s.location].includes(a.target))return result('That is elsewhere on the island. Look around this scene first.');
 if(a.verb==='look')return result(descriptions[a.target]||'A fine specimen of something unhelpful.');
 if(a.verb==='talk')return result(['barkeep','tailor','keeper','clerk'].includes(a.target)?'Choose a conversation topic below. You can always come back.':'It listens politely. It remains an object.');
 if(a.verb==='take'){
  const acquisitions:Record<string,[string,string]>={ribbon:['ribbonTaken','You rescue the ceremony ribbon. It is delighted to have a plot.'],cup:['cupTaken','Pella waves you toward the leaky brass cup. “On the house. Not under it, it leaks.”'],cork:['corkTaken','You pocket the giant cork. Every hole deserves a second chance.'],crank:['crankTaken','Orrin lets you take the spare crank. “Please put a useful spin on it.”']};
  if(acquisitions[a.target]){const[f,message]=acquisitions[a.target];return has(s,f)?result('You already collected that. There are no spare plot devices.'):grant([f],message);}
  if(a.target==='bell'){
   if(!has(s,'latchFreed'))return result('The latch is sealed with stamp paste. Something soapy would soften it.');
   return has(s,'bellTaken')?result('The bell is already safely in your bag.'):grant(['bellTaken'],'You lift the Laughing Bell. It gives a little chuckle. Even confiscation failed to improve its manners.');
  }
  return result('That belongs here. It might need a conversation, a closer look, or an item from your bag.');
 }
 if(a.verb==='use'){
  if(!a.item)return result('Select an inventory item first, then choose its target.');
  if(!inventory(s).includes(a.item))return result('That item is no longer in your bag. Nothing changes.');
  const key=`${a.item}:${a.target}`;
  if(key==='ribbon:tailor')return grant(['clothMade'],'Miri ties the ribbon to her hat. “A flourish! Here is sailcloth. Pair it with a crank to catch a breeze.”');
  if(key==='buoy:pool')return grant(['lensRecovered'],'The corked cup bobs out, cradles the lens, and returns. You retire your tiny fleet and pocket the lamp lens.');
  if(key==='scoop:vane')return grant(['beaconFixed'],'The wind scoop catches a breeze. The beacon drive turns. Orrin salutes with a damp forecast. Now it needs its lens.');
  if(key==='lens:beacon')return has(s,'beaconFixed')?grant(['signalSent'],'The lens locks into the turning beacon. A gold beam points to Paper Fort. Safe passage signalled!'):result('A lens in a motionless beacon makes an expensive night-light. Repair the vane drive first; you keep the lens.');
  if(key==='soap:latch')return grant(['latchFreed'],'The dock soap dissolves the official paste. The latch swings open. Bureaucracy defeated by basic hygiene.');
  if(key==='bell:mooring')return grant(['won'],'The Last Laugh: you hang the bell, and its first note sounds suspiciously like a snort. Pella pours tea; Miri mends the boatman’s sleeve; Orrin predicts a splendid evening. Ada arrives without her clipboard. You save her a seat. Juniper Quill, pirate courier, has delivered something no commodore can impound: a reason to laugh together.');
  return result(`${itemNames[a.item]} cannot help with that. You keep it. Try looking at the target for a clue.`);
 }
 return result('Nothing changes.');
}
export const requirements:Record<string,string[]>={clothMade:['ribbonTaken'],buoyMade:['cupTaken','corkTaken'],lensRecovered:['buoyMade'],scoopMade:['clothMade','crankTaken'],beaconFixed:['scoopMade'],signalSent:['beaconFixed','lensRecovered'],duel1:['heardToast'],duel2:['duel1','heardMending'],duel3:['duel2','heardWeather'],permitGranted:['duel3'],latchFreed:['soapTaken','permitGranted','signalSent'],bellTaken:['latchFreed'],won:['bellTaken']};
export function encodeSave(s:State):string{return JSON.stringify(s);}
export function decodeSave(raw:string):State|null{
 try{
  if(raw.length>4000)return null;
  const value:unknown=JSON.parse(raw);
  if(!value||typeof value!=='object'||Array.isArray(value))return null;
  const v=value as Record<string,unknown>;
  if(Object.keys(v).sort().join(',')!=='flags,location,version'||v.version!==1||typeof v.location!=='string'||!locations.includes(v.location as Location)||!Array.isArray(v.flags))return null;
  const flags=v.flags;
  if(flags.length>milestones.length||flags.some(f=>typeof f!=='string'||!milestones.includes(f as typeof milestones[number]))||new Set(flags).size!==flags.length)return null;
  if(flags.some(f=>(requirements[f]||[]).some(r=>!flags.includes(r))))return null;
  // The final appeal grants both milestones atomically.
  if(flags.includes('duel3')!==flags.includes('permitGranted'))return null;
  if(v.location==='fort'&&(!flags.includes('permitGranted')||!flags.includes('signalSent')))return null;
  if(flags.includes('won')&&v.location!=='wharf')return null;
  return {version:1,location:v.location as Location,flags:[...flags]};
 }catch{return null;}
}
export function objective(s:State):{title:string;steps:string[]}{
 if(has(s,'won'))return {title:'A seat for everyone',steps:['The bell is home. Enjoy the evening.','Read your field notes or start another voyage.','Restart begins a fresh story; your manual save stays until replaced.']};
 if(!has(s,'signalSent')){
  if(!has(s,'beaconFixed'))return {title:'Turn the Weather House beacon',steps:['Orrin needs something to catch a breeze. Talk to the tailor and look around.','Miri trades sailcloth for a ribbon. Cloth on a crank makes a wind scoop.','Take the wharf ribbon; use it on Miri. Take the Weather House crank. Combine sailcloth + crank, then use wind scoop on the weather vane.']};
  return {title:'Recover the missing lamp lens',steps:['A little floating vessel could reach the tide pool treasure.','The leaky tavern cup needs a plug. The market has a giant cork.','Take brass cup and cork; combine them. Use corked cup on the wharf tide pool. Use lamp lens on the repaired beacon.']};
 }
 if(!has(s,'permitGranted'))return {title:'Make a civic appeal',steps:['Ada asks about benefit, contribution and risk. Local people have thoughts on all three.','Talk to Pella about the toast, Miri about repairs, and Orrin about storms.','Talk to Ada: Everybody gets a seat; I will mend what we share; We carry the risk together. Questions follow that order.']};
 if(!has(s,'latchFreed'))return {title:'Release the Laughing Bell',steps:['Paper Fort is open. Look closely at the latch before applying force.','Stamp paste softens with soap. Pella knows how to clean paperwork.','Ask Pella about sticky paperwork. Enter Paper Fort. Use dock soap on the sticky latch.']};
 if(!has(s,'bellTaken'))return {title:'Bring joy home',steps:['The cage is open. The bell is ready.','Take the Laughing Bell from Paper Fort.','Take the bell, travel to Lantern Wharf, and use it on the empty bell stand.']};
 return {title:'Ring in the evening',steps:['The wharf has been waiting for you.','The bell belongs on the empty bell stand.','Go to Lantern Wharf, select Laughing Bell, then use it on the empty bell stand.']};
}
export function hint(s:State,level:number):string{return objective(s).steps[Math.max(0,Math.min(2,Math.floor(level)||0))];}
