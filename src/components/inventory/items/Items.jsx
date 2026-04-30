"use client";
import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Building,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"
const Items = () => {
 
  const [itemName, setItemName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minStock, setMinStock] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [vendor, setVendor] = useState("");
  const [condition, setCondition] = useState("New");
  const [description, setDescription] = useState("");
  const [isItemDialogOpen, setItemDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

 
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);

 
  useEffect(() => {
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [itemsRes, categoriesRes, subcategoriesRes, vendorsRes, deptsRes] = await Promise.all([
        fetch("/api/items"),
        fetch("/api/categories"),
        fetch("/api/categories/sub_categories"),
        fetch("/api/vendors"),
        fetch("/api/departments"),
      ]);


      const [itemsData, categoriesData, subcategoriesData, vendorsData, deptsData] = await Promise.all([
        itemsRes.json(),
        categoriesRes.json(),
        subcategoriesRes.json(),
        vendorsRes.json(),
        deptsRes.json(),
      ]);

      setItems(itemsData.map(i => ({ ...i, totalValue: i.unitPrice * i.quantity })));
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.data || []);
setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : subcategoriesData.data || []);
setVendors(Array.isArray(vendorsData) ? vendorsData : vendorsData.data || []);
setDepartments(Array.isArray(deptsData) ? deptsData : deptsData.data || []);
     
      console.log("CATEGORIES:", categoriesData);
console.log("SUBCATEGORIES:", subcategoriesData);
console.log("VENDORS:", vendorsData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchAllData();
}, []);


 
  const filteredItems = items.filter((item) => {
    const deptName = departments.find(d => d.departmentId === item.departmentId)?.departmentName || "";
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deptName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      item.categoryId === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

 
  const filteredSubcategories = category
    ? subcategories.filter(
        (sc) => sc.categoryId === parseInt(category)
      )
    : [];


  const handleAddItem = async () => {
    try {
      const payload = {
        itemName,
        sku,
        categoryId: parseInt(category),
        subCategoryId: subcategory ? parseInt(subcategory) : null,
        quantity: parseInt(quantity),
        minStock: parseInt(minStock),
        unitPrice: parseFloat(unitPrice),
       departmentId: department ? parseInt(department) : null,
        location,
        supplierId: vendor ? parseInt(vendor) : null,
        condition,
        description,
        status: "Active",
        isConsumable: false,
      };
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add item");
      const newItem = await res.json();
      setItems((prev) => [...prev, { ...newItem, totalValue: newItem.unitPrice * newItem.quantity }]);
      resetForm();
      setItemDialogOpen(false);
      toast.success("Item added successfully")
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item")
    }
  };
  const handleDeleteItem = async (itemId) => {
  try {
    const res = await fetch(`/api/items/${itemId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete item");

    // Remove item from state immediately
    setItems((prev) => prev.filter((item) => item.itemId !== itemId));

    toast.success("Item deleted successfully");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete item");
  }
};


  const resetForm = () => {
    setItemName("");
    setSku("");
    setCategory("");
    setSubcategory("");
    setQuantity("");
    setMinStock("");
    setUnitPrice("");
    setDepartment("");
    setLocation("");
    setVendor("");
    setCondition("New");
    setDescription("");
  };

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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) setSelectedItems(filteredItems.map((i) => i.itemId));
    else setSelectedItems([]);
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) setSelectedItems([...selectedItems, itemId]);
    else setSelectedItems(selectedItems.filter((id) => id !== itemId));
  };

  const totalItems = filteredItems.length;
  const totalValue = filteredItems.reduce((sum, i) => sum + i.totalValue, 0);

  return (
    <div className="space-y-6">
     
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Items</h1>
          <p className="text-gray-600 mt-2">Manage all inventory items</p>
        </div>

        <Dialog open={isItemDialogOpen} onOpenChange={setItemDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
             
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Item Name *</Label>
                  <Input 
                    value={itemName} 
                    onChange={(e) => setItemName(e.target.value)} 
                    placeholder="Enter item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>SKU *</Label>
                  <Input 
                    value={sku} 
                    onChange={(e) => setSku(e.target.value)} 
                    placeholder="Enter SKU"
                  />
                </div>
              </div>

             
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={(value) => {
                    setCategory(value);
                    setSubcategory(""); 
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.categoryId} value={c.categoryId.toString()}>
                          {c.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subcategory</Label>
                  <Select
                    value={subcategory}
                    onValueChange={setSubcategory}
                    disabled={!category || filteredSubcategories.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !category ? "Select category first" :
                        filteredSubcategories.length === 0 ? "No subcategories" :
                        "Select subcategory"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredSubcategories.map((sc) => (
                        <SelectItem key={sc.subCategoryId} value={sc.subCategoryId.toString()}>
                          {sc.subCategoryName}
                        </SelectItem>
                      ))}
                      {category && filteredSubcategories.length === 0 && (
                        <SelectItem value="none" disabled>
                          No subcategories available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            
              <div className="space-y-2">
                <Label>Condition *</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {["New", "Good", "Used", "Damaged"].map((cond) => (
                      <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Quantity *</Label>
                  <Input 
                    placeholder="Quantity" 
                    type="number" 
                    value={quantity} 
                    onChange={(e)=>setQuantity(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Stock *</Label>
                  <Input 
                    placeholder="Minimum Stock" 
                    type="number" 
                    value={minStock} 
                    onChange={(e)=>setMinStock(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit Price *</Label>
                  <Input 
                    placeholder="Unit Price" 
                    type="number" 
                    value={unitPrice} 
                    onChange={(e)=>setUnitPrice(e.target.value)} 
                  />
                </div>
              </div>

            
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.departmentId} value={d.departmentId.toString()}>
                          {d.departmentName}
                        </SelectItem>
                      ))}
                      {departments.length === 0 && (
                        <SelectItem value="none" disabled>No departments available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vendor</Label>
                  <Select value={vendor} onValueChange={setVendor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((v) => (
                        <SelectItem key={v.vendorId} value={v.vendorId.toString()}>
                          {v.vendorName}
                        </SelectItem>
                      ))}
                      {vendors.length === 0 && (
                        <SelectItem value="none" disabled>
                          No vendors available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input 
                    placeholder="Location" 
                    value={location} 
                    onChange={(e)=>setLocation(e.target.value)} 
                  />
                </div>
              </div>

             
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="Enter item description" 
                  value={description} 
                  onChange={(e)=>setDescription(e.target.value)} 
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
                  disabled={!itemName || !sku || !category || !quantity || !minStock || !unitPrice}
                >
                  Add Item
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

     
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Total Items</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString("en-IN")}</div>
          </CardContent>
        </Card>
      </div>

      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search items, SKU, or department..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.categoryId} value={c.categoryId.toString()}>{c.categoryName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

     
      <Card>
        <CardHeader>
          <CardTitle>Items List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
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
  
  {loading && (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-10 text-gray-500">
        Loading items...
      </TableCell>
    </TableRow>
  )}


  {!loading && items.length === 0 && (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-10 text-gray-500">
        No items found. Click <span className="font-semibold">"Add New Item"</span> to get started.
      </TableCell>
    </TableRow>
  )}


  {!loading && items.length > 0 && filteredItems.length === 0 && (
    <TableRow>
      <TableCell colSpan={8} className="text-center py-10 text-gray-500">
        No items match your search or filter.
      </TableCell>
    </TableRow>
  )}


  {!loading && filteredItems.map((item) => (
    <TableRow key={item.itemId}>
      

                  <TableCell>
                    <Checkbox 
                      checked={selectedItems.includes(item.itemId)} 
                      onCheckedChange={(checked)=>handleSelectItem(item.itemId, checked)} 
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.itemName}</div>
                      <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                      <div className="text-sm text-gray-500">Location: {item.location}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {categories.find(c=>c.categoryId===item.categoryId)?.categoryName || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.quantity}</div>
                      <div className="text-sm text-gray-500">Min: {item.minStock}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    ₹{item.totalValue.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">
                        {departments.find(d => d.departmentId === item.departmentId)?.departmentName || "—"}
                      </span>
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
                          <Eye className="mr-2 h-4 w-4"/>View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4"/>Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                      <DropdownMenuItem
                        className="text-red-600"
                         onClick={() => {
                        setItemToDelete(item);
                        setIsDeleteDialogOpen(true);
                         }}
                        >
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
        </CardContent>
      </Card>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <DialogContent className="sm:max-w-[400px]">
    <DialogHeader>
      <DialogTitle>Delete Item</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-foreground">
          {itemToDelete?.itemName}
        </span>
        ? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setIsDeleteDialogOpen(false);
            setItemToDelete(null);
          }}
        >
          Cancel
        </Button>

        <Button
          className="bg-red-600 hover:bg-red-500 text-white"
          onClick={() => {
            handleDeleteItem(itemToDelete.itemId);
            setIsDeleteDialogOpen(false);
            setItemToDelete(null);
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>

    </div>
  );
};

export default Items;