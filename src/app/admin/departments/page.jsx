"use client";
import React, { useState } from "react";
import {
  Building,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Grid3X3,
  List,
  User,
  MapPin,
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Department = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isDepartmentDialogOpen, setDepartmentDialogOpen] = useState(false);

  const [departmentName, setDepartmentName] = useState("");
  const [head, setHead] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");

 
  const departments = [
    {
      id: 1,
      name: "Computer Science",
      head: "Dr. Rajesh Kumar",
      itemCount: 142,
      totalValue: 2850000.0,
      status: "Active",
      location: "Block A",
      lastUpdated: "2024-07-11",
    },
    {
      id: 2,
      name: "Chemistry",
      head: "Dr. Priya Sharma",
      itemCount: 89,
      totalValue: 1650000.0,
      status: "Active",
      location: "Block B",
      lastUpdated: "2024-07-09",
    },
    {
      id: 3,
      name: "Physics",
      head: "Dr. Amit Singh",
      itemCount: 76,
      totalValue: 1200000.0,
      status: "Active",
      location: "Block C",
      lastUpdated: "2024-07-08",
    },
    {
      id: 4,
      name: "Biology",
      head: "Dr. Sunita Verma",
      itemCount: 67,
      totalValue: 980000.0,
      status: "Active",
      location: "Block D",
      lastUpdated: "2024-07-07",
    },
    {
      id: 5,
      name: "Mathematics",
      head: "Dr. Vikram Joshi",
      itemCount: 45,
      totalValue: 320000.0,
      status: "Active",
      location: "Block E",
      lastUpdated: "2024-07-10",
    },
    {
      id: 6,
      name: "English Literature",
      head: "Dr. Kavita Patel",
      itemCount: 23,
      totalValue: 125000.0,
      status: "Inactive",
      location: "Block F",
      lastUpdated: "2024-07-06",
    },
    {
      id: 7,
      name: "Mechanical Engineering",
      head: "Dr. Suresh Gupta",
      itemCount: 156,
      totalValue: 3200000.0,
      status: "Active",
      location: "Block G",
      lastUpdated: "2024-07-11",
    },
    {
      id: 8,
      name: "Civil Engineering",
      head: "Dr. Neha Agarwal",
      itemCount: 134,
      totalValue: 2400000.0,
      status: "Active",
      location: "Block H",
      lastUpdated: "2024-07-09",
    },
  ];

  
  const filteredDepartments = departments.filter((department) => {
    const matchesSearch =
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.head.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ||
      department.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleAddDepartment = () => {
 
    console.log("Adding department:", {
      name: departmentName,
      head: head,
      location: location,
      status: status,
      description: description,
      itemCount: 0,
      totalValue: 0.0,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    
  
    resetForm();
    setDepartmentDialogOpen(false);
  };

  const resetForm = () => {
    setDepartmentName("");
    setHead("");
    setLocation("");
    setStatus("Active");
    setDescription("");
  };

 
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
     
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Departments</h1>
          <p className="text-muted-foreground mt-2">
            Manage college departments and their inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid3X3 className="h-4 w-4" />
            )}
          </Button>

          <Dialog open={isDepartmentDialogOpen} onOpenChange={(open) => {
            setDepartmentDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Department</DialogTitle>
                <DialogDescription>
                  Create a new department for your college
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="departmentName">Department Name *</Label>
                  <Input
                    id="departmentName"
                    placeholder="Enter department name"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="head">Department Head *</Label>
                  <Input
                    id="head"
                    placeholder="Enter department head name"
                    value={head}
                    onChange={(e) => setHead(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Block A"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
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
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter department description"
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
                      setDepartmentDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddDepartment}
                    disabled={!departmentName || !head || !location || !status}
                  >
                    Add Department
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      
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
                  placeholder="Search departments..."
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
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDepartments.map((department) => (
              <Card
                key={department.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <Building className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1">
                    <User className="h-3 w-3" />
                    {department.head}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge className={getStatusColor(department.status)}>
                      {department.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {department.itemCount} items
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {department.location}
                  </div>
                  
                  <div className="text-sm font-medium">
                    ₹{department.totalValue.toLocaleString("en-IN")}
                  </div>

                  <div className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4 mr-2" />
                          Actions
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
                          Edit Department
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Departments Overview</CardTitle>
              <CardDescription>
                {filteredDepartments.length} department(s) found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Head</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.map((department) => (
                      <TableRow key={department.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Building className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="font-medium">{department.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{department.head}</TableCell>
                        <TableCell>{department.location}</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {department.itemCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₹{department.totalValue.toLocaleString("en-IN")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(department.status)}>
                            {department.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {department.lastUpdated}
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
                                Edit Department
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
  );
};

export default Department;