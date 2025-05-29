'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  UserGroupIcon, 
  TrophyIcon, 
  ChartBarIcon,
  DocumentTextIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Jugadores', href: '/dashboard/jugadores', icon: UserGroupIcon },
  { name: 'Torneos', href: '/dashboard/torneos', icon: TrophyIcon },
  { name: 'Partidos', href: '/dashboard/partidos', icon: DocumentTextIcon },
  { name: 'Clubes', href: '/dashboard/clubes', icon: HomeIcon },
  { name: 'Estadísticas', href: '/dashboard/estadisticas', icon: ChartBarIcon },
  { name: 'Categorías', href: '/dashboard/categorias', icon: ArrowsUpDownIcon },
]

export default function Sidebar() {
  const pathname = usePathname()
  
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-blue-700 overflow-y-auto">
        <div className="flex items-center justify-center px-4 mb-8">
          <div className="text-white text-2xl font-bold">
            Tenis de Mesa
          </div>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md
                  ${
                    pathname === item.href
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                  }
                `}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-6 w-6
                    ${
                      pathname === item.href
                        ? 'text-white'
                        : 'text-blue-300 group-hover:text-white'
                    }
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}