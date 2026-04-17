"use client"
import React, { useState,useEffect } from 'react'
import { 
  Truck, 
  Search, 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Grid3X3,
  List,
  Phone,
  MapPin
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
import { Tabs, TabsContent, } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Toaster, toast } from 'sonner'

const SuppliersMain = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendorType, setSelectedVendorType] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [isVendorDialogOpen, setVendorDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
const [vendorToDelete, setVendorToDelete] = useState(null)
  const [vendorName, setVendorName] = useState("")
  const [vendorType, setVendorType] = useState("")
  const [contactNo, setContactNo] = useState("")
  const [address, setAddress] = useState("")
  const [vendors, setVendors] = useState([])
const [loading, setLoading] = useState(true)


    useEffect(() => {
  fetchVendors()
}, [])
useEffect(() => {
  const handleInputEvent = (e) => {
    const { name, value } = e.target;
    if (name === "vendorName") setVendorName(value);
    if (name === "contactNo") setContactNo(value);
    if (name === "address") setAddress(value);
  };

  const inputs = [
    document.getElementById("vendorName"),
    document.getElementById("contactNo"),
    document.getElementById("address"),
  ];

  inputs.forEach(input => input?.addEventListener("input", handleInputEvent));

  return () => {
    inputs.forEach(input => input?.removeEventListener("input", handleInputEvent));
  };
}, []);

const fetchVendors = async () => {
  try {
    setLoading(true)
    const res = await fetch("/api/vendors")
    const data = await res.json()
    setVendors(data)
  } catch (error) {
    console.error("Failed to fetch vendors", error)
  } finally {
    setLoading(false)
  }
}
const resetForm = () => {
  setVendorName("")
  setVendorType("")
  setContactNo("")
  setAddress("")
}

  

  const filteredVendors = vendors.filter(vendor => {
  const matchesSearch =
    vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.phone ?? "").includes(searchTerm) ||
    (vendor.address ?? "").toLowerCase().includes(searchTerm.toLowerCase());

  const matchesVendorType =
    selectedVendorType === "all" ||
    vendor.vendorType?.toLowerCase() === selectedVendorType.toLowerCase();

  return matchesSearch && matchesVendorType;
});




 const handleAddVendor = async () => {
  try {
    const res = await fetch("/api/vendors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vendorName,
        phone: contactNo,
        vendorType,
        address,
        contactPerson: "",
        email: "",
        gstin: "",
      }),
    });

    if (!res.ok) throw new Error("Failed to add vendor");
    const newVendor = await res.json();

    setVendors(prev => [newVendor, ...prev]);
    resetForm();
    setVendorDialogOpen(false);

   
    setSearchTerm("");

    toast.success("Vendor added successfully", { id: "add-vendor" });
  } catch (error) {
    toast.error("Something went wrong", { id: "add-vendor" });
  }
};

const handleDeleteVendor = async (id) => {
  try {
    toast.loading("Deleting vendor...", { id: "delete-vendor" })

    const res = await fetch(`/api/vendors/${id}`, {
      method: "DELETE",
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || "Delete failed", {
        id: "delete-vendor",
      })
      return
    }

    setVendors((prev) => prev.filter((v) => v.vendorId !== id))

    toast.success("Vendor deleted successfully", {
      id: "delete-vendor",
    })
  } catch (error) {
    toast.error("Something went wrong", {
      id: "delete-vendor",
    })
  }
}



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground mt-2">Manage vendor relationships and procurement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}>
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>

          <Dialog open={isVendorDialogOpen} onOpenChange={(open) => {
            setVendorDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Vendor</DialogTitle>
                <DialogDescription>
                  Add a new vendor to your supplier list
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorName">Vendor Name *</Label>
                  <Input
                    id="vendorName"
                    placeholder="Enter vendor name"
                     name="vendorName"
                     
                     autoComplete="organization"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vendorType">Vendor Type *</Label>
                  <Select value={vendorType} onValueChange={setVendorType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Sports Equipment">Sports Equipment</SelectItem>
                      <SelectItem value="Stationery">Stationery</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNo">Contact Number *</Label>
                  <Input
                    id="contactNo"
                     name="contactNo"
                      autoComplete="tel"
                    placeholder="e.g., +91-9876543210"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter vendor address"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      resetForm()
                      setVendorDialogOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddVendor}
                    disabled={!vendorName || !vendorType || !contactNo || !address}
                  >
                    Add Vendor
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
                  placeholder="Search vendors, contact numbers, or addresses..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedVendorType} onValueChange={setSelectedVendorType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Vendor Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="lab equipment">Lab Equipment</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="sports equipment">Sports Equipment</SelectItem>
                <SelectItem value="stationery">Stationery</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

     
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsContent value="grid">
 
  {loading && (
    <div className="flex justify-center items-center gap-2">
  <Truck className="h-4 w-4 animate-pulse" />
  Loading vendors...
</div>

  )}

  
  {!loading && vendors.length === 0 && (
    <div className="col-span-full text-center py-12 text-muted-foreground">
      No vendors found. Click <span className="font-semibold">"Add Vendor"</span> to get started.
    </div>
  )}

  
  {!loading && vendors.length > 0 && filteredVendors.length === 0 && (
    <div className="col-span-full text-center py-12 text-muted-foreground">
      No vendors match your search or filter.
    </div>
  )}


  {!loading && filteredVendors.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVendors.map((vendor) => (
              <Card key={vendor.vendorId} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{vendor.vendorName}</CardTitle>
                      <CardDescription className="text-sm">
                        {vendor.vendorType}
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
                          Edit Vendor
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => {
                            setVendorToDelete(vendor)
                            setDeleteDialogOpen(true)
                          }}  
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{vendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="truncate">{vendor.address}</span>
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
              <CardTitle>Vendors Overview</CardTitle>
              <CardDescription>
                {filteredVendors.length} vendor(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                 <TableBody>
  {/* Loading */}
  {loading && (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
        Loading vendors...
      </TableCell>
    </TableRow>
  )}

  {/* No vendors in DB */}
  {!loading && vendors.length === 0 && (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
        No vendors found. Click <span className="font-semibold">"Add Vendor"</span> to get started.
      </TableCell>
    </TableRow>
  )}

  {/* No match after search/filter */}
  {!loading && vendors.length > 0 && filteredVendors.length === 0 && (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
        No vendors match your search or filter.
      </TableCell>
    </TableRow>
  )}

  {/* Vendors rows */}
  {!loading && filteredVendors.map((vendor) => (
    <TableRow key={vendor.vendorId}>
                        <TableCell>
                          <div className="font-medium">{vendor.vendorName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{vendor.vendorType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {vendor.phone}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {vendor.address}
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
                                Edit Vendor
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                             <DropdownMenuItem 
                                onClick={() => {
                                setVendorToDelete(vendor)
                                setDeleteDialogOpen(true)
                                }}  
                                className="text-red-600"
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
  <DialogContent className="sm:max-w-[400px]">
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete vendor "{vendorToDelete?.vendorName}"? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>

    <div className="flex justify-end gap-2 pt-4">
      <Button 
        variant="outline" 
        onClick={() => setDeleteDialogOpen(false)}
      >
        Cancel
      </Button>
      <Button 
        className="bg-red-600 text-white hover:bg-red-400"
        onClick={() => {
          handleDeleteVendor(vendorToDelete.vendorId)
          setDeleteDialogOpen(false)
          setVendorToDelete(null)
        }}
      >
        Delete
      </Button>
    </div>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default SuppliersMain