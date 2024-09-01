import { fileURLToPath } from 'node:url'
import { dirname, parse, relative, resolve } from 'node:path'
import MarkdownIt from 'markdown-it'
import fs from 'fs-extra'
import type { ComponentMeta, MetaCheckerOptions, PropertyMeta, PropertyMetaSchema } from 'vue-component-meta'
import { createChecker } from 'vue-component-meta'

import { transformJSDocLinks } from '../utils'

const md = new MarkdownIt()
md.use(transformJSDocLinks)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '../../')
const packagesDir = resolve(rootDir, 'packages')
const componentsDir = resolve(packagesDir, 'components')
const docsDir = resolve(rootDir, '.docs')

const fixedDir = {
  component: 'src/components',
  tsconfig: 'tsconfig.json',
}

const checkerOptions: MetaCheckerOptions = {
  forceUseTs: true,
  printer: { newLine: 1 },
}

/* ////////////////////// start handle private api //////////////////////  */

const privateComponents = [
  'arrow',
  'collection',
  'dismissableLayer',
  'dismissableLayer',
  'focusScope',
  'menu',
  'popover',
  'popper',
  'presence',
  'primitive',
  'rovingFocus',
  'teleport',
  'visuallyHidden',
]

interface More {
  desc: string
  default?: string
  type?: string
}

const privateProps: Map<string, More> = new Map()
const privateEvents: Map<string, More> = new Map()

function handleGenPrivateAPI() {
  console.log('Start generating private API docs...')
  privateComponents.forEach((privateComponentName) => {
    const tsconfigPath = resolve(componentsDir, `${privateComponentName}/${fixedDir.tsconfig}`)
    const componentDir = resolve(componentsDir, `${privateComponentName}/${fixedDir.component}`)
    const componentList = fs.readdirSync(componentDir)
    const checker = createChecker(tsconfigPath, checkerOptions)
    componentList.forEach((component) => {
      const componentPath = resolve(componentDir, component)
      const componentName = getComponentName(checker, componentPath)
      if (!componentName)
        return
      const meta = checker.getComponentMeta(componentPath, componentName)
      // handle props
      parseProps(meta)
      // handle events
      parseEvent(meta, componentPath)
    })
  })
}

function parseEvent(meta: ComponentMeta, filePath: string) {
  // console.log(meta.events)

  meta.events
    .map((event) => {
      const { name, description, type } = event
      return ({
        name,
        type: type.replace(/\s*\|\s*undefined/g, ''),
        description: md.render(description),
      })
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((event) => {
      const comments = getFileComment(filePath)
      const comment = comments.find(comment => comment.object === event.name)
      if (!privateEvents.has(event.name)) {
        privateEvents.set(event.name, {
          desc: comment ? comment.comment : event.description,
          type: event.type,
        })
      }
    })
}

function getFileComment(filePath: string) {
  const comment: any[] = []
  const code = fs.readFileSync(filePath, 'utf-8')
  // 正则表达式匹配特定结构的注释和对象
  const commentAndObjectRegex = /\/\*\*([\s\S]*?)\*\/\s*(\w+)\s*:/g

  const commentAndObjects: any[] = []
  let match
  while ((match = commentAndObjectRegex.exec(code)) !== null) {
    const commentLines = match[1].split('\n')
    const commentContent = commentLines.map((line) => {
      return line.replace(/^\s*\*\s?/, '').trim()
    }).join('\n')

    commentAndObjects.push({
      comment: commentContent,
      object: match[2].trim(),
    })
  }

  commentAndObjects.forEach((item) => {
    comment.push({
      comment: item.comment,
      object: item.object,
    })
  })

  const newComment = getFileComment2(filePath)
  newComment.forEach((item) => {
    comment.push({
      comment: item.comment,
      object: item.key,
    })
  })

  return comment
}

function getFileComment2(filePath: string) {
  const code = fs.readFileSync(filePath, 'utf-8')
  const regex = /\/\*\*\s*(.*?)\*\/\s*(?:'([^']+)'|\w+)\s*:\s*([^,\s;]+)/gs

  let match
  const results: any[] = []
  while ((match = regex.exec(code)) !== null) {
    const cleanComment = match[1].replace(/^\s*\*\s?/gm, '').trim()
    results.push({
      comment: cleanComment,
      key: match[2] || match[3],
      value: match[3].trim(),
    })
  }

  return results
}

function parseProps(meta: ComponentMeta) {
  meta.props
  // Exclude global props
    .filter(prop => !prop.global)
    .filter(prop => !(prop.name === 'as' || prop.name === 'asChild'))
    .map((prop) => {
      let defaultValue
      if (prop.tags.length !== 0) {
        defaultValue = prop.tags.find(tag => tag.name === 'default')?.text
      }
      else {
        defaultValue = prop.default
      }

      const type = prop.type
      const { name, description, required } = prop

      return ({
        name,
        description: md.render(description),
        type: type.replace(/\s*\|\s*undefined/g, ''),
        required,
        default: defaultValue ?? '-',
      })
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((prop) => {
      if (!privateProps.has(prop.name)) {
        privateProps.set(prop.name, {
          desc: prop.description,
          type: prop.type,
          default: prop.default,
        })
      }
    })
}

/* ////////////////////// start handle public api //////////////////////  */

function handleGenPublicAPI() {
  console.log('Start generating public API docs...')
  fs.readdir(componentsDir).then((files) => {
    files.forEach((file) => {
      console.log(file)
    })
  })
}

/* ////////////////////// public methods //////////////////////  */

function parseTypeFromSchema(schema: PropertyMetaSchema): string {
  if (typeof schema === 'object' && (schema.kind === 'enum' || schema.kind === 'array')) {
    const isFlatEnum = schema.schema?.every(val => typeof val === 'string')
    const enumValue = schema?.schema?.filter(i => i !== 'undefined') ?? []

    if (isFlatEnum && /^[A-Z]/.test(schema.type))
      return enumValue.join(' | ')
    else if (typeof schema.schema?.[0] === 'object' && schema.schema?.[0].kind === 'enum')
      return schema.schema.map((s: PropertyMetaSchema) => parseTypeFromSchema(s)).join(' | ')
    else
      return schema.type
  }
  else if (typeof schema === 'object' && schema.kind === 'object') {
    return schema.type
  }
  else if (typeof schema === 'string') {
    return schema
  }
  else {
    return ''
  }
}

function getComponentName(checker: any, path: string) {
  const exportList = checker.getExportNames(path)
  const componentName = exportList.find((name: string) => /^[A-Z]/.test(name) && !name.includes('Props') && !name.includes('Emits') && !(name.toUpperCase() === name))
  return componentName
}

/* ////////////////////// run //////////////////////  */

export function run() {
  console.log('Start generating API docs...')

  handleGenPrivateAPI()
  handleGenPublicAPI()
}

run()
