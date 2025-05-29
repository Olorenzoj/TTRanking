import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const clubes = await prisma.clubes.findMany({
      include: {
        _count: { select: { jugadores: true } }
      }
    })
    return NextResponse.json(clubes)
  } catch (error) {
    console.error('Error fetching clubes:', error)
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