'use client'
import { useState, useEffect, FormEvent } from 'react'
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

export default function ClubForm({ onSuccessAction, onCancelAction }: JugadorFormProps) {
  const [nombre, setNombre] = useState('')
  const [clubId, setClubId] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [elo, setElo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clubes, setClubes] = useState<Club[]>([])
const [categorias, setCategorias] = useState<Categoria[]>([])


  useEffect(() => {
    // Cargar clubes y categorías
    // In JugadorForm.tsx, update the fetchData function:
const fetchData = async () => {
  try {
    const [clubesRes, categoriasRes] = await Promise.all([
      fetch('/api/clubes'),
      fetch('/api/categorias')
    ]);
    
    const clubesData = await clubesRes.json();
    const categoriasData = await categoriasRes.json();
    
    // Extract array from API response
    setClubes(clubesData.clubes || []); // Use 'clubes' property
    setCategorias(categoriasData || []); 
    
    if (categoriasData.length > 0) {
      setCategoriaId(categoriasData[0].id.toString());
    }
  } catch (error) {
    console.error('Fetch error:', error);
    setClubes([]);
    setCategorias([]);
  }
};
    
    fetchData()
  }, [])
  
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
        headers: {
          'Content-Type': 'application/json'
        },
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
      
      <div>
        <label htmlFor="club" className="block text-sm font-medium text-gray-700">
          Club
        </label>
        <select
          id="club"
          value={clubId}
          onChange={(e) => setClubId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        >
          <option value="">Selecciona un club</option>
          {clubes.map(club => (
            <option key={club.id} value={club.id}>
              {club.nombre}
            </option>
          ))}
        </select>
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