import { routes } from '@destyler/shared-private-private'
import { useNavigate } from '@solidjs/router'

function Home() {
  const navigate = useNavigate()

  return (
    <div class="p-3">
      <h1 class="font-bold text-2xl mb-4">
        Destyler + Solid
      </h1>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {routes.map(route => (
          <div
            class="p-2 border rounded-lg hover:shadow-md cursor-pointer transition-shadow text-center"
            onClick={() => navigate(route.path)}
          >
            <h2 class="text-sm font-medium capitalize truncate">
              {route.label}
            </h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
