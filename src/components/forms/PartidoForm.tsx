'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

interface Jugador {
  id: number
  nombre: string
  elo: number
}

interface Torneo {
  id: number
  nombre: string
  fecha: string // o Date si ya lo estás transformando
}

interface PartidoFormProps {
  onSuccessAction: () => void
  onCancelAction: () => void
}


export default function PartidoForm({ onSuccessAction, onCancelAction }: PartidoFormProps) {
  const [jugador1Id, setJugador1Id] = useState('')
  const [jugador2Id, setJugador2Id] = useState('')
  const [ganadorId, setGanadorId] = useState('')
  const [torneoId, setTorneoId] = useState('')
  const [ronda, setRonda] = useState('')
  const [tipoEspecial, setTipoEspecial] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jugadores, setJugadores] = useState<Jugador[]>([])
const [torneos, setTorneos] = useState<Torneo[]>([])


  useEffect(() => {
    const fetchData = async () => {
      const [jugadoresRes, torneosRes] = await Promise.all([
        fetch('/api/jugadores'),
        fetch('/api/torneos')
      ])
      
      const jugadoresData = await jugadoresRes.json()
      const torneosData = await torneosRes.json()
      
      setJugadores(jugadoresData)
      setTorneos(torneosData)
    }
    
    fetchData()
  }, [])
  
  // Actualizar ganador cuando cambian los jugadores
  useEffect(() => {
    if (jugador1Id && !jugador2Id) {
      setGanadorId(jugador1Id)
    }
  }, [jugador1Id, jugador2Id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const partidoData = {
      jugador1_id: jugador1Id,
      jugador2_id: jugador2Id || null,
      ganador_id: ganadorId,
      torneo_id: torneoId,
      ronda: ronda || null,
      tipo_especial: tipoEspecial || null
    }
    
    try {
      const response = await fetch('/api/partidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(partidoData)
      })
      
      if (response.ok) {
        toast.success('Partido registrado exitosamente')
        onSuccessAction()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Error al registrar partido')
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
        <label htmlFor="torneo" className="block text-sm font-medium text-gray-700">
          Torneo
        </label>
        <select
          id="torneo"
          value={torneoId}
          onChange={(e) => setTorneoId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        >
          <option value="">Selecciona un torneo</option>
          {torneos.map(torneo => (
            <option key={torneo.id} value={torneo.id}>
              {torneo.nombre} - {new Date(torneo.fecha).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="jugador1" className="block text-sm font-medium text-gray-700">
            Jugador 1
          </label>
          <select
            id="jugador1"
            value={jugador1Id}
            onChange={(e) => setJugador1Id(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Selecciona un jugador</option>
            {jugadores.map(jugador => (
              <option key={jugador.id} value={jugador.id}>
                {jugador.nombre} ({jugador.elo})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="jugador2" className="block text-sm font-medium text-gray-700">
            Jugador 2 (opcional)
          </label>
          <select
            id="jugador2"
            value={jugador2Id}
            onChange={(e) => setJugador2Id(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Bye/Forfeit</option>
            {jugadores
              .filter(j => j.id !== parseInt(jugador1Id || '0'))
              .map(jugador => (
                <option key={jugador.id} value={jugador.id}>
                  {jugador.nombre} ({jugador.elo})
                </option>
              ))}
          </select>
        </div>
      </div>
      
      {jugador2Id && (
        <div>
          <label htmlFor="ganador" className="block text-sm font-medium text-gray-700">
            Ganador
          </label>
          <select
            id="ganador"
            value={ganadorId}
            onChange={(e) => setGanadorId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Selecciona un ganador</option>
            <option value={jugador1Id}>
              {jugadores.find(j => j.id === parseInt(jugador1Id))?.nombre}
            </option>
            <option value={jugador2Id}>
              {jugadores.find(j => j.id === parseInt(jugador2Id))?.nombre}
            </option>
          </select>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="ronda" className="block text-sm font-medium text-gray-700">
            Ronda
          </label>
          <select
            id="ronda"
            value={ronda}
            onChange={(e) => setRonda(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Selecciona una ronda</option>
            <option value="Grupos">Grupos</option>
            <option value="32avos">32avos</option>
            <option value="16avos">16avos</option>
            <option value="Octavos">Octavos</option>
            <option value="Cuartos">Cuartos</option>
            <option value="Semifinal">Semifinal</option>
            <option value="Final">Final</option>
            <option value="Campeón">Campeón</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="tipo_especial" className="block text-sm font-medium text-gray-700">
            Tipo Especial
          </label>
          <select
            id="tipo_especial"
            value={tipoEspecial}
            onChange={(e) => setTipoEspecial(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Ninguno</option>
            <option value="Forfeit">Forfeit</option>
            <option value="Bye">Bye</option>
          </select>
        </div>
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
          {isSubmitting ? 'Registrando...' : 'Registrar Partido'}
        </button>
      </div>
    </form>
  )
}