"use client"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Share2, Plus, Edit, Trash2, Upload } from "lucide-react"
import Image from "next/image"

export default function SocialMediaPage() {
  const { socialMediaPosts, addSocialMediaPost, updateSocialMediaPost, deleteSocialMediaPost, isLoading } = useAdmin()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    thumbnail: "",
    title: "",
    link: "",
    videoLink: "",
    platform: "" as "instagram" | "youtube" | "facebook" | "tiktok" | "",
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
        setFormData({ ...formData, thumbnail: result })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.thumbnail) {
      setError("Thumbnail image is required")
      return
    }

    try {
      setIsSubmitting(true)
      const postData = {
        ...formData,
        platform: formData.platform || undefined,
      }
      if (editId) {
        await updateSocialMediaPost(editId, postData)
      } else {
        await addSocialMediaPost(postData)
      }
      setIsDialogOpen(false)
      setFormData({
        thumbnail: "",
        title: "",
        link: "",
        videoLink: "",
        platform: "",
        isActive: true,
        order: 0,
      })
      setEditId(null)
    } catch (err: any) {
      console.error("Error saving social media post:", err)
      setError(err.message || "Failed to save social media post")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (post: any) => {
    setEditId(post.id)
    setFormData({
      thumbnail: post.thumbnail || "",
      title: post.title || "",
      link: post.link || "",
      videoLink: post.videoLink || "",
      platform: post.platform || "",
      isActive: post.isActive,
      order: post.order || 0,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteSocialMediaPost(deleteId)
        setDeleteId(null)
      } catch (error) {
        console.error("Error deleting social media post:", error)
      }
    }
  }

  const openNewDialog = () => {
    setEditId(null)
    setFormData({
      thumbnail: "",
      title: "",
      link: "",
      videoLink: "",
      platform: "",
      isActive: true,
      order: 0,
    })
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
          <h1 className="text-3xl font-bold text-foreground">Social Media Posts</h1>
          <p className="text-muted-foreground mt-1">Manage social media content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editId ? "Edit Social Media Post" : "Add New Social Media Post"}</DialogTitle>
                <DialogDescription>
                  {editId ? "Update post information" : "Create a new social media post"}
                </DialogDescription>
              </DialogHeader>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="thumbnail">Thumbnail Image *</Label>
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  {formData.thumbnail && (
                    <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border">
                      <Image src={formData.thumbnail} alt="Thumbnail" fill className="object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Post title (optional)"
                  />
                </div>

                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) => setFormData({ ...formData, platform: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
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

                <div>
                  <Label htmlFor="videoLink">Video Link</Label>
                  <Input
                    id="videoLink"
                    value={formData.videoLink}
                    onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... (optional)"
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

      {/* Posts Grid */}
      {socialMediaPosts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Share2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No social media posts yet. Add your first post!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialMediaPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="relative h-48 bg-secondary">
                {post.thumbnail ? (
                  <Image src={post.thumbnail} alt={post.title || "Post"} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Share2 className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                {!post.isActive && (
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs bg-red-500 text-white rounded">Inactive</span>
                  </div>
                )}
                {post.platform && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded capitalize">
                      {post.platform}
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-1">{post.title || "Untitled Post"}</h3>
                {post.link && (
                  <p className="text-sm text-muted-foreground mb-2 truncate">{post.link}</p>
                )}
                <p className="text-xs text-muted-foreground mb-3">Order: {post.order}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(post)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setDeleteId(post.id)}
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
            <AlertDialogTitle>Delete Social Media Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
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

