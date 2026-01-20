"use client"

import type React from "react"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Upload } from "lucide-react"

export default function BannersPage() {
  const { promotionalBanners, addPromotionalBanner, updatePromotionalBanner, deletePromotionalBanner } = useAdmin()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    link: "",
    isActive: true,
    order: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      updatePromotionalBanner(editingId, formData)
    } else {
      const maxOrder = promotionalBanners.length > 0 ? Math.max(...promotionalBanners.map((b) => b.order)) : 0
      addPromotionalBanner({ ...formData, order: maxOrder + 1 })
    }

    setFormData({ image: "", title: "", link: "", isActive: true, order: 0 })
    setEditingId(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (id: string) => {
    const banner = promotionalBanners.find((b) => b.id === id)
    if (banner) {
      setFormData({
        image: banner.image,
        title: banner.title,
        link: banner.link || "",
        isActive: banner.isActive,
        order: banner.order,
      })
      setEditingId(id)
      setIsDialogOpen(true)
    }
  }

  const handleDelete = () => {
    if (deleteId) {
      deletePromotionalBanner(deleteId)
      setDeleteId(null)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const activeBanners = promotionalBanners.filter((b) => b.isActive).sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Promotional Banners</h1>
          <p className="text-muted-foreground mt-1">Manage promotional banners and posters for homepage</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setFormData({ image: "", title: "", link: "", isActive: true, order: 0 })
                setEditingId(null)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Banner" : "Add Banner"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Banner Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link (Optional)</Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="/shop?category=birthday-gifts or https://..."
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Add internal page link or external URL</p>
              </div>

              <div className="space-y-2">
                <Label>Banner Image *</Label>
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="Enter image URL or upload image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                  <div className="relative">
                    <label className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Or upload image</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {formData.image && (
                    <div className="relative aspect-[16/6] w-full rounded-lg overflow-hidden bg-muted">
                      <img src={formData.image} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingId ? "Update Banner" : "Add Banner"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotionalBanners.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No promotional banners yet. Add your first banner to get started!
          </div>
        ) : (
          promotionalBanners.map((banner) => (
            <Card key={banner.id} className={`overflow-hidden ${!banner.isActive ? "opacity-60" : ""}`}>
              <div className="relative aspect-[16/6] overflow-hidden bg-muted">
                <img src={banner.image || "/placeholder.svg"} alt={banner.title} className="object-cover w-full h-full" />
                {!banner.isActive && (
                  <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded text-xs font-medium">
                    Inactive
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-1">{banner.title}</h3>
                {banner.link && (
                  <p className="text-xs text-muted-foreground truncate">{banner.link}</p>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(banner.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(banner.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this promotional banner? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

