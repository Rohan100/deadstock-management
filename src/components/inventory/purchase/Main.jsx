"use client"
import React, { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Calendar,
  Package
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
  // Search filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendor, setSelectedVendor] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  
  // Item selection - Simple dropdown
  const [items, setItems] = useState([])
  const [selectedItemId, setSelectedItemId] = useState("")
  const [selectedItemDetails, setSelectedItemDetails] = useState(null)
  
  // Form fields
  const [quantityPurchased, setQuantityPurchased] = useState("")
  const [unitPrice, setUnitPrice] = useState("")
  const [totalAmount, setTotalAmount] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [invoiceDate, setInvoiceDate] = useState("")
  const [remarks, setRemarks] = useState("")
  
  // UI state
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false)
  const [purchases, setPurchases] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [loadingItems, setLoadingItems] = useState(false)
  
  // Ref to prevent duplicate API calls
  const isSubmitting = useRef(false);

  // Fetch vendors and items on mount
  useEffect(() => {
    fetchVendors()
    fetchAllItems()
  }, [])

  // Fetch purchases when filters change
  useEffect(() => {
    fetchPurchases()
  }, [searchTerm, fromDate, toDate, page])

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors')
      if (response.ok) {
        const data = await response.json()
        setVendors(data)
      }
    } catch (error) {
      console.error("Error fetching vendors:", error)
    }
  }

  const fetchAllItems = async () => {
    setLoadingItems(true)
    try {
      const response = await fetch('/api/items')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setLoadingItems(false)
    }
  }

  const fetchPurchases = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('itemId', searchTerm)
      if (fromDate) params.append('fromDate', fromDate)
      if (toDate) params.append('toDate', toDate)
      params.append('page', page)
      params.append('pageSize', pageSize)

      const response = await fetch(`/api/purchase?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setPurchases(data)
      }
    } catch (error) {
      console.error("Error fetching purchases:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleItemChange = (itemId) => {
    setSelectedItemId(itemId)
    const item = items.find(i => i.itemId.toString() === itemId)
    setSelectedItemDetails(item)
    if (item) {
      setUnitPrice(item.unitPrice?.toString() || "")
    }
  }

  const handlePurchase = async () => {
    if (isSubmitting.current) return;
    
    try {
      isSubmitting.current = true;
      
      // Calculate total amount if not provided
      const calculatedTotal = totalAmount || (parseInt(quantityPurchased) * parseFloat(unitPrice)).toString()

      const purchaseData = {
        itemId: parseInt(selectedItemId),
        vendorId: selectedVendor ? parseInt(selectedVendor) : null,
        quantityPurchased: parseInt(quantityPurchased),
        unitPrice: unitPrice,
        totalAmount: calculatedTotal,
        purchaseDate: purchaseDate,
        invoiceNumber: invoiceNumber || null,
        invoiceDate: invoiceDate || null,
        remarks: remarks || null
      }

      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      })

      const responseData = await response.json();
      
      if (response.ok) {
        setIsPurchaseDialogOpen(false)
        // Reset form
        setSelectedItemId("")
        setSelectedItemDetails(null)
        setSelectedVendor("")
        setQuantityPurchased("")
        setUnitPrice("")
        setTotalAmount("")
        setPurchaseDate("")
        setInvoiceNumber("")
        setInvoiceDate("")
        setRemarks("")
        // Refresh purchases
        await fetchPurchases()
        alert("Purchase added successfully!")
      } else {
        alert(responseData.error || "Error adding purchase")
      }
    } catch (error) {
      console.error("Error adding purchase:", error)
      alert("Error adding purchase")
    } finally {
      isSubmitting.current = false;
    }
  }

  const handleDelete = async (purchaseId) => {
    if (confirm("Are you sure you want to delete this purchase record?")) {
      try {
        const response = await fetch('/api/purchase', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: [purchaseId] }),
        })

        if (response.ok) {
          await fetchPurchases()
          alert("Purchase deleted successfully!")
        } else {
          const error = await response.json()
          alert(error.error || "Error deleting purchase")
        }
      } catch (error) {
        console.error("Error deleting purchase:", error)
        alert("Error deleting purchase")
      }
    }
  }

  // Auto-calculate total amount when quantity or unit price changes
  useEffect(() => {
    if (quantityPurchased && unitPrice) {
      const total = parseInt(quantityPurchased) * parseFloat(unitPrice)
      setTotalAmount(total.toString())
    }
  }, [quantityPurchased, unitPrice])

  // Get vendor name by ID
  const getVendorName = (vendorId) => {
    const vendor = vendors.find(v => v.vendorId === vendorId)
    return vendor ? vendor.vendorName : 'Unknown'
  }

  // Get item name by ID
  const getItemName = (itemId) => {
    const item = items.find(i => i.itemId === itemId)
    return item ? item.itemName : `Item #${itemId}`
  }

  return (
    <div className="space-y-6 p-6">
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
            <div className="space-y-4 py-4">
              {/* Item Selection - Simple Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="item">Select Item *</Label>
                <Select value={selectedItemId} onValueChange={handleItemChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingItems ? "Loading items..." : "Select an item"} />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item.itemId} value={item.itemId.toString()}>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{item.itemName}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            (Stock: {item.quantity})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedItemDetails && (
                  <div className="text-xs text-muted-foreground mt-1">
                    SKU: {selectedItemDetails.sku} | Available: {selectedItemDetails.quantity} | Price: ₹{selectedItemDetails.unitPrice}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.vendorId} value={vendor.vendorId.toString()}>
                          {vendor.vendorName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={quantityPurchased}
                    onChange={(e) => setQuantityPurchased(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price (₹)</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    placeholder="Enter unit price"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount (₹)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    placeholder="Total amount"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date *</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    placeholder="Enter invoice number"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  placeholder="Additional notes..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsPurchaseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handlePurchase} 
                  disabled={!selectedItemId || !quantityPurchased || !purchaseDate || isSubmitting.current}
                >
                  {isSubmitting.current ? "Adding..." : "Add Purchase"}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search by Item ID..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Input
                    type="date"
                    placeholder="From Date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    placeholder="To Date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>
                <div>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm("")
                    setFromDate("")
                    setToDate("")
                    setPage(1)
                  }} className="w-full">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
              <CardDescription>
                {purchases.length} purchase(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Purchase Date</TableHead>
                        <TableHead>Invoice #</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            No purchases found
                          </TableCell>
                        </TableRow>
                      ) : (
                        purchases.map((purchase) => (
                          <TableRow key={purchase.purchaseId}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{getItemName(purchase.itemId)}</div>
                                <div className="text-xs text-muted-foreground">ID: {purchase.itemId}</div>
                              </div>
                            </TableCell>
                            <TableCell>{purchase.quantityPurchased}</TableCell>
                            <TableCell>
                              {purchase.unitPrice ? `₹${parseFloat(purchase.unitPrice).toLocaleString('en-IN')}` : '-'}
                            </TableCell>
                            <TableCell>
                              {purchase.totalAmount ? `₹${parseFloat(purchase.totalAmount).toLocaleString('en-IN')}` : '-'}
                            </TableCell>
                            <TableCell>{getVendorName(purchase.vendorId)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {purchase.purchaseDate}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {purchase.invoiceNumber || 'No Invoice'}
                              </Badge>
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
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDelete(purchase.purchaseId)}
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
              )}
              
              {/* Pagination */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">Page {page}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={purchases.length < pageSize}
                >
                  Next
                </Button>
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
                  <Card key={vendor.vendorId} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{vendor.vendorName}</CardTitle>
                      <CardDescription>{vendor.vendorType}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      <p><span className="font-medium">Contact:</span> {vendor.contactPerson || 'N/A'}</p>
                      <p><span className="font-medium">Phone:</span> {vendor.phone || 'N/A'}</p>
                      <p><span className="font-medium">Email:</span> {vendor.email || 'N/A'}</p>
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