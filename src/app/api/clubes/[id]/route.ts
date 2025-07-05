import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const clubId = parseInt(id)

    const body = await request.json()

    if (isNaN(clubId)) {
        return NextResponse.json({ error: 'ID de club inválido' }, { status: 400 })
    }

    try {
        const clubActualizado = await prisma.clubes.update({
            where: { id: clubId },
            data: body,
        })

        return NextResponse.json(clubActualizado)
    } catch (error) {
        console.error('Error al actualizar club:', error)
        return NextResponse.json({ error: 'Error al actualizar club' }, { status: 500 })
    }
}
