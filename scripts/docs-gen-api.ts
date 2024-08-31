import { fileURLToPath } from 'node:url'
import { dirname, parse, resolve } from 'node:path'
import MarkdownIt from 'markdown-it'
import fs from 'fs-extra'
import type { ComponentMeta, MetaCheckerOptions, PropertyMeta, PropertyMetaSchema } from 'vue-component-meta'
import { createChecker } from 'vue-component-meta'

import { transformJSDocLinks } from './utils'

const md = new MarkdownIt()
md.use(transformJSDocLinks)

const eventDescriptionMap = new Map<string, string>()

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
          const name = parse(componentPath).name
          const componentName = getComponentName(checker, componentPath)
          console.log(componentName)
          if (!componentName)
            return
          const meta = parseMeta(checker.getComponentMeta(componentPath, componentName))
          const docsFilePath = resolve(componentsDir, `${file}/${fixedDir.docs}/${name}.md`)
          //
          let parsedString = '<!-- This file was automatic generated. Do not edit it manually -->\n\n'
          if (meta.props.length)
            parsedString += `<Props :value="${JSON.stringify(meta.props, null, 2).replace(/"/g, '\'')}" />\n`

          if (meta.events.length)
            parsedString += `\n<Event :value="${JSON.stringify(meta.events, null, 2).replace(/"/g, '\'')}" />\n`

          if (meta.slots.length)
            parsedString += `\n<Slots :value="${JSON.stringify(meta.slots, null, 2).replace(/"/g, '\'')}" />\n`

          fs.writeFile(docsFilePath, parsedString)
        })
      })
    })
  })
}

function run1() {
  const tsconfigPath = '/Users/elonehoo/Documents/destyler/destyler/packages/components/backTop/tsconfig.json'
  const checker = createChecker(tsconfigPath, checkerOptions)
  const componentPath = '/Users/elonehoo/Documents/destyler/destyler/packages/components/backTop/src/components/backTop.ts'
  const name = parse(componentPath).name
  console.log(name, parseMeta(checker.getComponentMeta(componentPath, getComponentName(checker, componentPath))))
}

run()

function getComponentName(checker: any, path: string) {
  const exportList = checker.getExportNames(path)
  // 过滤首字母大写的变量名，且不带 Props 和 Emits ,也不能全部是大写字母
  const componentName = exportList.find((name: string) => /^[A-Z]/.test(name) && !name.includes('Props') && !name.includes('Emits') && !(name.toUpperCase() === name))
  return componentName
}

function parseMeta(meta: ComponentMeta) {
  const props = meta.props
  // Exclude global props
    .filter(prop => !prop.global)
    .map((prop) => {
      let defaultValue = prop.default
      let type = prop.type
      const { name, description, required } = prop

      if (name === 'as')
        defaultValue = defaultValue ?? '"div"'

      if (defaultValue === 'undefined')
        defaultValue = undefined

      if (!type.includes('AcceptableValue'))
        type = parseTypeFromSchema(prop.schema) || type

      return ({
        name,
        description: md.render(description),
        type: type.replace(/\s*\|\s*undefined/g, ''),
        required,
        default: defaultValue ?? undefined,
      })
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const events = meta.events
    .map((event) => {
      const { name, type } = event
      return ({
        name,
        description: md.render((eventDescriptionMap.get(name) ?? '').replace(/^[ \t]+/gm, '')),
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
