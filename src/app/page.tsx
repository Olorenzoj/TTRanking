'use client'
import {SpeedInsights} from "@vercel/speed-insights/next"
import {useState} from "react"
import {useRouter} from "next/navigation";

export default function Home() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleAccessDashboard = async () => {
        setLoading(true)

        const maxAttempts = 5
        let attempt = 0

        while (attempt < maxAttempts) {
            try {
                const res = await fetch('/api/dbStarter')
                const data = await res.json()

                if (data.success) {
                    router.push('/dashboard')
                    return
                } else {
                    console.log(`Intento ${attempt + 1}: Base de datos no lista`)
                }
            } catch (err) {
                console.warn(`Intento ${attempt + 1} fallido`, err)
            }

            attempt++
            await new Promise((resolve) => setTimeout(resolve, 3000)) // espera 3 segundos antes del siguiente intento
        }

        alert('No se pudo conectar con la base de datos. Intenta nuevamente más tarde.')
        setLoading(false)
    }
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
                        Sistema de Torneos de Tenis de Mesa
                    </h1>

                    <div className="space-y-4">
                        <div className="space-y-4">
                            <button
                                onClick={handleAccessDashboard}
                                disabled={loading}
                                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md text-center font-medium hover:bg-blue-700 transition"
                            >
                                {loading ? 'Verificando base de datos...' : 'Acceder al Dashboard'}
                            </button>
                        </div>

                        <div className="text-center text-gray-600 mt-8">
                            <p className="mb-2">¿Necesitas ayuda?</p>
                            <a
                                href="https://wa.me/50766684666"
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Contacta a soporte
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <SpeedInsights/></>
    )
}
