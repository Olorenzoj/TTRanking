import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
    const clubId = parseInt(context.params.id);

    if (isNaN(clubId)) {
        return NextResponse.json({ error: 'ID de club inválido' }, { status: 400 });
    }

    const body = await request.json();

    try {
        const clubActualizado = await prisma.clubes.update({
            where: { id: clubId },
            data: body,
        });

        return NextResponse.json(clubActualizado);
    } catch (error) {
        console.error('Error al actualizar club:', error);
        return NextResponse.json({ error: 'Error al actualizar club' }, { status: 500 });
    }
}
