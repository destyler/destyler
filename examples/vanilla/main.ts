import 'uno.css'
import '@unocss/reset/tailwind.css'

// 动态获取 pages 目录下的所有的html文件
const modules = import.meta.glob('./pages/*.html')

document.querySelector('#app')!.innerHTML = `
  ${Object.keys(modules).map((key) => {
    const name = key
    return `<a href="/${name}">${name}</a>`
  })}
`
