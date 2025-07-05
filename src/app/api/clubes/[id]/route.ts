import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define el tipo para el contexto de la ruta
interface RouteContext {
    params: {
        id: string;
    };
}

export async function PATCH(
    request: NextRequest,
    context: RouteContext  // Usa el tipo RouteContext
) {
    const { id } = context.params;  // Accede a params desde context
    const clubId = parseInt(id);

    const body = await request.json();

    if (isNaN(clubId)) {
        return NextResponse.json({ error: 'ID de club inválido' }, { status: 400 });
    }

    try {
        const clubActualizado = await prisma.clubes.update({
            where: { id: clubId },
            data: body,
        });

        return NextResponse.json(clubActualizado);
    } catch (error: any) {
        console.error('Error al actualizar club:', error);
        return NextResponse.json(
            { error: 'Error al actualizar club', details: error.message },
            { status: 500 }
        );
    }
}