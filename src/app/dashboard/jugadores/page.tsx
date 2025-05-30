 import JugadoresWrapper from '@/components/dashboard/JugadoresWrapper'

export default function JugadoresPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800">Jugadores</h1>
        <p className="text-gray-600">visualiza el ranking</p>
      </div>
      
      <JugadoresWrapper />
    </div>
  )
}