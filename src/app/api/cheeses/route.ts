import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cheeses = await db.cheese.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(cheeses);
  } catch {
    return NextResponse.json({ error: 'Error al obtener los quesos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, origin, elaboration, nutrition, price, imageUrl, order } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Nombre y slug son requeridos' }, { status: 400 });
    }

    const cheese = await db.cheese.create({
      data: { name, slug, description, origin, elaboration, nutrition, price, imageUrl, order: order || 0 }
    });

    return NextResponse.json(cheese, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al crear el queso';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
