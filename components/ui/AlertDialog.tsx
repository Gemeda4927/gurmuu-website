// components/ui/AlertDialog.tsx
import { cn } from "@/utils/utils";
import * as React from "react";
import { createPortal } from "react-dom";

// Dialog Context
interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
};

// Main AlertDialog Component
export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      controlledOnOpenChange?.(newOpen);
    },
    [isControlled, controlledOnOpenChange]
  );

  const contextValue = React.useMemo(
    () => ({ open, onOpenChange: handleOpenChange }),
    [open, handleOpenChange]
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
};

// AlertDialogTrigger
export interface AlertDialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

export const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  ({ asChild = false, children, className, onClick, ...props }, ref) => {
    const { onOpenChange } = useDialog();

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        onOpenChange(true);
      },
      [onClick, onOpenChange]
    );

    if (asChild && React.isValidElement(children)) {
      const child = children;
      const childProps: any = {
        ...child.props,
        onClick: (e: React.MouseEvent) => {
          (child.props as any)?.onClick?.(e);
          handleClick(e);
        },
      };

      // Only add ref if it's a valid element type
      if (ref && (typeof child.type === 'string' || (child.type as any)?.$$typeof === Symbol.for('react.forward_ref'))) {
        childProps.ref = ref;
      }

      return React.cloneElement(child, childProps);
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AlertDialogTrigger.displayName = "AlertDialogTrigger";

// AlertDialogPortal
export interface AlertDialogPortalProps {
  children: React.ReactNode;
}

export const AlertDialogPortal: React.FC<AlertDialogPortalProps> = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

// AlertDialogOverlay
export interface AlertDialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const AlertDialogOverlay = React.forwardRef<HTMLDivElement, AlertDialogOverlayProps>(
  ({ className, ...props }, ref) => {
    const { open } = useDialog();

    if (!open) return null;

    return (
      <AlertDialogPortal>
        <div
          ref={ref}
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
          )}
          {...props}
        />
      </AlertDialogPortal>
    );
  }
);

AlertDialogOverlay.displayName = "AlertDialogOverlay";

// AlertDialogContent
export interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = useDialog();

    if (!open) return null;

    return (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            ref={ref}
            className={cn(
              "relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg",
              "border border-gray-200",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      </AlertDialogPortal>
    );
  }
);

AlertDialogContent.displayName = "AlertDialogContent";

// AlertDialogHeader
export interface AlertDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AlertDialogHeader = React.forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...props}
    />
  )
);

AlertDialogHeader.displayName = "AlertDialogHeader";

// AlertDialogTitle
export interface AlertDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);

AlertDialogTitle.displayName = "AlertDialogTitle";

// AlertDialogDescription
export interface AlertDialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  )
);

AlertDialogDescription.displayName = "AlertDialogDescription";

// AlertDialogFooter
export interface AlertDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AlertDialogFooter = React.forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
      {...props}
    />
  )
);

AlertDialogFooter.displayName = "AlertDialogFooter";

// AlertDialogAction
export interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "destructive";
}

export const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, variant = "default", children, onClick, ...props }, ref) => {
    const { onOpenChange } = useDialog();

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        onOpenChange(false);
      },
      [onClick, onOpenChange]
    );

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "destructive"
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-blue-600 text-white hover:bg-blue-700",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AlertDialogAction.displayName = "AlertDialogAction";

// AlertDialogCancel
export interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AlertDialogCancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const { onOpenChange } = useDialog();

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        onOpenChange(false);
      },
      [onClick, onOpenChange]
    );

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
          "border border-gray-300 bg-transparent hover:bg-gray-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
          "disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AlertDialogCancel.displayName = "AlertDialogCancel";

// Simple AlertDialog wrapper
export interface SimpleAlertDialogProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  cancelText?: string;
  actionText?: string;
  onAction?: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SimpleAlertDialog: React.FC<SimpleAlertDialogProps> = ({
  trigger,
  title,
  description,
  cancelText = "Cancel",
  actionText = "Continue",
  onAction,
  onCancel,
  variant = "default",
  open,
  onOpenChange,
}) => {
  const handleAction = React.useCallback(() => {
    onAction?.();
  }, [onAction]);

  const handleCancel = React.useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            variant={variant}
            onClick={handleAction}
            className={variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};