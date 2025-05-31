'use client'
import { useState, useEffect } from 'react'
import ClubForm from '@/components/forms/ClubForm'
import DataTable from '@/components/ui/DataTable'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function ClubesSection() {
  const [showForm, setShowForm] = useState(false)
  const [clubes, setClubes] = useState([])
  
 const fetchClubes = async () => {
  const response = await fetch('/api/clubes', { method: 'GET' })
  const data = await response.json()
  
  const parsed = data.map((club: any) => ({
    ...club,
    jugadoresCount: club._count?.jugadores ?? 0
  }))
  
  setClubes(parsed)
}

  
  useEffect(() => {
    fetchClubes()
  }, [])
  
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
            fetchClubes()
          }} 
          onCancelAction={() => setShowForm(false)}
        />
      ) : (
        <DataTable 
          columns={columns}
          data={clubes} 
          onRowClick={(row) => console.log(row)}
        />
      )}
    </div>
  )
}