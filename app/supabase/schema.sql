-- =============================================
-- SONIC BOOKS — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- BOOKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  cover_image TEXT,
  pdf_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 999,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'sent', 'cancelled')),
  whatsapp_sent BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- UPDATED_AT TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Books: public read, admin write
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Books are publicly readable"
  ON books FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Books are writable by service role"
  ON books FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Orders: insert by anyone, read/update by service role only
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create an order"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Orders are readable by service role"
  ON orders FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Orders are updatable by service role"
  ON orders FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_featured ON books(featured);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);

-- =============================================
-- SAMPLE DATA (optional — remove in production)
-- =============================================
INSERT INTO books (title, author, description, price, category, cover_image, pdf_url, stock, featured) VALUES
(
  'Mathématiques Terminale C',
  'Collection Nationale',
  'Manuel complet de mathématiques pour la Terminale C incluant algèbre, analyse et géométrie.',
  3500,
  'Mathématiques',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=560&fit=crop',
  'https://drive.google.com/file/d/EXAMPLE_PDF_ID/view',
  999,
  true
),
(
  'Français — Textes et méthodes',
  'Paul Noutchié',
  'Recueil de textes littéraires avec méthodologie pour la dissertation et le commentaire.',
  2500,
  'Français',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=560&fit=crop',
  'https://drive.google.com/file/d/EXAMPLE_PDF_ID2/view',
  999,
  true
),
(
  'Sciences Physiques Tle D',
  'Équipe Pédagogique',
  'Cours complet de physique-chimie pour la Terminale D avec exercices corrigés.',
  3000,
  'Physique-Chimie',
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=560&fit=crop',
  'https://drive.google.com/file/d/EXAMPLE_PDF_ID3/view',
  999,
  false
),
(
  'Histoire-Géographie 3ème',
  'Nathan Cameroun',
  'Manuel d'histoire et géographie pour la classe de 3ème.',
  2000,
  'Histoire-Géographie',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=560&fit=crop',
  'https://drive.google.com/file/d/EXAMPLE_PDF_ID4/view',
  999,
  true
)
ON CONFLICT DO NOTHING;
