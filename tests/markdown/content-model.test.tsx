import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { content, formatContent } from '../../src/content.js'
import { GuestView } from '../../src/features/guest/GuestView.js'
import { nextUntitledName } from '../../src/features/markdown/untitled.js'

test('editing the model changes rendered interface copy without changing mode identifiers', () => {
  const original = content.guestView.signIn
  try {
    content.guestView.signIn = 'Iniciar sesión'
    const html = renderToStaticMarkup(createElement(GuestView, { theme: 'dark', onToggleTheme() {}, onSignIn() {} }))
    assert.ok(html.includes('Iniciar sesión'))
    assert.ok(html.includes('guest-panel-features'))
  } finally {
    content.guestView.signIn = original
  }
})

test('translated generated filenames remain unique and reuse the first free number', () => {
  const original = content.untitled.untitledValue
  try {
    content.untitled.untitledValue = 'Sin título {value0}'
    assert.equal(nextUntitledName(['Sin título 1', 'sin título 3']), 'Sin título 2')
    assert.equal(nextUntitledName(['Sin título 2']), 'Sin título 1')
  } finally {
    content.untitled.untitledValue = original
  }
})

test('placeholders can be reordered and replacement values are not interpreted', () => {
  assert.equal(formatContent('{second} / {first}', { first: '$&', second: '{first}' }), '{first} / $&')
  assert.equal(formatContent('{missing}', {}), '{missing}')
})
