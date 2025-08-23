import type { SourceFile, Symbol, TypeChecker } from 'ts-morph'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { ModuleResolutionKind, Project } from 'ts-morph'
import { getComponentsPackages } from './get-packages'

function trimType(value: string) {
  return value
    .split('=>')
    .map(t => t.replace(/import\(".*"\)\./, ''))
    .join('=>')
}

function getDefaultValue(property: Symbol) {
  const tags = property.getJsDocTags()
  const [defaultValue] = tags.find(tag => tag.getName() === 'default')?.getText() ?? []
  return defaultValue?.text
}

function getDescription(property: Symbol, _typeChecker?: TypeChecker) {
  try {
    // Try to get JSDoc comments first
    const jsDocTags = property.getJsDocTags()
    const descriptionTag = jsDocTags.find(tag => tag.getName() === 'description')
    if (descriptionTag) {
      const text = descriptionTag.getText()
      if (text && text.length > 0) {
        return text[0]?.text
      }
    }

    // Fallback: try to get documentation comment from symbol declarations
    const declarations = property.getDeclarations()
    if (declarations && declarations.length > 0) {
      const firstDeclaration = declarations[0]
      // Try to get JSDoc from the declaration node if it's a property signature or similar
      if ('getJsDocs' in firstDeclaration && typeof firstDeclaration.getJsDocs === 'function') {
        const jsDocNodes = firstDeclaration.getJsDocs()
        if (jsDocNodes && jsDocNodes.length > 0) {
          const description = jsDocNodes[0].getDescription()
          return description
        }
      }
    }

    return undefined
  }
  catch (error) {
    console.warn(`Failed to get description for property ${property.getName()}:`, error)
    return undefined
  }
}

function getContextReturnType(sourceFile: SourceFile | undefined, typeName: string, typeChecker?: TypeChecker) {
  if (!sourceFile)
    return {}

  const result: Record<string, { type: string, description: string, defaultValue: string | null }> = {}

  const contextType = sourceFile.getInterface(typeName)?.getType()

  contextType?.getProperties().forEach((property) => {
    const name = property.getName()
    const type = property.getValueDeclaration()?.getType()?.getText()

    const defaultValue = getDefaultValue(property)
    const description = getDescription(property, typeChecker)

    if (type && description) {
      result[name] = { type: trimType(type), description, defaultValue }
    }
  })

  return result
}

async function main() {
  const project = new Project({
    compilerOptions: {
      moduleResolution: ModuleResolutionKind.NodeNext,
    },
  })

  const typeChecker = project.getTypeChecker()

  const result: Record<string, any> = {}

  const components = await getComponentsPackages()

  for (const { dir } of components) {
    const baseDir = dir.split('/').pop()!
    const glob = `${dir}/src/**/*.ts`

    const typesFilePath = `${dir}/src/types.ts`

    project.addSourceFilesAtPaths(glob)

    const sourceFile = project.getSourceFile(typesFilePath)

    try {
      const ctxName = baseDir === 'toast' ? 'GroupPublicContext' : 'PublicContext'
      const publicContext = getContextReturnType(sourceFile, ctxName, typeChecker)

      const apiName = baseDir === 'toast' ? 'GroupMachineApi' : 'MachineApi'
      const publicApi = getContextReturnType(sourceFile, apiName, typeChecker)

      result[baseDir] = { api: publicApi, context: publicContext }
    }
    catch (error) {
      console.error('failed --------->', dir, error)
    }
  }

  const outPath = join(process.cwd(), 'packages', 'docs', 'data', 'api.json')

  writeFileSync(outPath, JSON.stringify(result, null, 2))
}

main()
