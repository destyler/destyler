import type { RouteData } from '@destyler/shared-private-private'
import type { FC, ReactNode } from 'react'
import { routes } from '@destyler/shared-private-private'
import { Link } from 'react-router-dom'
import './default.css'

interface DefaultLayoutProps {
  children: ReactNode
}

const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <main className="h-screen p-4 flex">
      <div className="flex flex-col gap-4 w-48 border-r border-gray-200 pr-6">
        <div className="text-xl font-bold text-gray-800 sticky top-0 bg-white">
          <Link to="/" className="cursor-pointer">
            Destyler
          </Link>
        </div>
        <div className="flex flex-col space-y-2 overflow-y-auto">
          {routes?.map((route: RouteData) => (
            <Link
              key={route.path}
              to={route.path}
              className="px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-200 text-gray-600 hover:text-dark"
            >
              {route.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1 pl-6 overflow-y-auto pr-80">
        {children}
      </div>
    </main>
  )
}

export default DefaultLayout
