import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import type { partidos_ronda } from '@prisma/client' // ✅ Importar el enum

function mapRondaToEnum(valor: string): partidos_ronda {
  switch (valor) {
    case "32avos": return "treinta_y_dos_avos";
    case "16avos": return "dieciseis_avos";
    case "Campeón": return "Campeon";
    default: return valor as partidos_ronda; // ✅ Cast explícito
  }
}

function mapEnumToRondaValor(valor: partidos_ronda | null): string {
  if (valor === null) return 'N/A';
  
  switch (valor) {
    case "treinta_y_dos_avos": return "32avos";
    case "dieciseis_avos": return "16avos";
    case "Campeon": return "Campeón";
    default: return valor;
  }
}

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
      fecha: partido.fecha ? new Date(partido.fecha).toLocaleDateString() : 'N/A',
      ronda: mapEnumToRondaValor(partido.ronda)
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

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.ronda) {
      return NextResponse.json({ error: "La ronda es requerida" }, { status: 400 });
    }

    const nuevoPartido = await prisma.partidos.create({
      data: {
        jugador1_id: parseInt(data.jugador1_id),
        jugador2_id: data.jugador2_id ? parseInt(data.jugador2_id) : null,
        ganador_id: parseInt(data.ganador_id),
        torneo_id: parseInt(data.torneo_id),
        ronda: mapRondaToEnum(data.ronda),
        tipo_especial: data.tipo_especial || null
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
  });
}
