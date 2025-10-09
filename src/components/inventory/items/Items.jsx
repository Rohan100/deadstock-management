"use client";
import React, { useState } from "react";
import {
  Package,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Calendar,
  DollarSign,
  Building,
  Tag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Items = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isItemDialogOpen, setItemDialogOpen] = useState(false);

  // Item form state
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minStock, setMinStock] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [supplier, setSupplier] = useState("");
  const [condition, setCondition] = useState("New");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");

  // Sample items data with prices in INR
  const items = [
    {
      id: 1,
      name: "Dell Laptop OptiPlex 7090",
      category: "Electronics",
      sku: "DELL-OPT-7090-001",
      quantity: 15,
      minStock: 5,
      unitPrice: 70000.0,
      totalValue: 1050000.0,
      department: "Information Technology",
      location: "MVP/IT/LAB1",
      supplier: "Dell Technologies",
      lastUpdated: "2024-07-10",
      status: "Active",
      expiryDate: "2026-07-10",
      condition: "New",
    },
    {
      id: 2,
      name: "Chemistry Lab Beakers Set",
      category: "Lab Equipment",
      sku: "CHEM-BEAKER-SET-001",
      quantity: 3,
      minStock: 10,
      unitPrice: 3750.0,
      totalValue: 11250.0,
      department: "Chemistry",
      location: "MVP/LabStorage/B-2",
      supplier: "Scientific Supplies Co",
      lastUpdated: "2024-07-09",
      status: "Low Stock",
      expiryDate: "N/A",
      condition: "Used",
    },
    {
      id: 3,
      name: "Office Chairs Ergonomic",
      category: "Furniture",
      sku: "FURN-CHAIR-ERG-001",
      quantity: 0,
      minStock: 20,
      unitPrice: 9900.0,
      totalValue: 0.0,
      department: "Administration",
      location: "MVP/Storage/C-3",
      supplier: "Office Furniture Plus",
      lastUpdated: "2024-07-08",
      status: "Out of Stock",
      expiryDate: "N/A",
      condition: "New",
    },
    {
      id: 4,
      name: "Expired Medical Supplies",
      category: "Medical",
      sku: "MED-SUPP-EXP-001",
      quantity: 25,
      minStock: 0,
      unitPrice: 1300.0,
      totalValue: 32500.0,
      department: "Health Center",
      location: "MVP/Medical/Storage/D-1",
      supplier: "MedSupply Corp",
      lastUpdated: "2024-07-07",
      status: "Expired",
      expiryDate: "2024-06-15",
      condition: "Expired",
    },
    {
      id: 5,
      name: "Projector Epson PowerLite",
      category: "Electronics",
      sku: "EPSON-PROJ-PL-001",
      quantity: 8,
      minStock: 3,
      unitPrice: 37000.0,
      totalValue: 296000.0,
      department: "Engineering",
      location: "MVP/AV/Equipment/Room",
      supplier: "Epson America",
      lastUpdated: "2024-07-11",
      status: "Active",
      expiryDate: "2025-12-31",
      condition: "Good",
    },
  ];

  // Filter items based on search and filters
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus =
      selectedStatus === "all" ||
      item.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddItem = () => {
    // Here you would typically make an API call to add the item
    console.log("Adding item:", {
      name: itemName,
      category: category,
      sku: sku,
      quantity: parseInt(quantity),
      minStock: parseInt(minStock),
      unitPrice: parseFloat(unitPrice),
      department: department,
      location: location,
      supplier: supplier,
      condition: condition,
      expiryDate: expiryDate,
      description: description,
      totalValue: parseFloat(quantity) * parseFloat(unitPrice),
      lastUpdated: new Date().toISOString().split('T')[0],
      status: "Active"
    });
    
    // Reset form and close dialog
    resetForm();
    setItemDialogOpen(false);
  };

  const resetForm = () => {
    setItemName("");
    setCategory("");
    setSku("");
    setQuantity("");
    setMinStock("");
    setUnitPrice("");
    setDepartment("");
    setLocation("");
    setSupplier("");
    setCondition("New");
    setExpiryDate("");
    setDescription("");
  };

  // Get condition badge color
  const getConditionColor = (condition) => {
    switch (condition) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "Good":
        return "bg-green-100 text-green-800";
      case "Used":
        return "bg-yellow-100 text-yellow-800";
      case "Damaged":
        return "bg-red-100 text-red-800";
      case "Expired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(filteredItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle individual item selection
  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  // Calculate summary stats
  const totalItems = filteredItems.length;
  const totalValue = filteredItems.reduce(
    (sum, item) => sum + item.totalValue,
    0
  );
  const lowStockItems = filteredItems.filter(
    (item) => item.status === "Low Stock" || item.status === "Out of Stock"
  ).length;
  const expiredItems = filteredItems.filter(
    (item) => item.status === "Expired"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Inventory Items
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all inventory items across departments
          </p>
        </div>

        <Dialog open={isItemDialogOpen} onOpenChange={(open) => {
          setItemDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
              <DialogDescription>
                Add a new item to your inventory management system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    placeholder="Enter SKU"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Sports Equipment">Sports Equipment</SelectItem>
                      <SelectItem value="Stationery">Stationery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                      <SelectItem value="Damaged">Damaged</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    placeholder="Enter min stock"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price (₹) *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    placeholder="Enter unit price"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Health Center">Health Center</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Input
                    id="supplier"
                    placeholder="Enter supplier name"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Enter storage location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter item description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setItemDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddItem}
                  disabled={!itemName || !category || !sku || !quantity || !minStock || !unitPrice || !department || !location || !supplier}
                >
                  Add Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Items
            </CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-gray-500">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{totalValue.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-gray-500">Current inventory value</p>
          </CardContent>
        </Card>
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
                  placeholder="Search items, SKU, or department..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="lab equipment">Lab Equipment</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
              </SelectContent>
            </Select>
           
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Items List</CardTitle>
              <CardDescription>
                {filteredItems.length} item(s) found
              </CardDescription>
            </div>
            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Bulk Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedItems.length === filteredItems.length &&
                        filteredItems.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Item Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(item.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          SKU: {item.sku}
                        </div>
                        <div className="text-sm text-gray-500">
                          Location: {item.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.quantity}</div>
                        <div className="text-sm text-gray-500">
                          Min: {item.minStock}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          ₹{item.totalValue.toLocaleString("en-IN")}
                        </div>
                        <div className="text-sm text-gray-500">
                          ₹{item.unitPrice.toLocaleString("en-IN")}/unit
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{item.department}</span>
                      </div>
                    </TableCell>
                   
                    <TableCell>
                      <Badge className={getConditionColor(item.condition)}>
                        {item.condition}
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
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Item
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
    </div>
  );
};

export default Items;