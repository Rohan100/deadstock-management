"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  ArrowRightLeft, Search, Plus, MoreHorizontal, Trash2, Eye,
  Filter, Package, Building, Calendar, User, Loader2, AlertCircle, PackageX,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// ── helpers ──────────────────────────────────────────────────────────────────
const TRANSFER_TYPES = ["Warehouse to Lab", "Lab to Lab", "Lab to Warehouse"];

const emptyForm = () => ({
  itemId: "",
  transferType: "Warehouse to Lab",
  fromLabId: "",
  toLabId: "",
  quantity: "",
  remarks: "",
});

const typeBadgeColor = (type) => {
  if (type === "Warehouse to Lab") return "bg-blue-100 text-blue-800";
  if (type === "Lab to Lab") return "bg-purple-100 text-purple-800";
  return "bg-orange-100 text-orange-800";
};

// ── TransferForm — top-level to prevent focus loss ───────────────────────────
const TransferForm = ({ form, setField, errors, items, labs }) => {
  const needsFrom = form.transferType === "Lab to Lab" || form.transferType === "Lab to Warehouse";
  const needsTo   = form.transferType === "Warehouse to Lab" || form.transferType === "Lab to Lab";

  return (
    <div className="space-y-4">
      {/* Transfer Type */}
      <div className="space-y-2">
        <Label>Transfer Type <span className="text-red-500">*</span></Label>
        <Select value={form.transferType} onValueChange={(v) => setField("transferType", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {TRANSFER_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Item */}
      <div className="space-y-2">
        <Label>Item <span className="text-red-500">*</span></Label>
        <Select value={form.itemId} onValueChange={(v) => setField("itemId", v)}>
          <SelectTrigger><SelectValue placeholder="Choose an item" /></SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.itemId} value={String(item.itemId)}>
                {item.itemName} — {item.sku}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.itemId && <p className="text-xs text-red-500">{errors.itemId}</p>}
      </div>

      {/* From Lab */}
      {needsFrom && (
        <div className="space-y-2">
          <Label>From Lab <span className="text-red-500">*</span></Label>
          <Select value={form.fromLabId} onValueChange={(v) => setField("fromLabId", v)}>
            <SelectTrigger><SelectValue placeholder="Select source lab" /></SelectTrigger>
            <SelectContent>
              {labs.map((lab) => (
                <SelectItem key={lab.labId} value={String(lab.labId)}>
                  {lab.labName} {lab.labCode ? `(${lab.labCode})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.fromLabId && <p className="text-xs text-red-500">{errors.fromLabId}</p>}
        </div>
      )}

      {/* To Lab */}
      {needsTo && (
        <div className="space-y-2">
          <Label>To Lab <span className="text-red-500">*</span></Label>
          <Select value={form.toLabId} onValueChange={(v) => setField("toLabId", v)}>
            <SelectTrigger><SelectValue placeholder="Select destination lab" /></SelectTrigger>
            <SelectContent>
              {labs.map((lab) => (
                <SelectItem key={lab.labId} value={String(lab.labId)}>
                  {lab.labName} {lab.labCode ? `(${lab.labCode})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.toLabId && <p className="text-xs text-red-500">{errors.toLabId}</p>}
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-2">
        <Label htmlFor="qty">Quantity <span className="text-red-500">*</span></Label>
        <Input
          id="qty"
          type="number"
          min="1"
          placeholder="Enter quantity"
          value={form.quantity}
          onChange={(e) => setField("quantity", e.target.value)}
        />
        {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
      </div>

      {/* Remarks */}
      <div className="space-y-2">
        <Label htmlFor="remarks">Remarks</Label>
        <Textarea
          id="remarks"
          placeholder="Reason for transfer..."
          value={form.remarks}
          onChange={(e) => setField("remarks", e.target.value)}
          rows={2}
        />
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const TransferMainPage = () => {
  const { data: session } = useSession();

  // data
  const [transfers, setTransfers] = useState([]);
  const [items, setItems] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // form
  const [form, setForm] = useState(emptyForm());
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // dialogs
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // toast
  const [toast, setToast] = useState(null);

  // ── fetch data ──────────────────────────────────────────────────────────
  const fetchTransfers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/transfer");
      if (!res.ok) throw new Error("Failed to fetch transfers");
      setTransfers(await res.json());
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchTransfers();
    fetch("/api/items").then(r => r.json()).then(setItems).catch(() => {});
    fetch("/api/labs").then(r => r.json()).then(setLabs).catch(() => {});
  }, [fetchTransfers]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // ── helpers ─────────────────────────────────────────────────────────────
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.itemId) e.itemId = "Required";
    if (!form.quantity || Number(form.quantity) <= 0) e.quantity = "Must be > 0";
    if ((form.transferType === "Lab to Lab" || form.transferType === "Lab to Warehouse") && !form.fromLabId)
      e.fromLabId = "Required";
    if ((form.transferType === "Warehouse to Lab" || form.transferType === "Lab to Lab") && !form.toLabId)
      e.toLabId = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: Number(form.itemId),
          transferType: form.transferType,
          fromLabId: form.fromLabId ? Number(form.fromLabId) : undefined,
          toLabId: form.toLabId ? Number(form.toLabId) : undefined,
          quantity: Number(form.quantity),
          remarks: form.remarks || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create transfer");
      setToast({ type: "success", msg: "Transfer created successfully." });
      setDialogOpen(false);
      setForm(emptyForm());
      setFormErrors({});
      fetchTransfers();
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/transfer/${deleteTarget.transferId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      setToast({ type: "success", msg: "Transfer record deleted." });
      setDeleteTarget(null);
      fetchTransfers();
    } catch (err) {
      setToast({ type: "error", msg: err.message });
      setDeleteTarget(null);
    } finally { setSubmitting(false); }
  };

  // ── filtering ────────────────────────────────────────────────────────────
  const filtered = transfers.filter((t) => {
    const search = searchTerm.toLowerCase();
    const matchSearch =
      (t.itemName || "").toLowerCase().includes(search) ||
      (t.fromLabName || "").toLowerCase().includes(search) ||
      (t.toLabName || "").toLowerCase().includes(search) ||
      (t.performedByName || "").toLowerCase().includes(search);
    const matchType = filterType === "all" || t.transferType === filterType;
    return matchSearch && matchType;
  });

  // ── render ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-3 text-muted-foreground">Loading transfers…</span>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <p className="text-destructive font-medium">{error}</p>
      <Button onClick={fetchTransfers}>Retry</Button>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium
          ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          {toast.type === "success" ? "✅" : <AlertCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Transfers</h1>
          <p className="text-muted-foreground mt-1">Transfer inventory between warehouse and labs</p>
        </div>
        <Button className="bg-primary" onClick={() => { setForm(emptyForm()); setFormErrors({}); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> New Transfer
        </Button>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Transfer History</TabsTrigger>
          <TabsTrigger value="inventory">Available Items</TabsTrigger>
        </TabsList>

        {/* ── History Tab ──────────────────────────────────────────────── */}
        <TabsContent value="history" className="space-y-4">
          {/* Filters */}
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
                  <Input placeholder="Search by item, lab, or user…" className="pl-10"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[220px]"><SelectValue placeholder="Transfer type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {TRANSFER_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer History</CardTitle>
              <CardDescription>{filtered.length} transfer(s) found</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From → To</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          <PackageX className="mx-auto h-8 w-8 mb-2 opacity-30" />
                          No transfers found.
                        </TableCell>
                      </TableRow>
                    ) : filtered.map((t) => (
                      <TableRow key={t.transferId}>
                        <TableCell>
                          <div className="font-medium">{t.itemName || "—"}</div>
                          <div className="text-xs text-muted-foreground">{t.sku}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={typeBadgeColor(t.transferType)} variant="outline">
                            {t.transferType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-muted-foreground">{t.fromLabName || "Warehouse"}</span>
                            <ArrowRightLeft className="h-3 w-3 mx-1 text-muted-foreground" />
                            <span>{t.toLabName || "Warehouse"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{t.quantity}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {t.transferDate ? new Date(t.transferDate).toLocaleDateString("en-IN") : "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <User className="h-3 w-3 text-muted-foreground" />
                            {t.performedByName || "—"}
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
                              <DropdownMenuItem onClick={() => setViewTarget(t)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => setDeleteTarget(t)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Record
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

        {/* ── Available Items Tab ──────────────────────────────────────── */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Items</CardTitle>
              <CardDescription>Items that can be transferred</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <Card key={item.itemId} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{item.itemName}</CardTitle>
                      <CardDescription>{item.sku}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Package className="h-3 w-3" /> Quantity
                        </span>
                        <span className="font-medium">{item.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unit Price</span>
                        <span className="font-medium">₹{Number(item.unitPrice).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Condition</span>
                        <Badge variant="outline" className="text-xs">{item.condition}</Badge>
                      </div>
                      <Button size="sm" className="w-full mt-2" onClick={() => {
                        setForm({ ...emptyForm(), itemId: String(item.itemId) });
                        setFormErrors({});
                        setDialogOpen(true);
                      }}>
                        Transfer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── New Transfer Dialog ──────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) { setDialogOpen(false); setForm(emptyForm()); setFormErrors({}); } }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Transfer</DialogTitle>
            <DialogDescription>Transfer stock between warehouse and labs.</DialogDescription>
          </DialogHeader>
          <TransferForm form={form} setField={setField} errors={formErrors} items={items} labs={labs} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Transfer Stock
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── View Details Dialog ──────────────────────────────────────── */}
      <Dialog open={!!viewTarget} onOpenChange={(o) => { if (!o) setViewTarget(null); }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" /> Transfer #{viewTarget?.transferId}
            </DialogTitle>
            <DialogDescription>Transfer record details</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-3 text-sm">
              {[
                ["Item", viewTarget.itemName],
                ["SKU", viewTarget.sku],
                ["Type", viewTarget.transferType],
                ["From", viewTarget.fromLabName || "Warehouse"],
                ["To", viewTarget.toLabName || "Warehouse"],
                ["Quantity", viewTarget.quantity],
                ["Date", viewTarget.transferDate ? new Date(viewTarget.transferDate).toLocaleDateString("en-IN") : "—"],
                ["Performed By", viewTarget.performedByName],
                ["Remarks", viewTarget.remarks || "—"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-right max-w-[240px]">{val}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setViewTarget(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ──────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transfer Record?</AlertDialogTitle>
            <AlertDialogDescription>
              This only removes the log record. The stock changes that already happened will NOT be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete} disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransferMainPage;