import EstadisticasWrapper from '@/components/dashboard/EstadisticasWrapper'

export default function EstadisticasPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800">Estadisticas</h1>
        <p className="text-gray-600">visualiza estadisticas del club</p>
      </div>
      
      <EstadisticasWrapper />
    </div>
  )
}