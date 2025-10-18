export function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <style>
        {`.layout{
          flex: 1 1 0%;
          padding: 1.5rem; /* 24px */
          overflow-y: auto;
        }`}
      </style>
      <div className="layout">
        {children}
      </div>
    </>
  )
}
