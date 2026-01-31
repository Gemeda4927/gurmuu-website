// /app/superadmin/permissions/page.tsx
"use client";

import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useGetAllUsers } from "@/lib/hooks/useSuperadmin";
import { useAuthStore } from "@/lib/store/auth.store";
import {
  ShieldCheck,
  Shield,
  ShieldAlert,
  ShieldOff,
  ShieldPlus,
  ShieldMinus,
  RefreshCw,
  ListChecks,
  Users,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  User,
  Eye,
  Zap,
  Crown,
  UserCog,
  Users as UsersIcon,
  BarChart3,
  Settings,
  FileText,
  Bell,
  FileBarChart,
  Download,
  Upload,
  Send,
  Mail,
  Wrench,
  Activity,
  AlertTriangle,
  Check,
  X,
  ArrowUpDown,
  Grid,
  List,
  Loader2,
  PieChart,
  ShieldX,
  BadgeCheck,
  Info,
  Key,
  Sparkles,
  Target,
  Layers,
  GitBranch,
  Database,
  Cpu,
  Network,
  Radio,
  Globe,
  Clock,
  TrendingUp,
  Calendar,
  Zap as Lightning,
  Target as TargetIcon,
  Gauge,
  Award,
  Star,
  Rocket,
  Sparkle,
  Palette,
  MousePointerClick,
  PlayCircle,
  PauseCircle,
  Maximize2,
  Minimize2,
  Copy,
  ExternalLink,
  Link2,
  Unlink,
  CheckSquare,
  Square,
  ToggleLeft,
  ToggleRight,
  Sliders,
  ToggleLeft as ToggleIcon,
  MousePointer,
  Fingerprint,
  Scan,
  QrCode,
  KeyRound,
  LockKeyhole,
  UnlockKeyhole,
  Hash,
  Asterisk,
  AtSign,
  Percent,
  Infinity as InfinityIcon,
} from "lucide-react";
import { Role } from "@/lib/types/persimmon.types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/Tabs";
import {
  useGetAllPermissions,
  useGetUserPermissions,
  useGrantPermission,
  useRevokePermission,
  useResetUserPermissions,
  useChangeUserRole,
  usePromoteToAdmin,
  useDemoteToUser,
} from "@/lib/hooks/useSuperadmin";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Progress,
} from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Types
interface Permission {
  code: string;
  name: string;
  description?: string;
  category: string;
  level?: "low" | "medium" | "high" | "critical";
}

interface PermissionCategory {
  [key: string]: {
    name: string;
    description?: string;
    icon?: string;
    permissions: string[];
    color?: string;
    gradient?: string;
    level?: "low" | "medium" | "high" | "critical";
  };
}

interface UserData {
  _id: string;
  name?: string;
  email: string;
  role: Role;
  isActive: boolean;
  permissions?: string[];
  lastLogin?: string;
  avatar?: string;
}

interface ActionDetails {
  type: "grant" | "revoke" | "bulk_grant" | "bulk_revoke" | "reset" | "role_change" | "promote" | "demote";
  permission?: string;
  permissions?: string[];
  oldRole?: Role;
  newRole?: Role;
  userName?: string;
  userEmail?: string;
}

// Helper functions
const getCategories = (
  data: any
): PermissionCategory => {
  return data?.categories || {};
};

const getTotalPermissions = (
  data: any
): number => {
  return data?.metadata?.totalPermissions || 0;
};

const getAllPermissionsList = (
  data: any
): string[] => {
  return data?.allPermissions || [];
};

const getPermissionMapping = (
  data: any
): Record<string, string> => {
  return data?.permissions || {};
};

const getRolePermissions = (
  data: any
): Record<string, string[]> => {
  return data?.rolePermissions || {};
};

const getCategoryIcon = (
  categoryKey: string,
  size: "sm" | "md" | "lg" = "md"
): React.ReactNode => {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  const icons: Record<string, React.ReactNode> = {
    user_management: (
      <UsersIcon
        className={`${sizeClass} text-blue-500`}
      />
    ),
    content_management: (
      <FileText
        className={`${sizeClass} text-green-500`}
      />
    ),
    settings: (
      <Settings
        className={`${sizeClass} text-purple-500`}
      />
    ),
    roles_permissions: (
      <Shield
        className={`${sizeClass} text-amber-500`}
      />
    ),
    analytics: (
      <BarChart3
        className={`${sizeClass} text-indigo-500`}
      />
    ),
    notifications: (
      <Bell
        className={`${sizeClass} text-pink-500`}
      />
    ),
    system: (
      <Wrench
        className={`${sizeClass} text-gray-500`}
      />
    ),
    audit: (
      <FileBarChart
        className={`${sizeClass} text-slate-500`}
      />
    ),
    export: (
      <Download
        className={`${sizeClass} text-teal-500`}
      />
    ),
    dashboard: (
      <Globe
        className={`${sizeClass} text-cyan-500`}
      />
    ),
    security: (
      <Lock
        className={`${sizeClass} text-red-500`}
      />
    ),
    reports: (
      <TrendingUp
        className={`${sizeClass} text-orange-500`}
      />
    ),
    api: (
      <Cpu
        className={`${sizeClass} text-violet-500`}
      />
    ),
    billing: (
      <CreditCard
        className={`${sizeClass} text-rose-500`}
      />
    ),
  };
  return (
    icons[categoryKey] || (
      <Shield
        className={`${sizeClass} text-primary`}
      />
    )
  );
};

const getPermissionIcon = (
  permission: string
): React.ReactNode => {
  const iconProps = "w-4 h-4";

  const iconMap: Record<string, React.ReactNode> = {
    view: <Eye className={`${iconProps} text-blue-500`} />,
    read: <Eye className={`${iconProps} text-blue-400`} />,
    manage: <Settings className={`${iconProps} text-purple-500`} />,
    create: <Plus className={`${iconProps} text-green-500`} />,
    edit: <Settings className={`${iconProps} text-amber-500`} />,
    update: <Settings className={`${iconProps} text-yellow-500`} />,
    delete: <Trash2 className={`${iconProps} text-red-500`} />,
    publish: <Send className={`${iconProps} text-indigo-500`} />,
    export: <Download className={`${iconProps} text-emerald-500`} />,
    import: <Upload className={`${iconProps} text-cyan-500`} />,
    send: <Mail className={`${iconProps} text-pink-500`} />,
    admin: <Shield className={`${iconProps} text-amber-500`} />,
    superadmin: <Crown className={`${iconProps} text-yellow-500`} />,
    execute: <PlayCircle className={`${iconProps} text-green-600`} />,
    configure: <Sliders className={`${iconProps} text-purple-600`} />,
    approve: <CheckCircle className={`${iconProps} text-green-600`} />,
    reject: <XCircle className={`${iconProps} text-red-600`} />,
    audit: <FileBarChart className={`${iconProps} text-slate-600`} />,
    monitor: <Activity className={`${iconProps} text-teal-600`} />,
    backup: <Database className={`${iconProps} text-blue-600`} />,
    restore: <RefreshCw className={`${iconProps} text-amber-600`} />,
    debug: <Bug className={`${iconProps} text-red-600`} />,
  };

  // Find matching icon
  for (const [key, icon] of Object.entries(iconMap)) {
    if (permission.toLowerCase().includes(key)) {
      return icon;
    }
  }

  return (
    <Shield
      className={`${iconProps} text-gray-500`}
    />
  );
};

const getRoleIcon = (
  role: Role
): React.ReactNode => {
  switch (role) {
    case "superadmin":
      return (
        <Crown className="w-4 h-4 text-yellow-500" />
      );
    case "admin":
      return (
        <Shield className="w-4 h-4 text-purple-500" />
      );
    default:
      return (
        <User className="w-4 h-4 text-blue-500" />
      );
  }
};

const getRoleColor = (role: Role): string => {
  switch (role) {
    case "superadmin":
      return "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20";
    case "admin":
      return "bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-purple-500/20";
    default:
      return "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20";
  }
};

const getRoleBadgeColor = (
  role: Role
): string => {
  switch (role) {
    case "superadmin":
      return "bg-gradient-to-r from-yellow-500 to-amber-600";
    case "admin":
      return "bg-gradient-to-r from-purple-500 to-violet-600";
    default:
      return "bg-gradient-to-r from-blue-500 to-cyan-600";
  }
};

