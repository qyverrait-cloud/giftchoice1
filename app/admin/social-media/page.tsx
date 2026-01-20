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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Upload, Instagram, Youtube, Link2 } from "lucide-react"

export default function SocialMediaPage() {
  const { socialMediaPosts, addSocialMediaPost, updateSocialMediaPost, deleteSocialMediaPost } = useAdmin()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    thumbnail: "",
    title: "",
    link: "",
    videoLink: "",
    platform: "instagram" as "instagram" | "youtube" | "facebook" | "tiktok",
    isActive: true,
    order: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      updateSocialMediaPost(editingId, formData)
    } else {
      const maxOrder = socialMediaPosts.length > 0 ? Math.max(...socialMediaPosts.map((p) => p.order)) : 0
      addSocialMediaPost({ ...formData, order: maxOrder + 1 })
    }

    setFormData({ thumbnail: "", title: "", link: "", videoLink: "", platform: "instagram", isActive: true, order: 0 })
    setEditingId(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (id: string) => {
    const post = socialMediaPosts.find((p) => p.id === id)
    if (post) {
      setFormData({
        thumbnail: post.thumbnail,
        title: post.title,
        link: post.link || "",
        videoLink: post.videoLink || "",
        platform: post.platform || "instagram",
        isActive: post.isActive,
        order: post.order,
      })
      setEditingId(id)
      setIsDialogOpen(true)
    }
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteSocialMediaPost(deleteId)
      setDeleteId(null)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, thumbnail: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrl = (url: string) => {
    setFormData({ ...formData, thumbnail: url })
  }

  const activePosts = socialMediaPosts.filter((p) => p.isActive).sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Social Media Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your Instagram, YouTube, and social media posts/reels</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setFormData({ thumbnail: "", title: "", link: "", videoLink: "", platform: "instagram", isActive: true, order: 0 })
              setEditingId(null)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Social Media Post" : "Add Social Media Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value: "instagram" | "youtube" | "facebook" | "tiktok") =>
                    setFormData({ ...formData, platform: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Post/Video Link (Optional)</Label>
                <div className="space-y-2">
                  <Input
                    id="link"
                    type="url"
                    placeholder="https://instagram.com/p/... or https://youtube.com/watch?v=..."
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                  <Input
                    id="videoLink"
                    type="url"
                    placeholder="Direct video URL (for YouTube, Instagram Reels, etc.)"
                    value={formData.videoLink}
                    onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Add Instagram post URL, YouTube video link, or direct video URL for reels/videos
                </p>
              </div>

              <div className="space-y-2">
                <Label>Thumbnail Image *</Label>
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="Enter image URL or upload image"
                    value={formData.thumbnail}
                    onChange={(e) => handleImageUrl(e.target.value)}
                  />
                  <div className="relative">
                    <label className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Or upload image</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {formData.thumbnail && (
                    <div className="relative aspect-[3/4] w-32 rounded-lg overflow-hidden bg-muted">
                      <img src={formData.thumbnail} alt="Preview" className="object-cover w-full h-full" />
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
                  {editingId ? "Update Post" : "Add Post"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {socialMediaPosts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No social media posts yet. Add your first post to get started!
          </div>
        ) : (
          socialMediaPosts.map((post) => (
            <Card key={post.id} className={`overflow-hidden ${!post.isActive ? "opacity-60" : ""}`}>
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img src={post.thumbnail || "/placeholder.svg"} alt={post.title} className="object-cover w-full h-full" />
                {!post.isActive && (
                  <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded text-xs font-medium">
                    Inactive
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-foreground line-clamp-1">{post.title}</h3>
                  {post.platform === "instagram" && <Instagram className="h-4 w-4 text-primary flex-shrink-0" />}
                  {post.platform === "youtube" && <Youtube className="h-4 w-4 text-primary flex-shrink-0" />}
                </div>
                {post.link && (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                  >
                    <Link2 className="h-3 w-3" />
                    View Post
                  </a>
                )}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(post.id)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(post.id)}>
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
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this social media post? This action cannot be undone.
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

