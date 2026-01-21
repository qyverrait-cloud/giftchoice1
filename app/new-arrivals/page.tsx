import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/mock-data"

export default function NewArrivalsPage() {
  const newArrivals = products.filter((p) => p.isNewArrival)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-secondary py-8">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground">New Arrivals</h1>
            <p className="text-muted-foreground mt-2">Fresh additions to our collection - be the first to discover</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">New products coming soon!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
