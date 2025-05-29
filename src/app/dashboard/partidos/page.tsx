import PartidosWrapper from '@/components/dashboard/PartidosWrapper'

export default function PartidosPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Partidos</h1>
        <p className="text-gray-600">Registra y visualiza todos los partidos jugados</p>
      </div>
      
      <PartidosWrapper />
    </div>
  )
}