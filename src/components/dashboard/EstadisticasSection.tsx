'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Torneo {
  id: number
  nombre: string
}

interface Partido {
  torneo_id: number
}

// Colores para gráficos
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function EstadisticasSection({ className = '' }) {
  
  
    const [stats, setStats] = useState({
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
        const [jugadoresRes, torneosRes, partidosRes, eloRes, clubesRes] = await Promise.all([
         fetch('/api/jugadores', { method: 'GET' }),
    fetch('/api/torneos', { method: 'GET' }),
    fetch('/api/partidos', { method: 'GET' }),
    fetch('/api/estadisticas/elo-por-categoria', { method: 'GET' }),
    fetch('/api/estadisticas/jugadores-por-club', { method: 'GET' })
        ])
        
        const jugadoresData = await jugadoresRes.json()
        const torneosData = await torneosRes.json()
        const partidosData = await partidosRes.json()
        const eloData = await eloRes.json()
        const clubesData = await clubesRes.json()
        
        // Calcular partidos por torneo
  const partidosPorTorneo = torneosData.map((torneo: Torneo) => {
  const count = partidosData.filter((p: Partido) => p.torneo_id === torneo.id).length
  return {
    nombre: torneo.nombre,
    partidos: count
  }
})


        
        setStats({
          totalJugadores: jugadoresData.length,
          totalTorneos: torneosData.length,
          totalPartidos: partidosData.length,
          eloPorCategoria: eloData,
          jugadoresPorClub: clubesData,
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
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-blue-700">Jugadores</h3>
          <p className="text-3xl font-bold">{stats.totalJugadores}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-green-700">Torneos</h3>
          <p className="text-3xl font-bold">{stats.totalTorneos}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-purple-700">Partidos</h3>
          <p className="text-3xl font-bold">{stats.totalPartidos}</p>
        </div>
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
        
        <div className="h-80">
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
              <Tooltip formatter={(value, name, props) => [`${value} jugadores`, props.payload.club]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}