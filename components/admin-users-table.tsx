"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Search, Trash2, UserX, UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface User {
  id: string;
  email: string;
  created_at: string;
  role: string | null;
  disabled: boolean;
  disabled_reason: string | null;
}

export function AdminUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [disabledFilter, setDisabledFilter] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [userToDisable, setUserToDisable] = useState<User | null>(null);
  const [disableReason, setDisableReason] = useState("");

  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      if (disabledFilter) params.set("disabled", disabledFilter);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, roleFilter, disabledFilter]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to update role");
        return;
      }

      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    }
  };

  const handleDisableToggle = async (user: User) => {
    if (user.id === currentUserId) {
      alert("Cannot disable your own account");
      return;
    }

    setUserToDisable(user);
    setDisableReason(user.disabled_reason || "");
    setShowDisableModal(true);
  };

  const confirmDisable = async () => {
    if (!userToDisable) return;

    try {
      const response = await fetch(
        `/api/admin/users/${userToDisable.id}/disable`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            disabled: !userToDisable.disabled,
            disabled_reason: disableReason || null,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to update user");
        return;
      }

      setShowDisableModal(false);
      setUserToDisable(null);
      setDisableReason("");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleDelete = async (user: User) => {
    if (user.id === currentUserId) {
      alert("Cannot delete your own account");
      return;
    }

    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to delete user");
        return;
      }

      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="client">Client</option>
              <option value="coach">Coach</option>
              <option value="gym_owner">Gym Owner</option>
              <option value="admin">Admin</option>
            </select>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={disabledFilter}
              onChange={(e) => setDisabledFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="false">Active</option>
              <option value="true">Disabled</option>
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{user.email}</p>
                          {user.disabled_reason && (
                            <p className="text-xs text-muted-foreground">
                              {user.disabled_reason}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              {user.role || "No role"}
                              <MoreVertical className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(user.id, "client")}
                              disabled={user.id === currentUserId && user.role === "admin"}
                            >
                              Client
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(user.id, "coach")}
                              disabled={user.id === currentUserId && user.role === "admin"}
                            >
                              Coach
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(user.id, "gym_owner")}
                              disabled={user.id === currentUserId && user.role === "admin"}
                            >
                              Gym Owner
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(user.id, "admin")}
                            >
                              Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="p-2">
                        {user.disabled ? (
                          <Badge variant="destructive">Disabled</Badge>
                        ) : (
                          <Badge variant="default">Active</Badge>
                        )}
                      </td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisableToggle(user)}
                            disabled={user.id === currentUserId}
                          >
                            {user.disabled ? (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Enable
                              </>
                            ) : (
                              <>
                                <UserX className="h-4 w-4 mr-1" />
                                Disable
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(user)}
                            disabled={user.id === currentUserId}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Delete User</CardTitle>
              <CardDescription>
                Are you sure you want to delete {userToDelete.email}? This
                action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Disable/Enable Modal */}
      {showDisableModal && userToDisable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {userToDisable.disabled ? "Enable" : "Disable"} User
              </CardTitle>
              <CardDescription>
                {userToDisable.disabled
                  ? `Enable ${userToDisable.email}?`
                  : `Disable ${userToDisable.email}?`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Reason (optional)</label>
                <Input
                  value={disableReason}
                  onChange={(e) => setDisableReason(e.target.value)}
                  placeholder="Enter reason for disabling..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDisableModal(false);
                    setUserToDisable(null);
                    setDisableReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={confirmDisable}>
                  {userToDisable.disabled ? "Enable" : "Disable"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

