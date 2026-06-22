import { Search } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../utils/utils";

export default function SessionsTable() {
  const navigate = useNavigate();

  const sessions = [
    { id: 1, student: "John Smith", teacher: "Dr. Sarah Johnson", subject: "Mathematics", duration: "1h", status: "Completed", date: "Oct 28, 2025" },
    { id: 2, student: "Emily Parker", teacher: "Prof. Michael Chen", subject: "Physics", duration: "1.5h", status: "Live", date: "Oct 29, 2025" },
    { id: 3, student: "Lisa Anderson", teacher: "Dr. Sarah Johnson", subject: "Chemistry", duration: "1h", status: "Scheduled", date: "Oct 30, 2025" },
  ];

  return (
    <Card className="p-6 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1E3A8A' }}>Session Monitoring</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search sessions..." className="pl-9 w-64" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Student</TableHead>
              <TableHead className="font-bold">Teacher</TableHead>
              <TableHead className="font-bold">Subject</TableHead>
              <TableHead className="font-bold">Duration</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.student}</TableCell>
                <TableCell className="text-gray-600">{session.teacher}</TableCell>
                <TableCell>{session.subject}</TableCell>
                <TableCell>{session.duration}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "border-none px-2.5 py-0.5 font-semibold text-xs rounded-full",
                    session.status === "Live" ? "bg-green-100 text-green-700 hover:bg-green-100" :
                    session.status === "Completed" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" :
                    "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                  )}>
                    {session.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-500">{session.date}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (session.status === "Live") {
                        navigate("/live-session");
                      } else {
                        navigate("/session-analysis");
                      }
                    }}
                    className="hover:bg-blue-50 font-medium"
                  >
                    {session.status === "Live" ? "Monitor" : "View Details"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
