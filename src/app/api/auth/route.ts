import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña son requeridos' }, { status: 400 });
    }

    const admin = await db.admin.findUnique({
      where: { username }
    });

    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, username: admin.username }
    });
  } catch {
    return NextResponse.json({ error: 'Error en la autenticación' }, { status: 500 });
  }
}
