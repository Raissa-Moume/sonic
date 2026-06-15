import { OrderItem } from './supabase';

const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP_NUMBER!; // e.g. "237XXXXXXXXX"

export function generateWhatsAppLink(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function buildOrderConfirmationMessage(
  customerName: string,
  orderId: string,
  items: OrderItem[],
  total: number
): string {
  const itemsList = items
    .map((item) => `• ${item.book_title} x${item.quantity} — ${item.price.toLocaleString()} FCFA`)
    .join('\n');

  return `🎓 *SONIC BOOKS* — Confirmation de commande

Bonjour ${customerName} 👋

Merci pour votre commande ! Voici le récapitulatif :

${itemsList}

💰 *Total : ${total.toLocaleString()} FCFA*
📦 *N° Commande : #${orderId.slice(0, 8).toUpperCase()}*

Votre commande est en cours de vérification. Vous recevrez vos livres PDF très bientôt ! 📚

_Sonic Books — La librairie scolaire numérique du Cameroun_ 🇨🇲`;
}

export function buildBookDeliveryMessage(
  customerName: string,
  items: OrderItem[]
): string {
  const bookLinks = items
    .map(
      (item) =>
        `📖 *${item.book_title}*\n🔗 Lien : ${item.pdf_url}`
    )
    .join('\n\n');

  return `🎓 *SONIC BOOKS* — Vos livres sont arrivés !

Bonjour ${customerName} 👋

Voici vos livres PDF :

${bookLinks}

Merci de votre confiance ! 🙏
_Bonne lecture et bon succès dans vos études !_ ✨

_Sonic Books — La librairie scolaire numérique du Cameroun_ 🇨🇲`;
}

export function buildAdminNotificationMessage(
  customerName: string,
  customerPhone: string,
  orderId: string,
  items: OrderItem[],
  total: number
): string {
  const itemsList = items
    .map((item) => `• ${item.book_title} x${item.quantity}`)
    .join('\n');

  return `🔔 *NOUVELLE COMMANDE*

👤 Client : ${customerName}
📱 Tel : ${customerPhone}
🆔 Commande : #${orderId.slice(0, 8).toUpperCase()}

📚 Livres commandés :
${itemsList}

💰 Total : ${total.toLocaleString()} FCFA

➡️ Connectez-vous au dashboard pour valider et envoyer les livres.`;
}
