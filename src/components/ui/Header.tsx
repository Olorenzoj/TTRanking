'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navigation = [
    {name: 'Ranking', href: '/dashboard/Ranking'},
    { name: 'Dashboard', href: '/dashboard' },
    {name: 'Estadisticas', href: '/dashboard/estadisticas'},
    { name: 'Jugadores', href: '/dashboard/jugadores' },
    { name: 'Torneos', href: '/dashboard/torneos' },
    { name: 'Partidos', href: '/dashboard/partidos' },
    { name: 'Clubes', href: '/dashboard/clubes' },
  ]

  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/dashboard" className="text-xl font-bold">
            Advanced Table Tennis Academy
          </Link>
          
          {/* Menú para desktop */}
          <nav className="hidden md:flex space-x-6">
            {navigation.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="hover:underline font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Botón móvil */}
          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-blue-700">
          <div className="flex justify-end p-4">
            <button
              type="button"
              className="text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex flex-col items-center space-y-6 py-10">
            {navigation.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="text-xl font-medium hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}