 import ClubesWrapper from '@/components/dashboard/ClubesWrapper'

export default function JugadoresPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800">Clubes</h1>
        <p className="text-gray-600">Clubes pertenenecientes al ranking</p>
      </div>
      
      <ClubesWrapper />
    </div>
  )
}