"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  Loader2,
  AlertCircle,
  PackageX,
  FlaskConical,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ─── helpers ──────────────────────────────────────────────────────────────────
const emptyForm = () => ({
  departmentName: "",
  head: "",
  location: "",
  status: "Active",
  description: "",
});

const emptyLabForm = () => ({
  labName: "",
  labCode: "",
  buildingId: "none",
  floorNumber: "",
  labType: "",
  capacity: "",
  inChargeName: "",
  inChargeContact: "",
});

const getStatusColor = (status) =>
  status === "Active"
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-gray-100 text-gray-600 border-gray-200";

// ─── Shared form — MUST be defined outside Department to keep stable identity ──
const DeptForm = ({ form, setField, formErrors }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="departmentName">
        Department Name <span className="text-red-500">*</span>
      </Label>
      <Input
        id="departmentName"
        placeholder="e.g. Computer Science"
        value={form.departmentName}
        onChange={(e) => setField("departmentName", e.target.value)}
      />
      {formErrors.departmentName && (
        <p className="text-xs text-red-500">{formErrors.departmentName}</p>
      )}
    </div>

    <div className="space-y-2">
      <Label htmlFor="head">Department Head</Label>
      <Input
        id="head"
        placeholder="e.g. Dr. Rajesh Kumar"
        value={form.head}
        onChange={(e) => setField("head", e.target.value)}
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g. Block A"
          value={form.location}
          onChange={(e) => setField("location", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={form.status} onValueChange={(v) => setField("status", v)}>
          <SelectTrigger id="status">
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
        placeholder="Brief description of the department..."
        value={form.description}
        onChange={(e) => setField("description", e.target.value)}
        rows={3}
      />
    </div>
  </div>
);

const LabForm = ({ form, setField, formErrors, buildings }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="labName">
        Lab Name <span className="text-red-500">*</span>
      </Label>
      <Input
        id="labName"
        placeholder="e.g. Computer Lab 1"
        value={form.labName}
        onChange={(e) => setField("labName", e.target.value)}
      />
      {formErrors.labName && (
        <p className="text-xs text-red-500">{formErrors.labName}</p>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="labCode">Lab Code</Label>
        <Input
          id="labCode"
          placeholder="e.g. CSE-L1"
          value={form.labCode}
          onChange={(e) => setField("labCode", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="labType">Lab Type</Label>
        <Input
          id="labType"
          placeholder="e.g. Computer"
          value={form.labType}
          onChange={(e) => setField("labType", e.target.value)}
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="buildingId">Building</Label>
      <Select
        value={form.buildingId}
        onValueChange={(value) => setField("buildingId", value)}
      >
        <SelectTrigger id="buildingId">
          <SelectValue placeholder="Select building" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No building assigned</SelectItem>
          {buildings.map((building) => (
            <SelectItem key={building.buildingId} value={String(building.buildingId)}>
              {building.buildingName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="floorNumber">Floor</Label>
        <Input
          id="floorNumber"
          type="number"
          min="0"
          placeholder="e.g. 2"
          value={form.floorNumber}
          onChange={(e) => setField("floorNumber", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          type="number"
          min="0"
          placeholder="e.g. 30"
          value={form.capacity}
          onChange={(e) => setField("capacity", e.target.value)}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="inChargeName">In-Charge</Label>
        <Input
          id="inChargeName"
          placeholder="e.g. Prof. Sharma"
          value={form.inChargeName}
          onChange={(e) => setField("inChargeName", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="inChargeContact">Contact</Label>
        <Input
          id="inChargeContact"
          placeholder="e.g. 9876543210"
          value={form.inChargeContact}
          onChange={(e) => setField("inChargeContact", e.target.value)}
        />
      </div>
    </div>
  </div>
);

// ─── main component ───────────────────────────────────────────────────────────
const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [labs, setLabs] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // form state (shared between add & edit)
  const [form, setForm] = useState(emptyForm());
  const [formErrors, setFormErrors] = useState({});
  const [labForm, setLabForm] = useState(emptyLabForm());
  const [labFormErrors, setLabFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // dialog visibility
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // dept object
  const [deleteTarget, setDeleteTarget] = useState(null); // dept object
  const [viewTarget, setViewTarget] = useState(null);   // dept object
  const [labTarget, setLabTarget] = useState(null); // dept object

  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  // ─── data fetching ────────────────────────────────────────────────────────
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [departmentsRes, labsRes, buildingsRes] = await Promise.all([
        fetch("/api/departments"),
        fetch("/api/labs"),
        fetch("/api/building"),
      ]);
      if (!departmentsRes.ok) throw new Error("Failed to fetch departments");
      if (!labsRes.ok) throw new Error("Failed to fetch labs");
      if (!buildingsRes.ok) throw new Error("Failed to fetch buildings");
      const [departmentsData, labsData, buildingsData] = await Promise.all([
        departmentsRes.json(),
        labsRes.json(),
        buildingsRes.json(),
      ]);
      setDepartments(departmentsData);
      setLabs(labsData);
      setBuildings(buildingsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

  // auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // ─── filtering ────────────────────────────────────────────────────────────
  const filtered = departments.filter((d) => {
    const matchSearch =
      d.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.head || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      selectedStatus === "all" ||
      d.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  // ─── form helpers ─────────────────────────────────────────────────────────
  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setLabField = (key, val) => setLabForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const errs = {};
    if (!form.departmentName.trim()) errs.departmentName = "Required";
    return errs;
  };

  const validateLab = () => {
    const errs = {};
    if (!labForm.labName.trim()) errs.labName = "Required";
    return errs;
  };

  const labsForDepartment = (departmentId) =>
    labs.filter((lab) => lab.departmentId === departmentId);

  const openEdit = (dept) => {
    setForm({
      departmentName: dept.departmentName,
      head: dept.head || "",
      location: dept.location || "",
      status: dept.status,
      description: dept.description || "",
    });
    setFormErrors({});
    setEditTarget(dept);
  };

  const closeEdit = () => {
    setEditTarget(null);
    setForm(emptyForm());
    setFormErrors({});
  };

  const closeAdd = () => {
    setAddOpen(false);
    setForm(emptyForm());
    setFormErrors({});
  };

  const openLabDialog = (dept) => {
    setLabTarget(dept);
    setLabForm(emptyLabForm());
    setLabFormErrors({});
  };

  const closeLabDialog = () => {
    setLabTarget(null);
    setLabForm(emptyLabForm());
    setLabFormErrors({});
  };

  // ─── CRUD handlers ────────────────────────────────────────────────────────
  const handleAdd = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");
      setToast({ type: "success", msg: `"${data.departmentName}" added successfully.` });
      closeAdd();
      fetchDepartments();
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/departments/${editTarget.departmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      setToast({ type: "success", msg: `"${data.departmentName}" updated successfully.` });
      closeEdit();
      fetchDepartments();
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/departments/${deleteTarget.departmentId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      setToast({ type: "success", msg: `"${deleteTarget.departmentName}" deleted.` });
      setDeleteTarget(null);
      fetchDepartments();
    } catch (err) {
      setToast({ type: "error", msg: err.message });
      setDeleteTarget(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddLab = async () => {
    if (!labTarget) return;
    const errs = validateLab();
    if (Object.keys(errs).length) { setLabFormErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...labForm,
        buildingId: labForm.buildingId === "none" ? null : labForm.buildingId,
        departmentId: labTarget.departmentId,
      };

      const res = await fetch("/api/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create lab");
      setToast({ type: "success", msg: `"${data.labName}" added to ${labTarget.departmentName}.` });
      closeLabDialog();
      fetchDepartments();
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── loading / error states ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading departments…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={fetchDepartments}>Retry</Button>
      </div>
    );
  }

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all
            ${toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
            }`}
        >
          {toast.type === "success"
            ? <span>✅</span>
            : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Departments</h1>
          <p className="text-muted-foreground mt-1">
            Manage college departments and their inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>

          <Button className="bg-primary" onClick={() => { setForm(emptyForm()); setFormErrors({}); setAddOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      {/* ── Filters ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or head…"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── Summary counts ── */}
      <div className="flex gap-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{filtered.length}</span> department(s)
        {filtered.length !== departments.length && (
          <span>of {departments.length} total</span>
        )}
      </div>

      {/* ── Content ── */}
      <Tabs value={viewMode} onValueChange={setViewMode}>
        {/* Grid view */}
        <TabsContent value="grid">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <PackageX className="h-12 w-12 opacity-30" />
              <p>No departments found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((dept) => (
                <Card key={dept.departmentId} className="hover:shadow-md transition-shadow">
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-3 p-3 bg-blue-100 rounded-full w-fit">
                      <Building className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg leading-tight">{dept.departmentName}</CardTitle>
                    {dept.head && (
                      <CardDescription className="flex items-center justify-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        {dept.head}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge className={getStatusColor(dept.status)} variant="outline">
                        {dept.status}
                      </Badge>
                      <div className="flex flex-col items-end text-xs text-muted-foreground">
                        <span>{dept.itemCount ?? 0} item(s)</span>
                        <span>{dept.labCount ?? 0} lab(s)</span>
                      </div>
                    </div>

                    {dept.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {dept.location}
                      </div>
                    )}

                    {dept.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{dept.description}</p>
                    )}

                    <div className="flex justify-center pt-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4 mr-2" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setViewTarget(dept)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openLabDialog(dept)}>
                            <FlaskConical className="mr-2 h-4 w-4" />
                            Add Lab
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(dept)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteTarget(dept)}
                          >
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
          )}
        </TabsContent>

        {/* Table view */}
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Departments Overview</CardTitle>
              <CardDescription>{filtered.length} department(s) found</CardDescription>
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
                      <TableHead>Labs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                          <PackageX className="mx-auto h-8 w-8 mb-2 opacity-30" />
                          No departments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((dept) => (
                        <TableRow key={dept.departmentId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-full">
                                <Building className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium">{dept.departmentName}</span>
                            </div>
                          </TableCell>
                          <TableCell>{dept.head || <span className="text-muted-foreground italic text-xs">—</span>}</TableCell>
                          <TableCell>{dept.location || <span className="text-muted-foreground italic text-xs">—</span>}</TableCell>
                          <TableCell>
                            <span className="font-medium">{dept.itemCount ?? 0}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{dept.labCount ?? 0}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(dept.status)} variant="outline">
                              {dept.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                            {dept.description || "—"}
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
                                <DropdownMenuItem onClick={() => setViewTarget(dept)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openLabDialog(dept)}>
                                  <FlaskConical className="mr-2 h-4 w-4" />
                                  Add Lab
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEdit(dept)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setDeleteTarget(dept)}
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

      {/* ─── Add Department Dialog ─────────────────────────────────── */}
      <Dialog open={addOpen} onOpenChange={(o) => { if (!o) closeAdd(); else setAddOpen(true); }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>Create a new department for your college.</DialogDescription>
          </DialogHeader>
          <DeptForm form={form} setField={setField} formErrors={formErrors} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={closeAdd} disabled={submitting}>Cancel</Button>
            <Button onClick={handleAdd} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Add Department
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Department Dialog ────────────────────────────────── */}
      <Dialog open={!!editTarget} onOpenChange={(o) => { if (!o) closeEdit(); }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update the department details below.</DialogDescription>
          </DialogHeader>
          <DeptForm form={form} setField={setField} formErrors={formErrors} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={closeEdit} disabled={submitting}>Cancel</Button>
            <Button onClick={handleEdit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Lab Dialog */}
      <Dialog open={!!labTarget} onOpenChange={(o) => { if (!o) closeLabDialog(); }}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Create Lab</DialogTitle>
            <DialogDescription>
              Add a lab under {labTarget?.departmentName || "this department"}.
            </DialogDescription>
          </DialogHeader>
          <LabForm
            form={labForm}
            setField={setLabField}
            formErrors={labFormErrors}
            buildings={buildings}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={closeLabDialog} disabled={submitting}>Cancel</Button>
            <Button onClick={handleAddLab} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Lab
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── View Details Dialog ───────────────────────────────────── */}
      <Dialog open={!!viewTarget} onOpenChange={(o) => { if (!o) setViewTarget(null); }}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              {viewTarget?.departmentName}
            </DialogTitle>
            <DialogDescription>Department details</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Status</span>
                <Badge className={getStatusColor(viewTarget.status)} variant="outline">
                  {viewTarget.status}
                </Badge>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Head</span>
                <span className="font-medium">{viewTarget.head || "—"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{viewTarget.location || "—"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Items Linked</span>
                <span className="font-medium">{viewTarget.itemCount ?? 0}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Labs</span>
                <span className="font-medium">{viewTarget.labCount ?? 0}</span>
              </div>
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Department Labs</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { openLabDialog(viewTarget); setViewTarget(null); }}
                  >
                    <FlaskConical className="h-4 w-4 mr-2" />
                    Add Lab
                  </Button>
                </div>
                {labsForDepartment(viewTarget.departmentId).length === 0 ? (
                  <p className="text-xs text-muted-foreground">No labs assigned.</p>
                ) : (
                  <div className="space-y-2">
                    {labsForDepartment(viewTarget.departmentId).map((lab) => (
                      <div key={lab.labId} className="rounded-md border px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium">{lab.labName}</span>
                          {lab.labCode && (
                            <span className="text-xs text-muted-foreground">{lab.labCode}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {lab.buildingName || "No building"}{lab.floorNumber ? `, Floor ${lab.floorNumber}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {viewTarget.description && (
                <div className="pt-1">
                  <p className="text-muted-foreground mb-1">Description</p>
                  <p>{viewTarget.description}</p>
                </div>
              )}
              <div className="flex justify-between text-xs text-muted-foreground pt-2">
                <span>Created: {viewTarget.createdAt ? new Date(viewTarget.createdAt).toLocaleDateString("en-IN") : "—"}</span>
                <span>Updated: {viewTarget.updatedAt ? new Date(viewTarget.updatedAt).toLocaleDateString("en-IN") : "—"}</span>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setViewTarget(null)}>Close</Button>
            <Button variant="outline" onClick={() => { openLabDialog(viewTarget); setViewTarget(null); }}>
              <FlaskConical className="h-4 w-4 mr-2" /> Add Lab
            </Button>
            <Button onClick={() => { openEdit(viewTarget); setViewTarget(null); }}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ───────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.departmentName}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. If any inventory items are still linked to this
              department, the deletion will be blocked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Department;
