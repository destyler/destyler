/** @jsxImportSource solid-js */
import type { JSX } from 'solid-js'

export function Layout(props: { children: JSX.Element }) {
  return (
    <>
      <style>
        {`.layout{
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        .layout-root {
          flex: auto;
          display: flex;
          gap: 10px;
          position: relative;
          flex-direction: column;
          align-items: flex-start;
          padding: 40px;
          overflow-y: auto;
        }`}
      </style>
      <div data-story="book" class="layout">
        <main class="layout-root">
          {props.children}
        </main>
      </div>
    </>
  )
}
