import {test} from 'node:test';import assert from 'node:assert/strict';
import {freshDuel,startDuel,answer,nextExchange,question,saveDuel,loadDuel,banter} from '../src/duel.ts';
test('failed exchange teaches once; locked and repeated responses cannot score',()=>{
 let s=startDuel(freshDuel(),'practice');assert.equal(startDuel(freshDuel(),'master').phase,'idle');assert.equal(answer(s,0),s);
 s=answer(s,-1);assert.deepEqual(s.learned,[0]);assert.deepEqual(s.score,[0,1]);assert.equal(answer(s,-1),s);s=nextExchange(s);assert.equal(question(s),1);
});
test('normal practice learns all retorts, then defeats new instructor prompts',()=>{
 let s=startDuel(freshDuel(),'practice');for(let i=0;i<2;i++)s=nextExchange(answer(s,-1));assert.equal(s.phase,'lost');assert.deepEqual(s.learned,[0,1]);
 s=startDuel(s,'practice');while(s.phase==='ask')s=nextExchange(answer(s,s.learned.includes(question(s))?question(s):-1));assert.equal(s.phase,'won');assert.equal(s.learned.length,3);
 s=startDuel(s,'master');for(let i=0;i<3;i++){assert.notEqual(banter[question(s)].insult,banter[question(s)].master);s=nextExchange(answer(s,question(s)));}assert.equal(s.phase,'won');assert.equal(s.masterWon,true);assert.equal(answer(s,0),s);
});
test('wrong replies lose without erasing knowledge; persistence validates knowledge only',()=>{
 let s={...freshDuel(),learned:[0,1,2]};s=startDuel(s,'master');for(let i=0;i<3;i++)s=nextExchange(answer(s,(question(s)+1)%3));assert.equal(s.phase,'lost');assert.deepEqual(s.learned,[0,1,2]);
 const saved=loadDuel(saveDuel(s));assert.deepEqual(saved.learned,s.learned);assert.equal(saved.phase,'idle');
 for(const raw of ['{bad','{"version":1,"learned":[0,0],"masterWon":false}','{"version":1,"learned":[],"masterWon":true}','{"version":1,"learned":["0"],"masterWon":false}'])assert.deepEqual(loadDuel(raw),freshDuel());
});
