import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/lib/cart-context"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, Heart, Truck, Users } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Products" },
    { number: "50+", label: "Categories" },
    { number: "5", label: "Years of Trust" },
  ]

  const values = [
    {
      icon: Gift,
      title: "Quality Gifts",
      description: "We carefully curate every product to ensure the highest quality gifts for your loved ones.",
    },
    {
      icon: Heart,
      title: "Made with Love",
      description: "Each gift is selected and packaged with care, because we understand the emotions behind giving.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Express delivery options available to make sure your gifts arrive on time, every time.",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Our dedicated team is always ready to help you find the perfect gift for any occasion.",
    },
  ]

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <div className="bg-secondary py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4 text-balance">
                  Spreading Joy, One Gift at a Time
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At GIFT CHOICE, we believe in the power of thoughtful gifting. Our mission is to help you express love,
                  celebrate milestones, and create lasting memories through carefully curated gifts.
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-b border-border py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-serif text-4xl font-semibold text-primary">{stat.number}</p>
                    <p className="text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="container mx-auto px-4 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl font-semibold text-foreground">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    GIFT CHOICE was born from a simple idea: everyone deserves to experience the joy of receiving a
                    thoughtful gift. What started as a small passion project has grown into a beloved destination for
                    gift seekers across the country.
                  </p>
                  <p>
                    We understand that finding the perfect gift can be overwhelming. That&apos;s why we&apos;ve done the
                    hard work for you. Our team travels far and wide, partnering with skilled artisans and trusted
                    brands to bring you a collection that&apos;s both unique and meaningful.
                  </p>
                  <p>
                    From birthdays to anniversaries, festivals to just-because moments, we&apos;re here to help you make
                    every occasion special. Because at GIFT CHOICE, we don&apos;t just sell gifts – we help you create
                    memories.
                  </p>
                </div>
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="/gift-shop-interior-cozy-warm.jpg"
                  alt="Inside GIFT CHOICE store"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="bg-secondary py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">What We Stand For</h2>
                <p className="text-muted-foreground">The values that guide everything we do</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value) => (
                  <Card key={value.title} className="border-0 shadow-sm text-center">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <value.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-semibold text-foreground mb-2">Meet Our Team</h2>
              <p className="text-muted-foreground">The passionate people behind GIFT CHOICE</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Priya Sharma", role: "Founder & CEO" },
                { name: "Rahul Mehta", role: "Creative Director" },
                { name: "Anita Patel", role: "Head of Operations" },
                { name: "Vikram Singh", role: "Customer Experience" },
              ].map((member) => (
                <div key={member.name} className="text-center">
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-muted">
                    <img
                      src={`/professional-portrait.png?height=300&width=300&query=professional portrait ${member.name.split(" ")[0]}`}
                      alt={member.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </CartProvider>
  )
}