// Custom components for better UX
const PermissionCard = ({
  permission,
  isGranted,
  isRolePermission,
  isSelected,
  onToggle,
  onGrant,
  onRevoke,
  isLoading,
  description,
}: {
  permission: string;
  isGranted: boolean;
  isRolePermission: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onGrant: () => void;
  onRevoke: () => void;
  isLoading: boolean;
  description: string;
}) => (
  <div
    className={cn(
      "group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
      "hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
      isGranted
        ? isRolePermission
          ? "bg-gradient-to-br from-blue-50/80 to-blue-100/30 border-blue-300/50 hover:border-blue-400"
          : "bg-gradient-to-br from-green-50/80 to-emerald-100/30 border-green-300/50 hover:border-green-400"
        : "bg-gradient-to-br from-gray-50/80 to-slate-100/30 border-gray-300/50 hover:border-gray-400",
      isSelected &&
        "ring-3 ring-primary ring-offset-2 border-primary shadow-xl"
    )}
    onClick={onToggle}
  >
    {/* Selection Indicator */}
    <div className="absolute top-3 right-3">
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 transition-all duration-200",
          isSelected
            ? "bg-primary border-primary"
            : "border-gray-300 group-hover:border-gray-400"
        )}
      >
        {isSelected && (
          <Check className="w-3 h-3 text-white absolute inset-0 m-auto" />
        )}
      </div>
    </div>

    {/* Permission Icon */}
    <div className="mb-3 flex items-center gap-3">
      <div
        className={cn(
          "p-2 rounded-lg transition-all duration-300 group-hover:scale-110",
          isGranted
            ? isRolePermission
              ? "bg-blue-100"
              : "bg-green-100"
            : "bg-gray-100"
        )}
      >
        {getPermissionIcon(permission)}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-gray-800 group-hover:text-gray-900">
          {permission}
        </h4>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {description}
        </p>
      </div>
    </div>

    {/* Status Badge */}
    <div className="mb-3">
      <Badge
        variant={
          isGranted
            ? isRolePermission
              ? "secondary"
              : "success"
            : "outline"
        }
        className={cn(
          "gap-1.5 text-xs font-medium px-2.5 py-1",
          isGranted
            ? isRolePermission
              ? "bg-blue-100 text-blue-700 border-blue-300"
              : "bg-green-100 text-green-700 border-green-300"
            : "bg-gray-100 text-gray-600 border-gray-300"
        )}
      >
        {isGranted ? (
          <>
            {isRolePermission ? (
              <>
                <Shield className="w-3 h-3" />
                From Role
              </>
            ) : (
              <>
                <Check className="w-3 h-3" />
                Granted
              </>
            )}
          </>
        ) : (
          <>
            <X className="w-3 h-3" />
            Missing
          </>
        )}
      </Badge>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-2">
      {isGranted ? (
        <Button
          size="sm"
          variant={isRolePermission ? "outline" : "destructive"}
          onClick={(e) => {
            e.stopPropagation();
            onRevoke();
          }}
          disabled={isLoading}
          className={cn(
            "flex-1 gap-1.5 text-xs font-medium transition-all duration-200",
            isRolePermission
              ? "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400"
              : "hover:scale-105"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : isRolePermission ? (
            <>
              <ShieldOff className="w-3 h-3" />
              Override
            </>
          ) : (
            <>
              <ShieldMinus className="w-3 h-3" />
              Revoke
            </>
          )}
        </Button>
      ) : (
        <Button
          size="sm"
          variant="default"
          onClick={(e) => {
            e.stopPropagation();
            onGrant();
          }}
          disabled={isLoading}
          className="flex-1 gap-1.5 text-xs font-medium hover:scale-105 transition-all duration-200"
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <>
              <ShieldPlus className="w-3 h-3" />
              Grant
            </>
          )}
        </Button>
      )}

      {/* Quick Info Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <Info className="w-3.5 h-3.5 text-gray-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">{permission}</p>
              <p className="text-xs text-gray-500">{description}</p>
              {isRolePermission && (
                <p className="text-xs text-blue-600 font-medium">
                  ⚠️ This is a role-based permission
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
);

const CategoryCard = ({
  categoryKey,
  categoryData,
  permissions,
  hasCount,
  totalCount,
  isExpanded,
  onToggle,
  onSelectAll,
  allSelected,
  children,
}: {
  categoryKey: string;
  categoryData: any;
  permissions: string[];
  hasCount: number;
  totalCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectAll: () => void;
  allSelected: boolean;
  children: React.ReactNode;
}) => {
  const percentage = totalCount > 0 ? Math.round((hasCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Category Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 hover:bg-gray-50/50 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                {getCategoryIcon(categoryKey)}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {categoryData?.name || categoryKey}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {categoryData?.description || "No description available"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {percentage}%
                </div>
                <div className="text-xs text-gray-500">
                  {hasCount}/{totalCount}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-24">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Expand/Collapse Icon */}
            <div className={cn(
              "p-2 rounded-lg transition-all duration-300 group-hover:bg-gray-100",
              isExpanded ? "rotate-180" : ""
            )}>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </button>

      {/* Category Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Quick Actions Bar */}
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAll();
                  }}
                  className="gap-1.5 text-xs hover:bg-white"
                >
                  {allSelected ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      Select All
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Select only missing
                  }}
                  className="gap-1.5 text-xs hover:bg-white text-amber-600"
                >
                  <TargetIcon className="w-3.5 h-3.5" />
                  Select Missing
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MousePointer className="w-3.5 h-3.5" />
                Click permission cards to select for bulk actions
              </div>
            </div>
          </div>

          {/* Permissions Grid */}
          <div className="p-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Action Confirmation Dialog Component
