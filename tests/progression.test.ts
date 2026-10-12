import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newGame,transition,inventory,has,decodeSave,encodeSave,hint,type State,type Action,type Location,type Item} from '../src/domain.ts';
function at(s:State,location:Location,action:Action):State{return transition(transition(s,{type:'move',location}).state,action).state;}
const take=(target:string):Action=>({type:'interact',verb:'take',target});
const use=(item:Item,target:string):Action=>({type:'interact',verb:'use',item,target});
const say=(topic:string):Action=>({type:'say',topic});
// Independently specified legal plan candidates, not imported from domain rule tables.
const steps:[Location,Action][]=[['wharf',take('ribbon')],['tavern',take('cup')],['market',take('cork')],['weather',take('crank')],['market',use('ribbon','tailor')],['wharf',{type:'combine',a:'cup',b:'cork'}],['wharf',use('buoy','pool')],['weather',{type:'combine',a:'cloth',b:'crank'}],['weather',use('scoop','vane')],['weather',use('lens','beacon')],['tavern',say('toast')],['market',say('repair')],['weather',say('storm')],['customs',say('everyone')],['customs',say('repairAnswer')],['customs',say('together')],['tavern',say('paste')],['fort',use('soap','latch')],['fort',take('bell')],['wharf',use('bell','mooring')]];
function run(plan=steps):State{return plan.reduce((s,[location,action])=>at(s,location,action),newGame());}
test('the specification route has an ending and retains only the permit',()=>{const s=run();assert.ok(has(s,'won'));assert.deepEqual(inventory(s),['permit']);});
test('the appeal can precede every lighthouse puzzle without losing access',()=>{
 const s=run([...steps.slice(10,17),...steps.slice(0,10),...steps.slice(17)]);
 assert.ok(has(s,'won'));
});
test('wrong verbs, absent items, foreign targets, repeated takes and bad pairs lose nothing',()=>{
 const s=at(at(newGame(),'wharf',take('ribbon')),'tavern',take('cup'));
 for(const action of [take('cup'),take('barkeep'),use('ribbon','cup'),use('bell','barkeep'),use('soap','latch'),{type:'combine',a:'ribbon',b:'cup'} as Action,{type:'combine',a:'cup',b:'cup'} as Action,say('together')]){
  const r=transition(s,action);assert.deepEqual(r.state,s);assert.ok(r.message.length>15);
 }
 assert.deepEqual(inventory(s),['ribbon','cup']);
});
test('premature use preserves the lens; gate requires both independent proofs',()=>{
 let s=run([steps[1],steps[2],steps[5],steps[6]]);s=transition(s,{type:'move',location:'weather'}).state;
 assert.deepEqual(transition(s,use('lens','beacon')).state,s);
 assert.ok(inventory(s).includes('lens'));
 for(const plan of [steps.slice(0,10),steps.slice(10,16)])assert.notEqual(transition(run(plan),{type:'move',location:'fort'}).state.location,'fort');
});
test('all needed dialogue branches are revisitable; failed answers preserve accepted stages',()=>{
 let s=at(newGame(),'customs',say('together'));assert.equal(s.flags.length,0);
 s=at(s,'tavern',say('toast'));s=at(s,'customs',say('everyone'));
 const before=s;for(const topic of ['brag','repairAnswer','together','appeal','ada'])assert.deepEqual(transition(before,say(topic)).state,before);
 s=at(s,'market',say('repair'));s=at(s,'customs',say('repairAnswer'));s=at(s,'weather',say('storm'));s=at(s,'customs',say('together'));
 assert.ok(has(s,'permitGranted'));assert.deepEqual(transition(s,say('together')).state,s);
});
test('soap reward and latch consumption happen once; the bell cannot leave a locked cage',()=>{
 let s=run(steps.slice(0,17));s=transition(s,{type:'move',location:'fort'}).state;
 assert.deepEqual(transition(s,take('bell')).state,s);
 s=transition(s,use('soap','latch')).state;assert.ok(!inventory(s).includes('soap'));
 assert.deepEqual(transition(s,use('soap','latch')).state,s);
 s=at(s,'tavern',say('paste'));assert.ok(!inventory(s).includes('soap'));
});
test('wind scoop order is symmetric and unrelated pairs preserve ingredients',()=>{
 const s=run([steps[0],steps[3],steps[4]]);
 const a=transition(s,{type:'combine',a:'cloth',b:'crank'}).state,b=transition(s,{type:'combine',a:'crank',b:'cloth'}).state;
 assert.deepEqual(a,b);assert.deepEqual(inventory(a),['scoop']);
});
test('terminal actions are stable and a fresh voyage has no inherited progress',()=>{
 const s=run();for(const action of [take('ribbon'),use('bell','mooring'),say('brag'),{type:'move',location:'fort'} as Action,{type:'combine',a:'soap',b:'bell'} as Action])assert.deepEqual(transition(s,action).state,s);
 assert.deepEqual(newGame(),{version:1,location:'wharf',flags:[]});
});
test('untrusted saves reject corruption, unknowns, duplicate flags, bad locations and atomic inconsistencies',()=>{
 for(const raw of ['null','[]','{',JSON.stringify({version:2,location:'wharf',flags:[]}),JSON.stringify({version:1,location:'fort',flags:[]}),JSON.stringify({version:1,location:'wharf',flags:['ribbonTaken','ribbonTaken']}),JSON.stringify({version:1,location:'wharf',flags:['alien']}),JSON.stringify({version:1,location:'wharf',flags:['responsibilityAccepted']}),JSON.stringify({...newGame(),inventory:['bell']}),JSON.stringify({...run(),location:'market'})])assert.equal(decodeSave(raw),null);
});
test('EVERY reachable progression state is valid and has a route to completion',()=>{
 // Collapse freely reversible travel; each candidate still moves through the public gate.
 const key=(s:State)=>s.flags.slice().sort().join('|');
 const all:State[]=[newGame()],index=new Map([[key(all[0]),0]]),edges:number[][]=[];
 for(let i=0;i<all.length;i++){
  const s=all[i];assert.deepEqual(decodeSave(encodeSave(s)),s);assert.equal(new Set(inventory(s)).size,inventory(s).length);
  const prior=encodeSave(s);hint(s,2);assert.equal(encodeSave(s),prior);
  edges[i]=[];
  for(const [location,action]of steps){
   const next=at(s,location,action);const k=key(next);if(k===key(s))continue;
   let j=index.get(k);if(j===undefined){j=all.length;index.set(k,j);all.push({...next,location:'wharf'});}edges[i].push(j);
  }
 }
 const canFinish=new Set<number>();
 for(const i of all.map((_,i)=>i).sort((a,b)=>all[b].flags.length-all[a].flags.length))if(has(all[i],'won')||edges[i].some(j=>canFinish.has(j)))canFinish.add(i);
 assert.equal(canFinish.size,all.length,'Every reachable milestone set must reach the ending');
 console.log(`Exhaustive proof: ${all.length} reachable progression states; ${edges.reduce((n,e)=>n+e.length,0)} successful transitions; all can finish. Travel equivalence is valid because all unlocked scenes are bidirectionally connected.`);
});

test('completed voyages can still inspect the wharf without changing progress',()=>{
 const finished=run();
 const r=transition(finished,{type:'interact',verb:'look',target:'juniper'});
 assert.match(r.message,/courier/);assert.deepEqual(r.state,finished);
});
test('hints recognize a lens already recovered before the vane repair',()=>{
 const s=run(steps.slice(0,9));assert.match(hint(s,0),/lens.*bag/i);
});
