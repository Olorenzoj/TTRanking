'use client'
import { useState, useEffect } from 'react'
import DataTable from '@/components/ui/DataTable'
import { ArrowDownIcon } from '@heroicons/react/24/outline'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type Jugador = {
  id: number
  ranking: number
  nombre: string
  elo: number
  clubes?: { nombre?: string }
  categorias?: { nombre?: string }
}

type Categoria = {
  id: number
  nombre: string
}

export default function RankingSection({ className = '' }) {
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Obtener categorías disponibles
  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/categorias')
      const data = await response.json()
      setCategorias(data.categorias)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

   const fetchJugadores = async (page = 1, limit = 10) => {
    setIsLoading(true)
     try {
       const url = `/api/ranking?page=${page}&limit=${limit}${
           selectedCategoriaId ? `&categoriaId=${selectedCategoriaId}` : ''
       }`

       const response = await fetch(url)

       if (!response.ok) {
         throw new Error(`Error ${response.status}: ${response.statusText}`)
       }

       const data = await response.json()

       const startRank = (page - 1) * limit + 1
       const rankedData = data.jugadores.map((jugador: Jugador, index: number) => ({
         ...jugador,
         ranking: startRank + index
       }))
      
      setJugadores(rankedData)
      setTotalItems(data.total)
    } catch (error) {
      console.error('Error fetching ranking:', error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchCategorias()
  }, [])

  useEffect(() => {
    // Resetear a página 1 cuando cambia la categoría
    setCurrentPage(1)
    fetchJugadores(1, itemsPerPage)
  }, [selectedCategoriaId])

  useEffect(() => {
    fetchJugadores(currentPage, itemsPerPage)
  }, [currentPage, itemsPerPage])


  const getCurrentMonth = (month: number, year: number, formatted: boolean) => {
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
    
    if (formatted) {
      const mes = monthMap[month].key
      return `${mes} ${year}`
    } else {
      return `${monthMap[month].key}_${year}`
    }
  }

  const handleDownloadPDF = async () => {
    setIsLoading(true)
    try {
      const url = `/api/ranking?all=true${
          selectedCategoriaId ? `&categoriaId=${selectedCategoriaId}` : ''
      }`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth()

      // Obtener nombre de categoría seleccionada
      const categoriaNombre = selectedCategoriaId
          ? categorias.find(cat => cat.id === Number(selectedCategoriaId))?.nombre || ''
          : ''

      const doc = new jsPDF()

    const img = new Image()
    img.src = '/Logo.png'

    img.onload = () => {
      const pdfWidth = 210
      const logoWidth = 70
      const logoHeight = 45
      const logoX = (pdfWidth - logoWidth) / 2
      const logoY = 1

      doc.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight)
      const title = `Ranking ATTA ${categoriaNombre ? `${categoriaNombre} CAT - ` : ''}${getCurrentMonth(month, year, true)}`
      const lineY = logoY + logoHeight + 5
      doc.setLineWidth(0.5)
      doc.line(15, lineY, 195, lineY)

      doc.setFontSize(18)

      const titleWidth = doc.getTextWidth(title)
      const titleX = (pdfWidth - titleWidth) / 2
      const titleY = lineY + 8

      doc.text(title, titleX, titleY)

      autoTable(doc, {
        startY: titleY + 5,
        head: [['Ranking', 'Nombre', 'Puntos', 'Club', 'Categoría']],
        body: data.jugadores.map((j: Jugador, index: number) => [
          index + 1,
          j.nombre,
          j.elo,
          j.clubes?.nombre || 'Sin club',
          j.categorias?.nombre || 'Sin categoría'
        ])
      })

      doc.save(`Ranking_Atta_${categoriaNombre || 'General'}_${getCurrentMonth(month, year, false)}.pdf`)
    }

    img.onerror = () => {
      alert('Error loading logo image for the PDF.')
    }
  } catch (error) {
    console.error('Error al generar PDF:', error)
  } finally {
    setIsLoading(false)
  }
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
          <h2 className="text-xl font-bold">Ranking de Jugadores</h2>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <select
                value={selectedCategoriaId}
                onChange={(e) => setSelectedCategoriaId(e.target.value)}
                className="border rounded px-3 py-1 w-full md:w-48"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
              ))}
            </select>

            <button
                onClick={handleDownloadPDF}
                className="bg-green-600 text-white px-3 py-1 rounded flex items-center justify-center"
            >
              <ArrowDownIcon className="h-4 w-4 mr-1" />
              PDF
            </button>
          </div>
        </div>

        <DataTable
            columns={columns}
            data={jugadores}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            isLoading={isLoading}
        />
      </div>
  )
}