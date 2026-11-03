// Turns the single-file build into an Artifact page body: claude.ai adds the
// doctype/html/head/body skeleton itself, so we keep only title, styles,
// scripts and the root element.
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('dist-artifact/japanese/index.html', 'utf8')
const pick = (re) => [...src.matchAll(re)].map((m) => m[0])
const styles = pick(/<style[^>]*>[\s\S]*?<\/style>/g)
const scripts = pick(/<script[^>]*>[\s\S]*?<\/script>/g)
const fontLinks = pick(/<link[^>]+fonts\.googleapis[^>]*>/g)

const page = [
  '<title>Kotoba Clips</title>',
  ...fontLinks,
  ...styles,
  '<div id="root"></div>',
  ...scripts,
].join('\n')

writeFileSync('dist-artifact/kotoba-clips.html', page)
console.log(`dist-artifact/kotoba-clips.html  ${(page.length / 1024).toFixed(0)} KB`)
