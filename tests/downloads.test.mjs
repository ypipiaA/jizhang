import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = await readFile(new URL('../public/_worker.js', import.meta.url), 'utf8');
const { default: worker } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const address = 'https://example.pages.dev/downloads/counts-1.0.1.apk';
const fixture = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 12, 34, 56]);
const assets = (body, headers = {}) => ({ ASSETS: { fetch: async () => new Response(body, { headers }) } });

test('a missing APK returning the SPA homepage is reported as 404', async () => {
  for (const type of ['text/html', 'application/vnd.android.package-archive']) {
    const response = await worker.fetch(new Request(address), assets('<!doctype html><h1>记账首页</h1>', { 'Content-Type': type }));
    assert.equal(response.status, 404);
    assert.equal(response.headers.get('Content-Disposition'), null);
    assert.match(await response.text(), /安装包文件不存在/);
  }
});

test('a deployed APK downloads under its explicit version without changing bytes', async () => {
  const response = await worker.fetch(new Request(address), assets(fixture));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Type'), 'application/vnd.android.package-archive');
  assert.equal(response.headers.get('Content-Disposition'), 'attachment; filename="counts-1.0.1.apk"');
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), fixture);
});

test('HEAD reports the verified APK metadata and omits its body', async () => {
  const response = await worker.fetch(new Request(address, { method: 'HEAD' }), assets(fixture));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Length'), String(fixture.length));
  assert.equal(await response.text(), '');
});

test('unversioned APK paths cannot fall through to the homepage', async () => {
  const response = await worker.fetch(new Request('https://example.pages.dev/downloads/counts.apk'), {
    ASSETS: { fetch: () => { throw new Error('Unversioned path should not be fetched'); } },
  });
  assert.equal(response.status, 404);
});

test('the existing website and sync validation still work', async () => {
  const home = await worker.fetch(new Request('https://example.pages.dev/'), assets('生活记账'));
  assert.equal(await home.text(), '生活记账');
  const invalid = await worker.fetch(new Request('https://example.pages.dev/api/sync?k=invalid'), {});
  assert.equal(invalid.status, 400);
});
