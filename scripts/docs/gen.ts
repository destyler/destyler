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
  docs: '.docs',
}

const checkerOptions: MetaCheckerOptions = {
  forceUseTs: true,
  printer: { newLine: 1 },
}

/* ////////////////////// start handle private api //////////////////////  */

interface More {
  name: string
  description: string
  default?: string
  type?: string
  required?: boolean
}

const privateProps: More[] = []
const privateEvents: More[] = []

function handleGenPrivateAPI() {
  console.log('Start generating private API docs...')
  const privateComponents = fs.readdirSync(componentsDir)
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
      parsePrivateProps(meta)
      // handle events
      parsePrivateEvent(meta, componentPath)
    })
  })
}

function parsePrivateEvent(meta: ComponentMeta, filePath: string) {
  meta.events
    .map((event) => {
      const { name, description, type } = event
      return ({
        name,
        type,
        description,
      })
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((event) => {
      const comments = getFileComment(filePath)
      const comment = comments.find(comment => comment.object === event.name)
      if (!privateEvents.some(element => element.name === event.name && element.type === event.type)) {
        privateEvents.push({
          name: event.name,
          description: comment ? comment.comment : event.description,
          type: event.type,
        })
      }
      else {
        const privateEventComment = privateEvents.find(element => element.name === event.name && element.type === event.type)
        // 判断 demo.description 是否存在, 如果不存在, 就在 privateEvents 中根据名字和类型查找
        if (!privateEventComment?.description) {
          privateEventComment!.description = comment ? comment.comment : event.description
        }
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

function parsePrivateProps(meta: ComponentMeta) {
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
        description,
        type,
        required,
        default: defaultValue ?? '-',
      })
    })
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((prop) => {
      if (!privateProps.some(element => element.name === prop.name && element.type === prop.type)) {
        privateProps.push(prop)
      }
      else {
        const privateProp = privateProps.find(element => element.name === prop.name && element.type === prop.type)
        if (!privateProp?.description) {
          privateProp!.description = prop.description ? prop.description : privateProp!.description
        }
      }
    })
}

/* ////////////////////// start handle public api //////////////////////  */

function handleGenPublicAPI() {
  console.log('Start generating public API docs...')
  const publicComponents = fs.readdirSync(componentsDir)
  publicComponents.forEach((publicComponent) => {
    const tsconfigPath = resolve(componentsDir, `${publicComponent}/${fixedDir.tsconfig}`)
    const componentDir = resolve(componentsDir, `${publicComponent}/${fixedDir.component}`)
    const componentList = fs.readdirSync(componentDir)
    const checker = createChecker(tsconfigPath, checkerOptions)
    componentList.forEach((component) => {
      const componentPath = resolve(componentDir, component)
      const componentName = getComponentName(checker, componentPath)
      const name = parse(componentPath).name
      if (!componentName)
        return
      const meta = parseMeta(checker.getComponentMeta(componentPath, componentName), componentPath)
      const docsFilePath = resolve(componentsDir, `${publicComponent}/${fixedDir.docs}/${name}.md`)

      writeDocsFile(docsFilePath, meta)
    })
  })
}

function parseMeta(meta: ComponentMeta, componentFile: string) {
  // handle props
  const props = meta.props
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
        defaultValue = defaultValue ?? 'div'
        type = 'AsTag | Component'
        description = 'The element or component this component should render as. Can be overwrite by `asChild`'
      }

      if (defaultValue === 'undefined')
        defaultValue = 'undefined'

      if (name === 'asChild') {
        description = 'Change the default rendered element for the one passed as a child, merging their props and behavior.\n\nRead our Composition guide for more details.'
        if (!defaultValue) {
          defaultValue = false
        }
      }

      if (!description) {
        const comment = privateProps.find(element => element.name === name)
        description = comment?.description ?? ''
        if (!defaultValue) {
          defaultValue = comment?.default ?? ''
        }
      }

      return ({
        name,
        description: md.render(description),
        type: type.replace(/\s*\|\s*undefined/g, ''),
        required,
        default: defaultValue ?? '-',
      })
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  // handle events
  const events = meta.events
    .map((event) => {
      const { name, description, type } = event
      return ({
        name,
        type,
        description,
      })
    }).map((event) => {
      const comments = getFileComment(componentFile)
      const comment = comments.find(comment => comment.object === event.name)
      if (!comment) {
        const demo = privateEvents.find(element => element.name === event.name)
        event.description = demo?.description ?? event.description
      }
      else {
        event.description = comment.comment
      }
      return {
        name: event.name,
        description: md.render(event.description),
        type: event.type.replace(/\s*\|\s*undefined/g, ''),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const defaultSlot = meta.slots?.[0]
  const slots: { name: string, description: string, type: string }[] = []

  if (defaultSlot && defaultSlot.type !== '{}') {
    const schema = defaultSlot.schema
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
  return {
    props,
    events,
    slots,
  }
}

function writeDocsFile(docsFilePath, meta) {
  let parsedString = '<!-- Generated -->\n\n'
  if (meta.props.length)
    parsedString += `<Props :value="${JSON.stringify(meta.props, null, 2).replace(/"/g, '\'')}" />\n`

  if (meta.events.length)
    parsedString += `\n<Event :value="${JSON.stringify(meta.events, null, 2).replace(/"/g, '\'')}" />\n`

  if (meta.slots.length)
    parsedString += `\n<Slots :value="${JSON.stringify(meta.slots, null, 2).replace(/"/g, '\'')}" />\n`

  fs.outputFile(docsFilePath, parsedString)
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

  console.log('API docs generated successfully!')
}

run()
