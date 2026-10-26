import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
test('patched EPUB XML dependency preserves package/navigation parsing and escaping', () => {
  const require = createRequire(import.meta.url),
    epubRequire = createRequire(require.resolve('epubjs')),
    xml = epubRequire('@xmldom/xmldom'),
    version = epubRequire('@xmldom/xmldom/package.json').version
  assert.equal(version, '0.8.15')
  const parser = new xml.DOMParser(),
    doc = parser.parseFromString(
      '<package xmlns="http://www.idpf.org/2007/opf"><metadata><title>Study &amp; Learn</title></metadata><manifest><item id="chapter" href="chapter.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="chapter"/></spine></package>',
      'application/xml',
    )
  assert.equal(doc.getElementsByTagName('title')[0].textContent, 'Study & Learn')
  assert.equal(doc.getElementsByTagName('item')[0].getAttribute('href'), 'chapter.xhtml')
  assert.ok(new xml.XMLSerializer().serializeToString(doc).includes('Study &amp; Learn'))
  assert.throws(() => doc.createEntityReference('invalid>markup'))
})
