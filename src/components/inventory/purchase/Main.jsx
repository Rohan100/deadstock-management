"use client"
import React, { useState } from 'react'
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Package,
  Calendar,
  User,
  DollarSign
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const PurchaseMainPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendor, setSelectedVendor] = useState("")
  const [itemName, setItemName] = useState("")
  const [itemType, setItemType] = useState("")
  const [modelId, setModelId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [condition, setCondition] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false)

  // Sample vendors (matching vendor table schema)
  const vendors = [
    { id: 1, name: "Tech Supplies Inc.", vendorType: "Electronics", contactNo: "+91-123-456-7890", address: "Delhi" },
    { id: 2, name: "Lab Equipment Co.", vendorType: "Lab Supplies", contactNo: "+91-987-654-3210", address: "Mumbai" },
    { id: 3, name: "Office Furniture Ltd.", vendorType: "Furniture", contactNo: "+91-555-123-4567", address: "Chennai" }
  ]

  // Sample purchase history (matching items table schema + additional fields)
  const purchaseHistory = [
    {
      id: 1,
      name: "Dell Laptop OptiPlex 7090",
      type: "Electronics",
      modelId: "DELL-OPT-7090-001",
      quantity: 10,
      unitPrice: 70000,
      totalPrice: 700000,
      purchaseDate: "2024-08-01",
      deadstockId: "DS-001",
      condition: "New",
      status: "in stock",
      vendorName: "Tech Supplies Inc.",
      purchasedBy: "Admin User"
    },
    {
      id: 2,
      name: "Chemistry Lab Beakers Set",
      type: "Lab Equipment",
      modelId: "CHEM-BEAKER-SET-001",
      quantity: 25,
      unitPrice: 3750,
      totalPrice: 93750,
      purchaseDate: "2024-07-15",
      deadstockId: "DS-002",
      condition: "Good",
      status: "in stock",
      vendorName: "Lab Equipment Co.",
      purchasedBy: "Admin User"
    },
    {
      id: 3,
      name: "Office Chairs Ergonomic",
      type: "Furniture",
      modelId: "FURN-CHAIR-ERG-001",
      quantity: 20,
      unitPrice: 9900,
      totalPrice: 198000,
      purchaseDate: "2024-07-10",
      deadstockId: "DS-003",
      condition: "New",
      status: "in stock",
      vendorName: "Office Furniture Ltd.",
      purchasedBy: "Admin User"
    }
  ]

  const filteredPurchases = purchaseHistory.filter(purchase => {
    const matchesSearch = purchase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.modelId.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const handlePurchase = () => {
    // Handle purchase logic here - would create new item record
    const totalPrice = parseInt(quantity) * parseInt(unitPrice)
    console.log("Purchasing:", {
      name: itemName,
      type: itemType,
      modelId: modelId,
      quantity: quantity,
      unitPrice: unitPrice,
      totalPrice: totalPrice,
      purchaseDate: purchaseDate,
      condition: condition,
      vendorId: selectedVendor,
      notes: notes
    })
    setIsPurchaseDialogOpen(false)
    // Reset form
    setSelectedVendor("")
    setItemName("")
    setItemType("")
    setModelId("")
    setQuantity("")
    setUnitPrice("")
    setCondition("")
    setPurchaseDate("")
    setNotes("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Purchases</h1>
          <p className="text-muted-foreground mt-2">Manage item purchases and inventory</p>
        </div>
        <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Purchase
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Purchase</DialogTitle>
              <DialogDescription>
                Record a new item purchase to add to inventory
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id.toString()}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input
                    id="itemName"
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemType">Item Type</Label>
                  <Input
                    id="itemType"
                    placeholder="e.g., Electronics"
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelId">Model ID</Label>
                  <Input
                    id="modelId"
                    placeholder="Enter model ID"
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Qty"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price (₹)</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    placeholder="Price"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsPurchaseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePurchase}>
                  Add Purchase
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Purchase History */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Purchase History</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
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
                      placeholder="Search purchases..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>
                {filteredPurchases.length} purchase(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell>
                          <div className="font-medium">{purchase.name}</div>
                          <div className="text-sm text-muted-foreground">{purchase.modelId}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{purchase.quantity}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">₹{purchase.unitPrice.toLocaleString('en-IN')}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">₹{purchase.totalPrice.toLocaleString('en-IN')}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{purchase.vendorName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {purchase.purchaseDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{purchase.condition}</Badge>
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
                                Edit Purchase
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

        <TabsContent value="vendors" className="space-y-4">
          {/* Vendors List */}
          <Card>
            <CardHeader>
              <CardTitle>Vendors</CardTitle>
              <CardDescription>
                List of available vendors for purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map((vendor) => (
                  <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <CardDescription>{vendor.vendorType}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span>Contact</span>
                        <span className="text-muted-foreground">{vendor.contactNo}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Address</span>
                        <span className="text-muted-foreground">{vendor.address}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PurchaseMainPage