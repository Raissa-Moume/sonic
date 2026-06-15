import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  cover_image: string;
  pdf_url: string;
  stock: number;
  created_at: string;
  featured: boolean;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'verified' | 'sent' | 'cancelled';
  whatsapp_sent: boolean;
  created_at: string;
  notes: string;
};

export type OrderItem = {
  book_id: string;
  book_title: string;
  quantity: number;
  price: number;
  pdf_url: string;
};
