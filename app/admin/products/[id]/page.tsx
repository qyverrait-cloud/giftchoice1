"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"
import { productsApi } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { categories, updateProduct, isLoading: categoriesLoading } = useAdmin()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    subcategory: "",
    badge: "",
    inStock: true,
    isFeatured: false,
    isNewArrival: false,
    isFestival: false,
    sizes: [] as Array<{ name: string; price: number }>,
  })

  const [images, setImages] = useState<string[]>([])
  const [manualCategory, setManualCategory] = useState(false)
  const [manualCategoryName, setManualCategoryName] = useState("")

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        const productData = await productsApi.getById(productId)
        setProduct(productData)
        setFormData({
          name: productData.name,
          description: productData.description || "",
          price: productData.price.toString(),
          categoryId: productData.categoryId || "",
          subcategory: productData.subcategory || "",
          badge: productData.badge || "",
          inStock: productData.inStock,
          isFeatured: productData.isFeatured || false,
          isNewArrival: productData.isNewArrival || false,
          isFestival: productData.isFestival || false,
          sizes: productData.sizes || [],
        })
        setImages(productData.images || [])
      } catch (err: any) {
        console.error("Error loading product:", err)
        setError("Failed to load product")
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      loadProduct()
    }
  }, [productId])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (result) {
            setImages((prev) => [...prev, result])
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { name: "", price: 0 }],
    }))
  }

  const updateSize = (index: number, field: "name" | "price", value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((size, i) =>
        i === index ? { ...size, [field]: value } : size
      ),
    }))
  }

  const removeSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.price) {
      setError("Name and price are required")
      return
    }

    try {
      setIsSubmitting(true)

      let categoryId = formData.categoryId
      if (manualCategory && manualCategoryName) {
        const existingCategory = categories.find(
          (c) => c.name.toLowerCase() === manualCategoryName.toLowerCase()
        )
        if (existingCategory) {
          categoryId = existingCategory.id
        }
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: categoryId || undefined,
        category: manualCategory ? manualCategoryName : undefined,
        subcategory: formData.subcategory || undefined,
        sizes: formData.sizes.length > 0 ? formData.sizes : undefined,
        badge: formData.badge || undefined,
        inStock: formData.inStock,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isFestival: formData.isFestival,
        images: images,
      }

      await updateProduct(productId, productData)
      router.push("/admin/products")
    } catch (err: any) {
      console.error("Error updating product:", err)
      setError(err.message || "Failed to update product")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Product not found</p>
            <Link href="/admin/products" className="mt-4 inline-block">
              <Button variant="outline">Back to Products</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
          <p className="text-muted-foreground mt-1">Update product information</p>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Same form structure as new product page */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
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

              <div>
                <Label htmlFor="badge">Badge</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g., New, Sale, Best Seller"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category */}
        <Card>
          <CardHeader>
            <CardTitle>Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={manualCategory}
                onCheckedChange={setManualCategory}
              />
              <Label>Manual Type (if category doesn't exist)</Label>
            </div>

            {manualCategory ? (
              <div>
                <Label htmlFor="manualCategory">Category Name</Label>
                <Input
                  id="manualCategory"
                  value={manualCategoryName}
                  onChange={(e) => setManualCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="category">Category</Label>
                {categoriesLoading ? (
                  <p className="text-sm text-muted-foreground">Loading categories...</p>
                ) : categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No categories available.</p>
                ) : (
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="subcategory">Subcategory (Optional)</Label>
              <Input
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="e.g., Small, Medium, Large"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="images">Upload Images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-1">
                You can upload multiple images. First image will be the main image.
              </p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden border">
                      <Image src={image} alt={`Image ${index + 1}`} fill className="object-cover" />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
            {formData.sizes.map((size, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Size name"
                  value={size.name}
                  onChange={(e) => updateSize(index, "name", e.target.value)}
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={size.price}
                  onChange={(e) => updateSize(index, "price", parseFloat(e.target.value) || 0)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeSize(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSize}>
              Add Size
            </Button>
          </CardContent>
        </Card>

        {/* Flags */}
        <Card>
          <CardHeader>
            <CardTitle>Product Flags</CardTitle>
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
              <Label htmlFor="isFestival">Festival</Label>
              <Switch
                id="isFestival"
                checked={formData.isFestival}
                onCheckedChange={(checked) => setFormData({ ...formData, isFestival: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Product"}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}

