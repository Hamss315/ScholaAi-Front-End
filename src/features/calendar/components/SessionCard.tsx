interface Props {
  title: string;
  subtitle: string;
  time: string;
  status: string;

  /**
   * Optional action button (existing behavior preserved)
   */
  onAction?: () => void;

  /**
   * NEW: role support (safe addition)
   */
  role?: "student" | "teacher";

  /**
   * Optional extra data (used later for focusScore, join, etc.)
   */
  extraInfo?: string;
}

export default function SessionCard({
  title,
  subtitle,
  time,
  status,
  onAction,
  role = "student",
  extraInfo,
}: Props) {
  return (
    <div className="border p-3 rounded-lg">
      
      {/* Header */}
      <h3>{title}</h3>
      <p>{subtitle}</p>

      {/* Time + status */}
      <div className="flex justify-between mt-2">
        <p>{time}</p>
        <p>{status}</p>
      </div>

      {/* Optional extra info (teacher focus score etc.) */}
      {extraInfo && (
        <p className="text-sm text-gray-500 mt-1">
          {extraInfo}
        </p>
      )}

      {/* ACTION SECTION (role-based, but backward compatible) */}
      <div className="mt-3">
        {onAction && (
          <button onClick={onAction}>
            {role === "student" ? "Join Session" : "Manage Session"}
          </button>
        )}
      </div>
    </div>
  );
}