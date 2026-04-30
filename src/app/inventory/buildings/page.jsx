"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Building2,
  Search,
  Plus,
  MapPin,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // dialog state
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);

  // form state (ONLY schema fields)
  const [form, setForm] = useState({
    buildingName: "",
    address: "",
  });

  // ================= FETCH =================
  const fetchBuildings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/building");
      if (!res.ok) throw new Error("Failed to fetch buildings");
      const data = await res.json();
      setBuildings(data);
    } catch (err) {
      toast.error("Failed to fetch buildings", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  // ================= CREATE =================
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.buildingName.trim()) {
      toast.error("Validation Error", {
        description: "Building name is required",
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/building", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create building");

      toast.success("Building created successfully", {
        description: `${form.buildingName} has been added`,
      });

      setForm({ buildingName: "", address: "" });
      setOpen(false);
      fetchBuildings();
    } catch (err) {
      toast.error("Failed to create building", {
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ================= UPDATE =================
  const handleEdit = (building) => {
    setEditingBuilding(building);
    setForm({
      buildingName: building.buildingName,
      address: building.address || "",
    });
    setOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.buildingName.trim()) {
      toast.error("Validation Error", {
        description: "Building name is required",
      });
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`/api/building/${editingBuilding.buildingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update building");

      toast.success("Building updated successfully", {
        description: `${form.buildingName} has been updated`,
      });

      setForm({ buildingName: "", address: "" });
      setEditingBuilding(null);
      setOpen(false);
      fetchBuildings();
    } catch (err) {
      toast.error("Failed to update building", {
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id, buildingName) => {
    toast.custom((t) => (
      <div className="bg-background border rounded-lg shadow-lg p-4 max-w-md">
        <h3 className="font-semibold text-lg mb-2">Delete Building?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Are you sure you want to delete "{buildingName}"? This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.dismiss(t)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              toast.dismiss(t);
              try {
                const res = await fetch(`/api/building/${id}`, {
                  method: "DELETE",
                });

                if (!res.ok) throw new Error("Failed to delete building");

                toast.success("Building deleted successfully", {
                  description: `${buildingName} has been removed`,
                });

                setBuildings((prev) => prev.filter((b) => b.buildingId !== id));
              } catch (err) {
                toast.error("Failed to delete building", {
                  description: err.message,
                });
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  // ================= SEARCH =================
  const filtered = useMemo(() => {
    return buildings.filter((b) =>
      b.buildingName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [buildings, search]);

  // Reset form when dialog closes
  const handleDialogOpenChange = (open) => {
    if (!open) {
      setForm({ buildingName: "", address: "" });
      setEditingBuilding(null);
    }
    setOpen(open);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Buildings</h1>
          <p className="text-muted-foreground">
            Manage campus buildings
          </p>
        </div>

        {/* ADD DIALOG */}
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Building
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBuilding ? "Edit Building" : "Create Building"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={editingBuilding ? handleUpdate : handleCreate} className="space-y-4">
              <Input
                placeholder="Building Name *"
                value={form.buildingName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    buildingName: e.target.value,
                  })
                }
              />

              <Input
                placeholder="Address (optional)"
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
              />

              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingBuilding ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{editingBuilding ? "Update Building" : "Create Building"}</>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH BAR */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search buildings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              {search ? "No buildings found" : "No buildings yet"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Building</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.buildingId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {b.buildingName}
                      </div>
                    </TableCell>

                    <TableCell>
                      {b.address ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {b.address}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/50 text-sm">
                          —
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              toast.info("Building Details", {
                                description: (
                                  <div className="mt-2">
                                    <p className="font-semibold">{b.buildingName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {b.address || "No address provided"}
                                    </p>
                                  </div>
                                ),
                                duration: 5000,
                              });
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => handleEdit(b)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="text-red-500"
                            onClick={() =>
                              handleDelete(b.buildingId, b.buildingName)
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}