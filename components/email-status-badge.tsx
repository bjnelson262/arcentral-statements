import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, AlertTriangle, Truck, Clock } from "lucide-react"

interface EmailStatusBadgeProps {
  status: "delivered" | "bounced" | "forwarded" | "incomplete" | "sent" | "processing" | "manual mailing required"
  lastSent?: string | null
  deliveredAt?: string | null
  bouncedAt?: string | null
  failedAt?: string | null
  bounceReason?: string
  failureReason?: string
  statementType?: "email" | "mail"
}

export function EmailStatusBadge({
  status,
  lastSent,
  deliveredAt,
  bouncedAt,
  failedAt,
  bounceReason,
  failureReason,
  statementType = "email",
}: EmailStatusBadgeProps) {
  const getStatusConfig = () => {
    // For physical mail: forwarded, manual mailing required, or processing
    if (statementType === "mail") {
      switch (status) {
        case "forwarded":
        case "delivered":
          return {
            className: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
            icon: Truck,
            label: "Forwarded",
            iconColor: "text-green-600",
          }
        case "manual mailing required":
          return {
            className: "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200",
            icon: AlertTriangle,
            label: "Manual Mailing Required",
            iconColor: "text-orange-600",
          }
        case "processing":
        default:
          return {
            className: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
            icon: Clock,
            label: "Processing",
            iconColor: "text-blue-600",
          }
      }
    }

    // For email: sent or processing
    switch (status) {
      case "sent":
      case "delivered":
      case "forwarded":
        return {
          className: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
          icon: CheckCircle,
          label: "Sent",
          iconColor: "text-green-600",
        }
      case "processing":
      default:
        return {
          className: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
          icon: Clock,
          label: "Processing",
          iconColor: "text-blue-600",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleString()
  }

  const getTooltipContent = () => {
    const lines = []

    if (lastSent) {
      lines.push(`${statementType === "email" ? "Sent" : "Mailed"}: ${formatDate(lastSent)}`)
    }

    if (deliveredAt) {
      const label = statementType === "email" ? "Delivered" : "Forwarded"
      lines.push(`${label}: ${formatDate(deliveredAt)}`)
    }

    if (bouncedAt) {
      const label = statementType === "email" ? "Bounced" : "Returned"
      lines.push(`${label}: ${formatDate(bouncedAt)}`)
      if (bounceReason) {
        lines.push(`Reason: ${bounceReason}`)
      }
    }

    if (failedAt) {
      const label = statementType === "email" ? "Failed" : "Incomplete"
      lines.push(`${label}: ${formatDate(failedAt)}`)
      if (failureReason) {
        lines.push(`Reason: ${failureReason}`)
      }
    }

    return lines.join("\n")
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`flex items-center gap-1 cursor-help border ${config.className}`}>
            <Icon className={`h-3 w-3 ${config.iconColor}`} />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="bg-purple-900 text-white border-purple-700">
          <div className="whitespace-pre-line text-sm">{getTooltipContent() || "No status information available"}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
