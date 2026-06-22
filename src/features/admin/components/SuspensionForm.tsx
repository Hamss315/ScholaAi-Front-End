// src/features/admin/components/SuspensionForm.tsx
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
import { useId } from "react";

export interface SuspensionFormProps {
  suspensionDuration: string;
  setSuspensionDuration: (value: string) => void;
  reason: string;
  setReason: (value: string) => void;
  notifyUser: boolean;
  setNotifyUser: (value: boolean) => void;
}

export default function SuspensionForm({
  suspensionDuration,
  setSuspensionDuration,
  reason,
  setReason,
  notifyUser,
  setNotifyUser,
}: SuspensionFormProps) {
  const id = useId();
  return (
    <Card className="p-4 border border-gray-200 shadow-sm">
      {/* Suspension length */}
      <div className="mb-4">
        <Label htmlFor={`${id}-duration`}>Duration</Label>
        <Select
          value={suspensionDuration}
          onValueChange={setSuspensionDuration}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
            <SelectItem value="permanent">Permanent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Reason */}
      <div className="mb-4">
        <Label htmlFor={`${id}-reason`}>Reason</Label>
        <Input
          id={`${id}-reason`}
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Enter suspension reason"
        />
      </div>
      {/* Notify user toggle */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${id}-notify`}
          checked={notifyUser}
          onCheckedChange={v => setNotifyUser(!!v)}
        />
        <Label htmlFor={`${id}-notify`}>Send notification email</Label>
      </div>
    </Card>
  );
}
