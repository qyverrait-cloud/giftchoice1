"use client"

import { useAdmin } from "@/lib/admin-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FolderTree, ShoppingBag, MessageSquare, TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { products, categories, orders, messages, isLoading } = useAdmin()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const unreadMessages = messages.filter((m) => !m.isRead).length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      href: "/admin/products",
      color: "text-blue-500",
    },
    {
      title: "Categories",
      value: categories.length,
      icon: FolderTree,
      href: "/admin/categories",
      color: "text-green-500",
    },
    {
      title: "Orders",
      value: orders.length,
      icon: ShoppingBag,
      href: "/admin/orders",
      subtitle: pendingOrders > 0 ? `${pendingOrders} pending` : undefined,
      color: "text-orange-500",
    },
    {
      title: "Messages",
      value: messages.length,
      icon: MessageSquare,
      href: "/admin/messages",
      subtitle: unreadMessages > 0 ? `${unreadMessages} unread` : undefined,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your store</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-sm text-muted-foreground mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">From {orders.length} orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quick Actions</CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/products/new"
              className="block p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <span className="font-medium text-foreground">Add New Product</span>
              <p className="text-sm text-muted-foreground">Create a new product listing</p>
            </Link>
            <Link
              href="/admin/categories"
              className="block p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <span className="font-medium text-foreground">Manage Categories</span>
              <p className="text-sm text-muted-foreground">Organize your product categories</p>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {messages.slice(0, 5).map((message) => (
                <div
                  key={message.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{message.name}</span>
                      {!message.isRead && (
                        <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {message.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {messages.length > 5 && (
                <Link
                  href="/admin/messages"
                  className="block text-center text-sm text-primary hover:underline"
                >
                  View all messages →
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

