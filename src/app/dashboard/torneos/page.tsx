 import TorneosWrapper from '@/components/dashboard/TorneosWrapper'

export default function TorneosPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800">Torneos</h1>
        <p className="text-gray-600">Torneos validos para ranking interno</p>
      </div>
      
      <TorneosWrapper />
    </div>
  )
}