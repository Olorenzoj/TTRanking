import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const torneos = await prisma.torneos.findMany({
      include: {
        torneo_categorias: {
          include: {
            categorias: true
          }
        }
      }
    })
    return NextResponse.json(torneos)
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener torneos" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const data = await request.json()
  
  try {
    const nuevoTorneo = await prisma.torneos.create({
      data: {
        nombre: data.nombre,
        fecha: new Date(data.fecha),
        ubicacion: data.ubicacion,
        torneo_categorias: {
          create: data.categorias.map((catId: number) => ({
            categoria_id: catId
          }))
        }
      }
    })
    return NextResponse.json(nuevoTorneo, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error al crear torneo", error: error.message },
      { status: 500 }
    )
  }
}