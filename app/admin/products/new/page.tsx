"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"
import type { ProductSize } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, Plus, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
  const router = useRouter()
  const { addProduct, categories, isLoading: categoriesLoading } = useAdmin()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    categoryName: "", // For manual entry
    badge: "",
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    isFestival: false,
  })
  const [useManualCategory, setUseManualCategory] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [sizes, setSizes] = useState<ProductSize[]>([])
  const [newSize, setNewSize] = useState({ name: "", price: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add("border-primary", "bg-primary/5")
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-primary", "bg-primary/5")
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove("border-primary", "bg-primary/5")
    }

    const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
    handleFiles(files)
  }, [])

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(Array.from(files))
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addSize = () => {
    if (newSize.name && newSize.price) {
      setSizes((prev) => [...prev, { name: newSize.name, price: Number(newSize.price) }])
      setNewSize({ name: "", price: "" })
    }
  }

  const removeSize = (index: number) => {
    setSizes((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare product data with categoryId
      const productData: any = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        images: images.length > 0 ? images : ["/placeholder.svg"],
        badge: formData.badge || undefined,
        sizes: sizes.length > 0 ? sizes : undefined,
        inStock: formData.inStock,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isFestival: formData.isFestival,
      }

      // Use categoryId if selected, otherwise use category name for manual entry
      if (useManualCategory && formData.categoryName) {
        productData.category = formData.categoryName
      } else if (formData.categoryId) {
        productData.categoryId = formData.categoryId
      }

      await addProduct(productData)
      router.push("/admin/products")
    } catch (error) {
      console.error("Error creating product:", error)
      alert("Failed to create product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Add New Product</h1>
          <p className="text-muted-foreground mt-1">Create a new product listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="category">Category *</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="manual-category"
                        checked={useManualCategory}
                        onChange={(e) => setUseManualCategory(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="manual-category" className="text-xs font-normal cursor-pointer">
                        Manual Type
                      </Label>
                    </div>
                  </div>

                  {useManualCategory ? (
                    <Input
                      id="category"
                      placeholder="Enter category name"
                      value={formData.categoryName}
                      onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                      required={useManualCategory}
                    />
                  ) : (
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select category"} />
                      </SelectTrigger>
                    <SelectContent>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No categories available. Create a category first.
                        </div>
                      )}
                    </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="badge">Badge (optional)</Label>
                <Input
                  id="badge"
                  placeholder="e.g., Best Seller, 60 Min Delivery"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images with Drag & Drop */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Drag & Drop Zone */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4 cursor-pointer hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop images here, or click to select
                </p>
                <p className="text-xs text-muted-foreground">Supports: JPG, PNG, WebP</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                      <img src={image || "/placeholder.svg"} alt={`Product ${index + 1}`} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card>
            <CardHeader>
              <CardTitle>Product Sizes (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sizes.length > 0 && (
                <div className="space-y-2">
                  {sizes.map((size, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <span className="font-medium">{size.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">₹{size.price}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSize(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="Size name (e.g., 6x8 inch)"
                  value={newSize.name}
                  onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newSize.price}
                  onChange={(e) => setNewSize({ ...newSize, price: e.target.value })}
                  className="w-32"
                />
                <Button type="button" variant="outline" onClick={addSize} className="bg-transparent">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="inStock">In Stock</Label>
                <Switch
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured</Label>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isNewArrival">New Arrival</Label>
                <Switch
                  id="isNewArrival"
                  checked={formData.isNewArrival}
                  onCheckedChange={(checked) => setFormData({ ...formData, isNewArrival: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isFestival">Festival Item</Label>
                <Switch
                  id="isFestival"
                  checked={formData.isFestival}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFestival: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
