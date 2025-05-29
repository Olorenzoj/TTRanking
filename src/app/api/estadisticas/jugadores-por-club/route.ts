import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const jugadoresPorClub = await prisma.clubes.findMany({
      select: {
        nombre: true,
        _count: {
          select: { jugadores: true }
        }
      }
    });
    
    return NextResponse.json(jugadoresPorClub.map((club: { nombre: string, _count: { jugadores: number } }) => ({
      club: club.nombre,
      jugadores: club._count.jugadores
    })));
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}