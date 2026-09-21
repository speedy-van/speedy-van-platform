// The API can be installed independently; its deployment schema must not replace
// the shared generated client with an older set of existing application models.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');

test('standalone API schema matches the canonical shared database schema', () => {
  const root = path.resolve(__dirname, '..');
  const shared = readFileSync(path.join(root, 'packages/db/prisma/schema.prisma'), 'utf8');
  const api = readFileSync(path.join(root, 'apps/api/prisma/schema.prisma'), 'utf8');
  assert.equal(api.replace(/\r\n/g, '\n'), shared.replace(/\r\n/g, '\n'));
});
