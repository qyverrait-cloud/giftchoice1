import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoryCard } from "@/components/category-card"
import { categories } from "@/lib/mock-data"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-secondary py-8">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">Shop by Category</h1>
            <p className="text-muted-foreground mt-2">Browse our curated categories to find the perfect gift</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="aspect-square">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
