import test from 'node:test';
import assert from 'node:assert/strict';
import { splitAmount } from './splitAmount.js';

test('splitAmount handles standard amounts correctly', () => {
  assert.deepEqual(splitAmount(5500), [1999, 1999, 1502]);
  assert.deepEqual(splitAmount(3999), [1999, 1999, 1]);
  assert.deepEqual(splitAmount(1500), [1500]);
  assert.deepEqual(splitAmount(1), [1]);
  assert.deepEqual(splitAmount(100), [100]);
  assert.deepEqual(splitAmount(1999), [1999]);
  assert.deepEqual(splitAmount(2000), [1999, 1]);
  assert.deepEqual(splitAmount(2001), [1999, 2]);
  assert.deepEqual(splitAmount(9999), [1999, 1999, 1999, 1999, 1999, 4]);
});

test('splitAmount handles decimal amounts safely without precision loss', () => {
  assert.deepEqual(splitAmount(1999.50), [1999, 0.50]);
  assert.deepEqual(splitAmount(5500.25), [1999, 1999, 1502.25]);
  assert.deepEqual(splitAmount(0.01), [0.01]);
});

test('splitAmount guarantees all generated amounts are < 2000', () => {
  const result = splitAmount(125000.75);
  for (const chunk of result) {
    assert.ok(chunk < 2000, `Chunk ${chunk} should be < 2000`);
    assert.ok(chunk > 0, `Chunk ${chunk} should be > 0`);
  }
  const sumPaise = result.reduce((acc, curr) => acc + Math.round(curr * 100), 0);
  assert.equal(sumPaise, Math.round(125000.75 * 100));
});

test('splitAmount throws for invalid amounts', () => {
  assert.throws(() => splitAmount(0), /greater than 0/);
  assert.throws(() => splitAmount(-50), /greater than 0/);
  assert.throws(() => splitAmount('abc'), /greater than 0/);
});
