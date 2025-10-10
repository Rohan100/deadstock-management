"use client"
import React, { useState } from 'react'
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
const Category = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
    const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false)
      const [categoryName, setCategoryName] = useState("")
 const [description, setDescription] = useState("")
  const [status, setStatus] = useState("Active")


  // Sample categories data
  const categories = [
    {
      id: 1,
      name: "Electronics",
      description: "Computers, laptops, projectors, and electronic equipment",
      itemCount: 142,
      totalValue: 2850000.00,
      status: "Active",
      lastUpdated: "2024-07-11"
    },
    {
      id: 2,
      name: "Lab Equipment",
      description: "Scientific instruments, glassware, and laboratory supplies",
      itemCount: 89,
      totalValue: 1650000.00,
      status: "Active",
      lastUpdated: "2024-07-09"
    },
    {
      id: 3,
      name: "Furniture",
      description: "Office furniture, classroom chairs, desks, and storage",
      itemCount: 234,
      totalValue: 980000.00,
      status: "Active",
      lastUpdated: "2024-07-08"
    },
    {
      id: 4,
      name: "Medical Supplies",
      description: "Medical equipment, supplies, and pharmaceutical items",
      itemCount: 67,
      totalValue: 450000.00,
      status: "Critical",
      lastUpdated: "2024-07-07"
    },
    {
      id: 5,
      name: "Sports Equipment",
      description: "Athletic equipment, sports gear, and recreational items",
      itemCount: 156,
      totalValue: 320000.00,
      status: "Active",
      lastUpdated: "2024-07-10"
    },
    {
      id: 6,
      name: "Stationery & Office Supplies",
      description: "Paper, pens, printing supplies, and office consumables",
      itemCount: 78,
      totalValue: 125000.00,
      status: "Review",
      lastUpdated: "2024-07-06"
    }
  ]

  // Filter categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || category.status.toLowerCase() === selectedStatus.toLowerCase()
    
    return matchesSearch && matchesStatus
  })
   const handleAddCategory = () => {
    // Here you would typically make an API call to add the category
    console.log("Adding category:", {
      name: categoryName,
      description: description,
      status: status,
      itemCount: 0,
      totalValue: 0.00,
      lastUpdated: new Date().toISOString().split('T')[0]
    })
    
    // Reset form and close dialog
    resetForm()
    setCategoryDialogOpen(false)
  }

  const resetForm = () => {
    setCategoryName("")
    setDescription("")
    setStatus("Active")
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
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category to organize your inventory items
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
                    onClick={handleAddCategory}
                    disabled={!categoryName || !description || !status}
                  >
                    Add Category
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
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsContent value="grid">
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                      <span className="font-semibold">₹{category.totalValue.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                      <TableHead>Items</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
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
                          <div className="font-medium">{category.itemCount}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₹{category.totalValue.toLocaleString('en-IN')}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-sm text-muted-foreground">
                          {category.lastUpdated}
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
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Category
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Category