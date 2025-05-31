import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 10)
    const skip = (page - 1) * limit

    const [clubes, total] = await Promise.all([
      prisma.clubes.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: { jugadores: true }
          }
        }
      }),
      prisma.clubes.count()
    ])

    // Transformar los datos para incluir jugadoresCount directamente
    const clubesConCount = clubes.map(club => ({
      id: club.id,
      nombre: club.nombre,
      // Asegurar que jugadoresCount esté presente
      jugadoresCount: club._count?.jugadores ?? 0
    }))

    return NextResponse.json({ clubes: clubesConCount, total })
  } catch (error) {
    console.error('Error fetching clubs:', error)
    return NextResponse.json(
      { error: "Error al obtener clubes" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { nombre } = await request.json()
    const nuevoClub = await prisma.clubes.create({ data: { nombre } })
    return NextResponse.json(nuevoClub, { status: 201 })
  } catch (error: any) {
    console.error('Error creating club:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Ya existe un club con este nombre" },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Error al crear club" },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}