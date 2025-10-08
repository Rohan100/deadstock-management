"use client"
import React, { useState } from 'react'
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
import { Tabs, TabsContent } from "@/components/ui/tabs"

const SuppliersMain = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendorType, setSelectedVendorType] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  // Sample vendors data matching schema
  const vendors = [
    {
      id: 1,
      name: "Tech Solutions India Pvt Ltd",
      vendorType: "Electronics",
      contactNo: "+91-9876543210",
      address: "123 Tech Park, Bangalore, Karnataka",
      createdByUserId: 1
    },
    {
      id: 2,
      name: "Scientific Instruments Corp",
      vendorType: "Lab Equipment",
      contactNo: "+91-8765432109",
      address: "456 Science Avenue, Mumbai, Maharashtra",
      createdByUserId: 2
    },
    {
      id: 3,
      name: "Office Furniture Plus",
      vendorType: "Furniture",
      contactNo: "+91-7654321098",
      address: "789 Business District, Delhi",
      createdByUserId: 1
    },
    {
      id: 4,
      name: "MedSupply Corporation",
      vendorType: "Medical",
      contactNo: "+91-6543210987",
      address: "321 Medical Plaza, Chennai, Tamil Nadu",
      createdByUserId: 3
    },
    {
      id: 5,
      name: "Sports Gear India",
      vendorType: "Sports Equipment",
      contactNo: "+91-5432109876",
      address: "654 Sports Complex, Pune, Maharashtra",
      createdByUserId: 2
    },
    {
      id: 6,
      name: "Stationery World",
      vendorType: "Stationery",
      contactNo: "+91-4321098765",
      address: "987 Office Supplies Street, Ahmedabad, Gujarat",
      createdByUserId: 1
    },
    {
      id: 7,
      name: "Dell Technologies India",
      vendorType: "Electronics",
      contactNo: "+91-3210987654",
      address: "147 IT Hub, Hyderabad, Telangana",
      createdByUserId: 3
    },
    {
      id: 8,
      name: "Construction Materials Ltd",
      vendorType: "Construction",
      contactNo: "+91-2109876543",
      address: "258 Building Supplies Road, Jaipur, Rajasthan",
      createdByUserId: 2
    }
  ]

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactNo.includes(searchTerm) ||
                         vendor.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVendorType = selectedVendorType === "all" || vendor.vendorType.toLowerCase() === selectedVendorType.toLowerCase()
    
    return matchesSearch && matchesVendorType
  })

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
          <Button className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
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

      {/* Content */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
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
                        <DropdownMenuItem className="text-red-600">
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
                      <span>{vendor.contactNo}</span>
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
                    {filteredVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell>
                          <div className="font-medium">{vendor.name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{vendor.vendorType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {vendor.contactNo}
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

export default SuppliersMain