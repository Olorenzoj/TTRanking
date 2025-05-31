'use client'
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import Link from 'next/link'

interface Torneo {
  id: number
  nombre: string
}

interface Partido {
  torneo_id: number
}

interface EloPorCategoria {
  categoria: string
  elo_promedio: number
}

interface JugadoresPorClub {
  club: string
  jugadores: number
}

interface PartidosPorTorneo {
  nombre: string
  partidos: number
}

interface Estadisticas {
  totalJugadores: number
  totalTorneos: number
  totalPartidos: number
  eloPorCategoria: EloPorCategoria[]
  jugadoresPorClub: JugadoresPorClub[]
  partidosPorTorneo: PartidosPorTorneo[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function EstadisticasSection({ className = '' }) {
  const [stats, setStats] = useState<Estadisticas>({
    totalJugadores: 0,
    totalTorneos: 0,
    totalPartidos: 0,
    eloPorCategoria: [],
    jugadoresPorClub: [],
    partidosPorTorneo: []
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        // Obtener todos los datos sin paginación para estadísticas
        const [jugadoresRes, torneosRes, partidosRes, eloRes, clubesRes] = await Promise.all([
          fetch('/api/jugadores?limit=1000'),
          fetch('/api/torneos?limit=1000'),
          fetch('/api/partidos?limit=1000'),
          fetch('/api/estadisticas/elo-por-categoria'),
          fetch('/api/estadisticas/jugadores-por-club')
        ])

        // Verificar respuestas antes de parsear
        if (!jugadoresRes.ok) throw new Error('Error fetching jugadores')
        if (!torneosRes.ok) throw new Error('Error fetching torneos')
        if (!partidosRes.ok) throw new Error('Error fetching partidos')
        if (!eloRes.ok) throw new Error('Error fetching elo data')
        if (!clubesRes.ok) throw new Error('Error fetching clubes data')

        // Parsear respuestas
        const jugadoresData = await jugadoresRes.json()
        const torneosData = await torneosRes.json()
        const partidosData = await partidosRes.json()
        const eloData: EloPorCategoria[] = await eloRes.json()
        const clubesData: JugadoresPorClub[] = await clubesRes.json()

        // Manejar datos paginados
        const jugadoresArray = jugadoresData.jugadores || []
        const torneosArray = torneosData.torneos || torneosData
        const partidosArray = partidosData.partidos || partidosData

        const partidosPorTorneo: PartidosPorTorneo[] = torneosArray.map((torneo: Torneo) => {
          const count = partidosArray.filter((p: Partido) => p.torneo_id === torneo.id).length
          return {
            nombre: torneo.nombre,
            partidos: count
          }
        })

        // Agrupar clubes: top 5 + "Otros"
        const clubesOrdenados = [...clubesData].sort((a, b) => b.jugadores - a.jugadores)
        const top5 = clubesOrdenados.slice(0, 5)
        const resto = clubesOrdenados.slice(5)
        const otrosTotal = resto.reduce((acc, club) => acc + club.jugadores, 0)
        
        if (otrosTotal > 0) {
          top5.push({ club: 'Otros', jugadores: otrosTotal })
        }

        setStats({
          totalJugadores: jugadoresArray.length,
          totalTorneos: torneosArray.length,
          totalPartidos: partidosArray.length,
          eloPorCategoria: eloData,
          jugadoresPorClub: top5,
          partidosPorTorneo
        })
      } catch (error) {
        console.error('Error al obtener estadísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <h2 className="text-xl font-bold mb-4">Estadísticas</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 h-64">
            <div className="bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Estadísticas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link className="bg-blue-50 p-4 rounded-lg text-center" href='dashboard/jugadores'>
          <h3 className="text-lg font-semibold text-blue-700">Jugadores</h3>
          <p className="text-3xl font-bold">{stats.totalJugadores}</p>
        </Link>

        <Link className="bg-green-50 p-4 rounded-lg text-center" href="/dashboard/torneos">
          <h3 className="text-lg font-semibold text-green-700">Torneos</h3>
          <p className="text-3xl font-bold">{stats.totalTorneos}</p>
        </Link>

        <Link className="bg-purple-50 p-4 rounded-lg text-center" href='/dashboard/partidos'>
          <h3 className="text-lg font-semibold text-purple-700">Partidos</h3>
          <p className="text-3xl font-bold">{stats.totalPartidos}</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2 text-center">Puntos Promedio por Categoría</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.eloPorCategoria}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}`, 'Promedio']} />
              <Legend />
              <Bar dataKey="elo_promedio" name="Promedio" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full h-[300px]">
          <h3 className="text-lg font-semibold mb-2 text-center">Jugadores por Club</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.jugadoresPorClub}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="jugadores"
                nameKey="club"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {stats.jugadoresPorClub.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} jugadores`]} />
              
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}