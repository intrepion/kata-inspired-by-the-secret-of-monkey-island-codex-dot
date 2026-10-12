import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, transition, inventory } from '../src/domain.ts';
test('a discovered ribbon can be acquired exactly once', () => {
 let s = transition(newGame(), {type:'interact',verb:'take',target:'ribbon'}).state;
 s = transition(s, {type:'interact',verb:'take',target:'ribbon'}).state;
 assert.deepEqual(inventory(s), ['ribbon']);
});
test('a corked cup combines in both orders, and the ingredients leave the bag', () => {
 let s = newGame();
 s = transition(s,{type:'move',location:'tavern'}).state;
 s = transition(s,{type:'interact',verb:'take',target:'cup'}).state;
 s = transition(s,{type:'move',location:'market'}).state;
 s = transition(s,{type:'interact',verb:'take',target:'cork'}).state;
 for(const [a,b] of [['cup','cork'],['cork','cup']] as const) assert.deepEqual(inventory(transition(s,{type:'combine',a,b}).state), ['buoy']);
});
import { decodeSave, encodeSave, hint } from '../src/domain.ts';
test('save round trips and rejects an impossible premature lens consumption',()=>{
 const s=transition(newGame(),{type:'interact',verb:'take',target:'ribbon'}).state;
 assert.deepEqual(decodeSave(encodeSave(s)),s);
 assert.equal(decodeSave(JSON.stringify({version:1,location:'wharf',flags:['signalSent']})),null);
});
test('all three hint levels are observational',()=>{
 const s=newGame(),before=JSON.stringify(s);
 for(let level=0;level<3;level++) assert.ok(hint(s,level).length>10);
 assert.equal(JSON.stringify(s),before);
});
