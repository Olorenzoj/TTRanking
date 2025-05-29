'use client'
import { useState, useEffect } from 'react'
import JugadorForm from '@/components/forms/JugadorForm'
import DataTable from '@/components/ui/DataTable'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function JugadoresSection({ className = '' }) {
  const [showForm, setShowForm] = useState(false)
  const [jugadores, setJugadores] = useState([])
  
  const fetchJugadores = async () => {
    const response = await fetch('/api/jugadores', 
        {
            method: 'GET'
        }
    )
    const data = await response.json()
    setJugadores(data)
  }
  
  useEffect(() => {
    fetchJugadores()
  }, [])
  
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'ELO', accessor: 'elo' },
    { 
      header: 'Club', 
      accessor: 'clubes',
       render: (club: { nombre?: string }) => club?.nombre || 'Sin club'
    },
    { 
      header: 'Categoría', 
      accessor: 'categorias',
     render: (categoria: { nombre?: string }) => categoria?.nombre || 'Sin categoría'
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
            fetchJugadores()
          }} 
          onCancelAction={() => setShowForm(false)}
        />
      ) : (
        <DataTable 
          columns={columns} 
          data={jugadores} 
          onRowClick={(row) => console.log(row)}
        />
      )}
    </div>
  )
}