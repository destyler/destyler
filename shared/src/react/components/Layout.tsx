export function Layout({ children }: { children?: React.ReactNode }) {
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
      <div data-story="book" className="layout">
        <main className="layout-root">
          {children}
        </main>
      </div>
    </>
  )
}
