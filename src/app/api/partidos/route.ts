import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 10)
    const skip = (page - 1) * limit

    const [partidos, total] = await Promise.all([
      prisma.partidos.findMany({
        skip,
        take: limit,
        include: {
          jugadores_partidos_jugador1_idTojugadores: true,
          jugadores_partidos_jugador2_idTojugadores: true,
          jugadores_partidos_ganador_idTojugadores: true,
          torneos: true
        }
      }),
      prisma.partidos.count()
    ]);
    
    const partidosFormateados = partidos.map(partido => ({
      id: partido.id,
      jugador1Nombre: partido.jugadores_partidos_jugador1_idTojugadores?.nombre ?? 'N/A',
      jugador2Nombre: partido.jugadores_partidos_jugador2_idTojugadores?.nombre ?? 'N/A',
      ganadorNombre: partido.jugadores_partidos_ganador_idTojugadores?.nombre ?? 'N/A',
      torneoNombre: partido.torneos?.nombre ?? 'N/A',
      // Manejo seguro para fechas nulas
      fecha: partido.fecha ? new Date(partido.fecha).toLocaleDateString() : 'N/A'
    }));
    
    return NextResponse.json({ partidos: partidosFormateados, total });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: "Error al obtener partidos" },
      { status: 500 }
    );
  }
}

// ... (resto del código POST y OPTIONS permanece igual)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const nuevoPartido = await prisma.partidos.create({
      data: {
        jugador1_id: parseInt(data.jugador1_id),
        jugador2_id: data.jugador2_id ? parseInt(data.jugador2_id) : null,
        ganador_id: parseInt(data.ganador_id),
        torneo_id: parseInt(data.torneo_id),
        ronda: data.ronda,
        tipo_especial: data.tipo_especial
      }
    });
    
    return NextResponse.json(nuevoPartido, { status: 201 });
  } catch (error: any) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: "Error al crear partido", details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Length': '0'
    }
  })
}