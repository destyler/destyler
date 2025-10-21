/** @jsxImportSource solid-js */
import type { JSX } from 'solid-js'

export function Layout(props: { children: JSX.Element }) {
  return (
    <>
      <style>
        {`.layout{
          flex: 1 1 0%;
          padding: 1.5rem; /* 24px */
          overflow-y: auto;
        }`}
      </style>
      <div class="layout">
        {props.children}
      </div>
    </>
  )
}
