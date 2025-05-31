'use client'
import { useState, useEffect } from 'react'
import ClubForm from '@/components/forms/ClubForm'
import DataTable from '@/components/ui/DataTable'
import { PlusIcon } from '@heroicons/react/24/outline'

type Club = {
  id: number
  nombre: string
  jugadoresCount: number
}

type PaginatedResponse = {
  clubes: Club[]
  total: number
}

export default function ClubesSection() {
  const [showForm, setShowForm] = useState(false)
  const [clubes, setClubes] = useState<Club[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchClubes = async (page: number, limit: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/clubes?page=${page}&limit=${limit}`)
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data: PaginatedResponse = await response.json()
      
      // Usar los datos directamente sin transformación adicional
      setClubes(data.clubes)
      setTotalItems(data.total)
    } catch (error) {
      console.error('Error fetching clubs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClubes(currentPage, itemsPerPage)
  }, [currentPage, itemsPerPage])
  
  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Jugadores', accessor: 'jugadoresCount' },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Clubes</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Nuevo
        </button>
      </div>
      
      {showForm ? (
        <ClubForm 
          onSuccessAction={() => {
            setShowForm(false)
            fetchClubes(currentPage, itemsPerPage)
          }} 
          onCancelAction={() => setShowForm(false)}
        />
      ) : (
        <DataTable 
          columns={columns}
          data={clubes} 
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