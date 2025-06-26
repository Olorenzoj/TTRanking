import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const categorias = await prisma.categorias.findMany()
    return NextResponse.json(categorias)
  } catch (error) {
    return NextResponse.json(
        { message: "Error al obtener categorías" },
        { status: 500 }
    )
  }
}
