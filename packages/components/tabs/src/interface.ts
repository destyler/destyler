export type OnBeforeLeave = ( name: string & number, oldName: string & number & null ) => boolean | Promise<boolean>

export type OnUpdateValue = (value: string & number) => void

export type OnClose = (name: string & number) => void
