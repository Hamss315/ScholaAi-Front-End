import { AlertCircle } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useState, useEffect } from "react";
import { getAllUsers } from "../../../utils/userDataService";
import type { UserProfile } from "../../../utils/userDataService";

import AdminHeader from "../components/AdminHeader";
import AdminStats from "../components/AdminStats";
import UsersTable from "../components/UsersTable";
import SessionsTable from "../components/SessionsTable";
import PaymentsTable from "../components/PaymentsTable";
import AddUserDialog from "../components/AddUserDialog";

export default function AdminPanel() {
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Load users from localStorage
  const loadUsers = () => {
    const loadedUsers = getAllUsers();
    setUsers(loadedUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#1E3A8A' }}>Admin Dashboard</h1>
          <p className="text-gray-600">Platform management and monitoring</p>
        </div>

        {/* Stats Cards */}
        <AdminStats totalUsersCount={users.length} />

        {/* System Alerts */}
        <Card className="p-4 mb-8 border-yellow-200 bg-yellow-50 shadow-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 text-yellow-500 flex-shrink-0" />
          <div>
            <div className="font-semibold" style={{ color: '#1E3A8A' }}>System Health: All systems operational</div>
            <p className="text-sm text-gray-600 mt-1">
              Last check: 2 minutes ago · Server load: 45% · Active connections: 148
            </p>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white border p-1 rounded-lg">
            <TabsTrigger value="users" className="px-4 py-2 font-medium">Users</TabsTrigger>
            <TabsTrigger value="sessions" className="px-4 py-2 font-medium">Sessions</TabsTrigger>
            <TabsTrigger value="payments" className="px-4 py-2 font-medium">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersTable 
              users={users} 
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onAddUserClick={() => setShowAddUserDialog(true)}
            />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionsTable />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsTable />
          </TabsContent>
        </Tabs>

        {/* Add User Dialog */}
        <AddUserDialog 
          open={showAddUserDialog} 
          onOpenChange={setShowAddUserDialog} 
          onUserCreated={loadUsers}
        />
      </div>
    </div>
  );
}
