"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const notificationVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-green-500/50 text-green-700 bg-green-50 [&>svg]:text-green-600",
        warning: "border-yellow-500/50 text-yellow-700 bg-yellow-50 [&>svg]:text-yellow-600",
        info: "border-blue-500/50 text-blue-700 bg-blue-50 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  onClose?: () => void
  title?: string
  description?: string
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ className, variant, onClose, title, description, children, ...props }, ref) => {
    const Icon = {
      default: Info,
      destructive: AlertCircle,
      success: CheckCircle,
      warning: AlertTriangle,
      info: Info,
    }[variant || "default"]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(notificationVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-4 w-4" />
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
        <div className="space-y-1">
          {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
          {description && <div className="text-sm [&_p]:leading-relaxed">{description}</div>}
          {children}
        </div>
      </div>
    )
  }
)
Notification.displayName = "Notification"

export { Notification, notificationVariants }