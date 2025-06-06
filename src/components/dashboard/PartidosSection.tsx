'use client'
import { useState, useEffect } from 'react'
import DataTable from '@/components/ui/DataTable'
import { PlusIcon } from '@heroicons/react/24/outline'
import PartidoForm from '@/components/forms/PartidoForm'
import { safeFetch } from '@/lib/api'

type Partido = {
  id: number
  jugador1Nombre: string
  jugador2Nombre: string
  ganadorNombre: string
  torneoNombre: string
  ronda: string,
  fecha: string
}

type PaginatedResponse = {
  partidos: Partido[]
  total: number
}

export default function PartidosSection() {
  const [showForm, setShowForm] = useState(false)
  const [partidos, setPartidos] = useState<Partido[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  const fetchPartidos = async (page: number, limit: number) => {
  try {
    setIsLoading(true)
    setError(null)
    const data = await safeFetch(`/api/partidos?page=${page}&limit=${limit}`)
    
    // Usa directamente las propiedades que vienen del backend
    const parsed = data.partidos.map((partido: any) => ({
      id: partido.id,
      jugador1Nombre: partido.jugador1Nombre, // ✅ Usar la propiedad directa
      jugador2Nombre: partido.jugador2Nombre,
      ganadorNombre: partido.ganadorNombre,
      torneoNombre: partido.torneoNombre,
      ronda: partido.ronda,
      fecha: partido.fecha // ✅ Ya viene formateada desde el backend
    }))
    
    setPartidos(parsed)
    setTotalItems(data.total)
  } catch (err) {
    console.error('Failed to fetch matches:', err)
    setError('Error al cargar partidos. Intente nuevamente.')
  } finally {
    setIsLoading(false)
  }
}
  
  useEffect(() => {
    fetchPartidos(currentPage, itemsPerPage)
  }, [currentPage, itemsPerPage])
  
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Jugador 1', accessor: 'jugador1Nombre' },
    { header: 'Jugador 2', accessor: 'jugador2Nombre' },
    { header: 'Ganador', accessor: 'ganadorNombre' },
    {header: 'Ronda', accessor: 'ronda'},
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
            fetchPartidos(currentPage, itemsPerPage)
          }} 
          onCancelAction={() => setShowForm(false)}
        />
      ) : (
        <DataTable 
          columns={columns} 
          data={partidos} 
          onRowClick={(row) => console.log(row)}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}