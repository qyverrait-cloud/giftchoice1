"use client"

import { useAdmin } from "@/lib/admin-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FolderTree, ShoppingBag, MessageSquare, TrendingUp, DollarSign } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { products, categories, orders, messages } = useAdmin()

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
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                {stat.subtitle && <p className="text-sm text-muted-foreground mt-1">{stat.subtitle}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
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
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.slice(0, 5).map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border ${!message.isRead ? "bg-secondary border-primary/20" : "border-border"}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{message.name}</p>
                      <p className="text-sm text-muted-foreground">{message.email}</p>
                    </div>
                    {!message.isRead && (
                      <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{message.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No messages yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
