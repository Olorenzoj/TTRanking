import dynamic from 'next/dynamic'

const EstadisticasSection = dynamic(() => import('@/components/dashboard/EstadisticasSection'), { 
  ssr: false,
  loading: () => <div className="bg-white rounded-lg shadow p-4 h-96 animate-pulse" />
})

export default function EstadisticasPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800">Estadísticas</h1>
        <p className="text-gray-600">Métricas y análisis del sistema</p>
      </div>
      
      <EstadisticasSection />
      
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Resumen de Actividad</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">24</div>
            <div className="text-gray-600">Partidos esta semana</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">8</div>
            <div className="text-gray-600">Jugadores nuevos</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">92%</div>
            <div className="text-gray-600">Participación activa</div>
          </div>
        </div>
      </div>
    </div>
  )
}