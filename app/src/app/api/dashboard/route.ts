import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const [booksResult, ordersResult] = await Promise.all([
      supabaseAdmin.from('books').select('*', { count: 'exact' }),
      supabaseAdmin.from('orders').select('*'),
    ]);

    const books = booksResult.data || [];
    const orders = ordersResult.data || [];

    const stats = {
      totalBooks: booksResult.count || 0,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.status === 'pending').length,
      verifiedOrders: orders.filter((o) => o.status === 'verified').length,
      sentOrders: orders.filter((o) => o.status === 'sent').length,
      cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter((o) => o.status === 'sent')
        .reduce((sum: number, o: { total: number }) => sum + o.total, 0),
      recentOrders: orders.slice(0, 10),
    };

    return NextResponse.json({ stats });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
