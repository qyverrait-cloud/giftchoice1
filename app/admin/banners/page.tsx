"use client"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Image as ImageIcon, Plus, Edit, Trash2, Upload } from "lucide-react"
import Image from "next/image"

export default function BannersPage() {
  const { banners, addBanner, updateBanner, deleteBanner, isLoading } = useAdmin()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    image: "",
    title: "",
    link: "",
    isActive: true,
    order: 0,
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        setFormData({ ...formData, image: result })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.image) {
      setError("Image is required")
      return
    }

    try {
      setIsSubmitting(true)
      if (editId) {
        await updateBanner(editId, formData)
      } else {
        await addBanner(formData)
      }
      setIsDialogOpen(false)
      setFormData({ image: "", title: "", link: "", isActive: true, order: 0 })
      setEditId(null)
    } catch (err: any) {
      console.error("Error saving banner:", err)
      setError(err.message || "Failed to save banner")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (banner: any) => {
    setEditId(banner.id)
    setFormData({
      image: banner.image || "",
      title: banner.title || "",
      link: banner.link || "",
      isActive: banner.isActive,
      order: banner.order || 0,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteBanner(deleteId)
        setDeleteId(null)
      } catch (error) {
        console.error("Error deleting banner:", error)
      }
    }
  }

  const openNewDialog = () => {
    setEditId(null)
    setFormData({ image: "", title: "", link: "", isActive: true, order: 0 })
    setError(null)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Promotional Banners</h1>
          <p className="text-muted-foreground mt-1">Manage promotional banners</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editId ? "Edit Banner" : "Add New Banner"}</DialogTitle>
                <DialogDescription>
                  {editId ? "Update banner information" : "Create a new promotional banner"}
                </DialogDescription>
              </DialogHeader>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="image">Banner Image *</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  {formData.image && (
                    <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border">
                      <Image src={formData.image} alt="Banner" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Banner title (optional)"
                  />
                </div>

                <div>
                  <Label htmlFor="link">Link URL</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com (optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <Label htmlFor="isActive">Active</Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editId ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners Grid */}
      {banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No banners yet. Add your first banner!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner) => (
            <Card key={banner.id} className="overflow-hidden">
              <div className="relative h-48 bg-secondary">
                {banner.image ? (
                  <Image src={banner.image} alt={banner.title || "Banner"} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                {!banner.isActive && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs bg-red-500 text-white rounded">Inactive</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{banner.title || "Untitled Banner"}</h3>
                {banner.link && (
                  <p className="text-sm text-muted-foreground mb-2 truncate">{banner.link}</p>
                )}
                <p className="text-xs text-muted-foreground mb-3">Order: {banner.order}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(banner)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setDeleteId(banner.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this banner? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

