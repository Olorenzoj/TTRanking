'use client'
import { useState, useEffect } from 'react'
import JugadorForm from '@/components/forms/JugadorForm'
import DataTable from '@/components/ui/DataTable'
import { PlusIcon } from '@heroicons/react/24/outline'

type Jugador = {
  id: number
  nombre: string
  elo: number
  clubes?: { nombre?: string }
  categorias?: { nombre?: string }
}

type PaginatedResponse = {
  jugadores: Jugador[]
  total: number
}

export default function JugadoresSection({ className = '' }) {
  const [showForm, setShowForm] = useState(false)
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchJugadores = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/jugadores?page=${page}&limit=${limit}`);
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data: PaginatedResponse = await response.json();
      setJugadores(data.jugadores);
      setTotalItems(data.total);
    } catch (error) {
      console.error('Error fetching jugadores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJugadores(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Nombre', accessor: 'nombre', sortable: true },
    { header: 'ELO', accessor: 'elo', sortable: true },
    {
      header: 'Club',
      accessor: 'clubes',
      render: (club: { nombre?: string }) => club?.nombre || 'Sin club',
      sortable: true
    },
    {
      header: 'Categoría',
      accessor: 'categorias',
      render: (categoria: { nombre?: string }) => categoria?.nombre || 'Sin categoría',
      sortable: true
    },
  ]

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Jugadores</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Nuevo
        </button>
      </div>

      {showForm ? (
        <JugadorForm
          onSuccessAction={() => {
            setShowForm(false)
            fetchJugadores(currentPage, itemsPerPage)
          }}
          onCancelAction={() => setShowForm(false)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={jugadores}
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