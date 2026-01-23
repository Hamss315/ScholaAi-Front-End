import { Button } from "../../../components/ui/button";

export type UserRole = "student" | "teacher" | "admin";

interface RoleSelectorProps {
  role: UserRole;
  setRole: React.Dispatch<React.SetStateAction<UserRole>>;
  label: string;
  allowedRoles: UserRole[];
}

export default function RoleSelector({
  role,
  setRole,
  label,
  allowedRoles,
}: RoleSelectorProps) {
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
