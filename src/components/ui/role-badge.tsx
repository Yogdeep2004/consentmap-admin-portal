import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, User } from "lucide-react";
import { UserRole } from "@/lib/types";

interface RoleBadgeProps {
  role: UserRole;
  showTooltip?: boolean;
}

export function RoleBadge({ role, showTooltip = true }: RoleBadgeProps) {
  const isAdmin = role === "admin";

  const badge = (
    <Badge
      variant="outline"
      className={
        isAdmin
          ? "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20"
          : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
      }
    >
      {isAdmin ? (
        <Shield className="h-3 w-3 mr-1" />
      ) : (
        <User className="h-3 w-3 mr-1" />
      )}
      {isAdmin ? "Admin" : "User"}
    </Badge>
  );

  if (!showTooltip) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">
          {isAdmin
            ? "Full access: Add, Edit, Upload, Delete"
            : "Limited access: Add, Upload only"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
