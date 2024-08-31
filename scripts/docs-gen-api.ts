import { fileURLToPath } from 'node:url'
import { dirname, join, parse, resolve } from 'node:path'
import MarkdownIt from 'markdown-it'
import { babelParse, parse as sfcParse } from 'vue/compiler-sfc'
import fs from 'fs-extra'
import type { ComponentMeta, MetaCheckerOptions, PropertyMeta, PropertyMetaSchema } from 'vue-component-meta'
import { createChecker } from 'vue-component-meta'
import { Lang, parse as astParse } from '@ast-grep/napi'

import { transformJSDocLinks } from './utils'

const md = new MarkdownIt()
md.use(transformJSDocLinks)

const eventDescriptionMap = new Map<string, string>()
const depTree = new Map<string, string[]>()
const prevDeps: string[] = []

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = resolve(__dirname, '..')
const packagesDir = resolve(rootDir, 'packages')
const componentsDir = resolve(packagesDir, 'components')

const fixedDir = {
  component: 'src/components',
  tsconfig: 'tsconfig.json',
  docs: '.docs',
}

const checkerOptions: MetaCheckerOptions = {
  forceUseTs: true,
  printer: { newLine: 1 },
}

function run() {
  // print out the names of all the folders in the componentsDir directory.
  fs.readdir(componentsDir).then((files) => {
    files.forEach((file) => {
      const tsconfigPath = resolve(componentsDir, `${file}/${fixedDir.tsconfig}`)
      const componentDir = resolve(componentsDir, `${file}/${fixedDir.component}`)
      fs.readdir(componentDir).then((componentFiles) => {
        const checker = createChecker(tsconfigPath, checkerOptions)
        componentFiles.forEach((componentFile) => {
          const componentPath = resolve(componentDir, componentFile)
          const comment = getFileCommend(componentPath)
          const name = parse(componentPath).name
          const componentName = getComponentName(checker, componentPath)
          console.log(componentName)
          if (!componentName)
            return
          const meta = parseMeta(checker.getComponentMeta(componentPath, componentName), comment)
          const docsFilePath = resolve(componentsDir, `${file}/${fixedDir.docs}/${name}.md`)
          //
          let parsedString = '<!-- Generated -->\n\n'
          if (meta.props.length)
            parsedString += `<Props :value="${JSON.stringify(meta.props, null, 2).replace(/"/g, '\'')}" />\n`

          if (meta.events.length)
            parsedString += `\n<Event :value="${JSON.stringify(meta.events, null, 2).replace(/"/g, '\'')}" />\n`

          if (meta.slots.length)
            parsedString += `\n<Slots :value="${JSON.stringify(meta.slots, null, 2).replace(/"/g, '\'')}" />\n`

          fs.outputFile(docsFilePath, parsedString)
        })
      })
    })
  })
}

function run1() {
  const tsconfigPath = '/Users/elonehoo/Documents/destyler/destyler/packages/components/checkbox/tsconfig.json'
  const checker = createChecker(tsconfigPath, checkerOptions)
  const componentPath = '/Users/elonehoo/Documents/destyler/destyler/packages/components/checkbox/src/components/root.ts'

  const name = parse(componentPath).name
  console.log(getFileCommend(componentPath))
  // parseMeta(checker.getComponentMeta(componentPath, getComponentName(checker, componentPath)))
  // console.log(name, parseMeta(checker.getComponentMeta(componentPath, getComponentName(checker, componentPath))))
}

run1()

function getComponentName(checker: any, path: string) {
  const exportList = checker.getExportNames(path)
  // 过滤首字母大写的变量名，且不带 Props 和 Emits ,也不能全部是大写字母
  const componentName = exportList.find((name: string) => /^[A-Z]/.test(name) && !name.includes('Props') && !name.includes('Emits') && !(name.toUpperCase() === name))
  return componentName
}

function parseMeta(meta: ComponentMeta, comment: Map<string, string>) {
  const props = meta.props
  // Exclude global props
    .filter(prop => !prop.global)
    .map((prop) => {
      let defaultValue
      if (prop.tags.length !== 0) {
        defaultValue = prop.tags.find(tag => tag.name === 'default')?.text
      }
      else {
        defaultValue = prop.default
      }

      let type = prop.type
      let { name, description, required } = prop

      if (name === 'as') {
        defaultValue = defaultValue ?? '"div"'
        description = 'The element or component this component should render as. Can be overwrite by `asChild`'
      }

      if (defaultValue === 'undefined')
        defaultValue = 'undefined'

      if (!type.includes('AcceptableValue'))
        type = parseTypeFromSchema(prop.schema) || type

      return ({
        name,
        description: md.render(description),
        type: type.replace(/\s*\|\s*undefined/g, ''),
        required,
        default: defaultValue ?? 'undefined',
      })
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const events = meta.events
    .map((event) => {
      const { name, type } = event
      return ({
        name,
        description: md.render((comment.get(name) ?? '').replace(/^[ \t]+/gm, '')),
        type: type.replace(/\s*\|\s*undefined/g, ''),
      })
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const defaultSlot = meta.slots?.[0]
  const slots: { name: string, description: string, type: string }[] = []

  if (defaultSlot && defaultSlot.type !== '{}') {
    const schema = defaultSlot.schema.schema[0]
    if (typeof schema === 'object' && schema.schema) {
      Object.values(schema.schema).forEach((childMeta: PropertyMeta) => {
        slots.push({
          name: childMeta.name,
          description: md.render(childMeta.description),
          type: parseTypeFromSchema(childMeta.schema),
        })
      })
    }
  }

  // exposed method
  const methods = meta.exposed
    .filter(expose => typeof expose.schema === 'object' && expose.schema.kind === 'event')
    .map(expose => ({
      name: expose.name,
      description: md.render(expose.description),
      type: expose.type,
    }))

  return {
    props,
    events,
    slots,
    methods,
  }
}

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

function getFileCommend(filePath: string) {
  const result: Map<string, string> = new Map()
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
    result.set(item.object, item.comment)
  })
  return result
}
