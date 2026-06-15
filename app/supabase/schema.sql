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

DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Books: public read, admin write
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Books are publicly readable" ON books;
CREATE POLICY "Books are publicly readable"
  ON books FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Books are writable by service role" ON books;
CREATE POLICY "Books are writable by service role"
  ON books FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Orders: insert by anyone, read/update by service role only
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create an order" ON orders;
CREATE POLICY "Anyone can create an order"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Orders are readable by service role" ON orders;
CREATE POLICY "Orders are readable by service role"
  ON orders FOR SELECT
  TO service_role
  USING (true);

DROP POLICY IF EXISTS "Orders are updatable by service role" ON orders;
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
-- CLEANUP PREVIOUS SAMPLE DATA (Optional, to avoid duplicates)
-- =============================================
TRUNCATE TABLE books;

-- =============================================
-- NEW SAMPLE DATA (Adapté à ta demande)
-- =============================================
INSERT INTO books (title, author, description, price, category, cover_image, pdf_url, stock, featured) VALUES
(
  'Le Cerveau Magique : Comment optimiser son intellect',
  'Dr. Jean Cerveau',
  'Un guide fascinant pour comprendre le fonctionnement de notre cerveau et augmenter notre capacité de mémorisation.',
  4500,
  'Psychologie & Cerveau',
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=560&fit=crop',
  'https://drive.google.com/file/d/EXAMPLE_CERVEAU_ID/view',
  999,
  true
),
(
  'Guide Pratique de l''Élevage Moderne',
  'Pierre Agricole',
  'Les techniques modernes pour réussir son élevage de volaille et de bétail en Afrique subsaharienne.',
  3500,
  'Élevage',
  'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=560&fit=crop',
  'https://drive.google.com/file/d/EXAMPLE_ELEVAGE_ID/view',
  999,
  true
),
(
  'Agriculture Rentable : De la graine au marché',
  'Amadou Fermier',
  'Apprenez comment lancer et rentabiliser votre projet agricole, avec des études de cas concrètes.',
  3000,
  'Agriculture',
  'https://images.unsplash.com/photo-1592982537447-6f296d0528c3?w=400&h=560&fit=crop',
  'https://drive.google.com/file/d/EXAMPLE_AGRICULTURE_ID/view',
  999,
  true
),
(
  'Le Secret de la Réussite Personnelle',
  'Marie Succès',
  'Découvrez les méthodes infaillibles pour atteindre vos objectifs et développer un mental d''acier.',
  2500,
  'Développement Personnel',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=560&fit=crop',
  'https://drive.google.com/file/d/EXAMPLE_DEV_ID/view',
  999,
  false
);
