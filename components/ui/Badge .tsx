// components/ui/Badge.tsx
import { cn } from "@/utils/utils";
import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info";
  size?: "sm" | "md" | "lg";
  rounded?: "full" | "md" | "none";
}

const badgeVariants = {
  default:
    "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
  secondary:
    "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200",
  destructive:
    "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200",
  outline:
    "border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50",
  success:
    "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
  warning:
    "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200",
  info: "bg-cyan-100 text-cyan-800 border border-cyan-200 hover:bg-cyan-200",
};

const badgeSizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

const badgeRounded = {
  full: "rounded-full",
  md: "rounded-md",
  none: "rounded-none",
};

export const Badge = React.forwardRef<
  HTMLDivElement,
  BadgeProps
>(
  (
    {
      className,
      variant = "default",
      size = "md",
      rounded = "full",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
          badgeVariants[variant],
          badgeSizes[size],
          badgeRounded[rounded],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

// Icon Badge variant
export interface IconBadgeProps extends BadgeProps {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const IconBadge = React.forwardRef<
  HTMLDivElement,
  IconBadgeProps
>(
  (
    {
      children,
      icon,
      iconPosition = "left",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Badge
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5",
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="flex items-center">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {icon && iconPosition === "right" && (
          <span className="flex items-center">
            {icon}
          </span>
        )}
      </Badge>
    );
  }
);

IconBadge.displayName = "IconBadge";

// Dot Badge variant
export interface DotBadgeProps extends Omit<
  BadgeProps,
  "children"
> {
  color?:
    | "green"
    | "red"
    | "yellow"
    | "blue"
    | "gray";
  pulse?: boolean;
}

export const DotBadge = React.forwardRef<
  HTMLDivElement,
  DotBadgeProps
>(
  (
    {
      color = "green",
      pulse = false,
      className,
      ...props
    },
    ref
  ) => {
    const dotColors = {
      green: "bg-green-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      blue: "bg-blue-500",
      gray: "bg-gray-500",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            dotColors[color],
            pulse && "animate-pulse"
          )}
        />
      </div>
    );
  }
);

DotBadge.displayName = "DotBadge";

// Status Badge with text and dot
export interface StatusBadgeProps extends BadgeProps {
  status:
    | "active"
    | "inactive"
    | "pending"
    | "success"
    | "error"
    | "warning";
  showDot?: boolean;
}

export const StatusBadge = React.forwardRef<
  HTMLDivElement,
  StatusBadgeProps
>(
  (
    {
      status,
      showDot = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const statusConfig = {
      active: {
        variant: "success" as const,
        text: "Active",
        color: "green",
      },
      inactive: {
        variant: "secondary" as const,
        text: "Inactive",
        color: "gray",
      },
      pending: {
        variant: "warning" as const,
        text: "Pending",
        color: "yellow",
      },
      success: {
        variant: "success" as const,
        text: "Success",
        color: "green",
      },
      error: {
        variant: "destructive" as const,
        text: "Error",
        color: "red",
      },
      warning: {
        variant: "warning" as const,
        text: "Warning",
        color: "yellow",
      },
    };

    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        className={cn(
          "inline-flex items-center gap-1.5",
          className
        )}
        {...props}
      >
        {showDot && (
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              `bg-${config.color}-500`
            )}
          />
        )}
        {children || config.text}
      </Badge>
    );
  }
);

StatusBadge.displayName = "StatusBadge";
