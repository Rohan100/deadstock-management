"use client"
import React, { useState, useEffect } from 'react'
import { 
  FolderOpen, 
  Search, 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  Filter,
  Grid3X3,
  List
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from "sonner"


const Category = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [categoryName, setCategoryName] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Active")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
const [categoryToDelete, setCategoryToDelete] = useState(null)


  useEffect(() => {
    fetchCategories()
  }, [])

  // Filter categories
  const filteredCategories = categories.filter((category) => {
    const name = category.name?.toLowerCase() || ""
    const description = category.description?.toLowerCase() || ""
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      name.includes(search) || description.includes(search)

    const matchesStatus =
      selectedStatus === "all" ||
      category.status?.toLowerCase() === selectedStatus.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setCategoryName("")
    setDescription("")
    setStatus("Active")
    setIsEditMode(false)
    setEditingCategoryId(null)
  }

  const handleAddCategory = async () => {
    if (!categoryName.trim() || !description.trim()) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryName: categoryName.trim(),
          description: description.trim(),
          status,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || "Failed to add category")
        return
      }

      await fetchCategories()
      toast.success("Category added successfully")
      resetForm()
      setCategoryDialogOpen(false)
    } catch (error) {
      console.error("Error adding category:", error)
      toast.error("Something went wrong while adding category")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      Active: "bg-green-100 text-green-800",
      Critical: "bg-red-100 text-red-800",
      Review: "bg-yellow-100 text-yellow-800",
      Inactive: "bg-gray-100 text-gray-800"
    }
    
    return (
      <Badge className={statusColors[status] || "bg-gray-100"}>
        {status}
      </Badge>
    )
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/categories")
      const data = await res.json()

      // Map DB fields → UI fields
      const formatted = data.map((cat) => ({
        id: cat.categoryId,
        name: cat.categoryName,
        description: cat.description,
        status: cat.status || "Active",
        itemCount: 0,
        totalValue: 0,
        lastUpdated: cat.updatedAt?.split("T")[0] || cat.createdAt?.split("T")[0],
      }))

      setCategories(formatted)
    } catch (err) {
      console.error("Failed to fetch categories", err)
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  const confirmDeleteCategory = async () => {
  if (!categoryToDelete?.id) return

  try {
    const res = await fetch(`/api/categories/${categoryToDelete.id}`, {
      method: "DELETE",
    })

    const data = await res.json()

    if (res.ok) {
      toast.success("Category deleted successfully")
      fetchCategories()
    } else {
      toast.error(data.error || "Failed to delete category")
    }
  } catch (error) {
    toast.error("Something went wrong")
  } finally {
    setIsDeleteDialogOpen(false)
    setCategoryToDelete(null)
  }
}


  // Open edit dialog with category data
  const openEditDialog = (category) => {
    setIsEditMode(true)
    setEditingCategoryId(category.id)
    setCategoryName(category.name || "")
    setDescription(category.description || "")
    setStatus(category.status || "Active")
    setCategoryDialogOpen(true)
  }

  
  const handleSubmit = async () => {
    if (!categoryName.trim() || !description.trim()) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      setSubmitting(true)
      
      if (isEditMode && editingCategoryId) {
        // Update existing category
        const res = await fetch(`/api/categories/${editingCategoryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryName: categoryName.trim(),
            description: description.trim(),
            status,
          }),
        })

        const data = await res.json()

        if (res.ok) {
          toast.success(data.message || "Category updated successfully")
          fetchCategories()
          resetForm()
          setCategoryDialogOpen(false)
        } else {
          toast.error(data.error || "Failed to update category")
        }
      } else {
        // Add new category
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryName: categoryName.trim(),
            description: description.trim(),
            status,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          toast.error(data.error || "Failed to add category")
          return
        }

        await fetchCategories()
        toast.success("Category added successfully")
        resetForm()
        setCategoryDialogOpen(false)
      }
    } catch (error) {
      console.error("Error saving category:", error)
      toast.error("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }
  const handleDeleteClick = (category) => {
  setCategoryToDelete(category)
  setIsDeleteDialogOpen(true)
}


  return (
    <div className="space-y-6">
     
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-2">Organize and manage inventory categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
            setCategoryDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Category" : "Add New Category"}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? "Update category details" : "Create a new category to organize your inventory items"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name *</Label>
                  <Input
                    id="categoryName"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter category description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="Review">Review</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      resetForm()
                      setCategoryDialogOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!categoryName.trim() || !description.trim() || submitting}
                  >
                    {submitting ? "Saving..." : isEditMode ? "Update Category" : "Add Category"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search categories..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      ) : (
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsContent value="grid">
            {filteredCategories.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No categories found</h3>
                  
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {category.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusBadge(category.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600" 
                                onClick={() => handleDeleteClick(category)}

                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            Total Items
                          </span>
                          <span className="font-medium">{category.itemCount}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span>Total Value</span>
                          <span className="font-semibold">₹{(category.totalValue || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle>Categories Overview</CardTitle>
                <CardDescription>
                  {filteredCategories.length} category(ies) found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center">
                              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium">No categories found</h3>
                              <p className="text-muted-foreground text-center mt-2">
                                {searchTerm || selectedStatus !== "all" 
                                  ? "Try adjusting your search or filter criteria"
                                  : "Get started by creating your first category"
                                }
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCategories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{category.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {category.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(category.status)}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{category.itemCount}</div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                ₹{(category.totalValue || 0).toLocaleString('en-IN')}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {category.lastUpdated || "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Category
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                   onClick={() => handleDeleteClick(category)}

                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <DialogContent className="sm:max-w-[400px]">
    <DialogHeader>
      <DialogTitle>Delete Category</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete{" "}
        <span className="font-semibold">
          {categoryToDelete?.name}
        </span>
        ? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>

    <div className="flex justify-end gap-2 pt-4">
      <Button
        variant="outline"
        onClick={() => {
          setIsDeleteDialogOpen(false)
          setCategoryToDelete(null)
        }}
      >
        Cancel
      </Button>

      <Button
         className="bg-red-600 hover:bg-red-700 text-white"
        onClick={confirmDeleteCategory}
      >
        Delete
      </Button>
    </div>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default Category