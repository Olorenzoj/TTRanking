import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    try {
        const { jugadores, nuevaCategoriaId, motivo } = await req.json()

        if (!['Ascenso', 'Descenso', 'Ajuste'].includes(motivo)) {
            return NextResponse.json({ error: 'Motivo inválido' }, { status: 400 })
        }

        // Buscar el último torneo registrado (por fecha o ID descendente)
        const ultimoTorneo = await prisma.torneos.findFirst({
            orderBy: { id: 'desc' }, // o cambia a { fecha: 'desc' } si tienes fecha
        })

        if (!ultimoTorneo) {
            return NextResponse.json({ error: 'No hay torneos registrados' }, { status: 404 })
        }

        const torneoId = ultimoTorneo.id

        // Ejecutar el procedimiento para cada jugador
        for (const jugador of jugadores) {
            await prisma.$executeRawUnsafe(`
        CALL cambiar_categoria_jugador(${jugador.id}, ${nuevaCategoriaId}, '${motivo}', ${torneoId});
      `)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error al cambiar categoría:', error)
        return NextResponse.json({ error: 'Error al ejecutar el procedimiento' }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
