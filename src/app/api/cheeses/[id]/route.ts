import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, origin, elaboration, nutrition, price, imageUrl, order } = body;

    const cheese = await db.cheese.update({
      where: { id },
      data: { name, slug, description, origin, elaboration, nutrition, price, imageUrl, order }
    });

    return NextResponse.json(cheese);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar el queso' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.cheese.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar el queso' }, { status: 500 });
  }
}
