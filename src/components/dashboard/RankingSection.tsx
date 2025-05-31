'use client'
import { useState, useEffect } from 'react'
import DataTable from '@/components/ui/DataTable'
import { ArrowDownIcon, PlusIcon } from '@heroicons/react/24/outline'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type Jugador = {
  ranking: number
  nombre: string
  elo: number
  clubes?: { nombre?: string }
  categorias?: { nombre?: string }
}


export default function RankingSection({ className = '' }) {
  const [showForm, setShowForm] = useState(false)
  const [jugadores, setJugadores] = useState<Jugador[]>([])

  const fetchJugadores = async () => {
    const response = await fetch('/api/jugadores',
      {
        method: 'GET'
      }
    )
    const data = await response.json()
    const sortedData = data.sort((a: Jugador, b: Jugador)=> b.elo - a.elo)
    .map((jugador: Jugador, index: number) => ({
    ...jugador,
    ranking: index + 1
  }))
    setJugadores(sortedData)
  }

  useEffect(() => {
    fetchJugadores()
  }, [])
  const getCurrentMonth = (month : number, year : number, formatted: boolean) => {
    const monthMap = [
      { value: "1", label: "ENE", key: "ENE" },
      { value: "2", label: "FEB", key: "FEB" },
      { value: "3", label: "MAR", key: "MAR" },
      { value: "4", label: "ABRIL", key: "ABRIL" },
      { value: "5", label: "MAY", key: "MAY" },
      { value: "6", label: "JUN", key: "JUN" },
      { value: "7", label: "JUL", key: "JUL" },
      { value: "8", label: "AGO", key: "AGO" },
      { value: "9", label: "SEP", key: "SEP" },
      { value: "10", label: "OCT", key: "OCT" },
      { value: "11", label: "NOV", key: "NOV" },
      { value: "12", label: "DIC", key: "DIC" }
    ];
    
    if (formatted){
      const mes = monthMap[month].key
      return `${mes.toLowerCase()} ${year}`
    }else{
      return `${monthMap[month].key}_${year}`
    }
  }

  const handleDownloadPDF = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const doc = new jsPDF()
    const header = () => {
      doc.setFontSize(28)
      doc.setTextColor(40)
      doc.text('Advanced Table Tennis Academy', 15, 15)

      doc.setLineWidth(0.5)
      doc.line(22.5, 22.5, 200, 22.5)

    }

    header()
    doc.setFontSize(15)
    doc.text(`Ranking Atta ${getCurrentMonth(month, year, true)}`, 15, 30)
    autoTable(doc, {
      startY: 35,
      head: [['Ranking', 'Nombre', 'Puntos', 'Club', 'Categoría']],
      body: jugadores.map(j => [
        j.ranking,
        j.nombre,
        j.elo,
        j.clubes?.nombre || 'Sin club',
        j.categorias?.nombre || 'Sin categoría'
      ])
    })
    doc.save(`Ranking_Atta_${getCurrentMonth(month, year, false)}.pdf`)
  }

  const columns = [
    { header: 'Ranking', accessor: 'ranking', sortable: true },
    { header: 'Nombre', accessor: 'nombre', sortable: true },
    { header: 'Puntaje', accessor: 'elo', sortable: true },
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
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-3 py-1 rounded flex items-center ml-2"
        >
          <ArrowDownIcon className="h-4 w-4 mr-1" />
          PDF
        </button>
      </div>

        <DataTable
          columns={columns}
          data={jugadores}
          onRowClick={(row) => console.log(row)}
        />
    </div>
  )
}