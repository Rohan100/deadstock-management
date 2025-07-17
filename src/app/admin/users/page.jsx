'use client'
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, EyeOff, Users, Shield, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { getUsers } from "./api";
import { UserPlus } from 'lucide-react';
import AddUser from "@/components/admin/user/AddUser";

function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [showPassword, setShowPassword] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        // Fetch users from API
        async function fetchUsers() {
            try {
                const users = await getUsers()
                // setUsers(users)
                // For demo purposes, using mock data
                setUsers(users);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        }
        fetchUsers();
    }, []);

    useEffect(() => {
        // Filter users based on search term
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.id.toString().includes(searchTerm)
        );
        setFilteredUsers(filtered);
    }, [users, searchTerm]);

    const handleTogglePassword = (id) => {
        setShowPassword((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleEnableDisable = async (id, isEnabled) => {
        try {
            await fetch(`/api/admin/users/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isEnabled: !isEnabled }),
            });
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === id ? { ...user, isEnabled: !isEnabled } : user
                )
            );
        } catch (err) {
            console.error("Error updating user status:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await fetch(`/api/admin/users/${id}`, {
                    method: "DELETE",
                });
                setUsers((prev) => prev.filter((user) => user.id !== id));
            } catch (err) {
                console.error("Error deleting user:", err);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">

                <div className="flex flex-col ">
                    <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold ">User Management</h1>
                            <p >Manage system users and their permissions</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Total Users: {users.length}</span>
                        <span>•</span>
                        <span>Active: {users.filter(u => u.isEnabled).length}</span>
                    </div>
                </div>
                <AddUser/>
            </div>

            {/* Search and Filters */}
            <Card className="p-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name, username, email, or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {searchTerm && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchTerm("")}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b">
                            <tr>
                                <th className="text-left py-3 px-3 font-semibold">ID</th>
                                <th className="text-left py-3 px-3 font-semibold">User Info</th>
                                <th className="text-left py-3 px-3 font-semibold">Username</th>
                                <th className="text-center py-3 px-3 font-semibold">Role</th>
                                <th className="text-center py-3 px-3 font-semibold">Status</th>
                                <th className="text-center py-3 px-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-500">
                                        {searchTerm ? (
                                            <div className="space-y-2">
                                                <Search className="h-8 w-8 mx-auto text-gray-400" />
                                                <p>No users found matching "{searchTerm}"</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Users className="h-8 w-8 mx-auto text-gray-400" />
                                                <p>No users found</p>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="py-3 px-3">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                                                    {user.id}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="space-y-1">
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="font-mono text-sm px-2 py-1 rounded">
                                                {user.username}
                                            </div>
                                        </td>

                                        <td className="py-3 px-3 text-center">
                                            <div className="flex items-center justify-center">
                                                {user.isAdmin ? (
                                                    <div className="flex items-center gap-2 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                                                        <Shield className="h-3 w-3" />
                                                        Admin
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                                                        <Users className="h-3 w-3" />
                                                        User
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant={user.isEnabled ? "default" : "outline"}
                                                onClick={() => handleEnableDisable(user.id, user.isEnabled)}
                                                className={user.isEnabled ? "bg-green-600 hover:bg-green-700" : "border-red-300 text-red-600 hover:bg-red-50"}
                                            >
                                                {user.isEnabled ? (
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Enabled
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1">
                                                        <XCircle className="h-3 w-3" />
                                                        Disabled
                                                    </div>
                                                )}
                                            </Button>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(user.id)}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Results Summary */}
            {searchTerm && (
                <div className="text-sm text-gray-600 text-center">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            )}
        </div>
    );
}

export default AdminUsersPage;