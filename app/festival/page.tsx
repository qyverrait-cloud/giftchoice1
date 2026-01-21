import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/mock-data"

export default function FestivalPage() {
  const festivalProducts = products.filter((p) => p.isFestival)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-secondary py-8">
          <div className="container mx-auto px-4">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Special Collection
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">Festival Collection</h1>
            <p className="text-muted-foreground mt-2">Celebrate every festival with our specially curated gifts</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {festivalProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {festivalProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">Festival collection coming soon!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
