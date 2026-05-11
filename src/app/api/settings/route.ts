import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let settings = await db.siteSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      settings = await db.siteSettings.create({
        data: {
          id: 'default',
          phone: '',
          email: '',
          instagram: '',
          facebook: ''
        }
      });
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Error al obtener la configuración' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { phone, email, instagram, facebook } = body;

    const settings = await db.siteSettings.upsert({
      where: { id: 'default' },
      update: { phone, email, instagram, facebook },
      create: { id: 'default', phone, email, instagram, facebook }
    });

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar la configuración' }, { status: 500 });
  }
}
