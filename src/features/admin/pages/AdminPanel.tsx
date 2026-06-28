import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { getDashboardStats, type DashboardStats } from "../../../services/api/admin";

import AdminHeader from "../components/AdminHeader";
import AdminStats from "../components/AdminStats";
import UsersTable from "../components/UsersTable";
import SessionsTable from "../components/SessionsTable";
import PaymentsTable from "../components/PaymentsTable";
import AddUserDialog from "../components/AddUserDialog";
import RatingsTable from "../components/RatingsTable";
import SubjectsTable from "../components/SubjectsTable";
import LogsTable from "../components/LogsTable";

export default function AdminPanel() {
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [usersRefreshKey, setUsersRefreshKey] = useState(0);

  const loadDashboard = useCallback(async () => {
    try {
      setStatsLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      // Non-fatal: stats just show zeros
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#1E3A8A" }}>
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Platform management and monitoring</p>
        </div>

        {/* Stats Cards */}
        <AdminStats stats={stats} loading={statsLoading} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-white border p-1 rounded-lg flex-wrap h-auto gap-1">
            <TabsTrigger value="users" className="px-4 py-2 font-medium">
              Users
            </TabsTrigger>
            <TabsTrigger value="sessions" className="px-4 py-2 font-medium">
              Sessions
            </TabsTrigger>
            <TabsTrigger value="payments" className="px-4 py-2 font-medium">
              Payments
            </TabsTrigger>
            <TabsTrigger value="ratings" className="px-4 py-2 font-medium">
              Ratings
            </TabsTrigger>
            <TabsTrigger value="subjects" className="px-4 py-2 font-medium">
              Subjects
            </TabsTrigger>
            <TabsTrigger value="logs" className="px-4 py-2 font-medium">
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersTable
              onAddUserClick={() => setShowAddUserDialog(true)}
              refreshKey={usersRefreshKey}
            />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionsTable />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsTable />
          </TabsContent>

          <TabsContent value="ratings">
            <RatingsTable />
          </TabsContent>

          <TabsContent value="subjects">
            <SubjectsTable />
          </TabsContent>

          <TabsContent value="logs">
            <LogsTable />
          </TabsContent>
        </Tabs>

        {/* Add User Dialog */}
        <AddUserDialog
          open={showAddUserDialog}
          onOpenChange={setShowAddUserDialog}
          onUserCreated={() => {
            setUsersRefreshKey((k) => k + 1);
            loadDashboard();
          }}
        />
      </div>
    </div>
  );
}
