// Turns the single-file build into an Artifact page body: claude.ai adds the
// doctype/html/head/body skeleton itself, so we keep only title, styles,
// scripts and the root element.
import { readFileSync, writeFileSync } from 'node:fs'

const APPS = {
  japanese: { title: 'Kotoba Clips', out: 'kotoba-clips.html' },
  french: { title: 'Allons-y French', out: 'allons-y-french.html' },
}
const app = process.env.ARTIFACT_APP ?? 'japanese'
const { title, out } = APPS[app]

const src = readFileSync(`dist-artifact/${app}/index.html`, 'utf8')
const pick = (re) => [...src.matchAll(re)].map((m) => m[0])
const styles = pick(/<style[^>]*>[\s\S]*?<\/style>/g)
const scripts = pick(/<script[^>]*>[\s\S]*?<\/script>/g)
const fontLinks = pick(/<link[^>]+fonts\.googleapis[^>]*>/g)

const page = [
  `<title>${title}</title>`,
  ...fontLinks,
  ...styles,
  '<div id="root"></div>',
  ...scripts,
].join('\n')

writeFileSync(`dist-artifact/${out}`, page)
console.log(`dist-artifact/${out}  ${(page.length / 1024).toFixed(0)} KB`)
