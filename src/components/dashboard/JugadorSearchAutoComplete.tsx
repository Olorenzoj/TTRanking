'use client';

import { useState, useEffect } from 'react';

type Jugador = {
    id: number;
    nombre: string;
    elo: number;
    clubes?: { nombre?: string };
};

export default function JugadorSearchAutocomplete({
                                                      onSelect,
                                                  }: {
    onSelect?: (jugador: Jugador) => void;
}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Jugador[]>([]);
    const [loading, setLoading] = useState(false);

    // Buscar jugadores en servidor
    useEffect(() => {
        const fetchJugadores = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/ranking?all=true`);
                const data = await res.json();

                // Filtrar por nombre parecido
                const filtrados = (data.jugadores || []).filter((j: Jugador) =>
                    j.nombre.toLowerCase().includes(query.toLowerCase())
                );

                setResults(filtrados);
            } catch (error) {
                console.error('Error buscando jugadores:', error);
            } finally {
                setLoading(false);
            }
        };

        const delay = setTimeout(fetchJugadores, 300); // debounce
        return () => clearTimeout(delay);
    }, [query]);

    return (
        <div className="w-full max-w-md">
            <input
                type="text"
                placeholder="Buscar jugador..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            />

            {/* Loader */}
            {loading && (
                <div className="mt-2 text-gray-500 text-sm">Buscando...</div>
            )}

            {/* Lista de resultados */}
            {results.length > 0 && (
                <div className="mt-2 space-y-2">
                    {results.map((jugador) => (
                        <div
                            key={jugador.id}
                            className="p-3 border rounded-lg shadow bg-white hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                onSelect?.(jugador);
                                setQuery(jugador.nombre); // opcional: rellena el input
                            }}
                        >
                            <h3 className="font-bold text-base">{jugador.nombre}</h3>
                            <p className="text-sm text-gray-600">
                                ELO: <span className="font-medium">{jugador.elo}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Club: {jugador.clubes?.nombre || 'Sin club'}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* No encontrado */}
            {query.length >= 2 && !loading && results.length === 0 && (
                <div className="mt-2 text-gray-500 text-sm">No se encontraron jugadores</div>
            )}
        </div>
    );
}
