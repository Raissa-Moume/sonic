import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import BookDetailClient from '@/components/BookDetailClient';
import { Metadata } from 'next';

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: book } = await supabase.from('books').select('*').eq('id', id).single();
  if (!book) return { title: 'Livre non trouvé' };
  return {
    title: `${book.title} — Sonic Books`,
    description: book.description,
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { id } = await params;
  const { data: book } = await supabase.from('books').select('*').eq('id', id).single();
  if (!book) notFound();

  // Related books
  const { data: related } = await supabase
    .from('books')
    .select('*')
    .eq('category', book.category)
    .neq('id', id)
    .limit(4);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BookDetailClient book={book} related={related || []} />
      </div>
    </div>
  );
}
