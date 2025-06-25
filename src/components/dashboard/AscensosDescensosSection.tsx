'use client'
import { useState } from 'react'
import AscensosDescensosForm from "@/components/forms/AscensosDescensosForm";

export default function GestionPage() {
    const [showForm, setShowForm] = useState<'ascenso' | 'descenso' | null>(null)

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-start gap-4">
                <button
                    onClick={() => setShowForm('ascenso')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Manejar Ascensos
                </button>
                <button
                    onClick={() => setShowForm('descenso')}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Manejar Descensos
                </button>
            </div>

            {showForm === 'ascenso' && (
                <AscensosDescensosForm
                    tipo="ascenso"
                    onClose={() => setShowForm(null)}
                />
            )}

            {showForm === 'descenso' && (
                <AscensosDescensosForm
                    tipo="descenso"
                    onClose={() => setShowForm(null)}
                />
            )}
        </div>
    )
}