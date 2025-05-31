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

export default function RankingSection({ className = '' }) {
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

   const fetchJugadores = async (page = 1, limit = 10) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/ranking?page=${page}&limit=${limit}`)
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Calcular ranking global
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
      return `${mes.toLowerCase()} ${year}`
    } else {
      return `${monthMap[month].key}_${year}`
    }
  }

  const handleDownloadPDF = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const doc = new jsPDF();

    const img = new Image();
    img.src = '/Logo.png';

    img.onload = () => {
      const pdfWidth = 210;

      // Medidas del logo
      const logoWidth = 70;
      const logoHeight = 45;
      const logoX = (pdfWidth - logoWidth) / 2;
      const logoY = 1;

      doc.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight);

      const lineY = logoY + logoHeight + 5;
      doc.setLineWidth(0.5);
      doc.line(15, lineY, 195, lineY);

      doc.setFontSize(18);
      const title = `Ranking Atta ${getCurrentMonth(month, year, true)}`;
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pdfWidth - titleWidth) / 2;
      const titleY = lineY + 8;

      doc.text(title, titleX, titleY);

      // Tabla
      autoTable(doc, {
        startY: titleY + 5,
        head: [['Ranking', 'Nombre', 'Puntos', 'Club', 'Categoría']],
        body: jugadores.map(j => [
          j.ranking,
          j.nombre,
          j.elo,
          j.clubes?.nombre || 'Sin club',
          j.categorias?.nombre || 'Sin categoría'
        ])
      });

      doc.save(`Ranking_Atta_${getCurrentMonth(month, year, false)}.pdf`);
    };

    img.onerror = () => {
      alert('Error loading logo image for the PDF.');
    };
  };

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
        <h2 className="text-xl font-bold">Ranking de Jugadores</h2>
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