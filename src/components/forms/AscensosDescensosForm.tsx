'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Modal from '@/components/ui/Modal'

interface Jugador {
    id: number
    nombre: string
    categoria_id: number
}

interface Categoria {
    id: number
    nombre: string
}

interface Props {
    tipo: 'ascenso' | 'descenso'
    onClose: () => void
}

export default function GestionAscensoDescenso({ tipo, onClose }: Props) {
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [jugadores, setJugadores] = useState<Jugador[]>([])
    const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>('')
    const [selectedJugadores, setSelectedJugadores] = useState<Jugador[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Obtener categorías disponibles
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await fetch('/api/categorias')
                const data = await res.json()

                // Filtrar categorías según el tipo
                const filtered = data.filter((cat: Categoria) =>
                    tipo === 'ascenso' ? cat.id !== 1 : cat.id !== 4
                )

                setCategorias(filtered)

                // Seleccionar la primera categoría por defecto
                if (filtered.length > 0) {
                    setSelectedCategoriaId(filtered[0].id.toString())
                }
            } catch (error) {
                console.error(error)
                toast.error('Error al obtener categorías')
            }
        }
        fetchCategorias()
    }, [tipo])

    // Obtener jugadores cuando se selecciona una categoría
    useEffect(() => {
        if (!selectedCategoriaId) return

        const fetchJugadores = async () => {
            try {
                const res = await fetch(`/api/ranking?all=true&categoriaId=${selectedCategoriaId}`)
                const data = await res.json()
                setJugadores(data.jugadores)
            } catch (error) {
                console.error(error)
                toast.error('Error al obtener jugadores')
            }
        }
        fetchJugadores()
    }, [selectedCategoriaId])

    // Filtrar jugadores por término de búsqueda
    const filteredJugadores = jugadores.filter(jugador =>
        jugador.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleJugadorChange = (jugador: Jugador) => {
        setSelectedJugadores(prev => {
            const exists = prev.find(j => j.id === jugador.id)
            if (exists) {
                return prev.filter(j => j.id !== jugador.id)
            } else {
                return [...prev, jugador]
            }
        })
    }

    const handleRemoveJugador = (jugadorId: number) => {
        setSelectedJugadores(prev => prev.filter(j => j.id !== jugadorId))
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            // Determinar la nueva categoría
            const currentCategoria = categorias.find(c => c.id === Number(selectedCategoriaId))
            if (!currentCategoria) return

            const newCategoriaId = tipo === 'ascenso'
                ? currentCategoria.id - 1
                : currentCategoria.id + 1

            // Preparar datos para actualizar
            const jugadoresToUpdate = selectedJugadores.map(jugador => ({
                id: jugador.id,
                categoria_id: newCategoriaId
            }))

            // Actualizar jugadores
            const res = await fetch('/api/jugadores', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jugadoresToUpdate)
            })

            if (res.ok) {
                toast.success(tipo === 'ascenso' ? 'Ascensos aplicados' : 'Descensos aplicados')
                onClose()
            } else {
                const errorData = await res.json()
                toast.error(errorData.error || 'Error al actualizar jugadores')
            }
        } catch (error) {
            console.error(error)
            toast.error('Error de conexión')
        } finally {
            setIsSubmitting(false)
            setShowConfirmation(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {tipo === 'ascenso' ? 'Gestión de Ascensos' : 'Gestión de Descensos'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block mb-2 font-medium">Categoría</label>
                    <select
                        value={selectedCategoriaId}
                        onChange={(e) => setSelectedCategoriaId(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>

                    <p className="mt-2 text-sm text-gray-500">
                        {tipo === 'ascenso'
                            ? 'Seleccione jugadores para ascender a la categoría superior'
                            : 'Seleccione jugadores para descender a la categoría inferior'}
                    </p>
                </div>

                <div>
                    <label className="block mb-2 font-medium">Buscar jugador</label>
                    <input
                        type="text"
                        placeholder="Nombre del jugador..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
            </div>

            {/* Sección de jugadores seleccionados */}
            {selectedJugadores.length > 0 && (
                <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium mb-2">Jugadores seleccionados:</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedJugadores.map(jugador => (
                            <div
                                key={jugador.id}
                                className="flex items-center bg-blue-100 text-blue-800 rounded-full py-1 px-3 text-sm"
                            >
                                {jugador.nombre}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveJugador(jugador.id)}
                                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-6">
                <label className="block mb-2 font-medium">Jugadores</label>
                <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                    {filteredJugadores.length === 0 ? (
                        <p className="p-4 text-center text-gray-500">No se encontraron jugadores</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {filteredJugadores.map(jugador => (
                                <li key={jugador.id} className="p-3 hover:bg-gray-50">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedJugadores.some(j => j.id === jugador.id)}
                                            onChange={() => handleJugadorChange(jugador)}
                                            className="h-4 w-4 text-blue-600 rounded"
                                        />
                                        <span className="ml-3 block">{jugador.nombre}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>

                <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={selectedJugadores.length === 0 || isSubmitting}
                    className={`px-4 py-2 rounded-md text-white ${
                        selectedJugadores.length === 0 || isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : tipo === 'ascenso' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                    {tipo === 'ascenso' ? 'Ascender seleccionados' : 'Descender seleccionados'}
                </button>
            </div>

            {/* Modal de confirmación */}
            <Modal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                title={`Confirmar ${tipo === 'ascenso' ? 'ascensos' : 'descensos'}`}
            >
                <div className="mb-6">
                    <p className="mb-4">
                        Está a punto de realizar los siguientes cambios:
                    </p>

                    <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                        <ul className="space-y-2">
                            {selectedJugadores.map(jugador => {
                                const categoriaActual = categorias.find(c => c.id === jugador.categoria_id)
                                const nuevaCategoriaId = tipo === 'ascenso'
                                    ? (categoriaActual?.id || 0) - 1
                                    : (categoriaActual?.id || 0) + 1
                                const nuevaCategoria = categorias.find(c => c.id === nuevaCategoriaId)

                                return (
                                    <li key={jugador.id} className="flex justify-between items-center py-2 border-b">
                                        <span className="font-medium">{jugador.nombre}</span>
                                        <div className="flex items-center">
                                            <span className="text-gray-600 mr-2">{categoriaActual?.nombre}</span>
                                            <span className="text-gray-400 mx-2">→</span>
                                            <span className="font-semibold">{nuevaCategoria?.nombre}</span>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <p className="mt-4 text-sm text-red-600">
                        Esta acción no se puede deshacer. ¿Desea continuar?
                    </p>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setShowConfirmation(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 rounded-md text-white ${
                            isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : tipo === 'ascenso' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Procesando...' : 'Confirmar cambios'}
                    </button>
                </div>
            </Modal>
        </div>
    )
}