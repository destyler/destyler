import { apiJson, dataAttrJson } from './src/data'

export interface DataAttrEntry {
  [part: string]: Record<string, string>
}

export type DataAttrDocKey = keyof typeof dataAttrJson

export function getDataAttrDoc(key: DataAttrDocKey): DataAttrEntry {
  const data = dataAttrJson[key]
  if (!data) {
    throw new Error(`No data attribute data found for ${key}`)
  }
  return data
}

interface Prop {
  type: string
  description: string
  defaultValue?: string
}

export interface ApiDoc {
  api: {
    [key: string]: Prop
  }
  context: {
    [key: string]: Prop
  }
}

export type ApiDocKey = keyof typeof apiJson

export function getApiDoc(key: ApiDocKey): ApiDoc {
  const data = apiJson[key]

  if (!data) {
    throw new Error(`No API data found for ${key}`)
  }

  return data as ApiDoc
}

export { apiJson }

export default apiJson
