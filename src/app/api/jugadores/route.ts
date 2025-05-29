import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Add type definitions
type JugadorData = {
  nombre: string
  club_id: number | string
  categoria_id: number | string
  elo?: number
}

export async function GET() {
  try {
    const jugadores = await prisma.jugadores.findMany({
      include: {
        clubes: true,
        categorias: true,
        torneos: true,
      }
    })
    return NextResponse.json(jugadores)
  } catch (error) {
    console.error('Error fetching jugadores:', error)
    return NextResponse.json(
      { error: "Error al obtener jugadores" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data: JugadorData = await request.json()
    
    const nuevoJugador = await prisma.jugadores.create({
      data: {
        nombre: data.nombre,
        club_id: Number(data.club_id),
        categoria_id: Number(data.categoria_id),
        elo: data.elo || 1000, // Default value
      }
    })
    return NextResponse.json(nuevoJugador, { status: 201 })
  } catch (error: any) {
    console.error('Error creating jugador:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Ya existe un jugador con este nombre" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Error al crear jugador" },
      { status: 500 }
    )
  }
}