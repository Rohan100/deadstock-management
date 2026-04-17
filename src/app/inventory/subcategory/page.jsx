"use client"
import React, { useEffect, useState } from "react"
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Grid3X3,
  List
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"

const SubCategory = () => {
  const [viewMode, setViewMode] = useState("grid")
  const [search, setSearch] = useState("")

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [categoryId, setCategoryId] = useState("")
  const [subCategoryName, setSubCategoryName] = useState("")
  const [description, setDescription] = useState("")

  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null)

  

  const fetchData = async () => {
    try {
      setLoading(true)
      const [catRes, subCatRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/categories/sub_categories")
      ])

      const [catData, subCatData] = await Promise.all([
        catRes.json(),
        subCatRes.json()
      ])

      setCategories(catData)
      setSubCategories(subCatData)
    } catch (err) {
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

 

  const filteredSubCategories = subCategories.filter(sc =>
    sc.subCategoryName.toLowerCase().includes(search.toLowerCase())
  )

 

  const resetForm = () => {
    setCategoryId("")
    setSubCategoryName("")
    setDescription("")
    setIsEditMode(false)
    setEditingId(null)
  }

  const openEdit = (sc) => {
    setIsEditMode(true)
    setEditingId(sc.subCategoryId)
    setCategoryId(String(sc.categoryId))
    setSubCategoryName(sc.subCategoryName)
    setDescription(sc.description || "")
    setDialogOpen(true)
  }

  

  const handleSave = async () => {
    if (!categoryId || !subCategoryName.trim()) {
      toast.error("Category and Sub-category name are required")
      return
    }

    const payload = {
      categoryId: Number(categoryId),
      subCategoryName,
      description
    }

    const url = isEditMode
      ? `/api/categories/sub_categories/${editingId}`
      : "/api/categories/sub_categories"

    const method = isEditMode ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      toast.error("Something went wrong")
      return
    }

    toast.success(isEditMode ? "Sub-category updated" : "Sub-category added")
    fetchData()
    resetForm()
    setDialogOpen(false)
  }

  const confirmDelete = async () => {
    if (!subCategoryToDelete) return

    const res = await fetch(
      `/api/categories/sub_categories/${subCategoryToDelete}`,
      { method: "DELETE" }
    )

    if (!res.ok) {
      toast.error("Failed to delete")
      return
    }

    toast.success("Sub-category deleted")
    setDeleteDialogOpen(false)
    setSubCategoryToDelete(null)
    fetchData()
  }

 

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Sub-Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage sub-categories linked to categories
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search sub-categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />

          <Button
            variant="outline"
            onClick={() =>
              setViewMode(viewMode === "grid" ? "table" : "grid")
            }
          >
            {viewMode === "grid" ? <List /> : <Grid3X3 />}
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Sub-Category
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Sub-Category" : "Add Sub-Category"}
                </DialogTitle>
                <DialogDescription>
                  Sub-categories are linked to categories
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2">Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem
                          key={cat.categoryId}
                          value={String(cat.categoryId)}
                        >
                          {cat.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2">Sub-Category Name *</Label>
                  <Input
                    value={subCategoryName}
                    onChange={e => setSubCategoryName(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-2">Description</Label>
                  <Textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {isEditMode ? "Update" : "Add"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

     
      {loading && (
        <p className="text-muted-foreground">Loading sub-categories...</p>
      )}

      {!loading && filteredSubCategories.length === 0 && (
        <p className="text-muted-foreground">No sub-categories found.</p>
      )}

      {!loading && filteredSubCategories.length > 0 && (
        <Tabs value={viewMode}>
          <TabsContent value="grid">
            <div className="grid md:grid-cols-3 gap-6">
              {filteredSubCategories.map(sc => (
                <Card key={sc.subCategoryId}>
                  <CardHeader className="flex justify-between flex-row">
                    <div>
                      <CardTitle>{sc.subCategoryName}</CardTitle>
                      <Badge className="mt-2">
                        {
                          categories.find(c => c.categoryId === sc.categoryId)
                            ?.categoryName
                        }
                      </Badge>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(sc)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSubCategoryToDelete(sc.subCategoryId)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {sc.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table">
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredSubCategories.map(sc => (
                      <TableRow key={sc.subCategoryId}>
                        <TableCell>{sc.subCategoryName}</TableCell>
                        <TableCell>
                          {
                            categories.find(c => c.categoryId === sc.categoryId)
                              ?.categoryName
                          }
                        </TableCell>
                        <TableCell>{sc.description}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(sc)}
                          >
                            <Edit />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSubCategoryToDelete(sc.subCategoryId)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

     
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Sub-Category?</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SubCategory
