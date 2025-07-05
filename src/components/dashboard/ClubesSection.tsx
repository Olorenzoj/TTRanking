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

  //edicion directa desde el DT
  const [editingClubId, setEditingClubId] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string | number>('');


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

  const handleEditStart = (jugadorId: number, field: string, currentValue: string | number) => {
    setEditingClubId(jugadorId);
    setEditingField(field);
    setEditingValue(currentValue);
  };

  const handleEditSave = async () => {
    if (editingClubId === null || editingField === null) return;

    try {
      await fetch(`/api/clubes/${editingClubId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [editingField]: editingValue }),
      });

      await fetchClubes(currentPage, itemsPerPage);
    } catch (error) {
      console.error('Error guardando edición:', error);
    } finally {
      setEditingClubId(null);
      setEditingField(null);
      setEditingValue('');
    }
  };

  useEffect(() => {
    fetchClubes(currentPage, itemsPerPage)
  }, [currentPage, itemsPerPage])
  
  const columns = [
    { header: 'ID', accessor: 'id', sortable: true },
    {
      header: 'Nombre',
      accessor: 'nombre',
      render: (nombre: string, row: Club) => {
        if (editingClubId === row.id && editingField === 'nombre') {
          return (
              <input
                  type="text"
                  value={editingValue}
                  autoFocus
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={handleEditSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSave();
                  }}
                  className="border rounded px-1 py-0.5 w-full"
              />
          );
        }
        return (
            <span onClick={() => handleEditStart(row.id, 'nombre', nombre)} className="cursor-pointer hover:underline">
        {nombre}
      </span>
        );
      },
      sortable: true,
    },
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