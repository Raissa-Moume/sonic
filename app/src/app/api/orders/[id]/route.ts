import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  generateWhatsAppLink,
  buildBookDeliveryMessage,
} from '@/lib/whatsapp';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    // Get the order
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    // Build the WhatsApp delivery message
    const message = buildBookDeliveryMessage(order.customer_name, order.items);
    const whatsAppLink = generateWhatsAppLink(order.customer_phone, message);

    // Update order status
    await supabaseAdmin
      .from('orders')
      .update({ status: 'sent', whatsapp_sent: true })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      whatsAppLink,
      message: 'Commande marquée comme envoyée',
    });
  } catch (err) {
    console.error('Send order error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
