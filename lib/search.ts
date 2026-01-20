import Fuse from "fuse.js"
import type { Product } from "./types"

// Fuzzy search configuration
const fuseOptions = {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "description", weight: 0.3 },
    { name: "category", weight: 0.2 },
    { name: "badge", weight: 0.1 },
  ],
  threshold: 0.4, // Lower = stricter matching
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
}

// Language mappings for multilingual search
const languageMappings: Record<string, string[]> = {
  paisa: ["money", "cash", "wallet", "purse", "gift card"],
  pyaar: ["love", "heart", "romantic", "anniversary", "couple"],
  birthday: ["janamdin", "bday", "birth day"],
  gift: ["tohfa", "present", "surprise"],
  teddy: ["soft toy", "plush", "stuffed"],
  bottle: ["sipper", "flask", "water bottle"],
}

export function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products

  const normalizedQuery = query.toLowerCase().trim()

  // Expand query with language mappings
  let expandedQueries = [normalizedQuery]
  for (const [key, values] of Object.entries(languageMappings)) {
    if (normalizedQuery.includes(key)) {
      expandedQueries = [...expandedQueries, ...values]
    }
    if (values.some((v) => normalizedQuery.includes(v))) {
      expandedQueries.push(key)
    }
  }

  const fuse = new Fuse(products, fuseOptions)

  // Search with all expanded queries
  const allResults = expandedQueries.flatMap((q) => fuse.search(q))

  // Deduplicate and sort by score
  const uniqueResults = new Map<string, (typeof allResults)[0]>()
  for (const result of allResults) {
    const existing = uniqueResults.get(result.item.id)
    if (!existing || (result.score && existing.score && result.score < existing.score)) {
      uniqueResults.set(result.item.id, result)
    }
  }

  return Array.from(uniqueResults.values())
    .sort((a, b) => (a.score || 0) - (b.score || 0))
    .map((r) => r.item)
}

export function getSuggestions(products: Product[], query: string): string[] {
  if (!query.trim() || query.length < 2) return []

  const normalizedQuery = query.toLowerCase()

  const suggestions = new Set<string>()

  // Add matching product names
  products.forEach((product) => {
    if (product.name.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(product.name)
    }
  })

  // Add matching categories
  const categories = [...new Set(products.map((p) => p.category))]
  categories.forEach((cat) => {
    if (cat.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " "))
    }
  })

  return Array.from(suggestions).slice(0, 5)
}
