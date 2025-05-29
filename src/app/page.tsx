import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Sistema de Torneos de Tenis de Mesa
        </h1>
        
        <div className="space-y-4">
          <Link 
            href="/dashboard" 
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md text-center font-medium hover:bg-blue-700 transition"
          >
            Acceder al Dashboard
          </Link>
          
          <div className="text-center text-gray-600 mt-8">
            <p className="mb-2">¿Necesitas ayuda?</p>
            <a 
              href="mailto:soporte@torneostenis.com" 
              className="text-blue-600 hover:underline"
            >
              soporte@torneostenis.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}