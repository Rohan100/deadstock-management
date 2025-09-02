"use client"
import React, { useState } from 'react'
import { 
  ArrowRightLeft, 
  Search, 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Package,
  Building,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertTriangle
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

const TransferMainPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedItem, setSelectedItem] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedLab, setSelectedLab] = useState("")
  const [transferQuantity, setTransferQuantity] = useState("")
  const [transferNotes, setTransferNotes] = useState("")
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)

  // Sample inventory items (matching items table schema)
  const inventoryItems = [
    {
      id: 1,
      name: "Dell Laptop OptiPlex 7090",
      modelId: "DELL-OPT-7090-001",
      availableQuantity: 15,
      unitPrice: 70000,
      deadstockId: "DS-001",
      condition: "New",
      status: "in stock",
      vendorId: 1
    },
    {
      id: 2,
      name: "Chemistry Lab Beakers Set",
      modelId: "CHEM-BEAKER-SET-001",
      availableQuantity: 25,
      unitPrice: 3750,
      deadstockId: "DS-002",
      condition: "Good",
      status: "in stock",
      vendorId: 2
    },
    {
      id: 3,
      name: "Office Chairs Ergonomic",
      modelId: "FURN-CHAIR-ERG-001",
      availableQuantity: 20,
      unitPrice: 9900,
      deadstockId: "DS-003",
      condition: "New",
      status: "in stock",
      vendorId: 3
    }
  ]

  // Sample departments (matching department table schema)
  const departments = [
    { id: 1, name: "Computer Science Department", headUserId: 1 },
    { id: 2, name: "Chemistry Department", headUserId: 2 },
    { id: 3, name: "Physics Department", headUserId: 3 },
    { id: 4, name: "Biology Department", headUserId: 4 },
    { id: 5, name: "Mathematics Department", headUserId: 5 },
    { id: 6, name: "Administration Department", headUserId: 6 }
  ]

  // Sample labs (matching lab table schema)
  const labs = [
    { id: 1, labName: "Computer Lab 1", labNo: "L101", deptId: 1 },
    { id: 2, labName: "Chemistry Lab", labNo: "L201", deptId: 2 },
    { id: 3, labName: "Physics Lab", labNo: "L301", deptId: 3 },
    { id: 4, labName: "Biology Lab", labNo: "L401", deptId: 4 }
  ]

  // Sample transfer history (matching distribution table schema + additional fields)
  const transferHistory = [
    {
      id: 1,
      itemId: 1,
      transferQuantity: 5,
      departmentId: 1,
      labId: 1,
      transferDate: "2024-07-15",
      transferredByUserId: 1,
      itemName: "Dell Laptop OptiPlex 7090",
      departmentName: "Computer Science Department",
      labName: "Computer Lab 1",
      transferredBy: "Admin User"
    },
    {
      id: 2,
      itemId: 2,
      transferQuantity: 10,
      departmentId: 2,
      labId: 2,
      transferDate: "2024-07-14",
      transferredByUserId: 1,
      itemName: "Chemistry Lab Beakers Set",
      departmentName: "Chemistry Department",
      labName: "Chemistry Lab",
      transferredBy: "Admin User"
    },
    {
      id: 3,
      itemId: 3,
      transferQuantity: 8,
      departmentId: 6,
      labId: null,
      transferDate: "2024-07-13",
      transferredByUserId: 1,
      itemName: "Office Chairs Ergonomic",
      departmentName: "Administration Department",
      labName: null,
      transferredBy: "Admin User"
    }
  ]

  const filteredTransfers = transferHistory.filter(transfer => {
    const matchesSearch = transfer.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transfer.labName && transfer.labName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800"
      case "Pending": return "bg-yellow-100 text-yellow-800"
      case "Approved": return "bg-blue-100 text-blue-800"
      case "Rejected": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleTransfer = () => {
    // Handle transfer logic here - would create new distribution record
    console.log("Transferring:", {
      itemId: selectedItem,
      departmentId: selectedDepartment,
      labId: selectedLab || null,
      transferQuantity: transferQuantity,
      transferDate: new Date().toISOString().split('T')[0],
      transferredByUserId: 1, // Current user ID
      notes: transferNotes
    })
    setIsTransferDialogOpen(false)
    // Reset form
    setSelectedItem("")
    setSelectedDepartment("")
    setSelectedLab("")
    setTransferQuantity("")
    setTransferNotes("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Transfers</h1>
          <p className="text-muted-foreground mt-2">Transfer inventory items to departments and labs</p>
        </div>
        <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Transfer</DialogTitle>
              <DialogDescription>
                Transfer items from central inventory to departments or labs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item">Select Item</Label>
                <Select value={selectedItem} onValueChange={setSelectedItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an item to transfer" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name} (Available: {item.availableQuantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Destination Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose destination department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lab">Destination Lab (Optional)</Label>
                <Select value={selectedLab} onValueChange={setSelectedLab}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose destination lab" />
                  </SelectTrigger>
                  <SelectContent>
                    {labs.map((lab) => (
                      <SelectItem key={lab.id} value={lab.id.toString()}>
                        {lab.labName} ({lab.labNo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity to Transfer</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Enter quantity"
                  value={transferQuantity}
                  onChange={(e) => setTransferQuantity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Transfer Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Reason for transfer..."
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleTransfer}>
                  Transfer Stock
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transfer History */}
      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Transfer History</TabsTrigger>
          <TabsTrigger value="inventory">Available Inventory</TabsTrigger>
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
                      placeholder="Search transfers..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transfer History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer History</CardTitle>
              <CardDescription>
                {filteredTransfers.length} transfer(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Transferred By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>
                          <div className="font-medium">{transfer.itemName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{transfer.transferQuantity}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <div className="text-sm">
                              <div>{transfer.departmentName}</div>
                              {transfer.labName && (
                                <div className="text-muted-foreground">{transfer.labName}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {transfer.transferDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-500" />
                            {transfer.transferredBy}
                          </div>
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
                                Edit Transfer
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

        <TabsContent value="inventory" className="space-y-4">
          {/* Available Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Available Inventory</CardTitle>
              <CardDescription>
                Items available for transfer to departments and labs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventoryItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.modelId}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          Available
                        </span>
                        <span className="font-medium">{item.availableQuantity}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Deadstock ID</span>
                        <span className="text-muted-foreground">{item.deadstockId}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Value</span>
                        <span className="font-medium">₹{item.unitPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Condition</span>
                        <Badge variant="outline" className="text-xs">{item.condition}</Badge>
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

export default TransferMainPage