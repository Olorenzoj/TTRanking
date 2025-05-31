import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || 1)
    const limit = Number(searchParams.get('limit') || 10)
    const skip = (page - 1) * limit

    const [jugadores, total] = await Promise.all([
      prisma.jugadores.findMany({
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
      prisma.jugadores.count()
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