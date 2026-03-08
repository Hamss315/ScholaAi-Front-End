import type { Dispatch, SetStateAction } from "react";
import { Button } from "../../../components/ui/button";

interface RoleSelectorProps<T extends string> {
  role: T;
  setRole: Dispatch<SetStateAction<T>>;
  label: string;
  allowedRoles: T[];
}

export default function RoleSelector<T extends string>({
  role,
  setRole,
  label,
  allowedRoles,
}: RoleSelectorProps<T>) {
  return (
    <div>
      <p className="text-sm font-medium mb-1">{label}</p>

      <div
        className={`grid gap-2 ${
          allowedRoles.length === 2 ? "grid-cols-2" : "grid-cols-3"
        }`}
      >
        {allowedRoles.map((r) => (
          <Button
            key={r}
            type="button"
            variant={role === r ? "default" : "outline"}
            className={role === r ? "bg-[#1E3A8A]" : ""}
            onClick={() => setRole(r)}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
}
