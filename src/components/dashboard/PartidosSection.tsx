'use client'
import { useState, useEffect } from 'react'
import DataTable from '@/components/ui/DataTable'
import { PlusIcon } from '@heroicons/react/24/outline'
import PartidoForm from '@/components/forms/PartidoForm'
import { safeFetch } from '@/lib/api'

export default function PartidosSection() {
  const [showForm, setShowForm] = useState(false)
  const [partidos, setPartidos] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const fetchPartidos = async () => {
    try {
      setError(null)
      const data = await safeFetch('/api/partidos')
      const parsed = data.map((partido: any) => ({
      ...partido,
      jugador1Nombre: partido.jugador1?.nombre ?? 'N/A',
      jugador2Nombre: partido.jugador2?.nombre ?? 'N/A',
      ganadorNombre: partido.ganador?.nombre ?? 'N/A',
      torneoNombre: partido.torneo?.nombre ?? 'N/A',
    }))
    setPartidos(parsed)
    } catch (err) {
      console.error('Failed to fetch matches:', err)
      setError('Error al cargar partidos. Intente nuevamente.')
    }
  }
  
  useEffect(() => {
    fetchPartidos()
  }, [])
  
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Jugador 1', accessor: 'jugador1Nombre' },
    { header: 'Jugador 2', accessor: 'jugador2Nombre' },
    { header: 'Ganador', accessor: 'ganadorNombre' },
    { header: 'Torneo', accessor: 'torneoNombre' },
    { header: 'Fecha', accessor: 'fecha' },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Partidos</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Nuevo
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {showForm ? (
        <PartidoForm 
          onSuccessAction={() => {
            setShowForm(false)
            fetchPartidos()
          }} 
          onCancelAction={() => setShowForm(false)}
        />
      ) : (
        <DataTable 
          columns={columns} 
          data={partidos} 
          onRowClick={(row) => console.log(row)}
        />
      )}
    </div>
  )
}