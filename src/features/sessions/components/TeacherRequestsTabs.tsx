import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

import type { SessionRequest } from "../types/session.types";
import TeacherRequestCard from "./TeacherRequestsCard";

interface Props {
  requests: SessionRequest[];
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
  onMessageStudent?: (id: number) => void;
}

export default function TeacherRequestsTabs({ requests, onAccept, onDecline, onMessageStudent }: Props) {
  const pending = requests.filter((r) => r.status === "pending");
  const accepted = requests.filter((r) => r.status === "accepted");
  const declined = requests.filter((r) => r.status === "declined");

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Pending</span>
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">{pending.length}</Badge>
          </div>
          <div className="text-3xl" style={{ color: "#FACC15" }}>
            {pending.length}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Accepted</span>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{accepted.length}</Badge>
          </div>
          <div className="text-3xl" style={{ color: "#22C55E" }}>
            {accepted.length}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total</span>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{requests.length}</Badge>
          </div>
          <div className="text-3xl" style={{ color: "#3B82F6" }}>
            {requests.length}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({accepted.length})</TabsTrigger>
          <TabsTrigger value="declined">Declined ({declined.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pending.length ? (
            pending.map((req) => (
              <TeacherRequestCard key={req.id} request={req} onAccept={onAccept} onDecline={onDecline} />
            ))
          ) : (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-2">No pending requests</div>
              <p className="text-gray-500">New requests will appear here</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {accepted.length ? (
            accepted.map((req) => (
              <TeacherRequestCard
                key={req.id}
                request={req}
                onAccept={onAccept}
                onDecline={onDecline}
                onMessageStudent={onMessageStudent}
              />
            ))
          ) : (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-2">No accepted requests</div>
              <p className="text-gray-500">Accepted requests will appear here</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="declined" className="space-y-4">
          {declined.length ? (
            declined.map((req) => (
              <TeacherRequestCard key={req.id} request={req} onAccept={onAccept} onDecline={onDecline} />
            ))
          ) : (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-2">No declined requests</div>
              <p className="text-gray-500">Declined requests will appear here</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
