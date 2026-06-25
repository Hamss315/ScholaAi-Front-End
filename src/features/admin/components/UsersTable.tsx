import { useState, useEffect, useCallback } from "react";
import { Search, UserPlus, UserX, UserCheck, Trash2, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useNavigate } from "react-router-dom";
import { getUsers, type AdminUser } from "../../../services/api/admin";
import { cn } from "../../../utils/utils";

interface UsersTableProps {
  onAddUserClick: () => void;
  refreshKey?: number;
}

const PAGE_SIZE = 10;

export default function UsersTable({ onAddUserClick, refreshKey }: UsersTableProps) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers({
        search: debouncedSearch || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        page,
        pageSize: PAGE_SIZE,
      });
      setUsers(res.data);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, roleFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers, refreshKey]);

  const getInitials = (u: AdminUser) =>
    `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase() || u.userName?.[0]?.toUpperCase() || "?";

  const getFullName = (u: AdminUser) =>
    `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.userName;

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#1E3A8A" }}>
            User Management
          </h2>
          {!loading && (
            <p className="text-sm text-gray-500 mt-0.5">{totalCount} total users</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-36 bg-white border border-gray-300 rounded-md">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-md">
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users…"
              className="pl-9 w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium"
            onClick={onAddUserClick}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 mb-4 text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading users…
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Name</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50/80 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3 font-medium">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[#3B82F6] text-white text-xs font-semibold">
                              {getInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          {getFullName(user)}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "border-none px-2.5 py-0.5 font-semibold text-xs rounded-full",
                            user.role === "Teacher"
                              ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                              : user.role === "Student"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "border-none px-2.5 py-0.5 font-semibold text-xs rounded-full",
                            user.isSuspended
                              ? "bg-red-100 text-red-700 hover:bg-red-100"
                              : "bg-green-100 text-green-700 hover:bg-green-100"
                          )}
                        >
                          {user.isSuspended ? "Suspended" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 flex-wrap">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/users/${user.id}`)}
                                  className="hover:bg-blue-50 hover:text-[#1E3A8A]"
                                >
                                  View
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View user profile</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                                  className="hover:bg-purple-50 hover:text-purple-600"
                                >
                                  Edit
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit user details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => navigate(`/admin/users/${user.id}/suspend`)}
                                  className={cn(
                                    "h-9 w-9",
                                    user.isSuspended
                                      ? "text-green-600 border-green-200 hover:bg-green-50"
                                      : "text-orange-600 border-orange-200 hover:bg-orange-50"
                                  )}
                                >
                                  {user.isSuspended ? (
                                    <UserCheck className="w-4 h-4" />
                                  ) : (
                                    <UserX className="w-4 h-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {user.isSuspended ? "Unsuspend user" : "Suspend user"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => navigate(`/admin/users/${user.id}/delete`)}
                                  className="text-red-600 border-red-200 hover:bg-red-50 h-9 w-9"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete user</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages} · {totalCount} users
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