const ActionConfirmationDialog = ({
  open,
  onOpenChange,
  actionDetails,
  onConfirm,
  isLoading = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionDetails: ActionDetails | null;
  onConfirm: () => void;
  isLoading?: boolean;
}) => {
  if (!actionDetails) return null;

  const getDialogContent = () => {
    switch (actionDetails.type) {
      case "grant":
        return {
          title: "Grant Permission",
          description: `Are you sure you want to grant the permission "${actionDetails.permission}" to ${actionDetails.userName || actionDetails.userEmail}?`,
          icon: <ShieldPlus className="w-6 h-6 text-green-600" />,
          confirmText: "Grant Permission",
          confirmVariant: "default" as const,
          showChanges: true,
        };
      case "revoke":
        return {
          title: "Revoke Permission",
          description: `Are you sure you want to revoke the permission "${actionDetails.permission}" from ${actionDetails.userName || actionDetails.userEmail}?`,
          icon: <ShieldMinus className="w-6 h-6 text-red-600" />,
          confirmText: "Revoke Permission",
          confirmVariant: "destructive" as const,
          showChanges: true,
        };
      case "bulk_grant":
        return {
          title: "Bulk Grant Permissions",
          description: `Are you sure you want to grant ${actionDetails.permissions?.length} permissions to ${actionDetails.userName || actionDetails.userEmail}?`,
          icon: <ShieldPlus className="w-6 h-6 text-green-600" />,
          confirmText: "Grant All",
          confirmVariant: "default" as const,
          showChanges: true,
        };
      case "bulk_revoke":
        return {
          title: "Bulk Revoke Permissions",
          description: `Are you sure you want to revoke ${actionDetails.permissions?.length} permissions from ${actionDetails.userName || actionDetails.userEmail}?`,
          icon: <ShieldMinus className="w-6 h-6 text-red-600" />,
          confirmText: "Revoke All",
          confirmVariant: "destructive" as const,
          showChanges: true,
        };
      case "reset":
        return {
          title: "Reset Permissions",
          description: `This will remove all direct permissions from ${actionDetails.userName || actionDetails.userEmail} and revert to role-based permissions only. This action cannot be undone.`,
          icon: <Trash2 className="w-6 h-6 text-red-600" />,
          confirmText: "Reset Permissions",
          confirmVariant: "destructive" as const,
          showChanges: false,
        };
      case "role_change":
        return {
          title: "Change User Role",
          description: `Are you sure you want to change ${actionDetails.userName || actionDetails.userEmail}'s role from ${actionDetails.oldRole} to ${actionDetails.newRole}?`,
          icon: <Shield className="w-6 h-6 text-blue-600" />,
          confirmText: "Change Role",
          confirmVariant: "default" as const,
          showChanges: true,
        };
      case "promote":
        return {
          title: "Promote to Admin",
          description: `Are you sure you want to promote ${actionDetails.userName || actionDetails.userEmail} to Administrator?`,
          icon: <ArrowUpDown className="w-6 h-6 text-green-600" />,
          confirmText: "Promote",
          confirmVariant: "default" as const,
          showChanges: true,
        };
      case "demote":
        return {
          title: "Demote to User",
          description: `Are you sure you want to demote ${actionDetails.userName || actionDetails.userEmail} to Regular User?`,
          icon: <ArrowUpDown className="w-6 h-6 text-red-600" />,
          confirmText: "Demote",
          confirmVariant: "destructive" as const,
          showChanges: true,
        };
      default:
        return {
          title: "Confirm Action",
          description: "Are you sure you want to proceed?",
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          confirmText: "Confirm",
          confirmVariant: "default" as const,
          showChanges: false,
        };
    }
  };

  const content = getDialogContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {content.icon}
            <DialogTitle>{content.title}</DialogTitle>
          </div>
          <DialogDescription>
            {content.description}
          </DialogDescription>
        </DialogHeader>
        
        {content.showChanges && actionDetails.permissions && actionDetails.permissions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Changes to be made:</h4>
            <ScrollArea className="h-32 rounded-md border p-3">
              {actionDetails.permissions.map((perm, index) => (
                <div key={index} className="flex items-center justify-between py-1 text-sm">
                  <span className="truncate">{perm}</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {actionDetails.type.includes("grant") ? "Grant" : "Revoke"}
                  </Badge>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}

        {content.showChanges && actionDetails.type === "role_change" && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Role Change Summary:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getRoleIcon(actionDetails.oldRole as Role)}
                  <span className="font-medium">Current Role</span>
                </div>
                <Badge className={cn("capitalize", getRoleBadgeColor(actionDetails.oldRole as Role))}>
                  {actionDetails.oldRole}
                </Badge>
              </div>
              <div className="space-y-2 p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getRoleIcon(actionDetails.newRole as Role)}
                  <span className="font-medium">New Role</span>
                </div>
                <Badge className={cn("capitalize", getRoleBadgeColor(actionDetails.newRole as Role))}>
                  {actionDetails.newRole}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={content.confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : null}
            {content.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Custom toast function with detailed changes
const showActionToast = (
  actionDetails: ActionDetails,
  isSuccess: boolean = true,
  errorMessage?: string
) => {
  const getToastContent = () => {
    const userName = actionDetails.userName || actionDetails.userEmail || "the user";
    
    if (!isSuccess) {
      return {
        title: "Action Failed",
        description: errorMessage || "Failed to complete the action",
        icon: <XCircle className="w-5 h-5 text-red-500" />,
        color: "border-l-red-500 bg-gradient-to-r from-red-50/95 to-background",
      };
    }

    switch (actionDetails.type) {
      case "grant":
        return {
          title: "Permission Granted",
          description: `"${actionDetails.permission}" has been granted to ${userName}`,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          color: "border-l-green-500 bg-gradient-to-r from-green-50/95 to-background",
        };
      case "revoke":
        return {
          title: "Permission Revoked",
          description: `"${actionDetails.permission}" has been revoked from ${userName}`,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          color: "border-l-green-500 bg-gradient-to-r from-green-50/95 to-background",
        };
      case "bulk_grant":
        return {
          title: "Permissions Granted",
          description: `${actionDetails.permissions?.length} permissions have been granted to ${userName}`,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          color: "border-l-green-500 bg-gradient-to-r from-green-50/95 to-background",
        };
      case "bulk_revoke":
        return {
          title: "Permissions Revoked",
          description: `${actionDetails.permissions?.length} permissions have been revoked from ${userName}`,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          color: "border-l-green-500 bg-gradient-to-r from-green-50/95 to-background",
        };
      case "reset":
        return {
          title: "Permissions Reset",
          description: `All direct permissions have been reset for ${userName}`,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          color: "border-l-green-500 bg-gradient-to-r from-green-50/95 to-background",
        };
      case "role_change":
        return {
          title: "Role Updated",
          description: `${userName}'s role has been changed from ${actionDetails.oldRole} to ${actionDetails.newRole}`,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          color: "border-l-green-500 bg-gradient-to-r from-green-50/95 to-background",
        };
      case "promote":
        return {
          title: "User Promoted",
          description: `${userName} has been promoted to Administrator`,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          color: "border-l-green-500 bg-gradient-to-r from-green-50/95 to-background",
        };
      case "demote":
        return {
          title: "User Demoted",
          description: `${userName} has been demoted to Regular User`,
          icon: <CheckCircle className="w-5 h-5 text-amber-500" />,
          color: "border-l-amber-500 bg-gradient-to-r from-amber-50/95 to-background",
        };
      default:
        return {
          title: "Action Completed",
          description: "The action has been completed successfully",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          color: "border-l-green-500 bg-gradient-to-r from-green-50/95 to-background",
        };
    }
  };

  const content = getToastContent();

  toast.custom(
    (t) => (
      <div
        className={`border-l-4 ${content.color} rounded-lg p-4 shadow-lg border w-[380px] animate-in slide-in-from-right-10 duration-300`}
      >
        <div className="flex items-start gap-3">
          {content.icon}
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-foreground">
              {content.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {content.description}
            </p>
            
            {/* Show permission list for bulk actions */}
            {actionDetails.permissions && actionDetails.permissions.length > 0 && 
             (actionDetails.type === "bulk_grant" || actionDetails.type === "bulk_revoke") && (
              <div className="mt-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Affected permissions ({actionDetails.permissions.length}):
                </p>
                <div className="max-h-24 overflow-y-auto">
                  {actionDetails.permissions.slice(0, 5).map((perm, index) => (
                    <div key={index} className="text-xs text-muted-foreground py-0.5 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
                      <span className="truncate">{perm}</span>
                    </div>
                  ))}
                  {actionDetails.permissions.length > 5 && (
                    <p className="text-xs text-muted-foreground italic">
                      ... and {actionDetails.permissions.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => toast.dismiss(t)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    ),
    {
      duration: 5000,
    }
  );
};

// Missing Lucide icon components
const CreditCard = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const Bug = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M6.34 17.66l-1.41 1.41" />
    <path d="M19.07 4.93l-1.41 1.41" />
  </svg>
);

export default function PermissionsPage() {
  const {
    user: currentUser,
    isSuperadmin: isCurrentUserSuperadmin,
  } = useAuthStore();
  const [selectedUserId, setSelectedUserId] =
    useState<string>("");
  const [searchQuery, setSearchQuery] =
    useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");
  const [activeTab, setActiveTab] =
    useState("overview");
  const [
    expandedCategories,
    setExpandedCategories,
  ] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<
    "grid" | "list"
  >("grid");
  const [showOnlyMissing, setShowOnlyMissing] =
    useState(false);
  const [bulkSelect, setBulkSelect] = useState<
    string[]
  >([]);
  const [permissionSearch, setPermissionSearch] =
    useState("");
  const [isRefreshing, setIsRefreshing] =
    useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Confirmation dialog state
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<ActionDetails | null>(null);

  // Queries
  const allUsersQuery = useGetAllUsers();
  const allPermissionsQuery =
    useGetAllPermissions();
  const userPermissionsQuery =
    useGetUserPermissions(selectedUserId, {
      enabled: !!selectedUserId,
    });

  // Mutations
  const grantPermissionMutation =
    useGrantPermission();
  const revokePermissionMutation =
    useRevokePermission();
  const resetPermissionsMutation =
    useResetUserPermissions();
  const changeUserRoleMutation =
    useChangeUserRole();
  const promoteToAdminMutation =
    usePromoteToAdmin();
  const demoteToUserMutation = useDemoteToUser();

  // Set default selected user to current user
  useEffect(() => {
    if (
      currentUser?._id &&
      !selectedUserId &&
      allUsersQuery.data?.users
    ) {
      setSelectedUserId(currentUser._id);
    }
  }, [
    currentUser?._id,
    selectedUserId,
    allUsersQuery.data,
  ]);

  // Show bulk actions when permissions are selected
  useEffect(() => {
    setShowBulkActions(bulkSelect.length > 0);
  }, [bulkSelect.length]);

  // Derived data
  const categories = useMemo(
    () =>
      allPermissionsQuery.data
        ? getCategories(allPermissionsQuery.data)
        : {},
    [allPermissionsQuery.data]
  );

  const totalPermissions = useMemo(
    () =>
      allPermissionsQuery.data
        ? getTotalPermissions(
            allPermissionsQuery.data
          )
        : 0,
    [allPermissionsQuery.data]
  );

  const allPermissionsList = useMemo(
    () =>
      allPermissionsQuery.data
        ? getAllPermissionsList(
            allPermissionsQuery.data
          )
        : [],
    [allPermissionsQuery.data]
  );

  const permissionMapping = useMemo(
    () =>
      allPermissionsQuery.data
        ? getPermissionMapping(
            allPermissionsQuery.data
          )
        : {},
    [allPermissionsQuery.data]
  );

  const rolePermissions = useMemo(() => {
    if (allPermissionsQuery.data) {
      return getRolePermissions(
        allPermissionsQuery.data
      );
    }
    return {} as Record<string, string[]>;
  }, [allPermissionsQuery.data]);

  // Selected user
  const selectedUser = useMemo(
    () =>
      allUsersQuery.data?.users?.find(
        (u: UserData) => u._id === selectedUserId
      ) || currentUser,
    [
      allUsersQuery.data,
      selectedUserId,
      currentUser,
    ]
  );

  // User permissions
  const userPermissions = useMemo(
    () =>
      userPermissionsQuery.data?.permissions ||
      selectedUser?.permissions ||
      [],
    [
      userPermissionsQuery.data,
      selectedUser?.permissions,
    ]
  );

  const userDirectPermissions = useMemo(
    () => userPermissions || [],
    [userPermissions]
  );

  // Check if user has permission
  const userHasPermission = useCallback(
    (permissionCode: string): boolean => {
      if (!selectedUser?.role) return false;
      
      // Check in userPermissions
      if (userPermissions.includes(permissionCode)) {
        return true;
      }

      // Check if permission is in user's role permissions
      const rolePerms =
        rolePermissions[selectedUser.role] || [];
      return rolePerms.includes(permissionCode);
    },
    [
      userPermissions,
      selectedUser?.role,
      rolePermissions,
    ]
  );

  // Filter and categorize permissions
  const categorizedPermissions = useMemo(() => {
    const result: Record<
      string,
      { permissions: string[]; hasCount: number }
    > = {};

    Object.entries(categories).forEach(
      ([categoryKey, categoryData]) => {
        const permissions =
          categoryData.permissions || [];
        const filteredPermissions =
          permissions.filter((permission) => {
            // Filter by search
            const matchesSearch =
              permission
                .toLowerCase()
                .includes(
                  searchQuery.toLowerCase()
                ) ||
              permissionMapping[permission]
                ?.toLowerCase()
                .includes(
                  searchQuery.toLowerCase()
                ) ||
              permission
                .toLowerCase()
                .includes(
                  permissionSearch.toLowerCase()
                );

            // Filter by missing only if enabled
            const hasPerm =
              userHasPermission(permission);
            const matchesMissing =
              !showOnlyMissing || !hasPerm;

            // Filter by category
            const matchesCategory =
              selectedCategory === "all" ||
              categoryKey === selectedCategory;

            return (
              matchesSearch &&
              matchesMissing &&
              matchesCategory
            );
          });

        if (filteredPermissions.length > 0) {
          const hasCount =
            filteredPermissions.filter((p) =>
              userHasPermission(p)
            ).length;
          result[categoryKey] = {
            permissions: filteredPermissions,
            hasCount,
          };
        }
      }
    );

    return result;
  }, [
    categories,
    searchQuery,
    permissionSearch,
    selectedCategory,
    showOnlyMissing,
    userHasPermission,
    permissionMapping,
  ]);

  // Calculate stats
  const totalGrantedPermissions = useMemo(() => {
    if (!selectedUser?.role) return 0;
    
    const rolePerms = rolePermissions[selectedUser.role] || [];
    const directPerms = userDirectPermissions;
    
    // Combine role and direct permissions (remove duplicates)
    const allPerms = [...new Set([...rolePerms, ...directPerms])];
    return allPerms.length;
  }, [selectedUser?.role, rolePermissions, userDirectPermissions]);

  const totalDirectPermissions = useMemo(() => {
    return userDirectPermissions.length;
  }, [userDirectPermissions]);

  const coveragePercentage = useMemo(() => {
    return totalPermissions > 0
      ? Math.round(
          (totalGrantedPermissions /
            totalPermissions) *
            100
        )
      : 0;
  }, [totalGrantedPermissions, totalPermissions]);

  // Bulk selection
  const toggleBulkSelect = (
    permission: string
  ) => {
    setBulkSelect((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const selectAllInCategory = (
    categoryKey: string,
    permissions: string[]
  ) => {
    const allSelected = permissions.every((p) =>
      bulkSelect.includes(p)
    );
    if (allSelected) {
      setBulkSelect((prev) =>
        prev.filter(
          (p) => !permissions.includes(p)
        )
      );
    } else {
      setBulkSelect((prev) => [
        ...new Set([...prev, ...permissions]),
      ]);
    }
  };

  const selectAllPermissions = () => {
    if (bulkSelect.length === allPermissionsList.length) {
      setBulkSelect([]);
    } else {
      setBulkSelect([...allPermissionsList]);
    }
  };

  const selectMissingPermissions = () => {
    const missing = allPermissionsList.filter(p => !userHasPermission(p));
    setBulkSelect(missing);
    
    // Show toast for selection
    toast.custom(
      (t) => (
        <div className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/95 to-background rounded-lg p-4 shadow-lg border w-[380px] animate-in slide-in-from-right-10 duration-300">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                Missing Permissions Selected
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {missing.length} missing permissions selected for bulk grant
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ),
      {
        duration: 3000,
      }
    );
  };

  // Refresh all data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        allUsersQuery.refetch(),
        allPermissionsQuery.refetch(),
        selectedUserId && userPermissionsQuery.refetch(),
      ]);
      
      showActionToast({
        type: "grant", // Using grant type for generic success
        userName: "System",
        userEmail: "system",
      }, true);
    } catch (error) {
      showActionToast({
        type: "revoke", // Using revoke type for generic error
        userName: "System",
        userEmail: "system",
      }, false, "Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Show confirmation dialog
  const showConfirmation = (actionDetails: ActionDetails) => {
    setPendingAction(actionDetails);
    setConfirmationOpen(true);
  };

  // Handle confirmed action
  const handleConfirmedAction = async () => {
    if (!pendingAction || !selectedUserId || !selectedUser) {
      setConfirmationOpen(false);
      return;
    }

    try {
      switch (pendingAction.type) {
        case "grant":
          await handleGrantPermission(pendingAction.permission!);
          break;
        case "revoke":
          await handleRevokePermission(pendingAction.permission!);
          break;
        case "bulk_grant":
          await handleBulkAction("grant");
          break;
        case "bulk_revoke":
          await handleBulkAction("revoke");
          break;
        case "reset":
          await handleResetPermissions();
          break;
        case "role_change":
          await handleChangeRole(pendingAction.newRole!);
          break;
        case "promote":
          await handlePromoteToAdmin();
          break;
        case "demote":
          await handleDemoteToUser();
          break;
      }
    } catch (error) {
      showActionToast(pendingAction, false, error instanceof Error ? error.message : "Action failed");
    } finally {
      setConfirmationOpen(false);
      setPendingAction(null);
    }
  };

  // Permission actions
  const handleGrantPermission = async (
    permissionCode: string
  ) => {
    if (!selectedUserId || !selectedUser) {
      showActionToast({
        type: "grant",
        permission: permissionCode,
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, false, "Please select a user first");
      return;
    }

    // Check if user already has this permission
    if (userHasPermission(permissionCode)) {
      showActionToast({
        type: "grant",
        permission: permissionCode,
        userName: selectedUser.name,
        userEmail: selectedUser.email,
      }, false, "Permission already granted");
      return;
    }

    try {
      await grantPermissionMutation.mutateAsync({
        userId: selectedUserId,
        data: {
          permission: permissionCode,
          reason: "Granted via admin panel",
        },
      });

      showActionToast({
        type: "grant",
        permission: permissionCode,
        userName: selectedUser.name,
        userEmail: selectedUser.email,
      }, true);

      // Refresh data
      userPermissionsQuery.refetch();
      if (
        selectedUser?._id === currentUser?._id
      ) {
        useAuthStore.getState().refreshUser();
      }

      // Remove from bulk select if it was selected
      setBulkSelect(prev => prev.filter(p => p !== permissionCode));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to grant permission";

      showActionToast({
        type: "grant",
        permission: permissionCode,
        userName: selectedUser.name,
        userEmail: selectedUser.email,
      }, false, errorMessage);
    }
  };

  const handleRevokePermission = async (
    permissionCode: string
  ) => {
    if (!selectedUserId || !selectedUser) {
      showActionToast({
        type: "revoke",
        permission: permissionCode,
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, false, "Please select a user first");
      return;
    }

    // Check if this is a role permission that needs to be overridden
    const isRolePermission =
      selectedUser?.role &&
      rolePermissions[selectedUser.role]?.includes(
        permissionCode
      );

    try {
      await revokePermissionMutation.mutateAsync({
        userId: selectedUserId,
        data: {
          permission: permissionCode,
          reason: "Revoked via admin panel",
        },
      });

      showActionToast({
        type: "revoke",
        permission: permissionCode,
        userName: selectedUser.name,
        userEmail: selectedUser.email,
      }, true);

      userPermissionsQuery.refetch();
      if (
        selectedUser?._id === currentUser?._id
      ) {
        useAuthStore.getState().refreshUser();
      }

      // Remove from bulk select if it was selected
      setBulkSelect(prev => prev.filter(p => p !== permissionCode));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to revoke permission";
      showActionToast({
        type: "revoke",
        permission: permissionCode,
        userName: selectedUser.name,
        userEmail: selectedUser.email,
      }, false, errorMessage);
    }
  };

const handleBulkAction = async (
  action: "grant" | "revoke"
) => {
  if (!selectedUserId || bulkSelect.length === 0) return;

  try {
    const results = [];
    
    // Use appropriate mutation based on action
    for (const permission of bulkSelect) {
      try {
        if (action === "grant") {
          // Use grant mutation
          await grantPermissionMutation.mutateAsync({
            userId: selectedUserId,
            data: {
              permission: permission,
              reason: "Bulk granted via admin panel",
            },
          });
        } else {
          // Use revoke mutation
          await revokePermissionMutation.mutateAsync({
            userId: selectedUserId,
            data: {
              permission: permission,
              reason: "Bulk revoked via admin panel",
            },
          });
        }
        results.push({
          permission,
          success: true,
        });
      } catch (error: any) {
        results.push({
          permission,
          success: false,
          error: error.message,
        });
      }
    }

    const successful = results.filter(
      (r) => r.success
    ).length;
    const failed = results.filter(
      (r) => !r.success
    ).length;

    if (failed === 0) {
      showActionToast({
        type: action === "grant" ? "bulk_grant" : "bulk_revoke",
        permissions: bulkSelect,
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, true);
    } else {
      showActionToast({
        type: action === "grant" ? "bulk_grant" : "bulk_revoke",
        permissions: bulkSelect,
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, false, `${successful} permissions ${action === "grant" ? "granted" : "revoked"}, ${failed} failed`);
    }

    setBulkSelect([]);
    userPermissionsQuery.refetch();
    if (
      selectedUser?._id === currentUser?._id
    ) {
      useAuthStore.getState().refreshUser();
    }
  } catch (error: any) {
    showActionToast({
      type: action === "grant" ? "bulk_grant" : "bulk_revoke",
      permissions: bulkSelect,
      userName: selectedUser?.name,
      userEmail: selectedUser?.email,
    }, false, error.message || "Failed to perform bulk action");
  }
};


  const handleResetPermissions = async () => {
    if (!selectedUserId) return;

    try {
      await resetPermissionsMutation.mutateAsync({
        userId: selectedUserId,
        reason: "Reset via admin panel",
      });
      
      showActionToast({
        type: "reset",
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, true);
      
      userPermissionsQuery.refetch();
      setBulkSelect([]);
      if (
        selectedUser?._id === currentUser?._id
      ) {
        useAuthStore.getState().refreshUser();
      }
    } catch (error: any) {
      showActionToast({
        type: "reset",
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, false, error.message || "Failed to reset permissions");
    }
  };

  const handleChangeRole = async (
    newRole: Role
  ) => {
    if (!selectedUserId) return;

    try {
      await changeUserRoleMutation.mutateAsync({
        userId: selectedUserId,
        data: {
          role: newRole as
            | "user"
            | "admin"
            | "superadmin",
          reason: "Role changed via admin panel",
        },
      });
      
      showActionToast({
        type: "role_change",
        oldRole: selectedUser?.role,
        newRole: newRole,
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, true);
      
      allUsersQuery.refetch();
      userPermissionsQuery.refetch();
      setBulkSelect([]);
      if (
        selectedUser?._id === currentUser?._id
      ) {
        useAuthStore.getState().refreshUser();
      }
    } catch (error: any) {
      showActionToast({
        type: "role_change",
        oldRole: selectedUser?.role,
        newRole: newRole,
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, false, error.message || "Failed to change role");
    }
  };

  const handlePromoteToAdmin = async () => {
    if (!selectedUserId) return;

    try {
      await promoteToAdminMutation.mutateAsync({
        userId: selectedUserId,
        reason: "Promoted via admin panel",
      });
      
      showActionToast({
        type: "promote",
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, true);
      
      allUsersQuery.refetch();
      userPermissionsQuery.refetch();
      setBulkSelect([]);
    } catch (error: any) {
      showActionToast({
        type: "promote",
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, false, error.message || "Failed to promote user");
    }
  };

  const handleDemoteToUser = async () => {
    if (!selectedUserId) return;

    try {
      await demoteToUserMutation.mutateAsync({
        userId: selectedUserId,
        reason: "Demoted via admin panel",
      });
      
      showActionToast({
        type: "demote",
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, true);
      
      allUsersQuery.refetch();
      userPermissionsQuery.refetch();
      setBulkSelect([]);
    } catch (error: any) {
      showActionToast({
        type: "demote",
        userName: selectedUser?.name,
        userEmail: selectedUser?.email,
      }, false, error.message || "Failed to demote user");
    }
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Expand all/collapse all
  const toggleAllCategories = (
    expand: boolean
  ) => {
    const newExpanded: Record<string, boolean> =
      {};
    Object.keys(categorizedPermissions).forEach(
      (key) => {
        newExpanded[key] = expand;
      }
    );
    setExpandedCategories(newExpanded);
  };

  // Clear all selections
  const clearAllSelections = () => {
    setBulkSelect([]);
    showActionToast({
      type: "revoke", // Using revoke type for info toast
      userName: selectedUser?.name,
      userEmail: selectedUser?.email,
    }, true, "All permission selections have been cleared");
  };

  // Loading state
  if (
    allUsersQuery.isLoading ||
    allPermissionsQuery.isLoading
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <ShieldCheck className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
            </div>
            <div className="text-center space-y-3">
              <p className="text-xl font-semibold text-gray-900">
                Loading Permissions Dashboard
              </p>
              <p className="text-sm text-gray-500">
                Fetching data from server...
              </p>
              <Progress value={33} className="w-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (
    allUsersQuery.isError ||
    allPermissionsQuery.isError
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md border-red-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-500/10 to-rose-500/10 flex items-center justify-center">
                <ShieldAlert className="w-10 h-10 text-red-600" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Data
            </h3>
            <p className="text-gray-500 mb-6">
              Unable to fetch permissions data.
              Please check your connection and try
              again.
            </p>
            <Button
              onClick={() => {
                allUsersQuery.refetch();
                allPermissionsQuery.refetch();
              }}
              variant="outline"
              className="gap-2 bg-gradient-to-r from-white to-gray-50 hover:shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Loading
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Confirmation Dialog */}
      <ActionConfirmationDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        actionDetails={pendingAction}
        onConfirm={handleConfirmedAction}
        isLoading={
          grantPermissionMutation.isPending ||
          revokePermissionMutation.isPending ||
          resetPermissionsMutation.isPending ||
          changeUserRoleMutation.isPending ||
          promoteToAdminMutation.isPending ||
          demoteToUserMutation.isPending
        }
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-2 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary/5 via-white to-white rounded-2xl border border-gray-200 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-md border-2 border-white">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Permissions Management
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Granular control over user access
                  and system permissions
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-full sm:w-64">
                <Select
                  value={selectedUserId}
                  onValueChange={(value) => {
                    setSelectedUserId(value);
                    setBulkSelect([]);
                  }}
                >
                  <SelectTrigger className="w-full h-12 bg-white border-gray-300 hover:border-gray-400 transition-colors">
                    <div className="flex items-center gap-2">
                      <UserCog className="w-4 h-4 text-gray-500" />
                      <SelectValue placeholder="Select User" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    <ScrollArea className="h-64">
                      {allUsersQuery.data?.users?.map(
                        (user: UserData) => (
                          <SelectItem
                            key={user._id}
                            value={user._id}
                          >
                            <div className="flex items-center justify-between w-full py-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    user.isActive
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  )}
                                />
                                <span className="truncate max-w-[120px]">
                                  {user.name ||
                                    user.email}
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs capitalize",
                                  getRoleColor(
                                    user.role
                                  )
                                )}
                              >
                                {getRoleIcon(
                                  user.role
                                )}
                                {user.role}
                              </Badge>
                            </div>
                          </SelectItem>
                        )
                      )}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2 h-12 hover:shadow-md transition-all"
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Refresh
              </Button>
            </div>
          </div>

          {/* User Info Card */}
          {selectedUser && (
            <Card className="border border-gray-200 shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      {selectedUser.role ===
                        "superadmin" && (
                        <Crown className="absolute -top-1 -right-1 w-6 h-6 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                        {selectedUser.name ||
                          selectedUser.email}
                        {selectedUser._id ===
                          currentUser?._id && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-gradient-to-r from-primary/10 to-primary/5"
                          >
                            You
                          </Badge>
                        )}
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge
                          className={cn(
                            "gap-1 capitalize text-white border-0 shadow-sm",
                            getRoleBadgeColor(
                              selectedUser.role
                            )
                          )}
                        >
                          {getRoleIcon(
                            selectedUser.role
                          )}
                          {selectedUser.role}
                        </Badge>
                        <Badge
                          variant={
                            selectedUser.isActive
                              ? "success"
                              : "destructive"
                          }
                          className="gap-1 shadow-sm"
                        >
                          {selectedUser.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Inactive
                            </>
                          )}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {selectedUser.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedUser.role !==
                      "superadmin" &&
                      selectedUser.role !==
                        "admin" && (
                        <Button
                          onClick={() => showConfirmation({
                            type: "promote",
                            userName: selectedUser.name,
                            userEmail: selectedUser.email,
                          })}
                          variant="outline"
                          size="sm"
                          className="gap-2 hover:shadow-md transition-all"
                          disabled={
                            promoteToAdminMutation.isPending
                          }
                        >
                          {promoteToAdminMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowUpDown className="w-4 h-4" />
                          )}
                          Promote to Admin
                        </Button>
                      )}
                    {selectedUser.role ===
                      "admin" && (
                      <Button
                        onClick={() => showConfirmation({
                          type: "demote",
                          userName: selectedUser.name,
                          userEmail: selectedUser.email,
                        })}
                        variant="outline"
                        size="sm"
                        className="gap-2 hover:shadow-md transition-all"
                        disabled={
                          demoteToUserMutation.isPending
                        }
                      >
                        {demoteToUserMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <ArrowUpDown className="w-4 h-4" />
                        )}
                        Demote to User
                      </Button>
                    )}
                    <Select
                      value={selectedUser.role}
                      onValueChange={(value) => 
                        showConfirmation({
                          type: "role_change",
                          oldRole: selectedUser.role,
                          newRole: value as Role,
                          userName: selectedUser.name,
                          userEmail: selectedUser.email,
                        })
                      }
                      disabled={
                        !isCurrentUserSuperadmin
                      }
                    >
                      <SelectTrigger className="w-44 gap-2">
                        <Shield className="w-4 h-4" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            Regular User
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-purple-500" />
                            Administrator
                          </div>
                        </SelectItem>
                        <SelectItem value="superadmin">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            Super Administrator
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Floating Bulk Actions Bar */}
          {showBulkActions && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-300">
              <div className="bg-white rounded-xl border-2 border-primary shadow-2xl p-4 min-w-[300px]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-gray-900">
                      {bulkSelect.length} selected
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {bulkSelect.filter(p => userHasPermission(p)).length} granted
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {bulkSelect.filter(p => !userHasPermission(p)).length} missing
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => showConfirmation({
                        type: "bulk_grant",
                        permissions: bulkSelect,
                        userName: selectedUser?.name,
                        userEmail: selectedUser?.email,
                      })}
                      disabled={grantPermissionMutation.isPending}
                      className="gap-2 hover:scale-105 transition-transform"
                    >
                      {grantPermissionMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <ShieldPlus className="w-3 h-3" />
                      )}
                      Grant All
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => showConfirmation({
                        type: "bulk_revoke",
                        permissions: bulkSelect,
                        userName: selectedUser?.name,
                        userEmail: selectedUser?.email,
                      })}
                      disabled={revokePermissionMutation.isPending}
                      className="gap-2 hover:scale-105 transition-transform"
                    >
                      {revokePermissionMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <ShieldMinus className="w-3 h-3" />
                      )}
                      Revoke All
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearAllSelections}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full max-w-2xl bg-white border border-gray-200">
              <TabsTrigger
                value="overview"
                className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/70 data-[state=active]:text-white"
              >
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/70 data-[state=active]:text-white"
                disabled={!selectedUserId}
              >
                <Shield className="w-4 h-4" />
                Manage Permissions
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/70 data-[state=active]:text-white"
                disabled={!selectedUserId}
              >
                <Settings className="w-4 h-4" />
                Advanced
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent
              value="overview"
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Permissions Card */}
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total Permissions
                        </p>
                        <p className="text-3xl font-bold mt-2 text-gray-900">
                          {totalPermissions}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <ListChecks className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          System-wide
                        </span>
                        <Badge variant="outline">
                          {
                            Object.keys(categories)
                              .length
                          }{" "}
                          categories
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* User Permissions Card */}
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {selectedUser?._id ===
                          currentUser?._id
                            ? "Your"
                            : "User"}{" "}
                          Permissions
                        </p>
                        <p className="text-3xl font-bold mt-2 text-gray-900">
                          {totalGrantedPermissions}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-sm">
                            <span className="text-green-600 font-medium">
                              {
                                totalDirectPermissions
                              }
                            </span>
                            <span className="text-gray-500">
                              {" "}
                              direct
                            </span>
                          </div>
                          <Separator
                            orientation="vertical"
                            className="h-4"
                          />
                          <div className="text-sm">
                            <span className="text-blue-600 font-medium">
                              {selectedUser?.role && rolePermissions[selectedUser.role]?.length || 0}
                            </span>
                            <span className="text-gray-500">
                              {" "}
                              from role
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <Key className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Role Permissions Card */}
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {selectedUser?.role?.toUpperCase()}{" "}
                          Role Permissions
                        </p>
                        <p className="text-3xl font-bold mt-2 text-gray-900">
                          {selectedUser?.role ? rolePermissions[selectedUser.role]?.length || 0 : 0}
                        </p>
                        <div className="mt-2">
                          <Badge
                            className={cn(
                              "capitalize gap-1 text-white border-0 shadow-sm",
                              getRoleBadgeColor(
                                selectedUser?.role ||
                                  "user"
                              )
                            )}
                          >
                            {getRoleIcon(
                              selectedUser?.role ||
                                "user"
                            )}
                            {selectedUser?.role}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Coverage Card */}
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Permission Coverage
                        </p>
                        <p className="text-3xl font-bold mt-2 text-gray-900">
                          {coveragePercentage}%
                        </p>
                        <div className="mt-4">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
                              style={{
                                width: `${coveragePercentage}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>
                              {
                                totalGrantedPermissions
                              }{" "}
                              granted
                            </span>
                            <span>
                              {totalPermissions}{" "}
                              total
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                        <PieChart className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              {selectedUserId && (
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Zap className="w-5 h-5 text-amber-500" />
                      Quick Actions
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Manage permissions for{" "}
                      {selectedUser?.name ||
                        selectedUser?.email}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="gap-2 justify-start h-11 hover:shadow-md transition-all border-gray-300 hover:border-gray-400"
                          >
                            <ShieldPlus className="w-4 h-4" />
                            Grant Permission
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <ShieldPlus className="w-5 h-5" />
                              Grant New Permission
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Select a permission to
                              grant to{" "}
                              {selectedUser?.name ||
                                selectedUser?.email}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                placeholder="Search permissions..."
                                value={
                                  permissionSearch
                                }
                                onChange={(e) =>
                                  setPermissionSearch(
                                    e.target.value
                                  )
                                }
                                className="pl-10"
                              />
                            </div>
                            <Select
                              onValueChange={(
                                value
                              ) => {
                                showConfirmation({
                                  type: "grant",
                                  permission: value,
                                  userName: selectedUser?.name,
                                  userEmail: selectedUser?.email,
                                });
                                setPermissionSearch(
                                  ""
                                );
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select permission" />
                              </SelectTrigger>
                              <SelectContent>
                                <ScrollArea className="h-64">
                                  {allPermissionsList
                                    .filter(
                                      (perm) => {
                                        if (
                                          permissionSearch
                                        ) {
                                          return (
                                            perm
                                              .toLowerCase()
                                              .includes(
                                                permissionSearch.toLowerCase()
                                              ) ||
                                            permissionMapping[
                                              perm
                                            ]
                                              ?.toLowerCase()
                                              .includes(
                                                permissionSearch.toLowerCase()
                                              )
                                          );
                                        }
                                        return true;
                                      }
                                    )
                                    .filter(
                                      (perm) =>
                                        !userHasPermission(
                                          perm
                                        )
                                    )
                                    .map(
                                      (
                                        permission
                                      ) => (
                                        <SelectItem
                                          key={
                                            permission
                                          }
                                          value={
                                            permission
                                          }
                                          disabled={userHasPermission(
                                            permission
                                          )}
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              {getPermissionIcon(
                                                permission
                                              )}
                                              <span className="truncate max-w-[180px]">
                                                {
                                                  permission
                                                }
                                              </span>
                                            </div>
                                            {userHasPermission(
                                              permission
                                            ) ? (
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                Already
                                                granted
                                              </Badge>
                                            ) : (
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {Object.keys(
                                                  categories
                                                ).find(
                                                  (
                                                    key
                                                  ) =>
                                                    categories[
                                                      key
                                                    ]?.permissions?.includes(
                                                      permission
                                                    )
                                                )}
                                              </Badge>
                                            )}
                                          </div>
                                        </SelectItem>
                                      )
                                    )}
                                  {allPermissionsList.filter(
                                    (perm) =>
                                      !userHasPermission(
                                        perm
                                      )
                                  ).length ===
                                    0 && (
                                    <div className="p-4 text-center text-gray-500">
                                      <ShieldCheck className="w-8 h-8 mx-auto mb-2" />
                                      <p>
                                        User already
                                        has all
                                        permissions
                                      </p>
                                    </div>
                                  )}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() =>
                                setPermissionSearch(
                                  ""
                                )
                              }
                              className="border-gray-300"
                            >
                              Cancel
                            </AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="gap-2 justify-start h-11 hover:shadow-md transition-all border-gray-300 hover:border-gray-400"
                          >
                            <ShieldMinus className="w-4 h-4" />
                            Revoke Permission
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <ShieldMinus className="w-5 h-5" />
                              Revoke Permission
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Select a permission to
                              revoke from{" "}
                              {selectedUser?.name ||
                                selectedUser?.email}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="space-y-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                placeholder="Search permissions..."
                                value={
                                  permissionSearch
                                }
                                onChange={(e) =>
                                  setPermissionSearch(
                                    e.target.value
                                  )
                                }
                                className="pl-10"
                              />
                            </div>
                            <Select
                              onValueChange={(
                                value
                              ) => {
                                showConfirmation({
                                  type: "revoke",
                                  permission: value,
                                  userName: selectedUser?.name,
                                  userEmail: selectedUser?.email,
                                });
                                setPermissionSearch(
                                  ""
                                );
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select permission" />
                              </SelectTrigger>
                              <SelectContent>
                                <ScrollArea className="h-64">
                                  {(
                                    userDirectPermissions as string[]
                                  )
                                    .filter(
                                      (
                                        permission
                                      ) => {
                                        if (
                                          permissionSearch
                                        ) {
                                          return (
                                            permission
                                              .toLowerCase()
                                              .includes(
                                                permissionSearch.toLowerCase()
                                              ) ||
                                            permissionMapping[
                                              permission
                                            ]
                                              ?.toLowerCase()
                                              .includes(
                                                permissionSearch.toLowerCase()
                                              )
                                          );
                                        }
                                        return true;
                                      }
                                    )
                                    .map(
                                      (
                                        permission
                                      ) => (
                                        <SelectItem
                                          key={
                                            permission
                                          }
                                          value={
                                            permission
                                          }
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              {getPermissionIcon(
                                                permission
                                              )}
                                              <span className="truncate max-w-[180px]">
                                                {
                                                  permission
                                                }
                                              </span>
                                            </div>
                                            <Badge
                                              variant="destructive"
                                              className="text-xs"
                                            >
                                              Direct
                                            </Badge>
                                          </div>
                                        </SelectItem>
                                      )
                                    )}
                                  {userDirectPermissions.length ===
                                    0 && (
                                    <div className="p-4 text-center text-gray-500">
                                      <Shield className="w-8 h-8 mx-auto mb-2" />
                                      <p>
                                        No direct
                                        permissions
                                        to revoke
                                      </p>
                                    </div>
                                  )}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() =>
                                setPermissionSearch(
                                  ""
                                )
                              }
                              className="border-gray-300"
                            >
                              Cancel
                            </AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="gap-2 justify-start h-11 hover:shadow-md transition-all border-gray-300 hover:border-gray-400"
                          >
                            <Trash2 className="w-4 h-4" />
                            Reset Permissions
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Reset All Permissions
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove all
                              directly granted
                              permissions and keep
                              only role-based
                              permissions.
                              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Warning: This
                                  action cannot be
                                  undone
                                </p>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-gray-300">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => showConfirmation({
                                type: "reset",
                                userName: selectedUser?.name,
                                userEmail: selectedUser?.email,
                              })}
                              className="bg-red-500 hover:bg-red-600 gap-2"
                              disabled={
                                resetPermissionsMutation.isPending
                              }
                            >
                              {resetPermissionsMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              Reset Permissions
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button
                        variant="outline"
                        className="gap-2 justify-start h-11 hover:shadow-md transition-all border-gray-300 hover:border-gray-400"
                        onClick={() =>
                          setActiveTab(
                            "permissions"
                          )
                        }
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Manage All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Manage Permissions Tab */}
            {selectedUserId && (
              <TabsContent
                value="permissions"
                className="space-y-6"
              >
                {/* Main Controls */}
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                      {/* Search */}
                      <div className="flex-1 w-full">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search permissions by name or description..."
                            value={searchQuery}
                            onChange={(e) =>
                              setSearchQuery(
                                e.target.value
                              )
                            }
                            className="pl-10 h-11 border-gray-300 focus:border-primary"
                          />
                        </div>
                      </div>

                      {/* Filters and View Controls */}
                      <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                        <Select
                          value={selectedCategory}
                          onValueChange={
                            setSelectedCategory
                          }
                        >
                          <SelectTrigger className="w-full lg:w-48 h-11 gap-2 border-gray-300">
                            <Filter className="w-4 h-4" />
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              All Categories
                            </SelectItem>
                            {Object.entries(
                              categories
                            ).map(([key, data]) => (
                              <SelectItem
                                key={key}
                                value={key}
                              >
                                <div className="flex items-center gap-2">
                                  {getCategoryIcon(
                                    key
                                  )}
                                  {data.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              setViewMode(
                                viewMode === "grid"
                                  ? "list"
                                  : "grid"
                              )
                            }
                            className="h-11 w-11 border-gray-300 hover:border-gray-400"
                          >
                            {viewMode === "grid" ? (
                              <List className="w-4 h-4" />
                            ) : (
                              <Grid className="w-4 h-4" />
                            )}
                          </Button>

                          <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md h-11 hover:border-gray-400">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <Switch
                              checked={
                                showOnlyMissing
                              }
                              onCheckedChange={
                                setShowOnlyMissing
                              }
                              className="data-[state=checked]:bg-primary"
                            />
                            <Label className="text-sm text-gray-700">
                              Missing Only
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Selection Bar */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllPermissions}
                        className="gap-1.5 text-xs"
                      >
                        {bulkSelect.length === allPermissionsList.length ? (
                          <>
                            <CheckSquare className="w-3.5 h-3.5" />
                            Deselect All Permissions
                          </>
                        ) : (
                          <>
                            <Square className="w-3.5 h-3.5" />
                            Select All Permissions
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectMissingPermissions}
                        className="gap-1.5 text-xs text-amber-600 hover:text-amber-700"
                      >
                        <TargetIcon className="w-3.5 h-3.5" />
                        Select Missing Permissions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllSelections}
                        className="gap-1.5 text-xs text-gray-600"
                      >
                        <X className="w-3.5 h-3.5" />
                        Clear Selections
                      </Button>
                      {bulkSelect.length > 0 && (
                        <div className="flex items-center gap-2 ml-auto">
                          <Badge variant="secondary">
                            {bulkSelect.length} selected
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Permissions Display */}
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                          <Shield className="w-5 h-5" />
                          Manage Permissions
                          {bulkSelect.length > 0 && (
                            <Badge variant="default" className="ml-2">
                              {bulkSelect.length} selected
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                          {
                            Object.keys(
                              categorizedPermissions
                            ).length
                          }{" "}
                          categories,{" "}
                          {totalGrantedPermissions}{" "}
                          granted permissions •{" "}
                          {coveragePercentage}% coverage
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleAllCategories(
                              true
                            )
                          }
                          className="gap-1 border-gray-300"
                        >
                          <ChevronDown className="w-4 h-4" />
                          Expand All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            toggleAllCategories(
                              false
                            )
                          }
                          className="gap-1 border-gray-300"
                        >
                          <ChevronUp className="w-4 h-4" />
                          Collapse All
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(
                      categorizedPermissions
                    ).length === 0 ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            No permissions found
                          </h3>
                          <p className="text-gray-500 mt-1">
                            Try adjusting your
                            search or filter
                            settings
                          </p>
                        </div>
                      </div>
                    ) : viewMode === "grid" ? (
                      // Grid View
                      <div className="space-y-4">
                        {Object.entries(
                          categorizedPermissions
                        ).map(
                          ([
                            categoryKey,
                            {
                              permissions,
                              hasCount,
                            },
                          ]) => {
                            const categoryData =
                              categories[
                                categoryKey
                              ];
                            const totalCount =
                              permissions.length;
                            const allSelected =
                              permissions.every((p) =>
                                bulkSelect.includes(p)
                              );

                            return (
                              <CategoryCard
                                key={categoryKey}
                                categoryKey={categoryKey}
                                categoryData={categoryData}
                                permissions={permissions}
                                hasCount={hasCount}
                                totalCount={totalCount}
                                isExpanded={expandedCategories[categoryKey]}
                                onToggle={() => toggleCategory(categoryKey)}
                                onSelectAll={() => selectAllInCategory(categoryKey, permissions)}
                                allSelected={allSelected}
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {permissions.map(
                                    (permission) => {
                                      const hasPermission =
                                        userHasPermission(
                                          permission
                                        );
                                      const isSelected =
                                        bulkSelect.includes(
                                          permission
                                        );
                                      const isRolePermission =
                                        selectedUser?.role &&
                                        rolePermissions[
                                          selectedUser
                                            .role
                                        ]?.includes(
                                          permission
                                        );

                                      return (
                                        <PermissionCard
                                          key={permission}
                                          permission={permission}
                                          isGranted={hasPermission}
                                          isRolePermission={isRolePermission}
                                          isSelected={isSelected}
                                          onToggle={() => toggleBulkSelect(permission)}
                                          onGrant={() => showConfirmation({
                                            type: "grant",
                                            permission: permission,
                                            userName: selectedUser?.name,
                                            userEmail: selectedUser?.email,
                                          })}
                                          onRevoke={() => showConfirmation({
                                            type: "revoke",
                                            permission: permission,
                                            userName: selectedUser?.name,
                                            userEmail: selectedUser?.email,
                                          })}
                                          isLoading={
                                            grantPermissionMutation.isPending ||
                                            revokePermissionMutation.isPending
                                          }
                                          description={permissionMapping[permission] || "No description available"}
                                        />
                                      );
                                    }
                                  )}
                                </div>
                              </CategoryCard>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      // List View
                      <div className="space-y-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">
                                <div className="flex items-center">
                                  <Switch
                                    checked={
                                      bulkSelect.length ===
                                      allPermissionsList.length
                                    }
                                    onCheckedChange={selectAllPermissions}
                                    className="scale-75"
                                  />
                                </div>
                              </TableHead>
                              <TableHead>
                                Permission
                              </TableHead>
                              <TableHead>
                                Category
                              </TableHead>
                              <TableHead>
                                Status
                              </TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(
                              categorizedPermissions
                            ).map(
                              ([
                                categoryKey,
                                { permissions },
                              ]) =>
                                permissions.map(
                                  (permission) => {
                                    const hasPermission =
                                      userHasPermission(
                                        permission
                                      );
                                    const isSelected =
                                      bulkSelect.includes(
                                        permission
                                      );
                                    const isRolePermission =
                                      selectedUser?.role &&
                                      rolePermissions[
                                        selectedUser
                                          .role
                                      ]?.includes(
                                        permission
                                      );

                                    return (
                                      <TableRow
                                        key={
                                          permission
                                        }
                                        className={cn(
                                          "hover:bg-gray-50/50 transition-colors",
                                          isSelected &&
                                            "bg-primary/5"
                                        )}
                                      >
                                        <TableCell>
                                          <Switch
                                            checked={
                                              isSelected
                                            }
                                            onCheckedChange={() =>
                                              toggleBulkSelect(
                                                permission
                                              )
                                            }
                                            className="scale-75"
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            {getPermissionIcon(
                                              permission
                                            )}
                                            <div>
                                              <p className="font-medium text-gray-900">
                                                {
                                                  permission
                                                }
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {permissionMapping[
                                                  permission
                                                ] ||
                                                  "No description"}
                                              </p>
                                            </div>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            variant="outline"
                                            className="gap-1"
                                          >
                                            {getCategoryIcon(
                                              categoryKey,
                                              "sm"
                                            )}
                                            {categories[
                                              categoryKey
                                            ]
                                              ?.name ||
                                              categoryKey}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            variant={
                                              hasPermission
                                                ? isRolePermission
                                                  ? "secondary"
                                                  : "success"
                                                : "secondary"
                                            }
                                            className="gap-1"
                                          >
                                            {hasPermission ? (
                                              isRolePermission ? (
                                                <>
                                                  <Shield className="w-3 h-3" />
                                                  Role
                                                  Permission
                                                </>
                                              ) : (
                                                <>
                                                  <CheckCircle className="w-3 h-3" />
                                                  Granted
                                                </>
                                              )
                                            ) : (
                                              <>
                                                <XCircle className="w-3 h-3" />
                                                Missing
                                              </>
                                            )}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {hasPermission ? (
                                            <Button
                                              size="sm"
                                              variant={
                                                isRolePermission
                                                  ? "outline"
                                                  : "destructive"
                                              }
                                              onClick={() => showConfirmation({
                                                type: "revoke",
                                                permission: permission,
                                                userName: selectedUser?.name,
                                                userEmail: selectedUser?.email,
                                              })}
                                              disabled={
                                                revokePermissionMutation.isPending
                                              }
                                              className="gap-1 hover:scale-105 transition-transform"
                                            >
                                              {revokePermissionMutation.isPending ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                              ) : isRolePermission ? (
                                                <>
                                                  <ShieldOff className="w-3 h-3" />
                                                  Override
                                                </>
                                              ) : (
                                                <>
                                                  <ShieldMinus className="w-3 h-3" />
                                                  Revoke
                                                </>
                                              )}
                                            </Button>
                                          ) : (
                                            <Button
                                              size="sm"
                                              variant="default"
                                              onClick={() => showConfirmation({
                                                type: "grant",
                                                permission: permission,
                                                userName: selectedUser?.name,
                                                userEmail: selectedUser?.email,
                                              })}
                                              disabled={
                                                grantPermissionMutation.isPending
                                              }
                                              className="gap-1 hover:scale-105 transition-transform"
                                            >
                                              {grantPermissionMutation.isPending ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                              ) : (
                                                <>
                                                  <ShieldPlus className="w-3 h-3" />
                                                  Grant
                                                </>
                                              )}
                                            </Button>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  }
                                )
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Advanced Tab */}
            {selectedUserId && (
              <TabsContent
                value="advanced"
                className="space-y-6"
              >
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Settings className="w-5 h-5" />
                      Advanced Settings
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Advanced permission management
                      and system tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Role Comparison */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                        <Shield className="w-4 h-4" />
                        Role Permission Comparison
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          "user",
                          "admin",
                          "superadmin",
                        ].map((role) => (
                          <Card
                            key={role}
                            className="border border-gray-200 hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={cn(
                                      "capitalize text-white border-0",
                                      getRoleBadgeColor(
                                        role as Role
                                      )
                                    )}
                                  >
                                    {getRoleIcon(
                                      role as Role
                                    )}
                                    {role}
                                  </Badge>
                                  {selectedUser?.role ===
                                    role && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Current
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                  {rolePermissions[
                                    role
                                  ]?.length ||
                                    0}{" "}
                                  permissions
                                </span>
                              </div>
                              <div className="space-y-1">
                                {rolePermissions[
                                  role
                                ]
                                  ?.slice(0, 3)
                                  .map((perm) => (
                                    <div
                                      key={perm}
                                      className="flex items-center gap-2 text-sm"
                                    >
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      <span className="truncate text-gray-700">
                                        {perm}
                                      </span>
                                    </div>
                                  ))}
                                {rolePermissions[
                                  role
                                ]?.length > 3 && (
                                  <div className="text-sm text-gray-500">
                                    +
                                    {rolePermissions[
                                      role
                                    ]!.length -
                                      3}{" "}
                                    more...
                                  </div>
                                )}
                              </div>
                              {selectedUser?.role !==
                                role && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full mt-3 border-gray-300 hover:border-gray-400"
                                  onClick={() =>
                                    showConfirmation({
                                      type: "role_change",
                                      oldRole: selectedUser?.role,
                                      newRole: role as Role,
                                      userName: selectedUser?.name,
                                      userEmail: selectedUser?.email,
                                    })
                                  }
                                  disabled={
                                    changeUserRoleMutation.isPending
                                  }
                                >
                                  {changeUserRoleMutation.isPending ? (
                                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                  ) : (
                                    "Switch to this role"
                                  )}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Dangerous Zone */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        Dangerous Zone
                      </h3>
                      <div className="space-y-3">
                        <AlertDialog>
                          <AlertDialogTrigger
                            asChild
                          >
                            <Button
                              variant="destructive"
                              className="gap-2 w-full sm:w-auto"
                            >
                              <Trash2 className="w-4 h-4" />
                              Reset All Direct
                              Permissions
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Reset Direct
                                Permissions
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove all
                                permissions directly
                                granted to the user,
                                reverting them to
                                only their
                                role-based
                                permissions.
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                  <p className="text-sm font-medium text-red-700 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Warning: This
                                    action is
                                    irreversible and
                                    may affect user
                                    access
                                    immediately.
                                  </p>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-300">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => showConfirmation({
                                  type: "reset",
                                  userName: selectedUser?.name,
                                  userEmail: selectedUser?.email,
                                })}
                                className="bg-red-500 hover:bg-red-600 gap-2"
                                disabled={
                                  resetPermissionsMutation.isPending
                                }
                              >
                                {resetPermissionsMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                                Reset Permissions
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        {selectedUser?.role ===
                          "admin" && (
                          <AlertDialog>
                            <AlertDialogTrigger
                              asChild
                            >
                              <Button
                                variant="outline"
                                className="gap-2 w-full sm:w-auto border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                              >
                                <ArrowUpDown className="w-4 h-4" />
                                Demote to Regular
                                User
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Demote User
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove
                                  admin privileges
                                  from{" "}
                                  {selectedUser?.name ||
                                    selectedUser?.email}
                                  . They will lose
                                  all admin-only
                                  permissions.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-300">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => showConfirmation({
                                    type: "demote",
                                    userName: selectedUser?.name,
                                    userEmail: selectedUser?.email,
                                  })}
                                  className="bg-red-500 hover:bg-red-600 gap-2"
                                  disabled={
                                    demoteToUserMutation.isPending
                                  }
                                >
                                  {demoteToUserMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <ArrowUpDown className="w-4 h-4" />
                                  )}
                                  Demote User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {selectedUser?.role ===
                          "user" && (
                          <AlertDialog>
                            <AlertDialogTrigger
                              asChild
                            >
                              <Button
                                variant="outline"
                                className="gap-2 w-full sm:w-auto border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400"
                              >
                                <ArrowUpDown className="w-4 h-4" />
                                Promote to Admin
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Promote to Admin
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will grant
                                  admin privileges
                                  to{" "}
                                  {selectedUser?.name ||
                                    selectedUser?.email}
                                  . They will gain
                                  all admin
                                  permissions.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-300">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => showConfirmation({
                                    type: "promote",
                                    userName: selectedUser?.name,
                                    userEmail: selectedUser?.email,
                                  })}
                                  className="bg-green-500 hover:bg-green-600 gap-2"
                                  disabled={
                                    promoteToAdminMutation.isPending
                                  }
                                >
                                  {promoteToAdminMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <ArrowUpDown className="w-4 h-4" />
                                  )}
                                  Promote to Admin
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
}