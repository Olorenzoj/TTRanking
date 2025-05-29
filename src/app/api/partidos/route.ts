import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const partidos = await prisma.partidos.findMany({
      include: {
        jugadores_partidos_jugador1_idTojugadores: true,
        jugadores_partidos_jugador2_idTojugadores: true,
        jugadores_partidos_ganador_idTojugadores: true,
        torneos: true
      }
    });
    
    const partidosFormateados = partidos.map(partido => ({
      ...partido,
      jugador1: partido.jugadores_partidos_jugador1_idTojugadores,
      jugador2: partido.jugadores_partidos_jugador2_idTojugadores,
      ganador: partido.jugadores_partidos_ganador_idTojugadores,
      torneo: partido.torneos
    }));
    
    return NextResponse.json(partidosFormateados);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: "Error al obtener partidos" },
      { status: 500 }
    );
  }
}

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