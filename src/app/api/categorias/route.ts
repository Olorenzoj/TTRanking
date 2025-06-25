import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const categorias = await prisma.categorias.findMany({
      orderBy: { nombre: 'asc' }
    })
    return NextResponse.json({ categorias })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
        { error: 'Error al obtener categorías' },
        { status: 500 }
    )
  }
}