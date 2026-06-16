import Fuse from 'fuse.js';
import { Book } from './supabase';

/**
 * Levenshtein distance - calcule la distance entre deux chaînes
 * Permet de détecter les fautes de frappe
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Recherche fuzzy sur les livres - tolère les fautes de frappe
 */
export function fuzzySearchBooks(books: Book[], query: string): Book[] {
  if (!query.trim()) return books;

  // Utiliser Fuse.js pour une recherche fuzzy avancée
  const fuse = new Fuse(books, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'author', weight: 0.3 },
      { name: 'description', weight: 0.2 },
      { name: 'category', weight: 0.1 },
    ],
    threshold: 0.4, // 0.4 = plus tolérant aux erreurs, 0.1 = plus strict
    includeScore: true,
    minMatchCharLength: 2,
  });

  return fuse.search(query).map((result) => result.item);
}

/**
 * Vérifie si une requête est probablement une faute du mot correct
 */
export function isSimilarWord(word: string, target: string): boolean {
  if (word.length === 0 || target.length === 0) return false;
  
  const distance = levenshteinDistance(word.toLowerCase(), target.toLowerCase());
  const maxDistance = Math.max(word.length, target.length) * 0.3; // 30% de tolérance
  
  return distance <= maxDistance;
}

/**
 * Corrige les fautes communes dans les catégories
 */
export function correctCategoryTypos(category: string, availableCategories: string[]): string {
  const corrected = availableCategories.find(cat => 
    isSimilarWord(category, cat) || 
    cat.toLowerCase() === category.toLowerCase()
  );
  
  return corrected || category;
}

/**
 * Recherche intelligente avec correction des fautes
 */
export function intelligentSearch(
  books: Book[],
  query: string,
  fallbackToFuzzy: boolean = true
): Book[] {
  if (!query.trim()) return books;

  const cleanQuery = query.toLowerCase().trim();

  // 1. Essayer une recherche exacte d'abord (rapide)
  let results = books.filter(
    (book) =>
      book.title.toLowerCase().includes(cleanQuery) ||
      book.author.toLowerCase().includes(cleanQuery) ||
      book.description.toLowerCase().includes(cleanQuery) ||
      book.category.toLowerCase().includes(cleanQuery)
  );

  // 2. Si pas de résultats et fallback activé, utiliser la recherche fuzzy
  if (results.length === 0 && fallbackToFuzzy) {
    results = fuzzySearchBooks(books, query);
  }

  return results;
}
