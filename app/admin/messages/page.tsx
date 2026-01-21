"use client"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mail, Phone, Calendar, Trash2, Check } from "lucide-react"

export default function MessagesPage() {
  const { messages, markMessageAsRead, deleteMessage, isLoading } = useAdmin()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)

  const unreadMessages = messages.filter((m) => !m.isRead)

  const handleMarkAsRead = async (id: string) => {
    try {
      await markMessageAsRead(id)
    } catch (error) {
      console.error("Error marking message as read:", error)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteMessage(deleteId)
        setDeleteId(null)
        if (selectedMessage === deleteId) {
          setSelectedMessage(null)
        }
      } catch (error) {
        console.error("Error deleting message:", error)
      }
    }
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
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">
            {unreadMessages.length > 0 && (
              <span className="text-primary font-medium">{unreadMessages.length} unread</span>
            )}
            {unreadMessages.length > 0 && " • "}
            {messages.length} total messages
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">No messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Messages List */}
          <div className="space-y-3">
            {messages.map((message) => (
              <Card
                key={message.id}
                className={`cursor-pointer transition-colors ${
                  selectedMessage === message.id ? "border-primary" : ""
                } ${!message.isRead ? "bg-primary/5" : ""}`}
                onClick={() => setSelectedMessage(message.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{message.name}</span>
                        {!message.isRead && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {message.email}
                        </div>
                        {message.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {message.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(message.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message Detail */}
          {selectedMessage && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {messages.find((m) => m.id === selectedMessage)?.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    {!messages.find((m) => m.id === selectedMessage)?.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(selectedMessage)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark Read
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteId(selectedMessage)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(() => {
                  const message = messages.find((m) => m.id === selectedMessage)
                  if (!message) return null
                  
                  return (
                    <>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                        <p className="text-foreground">{message.email}</p>
                      </div>
                      {message.phone && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                          <p className="text-foreground">{message.phone}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Date</p>
                        <p className="text-foreground">
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Message</p>
                        <p className="text-foreground whitespace-pre-wrap">{message.message}</p>
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
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

