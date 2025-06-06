import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 10)
    const skip = (page - 1) * limit

    // Si se solicita todos los registros
    if (all) {
      const jugadores = await prisma.jugadores.findMany({
        select: {
          id: true,
          nombre: true,
          elo: true
        },
        orderBy: {
          nombre: 'asc'
        }
      })
      return NextResponse.json({jugadores: jugadores ?? []})
    }

    // Paginación normal
    const [jugadores, total] = await Promise.all([
      prisma.jugadores.findMany({
        skip,
        take: limit,
        include: {
          clubes: true,
          categorias: true,
        },
      }),
      prisma.jugadores.count()
    ])

    return NextResponse.json({ jugadores, total })
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
    const data = await request.json()
    
    const nuevoJugador = await prisma.jugadores.create({
      data: {
        nombre: data.nombre,
        club_id: Number(data.club_id),
        categoria_id: Number(data.categoria_id),
        elo: data.elo || 1000,
      },
      include: {
        clubes: true,
        categorias: true,
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