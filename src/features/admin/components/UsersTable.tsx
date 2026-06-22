import { Search, UserPlus, UserX, UserCheck, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import type { UserProfile } from "../../../utils/userDataService";
import { cn } from "../../../utils/utils";

interface UsersTableProps {
  users: UserProfile[];
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onAddUserClick: () => void;
}

export default function UsersTable({
  users,
  searchQuery,
  onSearchQueryChange,
  onAddUserClick,
}: UsersTableProps) {
  const navigate = useNavigate();

  const filteredUsers = users.filter((user) => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>User Management</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search users..." 
              className="pl-9 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
            />
          </div>
          <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-medium" onClick={onAddUserClick}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Joined</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.email} className="hover:bg-gray-50/80 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3 font-medium">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#3B82F6] text-white text-xs font-semibold">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {user.fullName}
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{user.email}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "border-none px-2.5 py-0.5 font-semibold text-xs rounded-full",
                    user.role === "teacher" ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : 
                    user.role === "student" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : 
                    "bg-gray-100 text-gray-700 hover:bg-gray-100"
                  )}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={cn(
                    "border-none px-2.5 py-0.5 font-semibold text-xs rounded-full",
                    user.status === "Suspended" ? "bg-red-100 text-red-700 hover:bg-red-100" : "bg-green-100 text-green-700 hover:bg-green-100"
                  )}>
                    {user.status || "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-500">{user.joinedDate || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/admin/users/${user.email}`)}
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
                            onClick={() => navigate(`/admin/users/${user.email}/edit`)}
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
                          {user.status === "Suspended" ? (
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => navigate(`/admin/users/${user.email}/suspend`)}
                              className="text-green-600 border-green-200 hover:bg-green-50 h-9 w-9"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => navigate(`/admin/users/${user.email}/suspend`)}
                              className="text-orange-600 border-orange-200 hover:bg-orange-50 h-9 w-9"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {user.status === "Suspended" ? "Unsuspend user" : "Suspend user"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => navigate(`/admin/users/${user.email}/delete`)}
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
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
