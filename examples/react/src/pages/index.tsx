import type { FC } from 'react'
import { routes } from '@destyler/shared-private'
import { useNavigate } from 'react-router-dom'

const Home: FC = () => {
  const navigate = useNavigate()

  return (
    <div className="p-3">
      <h1 className="font-bold text-2xl mb-4">
        Destyler + React
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {routes.map(route => (
          <div
            key={route.path}
            className="p-2 border rounded-lg hover:shadow-md cursor-pointer transition-shadow text-center"
            onClick={() => navigate(route.path)}
          >
            <h2 className="text-sm font-medium capitalize truncate">
              {route.label}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
