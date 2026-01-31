interface PermissionBadgeProps {
  permission: string;
  granted?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export default function PermissionBadge({
  permission,
  granted = false,
  onClick,
  size = "md",
}: PermissionBadgeProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-0.5 text-xs";
      case "lg":
        return "px-4 py-2 text-base";
      default:
        return "px-3 py-1.5 text-sm";
    }
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-lg font-medium transition-all ${getSizeClasses()} ${granted ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90" : "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:bg-gray-300"} ${onClick ? "cursor-pointer" : ""}`}
    >
      {permissionHelpers.getPermissionLabel(
        permission
      )}
    </span>
  );
}
