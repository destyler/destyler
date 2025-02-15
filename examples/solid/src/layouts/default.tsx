import type { Component, ParentProps } from 'solid-js'
import { routes } from '@destyler/shared'
import './default.css'

const DefaultLayout: Component<ParentProps> = (props) => {
  return (
    <main class="h-screen p-4 flex">
      <div class="flex flex-col gap-4 w-48 border-r border-gray-200 pr-6">
        <div class="text-xl font-bold text-gray-800 sticky top-0 bg-white">
          <a href="/" class="cursor-pointer">
            Destyler
          </a>
        </div>
        <div class="flex flex-col space-y-2 overflow-y-auto">
          {routes?.map(route => (
            <a
              href={route.path}
              class="px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 text-gray-600 hover:text-dark"
            >
              {route.label}
            </a>
          ))}
        </div>
      </div>
      <div class="flex-1 pl-6 py-4 overflow-y-auto pr-80">
        {props.children}
      </div>
    </main>
  )
}

export default DefaultLayout
