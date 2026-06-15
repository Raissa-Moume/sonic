import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  generateWhatsAppLink,
  buildOrderConfirmationMessage,
  buildAdminNotificationMessage,
} from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, customer_phone, customer_email, notes, items, total } = body;

    if (!customer_name || !customer_phone || !items?.length) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    // Insert order in Supabase
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name,
        customer_phone,
        customer_email: customer_email || null,
        items,
        total,
        status: 'pending',
        whatsapp_sent: false,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 });
    }

    // Generate WhatsApp links
    const customerMessage = buildOrderConfirmationMessage(
      customer_name,
      order.id,
      items,
      total
    );

    const adminMessage = buildAdminNotificationMessage(
      customer_name,
      customer_phone,
      order.id,
      items,
      total
    );

    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || '';
    const adminWhatsAppLink = generateWhatsAppLink(adminPhone, adminMessage);

    return NextResponse.json({
      orderId: order.id,
      customerWhatsAppLink: generateWhatsAppLink(customer_phone, customerMessage),
      adminWhatsAppLink,
      success: true,
    });
  } catch (err) {
    console.error('Order API error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
