'use client'
import { useState, useEffect } from 'react'
import TorneoForm from '@/components/forms/TorneoForm'
import DataTable from '@/components/ui/DataTable'
import { PlusIcon } from '@heroicons/react/24/outline'

type Torneo = {
  id: number
  nombre: string
  fecha: string
  ubicacion: string
  torneo_categorias: { categorias?: { nombre?: string } }[]
}

type PaginatedResponse = {
  torneos: Torneo[]
  total: number
}

export default function TorneosSection({ className = '' }) {
  const [showForm, setShowForm] = useState(false)
  const [torneos, setTorneos] = useState<Torneo[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  const fetchTorneos = async (page: number, limit: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/torneos?page=${page}&limit=${limit}`)
      const data: PaginatedResponse = await response.json()
      setTorneos(data.torneos)
      setTotalItems(data.total)
    } catch (error) {
      console.error('Error fetching tournaments:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchTorneos(currentPage, itemsPerPage)
  }, [currentPage, itemsPerPage])
  
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'nombre' },
    { 
      header: 'Fecha', 
      accessor: 'fecha',
      render: (fecha: string) => new Date(fecha).toLocaleDateString()
    },
    { header: 'Ubicación', accessor: 'ubicacion' },
    { 
      header: 'Categorías', 
      accessor: 'torneo_categorias',
      render: (torneoCategorias: { categorias?: { nombre?: string } }[]) => (
        <div>
          {torneoCategorias?.map(tc => tc.categorias?.nombre).join(', ')}
        </div>
      )
    },
  ]

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Torneos</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Nuevo
        </button>
      </div>
      
      {showForm ? (
        <TorneoForm 
          onSuccessAction={() => {
            setShowForm(false)
            fetchTorneos(currentPage, itemsPerPage)
          }} 
          onCancelAction={() => setShowForm(false)}
        />
      ) : (
        <DataTable 
          columns={columns} 
          data={torneos} 
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