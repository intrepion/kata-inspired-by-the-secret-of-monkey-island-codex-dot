import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, transition, inventory } from '../src/domain.ts';
test('a discovered ribbon can be acquired exactly once', () => {
 let s = transition(newGame(), {type:'interact',verb:'take',target:'ribbon'}).state;
 s = transition(s, {type:'interact',verb:'take',target:'ribbon'}).state;
 assert.deepEqual(inventory(s), ['ribbon']);
});
