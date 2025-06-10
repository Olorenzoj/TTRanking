'use client'
import { useState, useEffect, FormEvent, useMemo } from 'react'
import { toast } from 'react-hot-toast'

interface Club {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface JugadorFormProps {
  onSuccessAction: () => void;
  onCancelAction: () => void;
}

export default function JugadorForm({ onSuccessAction, onCancelAction }: JugadorFormProps) {
  const [nombre, setNombre] = useState('')
  const [clubId, setClubId] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [elo, setElo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clubes, setClubes] = useState<Club[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])

  // States for searchable dropdown
  const [clubSearch, setClubSearch] = useState('')
  const [showClubResults, setShowClubResults] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubesRes, categoriasRes] = await Promise.all([
          fetch('/api/clubes?all=true'),
          fetch('/api/categorias')
        ])

        const clubesData = await clubesRes.json()
        const categoriasData = await categoriasRes.json()

        setClubes(clubesData.clubes || [])
        setCategorias(categoriasData || [])

        if (categoriasData.length > 0) {
          setCategoriaId(categoriasData[0].id.toString())
        }
      } catch (error) {
        console.error('Fetch error:', error)
        toast.error('Error al cargar datos')
      }
    }

    fetchData()
  }, [])

  const filteredClub = useMemo(() => {
    if (!clubSearch) return clubes
    return clubes.filter(club =>
        club.nombre.toLowerCase().includes(clubSearch.toLowerCase()) ||
        club.id.toString().includes(clubSearch)
    )
  }, [clubes, clubSearch])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const jugadorData = {
      nombre,
      club_id: clubId,
      categoria_id: categoriaId,
      elo: elo ? parseFloat(elo) : null
    }

    try {
      const response = await fetch('/api/jugadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jugadorData)
      })

      if (response.ok) {
        toast.success('Jugador creado exitosamente')
        onSuccessAction()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Error al crear jugador')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre del Jugador
          </label>
          <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
          />
        </div>

        {/* Club Searchable Dropdown */}
        <div className="relative">
          <label htmlFor="club" className="block text-sm font-medium text-gray-700">
            Club
          </label>
          <input
              type="text"
              id="club"
              value={clubSearch}
              onChange={(e) => {
                setClubSearch(e.target.value)
                setShowClubResults(true)
              }}
              onFocus={() => setShowClubResults(true)}
              onBlur={() => setTimeout(() => setShowClubResults(false), 200)}
              placeholder="Buscar club..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
          />
          {showClubResults && filteredClub.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredClub.map((club) => (
                    <div
                        key={club.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => {
                          setClubId(club.id.toString())
                          setClubSearch(club.nombre)
                          setShowClubResults(false)
                        }}
                    >
                      {club.nombre}
                    </div>
                ))}
              </div>
          )}
        </div>

        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
              id="categoria"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
          >
            {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="elo" className="block text-sm font-medium text-gray-700">
            ELO Inicial (opcional)
          </label>
          <input
              type="number"
              id="elo"
              value={elo}
              onChange={(e) => setElo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              step="0.1"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
              type="button"
              onClick={onCancelAction}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
  )
}
