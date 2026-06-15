# Sonic Books 📚

> La librairie scolaire numérique du Cameroun

## 🌟 Features

- 🏠 **Accueil** — Hero animé, livres populaires, catégories
- 📚 **Catalogue** — Filtres par catégorie, recherche full-text
- 🛒 **Panier** — Gestion quantité, persistance localStorage
- 📦 **Commande** — Formulaire client avec numéro WhatsApp
- 📤 **WhatsApp auto** — Envoi automatique des PDFs après vérification
- 🎛️ **Dashboard Admin** — Gestion livres + commandes + stats
- ☁️ **Cloudinary** — Upload images & PDFs
- 🗄️ **Supabase** — Base de données + auth
- 🚀 **Vercel** — Déploiement automatique

## 🚀 Stack

- **Frontend**: Next.js 14 App Router + TypeScript
- **Styling**: Tailwind CSS + CSS custom (glassmorphism, animations)
- **DB**: Supabase (PostgreSQL)
- **Images/PDFs**: Cloudinary
- **Deploy**: Vercel
- **WhatsApp**: Liens wa.me générés automatiquement

## 📋 Setup

### 1. Variables d'environnement

Copiez `.env.example` vers `.env.local` et remplissez vos clés :

```bash
cp .env.example .env.local
```

### 2. Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez le fichier `supabase/schema.sql` dans l'éditeur SQL de Supabase
3. Copiez les clés `URL`, `anon key`, et `service_role key`

### 3. Cloudinary

1. Créez un compte sur [cloudinary.com](https://cloudinary.com)
2. Copiez le `cloud name`, `API key`, et `API secret`

### 4. Installation locale

```bash
npm install
npm run dev
```

### 5. Déploiement Vercel

```bash
# Connecter votre repo GitHub
# Ajouter les variables d'environnement dans Vercel
# Deploy automatique sur push
```

## 🔐 Dashboard Admin

Accédez à `/dashboard` avec le mot de passe défini dans `ADMIN_SECRET_KEY`.

### Workflow commande

1. Client passe commande → Statut `pending`
2. Admin vérifie paiement → Cliquer "Vérifier" → Statut `verified`
3. Admin envoie livres → Cliquer "Envoyer WA" → Ouvre WhatsApp avec PDFs → Statut `sent`

## 📱 WhatsApp Integration

Lorsque l'admin clique "Envoyer WA", l'application :
1. Génère un message WhatsApp avec les liens PDF
2. Ouvre automatiquement `wa.me/[numéro]?text=[message]`
3. Marque la commande comme `sent`

## 📁 Structure

```
src/
├── app/
│   ├── page.tsx          # Accueil
│   ├── books/            # Catalogue + détail
│   ├── cart/             # Panier + formulaire commande
│   ├── about/            # À propos
│   ├── order-success/    # Confirmation
│   ├── dashboard/        # Admin dashboard
│   └── api/              # API routes
├── components/           # Composants réutilisables
├── context/              # CartContext
└── lib/                  # Supabase, Cloudinary, WhatsApp
```
