import test from 'node:test';
import assert from 'node:assert/strict';

test('12-digit numeric UTR regex validation', () => {
  const utrRegex = /^\d{12}$/;
  
  // Valid NPCI UTRs
  assert.equal(utrRegex.test('426189302194'), true);
  assert.equal(utrRegex.test('309817263541'), true);
  assert.equal(utrRegex.test('000123456789'), true);

  // Invalid formats
  assert.equal(utrRegex.test('42618930219'), false, '11 digits must fail');
  assert.equal(utrRegex.test('4261893021945'), false, '13 digits must fail');
  assert.equal(utrRegex.test('42618930219A'), false, 'Alphanumeric must fail');
  assert.equal(utrRegex.test(''), false, 'Empty string must fail');
  assert.equal(utrRegex.test('  426189302194  '.trim()), true, 'Trimmed valid UTR passes');
});