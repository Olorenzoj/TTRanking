"use client";

import ClubesWrapper from '@/components/dashboard/ClubesWrapper';
import JugadoresWrapper from '@/components/dashboard/JugadoresWrapper';
import TorneosWrapper from '@/components/dashboard/TorneosWrapper';
import PartidosWrapper from '@/components/dashboard/PartidosWrapper';
import EstadisticasWrapper from '@/components/dashboard/EstadisticasWrapper';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
        <p className="text-gray-600">Bienvenido al sistema de gestión de torneos de tenis de mesa</p>
      </div>
      
      <EstadisticasWrapper />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ClubesWrapper />
        </div>
        <div className="lg:col-span-2">
          <JugadoresWrapper />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TorneosWrapper />
        <PartidosWrapper />
      </div>
    </div>
  );
}