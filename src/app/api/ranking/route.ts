import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 10)
    const categoriaId = searchParams.get('categoriaId')
    const skip = (page - 1) * limit

    // Filtro por categoría
    const where = categoriaId ? { categoria_id: Number(categoriaId) } : {}

    if (all) {
      const jugadores = await prisma.jugadores.findMany({
        where,
        select: {
          id: true,
          nombre: true,
          clubes: true,
          categorias: true,
          elo: true
        },
        orderBy: {
          elo: 'desc'
        }
      })
      return NextResponse.json({jugadores: jugadores ?? []})
    }

    const [jugadores, total] = await Promise.all([
      prisma.jugadores.findMany({
        where,
        skip,
        take: limit,
        include: {
          clubes: true,
          categorias: true,
        },
        orderBy: {
          elo: 'desc',
        }
      }),
      prisma.jugadores.count({ where })
    ])

    return NextResponse.json({ jugadores, total })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
        { error: 'Error al obtener ranking' },
        { status: 500 }
    )
  }
}